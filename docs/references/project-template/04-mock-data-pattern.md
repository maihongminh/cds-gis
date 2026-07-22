# 04 — Mock Data Pattern (Cách tổ chức dữ liệu giả)

## Nguyên tắc chung

1. **Mock data trước, API sau**: Giai đoạn đầu dùng dữ liệu giả import trực tiếp. Khi có backend, thay bằng hooks gọi API.
2. **Type trước, data sau**: Luôn định nghĩa TypeScript type trước khi tạo mock data.
3. **Dữ liệu ổn định**: Dùng seeded random (số ngẫu nhiên có seed cố định) để data không đổi mỗi lần reload.
4. **Không hard-code trong component**: Component import data từ `src/data/`, không viết data inline.

---

## Vị trí file

| Loại file | Vị trí | Ví dụ |
|---|---|---|
| Mock data | `src/data/mock-[entity].ts` | `mock-records.ts`, `mock-dashboard.ts` |
| TypeScript type | `src/types/[entity].ts` | `[entity].ts`, `dashboard.ts` |

---

## Cách đặt ID ổn định

### Pattern: `[entity-prefix]-[scope-prefix]-[number]`

```typescript
// Ví dụ ID cho thực thể chính (ví dụ: hồ sơ bệnh nhân, nhân viên)
const recordId = `patient-hn-001`;  // patient = entity, hn = branch prefix, 001 = sequential
const recordCode = `BN-10-HN-0001`; // BN = Bệnh nhân, 10 = region, HN = branch, 0001 = sequential

// Ví dụ ID cho thực thể phụ liên kết
const appointmentId = `appt_hn_1_1`;  // appt = entity, hn = scope, 1 = patient index, 1 = appointment index

// Ví dụ ID cho thực thể liên quan khác
const relativeId = `rel_hn_1_1`;
```

**Lợi ích:**
- ID ổn định, không thay đổi khi reload.
- Dễ debug, dễ trace.
- Có thể link giữa các entity qua prefix.

### Generic pattern cho project mới

```typescript
const id = `[entity]-[scope]-[index]`;
// Ví dụ: product-hn-001, customer-sg-042, order-hcm-123
```

---

## Cách tạo mock data lớn (Seeded PRNG)

Khi cần tạo nhiều bản ghi (hàng trăm/ngàn), dùng **seeded pseudo-random number generator** (bộ sinh số giả ngẫu nhiên có hạt giống cố định):

```typescript
// src/data/mock-records.ts
function createSeededRandom(seedValue: number) {
  let s = seedValue;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const random = createSeededRandom(42);  // Seed cố định = 42

// Sử dụng:
const isMale = random() > 0.4;
const surname = SURNAMES[Math.floor(random() * SURNAMES.length)];
```

**Kết quả**: Mỗi lần chạy, data luôn giống nhau — không bị hydration mismatch (lỗi không khớp giữa server và client rendering).

---

## Cấu trúc Type cho entity chính

```typescript
// src/types/[main-entity].ts

// 1. Status types (dùng union literal)
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived';
export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

// 2. Sub-entity interfaces
export interface Address {
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  streetAddress: string;
  displayAddress: string;
}

// 3. Main entity interface
export interface MainEntity {
  id: string;              // Unique ID ổn định
  code: string;            // Mã hiển thị (human-readable)
  name: string;            // Tên

  // Business fields
  typeCode: string;
  typeName: string;
  status: EntityStatus;
  approvalStatus: ApprovalStatus;

  // Relations
  address: Address;
  relatedItems: RelatedItem[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

---

## Cách tạo dữ liệu Dashboard

```typescript
// src/types/dashboard.ts
export interface DashboardSummary {
  totalRecords: number;
  activeCount: number;
  pendingApprovals: number;
  // ... other KPI metrics
  byCategory: CategoryCount[];    // Cho pie/bar chart
  byRegion: RegionCount[];        // Cho table xếp hạng
  monthlyChanges: MonthlyChange[];// Cho line/bar chart
  alerts: AlertItem[];            // Cho alert list
}

// src/data/mock-dashboard.ts
export const getDashboardSummary = (scopeFilter: string | null): DashboardSummary => {
  // Compute từ mock-records dựa trên filter
  if (scopeFilter) {
    // Lọc theo scope
    const filtered = mockRecords.filter(r => r.address.wardCode === scopeFilter);
    return computeSummary(filtered);
  }
  // Tổng toàn bộ
  return computeSummary(mockRecords);
};
```

**Pattern quan trọng**: Dashboard data nên được **compute từ entity data**, không tạo riêng. Điều này đảm bảo số liệu luôn nhất quán.

---

## Cách tạo dữ liệu Table

```typescript
// Dùng array of objects, mỗi object có `id` field
export const mockRecords: MainEntity[] = [
  {
    id: 'rec-001',
    code: 'HS-0001',
    name: 'Nguyễn Văn A',
    // ... other fields matching MainEntity interface
  },
  // ... more records
];
```

**Quy tắc:**
- Mỗi item **phải có `id`** (DataTableShell yêu cầu `T extends { id: string | number }`).
- Dùng data thực tế (tên Việt Nam, địa chỉ Việt Nam) cho demo chuyên nghiệp.
- Tạo đủ nhiều bản ghi để test pagination (>20 items).

---

## Cách tạo dữ liệu Chart

```typescript
// Dữ liệu cho biểu đồ cột/line (monthly changes)
export interface MonthlyChange {
  month: string;    // 'T01', 'T02', ...
  added: number;
  removed: number;
  changed: number;
}

