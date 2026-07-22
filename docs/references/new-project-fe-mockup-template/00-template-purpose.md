# 00 — Mục đích Template (Template Purpose)

## Mục tiêu

Bộ tài liệu này giúp **khởi tạo dự án FE mockup mới** mà không cần bắt đầu từ đầu. Thay vì thiết kế lại layout, sidebar, theme, component pattern — dự án mới chỉ cần:

1. Tham khảo source hiện tại về style và implementation pattern.
2. Điền thông tin nghiệp vụ mới vào form input.
3. Dùng prompt để AI IDE tái tạo FE mockup theo chủ đề mới.

## Loại dự án phù hợp

Template này phù hợp cho các dự án:

- ✅ **Admin dashboard** — quản trị nội bộ, hệ thống back-office.
- ✅ **Hệ thống quản lý nghiệp vụ** — quản lý hồ sơ, quy trình, dữ liệu tác nghiệp.
- ✅ **CRM** — quản lý khách hàng, pipeline, cơ hội kinh doanh.
- ✅ **Quản lý hồ sơ** — lưu trữ, tra cứu, theo dõi hồ sơ chuyên ngành.
- ✅ **Quản lý sản xuất** — theo dõi sản phẩm, vật tư, quy trình sản xuất.
- ✅ **Landing page + Dashboard** — trang giới thiệu + hệ thống quản trị phía sau.
- ✅ **Hệ thống có dashboard/report/map** — KPI, biểu đồ, bản đồ GIS.
- ✅ **Quản lý đào tạo, y tế, nông nghiệp** — các lĩnh vực có cấu trúc dữ liệu phân cấp.

---

## Những thứ được tái sử dụng từ source cũ

| Thành phần | Chi tiết |
|---|---|
| **Layout** | Dashboard layout: sidebar + header + content area |
| **FE style** | Card style, typography, spacing, border radius, shadow, animation |
| **Sidebar / Header / Mobile menu** | Accordion menu cấp 2, tooltip collapsed, mobile drawer, overlay |
| **Common components** | PageHeader, Breadcrumbs, MetricCard, DataTableShell, ActionMenu, FilterShell, ConfirmDialog, StatusBadge, EmptyState, SectionCard, LabelValueGrid, FormDialog |
| **Mock data pattern** | Type → mock data → dashboard compute → component consume |
| **Route convention** | `/dashboard`, `/dashboard/[module]`, `/dashboard/[module]/[id]` |
| **Theme / Dark mode** | CSS variables (oklch), semantic tokens, class-based dark mode |
| **Frappe-ready hooks** | `useGetList`, `useGetDoc`, `useCreateDoc`, `useUpdateDoc`, `useDeleteDoc`, `apiClient`, `ApiProvider` |
| **RBAC pattern** | Role-based menu visibility, route guard, permission checker |

---

## Những thứ KHÔNG được copy nguyên từ source cũ

| Không copy | Lý do |
|---|---|
| **Nghiệp vụ cụ thể** | Dự án mới có domain riêng (y tế, tài chính, giáo dục...) |
| **Tên dự án** | Mỗi dự án có tên riêng |
| **Logo** | Mỗi dự án có logo riêng |
| **Nội dung landing page** | Hero text, feature descriptions là của dự án cũ |
| **Route/module cụ thể** | `/dashboard/crops`, `/dashboard/livestock` là module nghiệp vụ cũ |
| **Mock data cụ thể** | Tên thôn, tên xã, dữ liệu nông nghiệp là dữ liệu cũ |
| **Text, icon, dữ liệu cũ** | UI strings, icon mapping là theo nghiệp vụ cũ |
| **Role cũ** | `admin`, `commune_officer`, `leader` là role của dự án cũ |

---

## Nguyên tắc khi dùng template

1. **Giữ layout giống source hiện tại** — sidebar, header, mobile menu phải tái tạo giống nhất có thể.
2. **Giữ theme giống source hiện tại** — chỉ đổi `--primary` color, giữ nguyên neutral tokens.
3. **Shadcn UI là nguồn component chính** — không tự viết lại component có sẵn.
4. **FE mockup trước, backend sau** — tạo mock data trước, tích hợp API sau.
5. **Không copy nghiệp vụ cũ** — dùng placeholder generic cho dự án mới.
