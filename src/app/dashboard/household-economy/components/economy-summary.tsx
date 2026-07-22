'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { Landmark, LandmarkIcon, TrendingUp, UserCheck, ShieldAlert } from 'lucide-react';
import { formatVND } from '../../components/dashboard-kpi-grid';

interface EconomySummaryProps {
  totalRevenue: number;
  totalCost: number;
  totalNetIncome: number;
  avgHouseholdIncome: number;
  avgPerCapitaIncome: number;
  povertyRate: number;
  totalCount: number;
  poorCount: number;
  nearPoorCount: number;
}

export function EconomySummary({
  totalRevenue,
  totalCost,
  totalNetIncome,
  avgHouseholdIncome,
  avgPerCapitaIncome,
  povertyRate,
  totalCount,
  poorCount,
  nearPoorCount,
}: EconomySummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Tổng thu nhập ròng cả xã"
        value={formatVND(totalNetIncome, false)}
        description={`Doanh thu: ${formatVND(totalRevenue, false)}`}
        icon={<Landmark className="w-4 h-4 text-primary" />}
      />
      <MetricCard
        title="Thu nhập ròng TB / Hộ"
        value={formatVND(avgHouseholdIncome, true)}
        description={`Chi phí sản xuất TB: ${formatVND(totalCost / (totalCount || 1), true)}`}
        icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
      />
      <MetricCard
        title="Thu nhập bình quân đầu người"
        value={formatVND(avgPerCapitaIncome, true)}
        description="Định mức thu nhập bình quân năm 2026"
        icon={<UserCheck className="w-4 h-4 text-blue-500" />}
        trend={{
          value: avgPerCapitaIncome >= 28000000 ? '93.3%' : '75.6%',
          isPositive: avgPerCapitaIncome >= 28000000,
          label: 'So với chỉ tiêu xã nông thôn mới',
        }}
      />
      <MetricCard
        title="Tỷ lệ hộ nghèo & cận nghèo"
        value={`${povertyRate.toFixed(1)}%`}
        description={`Gồm ${poorCount} hộ nghèo & ${nearPoorCount} hộ cận nghèo`}
        icon={<ShieldAlert className="w-4 h-4 text-rose-500" />}
        trend={{
          value: '4.2',
          isPositive: false, // negative trend means poverty reduction
          label: 'Giảm so với năm ngoái',
        }}
      />
    </div>
  );
}
