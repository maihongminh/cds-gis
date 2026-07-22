'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Button, Label } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';

interface IrrigationFiltersProps {
  activeTab: string;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  onReset: () => void;
}

export function IrrigationFilters({
  activeTab,
  selectedHamlet,
  setSelectedHamlet,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  onReset,
}: IrrigationFiltersProps) {
  const { hamlets } = useTenant();

  const isUnitsTab = activeTab === 'units';
  const isFacTab = activeTab === 'facilities';
  const isOpTab = activeTab === 'operations';

  const hasActiveFilters =
    (!isUnitsTab && selectedHamlet !== 'all') ||
    (isFacTab && selectedType !== 'all') ||
    (!isUnitsTab && selectedStatus !== 'all');

  if (isUnitsTab) return null;

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
              <SelectItem value="all" className="cursor-pointer">Tất cả các Thôn</SelectItem>
              {hamlets.map((h) => (
                <SelectItem key={h.code} value={h.code} className="cursor-pointer">
                  {h.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 2. Type Select (Only for Facilities tab) */}
        {isFacTab && (
          <div className="space-y-1 min-w-[130px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Loại công trình</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả loại</SelectItem>
                <SelectItem value="dam" className="cursor-pointer">Đập dâng</SelectItem>
                <SelectItem value="reservoir" className="cursor-pointer">Hồ chứa nước</SelectItem>
                <SelectItem value="canal" className="cursor-pointer">Kênh mương</SelectItem>
                <SelectItem value="pumpingStation" className="cursor-pointer">Trạm bơm</SelectItem>
                <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 3. Status Select */}
        {isFacTab && (
          <div className="space-y-1 min-w-[120px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Hiện trạng kỹ thuật</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                <SelectItem value="good" className="cursor-pointer">Hoạt động tốt</SelectItem>
                <SelectItem value="needsRepair" className="cursor-pointer">Cần sửa chữa</SelectItem>
                <SelectItem value="damaged" className="cursor-pointer">Hư hỏng nặng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {isOpTab && (
          <div className="space-y-1 min-w-[120px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Tình trạng kiểm tra</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                <SelectItem value="resolved" className="cursor-pointer">Bình thường / Đã xử lý</SelectItem>
                <SelectItem value="pending" className="cursor-pointer">Chờ xử lý lỗi</SelectItem>
                <SelectItem value="monitoring" className="cursor-pointer">Đang theo dõi thêm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reset button */}
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
