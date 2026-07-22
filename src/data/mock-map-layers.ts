// src/data/mock-map-layers.ts
// GIS layer definitions and layer group configuration for Lao Bao digital map.

import type { GisLayerGroup } from '@/types/map';
import { MOCK_TOURISM_POIS } from './mock-map-tourism-pois';
import { MOCK_PUBLIC_FACILITIES } from './mock-map-public-facilities';
import { MOCK_DISASTER_RISK_ZONES } from './mock-map-disaster-risks';
import { MOCK_VILLAGE_BOUNDARIES } from './mock-laobao-boundary';

// Re-export for convenience
export { MOCK_TOURISM_POIS, MOCK_PUBLIC_FACILITIES, MOCK_DISASTER_RISK_ZONES };

// ─── Types ────────────────────────────────────────────────────────────────────

export type MapDataGroup =
  | 'administrative'
  | 'economy'
  | 'tourism'
  | 'land'
  | 'agriculture'
  | 'education'
  | 'health'
  | 'welfare'
  | 'security_defense'
  | 'disaster';

export interface MapLayer {
  id: string;
  name: string;
  shortLabel?: string;
  dataGroup: MapDataGroup;
  geometryType: 'point' | 'line' | 'polygon';
  order: number;
  visibleByDefault: boolean;
  styleConfig: {
    color: string;
    fillColor?: string;
    weight?: number;
    radius?: number;
    icon?: string;
  };
  securityLevel: 'public' | 'confidential';
  allowedRoles: string[];
  source: string;
  updateFrequency: string;
  status: 'active' | 'inactive';
  /** Number of features in this layer (computed from mock data) */
  featureCount?: number;
}

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

// ─── Layer Definitions ────────────────────────────────────────────────────────

export const INITIAL_MAP_LAYERS: MapLayer[] = [
  // Administrative
  {
    id: 'layer-commune',
    name: 'Ranh giới xã Lao Bảo',
    shortLabel: 'Ranh giới xã',
    dataGroup: 'administrative',
    geometryType: 'polygon',
    order: 0,
    visibleByDefault: true,
    styleConfig: { color: '#1d4ed8', fillColor: '#3b82f6', weight: 3 },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Phòng Tài nguyên - Môi trường',
    updateFrequency: 'Hằng năm',
    status: 'active',
    featureCount: 1,
  },
  {
    id: 'layer-villages',
    name: 'Ranh giới 12 thôn',
    shortLabel: 'Ranh giới thôn',
    dataGroup: 'administrative',
    geometryType: 'polygon',
    order: 1,
    visibleByDefault: true,
    styleConfig: { color: '#64748b', fillColor: '#94a3b8', weight: 1.5 },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Phòng Tài nguyên - Môi trường',
    updateFrequency: 'Hằng năm',
    status: 'active',
    featureCount: MOCK_VILLAGE_BOUNDARIES.features.length,
  },
  {
    id: 'layer-village-labels',
    name: 'Nhãn tên thôn',
    shortLabel: 'Nhãn thôn',
    dataGroup: 'administrative',
    geometryType: 'point',
    order: 2,
    visibleByDefault: true,
    styleConfig: { color: '#1e293b' },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Master data hành chính',
    updateFrequency: 'Hằng năm',
    status: 'active',
    featureCount: 12,
  },

  // Tourism
  {
    id: 'layer-tourism',
    name: 'Điểm du lịch & Di tích',
    shortLabel: 'Du lịch & Di tích',
    dataGroup: 'tourism',
    geometryType: 'point',
    order: 3,
    visibleByDefault: true,
    styleConfig: { color: '#8b5cf6', radius: 7, icon: 'MapPin' },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Phòng Văn hóa - Thông tin',
    updateFrequency: 'Hằng năm',
    status: 'active',
    featureCount: MOCK_TOURISM_POIS.length,
  },

  // Public Facilities
  {
    id: 'layer-health',
    name: 'Cơ sở y tế',
    shortLabel: 'Y tế',
    dataGroup: 'health',
    geometryType: 'point',
    order: 4,
    visibleByDefault: true,
    styleConfig: { color: '#10b981', radius: 7, icon: 'HeartPulse' },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Trạm Y tế xã Lao Bảo',
    updateFrequency: 'Hằng quý',
    status: 'active',
    featureCount: MOCK_PUBLIC_FACILITIES.filter((f) => f.facilityType === 'health_station').length,
  },
  {
    id: 'layer-education',
    name: 'Trường học & Điểm trường',
    shortLabel: 'Giáo dục',
    dataGroup: 'education',
    geometryType: 'point',
    order: 5,
    visibleByDefault: true,
    styleConfig: { color: '#f59e0b', radius: 7, icon: 'GraduationCap' },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Phòng Giáo dục - Đào tạo',
    updateFrequency: 'Hằng quý',
    status: 'active',
    featureCount: MOCK_PUBLIC_FACILITIES.filter((f) => f.facilityType === 'school').length,
  },
  {
    id: 'layer-cultural',
    name: 'Nhà văn hóa thôn',
    shortLabel: 'Nhà văn hóa',
    dataGroup: 'welfare',
    geometryType: 'point',
    order: 6,
    visibleByDefault: true,
    styleConfig: { color: '#3b82f6', radius: 7, icon: 'Landmark' },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'UBND xã Lao Bảo',
    updateFrequency: 'Hằng năm',
    status: 'active',
    featureCount: MOCK_PUBLIC_FACILITIES.filter((f) => f.facilityType === 'cultural_house').length,
  },
  {
    id: 'layer-admin-offices',
    name: 'Hành chính & Hạ tầng',
    shortLabel: 'HC & Hạ tầng',
    dataGroup: 'administrative',
    geometryType: 'point',
    order: 7,
    visibleByDefault: true,
    styleConfig: { color: '#6366f1', radius: 6, icon: 'Building' },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'UBND xã Lao Bảo',
    updateFrequency: 'Hằng năm',
    status: 'active',
    featureCount: MOCK_PUBLIC_FACILITIES.filter(
      (f) => ['administrative_office', 'market', 'sports_facility', 'water_facility', 'public_infrastructure'].includes(f.facilityType)
    ).length,
  },

  // Disaster
  {
    id: 'layer-disaster-landslide',
    name: 'Vùng nguy cơ sạt lở',
    shortLabel: 'Sạt lở',
    dataGroup: 'disaster',
    geometryType: 'polygon',
    order: 8,
    visibleByDefault: true,
    styleConfig: { color: '#dc2626', fillColor: '#fca5a5', weight: 2 },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Ban Chỉ huy PCTT xã',
    updateFrequency: 'Theo mùa',
    status: 'active',
    featureCount: MOCK_DISASTER_RISK_ZONES.filter((z) => z.riskType === 'landslide').length,
  },
  {
    id: 'layer-disaster-flood',
    name: 'Vùng nguy cơ ngập lụt',
    shortLabel: 'Ngập lụt',
    dataGroup: 'disaster',
    geometryType: 'polygon',
    order: 9,
    visibleByDefault: true,
    styleConfig: { color: '#0ea5e9', fillColor: '#bae6fd', weight: 2 },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Ban Chỉ huy PCTT xã',
    updateFrequency: 'Theo mùa',
    status: 'active',
    featureCount: MOCK_DISASTER_RISK_ZONES.filter((z) => z.riskType === 'flooding' || z.riskType === 'erosion' || z.riskType === 'critical_area').length,
  },

  // Security/Defense (confidential)
  {
    id: 'layer-defense',
    name: 'Mốc quốc phòng & Vùng cấm QP-AN',
    shortLabel: 'QP-AN (Mật)',
    dataGroup: 'security_defense',
    geometryType: 'point',
    order: 10,
    visibleByDefault: false,
    styleConfig: { color: '#dc2626', radius: 7 },
    securityLevel: 'confidential',
    allowedRoles: ['admin', 'data_governance', 'commune_leader'],
    source: 'Ban Chỉ huy Quân sự xã',
    updateFrequency: 'Mật',
    status: 'active',
    featureCount: 0, // hidden count for confidential
  },
  {
    id: 'layer-current-state',
    name: 'Hiện trạng (minh họa)',
    shortLabel: 'Hiện trạng',
    dataGroup: 'land',
    geometryType: 'polygon',
    order: 11,
    visibleByDefault: false,
    styleConfig: { color: '#0284c7', fillColor: '#38bdf8', weight: 2 },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Dữ liệu minh họa POC',
    updateFrequency: 'Theo phiên bản',
    status: 'active',
    featureCount: 1,
  },
  {
    id: 'layer-planned-state',
    name: 'Kế hoạch (minh họa)',
    shortLabel: 'Kế hoạch',
    dataGroup: 'land',
    geometryType: 'polygon',
    order: 12,
    visibleByDefault: false,
    styleConfig: { color: '#7c3aed', fillColor: '#a78bfa', weight: 2 },
    securityLevel: 'public',
    allowedRoles: ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
    source: 'Dữ liệu minh họa POC',
    updateFrequency: 'Theo phiên bản',
    status: 'active',
    featureCount: 1,
  },
];

