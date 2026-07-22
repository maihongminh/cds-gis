import * as React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'Không tìm thấy dữ liệu',
  description = 'Hệ thống hiện không có thông tin khớp với điều kiện tìm kiếm hoặc dữ liệu trống.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-16 border border-dashed border-border/80 rounded-xl bg-card/40 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/60 border border-border/40 text-muted-foreground mb-4">
        {icon || <Inbox className="w-6 h-6 text-muted-foreground/60" />}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground max-w-sm mt-1.5 leading-relaxed font-medium">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
