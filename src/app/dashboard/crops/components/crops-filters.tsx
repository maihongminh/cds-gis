'use client';

import * as React from 'react';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';
import { MOCK_CROP_TYPES, MOCK_SEASONS } from '@/data/mock-catalogs';
import { SearchInput } from '@/components/common';

interface CropsFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCropType: string;
  setSelectedCropType: (t: string) => void;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedSeason: string;
  setSelectedSeason: (s: string) => void;
  selectedDisease: string;
  setSelectedDisease: (d: string) => void;
  onReset: () => void;
}

export function CropsFilters({
  searchQuery,
  setSearchQuery,
  selectedCropType,
  setSelectedCropType,
  selectedHamlet,
  setSelectedHamlet,
  selectedSeason,
  setSelectedSeason,
  selectedDisease,
  setSelectedDisease,
  onReset,
}: CropsFiltersProps) {
  const { hamlets } = useTenant();


  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCropType !== 'all' ||
    (selectedHamlet !== 'all') ||
    selectedSeason !== 'all' ||
    selectedDisease !== 'all';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm chủ hộ, mã hộ, vùng trồng..."
          iconClassName="left-2.5 text-muted-foreground/60"
        />

        {/* 2. Crop Type Select */}
        <div>
          <Select value={selectedCropType} onValueChange={setSelectedCropType}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Loại cây trồng..." />
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

        {/* 4. Season Select */}
        <div>
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Vụ canh tác..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả mùa vụ</SelectItem>
              {MOCK_SEASONS.map((s) => (
                <SelectItem key={s.code} value={s.code} className="cursor-pointer">
                  {s.season} {s.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 5. Disease Status Select */}
        <div>
          <Select value={selectedDisease} onValueChange={setSelectedDisease}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Tình trạng dịch bệnh..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tình trạng bệnh hại</SelectItem>
              <SelectItem value="none" className="cursor-pointer">Bình thường (An toàn)</SelectItem>
              <SelectItem value="monitoring" className="cursor-pointer">Đang theo dõi bệnh</SelectItem>
              <SelectItem value="treated" className="cursor-pointer">Đã xử lý dứt điểm</SelectItem>
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
