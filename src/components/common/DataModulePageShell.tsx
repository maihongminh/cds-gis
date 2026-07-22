// src/components/common/DataModulePageShell.tsx

import * as React from 'react';
import { PageHeader } from './page-header';
import { MetricCard } from './metric-card';

interface MetricInfo {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface DataModulePageShellProps {
  title: string;
  description: string;
  metrics?: MetricInfo[];
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DataModulePageShell({
  title,
  description,
  metrics,
  filters,
  actions,
  children,
  className
}: DataModulePageShellProps) {
  return (
    <div className={`space-y-6 pb-10 animate-fade-in ${className || ''}`}>
      {/* Header section */}
      <PageHeader title={title} description={description} actions={actions} />

      {/* Metrics Section */}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => (
            <MetricCard
              key={idx}
              title={m.title}
              value={m.value}
              description={m.description}
              icon={<m.icon className="size-4" />}
              trend={m.trend}
            />
          ))}
        </div>
      )}

      {/* Filters Section */}
      {filters && (
        <div className="bg-card border border-border p-4.5 rounded-xl shadow-2xs space-y-3">
          {filters}
        </div>
      )}

      {/* Content Section */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
export type { MetricInfo };
