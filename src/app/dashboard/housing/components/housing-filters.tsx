'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Button, Label } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';

interface HousingFiltersProps {
  activeTab: string;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedHousingType: string;
  setSelectedHousingType: (t: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedPriority: string;
  setSelectedPriority: (p: string) => void;
  onReset: () => void;
}

export function HousingFilters({
  activeTab,
  selectedHamlet,
  setSelectedHamlet,
  selectedHousingType,
  setSelectedHousingType,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  onReset,
}: HousingFiltersProps) {
  const { hamlets } = useTenant();

  const hasActiveFilters =
    selectedHamlet !== 'all' ||
    selectedHousingType !== 'all' ||
    selectedStatus !== 'all' ||
    selectedPriority !== 'all';

  const showHousingTypeFilter = activeTab === 'list';
  const showStatusFilter = ['support', 'need'].includes(activeTab);
  const showPriorityFilter = activeTab === 'need';

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

        {/* 2. Housing Type Select */}
        {showHousingTypeFilter && (
          <div className="space-y-1 min-w-[130px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Phân loại nhà</Label>
            <Select value={selectedHousingType} onValueChange={setSelectedHousingType}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả phân loại</SelectItem>
                <SelectItem value="kiên cố" className="cursor-pointer">Kiên cố</SelectItem>
                <SelectItem value="bán kiên cố" className="cursor-pointer">Bán kiên cố</SelectItem>
                <SelectItem value="nhà tạm" className="cursor-pointer">Nhà tạm</SelectItem>
                <SelectItem value="dột nát" className="cursor-pointer">Dột nát</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 3. Status Select */}
        {showStatusFilter && (
          <div className="space-y-1 min-w-[130px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Trạng thái hỗ trợ</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái</SelectItem>
                {activeTab === 'support' && (
                  <>
                    <SelectItem value="completed" className="cursor-pointer">Đã hoàn thành (Completed)</SelectItem>
                    <SelectItem value="ongoing" className="cursor-pointer">Đang thực hiện (Ongoing)</SelectItem>
                    <SelectItem value="pending" className="cursor-pointer">Chờ kinh phí (Pending)</SelectItem>
                    <SelectItem value="rejected" className="cursor-pointer">Bị từ chối (Rejected)</SelectItem>
                  </>
                )}
                {activeTab === 'need' && (
                  <>
                    <SelectItem value="pending" className="cursor-pointer">Đang chờ xét duyệt</SelectItem>
                    <SelectItem value="approved" className="cursor-pointer">Đã phê duyệt</SelectItem>
                    <SelectItem value="rejected" className="cursor-pointer">Từ chối hỗ trợ</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 4. Priority Select */}
        {showPriorityFilter && (
          <div className="space-y-1 min-w-[120px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Độ ưu tiên</Label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả độ ưu tiên</SelectItem>
                <SelectItem value="high" className="cursor-pointer">Khẩn cấp / Cao</SelectItem>
                <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                <SelectItem value="low" className="cursor-pointer">Thấp</SelectItem>
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
