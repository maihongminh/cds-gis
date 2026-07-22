# 02 — Source Reference Map (Bảng ánh xạ file nguồn tham khảo)

## Mục đích

File này giúp AI IDE ở dự án mới biết cần đọc file nào trong source cũ để tái tạo style/structure. Khi có source cũ được cung cấp, AI sẽ dựa vào bảng này để tìm đúng file tham khảo.

> **Lưu ý**: Đường dẫn file dưới đây là theo source gốc (agri-sync). Nếu source gốc được đặt ở thư mục khác, điều chỉnh đường dẫn tương ứng.

---

## Bảng mapping tham khảo

### Nhóm 1: Cấu hình & Nền tảng

| Nhu cầu ở dự án mới | File nguồn cần tham khảo | Ghi chú |
|---|---|---|
| Cấu hình Shadcn UI | `components.json` | Style new-york, base color neutral |
| Cấu hình TypeScript | `tsconfig.json` | Path alias `@/*` |
| Cấu hình PostCSS | `postcss.config.mjs` | Plugin `@tailwindcss/postcss` |
| Cấu hình Next.js | `next.config.ts` | Rewrites, env |
| Danh sách dependencies | `package.json` | Versions tham khảo |
| CSS tokens & theme | `src/app/globals.css` | `:root` + `.dark` + `@theme inline` |

### Nhóm 2: Root Layout & Providers

| Nhu cầu ở dự án mới | File nguồn cần tham khảo | Ghi chú |
|---|---|---|
| Root layout (font, providers) | `src/app/layout.tsx` | Font Be Vietnam Pro, ThemeProvider, ApiProvider |
| Theme provider | `src/components/theme/theme-provider.tsx` | Wrapper next-themes |
| Theme toggle button | `src/components/theme/theme-toggle.tsx` | 2 variants: icon + full |
| API provider (React Query) | `src/lib/ApiProvider.tsx` | QueryClient config |
| Utility `cn()` | `src/lib/utils.ts` | clsx + tailwind-merge |

### Nhóm 3: Dashboard Layout

| Nhu cầu ở dự án mới | File nguồn cần tham khảo | Ghi chú |
|---|---|---|
| Dashboard layout shell | `src/app/dashboard/layout.tsx` | Sidebar + Header + Content + Overlay |
| Sidebar navigation | `src/components/layout/app-sidebar.tsx` | Accordion menu, collapsed, mobile drawer |
| Sidebar menu config | `src/components/layout/sidebar-items.ts` | Cấu trúc SidebarItem (single/group) |
| Dashboard header | `src/components/layout/dashboard-header.tsx` | Toggle, search, tenant, notifications, user |
| Sidebar state context | `src/components/layout/sidebar-context.tsx` | `isCollapsed`, `isMobileOpen` |
| Tenant/scope context | `src/components/layout/tenant-context.tsx` | Phân cấp đơn vị |
| Tenant switcher dropdown | `src/components/layout/tenant-switcher.tsx` | Select component cho scope |
| User menu dropdown | `src/components/layout/user-menu.tsx` | Avatar + DropdownMenu |
| Notifications menu | `src/components/layout/notifications-menu.tsx` | Bell icon + Popover |

### Nhóm 4: Common Components

| Nhu cầu ở dự án mới | File nguồn cần tham khảo | Ghi chú |
|---|---|---|
| Page header + breadcrumbs | `src/components/common/page-header.tsx` | Title, description, actions |
| Auto breadcrumbs | `src/components/common/breadcrumbs.tsx` | Auto-generate từ URL + routeMap |
| Data table (sort, paginate) | `src/components/common/data-table-shell.tsx` | Generic table shell |
| KPI metric card | `src/components/common/metric-card.tsx` | Value, icon, trend |
| Access denied page | `src/components/common/access-denied.tsx` | Trang từ chối truy cập |
| Tab navigation | `src/components/common/tabs.tsx` | Wrapper shadcn Tabs |
| Action menu (row actions) | `src/components/common/action-menu.tsx` | View, Edit, Delete dropdown |
| Filter shell | `src/components/common/filter-shell.tsx` | Container filter + count badge |
| Confirm dialog | `src/components/common/confirm-dialog.tsx` | AlertDialog wrapper |
| Form dialog | `src/components/common/form-dialog.tsx` | Dialog wrapper cho form |
| Status badge | `src/components/common/status-badge.tsx` | Badge trạng thái có màu |
| Empty state | `src/components/common/empty-state.tsx` | UI khi không có data |
| Section card | `src/components/common/section-card.tsx` | Card wrapper cho detail section |
| Label-value grid | `src/components/common/label-value-grid.tsx` | Grid hiển thị key-value |
| Barrel export | `src/components/common/index.ts` | Re-export tất cả common components |

### Nhóm 5: Mock Data & Types

| Nhu cầu ở dự án mới | File nguồn cần tham khảo | Ghi chú |
|---|---|---|
| Dashboard types | `src/types/dashboard.ts` | DashboardSummary interface |
| Auth types & roles | `src/types/auth.ts` | UserRole, AppModule, PermissionAction |
| Seeded random generator | `src/data/seeded-random.ts` | PRNG cho mock data ổn định |
| Dashboard mock data | `src/data/mock-dashboard.ts` | Compute từ entity data |
| Administrative units | `src/data/mock-administrative-units.ts` | Tenant/scope data |
| App config | `src/lib/app-config.ts` | Tên app, version |

### Nhóm 6: API / Frappe Hooks

| Nhu cầu ở dự án mới | File nguồn cần tham khảo | Ghi chú |
|---|---|---|
| Axios client | `src/lib/apiClient.ts` | CSRF token, interceptors |
| API + React Query provider | `src/lib/ApiProvider.tsx` | QueryClient config |
| Hook lấy danh sách | `src/hooks/useGetList.ts` | Frappe `get_list` pattern |
| Hook lấy chi tiết | `src/hooks/useGetDoc.ts` | Frappe `get_doc` pattern |
| Hook tạo mới | `src/hooks/useCreateDoc.ts` | Frappe `insert` pattern |
| Hook cập nhật | `src/hooks/useUpdateDoc.ts` | Frappe `set_value` pattern |
| Hook xóa | `src/hooks/useDeleteDoc.ts` | Frappe `delete` pattern |
| Hook types | `src/types/hooks.ts` | Filter, GetListArgs, OrderBy |
| Barrel export hooks | `src/hooks/index.ts` | Re-export tất cả hooks |

### Nhóm 7: Auth & RBAC

| Nhu cầu ở dự án mới | File nguồn cần tham khảo | Ghi chú |
|---|---|---|
| Middleware auth guard | `src/middleware.ts` | Cookie check, RBAC route guard |
| RBAC permission logic | `src/lib/rbac.ts` | canAccessRoute, canPerform, getVisibleSidebarTreeItems |
| Login page | `src/app/login/page.tsx` | Demo role selector |

### Nhóm 8: Landing Page

| Nhu cầu ở dự án mới | File nguồn cần tham khảo | Ghi chú |
|---|---|---|
| Landing page | `src/app/page.tsx` | Hero, features, CTA, footer |
