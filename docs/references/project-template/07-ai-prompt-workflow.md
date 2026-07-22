# 07 — AI Prompt Workflow (Bộ prompt chuẩn cho AI IDE)

## Hướng dẫn sử dụng

Mỗi prompt dưới đây có **placeholder** (chỗ trống cần điền). Thay các placeholder bằng thông tin cụ thể của project mới trước khi gửi cho AI.

### Danh sách placeholder

| Placeholder | Ý nghĩa | Ví dụ |
|---|---|---|
| `[PROJECT_NAME]` | Tên project | Quản lý bệnh viện |
| `[BUSINESS_DOMAIN]` | Lĩnh vực nghiệp vụ | Y tế, Giáo dục, Tài chính |
| `[MAIN_ENTITY]` | Entity chính (đối tượng quản lý chính) | Bệnh nhân, Học sinh, Hồ sơ |
| `[MODULE_LIST]` | Danh sách module | Hồ sơ, Khoa phòng, Lịch khám |
| `[ROUTES]` | Danh sách route | /dashboard, /dashboard/patients |
| `[MOCK_DATA_REQUIREMENTS]` | Yêu cầu dữ liệu mock | 200 bệnh nhân, 10 khoa |
| `[UI_STYLE]` | Phong cách giao diện | Xanh dương chủ đạo, dark mode |
| `[TENANT_HIERARCHY]` | Phân cấp đơn vị | Bệnh viện > Khoa > Phòng |
| `[FONT_NAME]` | Font chữ | Inter, Be Vietnam Pro |

---

## 0. Prompt nền trước mọi task

Đây là prompt nền cần chạy TRƯỚC khi AI thực hiện bất kỳ task code nào (kể cả refactor, sửa lỗi, hay thêm tính năng). Mục đích là để AI hiểu đúng quy chuẩn thiết kế, công nghệ, và phạm vi thực hiện của dự án, tránh viết code tùy tiện hoặc lan man ngoài phạm vi của task hiện tại.

```
Bạn là một AI assistant phát triển phần mềm có năng lực cao. Trước khi thực hiện bất kỳ công việc nào trong task này, bạn CẦN thực hiện các bước sau:

1. Đọc và hiểu các tài liệu thiết kế và quy chuẩn sau trong thư mục `docs/project-template/`:
   - `00-tech-stack.md` (để nắm vững bộ công nghệ và quy ước sử dụng package)
   - `01-folder-structure.md` (để tuân thủ cấu trúc thư mục)
   - `02-ui-system.md` (để áp dụng đúng màu sắc, typography, component styles và dark mode)
   - `03-routing-convention.md` (để tuân thủ quy ước routing và middleware)
   - `05-component-pattern.md` (để viết component chuẩn và tái sử dụng các components)
   - `07-ai-prompt-workflow.md` (để tuân thủ đúng quy trình làm việc của AI)
   - `12-shadcn-component-governance.md` (để bắt buộc dùng shadcn/ui primitives, không tự viết lại Button/Card/Input/Table/Dialog...)

2. Quy tắc thực hiện công việc:
   - CHỈ thực hiện đúng phạm vi của task hiện tại được yêu cầu. Không tự ý thêm bớt các tính năng nằm ngoài mô tả.
   - Không tự ý thay đổi cấu trúc thư mục hoặc tạo các folder/file mới khi không có yêu cầu rõ ràng.
   - Luôn ưu tiên tái sử dụng các component có sẵn trong dự án thay vì tạo mới component tương tự.
   - Bắt buộc tuân thủ Shadcn-first: UI primitive phải dùng component trong `src/components/ui`.
   - Không tự viết lại Button, Card, Input, Select, Table, Badge, Dialog, Tabs nếu shadcn/ui đã có.
   - Business component chỉ compose từ shadcn/ui primitives.
   - Viết mã sạch, kiểm soát chặt chẽ kiểu dữ liệu TypeScript (không dùng any, không bỏ qua lỗi type).
   - **QUAN TRỌNG**: Tất cả comment trong code (`//`, `/* */`, `/** */`, `{/* */}`) phải viết bằng **tiếng Anh**. Không dùng tiếng Việt trong comment. UI strings (nhãn, placeholder, thông báo) vẫn giữ tiếng Việt.

Sau khi đọc và hiểu rõ các tài liệu trên, hãy thực hiện trực tiếp task hiện tại [TÊN_TASK_HIỆN_TẠI] mà không cần dừng lại phản hồi xác nhận riêng. Báo cáo kết quả chi tiết sau khi hoàn thành toàn bộ công việc.
```

---

## 1. Prompt Setup Project

```
Tạo project Next.js mới với cấu hình sau:

