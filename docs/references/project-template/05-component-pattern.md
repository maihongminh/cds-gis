# 05 — Component Pattern (Mẫu tổ chức Component)

## Nguyên tắc tổng quan

1. **`page.tsx` chỉ compose layout** — không chứa logic phức tạp, chỉ import và sắp xếp component.
2. **Logic tách ra component hoặc helper** — filter logic, sort logic, data transformation đặt trong component riêng.
3. **Type import từ `src/types/`** — không định nghĩa type inline trong component.
4. **Data import từ `src/data/`** — không hard-code data trong component.
5. **Component dùng chung → `src/components/common/`**.
6. **Component layout → `src/components/layout/`**.
7. **Component riêng module → đặt gần route** (trong folder `components/` cùng cấp).

---

## Layout Components (`src/components/layout/`)

### AppSidebar — Sidebar navigation

```tsx
// Pattern: Data-driven sidebar menu
const sidebarItems = [
  { title: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Hồ sơ', href: '/dashboard/records', icon: FileText },
  // ... thêm menu items
];

export function AppSidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen } = useSidebar();

  return (
    <aside className={`... ${collapsed ? 'w-16' : 'w-70'}`}>
      <nav>
        {sidebarItems.map(item => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}
              className={`... ${isActive ? 'bg-accent text-accent-foreground' : ''}`}>
              <Icon /> {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

**Tùy chỉnh**: Thêm/bớt `sidebarItems`, đổi icon, đổi text. Logic active route giữ nguyên.

### DashboardHeader — Top header bar

```tsx
export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/85 backdrop-blur">
      <SidebarToggle />     {/* Desktop */}
      <MobileLogo />        {/* Mobile only */}
      <TenantSwitcher />    {/* Scope selector */}
      <SearchBar />         {/* Global search */}
      <NotificationsMenu /> {/* Notifications */}
      <ThemeToggle />       {/* Dark mode */}
      <UserMenu />          {/* User dropdown */}
      <MobileMenuToggle />  {/* Mobile only */}
    </header>
  );
}
```

### SidebarContext — State management cho sidebar

```tsx
// Pattern: React Context cho UI state
interface SidebarContextType {
  collapsed: boolean;        // Desktop: sidebar thu nhỏ/mở rộng
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;       // Mobile: sidebar mở/đóng
  setMobileOpen: (v: boolean) => void;
}
```

### TenantContext — Scope/Tenant management

```tsx
// Pattern: Context quản lý phạm vi dữ liệu
interface TenantContextType {
  selectedProvince: Unit | null;   // Đơn vị cấp trên
  selectedWard: Unit | null;       // Đơn vị cấp dưới
  provinces: Unit[];               // Danh sách cấp trên
  wards: Unit[];                   // Danh sách cấp dưới (lọc theo cấp trên)
  setProvince: (code: string) => void;
  setWard: (code: string | null) => void;
  userScopeLevel: 'province' | 'ward';  // Phân quyền scope
  role: string;                    // User role
}
```

**Cho project mới**: Đổi `province/ward` thành phân cấp phù hợp (`company/branch`, `region/store`...).

---

## Common Components (`src/components/common/`)

### PageHeader — Header trang có breadcrumb

```tsx
// Pattern sử dụng:
<PageHeader
  title="Tên trang"
  description="Mô tả trang (optional)"
  actions={
    <Button>
      <Plus /> Thêm mới
    </Button>
  }
  breadcrumbs={<Breadcrumbs items={customItems} />}  // Optional custom breadcrumbs
/>
```

**Cấu trúc:**
- Breadcrumbs phía trên bên phải.
- Title (H1) + Description bên trái.
- Action buttons bên phải.
- Border bottom + margin bottom.

### Breadcrumbs — Auto-generated breadcrumb

```tsx
// Pattern 1: Auto-generate từ URL
<Breadcrumbs />
// pathname '/dashboard/records/rec-001' → Hệ thống > Danh sách hồ sơ > Chi tiết #rec-001

