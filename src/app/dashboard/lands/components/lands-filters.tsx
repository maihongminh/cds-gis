'use client';

import * as React from 'react';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';
import { MOCK_LAND_TYPES } from '@/data/mock-catalogs';
import { SearchInput } from '@/components/common';

interface LandsFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLandType: string;
  setSelectedLandType: (t: string) => void;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedCertStatus: string;
  setSelectedCertStatus: (c: string) => void;
  selectedOwnership: string;
  setSelectedOwnership: (o: string) => void;
  onReset: () => void;
}

export function LandsFilters({
  searchQuery,
  setSearchQuery,
  selectedLandType,
  setSelectedLandType,
  selectedHamlet,
  setSelectedHamlet,
  selectedCertStatus,
  setSelectedCertStatus,
  selectedOwnership,
  setSelectedOwnership,
  onReset,
}: LandsFiltersProps) {
  const { hamlets } = useTenant();


  const hasActiveFilters =
    searchQuery !== '' ||
    selectedLandType !== 'all' ||
    (selectedHamlet !== 'all') ||
    selectedCertStatus !== 'all' ||
    selectedOwnership !== 'all';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {/* Keyword Search */}
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm mã thửa, chủ hộ..."
          iconClassName="left-2.5 text-muted-foreground/60"
        />

        {/* Land Type Filter */}
        <div>
          <Select value={selectedLandType} onValueChange={setSelectedLandType}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Loại đất..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả loại đất</SelectItem>
              {MOCK_LAND_TYPES.map((l) => (
                <SelectItem key={l.code} value={l.code} className="cursor-pointer">
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hamlet Filter */}
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

        {/* GCN Cert Status Filter */}
        <div>
          <Select value={selectedCertStatus} onValueChange={setSelectedCertStatus}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Tình trạng GCN..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái GCN</SelectItem>
              <SelectItem value="granted" className="cursor-pointer">Đã cấp sổ đỏ</SelectItem>
              <SelectItem value="pending" className="cursor-pointer">Đang chờ duyệt cấp</SelectItem>
              <SelectItem value="none" className="cursor-pointer">Chưa có sổ đỏ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ownership Type Filter */}
        <div>
          <Select value={selectedOwnership} onValueChange={setSelectedOwnership}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Hình thức sở hữu..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả hình thức</SelectItem>
              <SelectItem value="household" className="cursor-pointer">Sở hữu hộ gia đình</SelectItem>
              <SelectItem value="communal" className="cursor-pointer">Sở hữu tập thể</SelectItem>
              <SelectItem value="rented" className="cursor-pointer">Thuê / Giao khoán</SelectItem>
              <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
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
