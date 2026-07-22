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

interface LivestockPopulationTimeSeriesChartProps {
  status?: 'loading' | 'empty' | 'ready';
}

export function LivestockPopulationTimeSeriesChart({ status = 'ready' }: LivestockPopulationTimeSeriesChartProps) {
  const data = [
    { period: 'Quý 1', cow: 1250, buffalo: 850, pig: 4200, poultry: 15000 },
    { period: 'Quý 2', cow: 1300, buffalo: 860, pig: 4500, poultry: 18000 },
    { period: 'Quý 3', cow: 1450, buffalo: 880, pig: 4800, poultry: 16500 },
    { period: 'Quý 4', cow: 1520, buffalo: 900, pig: 5100, poultry: 22000 },
  ];

  const accessibilitySummary = 'Biểu đồ thể hiện xu hướng phát triển đàn vật nuôi qua các quý.';

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Xu hướng phát triển vật nuôi</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">Diễn biến số lượng tổng đàn gia súc, gia cầm</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'empty' ? (
          <ChartEmptyState message="Chưa có dữ liệu vật nuôi." />
        ) : (
          <div className="h-[250px] mt-4 w-full">
            <AreaChart data={data as any} xDataKey="period" aspectRatio="auto">
              <Grid horizontal vertical={false} />
              <Area dataKey="cow" fill="var(--chart-1)" stroke="var(--chart-1)" strokeWidth={2} />
              <Area dataKey="buffalo" fill="var(--chart-2)" stroke="var(--chart-2)" strokeWidth={2} />
              <Area dataKey="pig" fill="var(--chart-3)" stroke="var(--chart-3)" strokeWidth={2} />
              <Area dataKey="poultry" fill="var(--chart-4)" stroke="var(--chart-4)" strokeWidth={2} />
              <XAxis />
              <ChartTooltip content={({ point }: { point: any }) => (
                <TooltipContent title={`Thời gian: ${point.period}`} rows={[
                  { label: 'Bò', value: point.cow, color: 'var(--chart-1)' },
                  { label: 'Trâu', value: point.buffalo, color: 'var(--chart-2)' },
                  { label: 'Lợn', value: point.pig, color: 'var(--chart-3)' },
                  { label: 'Gia cầm', value: point.poultry, color: 'var(--chart-4)' }
                ]} />
              )} />
            </AreaChart>
          </div>
        )}
        <ChartAccessibleSummary summary={accessibilitySummary} data={data} columns={[{ key: 'period', label: 'Thời gian' }]} />
      </CardContent>
    </Card>
  );
}
