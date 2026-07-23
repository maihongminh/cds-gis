// OpenLayers GIS client for the Lao Bao map workspace.
'use client';

import * as React from 'react';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Graticule from 'ol/layer/Graticule';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control/defaults';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';
import Snap from 'ol/interaction/Snap';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import IconStyle from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import type { FeatureLike } from 'ol/Feature';
import type { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';
import { apply as applyMapboxStyle } from 'ol-mapbox-style';
import {
  Check,
  Download,
  Eraser,
  MapPinPlus,
  MousePointer2,
  Pentagon,
  Pencil,
  Route,
  Trash2,
} from 'lucide-react';

import { Button, Input } from '@/components/ui';
import { MOCK_LAOBAO_COMMUNE_BOUNDARY } from '@/data/mock-laobao-commune-boundary';
import { MOCK_VILLAGE_BOUNDARIES } from '@/data/mock-laobao-boundary';
import { MOCK_DISASTER_RISK_ZONES } from '@/data/mock-map-disaster-risks';
import { INITIAL_MAP_LAYERS } from '@/data/mock-map-layers';
import { MOCK_PUBLIC_FACILITIES } from '@/data/mock-map-public-facilities';
import { MOCK_TOURISM_POIS } from '@/data/mock-map-tourism-pois';
import { MOCK_CURRENT_STATE, MOCK_PLANNED_STATE } from '@/data/mock-map-scenarios';
import { BASE_LAYERS, LAOBAO_CENTER } from '@/lib/map-config';
import {
  buildIconPinMarkerSvg,
  FACILITY_COLORS,
  TOURISM_POI_COLORS,
  type MapMarkerIconName,
} from '@/lib/map-style-config';
import { cn } from '@/lib/utils';
import type { PublicFacilityType, TourismPoiType } from '@/types/map';

export interface MapState {
  activeLayerIds: string[];
  toggleLayer: (id: string) => void;
  enableAllInGroup: (groupId: string) => void;
  disableAllInGroup: (groupId: string) => void;
  resetToDefaults: () => void;
  selectedVillageCode: string | null;
  setSelectedVillageCode: (code: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  flyToCoords: [number, number, number?] | null;
  setFlyToCoords: (c: [number, number, number?] | null) => void;
  activeBaseLayerId: string;
  setActiveBaseLayerId: (id: string) => void;
  currentRole: string | null;
}

type EditorMode = 'view' | 'point' | 'line' | 'polygon' | 'modify';

const geoJsonFormat = new GeoJSON();

function readGeoJsonFeatures(data: object) {
  return geoJsonFormat.readFeatures(data, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });
}

function createPointFeature(
  id: string,
  coordinates: [number, number],
  properties: Record<string, unknown>,
) {
  const feature = new Feature({
    geometry: new Point(fromLonLat(coordinates)),
    ...properties,
  });
  feature.setId(id);
  return feature;
}

const markerImageCache = new globalThis.Map<string, IconStyle>();
const markerStyleCache = new globalThis.Map<string, Style>();

function markerImage(color: string, icon: MapMarkerIconName, size = 30) {
  const cacheKey = `${color}:${icon}:${size}`;
  const cachedImage = markerImageCache.get(cacheKey);
  if (cachedImage) return cachedImage;

  const svg = buildIconPinMarkerSvg(color, icon, size);
  const image = new IconStyle({
    src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
  });
  markerImageCache.set(cacheKey, image);
  return image;
}

function markerStyle(color: string, icon: MapMarkerIconName, size = 30) {
  const cacheKey = `${color}:${icon}:${size}`;
  const cachedStyle = markerStyleCache.get(cacheKey);
  if (cachedStyle) return cachedStyle;

  const style = new Style({ image: markerImage(color, icon, size) });
  markerStyleCache.set(cacheKey, style);
  return style;
}

const tourismMarkerIcons: Record<TourismPoiType, MapMarkerIconName> = {
  tourist_attraction: 'attraction',
  historical_site: 'landmark',
  scenic_spot: 'mountain',
  check_in: 'camera',
  local_product_point: 'market',
};

function tourismMarkerStyle(feature: FeatureLike) {
  const tourismType = feature.get('tourismType') as TourismPoiType;
  return markerStyle(
    TOURISM_POI_COLORS[tourismType] ?? '#8b5cf6',
    tourismMarkerIcons[tourismType] ?? 'attraction',
  );
}

const facilityMarkerIcons: Record<PublicFacilityType, MapMarkerIconName> = {
  health_station: 'medical',
  school: 'school',
  cultural_house: 'landmark',
  administrative_office: 'building',
  market: 'market',
  sports_facility: 'sports',
  water_facility: 'water',
  public_infrastructure: 'infrastructure',
};

function facilityMarkerStyle(feature: FeatureLike) {
  const facilityType = feature.get('facilityType') as PublicFacilityType;
  return markerStyle(
    FACILITY_COLORS[facilityType] ?? '#64748b',
    facilityMarkerIcons[facilityType] ?? 'building',
  );
}

const communeStyle = new Style({
  stroke: new Stroke({ color: '#1d4ed8', width: 3 }),
  fill: new Fill({ color: 'rgba(59, 130, 246, 0.07)' }),
});

const villageStyle = new Style({
  stroke: new Stroke({ color: '#64748b', width: 1.25 }),
  fill: new Fill({ color: 'rgba(148, 163, 184, 0.06)' }),
});

const selectedVillageStyle = new Style({
  stroke: new Stroke({ color: '#0f766e', width: 3 }),
  fill: new Fill({ color: 'rgba(20, 184, 166, 0.22)' }),
});

const villageLabelStyleCache = new WeakMap<FeatureLike, Style>();

function villageLabelStyle(feature: FeatureLike) {
  const cachedStyle = villageLabelStyleCache.get(feature);
  if (cachedStyle) return cachedStyle;

  const geometry = feature.getGeometry();
  const style = new Style({
    geometry: geometry instanceof Polygon ? geometry.getInteriorPoint() : undefined,
    text: new Text({
      text: String(feature.get('villageName') ?? ''),
      font: '600 11px var(--font-be-vietnam-pro), sans-serif',
      fill: new Fill({ color: '#0f172a' }),
      stroke: new Stroke({ color: 'rgba(255,255,255,0.95)', width: 3 }),
    }),
  });
  villageLabelStyleCache.set(feature, style);
  return style;
}

const sovereigntyStyleCache = new globalThis.Map<string, Style>();

function sovereigntyReferenceStyle(feature: FeatureLike) {
  const geometryType = feature.getGeometry()?.getType() ?? 'unknown';
  const cacheKey = `${geometryType}:${String(feature.getId() ?? feature.get('name') ?? 'sovereignty')}`;
  const cachedStyle = sovereigntyStyleCache.get(cacheKey);
  if (cachedStyle) return cachedStyle;

  const style = geometryType === 'Point'
    ? new Style({
        image: markerImage('#dc2626', 'flag', 32),
        text: new Text({
          text: String(feature.get('label') ?? feature.get('name') ?? ''),
          font: '700 12px var(--font-be-vietnam-pro), sans-serif',
          offsetY: -44,
          textAlign: 'center',
          padding: [3, 5, 3, 5],
          fill: new Fill({ color: '#b91c1c' }),
          stroke: new Stroke({ color: 'rgba(255,255,255,0.98)', width: 4 }),
          backgroundFill: new Fill({ color: 'rgba(255,255,255,0.84)' }),
          backgroundStroke: new Stroke({ color: 'rgba(220,38,38,0.5)', width: 1 }),
        }),
      })
    : new Style({
        stroke: new Stroke({ color: '#dc2626', width: 1.5 }),
        fill: new Fill({ color: 'rgba(239,68,68,0.16)' }),
      });
  sovereigntyStyleCache.set(cacheKey, style);
  return style;
}

const administrativePalette = [
  '#bfdbfe',
  '#bbf7d0',
  '#fde68a',
  '#ddd6fe',
  '#fecdd3',
  '#bae6fd',
  '#fed7aa',
] as const;
const administrativeProvinceStyleCache = new globalThis.Map<string, Style>();
const administrativeCommuneStyleCache = new globalThis.Map<string, Style>();

function administrativeProvinceStyle(feature: FeatureLike, resolution: number) {
  const provinceCode = String(feature.get('provinceCode') ?? '0');
  const showLabel = resolution >= 250;
  const cacheKey = `${provinceCode}:${showLabel ? 'label' : 'shape'}`;
  const cachedStyle = administrativeProvinceStyleCache.get(cacheKey);
  if (cachedStyle) return cachedStyle;

  const paletteIndex = Number.parseInt(provinceCode, 10) % administrativePalette.length;
  const style = new Style({
    stroke: new Stroke({ color: '#475569', width: 1.2 }),
    fill: new Fill({ color: `${administrativePalette[paletteIndex]}cc` }),
    text: showLabel
      ? new Text({
          text: String(feature.get('name') ?? ''),
          font: '700 11px var(--font-be-vietnam-pro), sans-serif',
          overflow: false,
          fill: new Fill({ color: '#0f172a' }),
          stroke: new Stroke({ color: 'rgba(255,255,255,0.95)', width: 3 }),
        })
      : undefined,
  });
  administrativeProvinceStyleCache.set(cacheKey, style);
  return style;
}

function administrativeCommuneStyle(feature: FeatureLike, resolution: number) {
  const communeCode = String(feature.get('communeCode') ?? 'unknown');
  const showLabel = resolution <= 180;
  const cacheKey = `${communeCode}:${showLabel ? 'label' : 'shape'}`;
  const cachedStyle = administrativeCommuneStyleCache.get(cacheKey);
  if (cachedStyle) return cachedStyle;

  const style = new Style({
    stroke: new Stroke({ color: 'rgba(71,85,105,0.8)', width: 0.8 }),
    fill: new Fill({ color: 'rgba(255,255,255,0.08)' }),
    text: showLabel
      ? new Text({
          text: String(feature.get('name') ?? ''),
          font: '600 10px var(--font-be-vietnam-pro), sans-serif',
          overflow: false,
          fill: new Fill({ color: '#334155' }),
          stroke: new Stroke({ color: 'rgba(255,255,255,0.95)', width: 3 }),
        })
      : undefined,
  });
  administrativeCommuneStyleCache.set(cacheKey, style);
  return style;
}

const currentStateStyle = new Style({
  stroke: new Stroke({ color: '#0284c7', width: 2 }),
  fill: new Fill({ color: 'rgba(56, 189, 248, 0.25)' }),
});

const plannedStateStyle = new Style({
  stroke: new Stroke({ color: '#7c3aed', width: 2, lineDash: [8, 5] }),
  fill: new Fill({ color: 'rgba(167, 139, 250, 0.24)' }),
});

const editableStyle = new Style({
  stroke: new Stroke({ color: '#ea580c', width: 3, lineDash: [7, 4] }),
  fill: new Fill({ color: 'rgba(249, 115, 22, 0.2)' }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({ color: '#ea580c' }),
    stroke: new Stroke({ color: '#ffffff', width: 2 }),
  }),
});

