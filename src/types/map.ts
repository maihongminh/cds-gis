// src/types/map.ts
// Extended GIS types for Lao Bao digital map demo

import { DataGroup, SecurityLevel } from './data-governance';

// ─── Administrative Boundary ─────────────────────────────────────────────────

export interface AdministrativeBoundary {
  code: string;
  name: string;
  type: 'commune' | 'village';
  areaHa: number;
  centerCoordinate: [number, number]; // [Lng, Lat]
  geometryGeoJson: Record<string, unknown>; // EPSG:4326 GeoJSON
  disclaimer: string;
}

// ─── Layer & Feature (existing, kept for compatibility) ───────────────────────

export interface MapLayer {
  id: string;
  name: string;
  dataGroup: DataGroup;
  geometryType: 'point' | 'line' | 'polygon';
  order: number;
  visibleByDefault: boolean;
  styleConfig: Record<string, unknown>;
  securityLevel: SecurityLevel;
}

export interface SpatialFeature {
  id: string;
  layerId: string;
  name: string;
  geometryGeoJson: Record<string, unknown>; // EPSG:4326 Point, LineString, or Polygon
  linkedEntityType: string;
  linkedEntityId: string;
  properties: Record<string, unknown>;
}

export interface LayerPermission {
  layerId: string;
  allowedRoles: string[];
  maxSecurityLevel: SecurityLevel;
}

// ─── Layer Groups ─────────────────────────────────────────────────────────────

export type GisLayerGroupId =
  | 'administrative'
  | 'tourism'
  | 'facilities'
  | 'disaster'
  | 'planning';

export interface GisLayerGroup {
  id: GisLayerGroupId;
  label: string;
  icon: string;
  layers: string[]; // layer IDs
}

// ─── Tourism POI ──────────────────────────────────────────────────────────────

export type TourismPoiType =
  | 'tourist_attraction'
  | 'historical_site'
  | 'scenic_spot'
  | 'check_in'
  | 'local_product_point';

export type OperatingStatus = 'open' | 'closed' | 'seasonal' | 'under_renovation';

export interface TourismPoi {
  id: string;
  code: string;
  name: string;
  type: TourismPoiType;
  villageCode: string;
  villageName: string;
  /** [Lng, Lat] in EPSG:4326 */
  coordinates: [number, number];
  shortDescription: string;
  operatingStatus: OperatingStatus;
  openingHours?: string;
  contact?: string;
  imagePlaceholder?: string;
  securityLevel: SecurityLevel;
  dataStatus: 'mock' | 'verified';
  linkedEntityType?: string;
  linkedEntityId?: string;
}

// ─── Public Facility ──────────────────────────────────────────────────────────

export type PublicFacilityType =
  | 'health_station'
  | 'school'
  | 'cultural_house'
  | 'administrative_office'
  | 'market'
  | 'sports_facility'
  | 'water_facility'
  | 'public_infrastructure';

export type FacilityCondition = 'good' | 'fair' | 'needs_attention';
export type FacilityOperatingStatus = 'active' | 'limited' | 'inactive';

export interface PublicFacility {
  id: string;
  code: string;
  name: string;
  facilityType: PublicFacilityType;
  villageCode: string;
  villageName: string;
  /** [Lng, Lat] in EPSG:4326 */
  coordinates: [number, number];
  managingOrganization: string;
  addressDisplay: string;
  condition: FacilityCondition;
  operatingStatus: FacilityOperatingStatus;
  capacity?: string;
  securityLevel: SecurityLevel;
  dataStatus: 'mock' | 'verified';
  linkedEntityType?: string;
  linkedEntityId?: string;
}

// ─── Disaster Risk Zone ───────────────────────────────────────────────────────

export type DisasterRiskType =
  | 'landslide'
  | 'flooding'
  | 'erosion'
  | 'critical_area';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type DisasterRiskStatus =
  | 'monitoring'
  | 'warning'
  | 'active'
  | 'resolved';

export interface DisasterRiskZone {
  id: string;
  code: string;
  name: string;
  riskType: DisasterRiskType;
  riskLevel: RiskLevel;
  villageCodes: string[];
  /** GeoJSON Polygon or Point geometry [Lng, Lat] coordinates */
  geometry: {
    type: 'Polygon' | 'Point';
    coordinates: [number, number][][] | [number, number];
  };
  affectedAreaHa: number;
  affectedPopulationEstimate: number;
  lastAssessmentDate: string;
  warningMessage: string;
  recommendedAction: string;
  status: DisasterRiskStatus;
  securityLevel: SecurityLevel;
  dataStatus: 'mock' | 'verified';
}

// ─── Selected Feature (for details panel) ────────────────────────────────────

export type SelectedFeatureKind =
  | 'village'
  | 'tourism'
  | 'facility'
  | 'disaster';

export interface SelectedFeature {
  kind: SelectedFeatureKind;
  id: string;
}
