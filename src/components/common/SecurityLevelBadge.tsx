// src/components/common/SecurityLevelBadge.tsx

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SecurityLevel } from '@/types';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface SecurityLevelBadgeProps {
  level: SecurityLevel;
  className?: string;
  showIcon?: boolean;
}

const SECURITY_LEVEL_MAP: Record<SecurityLevel, { label: string; theme: string; icon: React.ReactNode }> = {
  public: {
    label: 'Công khai',
    theme: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    icon: <Eye className="size-3" />
  },
  shared: {
    label: 'Nội bộ',
    theme: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    icon: <EyeOff className="size-3" />
  },
  confidential: {
    label: 'Mật (Confidential)',
    theme: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 font-bold',
    icon: <ShieldAlert className="size-3" />
  }
};

export function SecurityLevelBadge({ level, className, showIcon = true }: SecurityLevelBadgeProps) {
  const config = SECURITY_LEVEL_MAP[level] || {
    label: level,
    theme: 'bg-muted text-muted-foreground border-border',
    icon: null
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2 py-0.5 rounded-md text-[10px] font-medium border shadow-none select-none tracking-wide flex items-center gap-1 w-fit",
        config.theme,
        className
      )}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </Badge>
  );
}
