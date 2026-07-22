import { UserRole, PermissionAction, AppModule } from '@/types/auth';
import { ROUTE_PERMISSIONS } from './route-permissions';

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Quản trị viên (Admin)',
  data_officer: 'Cán bộ nhập liệu',
  unit_leader: 'Lãnh đạo đơn vị',
  data_governance: 'Cán bộ Văn phòng UBND',
  commune_leader: 'Lãnh đạo xã (UBND/HĐND)',
};

export { ROUTE_PERMISSIONS };

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function getRoleVariant(role: UserRole): 'default' | 'secondary' | 'outline' | 'destructive' {
  const map: Record<UserRole, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    admin: 'destructive',
    data_officer: 'default',
    unit_leader: 'secondary',
    data_governance: 'outline',
    commune_leader: 'secondary',
  };
  return map[role];
}

export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  admin: '/dashboard',
  data_officer: '/dashboard',
  unit_leader: '/dashboard',
  data_governance: '/dashboard',
  commune_leader: '/dashboard',
};

const MODULE_PERMISSIONS: Record<UserRole, AppModule[]> = {
  admin: [
    'dashboard', 'indicators', 'reports', 'notifications',
    'administrativePopulation', 'economy', 'tourismServices', 'landPlanning',
    'agricultureEnvironment', 'educationHealth', 'socialWelfare', 'securityDefense', 'disasterEmergency',
    'dataTemplates', 'dataImports', 'dataApprovals', 'dataPublication', 'dataVersions', 'dataSearch',
    'map', 'mapLayers', 'mapFeatures',
    'users', 'roles', 'organizations', 'staff', 'auditLogs', 'backups', 'integrations', 'settings'
  ],
  data_officer: [
    'dashboard', 'indicators', 'reports', 'notifications',
    'administrativePopulation', 'economy', 'tourismServices', 'landPlanning',
    'agricultureEnvironment', 'educationHealth', 'socialWelfare', 'disasterEmergency',
    'dataTemplates', 'dataImports', 'dataVersions', 'dataSearch',
    'map'
  ],
  unit_leader: [
    'dashboard', 'indicators', 'reports', 'notifications',
    'administrativePopulation', 'economy', 'tourismServices', 'landPlanning',
    'agricultureEnvironment', 'educationHealth', 'socialWelfare', 'disasterEmergency',
    'dataApprovals', 'dataSearch',
    'map', 'mapLayers', 'mapFeatures'
  ],
  data_governance: [
    'dashboard', 'indicators', 'reports', 'notifications',
    'administrativePopulation', 'economy', 'tourismServices', 'landPlanning',
    'agricultureEnvironment', 'educationHealth', 'socialWelfare', 'securityDefense', 'disasterEmergency',
    'dataTemplates', 'dataImports', 'dataApprovals', 'dataPublication', 'dataVersions', 'dataSearch',
    'map', 'mapLayers', 'mapFeatures',
    'staff', 'auditLogs', 'settings'
  ],
  commune_leader: [
    'dashboard', 'indicators', 'reports', 'notifications',
    'administrativePopulation', 'economy', 'tourismServices', 'landPlanning',
    'agricultureEnvironment', 'educationHealth', 'socialWelfare', 'securityDefense', 'disasterEmergency',
    'map', 'auditLogs'
  ],
};

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  // Public or home route
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return true;
  }

  // Access denied route is always accessible
  if (pathname === '/dashboard/access-denied' || pathname.startsWith('/dashboard/access-denied/')) {
    return true;
  }

  // Profile and notifications are always accessible to logged-in users
  if (pathname === '/dashboard/profile' || pathname.startsWith('/dashboard/profile/')) {
    return true;
  }
  if (pathname === '/dashboard/notifications' || pathname.startsWith('/dashboard/notifications/')) {
    return true;
  }

  const allowedRoutes = ROUTE_PERMISSIONS[role] || [];
  
  return allowedRoutes.some((route) => {
    if (pathname === route) return true;
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });
}

export function canAccessModule(role: UserRole, module: AppModule): boolean {
  const allowed = MODULE_PERMISSIONS[role] || [];
  return allowed.includes(module);
}

export function canPerform(
  role: UserRole,
  module: AppModule,
  action: PermissionAction
): boolean {
  if (role === 'admin') {
    return true;
  }

  if (!canAccessModule(role, module)) {
    return false;
  }

  if (role === 'data_governance') {
    return true;
  }

  if (role === 'data_officer') {
    if (action === 'delete') return false;
    if (['users', 'roles', 'organizations', 'staff', 'auditLogs', 'backups', 'integrations', 'settings'].includes(module)) return false;
    return ['view', 'create', 'update', 'import', 'export', 'submit'].includes(action);
  }

  if (role === 'unit_leader') {
    if (action === 'approveUnit') return true;
    return ['view', 'export'].includes(action);
  }

  if (role === 'commune_leader') {
    if (action === 'viewConfidential') {
      return module === 'securityDefense';
    }
    return ['view', 'export'].includes(action);
  }

  return false;
}

export function getVisibleSidebarItems<T extends { href: string }>(
  role: UserRole,
  items: T[]
): T[] {
  return items.filter((item) => canAccessRoute(role, item.href));
}

/**
 * Filters sidebar tree items (single + group) based on role.
 * - For "single" items: checks canAccessRoute.
 * - For "group" items: filters children, hides group if no children remain.
 */
export function getVisibleSidebarTreeItems<
  TChild extends { href: string },
  TGroup extends { type: 'group'; children: TChild[] },
  TSingle extends { type: 'single'; href: string },
  TItem extends TGroup | TSingle
>(role: UserRole, items: TItem[]): TItem[] {
  return items.reduce<TItem[]>((acc, item) => {
    if (item.type === 'single') {
      if (canAccessRoute(role, item.href)) {
        acc.push(item);
      }
    } else if (item.type === 'group') {
      const visibleChildren = item.children.filter((child) =>
        canAccessRoute(role, child.href)
      );
      if (visibleChildren.length > 0) {
        acc.push({ ...item, children: visibleChildren });
      }
    }
    return acc;
  }, []);
}


export function can(permission: string): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(/app_role=([^;]+)/);
  if (!match) return false;
  const role = decodeURIComponent(match[1]) as UserRole;

  let targetModule: AppModule = 'dashboard';
  let action: PermissionAction = 'view';

  if (permission.startsWith('user:')) {
    targetModule = 'users';
    if (permission === 'user:create') action = 'create';
    else if (permission === 'user:edit') action = 'update';
    else if (permission === 'user:disable') action = 'update';
    else if (permission === 'user:resetPassword') action = 'update';
    else if (permission === 'user:delete') action = 'delete';
  } else if (permission.startsWith('household:')) {
    targetModule = 'administrativePopulation';
    if (permission === 'household:create') action = 'create';
    else if (permission === 'household:edit') action = 'update';
    else if (permission === 'household:delete') action = 'delete';
  }

  return canPerform(role, targetModule, action);
}
