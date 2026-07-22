# 14 — Phase-by-Phase Prompts (Bộ prompt theo từng phase)

> **Hướng dẫn**: Gửi từng prompt theo thứ tự. Sau mỗi phase, kiểm tra kết quả trên trình duyệt trước khi tiếp tục.

---

## Prompt 0 — Đọc template và source reference

```
Hãy đọc toàn bộ các file trong folder `docs/new-project-fe-mockup-template/` theo thứ tự từ 00 đến 15.
Đặc biệt chú ý:
- `05-layout-sidebar-header-mobile.md` — phải tái tạo layout giống mô tả.
- `06-shadcn-component-policy.md` — phải dùng Shadcn UI.
- `12-new-project-input-form.md` — thông tin dự án mới đã điền.

Nếu có source cũ trong workspace, đọc các file theo bảng `02-source-reference-map.md` để hiểu style/pattern cần tái tạo.

Sau khi đọc xong, tóm tắt ngắn những điểm chính bạn hiểu:
- Tech stack.
- Layout structure.
- Sidebar behavior.
- Mock data pattern.
- Số modules cần tạo.
```

---

## Prompt 1 — Setup project

```
Thực hiện Phase 1 — Setup & Foundation cho dự án [PROJECT_NAME]:

File cần đọc trước:
- `01-tech-stack-and-setup.md`
- `03-folder-structure.md`
- `04-ui-theme-system.md`

Việc cần làm:
1. Khởi tạo project Next.js (hoặc clone source cũ và cleanup).
2. Cài dependencies: next-themes, lucide-react, cva, clsx, tailwind-merge, @tanstack/react-query, axios, sonner.
3. Cài Shadcn: `npx shadcn@latest init` rồi `npx shadcn@latest add button card input label select table badge dropdown-menu dialog alert-dialog tabs sheet separator scroll-area avatar skeleton tooltip popover sonner accordion collapsible command`.
4. Tạo cấu trúc thư mục chuẩn.
5. Tạo `src/lib/utils.ts` (hàm cn).
6. Cấu hình `src/app/globals.css` với color tokens (đổi --primary theo [PRIMARY_COLOR]).
7. Tạo root layout `src/app/layout.tsx` (font, metadata).

Quy tắc:
- Không tạo page/module nào khác ở bước này.
- Chỉ focus foundation.

Output: Liệt kê files đã tạo, confirm build pass.
```

---

## Prompt 2 — Copy/tái tạo theme + layout shell

```
Thực hiện Phase 2a — Theme & Providers:

File cần đọc trước:
- `04-ui-theme-system.md`
- Source cũ: `src/components/theme/theme-provider.tsx`, `src/components/theme/theme-toggle.tsx`
- Source cũ: `src/lib/ApiProvider.tsx`, `src/lib/apiClient.ts`

Việc cần làm:
1. Tạo `src/components/theme/theme-provider.tsx` (next-themes wrapper).
2. Tạo `src/components/theme/theme-toggle.tsx` (2 variants: icon + full).
3. Tạo `src/lib/apiClient.ts` (axios instance + CSRF interceptor).
4. Tạo `src/lib/ApiProvider.tsx` (React Query provider).
5. Tạo `src/lib/app-config.ts` (tên app, version).
6. Cập nhật root layout.tsx: wrap với ThemeProvider + ApiProvider.

Quy tắc:
- ThemeProvider dùng attribute="class".
- ThemeToggle giống style source hiện tại.
- Không tạo sidebar/header ở bước này.

Output: Files tạo, confirm dark mode toggle hoạt động.
```

---

## Prompt 3 — Sidebar/header/mobile menu giống source hiện tại

> **⚠️ QUAN TRỌNG**: Đây là prompt critical nhất.

