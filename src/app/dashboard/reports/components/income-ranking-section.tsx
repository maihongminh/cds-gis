'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';
import { MOCK_HAMLETS } from '@/data/mock-administrative-units';
import { HouseholdEconomyRecord } from '@/types/household-economy';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { formatVND } from '../../components/dashboard-kpi-grid';
import { CheckCircle2, AlertTriangle, Trophy } from 'lucide-react';

interface IncomeRankingSectionProps {
  economyData: HouseholdEconomyRecord[];
}

export function IncomeRankingSection({ economyData }: IncomeRankingSectionProps) {
  // Target benchmark for per capita income (e.g. Rural target standard is 35M / year)
  const TARGET_BENCHMARK = 35000000;

  // Calculate average per-capita income for each hamlet
  const hamletRankings = React.useMemo(() => {
    // Map household IDs to hamlet codes
    const hhHamletMap = new Map(MOCK_HOUSEHOLDS.map((h) => [h.id, h.hamletCode]));

    const totals: Record<string, { totalIncome: number; count: number }> = {};
    MOCK_HAMLETS.forEach((h) => {
      totals[h.code] = { totalIncome: 0, count: 0 };
    });

    economyData.forEach((rec) => {
      const hCode = hhHamletMap.get(rec.householdId);
      if (hCode && totals[hCode]) {
        totals[hCode].totalIncome += rec.incomePerCapita;
        totals[hCode].count += 1;
      }
    });

    return MOCK_HAMLETS.map((h) => {
      const { totalIncome, count } = totals[h.code] || { totalIncome: 0, count: 0 };
      const avgIncome = count > 0 ? Math.round(totalIncome / count) : 0;
      return {
        code: h.code,
        name: h.name,
        avgIncome,
        count,
        percentOfTarget: Math.min(100, Math.round((avgIncome / TARGET_BENCHMARK) * 100)),
        isQualified: avgIncome >= TARGET_BENCHMARK,
      };
    }).sort((a, b) => b.avgIncome - a.avgIncome);
  }, [economyData]);

  const getMedalColor = (idx: number) => {
    if (idx === 0) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'; // gold
    if (idx === 1) return 'text-slate-400 bg-slate-400/10 border-slate-400/20'; // silver
    if (idx === 2) return 'text-amber-700 bg-amber-700/10 border-amber-700/20'; // bronze
    return 'text-muted-foreground bg-muted border-border/50';
  };

  return (
    <SectionCard
      title="Báo cáo thu nhập bình quân đầu người theo thôn"
      description="Đánh giá kết quả thu nhập bình quân đầu người của 8 thôn trực thuộc xã so với chỉ tiêu Nông thôn mới (35.000.000 VNĐ / người / năm)"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rankings List */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5 uppercase tracking-wider">
            <Trophy className="size-4 text-amber-500" />
            Bảng xếp hạng bình quân các thôn
          </h4>

          <div className="space-y-3.5">
            {hamletRankings.map((h, idx) => (
              <div key={h.code} className="space-y-1 bg-card hover:bg-muted/10 p-2.5 rounded-xl border border-border/50 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-md border flex items-center justify-center font-mono font-bold text-[10px] ${getMedalColor(idx)}`}>
                      {idx + 1}
                    </span>
                    <span className="font-bold text-foreground">{h.name}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-semibold">({h.count} hộ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-sans text-primary">{formatVND(h.avgIncome, false)}</span>
                    {h.isQualified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </div>

                <div className="relative w-full bg-muted/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${h.isQualified ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${h.percentOfTarget}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold">
                  <span>Tiến trình đạt chuẩn</span>
                  <span>{h.percentOfTarget}% chỉ tiêu</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Summary Box */}
        <div className="border border-border/60 rounded-xl p-4 bg-muted/5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground border-b border-border/40 pb-1.5 uppercase tracking-wider">
              Hiện trạng nông thôn mới
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Theo quy định định mức xã Nông thôn mới vùng Trung du miền núi phía Bắc, tiêu chí thu nhập đạt chuẩn tối thiểu là <strong>35.000.000 VNĐ / người / năm</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Đã đạt chuẩn</h5>
                <p className="text-[10px] text-muted-foreground/90 mt-0.5">
                  Có <strong>{hamletRankings.filter((h) => h.isQualified).length} / 8 thôn</strong> đạt thu nhập bình quân đầu người trên chuẩn quy định.
                </p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Cần nỗ lực bổ sung</h5>
                <p className="text-[10px] text-muted-foreground/90 mt-0.5">
                  Có <strong>{hamletRankings.filter((h) => !h.isQualified).length} / 8 thôn</strong> chưa đạt chỉ số thu nhập (phần lớn là vùng khó khăn, thôn vùng cao).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
