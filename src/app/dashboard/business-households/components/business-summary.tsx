'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { 
  Store, 
  FileCheck, 
  Coins, 
  Users, 
  PlaneTakeoff 
} from 'lucide-react';
import { 
  MOCK_BUSINESS_HOUSEHOLDS, 
  MOCK_BUSINESS_REVENUES, 
  MOCK_NON_AGRI_LABORS 
} from '@/data/mock-business-households';

interface BusinessSummaryProps {
  selectedHamletCode: string;
}

export function BusinessSummary({ selectedHamletCode }: BusinessSummaryProps) {
  // Filter helpers
  const filterByHamlet = <T extends { villageCode?: string }>(list: T[]): T[] => {
    if (selectedHamletCode === 'all') return list;
    return list.filter(item => item.villageCode === selectedHamletCode);
  };

  const biz = filterByHamlet(MOCK_BUSINESS_HOUSEHOLDS);
  const labors = filterByHamlet(MOCK_NON_AGRI_LABORS);

  // 1. Total business households
  const totalBiz = biz.length;

  // 2. Has registration
  const registeredBiz = biz.filter(b => b.hasRegistration).length;

  // 3. Revenues
  const bizIds = new Set(biz.map(b => b.id));
  const revenues = MOCK_BUSINESS_REVENUES.filter(
    r => bizIds.has(r.businessId) && r.period === 'Quý 2/2026'
  );
  const totalRevenue = revenues.reduce((sum, r) => sum + r.estimatedRevenueVnd, 0);
  const formatRevenue = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(2)} tỷ đ`;
    }
    return `${(amount / 1000000).toFixed(0)} triệu đ`;
  };

  // 4. Labors
  const totalNonAgriLabor = labors.reduce((sum, l) => sum + l.nonAgriculturalLaborCount, 0);
  const totalAwayLabor = labors.reduce((sum, l) => sum + l.awayLaborCount, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        title="Tổng hộ SXKD"
        value={`${totalBiz} hộ`}
        description="Đang hoạt động phi nông nghiệp"
        icon={<Store className="size-4 text-slate-500" />}
      />

      <MetricCard
        title="Hộ có ĐKKD"
        value={`${registeredBiz} hộ`}
        description={`Tỷ lệ: ${totalBiz > 0 ? (registeredBiz / totalBiz * 100).toFixed(1) : 0}%`}
        icon={<FileCheck className="size-4 text-emerald-500" />}
      />

      <MetricCard
        title="Doanh thu Quý 2/2026"
        value={formatRevenue(totalRevenue)}
        description="Ước tính doanh thu toàn phân hệ"
        icon={<Coins className="size-4 text-amber-500" />}
      />

      <MetricCard
        title="Lao động phi nông nghiệp"
        value={`${totalNonAgriLabor} người`}
        description="Lao động phi nông nghiệp tại xã"
        icon={<Users className="size-4 text-blue-500" />}
      />

      <MetricCard
        title="Lao động đi làm ăn xa"
        value={`${totalAwayLabor} người`}
        description="Làm việc ngoài địa bàn huyện/tỉnh"
        icon={<PlaneTakeoff className="size-4 text-indigo-500" />}
      />
    </div>
  );
}
