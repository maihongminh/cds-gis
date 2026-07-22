'use client';

import * as React from 'react';
import { Input, Button, Checkbox, Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';
import { MOCK_CROP_TYPES, MOCK_SEASONS } from '@/data/mock-catalogs';
import { SearchInput } from '@/components/common';
import { CropChangeReason } from '@/types/crop-change';

interface CropChangesFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCropType: string;
  setSelectedCropType: (t: string) => void;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (p: string) => void;
  selectedReason: string;
  setSelectedReason: (r: string) => void;
  filterSignificant: boolean;
  setFilterSignificant: (b: boolean) => void;
  onReset: () => void;
}

const REASONS_MAP: Record<CropChangeReason, string> = {
  cropConversion: 'Chuyển đổi cây trồng',
  naturalDisaster: 'Thiên tai',
  disease: 'Dịch bệnh',
  poorHarvest: 'Thất thu mùa vụ',
  marketChange: 'Biến động thị trường',
  landChange: 'Thay đổi diện tích đất',
  other: 'Khác',
};

export function CropChangesFilters({
  searchQuery,
  setSearchQuery,
  selectedCropType,
  setSelectedCropType,
  selectedHamlet,
  setSelectedHamlet,
  selectedPeriod,
  setSelectedPeriod,
  selectedReason,
  setSelectedReason,
  filterSignificant,
  setFilterSignificant,
  onReset,
}: CropChangesFiltersProps) {
  const { hamlets } = useTenant();

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCropType !== 'all' ||
    selectedHamlet !== 'all' ||
    selectedPeriod !== 'all' ||
    selectedReason !== 'all' ||
    filterSignificant;

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-end">
        {/* 1. Keyword search */}
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Tìm kiếm</Label>
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm chủ hộ, mã hộ..."
            iconClassName="left-2.5 text-muted-foreground/60"
          />
        </div>

        {/* 2. Crop Type Select */}
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Loại cây trồng</Label>
          <Select value={selectedCropType} onValueChange={setSelectedCropType}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Chọn cây trồng..." />
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

        {/* 3. Hamlet Select */}
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Thôn</Label>
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

        {/* 4. Season/Period Select */}
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Kỳ vụ</Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Chọn vụ..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả kỳ vụ</SelectItem>
              {MOCK_SEASONS.map((s) => (
                <SelectItem key={s.code} value={s.code} className="cursor-pointer">
                  {s.season} {s.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 5. Reason Select */}
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Nguyên nhân</Label>
          <Select value={selectedReason} onValueChange={setSelectedReason}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Lý do biến động..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả lý do</SelectItem>
              {Object.entries(REASONS_MAP).map(([code, name]) => (
                <SelectItem key={code} value={code} className="cursor-pointer">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="significant"
            checked={filterSignificant}
            onCheckedChange={(checked: boolean | 'indeterminate') => setFilterSignificant(!!checked)}
            className="cursor-pointer"
          />
          <label htmlFor="significant" className="text-xs text-foreground cursor-pointer select-none font-medium">
            Chỉ hiển thị biến động mạnh (tăng/giảm diện tích &ge; 20%)
          </label>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground cursor-pointer shadow-none flex items-center gap-1.5"
          >
            <RotateCcw className="size-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
