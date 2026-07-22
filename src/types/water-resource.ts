export interface GroundwaterPermitRecord {
  id: string;
  permitNumber: string;
  ownerName: string;
  villageCode: string;
  villageName: string;
  depthMeters: number;
  capacityM3Day: number;
  purpose: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface CleanWaterUsageRecord {
  id: string;
  villageCode: string;
  villageName: string;
  totalHouseholds: number;
  cleanWaterHouseholds: number;
  percentage: number;
  year: number;
}

export interface HygienicWaterUsageRecord {
  id: string;
  villageCode: string;
  villageName: string;
  totalHouseholds: number;
  hygienicWaterHouseholds: number;
  percentage: number;
  year: number;
}

export interface CentralizedWaterFacility {
  id: string;
  facilityName: string;
  facilityType: 'gravity' | 'pump' | 'drilledWell' | 'other';
  villageCode: string;
  villageName: string;
  capacityM3Day: number;
  servedHouseholds: number;
  managementUnit: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastCheckedDate: string;
}

export interface SmallWaterFacility {
  id: string;
  householdId: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  facilityType: 'diggedWell' | 'drilledWell' | 'gravityTank' | 'rainwaterHarvest';
  isHygienic: boolean;
  status: 'active' | 'inactive';
}

export interface WaterTreatmentSystem {
  id: string;
  systemName: string;
  technology: string;
  capacityM3Day: number;
  location: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastInspectionDate: string;
}

export type WaterItem =
  | GroundwaterPermitRecord
  | CleanWaterUsageRecord
  | HygienicWaterUsageRecord
  | CentralizedWaterFacility
  | SmallWaterFacility
  | WaterTreatmentSystem;