// Pattern 2: Custom items
<Breadcrumbs items={[
  { label: 'Danh sách hồ sơ', href: '/dashboard/records' },
  { label: 'Nguyễn Văn A' },  // Last item = no href
]} />
```

**Cách auto-generate hoạt động:**
1. Split pathname by `/`.
2. Map mỗi segment qua `routeMap` dictionary.
3. Dynamic segment (UUID/number) → hiển thị `Chi tiết #[id]`.

### DataTableShell — Bảng dữ liệu generic

```tsx
// Pattern sử dụng:
const columns: Column<RecordType>[] = [
  { header: 'Mã', accessor: 'code', sortable: true },
  { header: 'Tên', accessor: 'name', sortable: true },
  { header: 'Trạng thái', accessor: (row) => <StatusBadge status={row.status} /> },
  { header: 'Thao tác', accessor: (row) => <ActionMenu id={row.id} />, className: 'text-right' },
];

<DataTableShell
  data={filteredRecords}
  columns={columns}
  onRowClick={(row) => router.push(`/dashboard/records/${row.id}`)}
  isLoading={isLoading}
  emptyMessage="Không tìm thấy dữ liệu."
  toolbar={<RecordsFilters filters={filters} onChange={setFilters} />}
/>
```

**Tính năng tích hợp:**
- Sort (3 trạng thái: none → asc → desc).
- Pagination (tự động hoặc external control).
- Loading skeleton.
- Empty state.
- Toolbar slot cho filter.
- Row click handler.
- Date sorting (DD/MM/YYYY format).

### MetricCard — Thẻ KPI

```tsx
<MetricCard
  title="Tổng số hồ sơ"
  value={summary.totalRecords.toLocaleString('vi-VN')}
  icon={<FileText className="w-4.5 h-4.5 text-blue-600" />}
  trend={{ value: 4.2, direction: 'up', label: 'so với tháng trước' }}
/>
```

**Hoặc không có trend:**

```tsx
<MetricCard
  title="Đang hoạt động"
  value="11,200"
  icon={<Activity className="w-4.5 h-4.5 text-emerald-600" />}
  description="Mô tả ngắn"
/>
```

---

## Module Components (đặt gần route)

> **Lưu ý**: Các ví dụ dưới đây dùng `records` như một main entity mẫu. Khi áp dụng cho project mới, hãy thay `records` bằng entity chính như `patients`, `students`, `assets`, `customers`...

### Pattern: Records List Page

```
src/app/dashboard/records/
├── page.tsx                     ← Page compose
├── components/
│   ├── records-header.tsx       ← Module header (title, buttons)
│   ├── records-filters.tsx      ← Filter panel
│   ├── records-table.tsx        ← Table wrapper (define columns, pass to DataTableShell)
│   ├── record-status-badge.tsx  ← Status badge component
│   └── record-action-menu.tsx   ← Row action dropdown
└── [id]/
    └── page.tsx                 ← Detail page
```

### Filter Pattern

```tsx
// 1. Define filter state interface
export interface FilterState {
  searchQuery: string;
  typeCode: string;
  status: string;
  wardCode: string;
}

// 2. Filter component
export function ModuleFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4" />
        <input
          value={filters.searchQuery}
          onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          placeholder="Tìm kiếm..."
          className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg ..."
        />
      </div>

      {/* Select filters */}
      <select
        value={filters.typeCode}
        onChange={(e) => onChange({ ...filters, typeCode: e.target.value })}
        className="px-3 py-2 text-xs border rounded-lg ..."
      >
        <option value="">Tất cả loại</option>
        {types.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
      </select>
    </div>
  );
}

// 3. Page compose
export default function ModulePage() {
  const [filters, setFilters] = useState<FilterState>({ ... });

  const filteredData = mockData.filter(item => {
    if (filters.searchQuery && !item.name.includes(filters.searchQuery)) return false;
    if (filters.typeCode && item.typeCode !== filters.typeCode) return false;
    return true;
  });

  return (
    <>
      <ModuleFilters filters={filters} onChange={setFilters} />
      <ModuleTable data={filteredData} />
    </>
  );
}
```

### Detail Page Pattern

