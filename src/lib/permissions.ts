// src/lib/permissions.ts

import { User, PermissionAction, DataGroup, SecurityLevel } from '@/types';

/**
 * Checks if a user's security level is sufficient for the requested level
 */
export function hasSecurityClearance(userLevel: SecurityLevel, targetLevel: SecurityLevel): boolean {
  if (userLevel === 'confidential') return true;
  if (userLevel === 'shared') return targetLevel !== 'confidential';
  return targetLevel === 'public';
}

/**
 * Checks fine-grained data permissions based on user role, action, and data scope.
 */
export function checkPermission(
  user: User,
  action: PermissionAction,
  context?: {
    dataGroup?: DataGroup;
    securityLevel?: SecurityLevel;
    villageCode?: string;
    organizationUnitId?: string;
  }
): boolean {
  const { role, scope } = user;

  // 1. Role-based Actions check (RBAC Matrix)
  if (role === 'admin') {
    // Admin has all rights, but still subject to security scope if specified
    if (context?.securityLevel && scope) {
      if (!hasSecurityClearance(scope.maxSecurityLevel, context.securityLevel)) {
        return false;
      }
    }
    return true;
  }

  // 2. Action filters by role
  if (role === 'data_officer') {
    // Cannot approve or publish
    if (['approveUnit', 'approveGovernance', 'publish', 'restoreVersion', 'manageLayer'].includes(action)) {
      return false;
    }
  }

  if (role === 'unit_leader') {
    // Unit leader can only view, export, and approve unit
    if (!['view', 'export', 'approveUnit'].includes(action)) {
      return false;
    }
  }

  if (role === 'commune_leader') {
    // Commune leader is read-only + export
    if (!['view', 'export', 'viewConfidential'].includes(action)) {
      return false;
    }
  }

  // 3. Security Level check
  if (context?.securityLevel && scope) {
    if (!hasSecurityClearance(scope.maxSecurityLevel, context.securityLevel)) {
      return false;
    }
  }

  // 4. Data Group (Lĩnh vực) check
  if (context?.dataGroup && scope) {
    // If user has specific allowed groups, check containment
    if (scope.allowedDataGroups.length > 0 && !scope.allowedDataGroups.includes(context.dataGroup)) {
      // Only reject write actions, allowing general views if public/shared
      if (['create', 'update', 'delete', 'import', 'submit'].includes(action)) {
        return false;
      }
    }
  }

  // 5. Village Scope check
  if (context?.villageCode && scope) {
    const allowed = scope.allowedVillageCodes || [];
    if (!allowed.includes('all') && !allowed.includes(context.villageCode)) {
      return false;
    }
  }

  // 6. Organization Unit check (for leaders approving or officers editing)
  if (context?.organizationUnitId && scope) {
    if (role === 'unit_leader' && action === 'approveUnit') {
      if (!scope.organizationUnitIds.includes(context.organizationUnitId)) {
        return false;
      }
    }
    if (role === 'data_officer' && ['update', 'delete', 'submit'].includes(action)) {
      if (user.organizationUnitId !== context.organizationUnitId) {
        return false;
      }
    }
  }

  return true;
}
