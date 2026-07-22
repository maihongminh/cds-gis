# 07 — Model Handoff Document

## 1. Context Snapshot
*   **Timestamp**: 2026-07-14T08:58:00+07:00
*   **Current Task**: Bàn giao context (MODEL HANDOFF BEFORE — không code tính năng mới)
*   **Last Completed Task**: TASK 11 — Implement tourism services module (`feat: add tourism services module`, commit `c1a991a`)

---

## 2. Status Matrix

### Decisions Locked
*   Phạm vi hành chính: **Tỉnh Quảng Trị → Xã Lao Bảo → 12 Khóm bản** (không có tầng huyện trung gian).
*   ⚠️ **RULE-01 BẮT BUỘC** (xem `docs/laobao/08-content-rules.md`): **TUYỆT ĐỐI KHÔNG** dùng "Huyện Hướng Hóa" ở bất kỳ đâu trong UI, dữ liệu mock, hay mô tả. Xã Lao Bảo trực thuộc **Tỉnh Quảng Trị** trực tiếp. Địa chỉ chuẩn: `Xã Lao Bảo, Tỉnh Quảng Trị`.
*   Tổng kiểm chứng bắt buộc: **8.303 ha**, **23.135 người**, **5.445 hộ gia đình**.
*   Feature registry ổn định: **110 featureCode** theo BA specifications (không được thay đổi thứ tự hoặc mã hóa).
*   5 vai trò RBAC cố định: `admin`, `data_officer`, `unit_leader`, `data_governance`, `commune_leader`.
*   Cấu trúc sidebar 5 nhóm accordion theo `03-route-map.md`.
*   Next.js dynamic catch-all `/dashboard/[...catchall]` dùng làm placeholder cho các trang chưa build.
*   Tất cả bản ghi `confidential` trong tìm kiếm toàn cục phải bị lọc khỏi kết quả nếu role không phải `admin`, `data_governance`, hoặc `commune_leader`.
*   ESLint rule: ký tự nháy kép `"..."` trong JSX **phải** dùng `&quot;...&quot;` — không được dùng trực tiếp.

### Files Changed but Not Committed
*   `docs/laobao/07-model-handoff.md` — **File này** (cập nhật bàn giao, không cần commit ngay).
*   **Không có file source code nào uncommitted** — `git status --short` trả về rỗng.

### Latest Commits (7 gần nhất)
| Hash | Message |
|------|---------|
| `c1a991a` | feat: add tourism services module |
| `2424f9f` | feat: add economic data module |
| `b14768c` | feat: add administrative population module |
| `b9e4bf6` | feat: add shared data workflow mock |
| `2616188` | feat: add shared data collection components |
| `d9a269a` | feat: add system administration mock pages |
| `d22059a` | feat: implement scoped RBAC for Lao Bao |

### Lint / Typecheck / Build Status
*   `npx tsc --noEmit` → **PASSED** (0 errors)
*   `npm run lint` → **PASSED** (0 errors; 149 warnings là baseline — không có warning mới nghiêm trọng)
*   `npm run build` → **PASSED** (43 static pages, 4 dynamic routes — build sạch)

### Known Issues
*   Tất cả 149 lint warnings là **pre-existing baseline** (unused imports/vars trong các module cũ như `security-defense`, `water-resources`, `socio-economic`). Không có warning mới từ code TASK 09–11.
*   `<img>` thay vì `<Image />` trong `app-sidebar.tsx` — là warning, không phải error.

---

## 3. Progress Overview

### Đã Completed (TASK 00–11)
| Task | Commit |
|------|--------|
| TASK 00 — Bootstrap context pack | `docs: add Lao Bao project context pack` |
| TASK 01 — Audit & quarantine Tra Tap | `refactor: remove legacy Tra Tap app identity` |
| TASK 02 — Create administrative master data | `feat: add Lao Bao administrative master data` |
| TASK 03 — Update app shell & navigation | `feat: update layout and sidebar navigation` |
| TASK 04 — Shared data governance contracts | `feat: add shared data governance contracts` |
| TASK 05 — RBAC foundation | `feat: implement scoped RBAC for Lao Bao` |
| TASK 06 — Auth & system admin mock UI | `feat: add system administration mock pages` |
| TASK 07 — Shared data collection shell | `feat: add shared data collection components` |
| TASK 08 — Shared data workflow mock | `feat: add shared data workflow mock` |
| TASK 09 — Administrative & population module | `feat: add administrative population module` |
| TASK 10 — Economic data module | `feat: add economic data module` |
| TASK 11 — Tourism services module | `feat: add tourism services module` |

### Còn Pending (TASK 12–23)
| Task | Mô tả ngắn | Route target |
|------|-----------|-------------|
| TASK 12 | Land planning & construction module | `/dashboard/land-planning` |
| TASK 13 | Agriculture & environment module | `/dashboard/agriculture-environment` |
| TASK 14 | Education & health module | `/dashboard/education-health` |
| TASK 15 | Social welfare module | `/dashboard/social-welfare` |
| TASK 16 | Security & defense module (CONFIDENTIAL mock) | `/dashboard/security-defense` |
| TASK 17 | Disaster & emergency module | `/dashboard/disaster-emergency` |
| TASK 18 | Leaflet map foundation | `/dashboard/map` |
| TASK 19 | Smart map layers & permissions | `/dashboard/map/layers`, `/dashboard/map/features` |
| TASK 20 | Indicator catalog, leadership dashboard & reports | `/dashboard`, `/dashboard/indicators`, `/dashboard/reports` |
| TASK 21 | Governance settings & integration placeholders | `/dashboard/settings`, `/dashboard/integrations`, `/dashboard/backups` |
| TASK 22 | Landing page & public boundary | `/` |
| TASK 23 | Final consistency audit & QA | All routes |

