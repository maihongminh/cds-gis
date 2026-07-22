export type EconomicClassification = 'poor' | 'nearPoor' | 'average' | 'betterOff';
export type HouseholdStatus = 'active' | 'changed' | 'archived';

export interface Household {
  id: string;
  code: string;
  headName: string;
  identityNumber: string;
  phone: string;
  hamletCode: string;
  hamletName: string;
  ethnicity: string;
  localGroup?: string;
  memberCount: number;
  agriculturalLaborCount: number;
  establishedYear: number;
  economicClassification: EconomicClassification;
  mainCropTypes: string[];
  livestockTypes: string[];
  totalLandAreaHa: number;
  totalAnnualIncome: number;
  totalAnnualCost: number;
  netAnnualIncome: number;
  incomePerCapita: number;
  status: HouseholdStatus;
  createdAt: string;
  updatedAt: string;
}
