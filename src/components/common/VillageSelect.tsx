// src/components/common/VillageSelect.tsx

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VILLAGES } from '@/data/laobao-administrative-units';

interface VillageSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  allowAll?: boolean;
}

export function VillageSelect({ value, onValueChange, className, allowAll = true }: VillageSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Chọn thôn" />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value="all" className="cursor-pointer text-xs">Toàn xã Lao Bảo</SelectItem>}
        {VILLAGES.map((v) => (
          <SelectItem key={v.code} value={v.code} className="cursor-pointer text-xs">
            Thôn {v.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
