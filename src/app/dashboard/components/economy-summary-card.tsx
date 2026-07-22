'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';
import { MOCK_HOUSEHOLD_ECONOMY } from '@/data/mock-household-economy';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { formatVND } from './dashboard-kpi-grid';
import { cn } from '@/lib/utils';
import { Wallet, Landmark, TrendingUp, Sparkles } from 'lucide-react';

interface EconomySummaryCardProps {
  selectedHamletCode: string;
}

export function EconomySummaryCard({ selectedHamletCode }: EconomySummaryCardProps) {
  // Aggregate revenue streams dynamically
  const econSummary = React.useMemo(() => {
    const hamletHhs = selectedHamletCode === 'all'
      ? MOCK_HOUSEHOLDS
      : MOCK_HOUSEHOLDS.filter(hh => hh.hamletCode === selectedHamletCode);

    const hhIds = new Set(hamletHhs.map(h => h.id));
    const filteredEcon = MOCK_HOUSEHOLD_ECONOMY.filter(e => hhIds.has(e.householdId) && e.status === 'active');

    const cropRev = filteredEcon.reduce((sum, e) => sum + e.cropRevenue, 0);
    const liveRev = filteredEcon.reduce((sum, e) => sum + e.livestockRevenue, 0);
    const forestRev = filteredEcon.reduce((sum, e) => sum + e.forestDvmtrRevenue, 0);
    const otherRev = filteredEcon.reduce((sum, e) => sum + e.otherRevenue, 0);

    const totalRev = cropRev + liveRev + forestRev + otherRev;
    const totalCost = filteredEcon.reduce((sum, e) => sum + e.totalCost, 0);
    const netIncome = totalRev - totalCost;

    const margin = totalRev > 0 ? (netIncome / totalRev) * 100 : 0;

    return {
      cropRev,
      liveRev,
      forestRev,
      otherRev,
      totalRev,
      totalCost,
      netIncome,
      margin,
    };
  }, [selectedHamletCode]);

  const streams = [
    { label: 'Trồng trọt (Sâm, Quế, Lúa)', value: econSummary.cropRev, percentage: econSummary.totalRev > 0 ? (econSummary.cropRev / econSummary.totalRev) * 100 : 0, color: 'bg-emerald-500' },
    { label: 'Chăn nuôi (Bò, Heo đen)', value: econSummary.liveRev, percentage: econSummary.totalRev > 0 ? (econSummary.liveRev / econSummary.totalRev) * 100 : 0, color: 'bg-orange-500' },
    { label: 'Khoán bảo vệ rừng DVMTR', value: econSummary.forestRev, percentage: econSummary.totalRev > 0 ? (econSummary.forestRev / econSummary.totalRev) * 100 : 0, color: 'bg-teal-600' },
    { label: 'Lao động & Thu nhập khác', value: econSummary.otherRev, percentage: econSummary.totalRev > 0 ? (econSummary.otherRev / econSummary.totalRev) * 100 : 0, color: 'bg-slate-400' },
  ].sort((a, b) => b.value - a.value);

  return (
    <SectionCard
      title="Cơ cấu thu nhập kinh tế hộ"
      description="Chi tiết các luồng doanh thu và tỷ suất lợi nhuận ròng của các hộ dân"
      className="h-full"
    >
      <div className="space-y-6">
        {/* Main margin block */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <Sparkles className="size-4" />
              Hiệu quả kinh tế hộ ròng
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              {formatVND(econSummary.netIncome, false)}
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              Doanh thu: {formatVND(econSummary.totalRev, true)} | Chi phí sản xuất: {formatVND(econSummary.totalCost, true)}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 bg-card border border-border px-3.5 py-2.5 rounded-xl shadow-xs">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Tỷ suất sinh lời</span>
              <span className="text-sm font-bold text-foreground font-sans">
                {econSummary.margin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Revenue stream breakdown progress bars */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="size-4 text-muted-foreground" />
            Các dòng thu nhập chính
          </h4>
          <div className="space-y-3.5">
            {streams.map((stream, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground font-medium truncate pr-4">{stream.label}</span>
                  <div className="text-foreground flex items-center gap-2 font-sans">
                    <span>{formatVND(stream.value, true)}</span>
                    <span className="text-[10px] text-muted-foreground/60">({stream.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/10">
                  <div
                    className={cn("h-full rounded-full transition-all duration-1000", stream.color)}
                    style={{ width: `${stream.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
