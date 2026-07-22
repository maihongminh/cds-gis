# 11 — RBAC & Navigation Template (Phân quyền & Menu)

## Tổng quan

Template phân quyền generic — **không dùng role cũ** của dự án gốc. Dự án mới define roles riêng.

---

## Placeholder Roles

```
ROLES:
- [ROLE_1] — ví dụ: admin, quản trị viên
- [ROLE_2] — ví dụ: manager, quản lý
- [ROLE_3] — ví dụ: staff, nhân viên
- [ROLE_4] — ví dụ: viewer, xem (tùy chọn)
```

---

## Type Definitions

```typescript
// src/types/auth.ts

// User roles — THAY ĐỔI CHO DỰ ÁN MỚI
export type UserRole = '[ROLE_1]' | '[ROLE_2]' | '[ROLE_3]';
// Ví dụ: 'admin' | 'manager' | 'staff' | 'viewer'

// App modules — THAY ĐỔI THEO MODULE DỰ ÁN MỚI
export type AppModule =
  | 'dashboard'
  | '[MODULE_1]'
  | '[MODULE_2]'
  | 'reports'
  | 'users'
  | 'auditLogs'
  | 'settings';

// Permission actions
export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'import' | 'export';

// User info
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
```

---

## Navigation Items với RBAC

```typescript
// src/components/layout/sidebar-items.ts
import type { LucideIcon } from 'lucide-react';
import type { AppModule } from '@/types/auth';

export type SidebarSingleItem = {
  type: 'single';
  title: string;
  href: string;
  icon: LucideIcon;
  module: AppModule;  // Dùng cho RBAC filtering
};

export type SidebarChildItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  module: AppModule;
};

export type SidebarGroupItem = {
  type: 'group';
  title: string;
  icon: LucideIcon;
  children: SidebarChildItem[];
};

export type SidebarItem = SidebarSingleItem | SidebarGroupItem;

// THAY ĐỔI MENU ITEMS CHO DỰ ÁN MỚI
export const sidebarItems: SidebarItem[] = [
  {
    type: 'single',
    title: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
    module: 'dashboard',
  },
  {
    type: 'group',
    title: '[GROUP_NAME]',
    icon: Database,
    children: [
      { title: '[MODULE_1]', href: '/dashboard/[module-1]', icon: FileText, module: '[module1]' },
      { title: '[MODULE_2]', href: '/dashboard/[module-2]', icon: Users, module: '[module2]' },
    ],
  },
  // ... thêm modules
];
```

---

## RBAC Permission Config

```typescript
// src/lib/rbac.ts

export const ROLE_LABELS: Record<UserRole, string> = {
  '[ROLE_1]': '[LABEL_1]',
  '[ROLE_2]': '[LABEL_2]',
  '[ROLE_3]': '[LABEL_3]',
};

// Route permissions per role
export const ROUTE_PERMISSIONS: Record<UserRole, string[]> = {
  '[ROLE_1]': [
    '/dashboard/[module-1]',
    '/dashboard/[module-2]',
    '/dashboard/reports',
    '/dashboard/users',
    '/dashboard/settings',
  ],
  '[ROLE_2]': [
    '/dashboard/[module-1]',
    '/dashboard/[module-2]',
    '/dashboard/reports',
  ],
  '[ROLE_3]': [
    '/dashboard/[module-1]',
    '/dashboard/reports',
  ],
};

// Module permissions per role
const MODULE_PERMISSIONS: Record<UserRole, AppModule[]> = {
  '[ROLE_1]': ['dashboard', '[module1]', '[module2]', 'reports', 'users', 'auditLogs', 'settings'],
  '[ROLE_2]': ['dashboard', '[module1]', '[module2]', 'reports'],
  '[ROLE_3]': ['dashboard', '[module1]', 'reports'],
};
```

---

## Permission Functions

```typescript
// Kiểm tra quyền truy cập route
export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (pathname === '/dashboard') return true;  // Dashboard home luôn accessible
  if (pathname === '/dashboard/access-denied') return true;

  const allowedRoutes = ROUTE_PERMISSIONS[role] || [];
  return allowedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );
}

// Kiểm tra quyền truy cập module
export function canAccessModule(role: UserRole, module: AppModule): boolean {
  return (MODULE_PERMISSIONS[role] || []).includes(module);
}

// Kiểm tra quyền thao tác
export function canPerform(role: UserRole, module: AppModule, action: PermissionAction): boolean {
  if (role === '[ROLE_1]') return true;  // Admin full quyền

  if (!canAccessModule(role, module)) return false;

  if (role === '[ROLE_2]') {
    if (action === 'delete') return false;
    return ['view', 'create', 'update', 'export'].includes(action);
  }

  if (role === '[ROLE_3]') {
    return ['view', 'export'].includes(action);
  }

  return false;
}

// Lọc sidebar items theo role
export function getVisibleSidebarTreeItems(role: UserRole, items: SidebarItem[]): SidebarItem[] {
  return items.reduce<SidebarItem[]>((acc, item) => {
    if (item.type === 'single') {
      if (canAccessRoute(role, item.href)) acc.push(item);
    } else if (item.type === 'group') {
      const visibleChildren = item.children.filter(child => canAccessRoute(role, child.href));
      if (visibleChildren.length > 0) acc.push({ ...item, children: visibleChildren });
    }
    return acc;
  }, []);
}
```

---

## Áp dụng trong Sidebar

```tsx
// src/components/layout/app-sidebar.tsx
const visibleItems = getVisibleSidebarTreeItems(currentRole, sidebarItems);

// Chỉ render visibleItems → menu tự ẩn item user không có quyền
```

---

## Áp dụng trong Middleware

```typescript
// src/middleware.ts
if (isLoggedIn && pathname.startsWith('/dashboard')) {
  const role = request.cookies.get('app_role')?.value as UserRole;
  const hasAccess = canAccessRoute(role, pathname);
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/dashboard/access-denied', request.url));
  }
}
```

---

## AccessDenied Page

```tsx
// src/app/dashboard/access-denied/page.tsx
import { AccessDenied } from '@/components/common/access-denied';

export default function AccessDeniedPage() {
  return <AccessDenied />;
}
```

---

## Cách áp dụng cho dự án mới

1. Define roles trong `src/types/auth.ts`.
2. Define modules trong `src/types/auth.ts`.
3. Cấu hình `ROUTE_PERMISSIONS` trong `src/lib/rbac.ts`.
4. Cấu hình `MODULE_PERMISSIONS` trong `src/lib/rbac.ts`.
5. Thêm `module` field vào sidebar items.
6. Login page: demo role selector → set cookie `app_role`.
7. Middleware: đọc `app_role` cookie → check `canAccessRoute`.
8. Sidebar: filter items bằng `getVisibleSidebarTreeItems`.
