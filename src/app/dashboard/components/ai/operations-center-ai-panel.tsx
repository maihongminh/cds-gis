// src/app/dashboard/components/ai/operations-center-ai-panel.tsx
"use client";

import { BrainCircuit, AlertTriangle, Lightbulb, Link as LinkIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OperationsCenterAiPanel() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-lg flex flex-col h-full text-card-foreground">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">AI hỗ trợ điều hành</h2>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
          AI Demo
        </span>
      </div>

      <div className="space-y-4 flex-1">
        {/* Top 3 cảnh báo */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cảnh báo ưu tiên</h3>
          <div className="space-y-2">
            <div className="flex gap-2 items-start bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Lượng mưa vượt ngưỡng an toàn tại Ka Tăng (185mm)</p>
              </div>
            </div>
            <div className="flex gap-2 items-start bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">5 nhiệm vụ địa chính sắp quá hạn (còn &lt; 3 ngày)</p>
              </div>
            </div>
            <div className="flex gap-2 items-start bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Tỷ lệ hồ sơ trực tuyến giảm 15% so với tuần trước</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nhận định */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Nhận định & Khuyến nghị</h3>
          <div className="bg-muted/30 p-3 rounded-lg border border-border/50 space-y-3">
            <p className="text-sm">
              <span className="text-primary font-medium">Hoạt động thương mại:</span> Đang có dấu hiệu phục hồi tích cực nhờ các chính sách hỗ trợ biên mậu.
            </p>
            <p className="text-sm">
              <span className="text-primary font-medium">Tiến độ công việc:</span> Khá tốt (82% đúng hạn), tuy nhiên cần lưu ý cục bộ tại bộ phận Địa chính.
            </p>
            <div className="flex gap-2 items-start pt-2 border-t border-border">
              <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Khuyến nghị: Cử cán bộ kiểm tra tình hình sạt lở tại Ka Tăng ngay trong sáng nay.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <Link href="/dashboard/ai-assistant">
          <Button className="w-full shadow-md">
            Mở phân tích AI toàn diện
          </Button>
        </Link>
      </div>
    </div>
  );
}
