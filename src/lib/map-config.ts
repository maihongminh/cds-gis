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

export const VIETNAM_CENTER: MapCenter = {
  lat: 14.0583,
  lng: 108.2772,
  zoom: 5,
};

export interface TileLayerConfig {
  id: string;
  name: string;
  type: 'blank' | 'style' | 'xyz';
  url?: string;
  attribution: string;
  description?: string;
  maxZoom?: number;
  status: 'imagery-only' | 'safe-default' | 'requires-review';
}

const configuredBasemapUrl = process.env.NEXT_PUBLIC_GIS_BASEMAP_URL?.trim();
const configuredBasemapAttribution =
  process.env.NEXT_PUBLIC_GIS_BASEMAP_ATTRIBUTION?.trim() ?? 'Nguồn bản đồ nền được cấu hình';
const vietMapTilemapApiKey = process.env.NEXT_PUBLIC_VIETMAP_TILEMAP_API_KEY?.trim();

const vietMapBasemaps: TileLayerConfig[] = vietMapTilemapApiKey
  ? [
      {
        id: 'vietmap-street',
        name: 'Đường phố VN',
        type: 'style',
        url: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${vietMapTilemapApiKey}`,
        attribution: '&copy; VIETMAP',
        description: 'Đường, địa danh và công trình trên toàn Việt Nam',
        maxZoom: 20,
        status: 'requires-review',
      },
      {
        id: 'vietmap-hybrid',
        name: 'Hỗn hợp VN',
        type: 'style',
        url: `https://maps.vietmap.vn/maps/styles/hm/style.json?apikey=${vietMapTilemapApiKey}`,
        attribution: '&copy; VIETMAP',
        description: 'Ảnh vệ tinh kết hợp đường và nhãn địa danh Việt Nam',
        maxZoom: 20,
        status: 'requires-review',
      },
      {
        id: 'vietmap-satellite',
        name: 'Vệ tinh Việt Nam',
        type: 'xyz',
        url: `https://maps.vietmap.vn/maps/tiles/st/{z}/{x}/{y}.png?apikey=${vietMapTilemapApiKey}`,
        attribution: '&copy; VIETMAP',
        description: 'Ảnh vệ tinh do VIETMAP cung cấp',
        maxZoom: 20,
        status: 'requires-review',
      },
    ]
  : [];

const externalBasemaps: TileLayerConfig[] = [
  ...vietMapBasemaps,
  {
    id: 'satellite-imagery',
    name: 'Vệ tinh',
    type: 'xyz',
    // Imagery only: no provider-drawn political borders or place labels.
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    description: 'Ảnh thực địa, không kèm đường biên và nhãn chính trị',
    maxZoom: 19,
    status: 'imagery-only',
  },
  {
    id: 'shaded-relief',
    name: 'Địa hình',
    type: 'xyz',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Copyright &copy; Esri',
    description: 'Nền màu thể hiện độ cao và địa hình tự nhiên',
    maxZoom: 13,
    status: 'imagery-only',
  },
  {
    id: 'world-hillshade',
    name: 'Đổ bóng',
    type: 'xyz',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Sources: Esri, Airbus, USGS, NGA, NASA, CGIAR and the GIS User Community',
    description: 'Đổ bóng cao độ, phù hợp quan sát vùng đồi núi',
    maxZoom: 19,
    status: 'imagery-only',
  },
];

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
    : []),
  ...externalBasemaps,
  {
    id: 'neutral-grid',
    name: 'Nền tọa độ',
    type: 'blank',
    attribution: 'Hệ tọa độ hiển thị EPSG:3857 · dữ liệu nghiệp vụ EPSG:4326',
    description: 'Nền trung tính với lưới kinh độ, vĩ độ',
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
