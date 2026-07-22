'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/charts/bar-chart';
import { Bar } from '@/components/charts/bar';
import Grid from '@/components/charts/grid';
import XAxis from '@/components/charts/x-axis';
import ChartTooltip from '@/components/charts/tooltip/chart-tooltip';
import { TooltipContent } from '@/components/charts/tooltip/tooltip-content';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';

interface BudgetCompositionStackedBarChartProps {
  status?: 'loading' | 'empty' | 'ready';
}

export function BudgetCompositionStackedBarChart({ status = 'ready' }: BudgetCompositionStackedBarChartProps) {
  const budgetData = [
    { period: 'Quý 1', tax: 2.5, land: 1.2, activity: 0.8, subsidy: 3.0 },
    { period: 'Quý 2', tax: 3.1, land: 1.5, activity: 0.9, subsidy: 3.0 },
    { period: 'Quý 3', tax: 2.8, land: 2.0, activity: 1.1, subsidy: 3.5 },
    { period: 'Quý 4', tax: 3.5, land: 2.5, activity: 1.4, subsidy: 4.0 },
  ];

  const accessibilitySummary = 'Biểu đồ cột chồng thể hiện cơ cấu nguồn thu ngân sách qua các quý.';

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Cơ cấu nguồn thu ngân sách</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">Phân bổ chi tiết các nguồn thu ngân sách nhà nước theo quý</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'empty' ? (
          <ChartEmptyState message="Chưa có dữ liệu cơ cấu ngân sách." />
        ) : (
          <div className="h-[280px] mt-4 w-full">
            <BarChart data={budgetData as any} xDataKey="period" stacked={true} aspectRatio="auto">
              <Grid horizontal vertical={false} />
              <Bar dataKey="tax" fill="var(--chart-1)" />
              <Bar dataKey="land" fill="var(--chart-2)" />
              <Bar dataKey="activity" fill="var(--chart-3)" />
              <Bar dataKey="subsidy" fill="var(--chart-4)" />
              <XAxis />
              <ChartTooltip content={({ point }: { point: any }) => (
                <TooltipContent title={`Kỳ báo cáo: ${point.period}`} rows={[
                  { label: 'Thuế/Phí', value: `${point.tax} Tỷ VNĐ`, color: 'var(--chart-1)' },
                  { label: 'Thu từ đất', value: `${point.land} Tỷ VNĐ`, color: 'var(--chart-2)' },
                  { label: 'Hoạt động kinh tế', value: `${point.activity} Tỷ VNĐ`, color: 'var(--chart-3)' },
                  { label: 'Bổ sung', value: `${point.subsidy} Tỷ VNĐ`, color: 'var(--chart-4)' }
                ]} />
              )} />
            </BarChart>
          </div>
        )}
        <ChartAccessibleSummary summary={accessibilitySummary} data={budgetData} columns={[{ key: 'period', label: 'Kỳ' }]} />
      </CardContent>
    </Card>
  );
}
