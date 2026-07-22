'use client';

import * as React from 'react';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';
import { MOCK_CROP_TYPES } from '@/data/mock-catalogs';

interface ReportFiltersProps {
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedCropType: string;
  setSelectedCropType: (t: string) => void;
  selectedClassification: string;
  setSelectedClassification: (c: string) => void;
  onReset: () => void;
}

export function ReportFilters({
  selectedYear,
  setSelectedYear,
  selectedHamlet,
  setSelectedHamlet,
  selectedCropType,
  setSelectedCropType,
  selectedClassification,
  setSelectedClassification,
  onReset,
}: ReportFiltersProps) {
  const { hamlets } = useTenant();

  const hasActiveFilters =
    selectedYear !== '2026' ||
    (selectedHamlet !== 'all') ||
    selectedCropType !== 'all' ||
    selectedClassification !== 'all';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {/* Year Selector */}
        <div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Năm báo cáo..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="2026" className="cursor-pointer">Năm 2026</SelectItem>
              <SelectItem value="2025" className="cursor-pointer">Năm 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hamlet Selector */}
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

        {/* Crop Type Selector */}
        <div>
          <Select value={selectedCropType} onValueChange={setSelectedCropType}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Theo loại cây trồng..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả cây trồng</SelectItem>
              {MOCK_CROP_TYPES.map((c) => (
                <SelectItem key={c.code} value={c.code} className="cursor-pointer">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Economic Classification Selector */}
        <div>
          <Select value={selectedClassification} onValueChange={setSelectedClassification}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Phân loại hộ..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả phân loại hộ</SelectItem>
              <SelectItem value="poor" className="cursor-pointer">Hộ nghèo</SelectItem>
              <SelectItem value="nearPoor" className="cursor-pointer">Hộ cận nghèo</SelectItem>
              <SelectItem value="average" className="cursor-pointer">Hộ trung bình</SelectItem>
              <SelectItem value="betterOff" className="cursor-pointer">Hộ khá/giàu</SelectItem>
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
