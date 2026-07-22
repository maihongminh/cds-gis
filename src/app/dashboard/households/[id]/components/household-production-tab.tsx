import * as React from 'react';
import { SectionCard } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { MOCK_CROPS } from '@/data/mock-crops';
import { MOCK_LIVESTOCK } from '@/data/mock-livestock';
import { formatVND } from '../../../components/dashboard-kpi-grid';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

interface HouseholdProductionTabProps {
  householdId: string;
}

export function HouseholdProductionTab({ householdId }: HouseholdProductionTabProps) {
  // Filter records belonging to the household
  const crops = React.useMemo(() => {
    return MOCK_CROPS.filter((c) => c.householdId === householdId && c.status === 'active');
  }, [householdId]);

  const livestock = React.useMemo(() => {
    return MOCK_LIVESTOCK.filter((l) => l.householdId === householdId && l.status === 'active');
  }, [householdId]);

  const formatSeason = (val: string) => {
    if (val === '2026-XH') return 'Xuân Hè 2026';
    if (val === '2026-DH') return 'Đông Xuân 2026';
    if (val === '2025-XH') return 'Xuân Hè 2025';
    if (val === '2025-DH') return 'Đông Xuân 2025';
    return val;
  };

  return (
    <div className="space-y-6">
      {/* 1. Crops Cultivation Log */}
      <SectionCard title="Nhật ký sản xuất Trồng trọt">
        {crops.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-xs">
            Hộ dân hiện chưa có khai báo thông tin trồng trọt.
          </div>
        ) : (
          <Table size="sm">
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
                <TableHead className="pb-2 text-xs">Loại cây trồng</TableHead>
                <TableHead className="pb-2 text-right text-xs">Diện tích</TableHead>
                <TableHead className="pb-2 text-center text-xs">Năm trồng</TableHead>
                <TableHead className="pb-2 text-xs">Mùa vụ</TableHead>
                <TableHead className="pb-2 text-right text-xs">Sản lượng</TableHead>
                <TableHead className="pb-2 text-right text-xs">Doanh thu</TableHead>
                <TableHead className="pb-2 text-center text-xs">Dịch bệnh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/40 font-medium">
              {crops.map((crop) => (
                <TableRow key={crop.id} className="hover:bg-muted/30 transition-colors h-10">
                  <TableCell className="font-semibold text-foreground text-xs">{crop.cropTypeName}</TableCell>
                  <TableCell className="text-right text-foreground text-xs">{crop.areaHa} ha</TableCell>
                  <TableCell className="text-center text-muted-foreground text-xs">{crop.plantingYear}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatSeason(crop.seasonYear)}</TableCell>
                  <TableCell className="text-right text-foreground text-xs">
                    {crop.harvestOutputKg.toLocaleString()} kg
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground text-xs">
                    {formatVND(crop.harvestOutputKg * crop.salePrice, true)}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <StatusBadge status={crop.diseaseStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      {/* 2. Livestock Log */}
      <SectionCard title="Nhật ký quy mô Chăn nuôi">
        {livestock.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-xs">
            Hộ dân hiện chưa có khai báo thông tin chăn nuôi.
          </div>
        ) : (
          <Table size="sm">
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
                <TableHead className="pb-2 text-xs">Loại gia súc/gia cầm</TableHead>
                <TableHead className="pb-2 text-center text-xs">Số lượng</TableHead>
                <TableHead className="pb-2 text-center text-xs">Đã tiêm phòng</TableHead>
                <TableHead className="pb-2 text-xs">Ngày tiêm gần nhất</TableHead>
                <TableHead className="pb-2 text-center text-xs">Tình hình dịch bệnh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/40 font-medium">
              {livestock.map((live) => (
                <TableRow key={live.id} className="hover:bg-muted/30 transition-colors h-10">
                  <TableCell className="font-semibold text-foreground text-xs">{live.livestockTypeName}</TableCell>
                  <TableCell className="text-center text-foreground font-bold text-xs">{live.quantity} con</TableCell>
                  <TableCell className="text-center text-muted-foreground text-xs">
                    {live.vaccinatedQuantity} / {live.quantity} con
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{live.lastVaccinatedDate || 'Chưa tiêm phòng'}</TableCell>
                  <TableCell className="text-center text-xs">
                    <StatusBadge status={live.diseaseStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
