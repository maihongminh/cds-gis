'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { canPerform, canAccessModule } from '@/lib/rbac';
import { UserRole, AppModule, PermissionAction } from '@/types/auth';

interface RoleGuardProps {
  module: AppModule;
  action?: PermissionAction;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({
  module,
  action,
  fallback = null,
  children,
}: RoleGuardProps) {
  const { currentRole } = useTenant();

  if (!currentRole) {
    return <>{fallback}</>;
  }

  const role = currentRole as UserRole;

  const hasAccess = action
    ? canPerform(role, module, action)
    : canAccessModule(role, module);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
