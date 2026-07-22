export type LivestockDiseaseStatus = 'none' | 'monitoring' | 'quarantined' | 'treated';
export type LivestockRecordStatus = 'active' | 'inactive';

export interface LivestockRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  livestockTypeCode: string;
  livestockTypeName: string;
  quantity: number;
  vaccinatedQuantity: number;
  lastVaccinatedDate?: string;
  diseaseQuantity: number;
  diseaseType?: string;
  diseaseStatus: LivestockDiseaseStatus;
  notes?: string;
  status: LivestockRecordStatus;
  createdAt: string;
  updatedAt: string;
}