```
Thực hiện Phase 2b — Layout Shell:

File BẮT BUỘC đọc trước:
- `05-layout-sidebar-header-mobile.md` (đọc KỸ)
- Source cũ: `src/app/dashboard/layout.tsx`
- Source cũ: `src/components/layout/app-sidebar.tsx`
- Source cũ: `src/components/layout/sidebar-items.ts`
- Source cũ: `src/components/layout/sidebar-context.tsx`
- Source cũ: `src/components/layout/dashboard-header.tsx`
- Source cũ: `src/components/layout/tenant-context.tsx`
- Source cũ: `src/components/layout/tenant-switcher.tsx`
- Source cũ: `src/components/layout/user-menu.tsx`
- Source cũ: `src/components/layout/notifications-menu.tsx`

YÊU CẦU BẮT BUỘC:
- Phải tái tạo sidebar/header/mobile menu giống source hiện tại NHẤT CÓ THỂ.
- KHÔNG tự thiết kế lại sidebar theo style khác.
- Menu cấp 2 dùng accordion/collapsible đúng pattern source hiện tại (Plus/Minus toggle, CollapsiblePanel).
- Tooltip khi collapsed (TooltipProvider + Tooltip).
- Mobile drawer: overlay + trượt từ trái + nút X đóng.
- Header desktop: SidebarToggle (PanelLeftOpen/Close) + TenantSwitcher + Search(XL) + Notifications + ThemeToggle + UserMenu.
- Header mobile: Logo+AppName + Notifications + Hamburger.
- Sidebar width: w-70 expanded, w-16 collapsed.
- Mobile footer trong sidebar: Search + TenantSwitcher + UserMenu + ThemeToggle.

Việc cần làm:
1. Tạo `src/components/layout/sidebar-context.tsx`.
2. Tạo `src/components/layout/tenant-context.tsx` (thay phân cấp theo [TENANT_HIERARCHY]).
3. Tạo `src/components/layout/sidebar-items.ts` (menu items theo [MODULES]).
4. Tạo `src/components/layout/app-sidebar.tsx` (accordion, collapsed, mobile drawer).
5. Tạo `src/components/layout/dashboard-header.tsx`.
6. Tạo `src/components/layout/tenant-switcher.tsx`.
7. Tạo `src/components/layout/user-menu.tsx`.
8. Tạo `src/components/layout/notifications-menu.tsx`.
9. Tạo `src/app/dashboard/layout.tsx` (compose all).

Kiểm tra:
- [ ] Sidebar mở/đóng desktop.
- [ ] Sidebar accordion cấp 2 hoạt động.
- [ ] Tooltip hiện khi collapsed.
- [ ] Mobile drawer mở/đóng.
- [ ] Overlay + nút X hoạt động.
- [ ] Header responsive.
- [ ] Active state highlight.

Output: Files tạo, confirm sidebar + header hoạt động đúng pattern.
```

---

## Prompt 4 — Types + mock data

```
Thực hiện Phase 3 — Types & Mock Data:

File cần đọc trước: `09-mock-data-before-api.md`

Việc cần làm:
1. Tạo `src/types/auth.ts` (UserRole, AppModule theo [ROLES]).
2. Tạo `src/types/[main-entity].ts` (entity chính theo [MAIN_ENTITY_FIELDS]).
3. Tạo `src/types/dashboard.ts` (DashboardSummary interface).
4. Tạo `src/types/hooks.ts` (Filter, GetListArgs).
5. Tạo `src/data/seeded-random.ts`.
6. Tạo `src/data/mock-[main-entity].ts` (N bản ghi, seeded random, ID ổn định).
7. Tạo `src/data/mock-administrative-units.ts` (tenant data theo [TENANT_HIERARCHY]).
8. Tạo `src/data/mock-users.ts` (demo users cho mỗi role).
9. Tạo `src/data/mock-dashboard.ts` (compute từ entity data).

Quy tắc:
- Data phải realistic theo chủ đề [BUSINESS_DOMAIN].
- Dùng tên Việt Nam, địa chỉ Việt Nam.
- Tạo >100 bản ghi để test pagination.
- Dashboard KPI phải nhất quán với list data.

Output: Files tạo, số bản ghi, danh sách types.
```

---

## Prompt 5 — Dashboard

```
Thực hiện Phase 4 — Dashboard:

File cần đọc trước: `07-common-components-pattern.md`

Việc cần làm:
1. Tạo `src/components/common/page-header.tsx`.
2. Tạo `src/components/common/breadcrumbs.tsx` (với routeMap theo modules).
3. Tạo `src/components/common/metric-card.tsx`.
4. Tạo `src/components/common/data-table-shell.tsx`.
5. Tạo `src/app/dashboard/page.tsx` (dashboard home).
6. Tạo `src/app/dashboard/components/dashboard-kpi-grid.tsx` (6 MetricCard).
7. Tạo chart components (SVG hoặc simple chart).
8. Tạo ranking table + alert list.

KPI theo [DASHBOARD_METRICS].
Charts theo [DASHBOARD_CHARTS].

Output: Files tạo, screenshot dashboard nếu có.
```

---

## Prompt 6 — Main entity list page

```
Thực hiện Phase 5a — Main Entity List Page:

Việc cần làm:
1. Tạo `src/app/dashboard/[main-entity]/page.tsx`.
2. Tạo `src/app/dashboard/[main-entity]/components/[entity]-filters.tsx`.
3. Tạo `src/app/dashboard/[main-entity]/components/[entity]-table.tsx`.
4. Tạo `src/components/common/action-menu.tsx` (nếu chưa có).
5. Tạo `src/components/common/status-badge.tsx` (nếu chưa có).
6. Tạo `src/components/common/filter-shell.tsx` (nếu chưa có).
7. Tạo `src/components/common/empty-state.tsx` (nếu chưa có).

Tính năng:
- Search, filter select, pagination.
- Sort columns (3 trạng thái).
- Row click → navigate to detail.
- Loading skeleton, empty state.
- Action menu (Xem, Sửa, Xóa) mỗi row.

Output: Files tạo, confirm filter/sort/pagination hoạt động.
```

