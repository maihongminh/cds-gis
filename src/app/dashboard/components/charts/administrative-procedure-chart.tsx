'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RingChart from '@/components/charts/ring-chart';
import Ring from '@/components/charts/ring';
import RingCenter from '@/components/charts/ring-center';
import ChartAccessibleSummary from '@/components/charts/chart-accessible-summary';
import ChartEmptyState from '@/components/charts/chart-empty-state';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminProcedureProps {
  onlineSubmissionRate: number;      // Tỷ lệ hồ sơ trực tuyến (%)
  paymentOnlineRate: number;         // Tỷ lệ thanh toán trực tuyến (%)
  fullProcessServiceRate: number;    // Tỷ lệ dịch vụ công toàn trình (%)
  statusCounts: {
    ontime: number;                  // Đúng hạn/Trước hạn
    overdue: number;                 // Quá hạn
    processing: number;              // Đang giải quyết
  };
  status?: 'loading' | 'empty' | 'ready';
}

const ringColors = ['var(--chart-2)', 'var(--chart-4)', 'var(--chart-3)']; // green, red, yellow-orange

export function AdministrativeProcedureChart({
  onlineSubmissionRate,
  paymentOnlineRate,
  fullProcessServiceRate,
  statusCounts,
  status = 'ready',
}: AdminProcedureProps) {
  const totalRecords = statusCounts.ontime + statusCounts.overdue + statusCounts.processing;
  const ontimeRate = totalRecords > 0 ? Math.round((statusCounts.ontime / totalRecords) * 100) : 0;
  const overdueRate = totalRecords > 0 ? Math.round((statusCounts.overdue / totalRecords) * 100) : 0;
  const processingRate = totalRecords > 0 ? Math.round((statusCounts.processing / totalRecords) * 100) : 0;

  const ringData = [
    { label: 'Trước/Đúng hạn', value: statusCounts.ontime, maxValue: totalRecords || 1 },
    { label: 'Đang giải quyết', value: statusCounts.processing, maxValue: totalRecords || 1 },
    { label: 'Quá hạn', value: statusCounts.overdue, maxValue: totalRecords || 1 },
  ];

  const accessibilitySummary = `Biểu đồ cải cách hành chính. Tổng số hồ sơ hành chính tiếp nhận là ${totalRecords}. Cơ cấu giải quyết: đúng/trước hạn đạt ${statusCounts.ontime} hồ sơ (${ontimeRate}%), đang xử lý ${statusCounts.processing} hồ sơ (${processingRate}%), quá hạn ${statusCounts.overdue} hồ sơ (${overdueRate}%). Chỉ số trực tuyến: tỷ lệ tiếp nhận trực tuyến đạt ${onlineSubmissionRate}%, tỷ lệ thanh toán trực tuyến đạt ${paymentOnlineRate}%, tỷ lệ dịch vụ công trực tuyến toàn trình đạt ${fullProcessServiceRate}%.`;

  const tableColumns = [
    { key: 'metric', label: 'Chỉ tiêu cải cách hành chính' },
    { key: 'value', label: 'Kết quả' },
  ];

  const tableData = [
    { metric: 'Tổng số hồ sơ tiếp nhận', value: `${totalRecords} hồ sơ` },
    { metric: 'Hồ sơ đã giải quyết đúng/trước hạn', value: `${statusCounts.ontime} (${ontimeRate}%)` },
    { metric: 'Hồ sơ đang giải quyết', value: `${statusCounts.processing} (${processingRate}%)` },
    { metric: 'Hồ sơ quá hạn giải quyết', value: `${statusCounts.overdue} (${overdueRate}%)` },
    { metric: 'Tỷ lệ nộp hồ sơ trực tuyến', value: `${onlineSubmissionRate}%` },
    { metric: 'Tỷ lệ thanh toán trực tuyến', value: `${paymentOnlineRate}%` },
    { metric: 'Tỷ lệ dịch vụ công toàn trình', value: `${fullProcessServiceRate}%` },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Chỉ số cải cách hành chính &amp; Dịch vụ công</span>
          {status === 'loading' && <span className="text-xs animate-pulse text-muted-foreground">Đang tải...</span>}
        </CardTitle>
        <CardDescription className="text-xs">
          Tình hình tiếp nhận hồ sơ trực tuyến, thanh toán số và chất lượng giải quyết thủ tục hành chính
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[200px] w-full rounded-full" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ) : totalRecords === 0 ? (
          <ChartEmptyState message="Không có dữ liệu hồ sơ hành chính." />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column: Ring chart for status */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-muted-foreground block text-center">
                  Cơ cấu trạng thái giải quyết ({totalRecords} hồ sơ)
                </span>
                <div className="flex justify-center h-[180px]">
                  <RingChart data={ringData} size={170} strokeWidth={9} ringGap={5} baseInnerRadius={45}>
                    {ringData.map((_, idx) => (
                      <Ring key={idx} index={idx} color={ringColors[idx % ringColors.length]} />
                    ))}
                    <RingCenter defaultLabel={`${ontimeRate}% DH`} />
                  </RingChart>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-center pt-2">
                  <div className="space-y-0.5">
                    <span className="inline-block w-2 h-2 rounded-xs bg-[var(--chart-2)] mr-1" />
                    <span className="text-muted-foreground">Đúng hạn</span>
                    <div className="font-bold text-foreground">{statusCounts.ontime}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="inline-block w-2 h-2 rounded-xs bg-[var(--chart-3)] mr-1" />
                    <span className="text-muted-foreground">Đang xử lý</span>
                    <div className="font-bold text-foreground">{statusCounts.processing}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="inline-block w-2 h-2 rounded-xs bg-[var(--chart-4)] mr-1" />
                    <span className="text-muted-foreground">Quá hạn</span>
                    <div className="font-bold text-foreground text-rose-500">{statusCounts.overdue}</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Online & Service Rates */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Tỷ lệ nộp trực tuyến:</span>
                    <span className="font-bold text-primary">{onlineSubmissionRate}%</span>
                  </div>
                  <Progress value={onlineSubmissionRate} className="h-1.5 bg-muted" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Thanh toán trực tuyến:</span>
                    <span className="font-bold text-emerald-600">{paymentOnlineRate}%</span>
                  </div>
                  <Progress value={paymentOnlineRate} className="h-1.5 bg-muted" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Dịch vụ công toàn trình:</span>
                    <span className="font-bold text-amber-600">{fullProcessServiceRate}%</span>
                  </div>
                  <Progress value={fullProcessServiceRate} className="h-1.5 bg-muted" />
                </div>
              </div>
            </div>

            <ChartAccessibleSummary
              summary={accessibilitySummary}
              data={tableData}
              columns={tableColumns}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
