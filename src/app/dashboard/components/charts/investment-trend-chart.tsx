'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar } from '@/components/charts/bar-chart';
import Grid from '@/components/charts/grid';
import XAxis from '@/components/charts/x-axis';
import ChartTooltip from '@/components/charts/tooltip/chart-tooltip';
import { TooltipContent } from '@/components/charts/tooltip/tooltip-content';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';
import { Skeleton } from '@/components/ui/skeleton';

interface InvestmentYearPoint {
  year: string;
  capitalBillion: number; // Vốn đầu tư (tỷ đồng)
  projectCount: number;
}

interface InvestmentTrendProps {
  data: InvestmentYearPoint[];
  status?: 'loading' | 'empty' | 'ready';
}

export function InvestmentTrendChart({
  data,
  status = 'ready',
}: InvestmentTrendProps) {
  const isEmpty = !data || data.length === 0;
  const totalCapital = data.reduce((sum, d) => sum + d.capitalBillion, 0);
  const totalProjects = data.reduce((sum, d) => sum + d.projectCount, 0);

  const accessibilitySummary = `Biểu đồ tiến trình đầu tư phát triển. Tổng số vốn đầu tư đăng ký qua các năm đạt ${totalCapital.toLocaleString()} tỷ đồng với ${totalProjects} dự án có quyết định đầu tư.`;

  const tableColumns = [
    { key: 'year', label: 'Năm' },
    { key: 'capitalBillion', label: 'Vốn đăng ký', format: (val: any) => `${val} tỷ đồng` },
    { key: 'projectCount', label: 'Số dự án', format: (val: any) => `${val} dự án` },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Xu hướng Thu hút đầu tư &amp; Đầu tư công</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">
          Biến động tổng vốn đầu tư công và dự án đầu tư phát triển xã hội được phê duyệt hàng năm
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="space-y-4">
            <Skeleton className="h-[280px] w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : isEmpty ? (
          <ChartEmptyState message="Chưa có dữ liệu thu hút đầu tư." />
        ) : (
          <div className="space-y-4">
            <div className="h-[280px] w-full">
              <BarChart data={data as any} xDataKey="year" status={(status as string) === 'loading' ? 'loading' : 'ready'} aspectRatio="auto">
                <Grid horizontal vertical={false} shimmer={(status as string) === 'loading'} />
                <Bar dataKey="capitalBillion" fill="var(--chart-1)" />
                <Bar dataKey="projectCount" fill="var(--chart-2)" />
                <XAxis />
                <ChartTooltip
                  content={({ point }) => (
                    <TooltipContent
                      title={`Năm ${point.year}`}
                      rows={[
                        {
                          label: 'Vốn đầu tư',
                          value: `${point.capitalBillion} tỷ đồng`,
                          color: 'var(--chart-1)',
                        },
                        {
                          label: 'Số dự án',
                          value: `${point.projectCount} dự án`,
                          color: 'var(--chart-2)',
                        },
                      ]}
                    />
                  )}
                />
              </BarChart>
            </div>
            <ChartAccessibleSummary
              summary={accessibilitySummary}
              data={data as any}
              columns={tableColumns}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
