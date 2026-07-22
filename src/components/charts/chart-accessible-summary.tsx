"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Table as TableIcon } from "lucide-react";
import { useState } from "react";

export interface AccessibleColumn {
  key: string;
  label: string;
  format?: (val: unknown) => string;
}

export interface ChartAccessibleSummaryProps {
  /** Screen reader description text */
  summary: string;
  /** Tabular data matching the chart */
  data?: Record<string, unknown>[];
  /** Column definitions for the accessibility table */
  columns?: AccessibleColumn[];
  /** Allow users to toggle visual data table equivalent. Default: true */
  allowVisualTable?: boolean;
  className?: string;
}

export function ChartAccessibleSummary({ summary, data, columns, allowVisualTable = true, className }: ChartAccessibleSummaryProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Screen Reader Only Summary */}
      <div className="sr-only" aria-live="polite">
        <h3>Mô tả dữ liệu biểu đồ</h3>
        <p>{summary}</p>
      </div>

      {/* Visual toggleable data table for accessibility */}
      {allowVisualTable && data && columns && columns.length > 0 && (
        <div className="mt-3 border border-border/40 rounded-lg p-2.5 bg-muted/5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <TableIcon className="size-3.5" />
              <span>Bảng dữ liệu tương đương (Hỗ trợ đọc màn hình)</span>
            </span>
            <Button variant="ghost" size="sm" onClick={() => setShowTable(!showTable)} className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground">
              {showTable ? (
                <>
                  <EyeOff className="size-3 mr-1" />
                  <span>Ẩn bảng dữ liệu</span>
                </>
              ) : (
                <>
                  <Eye className="size-3 mr-1" />
                  <span>Xem bảng dữ liệu</span>
                </>
              )}
            </Button>
          </div>

          {showTable && (
            <div className="mt-2.5 overflow-x-auto border border-border/30 rounded-md">
              <Table className="min-w-full text-xs">
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/40">
                    {columns.map((col) => (
                      <TableHead key={col.key} className="h-8 font-bold text-muted-foreground">
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/10">
                      {columns.map((col) => {
                        const val = row[col.key];
                        return (
                          <TableCell key={col.key} className="py-2 font-medium">
                            {col.format ? col.format(val) : String(val ?? "-")}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChartAccessibleSummary;
