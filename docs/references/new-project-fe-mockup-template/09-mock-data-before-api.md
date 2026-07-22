# 09 — Mock Data Before API (Chiến lược Mock Data trước)

## Nguyên tắc

1. **Type trước, data sau** — luôn define TypeScript type trước khi tạo mock data.
2. **Mock data trước, API sau** — giai đoạn FE dùng data giả, khi có backend thay bằng hooks.
3. **Component không hard-code data** — import từ `src/data/`, không viết inline.
4. **Dashboard compute từ entity data** — KPI nhất quán với list page.
5. **Data realistic theo chủ đề mới** — không copy data cũ.
6. **Mock data map sang Frappe DocType** — thiết kế để chuyển đổi dễ dàng.

---

## Pattern file

| Loại | Vị trí | Ví dụ |
|---|---|---|
| TypeScript type | `src/types/[entity].ts` | `patient.ts`, `product.ts` |
| Mock data | `src/data/mock-[entity].ts` | `mock-patients.ts`, `mock-products.ts` |
| Dashboard data | `src/data/mock-dashboard.ts` | Compute từ entity data |
| Users data | `src/data/mock-users.ts` | Demo users cho login |
| Settings data | `src/data/mock-settings.ts` | Cấu hình hệ thống |
| Admin units | `src/data/mock-administrative-units.ts` | Tenant hierarchy |
| Seeded PRNG | `src/data/seeded-random.ts` | Random ổn định |

---

## Bước 1: Define Type

```typescript
// src/types/[MAIN_ENTITY].ts

// 1. Status types (union literal)
export type [Entity]Status = '[STATUS_1]' | '[STATUS_2]' | '[STATUS_3]' | '[STATUS_4]';

// 2. Sub-entity interfaces
export interface Address {
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  districtName: string;
  streetAddress: string;
  displayAddress: string;
}

// 3. Main entity interface
export interface [MainEntity] {
  id: string;              // Unique ID ổn định
  code: string;            // Mã hiển thị (human-readable)
  name: string;            // Tên

  // Business fields
  typeCode: string;
  typeName: string;
  status: [Entity]Status;

  // Relations
  [TENANT_FIELD]: string;  // FK tới đơn vị quản lý

  // Metadata
  createdAt: string;       // DD/MM/YYYY
  updatedAt: string;
  createdBy: string;
}
```

---

## Bước 2: Tạo Seeded Random

```typescript
// src/data/seeded-random.ts
export function createSeededRandom(seedValue: number) {
  let s = seedValue;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function pickRandom<T>(random: () => number, arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

export function randomInt(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}
```

**Lợi ích**: Mỗi lần chạy data luôn giống nhau — không hydration mismatch.

---

## Bước 3: Tạo Mock Data

```typescript
// src/data/mock-[MAIN_ENTITY].ts
import { createSeededRandom, pickRandom } from './seeded-random';
import type { [MainEntity] } from '@/types/[main-entity]';

const random = createSeededRandom(42);

// Lookup tables
const NAMES = ['Nguyễn Văn A', 'Trần Thị B', ...];
const TYPES = [
  { code: 'type-01', name: 'Loại 1' },
  { code: 'type-02', name: 'Loại 2' },
];
const STATUSES: [Entity]Status[] = ['active', 'inactive', 'pending', 'archived'];

// Generate records
function generateRecords(count: number): [MainEntity][] {
  return Array.from({ length: count }, (_, i) => {
    const type = pickRandom(random, TYPES);
    return {
      id: `[entity]-[scope]-${String(i + 1).padStart(3, '0')}`,
      code: `[PREFIX]-${String(i + 1).padStart(4, '0')}`,
      name: pickRandom(random, NAMES),
      typeCode: type.code,
      typeName: type.name,
      status: pickRandom(random, STATUSES),
      // ... other fields
      createdAt: '01/01/2024',
      updatedAt: '15/06/2024',
      createdBy: 'admin',
    };
  });
}

export const mock[MainEntity]s: [MainEntity][] = generateRecords(200);
```

---

## Bước 4: Dashboard Data (Compute)

```typescript
// src/data/mock-dashboard.ts
import { mock[MainEntity]s } from './mock-[main-entity]';
import type { DashboardSummary } from '@/types/dashboard';

function computeSummary(records: [MainEntity][], scopeFilter?: string): DashboardSummary {
  const filtered = scopeFilter
    ? records.filter(r => r.[TENANT_FIELD] === scopeFilter)
    : records;

  return {
    total: filtered.length,
    activeCount: filtered.filter(r => r.status === 'active').length,
    pendingCount: filtered.filter(r => r.status === 'pending').length,
    // ... other KPIs

    byCategory: computeByCategory(filtered),
    monthlyChanges: computeMonthly(filtered),
    // ... other charts
  };
}

export function getDashboardSummary(scopeFilter?: string | null): DashboardSummary {
  return computeSummary(mock[MainEntity]s, scopeFilter || undefined);
}
```

> **Pattern quan trọng**: Dashboard data PHẢI compute từ entity data, không tạo riêng. Điều này đảm bảo số liệu luôn nhất quán giữa dashboard KPI và list page.

---

## Bước 5: Cách dùng trong Component

### ❌ Sai — Hard-code data

```tsx
export default function DashboardPage() {
  const kpis = [
    { title: 'Tổng', value: 12480 },  // ❌ Hard-code
  ];
}
```

### ✅ Đúng — Import từ data

```tsx
import { getDashboardSummary } from '@/data/mock-dashboard';

export default function DashboardPage() {
  const { selectedScope } = useTenant();
  const summary = getDashboardSummary(selectedScope);

  return <KpiGrid summary={summary} />;
}
```

---

## ID Pattern

```
[entity]-[scope]-[index]
```

Ví dụ:
- `patient-hn-001` — bệnh nhân, chi nhánh HN, số 001.
- `product-sg-042` — sản phẩm, chi nhánh SG, số 042.
- `order-hcm-123` — đơn hàng, chi nhánh HCM, số 123.

---

## Checklist khi tạo mock data cho dự án mới

- [ ] Define type cho entity chính trong `src/types/`.
- [ ] Tạo mock data file `src/data/mock-[entity].ts`.
- [ ] Dùng seeded random cho data ổn định.
- [ ] Mỗi item có `id` field (string).
- [ ] Tạo đủ nhiều bản ghi để test pagination (>20).
- [ ] Dashboard summary compute từ entity data.
- [ ] Tạo tenant/administrative units data.
- [ ] Tạo mock users cho demo role.
- [ ] Không hard-code data trong component.
- [ ] Data realistic theo chủ đề mới (tên Việt Nam, địa chỉ thực).
- [ ] Phân bổ status hợp lý (70% active, 15% pending...).
