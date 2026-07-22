'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { 
  CloudLightning, 
  MapPin, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { 
  MOCK_DISASTER_EVENTS, 
  MOCK_AGRI_RISK_ALERTS 
} from '@/data/mock-climate';
import { MOCK_HAMLETS } from '@/data/mock-administrative-units';

interface ClimateSummaryProps {
  selectedHamletCode: string;
}

export function ClimateSummary({ selectedHamletCode }: ClimateSummaryProps) {
  const currentHamlet = MOCK_HAMLETS.find(h => h.code === selectedHamletCode);

  // 1. Disaster events
  const events = MOCK_DISASTER_EVENTS.filter(r => {
    if (selectedHamletCode === 'all') return true;
    return currentHamlet ? r.affectedHamlets.includes(currentHamlet.name) : true;
  });

  // 2. Affected Hamlets Count
  const affectedHamletsSet = new Set<string>();
  events.forEach(e => e.affectedHamlets.forEach(h => affectedHamletsSet.add(h)));
  const affectedHamletsCount = selectedHamletCode === 'all' ? affectedHamletsSet.size : (events.length > 0 ? 1 : 0);

  // 3. Estimated Damage
  const totalDamage = events.reduce((sum, e) => sum + e.estimatedDamageVnd, 0);
  const formatDamage = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(2)} tỷ đ`;
    }
    return `${(amount / 1000000).toFixed(0)} triệu đ`;
  };

  // 4. Active warnings
  const alerts = MOCK_AGRI_RISK_ALERTS.filter(r => {
    if (selectedHamletCode === 'all') return true;
    return currentHamlet ? r.affectedHamlets.includes(currentHamlet.name) : true;
  });
  const activeAlerts = alerts.filter(r => r.status === 'active').length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Sự kiện thiên tai"
        value={`${events.length} đợt`}
        description="Ghi nhận trong năm 2026"
        icon={<CloudLightning className="size-4 text-amber-500" />}
      />

      <MetricCard
        title="Địa bàn ảnh hưởng"
        value={`${affectedHamletsCount} thôn`}
        description={selectedHamletCode === 'all' ? 'Tổng số thôn bị ảnh hưởng' : `Khu vực: ${currentHamlet?.name}`}
        icon={<MapPin className="size-4 text-rose-500" />}
      />

      <MetricCard
        title="Tổng thiệt hại ước tính"
        value={formatDamage(totalDamage)}
        description="Về hoa màu, quế, sâm và tài sản"
        icon={<TrendingUp className="size-4 text-destructive" />}
      />

      <MetricCard
        title="Cảnh báo thiên tai"
        value={`${activeAlerts} cảnh báo`}
        description="Đang có hiệu lực phát sóng"
        icon={<AlertTriangle className="size-4 text-orange-500" />}
      />
    </div>
  );
}
