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

interface AssignedTaskTimeSeriesChartProps {
  data?: any[];
  status?: 'loading' | 'empty' | 'ready';
}

export function AssignedTaskTimeSeriesChart({ data, status = 'ready' }: AssignedTaskTimeSeriesChartProps) {
  const accessibilitySummary = 'Biểu đồ thể hiện xu hướng nhận và xử lý nhiệm vụ qua các tháng.';
  const chartData = data || [
    { month: 'Tháng 1', assigned: 12, completed: 10, overdue: 0 },
    { month: 'Tháng 2', assigned: 15, completed: 14, overdue: 1 },
    { month: 'Tháng 3', assigned: 20, completed: 18, overdue: 1 },
    { month: 'Tháng 4', assigned: 18, completed: 16, overdue: 2 },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Xu hướng xử lý nhiệm vụ</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">Số lượng nhiệm vụ được giao, hoàn thành và trễ hạn theo tháng</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'empty' ? (
          <ChartEmptyState message="Chưa có dữ liệu xu hướng nhiệm vụ." />
        ) : (
          <div className="h-[250px] mt-4 w-full">
            <AreaChart data={chartData as any} xDataKey="month" aspectRatio="auto">
              <Grid horizontal vertical={false} />
              <Area dataKey="assigned" fill="var(--chart-1)" stroke="var(--chart-1)" strokeWidth={2} />
              <Area dataKey="completed" fill="var(--emerald-500)" stroke="var(--emerald-500)" strokeWidth={2} />
              <Area dataKey="overdue" fill="var(--rose-500)" stroke="var(--rose-500)" strokeWidth={2} />
              <XAxis />
              <ChartTooltip content={({ point }: { point: any }) => (
                <TooltipContent title={`Thời gian: ${point.month}`} rows={[
                  { label: 'Giao mới', value: point.assigned, color: 'var(--chart-1)' },
                  { label: 'Hoàn thành', value: point.completed, color: 'var(--emerald-500)' },
                  { label: 'Trễ hạn', value: point.overdue, color: 'var(--rose-500)' }
                ]} />
              )} />
            </AreaChart>
          </div>
        )}
        <ChartAccessibleSummary summary={accessibilitySummary} data={chartData} columns={[{ key: 'month', label: 'Tháng' }]} />
      </CardContent>
    </Card>
  );
}
