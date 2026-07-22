# 03 — Folder Structure (Cấu trúc thư mục)

## Cây thư mục chuẩn cho dự án mới

```
project-root/
├── public/                          # Static assets
│   ├── images/                      # Ảnh minh họa (light/dark variants)
│   ├── favicon.png
│   └── logo.png
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── globals.css              # Global CSS: Tailwind imports + color tokens
│   │   ├── layout.tsx               # Root layout: font, providers, metadata
│   │   ├── page.tsx                 # Landing page (public)
│   │   │
│   │   ├── login/                   # Auth routes
│   │   │   └── page.tsx             # Trang đăng nhập
│   │   │
│   │   └── dashboard/               # Protected routes
│   │       ├── layout.tsx           # Dashboard layout: sidebar + header + main
│   │       ├── page.tsx             # Dashboard home (KPI, chart)
│   │       ├── components/          # Component riêng cho dashboard home
│   │       │   ├── dashboard-kpi-grid.tsx
│   │       │   └── ...
│   │       │
│   │       ├── [MODULE_NAME]/       # Module nghiệp vụ
│   │       │   ├── page.tsx         # List page
│   │       │   ├── components/      # Component riêng cho module
│   │       │   │   ├── [module]-filters.tsx
│   │       │   │   ├── [module]-table.tsx
│   │       │   │   └── [module]-header.tsx
│   │       │   └── [id]/            # Detail page (dynamic route)
│   │       │       └── page.tsx
│   │       │
│   │       ├── reports/             # Báo cáo & Thống kê
│   │       │   └── page.tsx
│   │       │
│   │       ├── settings/            # Cấu hình hệ thống
│   │       │   └── page.tsx
│   │       │
│   │       ├── users/               # Quản lý người dùng
│   │       │   └── page.tsx
│   │       │
│   │       └── access-denied/       # Trang từ chối truy cập
│   │           └── page.tsx
│   │
│   ├── components/                  # Reusable components
│   │   ├── common/                  # Component dùng chung toàn app
│   │   │   ├── data-table-shell.tsx
│   │   │   ├── metric-card.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── breadcrumbs.tsx
│   │   │   ├── action-menu.tsx
│   │   │   ├── filter-shell.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── form-dialog.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── section-card.tsx
│   │   │   ├── label-value-grid.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── access-denied.tsx
│   │   │   └── index.ts             # Barrel export
│   │   │
│   │   ├── layout/                  # Layout dashboard
│   │   │   ├── app-sidebar.tsx      # Sidebar navigation (accordion)
│   │   │   ├── sidebar-items.ts     # Menu items config
│   │   │   ├── dashboard-header.tsx # Top header bar
│   │   │   ├── sidebar-context.tsx  # Sidebar state management
│   │   │   ├── tenant-context.tsx   # Tenant/scope management
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
│   │       ├── card.tsx
│   │       ├── skeleton.tsx
│   │       ├── index.ts             # Barrel export (optional)
│   │       └── ...
│   │
│   ├── data/                        # Mock data
│   │   ├── mock-[MAIN_ENTITY].ts    # Dữ liệu entity chính
│   │   ├── mock-dashboard.ts        # Dữ liệu dashboard (compute từ entity)
│   │   ├── mock-users.ts            # Dữ liệu người dùng demo
│   │   ├── mock-settings.ts         # Dữ liệu cấu hình
│   │   ├── mock-administrative-units.ts  # Đơn vị phân cấp (tenant)
│   │   ├── seeded-random.ts         # PRNG utility
│   │   └── ...
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── [MAIN_ENTITY].ts         # Type entity chính
│   │   ├── dashboard.ts             # Type dashboard metrics
│   │   ├── auth.ts                  # Type auth/user/role
│   │   ├── hooks.ts                 # Type cho API hooks
│   │   ├── settings.ts              # Type cấu hình
│   │   ├── common.ts                # Type dùng chung
│   │   └── ...
│   │
│   ├── hooks/                       # Custom React hooks (API integration)
│   │   ├── index.ts                 # Barrel export
│   │   ├── useAuth.ts
│   │   ├── useGetList.ts
│   │   ├── useGetDoc.ts
│   │   ├── useCreateDoc.ts
│   │   ├── useUpdateDoc.ts
│   │   ├── useDeleteDoc.ts
│   │   └── ...
│   │
│   ├── lib/                         # Utility & configuration
│   │   ├── utils.ts                 # Hàm cn()
│   │   ├── apiClient.ts             # Axios instance + interceptors
│   │   ├── ApiProvider.tsx           # React Query + Axios provider
│   │   ├── rbac.ts                  # RBAC permission logic
│   │   └── app-config.ts            # App name, version
│   │
│   └── middleware.ts                # Auth guard middleware
│
├── docs/                            # Tài liệu project
│   └── new-project-fe-mockup-template/  # Bộ template (folder này)
│
├── components.json                  # Shadcn UI config
├── tsconfig.json
├── postcss.config.mjs
├── next.config.ts
├── package.json
└── .env.local
```

