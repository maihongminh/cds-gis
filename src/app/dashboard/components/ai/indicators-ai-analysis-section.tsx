// src/app/dashboard/components/ai/indicators-ai-analysis-section.tsx
"use client";

import { BrainCircuit, TrendingUp, TrendingDown, Target, Clock, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function IndicatorsAiAnalysisSection() {
  return (
    <div className="flex flex-col gap-4 mb-6 bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">AI phân tích Bộ chỉ số</h2>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-primary/10 text-primary rounded-md">
          AI Demo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* Tăng trưởng */}
        <div className="bg-card/50 border border-border/50 rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-foreground">Cải thiện mạnh nhất</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Tỷ lệ thu gom rác thải sinh hoạt đô thị</p>
          <div className="mt-auto">
            <span className="text-xs bg-muted/50 px-2 py-1 rounded border border-border text-muted-foreground font-mono">IND-ENV-01</span>
          </div>
        </div>

        {/* Giảm */}
        <div className="bg-card/50 border border-border/50 rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-destructive">
            <TrendingDown className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-foreground">Giảm so với tháng trước</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Tỷ lệ hồ sơ trực tuyến cấp xã</p>
          <div className="mt-auto">
            <span className="text-xs bg-muted/50 px-2 py-1 rounded border border-border text-muted-foreground font-mono">IND-ADM-03</span>
          </div>
        </div>

        {/* Gần đạt */}
        <div className="bg-card/50 border border-border/50 rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Target className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-foreground">Gần đạt kế hoạch năm</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Tổng thu ngân sách nhà nước (Đạt 65%)</p>
          <div className="mt-auto">
            <span className="text-xs bg-muted/50 px-2 py-1 rounded border border-border text-muted-foreground font-mono">IND-ECO-01</span>
          </div>
        </div>

        {/* Chậm tiến độ */}
        <div className="bg-card/50 border border-border/50 rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <Clock className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-foreground">Cần đẩy nhanh tiến độ</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Tỷ lệ làm sạch dữ liệu hộ tịch</p>
          <div className="mt-auto">
            <span className="text-xs bg-muted/50 px-2 py-1 rounded border border-border text-muted-foreground font-mono">IND-POP-02</span>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-primary flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
        <p><strong>Dự báo mô phỏng:</strong> 85% các chỉ tiêu kinh tế - xã hội có khả năng hoàn thành kế hoạch quý này nếu duy trì gia tốc hiện tại.</p>
        
        <div className="flex shrink-0 gap-2">
          <Link href="/dashboard/ai-assistant">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8">
              Đặt câu hỏi cho AI
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
