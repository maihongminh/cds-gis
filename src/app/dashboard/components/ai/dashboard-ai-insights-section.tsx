// src/app/dashboard/components/ai/dashboard-ai-insights-section.tsx
"use client";

import { Sparkles, AlertTriangle, TrendingUp, TrendingDown, Lightbulb, Link as LinkIcon } from "lucide-react";
import { MOCK_AI_INSIGHTS, MOCK_AI_FORECASTS } from "@/data/mock-ai";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardAiInsightsSection() {
  const risksAndAnomalies = MOCK_AI_INSIGHTS.filter(i => i.type === "risk" || i.type === "anomaly");
  const oppsAndRecs = MOCK_AI_INSIGHTS.filter(i => i.type === "opportunity" || i.type === "recommendation");

  return (
    <div className="flex flex-col gap-6 mt-8 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">AI hỗ trợ ra quyết định</h2>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-primary/10 text-primary rounded-md">
          AI Demo
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hero Insight (8/12) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold text-indigo-100">Nhận định AI hôm nay</h3>
                <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2 py-1 rounded border border-indigo-500/50">Kết quả mô phỏng</span>
              </div>
              <p className="text-indigo-50/90 text-sm leading-relaxed max-w-3xl">
                Tổng thể tình hình kinh tế - xã hội duy trì ổn định. Đã ghi nhận sự phục hồi trong doanh thu thương mại, dịch vụ. Tuy nhiên, rủi ro ngập lụt tại khu vực Ka Tăng và tỷ lệ hồ sơ trực tuyến giảm là những điểm cần đặc biệt lưu ý xử lý sớm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-xs text-indigo-200 mb-1">Thu ngân sách</div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  18.5 <span className="text-xs font-normal text-indigo-200">Tỷ VNĐ</span>
                </div>
              </div>
              <div className="bg-rose-500/20 border border-rose-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-xs text-rose-200 mb-1">Cảnh báo ưu tiên</div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  1 <span className="text-xs font-normal text-rose-200">Mức Cao</span>
                </div>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-xs text-emerald-200 mb-1">Tiến độ công việc</div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  82 <span className="text-xs font-normal text-emerald-200">% Đúng hạn</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <Link href="/dashboard/ai-assistant">
                <Button variant="secondary" size="sm" className="bg-white text-indigo-900 hover:bg-indigo-50 font-medium">Mở trợ lý AI</Button>
              </Link>
              <span className="text-xs text-indigo-300">Phân tích mô phỏng cập nhật lúc 08:30 sáng nay</span>
            </div>
          </div>
        </div>

        {/* Mini Forecasts (4/12) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground">Dự báo ngắn hạn</h3>
            <span className="text-[10px] uppercase font-bold px-2 py-1 bg-muted text-muted-foreground rounded">Dự báo mô phỏng</span>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {MOCK_AI_FORECASTS.slice(0, 3).map((fc) => (
              <div key={fc.id} className="border border-border/50 bg-muted/20 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-medium text-foreground">{fc.topic}</div>
                  <div className="text-xs text-muted-foreground">{fc.horizonLabel}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground">Hiện tại</span>
                    <span className="text-sm font-semibold text-foreground">{fc.currentValue} {fc.unit}</span>
                  </div>
                  <div className="w-8 flex justify-center text-muted-foreground/50">→</div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-primary font-medium">Dự báo</span>
                    <span className="text-sm font-bold text-primary">{fc.projectedValue} {fc.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_AI_INSIGHTS.map((insight) => (
          <div key={insight.id} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col h-full hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {insight.type === "risk" || insight.type === "anomaly" ? (
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : insight.type === "opportunity" ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="text-xs text-muted-foreground font-medium">{insight.relatedDomains.join(", ")}</div>
                  <h4 className="font-semibold text-foreground text-sm line-clamp-1" title={insight.title}>{insight.title}</h4>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 flex-1">{insight.summary}</p>
            
            {insight.metrics && insight.metrics.length > 0 && (
              <div className="bg-muted/30 rounded px-3 py-2 text-xs flex justify-between items-center text-muted-foreground mb-3 border border-border/50">
                <span>{insight.metrics[0].label}</span>
                <span className="font-bold text-foreground">{insight.metrics[0].formattedValue} {insight.metrics[0].unit}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
