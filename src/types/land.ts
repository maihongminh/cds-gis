export type LandOwnershipType = 'household' | 'communal' | 'rented' | 'other';
export type LandCertificateStatus = 'granted' | 'pending' | 'none';
export type LandRecordStatus = 'active' | 'inactive';

export interface LandRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  landTypeCode: string;
  landTypeName: string;
  parcelCode: string;
  mapSheetNumber?: string;
  areaHa: number;
  ownershipType: LandOwnershipType;
  certificateStatus: LandCertificateStatus;
  certificateNumber?: string;
  purpose: string;
  status: LandRecordStatus;
  createdAt: string;
  updatedAt: string;
}
