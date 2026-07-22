'use client';

import * as React from 'react';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';
import { MOCK_LIVESTOCK_TYPES } from '@/data/mock-catalogs';
import { SearchInput } from '@/components/common';

interface LivestockFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedAnimalType: string;
  setSelectedAnimalType: (t: string) => void;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedDisease: string;
  setSelectedDisease: (d: string) => void;
  onReset: () => void;
}

export function LivestockFilters({
  searchQuery,
  setSearchQuery,
  selectedAnimalType,
  setSelectedAnimalType,
  selectedHamlet,
  setSelectedHamlet,
  selectedDisease,
  setSelectedDisease,
  onReset,
}: LivestockFiltersProps) {
  const { hamlets } = useTenant();


  const hasActiveFilters =
    searchQuery !== '' ||
    selectedAnimalType !== 'all' ||
    (selectedHamlet !== 'all') ||
    selectedDisease !== 'all';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* 1. Keyword search */}
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo tên chủ hộ, mã hộ..."
          iconClassName="left-2.5 text-muted-foreground/60"
        />

        {/* 2. Animal Type Select */}
        <div>
          <Select value={selectedAnimalType} onValueChange={setSelectedAnimalType}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Loại vật nuôi..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả vật nuôi</SelectItem>
              {MOCK_LIVESTOCK_TYPES.map((l) => (
                <SelectItem key={l.code} value={l.code} className="cursor-pointer">
                  {l.name}
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

        {/* 4. Disease Select */}
        <div>
          <Select value={selectedDisease} onValueChange={setSelectedDisease}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Tình hình dịch bệnh..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tình trạng dịch bệnh</SelectItem>
              <SelectItem value="none" className="cursor-pointer">Bình thường (An toàn)</SelectItem>
              <SelectItem value="monitoring" className="cursor-pointer">Đang theo dõi bệnh</SelectItem>
              <SelectItem value="quarantined" className="cursor-pointer">Đang bị cách ly ổ dịch</SelectItem>
              <SelectItem value="treated" className="cursor-pointer">Đã điều trị khỏi</SelectItem>
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
