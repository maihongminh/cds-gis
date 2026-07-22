# 13 — Antigravity Master Prompt (Prompt tổng cho AI IDE)

> **Hướng dẫn**: Copy toàn bộ nội dung bên dưới, dán file `12-new-project-input-form.md` đã điền vào vị trí `[DÁN_INPUT_FORM_ĐÃ_ĐIỀN]`, rồi gửi cho Antigravity.

---

````
# YÊU CẦU: Tạo FE Mockup cho dự án mới từ template

## BƯỚC 1: Đọc tài liệu template

Hãy đọc TOÀN BỘ các file trong folder `docs/new-project-fe-mockup-template/` theo thứ tự:

1. `00-template-purpose.md` — Mục tiêu template
2. `01-tech-stack-and-setup.md` — Tech stack & setup
3. `02-source-reference-map.md` — Bảng mapping file nguồn tham khảo
4. `03-folder-structure.md` — Cấu trúc thư mục
5. `04-ui-theme-system.md` — Hệ thống theme & dark mode
6. `05-layout-sidebar-header-mobile.md` — Layout, sidebar, header, mobile menu
7. `06-shadcn-component-policy.md` — Chính sách Shadcn UI
8. `07-common-components-pattern.md` — Common components
9. `08-routing-convention.md` — Quy ước routing
10. `09-mock-data-before-api.md` — Mock data pattern
11. `10-frappe-ready-architecture.md` — Kiến trúc Frappe-ready
12. `11-rbac-and-navigation-template.md` — RBAC & navigation

## BƯỚC 2: Đọc file input đã điền

Đọc file `12-new-project-input-form.md` đã được điền thông tin dự án mới:

[DÁN_INPUT_FORM_ĐÃ_ĐIỀN]

## BƯỚC 3: Tham khảo source cũ (nếu được cung cấp)

Nếu có source cũ (agri-sync hoặc project gốc) được cung cấp trong workspace:
- Tham khảo về **style, layout, sidebar/header/mobile menu, common components**.
- Dùng bảng `02-source-reference-map.md` để tìm đúng file cần đọc.
- **KHÔNG copy nghiệp vụ, module, route, mock data cụ thể** của source cũ.
- Chỉ tham khảo **implementation pattern**.

## BƯỚC 4: Quy tắc bắt buộc

### Quy tắc Layout
- Sidebar, header, mobile menu phải **tái tạo giống source hiện tại** nhất có thể.
- Không tự thiết kế sidebar/header theo style khác.
- Giữ accordion menu cấp 2, tooltip khi collapsed, mobile drawer.
- Giữ overlay + nút X đóng mobile menu.

### Quy tắc Theme
- Giữ theme style giống source hiện tại.
- Chỉ đổi `--primary` color theo `PRIMARY_COLOR` trong input form.
- Giữ nguyên neutral tokens (background, foreground, muted, border, card...).
- Dark mode phải hoạt động.

### Quy tắc Shadcn UI
- Shadcn UI là nguồn component chính.
- Không tự viết lại Button, Card, Input, Select, Table, Badge, Dialog, Tabs.
- Wrapper/business component compose từ Shadcn primitives.
- Cài component bằng `npx shadcn@latest add`.

### Quy tắc Mock Data
- Type trước, mock data sau.
- Dashboard compute từ entity data (nhất quán KPI + list page).
- Component import data từ `src/data/`, không hard-code.
- Data realistic theo chủ đề mới.

### Quy tắc Frappe-ready
- Chuẩn bị hooks structure (useGetList, useGetDoc...).
- apiClient + ApiProvider sẵn sàng.
- Không tích hợp Frappe ngay.

### Quy tắc Code
- TypeScript strict, không dùng `any`.
- Import dùng `@/` alias.
- Comment trong code viết bằng tiếng Anh.
- UI strings viết bằng tiếng Việt.
- Component < 300 dòng.
- `page.tsx` chỉ compose layout.

## BƯỚC 5: Thực hiện theo Phase

### Phase 1 — Setup & Foundation
1. Khởi tạo project (hoặc clone + cleanup).
2. Cài dependencies + Shadcn components nền tảng.
3. Tạo cấu trúc thư mục.
4. Cấu hình globals.css với color tokens.
5. Tạo root layout (font, ThemeProvider, ApiProvider).
6. Tạo `src/lib/utils.ts`, `apiClient.ts`, `ApiProvider.tsx`.

### Phase 2 — Layout & Theme
7. Tạo SidebarContext + TenantContext.
8. Tạo AppSidebar (accordion menu, collapsed, tooltip).
9. Tạo DashboardHeader (toggle, search, tenant, notifications, user).
10. Tạo DashboardLayout (sidebar + header + content + overlay).
11. Tạo ThemeProvider + ThemeToggle.
12. Tạo middleware auth guard.
13. Tạo login page (demo role selector).

### Phase 3 — Types & Mock Data
14. Tạo TypeScript types cho entity chính.
15. Tạo seeded-random utility.
16. Tạo mock data entity chính.
17. Tạo mock administrative units / tenant data.
18. Tạo mock users.
19. Tạo mock dashboard summary (compute từ entity).

### Phase 4 — Dashboard
20. Tạo common components (PageHeader, Breadcrumbs, MetricCard, DataTableShell).
21. Tạo dashboard home page.
22. Tạo KPI grid component.
23. Tạo chart components.
24. Tạo alert/ranking components.

### Phase 5 — Main Module
25. Tạo list page entity chính (filter + table + pagination).
26. Tạo detail page entity chính (tabs + sections).

### Phase 6 — Secondary Modules
27. Lặp lại pattern list + detail cho modules phụ.
28. Tạo mock data tương ứng.

### Phase 7 — Reports & Settings & Users
29. Tạo trang báo cáo thống kê.
30. Tạo trang cấu hình hệ thống.
31. Tạo trang quản lý người dùng.

### Phase 8 — Landing & Polish
32. Tạo landing page (hero, features, CTA, footer).
33. RBAC menu visibility.
34. Final QA (build, responsive, dark mode).

### Phase 9 — QA & Verify
35. Chạy `npm run build` — phải PASS.
36. Kiểm tra theo `15-quality-checklist.md`.
37. Refactor code dài > 300 dòng.

## BƯỚC 6: Output format

Sau mỗi phase, báo cáo:
- Files đã tạo/sửa.
- Tóm tắt thay đổi.
- Shadcn components đã dùng/cài thêm.
- Bước tiếp theo.

Sau khi hoàn thành tất cả:
- Tổng số file đã tạo.
- Route map hoàn chỉnh.
- Danh sách component đã tạo.
- Hướng dẫn chạy project (`npm run dev`).
````
