'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RingChart from '@/components/charts/ring-chart';
import Ring from '@/components/charts/ring';
import RingCenter from '@/components/charts/ring-center';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';
import { Skeleton } from '@/components/ui/skeleton';

interface ReadinessItem {
  label: string; // Chỉ huy, Lực lượng, Phương tiện, Hậu cần
  value: number; // Readiness score (0-100)
}

interface EmergencyReadinessProps {
  data: ReadinessItem[];
  status?: 'loading' | 'empty' | 'ready';
}

const ringColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

export function EmergencyReadinessChart({
  data,
  status = 'ready',
}: EmergencyReadinessProps) {
  const isEmpty = !data || data.length === 0;
  const avgReadiness = data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length) : 0;

  const accessibilitySummary = `Biểu đồ năng lực phòng chống thiên tai theo phương châm 4 tại chỗ. Điểm sẵn sàng trung bình toàn xã đạt ${avgReadiness}/100 điểm. Chi tiết các mặt sẵn sàng: ${data
    .map((d) => `${d.label} đạt ${d.value} điểm`)
    .join(', ')}.`;

  const tableColumns = [
    { key: 'label', label: 'Phương châm 4 tại chỗ' },
    { key: 'value', label: 'Điểm sẵn sàng (1-100)', format: (val: any) => `${val}/100 điểm` },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Năng lực đáp ứng "4 tại chỗ"</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">
          Đánh giá điểm sẵn sàng chuẩn bị nhân lực, phương tiện, hậu cần và chỉ đạo ứng phó bão lũ
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : isEmpty ? (
          <ChartEmptyState message="Không có dữ liệu năng lực ứng phó." />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex justify-center h-[180px]">
                <RingChart
                  data={data.map((d) => ({ ...d, maxValue: 100 }))}
                  size={180}
                  strokeWidth={10}
                  ringGap={6}
                  baseInnerRadius={45}
                >
                  {data.map((_, idx) => (
                    <Ring key={idx} index={idx} color={ringColors[idx % ringColors.length]} />
                  ))}
                  <RingCenter defaultLabel={`${avgReadiness}đ`} />
                </RingChart>
              </div>
              <div className="space-y-2 text-xs">
                <div className="text-[10px] text-muted-foreground italic mb-1">
                  * Điểm sẵn sàng mô phỏng
                </div>
                {data.map((item, idx) => (
                  <div key={item.label} className="flex justify-between border-b border-border/40 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: ringColors[idx % ringColors.length] }}
                      />
                      <span>{item.label}:</span>
                    </div>
                    <span className="font-bold text-foreground">{item.value} / 100</span>
                  </div>
                ))}
              </div>
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
