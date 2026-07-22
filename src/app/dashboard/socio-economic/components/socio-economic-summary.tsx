'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Compass,
  Milestone,
} from 'lucide-react';
import {
  MOCK_ECONOMIC_INDICATORS,
  MOCK_SOCIAL_INDICATORS,
  MOCK_LABOR_INDICATORS,
  MOCK_INFRASTRUCTURE_INDICATORS,
} from '@/data/mock-socio-economic';

interface SocioEconomicSummaryProps {
  selectedHamletCode: string;
}

export function SocioEconomicSummary({ selectedHamletCode }: SocioEconomicSummaryProps) {
  // Let's summarize for the latest year (2026)
  const targetYear = 2026;

  // 1. Economic indicators (only commune level)
  const econ = MOCK_ECONOMIC_INDICATORS.find((e) => e.year === targetYear);
  const totalProduction = econ?.totalProductionValueBillion || 0;
  const growthRate = econ?.gdpGrowthPercent || 0;
  const budgetRevenue = econ?.budgetRevenueMillion || 0;

  // 2. Social indicators (depends on hamlet selection)
  const social = MOCK_SOCIAL_INDICATORS.find((s) => {
    if (selectedHamletCode === 'all') {
      return s.year === targetYear && s.villageCode === undefined;
    }
    return s.year === targetYear && s.villageCode === selectedHamletCode;
  });
  const povertyPercent = social?.poorHouseholdsPercent || 0;

  // 3. Labor indicators (depends on hamlet selection)
  const labor = MOCK_LABOR_INDICATORS.find((l) => {
    if (selectedHamletCode === 'all') {
      return l.year === targetYear && l.villageCode === undefined;
    }
    return l.year === targetYear && l.villageCode === selectedHamletCode;
  });
  const trainedLaborPercent = labor?.trainedLaborPercent || 0;

  // 4. Infrastructure indicators (depends on hamlet selection)
  const infra = MOCK_INFRASTRUCTURE_INDICATORS.find((i) => {
    if (selectedHamletCode === 'all') {
      return i.year === targetYear && i.villageCode === undefined;
    }
    return i.year === targetYear && i.villageCode === selectedHamletCode;
  });
  const roadPercent = infra?.concreteRoadPercent || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <MetricCard
        title="Tổng giá trị sản xuất"
        value={`${totalProduction} tỷ đ`}
        description="Ước tính cả năm 2026"
        icon={<DollarSign className="size-4 text-emerald-500" />}
      />

      <MetricCard
        title="Tốc độ tăng trưởng"
        value={`${growthRate}%`}
        description="So với năm trước"
        icon={<TrendingUp className="size-4 text-blue-500" />}
      />

      <MetricCard
        title="Thu ngân sách xã"
        value={`${(budgetRevenue / 1000).toFixed(1)} tỷ đ`}
        description={`${budgetRevenue.toLocaleString()} triệu đ`}
        icon={<Compass className="size-4 text-amber-500" />}
      />

      <MetricCard
        title="Tỷ lệ hộ nghèo"
        value={`${povertyPercent}%`}
        description={selectedHamletCode === 'all' ? "Toàn bộ xã Lao Bảo" : "Tại thôn được chọn"}
        icon={<Users className="size-4 text-rose-500" />}
      />

      <MetricCard
        title="Lao động qua đào tạo"
        value={`${trainedLaborPercent}%`}
        description="Trong độ tuổi lao động"
        icon={<Briefcase className="size-4 text-indigo-500" />}
      />

      <MetricCard
        title="Đường BT cứng hóa"
        value={`${roadPercent}%`}
        description="Tỷ lệ giao thông nông thôn"
        icon={<Milestone className="size-4 text-slate-500" />}
      />
    </div>
  );
}
