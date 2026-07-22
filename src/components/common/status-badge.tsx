import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string | boolean;
  customLabel?: string;
  className?: string;
}

const STATUS_MAP: Record<string, { label: string; theme: string }> = {
  // Common states
  active: { label: 'Đang hoạt động', theme: 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
  inactive: { label: 'Tạm ngưng', theme: 'bg-slate-500/5 text-slate-700 dark:text-slate-400 border-slate-500/20' },
  archived: { label: 'Lưu trữ', theme: 'bg-zinc-500/5 text-zinc-700 dark:text-zinc-400 border-zinc-500/20' },
  changed: { label: 'Có biến động', theme: 'bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20' },

  // Land states
  granted: { label: 'Đã cấp sổ', theme: 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
  pending: { label: 'Chờ duyệt', theme: 'bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20' },
  none: { label: 'Chưa cấp sổ', theme: 'bg-rose-500/5 text-rose-700 dark:text-rose-400 border-rose-500/20' },

  // DVMTR Payment states
  paid: { label: 'Đã chi trả', theme: 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
  partially_paid: { label: 'Chi trả một phần', theme: 'bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20' },

  // Diseases states
  monitoring: { label: 'Đang theo dõi', theme: 'bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20' },
  quarantined: { label: 'Cách ly', theme: 'bg-rose-500/5 text-rose-700 dark:text-rose-400 border-rose-500/20' },
  treated: { label: 'Đã xử lý dứt điểm', theme: 'bg-blue-500/5 text-blue-700 dark:text-blue-400 border-blue-500/20' },

  // Report states
  completed: { label: 'Đã hoàn thành', theme: 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
  processing: { label: 'Đang xử lý', theme: 'bg-blue-500/5 text-blue-700 dark:text-blue-400 border-blue-500/20 animate-pulse' },
  failed: { label: 'Lỗi', theme: 'bg-rose-500/5 text-rose-700 dark:text-rose-400 border-rose-500/20' },

  // Boolean flags
  true: { label: 'Bật', theme: 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
  false: { label: 'Tắt', theme: 'bg-slate-500/5 text-slate-700 dark:text-slate-400 border-slate-500/20' },
};

export function StatusBadge({ status, customLabel, className }: StatusBadgeProps) {
  const statusStr = typeof status === 'boolean' ? String(status) : status;
  const config = STATUS_MAP[statusStr] || { label: statusStr, theme: 'bg-muted text-muted-foreground border-border' };

  const label = customLabel || config.label;

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-medium border shadow-none select-none tracking-wide",
        config.theme,
        className
      )}
    >
      {label}
    </Badge>
  );
}
