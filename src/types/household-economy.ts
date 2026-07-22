import { EconomicClassification } from './household';

export type HouseholdEconomyStatus = 'active' | 'inactive';

export interface HouseholdEconomyRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  year: number;
  cropRevenue: number;
  livestockRevenue: number;
  forestDvmtrRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
  cropCost: number;
  livestockCost: number;
  forestDvmtrCost: number;
  otherCost: number;
  totalCost: number;
  netIncome: number;
  incomePerCapita: number;
  economicClassificationBefore: EconomicClassification;
  economicClassificationAfter: EconomicClassification;
  supportPoliciesReceived: string[];
  status: HouseholdEconomyStatus;
  createdAt: string;
  updatedAt: string;
}
