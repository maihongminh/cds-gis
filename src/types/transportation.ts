export type RoadSurfaceType =
  | "asphalt"
  | "concrete"
  | "gravel"
  | "soil"
  | "mixed";

export type RoadCategory =
  | "communeRoad"
  | "villageRoad"
  | "fieldRoad"
  | "productionRoad"
  | "other";

export type InfrastructureCondition =
  | "good"
  | "fair"
  | "degraded"
  | "dangerous"
  | "closed";

export type TrafficIncidentType =
  | "landslide"
  | "flooding"
  | "erosion"
  | "bridgeDamage"
  | "roadDamage"
  | "other";

export type MaintenanceProgress =
  | "planned"
  | "approved"
  | "inProgress"
  | "completed"
  | "delayed";

export interface RoadRecord {
  id: string;
  code: string;
  name: string;
  startPoint: string;
  endPoint: string;
  villageCodes: string[];
  villageNames: string[];
  lengthKm: number;
  category: RoadCategory;
  surfaceType: RoadSurfaceType;
  builtOrUpgradedYear: number;
  latestRepairYear?: number;
  condition: InfrastructureCondition;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportStructureRecord {
  id: string;
  code: string;
  name: string;
  roadId: string;
  roadName: string;
  kmPosition?: string;
  villageCode: string;
  villageName: string;
  type: "suspensionBridge" | "concreteBridge" | "culvert" | "overflowSpillway" | "other";
  loadCapacityTon?: number;
  builtYear: number;
  condition: InfrastructureCondition;
  riskLevel: "low" | "medium" | "high";
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrafficDisruptionRecord {
  id: string;
  code: string;
  roadId?: string;
  roadName?: string;
  structureId?: string;
  structureName?: string;
  villageCode: string;
  villageName: string;
  incidentType: TrafficIncidentType;
  severity: "low" | "medium" | "high" | "critical";
  affectedArea: string;
  occurredAt: string;
  reopenedAt?: string;
  disruptionDays: number;
  description: string;
  status: "open" | "monitoring" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface RoadMaintenancePlan {
  id: string;
  code: string;
  targetType: "road" | "structure";
  roadId?: string;
  roadName?: string;
  structureId?: string;
  structureName?: string;
  villageCode: string;
  villageName: string;
  workItems: string[];
  estimatedBudgetVnd: number;
  fundingSource: "communeBudget" | "districtBudget" | "newRuralProgram" | "other";
  implementingUnit: string;
  progress: MaintenanceProgress;
  plannedStartDate: string;
  plannedCompletionDate: string;
  actualCompletionDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrafficSafetyRecord {
  id: string;
  code: string;
  month: number;
  year: number;
  villageCode?: string;
  villageName?: string;
  totalIncidents: number;
  resolvedIncidents: number;
  unresolvedIncidents: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportationSummary {
  totalRoads: number;
  totalRoadLengthKm: number;
  concreteOrAsphaltRate: number;
  totalStructures: number;
  degradedStructures: number;
  dangerousStructures: number;
  openDisruptions: number;
  totalDisruptionDaysThisYear: number;
  maintenancePlansInProgress: number;
  trafficSafetyIncidentsThisYear: number;
}

export type TransportationItem =
  | { tab: 'roads'; data: RoadRecord }
  | { tab: 'structures'; data: TransportStructureRecord }
  | { tab: 'disruptions'; data: TrafficDisruptionRecord }
  | { tab: 'maintenance'; data: RoadMaintenancePlan }
  | { tab: 'safety'; data: TrafficSafetyRecord };
