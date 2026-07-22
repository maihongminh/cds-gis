# 10 — Current Project Reference (Ghi chú project gốc)

> **File này là reference riêng cho project gốc "Bản đồ số Gia đình Người có Công".** Không bắt buộc copy sang project mới, nhưng hữu ích để tham khảo cách triển khai thực tế.

---

## Thông tin project

| Thông tin | Giá trị |
|---|---|
| **Tên project** | Bản đồ số Gia đình Người có Công (CDS-GĐNCC) |
| **Lĩnh vực** | Quản lý chính sách xã hội — Lao động Thương binh & Xã hội |
| **Đối tượng sử dụng** | Cán bộ Sở LĐTB&XH, cán bộ Phường/Xã, Quản trị viên hệ thống |
| **Địa bàn** | TP. Đà Nẵng |
| **Package name** | `task-view` (trong package.json) |
| **Deploy** | Cloudflare Workers (OpenNext) |
| **Backend dự kiến** | Frappe Framework |

---

## Các module đã làm

| Module | Route | Trạng thái | Ghi chú |
|---|---|---|---|
| Landing page | `/` | ✅ Hoàn thành | 10 sections, full responsive, dark mode |
| Login | `/login` | ✅ Hoàn thành | Demo role selector (3 roles) |
| Dashboard | `/dashboard` | ✅ Hoàn thành | 6 KPI, 2 charts, ranking table, alerts |
| Hồ sơ NCC | `/dashboard/records` | ✅ Hoàn thành | List + Detail + Filters + Sort + Pagination |
| Chi tiết hồ sơ | `/dashboard/records/[id]` | ✅ Hoàn thành | Tabs: Info, Policy, Family, History, Audit |
| Hộ gia đình | `/dashboard/families` | ✅ Hoàn thành | List page |
| Bản đồ GIS | `/dashboard/map` | ✅ Hoàn thành | Leaflet map, filter, cluster |
| Quy trình duyệt | `/dashboard/workflow` | ✅ Hoàn thành | Workflow states |
| Nghiệp vụ hồ sơ | `/dashboard/documents` | ✅ Hoàn thành | Mượn/trả, trích lục |
| Báo cáo | `/dashboard/reports` | ✅ Hoàn thành | Multi-section report |
| Nhật ký hệ thống | `/dashboard/audit-logs` | ✅ Hoàn thành | Audit trail |
| Trợ lý AI | `/dashboard/ai` | ✅ Hoàn thành | Chat interface |
| Người dùng | `/dashboard/users` | ✅ Hoàn thành | User management + RBAC |
| Cấu hình | `/dashboard/settings` | ✅ Hoàn thành | System settings |
| Thông báo | `/dashboard/notifications` | ✅ Hoàn thành | Notification list |
| Presentation | `/presentation` | ✅ Hoàn thành | Slide trình chiếu |

---

## Cấu trúc route thực tế

```
/                                 → Landing page (10 sections)
/login                            → Login + demo role selector
/presentation                     → Trang trình chiếu
/dashboard                        → Dashboard home (KPI, charts, alerts)
/dashboard/map                    → Bản đồ GIS (Leaflet)
/dashboard/records                → Danh sách hồ sơ NCC
/dashboard/records/[id]           → Chi tiết hồ sơ NCC
/dashboard/families               → Danh sách hộ gia đình
/dashboard/workflow               → Quy trình xét duyệt
/dashboard/documents              → Nghiệp vụ & Trích lục
/dashboard/reports                → Thống kê & Báo cáo
/dashboard/audit-logs             → Nhật ký hệ thống
/dashboard/ai                     → Trợ lý AI
/dashboard/users                  → Người dùng & Quyền
/dashboard/settings               → Cấu hình hệ thống
/dashboard/notifications          → Thông báo
```

---

## Mock data thực tế

| File | Nội dung | Số bản ghi |
|---|---|---|
| `mock-records.ts` | Hồ sơ NCC | 321 (Xã Xuân Phú) + 12×11 (các phường khác) = 453 |
| `mock-administrative-units.ts` | Đơn vị hành chính | 1 tỉnh + 12 phường/xã |
| `mock-dashboard.ts` | Dashboard summary | Compute từ records |
| `mock-families.ts` | Hộ gia đình | ~50 |
| `mock-users.ts` | Người dùng hệ thống | ~10 |
| `mock-settings.ts` | Cấu hình hệ thống | ~20 settings |
| `mock-documents.ts` | Nghiệp vụ hồ sơ | ~15 |
| `mock-workflow.ts` | Phiếu duyệt | ~10 |
| `mock-reports.ts` | Báo cáo | ~8 templates |
| `mock-audit-logs.ts` | Nhật ký hệ thống | ~30 |
| `mock-current-user.ts` | User đang login | 3 roles |
| `mock-map-records.ts` | Map data | Re-export từ records |

### Đặc điểm mock data

- **Seeded PRNG**: Seed = 42, data ổn định qua mỗi reload.
- **321 bản ghi tại Xã Xuân Phú**: Đủ nhiều để test pagination, filter, sort.
- **10 loại NCC**: Phân bổ theo tỷ lệ thực tế (T02 Thương binh nhiều nhất).
- **15% deceased**: Tỷ lệ đối tượng đã mất tại Xuân Phú.
- **10% missing geo**: Hồ sơ thiếu tọa độ GPS.
- **Tên tiếng Việt realistic**: Dùng array họ, tên đệm, tên thực tế.

