'use client';

import * as React from 'react';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';

interface EconomyFiltersProps {
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedClassification: string;
  setSelectedClassification: (c: string) => void;
  selectedIncomeRange: string;
  setSelectedIncomeRange: (r: string) => void;
  onReset: () => void;
}

export function EconomyFilters({
  selectedYear,
  setSelectedYear,
  selectedHamlet,
  setSelectedHamlet,
  selectedClassification,
  setSelectedClassification,
  selectedIncomeRange,
  setSelectedIncomeRange,
  onReset,
}: EconomyFiltersProps) {
  const { hamlets } = useTenant();


  const hasActiveFilters =
    selectedYear !== '2026' ||
    (selectedHamlet !== 'all') ||
    selectedClassification !== 'all' ||
    selectedIncomeRange !== 'all';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {/* 1. Year Filter */}
        <div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Năm thống kê..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="2026" className="cursor-pointer">Năm 2026 (Hiện tại)</SelectItem>
              <SelectItem value="2025" className="cursor-pointer">Năm 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 2. Hamlet Filter */}
        <div>
          <Select
            value={selectedHamlet}
            onValueChange={setSelectedHamlet}
          >
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Lọc theo Thôn..." />
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

        {/* 3. Economic Classification */}
        <div>
          <Select value={selectedClassification} onValueChange={setSelectedClassification}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Phân loại kinh tế..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả hộ gia đình</SelectItem>
              <SelectItem value="poor" className="cursor-pointer">Hộ nghèo</SelectItem>
              <SelectItem value="near_poor" className="cursor-pointer">Hộ cận nghèo</SelectItem>
              <SelectItem value="normal" className="cursor-pointer">Hộ trung bình / khá</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 4. Income Range Brackets */}
        <div>
          <Select value={selectedIncomeRange} onValueChange={setSelectedIncomeRange}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Khoảng thu nhập..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả thu nhập</SelectItem>
              <SelectItem value="under_30" className="cursor-pointer">Dưới 30 triệu VND/năm</SelectItem>
              <SelectItem value="30_60" className="cursor-pointer">30 - 60 triệu VND/năm</SelectItem>
              <SelectItem value="60_100" className="cursor-pointer">60 - 100 triệu VND/năm</SelectItem>
              <SelectItem value="over_100" className="cursor-pointer">Trên 100 triệu VND/năm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground cursor-pointer shadow-none flex items-center gap-1.5"
          >
            <RotateCcw className="size-4" />
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
