export type CropDiseaseStatus = 'none' | 'monitoring' | 'treated';
export type CropRecordStatus = 'active' | 'inactive';

export interface CropRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  cropTypeCode: string;
  cropTypeName: string;
  areaHa: number;
  plantingYear: number;
  seasonYear: string;
  cultivationMethod: string;
  harvestOutputKg: number;
  salePrice: number;
  salesChannel: string;
  growingAreaCode?: string;
  diseaseStatus: CropDiseaseStatus;
  status: CropRecordStatus;
  createdAt: string;
  updatedAt: string;
}
