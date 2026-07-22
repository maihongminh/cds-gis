import * as React from 'react';
import { SectionCard } from '@/components/common';
import { MOCK_HOUSEHOLD_ECONOMY } from '@/data/mock-household-economy';
import { formatVND } from '../../../components/dashboard-kpi-grid';
import { Landmark, TrendingUp, HelpCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HouseholdEconomyTabProps {
  householdId: string;
}

export function HouseholdEconomyTab({ householdId }: HouseholdEconomyTabProps) {
  // Find economy record for the household
  const record = React.useMemo(() => {
    return MOCK_HOUSEHOLD_ECONOMY.find((e) => e.householdId === householdId && e.year === 2026);
  }, [householdId]);

  if (!record) {
    return (
      <div className="text-center py-12 text-muted-foreground text-xs bg-card border border-border rounded-xl">
        Chưa có số liệu tài chính năm 2026 cho hộ dân này.
      </div>
    );
  }

  const margin = record.totalRevenue > 0 ? (record.netIncome / record.totalRevenue) * 100 : 0;

  const streams = [
    { label: 'Doanh thu Trồng trọt', value: record.cropRevenue, color: 'bg-emerald-500' },
    { label: 'Doanh thu Chăn nuôi', value: record.livestockRevenue, color: 'bg-orange-500' },
    { label: 'Doanh thu Khoán rừng DVMTR', value: record.forestDvmtrRevenue, color: 'bg-teal-600' },
    { label: 'Thu nhập khác', value: record.otherRevenue, color: 'bg-slate-400' },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* 1. Profit Margin summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard title="Tổng doanh thu" className="md:col-span-1">
          <div className="space-y-3.5">
            <div className="text-3xl font-extrabold text-foreground font-sans">
              {formatVND(record.totalRevenue, false)}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Ước tính doanh thu gộp từ mọi hoạt động canh tác và hỗ trợ lâm nghiệp năm 2026.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Tổng chi phí sản xuất" className="md:col-span-1">
          <div className="space-y-3.5">
            <div className="text-3xl font-extrabold text-rose-500 font-sans">
              {formatVND(record.totalCost, false)}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Chi phí hạt giống, phân bón, thức ăn gia súc, thú y và sửa sang chuồng trại.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Thu nhập ròng hàng năm" className="md:col-span-1 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <div className="space-y-3.5">
            <div className="text-3xl font-extrabold text-primary font-sans">
              {formatVND(record.netIncome, false)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <TrendingUp className="size-4 text-emerald-500" />
              <span>Tỷ suất sinh lời: <strong>{margin.toFixed(1)}%</strong></span>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Streams chart breakdown */}
        <SectionCard title="Cơ cấu các luồng thu nhập">
          <div className="space-y-4">
            {streams.map((s, idx) => {
              const share = record.totalRevenue > 0 ? (s.value / record.totalRevenue) * 100 : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground font-medium">{s.label}</span>
                    <span className="text-foreground font-sans">
                      {formatVND(s.value, true)} ({share.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/10">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", s.color)}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* 3. Support Policies checklist */}
        <SectionCard title="Chính sách trợ cấp nông nghiệp & xã hội">
          {record.supportPoliciesReceived.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              Hộ gia đình hiện chưa thuộc đối tượng hỗ trợ đặc thù trong năm nay.
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Các chính sách phúc lợi và chương trình nông thôn được chi trả trực tiếp cho hộ dân:
              </p>
              {record.supportPoliciesReceived.map((policy, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-foreground bg-muted/20 border border-border/40 p-3 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-semibold">{policy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
