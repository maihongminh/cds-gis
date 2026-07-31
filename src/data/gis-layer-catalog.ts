import type { GisLayerGroup } from '@/types/map';
import type { MapMarkerIconName } from '@/lib/map-style-config';
import { MOCK_VILLAGE_BOUNDARIES } from './mock-laobao-boundary';
import { MOCK_DISASTER_RISK_ZONES } from './mock-map-disaster-risks';
import { MOCK_PUBLIC_FACILITIES } from './mock-map-public-facilities';
import { MOCK_TOURISM_POIS } from './mock-map-tourism-pois';

export type MapDataGroup = GisLayerGroup['id'];

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
    markerIcon?: MapMarkerIconName;
  };
  securityLevel: 'public' | 'confidential';
  allowedRoles: string[];
  source: string;
  updateFrequency: string;
  status: 'active' | 'inactive';
  featureCount?: number;
}

const ALL_ROLES = [
  'admin',
  'data_officer',
  'unit_leader',
  'data_governance',
  'commune_leader',
];
const CONFIDENTIAL_ROLES = ['admin', 'data_governance', 'commune_leader'];

interface LayerOptions {
  shortLabel?: string;
  visibleByDefault?: boolean;
  color?: string;
  fillColor?: string;
  weight?: number;
  radius?: number;
  icon?: string;
  markerIcon?: MapMarkerIconName;
  securityLevel?: MapLayer['securityLevel'];
  source?: string;
  updateFrequency?: string;
  featureCount?: number;
}

let layerOrder = 0;

function defineLayer(
  id: string,
  name: string,
  dataGroup: MapDataGroup,
  geometryType: MapLayer['geometryType'],
  options: LayerOptions = {},
): MapLayer {
  const securityLevel = options.securityLevel ?? 'public';
  return {
    id,
    name,
    shortLabel: options.shortLabel ?? name,
    dataGroup,
    geometryType,
    order: layerOrder++,
    visibleByDefault: options.visibleByDefault ?? false,
    styleConfig: {
      color: options.color ?? '#64748b',
      fillColor: options.fillColor,
      weight: options.weight,
      radius: options.radius ?? (geometryType === 'point' ? 7 : undefined),
      icon: options.icon,
      markerIcon: options.markerIcon,
    },
    securityLevel,
    allowedRoles:
      securityLevel === 'confidential' ? CONFIDENTIAL_ROLES : ALL_ROLES,
    source: options.source ?? 'Chưa kết nối dữ liệu',
    updateFrequency: options.updateFrequency ?? 'Theo nguồn dữ liệu',
    status: 'active',
    featureCount: Math.max(options.featureCount ?? 1, 1),
  };
}

const countTourismType = (type: string) =>
  MOCK_TOURISM_POIS.filter((feature) => feature.type === type).length;
const countFacilityType = (type: string) =>
  MOCK_PUBLIC_FACILITIES.filter(
    (feature) => feature.facilityType === type,
  ).length;
const countRiskType = (...types: string[]) =>
  MOCK_DISASTER_RISK_ZONES.filter((feature) =>
    types.includes(feature.riskType),
  ).length;

