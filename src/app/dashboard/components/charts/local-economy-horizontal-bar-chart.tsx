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

interface LocalEconomyHorizontalBarChartProps {
  status?: 'loading' | 'empty' | 'ready';
}

export function LocalEconomyHorizontalBarChart({ status = 'ready' }: LocalEconomyHorizontalBarChartProps) {
  const economyData = [
    { category: 'Hộ kinh doanh', count: 420 },
    { category: 'Doanh nghiệp', count: 86 },
    { category: 'Tổ hợp tác', count: 24 },
    { category: 'Hợp tác xã', count: 12 },
    { category: 'Cơ sở lưu trú', count: 8 },
    { category: 'Điểm logistics', count: 3 },
  ];

  const accessibilitySummary = 'Biểu đồ thanh ngang thể hiện số lượng cơ sở kinh tế.';

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Quy mô kinh tế địa phương</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">Số lượng cơ sở, đơn vị kinh tế đang hoạt động</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'empty' ? (
          <ChartEmptyState message="Chưa có dữ liệu cơ sở kinh tế." />
        ) : (
          <div className="h-[280px] mt-4 w-full">
            <BarChart data={economyData as any} xDataKey="category" orientation="horizontal" aspectRatio="auto">
              <Grid horizontal={false} vertical />
              <Bar dataKey="count" fill="var(--chart-4)" />
              <XAxis />
              <ChartTooltip content={({ point }: { point: any }) => (
                <TooltipContent title={point.category} rows={[
                  { label: 'Số lượng', value: point.count, color: 'var(--chart-4)' }
                ]} />
              )} />
            </BarChart>
          </div>
        )}
        <ChartAccessibleSummary summary={accessibilitySummary} data={economyData} columns={[{ key: 'category', label: 'Loại hình' }, { key: 'count', label: 'Số lượng' }]} />
      </CardContent>
    </Card>
  );
}