// ─── Layer Groups ─────────────────────────────────────────────────────────────

export const GIS_LAYER_GROUPS: GisLayerGroup[] = [
  {
    id: 'administrative',
    label: 'Hành chính',
    icon: 'Map',
    layers: ['layer-commune', 'layer-villages', 'layer-village-labels'],
  },
  {
    id: 'tourism',
    label: 'Du lịch & Lịch sử',
    icon: 'Compass',
    layers: ['layer-tourism'],
  },
  {
    id: 'facilities',
    label: 'Công trình công cộng',
    icon: 'Building2',
    layers: ['layer-health', 'layer-education', 'layer-cultural', 'layer-admin-offices'],
  },
  {
    id: 'disaster',
    label: 'Thiên tai & Cảnh báo',
    icon: 'AlertTriangle',
    layers: ['layer-disaster-landslide', 'layer-disaster-flood'],
  },
  {
    id: 'planning',
    label: 'Đối chiếu quy hoạch',
    icon: 'Layers',
    layers: ['layer-current-state', 'layer-planned-state'],
  },
];

// ─── Legacy spatial features (kept for backward compat) ────────────────────────

export const INITIAL_SPATIAL_FEATURES: SpatialFeature[] = [
  {
    id: 'feat-1',
    layerId: 'layer-education',
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
    layerId: 'layer-health',
    name: 'Trạm Y tế xã Lao Bảo',
    description: 'Cơ sở khám chữa bệnh ban đầu của xã.',
    geometry: { type: 'Point', coordinates: [106.590, 16.648] },
    linkedEntityType: 'healthFacility',
    linkedEntityId: 'hf-1',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&auto=format&fit=crop&q=60',
    properties: { 'Cán bộ y tế': '7 nhân viên', 'Số giường bệnh': '12 giường' },
  },
];
