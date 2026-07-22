// src/types/user.ts

import { UserRole, UserScope } from './auth';

export type { UserRole };

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  phone: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  organizationUnitId?: string;
  scope?: UserScope;
}
