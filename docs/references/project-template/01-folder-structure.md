# 01 — Folder Structure (Cấu trúc thư mục)

## Cây thư mục chuẩn

```
project-root/
├── public/                          # Static assets (ảnh, favicon, SVG)
│   ├── images/                      # Ảnh minh họa (light/dark variants)
│   ├── favicon.png
│   └── logo.png
│
├── src/
│   ├── app/                         # Next.js App Router (routing + pages)
│   │   ├── globals.css              # Global CSS: Tailwind imports + color tokens
│   │   ├── layout.tsx               # Root layout: font, providers, metadata
│   │   ├── page.tsx                 # Landing page (public, trang chủ)
│   │   │
│   │   ├── login/                   # Auth routes
│   │   │   └── page.tsx             # Trang đăng nhập
│   │   │
│   │   └── dashboard/               # Protected routes (cần đăng nhập)
│   │       ├── layout.tsx           # Dashboard layout: sidebar + header + main
│   │       ├── page.tsx             # Trang tổng quan (dashboard home)
│   │       ├── components/          # Component riêng cho dashboard home
│   │       │   ├── dashboard-kpi-grid.tsx
│   │       │   ├── monthly-change-chart.tsx
│   │       │   └── ...
│   │       │
│   │       ├── [module-name]/       # Module nghiệp vụ (records, users, reports...)
│   │       │   ├── page.tsx         # List page
│   │       │   ├── components/      # Component riêng cho module
│   │       │   │   ├── module-filters.tsx
│   │       │   │   ├── module-table.tsx
│   │       │   │   └── module-header.tsx
│   │       │   └── [id]/            # Detail page (dynamic route)
│   │       │       └── page.tsx
│   │       │
│   │       ├── map/                 # Bản đồ GIS (nếu có)
│   │       │   ├── page.tsx
│   │       │   └── components/
│   │       │       └── map-canvas.tsx
│   │       │
│   │       ├── reports/             # Báo cáo & Thống kê
│   │       │   └── page.tsx
│   │       │
│   │       ├── settings/            # Cấu hình hệ thống
│   │       │   └── page.tsx
│   │       │
│   │       └── ...                  # Các module khác
│   │
│   ├── components/                  # Reusable components
│   │   ├── common/                  # Component dùng chung toàn app
│   │   │   ├── data-table-shell.tsx # Bảng dữ liệu có sort, pagination
│   │   │   ├── metric-card.tsx      # Thẻ KPI metric
│   │   │   ├── page-header.tsx      # Header trang với breadcrumb
│   │   │   ├── breadcrumbs.tsx      # Breadcrumb tự động từ URL
│   │   │   ├── tabs.tsx             # Tab navigation
│   │   │   └── access-denied.tsx    # Trang từ chối truy cập
│   │   │
│   │   ├── layout/                  # Component layout dashboard
│   │   │   ├── app-sidebar.tsx      # Sidebar navigation
│   │   │   ├── dashboard-header.tsx # Top header bar
│   │   │   ├── sidebar-context.tsx  # Context quản lý sidebar state
│   │   │   ├── tenant-context.tsx   # Context quản lý tenant/scope
│   │   │   ├── tenant-switcher.tsx  # Dropdown chọn đơn vị
│   │   │   ├── user-menu.tsx        # Menu người dùng
│   │   │   └── notifications-menu.tsx
│   │   │
│   │   ├── theme/                   # Theme system
│   │   │   ├── theme-provider.tsx   # Provider next-themes
│   │   │   └── theme-toggle.tsx     # Toggle sáng/tối/hệ thống
│   │   │
│   │   └── ui/                      # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── skeleton.tsx
│   │       └── ...
│   │
│   ├── data/                        # Mock data
│   │   ├── mock-records.ts          # Dữ liệu chính (entity chính)
│   │   ├── mock-dashboard.ts        # Dữ liệu dashboard (KPI, chart)
│   │   ├── mock-users.ts            # Dữ liệu người dùng
│   │   ├── mock-settings.ts         # Dữ liệu cấu hình
│   │   └── ...
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── [main-entity].ts         # Type entity chính (ví dụ: record.ts, patient.ts)
│   │   ├── dashboard.ts             # Type dashboard metrics
│   │   ├── auth.ts                  # Type auth/user
│   │   ├── settings.ts              # Type cấu hình
│   │   └── ...
│   │
│   ├── hooks/                       # Custom React hooks (API integration)
│   │   ├── index.ts                 # Barrel export tất cả hooks
│   │   ├── useAuth.ts               # Hook đăng nhập/đăng xuất
│   │   ├── useGetList.ts            # Hook lấy danh sách
│   │   ├── useGetDoc.ts             # Hook lấy chi tiết
│   │   ├── useCreateDoc.ts          # Hook tạo mới
│   │   ├── useUpdateDoc.ts          # Hook cập nhật
│   │   ├── useDeleteDoc.ts          # Hook xóa
│   │   └── ...
│   │
│   ├── lib/                         # Utility & configuration
│   │   ├── utils.ts                 # Hàm `cn()` merge class
│   │   ├── apiClient.ts             # Axios instance + interceptors
│   │   └── ApiProvider.tsx          # React Query + Axios provider
│   │
│   └── middleware.ts                # Next.js middleware (auth guard)
│
├── docs/                            # Tài liệu project
│   └── project-template/            # Bộ template tái sử dụng (thư mục này)
│
├── components.json                  # Shadcn UI config
├── tsconfig.json                    # TypeScript config
├── postcss.config.mjs               # PostCSS config (Tailwind v4)
├── next.config.ts                   # Next.js config (rewrites, env)
├── package.json
└── .env.local                       # Environment variables
```

