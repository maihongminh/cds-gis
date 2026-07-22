'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';

// 1. Data Model
export type SocioEconomicDomain =
  | 'economyBudget'
  | 'investmentConstruction'
  | 'commerceTourism'
  | 'agricultureEnvironment'
  | 'educationHealth'
  | 'socialWelfare'
  | 'infrastructureQualityOfLife'
  | 'digitalGovernment';

export interface SocioEconomicTargetProgress {
  id: string;
  domain: SocioEconomicDomain;
  domainLabel: string;
  quarter: 1 | 2 | 3 | 4;
  year: number;
  plannedValue: number;
  actualValue: number;
  achievementRate: number;
  indicatorCount: number;
  achievedIndicatorCount: number;
  warningIndicatorCount: number;
  updatedAt: string;
  isDemo: true;
}

// 2. Mock Data Generator (8 Domains * 4 Quarters)
const domains: { id: SocioEconomicDomain; label: string }[] = [
  { id: 'economyBudget', label: 'Kinh tế & Ngân sách' },
  { id: 'investmentConstruction', label: 'Đầu tư & Xây dựng' },
  { id: 'commerceTourism', label: 'TM, DV & Du lịch' },
  { id: 'agricultureEnvironment', label: 'Nông nghiệp & MT' },
  { id: 'educationHealth', label: 'Giáo dục & Y tế' },
  { id: 'socialWelfare', label: 'An sinh & Giảm nghèo' },
  { id: 'infrastructureQualityOfLife', label: 'Hạ tầng & Đời sống' },
  { id: 'digitalGovernment', label: 'CĐS & CCHC' },
];

const mockHeatmapData: SocioEconomicTargetProgress[] = [];
domains.forEach((domain, dIdx) => {
  for (let q = 1; q <= 4; q++) {
    // Generate deterministic pseudo-random rates leaning higher in later quarters
    const baseRate = 65 + (dIdx * 3) + (q * 8); 
    const randomJitter = (dIdx * q * 13) % 15 - 5;
    let rate = baseRate + randomJitter;
    if (rate > 110) rate = 110;
    if (rate < 60) rate = 60;
    
    mockHeatmapData.push({
      id: `${domain.id}-q${q}`,
      domain: domain.id,
      domainLabel: domain.label,
      quarter: q as 1|2|3|4,
      year: 2026,
      plannedValue: 100,
      actualValue: rate,
      achievementRate: Math.round(rate * 10) / 10,
      indicatorCount: 5,
      achievedIndicatorCount: Math.floor((rate / 100) * 5),
      warningIndicatorCount: 5 - Math.floor((rate / 100) * 5),
      updatedAt: '2026-07-14T10:00:00Z',
      isDemo: true
    });
  }
});

// 3. Helpers
function getRateColorClass(rate: number) {
  if (rate >= 100) return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
  if (rate >= 90) return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30';
  if (rate >= 75) return 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30';
  return 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/30';
}

function getRateLabel(rate: number) {
  if (rate >= 100) return 'Đạt/Vượt';
  if (rate >= 90) return 'Gần đạt';
  if (rate >= 75) return 'Cần theo dõi';
  return 'Chậm tiến độ';
}

interface SocioEconomicTargetHeatmapProps {
  status?: 'loading' | 'empty' | 'ready';
}

export function SocioEconomicTargetHeatmap({ status = 'ready' }: SocioEconomicTargetHeatmapProps) {
  const accessibilitySummary = 'Ma trận mức độ hoàn thành chỉ tiêu theo lĩnh vực qua 4 quý.';
  
  // Pivot data for table rendering
  const pivotedData = domains.map(d => {
    const rowData: any = { domainLabel: d.label };
    for (let q = 1; q <= 4; q++) {
      const cell = mockHeatmapData.find(m => m.domain === d.id && m.quarter === q);
      rowData[`q${q}`] = cell?.achievementRate || 0;
    }
    return rowData;
  });

  const columns = [
    { key: 'domainLabel', label: 'Lĩnh vực' },
    { key: 'q1', label: 'Quý I', format: (val: any) => `${val}%` },
    { key: 'q2', label: 'Quý II', format: (val: any) => `${val}%` },
    { key: 'q3', label: 'Quý III', format: (val: any) => `${val}%` },
    { key: 'q4', label: 'Quý IV', format: (val: any) => `${val}%` },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs lg:col-span-3 xl:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Tiến độ thực hiện kế hoạch KT-XH</span>
          <Badge variant="outline" className="text-[9px] bg-muted/50">Dữ liệu kế hoạch mô phỏng</Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Mức độ hoàn thành các nhóm chỉ tiêu phát triển kinh tế - xã hội theo từng quý trong năm demo.
        </CardDescription>
        <div className="flex gap-2 pt-2 text-[10px] font-medium max-sm:hidden">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/40 border border-emerald-500" /> &ge;100%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-blue-500/40 border border-blue-500" /> 90-99%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-amber-500/40 border border-amber-500" /> 75-89%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-rose-500/40 border border-rose-500" /> &lt;75%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Header row */}
            <div className="grid grid-cols-5 text-center text-xs font-bold text-muted-foreground border-b border-border/40 pb-2 mb-2">
              <div className="text-left pl-2">Lĩnh vực</div>
              <div>Quý I</div>
              <div>Quý II</div>
              <div>Quý III</div>
              <div>Quý IV</div>
            </div>

            {/* Heatmap Grid */}
            <div className="space-y-1.5">
              {pivotedData.map((row) => (
                <div key={row.domainLabel} className="grid grid-cols-5 items-center text-xs text-center hover:bg-muted/30 py-1.5 rounded-md transition-colors">
                  <div className="text-left font-semibold text-foreground pl-2 truncate" title={row.domainLabel}>{row.domainLabel}</div>
                  {[1, 2, 3, 4].map(q => {
                    const val = row[`q${q}`];
                    return (
                      <div key={q} className="px-1 relative group cursor-pointer">
                        <div className={`w-full py-1.5 rounded-sm border font-bold ${getRateColorClass(val)} transition-all group-hover:brightness-110`}>
                          {val}%
                        </div>
                        {/* Tooltip implementation using native title or custom floating (simplified here as title for fallback, but styled with group-hover below) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 w-48 p-2 bg-popover text-popover-foreground border border-border shadow-md rounded-md text-left text-[10px] pointer-events-none">
                          <p className="font-bold border-b border-border/40 pb-1 mb-1">{row.domainLabel} - Quý {q}</p>
                          <p className="flex justify-between"><span>Hoàn thành:</span> <span className="font-bold">{val}%</span></p>
                          <p className="flex justify-between text-muted-foreground"><span>Trạng thái:</span> <span>{getRateLabel(val)}</span></p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ChartAccessibleSummary
          summary={accessibilitySummary}
          data={pivotedData}
          columns={columns}
        />
      </CardContent>
    </Card>
  );
}
