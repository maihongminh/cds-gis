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
import { Skeleton } from '@/components/ui/skeleton';

interface RainfallPoint {
  hour: string; // e.g. '02:00', '04:00', ...
  rainfallMm: number;
}

interface EmergencyWeatherTimeSeriesChartProps {
  data: RainfallPoint[];
  windSpeedKmh: number;
  warningLevel: string;
  bulletinCount: number;
  lastBulletinTime: string;
  status?: 'loading' | 'empty' | 'ready';
}

export function EmergencyWeatherTimeSeriesChart({
  data,
  windSpeedKmh,
  warningLevel,
  bulletinCount,
  lastBulletinTime,
  status = 'ready',
}: EmergencyWeatherTimeSeriesChartProps) {
  const isEmpty = !data || data.length === 0;

  const totalRainfall = data.reduce((sum, d) => sum + d.rainfallMm, 0);

  const accessibilitySummary = `Biểu đồ diễn biến lượng mưa mô phỏng. Tổng lượng mưa tích lũy là ${totalRainfall} mm. Tốc độ gió hiện tại là ${windSpeedKmh} km/h. Mức độ cảnh báo thiên tai: ${warningLevel}. Số bản tin cảnh báo đã phát: ${bulletinCount} bản tin. Bản tin gần nhất lúc: ${lastBulletinTime}.`;

  const tableColumns = [
    { key: 'hour', label: 'Thời điểm' },
    { key: 'rainfallMm', label: 'Lượng mưa (mm)', format: (val: any) => `${val} mm` },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <span>Diễn biến Lượng mưa &amp; Thiên tai</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
                {warningLevel}
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Giám sát lượng mưa đo được tự động và cấp độ rủi ro khí tượng thủy văn (Giả lập)
            </CardDescription>
          </div>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </div>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Weather Metrics Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 bg-muted/30 border border-border/40 rounded-xl text-center">
                <span className="text-[9px] text-muted-foreground font-semibold block uppercase">Gió giật</span>
                <span className="text-sm font-bold text-foreground">{windSpeedKmh} km/h</span>
              </div>
              <div className="p-2.5 bg-muted/30 border border-border/40 rounded-xl text-center">
                <span className="text-[9px] text-muted-foreground font-semibold block uppercase">Lũ tích lũy</span>
                <span className="text-sm font-bold text-foreground">{totalRainfall.toFixed(1)} mm</span>
              </div>
              <div className="p-2.5 bg-muted/30 border border-border/40 rounded-xl text-center">
                <span className="text-[9px] text-muted-foreground font-semibold block uppercase">Cảnh báo</span>
                <span className="text-[10px] font-bold text-rose-500 block truncate">{lastBulletinTime}</span>
              </div>
            </div>

            {/* Rainfall Trend BarChart */}
            <div className="border-t border-border/40 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-muted-foreground">Diễn biến lượng mưa 24h qua</span>
                <span className="text-[9px] text-muted-foreground italic">Dữ liệu thời tiết mô phỏng</span>
              </div>
              {isEmpty ? (
                <ChartEmptyState message="Không có dữ liệu lượng mưa." />
              ) : (
                <div className="h-[200px] w-full">
                  <AreaChart data={data as any} xDataKey="hour" status={(status as string) === 'loading' ? 'loading' : 'ready'} aspectRatio="auto">
                    <Grid horizontal vertical={false} shimmer={(status as string) === 'loading'} />
                    <Area dataKey="rainfallMm" fill="var(--chart-4)" stroke="var(--chart-4)" strokeWidth={2} />
                    <XAxis />
                    <ChartTooltip
                      content={({ point }) => (
                        <TooltipContent
                          title={`Thời điểm: ${point.hour}`}
                          rows={[
                            {
                              label: 'Lượng mưa',
                              value: `${point.rainfallMm} mm`,
                              color: 'var(--chart-4)',
                            },
                          ]}
                        />
                      )}
                    />
                  </AreaChart>
                </div>
              )}
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
