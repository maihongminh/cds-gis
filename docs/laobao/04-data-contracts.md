# 04 — Data Contracts (Draft Abstractions)

This document defines the core TypeScript data structures and contract interfaces for the Lao Bao project to standardize representations across all modules.

---

## 1. Shared Record Base
Every data record entered into any of the 9 digital data modules must extend this base structure:

```ts
export type WorkflowStatus = "draft" | "submitted" | "unit_approved" | "governance_approved" | "published" | "archived" | "returned";
export type SecurityLevel = "public" | "shared" | "confidential";

export interface DataRecordBase {
  id: string;                  // Unique uuid
  code: string;                // Human-readable code prefix, e.g., REC-ADM-001
  dataGroup: string;           // E.g., "administrative_population", "economy"
  recordType: string;          // Specific entity name: "village_stat", "enterprise", "crop"
  
  // Geographic context
  villageCode?: string;        // Optional, links to village code (e.g. TrieuPhuoc)
  villageName?: string;        // Optional, readable village name
  
  // Ownership & auditing
  organizationUnitId: string;  // Owning department ID
  reportingPeriod: string;     // Period string: e.g. "2026-Q1", "2026-M07", "2026"
  securityLevel: SecurityLevel;// public, shared, confidential
  workflowStatus: WorkflowStatus;
  
  // Versioning and auditing
  version: number;
  publishedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
```

---

## 2. Core Governance Types

### Data Group & Schema
```ts
export type DataGroup = "administrative_population" | "economy" | "tourism_services" | "land_planning" | "agriculture_environment" | "education_health" | "social_welfare" | "security_defense" | "disaster_emergency";

export interface DataSchema {
  id: string;
  dataGroup: DataGroup;
  typeName: string;
  fields: SchemaField[];
}

export interface SchemaField {
  name: string;
  label: string;
  type: "string" | "number" | "boolean" | "date" | "select" | "geometry";
  required: boolean;
  options?: string[]; // E.g., for select type
}
```

### Form Templates
```ts
export interface FormTemplate {
  id: string;
  title: string;
  dataGroup: DataGroup;
  schemaId: string;
  updateFrequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "onChange" | "specialized";
  isActive: boolean;
  excelTemplateUrl?: string;
}
```

### Workflow Submissions & Approvals
```ts
export interface DataSubmission {
  id: string;
  recordId: string;
  submittedBy: string;
  submittedAt: string;
  targetUnitId: string;
  approvalRequestId?: string;
}

export interface ApprovalRequest {
  id: string;
  submissionId: string;
  status: "pending" | "approved" | "returned";
  currentStepIndex: number;
  steps: ApprovalStep[];
}

export interface ApprovalStep {
  stepNumber: number;
  roleRequired: string;
  approverId?: string;
  status: "pending" | "approved" | "returned";
  actedAt?: string;
  note?: string;
}

export interface DataVersion {
  id: string;
  recordId: string;
  versionNumber: number;
  changedFields: string[];
  oldValue: Record<string, any>;
  newValue: Record<string, any>;
  changedBy: string;
  changedAt: string;
}
```

### Attachments
```ts
export interface AttachmentMeta {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl: string;
}
```

---

## 3. Operations & Reporting Contracts

### Indicators
```ts
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
```

### Import / Export Center
```ts
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
```

### Notification Center
```ts
export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "critical";
  isRead: boolean;
  createdAt: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}
```

---

## 4. Map & Spatial Contracts

### Boundaries & Layers
```ts
export interface AdministrativeBoundary {
  code: string;
  name: string;
  type: "commune" | "village";
  areaHa: number;
  centerCoordinate: [number, number]; // Lat, Lng
  geometryGeoJson: Record<string, any>; // EPSG:4326 GeoJSON
  disclaimer: string; // E.g., "Mock boundary, not legally binding."
}

export interface MapLayer {
  id: string;
  name: string;
  dataGroup: DataGroup;
  geometryType: "point" | "line" | "polygon";
  order: number;
  visibleByDefault: boolean;
  styleConfig: Record<string, any>;
  securityLevel: SecurityLevel;
}

export interface SpatialFeature {
  id: string;
  layerId: string;
  name: string;
  geometryGeoJson: Record<string, any>; // EPSG:4326 Point, LineString, or Polygon
  linkedEntityType: string;             // E.g., "enterprise", "housing"
  linkedEntityId: string;               // Links to record ID
  properties: Record<string, any>;      // Custom popup values
}

export interface LayerPermission {
  layerId: string;
  allowedRoles: string[];
  maxSecurityLevel: SecurityLevel;
}
```
