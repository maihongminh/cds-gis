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
  status: 'imagery-only' | 'safe-default' | 'requires-review';
}

const configuredBasemapUrl = process.env.NEXT_PUBLIC_GIS_BASEMAP_URL?.trim();
const configuredBasemapAttribution =
  process.env.NEXT_PUBLIC_GIS_BASEMAP_ATTRIBUTION?.trim() ?? 'Nguồn bản đồ nền được cấu hình';
const vietMapTilemapApiKey = process.env.NEXT_PUBLIC_VIETMAP_TILEMAP_API_KEY?.trim();

const visibleBasemap: TileLayerConfig = vietMapTilemapApiKey
  ? {
      id: 'vietmap-satellite',
      name: 'Vệ tinh Việt Nam',
      type: 'xyz',
      url: `https://maps.vietmap.vn/maps/tiles/st/{z}/{x}/{y}.png?apikey=${vietMapTilemapApiKey}`,
      attribution: '&copy; VIETMAP',
      maxZoom: 20,
      status: 'requires-review',
    }
  : {
      id: 'satellite-imagery',
      name: 'Ảnh vệ tinh',
      type: 'xyz',
      // Imagery only: no provider-drawn political borders or place labels.
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      maxZoom: 19,
      status: 'imagery-only',
    };

/**
 * A label-free imagery source is visible by default so the map remains useful
 * without inheriting a provider's political boundary overlay. A reviewed
 * VietMap/custom XYZ source can replace it through environment configuration.
 */
export const BASE_LAYERS: TileLayerConfig[] = [
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
    : [visibleBasemap]),
  {
    id: 'neutral-grid',
    name: 'Nền tọa độ',
    type: 'blank',
    attribution: 'Hệ tọa độ hiển thị EPSG:3857 · dữ liệu nghiệp vụ EPSG:4326',
    maxZoom: 20,
    status: 'safe-default',
  },
];

export const MAP_METADATA = {
  sourceCrs: 'VN-2000',
  displayCrs: 'EPSG:4326',
  geometryStatus: 'mock',
  disclaimer: 'Dữ liệu ranh giới thôn chỉ mang tính chất minh họa phục vụ thử nghiệm giao diện, chưa có giá trị pháp lý chính thức.',
};
