// src/types/data-governance.ts

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

export interface FormTemplate {
  id: string;
  title: string;
  dataGroup: DataGroup;
  schemaId: string;
  updateFrequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "onChange" | "specialized";
  isActive: boolean;
  excelTemplateUrl?: string;
}

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

export interface AttachmentMeta {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl: string;
}

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
