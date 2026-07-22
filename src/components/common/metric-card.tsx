import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number | string;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
  loading = false,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className={cn("bg-card border-border  overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <Skeleton className="h-4 w-24 bg-muted" />
          <Skeleton className="h-8 w-8 rounded-full bg-muted" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-36 bg-muted" />
          <Skeleton className="size-48 bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-card border-border transition-all duration-300 relative group overflow-hidden", className)}>
      {/* Decorative colored glow on top hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-primary/30 via-primary to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300 bg-muted/30 p-1.5 rounded-lg border border-border/40">
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-xl 2xl:text-2xl font-bold tracking-tight text-foreground font-sans">
          {value}
        </div>

        {(trend || description) && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md",
                  trend.isPositive
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="size-4" />
                ) : (
                  <ArrowDownRight className="size-4" />
                )}
                {trend.value}%
              </span>
            )}
            {trend?.label && (
              <span className="text-muted-foreground font-medium">{trend.label}</span>
            )}
            {!trend && description && (
              <span className="text-muted-foreground font-medium">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