---

## Vai trò từng folder

| Folder | Vai trò | Ghi chú |
|---|---|---|
| `src/app/` | Routing & pages | Mỗi folder = 1 route |
| `src/components/common/` | Component dùng chung | Dùng bởi nhiều module |
| `src/components/layout/` | Layout dashboard | Sidebar, header, context providers |
| `src/components/theme/` | Theme system | Provider + toggle cho light/dark |
| `src/components/ui/` | Shadcn UI primitives | Cài qua CLI, có thể customize |
| `src/data/` | Mock data | Dữ liệu giả, xóa khi có API |
| `src/types/` | TypeScript types | Interface & type cho mọi entity |
| `src/hooks/` | Custom hooks | API hooks cho Frappe/REST |
| `src/lib/` | Utilities | `cn()`, axios client, RBAC, providers |

---

## Quy tắc đặt tên file

| Loại file | Convention | Ví dụ |
|---|---|---|
| Page | `page.tsx` | `src/app/dashboard/[module]/page.tsx` |
| Layout | `layout.tsx` | `src/app/dashboard/layout.tsx` |
| Component | `kebab-case.tsx` | `metric-card.tsx`, `data-table-shell.tsx` |
| Mock data | `mock-[entity].ts` | `mock-patients.ts`, `mock-dashboard.ts` |
| Type | `[entity].ts` | `patient.ts`, `dashboard.ts`, `auth.ts` |
| Hook | `use[Action].ts` | `useGetList.ts`, `useAuth.ts` |
| Context | `[name]-context.tsx` | `tenant-context.tsx`, `sidebar-context.tsx` |
| Config | `[name]-config.ts` | `app-config.ts` |
| CSS | `globals.css` | Chỉ dùng 1 file CSS toàn cục |

---

## Quy tắc tách component

1. **`page.tsx` chỉ compose layout** — import components, pass data, sắp xếp layout.
2. **Logic tách ra component hoặc helper** — filter, sort, transform.
3. **Type đặt trong `src/types/`** — không define inline.
4. **Data đặt trong `src/data/`** — không hard-code trong component.
5. **Component dùng chung → `src/components/common/`** — khi 2+ module dùng.
6. **Component riêng module → đặt gần route** — `src/app/dashboard/[module]/components/`.
7. **Component < 300 dòng** — tách nếu dài hơn.

---

## Cách thêm module mới

1. Tạo folder route: `src/app/dashboard/[ten-module]/`.
2. Tạo `page.tsx` (list page).
3. Tạo `components/` folder với filter, table, header.
4. Tạo `[id]/page.tsx` cho detail page (nếu cần).
5. Thêm type vào `src/types/[ten-module].ts`.
6. Thêm mock data vào `src/data/mock-[ten-module].ts`.
7. Thêm menu item vào `src/components/layout/sidebar-items.ts`.
8. Thêm route label vào `src/components/common/breadcrumbs.tsx` → `routeMap`.
9. Thêm route permission vào `src/lib/rbac.ts` → `ROUTE_PERMISSIONS`.
