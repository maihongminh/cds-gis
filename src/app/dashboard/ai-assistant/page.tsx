// src/app/dashboard/ai-assistant/page.tsx
"use client";

import * as React from "react";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui";
import { Sparkles, BarChart2, LayoutDashboard } from "lucide-react";
import { AiAssistantView } from "./components/ai-assistant-view";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AiAssistantPage() {
  return (
    <div className="flex flex-col gap-6 w-full pb-10 h-full">
      <PageHeader
        className="shrink-0"
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Trợ lý AI dữ liệu Lao Bảo
          </div>
        }
        description="Tra cứu thông tin, tóm tắt số liệu và nhận gợi ý phân tích bằng giao diện AI mô phỏng phục vụ demo."
        actions={
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">AI Demo</Badge>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Dữ liệu mô phỏng</Badge>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Chưa kết nối AI thực</Badge>

            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="ml-2 gap-2 text-muted-foreground hover:text-foreground">
                <LayoutDashboard className="w-4 h-4" />
                <span>Mở Dashboard</span>
              </Button>
            </Link>
            <Link href="/dashboard/indicators">
              <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <BarChart2 className="w-4 h-4" />
                <span>Xem Bộ chỉ số</span>
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grow">
        <AiAssistantView />
      </div>
    </div>
  );
}
