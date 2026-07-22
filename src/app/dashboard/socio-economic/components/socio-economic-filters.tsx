'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Button, Label } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';

interface SocioEconomicFiltersProps {
  activeTab: string;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  onReset: () => void;
}

export function SocioEconomicFilters({
  activeTab,
  selectedHamlet,
  setSelectedHamlet,
  selectedYear,
  setSelectedYear,
  onReset,
}: SocioEconomicFiltersProps) {
  const { hamlets } = useTenant();

  const isEconomicTab = activeTab === 'economic';

  const hasActiveFilters =
    (!isEconomicTab && selectedHamlet !== 'all') || selectedYear !== 'all';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="flex flex-wrap items-end gap-3">
        {/* 1. Hamlet Select (Not applicable to Economic tab) */}
        {!isEconomicTab && (
          <div className="space-y-1 min-w-[120px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Thôn địa bàn</Label>
            <Select value={selectedHamlet} onValueChange={setSelectedHamlet}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue placeholder="Chọn Thôn..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Toàn xã</SelectItem>
                {hamlets.map((h) => (
                  <SelectItem key={h.code} value={h.code} className="cursor-pointer">
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 2. Year Select */}
        <div className="space-y-1 min-w-[100px]">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Năm báo cáo</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả các năm</SelectItem>
              <SelectItem value="2026" className="cursor-pointer">2026</SelectItem>
              <SelectItem value="2025" className="cursor-pointer">2025</SelectItem>
              <SelectItem value="2024" className="cursor-pointer">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer shadow-none flex items-center gap-1.5"
          >
            <RotateCcw className="size-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
