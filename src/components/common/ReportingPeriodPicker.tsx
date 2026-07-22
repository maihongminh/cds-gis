// src/components/common/ReportingPeriodPicker.tsx

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportingPeriodPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  allowAll?: boolean;
}

const REPORTING_PERIODS = [
  { value: '2026-M07', label: 'Tháng 07/2026' },
  { value: '2026-M06', label: 'Tháng 06/2026' },
  { value: '2026-M05', label: 'Tháng 05/2026' },
  { value: '2026-Q2', label: 'Quý II/2026' },
  { value: '2026-Q1', label: 'Quý I/2026' },
  { value: '2026', label: 'Năm 2026' },
  { value: '2025', label: 'Năm 2025' }
];

export function ReportingPeriodPicker({ value, onValueChange, className, allowAll = false }: ReportingPeriodPickerProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Chọn kỳ báo cáo" />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value="all" className="cursor-pointer text-xs">Tất cả kỳ báo cáo</SelectItem>}
        {REPORTING_PERIODS.map((period) => (
          <SelectItem key={period.value} value={period.value} className="cursor-pointer text-xs">
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export { REPORTING_PERIODS };