export const INITIAL_MAP_LAYERS: MapLayer[] = [
  defineLayer(
    'layer-commune',
    'Ranh giới xã',
    'administrative_population',
    'polygon',
    {
      visibleByDefault: true,
      color: '#1d4ed8',
      fillColor: '#3b82f6',
      weight: 3,
      source: 'Phòng Tài nguyên - Môi trường',
      updateFrequency: 'Hằng năm',
      featureCount: 1,
    },
  ),
  defineLayer(
    'layer-villages',
    'Ranh giới thôn',
    'administrative_population',
    'polygon',
    {
      visibleByDefault: true,
      color: '#64748b',
      fillColor: '#94a3b8',
      weight: 1.5,
      source: 'Phòng Tài nguyên - Môi trường',
      updateFrequency: 'Hằng năm',
      featureCount: MOCK_VILLAGE_BOUNDARIES.features.length,
    },
  ),
  defineLayer(
    'layer-village-labels',
    'Nhãn thôn',
    'administrative_population',
    'point',
    {
      visibleByDefault: true,
      color: '#1e293b',
      source: 'Master data hành chính',
      updateFrequency: 'Hằng năm',
      featureCount: MOCK_VILLAGE_BOUNDARIES.features.length,
    },
  ),
  defineLayer(
    'layer-households',
    'Hộ dân',
    'administrative_population',
    'point',
    {
      color: '#2563eb',
      icon: 'House',
      markerIcon: 'home',
      source: 'Dữ liệu mô phỏng POC',
      updateFrequency: 'Theo đợt rà soát',
      featureCount: 36,
    },
  ),
  defineLayer(
    'layer-population-ethnicity',
    'Theo dân tộc',
    'administrative_population',
    'polygon',
    { color: '#7c3aed', fillColor: '#c4b5fd' },
  ),
  defineLayer(
    'layer-working-age-population',
    'Theo độ tuổi lao động',
    'administrative_population',
    'polygon',
    {
      color: '#0891b2',
      fillColor: '#67e8f9',
      source: 'Tổng hợp từ cụm hộ dân mô phỏng',
      updateFrequency: 'Theo đợt rà soát',
      featureCount: 6,
    },
  ),

  defineLayer(
    'layer-active-enterprises',
    'Doanh nghiệp đang hoạt động',
    'economy',
    'point',
    { color: '#0369a1', icon: 'Building' },
  ),
  defineLayer('layer-cooperatives', 'Hợp tác xã', 'economy', 'point', {
    color: '#0f766e',
    icon: 'Building',
  }),
  defineLayer('layer-business-households', 'Hộ kinh doanh', 'economy', 'point', {
    color: '#c2410c',
    icon: 'Building',
  }),
  defineLayer(
    'layer-markets',
    'Chợ, trung tâm thương mại',
    'economy',
    'point',
    {
      color: '#ea580c',
      icon: 'Building',
      markerIcon: 'market',
      source: 'UBND xã Lao Bảo',
      featureCount: countFacilityType('market'),
    },
  ),
  defineLayer(
    'layer-service-logistics',
    'Điểm dịch vụ, logistics',
    'economy',
    'point',
    { color: '#0284c7', icon: 'MapPin' },
  ),
  defineLayer(
    'layer-production-business-facilities',
    'Cơ sở sản xuất kinh doanh',
    'economy',
    'point',
    { color: '#b45309', icon: 'Building' },
  ),
  defineLayer('layer-investment-projects', 'Dự án đầu tư', 'economy', 'polygon', {
    color: '#9333ea',
    fillColor: '#d8b4fe',
  }),

  defineLayer(
    'layer-tourist-attractions',
    'Điểm du lịch',
    'tourism_trade_services',
    'point',
    {
      color: '#8b5cf6',
      icon: 'MapPin',
      markerIcon: 'attraction',
      source: 'Phòng Văn hóa - Thông tin',
      featureCount: countTourismType('tourist_attraction'),
    },
  ),
  defineLayer(
    'layer-historical-sites',
    'Di tích lịch sử',
    'tourism_trade_services',
    'point',
    {
      color: '#d97706',
      icon: 'Landmark',
      markerIcon: 'landmark',
      source: 'Phòng Văn hóa - Thông tin',
      featureCount: countTourismType('historical_site'),
    },
  ),
  defineLayer(
    'layer-scenic-spots',
    'Danh lam thắng cảnh',
    'tourism_trade_services',
    'point',
    {
      color: '#10b981',
      icon: 'MapPin',
      markerIcon: 'mountain',
      source: 'Phòng Văn hóa - Thông tin',
      featureCount: countTourismType('scenic_spot'),
    },
  ),
  defineLayer(
    'layer-check-ins',
    'Điểm check-in',
    'tourism_trade_services',
    'point',
    {
      color: '#ec4899',
      icon: 'MapPin',
      markerIcon: 'camera',
      source: 'Phòng Văn hóa - Thông tin',
      featureCount: countTourismType('check_in'),
    },
  ),
  defineLayer('layer-restaurants', 'Nhà hàng', 'tourism_trade_services', 'point', {
    color: '#f97316',
    icon: 'MapPin',
  }),
  defineLayer(
    'layer-accommodations',
    'Khách sạn, nhà nghỉ, cơ sở lưu trú',
    'tourism_trade_services',
    'point',
    { color: '#4f46e5', icon: 'Building' },
  ),

  defineLayer(
    'layer-technical-infrastructure',
    'Công trình hạ tầng kỹ thuật',
    'land_planning_construction',
    'point',
    {
      color: '#475569',
      icon: 'Building',
      markerIcon: 'infrastructure',
      source: 'UBND xã Lao Bảo',
      featureCount: countFacilityType('public_infrastructure'),
    },
  ),
  defineLayer(
    'layer-administrative-offices',
    'Trụ sở cơ quan',
    'land_planning_construction',
    'point',
    {
      color: '#6366f1',
      icon: 'Building',
      markerIcon: 'building',
      source: 'UBND xã Lao Bảo',
      featureCount: countFacilityType('administrative_office'),
    },
  ),
  defineLayer(
    'layer-active-investment-projects',
    'Dự án đầu tư đang triển khai',
    'land_planning_construction',
    'polygon',
    { color: '#7c3aed', fillColor: '#c4b5fd', featureCount: 2 },
  ),
  defineLayer(
    'layer-land-use-planning',
    'Quy hoạch sử dụng đất',
    'land_planning_construction',
    'polygon',
    {
      color: '#0284c7',
      fillColor: '#7dd3fc',
      source: 'Dữ liệu minh họa POC hiện trạng / kế hoạch',
      updateFrequency: 'Theo phiên bản',
      featureCount: 2,
    },
  ),
  defineLayer(
    'layer-construction-planning',
    'Quy hoạch xây dựng',
    'land_planning_construction',
    'polygon',
    { color: '#d97706', fillColor: '#fcd34d', featureCount: 2 },
  ),
  defineLayer(
    'layer-zoning-planning',
    'Quy hoạch phân khu',
    'land_planning_construction',
    'polygon',
    { color: '#9333ea', fillColor: '#d8b4fe', featureCount: 2 },
  ),
  defineLayer(
    'layer-urban-development-areas',
    'Các khu vực phát triển đô thị',
    'land_planning_construction',
    'polygon',
    { color: '#db2777', fillColor: '#f9a8d4' },
  ),

  defineLayer(
    'layer-environmental-pollution',
    'Điểm ô nhiễm môi trường',
    'agriculture_environment',
    'point',
    { color: '#dc2626', icon: 'MapPin' },
  ),
  defineLayer(
    'layer-water-supply',
    'Hệ thống cấp nước',
    'agriculture_environment',
    'point',
    {
      color: '#0891b2',
      icon: 'MapPin',
      markerIcon: 'water',
      source: 'UBND xã Lao Bảo',
      featureCount: countFacilityType('water_facility'),
    },
  ),
  defineLayer(
    'layer-waste-treatment',
    'Thu gom, xử lý rác thải',
    'agriculture_environment',
    'point',
    { color: '#65a30d', icon: 'MapPin' },
  ),

  defineLayer('layer-schools', 'Trường học', 'education_health', 'point', {
    color: '#f59e0b',
    icon: 'GraduationCap',
    markerIcon: 'school',
    source: 'Phòng Giáo dục - Đào tạo',
    featureCount: countFacilityType('school'),
  }),
  defineLayer(
    'layer-health-facilities',
    'Cơ sở y tế, bệnh viện',
    'education_health',
    'point',
    {
      color: '#10b981',
      icon: 'HeartPulse',
      markerIcon: 'medical',
      source: 'Trạm Y tế xã Lao Bảo',
      featureCount: countFacilityType('health_station'),
    },
  ),
  defineLayer(
    'layer-cultural-houses',
    'Nhà văn hóa',
    'education_health',
    'point',
    {
      color: '#3b82f6',
      icon: 'Landmark',
      markerIcon: 'landmark',
      source: 'UBND xã Lao Bảo',
      featureCount: countFacilityType('cultural_house'),
    },
  ),

  defineLayer('layer-poor-households', 'Hộ nghèo', 'social_welfare', 'point', {
    color: '#dc2626',
    icon: 'Building',
  }),
  defineLayer(
    'layer-near-poor-households',
    'Hộ cận nghèo',
    'social_welfare',
    'point',
    { color: '#ea580c', icon: 'Building' },
  ),
  defineLayer(
    'layer-social-protection',
    'Đối tượng bảo trợ xã hội',
    'social_welfare',
    'point',
    { color: '#7c3aed', icon: 'MapPin' },
  ),
  defineLayer(
    'layer-people-with-disabilities',
    'Người khuyết tật',
    'social_welfare',
    'point',
    { color: '#2563eb', icon: 'MapPin' },
  ),
  defineLayer('layer-elderly', 'Người cao tuổi', 'social_welfare', 'point', {
    color: '#0f766e',
    icon: 'MapPin',
  }),
  defineLayer(
    'layer-children-special-circumstances',
    'Trẻ em có hoàn cảnh đặc biệt',
    'social_welfare',
    'point',
    { color: '#db2777', icon: 'MapPin' },
  ),

  defineLayer(
    'layer-fire-prevention',
    'Điểm phòng cháy chữa cháy',
    'security_defense',
    'point',
    { color: '#dc2626', icon: 'MapPin' },
  ),
  defineLayer(
    'layer-defense-areas',
    'Khu vực quốc phòng',
    'security_defense',
    'polygon',
    {
      color: '#991b1b',
      fillColor: '#fca5a5',
      securityLevel: 'confidential',
      source: 'Ban Chỉ huy Quân sự xã',
      updateFrequency: 'Theo phân quyền',
    },
  ),

  defineLayer(
    'layer-disaster-prevention-works',
    'Công trình phòng chống thiên tai',
    'disaster_prevention',
    'point',
    { color: '#ca8a04', icon: 'MapPin' },
  ),
  defineLayer(
    'layer-landslide-risk',
    'Vùng có nguy cơ sạt lở',
    'disaster_prevention',
    'polygon',
    {
      color: '#dc2626',
      fillColor: '#fca5a5',
      source: 'Ban Chỉ huy PCTT xã',
      featureCount: countRiskType('landslide'),
    },
  ),
  defineLayer(
    'layer-flood-risk',
    'Vùng ngập lụt',
    'disaster_prevention',
    'polygon',
    {
      color: '#0ea5e9',
      fillColor: '#bae6fd',
      source: 'Ban Chỉ huy PCTT xã',
      featureCount: countRiskType('flooding'),
    },
  ),
  defineLayer(
    'layer-critical-areas',
    'Khu vực xung yếu',
    'disaster_prevention',
    'polygon',
    {
      color: '#ea580c',
      fillColor: '#fed7aa',
      source: 'Ban Chỉ huy PCTT xã',
      featureCount: countRiskType('erosion', 'critical_area'),
    },
  ),
];

