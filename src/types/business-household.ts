export interface BusinessHouseholdRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  businessName: string;
  industry: string; // e.g. "Tạp hóa", "Sửa xe", "Xay xát", "Thu mua quế"
  scale: 'small' | 'medium' | 'large';
  hasRegistration: boolean;
  registrationNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRevenueRecord {
  id: string;
  businessId: string;
  businessName: string;
  householdHeadName: string;
  period: string; // e.g. "Quý 1/2026", "Năm 2025"
  estimatedRevenueVnd: number;
  dataSource: 'taxDeclaration' | 'survey' | 'estimate';
  notes?: string;
}

export interface NonAgriculturalLaborRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  totalLaborCount: number;
  nonAgriculturalLaborCount: number;
  awayLaborCount: number; // labor working far away (đi làm ăn xa)
  year: number;
}

export type BusinessHouseholdItem =
  | BusinessHouseholdRecord
  | BusinessRevenueRecord
  | NonAgriculturalLaborRecord;
