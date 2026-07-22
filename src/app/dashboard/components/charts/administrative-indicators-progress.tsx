'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AdministrativeIndicatorsProgressProps {
  status?: 'loading' | 'empty' | 'ready';
}

export function AdministrativeIndicatorsProgress({ status = 'ready' }: AdministrativeIndicatorsProgressProps) {
  const indicators = [
    { label: 'Hồ sơ tiếp nhận trực tuyến', current: 78.5, target: 80 },
    { label: 'Xử lý trước hạn và đúng hạn', current: 93.6, target: 95 },
    { label: 'Thanh toán phí/lệ phí trực tuyến', current: 65.2, target: 60 },
    { label: 'Dịch vụ công toàn trình', current: 58.0, target: 70 },
    { label: 'Số hóa hồ sơ kết quả', current: 82.4, target: 85 },
  ];

  if (status === 'loading') {
    return (
      <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full animate-pulse">
        <CardHeader className="pb-2"><CardTitle className="text-sm bg-muted h-5 w-1/2 rounded"></CardTitle></CardHeader>
        <CardContent><div className="space-y-4"><div className="h-8 bg-muted rounded"></div></div></CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold">Chỉ tiêu Cải cách hành chính</CardTitle>
        <CardDescription className="text-xs">Theo dõi tiến độ thực hiện các chỉ tiêu chuyển đổi số xã</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {indicators.map((ind, idx) => {
          const diff = (ind.current - ind.target).toFixed(1);
          const isPassed = ind.current >= ind.target;
          const isNear = ind.current >= ind.target - 5 && !isPassed;

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-end text-xs">
                <span className="font-semibold text-foreground">{ind.label}</span>
                <span className="font-bold text-[10px]">
                  {ind.current}% <span className="text-muted-foreground font-normal">/ {ind.target}%</span>
                </span>
              </div>
              <Progress value={ind.current} className="h-2" />
              <div className="flex justify-between items-center mt-1">
                <span className="text-[9px] text-muted-foreground">
                  {isPassed ? (
                    <span className="text-emerald-600">Vượt mục tiêu {diff} điểm %</span>
                  ) : (
                    <span>Còn thiếu {Math.abs(Number(diff))} điểm %</span>
                  )}
                </span>
                <Badge variant="outline" className={`text-[8px] font-bold px-1.5 py-0 uppercase ${
                  isPassed ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                  isNear ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-600 border-rose-500/20'
                }`}>
                  {isPassed ? 'Đạt' : isNear ? 'Gần đạt' : 'Chưa đạt'}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
