# 09 — New Project Starter Prompt (⭐ Prompt khởi tạo project mới)

> **Đây là file quan trọng nhất.** Copy nội dung bên dưới, điền placeholder, và gửi cho AI IDE (Cursor hoặc Antigravity) để khởi tạo project mới.

---

## Prompt hoàn chỉnh

```
# YÊU CẦU: Tạo project mới từ template

## BƯỚC 1: Đọc tài liệu template

Hãy đọc toàn bộ các file trong folder `docs/project-template/` theo thứ tự:
1. `00-tech-stack.md` — Công nghệ sử dụng
2. `01-folder-structure.md` — Cấu trúc thư mục
3. `02-ui-system.md` — Hệ thống giao diện
4. `03-routing-convention.md` — Quy ước routing
5. `04-mock-data-pattern.md` — Cách tổ chức mock data
6. `05-component-pattern.md` — Pattern component
7. `06-development-workflow.md` — Quy trình phát triển
8. `07-ai-prompt-workflow.md` — Quy trình prompt chuẩn cho AI IDE
9. `08-quality-checklist.md` — Checklist chất lượng
10. `11-sidebar-mobile-menu-guide.md` — Hướng dẫn cấu trúc & hoạt động Sidebar & Mobile Menu
11. `12-shadcn-component-governance.md` — Quy chuẩn sử dụng shadcn/ui primitives

## BƯỚC 2: Thông tin project mới

### Chế độ thực hiện (EXECUTION_MODE)

Hãy chọn một trong các chế độ thực hiện dưới đây bằng cách giữ lại lựa chọn mong muốn (hoặc điền vào):
EXECUTION_MODE: [Chỉ phân tích và lập kế hoạch / Thực hiện Phase 1 / Thực hiện Phase 2 / Thực hiện một module cụ thể / Thực hiện toàn bộ project]
*(Nếu chọn "Thực hiện một module cụ thể", ghi rõ tên module cần thực hiện ở đây: _______________)*

### Thông tin chung

PROJECT_NAME: _______________
BUSINESS_DOMAIN: _______________
TARGET_USERS: _______________
DESCRIPTION: _______________

### Entity chính

MAIN_ENTITY: _______________
MAIN_ENTITY_FIELDS:
  - field1: type (mô tả)
  - field2: type (mô tả)
  - field3: type (mô tả)
  - ...

### Danh sách modules

MODULES:
  - Module 1: [tên] — [mô tả ngắn] — [icon gợi ý từ lucide-react]
  - Module 2: [tên] — [mô tả ngắn] — [icon]
  - Module 3: [tên] — [mô tả ngắn] — [icon]
  - ...

### Routes

ROUTES:
  / → Landing page
  /login → Trang đăng nhập
  /dashboard → Tổng quan
  /dashboard/[module-1] → List page module 1
  /dashboard/[module-1]/[id] → Detail page module 1
  /dashboard/[module-2] → List page module 2
  ...
  /dashboard/reports → Báo cáo
  /dashboard/settings → Cấu hình

### Dashboard metrics

DASHBOARD_METRICS:
  - KPI 1: [tên] — [mô tả]
  - KPI 2: [tên] — [mô tả]
  - KPI 3: [tên] — [mô tả]
  - KPI 4: [tên] — [mô tả]
  - KPI 5: [tên] — [mô tả]
  - KPI 6: [tên] — [mô tả]

DASHBOARD_CHARTS:
  - Chart 1: [loại chart] — [dữ liệu gì]
  - Chart 2: [loại chart] — [dữ liệu gì]

DASHBOARD_ALERTS:
  - Alert type 1: [mô tả]
  - Alert type 2: [mô tả]

### Mock data

MOCK_DATA:
  - Entity chính: [số lượng] bản ghi
  - Phân cấp đơn vị: [mô tả hierarchy]
    - Cấp trên: [tên] (ví dụ: Công ty, Bệnh viện, Tỉnh)
    - Cấp dưới: [tên] (ví dụ: Chi nhánh, Khoa, Phường)
  - Người dùng demo: [số role] roles
    - Role 1: [tên] — [quyền]
    - Role 2: [tên] — [quyền]
    - Role 3: [tên] — [quyền]

### Yêu cầu đặc biệt

SPECIAL_REQUIREMENTS:
  - [ ] Có bản đồ GIS (Leaflet)
  - [ ] Có chart (SVG tự vẽ hoặc Recharts)
  - [ ] Có workflow xét duyệt đa cấp
  - [ ] Có xuất báo cáo Excel/PDF
  - [ ] Có phân quyền RBAC
  - [ ] Có AI assistant
  - [ ] Có notification system
  - [ ] Có dark mode
  - [ ] Có landing page
  - [ ] Backend dự kiến: [Frappe / REST API / Supabase / Firebase / khác]
  - [ ] Deploy trên: [Vercel / Cloudflare / Docker / khác]

### UI Style

UI_STYLE_SOURCE:
  - [ ] Dùng default template style
  - [ ] Tham khảo website khác
  - [ ] Dùng shadcn/ui theme token
  - [ ] Dùng brand guideline riêng

DESIGN_REFERENCE:
  - Website URL hoặc mô tả style: _______________
  - Những điểm cần học theo:
    - Layout: _______________
    - Spacing: _______________
    - Card style: _______________
    - Button style: _______________
    - Typography: _______________
    - Motion/animation: _______________

SHADCN_THEME_TOKENS:
  ```css
  Dán theme token từ shadcn/ui vào đây nếu có (ví dụ: :root { --background: 0 0% 100%; ... })
  ```

BRAND_GUIDELINE:
  - Logo: _______________
  - Màu chính: _______________
  - Màu phụ: _______________
  - Font: _______________
  - Tone giao diện (Light/Dark/Sáng sủa/Tối giản): _______________

UI_STYLE:
  - Ngôn ngữ: [Tiếng Việt / Tiếng Anh / Song ngữ]

## BƯỚC 3: Yêu cầu thực hiện

Dựa trên thông tin trên và bộ tài liệu template, hãy thực hiện theo thứ tự và tuân thủ các quy tắc sau:

### Quy tắc áp dụng thiết kế (Design Priority Rules):
- Nếu có `BRAND_GUIDELINE`, ưu tiên áp dụng brand guideline hơn tất cả các nguồn khác.
- Nếu có `SHADCN_THEME_TOKENS`, ưu tiên dùng token này để cập nhật cấu hình màu sắc trong `src/app/globals.css` (cả `:root` và `.dark`).
- Nếu có `DESIGN_REFERENCE`, chỉ học theo tinh thần thiết kế (layout, spacing, card/button style, typography, motion...), tuyệt đối không sao chép nguyên bản nội dung, hình ảnh, logo, hoặc thông tin thương hiệu của website tham chiếu.

### Quy tắc sử dụng Shadcn UI (Shadcn UI Governance Rules):
- Tất cả UI primitive phải dùng shadcn/ui từ `src/components/ui`.
- Khi cần dùng Button/Card/Input/Table/Dialog..., chỉ import lại và truyền props như text, href, variant, size, className, value, onChange, onClick.
- Không viết lại primitive ở từng module.

### Phase 1: Foundation (Nền tảng)
1. Khởi tạo project Next.js với đúng tech stack.
   - Cài bộ shadcn/ui primitives nền tảng:
     button, card, input, label, textarea, select, table, badge, dropdown-menu, dialog, alert-dialog, tabs, sheet, separator, scroll-area, avatar, skeleton, tooltip, popover, sonner.
2. Tạo cấu trúc thư mục theo template.
3. Cấu hình globals.css với các color tokens theo nguồn thiết kế ưu tiên (light + dark mode).
4. Tạo root layout (font, ThemeProvider, ApiProvider).
5. Tạo ThemeProvider + ThemeToggle.
6. Tạo src/lib/utils.ts (hàm cn).

### Phase 2: Layout
7. Tạo SidebarContext.
8. Tạo TenantContext với phân cấp đơn vị phù hợp.
9. Tạo AppSidebar với menu items.
10. Tạo DashboardHeader.
11. Tạo DashboardLayout.
12. Tạo middleware auth guard.
13. Tạo login page (với demo role selector).

### Phase 3: Data
14. Tạo TypeScript types cho entity chính.
15. Tạo mock data cho entity chính (seeded random, dữ liệu realistic).
16. Tạo mock administrative units / tenant data.
17. Tạo mock users.
18. Tạo mock dashboard summary (compute từ entity data).

### Phase 4: Dashboard
19. Tạo common components: PageHeader, Breadcrumbs, MetricCard, DataTableShell.
20. Tạo dashboard home page.
21. Tạo KPI grid component.
22. Tạo chart components.
23. Tạo alert summary component.

### Phase 5: Main Module
24. Tạo list page cho entity chính (filter + table + pagination).
25. Tạo detail page cho entity chính (tabs + sections).

### Phase 6: Secondary Modules
26. Tạo list page cho mỗi module phụ.
27. Tạo detail page cho module phụ cần thiết.

### Phase 7: Reports & Settings
28. Tạo trang báo cáo thống kê.
29. Tạo trang cấu hình hệ thống.
30. Tạo trang quản lý người dùng.

### Phase 8: Landing & Polish
31. Tạo landing page (10 sections).
32. Final QA theo quality checklist.

## BƯỚC 4: Output format

Sau mỗi phase, hãy liệt kê:
- Files đã tạo/sửa
- Tóm tắt thay đổi
- Bước tiếp theo cần làm

Sau khi hoàn thành tất cả, hãy liệt kê:
- Tổng số file đã tạo
- Route map hoàn chỉnh
- Danh sách component đã tạo
- Hướng dẫn chạy project (`npm run dev`)
```