const selectedEditableStyle = new Style({
  stroke: new Stroke({ color: '#dc2626', width: 4 }),
  fill: new Fill({ color: 'rgba(239, 68, 68, 0.25)' }),
  image: new CircleStyle({
    radius: 9,
    fill: new Fill({ color: '#dc2626' }),
    stroke: new Stroke({ color: '#ffffff', width: 3 }),
  }),
});

const riskStyleCache = new globalThis.Map<string, Style>();

function riskStyle(feature: FeatureLike) {
  const level = feature.get('riskLevel');
  const color =
    level === 'critical'
      ? '#b91c1c'
      : level === 'high'
        ? '#dc2626'
        : level === 'medium'
          ? '#f97316'
          : '#eab308';
  const geometryType = feature.getGeometry()?.getType() ?? 'unknown';
  if (geometryType === 'Point') {
    return markerStyle(color, 'warning', 32);
  }

  const cachedStyle = riskStyleCache.get(color);
  if (cachedStyle) return cachedStyle;

  const style = new Style({
    stroke: new Stroke({ color, width: 2 }),
    fill: new Fill({ color: `${color}38` }),
  });
  riskStyleCache.set(color, style);
  return style;
}

function createDisasterFeatures(kind: 'landslide' | 'flood') {
  return MOCK_DISASTER_RISK_ZONES.filter((zone) =>
    kind === 'landslide'
      ? zone.riskType === 'landslide'
      : ['flooding', 'erosion', 'critical_area'].includes(zone.riskType),
  ).map((zone) => {
    const geometry =
      zone.geometry.type === 'Point'
        ? new Point(fromLonLat(zone.geometry.coordinates as [number, number]))
        : new Polygon(
            (zone.geometry.coordinates as [number, number][][]).map((ring) =>
              ring.map((coordinate) => fromLonLat(coordinate)),
            ),
          );
    const feature = new Feature({
      geometry,
      id: zone.id,
      name: zone.name,
      riskLevel: zone.riskLevel,
      riskType: zone.riskType,
      warningMessage: zone.warningMessage,
    });
    feature.setId(zone.id);
    return feature;
  });
}

