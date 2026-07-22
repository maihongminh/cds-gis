export interface DashboardMetricSummary {
  totalHouseholds: number;
  totalCropsAreaHa: number;
  totalLivestockCount: number;
  totalForestContractedAreaHa: number;
  totalAnnualRevenue: number;
  totalAnnualCost: number;
  totalNetIncome: number;
  totalDvmtrPaid: number;
  averageIncomePerCapita: number;
  
  poorHouseholdsCount: number;
  nearPoorHouseholdsCount: number;
  averageHouseholdsCount: number;
  betterOffHouseholdsCount: number;
  
  povertyRate: number; // percentage
  nearPovertyRate: number; // percentage

  // Environment KPIs (v1.1)
  totalWasteTonsMonth: number;
  wasteCollectionRate: number;
  wasteClassificationRate: number;
  centralizedWasteTreatmentCount: number;
  envPermitsActiveCount: number;

  // Water Resource KPIs (v1.1)
  cleanWaterUsageRate: number;
  hygienicWaterUsageRate: number;
  centralizedWaterFacilityCount: number;
  smallWaterFacilityCount: number;
  groundwaterPermitCount: number;

  // Climate KPIs (v1.1)
  disasterEventsCountYear: number;
  disasterDamageEstimate: number;
  activeRiskAlertsCount: number;

  // Housing KPIs (v1.1)
  solidHouseholdsPercent: number;
  needsHousingSupportCount: number;
  housingSupportGivenCount: number;

  // Business Household KPIs (v1.1)
  businessHouseholdsCount: number;
  businessRegistrationRate: number;
  totalBusinessRevenueEstimate: number;
  nonAgLaborCount: number;

  // Irrigation KPIs (v1.1)
  irrigationFacilityCount: number;
  irrigationNeedsRepairCount: number;
  irrigationDamagedCount: number;
  irrigationAreaHa: number;

  // Transportation KPIs
  totalRoads?: number;
  totalRoadLengthKm?: number;
  concreteOrAsphaltRate?: number;
  totalStructures?: number;
  degradedStructures?: number;
  dangerousStructures?: number;
  openDisruptions?: number;
  totalDisruptionDaysThisYear?: number;
  maintenancePlansInProgress?: number;
  trafficSafetyIncidentsThisYear?: number;
}

export interface HamletMetricSummary {
  hamletCode: string;
  hamletName: string;
  totalHouseholds: number;
  totalCropsAreaHa: number;
  totalLivestockCount: number;
  totalForestContractedAreaHa: number;
  povertyRate: number;
  averageIncomePerCapita: number;
}

export interface DashboardAlert {
  id: string;
  type: 'disease' | 'poverty' | 'system' | 'land';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  date: string;
  resolved: boolean;
}

export interface DashboardSummary {
  communeCode: string;
  communeName: string;
  hamletCode?: string; // If filtered by a single hamlet
  metrics: DashboardMetricSummary;
  hamletDistribution: HamletMetricSummary[];
  alerts: DashboardAlert[];
  cropDistribution: { cropTypeCode: string; cropTypeName: string; areaHa: number; percentage: number }[];
  livestockDistribution: { livestockTypeCode: string; livestockTypeName: string; quantity: number; percentage: number }[];
}

export type IndicatorGroupCode = "A" | "B" | "C" | "D";

export interface DashboardIndicator {
  id: string;
  groupCode: IndicatorGroupCode;
  sourceIndex: number;
  name: string;
  unit: string;
  reportingFrequency: string;
  reportingUnit: string;
  dataSource: string;
  status: "normal" | "warning" | "critical";
  updatedAt: string;
}

