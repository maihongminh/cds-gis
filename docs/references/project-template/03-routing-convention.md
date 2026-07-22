# 03 — Routing Convention (Quy ước Routing)

## Tổng quan

Project sử dụng **Next.js App Router** (file-system based routing). Mỗi folder trong `src/app/` tương ứng với một URL path.

## Phân loại Route

### 1. Public Routes (Trang công khai)

Không cần đăng nhập. Bất kỳ ai cũng truy cập được.

| Route | File | Mô tả |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing page (trang giới thiệu) |
| `/login` | `src/app/login/page.tsx` | Trang đăng nhập |
| `/presentation` | `src/app/presentation/page.tsx` | Trang trình chiếu (nếu có) |

### 2. Auth Routes (Trang xác thực)

Guest-only — nếu đã đăng nhập sẽ redirect về `/dashboard`.

| Route | Xử lý |
|---|---|
| `/login` | Nếu có cookie `app_sid` (hoặc tên cookie session của app) → redirect `/dashboard` |
| `/register` | Tương tự (nếu có) |

### 3. Dashboard Routes (Trang quản trị — Protected)

Yêu cầu đăng nhập. Nếu chưa login sẽ redirect về `/login`. Danh sách routes được chia thành các nhóm:

#### A. Core Routes (Các route cốt lõi - Cần có cho hầu hết mọi hệ thống dashboard)

| Route | File | Mô tả |
|---|---|---|
| `/dashboard` | `src/app/dashboard/page.tsx` | Trang tổng quan (KPI, chart, alerts) |
| `/dashboard/users` | `src/app/dashboard/users/page.tsx` | Quản lý người dùng & Phân quyền |
| `/dashboard/settings` | `src/app/dashboard/settings/page.tsx` | Cấu hình hệ thống chung |
| `/dashboard/notifications` | `src/app/dashboard/notifications/page.tsx` | Trung tâm thông báo |
| `/dashboard/audit-logs` | `src/app/dashboard/audit-logs/page.tsx` | Nhật ký hoạt động hệ thống |

#### B. Optional Routes (Các route tùy chọn - Tích hợp theo nhu cầu thực tế của dự án)

| Route | File | Mô tả |
|---|---|---|
| `/dashboard/reports` | `src/app/dashboard/reports/page.tsx` | Thống kê & Xuất báo cáo tổng hợp |
| `/dashboard/ai` | `src/app/dashboard/ai/page.tsx` | Trợ lý AI hỗ trợ tra cứu/phân tích |
| `/dashboard/map` | `src/app/dashboard/map/page.tsx` | Bản đồ GIS trực quan hóa dữ liệu (nếu có bản đồ) |

#### C. Project-specific Examples (Ví dụ route nghiệp vụ đặc thù - Dự án gốc)

| Route | File | Mô tả |
|---|---|---|
| `/dashboard/records` | `src/app/dashboard/records/page.tsx` | Danh sách hồ sơ chính (list page) |
| `/dashboard/records/[id]` | `src/app/dashboard/records/[id]/page.tsx` | Chi tiết hồ sơ chính (detail page) |
| `/dashboard/families` | `src/app/dashboard/families/page.tsx` | Danh sách hộ gia đình liên quan |
| `/dashboard/workflow` | `src/app/dashboard/workflow/page.tsx` | Luồng quy trình duyệt hồ sơ đa cấp |
| `/dashboard/documents` | `src/app/dashboard/documents/page.tsx` | Quản lý mượn trả hồ sơ & trích lục |

### 4. Dynamic Routes

```
/dashboard/records/[id]        → Chi tiết hồ sơ theo ID
/dashboard/families/[id]       → Chi tiết hộ gia đình (nếu có)
/dashboard/workflow/[id]       → Chi tiết phiếu duyệt (nếu có)
```

### 5. Layout Route Groups

```
src/app/
├── layout.tsx              → Root Layout (font, theme, providers)
├── page.tsx                → Landing (không dùng dashboard layout)
├── login/page.tsx          → Login (không dùng dashboard layout)
└── dashboard/
    ├── layout.tsx          → Dashboard Layout (sidebar + header)
    ├── page.tsx            → Dashboard home
    └── [module]/page.tsx   → Module pages (inherit dashboard layout)
```

## Middleware Auth Guard

```typescript
// src/middleware.ts
const PUBLIC_PATHS = ['/login', '/register', '/presentation'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // '/' và PUBLIC_PATHS là public
  const isPublic = pathname === '/' || PUBLIC_PATHS.some(p => pathname.startsWith(p));
  const isGuestOnly = ['/login', '/register'].some(p => pathname.startsWith(p));

  const sid = request.cookies.get('app_sid')?.value;
  const isLoggedIn = !!sid && sid !== 'Guest';

  // Chưa login + trang protected → redirect /login
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Đã login + trang guest-only → redirect /dashboard
  if (isLoggedIn && isGuestOnly) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
```

**Tùy chỉnh cho project mới:**
- Đổi tên cookie (`app_sid` hoặc `[app_session_cookie]`) thành cookie phù hợp của dự án mới.
- Thêm/bớt `PUBLIC_PATHS`.
- Thêm logic role-based access nếu cần.

## Generic Route Pattern

Khi tạo project mới, áp dụng pattern sau:

```
/                                    → Landing page
/login                               → Login
/dashboard                           → Dashboard tổng quan
/dashboard/[main-entity]             → List page entity chính
/dashboard/[main-entity]/[id]        → Detail page
/dashboard/[secondary-module]        → Module phụ
/dashboard/reports                   → Báo cáo
/dashboard/settings                  → Cấu hình
/dashboard/users                     → Quản lý người dùng
```

## Cách đặt tên route

| Quy tắc | Ví dụ đúng | Ví dụ sai |
|---|---|---|
| Dùng kebab-case | `audit-logs` | `auditLogs`, `Audit_Logs` |
| Dùng danh từ số nhiều | `records`, `users` | `record`, `user` |
| Ngắn gọn, rõ nghĩa | `reports` | `statistical-reports-page` |
| Dynamic route dùng `[id]` | `[id]` | `[recordId]`, `[slug]` |
| Không prefix thừa | `documents` | `dashboard-documents` |

## Cách thêm module mới

### 1. Tạo route file

```bash
# Tạo folder module
mkdir -p src/app/dashboard/[ten-module]/components
mkdir -p src/app/dashboard/[ten-module]/[id]
```

### 2. Tạo page.tsx (list page)

```tsx
// src/app/dashboard/[ten-module]/page.tsx
'use client';

import { PageHeader } from '@/components/common/page-header';

export default function TenModulePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Tên Module"
        description="Mô tả module"
      />
      {/* Table + Filters */}
    </div>
  );
}
```

### 3. Thêm vào sidebar

```tsx
// src/components/layout/app-sidebar.tsx
const sidebarItems = [
  // ... existing items
  { title: 'Tên Module', href: '/dashboard/ten-module', icon: IconComponent },
];
```

### 4. Thêm vào breadcrumb map

```tsx
// src/components/common/breadcrumbs.tsx
export const routeMap: Record<string, string> = {
  // ... existing
  'ten-module': 'Tên Module hiển thị',
};
```
