'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RingChart from '@/components/charts/ring-chart';
import Ring from '@/components/charts/ring';
import RingCenter from '@/components/charts/ring-center';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';

interface EconomicStructureDonutChartProps {
  status?: 'loading' | 'empty' | 'ready';
}

export function EconomicStructureDonutChart({ status = 'ready' }: EconomicStructureDonutChartProps) {
  const totalGrdp = 785;
  const data = [
    { label: 'Thương mại & Dịch vụ', value: 45 },
    { label: 'Công nghiệp & Xây dựng', value: 35 },
    { label: 'Nông, lâm & thủy sản', value: 20 },
  ];
  const ringColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];

  const accessibilitySummary = `Biểu đồ cơ cấu kinh tế. Tổng giá trị sản xuất đạt ${totalGrdp.toLocaleString()} tỷ đồng.`;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Cơ cấu các ngành kinh tế</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">
          Tỷ trọng đóng góp của các lĩnh vực vào kinh tế xã
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'empty' ? (
          <ChartEmptyState message="Chưa có dữ liệu cơ cấu kinh tế." />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex justify-center h-[180px]">
                <RingChart data={data.map((d) => ({ ...d, maxValue: 100 }))} size={180} strokeWidth={15} ringGap={4} baseInnerRadius={45}>
                  {data.map((_, idx) => (
                    <Ring key={idx} index={idx} color={ringColors[idx % ringColors.length]} />
                  ))}
                  <RingCenter defaultLabel={`${totalGrdp} tỷ`} />
                </RingChart>
              </div>
              <div className="space-y-2 text-xs">
                {data.map((item, idx) => (
                  <div key={item.label} className="flex justify-between border-b border-border/40 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: ringColors[idx % ringColors.length] }} />
                      <span className="truncate max-w-[130px] font-semibold text-foreground">{item.label}</span>
                    </div>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <ChartAccessibleSummary summary={accessibilitySummary} data={data} columns={[{ key: 'label', label: 'Lĩnh vực' }, { key: 'value', label: 'Tỷ trọng (%)' }]} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
