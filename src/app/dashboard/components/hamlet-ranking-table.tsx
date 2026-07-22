'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';
import { HamletMetricSummary } from '@/types/dashboard';
import { formatVND } from './dashboard-kpi-grid';
import { cn } from '@/lib/utils';
import { Medal } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

interface HamletRankingTableProps {
  data: HamletMetricSummary[];
}

export function HamletRankingTable({ data }: HamletRankingTableProps) {
  // Sort hamlets by average income per capita descending
  const rankedHamlets = React.useMemo(() => {
    return [...data].sort((a, b) => b.averageIncomePerCapita - a.averageIncomePerCapita);
  }, [data]);

  // Find max income to calculate percentage weights for progress indicators
  const maxIncome = React.useMemo(() => {
    return Math.max(...data.map((h) => h.averageIncomePerCapita), 10000000);
  }, [data]);

  return (
    <SectionCard
      title="Bảng xếp hạng thôn"
      description="Đánh giá năng lực phát triển kinh tế dựa trên thu nhập bình quân đầu người"
      className="h-full"
    >
      <Table size="sm">
        <TableHeader className="bg-muted/40 border-b border-border/60">
          <TableRow className="hover:bg-transparent border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
            <TableHead className="w-12 text-center pb-2 text-xs">Hạng</TableHead>
            <TableHead className="pb-2 text-xs">Thôn</TableHead>
            <TableHead className="text-center pb-2 text-xs">Số hộ</TableHead>
            <TableHead className="text-right pb-2 text-xs">Bình quân đầu người</TableHead>
            <TableHead className="pb-2 pl-6 text-xs">Mức thu nhập đối sánh</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/40 font-medium">
          {rankedHamlets.map((item, index) => {
            const rank = index + 1;
            const ratio = (item.averageIncomePerCapita / maxIncome) * 100;
            
            // Colors for top ranks
            const isGold = rank === 1;
            const isSilver = rank === 2;
            const isBronze = rank === 3;

            return (
              <TableRow key={item.hamletCode} className="hover:bg-muted/30 transition-colors h-10">
                <TableCell className="text-center font-bold text-xs">
                  {rank <= 3 ? (
                    <span className="inline-flex items-center justify-center">
                      <Medal
                        className={cn(
                          "w-4 h-4",
                          isGold && "text-yellow-500 fill-yellow-500/20",
                          isSilver && "text-slate-400 fill-slate-400/20",
                          isBronze && "text-amber-700 fill-amber-700/20"
                        )}
                      />
                    </span>
                  ) : (
                    <span className="text-muted-foreground/80">{rank}</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-foreground text-xs">{item.hamletName}</TableCell>
                <TableCell className="text-center text-muted-foreground text-xs">{item.totalHouseholds}</TableCell>
                <TableCell className="text-right font-bold text-foreground text-xs">
                  {formatVND(item.averageIncomePerCapita, false)}
                </TableCell>
                <TableCell className="pl-6 w-1/3 text-xs">
                  <div className="flex items-center gap-3">
                    {/* Comparison Progress Bar */}
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden border border-border/10">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          isGold && "bg-gradient-to-r from-yellow-500 to-amber-500",
                          isSilver && "bg-slate-400",
                          isBronze && "bg-amber-700",
                          rank > 3 && "bg-primary"
                        )}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 w-8 text-right font-sans font-bold">
                      {ratio.toFixed(0)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
