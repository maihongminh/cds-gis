import * as React from 'react';
import { SectionCard } from '@/components/common';
import { MOCK_AUDIT_LOGS } from '@/data/mock-audit-logs';
import { Household } from '@/types/household';
import { History, User, Laptop } from 'lucide-react';

interface HouseholdHistoryTabProps {
  household: Household;
}

export function HouseholdHistoryTab({ household }: HouseholdHistoryTabProps) {
  // Filter audit logs related to this household
  const relatedLogs = React.useMemo(() => {
    const queryName = household.headName.toLowerCase();
    const queryCode = household.code.toLowerCase();

    return MOCK_AUDIT_LOGS.filter((log) => {
      const desc = log.description.toLowerCase();
      const action = log.action.toLowerCase();
      return desc.includes(queryName) || desc.includes(queryCode) || action.includes(queryCode);
    });
  }, [household]);

  const formatTimestamp = (val: string) => {
    const date = new Date(val);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SectionCard title="Nhật ký biến động & Lịch sử thao tác">
      {relatedLogs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-xs bg-muted/10 border border-dashed border-border/80 rounded-xl">
          <History className="w-8 h-8 opacity-35 mb-2 mx-auto text-primary" />
          <span>Không tìm thấy lịch sử thay đổi liên quan đến hộ dân này</span>
        </div>
      ) : (
        <div className="relative border-l border-border pl-6 space-y-6 ml-3 py-2 text-xs">
          {relatedLogs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Timeline marker node circle */}
              <div className="absolute -left-[31px] top-1 bg-background border-2 border-primary w-4.5 h-4.5 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-200">
                <div className="w-1.5 h-1.5 bg-primary group-hover:bg-background rounded-full" />
              </div>

              {/* Log node details */}
              <div className="space-y-1 bg-card border border-border/40 hover:border-border p-3.5 rounded-xl transition-colors">
                <div className="flex items-center justify-between gap-4 font-semibold text-foreground/90">
                  <span className="text-sm font-bold text-foreground">{log.action}</span>
                  <span className="text-[10px] text-muted-foreground/60 font-sans font-medium whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                  {log.description}
                </p>

                <div className="flex items-center gap-3 pt-2 text-[10px] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1">
                    <User className="size-4 text-muted-foreground/50" />
                    Thực hiện: {log.userFullName} ({log.role})
                  </span>
                  {log.ipAddress && (
                    <span className="flex items-center gap-1 font-mono">
                      <Laptop className="size-4 text-muted-foreground/50" />
                      IP: {log.ipAddress}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