## Tech Stack
- Next.js App Router (latest, TypeScript)
- Tailwind CSS v4 (postcss, không dùng tailwind.config)
- Shadcn UI (style: new-york, base color: neutral)
- lucide-react (icon library)
- next-themes (light/dark/system)
- class-variance-authority + clsx + tailwind-merge
- @tanstack/react-query + axios

## Cấu trúc thư mục
Tạo cấu trúc theo docs/project-template/01-folder-structure.md:
- src/app/ (routing)
- src/components/common/ (component dùng chung)
- src/components/layout/ (layout components)
- src/components/theme/ (theme system)
- src/components/ui/ (shadcn)
- src/data/ (mock data)
- src/types/ (TypeScript types)
- src/hooks/ (custom hooks)
- src/lib/ (utilities)

## Cấu hình cần thiết
- tsconfig.json: path alias @/* → ./src/*
- postcss.config.mjs: plugin @tailwindcss/postcss
- components.json: shadcn config
- globals.css: Tailwind imports + color tokens (light + dark)
- Font: [FONT_NAME] từ next/font/google, hỗ trợ tiếng Việt

## File cần tạo
- src/lib/utils.ts (hàm cn)
- src/components/theme/theme-provider.tsx
- src/app/layout.tsx (root layout với ThemeProvider)

Project name: [PROJECT_NAME]
```

---

## 2. Prompt tạo Layout

```
Đọc file docs/project-template/05-component-pattern.md phần Layout Components.

Tạo dashboard layout cho project [PROJECT_NAME] gồm:

## Dashboard Layout (src/app/dashboard/layout.tsx)
- Sidebar bên trái (w-70, collapsible w-16)
- Header sticky trên (h-16)
- Main content scrollable

## Sidebar (src/components/layout/app-sidebar.tsx)
Menu items:
- Tổng quan → /dashboard (icon: LayoutDashboard)
- [MODULE_1] → /dashboard/[module-1] (icon: ...)
- [MODULE_2] → /dashboard/[module-2] (icon: ...)
- ... (thêm theo [MODULE_LIST])
- Cấu hình → /dashboard/settings (icon: Settings)

Features:
- Collapse/expand trên desktop
- Drawer overlay trên mobile
- Active state highlight
- Logo + version footer

## Header (src/components/layout/dashboard-header.tsx)
- Sidebar toggle button (desktop)
- Logo (mobile only)
- Scope switcher ([TENANT_HIERARCHY]) (desktop)
- Search input (desktop)
- Theme toggle (desktop)
- User menu dropdown (desktop)
- Mobile menu button

## Context Providers
- SidebarContext (collapsed, mobileOpen state)
- TenantContext ([TENANT_HIERARCHY] scope management)

Phong cách: Clean, professional, theo docs/project-template/02-ui-system.md
```

---

## 3. Prompt tạo Dashboard

```
Đọc file docs/project-template/05-component-pattern.md phần Dashboard pattern.

Tạo trang dashboard tổng quan cho project [PROJECT_NAME]:

## Mock Data cần tạo trước
- src/types/dashboard.ts: DashboardSummary interface
- src/data/mock-dashboard.ts: getDashboardSummary(scopeFilter)

## KPI Cards (6 thẻ, grid 3 cột)
1. [KPI_1]: ví dụ "Tổng số [MAIN_ENTITY]"
2. [KPI_2]: ví dụ "Đang hoạt động"
3. [KPI_3]: ví dụ "[Trạng thái đặc biệt]"
4. [KPI_4]: ví dụ "Chờ duyệt"
5. [KPI_5]: ví dụ "[Cảnh báo]"
6. [KPI_6]: ví dụ "[Metric khác]"

Dùng MetricCard component từ src/components/common/metric-card.tsx.

## Charts (grid 2 cột)
- Chart 1: Phân bổ theo loại (pie/donut hoặc horizontal bar)
- Chart 2: Biến động theo tháng (grouped bar chart, SVG tự vẽ)

## Bottom Section (grid 2 cột)
- Table xếp hạng: Top [đơn vị con] theo số lượng
- Alert list: Cảnh báo cần xử lý

Dashboard data phải compute từ mock-[MAIN_ENTITY].ts.
```

---

## 4. Prompt tạo List Page

```
Đọc file docs/project-template/05-component-pattern.md phần Filter Pattern và DataTableShell.

Tạo trang danh sách [MODULE_NAME] tại src/app/dashboard/[module-path]/:

## Files cần tạo
- page.tsx (compose layout)
- components/[module]-header.tsx (title + action buttons)
- components/[module]-filters.tsx (search + select filters)
- components/[module]-table.tsx (column definitions, dùng DataTableShell)
- components/[module]-status-badge.tsx (nếu có status)

## Cột table
1. Mã — sortable
2. Tên — sortable
3. Loại
4. Trạng thái — badge màu
5. Ngày tạo — sortable (DD/MM/YYYY)
6. Thao tác — dropdown menu (Xem, Sửa, Xóa)

## Filters
- Search: tìm theo tên, mã
- Select 1: lọc theo loại
- Select 2: lọc theo trạng thái
- Select 3: lọc theo [đơn vị] (nếu có)

## Features
- Loading skeleton khi load
- Empty state khi không có data
- Row click → navigate to detail page
- Pagination tự động
- Toast notification khi action

Mock data: import từ src/data/mock-[entity].ts
Types: import từ src/types/[entity].ts
```

---

## 5. Prompt tạo Detail Page

```
Tạo trang chi tiết [ENTITY] tại src/app/dashboard/[module]/[id]/page.tsx:

## Cấu trúc
- PageHeader với breadcrumb custom
- Tab system với các tab:
  - Tab 1: Thông tin cơ bản (grid 2 cột, label-value pairs)
  - Tab 2: [Related items] (table hoặc card list)
  - Tab 3: Lịch sử thay đổi (timeline hoặc table)
  - Tab 4: Tài liệu đính kèm (file list)

## Thông tin cơ bản
- Field 1: ...
- Field 2: ...
- Field 3: ...
(Liệt kê các field cần hiển thị)

## Actions
- Nút "Chỉnh sửa" (toast placeholder)
- Nút "Xóa" (toast placeholder)
- Nút "In hồ sơ" (toast placeholder)

Data lấy từ: mockData.find(r => r.id === params.id)
```

---

## 6. Prompt tạo Mock Data

```
Đọc docs/project-template/04-mock-data-pattern.md.

Tạo mock data cho module [MODULE_NAME]:

## Type (src/types/[entity].ts)
```typescript
export interface [EntityName] {
  id: string;
  code: string;
  [field1]: string;
  [field2]: number;
  status: '[status1]' | '[status2]' | '[status3]';
  createdAt: string;  // DD/MM/YYYY
}
```

## Mock Data (src/data/mock-[entity].ts)
- Tạo [N] bản ghi
- Dùng seeded PRNG cho dữ liệu ổn định
- ID format: [entity]-[scope]-[number]
- Dữ liệu realistic (tên tiếng Việt, địa chỉ thực)
- Phân bổ status: 70% active, 15% pending, 10% inactive, 5% archived

## Dashboard data (cập nhật src/data/mock-dashboard.ts)
- Compute tổng số, phân loại, trending từ mock entity data

[MOCK_DATA_REQUIREMENTS]
```

---

## 7. Prompt thêm Dark Mode

```
Đọc docs/project-template/02-ui-system.md phần Dark Mode.

Kiểm tra và hoàn thiện dark mode cho project [PROJECT_NAME]:

1. Đảm bảo globals.css có đầy đủ .dark {} block.
2. Kiểm tra tất cả component dùng semantic tokens (bg-background, text-foreground...).
3. Tìm và sửa hard-coded colors (bg-white, text-black, bg-gray-...).
4. Đảm bảo ThemeProvider dùng attribute="class".
5. Đảm bảo ThemeToggle hoạt động đúng.
6. Kiểm tra landing page có dark mode đúng.
7. Kiểm tra login page có dark mode đúng.
8. Kiểm tra chart/SVG colors trong dark mode.

Liệt kê tất cả file đã sửa và mô tả thay đổi.
```

---

## 8. Prompt Review Code

```
Review toàn bộ source code project [PROJECT_NAME] theo checklist:

## Kiểm tra cấu trúc
- [ ] Folder structure đúng theo template
- [ ] Không có file thừa/orphan
- [ ] Import paths sử dụng @/ alias

## Kiểm tra TypeScript
- [ ] Không có `any` type
- [ ] Không có `// @ts-ignore`
- [ ] Interface/Type export đúng

## Kiểm tra UI
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Dark mode hoạt động
- [ ] Empty state có xử lý
- [ ] Loading state có skeleton

## Kiểm tra logic
- [ ] Filter hoạt động đúng
- [ ] Sort hoạt động đúng
- [ ] Pagination hoạt động đúng
- [ ] Navigation hoạt động đúng

Liệt kê vấn đề tìm thấy và đề xuất fix.
```

---

## 9. Prompt Refactor

```
Refactor code project [PROJECT_NAME]:

1. Tìm component > 300 dòng → tách ra component con.
2. Tìm logic lặp lại → tạo custom hook hoặc utility function.
3. Tìm hard-coded strings → chuyển thành constant.
4. Tìm inline styles → chuyển thành Tailwind class.
5. Đảm bảo import gọn gàng (group by: react → next → lib → components → types → data).
6. Đảm bảo named export cho component (không dùng default export cho component, chỉ dùng cho page).

Liệt kê file đã refactor và mô tả thay đổi.
```

---

## 10. Prompt kiểm tra trước Commit

```
Kiểm tra project [PROJECT_NAME] trước khi commit:

1. Chạy `npm run build` — phải PASS không lỗi.
2. Kiểm tra TypeScript errors.
3. Kiểm tra import paths (không broken imports).
4. Kiểm tra hydration warnings trong console.
5. Kiểm tra responsive trên 3 breakpoints (mobile 375px, tablet 768px, desktop 1440px).
6. Kiểm tra dark mode toggle.
7. Kiểm tra navigation (sidebar links, breadcrumbs).
8. Liệt kê files changed.
9. Đề xuất commit message theo Conventional Commits format.

Format output:
## Build Status: ✅/❌
## Issues Found: [danh sách]
## Files Changed: [danh sách]
## Suggested Commit: [message]
```

---

## 11. Prompt áp dụng theme hoặc website reference

Prompt này được sử dụng khi bạn cần yêu cầu AI cập nhật giao diện dự án dựa trên tài liệu thiết kế (CSS variables từ shadcn/ui) hoặc dựa trên một website tham chiếu có sẵn.

### Nội dung Prompt:

```
# YÊU CẦU: Cập nhật giao diện dự án theo nguồn thiết kế tham chiếu

Hãy đọc tài liệu `docs/project-template/02-ui-system.md` trước khi thực hiện.

Dưới đây là thông tin nguồn thiết kế cần áp dụng cho dự án [PROJECT_NAME]:

[ĐIỀN_THÔNG_TIN_THIẾT_KẾ_VÀO_ĐÂY]
*(Ví dụ: Dán SHADCN_THEME_TOKENS hoặc dán link/mô tả DESIGN_REFERENCE ở đây)*

Hãy thực hiện cập nhật giao diện theo hướng dẫn tương ứng dưới đây:

### TRƯỜNG HỢP 1: Áp dụng shadcn/ui theme token
Nếu thông tin cung cấp ở trên là bộ theme token (CSS variables) từ shadcn/ui:
1. Đọc và phân tích các biến CSS màu sắc trong bộ token.
2. Cập nhật các biến CSS này vào vùng `:root` (light mode) và `.dark` (dark mode) trong file `src/app/globals.css`.
3. Đảm bảo toàn bộ các component trong dự án tự động nhận diện màu sắc mới qua các class ngữ nghĩa (semantic tokens như bg-background, text-foreground, bg-card, border-border, bg-primary...).
4. Tuyệt đối KHÔNG hard-code (viết cứng) mã màu vào code component.
5. KHÔNG thay đổi cấu trúc file, không sửa routes, không sửa logic nghiệp vụ hoặc mock data hiện có.
6. Kiểm tra trực quan xem giao diện hiển thị đúng đắn ở cả 2 chế độ Sáng (Light mode) và Tối (Dark mode).

### TRƯỜNG HỢP 2: Áp dụng website reference
Nếu thông tin cung cấp ở trên là link hoặc mô tả phong cách thiết kế của một website tham chiếu:
1. Phân tích tinh thần thiết kế chủ đạo của website tham chiếu (phong cách hiện đại, cổ điển, tối giản...).
2. Chỉ học tập và làm theo các yếu tố thiết kế kỹ thuật bao gồm: layout (bố cục), spacing (khoảng cách), typography (phông chữ), border radius (độ bo góc), card style (kiểu dáng thẻ), button style (kiểu dáng nút), và motion/animation (hiệu ứng chuyển động).
3. Tuyệt đối KHÔNG sao chép nội dung văn bản, hình ảnh, logo, hoặc bất kỳ thông tin nhận diện thương hiệu nào của website tham chiếu.
4. Chuyển đổi các đặc điểm thiết kế đã phân tích thành các cấu hình CSS variables trong `src/app/globals.css` hoặc các class Tailwind tương ứng trong project.
5. Đảm bảo giữ nguyên cấu trúc component hiện tại của dự án, không phá vỡ logic giao diện đang hoạt động.

Sau khi hoàn thành, hãy liệt kê các file đã chỉnh sửa và mô tả ngắn gọn sự thay đổi về giao diện.
```

