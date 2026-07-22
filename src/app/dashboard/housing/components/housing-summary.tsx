'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { 
  Home, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  Heart,
  Gift
} from 'lucide-react';
import { 
  MOCK_HOUSING_RECORDS, 
  MOCK_HOUSING_SUPPORTS, 
  MOCK_HOUSING_SUPPORT_NEEDS 
} from '@/data/mock-housing';

interface HousingSummaryProps {
  selectedHamletCode: string;
}

export function HousingSummary({ selectedHamletCode }: HousingSummaryProps) {
  // Filter helper
  const filterByHamlet = <T extends { villageCode?: string }>(list: T[]): T[] => {
    if (selectedHamletCode === 'all') return list;
    return list.filter(item => item.villageCode === selectedHamletCode);
  };

  const records = filterByHamlet(MOCK_HOUSING_RECORDS);
  const supports = filterByHamlet(MOCK_HOUSING_SUPPORTS);
  const needs = filterByHamlet(MOCK_HOUSING_SUPPORT_NEEDS);

  const totalHh = records.length;
  const kienco = records.filter(r => r.housingType === 'kiên cố').length;
  const bankienco = records.filter(r => r.housingType === 'bán kiên cố').length;
  const nhatam = records.filter(r => r.housingType === 'nhà tạm' || r.housingType === 'dột nát').length;

  const supported = supports.filter(r => r.status === 'completed').length;
  const needingSupport = needs.filter(r => r.status === 'pending').length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <MetricCard
        title="Tổng hộ có dữ liệu"
        value={`${totalHh} hộ`}
        description="Đã khảo sát hiện trạng"
        icon={<Home className="size-4 text-slate-500" />}
      />

      <MetricCard
        title="Nhà kiên cố"
        value={`${kienco} hộ`}
        description={`Tỷ lệ: ${totalHh > 0 ? (kienco / totalHh * 100).toFixed(1) : 0}%`}
        icon={<ShieldCheck className="size-4 text-emerald-500" />}
      />

      <MetricCard
        title="Nhà bán kiên cố"
        value={`${bankienco} hộ`}
        description={`Tỷ lệ: ${totalHh > 0 ? (bankienco / totalHh * 100).toFixed(1) : 0}%`}
        icon={<ShieldAlert className="size-4 text-blue-500" />}
      />

      <MetricCard
        title="Nhà tạm, dột nát"
        value={`${nhatam} hộ`}
        description="Cần ưu tiên nâng cấp"
        icon={<AlertTriangle className="size-4 text-rose-500" />}
      />

      <MetricCard
        title="Đã được hỗ trợ"
        value={`${supported} hộ`}
        description="Hoàn thành xây mới/sửa chữa"
        icon={<Gift className="size-4 text-indigo-500" />}
      />

      <MetricCard
        title="Nhu cầu hỗ trợ"
        value={`${needingSupport} hộ`}
        description="Đang chờ xét duyệt"
        icon={<Heart className="size-4 text-teal-500" />}
      />
    </div>
  );
}
