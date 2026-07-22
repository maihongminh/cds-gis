"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartEmptyState } from "./chart-empty-state";
import { ChartAccessibleSummary, AccessibleColumn } from "./chart-accessible-summary";
import { cn } from "@/lib/utils";

export interface ChartShellProps {
  /** Chart title */
  title?: string;
  /** Subtitle or description */
  description?: string;
  /** Is the chart currently loading data? */
  loading?: boolean;
  /** Custom loader fallback element */
  loadingFallback?: React.ReactNode;
  /** Is the data empty? */
  isEmpty?: boolean;
  /** Message to display when empty */
  emptyMessage?: string;
  /** Summary message for screen-readers and accessibility description */
  accessibleSummary?: string;
  /** Tabular data equivalent for accessibility data table */
  accessibleData?: Record<string, unknown>[];
  /** Column configurations for the accessibility table */
  accessibleColumns?: AccessibleColumn[];
  /** Outer container className override */
  className?: string;
  /** Header section className override */
  headerClassName?: string;
  /** Content section className override */
  contentClassName?: string;
  /** Chart canvas/svg wrapper className override */
  chartContainerClassName?: string;
  children: React.ReactNode;
}

export function ChartShell({
  title,
  description,
  loading = false,
  loadingFallback,
  isEmpty = false,
  emptyMessage,
  accessibleSummary,
  accessibleData,
  accessibleColumns,
  className,
  headerClassName,
  contentClassName,
  chartContainerClassName,
  children,
}: ChartShellProps) {
  // Render loading state
  const renderLoading = () => {
    if (loadingFallback) {
      return loadingFallback;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] gap-3 bg-muted/5 border border-border/20 rounded-xl">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs font-semibold text-muted-foreground animate-pulse">
          Đang tải dữ liệu biểu đồ...
        </span>
      </div>
    );
  };

  // Render main content
  const renderContent = () => {
    if (loading) {
      return renderLoading();
    }
    if (isEmpty) {
      return <ChartEmptyState message={emptyMessage} />;
    }
    return <div className={cn("relative w-full h-[240px]", chartContainerClassName)}>{children}</div>;
  };

  return (
    <Card className={cn("overflow-hidden border border-border/40 shadow-sm bg-card hover:shadow-md transition-shadow duration-200", className)}>
      {(title || description) && (
        <CardHeader className={cn("pb-2.5 space-y-1.5", headerClassName)}>
          {title && (
            <CardTitle className="text-base font-bold tracking-tight text-foreground flex items-center justify-between">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-xs text-muted-foreground leading-normal">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent className={cn("space-y-4", contentClassName)}>
        {/* Chart content area */}
        {renderContent()}

        {/* Accessibility block */}
        {accessibleSummary && (
          <ChartAccessibleSummary
            summary={accessibleSummary}
            data={accessibleData}
            columns={accessibleColumns}
            className="pt-2 border-t border-border/30"
          />
        )}
      </CardContent>
    </Card>
  );
}

export default ChartShell;
