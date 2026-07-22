'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { TreePine, DollarSign, PieChart, Users2 } from 'lucide-react';
import { formatVND } from '../../components/dashboard-kpi-grid';

interface ForestSummaryProps {
  totalArea: number;
  totalBudget: number;
  payoutProgress: number;
  householdCount: number;
  totalPaidAmount: number;
}

export function ForestSummary({
  totalArea,
  totalBudget,
  payoutProgress,
  householdCount,
  totalPaidAmount,
}: ForestSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Tổng diện tích nhận khoán"
        value={`${totalArea.toFixed(2)} ha`}
        description="Tổng diện tích rừng đầu nguồn bảo vệ"
        icon={<TreePine className="w-4 h-4 text-emerald-500" />}
      />
      <MetricCard
        title="Tổng ngân sách chi trả DVMTR"
        value={formatVND(totalBudget, false)}
        description={`Định mức: 600.000đ/ha/năm`}
        icon={<DollarSign className="w-4 h-4 text-primary" />}
      />
      <MetricCard
        title="Tiến độ giải ngân DVMTR"
        value={`${payoutProgress.toFixed(1)}%`}
        description={`Đã giải ngân: ${formatVND(totalPaidAmount, false)}`}
        icon={<PieChart className="w-4 h-4 text-amber-500" />}
        trend={{
          value: payoutProgress,
          isPositive: payoutProgress >= 80,
          label: 'Đạt tiến độ kế hoạch',
        }}
      />
      <MetricCard
        title="Hộ dân nhận giao khoán"
        value={householdCount}
        description="Tổng số hộ tham gia bảo vệ rừng"
        icon={<Users2 className="w-4 h-4 text-blue-500" />}
      />
    </div>
  );
}
