'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Button, Label } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { RotateCcw } from 'lucide-react';

interface TransportationFiltersProps {
  activeTab: string;
  selectedHamlet: string;
  setSelectedHamlet: (h: string) => void;
  // Roads
  roadCategory: string;
  setRoadCategory: (c: string) => void;
  surfaceType: string;
  setSurfaceType: (t: string) => void;
  condition: string;
  setCondition: (c: string) => void;
  // Structures
  structureType: string;
  setStructureType: (t: string) => void;
  riskLevel: string;
  setRiskLevel: (r: string) => void;
  // Disruptions
  incidentType: string;
  setIncidentType: (t: string) => void;
  severity: string;
  setSeverity: (s: string) => void;
  disruptStatus: string;
  setDisruptStatus: (s: string) => void;
  // Maintenance
  maintenanceProgress: string;
  setMaintenanceProgress: (p: string) => void;
  fundingSource: string;
  setFundingSource: (f: string) => void;
  
  onReset: () => void;
}

export function TransportationFilters({
  activeTab,
  selectedHamlet,
  setSelectedHamlet,
  roadCategory,
  setRoadCategory,
  surfaceType,
  setSurfaceType,
  condition,
  setCondition,
  structureType,
  setStructureType,
  riskLevel,
  setRiskLevel,
  incidentType,
  setIncidentType,
  severity,
  setSeverity,
  disruptStatus,
  setDisruptStatus,
  maintenanceProgress,
  setMaintenanceProgress,
  fundingSource,
  setFundingSource,
  onReset
}: TransportationFiltersProps) {
  const { hamlets } = useTenant();

  const isRoads = activeTab === 'roads';
  const isStructures = activeTab === 'structures';
  const isDisruptions = activeTab === 'disruptions';
  const isMaintenance = activeTab === 'maintenance';
  const isReport = activeTab === 'report';

  if (isReport) return null;

  const hasActiveFilters =
    selectedHamlet !== 'all' ||
    (isRoads && (roadCategory !== 'all' || surfaceType !== 'all' || condition !== 'all')) ||
    (isStructures && (structureType !== 'all' || riskLevel !== 'all' || condition !== 'all')) ||
    (isDisruptions && (incidentType !== 'all' || severity !== 'all' || disruptStatus !== 'all')) ||
    (isMaintenance && (maintenanceProgress !== 'all' || fundingSource !== 'all'));

  return (
    <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-xs">
      <div className="flex flex-wrap items-end gap-3">
        {/* Hamlet Filter */}
        <div className="space-y-1 min-w-[120px]">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Thôn địa bàn</Label>
          <Select value={selectedHamlet} onValueChange={setSelectedHamlet}>
            <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="Tất cả thôn" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-xs">
              <SelectItem value="all" className="cursor-pointer">Tất cả thôn</SelectItem>
              {hamlets.map((h) => (
                <SelectItem key={h.code} value={h.code} className="cursor-pointer">
                  {h.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Roads local filters */}
        {isRoads && (
          <>
            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Loại đường</Label>
              <Select value={roadCategory} onValueChange={setRoadCategory}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="communeRoad" className="cursor-pointer">Đường xã</SelectItem>
                  <SelectItem value="villageRoad" className="cursor-pointer">Đường thôn</SelectItem>
                  <SelectItem value="productionRoad" className="cursor-pointer">Đường sản xuất</SelectItem>
                  <SelectItem value="fieldRoad" className="cursor-pointer">Đường nội đồng</SelectItem>
                  <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Mặt đường</Label>
              <Select value={surfaceType} onValueChange={setSurfaceType}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="concrete" className="cursor-pointer">Bê tông</SelectItem>
                  <SelectItem value="asphalt" className="cursor-pointer">Nhựa</SelectItem>
                  <SelectItem value="gravel" className="cursor-pointer">Cấp phối/Đá dăm</SelectItem>
                  <SelectItem value="soil" className="cursor-pointer">Đường đất</SelectItem>
                  <SelectItem value="mixed" className="cursor-pointer">Hỗn hợp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Tình trạng</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="good" className="cursor-pointer">Tốt</SelectItem>
                  <SelectItem value="fair" className="cursor-pointer">Khá</SelectItem>
                  <SelectItem value="degraded" className="cursor-pointer">Xuống cấp</SelectItem>
                  <SelectItem value="dangerous" className="cursor-pointer">Nguy hiểm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Structures local filters */}
        {isStructures && (
          <>
            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Loại công trình</Label>
              <Select value={structureType} onValueChange={setStructureType}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="suspensionBridge" className="cursor-pointer">Cầu treo</SelectItem>
                  <SelectItem value="concreteBridge" className="cursor-pointer">Cầu bê tông</SelectItem>
                  <SelectItem value="culvert" className="cursor-pointer">Cống</SelectItem>
                  <SelectItem value="overflowSpillway" className="cursor-pointer">Ngầm tràn</SelectItem>
                  <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Tình trạng</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="good" className="cursor-pointer">Tốt</SelectItem>
                  <SelectItem value="fair" className="cursor-pointer">Trung bình</SelectItem>
                  <SelectItem value="degraded" className="cursor-pointer">Yếu / Xuống cấp</SelectItem>
                  <SelectItem value="dangerous" className="cursor-pointer">Nguy hiểm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Mức rủi ro</Label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="low" className="cursor-pointer">Thấp</SelectItem>
                  <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                  <SelectItem value="high" className="cursor-pointer">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Disruptions local filters */}
        {isDisruptions && (
          <>
            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Loại sự cố</Label>
              <Select value={incidentType} onValueChange={setIncidentType}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="landslide" className="cursor-pointer">Sạt lở đất</SelectItem>
                  <SelectItem value="flooding" className="cursor-pointer">Ngập lụt</SelectItem>
                  <SelectItem value="erosion" className="cursor-pointer">Xói lở nền</SelectItem>
                  <SelectItem value="bridgeDamage" className="cursor-pointer">Hư hỏng cầu</SelectItem>
                  <SelectItem value="roadDamage" className="cursor-pointer">Hư hỏng đường</SelectItem>
                  <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Mức độ</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="low" className="cursor-pointer">Thấp</SelectItem>
                  <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                  <SelectItem value="high" className="cursor-pointer">Cao</SelectItem>
                  <SelectItem value="critical" className="cursor-pointer">Nghiêm trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Trạng thái</Label>
              <Select value={disruptStatus} onValueChange={setDisruptStatus}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="open" className="cursor-pointer">Đang chia cắt</SelectItem>
                  <SelectItem value="monitoring" className="cursor-pointer">Đang theo dõi</SelectItem>
                  <SelectItem value="resolved" className="cursor-pointer">Đã thông tuyến</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Maintenance local filters */}
        {isMaintenance && (
          <>
            <div className="space-y-1 min-w-[120px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Tiến độ</Label>
              <Select value={maintenanceProgress} onValueChange={setMaintenanceProgress}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                  <SelectItem value="planned" className="cursor-pointer">Đã lập kế hoạch</SelectItem>
                  <SelectItem value="approved" className="cursor-pointer">Đã duyệt</SelectItem>
                  <SelectItem value="inProgress" className="cursor-pointer">Đang thực hiện</SelectItem>
                  <SelectItem value="completed" className="cursor-pointer">Đã hoàn thành</SelectItem>
                  <SelectItem value="delayed" className="cursor-pointer">Chậm tiến độ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 min-w-[130px]">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Nguồn kinh phí</Label>
              <Select value={fundingSource} onValueChange={setFundingSource}>
                <SelectTrigger className="h-9 text-xs bg-card border-border/80 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="all" className="cursor-pointer">Tất cả nguồn vốn</SelectItem>
                  <SelectItem value="communeBudget" className="cursor-pointer">Ngân sách xã</SelectItem>
                  <SelectItem value="districtBudget" className="cursor-pointer">Ngân sách huyện</SelectItem>
                  <SelectItem value="newRuralProgram" className="cursor-pointer">Chương trình NTM</SelectItem>
                  <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Reset Filter Button */}
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
