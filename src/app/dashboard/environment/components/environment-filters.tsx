'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Button, Label } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';

interface EnvironmentFiltersProps {
  activeTab: string;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (s: string) => void;
  onReset: () => void;
}

export function EnvironmentFilters({
  activeTab,
  selectedHamlet,
  setSelectedHamlet,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  selectedStatus,
  setSelectedStatus,
  selectedSeverity,
  setSelectedSeverity,
  onReset,
}: EnvironmentFiltersProps) {
  const { hamlets } = useTenant();

  const hasActiveFilters =
    selectedHamlet !== 'all' ||
    selectedMonth !== 'all' ||
    selectedYear !== 'all' ||
    selectedStatus !== 'all' ||
    selectedSeverity !== 'all';

  const showStatusFilter = ['registrations', 'violations', 'complaints'].includes(activeTab);
  const showSeverityFilter = activeTab === 'violations';
  const showMonthFilter = activeTab === 'waste';

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

        {/* 2. Month Select (only for waste) */}
        {showMonthFilter && (
          <div className="space-y-1 min-w-[100px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Tháng</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả tháng</SelectItem>
                {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((m) => (
                  <SelectItem key={m} value={m} className="cursor-pointer">
                    Tháng {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 3. Year Select */}
        <div className="space-y-1 min-w-[100px]">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Năm</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả năm</SelectItem>
              <SelectItem value="2025" className="cursor-pointer">Năm 2025</SelectItem>
              <SelectItem value="2026" className="cursor-pointer">Năm 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 4. Status Select */}
        {showStatusFilter && (
          <div className="space-y-1 min-w-[130px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Trạng thái</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái</SelectItem>
                {activeTab === 'registrations' && (
                  <>
                    <SelectItem value="pending" className="cursor-pointer">Đang xử lý (Pending)</SelectItem>
                    <SelectItem value="approved" className="cursor-pointer">Đã phê duyệt (Approved)</SelectItem>
                    <SelectItem value="rejected" className="cursor-pointer">Từ chối (Rejected)</SelectItem>
                  </>
                )}
                {activeTab === 'violations' && (
                  <>
                    <SelectItem value="pending" className="cursor-pointer">Chờ giải quyết</SelectItem>
                    <SelectItem value="processing" className="cursor-pointer">Đang xử lý</SelectItem>
                    <SelectItem value="resolved" className="cursor-pointer">Đã khắc phục</SelectItem>
                  </>
                )}
                {activeTab === 'complaints' && (
                  <>
                    <SelectItem value="received" className="cursor-pointer">Đã tiếp nhận</SelectItem>
                    <SelectItem value="processing" className="cursor-pointer">Đang giải quyết</SelectItem>
                    <SelectItem value="resolved" className="cursor-pointer">Đã phản hồi xong</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 5. Severity Select */}
        {showSeverityFilter && (
          <div className="space-y-1 min-w-[120px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Mức độ vi phạm</Label>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả mức độ</SelectItem>
                <SelectItem value="low" className="cursor-pointer">Thấp</SelectItem>
                <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                <SelectItem value="high" className="cursor-pointer">Nghiêm trọng (High)</SelectItem>
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
