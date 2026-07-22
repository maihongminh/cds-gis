'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Button, Label } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';

interface BusinessFiltersProps {
  activeTab: string;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (i: string) => void;
  selectedScale: string;
  setSelectedScale: (s: string) => void;
  selectedHasRegistration: string;
  setSelectedHasRegistration: (r: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (p: string) => void;
  onReset: () => void;
}

export function BusinessFilters({
  activeTab,
  selectedHamlet,
  setSelectedHamlet,
  selectedIndustry,
  setSelectedIndustry,
  selectedScale,
  setSelectedScale,
  selectedHasRegistration,
  setSelectedHasRegistration,
  selectedPeriod,
  setSelectedPeriod,
  onReset,
}: BusinessFiltersProps) {
  const { hamlets } = useTenant();

  const hasActiveFilters =
    selectedHamlet !== 'all' ||
    selectedIndustry !== 'all' ||
    selectedScale !== 'all' ||
    selectedHasRegistration !== 'all' ||
    selectedPeriod !== 'all';

  const showListFilters = activeTab === 'list';
  const showRevenueFilters = activeTab === 'revenue';

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="flex flex-wrap items-end gap-3">
        {/* 1. Hamlet Select */}
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

        {/* 2. Industry Select (List tab) */}
        {showListFilters && (
          <div className="space-y-1 min-w-[140px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Ngành nghề</Label>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả ngành nghề</SelectItem>
                <SelectItem value="Tạp hóa" className="cursor-pointer">Tạp hóa</SelectItem>
                <SelectItem value="Sửa chữa xe máy" className="cursor-pointer">Sửa chữa xe máy</SelectItem>
                <SelectItem value="Cơ sở xay xát lúa" className="cursor-pointer">Cơ sở xay xát lúa</SelectItem>
                <SelectItem value="Thu mua lâm sản (Quế, Sâm)" className="cursor-pointer">Thu mua lâm sản</SelectItem>
                <SelectItem value="Quán ăn/Cà phê" className="cursor-pointer">Quán ăn/Cà phê</SelectItem>
                <SelectItem value="Dịch vụ vận tải nhỏ" className="cursor-pointer">Vận tải nhỏ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 3. Scale Select (List tab) */}
        {showListFilters && (
          <div className="space-y-1 min-w-[110px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Quy mô</Label>
            <Select value={selectedScale} onValueChange={setSelectedScale}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả quy mô</SelectItem>
                <SelectItem value="small" className="cursor-pointer">Nhỏ (Small)</SelectItem>
                <SelectItem value="medium" className="cursor-pointer">Vừa (Medium)</SelectItem>
                <SelectItem value="large" className="cursor-pointer">Lớn (Large)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 4. Business Registration Select (List tab) */}
        {showListFilters && (
          <div className="space-y-1 min-w-[130px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Đăng ký kinh doanh</Label>
            <Select value={selectedHasRegistration} onValueChange={setSelectedHasRegistration}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                <SelectItem value="yes" className="cursor-pointer">Đã đăng ký (Có giấy)</SelectItem>
                <SelectItem value="no" className="cursor-pointer">Chưa đăng ký</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 5. Period Select (Revenue tab) */}
        {showRevenueFilters && (
          <div className="space-y-1 min-w-[130px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Kỳ ghi nhận</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả kỳ</SelectItem>
                <SelectItem value="Quý 1/2026" className="cursor-pointer">Quý 1/2026</SelectItem>
                <SelectItem value="Quý 2/2026" className="cursor-pointer">Quý 2/2026</SelectItem>
                <SelectItem value="Năm 2025" className="cursor-pointer">Cả năm 2025</SelectItem>
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
