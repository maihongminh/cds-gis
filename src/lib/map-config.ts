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
  type: 'administrative' | 'blank' | 'style' | 'xyz';
  url?: string;
  overlayUrl?: string;
  attribution: string;
  description?: string;
  maxZoom?: number;
  viewMaxZoom?: number;
  preload?: number;
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
    id: 'arcgis-streets',
    name: 'Đường phố Esri',
    type: 'xyz',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    description: 'Nền đường phố tương tự lựa chọn trên gis.vn',
    maxZoom: 17,
    viewMaxZoom: 17,
    status: 'requires-review',
  },
  {
    id: 'carto-voyager',
    name: 'Đường phố CARTO',
    type: 'xyz',
    url: 'https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    description: 'Nền Voyager sáng, rõ đường và công trình, tải qua CDN của CARTO',
    maxZoom: 20,
    preload: 0,
    status: 'requires-review',
  },
  {
    id: 'openfreemap-liberty',
    name: 'Bản đồ Liberty',
    type: 'style',
    url: '/gis-source/openfreemap-liberty-style?v=3',
    attribution:
      'OpenFreeMap &copy; OpenMapTiles Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    description: 'Nền vector Liberty với nhãn vùng biển đã được Việt hóa',
    maxZoom: 20,
    status: 'requires-review',
  },
  {
    id: 'gis-vn-administrative',
    name: 'Hành chính',
    type: 'administrative',
    attribution: 'Dữ liệu hành chính &copy; gis.vn',
    description: '34 tỉnh và 3.321 phường/xã sau sắp xếp, tải chi tiết theo vùng đang xem',
    maxZoom: 20,
    status: 'requires-review',
  },
  {
    id: 'arcgis-imagery-labels',
    name: 'Vệ tinh (Nhãn)',
    type: 'xyz',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    overlayUrl:
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    description: 'Ảnh vệ tinh kết hợp nhãn địa danh và ranh giới tham chiếu',
    maxZoom: 19,
    status: 'requires-review',
  },
  {
    id: 'satellite-imagery',
    name: 'Vệ tinh (Không)',
    type: 'xyz',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    description: 'Ảnh vệ tinh không kèm nhãn và đường biên',
    maxZoom: 19,
    status: 'imagery-only',
  },
  {
    id: 'arcgis-topographic',
    name: 'Địa hình',
    type: 'xyz',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    description: 'Địa hình, thủy hệ, đường và địa danh',
    maxZoom: 19,
    status: 'requires-review',
  },
  {
    id: 'arcgis-light-gray',
    name: 'Xám nhạt',
    type: 'xyz',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    description: 'Nền sáng ít tương phản để làm nổi bật lớp GIS',
    maxZoom: 16,
    status: 'requires-review',
  },
  {
    id: 'arcgis-dark-gray',
    name: 'Xám đậm',
    type: 'xyz',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    description: 'Nền tối phù hợp với lớp cảnh báo màu sáng',
    maxZoom: 16,
    status: 'requires-review',
  },
];

/**
 * Esri street remains the default no-key basemap. A configured custom XYZ
 * source is listed first so deployments can explicitly select an approved map.
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

export const DEFAULT_BASE_LAYER_ID = 'openfreemap-liberty';

export const MAP_METADATA = {
  sourceCrs: 'VN-2000',
  displayCrs: 'EPSG:4326',
  geometryStatus: 'mock',
  disclaimer: 'Dữ liệu ranh giới thôn chỉ mang tính chất minh họa phục vụ thử nghiệm giao diện, chưa có giá trị pháp lý chính thức.',
};