export const GIS_LAYER_GROUPS: GisLayerGroup[] = [
  {
    id: 'administrative_population',
    label: 'Hành chính - Dân cư',
    icon: 'Map',
    layers: INITIAL_MAP_LAYERS.filter(
      (layer) => layer.dataGroup === 'administrative_population',
    ).map((layer) => layer.id),
  },
  {
    id: 'economy',
    label: 'Kinh tế',
    icon: 'BriefcaseBusiness',
    layers: INITIAL_MAP_LAYERS.filter(
      (layer) => layer.dataGroup === 'economy',
    ).map((layer) => layer.id),
  },
  {
    id: 'tourism_trade_services',
    label: 'Du lịch - Thương mại - Dịch vụ',
    icon: 'Compass',
    layers: INITIAL_MAP_LAYERS.filter(
      (layer) => layer.dataGroup === 'tourism_trade_services',
    ).map((layer) => layer.id),
  },
  {
    id: 'land_planning_construction',
    label: 'Đất đai - Quy hoạch - Xây dựng',
    icon: 'Construction',
    layers: INITIAL_MAP_LAYERS.filter(
      (layer) => layer.dataGroup === 'land_planning_construction',
    ).map((layer) => layer.id),
  },
  {
    id: 'agriculture_environment',
    label: 'Nông nghiệp - Môi trường',
    icon: 'Leaf',
    layers: INITIAL_MAP_LAYERS.filter(
      (layer) => layer.dataGroup === 'agriculture_environment',
    ).map((layer) => layer.id),
  },
  {
    id: 'education_health',
    label: 'Giáo dục - Y tế',
    icon: 'GraduationCap',
    layers: INITIAL_MAP_LAYERS.filter(
      (layer) => layer.dataGroup === 'education_health',
    ).map((layer) => layer.id),
  },
  {
    id: 'social_welfare',
    label: 'An sinh xã hội',
    icon: 'HeartHandshake',
    layers: INITIAL_MAP_LAYERS.filter(
      (layer) => layer.dataGroup === 'social_welfare',
    ).map((layer) => layer.id),
  },
  {
    id: 'security_defense',
    label: 'Quốc phòng - An ninh',
    icon: 'Shield',
    layers: INITIAL_MAP_LAYERS.filter(
      (layer) => layer.dataGroup === 'security_defense',
    ).map((layer) => layer.id),
  },
  {
    id: 'disaster_prevention',
    label: 'Phòng chống thiên tai',
    icon: 'AlertTriangle',
    layers: INITIAL_MAP_LAYERS.filter(
      (layer) => layer.dataGroup === 'disaster_prevention',
    ).map((layer) => layer.id),
  },
];

export const MAP_LAYER_BY_ID = new Map(
  INITIAL_MAP_LAYERS.map((layer) => [layer.id, layer]),
);
