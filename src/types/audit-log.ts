export type AuditLogModule = 
  | 'household'
  | 'crop'
  | 'livestock'
  | 'land'
  | 'economy'
  | 'forest'
  | 'settings'
  | 'auth';

export interface AuditLogEntry {
  id: string;
  userId: string;
  username: string;
  userFullName: string;
  role: string;
  action: string;
  module: AuditLogModule;
  targetObject?: string;
  description: string;
  ipAddress?: string;
  timestamp: string;
}
