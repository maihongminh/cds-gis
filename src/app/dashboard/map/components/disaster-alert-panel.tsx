// src/app/dashboard/map/components/disaster-alert-panel.tsx
// Compact disaster alert summary card showing counts per risk level.
'use client';

import * as React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { MOCK_DISASTER_RISK_ZONES } from '@/data/mock-map-disaster-risks';
import { RISK_LEVEL_LABELS } from '@/lib/map-style-config';
import type { RiskLevel } from '@/types/map';
import { cn } from '@/lib/utils';

const LEVELS: RiskLevel[] = ['critical', 'high', 'medium', 'low'];

const LEVEL_CONFIG: Record<RiskLevel, { dot: string; text: string; border: string }> = {
  critical: {
    dot: 'bg-red-900',
    text: 'text-red-900 dark:text-red-300',
    border: 'border-red-900/30 dark:border-red-700/30',
  },
  high: {
    dot: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/20',
  },
  medium: {
    dot: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20',
  },
  low: {
    dot: 'bg-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-500/20',
  },
};

const counts = LEVELS.reduce<Record<RiskLevel, number>>(
  (acc, l) => {
    acc[l] = MOCK_DISASTER_RISK_ZONES.filter((z) => z.riskLevel === l).length;
    return acc;
  },
  { critical: 0, high: 0, medium: 0, low: 0 }
);

const activeCount = MOCK_DISASTER_RISK_ZONES.filter(
  (z) => z.status === 'warning' || z.status === 'active'
).length;

interface DisasterAlertPanelProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DisasterAlertPanel({
  className,
  collapsed = false,
  onToggleCollapse,
}: DisasterAlertPanelProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border/60 bg-card/95 backdrop-blur-sm shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Toggle header */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between p-2 text-[10px] font-bold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
        aria-label={collapsed ? 'Mở theo dõi cảnh báo' : 'Thu gọn theo dõi cảnh báo'}
      >
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="size-3.5 text-red-500 shrink-0" />
          <span className="tracking-wider">Theo dõi cảnh báo</span>
          {collapsed && activeCount > 0 && (
            <span className="text-[8px] font-bold text-white bg-red-500 px-1 py-0.5 rounded-full shrink-0">
              {activeCount}
            </span>
          )}
        </div>
        <span className="text-muted-foreground">{collapsed ? '▲' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 pt-2 space-y-2 border-t border-border/50">
          {activeCount > 0 && (
            <div className="flex justify-start">
              <span className="text-[8px] font-bold text-white bg-red-500 px-1.5 pt-0.5 pb-1 rounded-full">
                {activeCount} đang cảnh báo
              </span>
            </div>
          )}

          {/* Level rows */}
          <div className="space-y-1">
            {LEVELS.map((level) => {
              const cfg = LEVEL_CONFIG[level];
              const count = counts[level];
              return (
                <div
                  key={level}
                  className={cn(
                    'flex items-center justify-between px-2 py-1 rounded-md border text-[10px]',
                    cfg.border
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={cn('size-2 rounded-full shrink-0', cfg.dot)} />
                    <span className={cn('font-medium', cfg.text)}>{RISK_LEVEL_LABELS[level]}</span>
                  </div>
                  <span className={cn('font-bold tabular-nums', cfg.text)}>{count}</span>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <p className="text-[8px] text-muted-foreground leading-relaxed">
            * Dữ liệu mô phỏng. Không dùng để quyết định pháp lý.
          </p>
        </div>
      )}
    </div>
  );
}
