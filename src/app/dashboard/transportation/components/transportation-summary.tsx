'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { Route, Truck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { getTransportationSummary } from '@/data/mock-transportation';

interface TransportationSummaryProps {
  selectedHamletCode: string;
}

export function TransportationSummary({ selectedHamletCode }: TransportationSummaryProps) {
  const summary = React.useMemo(() => {
    return getTransportationSummary(selectedHamletCode);
  }, [selectedHamletCode]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Tổng số tuyến đường"
        value={`${summary.totalRoads} tuyến`}
        description="Đường liên thôn, dân sinh, sản xuất..."
        icon={<Route className="size-4 text-blue-500" />}
      />

      <MetricCard
        title="Tổng chiều dài đường"
        value={`${summary.totalRoadLengthKm} km`}
        description={`Tỷ lệ cứng hóa: ${summary.concreteOrAsphaltRate}%`}
        icon={<Truck className="size-4 text-emerald-500" />}
      />

      <MetricCard
        title="Công trình cầu/cống yếu"
        value={`${summary.degradedStructures + summary.dangerousStructures} công trình`}
        description={`Nguy hiểm cần cấm tải: ${summary.dangerousStructures}`}
        icon={<AlertTriangle className="size-4 text-rose-500" />}
      />

      <MetricCard
        title="Sự cố chia cắt giao thông"
        value={`${summary.openDisruptions} vị trí`}
        description={`Kế hoạch duy tu: ${summary.maintenancePlansInProgress} đang chạy`}
        icon={<ShieldAlert className="size-4 text-amber-500" />}
      />
    </div>
  );
}
