'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';

// 1. Data Model
export interface OrganizationTaskMonthlyStatus {
  id: string;
  organizationUnitId: string;
  organizationUnitName: string;
  month: number;
  year: number;
  assignedTaskCount: number;
  completedTaskCount: number;
  inProgressTaskCount: number;
  overdueTaskCount: number;
  overdueRate: number;
  averageDelayDays: number;
  updatedAt: string;
  isDemo: true;
}

// 2. Mock Data Generator (6 Units * 12 Months)
const units = [
  { id: 'vp-ubnd', name: 'VP HĐND & UBND' },
  { id: 'phong-kt', name: 'Bộ phận Kinh tế' },
  { id: 'phong-vhxh', name: 'Bộ phận VH-XH' },
  { id: 'cong-an', name: 'Công an xã' },
  { id: 'quan-su', name: 'BCH Quân sự xã' },
  { id: 'dich-vu', name: 'TT Dịch vụ tổng hợp' },
];

const mockTaskData: OrganizationTaskMonthlyStatus[] = [];
units.forEach((unit, uIdx) => {
  for (let m = 1; m <= 12; m++) {
    // Generate deterministic pseudo-random tasks
    const baseAssigned = 10 + (uIdx * 2) + Math.floor(Math.abs(Math.sin(m) * 15));
    // Overdue is higher in middle months, and varies by unit
    const baseOverdue = Math.floor(Math.abs(Math.cos(m + uIdx) * 5));
    // Ensure logical bounds
    const assigned = baseAssigned;
    const overdue = Math.min(baseOverdue, assigned);
    const completed = Math.max(0, assigned - overdue - Math.floor(assigned * 0.1));
    const inProgress = assigned - completed - overdue;
    
    mockTaskData.push({
      id: `${unit.id}-m${m}`,
      organizationUnitId: unit.id,
      organizationUnitName: unit.name,
      month: m,
      year: 2026,
      assignedTaskCount: assigned,
      completedTaskCount: completed,
      inProgressTaskCount: inProgress,
      overdueTaskCount: overdue,
      overdueRate: assigned === 0 ? 0 : Math.round((overdue / assigned) * 100),
      averageDelayDays: overdue > 0 ? Math.floor(Math.random() * 15) + 1 : 0,
      updatedAt: '2026-07-14T10:00:00Z',
      isDemo: true
    });
  }
});

// 3. Helpers
function getOverdueColorClass(overdueCount: number) {
  if (overdueCount === 0) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (overdueCount <= 2) return 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30';
  if (overdueCount <= 4) return 'bg-orange-500/30 text-orange-800 dark:text-orange-400 border-orange-500/40';
  if (overdueCount <= 7) return 'bg-rose-500/40 text-rose-900 dark:text-rose-300 border-rose-500/50';
  return 'bg-red-600/60 text-white border-red-700/50'; // Critical
}

interface TaskOverdueHeatmapProps {
  status?: 'loading' | 'empty' | 'ready';
}

export function TaskOverdueHeatmap({ status = 'ready' }: TaskOverdueHeatmapProps) {
  const accessibilitySummary = 'Ma trận theo dõi số lượng nhiệm vụ quá hạn theo đơn vị phụ trách trong 12 tháng.';
  
  // Pivot data
  const pivotedData = units.map(u => {
    const rowData: any = { unitName: u.name };
    for (let m = 1; m <= 12; m++) {
      const cell = mockTaskData.find(d => d.organizationUnitId === u.id && d.month === m);
      rowData[`m${m}`] = cell?.overdueTaskCount || 0;
      rowData[`full_m${m}`] = cell;
    }
    return rowData;
  });

  const columns = [
    { key: 'unitName', label: 'Đơn vị' },
    ...Array.from({length: 12}).map((_, i) => ({ key: `m${i+1}`, label: `T${i+1}` }))
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs lg:col-span-3 xl:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Mật độ nhiệm vụ quá hạn</span>
          <Badge variant="outline" className="text-[9px] bg-muted/50">Dữ liệu nhiệm vụ mô phỏng</Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Theo dõi số lượng nhiệm vụ quá hạn theo đơn vị phụ trách và từng tháng trong năm demo.
        </CardDescription>
        <div className="flex gap-2 pt-2 text-[10px] font-medium max-sm:hidden">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/20 border border-emerald-500/30" /> 0 (Tốt)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-amber-500/30 border border-amber-500/40" /> 1-2</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-orange-500/40 border border-orange-500/50" /> 3-4</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-rose-500/50 border border-rose-500/60" /> 5-7</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-red-600/70 border border-red-700" /> &ge;8 (Nghiêm trọng)</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px]">
            {/* Header row */}
            <div className="grid grid-cols-[1.5fr_repeat(12,1fr)] text-center text-xs font-bold text-muted-foreground border-b border-border/40 pb-2 mb-2">
              <div className="text-left pl-2">Đơn vị</div>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <div key={m}>T{m}</div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="space-y-1.5">
              {pivotedData.map((row) => (
                <div key={row.unitName} className="grid grid-cols-[1.5fr_repeat(12,1fr)] items-center text-xs text-center hover:bg-muted/30 py-1.5 rounded-md transition-colors gap-0.5">
                  <div className="text-left font-semibold text-foreground pl-2 truncate pr-2" title={row.unitName}>{row.unitName}</div>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                    const val = row[`m${m}`];
                    const fullData = row[`full_m${m}`] as OrganizationTaskMonthlyStatus;
                    return (
                      <div key={m} className="px-0.5 relative group cursor-pointer">
                        <div className={`w-full py-1.5 rounded-sm border font-bold ${getOverdueColorClass(val)} transition-all group-hover:brightness-110`}>
                          {val > 0 ? val : '-'}
                        </div>
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 w-48 p-2 bg-popover text-popover-foreground border border-border shadow-md rounded-md text-left text-[10px] pointer-events-none">
                          <p className="font-bold border-b border-border/40 pb-1 mb-1">{row.unitName} - Tháng {m}</p>
                          <p className="flex justify-between"><span>Tổng nhiệm vụ:</span> <span className="font-semibold">{fullData.assignedTaskCount}</span></p>
                          <p className="flex justify-between"><span>Đã hoàn thành:</span> <span className="font-semibold text-emerald-500">{fullData.completedTaskCount}</span></p>
                          <p className="flex justify-between"><span>Đang thực hiện:</span> <span className="font-semibold text-blue-500">{fullData.inProgressTaskCount}</span></p>
                          <p className="flex justify-between mt-1 pt-1 border-t border-border/40"><span>Quá hạn:</span> <span className="font-bold text-rose-500">{val} ({fullData.overdueRate}%)</span></p>
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