// Dữ liệu cho biểu đồ tròn (distribution)
export interface CategoryCount {
  typeCode: string;
  typeName: string;
  count: number;
  color: string;   // Hex color cho chart
}
```

**Cách tạo color palette cho chart:**

```typescript
const CHART_COLORS = [
  '#e5484d', // Red
  '#0068d6', // Blue
  '#30a46c', // Green
  '#8e4ec6', // Purple
  '#f76b15', // Orange
  '#00a2c7', // Cyan
  '#687076', // Gray
];
```

---

## Cách tạo dữ liệu Map (nếu có)

```typescript
// Mỗi record cần có trường geo
export interface GeoPoint {
  lat: number;
  lng: number;
  source: 'manual' | 'geocoding' | 'imported';
  accuracy?: 'high' | 'medium' | 'low';
}

// Trong mock data, tạo lat/lng gần center point của region
const lat = ward.centerLat + (random() - 0.5) * 0.025;
const lng = ward.centerLng + (random() - 0.5) * 0.025;
```

---

## Cách tạo Default Selected / Tenant

```typescript
// src/data/mock-administrative-units.ts
export const mockAdministrativeUnits: AdministrativeUnit[] = [
  // Cấp tỉnh
  { id: 'province-a', code: '48', name: 'Tỉnh/Thành phố A', type: 'province', centerLat: 16.0544, centerLng: 108.2022 },
  // Cấp phường/xã
  { id: 'ward-a', code: 'ward-a', name: 'Phường/Xã A', type: 'ward', parentCode: '48', ... },
  // ...
];

// Trong TenantContext, set default:
const [selectedProvinceCode, setSelectedProvinceCode] = useState('48');  // Default province
const [selectedWardCode, setSelectedWardCode] = useState('ward-a'); // Default ward
```

**Cho project mới:** Thay `province/ward` bằng phân cấp phù hợp:
- `company / branch` (công ty / chi nhánh).
- `region / store` (khu vực / cửa hàng).
- `hospital / department` (bệnh viện / khoa).

---

## Cách tránh hard-code data trong component

### ❌ Sai

```tsx
export default function DashboardPage() {
  const kpis = [
    { title: 'Tổng hồ sơ', value: 12480 },
    { title: 'Đang hoạt động', value: 11200 },
  ];
  // Data hard-code trong component
}
```

### ✅ Đúng

```tsx
// 1. Type trong src/types/
export interface DashboardSummary { totalRecords: number; activeCount: number; }

// 2. Data trong src/data/
export const getDashboardSummary = (): DashboardSummary => ({ ... });

// 3. Component chỉ import và render
import { getDashboardSummary } from '@/data/mock-dashboard';

export default function DashboardPage() {
  const summary = getDashboardSummary(wardCode);
  return <DashboardKpiGrid summary={summary} />;
}
```

---

## Cách liên kết dữ liệu giữa các module

Dùng **ID reference** (tham chiếu qua ID):

```typescript
// Thực thể chính có relatedGroupId → liên kết tới nhóm liên quan
export interface MainEntity {
  id: string;
  relatedGroupId?: string;  // FK tới RelatedGroup
}

// Nhóm liên quan có danh sách memberIds
export interface RelatedGroup {
  id: string;
  memberIds: string[];  // FK tới MainEntity
}

// Dashboard compute từ danh sách entity chính
export const getDashboardSummary = () => {
  const total = mockRecords.length;
  const active = mockRecords.filter(r => r.status === 'active').length;
  return { totalRecords: total, activeCount: active };
};
```

**Quy tắc:**
- Mock data module A có thể import mock data module B.
- Tránh circular import (import vòng tròn) — A imports B, B imports A.
- Dashboard data nên import từ entity data chính, compute on-the-fly (tính toán tại chỗ).

---

## Checklist khi tạo mock data cho project mới

- [ ] Định nghĩa type cho entity chính trong `src/types/`.
- [ ] Tạo mock data file `src/data/mock-[entity].ts`.
- [ ] Dùng seeded random nếu cần tạo nhiều bản ghi.
- [ ] Đảm bảo mỗi item có `id` field (string hoặc number).
- [ ] Tạo dữ liệu đủ nhiều để test pagination (>20).
- [ ] Tạo dashboard summary compute từ entity data.
- [ ] Tạo administrative units / tenant data nếu có phân cấp.
- [ ] Tạo mock users cho demo role selection.
- [ ] Không hard-code data trong component.
