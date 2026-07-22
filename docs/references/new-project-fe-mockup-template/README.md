# Bộ Template FE Mockup — Khởi tạo dự án mới

## Giới thiệu

Bộ tài liệu này dùng để **khởi tạo dự án frontend mockup mới** dựa trên kiến trúc và style đã được chứng minh từ dự án gốc (agri-sync). Dự án mới sẽ tham khảo source hiện tại về:

- **Tech stack**: Next.js App Router, TypeScript, Tailwind CSS v4, Shadcn UI.
- **Layout**: Dashboard layout với sidebar collapsible + header sticky + content area.
- **Sidebar / Header / Mobile menu**: Pattern accordion menu cấp 2, tooltip khi collapsed, mobile drawer.
- **Theme system**: CSS variables (oklch), dark mode, semantic tokens.
- **Shadcn UI component usage**: Ưu tiên dùng component có sẵn, không tự viết lại primitives.
- **Mock data workflow**: Type trước → mock data sau → component consume → dashboard compute.
- **Frappe-ready architecture**: Hooks/API client chuẩn bị sẵn cho tích hợp backend sau.

## Dự án mới KHÔNG copy

- ❌ Nghiệp vụ, tên module, route cụ thể của dự án cũ.
- ❌ Mock data cụ thể (tên, địa chỉ, dữ liệu nghiệp vụ cũ).
- ❌ Logo, tên dự án, nội dung landing page cũ.
- ❌ Text, icon, dữ liệu cũ.

## Hướng dẫn sử dụng

1. **Copy folder này** (`docs/new-project-fe-mockup-template/`) sang project mới.
2. **Điền thông tin** vào file [`12-new-project-input-form.md`](./12-new-project-input-form.md).
3. **Gửi prompt tổng** trong [`13-antigravity-master-prompt.md`](./13-antigravity-master-prompt.md) cho Antigravity.
4. **Làm tiếp theo từng phase** trong [`14-phase-by-phase-prompts.md`](./14-phase-by-phase-prompts.md).
5. **Kiểm tra chất lượng** theo [`15-quality-checklist.md`](./15-quality-checklist.md).

## Danh sách file trong bộ template

| File | Mục đích |
|---|---|
| `README.md` | File giới thiệu và hướng dẫn sử dụng (file này) |
| `00-template-purpose.md` | Mục tiêu, phạm vi, loại dự án phù hợp |
| `01-tech-stack-and-setup.md` | Tech stack chuẩn và lệnh setup |
| `02-source-reference-map.md` | Bảng mapping file nguồn tham khảo |
| `03-folder-structure.md` | Cấu trúc thư mục chuẩn |
| `04-ui-theme-system.md` | Hệ thống theme, dark mode, semantic tokens |
| `05-layout-sidebar-header-mobile.md` | Layout dashboard, sidebar, header, mobile menu |
| `06-shadcn-component-policy.md` | Chính sách sử dụng Shadcn UI |
| `07-common-components-pattern.md` | Common components tái sử dụng |
| `08-routing-convention.md` | Quy ước routing |
| `09-mock-data-before-api.md` | Chiến lược mock data trước API |
| `10-frappe-ready-architecture.md` | Kiến trúc chuẩn bị cho Frappe |
| `11-rbac-and-navigation-template.md` | Template phân quyền và navigation |
| `12-new-project-input-form.md` | Form điền thông tin dự án mới |
| `13-antigravity-master-prompt.md` | Prompt tổng cho AI IDE |
| `14-phase-by-phase-prompts.md` | Bộ prompt theo từng phase |
| `15-quality-checklist.md` | Checklist kiểm tra chất lượng |
