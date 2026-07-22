// src/lib/map-config.ts

export interface MapCenter {
  lat: number;
  lng: number;
  zoom: number;
}

export const LAOBAO_CENTER: MapCenter = {
  lat: 16.636030657,
  lng: 106.633244839,
  zoom: 13,
};

export interface TileLayerConfig {
  id: string;
  name: string;
  type: 'blank' | 'xyz';
  url?: string;
  attribution: string;
  maxZoom?: number;
  status: 'safe-default' | 'requires-review';
}

const configuredBasemapUrl = process.env.NEXT_PUBLIC_GIS_BASEMAP_URL?.trim();
const configuredBasemapAttribution =
  process.env.NEXT_PUBLIC_GIS_BASEMAP_ATTRIBUTION?.trim() ?? 'Nguồn bản đồ nền được cấu hình';

/**
 * No third-party basemap is enabled by default. The neutral grid keeps the GIS
 * tools usable while the project waits for an approved sovereignty-compliant
 * XYZ source. Configure NEXT_PUBLIC_GIS_BASEMAP_URL to enable that source.
 */
export const BASE_LAYERS: TileLayerConfig[] = [
  {
    id: 'neutral-grid',
    name: 'Nền tọa độ',
    type: 'blank',
    attribution: 'Hệ tọa độ hiển thị EPSG:3857 · dữ liệu nghiệp vụ EPSG:4326',
    maxZoom: 20,
    status: 'safe-default',
  },
  ...(configuredBasemapUrl
    ? [
        {
          id: 'approved-xyz',
          name: 'Nền đã cấu hình',
          type: 'xyz' as const,
          url: configuredBasemapUrl,
          attribution: configuredBasemapAttribution,
          maxZoom: 20,
          status: 'requires-review' as const,
        },
      ]
    : []),
];

export const MAP_METADATA = {
  sourceCrs: 'VN-2000',
  displayCrs: 'EPSG:4326',
  geometryStatus: 'mock',
  disclaimer: 'Dữ liệu ranh giới thôn chỉ mang tính chất minh họa phục vụ thử nghiệm giao diện, chưa có giá trị pháp lý chính thức.',
};
