'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Button, Label } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';

interface ClimateFiltersProps {
  activeTab: string;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  onReset: () => void;
}

export function ClimateFilters({
  activeTab,
  selectedHamlet,
  setSelectedHamlet,
  selectedYear,
  setSelectedYear,
  selectedStatus,
  setSelectedStatus,
  onReset,
}: ClimateFiltersProps) {
  const { hamlets } = useTenant();

  const hasActiveFilters =
    selectedHamlet !== 'all' ||
    selectedYear !== 'all' ||
    selectedStatus !== 'all';

  const showHamletFilter = activeTab !== 'weather';
  const showYearFilter = activeTab === 'weather';
  const showStatusFilter = activeTab !== 'weather';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="flex flex-wrap items-end gap-3">
        {/* 1. Hamlet Select */}
        {showHamletFilter && (
          <div className="space-y-1 min-w-[120px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Thôn địa bàn</Label>
            <Select value={selectedHamlet} onValueChange={setSelectedHamlet}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue placeholder="Chọn Thôn..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả Thôn</SelectItem>
                {hamlets.map((h) => (
                  <SelectItem key={h.code} value={h.code} className="cursor-pointer">
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 2. Year Select (Weather tab) */}
        {showYearFilter && (
          <div className="space-y-1 min-w-[100px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Năm</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả năm</SelectItem>
                <SelectItem value="2025" className="cursor-pointer">Năm 2025</SelectItem>
                <SelectItem value="2026" className="cursor-pointer">Năm 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 3. Status Select */}
        {showStatusFilter && (
          <div className="space-y-1 min-w-[130px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Trạng thái</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái</SelectItem>
                {activeTab === 'disaster' && (
                  <>
                    <SelectItem value="active" className="cursor-pointer">Đang diễn ra (Active)</SelectItem>
                    <SelectItem value="processing" className="cursor-pointer">Đang ứng phó (Processing)</SelectItem>
                    <SelectItem value="resolved" className="cursor-pointer">Đã khắc phục (Resolved)</SelectItem>
                  </>
                )}
                {activeTab === 'alerts' && (
                  <>
                    <SelectItem value="active" className="cursor-pointer">Có hiệu lực</SelectItem>
                    <SelectItem value="archived" className="cursor-pointer">Hết hiệu lực (Archived)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reset filters button */}
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
