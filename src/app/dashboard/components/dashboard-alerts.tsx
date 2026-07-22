'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';
import { DashboardAlert } from '@/types/dashboard';
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardAlertsProps {
  alerts: DashboardAlert[];
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  return (
    <SectionCard
      title="Cảnh báo & Chỉ thị nghiệp vụ"
      description="Các biến động dịch bệnh chăn nuôi, nông nghiệp và khuyến nghị điều phối chính sách cấp thiết"
      className="h-full"
    >
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground bg-muted/10 border border-dashed border-border/80 rounded-xl">
            <Info className="w-8 h-8 opacity-40 mb-2 text-primary" />
            <span className="text-xs font-semibold">Hiện không có cảnh báo nào tại khu vực này</span>
            <span className="text-[10px] opacity-60">Các chỉ thị dịch bệnh và biến động kinh tế sẽ xuất hiện ở đây</span>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isInfo = alert.severity === 'info';

            return (
              <div
                key={alert.id}
                className={cn(
                  "flex gap-3 p-3.5 border rounded-xl transition-all duration-200 group text-xs",
                  isCritical && "bg-rose-500/5 border-rose-500/20 text-rose-950 dark:text-rose-200",
                  isWarning && "bg-amber-500/5 border-amber-500/20 text-amber-950 dark:text-amber-200",
                  isInfo && "bg-blue-500/5 border-blue-500/20 text-blue-950 dark:text-blue-200"
                )}
              >
                {/* Visual Icon indicator */}
                <div className="flex-shrink-0 mt-0.5">
                  {isCritical && <ShieldAlert className="w-4 h-4 text-rose-500" />}
                  {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {isInfo && <Info className="w-4 h-4 text-blue-500" />}
                </div>

                {/* Alert details */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-4 font-semibold">
                    <span className="font-bold text-[12px]">{alert.title}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-sans font-medium whitespace-nowrap">
                      {alert.date}
                    </span>
                  </div>
                  <p className="leading-relaxed font-medium text-muted-foreground text-xs">
                    {alert.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
}