## Vai trò từng folder

| Folder | Vai trò | Ghi chú |
|---|---|---|
| `src/app/` | Routing & pages | Mỗi folder = 1 route. `page.tsx` = page, `layout.tsx` = layout |
| `src/components/common/` | Component dùng chung | Dùng bởi nhiều module: table, card, header... |
| `src/components/layout/` | Layout dashboard | Sidebar, header, context providers |
| `src/components/theme/` | Theme system | Provider + toggle cho light/dark |
| `src/components/ui/` | Shadcn UI primitives | Cài qua CLI, có thể customize |
| `src/data/` | Mock data | Dữ liệu giả, import trực tiếp. Xóa khi có API |
| `src/types/` | TypeScript types | Interface & type cho mọi entity |
| `src/hooks/` | Custom hooks | API hooks sẵn cho Frappe, dễ thay backend |
| `src/lib/` | Utilities | `cn()`, axios client, providers |

## Quy tắc đặt tên file

| Loại file | Convention | Ví dụ |
|---|---|---|
| Page | `page.tsx` | `src/app/dashboard/records/page.tsx` |
| Layout | `layout.tsx` | `src/app/dashboard/layout.tsx` |
| Component | `kebab-case.tsx` | `metric-card.tsx`, `data-table-shell.tsx` |
| Mock data | `mock-[entity].ts` | `mock-records.ts`, `mock-dashboard.ts` |
| Type | `[entity].ts` | `[main-entity].ts`, `dashboard.ts`, `auth.ts` |
| Hook | `use[Action].ts` | `useGetList.ts`, `useAuth.ts` |
| Context | `[name]-context.tsx` | `tenant-context.tsx`, `sidebar-context.tsx` |
| CSS | `globals.css` | Chỉ dùng 1 file CSS toàn cục |

## Quy tắc tách route

```
/                       → src/app/page.tsx              (Landing page - public)
/login                  → src/app/login/page.tsx         (Login - public)
/dashboard              → src/app/dashboard/page.tsx     (Dashboard home - protected)
/dashboard/[module]     → src/app/dashboard/[module]/page.tsx  (List page)
/dashboard/[module]/[id] → src/app/dashboard/[module]/[id]/page.tsx (Detail page)
```

## Quy tắc tách component

### 1. Component nằm gần route sử dụng

Mỗi module có folder `components/` riêng bên trong route:

```
src/app/dashboard/records/
├── page.tsx              ← Page chỉ compose layout
├── components/
│   ├── records-filters.tsx  ← Filter riêng module
│   ├── records-table.tsx    ← Table riêng module
│   ├── records-header.tsx   ← Header riêng module
│   └── record-status-badge.tsx ← Badge riêng module
└── [id]/
    └── page.tsx           ← Detail page
```

### 2. Component dùng chung đặt trong `src/components/common/`

Nếu component được dùng bởi **2 module trở lên**, chuyển vào `common/`:

```
src/components/common/
├── data-table-shell.tsx  ← Dùng bởi records, users, audit-logs...
├── metric-card.tsx       ← Dùng bởi dashboard, reports
├── page-header.tsx       ← Dùng bởi mọi page
└── breadcrumbs.tsx       ← Dùng bởi mọi page
```

### 3. Layout component đặt trong `src/components/layout/`

```
src/components/layout/
├── app-sidebar.tsx       ← Sidebar navigation
├── dashboard-header.tsx  ← Top header
├── sidebar-context.tsx   ← Sidebar state management
└── tenant-context.tsx    ← Tenant/scope management
```

## Cách thêm module mới

1. Tạo folder route: `src/app/dashboard/[ten-module]/`
2. Tạo `page.tsx` (list page).
3. Tạo `components/` folder với filter, table, header.
4. Tạo `[id]/page.tsx` cho detail page (nếu cần).
5. Thêm type vào `src/types/[ten-module].ts`.
6. Thêm mock data vào `src/data/mock-[ten-module].ts`.
7. Thêm menu item vào `src/components/layout/app-sidebar.tsx`.
8. Thêm route label vào `src/components/common/breadcrumbs.tsx` → `routeMap`.
