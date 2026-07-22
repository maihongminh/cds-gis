'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { Waves, CheckCircle2, AlertTriangle, LandPlot } from 'lucide-react';
import { MOCK_IRRIGATION_FACILITIES } from '@/data/mock-irrigation';

interface IrrigationSummaryProps {
  selectedHamletCode: string;
}

export function IrrigationSummary({ selectedHamletCode }: IrrigationSummaryProps) {
  // Filter helper
  const filterByHamlet = <T extends { villageCode?: string }>(list: T[]): T[] => {
    if (selectedHamletCode === 'all') return list;
    return list.filter((item) => item.villageCode === selectedHamletCode);
  };

  const facilities = filterByHamlet(MOCK_IRRIGATION_FACILITIES);

  // 1. Total facilities
  const totalFac = facilities.length;

  // 2. Stable / Good facilities
  const goodFac = facilities.filter((f) => f.status === 'good').length;

  // 3. Needs repair / Damaged
  const issueFac = facilities.filter((f) => f.status === 'needsRepair' || f.status === 'damaged').length;

  // 4. Irrigated Area (ha)
  const totalArea = facilities.reduce((sum, f) => sum + f.irrigatedAreaHa, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Tổng công trình thủy lợi"
        value={`${totalFac} công trình`}
        description="Đập dâng, kênh dẫn, trạm bơm..."
        icon={<Waves className="size-4 text-blue-500" />}
      />

      <MetricCard
        title="Hoạt động ổn định"
        value={`${goodFac} công trình`}
        description={`Tỷ lệ: ${totalFac > 0 ? ((goodFac / totalFac) * 100).toFixed(1) : 0}%`}
        icon={<CheckCircle2 className="size-4 text-emerald-500" />}
      />

      <MetricCard
        title="Cần sửa chữa / Hư hại"
        value={`${issueFac} công trình`}
        description="Đang kiến nghị khắc phục phục vụ nông nghiệp"
        icon={<AlertTriangle className="size-4 text-rose-500" />}
      />

      <MetricCard
        title="Diện tích tưới tiêu phục vụ"
        value={`${totalArea} ha`}
        description="Cung cấp nước sản xuất nông nghiệp"
        icon={<LandPlot className="size-4 text-indigo-500" />}
      />
    </div>
  );
}
