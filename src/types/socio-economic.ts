export interface EconomicIndicatorRecord {
  id: string;
  year: number;
  gdpGrowthPercent: number;
  totalProductionValueBillion: number;
  agricultureProductionValueBillion: number;
  industryConstructionValueBillion: number;
  serviceValueBillion: number;
  averageIncomePerCapitaMillion: number;
  budgetRevenueMillion: number;
  budgetExpenditureMillion: number;
  note?: string;
}

export interface SocialIndicatorRecord {
  id: string;
  year: number;
  villageCode?: string; // If undefined, it represents the entire commune
  villageName?: string;
  totalPopulation: number;
  totalHouseholds: number;
  poorHouseholdsCount: number;
  poorHouseholdsPercent: number;
  nearPoorHouseholdsCount: number;
  nearPoorHouseholdsPercent: number;
  nationalStandardSchoolsCount?: number; // Only for commune level
  cultureVillagePercent?: number; // Only for commune level
  healthInsurancePercent: number;
  note?: string;
}

export interface LaborEmploymentIndicatorRecord {
  id: string;
  year: number;
  villageCode?: string;
  villageName?: string;
  workingAgePopulation: number;
  trainedLaborCount: number;
  trainedLaborPercent: number;
  agriculturalLaborCount: number;
  nonAgriculturalLaborCount: number;
  unemployedCount: number;
  note?: string;
}

export interface InfrastructureIndicatorRecord {
  id: string;
  year: number;
  villageCode?: string;
  villageName?: string;
  concreteRoadPercent: number;
  nationalGridPowerPercent: number;
  solidHousePercent: number;
  hygienicLatrinePercent: number;
  irrigationChannelConcretePercent: number;
  note?: string;
}

export type SocioEconomicItem =
  | EconomicIndicatorRecord
  | SocialIndicatorRecord
  | LaborEmploymentIndicatorRecord
  | InfrastructureIndicatorRecord;

