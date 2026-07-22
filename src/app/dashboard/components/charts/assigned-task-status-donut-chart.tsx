'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RingChart from '@/components/charts/ring-chart';
import Ring from '@/components/charts/ring';
import RingCenter from '@/components/charts/ring-center';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';

interface AssignedTaskStatusDonutChartProps {
  data?: any[];
  status?: 'loading' | 'empty' | 'ready';
}

export function AssignedTaskStatusDonutChart({ status = 'ready' }: AssignedTaskStatusDonutChartProps) {
  const data = [
    { label: 'Hoàn thành đúng hạn', value: 105 },
    { label: 'Đang xử lý trong hạn', value: 12 },
    { label: 'Quá hạn chưa xong', value: 3 },
  ];
  const ringColors = ['#10b981', '#3b82f6', '#ef4444'];

  const accessibilitySummary = `Biểu đồ thể hiện tỷ lệ xử lý nhiệm vụ được giao.`;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Trạng thái xử lý nhiệm vụ</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">
          Tình hình thực hiện nhiệm vụ được UBND Tỉnh/Huyện giao
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'empty' ? (
          <ChartEmptyState message="Chưa có nhiệm vụ nào trong kỳ." />
        ) : (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex justify-center h-[180px] relative">
                <RingChart data={data.map(d => ({ ...d, maxValue: 120 }))} size={180} strokeWidth={15} ringGap={4} baseInnerRadius={45}>
                  {data.map((_, idx) => (
                    <Ring key={idx} index={idx} color={ringColors[idx]} />
                  ))}
                  <RingCenter defaultLabel="120" />
                </RingChart>
              </div>
              <div className="space-y-2 text-xs">
                {data.map((item, idx) => (
                  <div key={item.label} className="flex justify-between border-b border-border/40 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: ringColors[idx] }} />
                      <span className="font-semibold text-foreground">{item.label}</span>
                    </div>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <ChartAccessibleSummary summary={accessibilitySummary} data={data} columns={[{ key: 'label', label: 'Trạng thái' }, { key: 'value', label: 'Số lượng' }]} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
