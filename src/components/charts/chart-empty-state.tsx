"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChartEmptyStateProps {
  message?: string;
  className?: string;
}

export function ChartEmptyState({
  message = "Không có dữ liệu hiển thị",
  className,
}: ChartEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[240px] p-6 text-center border border-dashed border-border/60 rounded-xl bg-muted/20 animate-fade-in",
        className
      )}
    >
      <div className="flex items-center justify-center size-10 rounded-full bg-muted/40 text-muted-foreground/60 mb-3">
        <Inbox className="size-5" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

export default ChartEmptyState;
