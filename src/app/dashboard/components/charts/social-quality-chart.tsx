'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface SocialMetricPoint {
  label: string;
  value: number; // percentage
  target: number; // target percentage
}

interface SocialQualityProps {
  data: SocialMetricPoint[];
  status?: 'loading' | 'empty' | 'ready';
}

export function SocialQualityChart({
  data,
  status = 'ready',
}: SocialQualityProps) {
  const isEmpty = !data || data.length === 0;

  const accessibilitySummary = `Biểu đồ chất lượng đời sống dân sinh và xã hội số. Kết quả các chỉ số: ${data
    .map((d) => `${d.label}: đạt ${d.value}% trên mục tiêu ${d.target}%`)
    .join(', ')}.`;

  const tableColumns = [
    { key: 'label', label: 'Chỉ số xã hội' },
    { key: 'value', label: 'Hiện trạng', format: (val: any) => `${val}%` },
    { key: 'target', label: 'Mục tiêu kế hoạch', format: (val: any) => `${val}%` },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Chất lượng sống &amp; Xã hội số</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">
          Tỷ lệ bao phủ nước sạch, sử dụng điện thoại thông minh, internet và chỉ số hạnh phúc người dân
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : isEmpty ? (
          <ChartEmptyState message="Chưa có dữ liệu chất lượng sống." />
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {data.map((item) => {
                const isOnTrack = item.value >= item.target;
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Mục tiêu: {item.target}%</span>
                        <span className={`font-bold ${isOnTrack ? 'text-emerald-600' : 'text-amber-600'}`}>
                          Đạt: {item.value}%
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={item.value} className="h-2 bg-muted" />
                      {/* Subdued indicator for target mark */}
                      <span
                        className="absolute top-0 bottom-0 w-0.5 bg-rose-500/60"
                        style={{ left: `${item.target}%` }}
                        title={`Mục tiêu ${item.target}%`}
                      />
                    </div>
                  </div>
                );
              })}
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
