// src/types/reporting.ts

import { SecurityLevel, DataGroup } from './data-governance';

export type ReportingPeriod = string;

export type IndicatorCategory = "dailyMonthly" | "socioEconomicPlan" | "emergency" | "assignedTasks";

export interface IndicatorDefinition {
  id: string;
  code: string; // IND-A-001 -> IND-A-031 etc.
  name: string;
  category: IndicatorCategory;
  unit: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  reportingUnit: string;      // Organization unit ID in charge
  databaseCatalog: string;    // Related dataset code
  databaseOwner: string;      // Related schema owner
  securityLevel: SecurityLevel;
}

export interface IndicatorValue {
  id: string;
  indicatorCode: string;
  period: string;
  currentValue: number;
  targetValue?: number;
  previousValue?: number;
  status: "on_track" | "warning" | "critical";
  lastUpdatedAt: string;
}

export interface ImportJob {
  id: string;
  dataGroup: DataGroup;
  fileName: string;
  startedAt: string;
  completedAt?: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
  status: "processing" | "success" | "failed";
  errors: ImportRowError[];
}

export interface ImportRowError {
  rowNumber: number;
  columnName?: string;
  errorMessage: string;
}

export interface ExportJob {
  id: string;
  requestedBy: string;
  requestedAt: string;
  filtersUsed: Record<string, any>;
  format: "xlsx" | "csv" | "pdf";
  downloadUrl?: string;
  status: "queued" | "generating" | "completed" | "failed";
}
