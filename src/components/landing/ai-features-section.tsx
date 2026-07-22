"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  BrainCircuit, 
  Search, 
  TrendingUp, 
  Lightbulb, 
  AlertTriangle,
  Bot,
  AppWindow,
} from "lucide-react";
import Link from "next/link";

export function AiFeaturesSection() {
  return (
    <section id="ai-features" className="py-20 border-t border-border/40 relative overflow-hidden bg-muted/5 dark:bg-muted/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] font-bold text-primary bg-primary/10 border-primary/20 uppercase tracking-widest">
              AI Demo
            </Badge>
            <Badge variant="outline" className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border-amber-500/20 uppercase tracking-widest">
              Định hướng nghiên cứu
            </Badge>
            <Badge variant="outline" className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border-emerald-500/20 uppercase tracking-widest">
              Kết quả mô phỏng
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Trợ lý AI và hỗ trợ ra quyết định
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Khai thác dữ liệu bằng ngôn ngữ tự nhiên, tóm tắt chỉ số, phát hiện xu hướng và cung cấp các gợi ý tham khảo phục vụ công tác quản lý, điều hành.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Cards */}
          <div className="xl:col-span-5 space-y-4">
            {/* Card 1 */}
            <div className="bg-card border border-border/60 rounded-xl p-5 hover:border-primary/40 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Search className="w-5 h-5" />
                  <h3>Tra cứu dữ liệu bằng ngôn ngữ tự nhiên</h3>
                </div>
                <div className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-muted-foreground">AI-01</div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Đặt câu hỏi trực tiếp để tra cứu số liệu, tóm tắt tình hình và mở nhanh các dashboard liên quan.
              </p>
              <ul className="space-y-2">
                {["Hỏi đáp theo lĩnh vực.", "Tóm tắt số liệu.", "Gợi ý câu hỏi liên quan.", "Liên kết đến nguồn dữ liệu."].map((item, i) => (
                  <li key={i} className="text-[11px] flex items-center gap-2 text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-card border border-border/60 rounded-xl p-5 hover:border-primary/40 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <BrainCircuit className="w-5 h-5" />
                  <h3>Phân tích và gợi ý điều hành</h3>
                </div>
                <div className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-muted-foreground">AI-02</div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Mô phỏng khả năng phát hiện xu hướng, cảnh báo bất thường, dự báo và đề xuất nội dung cần ưu tiên theo dõi.
              </p>
              <ul className="space-y-2">
                {["Phân tích xu hướng.", "Cảnh báo rủi ro.", "Dự báo mô phỏng.", "Gợi ý hành động tham khảo."].map((item, i) => (
                  <li key={i} className="text-[11px] flex items-center gap-2 text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Previews */}
          <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chat Preview */}
            <div className="bg-background border border-border/60 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-muted/40 p-3 border-b border-border/60 flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">Trợ lý AI (Preview)</span>
              </div>
              <div className="p-4 flex-1 space-y-4 flex flex-col">
                <div className="flex items-start gap-2 justify-end">
                  <div className="bg-primary text-primary-foreground text-xs rounded-xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                    Những chỉ số nào đang chậm tiến độ trong quý này?
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted/50 border border-border/50 text-foreground text-xs rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%] leading-relaxed">
                    Có 3 nhóm chỉ số cần theo dõi, tập trung ở thu ngân sách, tiến độ cập nhật dữ liệu và nhiệm vụ quá hạn. Đây là kết quả mô phỏng phục vụ demo.
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                  {["Tóm tắt tình hình tháng này", "Xem cảnh báo cần ưu tiên", "Phân tích tiến độ KT-XH"].map((chip, i) => (
                    <span key={i} className="text-[10px] bg-background border border-border text-muted-foreground px-2 py-1 rounded-full cursor-default hover:bg-muted transition-colors">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights Preview */}
            <div className="bg-background border border-border/60 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-muted/40 p-3 border-b border-border/60 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">Gợi ý & Cảnh báo (Preview)</span>
              </div>
              <div className="p-4 flex-1 space-y-3">
                {/* Risk */}
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-destructive font-semibold text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Rủi ro
                    </div>
                    <span className="text-[9px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">Mô phỏng</span>
                  </div>
                  <p className="text-[11px] text-destructive/80">Một số đơn vị có xu hướng tăng nhiệm vụ quá hạn.</p>
                </div>
                
                {/* Anomaly */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Bất thường
                    </div>
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">Mô phỏng</span>
                  </div>
                  <p className="text-[11px] text-amber-500/80">Tỷ lệ cập nhật dữ liệu giảm trong kỳ gần nhất.</p>
                </div>

                {/* Recommendation */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-xs">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Khuyến nghị
                    </div>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded">Mô phỏng</span>
                  </div>
                  <p className="text-[11px] text-emerald-500/80">Ưu tiên rà soát nhóm ngân sách và chất lượng dữ liệu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary/80 max-w-4xl mx-auto flex gap-3 items-start">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
          <p>
            <strong className="text-primary font-semibold mr-1">Lưu ý:</strong>
            Các nội dung phân tích, dự báo và khuyến nghị trong phiên bản demo được mô phỏng nhằm minh họa định hướng ứng dụng AI; chưa phải kết quả phân tích chính thức.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link href="/login">
            <Button className="gap-2 px-8 h-11" variant="default">
              <Bot className="w-4 h-4" />
              Khám phá Trợ lý AI
            </Button>
          </Link>
          <Link href="/dashboard/operations-center">
            <Button className="gap-2 px-8 h-11" variant="outline">
              <AppWindow className="w-4 h-4" />
              Xem Trung tâm điều hành
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
