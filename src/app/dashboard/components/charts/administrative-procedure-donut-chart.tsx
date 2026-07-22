'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RingChart from '@/components/charts/ring-chart';
import Ring from '@/components/charts/ring';
import RingCenter from '@/components/charts/ring-center';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface AdministrativeProcedureDonutChartProps {
  status?: 'loading' | 'empty' | 'ready';
}

export function AdministrativeProcedureDonutChart({ status = 'ready' }: AdministrativeProcedureDonutChartProps) {
  // Mock data for Donut 1 - Hình thức tiếp nhận hồ sơ
  const receivingData = [
    { label: 'Trực tuyến', value: 850, maxValue: 1250 },
    { label: 'Trực tiếp', value: 350, maxValue: 1250 },
    { label: 'Bưu chính', value: 50, maxValue: 1250 },
  ];

  // Mock data for Donut 2 - Trạng thái xử lý hồ sơ
  const processingData = [
    { label: 'Trước hạn', value: 920, maxValue: 1250 },
    { label: 'Đúng hạn', value: 250, maxValue: 1250 },
    { label: 'Đang xử lý', value: 75, maxValue: 1250 },
    { label: 'Quá hạn', value: 5, maxValue: 1250 },
  ];

  const accessibilitySummary = 'Biểu đồ vòng thống kê tình hình tiếp nhận và xử lý hồ sơ cải cách hành chính.';

  const tableColumns = [
    { key: 'category', label: 'Phân loại' },
    { key: 'label', label: 'Tiêu chí' },
    { key: 'value', label: 'Số lượng hồ sơ' },
  ];

  const tableData = [
    ...receivingData.map(d => ({ category: 'Hình thức tiếp nhận', label: d.label, value: d.value })),
    ...processingData.map(d => ({ category: 'Trạng thái xử lý', label: d.label, value: d.value })),
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Tiếp nhận & Xử lý hồ sơ CCHC</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">
          Tỷ trọng hình thức tiếp nhận và trạng thái giải quyết thủ tục hành chính
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="flex gap-4">
            <Skeleton className="h-40 w-40 rounded-full" />
            <Skeleton className="h-40 w-40 rounded-full" />
          </div>
        ) : status === 'empty' ? (
          <ChartEmptyState message="Chưa có dữ liệu xử lý hồ sơ trong kỳ báo cáo." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start mt-2">
            {/* Donut 1 */}
            <div className="space-y-4">
              <div className="flex justify-center relative">
                <RingChart data={receivingData} size={160} strokeWidth={18} ringGap={2} baseInnerRadius={45}>
                  <Ring index={0} color="#3b82f6" />
                  <Ring index={1} color="#8b5cf6" />
                  <Ring index={2} color="#ec4899" />
                  <RingCenter defaultLabel="1,250" />
                </RingChart>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-center border-b border-border/40 pb-2">Hình thức tiếp nhận</p>
                <div className="grid gap-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Trực tuyến</span>
                    <span className="font-bold">850 (68%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Trực tiếp</span>
                    <span className="font-bold">350 (28%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ec4899]" /> Bưu chính/Khác</span>
                    <span className="font-bold">50 (4%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Donut 2 */}
            <div className="space-y-4">
              <div className="flex justify-center relative">
                <RingChart data={processingData} size={160} strokeWidth={18} ringGap={2} baseInnerRadius={45}>
                  <Ring index={0} color="#10b981" />
                  <Ring index={1} color="#3b82f6" />
                  <Ring index={2} color="#f59e0b" />
                  <Ring index={3} color="#ef4444" />
                  <RingCenter defaultLabel="93.6%" />
                </RingChart>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-center border-b border-border/40 pb-2">Trạng thái giải quyết</p>
                <div className="grid gap-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Trước hạn</span>
                    <span className="font-bold text-emerald-600">920</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Đúng hạn</span>
                    <span className="font-bold text-blue-600">250</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Đang xử lý</span>
                    <span className="font-bold text-amber-600">75</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Quá hạn</span>
                    <span className="font-bold text-rose-600">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <ChartAccessibleSummary summary={accessibilitySummary} data={tableData} columns={tableColumns} />
      </CardContent>
    </Card>
  );
}