---

## Ví dụ đã điền (cho project quản lý bệnh viện)

<details>
<summary>📋 Click để xem ví dụ hoàn chỉnh</summary>

```
PROJECT_NAME: Quản lý Bệnh viện Đa khoa
BUSINESS_DOMAIN: Y tế
TARGET_USERS: Cán bộ quản lý bệnh viện, bác sĩ, y tá, admin hệ thống
DESCRIPTION: Hệ thống quản lý tập trung thông tin bệnh nhân, lịch khám, khoa phòng và báo cáo cho bệnh viện đa khoa.

MAIN_ENTITY: Bệnh nhân (Patient)
MAIN_ENTITY_FIELDS:
  - id: string (Mã định danh)
  - patientCode: string (Mã bệnh nhân)
  - fullName: string (Họ tên)
  - dateOfBirth: string (Ngày sinh DD/MM/YYYY)
  - gender: 'male' | 'female' (Giới tính)
  - phone: string (Số điện thoại)
  - identityNumber: string (CCCD)
  - insuranceNumber: string (Số thẻ BHYT)
  - address: Address (Địa chỉ)
  - department: string (Khoa điều trị)
  - admissionDate: string (Ngày nhập viện)
  - status: 'inpatient' | 'outpatient' | 'discharged' | 'transferred' (Trạng thái)

MODULES:
  - Bệnh nhân — Quản lý hồ sơ bệnh nhân — Users
  - Khoa phòng — Quản lý khoa và phòng bệnh — Building2
  - Lịch khám — Lịch hẹn khám bệnh — Calendar
  - Xét nghiệm — Kết quả xét nghiệm — FlaskConical
  - Thuốc & Vật tư — Quản lý kho thuốc — Pill
  - Báo cáo — Thống kê & báo cáo — BarChart3
  - Người dùng — Quản lý tài khoản — UserCog
  - Cấu hình — Cài đặt hệ thống — Settings

DASHBOARD_METRICS:
  - KPI 1: Tổng bệnh nhân — Tổng số bệnh nhân đang quản lý
  - KPI 2: Nội trú — Số bệnh nhân đang điều trị nội trú
  - KPI 3: Ngoại trú — Số bệnh nhân khám ngoại trú hôm nay
  - KPI 4: Giường trống — Số giường bệnh còn trống
  - KPI 5: Lịch hẹn hôm nay — Số lượng lịch hẹn khám
  - KPI 6: Cảnh báo — Bệnh nhân cần theo dõi đặc biệt

MOCK_DATA:
  - Bệnh nhân: 200 bản ghi
  - Phân cấp: Bệnh viện > Khoa > Phòng
  - Roles: Admin, Bác sĩ trưởng, Bác sĩ, Y tá

UI_STYLE:
  - Màu chủ đạo: Xanh dương (#0068d6)
  - Font: Inter
  - Phong cách: Clean, Professional
  - Ngôn ngữ: Tiếng Việt
```

</details>

---

## Lưu ý khi sử dụng

1. **Không cần điền hết** — chỉ điền phần liên quan đến project của bạn.
2. **Có thể chia nhỏ** — nếu project lớn, gửi từng Phase một thay vì toàn bộ.
3. **AI sẽ hỏi lại** — nếu thiếu thông tin, AI sẽ hỏi bạn trước khi tiếp tục.
4. **Review từng bước** — sau mỗi phase, kiểm tra code trên trình duyệt rồi mới tiếp tục.
5. **Dùng với bộ prompt bổ sung** — kết hợp với `07-ai-prompt-workflow.md` cho từng task cụ thể.
