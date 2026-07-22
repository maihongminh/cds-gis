# 08 — Routing Convention (Quy ước Routing)

## Pattern route generic

```
/                              Landing page (public)
/login                         Trang đăng nhập (public, guest-only)
/dashboard                     Dashboard tổng quan (protected)
/dashboard/[module]            List page module (protected)
/dashboard/[module]/[id]       Detail page (protected)
/dashboard/reports             Báo cáo & Thống kê (protected)
/dashboard/settings            Cấu hình hệ thống (protected, admin)
/dashboard/users               Quản lý người dùng (protected, admin)
/dashboard/audit-logs          Nhật ký hoạt động (protected, admin)
/dashboard/notifications       Trung tâm thông báo (protected)
/dashboard/access-denied       Trang từ chối truy cập (protected)
```

> **Lưu ý**: Đây là route pattern generic. Dự án mới chỉ tạo route theo module nghiệp vụ mới, không copy routes của dự án cũ.

---

## Quy tắc đặt tên route

| Quy tắc | Ví dụ đúng | Ví dụ sai |
|---|---|---|
| Dùng kebab-case | `audit-logs` | `auditLogs`, `Audit_Logs` |
| Dùng danh từ số nhiều | `records`, `users` | `record`, `user` |
| Ngắn gọn, rõ nghĩa | `reports` | `statistical-reports-page` |
| Dynamic route dùng `[id]` | `[id]` | `[recordId]`, `[slug]` |
| Không prefix thừa | `documents` | `dashboard-documents` |

---

## Phân loại Route

### 1. Public Routes

| Route | File | Mô tả |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing page |
| `/login` | `src/app/login/page.tsx` | Trang đăng nhập |

### 2. Protected Routes (Dashboard)

| Route | Loại | Mô tả |
|---|---|---|
| `/dashboard` | Core | Tổng quan (KPI, chart) |
| `/dashboard/[main-entity]` | Module | List page entity chính |
| `/dashboard/[main-entity]/[id]` | Module | Detail page |
| `/dashboard/[secondary-module]` | Module | Module phụ |
| `/dashboard/reports` | Core | Báo cáo |
| `/dashboard/settings` | Admin | Cấu hình |
| `/dashboard/users` | Admin | Quản lý người dùng |
| `/dashboard/audit-logs` | Admin | Nhật ký |
| `/dashboard/access-denied` | System | Từ chối truy cập |

---

## Layout Route Groups

```
src/app/
├── layout.tsx              → Root Layout (font, theme, providers)
├── page.tsx                → Landing (không dùng dashboard layout)
├── login/page.tsx          → Login (không dùng dashboard layout)
└── dashboard/
    ├── layout.tsx          → Dashboard Layout (sidebar + header)
    ├── page.tsx            → Dashboard home
    └── [module]/
        ├── page.tsx        → List page
        └── [id]/page.tsx   → Detail page
```

---

## Middleware Auth Guard

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const isPublic = pathname === '/' || pathname.startsWith('/login');

  // Get session cookie
  const sid = request.cookies.get('app_sid')?.value;
  const isLoggedIn = !!sid;

  // Chưa login + trang protected → redirect /login
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Đã login + trang login → redirect /dashboard
  if (isLoggedIn && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // RBAC route guard (optional, xem file 11-rbac)
  if (isLoggedIn && pathname.startsWith('/dashboard')) {
    const role = request.cookies.get('app_role')?.value;
    // Check role-based access...
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico)$).*)'],
};
```

**Tùy chỉnh cho dự án mới**:
- Đổi tên cookie (`app_sid`) thành cookie phù hợp.
- Thêm/bớt public paths.
- Thêm RBAC logic nếu cần.
- Giai đoạn FE mockup: auth guard dùng mock cookie, demo role selector ở login page.

---

## Quy tắc page.tsx

```tsx
// page.tsx chỉ compose layout — không chứa logic phức tạp
'use client';

import { PageHeader } from '@/components/common/page-header';
import { ModuleTable } from './components/module-table';
import { ModuleFilters } from './components/module-filters';

export default function ModulePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader title="[MODULE_NAME]" description="Mô tả module" />
      {/* Filters + Table */}
    </div>
  );
}
```

---

## Cách thêm module mới

1. Tạo folder route: `src/app/dashboard/[ten-module]/`.
2. Tạo `page.tsx` (list page).
3. Tạo `components/` folder.
4. Tạo `[id]/page.tsx` (detail page nếu cần).
5. Thêm type: `src/types/[ten-module].ts`.
6. Thêm mock data: `src/data/mock-[ten-module].ts`.
7. Thêm sidebar item: `src/components/layout/sidebar-items.ts`.
8. Thêm breadcrumb label: `src/components/common/breadcrumbs.tsx` → `routeMap`.
9. Thêm route permission: `src/lib/rbac.ts` → `ROUTE_PERMISSIONS`.
