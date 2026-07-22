'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { Badge } from '@/components/ui/badge';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';

interface HeatmapCell {
  hamletCode: string;
  hamletName: string;
  floodRisk: 'low' | 'medium' | 'high' | 'critical';
  landslideRisk: 'low' | 'medium' | 'high' | 'critical';
  windRisk: 'low' | 'medium' | 'high' | 'critical';
  diseaseRisk: 'low' | 'medium' | 'high' | 'critical';
}

const riskLevels = {
  low: { label: 'Thấp', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15' },
  medium: { label: 'Trung bình', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15' },
  high: { label: 'Cao', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/15' },
  critical: { label: 'Rất cao', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15' },
};

// Seeded risk values for 12 hamlets for consistency
const heatmapData: HeatmapCell[] = VILLAGES.map((v, idx) => {
  // Simple seed calculation for deterministic data
  const seed = idx + 1;
  const floodRisk: 'low' | 'medium' | 'high' | 'critical' = 
    v.code === 'ka-tang' || v.code === 'lang-vay' ? 'critical' :
    seed % 4 === 0 ? 'high' : seed % 3 === 0 ? 'medium' : 'low';

  const landslideRisk: 'low' | 'medium' | 'high' | 'critical' = 
    v.code === 'ka-tang' ? 'critical' :
    v.code === 'trung-chin' || v.code === 'tay-chin' ? 'high' :
    seed % 5 === 0 ? 'medium' : 'low';

  const windRisk: 'low' | 'medium' | 'high' | 'critical' = 
    seed % 2 === 0 ? 'medium' : 'low';

  const diseaseRisk: 'low' | 'medium' | 'high' | 'critical' = 
    v.code === 'trieu-phuoc' ? 'high' : 'low';

  return {
    hamletCode: v.code,
    hamletName: v.name,
    floodRisk,
    landslideRisk,
    windRisk,
    diseaseRisk,
  };
});

export function VillageEmergencyRiskHeatmap() {
  const columns = [
    { key: 'hamletName', label: 'Thôn/Bản' },
    { key: 'floodRisk', label: 'Ngập lụt', format: (val: any) => riskLevels[val as keyof typeof riskLevels].label },
    { key: 'landslideRisk', label: 'Sạt lở', format: (val: any) => riskLevels[val as keyof typeof riskLevels].label },
    { key: 'windRisk', label: 'Lốc xoáy', format: (val: any) => riskLevels[val as keyof typeof riskLevels].label },
    { key: 'diseaseRisk', label: 'Dịch bệnh', format: (val: any) => riskLevels[val as keyof typeof riskLevels].label },
  ];

  const accessibilitySummary = `Bảng ma trận phân tích rủi ro thiên tai và dịch bệnh tại 12 thôn bản. Thôn Ka Tăng có mức độ cảnh báo lũ quét sạt lở rất cao. Các thôn còn lại ở mức trung bình và thấp.`;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Ma trận Cảnh báo Rủi ro theo Thôn</span>
          <div className="flex gap-1.5 text-[8px] font-bold max-sm:hidden">
            <span className="px-1 py-0.5 rounded-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/15">Thấp</span>
            <span className="px-1 py-0.5 rounded-xs bg-amber-500/10 text-amber-600 border border-amber-500/15">T.Bình</span>
            <span className="px-1 py-0.5 rounded-xs bg-orange-500/10 text-orange-600 border border-orange-500/15">Cao</span>
            <span className="px-1 py-0.5 rounded-xs bg-rose-500/10 text-rose-600 border border-rose-500/15">R.Cao</span>
          </div>
        </CardTitle>
        <CardDescription className="text-xs">
          Phân tích mức độ đe dọa các loại hình thiên tai, sự cố tại 12 thôn bản xã Lao Bảo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <div className="min-w-[450px]">
            {/* Header row */}
            <div className="grid grid-cols-5 text-center text-[10px] font-bold text-muted-foreground border-b border-border/40 pb-2 mb-2">
              <div className="text-left pl-2">Thôn / Bản</div>
              <div>Ngập lụt</div>
              <div>Sạt lở đất</div>
              <div>Gió lốc</div>
              <div>Dịch bệnh</div>
            </div>

            {/* Heatmap Grid */}
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {heatmapData.map((row) => (
                <div key={row.hamletCode} className="grid grid-cols-5 items-center text-xs text-center hover:bg-muted/10 py-1 rounded-md transition-colors">
                  <div className="text-left font-semibold text-foreground pl-2">{row.hamletName}</div>
                  <div className="px-1">
                    <span className={`inline-block w-full py-0.5 rounded-xs border text-[10px] font-semibold ${riskLevels[row.floodRisk].bg}`}>
                      {riskLevels[row.floodRisk].label}
                    </span>
                  </div>
                  <div className="px-1">
                    <span className={`inline-block w-full py-0.5 rounded-xs border text-[10px] font-semibold ${riskLevels[row.landslideRisk].bg}`}>
                      {riskLevels[row.landslideRisk].label}
                    </span>
                  </div>
                  <div className="px-1">
                    <span className={`inline-block w-full py-0.5 rounded-xs border text-[10px] font-semibold ${riskLevels[row.windRisk].bg}`}>
                      {riskLevels[row.windRisk].label}
                    </span>
                  </div>
                  <div className="px-1">
                    <span className={`inline-block w-full py-0.5 rounded-xs border text-[10px] font-semibold ${riskLevels[row.diseaseRisk].bg}`}>
                      {riskLevels[row.diseaseRisk].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ChartAccessibleSummary
          summary={accessibilitySummary}
          data={heatmapData as any}
          columns={columns}
        />
      </CardContent>
    </Card>
  );
}
