// src/app/dashboard/map/components/map-summary.tsx
// Small stats card — computed from mock data, never hard-coded.
'use client';

import * as React from 'react';
import { Map, Compass, Building2, AlertTriangle } from 'lucide-react';
import { MOCK_TOURISM_POIS } from '@/data/mock-map-tourism-pois';
import { MOCK_PUBLIC_FACILITIES } from '@/data/mock-map-public-facilities';
import { MOCK_DISASTER_RISK_ZONES } from '@/data/mock-map-disaster-risks';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { cn } from '@/lib/utils';

const stats = [
  {
    icon: Map,
    label: 'Thôn',
    value: VILLAGES.length,
    sub: 'đơn vị',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Compass,
    label: 'Du lịch & Di tích',
    value: MOCK_TOURISM_POIS.length,
    sub: 'điểm',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Building2,
    label: 'Công trình Công cộng',
    value: MOCK_PUBLIC_FACILITIES.length,
    sub: 'công trình',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: AlertTriangle,
    label: 'Cảnh báo',
    value: MOCK_DISASTER_RISK_ZONES.length,
    sub: `${MOCK_DISASTER_RISK_ZONES.filter((z) => z.riskLevel === 'high' || z.riskLevel === 'critical').length} cao/khẩn cấp`,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
] as const;

export function MapSummary({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4', className)}>
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-card border border-border/50 shadow-xs"
          >
            <div className={cn('rounded-md p-1.5 shrink-0', s.bg)}>
              <Icon className={cn('size-4', s.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase text-muted-foreground truncate mb-2">{s.label}</p>
              <p className="text-sm font-bold text-foreground leading-tight">
                {s.value}{' '}
                <span className="text-xs font-normal text-muted-foreground">{s.sub}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