```tsx
// src/app/dashboard/records/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { mockRecords } from '@/data/mock-records';

export default function RecordDetailPage() {
  const { id } = useParams();
  const record = mockRecords.find(r => r.id === id);

  if (!record) {
    return <div>Không tìm thấy hồ sơ</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={record.fullName}
        description={`Mã hồ sơ: ${record.code}`}
        breadcrumbs={
          <Breadcrumbs items={[
            { label: 'Hồ sơ', href: '/dashboard/records' },
            { label: record.fullName },
          ]} />
        }
      />

      {/* Tab sections */}
      <Tabs defaultValue="info" items={[
        { value: 'info', label: 'Thông tin', content: <InfoSection /> },
        { value: 'policy', label: 'Chế độ', content: <PolicySection /> },
        { value: 'history', label: 'Lịch sử', content: <HistorySection /> },
      ]} />
    </div>
  );
}
```

### Chart Card Pattern

```tsx
// SVG chart tự vẽ (không dependency ngoài)
<div className="bg-card border border-border rounded-xl p-6 shadow-xs">
  <div className="mb-4 border-b border-border pb-3">
    <h3 className="text-base font-bold">Tiêu đề biểu đồ</h3>
    <p className="text-xs text-muted-foreground mt-0.5">Mô tả phụ</p>
  </div>

  <svg viewBox="0 0 500 220" className="w-full h-auto">
    {/* Chart content */}
  </svg>

  {/* Legend */}
  <div className="flex items-center gap-3 text-xs justify-center mt-2">
    <span className="w-2.5 h-1.5 rounded-xs bg-emerald-500" /> Label 1
    <span className="w-2.5 h-1.5 rounded-xs bg-blue-500" /> Label 2
  </div>
</div>
```

> **Ghi chú**: Project gốc dùng SVG chart tự vẽ thay vì Recharts. Nếu project mới cần chart phức tạp hơn, có thể dùng Recharts.

### Map Page Pattern (Leaflet)

```tsx
// src/app/dashboard/map/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamic import để tránh SSR error (Leaflet cần window object)
const MapCanvas = dynamic(() => import('./components/map-canvas'), { ssr: false });

export default function MapPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bản đồ GIS" />
      <MapCanvas records={filteredRecords} />
    </div>
  );
}
```

### Theme Toggle Pattern

```tsx
// 2 variants: 'icon' (dropdown) và 'full' (segmented control)

// Header: compact icon button + dropdown
<ThemeToggle variant="icon" />

// Settings/Sidebar: inline segmented control
<ThemeToggle variant="full" />
```

---

## Quy tắc component

| Quy tắc | Giải thích |
|---|---|
| `page.tsx` chỉ compose | Import components, pass data, sắp xếp layout |
| Mỗi component 1 trách nhiệm | Filter = filter, Table = table, Header = header |
| Component < 300 dòng | Nếu dài hơn → tách |
| Props rõ ràng | Dùng interface, export interface nếu cần |
| `'use client'` khi cần | State, hooks, event handlers → cần `'use client'` |
| Import gọn gàng | Type từ `@/types/`, data từ `@/data/`, component từ `@/components/` |

---

## Cách tạo component mới

### Bước 1: Xác định vị trí

- Dùng bởi nhiều module? → `src/components/common/`
- Chỉ dùng trong 1 module? → `src/app/dashboard/[module]/components/`

### Bước 2: Định nghĩa Props interface

```tsx
interface MyComponentProps {
  data: SomeType[];
  isLoading?: boolean;
  onAction?: (id: string) => void;
  className?: string;
}
```

### Bước 3: Export named function

```tsx
export function MyComponent({ data, isLoading = false, onAction, className = '' }: MyComponentProps) {
  return (
    <div className={`bg-card border border-border rounded-xl ${className}`}>
      {/* Content */}
    </div>
  );
}
```

### Bước 4: Sử dụng trong page

```tsx
import { MyComponent } from './components/my-component';

export default function SomePage() {
  return <MyComponent data={mockData} onAction={handleAction} />;
}
```
