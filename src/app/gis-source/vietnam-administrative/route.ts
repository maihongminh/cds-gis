import { type NextRequest, NextResponse } from 'next/server';
import {
  GIS_VN_COMMUNES_URL,
  GIS_VN_PROVINCES_URL,
  loadGisVnJson,
  type GisVnAdministrativeCollection,
  type GisVnAdministrativeFeature,
  type GisVnLinearRing,
  type GisVnPolygonCoordinates,
  type GisVnPosition,
} from '@/lib/server/gis-vn-data';

export const dynamic = 'force-dynamic';

function squaredSegmentDistance(
  point: GisVnPosition,
  start: GisVnPosition,
  end: GisVnPosition,
) {
  let x = start[0];
  let y = start[1];
  let dx = end[0] - x;
  let dy = end[1] - y;

  if (dx !== 0 || dy !== 0) {
    const ratio =
      ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
    if (ratio > 1) {
      x = end[0];
      y = end[1];
    } else if (ratio > 0) {
      x += dx * ratio;
      y += dy * ratio;
    }
  }

  dx = point[0] - x;
  dy = point[1] - y;
  return dx * dx + dy * dy;
}

/** Douglas-Peucker simplification for the nationwide province overview. */
function simplifyRing(ring: GisVnLinearRing, tolerance = 0.005) {
  if (ring.length <= 4) return ring;

  const points = ring.slice(0, -1);
  const keep = new Uint8Array(points.length);
  const stack: Array<[number, number]> = [[0, points.length - 1]];
  const squaredTolerance = tolerance * tolerance;
  keep[0] = 1;
  keep[points.length - 1] = 1;

  while (stack.length > 0) {
    const [first, last] = stack.pop()!;
    let farthestIndex = -1;
    let farthestDistance = squaredTolerance;

    for (let index = first + 1; index < last; index += 1) {
      const distance = squaredSegmentDistance(
        points[index],
        points[first],
        points[last],
      );
      if (distance > farthestDistance) {
        farthestDistance = distance;
        farthestIndex = index;
      }
    }

    if (farthestIndex >= 0) {
      keep[farthestIndex] = 1;
      stack.push([first, farthestIndex], [farthestIndex, last]);
    }
  }

  const simplified = points.filter((_, index) => keep[index] === 1);
  if (simplified.length < 3) return ring;
  return [...simplified, simplified[0]];
}

function normalizeGeometry(
  geometry: GisVnAdministrativeFeature['geometry'],
  simplify: boolean,
) {
  const polygons =
    geometry.type === 'MultiPolygon'
      ? (geometry.coordinates as GisVnPolygonCoordinates[])
      : [geometry.coordinates as GisVnPolygonCoordinates];

  return {
    type: 'MultiPolygon' as const,
    coordinates: simplify
      ? polygons.map((polygon) => polygon.map((ring) => simplifyRing(ring)))
      : polygons,
  };
}

function provinceFeature(feature: GisVnAdministrativeFeature) {
  return {
    type: 'Feature' as const,
    id: `province-${feature.properties.ma_tinh}`,
    properties: {
      level: 'province',
      provinceCode: feature.properties.ma_tinh,
      name: feature.properties.ten_tinh,
      unitType: feature.properties.loai,
      source: 'gis.vn',
    },
    geometry: normalizeGeometry(feature.geometry, true),
  };
}

function communeFeature(feature: GisVnAdministrativeFeature) {
  return {
    type: 'Feature' as const,
    id: `commune-${feature.properties.ma_xa}`,
    properties: {
      level: 'commune',
      communeCode: feature.properties.ma_xa,
      provinceCode: feature.properties.ma_tinh,
      provinceName: feature.properties.ten_tinh,
      name: feature.properties.ten_xa,
      unitType: feature.properties.loai,
      source: 'gis.vn',
    },
    geometry: normalizeGeometry(feature.geometry, false),
  };
}

export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get('level') ?? 'provinces';

  try {
    if (level === 'provinces') {
      const collection = await loadGisVnJson<GisVnAdministrativeCollection>(
        GIS_VN_PROVINCES_URL,
      );
      return NextResponse.json(
        {
          type: 'FeatureCollection',
          metadata: { source: 'gis.vn', sourceUrl: GIS_VN_PROVINCES_URL },
          features: collection.features.map(provinceFeature),
        },
        {
          headers: {
            'Cache-Control':
              'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        },
      );
    }

    if (level === 'communes') {
      const provinceCode = request.nextUrl.searchParams.get('province')?.trim();
      if (!provinceCode || !/^\d{2}$/.test(provinceCode)) {
        return NextResponse.json(
          { error: 'Tham số province phải là mã tỉnh gồm 2 chữ số.' },
          { status: 400 },
        );
      }

      const collection = await loadGisVnJson<GisVnAdministrativeCollection>(
        GIS_VN_COMMUNES_URL,
      );
      return NextResponse.json(
        {
          type: 'FeatureCollection',
          metadata: {
            source: 'gis.vn',
            sourceUrl: GIS_VN_COMMUNES_URL,
            provinceCode,
          },
          features: collection.features
            .filter((feature) => feature.properties.ma_tinh === provinceCode)
            .map(communeFeature),
        },
        {
          headers: {
            'Cache-Control':
              'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        },
      );
    }

    return NextResponse.json(
      { error: 'level chỉ hỗ trợ provinces hoặc communes.' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Unable to load administrative data from gis.vn', error);
    return NextResponse.json(
      { error: 'Không thể tải dữ liệu hành chính từ gis.vn.' },
      { status: 502 },
    );
  }
}
