# 07 — Common Components Pattern (Mẫu Component dùng chung)

## Tổng quan

Các common components dưới đây nên được **tái sử dụng** cho dự án mới. Không tạo bảng mới nếu đã có `DataTableShell`, không tạo KPI card mới nếu đã có `MetricCard`, không tạo page title mới nếu đã có `PageHeader`.

---

## 1. PageHeader

**Mục đích**: Header trang có title, description, action buttons.

**Props pattern**:
```tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}
```

**Khi nào dùng**: Mọi page trong dashboard.

**File nguồn**: `src/components/common/page-header.tsx`

**Cách dùng**:
```tsx
<PageHeader
  title="Tên trang"
  description="Mô tả trang"
  actions={<Button><Plus className="size-4" /> Thêm mới</Button>}
/>
```

**Customize**: Chỉ đổi title/description/actions. Giữ nguyên cấu trúc layout.

---

## 2. Breadcrumbs

**Mục đích**: Auto-generate breadcrumb từ URL path.

**Props pattern**:
```tsx
interface BreadcrumbsProps {
  items?: { label: string; href?: string }[];  // Custom items (optional)
}
```

**Khi nào dùng**: Tích hợp trong PageHeader, hoặc dùng riêng.

**File nguồn**: `src/components/common/breadcrumbs.tsx`

**Cách hoạt động**:
1. Split pathname by `/`.
2. Map segment qua `routeMap` dictionary.
3. Dynamic segment (UUID/number) → hiển thị `Chi tiết #[id]`.

**Customize cho dự án mới**: Thêm entry vào `routeMap`:
```tsx
export const routeMap: Record<string, string> = {
  'dashboard': 'Hệ thống',
  '[MODULE_NAME]': '[MODULE_LABEL]',
  'reports': 'Báo cáo',
  'settings': 'Cấu hình',
  'users': 'Người dùng',
};
```

---

## 3. MetricCard

**Mục đích**: Thẻ KPI hiển thị value + icon + trend.

**Props pattern**:
```tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down'; label: string };
  description?: string;
  className?: string;
}
```

**Khi nào dùng**: Dashboard KPI grid, report summary.

**File nguồn**: `src/components/common/metric-card.tsx`

**Cách dùng**:
```tsx
<MetricCard
  title="Tổng số [MAIN_ENTITY]"
  value={summary.total.toLocaleString('vi-VN')}
  icon={<FileText className="w-4.5 h-4.5 text-blue-600" />}
  trend={{ value: 4.2, direction: 'up', label: 'so với tháng trước' }}
/>
```

**Style**: `bg-card`, `border`, `rounded-xl`, `shadow-xs`, hover `shadow-sm`, icon trong box `bg-muted/40`.

---

## 4. DataTableShell

**Mục đích**: Bảng dữ liệu generic có sort, pagination, loading, empty state.

**Props pattern**:
```tsx
interface DataTableShellProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
  pageSize?: number;
}

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  className?: string;
}
```

**Khi nào dùng**: Mọi list page, mọi bảng dữ liệu.

**File nguồn**: `src/components/common/data-table-shell.tsx`

**Tính năng**:
- Sort 3 trạng thái (none → asc → desc).
- Pagination tự động.
- Loading skeleton.
- Empty state.
- Toolbar slot cho filter.
- Row click handler.
- Date sorting (DD/MM/YYYY).

**Customize**: Chỉ define `columns` mới, không sửa shell.

---

## 5. ActionMenu

**Mục đích**: Dropdown menu cho row actions (Xem, Sửa, Xóa).

**Props pattern**:
```tsx
interface ActionMenuProps {
  items: ActionMenuItem[];
}

interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  separator?: boolean;
}
```

**File nguồn**: `src/components/common/action-menu.tsx`

**Cách dùng**:
```tsx
<ActionMenu items={[
  { label: 'Xem chi tiết', icon: Eye, onClick: () => router.push(`/dashboard/[module]/${id}`) },
  { label: 'Chỉnh sửa', icon: Pencil, onClick: () => toast.info('Chức năng đang phát triển') },
  { label: 'Xóa', icon: Trash2, onClick: handleDelete, variant: 'destructive', separator: true },
]} />
```

---

## 6. FilterShell

**Mục đích**: Container cho filter components với count badge.

**File nguồn**: `src/components/common/filter-shell.tsx`

---

## 7. ConfirmDialog

**Mục đích**: AlertDialog wrapper cho xác nhận hành động nguy hiểm (xóa, vô hiệu hóa).

**File nguồn**: `src/components/common/confirm-dialog.tsx`

---

## 8. FormDialog

**Mục đích**: Dialog wrapper cho form tạo mới / chỉnh sửa.

**File nguồn**: `src/components/common/form-dialog.tsx`

---

## 9. StatusBadge

**Mục đích**: Badge trạng thái có màu sắc tương ứng.

**File nguồn**: `src/components/common/status-badge.tsx`

**Customize cho dự án mới**: Thay status config (key → label + color variant).

---

## 10. EmptyState

**Mục đích**: UI hiển thị khi không có dữ liệu.

**File nguồn**: `src/components/common/empty-state.tsx`

---

## 11. SectionCard

**Mục đích**: Card wrapper cho section trong detail page.

**File nguồn**: `src/components/common/section-card.tsx`

---

## 12. LabelValueGrid

**Mục đích**: Grid hiển thị key-value pairs (thông tin chi tiết).

**File nguồn**: `src/components/common/label-value-grid.tsx`

---

## 13. ThemeToggle

**Mục đích**: Toggle sáng/tối/hệ thống.

**File nguồn**: `src/components/theme/theme-toggle.tsx`

**2 variants**:
- `variant="icon"` — compact button + dropdown (cho header).
- `variant="full"` — segmented control (cho settings/sidebar).

---

## 14. TenantSwitcher (ScopeSwitcher)

**Mục đích**: Dropdown chọn đơn vị/phạm vi dữ liệu.

**File nguồn**: `src/components/layout/tenant-switcher.tsx`

**Customize cho dự án mới**: Thay phân cấp (`Tỉnh > Xã` → `Công ty > Chi nhánh`, `Trường > Khoa`...).

---

## Quy tắc khi tạo component mới

1. **Kiểm tra common components trước** — nếu đã có component tương tự thì dùng lại.
2. **Nếu dùng 2+ module** → đặt trong `src/components/common/`.
3. **Nếu chỉ 1 module** → đặt trong `src/app/dashboard/[module]/components/`.
4. **Compose từ Shadcn primitives** — không tự viết HTML thô.
5. **Component < 300 dòng** — tách nếu dài hơn.