---

## 4. Next Steps & Guidelines

### Next Task: **TASK 12 — Implement land planning and construction module**

**Mục tiêu**: Xây dựng trang `/dashboard/land-planning/page.tsx` quản lý dữ liệu Đất đai, Quy hoạch & Xây dựng xã Lao Bảo.

**Nội dung cần triển khai** (theo prompt `TASK 12` trong `docs/antigravity/antigravity_prompts_laobao_20260713_v1.1.md`):
*   Tab 1: **Thửa đất & Sổ đỏ** — Danh sách các thửa đất theo loại (Đất ở, Đất nông nghiệp, Đất rừng, Đất thương mại, Đất công cộng), tình trạng pháp lý (Có sổ đỏ, Chưa có, Tranh chấp).
*   Tab 2: **Quy hoạch sử dụng đất** — Bản đồ phân vùng mục đích sử dụng đất trong quy hoạch 2021–2030.
*   Tab 3: **Công trình xây dựng & Giấy phép** — Danh sách công trình (nhà ở, trụ sở, trường học, y tế) kèm trạng thái cấp phép xây dựng.
*   Tab 4: **Hạ tầng giao thông & Điện nước** — Tình trạng đường liên thôn, hệ thống điện, hệ thống cấp thoát nước.
*   Form thêm/sửa bản ghi thửa đất & công trình.
*   Workflow phê duyệt (`draft → submitted → unit_approved → published`).

**featureCodes triển khai**: `DATA-LAND-01`, `DATA-LAND-03` (và dùng chung `DATA-LAND-04` đến `DATA-LAND-07` qua shared workflow pages TASK 08).

### Files the Next Model Must Read
*   `docs/laobao/00-context-core.md`
*   `docs/laobao/01-administrative-data.md`
*   `docs/laobao/02-feature-matrix.md`
*   `docs/laobao/03-route-map.md`
*   `docs/laobao/04-data-contracts.md`
*   `docs/laobao/05-rbac-matrix.md`
*   `docs/laobao/06-progress.md`
*   `docs/laobao/07-model-handoff.md` (file này)
*   `docs/antigravity/antigravity_prompts_laobao_20260713_v1.1.md` (xem TASK 12 prompt)
*   `src/data/laobao-administrative-units.ts` (để xem cấu trúc VILLAGES, tọa độ GIS)
*   `src/app/dashboard/economy/page.tsx` (tham khảo pattern Tab + Dialog + WorkflowStatusBadge)
*   `src/app/dashboard/tourism-services/page.tsx` (tham khảo pattern mới nhất TASK 11)

---

## 5. Invariants That Must Not Change

1.  **Không có Tra Tap** — Tên thôn, cây trồng, dữ liệu của xã Trà Tập tuyệt đối không xuất hiện trong UI hoặc mock data Lao Bảo.
2.  **12 khóm bản cố định**: Triệu Phước, Tân Kim, Tân Phước, Ka Tăng, Tân Thành, Triệu Thành, Tân Long, Triệu Long, Làng Vây, Vĩnh Đông, Trung Chín, Tây Chín.
3.  **Tổng thống kê cứng**: area = 8.303 ha, population = 23.135, households = 5.445 — phải khớp với `laobao-administrative-units.ts`.
4.  **featureCode registry bất biến** — Không được rename, merge, hoặc xóa bất kỳ code nào trong 110 entries của `02-feature-matrix.md`.
5.  **Không tạo dữ liệu cá nhân nhạy cảm** — Không có CCCD, địa chỉ nhà riêng, hoặc thông tin định danh công dân thật.
6.  **Security guard cho `confidential`** — Bản ghi có `securityLevel: 'confidential'` phải bị lọc ẩn trong `/dashboard/data-search` nếu role không đủ quyền.
7.  **Unescaped quotes trong JSX** — Phải dùng `&quot;` thay cho `"` trực tiếp trong văn bản JSX.
8.  **Build phải sạch** — Mỗi task hoàn thành phải pass `tsc --noEmit`, `npm run lint` (0 errors), `npm run build`.

---

## 6. Feature Registry Traceability

### Feature Codes Completed trong TASK 09–11
| featureCode | Route | Task | Ghi chú |
|------------|-------|------|---------|
| `DATA-ADMINPOP-01` | `/dashboard/administrative-population` | TASK 09 | 6 tab chỉ tiêu, GIS khóm bản |
| `DATA-ADMINPOP-03` | `/dashboard/administrative-population` | TASK 09 | Form nhập liệu thủ công |
| `DATA-ECON-01` | `/dashboard/economy` | TASK 10 | 5 tab kinh tế, OCOP, đầu tư công |
| `DATA-ECON-03` | `/dashboard/economy` | TASK 10 | Form doanh nghiệp, sản phẩm OCOP |
| `DATA-TOUR-01` | `/dashboard/tourism-services` | TASK 11 | 4 tab: điểm du lịch, lưu trú, OCOP showcase, media |
| `DATA-TOUR-03` | `/dashboard/tourism-services` | TASK 11 | Form thêm/sửa điểm du lịch, khách sạn |

### Feature Codes cho TASK 12 (Next)
| featureCode | Route | Task |
|------------|-------|------|
| `DATA-LAND-01` | `/dashboard/land-planning` | TASK 12 |
| `DATA-LAND-03` | `/dashboard/land-planning` | TASK 12 |
