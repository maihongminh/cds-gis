// Compatibility exports for the GIS POC. The canonical catalog lives in
// gis-layer-catalog.ts; mock feature records remain here until a backend exists.

export {
  GIS_LAYER_GROUPS,
  INITIAL_MAP_LAYERS,
  MAP_LAYER_BY_ID,
} from './gis-layer-catalog';
export type { MapDataGroup, MapLayer } from './gis-layer-catalog';

export { MOCK_TOURISM_POIS } from './mock-map-tourism-pois';
export { MOCK_PUBLIC_FACILITIES } from './mock-map-public-facilities';
export { MOCK_DISASTER_RISK_ZONES } from './mock-map-disaster-risks';

export interface SpatialFeature {
  id: string;
  layerId: string;
  name: string;
  description: string;
  geometry: {
    type: 'Point' | 'Polygon';
    coordinates: [number, number] | [number, number][][];
  };
  linkedEntityType: string;
  linkedEntityId: string;
  imagePlaceholder?: string;
  properties: Record<string, unknown>;
}

export const INITIAL_SPATIAL_FEATURES: SpatialFeature[] = [
  {
    id: 'feat-1',
    layerId: 'layer-schools',
    name: 'Điểm trường Mầm non Ka Tăng',
    description: 'Cơ sở giáo dục mầm non thôn Ka Tăng biên giới.',
    geometry: { type: 'Point', coordinates: [106.574, 16.632] },
    linkedEntityType: 'school',
    linkedEntityId: 'sch-4',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1577896851231-70ee18881754?w=500&auto=format&fit=crop&q=60',
    properties: { 'Số giáo viên': '4 giáo viên', 'Số học sinh': '52 học sinh' },
  },
  {
    id: 'feat-2',
    layerId: 'layer-health-facilities',
    name: 'Trạm Y tế xã Lao Bảo',
    description: 'Cơ sở khám chữa bệnh ban đầu của xã.',
    geometry: { type: 'Point', coordinates: [106.59, 16.648] },
    linkedEntityType: 'healthFacility',
    linkedEntityId: 'hf-1',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&auto=format&fit=crop&q=60',
    properties: { 'Cán bộ y tế': '7 nhân viên', 'Số giường bệnh': '12 giường' },
  },
];
