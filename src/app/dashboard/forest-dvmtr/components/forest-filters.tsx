'use client';

import * as React from 'react';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';
import { SearchInput } from '@/components/common';

interface ForestFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedForestType: string;
  setSelectedForestType: (t: string) => void;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedPaymentStatus: string;
  setSelectedPaymentStatus: (p: string) => void;
  selectedContractStatus: string;
  setSelectedContractStatus: (s: string) => void;
  onReset: () => void;
}

export function ForestFilters({
  searchQuery,
  setSearchQuery,
  selectedForestType,
  setSelectedForestType,
  selectedHamlet,
  setSelectedHamlet,
  selectedPaymentStatus,
  setSelectedPaymentStatus,
  selectedContractStatus,
  setSelectedContractStatus,
  onReset,
}: ForestFiltersProps) {
  const { hamlets } = useTenant();

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedForestType !== 'all' ||
    (selectedHamlet !== 'all') ||
    selectedPaymentStatus !== 'all' ||
    selectedContractStatus !== 'all';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm mã hợp đồng, chủ hộ..."
          iconClassName="left-2.5 text-muted-foreground/60"
        />

        {/* Forest Type */}
        <div>
          <Select value={selectedForestType} onValueChange={setSelectedForestType}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Loại rừng..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả phân loại rừng</SelectItem>
              <SelectItem value="dat-rung-phong-ho" className="cursor-pointer">Rừng phòng hộ</SelectItem>
              <SelectItem value="dat-rung-san-xuat" className="cursor-pointer">Rừng sản xuất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hamlet */}
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

        {/* Payment Status */}
        <div>
          <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Trạng thái chi trả..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái chi trả</SelectItem>
              <SelectItem value="paid" className="cursor-pointer">Đã chi trả</SelectItem>
              <SelectItem value="partially_paid" className="cursor-pointer">Chi trả một phần</SelectItem>
              <SelectItem value="pending" className="cursor-pointer">Chưa chi trả</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contract Status */}
        <div>
          <Select value={selectedContractStatus} onValueChange={setSelectedContractStatus}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Trạng thái hợp đồng..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái HĐ</SelectItem>
              <SelectItem value="active" className="cursor-pointer">Đang hiệu lực</SelectItem>
              <SelectItem value="inactive" className="cursor-pointer">Hết hiệu lực</SelectItem>
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
