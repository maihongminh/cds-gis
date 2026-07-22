// src/components/common/VersionTimeline.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, User } from "lucide-react";
import * as React from "react";

interface TimelineEvent {
  version: number;
  author: string;
  timestamp: string;
  action: string;
  details?: string;
}

interface VersionTimelineProps {
  currentVersion: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  publishedAt?: string;
  className?: string;
}

export function VersionTimeline({ currentVersion, createdBy, createdAt, updatedBy, updatedAt, publishedAt, className }: VersionTimelineProps) {
  // Generate timeline entries dynamically from record meta
  const events = React.useMemo(() => {
    const list: TimelineEvent[] = [];

    // 1. Initial creation
    list.push({
      version: 1,
      author: createdBy,
      timestamp: createdAt,
      action: "Khởi tạo hồ sơ nháp",
      details: "Nhập thông tin ban đầu lên biểu mẫu trực tuyến.",
    });

    // 2. Edits (if version is higher than 1)
    if (currentVersion > 1) {
      list.push({
        version: currentVersion - 1,
        author: updatedBy,
        timestamp: updatedAt,
        action: "Cập nhật nội dung",
        details: `Cán bộ cập nhật dữ liệu báo cáo, nâng cấp lên phiên bản v${currentVersion}.`,
      });
    }

    // 3. Submissions / Approvals
    if (publishedAt) {
      list.push({
        version: currentVersion,
        author: "Lãnh đạo UBND",
        timestamp: publishedAt,
        action: "Phê duyệt & Công bố",
        details: "Hồ sơ đạt tiêu chuẩn chất lượng và được công bố công khai lên CSDL dùng chung.",
      });
    }

    // Reverse to show latest first
    return list.reverse();
  }, [currentVersion, createdBy, createdAt, updatedBy, updatedAt, publishedAt]);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="py-3 px-4 border-b border-border/60">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <GitBranch className="size-3.5 text-primary" />
          Lịch sử phiên bản (Audit Log)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative pl-4 border-l border-border/80 space-y-5">
          {events.map((event, index) => {
            const isLatest = index === 0;
            return (
              <div key={event.version + "-" + index} className="relative">
                {/* Timeline dot */}
                <span
                  className={`absolute -left-[21px] top-0.5 flex size-2.5 items-center justify-center rounded-full border ${
                    isLatest ? "bg-primary border-primary ring-4 ring-primary/10" : "bg-background border-muted-foreground/40"
                  }`}
                />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className={`text-[11px] font-bold ${isLatest ? "text-primary" : "text-foreground"}`}>
                      {event.action} (v{event.version})
                    </span>
                    <span className="text-[9px] text-muted-foreground">{formatDate(event.timestamp)}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{event.details}</p>

                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground/80 mt-1">
                    <User className="size-3 text-muted-foreground/40" />
                    <span>
                      Tác nhân: <strong>{event.author}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
