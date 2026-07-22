'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';
import { useTenant } from './tenant-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

export function TenantSwitcher() {
  const { selectedCommune, selectedHamletCode, setSelectedHamletCode, hamlets } = useTenant();

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-medium border-r border-border pr-2 animate-none">
        <MapPin className="size-4 text-primary" />
        <span className="whitespace-nowrap">{selectedCommune.name}</span>
      </div>

      <Select
        value={selectedHamletCode}
        onValueChange={setSelectedHamletCode}
      >
        <SelectTrigger className="w-fit min-w-[150px] h-8 text-xs font-medium bg-card border-border text-foreground cursor-pointer shadow-none">
          <SelectValue placeholder="Chọn thôn" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all" className="text-xs cursor-pointer">Toàn {selectedCommune.name}</SelectItem>
          {hamlets.map((hamlet) => (
            <SelectItem key={hamlet.code} value={hamlet.code} className="text-xs cursor-pointer">
              {hamlet.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
