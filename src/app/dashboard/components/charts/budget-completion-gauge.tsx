'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge } from '@/components/charts/gauge';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';
import { Skeleton } from '@/components/ui/skeleton';

interface BudgetCompletionGaugeProps {
  currentValue: number;
  targetValue: number;
  status?: 'loading' | 'empty' | 'ready';
}

export function BudgetCompletionGauge({
  currentValue,
  targetValue,
  status = 'ready',
}: BudgetCompletionGaugeProps) {
  const percentage = targetValue > 0 ? Math.round((currentValue / targetValue) * 100) : 0;
  const diff = targetValue - currentValue;
  const isOver = diff < 0;

  const formatVNDBillion = (val: number) => {
    return (val / 1e9).toFixed(2) + ' tỷ VNĐ';
  };

  const accessibilitySummary = `Biểu đồ đồng hồ tiến độ thu ngân sách. Đã thu được ${formatVNDBillion(
    currentValue
  )} trên tổng dự toán ${formatVNDBillion(targetValue)}, đạt tỷ lệ ${percentage}%. ${
    isOver
      ? `Đã vượt dự toán ${formatVNDBillion(Math.abs(diff))}.`
      : `Còn thiếu ${formatVNDBillion(diff)} để hoàn thành kế hoạch.`
  }`;

  const tableColumns = [
    { key: 'metric', label: 'Chỉ tiêu' },
    { key: 'value', label: 'Giá trị' },
  ];

  const tableData = [
    { metric: 'Thực thu lũy kế', value: formatVNDBillion(currentValue) },
    { metric: 'Dự toán giao', value: formatVNDBillion(targetValue) },
    { metric: 'Tỷ lệ hoàn thành', value: `${percentage}%` },
    { metric: isOver ? 'Vượt dự toán' : 'Còn thiếu', value: formatVNDBillion(Math.abs(diff)) },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Tiến độ thu ngân sách</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">
          Tiến độ thu ngân sách lũy kế so với dự toán được giao
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        {status === 'loading' ? (
          <div className="space-y-4">
            <div className="flex justify-center items-center h-[200px]">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>
          </div>
        ) : status === 'empty' || targetValue === 0 ? (
          <ChartEmptyState message="Không có dữ liệu tiến độ thu ngân sách." />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center mt-4">
              <Gauge
                value={percentage}
                centerValue={percentage}
                suffix="%"
                defaultLabel="Hoàn thành"
                useGradient={true}
                height={200}
                activeFill="var(--chart-1)"
                inactiveFill="var(--muted)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs mt-2 border-t border-border/40 pt-4">
              <div className="space-y-1">
                <span className="text-muted-foreground block">Thực thu lũy kế</span>
                <span className="font-bold text-base">{formatVNDBillion(currentValue)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Dự toán giao</span>
                <span className="font-bold text-base text-primary">{formatVNDBillion(targetValue)}</span>
              </div>
            </div>
          </div>
        )}
        <ChartAccessibleSummary
          summary={accessibilitySummary}
          data={tableData}
          columns={tableColumns}
        />
      </CardContent>
    </Card>
  );
}
