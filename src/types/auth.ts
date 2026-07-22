// src/types/auth.ts

import { SecurityLevel, DataGroup } from './data-governance';

export type UserRole =
  | 'admin'
  | 'data_officer'
  | 'unit_leader'
  | 'data_governance'
  | 'commune_leader';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'import'
  | 'submit'
  | 'approveUnit'
  | 'approveGovernance'
  | 'publish'
  | 'restoreVersion'
  | 'manageLayer'
  | 'viewConfidential';

export type AppModule =
  // Group 1: General & Operations
  | 'dashboard'
  | 'indicators'
  | 'reports'
  | 'notifications'
  
  // Group 2: Digital Data Repository
  | 'administrativePopulation'
  | 'economy'
  | 'tourismServices'
  | 'landPlanning'
  | 'agricultureEnvironment'
  | 'educationHealth'
  | 'socialWelfare'
  | 'securityDefense'
  | 'disasterEmergency'
  
  // Group 3: Data Workflows
  | 'dataTemplates'
  | 'dataImports'
  | 'dataApprovals'
  | 'dataPublication'
  | 'dataVersions'
  | 'dataSearch'
  
  // Group 4: Smart Map
  | 'map'
  | 'mapLayers'
  | 'mapFeatures'
  
  // Group 5: System Administration
  | 'users'
  | 'roles'
  | 'organizations'
  | 'staff'
  | 'auditLogs'
  | 'backups'
  | 'integrations'
  | 'settings';

export interface UserScope {
  organizationUnitIds: string[];
  allowedDataGroups: DataGroup[];
  allowedVillageCodes: string[]; // e.g. ['trieu-phuoc'] or ['all'] for whole commune
  maxSecurityLevel: SecurityLevel;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  organizationUnitId?: string;
  scope?: UserScope;
}
