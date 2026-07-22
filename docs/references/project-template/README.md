# 📦 Project Template — Bộ tài liệu tái sử dụng

## Mục đích

Bộ tài liệu này được trích xuất từ project thực tế **"Bản đồ số Gia đình Người có Công"** và được tổng quát hóa để làm **template** cho các project mới có cùng:

- Công nghệ (tech stack).
- Cấu trúc thư mục.
- Cách tổ chức component.
- Cách sử dụng mock data.
- Workflow phát triển từng bước bằng AI IDE (Cursor, Antigravity).
- Phong cách giao diện (UI style).

Chỉ khác nhau ở **phần nghiệp vụ, tính năng và dữ liệu đầu vào** của từng project.

## Phù hợp với loại project nào?

| Loại project | Ví dụ |
|---|---|
| Dashboard quản lý | Quản lý nhân sự, quản lý tài sản, quản lý bệnh viện |
| Hệ thống nghiệp vụ | Quản lý hồ sơ, quản lý chế độ chính sách, CRM |
| Admin panel | Quản trị nội dung, quản trị người dùng |
| Landing page + Dashboard | Trang giới thiệu + hệ thống quản lý phía sau |
| Hệ thống có bản đồ GIS | Quản lý dân cư, quản lý cơ sở hạ tầng |

## Danh sách file tài liệu

| File | Nội dung |
|---|---|
| `00-tech-stack.md` | Công nghệ đang dùng, vai trò, quy ước |
| `01-folder-structure.md` | Cấu trúc thư mục chuẩn |
| `02-ui-system.md` | Hệ thống UI: color, typography, component style |
| `03-routing-convention.md` | Quy ước routing với Next.js App Router |
| `04-mock-data-pattern.md` | Cách tổ chức mock data |
| `05-component-pattern.md` | Pattern tổ chức component |
| `06-development-workflow.md` | Quy trình phát triển từng bước |
| `07-ai-prompt-workflow.md` | Bộ prompt chuẩn dùng với AI IDE |
| `08-quality-checklist.md` | Checklist kiểm tra chất lượng trước commit |
| `09-new-project-starter-prompt.md` | ⭐ Prompt khởi tạo project mới (quan trọng nhất) |
| `10-current-project-reference.md` | Ghi chú riêng cho project gốc |
| `11-sidebar-mobile-menu-guide.md` | Hướng dẫn cấu trúc & hoạt động Sidebar & Mobile Menu |
| `12-shadcn-component-governance.md` | Quy chuẩn bắt buộc về sử dụng shadcn/ui primitives và business wrappers |


## Cách sử dụng với Cursor hoặc Antigravity

### Bước 1: Copy bộ tài liệu

Copy toàn bộ folder `docs/project-template/` vào project mới.

### Bước 2: Mở file prompt khởi tạo

Mở file `09-new-project-starter-prompt.md`, điền đầy đủ placeholder nghiệp vụ mới.

### Bước 3: Gửi prompt cho AI IDE

Paste nội dung prompt đã điền vào Cursor hoặc Antigravity. AI sẽ:

1. Đọc bộ tài liệu template.
2. Khởi tạo project với đúng tech stack.
3. Tạo cấu trúc thư mục theo template.
4. Tạo mock data theo nghiệp vụ mới.
5. Tạo landing page, login, dashboard.
6. Tạo route và module theo danh sách tính năng.

### Bước 4: Phát triển theo workflow

Làm theo thứ tự trong `06-development-workflow.md`, sử dụng prompt trong `07-ai-prompt-workflow.md` cho từng bước.

### Bước 5: Kiểm tra chất lượng

Dùng `08-quality-checklist.md` trước mỗi commit.

## Lưu ý

- Tài liệu viết bằng **tiếng Việt**, thuật ngữ tiếng Anh có mở ngoặc giải thích.
- Tất cả nội dung dựa trên **source code thực tế** đã kiểm chứng.
- File `10-current-project-reference.md` là reference riêng cho project gốc, **không bắt buộc** copy sang project mới.