---

## Prompt 7 — Main entity detail page

```
Thực hiện Phase 5b — Main Entity Detail Page:

Việc cần làm:
1. Tạo `src/app/dashboard/[main-entity]/[id]/page.tsx`.
2. Tạo `src/components/common/section-card.tsx` (nếu chưa có).
3. Tạo `src/components/common/label-value-grid.tsx` (nếu chưa có).
4. Tạo `src/components/common/tabs.tsx` (nếu chưa có).

Cấu trúc:
- PageHeader với breadcrumb custom.
- Tabs: Thông tin, [Related], Lịch sử.
- Tab Thông tin: grid key-value pairs.
- 404 handling khi ID không tìm thấy.

Output: Files tạo, confirm detail page render đúng.
```

---

## Prompt 8 — Secondary modules

```
Thực hiện Phase 6 — Secondary Modules:

Lặp lại pattern list + detail cho từng module phụ theo [MODULES]:
- Tạo route, page.tsx, components, mock data, types.
- Thêm sidebar items (đã có từ Prompt 3).
- Thêm breadcrumb labels.

Mỗi module phụ: list page + filter + table + (detail page nếu cần).

Output: Files tạo cho mỗi module.
```

---

## Prompt 9 — Reports/settings/users

```
Thực hiện Phase 7 — Reports, Settings, Users:

1. Tạo `/dashboard/reports` — báo cáo thống kê (chart + table).
2. Tạo `/dashboard/settings` — cấu hình hệ thống (form-like).
3. Tạo `/dashboard/users` — quản lý người dùng (table + CRUD mock).
4. Tạo `/dashboard/audit-logs` — nhật ký hoạt động (table).

Output: Files tạo.
```

---

## Prompt 10 — RBAC/menu visibility

```
Thực hiện RBAC:

File cần đọc: `11-rbac-and-navigation-template.md`

1. Tạo `src/lib/rbac.ts` với roles theo [ROLES].
2. Cập nhật middleware.ts: RBAC route guard.
3. Cập nhật sidebar: filter items theo role.
4. Tạo `/dashboard/access-denied/page.tsx`.
5. Cập nhật login page: role selector → set cookie.

Kiểm tra: Đổi role → sidebar items thay đổi → route bị chặn redirect access-denied.

Output: Files tạo/sửa, confirm RBAC hoạt động.
```

---

## Prompt 11 — Landing page

```
Thực hiện Phase 8 — Landing Page:

Tạo landing page `/` gồm:
1. Hero section (title, description, CTA button).
2. Feature grid (4-6 features).
3. Dashboard preview (screenshot mockup).
4. Workflow steps.
5. Security & roles section.
6. CTA section.
7. Footer.

Style theo `04-ui-theme-system.md` phần Landing Page Style.
Dark mode hoạt động.

Output: Files tạo, confirm landing responsive + dark mode.
```

---

## Prompt 12 — Frappe-ready hooks preparation

```
Thực hiện Phase Frappe-ready:

File cần đọc: `10-frappe-ready-architecture.md`

1. Tạo/kiểm tra `src/hooks/useGetList.ts`.
2. Tạo/kiểm tra `src/hooks/useGetDoc.ts`.
3. Tạo/kiểm tra `src/hooks/useCreateDoc.ts`.
4. Tạo/kiểm tra `src/hooks/useUpdateDoc.ts`.
5. Tạo/kiểm tra `src/hooks/useDeleteDoc.ts`.
6. Tạo/kiểm tra `src/hooks/useAuth.ts`.
7. Tạo `src/hooks/index.ts` (barrel export).

Không tích hợp API thật. Chỉ chuẩn bị hooks structure.

Output: Files tạo, hooks ready cho Frappe.
```

---

## Prompt 13 — QA/build/refactor

```
Thực hiện Phase 9 — Final QA:

1. Chạy `npm run build` — phải PASS.
2. Kiểm tra theo `15-quality-checklist.md`.
3. Tìm component > 300 dòng → tách.
4. Tìm hard-coded colors → fix.
5. Kiểm tra dark mode toàn app.
6. Kiểm tra responsive (mobile 375px, tablet 768px, desktop 1440px).
7. Kiểm tra sidebar collapsed + accordion + tooltip.
8. Kiểm tra mobile drawer + overlay.
9. Kiểm tra RBAC menu visibility.
10. Commit message đề xuất.

Output: Build status, issues found, files changed, commit message.
```
