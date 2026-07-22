# 05 — Role-Based Access Control (RBAC) Matrix

*   **Status**: Implemented (TASK 05)
*   **Last Updated**: 2026-07-14

---

## 1. Five Core Roles
All system users must be assigned exactly one of the following five roles:

1.  `admin`: **System Administrator**
    *   Full rights over system configurations, backups, roles, user accounts, and audit streams.
    *   No direct data entry tasks by default, but controls database integrations.
2.  `data_officer`: **Data Entry Officer**
    *   Responsible for drafting, editing, importing, and submitting data within their designated unit/village scope.
    *   Cannot approve or publish records.
3.  `unit_leader`: **Department/Unit Leader**
    *   Responsible for reviewing, approving, or returning submitted records within their unit.
    *   Cannot directly publish into the communal repository.
4.  `data_governance`: **HĐND and UBND Office Governance Team**
    *   Communal repository administrators.
    *   Responsible for reviewing unit-approved records, publishing them to the commune database, and managing overall data quality.
5.  `commune_leader`: **Commune President / Vice President**
    *   ReadOnly access to dashboards, reports, and published data across all divisions.
    *   Ability to generate and export analytical summaries.

---

## 2. Action Permissions
Actions are defined as fine-grained controls evaluated at the route and API level:

*   `view`: Read basic record listings and summaries.
*   `create`: Initialize a draft record.
*   `update`: Edit a draft or returned record.
*   `delete`: Soft-delete or archive a record (controlled by role).
*   `import` / `export`: Upload bulk records or download lists.
*   `submit`: Submit draft records for review.
*   `approveUnit`: Approve a submitted record as a department chief.
*   `approveGovernance`: Approve and finalize a record at the commune level.
*   `publish`: Change the workflow status to `published`, making it visible globally.
*   `restoreVersion`: Rollback historical data revisions.
*   `manageLayer`: Edit GIS map layer structures.
*   `viewConfidential`: Read records with `securityLevel = confidential`.

---

## 3. RBAC Matrix Table

| Action | `admin` | `data_officer` | `unit_leader` | `data_governance` | `commune_leader` | Scope / Notes |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `view` | Yes | Yes | Yes | Yes | Yes | Filtered by data scope and security level. |
| `create` / `update` | Yes | Yes | No | Yes | No | Governance can edit for correction. |
| `delete` | Yes | No | No | Yes | No | Soft-delete / Archiving only. |
| `import` | Yes | Yes | No | Yes | No | Excel/CSV validation required. |
| `export` | Yes | Yes | Yes | Yes | Yes | Export logs recorded; confidential check. |
| `submit` | No | Yes | No | No | No | Status changes `draft -> submitted`. |
| `approveUnit` | No | No | Yes | No | No | Status changes `submitted -> unit_approved`. |
| `approveGovernance` | No | No | No | Yes | No | Status changes `unit_approved -> governance_approved`. |
| `publish` | No | No | No | Yes | No | Status changes `governance_approved -> published`. |
| `restoreVersion` | Yes | No | No | Yes | No | Triggers revision audit log. |
| `manageLayer` | Yes | No | No | Yes | No | Map layer management route. |
| `viewConfidential` | Yes | No | No | Yes | Yes | Required to access `DATA-SECDEF` data. |

---

## 4. Security Levels & Data Scopes
Every record has a `securityLevel` metadata tag:

1.  **Public (`public`)**: Visible to all logged-in roles and the public landing page map preview.
2.  **Shared (`shared`)**: Visible to all commune officers, leaders, and units.
3.  **Confidential (`confidential`)**: Restricted to specific organizations (e.g., Police, Military) and designated roles (`admin`, `data_governance`, `commune_leader`).

### Data Scope Constraints
*   **Organization Scope**: Users are bound to a department. A `unit_leader` can only approve records owned by their unit.
*   **Village Scope**: If a user is restricted to certain villages, their listings are filtered.
*   **Security Scope**: In accordance with security practices:
    *   Confidential layers and records must be filtered on the server side prior to rendering or exporting.
    *   CSS-only hiding of confidential data is strictly prohibited.

---

## 5. Special Security Requirements: National Defense & Security (`DATA-SECDEF-07`)
All features and records related to National Defense & Security (`DATA-SECDEF-01` to `DATA-SECDEF-08`) must enforce:

*   **Encryption at Rest**: Mandatory backend database encryption for all defense schemas.
*   **Mandatory Multi-Factor Authentication (2FA)**: Required prior to viewing or exporting any defense data.
*   **Dedicated Audit Stream**: Separate, non-erasable logs tracking who accessed defense data, when, and from what IP address.
*   **Commune Leader Audit Reports**: Monthly automated security summaries provided to the Commune President.
*   *Note*: The current frontend mockup must display appropriate warnings, mock a 2FA prompt before confidential exports, and write dedicated audit logs labeled `qp_an_access` or `qp_an_export`.
