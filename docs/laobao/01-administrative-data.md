# 01 — Administrative Data: Lao Bao Commune

## 1. Metadata
*   **sourceType**: `project-provided-administrative-input`
*   **sourceReference**: Nghị quyết số 1680/NQ-UBTVQH15 (Nghị quyết của Ủy ban Thường vụ Quốc hội về việc sắp xếp các đơn vị hành chính cấp huyện, cấp xã của tỉnh Quảng Trị).
*   **receivedAt**: 2026-07-13
*   **verificationStatus**: `verified-by-project-owner`

---

## 2. Administrative Hierarchy
The administrative model has been simplified to remove any intermediate "district" (huyện) level in the runtime database.

```text
Tỉnh Quảng Trị (Quang Tri Province)
└── Xã Lao Bảo (Lao Bao Commune)
    └── 12 Thôn (12 Villages)
```

---

## 3. Key Demographic & Geographic Stats
The following figures represent the canonical stats for Lao Bao Commune and must be consistently used across all dashboard KPIs, reports, and calculations:

*   **Total Natural Area**: **8,303 hectares (ha)**
*   **Total Population**: **23,135 people**
*   **Total Households**: **5,445 households**

---

## 4. Canonical List of 12 Villages
This is the master list of villages in Lao Bao Commune. All UI dropdowns, map features, and filters must use this exact list:

1.  **Triệu Phước** (Trieu Phuoc)
2.  **Tân Kim** (Tan Kim)
3.  **Tân Phước** (Tan Phước)
4.  **Ka Tăng** (Ka Tang)
5.  **Tân Thành** (Tan Thanh)
6.  **Triệu Thành** (Trieu Thanh)
7.  **Tân Long** (Tan Long)
8.  **Triệu Long** (Trieu Long)
9.  **Làng Vây** (Lang Vay)
10. **Vĩnh Đông** (Vinh Dong)
11. **Trung Chín** (Trung Chin)
12. **Tây Chín** (Tay Chin)

---

## 5. Important Context Note
> [!IMPORTANT]
> The list of 12 villages is administrative context provided directly by the project owner in alignment with the administrative boundary reorganizations under **Nghị quyết số 1680/NQ-UBTVQH15**.
> This list is **NOT** extracted from the two main DOCX requirements files (`lao-bao-digital-plan-2026.docx` or `lao-bao-system-requirements_v1.docx`).
> Under no circumstances should these village names be altered, and they must serve as the single source of truth for administrative scopes.
> 
> *Chú ý*: Đây là canonical project input hiện tại, chờ đối chiếu nếu sau này có danh mục hành chính máy đọc được chính thức.

