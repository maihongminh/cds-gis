'use client';

import * as React from 'react';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';
import { MOCK_CROP_TYPES } from '@/data/mock-catalogs';
import { SearchInput } from '@/components/common';

interface HouseholdsFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedEthnicity: string;
  setSelectedEthnicity: (e: string) => void;
  selectedClassification: string;
  setSelectedClassification: (c: string) => void;
  selectedCropType: string;
  setSelectedCropType: (t: string) => void;
  onReset: () => void;
}

export function HouseholdsFilters({
  searchQuery,
  setSearchQuery,
  selectedHamlet,
  setSelectedHamlet,
  selectedEthnicity,
  setSelectedEthnicity,
  selectedClassification,
  setSelectedClassification,
  selectedCropType,
  setSelectedCropType,
  onReset,
}: HouseholdsFiltersProps) {
  const { hamlets } = useTenant();


  const hasActiveFilters =
    searchQuery !== '' ||
    (selectedHamlet !== 'all') ||
    selectedEthnicity !== 'all' ||
    selectedClassification !== 'all' ||
    selectedCropType !== 'all';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm mã hộ, tên, CCCD..."
          iconClassName="left-2.5 text-muted-foreground/60"
        />

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

        {/* 3. Ethnicity Filter */}
        <div>
          <Select value={selectedEthnicity} onValueChange={setSelectedEthnicity}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Dân tộc..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Mọi dân tộc</SelectItem>
              <SelectItem value="Vân Kiều" className="cursor-pointer">Vân Kiều</SelectItem>
              <SelectItem value="Cà Dong" className="cursor-pointer">Cà Dong</SelectItem>
              <SelectItem value="Kinh" className="cursor-pointer">Kinh</SelectItem>
              <SelectItem value="Mơ Nông" className="cursor-pointer">Mơ Nông</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 4. Classification Filter */}
        <div>
          <Select value={selectedClassification} onValueChange={setSelectedClassification}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Phân loại kinh tế..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Mọi nhóm kinh tế</SelectItem>
              <SelectItem value="poor" className="cursor-pointer">Hộ nghèo</SelectItem>
              <SelectItem value="nearPoor" className="cursor-pointer">Hộ cận nghèo</SelectItem>
              <SelectItem value="average" className="cursor-pointer">Hộ trung bình</SelectItem>
              <SelectItem value="betterOff" className="cursor-pointer">Hộ khá / giàu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 5. Main Crop Filter */}
        <div>
          <Select value={selectedCropType} onValueChange={setSelectedCropType}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Cây trồng chính..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Mọi cây trồng</SelectItem>
              {MOCK_CROP_TYPES.map((c) => (
                <SelectItem key={c.code} value={c.name} className="cursor-pointer">
                  {c.name}
                </SelectItem>
              ))}
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
