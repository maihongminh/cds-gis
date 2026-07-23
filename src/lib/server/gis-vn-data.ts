export const GIS_VN_PROVINCES_URL =
  'https://gis.vn/json/sausapnhap_tinhthanh_xuattu_gisvn_dungdehienhinhanh_giam95phantram.geojson';
export const GIS_VN_COMMUNES_URL =
  'https://gis.vn/json/sausapnhap_phuongxa_xuattu_gisvn_dungdehienhinhanh_giam95phantram.geojson';
export const GIS_VN_ISLAND_LABELS_URL =
  'https://gis.vn/assets/json/DM_TOADO_QUANDAO.json';

export type GisVnPosition = [number, number];
export type GisVnLinearRing = GisVnPosition[];
export type GisVnPolygonCoordinates = GisVnLinearRing[];

export interface GisVnAdministrativeProperties {
  ma_tinh?: string;
  ten_tinh?: string;
  ma_xa?: string;
  ten_xa?: string;
  loai?: string;
}

export interface GisVnAdministrativeFeature {
  type: 'Feature';
  properties: GisVnAdministrativeProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: GisVnPolygonCoordinates | GisVnPolygonCoordinates[];
  };
}

export interface GisVnAdministrativeCollection {
  type: 'FeatureCollection';
  features: GisVnAdministrativeFeature[];
}

export interface GisVnIslandLabel {
  ID: string;
  lat: number;
  long: number;
  Ten_quan_dao: string;
  loai: string;
}

interface JsonCacheEntry {
  expiresAt: number;
  promise: Promise<unknown>;
}

const GIS_VN_MEMORY_CACHE_TTL_MS = 86_400_000;
const jsonCache = new Map<string, JsonCacheEntry>();

/**
 * Shares large gis.vn responses between route handlers without placing them in
 * Next.js Data Cache, whose per-item size limit is lower than the province file.
 */
export function loadGisVnJson<T>(url: string): Promise<T> {
  const now = Date.now();
  const cached = jsonCache.get(url);
  if (cached && cached.expiresAt > now) {
    return cached.promise as Promise<T>;
  }

  const promise = fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'application/geo+json, application/json' },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`gis.vn responded with HTTP ${response.status}`);
      }
      return response.json() as Promise<T>;
    })
    .catch((error) => {
      jsonCache.delete(url);
      throw error;
    });

  jsonCache.set(url, {
    expiresAt: now + GIS_VN_MEMORY_CACHE_TTL_MS,
    promise,
  });
  return promise;
}
