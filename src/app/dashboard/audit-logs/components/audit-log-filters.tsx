'use client';

import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { FilterShell } from '@/components/common';
import { AuditLogModule } from '@/types/audit-log';

const MODULES: { value: AuditLogModule | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả phân hệ' },
  { value: 'auth', label: 'Đăng nhập / Bảo mật' },
  { value: 'household', label: 'Quản lý Hộ dân' },
  { value: 'crop', label: 'Trồng trọt' },
  { value: 'livestock', label: 'Chăn nuôi' },
  { value: 'land', label: 'Đất đai' },
  { value: 'economy', label: 'Kinh tế hộ' },
  { value: 'forest', label: 'Rừng & DVMTR' },
  { value: 'settings', label: 'Cấu hình hệ thống' },
];

const ACTIONS = [
  { value: 'all', label: 'Tất cả hành động' },
  { value: 'Đăng nhập', label: 'Đăng nhập' },
  { value: 'Thêm mới', label: 'Thêm mới' },
  { value: 'Cập nhật', label: 'Cập nhật' },
  { value: 'Xóa', label: 'Xóa' },
  { value: 'Chi trả', label: 'Chi trả / Thanh toán' },
  { value: 'Tải xuống', label: 'Tải xuống / Xuất báo cáo' },
];

const PERIODS = [
  { value: 'all', label: 'Tất cả thời gian' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'last_7_days', label: '7 ngày qua' },
  { value: 'last_30_days', label: '30 ngày qua' },
];

interface AuditLogFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  moduleFilter: string;
  onModuleFilterChange: (value: string) => void;
  actionFilter: string;
  onActionFilterChange: (value: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (value: string) => void;
  onReset: () => void;
}

export function AuditLogFilters({
  search,
  onSearchChange,
  moduleFilter,
  onModuleFilterChange,
  actionFilter,
  onActionFilterChange,
  periodFilter,
  onPeriodFilterChange,
  onReset,
}: AuditLogFiltersProps) {
  return (
    <FilterShell onReset={onReset} collapsible={false}>
      <div className="grid gap-1.5">
        <Label htmlFor="audit-log-search" className="text-xs font-semibold">Tìm kiếm</Label>
        <Input
          id="audit-log-search"
          placeholder="Tìm theo người dùng, mô tả..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 text-xs"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="audit-log-module-filter" className="text-xs font-semibold">Phân hệ</Label>
        <Select value={moduleFilter} onValueChange={onModuleFilterChange}>
          <SelectTrigger id="audit-log-module-filter" className="h-9 text-xs">
            <SelectValue placeholder="Chọn phân hệ" />
          </SelectTrigger>
          <SelectContent>
            {MODULES.map((m) => (
              <SelectItem key={m.value} value={m.value} className="text-xs cursor-pointer">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="audit-log-action-filter" className="text-xs font-semibold">Hành động</Label>
        <Select value={actionFilter} onValueChange={onActionFilterChange}>
          <SelectTrigger id="audit-log-action-filter" className="h-9 text-xs">
            <SelectValue placeholder="Chọn hành động" />
          </SelectTrigger>
          <SelectContent>
            {ACTIONS.map((a) => (
              <SelectItem key={a.value} value={a.value} className="text-xs cursor-pointer">
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="audit-log-period-filter" className="text-xs font-semibold">Khoảng thời gian</Label>
        <Select value={periodFilter} onValueChange={onPeriodFilterChange}>
          <SelectTrigger id="audit-log-period-filter" className="h-9 text-xs">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((p) => (
              <SelectItem key={p.value} value={p.value} className="text-xs cursor-pointer">
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FilterShell>
  );
}
