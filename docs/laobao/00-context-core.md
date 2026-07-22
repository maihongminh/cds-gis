# 00 — Context Core: Lao Bao Digital Ecosystem

## 1. System Identity
*   **System Name**: Kho dữ liệu số, Bản đồ số thông minh và Trung tâm điều hành thông minh xã Lao Bảo, tỉnh Quảng Trị (Lao Bao Digital Data, Smart Map, and Intelligent Operations Center).
*   **Location**: Lao Bao Commune, Huong Hoa District, Quang Tri Province, Vietnam.
*   **Target Users**: Commune leaders, data officers, unit leaders, data governance team, and the general public (for public sections).

---

## 2. Three Main Pillars
The Lao Bao Digital Ecosystem is structured around three core pillars:
1.  **Digital Data Repository (Kho dữ liệu số)**:
    *   Unified data collection, normalization, approval, publication, and consumption for 9 major socio-economic data groups.
    *   Version history, change tracking, and secure import/export.
2.  **Smart Map (Bản đồ số thông minh)**:
    *   Interactive spatial representation using Leaflet/React Leaflet.
    *   Multi-layered mapping linked directly to business data.
    *   Strict security filtering for confidential geographic layers.
3.  **Leadership Operations Dashboard (Trung tâm điều hành thông minh)**:
    *   Daily/weekly/monthly operations monitoring.
    *   Socio-economic plan tracking based on 62 key indicators.
    *   Emergency alerts and task monitoring.

---

## 3. Scope of Current Phase
*   **Frontend Mockup**: Complete client-side interface built with Next.js App Router, React 19, TypeScript (Strict), Tailwind CSS v4, and shadcn/ui.
*   **Mock Data**: Seeded random data with realistic relationships. No actual backend databases or external production APIs are implemented yet.
*   **Leaflet Maps**: Client-side interactive mapping with GeoJSON boundary simulation and coordinate visualization.
*   **Security & RBAC**: Fully simulated runtime role-based access control and confidentiality logic.

---

## 4. Input Source Priority
Antigravity must adhere to the following sequence of information priority:
1.  **Commune People's Committee Plan (`docs/requirements/lao-bao-digital-plan-2026.docx`)**:
    *   Primary source for organizational units, update frequencies, roadmap phases, and general management rules.
2.  **BA System Requirements (`docs/requirements/lao-bao-system-requirements_v1.docx`)**:
    *   Primary source for detailed features, data schemas, specific forms, reports, and step-by-step user workflows.
3.  **Legacy Reference Context (`docs/references/system_context_laobao.md`)**:
    *   Used only to understand the existing codebase technical conventions.
    *   All names, geographic details, and specific business features from Tra Tap in this file are legacy and must be eliminated.
4.  **Template Markdown Files**:
    *   Used to preserve layout consistency, component governance, theme design, and quality standards.

---

## 5. Absolute Rule: No Tra Tap Contamination
*   **Tra Tap is Legacy**: Tra Tap commune (Nam Tra My district, Quang Nam province) details are forbidden in the target Lao Bao codebase.
*   **No Mixed Data**: Do not include any Tra Tap names, hamlets, specific crops, or regional identifiers on the UI or in mock datasets.
*   **Clean Separation**: Maintain the separation between legacy reference documentation (archived for context) and the active Lao Bao source code.
