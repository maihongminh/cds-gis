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

interface AgricultureProductionTimeSeriesChartProps {
  data: any[];
  status?: 'loading' | 'empty' | 'ready';
}

export function AgricultureProductionTimeSeriesChart({ data, status = 'ready' }: AgricultureProductionTimeSeriesChartProps) {
  const accessibilitySummary = 'Biểu đồ cột thể hiện xu hướng diện tích gieo trồng cây nông nghiệp.';

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Sản xuất cây trồng & Mùa vụ</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">Diễn biến diện tích gieo trồng các loại cây trồng chủ lực</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'empty' || !data || data.length === 0 ? (
          <ChartEmptyState message="Chưa có dữ liệu sản xuất cây trồng." />
        ) : (
          <div className="h-[250px] mt-4 w-full">
            <BarChart data={data as any} xDataKey="period" aspectRatio="auto">
              <Grid horizontal vertical={false} />
              <Bar dataKey="areaHa" fill={['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6']} />
              <XAxis />
              <ChartTooltip content={({ point }: { point: any }) => (
                <TooltipContent title={`Thời điểm: ${point.period}`} rows={[
                  { label: 'Diện tích (ha)', value: point.areaHa, color: '#10b981' }
                ]} />
              )} />
            </BarChart>
          </div>
        )}
        <ChartAccessibleSummary summary={accessibilitySummary} data={data} columns={[{ key: 'period', label: 'Thời vụ' }, { key: 'areaHa', label: 'Diện tích (ha)' }]} />
      </CardContent>
    </Card>
  );
}
