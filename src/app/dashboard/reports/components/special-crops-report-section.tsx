'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';
import { CropRecord } from '@/types/crop';
import { formatVND } from '../../components/dashboard-kpi-grid';
import { Sprout, BarChart, ShieldCheck } from 'lucide-react';

interface SpecialCropsReportSectionProps {
  cropsData: CropRecord[];
}

export function SpecialCropsReportSection({ cropsData }: SpecialCropsReportSectionProps) {
  // Aggregate stats specifically for Sam Ngoc Linh and Que Tra My
  const specialStats = React.useMemo(() => {
    const samList = cropsData.filter((c) => c.cropTypeCode === 'ca-phe-arabica');
    const queList = cropsData.filter((c) => c.cropTypeCode === 'chuoi-laobao');

    const compute = (list: CropRecord[]) => {
      const totalArea = list.reduce((sum, c) => sum + c.areaHa, 0);
      const totalOutput = list.reduce((sum, c) => sum + c.harvestOutputKg, 0);
      const totalRevenue = list.reduce((sum, c) => sum + (c.harvestOutputKg * c.salePrice), 0);
      
      const currentYear = 2026;
      const agesSum = list.reduce((sum, c) => sum + (currentYear - c.plantingYear), 0);
      const avgAge = list.length > 0 ? (agesSum / list.length).toFixed(1) : '0';

      const activeGac = Array.from(new Set(list.map((c) => c.growingAreaCode).filter(Boolean)));

      return {
        totalArea,
        totalOutput,
        totalRevenue,
        avgAge,
        gacCount: activeGac.length,
        gacCodes: activeGac,
        count: list.length,
      };
    };

    return {
      sam: compute(samList),
      que: compute(queList),
    };
  }, [cropsData]);

  return (
    <SectionCard
      title="Báo cáo chuyên đề cây trồng đặc sản đặc sắc"
      description="Giám sát quy mô vùng trồng cà phê Arabica và chuối Lao Bảo thương phẩm dưới tán rừng tự nhiên"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sam Ngoc Linh Card */}
        <div className="border border-border/80 rounded-xl p-4 bg-card relative overflow-hidden group">
          <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-emerald-500" />
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-500" />
                Cà phê Arabica
              </h4>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                Cây Quốc Bảo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Tổng diện tích</span>
                <span className="font-bold text-foreground text-sm">{specialStats.sam.totalArea.toFixed(2)} ha</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Sản lượng dự kiến</span>
                <span className="font-bold text-foreground text-sm">{specialStats.sam.totalOutput.toLocaleString('vi-VN')} kg</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Độ tuổi trung bình</span>
                <span className="font-bold text-foreground text-sm">{specialStats.sam.avgAge} năm tuổi</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Mã số vùng trồng (GAC)</span>
                <span className="font-bold text-foreground text-sm">{specialStats.sam.gacCount} vùng cấp</span>
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Giá trị doanh thu ước tính</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base font-sans">
                  {formatVND(specialStats.sam.totalRevenue, false)}
                </span>
              </div>
            </div>

            {/* GAC List */}
            <div className="bg-muted/15 border border-border/50 rounded-lg p-2.5 space-y-1.5">
              <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Mã vùng trồng đã cấp GCN vùng trồng quốc gia
              </span>
              <div className="flex flex-wrap gap-1">
                {specialStats.sam.gacCodes.length > 0 ? (
                  specialStats.sam.gacCodes.map((code, index) => (
                    <span key={index} className="text-[9px] font-mono bg-card px-1.5 py-0.5 rounded-sm border border-border/80 text-foreground font-bold">
                      {code}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-muted-foreground italic">Đang cập nhật hồ sơ mã vùng</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Que Tra My Card */}
        <div className="border border-border/80 rounded-xl p-4 bg-card relative overflow-hidden group">
          <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-amber-500" />
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-amber-500" />
                Chuối Lao Bảo
              </h4>
              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                Cao Tinh Dầu
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Tổng diện tích</span>
                <span className="font-bold text-foreground text-sm">{specialStats.que.totalArea.toFixed(2)} ha</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Sản lượng dự kiến</span>
                <span className="font-bold text-foreground text-sm">{specialStats.que.totalOutput.toLocaleString('vi-VN')} kg</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Độ tuổi trung bình</span>
                <span className="font-bold text-foreground text-sm">{specialStats.que.avgAge} năm tuổi</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Mã số vùng trồng (GAC)</span>
                <span className="font-bold text-foreground text-sm">{specialStats.que.gacCount} vùng cấp</span>
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-muted-foreground font-semibold text-[10px] uppercase block tracking-wider">Giá trị doanh thu ước tính</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 text-base font-sans">
                  {formatVND(specialStats.que.totalRevenue, false)}
                </span>
              </div>
            </div>

            {/* GAC List */}
            <div className="bg-muted/15 border border-border/50 rounded-lg p-2.5 space-y-1.5">
              <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-500" />
                Mã vùng trồng đã cấp GCN vùng trồng quốc gia
              </span>
              <div className="flex flex-wrap gap-1">
                {specialStats.que.gacCodes.length > 0 ? (
                  specialStats.que.gacCodes.map((code, index) => (
                    <span key={index} className="text-[9px] font-mono bg-card px-1.5 py-0.5 rounded-sm border border-border/80 text-foreground font-bold">
                      {code}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-muted-foreground italic">Đang cập nhật hồ sơ mã vùng</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
