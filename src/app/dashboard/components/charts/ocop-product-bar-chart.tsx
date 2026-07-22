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

interface OcopProductBarChartProps {
  data: any[];
  status?: 'loading' | 'empty' | 'ready';
}

export function OcopProductBarChart({ data, status = 'ready' }: OcopProductBarChartProps) {
  const accessibilitySummary = 'Biểu đồ cột thể hiện phân bổ sản phẩm OCOP theo hạng sao.';

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Phân bổ sản phẩm OCOP</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">Số lượng sản phẩm OCOP theo tiêu chuẩn sao</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'empty' || !data || data.length === 0 ? (
          <ChartEmptyState message="Chưa ghi nhận sản phẩm OCOP." />
        ) : (
          <div className="h-[250px] mt-4 w-full">
            <BarChart data={data as any} xDataKey="label" aspectRatio="auto">
              <Grid horizontal vertical={false} />
              <Bar dataKey="value" fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']} />
              <XAxis />
              <ChartTooltip content={({ point }: { point: any }) => (
                <TooltipContent title={point.label} rows={[
                  { label: 'Số lượng', value: point.value, color: '#10b981' }
                ]} />
              )} />
            </BarChart>
          </div>
        )}
        <ChartAccessibleSummary summary={accessibilitySummary} data={data} columns={[{ key: 'label', label: 'Hạng' }, { key: 'value', label: 'Số lượng' }]} />
      </CardContent>
    </Card>
  );
}
