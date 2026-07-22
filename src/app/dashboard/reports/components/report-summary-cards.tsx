'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { Home, Map, Layers, Coins, TrendingDown } from 'lucide-react';
import { formatVND } from '../../components/dashboard-kpi-grid';

interface ReportSummaryCardsProps {
  totalHouseholds: number;
  totalCropArea: number;
  totalCropOutput: number;
  totalIncome: number;
  povertyRate: number;
  poorCount: number;
  nearPoorCount: number;
}

export function ReportSummaryCards({
  totalHouseholds,
  totalCropArea,
  totalCropOutput,
  totalIncome,
  povertyRate,
  poorCount,
  nearPoorCount,
}: ReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        title="Tổng số hộ dân"
        value={totalHouseholds}
        description="Số hộ định cư thực tế"
        icon={<Home className="w-4 h-4 text-primary" />}
      />
      <MetricCard
        title="Diện tích gieo trồng"
        value={`${totalCropArea.toFixed(2)} ha`}
        description="Đất nông nghiệp canh tác"
        icon={<Map className="w-4 h-4 text-emerald-500" />}
      />
      <MetricCard
        title="Sản lượng thu hoạch"
        value={`${(totalCropOutput / 1000).toFixed(1)} tấn`}
        description="Tổng khối lượng nông sản"
        icon={<Layers className="w-4 h-4 text-amber-500" />}
      />
      <MetricCard
        title="Ước tính doanh thu"
        value={formatVND(totalIncome, false)}
        description="Ước lượng từ cây trồng"
        icon={<Coins className="w-4 h-4 text-blue-500" />}
      />
      <MetricCard
        title="Tỷ lệ hộ nghèo"
        value={`${povertyRate.toFixed(1)}%`}
        description={`Nghèo: ${poorCount} | Cận nghèo: ${nearPoorCount}`}
        icon={<TrendingDown className="w-4 h-4 text-rose-500" />}
      />
    </div>
  );
}
