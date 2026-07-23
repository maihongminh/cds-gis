import { NextResponse } from 'next/server';
import {
  GIS_VN_ISLAND_LABELS_URL,
  GIS_VN_PROVINCES_URL,
  loadGisVnJson,
  type GisVnAdministrativeCollection,
  type GisVnAdministrativeFeature,
  type GisVnIslandLabel,
  type GisVnPolygonCoordinates,
} from '@/lib/server/gis-vn-data';

export const dynamic = 'force-dynamic';

function toMultiPolygonCoordinates(feature: GisVnAdministrativeFeature) {
  return feature.geometry.type === 'MultiPolygon'
    ? (feature.geometry.coordinates as GisVnPolygonCoordinates[])
    : [feature.geometry.coordinates as GisVnPolygonCoordinates];
}

function isOffshoreIslandPolygon(polygon: GisVnPolygonCoordinates) {
  return polygon.some((ring) =>
    ring.some((position) => Number(position[0]) >= 110),
  );
}

export async function GET() {
  try {
    const [boundaries, labels] = await Promise.all([
      loadGisVnJson<GisVnAdministrativeCollection>(GIS_VN_PROVINCES_URL),
      loadGisVnJson<GisVnIslandLabel[]>(GIS_VN_ISLAND_LABELS_URL),
    ]);

    const boundaryFeatures = boundaries.features.flatMap((feature) => {
      const provinceName = feature.properties?.ten_tinh;
      if (provinceName !== 'Đà Nẵng' && provinceName !== 'Khánh Hòa') return [];

      const coordinates = toMultiPolygonCoordinates(feature).filter(
        isOffshoreIslandPolygon,
      );
      if (coordinates.length === 0) return [];

      const isHoangSa = provinceName === 'Đà Nẵng';
      return [
        {
          type: 'Feature' as const,
          id: isHoangSa ? 'gis-vn-hoang-sa-boundary' : 'gis-vn-truong-sa-boundary',
          properties: {
            kind: 'island-boundary',
            name: isHoangSa ? 'Quần đảo Hoàng Sa' : 'Quần đảo Trường Sa',
            administrativeUnit: provinceName,
            source: 'gis.vn',
          },
          geometry: {
            type: 'MultiPolygon' as const,
            coordinates,
          },
        },
      ];
    });

    const labelFeatures = labels
      .filter(
        (item) =>
          item.loai === 'tieude' &&
          Number.isFinite(Number(item.long)) &&
          Number.isFinite(Number(item.lat)),
      )
      .map((item) => ({
        type: 'Feature' as const,
        id: `gis-vn-${item.ID.toLowerCase()}-label`,
        properties: {
          kind: 'island-label',
          name: `Quần đảo ${item.Ten_quan_dao}`,
          label: `${item.Ten_quan_dao.toUpperCase()}\n(VIỆT NAM)`,
          source: 'gis.vn',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [Number(item.long), Number(item.lat)],
        },
      }));

    return NextResponse.json(
      {
        type: 'FeatureCollection',
        metadata: {
          source: 'gis.vn',
          boundarySourceUrl: GIS_VN_PROVINCES_URL,
          labelSourceUrl: GIS_VN_ISLAND_LABELS_URL,
          note: 'Hình học được lọc từ các thành phần ngoài khơi của Đà Nẵng và Khánh Hòa.',
        },
        features: [...boundaryFeatures, ...labelFeatures],
      },
      {
        headers: {
          'Cache-Control':
            'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    );
  } catch (error) {
    console.error('Unable to load Vietnam island data from gis.vn', error);
    return NextResponse.json(
      { error: 'Không thể tải dữ liệu Hoàng Sa, Trường Sa từ gis.vn.' },
      { status: 502 },
    );
  }
}