function formatCoordinate(value: number) {
  return Number.isFinite(value) ? value.toFixed(6) : '';
}

interface MapClientProps {
  mapState: MapState;
}

export default function MapClient({ mapState }: MapClientProps) {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<OlMap | null>(null);
  const mapStateRef = React.useRef(mapState);
  const baseLayerRef = React.useRef<TileLayer<XYZ> | null>(null);
  const baseOverlayLayerRef = React.useRef<TileLayer<XYZ> | null>(null);
  const styledBaseLayerRef = React.useRef<LayerGroup | null>(null);
  const administrativeBaseLayerRef = React.useRef<LayerGroup | null>(null);
  const styledBaseLayerUrlRef = React.useRef<string | null>(null);
  const loadVisibleAdministrativeCommunesRef = React.useRef<() => void>(() => {});
  const graticuleRef = React.useRef<Graticule | null>(null);
  const tileSourceCacheRef = React.useRef(new globalThis.Map<string, XYZ>());
  const layerRegistryRef = React.useRef(new globalThis.Map<string, VectorLayer>());
  const villageLayerRef = React.useRef<VectorLayer | null>(null);
  const editableSourceRef = React.useRef(new VectorSource());
  const selectInteractionRef = React.useRef<Select | null>(null);
  const activeEditorInteractionsRef = React.useRef<Array<Draw | Modify | Snap>>([]);
  const eventKeysRef = React.useRef<EventsKey[]>([]);

  const [mapReady, setMapReady] = React.useState(false);
  const [editorMode, setEditorMode] = React.useState<EditorMode>('view');
  const [editableFeatureCount, setEditableFeatureCount] = React.useState(0);
  const [selectedFeatureId, setSelectedFeatureId] = React.useState<string | null>(null);
  const [longitude, setLongitude] = React.useState('106.633245');
  const [latitude, setLatitude] = React.useState('16.636031');
  const [coordinateError, setCoordinateError] = React.useState<string | null>(null);
  const [lastClickedCoordinate, setLastClickedCoordinate] = React.useState<[number, number] | null>(null);

  React.useEffect(() => {
    mapStateRef.current = mapState;
  }, [mapState]);

  React.useEffect(() => {
    if (!targetRef.current) return;

    const registry = layerRegistryRef.current;
    const tileSourceCache = tileSourceCacheRef.current;
    const baseLayer = new TileLayer<XYZ>({
      visible: false,
      zIndex: 0,
      preload: 1,
      useInterimTilesOnError: true,
    });
    baseLayerRef.current = baseLayer;
    const baseOverlayLayer = new TileLayer<XYZ>({
      visible: false,
      zIndex: 2,
      preload: 1,
      useInterimTilesOnError: true,
    });
    baseOverlayLayerRef.current = baseOverlayLayer;
    const styledBaseLayer = new LayerGroup({ visible: false, zIndex: 0 });
    styledBaseLayerRef.current = styledBaseLayer;

    const administrativeProvinceSource = new VectorSource({
      url: '/gis-source/vietnam-administrative?level=provinces',
      format: new GeoJSON(),
      attributions: 'Dữ liệu hành chính &copy; gis.vn',
      wrapX: false,
    });
    const administrativeCommuneSource = new VectorSource({ wrapX: false });
    const administrativeProvinceLayer = new VectorLayer({
      source: administrativeProvinceSource,
      background: '#dbeafe',
      declutter: 'administrative-labels',
      renderBuffer: 32,
      style: administrativeProvinceStyle,
      updateWhileAnimating: false,
      updateWhileInteracting: false,
      zIndex: 0,
    });
    const administrativeCommuneLayer = new VectorLayer({
      source: administrativeCommuneSource,
      declutter: 'administrative-labels',
      minZoom: 8,
      renderBuffer: 32,
      style: administrativeCommuneStyle,
      updateWhileAnimating: false,
      updateWhileInteracting: false,
      zIndex: 1,
    });
    const administrativeBaseLayer = new LayerGroup({
      layers: [administrativeProvinceLayer, administrativeCommuneLayer],
      visible: false,
      zIndex: 0,
    });
    administrativeBaseLayerRef.current = administrativeBaseLayer;

    const communeSource = new VectorSource({
      features: readGeoJsonFeatures(MOCK_LAOBAO_COMMUNE_BOUNDARY),
    });
    const villageSource = new VectorSource({
      features: readGeoJsonFeatures(MOCK_VILLAGE_BOUNDARIES),
    });

    const communeLayer = new VectorLayer({
      source: communeSource,
      style: communeStyle,
      zIndex: 10,
    });
    const villageLayer = new VectorLayer({
      source: villageSource,
      zIndex: 20,
      renderBuffer: 64,
      style: (feature) =>
        feature.get('villageCode') === mapStateRef.current.selectedVillageCode
          ? selectedVillageStyle
          : villageStyle,
    });
    villageLayerRef.current = villageLayer;

    const villageLabelLayer = new VectorLayer({
      source: villageSource,
      declutter: true,
      zIndex: 30,
      renderBuffer: 64,
      style: villageLabelStyle,
    });

    const sovereigntyLayer = new VectorLayer({
      source: new VectorSource({
        url: '/gis-source/vietnam-islands',
        format: new GeoJSON(),
        wrapX: false,
      }),
      declutter: true,
      renderBuffer: 96,
      style: sovereigntyReferenceStyle,
      zIndex: 90,
    });

    const tourismLayer = new VectorLayer({
      source: new VectorSource({
        features: MOCK_TOURISM_POIS.map((poi) =>
          createPointFeature(poi.id, poi.coordinates, {
            name: poi.name,
            kind: 'tourism',
            tourismType: poi.type,
            villageName: poi.villageName,
          }),
        ),
      }),
      renderBuffer: 48,
      style: tourismMarkerStyle,
      zIndex: 60,
    });

    const facilityDefinitions = [
      {
        id: 'layer-health',
        matches: (type: string) => type === 'health_station',
      },
      {
        id: 'layer-education',
        matches: (type: string) => type === 'school',
      },
      {
        id: 'layer-cultural',
        matches: (type: string) => type === 'cultural_house',
      },
      {
        id: 'layer-admin-offices',
        matches: (type: string) =>
          [
            'administrative_office',
            'market',
            'sports_facility',
            'water_facility',
            'public_infrastructure',
          ].includes(type),
      },
    ];

    const facilityLayers = facilityDefinitions.map((definition, index) => ({
      id: definition.id,
      layer: new VectorLayer({
        source: new VectorSource({
          features: MOCK_PUBLIC_FACILITIES.filter((facility) =>
            definition.matches(facility.facilityType),
          ).map((facility) =>
            createPointFeature(facility.id, facility.coordinates, {
              name: facility.name,
              kind: 'facility',
              facilityType: facility.facilityType,
              villageName: facility.villageName,
            }),
          ),
        }),
        renderBuffer: 48,
        style: facilityMarkerStyle,
        zIndex: 70 + index,
      }),
    }));

    const landslideLayer = new VectorLayer({
      source: new VectorSource({ features: createDisasterFeatures('landslide') }),
      style: riskStyle,
      zIndex: 45,
    });
    const floodLayer = new VectorLayer({
      source: new VectorSource({ features: createDisasterFeatures('flood') }),
      style: riskStyle,
      zIndex: 46,
    });
    const currentStateLayer = new VectorLayer({
      source: new VectorSource({ features: readGeoJsonFeatures(MOCK_CURRENT_STATE) }),
      style: currentStateStyle,
      zIndex: 40,
    });
    const plannedStateLayer = new VectorLayer({
      source: new VectorSource({ features: readGeoJsonFeatures(MOCK_PLANNED_STATE) }),
      style: plannedStateStyle,
      zIndex: 41,
    });
    const editableLayer = new VectorLayer({
      source: editableSourceRef.current,
      style: editableStyle,
      zIndex: 100,
    });

    const registeredLayers: Array<[string, VectorLayer]> = [
      ['layer-commune', communeLayer],
      ['layer-villages', villageLayer],
      ['layer-village-labels', villageLabelLayer],
      ['layer-sovereignty-islands', sovereigntyLayer],
      ['layer-tourism', tourismLayer],
      ['layer-disaster-landslide', landslideLayer],
      ['layer-disaster-flood', floodLayer],
      ['layer-current-state', currentStateLayer],
      ['layer-planned-state', plannedStateLayer],
      ...facilityLayers.map(({ id, layer }) => [id, layer] as [string, VectorLayer]),
    ];
    registeredLayers.forEach(([id, layer]) => {
      layer.set('layerId', id);
      layer.setVisible(false);
      registry.set(id, layer);
    });

    const graticule = new Graticule({
      strokeStyle: new Stroke({ color: 'rgba(100,116,139,0.28)', width: 1 }),
      showLabels: true,
      wrapX: false,
      zIndex: 1,
      visible: false,
    });
    graticuleRef.current = graticule;

    const map = new OlMap({
      target: targetRef.current,
      layers: [
        baseLayer,
        baseOverlayLayer,
        styledBaseLayer,
        administrativeBaseLayer,
        graticule,
        ...registeredLayers.map(([, layer]) => layer),
        editableLayer,
      ],
      view: new View({
        center: fromLonLat([LAOBAO_CENTER.lng, LAOBAO_CENTER.lat]),
        zoom: LAOBAO_CENTER.zoom,
        minZoom: 4,
        maxZoom: 20,
      }),
      controls: defaultControls({ rotate: false }),
      pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
    });
    mapRef.current = map;

    const loadedAdministrativeProvinceIds = new Set<string>();
    const loadingAdministrativeProvinceIds = new Set<string>();
    const administrativeFetchControllers = new Set<AbortController>();

    const loadVisibleAdministrativeCommunes = () => {
      if (
        mapStateRef.current.activeBaseLayerId !== 'gis-vn-administrative' ||
        (map.getView().getZoom() ?? 0) < 8
      ) {
        return;
      }

      const visibleProvinceIds = Array.from(
        new Set(
          administrativeProvinceSource
            .getFeaturesInExtent(map.getView().calculateExtent(map.getSize()))
            .map((feature) => feature.get('provinceCode'))
            .filter((value): value is string => typeof value === 'string'),
        ),
      ).slice(0, 6);

      visibleProvinceIds.forEach((provinceCode) => {
        if (
          loadedAdministrativeProvinceIds.has(provinceCode) ||
          loadingAdministrativeProvinceIds.has(provinceCode)
        ) {
          return;
        }

        loadingAdministrativeProvinceIds.add(provinceCode);
        const controller = new AbortController();
        administrativeFetchControllers.add(controller);

        void fetch(
          `/gis-source/vietnam-administrative?level=communes&province=${encodeURIComponent(provinceCode)}`,
          { signal: controller.signal },
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            return response.json() as Promise<object>;
          })
          .then((data) => {
            const features = readGeoJsonFeatures(data);
            administrativeCommuneSource.addFeatures(features);
            loadedAdministrativeProvinceIds.add(provinceCode);
          })
          .catch((error: unknown) => {
            if (!controller.signal.aborted) {
              console.warn(
                `Không thể tải ranh giới xã thuộc tỉnh ${provinceCode}`,
                error,
              );
            }
          })
          .finally(() => {
            loadingAdministrativeProvinceIds.delete(provinceCode);
            administrativeFetchControllers.delete(controller);
          });
      });
    };
    loadVisibleAdministrativeCommunesRef.current = loadVisibleAdministrativeCommunes;
    const administrativeMoveKey = map.on(
      'moveend',
      loadVisibleAdministrativeCommunes,
    );
    const administrativeProvinceLoadKey = administrativeProvinceSource.on(
      'featuresloadend',
      loadVisibleAdministrativeCommunes,
    );
    eventKeysRef.current.push(administrativeMoveKey, administrativeProvinceLoadKey);

    const selection = new Select({
      layers: [editableLayer],
      style: selectedEditableStyle,
    });
    selectInteractionRef.current = selection;
    map.addInteraction(selection);

    const selectionKey = selection.on('select', (event) => {
      const feature = event.selected[0];
      if (!feature) {
        setSelectedFeatureId(null);
        return;
      }
      const id = String(feature.getId() ?? 'draft-feature');
      setSelectedFeatureId(id);
      const geometry = feature.getGeometry();
      if (geometry instanceof Point) {
        const [lng, lat] = toLonLat(geometry.getCoordinates());
        setLongitude(formatCoordinate(lng));
        setLatitude(formatCoordinate(lat));
      }
    });
    eventKeysRef.current.push(selectionKey);

    const clickKey = map.on('singleclick', (event) => {
      const [lng, lat] = toLonLat(event.coordinate);
      setLastClickedCoordinate([lng, lat]);

      const villageFeature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
        { layerFilter: (layer) => layer === villageLayer },
      );
      if (villageFeature) {
        const code = villageFeature.get('villageCode');
        if (typeof code === 'string') {
          const current = mapStateRef.current.selectedVillageCode;
          mapStateRef.current.setSelectedVillageCode(current === code ? null : code);
          villageLayer.changed();
        }
      }
    });
    eventKeysRef.current.push(clickKey);

    const updateFeatureCount = () =>
      setEditableFeatureCount(editableSourceRef.current.getFeatures().length);
    const addKey = editableSourceRef.current.on('addfeature', updateFeatureCount);
    const removeKey = editableSourceRef.current.on('removefeature', updateFeatureCount);
    const clearKey = editableSourceRef.current.on('clear', updateFeatureCount);
    eventKeysRef.current.push(addKey, removeKey, clearKey);

    const extent = communeSource.getExtent();
    if (extent && extent.every(Number.isFinite)) {
      map.getView().fit(extent, {
        padding: [80, 80, 80, 80],
        duration: 0,
        maxZoom: 14,
      });
    }

    setMapReady(true);

    return () => {
      activeEditorInteractionsRef.current.forEach((interaction) =>
        map.removeInteraction(interaction),
      );
      administrativeFetchControllers.forEach((controller) => controller.abort());
      eventKeysRef.current.forEach(unByKey);
      eventKeysRef.current = [];
      map.setTarget(undefined);
      mapRef.current = null;
      baseLayerRef.current = null;
      baseOverlayLayerRef.current = null;
      styledBaseLayerRef.current = null;
      administrativeBaseLayerRef.current = null;
      styledBaseLayerUrlRef.current = null;
      loadVisibleAdministrativeCommunesRef.current = () => {};
      graticuleRef.current = null;
      tileSourceCache.clear();
      villageLayerRef.current = null;
      selectInteractionRef.current = null;
      registry.clear();
    };
  }, []);

  React.useEffect(() => {
    if (!mapReady) return;
    const allowedLayerIds = new Set(
      INITIAL_MAP_LAYERS.filter((layer) => {
        if (layer.securityLevel === 'confidential') {
          return ['admin', 'data_governance', 'commune_leader'].includes(
            mapState.currentRole ?? '',
          );
        }
        return true;
      }).map((layer) => layer.id),
    );
    layerRegistryRef.current.forEach((layer, id) => {
      layer.setVisible(mapState.activeLayerIds.includes(id) && allowedLayerIds.has(id));
    });
  }, [mapReady, mapState.activeLayerIds, mapState.currentRole]);

  React.useEffect(() => {
    if (!mapReady) return;
    villageLayerRef.current?.changed();
  }, [mapReady, mapState.selectedVillageCode]);

  React.useEffect(() => {
    if (
      !mapReady ||
      !baseLayerRef.current ||
      !baseOverlayLayerRef.current ||
      !styledBaseLayerRef.current ||
      !administrativeBaseLayerRef.current
    )
      return;
    const config = BASE_LAYERS.find((item) => item.id === mapState.activeBaseLayerId);
    const view = mapRef.current?.getView();
    const viewMaxZoom = config?.viewMaxZoom ?? 20;
    view?.setMaxZoom(viewMaxZoom);
    if ((view?.getZoom() ?? 0) > viewMaxZoom) {
      view?.cancelAnimations();
      view?.setZoom(viewMaxZoom);
    }
    const tileLayer = baseLayerRef.current;
    const overlayLayer = baseOverlayLayerRef.current;
    const styledLayer = styledBaseLayerRef.current;
    const administrativeLayer = administrativeBaseLayerRef.current;
    tileLayer.setVisible(false);
    overlayLayer.setVisible(false);
    styledLayer.setVisible(false);
    administrativeLayer.setVisible(false);
    graticuleRef.current?.setVisible(config?.type === 'blank');

    if (config?.type === 'administrative') {
      administrativeLayer.setVisible(true);
      loadVisibleAdministrativeCommunesRef.current();
      return;
    }

    if (config?.type === 'style' && config.url) {
      const styleUrl = config.url;
      let cancelled = false;
      const loadStyle = async () => {
        if (styledBaseLayerUrlRef.current !== styleUrl) {
          styledLayer.getLayers().clear();
          await applyMapboxStyle(styledLayer, styleUrl);
          styledBaseLayerUrlRef.current = styleUrl;
        }
        if (!cancelled) styledLayer.setVisible(true);
      };
      void loadStyle();
      return () => {
        cancelled = true;
      };
    }

    if (config?.type === 'xyz' && config.url) {
      tileLayer.setPreload(config.preload ?? 1);
      const sourceCache = tileSourceCacheRef.current;
      const sourceKey = `${config.id}:base`;
      let tileSource = sourceCache.get(sourceKey);
      if (!tileSource) {
        tileSource = new XYZ({
          url: config.url,
          attributions: config.attribution,
          maxZoom: config.maxZoom,
          crossOrigin: 'anonymous',
          wrapX: false,
          transition: 80,
        });
        sourceCache.set(sourceKey, tileSource);
      }
      tileLayer.setSource(tileSource);
      tileLayer.setVisible(true);
      if (config.overlayUrl) {
        const overlaySourceKey = `${config.id}:overlay`;
        let overlaySource = sourceCache.get(overlaySourceKey);
        if (!overlaySource) {
          overlaySource = new XYZ({
            url: config.overlayUrl,
            attributions: config.attribution,
            maxZoom: config.maxZoom,
            crossOrigin: 'anonymous',
            wrapX: false,
            transition: 80,
          });
          sourceCache.set(overlaySourceKey, overlaySource);
        }
        overlayLayer.setSource(overlaySource);
        overlayLayer.setVisible(true);
      } else {
        overlayLayer.setSource(null);
      }
    } else {
      tileLayer.setSource(null);
      overlayLayer.setSource(null);
    }
  }, [mapReady, mapState.activeBaseLayerId]);

  React.useEffect(() => {
    const flyToCoords = mapState.flyToCoords;
    const setFlyToCoords = mapState.setFlyToCoords;
    if (!mapReady || !flyToCoords || !mapRef.current) return;
    const [lat, lng, zoom = 16] = flyToCoords;
    mapRef.current.getView().animate({
      center: fromLonLat([lng, lat]),
      zoom,
      duration: 700,
    });
    setFlyToCoords(null);
  }, [mapReady, mapState.flyToCoords, mapState.setFlyToCoords]);

  React.useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    activeEditorInteractionsRef.current.forEach((interaction) =>
      map.removeInteraction(interaction),
    );
    activeEditorInteractionsRef.current = [];

    const source = editableSourceRef.current;
    const interactions: Array<Draw | Modify | Snap> = [];
    if (editorMode === 'point' || editorMode === 'line' || editorMode === 'polygon') {
      const draw = new Draw({
        source,
        type:
          editorMode === 'point'
            ? 'Point'
            : editorMode === 'line'
              ? 'LineString'
              : 'Polygon',
      });
      draw.on('drawend', (event) => {
        const id = `draft-${Date.now()}`;
        event.feature.setId(id);
        event.feature.setProperties({
          name: `Đối tượng nháp ${source.getFeatures().length + 1}`,
          status: 'draft',
          createdAt: new Date().toISOString(),
        });
        const selectedFeatures = selectInteractionRef.current?.getFeatures();
        selectedFeatures?.clear();
        selectedFeatures?.push(event.feature);
        setSelectedFeatureId(id);
        setEditorMode('view');
      });
      interactions.push(draw, new Snap({ source }));
    } else if (editorMode === 'modify') {
      const selectedFeatures = selectInteractionRef.current?.getFeatures();
      if (selectedFeatures) {
        interactions.push(
          new Modify({ features: selectedFeatures }),
          new Snap({ source }),
        );
      }
    }

    interactions.forEach((interaction) => map.addInteraction(interaction));
    activeEditorInteractionsRef.current = interactions;

    return () => {
      interactions.forEach((interaction) => map.removeInteraction(interaction));
    };
  }, [editorMode, mapReady]);

  function parseManualCoordinates(): [number, number] | null {
    const lng = Number(longitude);
    const lat = Number(latitude);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      setCoordinateError('Tọa độ phải là số hợp lệ.');
      return null;
    }
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      setCoordinateError('Tọa độ nằm ngoài phạm vi EPSG:4326.');
      return null;
    }
    setCoordinateError(null);
    return [lng, lat];
  }

  function addPointFromCoordinates() {
    const coordinate = parseManualCoordinates();
    if (!coordinate) return;
    const id = `draft-${Date.now()}`;
    const feature = createPointFeature(id, coordinate, {
      name: `Điểm nhập tọa độ ${editableFeatureCount + 1}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
    });
    editableSourceRef.current.addFeature(feature);
    selectInteractionRef.current?.getFeatures().clear();
    selectInteractionRef.current?.getFeatures().push(feature);
    setSelectedFeatureId(id);
    mapRef.current?.getView().animate({
      center: fromLonLat(coordinate),
      zoom: Math.max(mapRef.current.getView().getZoom() ?? 14, 16),
      duration: 500,
    });
  }

  function updateSelectedPoint() {
    const coordinate = parseManualCoordinates();
    if (!coordinate) return;
    const feature = selectInteractionRef.current?.getFeatures().item(0);
    const geometry = feature?.getGeometry();
    if (!(geometry instanceof Point)) {
      setCoordinateError('Hãy chọn một điểm nháp để cập nhật tọa độ.');
      return;
    }
    geometry.setCoordinates(fromLonLat(coordinate));
    feature?.set('updatedAt', new Date().toISOString());
  }

  function deleteSelectedFeature() {
    const selection = selectInteractionRef.current?.getFeatures();
    const feature = selection?.item(0);
    if (!feature) return;
    editableSourceRef.current.removeFeature(feature);
    selection?.clear();
    setSelectedFeatureId(null);
  }

  function clearEditableFeatures() {
    editableSourceRef.current.clear();
    selectInteractionRef.current?.getFeatures().clear();
    setSelectedFeatureId(null);
  }

  function exportEditableGeoJson() {
    const data = geoJsonFormat.writeFeaturesObject(editableSourceRef.current.getFeatures(), {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
      decimals: 7,
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/geo+json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `lao-bao-draft-${new Date().toISOString().slice(0, 10)}.geojson`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const editorButtons: Array<{
    mode: EditorMode;
    label: string;
    icon: React.ElementType;
  }> = [
    { mode: 'view', label: 'Chọn', icon: MousePointer2 },
    { mode: 'point', label: 'Vẽ điểm', icon: MapPinPlus },
    { mode: 'line', label: 'Vẽ đường', icon: Route },
    { mode: 'polygon', label: 'Vẽ vùng', icon: Pentagon },
    { mode: 'modify', label: 'Sửa đỉnh', icon: Pencil },
  ];

  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
      <div ref={targetRef} className="h-full min-h-[520px] w-full" aria-label="Bản đồ GIS OpenLayers" />

      <div className="absolute bottom-8 left-2.5 z-10 w-[min(23rem,calc(100%-1.25rem))] rounded-xl border border-border/70 bg-card/95 p-2.5 shadow-lg backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold text-foreground">Biên tập đối tượng (POC)</p>
            <p className="text-[8px] text-muted-foreground">
              {editableFeatureCount} đối tượng nháp · chưa lưu backend
            </p>
          </div>
          {selectedFeatureId && (
            <span className="max-w-32 truncate rounded bg-orange-500/10 px-1.5 py-0.5 font-mono text-[8px] text-orange-700 dark:text-orange-300">
              {selectedFeatureId}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {editorButtons.map(({ mode, label, icon: Icon }) => (
            <Button
              key={mode}
              type="button"
              size="xs"
              variant={editorMode === mode ? 'default' : 'outline'}
              onClick={() => setEditorMode(mode)}
              className={cn('h-7 gap-1 px-2 text-[9px] shadow-none', editorMode === mode && 'border-primary')}
              title={label}
            >
              <Icon className="size-3" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={deleteSelectedFeature}
            disabled={!selectedFeatureId}
            className="h-7 gap-1 px-2 text-[9px] text-destructive shadow-none"
            title="Xóa đối tượng đang chọn"
          >
            <Trash2 className="size-3" />
          </Button>
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={clearEditableFeatures}
            disabled={editableFeatureCount === 0}
            className="h-7 gap-1 px-2 text-[9px] shadow-none"
            title="Xóa toàn bộ bản nháp"
          >
            <Eraser className="size-3" />
          </Button>
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={exportEditableGeoJson}
            disabled={editableFeatureCount === 0}
            className="h-7 gap-1 px-2 text-[9px] shadow-none"
            title="Xuất GeoJSON"
          >
            <Download className="size-3" />
          </Button>
        </div>

        <div className="mt-2 grid grid-cols-[1fr_1fr_auto_auto] gap-1">
          <Input
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            inputMode="decimal"
            aria-label="Kinh độ"
            placeholder="Kinh độ"
            className="h-7 px-2 font-mono text-[9px] shadow-none"
          />
          <Input
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            inputMode="decimal"
            aria-label="Vĩ độ"
            placeholder="Vĩ độ"
            className="h-7 px-2 font-mono text-[9px] shadow-none"
          />
          <Button
            type="button"
            size="xs"
            onClick={addPointFromCoordinates}
            className="h-7 px-2 text-[9px]"
            title="Thêm điểm theo tọa độ"
          >
            <MapPinPlus className="size-3" />
          </Button>
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={updateSelectedPoint}
            disabled={!selectedFeatureId}
            className="h-7 px-2 text-[9px]"
            title="Cập nhật tọa độ điểm đang chọn"
          >
            <Check className="size-3" />
          </Button>
        </div>
        {coordinateError ? (
          <p className="mt-1 text-[8px] font-medium text-destructive">{coordinateError}</p>
        ) : lastClickedCoordinate ? (
          <p className="mt-1 text-[8px] text-muted-foreground">
            Vị trí vừa chọn: {formatCoordinate(lastClickedCoordinate[0])},{' '}
            {formatCoordinate(lastClickedCoordinate[1])}
          </p>
        ) : null}
      </div>

      <style>{`
        .ol-zoom {
          top: auto;
          right: 0.75rem;
          bottom: 2.5rem;
          left: auto;
        }
        .ol-attribution {
          right: 0;
          bottom: 1.75rem;
          max-width: min(70vw, 36rem);
          font-size: 9px;
        }
        .ol-control button {
          background: color-mix(in srgb, var(--card) 92%, transparent);
          color: var(--foreground);
          cursor: pointer;
        }
        .ol-control button:hover,
        .ol-control button:focus {
          background: var(--primary);
          color: var(--primary-foreground);
        }
        .ol-scale-line {
          bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
