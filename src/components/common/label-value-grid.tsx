import * as React from 'react';
import { cn } from '@/lib/utils';

interface GridItem {
  label: string;
  value: React.ReactNode;
  span?: number; // grid column spans
}

interface LabelValueGridProps {
  items: GridItem[];
  columns?: number;
  className?: string;
}

export function LabelValueGrid({
  items,
  columns = 2,
  className,
}: LabelValueGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {items.map((item, index) => {
        const colSpan = item.span 
          ? `sm:col-span-${item.span}` 
          : '';

        return (
          <div
            key={index}
            className={cn(
              "space-y-1 pb-3 sm:pb-0 border-b border-border/30 sm:border-0 last:border-0",
              colSpan
            )}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/85">
              {item.label}
            </div>
            <div className="text-xs font-semibold text-foreground leading-normal">
              {item.value !== null && item.value !== undefined && item.value !== '' 
                ? item.value 
                : <span className="text-muted-foreground/50 font-normal">Chưa cập nhật</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
