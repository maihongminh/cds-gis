// src/components/common/WorkflowStatusBadge.tsx

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { WorkflowStatus } from '@/types';

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus;
  className?: string;
}

const WORKFLOW_STATUS_MAP: Record<WorkflowStatus, { label: string; theme: string }> = {
  draft: {
    label: 'Bản nháp',
    theme: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20'
  },
  submitted: {
    label: 'Chờ duyệt',
    theme: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 animate-pulse'
  },
  unit_approved: {
    label: 'Đã duyệt (Phòng)',
    theme: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20'
  },
  governance_approved: {
    label: 'Đã thẩm định',
    theme: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20'
  },
  published: {
    label: 'Đã công bố',
    theme: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
  },
  archived: {
    label: 'Lưu trữ',
    theme: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20'
  },
  returned: {
    label: 'Trả lại',
    theme: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
  }
};

export function WorkflowStatusBadge({ status, className }: WorkflowStatusBadgeProps) {
  const config = WORKFLOW_STATUS_MAP[status] || {
    label: status,
    theme: 'bg-muted text-muted-foreground border-border'
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-semibold border shadow-none select-none tracking-wide",
        config.theme,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
