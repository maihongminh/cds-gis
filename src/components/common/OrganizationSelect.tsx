// src/components/common/OrganizationSelect.tsx

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_ORGANIZATIONS } from '@/data/mock-organizations';

interface OrganizationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  allowAll?: boolean;
}

export function OrganizationSelect({ value, onValueChange, className, allowAll = false }: OrganizationSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Chọn đơn vị" />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value="all" className="cursor-pointer text-xs">Tất cả đơn vị</SelectItem>}
        {MOCK_ORGANIZATIONS.map((org) => (
          <SelectItem key={org.id} value={org.id} className="cursor-pointer text-xs">
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
