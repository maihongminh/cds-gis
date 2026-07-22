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
  url: string;
  attribution: string;
  maxZoom?: number;
}

export const BASE_LAYERS: TileLayerConfig[] = [
  {
    id: 'streets',
    name: 'Đường phố',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: 'satellite',
    name: 'Vệ tinh',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
  },
  {
    id: 'topo',
    name: 'Địa hình',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Style: &copy; OpenTopoMap',
    maxZoom: 17,
  },
];

export const MAP_METADATA = {
  sourceCrs: 'VN-2000',
  displayCrs: 'EPSG:4326',
  geometryStatus: 'mock',
  disclaimer: 'Dữ liệu ranh giới thôn chỉ mang tính chất minh họa phục vụ thử nghiệm giao diện, chưa có giá trị pháp lý chính thức.',
};
