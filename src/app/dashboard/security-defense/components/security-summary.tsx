'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { Shield, ShieldCheck, ShieldAlert, Users, HeartHandshake } from 'lucide-react';
import {
  MOCK_SECURITY_INCIDENTS,
  MOCK_DEFENSE_STATISTICS,
  MOCK_SOCIAL_ISSUES,
} from '@/data/mock-security-defense';

interface SecuritySummaryProps {
  selectedHamletCode: string;
}

export function SecuritySummary({ selectedHamletCode }: SecuritySummaryProps) {
  const targetYear = 2026;

  // Filter helper
  const filterByHamlet = <T extends { villageCode?: string }>(list: T[]): T[] => {
    if (selectedHamletCode === 'all') return list;
    return list.filter((item) => item.villageCode === selectedHamletCode);
  };

  const incidents = filterByHamlet(MOCK_SECURITY_INCIDENTS);
  const socialIssues = filterByHamlet(MOCK_SOCIAL_ISSUES);

  // 1. Total incidents in 2026
  const totalIncidents = incidents.length;

  // 2. Resolved incidents
  const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length;

  // 3. Under monitoring / processing
  const unresolvedIncidents = totalIncidents - resolvedIncidents;

  // 4. Militia force (commune level only)
  const def = MOCK_DEFENSE_STATISTICS.find((d) => d.year === targetYear);
  const milForce = def?.milForceCount || 0;

  // 5. Social issues monitored (active or underMonitoring)
  const activeSocialIssues = socialIssues.filter((s) => s.status !== 'resolved').length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        title="Tổng vụ việc ANTT"
        value={`${totalIncidents} vụ`}
        description="Ghi nhận trong năm 2026"
        icon={<Shield className="size-4 text-slate-500" />}
      />

      <MetricCard
        title="Vụ việc đã hòa giải"
        value={`${resolvedIncidents} vụ`}
        description={`Tỷ lệ: ${totalIncidents > 0 ? ((resolvedIncidents / totalIncidents) * 100).toFixed(1) : 0}%`}
        icon={<ShieldCheck className="size-4 text-emerald-500" />}
      />

      <MetricCard
        title="Đang xử lý / Theo dõi"
        value={`${unresolvedIncidents} vụ`}
        description="Ban Công an đang giải quyết"
        icon={<ShieldAlert className="size-4 text-rose-500" />}
      />

      <MetricCard
        title="Lực lượng dân quân"
        value={`${milForce} chiến sĩ`}
        description="Lực lượng tự vệ cơ động xã"
        icon={<Users className="size-4 text-blue-500" />}
      />

      <MetricCard
        title="Vấn đề xã hội cần lưu ý"
        value={`${activeSocialIssues} trường hợp`}
        description="Đang hỗ trợ và giám sát"
        icon={<HeartHandshake className="size-4 text-indigo-500" />}
      />
    </div>
  );
}
