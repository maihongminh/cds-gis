'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area } from '@/components/charts/area-chart';
import Grid from '@/components/charts/grid';
import XAxis from '@/components/charts/x-axis';
import ChartTooltip from '@/components/charts/tooltip/chart-tooltip';
import { TooltipContent } from '@/components/charts/tooltip/tooltip-content';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';

interface BudgetRevenueTimeSeriesChartProps {
  data: any[];
  status?: 'loading' | 'empty' | 'ready';
}

export function BudgetRevenueTimeSeriesChart({ data, status = 'ready' }: BudgetRevenueTimeSeriesChartProps) {
  const accessibilitySummary = 'Biểu đồ chuỗi thời gian thể hiện xu hướng thu ngân sách nhà nước theo các tháng trong năm.';

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Xu hướng thu ngân sách</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">Diễn biến số thu ngân sách nhà nước trên địa bàn qua các tháng</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'empty' || !data || data.length === 0 ? (
          <ChartEmptyState message="Chưa có dữ liệu xu hướng thu ngân sách." />
        ) : (
          <div className="h-[250px] mt-4 w-full">
            <AreaChart data={data as any} xDataKey="month" aspectRatio="auto">
              <Grid horizontal vertical={false} />
              <Area dataKey="revenue" fill="var(--chart-1)" stroke="var(--chart-1)" strokeWidth={2} />
              <XAxis />
              <ChartTooltip content={({ point }: { point: any }) => (
                <TooltipContent title={`Tháng: ${point.month}`} rows={[
                  { label: 'Thu ngân sách', value: `${point.revenue} Tỷ VNĐ`, color: 'var(--chart-1)' }
                ]} />
              )} />
            </AreaChart>
          </div>
        )}
        <ChartAccessibleSummary summary={accessibilitySummary} data={data} columns={[{ key: 'month', label: 'Thời gian' }, { key: 'revenue', label: 'Thu (Tỷ VNĐ)' }]} />
      </CardContent>
    </Card>
  );
}
