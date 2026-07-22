# 08 — Legacy Tra Tap Audit & Quarantine Inventory

This document tracks all occurrences of legacy regional information (Trà Tập commune, Nam Trà My district, Quảng Nam province, Đà Nẵng) and specific agricultural properties (Sâm Ngọc Linh, Quế Trà My, Heo đen Trà Tập) identified in the codebase, detailing their classifications and quarantine plan.

---

## 1. Global Identity Audits (Completed in TASK 01)
The following files containing global identity variables and landing texts have been updated immediately in TASK 01 to point to **Xã Lao Bảo, Hướng Hóa, Quảng Trị** and generic local crops (Cà phê, Chuối):

| File Path | Original Content | Type | Action Taken |
| :--- | :--- | :---: | :--- |
| `src/lib/app-config.ts` | "Xã Trà Tập", "Dữ Liệu Kinh Tế Xã Hội Xã Trà Tập", "UBND xã Trà Tập" | `app identity` | **Removed / Replaced** with "Xã Lao Bảo", "UBND xã Lao Bảo", and Lao Bảo system description. |
| `src/data/mock-settings.ts` | `communeName: 'Xã Trà Tập'`, `provinceName: 'TP. Đà Nẵng'` | `admin data` | **Removed / Replaced** with "Xã Lao Bảo" and "Tỉnh Quảng Trị". |
| `src/components/layout/app-sidebar.tsx` | "Toàn xã Trà Tập", "@tra-tap.gov.vn" | `UI text` / `identity`| **Removed / Replaced** with "Toàn xã Lao Bảo" and "@laobao.gov.vn". |
| `src/app/page.tsx` (Landing) | "Ủy ban Nhân dân Xã Trà Tập", "8 thôn", "sâm Ngọc Linh, quế Trà My", "tratap.gov.vn", "Nam Trà My", "Đà Nẵng" | `UI text` / `identity`| **Removed / Replaced** with Lao Bảo commune details, 12 villages, Cà phê & Chuối crop indicators, laobao.gov.vn domains, and Hướng Hóa / Quảng Trị. |

---

## 2. Legacy Code & Mock Data Quarantine List (Migrate/Cleanup Later)
These files contain mock data records and localized UI descriptors of old modules. To avoid breaking compilation or UI rendering before implementing target modules, they are listed here to be cleaned up systematically in subsequent tasks (specifically TASK 02, 04, 07, and the 9 data module implementations):

### Mock Data Files (`src/data/`)
*   **`src/data/mock-dashboard.ts`**
    *   *Content*: `communeName: 'Xã Trà Tập'` (line 428)
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 02/04 - to be replaced by Lao Bảo mock database initializers)
*   **`src/data/mock-water-resources.ts`**
    *   *Content*: "HTX Nông nghiệp Trà Tập", "Trạm Y tế xã Trà Tập", "UBND xã Trà Tập" (lines 18, 19, 85)
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 13 - when rewriting water resources data module)
*   **`src/data/mock-irrigation.ts`**
    *   *Content*: "Hợp tác xã Nông nghiệp Dịch vụ Trà Tập", "Ban chỉ đạo Phát triển Thủy lợi xã Trà Tập" (lines 15, 60)
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 13 - when rewriting irrigation/hydrology data module)
*   **`src/data/mock-transportation.ts`**
    *   *Content*: "Đường liên xã Trà Tập - Trà Cang", "Tuyến đường trung tâm xã Trà Tập", "Đường cứu hộ cứu nạn Trà Tập", "Đường vào trạm y tế Trà Tập", "Hợp tác xã dịch vụ xây dựng Trà Tập"
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 12 - when rewriting transportation/infrastructure module)
*   **`src/data/mock-socio-economic.ts`**
    *   *Content*: "Thống kê lao động việc làm xã Trà Tập", "Tổng hợp hiện trạng hạ tầng nông thôn xã Trà Tập"
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 09/10 - when rewriting socioeconomic stats)
*   **`src/data/mock-environment.ts`**
    *   *Content*: "Trại heo giống Trà Tập", "HTX Sâm Ngọc Linh Trà Tập", "Nhà máy gạch ngói Trà Tập"
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 13 - when rewriting environment module)
*   **`src/data/mock-db.ts`**
    *   *Content*: "Hợp tác xã nông nghiệp Trà Tập", "báo cáo toàn xã Trà Tập"
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 04 - when building database core mock)
*   **`src/data/mock-catalogs.ts`**
    *   *Content*: "Sâm Ngọc Linh", "Heo đen Trà Tập" (specialty entries)
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 02 - administrative and catalog seed setup)
*   **`src/data/mock-business-households.ts`**
    *   *Content*: "Đại lý nông sản Trà Tập"
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 10 - economic module setup)
*   **`src/data/mock-administrative-units.ts`**
    *   *Content*: `name: 'Xã Trà Tập'`
    *   *Type*: `mock data`
    *   *Action*: `migrate later` (Task 02 - administrative setup)

### Module Page & Dialog UI Strings (`src/app/`)
*   **`src/app/dashboard/catalogs/page.tsx`**
    *   *Content*: "các tiêu chí nghèo đói tại xã Trà Tập" (line 112)
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 07 - standardizing catalog dashboards)
*   **`src/app/dashboard/climate/page.tsx`**
    *   *Content*: "sản xuất nông nghiệp tại xã Trà Tập" (line 214)
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 17 - climate/disaster module setup)
*   **`src/app/dashboard/irrigation/page.tsx`**
    *   *Content*: "thủy lợi xã Trà Tập" (line 218)
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 13 - water/hydrology page updates)
*   **`src/app/dashboard/security-defense/page.tsx`**
    *   *Content*: "tệ nạn xã hội tại xã Trà Tập" (line 231)
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 16 - defense page updates)
*   **`src/app/dashboard/water-resources/page.tsx`**
    *   *Content*: "địa bàn xã Trà Tập" (line 237)
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 13 - water resources page updates)
*   **`src/app/dashboard/transportation/page.tsx`**
    *   *Content*: "Toàn xã Trà Tập" (line 174), "ách tắc xã Trà Tập" (line 369)
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 12 - transportation updates)
*   **`src/app/dashboard/socio-economic/page.tsx`**
    *   *Content*: "hạ tầng nông thôn toàn xã Trà Tập" (line 250)
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 09/10 - socioeconomic updates)
*   **`src/app/dashboard/forest-dvmtr/[id]/page.tsx`**
    *   *Content*: "Quỹ bảo vệ và phát triển rừng tỉnh Quảng Nam" (line 151)
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 13 - forestry DVMTR updates)
*   **`src/app/dashboard/notifications/page.tsx`**
    *   *Content*: "Ban Quản lý Rừng phòng hộ Nam Trà My", "Trạm thú y xã nhận 1,200 liều vắc-xin bảo quản lạnh từ huyện Nam Trà My."
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 08 - notifications module)
*   **`src/app/dashboard/climate/components/climate-form-dialog.tsx`**
    *   *Content*: "Trạm khí tượng Nam Trà My (mock)" (line 57, 118)
    *   *Type*: `UI text`
    *   *Action*: `migrate later` (Task 17 - climate form updates)

---

## 3. Safe Harmless Code Design Patterns
The following items contain technical architecture names that match legacy terms, but do not contain business-polluting names, and are reused directly for functional mapping:
*   `hamletCode`, `hamletName` (technically identical to `villageCode` / `villageName` under the generic layout structure). These keys are kept at implementation-only level to maintain backward compatibility with shadcn components/layouts.
