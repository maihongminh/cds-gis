'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Button, Label } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';

interface WaterFiltersProps {
  activeTab: string;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedFacilityType: string;
  setSelectedFacilityType: (t: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedOperatingStatus: string;
  setSelectedOperatingStatus: (s: string) => void;
  onReset: () => void;
}

export function WaterFilters({
  activeTab,
  selectedHamlet,
  setSelectedHamlet,
  selectedYear,
  setSelectedYear,
  selectedFacilityType,
  setSelectedFacilityType,
  selectedStatus,
  setSelectedStatus,
  selectedOperatingStatus,
  setSelectedOperatingStatus,
  onReset,
}: WaterFiltersProps) {
  const { hamlets } = useTenant();

  const hasActiveFilters =
    selectedHamlet !== 'all' ||
    selectedYear !== 'all' ||
    selectedFacilityType !== 'all' ||
    selectedStatus !== 'all' ||
    selectedOperatingStatus !== 'all';

  const showHamletFilter = activeTab !== 'treatment';
  const showYearFilter = ['usage', 'groundwater', 'facilities'].includes(activeTab);
  const showPermitStatusFilter = activeTab === 'groundwater';
  const showFacilityTypeFilter = activeTab === 'facilities';
  const showOperatingStatusFilter = ['facilities', 'treatment'].includes(activeTab);

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

        {/* 2. Year Select */}
        {showYearFilter && (
          <div className="space-y-1 min-w-[100px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Năm</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả năm</SelectItem>
                <SelectItem value="2024" className="cursor-pointer">Năm 2024</SelectItem>
                <SelectItem value="2025" className="cursor-pointer">Năm 2025</SelectItem>
                <SelectItem value="2026" className="cursor-pointer">Năm 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 3. Permit Status Select */}
        {showPermitStatusFilter && (
          <div className="space-y-1 min-w-[130px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Trạng thái GP</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái</SelectItem>
                <SelectItem value="active" className="cursor-pointer">Còn hiệu lực</SelectItem>
                <SelectItem value="expired" className="cursor-pointer">Hết hiệu lực</SelectItem>
                <SelectItem value="revoked" className="cursor-pointer">Đã thu hồi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 4. Facility Type Select */}
        {showFacilityTypeFilter && (
          <div className="space-y-1 min-w-[140px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Loại công trình</Label>
            <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả các loại</SelectItem>
                <SelectItem value="centralized" className="cursor-pointer">Tập trung (Centralized)</SelectItem>
                <SelectItem value="small" className="cursor-pointer">Nhỏ lẻ tự quản (Small)</SelectItem>
                <SelectItem value="gravity" className="cursor-pointer">Cấp nước tự chảy</SelectItem>
                <SelectItem value="pump" className="cursor-pointer">Trạm bơm điện</SelectItem>
                <SelectItem value="drilledWell" className="cursor-pointer">Giếng khoan công nghiệp</SelectItem>
                <SelectItem value="diggedWell" className="cursor-pointer">Giếng đào hộ gia đình</SelectItem>
                <SelectItem value="gravityTank" className="cursor-pointer">Bể nước tự chảy hộ</SelectItem>
                <SelectItem value="rainwaterHarvest" className="cursor-pointer">Bể trữ nước mưa hộ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 5. Operating Status Select */}
        {showOperatingStatusFilter && (
          <div className="space-y-1 min-w-[140px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Tình trạng vận hành</Label>
            <Select value={selectedOperatingStatus} onValueChange={setSelectedOperatingStatus}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả tình trạng</SelectItem>
                <SelectItem value="active" className="cursor-pointer">Đang hoạt động</SelectItem>
                <SelectItem value="maintenance" className="cursor-pointer">Bảo trì/Sửa chữa</SelectItem>
                <SelectItem value="inactive" className="cursor-pointer">Tạm ngừng</SelectItem>
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
