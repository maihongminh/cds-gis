'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { CropRecord } from '@/types/crop';
import { formatVND } from '../../components/dashboard-kpi-grid';

interface AgricultureReportSectionProps {
  cropsData: CropRecord[];
}

export function AgricultureReportSection({ cropsData }: AgricultureReportSectionProps) {
  // Aggregate crops data by cropTypeCode and seasonYear
  const aggregatedData = React.useMemo(() => {
    const map = new Map<string, {
      cropTypeName: string;
      seasonYear: string;
      areaHa: number;
      harvestOutputKg: number;
      revenue: number;
      count: number;
    }>();

    cropsData.forEach((c) => {
      const key = `${c.cropTypeCode}-${c.seasonYear}`;
      const existing = map.get(key);
      const rev = c.harvestOutputKg * c.salePrice;
      
      if (existing) {
        existing.areaHa += c.areaHa;
        existing.harvestOutputKg += c.harvestOutputKg;
        existing.revenue += rev;
        existing.count += 1;
      } else {
        map.set(key, {
          cropTypeName: c.cropTypeName,
          seasonYear: c.seasonYear,
          areaHa: c.areaHa,
          harvestOutputKg: c.harvestOutputKg,
          revenue: rev,
          count: 1,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [cropsData]);

  const formatSeason = (val: string) => {
    if (val === '2026-XH') return 'Xuân Hè 2026';
    if (val === '2026-DH') return 'Đông Xuân 2026';
    if (val === '2025-XH') return 'Xuân Hè 2025';
    if (val === '2025-DH') return 'Đông Xuân 2025';
    return val;
  };

  return (
    <SectionCard
      title="Báo cáo sản xuất nông nghiệp theo vụ/năm"
      description="Tổng hợp cơ cấu diện tích canh tác, sản lượng thu hoạch thực tế và ước tính doanh thu theo từng mùa vụ"
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-muted-foreground">Loại cây trồng</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Mùa vụ canh tác</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right">Số lượt canh tác</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right">Tổng diện tích</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right">Tổng sản lượng</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right">Ước tính doanh thu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggregatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                    Không tìm thấy dữ liệu gieo trồng nào cho bộ lọc hiện tại.
                  </TableCell>
                </TableRow>
              ) : (
                aggregatedData.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40">
                    <TableCell className="font-bold text-foreground">{row.cropTypeName}</TableCell>
                    <TableCell className="font-semibold text-muted-foreground">{formatSeason(row.seasonYear)}</TableCell>
                    <TableCell className="text-right font-medium">{row.count} hộ</TableCell>
                    <TableCell className="text-right font-bold">{row.areaHa.toFixed(2)} ha</TableCell>
                    <TableCell className="text-right font-semibold">{row.harvestOutputKg.toLocaleString('vi-VN')} kg</TableCell>
                    <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                      {formatVND(row.revenue, false)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </SectionCard>
  );
}
