import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENFREEMAP_LIBERTY_STYLE_URL =
  'https://tiles.openfreemap.org/styles/liberty';
const WATER_LABEL_LAYER_IDS = new Set([
  'water_name_point_label',
  'water_name_line_label',
]);
const DISABLED_LAYER_IDS = new Set([
  'building-3d',
  'road_area_pattern',
  'road_one_way_arrow',
  'road_one_way_arrow_opposite',
  'tunnel_major_rail_hatching',
  'tunnel_transit_rail_hatching',
  'road_major_rail_hatching',
  'road_transit_rail_hatching',
  'bridge_major_rail_hatching',
  'bridge_transit_rail_hatching',
  'poi_r7',
  'poi_r20',
]);

interface MapStyleLayer {
  id?: string;
  maxzoom?: number;
  layout?: Record<string, unknown>;
  [key: string]: unknown;
}

interface MapStyleDocument {
  layers?: MapStyleLayer[];
  [key: string]: unknown;
}

function isNamedWaterExpression(englishName: string) {
  return [
    'any',
    ['==', ['get', 'name'], englishName],
    ['==', ['get', 'name_en'], englishName],
    ['==', ['get', 'name:latin'], englishName],
  ];
}

function localizeWaterLabel(layer: MapStyleLayer): MapStyleLayer {
  if (layer.id === 'building') {
    const buildingLayer = { ...layer };
    Reflect.deleteProperty(buildingLayer, 'maxzoom');
    return buildingLayer;
  }

  if (!layer.id || !WATER_LABEL_LAYER_IDS.has(layer.id) || !layer.layout) {
    return layer;
  }

  const originalTextField = layer.layout['text-field'];
  if (originalTextField === undefined) return layer;

  return {
    ...layer,
    layout: {
      ...layer.layout,
      'text-field': [
        'case',
        isNamedWaterExpression('South China Sea'),
        ['coalesce', ['get', 'name:vi'], 'BIỂN ĐÔNG'],
        isNamedWaterExpression('Gulf of Tonkin'),
        ['coalesce', ['get', 'name:vi'], 'VỊNH BẮC BỘ'],
        originalTextField,
      ],
    },
  };
}

export async function GET() {
  try {
    const response = await fetch(OPENFREEMAP_LIBERTY_STYLE_URL, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86_400 },
    });
    if (!response.ok) {
      throw new Error(`OpenFreeMap responded with HTTP ${response.status}`);
    }

    const style = (await response.json()) as MapStyleDocument;
    return NextResponse.json(
      {
        ...style,
        layers:
          style.layers
            ?.filter((layer) => !layer.id || !DISABLED_LAYER_IDS.has(layer.id))
            .map(localizeWaterLabel) ?? [],
      },
      {
        headers: {
          'Cache-Control':
            'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    );
  } catch (error) {
    console.error('Unable to load the OpenFreeMap Liberty style', error);
    return NextResponse.json(
      { error: 'Không thể tải style bản đồ Liberty.' },
      { status: 502 },
    );
  }
}
