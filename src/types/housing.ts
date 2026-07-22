export type HousingType = 'kiên cố' | 'bán kiên cố' | 'nhà tạm' | 'dột nát';
export type HousingSupportStatus = 'completed' | 'ongoing' | 'pending' | 'rejected';

export interface HousingRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  housingType: HousingType;
  areaSqm: number;
  builtYear: number;
  conditionRating: 'good' | 'average' | 'poor' | 'dangerous';
  degradationPercentage: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HousingSupportRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  programName: string; // e.g. "Chương trình 1719", "Xóa nhà tạm"
  supportType: 'buildNew' | 'repair';
  amountVnd: number;
  year: number;
  status: HousingSupportStatus;
  notes?: string;
}

export interface HousingSupportNeed {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  needType: 'buildNew' | 'repair';
  priorityLevel: 'high' | 'medium' | 'low';
  estimatedCostVnd: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

export type HousingItem =
  | HousingRecord
  | HousingSupportRecord
  | HousingSupportNeed;