---

## Điểm đặc thù của project hiện tại

### 1. Phân cấp hành chính 2 cấp (Tỉnh → Phường/Xã)

Project này dùng phân cấp đơn giản: Tỉnh/TP trực tiếp tới Phường/Xã (bỏ qua cấp Quận/Huyện). Đây là đặc thù của TP. Đà Nẵng. Project khác có thể cần 3 cấp (Tỉnh → Huyện → Xã).

### 2. 10 loại đối tượng NCC

Có 10 loại đối tượng Người có Công theo quy định pháp luật Việt Nam. Mỗi loại có code (T01-T10), tên, và màu riêng. Đây là nghiệp vụ đặc thù, không áp dụng cho project khác.

### 3. Chế độ chính sách

Mỗi NCC có danh sách chế độ chính sách (trợ cấp hàng tháng, BHYT, hỗ trợ nhà ở...). Đây là nghiệp vụ phức tạp, có nhiều loại chế độ với logic tính toán riêng.

### 4. Bản đồ GIS

Project tích hợp Leaflet map để hiển thị vị trí cư trú của NCC. Mỗi hồ sơ có tọa độ GPS. Không phải project nào cũng cần tính năng này.

### 5. Cloudflare deployment

Dùng `@opennextjs/cloudflare` để deploy Next.js trên Cloudflare Workers. Có `wrangler.toml` và `open-next.config.ts`. Package này có thể bỏ nếu deploy trên Vercel hoặc nền tảng khác.

### 6. Frappe backend hooks

`src/hooks/` chứa sẵn hooks cho Frappe API pattern (useGetList, useGetDoc, useCreateDoc...). Nếu backend không phải Frappe, cần viết lại hooks.

### 7. Vercel-style đã Việt hóa (Phong cách giao diện)

Project gốc này sử dụng phong cách giao diện tối giản, độ tương phản cao lấy cảm hứng từ Vercel-style và được tối ưu hóa cho tiếng Việt. Đây chỉ là phong cách riêng được áp dụng cho dự án tham chiếu gốc, **hoàn toàn không bắt buộc** phải áp dụng cho các dự án mới. 

Khi triển khai dự án mới, lập trình viên/AI có thể linh hoạt thay thế phong cách này bằng một website reference (trang web tham chiếu) khác, dán trực tiếp bộ `SHADCN_THEME_TOKENS` (mã màu CSS variables từ shadcn/ui) hoặc triển khai theo `BRAND_GUIDELINE` (hướng dẫn thương hiệu) của khách hàng.

---

## Những phần có thể tái sử dụng

| Phần | File | Tái sử dụng |
|---|---|---|
| Layout system | `components/layout/*` | ✅ Copy nguyên, đổi menu items |
| Theme system | `components/theme/*` | ✅ Copy nguyên |
| DataTableShell | `components/common/data-table-shell.tsx` | ✅ Copy nguyên |
| MetricCard | `components/common/metric-card.tsx` | ✅ Copy nguyên |
| PageHeader + Breadcrumbs | `components/common/page-header.tsx`, `breadcrumbs.tsx` | ✅ Copy, đổi routeMap |
| Button (Shadcn) | `components/ui/button.tsx` | ✅ Copy nguyên |
| Skeleton | `components/ui/skeleton.tsx` | ✅ Copy nguyên |
| Utils (cn) | `lib/utils.ts` | ✅ Copy nguyên |
| ApiProvider | `lib/ApiProvider.tsx` | ✅ Copy, có thể đổi config |
| Middleware | `middleware.ts` | ✅ Copy, đổi cookie name |
| globals.css structure | `app/globals.css` | ✅ Copy, đổi color values |
| Root layout structure | `app/layout.tsx` | ✅ Copy, đổi font và metadata |
| Dashboard layout | `app/dashboard/layout.tsx` | ✅ Copy nguyên |
| Login page pattern | `app/login/page.tsx` | ✅ Copy, đổi form fields |

## Những phần KHÔNG nên copy nguyên

| Phần | Lý do |
|---|---|
| Mock data (`src/data/*`) | Dữ liệu đặc thù nghiệp vụ NCC, cần viết mới |
| Types (`src/types/ncc.ts`) | Type entity chính, cần viết mới cho nghiệp vụ mới |
| Landing page content | Nội dung giới thiệu đặc thù, cần viết mới |
| Chart data & colors | Phân loại NCC 10 loại, cần đổi theo nghiệp vụ |
| Administrative units | Đơn vị hành chính TP. Đà Nẵng, cần đổi |
| Sidebar items | Menu items đặc thù NCC, cần đổi |
| Breadcrumb routeMap | Route labels đặc thù, cần đổi |
| Cloudflare config | `wrangler.toml`, `open-next.config.ts` — bỏ nếu không dùng CF |

---

## File sizes reference

| File | Dòng code | Ghi chú |
|---|---|---|
| Landing page (`page.tsx`) | ~653 | Lớn nhất, 10 sections inline |
| Records list page | ~148 | Compose pattern, code ngắn |
| Records detail page | ~300+ | Nhiều tabs, có thể tách |
| DataTableShell | ~276 | Generic, reusable |
| AppSidebar | ~191 | Sidebar + mobile drawer |
| Dashboard page | ~70 | Compose pattern, rất ngắn |
| Mock records | ~278 | Seeded generation |
| Mock dashboard | ~189 | Compute from records |
