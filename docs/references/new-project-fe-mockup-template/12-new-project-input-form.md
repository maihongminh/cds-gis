# 12 — New Project Input Form (Form điền thông tin dự án mới)

> **Hướng dẫn**: Điền đầy đủ thông tin dưới đây cho dự án mới. Sau khi điền xong, dùng file `13-antigravity-master-prompt.md` để gửi cho AI IDE.

---

## Thông tin chung

```
PROJECT_NAME:
BUSINESS_DOMAIN:
TARGET_USERS:
DESCRIPTION:
PRIMARY_COLOR:
LOGO:
FONT:
LANGUAGE:
```

---

## Entity chính

```
MAIN_ENTITY:
MAIN_ENTITY_FIELDS:
  - field1: type (mô tả)
  - field2: type (mô tả)
  - field3: type (mô tả)
  - field4: type (mô tả)
  - field5: type (mô tả)
```

---

## Phân cấp đơn vị (Tenant Hierarchy)

```
TENANT_HIERARCHY:
  - Cấp trên: (ví dụ: Công ty, Tỉnh, Trường, Bệnh viện)
  - Cấp dưới: (ví dụ: Chi nhánh, Xã, Khoa, Phòng)
  - Ghi chú:
```

---

## Roles (Phân quyền)

```
ROLES:
  - Role 1:
    - Tên:
    - Mô tả quyền:
  - Role 2:
    - Tên:
    - Mô tả quyền:
  - Role 3:
    - Tên:
    - Mô tả quyền:
```

---

## Modules (Danh sách module nghiệp vụ)

```
MODULES:
  - Module 1:
    - route:
    - icon: (lucide-react icon name)
    - description:
    - allowedRoles:
  - Module 2:
    - route:
    - icon:
    - description:
    - allowedRoles:
  - Module 3:
    - route:
    - icon:
    - description:
    - allowedRoles:
  - Module 4:
    - route:
    - icon:
    - description:
    - allowedRoles:
  - Module 5:
    - route:
    - icon:
    - description:
    - allowedRoles:
```

---

## Dashboard Metrics

```
DASHBOARD_METRICS:
  - KPI 1:
  - KPI 2:
  - KPI 3:
  - KPI 4:
  - KPI 5:
  - KPI 6:
```

---

## Dashboard Charts

```
DASHBOARD_CHARTS:
  - Chart 1: (loại chart — dữ liệu gì)
  - Chart 2: (loại chart — dữ liệu gì)
```

---

## Mock Data Requirements

```
MOCK_DATA_REQUIREMENTS:
  - Số lượng bản ghi entity chính:
  - Phân cấp dữ liệu:
  - Dữ liệu đặc thù:
  - Trạng thái có thể:
```

---

## Special Features

```
SPECIAL_FEATURES:
  - [ ] Import Excel
  - [ ] Export Excel
  - [ ] Export PDF
  - [ ] GIS/Map (Leaflet)
  - [ ] Workflow xét duyệt
  - [ ] RBAC (phân quyền theo role)
  - [ ] Notification system
  - [ ] AI assistant
  - [ ] Audit log
  - [ ] Dark mode
  - [ ] Landing page
  - [ ] Multi-language
```

---

## UI Style Source

```
UI_STYLE_SOURCE:
  - [ ] Dùng default template style (giữ nguyên source hiện tại)
  - [ ] Tham khảo website khác
  - [ ] Dùng shadcn/ui theme token
  - [ ] Dùng brand guideline riêng

DESIGN_REFERENCE:
  - Website URL hoặc mô tả style:
  - Những điểm cần học theo:
    - Layout:
    - Spacing:
    - Card style:
    - Button style:
    - Typography:
    - Motion/animation:

SHADCN_THEME_TOKENS:
  (Dán CSS variables từ shadcn/ui customizer vào đây nếu có)

BRAND_GUIDELINE:
  - Logo:
  - Màu chính:
  - Màu phụ:
  - Font:
  - Tone giao diện:
```

---

## Frappe/Backend Future

```
FRAPPE_FUTURE:
  - DocTypes dự kiến:
    - DocType 1: (tương ứng entity nào)
    - DocType 2:
    - DocType 3:
  - API/auth/session note:
  - Backend platform: (Frappe / REST API / Supabase / Firebase / khác)
  - Deploy platform: (Vercel / Cloudflare / Docker / khác)
```
