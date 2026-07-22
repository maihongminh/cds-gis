export type CropChangeReason =
  | 'cropConversion'
  | 'naturalDisaster'
  | 'disease'
  | 'poorHarvest'
  | 'marketChange'
  | 'landChange'
  | 'other';

export interface CropChangeRecord {
  id: string;
  cropRecordId: string;
  householdId: string;
  villageCode: string;
  villageName: string;
  cropTypeCode: string;
  cropTypeName: string;
  year: number;
  period: string; // e.g. "2025-DH", "2026-XH"
  previousAreaHa: number;
  currentAreaHa: number;
  areaChangeHa: number;
  previousOutputKg: number;
  currentOutputKg: number;
  outputChangeKg: number;
  changePercent: number;
  reason: CropChangeReason;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
