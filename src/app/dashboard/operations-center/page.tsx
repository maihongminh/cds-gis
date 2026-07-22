// src/app/dashboard/operations-center/page.tsx
"use client";

import { PageHeader } from "@/components/common";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Activity, AppWindow, Globe, MonitorPlay, Radio, RefreshCw, ShieldAlert } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { OperationsCenterAiPanel } from "../components/ai/operations-center-ai-panel";

export default function OperationsCenterPage() {
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    toast.info("Đang đồng bộ dữ liệu thời gian thực từ các hệ thống cảm biến & camera giám sát...");
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Đồng bộ dữ liệu IOC thành công!");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={
          <>
            <AppWindow className="w-6 h-6 text-primary" />
            Trung tâm Điều hành Thông minh xã Lao Bảo (IOC)
          </>
        }
        description="Hệ thống tổng hợp thông tin chỉ đạo, điều hành, giám sát thiên tai, an ninh trật tự và phản ánh kiến nghị của người dân."
        actions={
          <Button onClick={handleSync} disabled={isSyncing} variant="outline" size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border">
            <RefreshCw className={`size-4 text-primary ${isSyncing ? "animate-spin" : ""}`} />
            Đồng bộ dữ liệu
          </Button>
        }
      />

      {/* Warning banner */}
      <Card className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-xl flex items-start gap-3 shadow-sm">
        <div className="flex gap-2">
          <ShieldAlert className="size-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">Môi trường thử nghiệm IOC</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Các tính năng đồng bộ camera AI, bản đồ cứu hộ thời gian thực và điều phối khẩn cấp đang hoạt động ở chế độ mô phỏng. Không kết nối trực tiếp đến hạ tầng vật lý của UBND xã Lao Bảo trong
              môi trường phát triển này.
            </p>
          </div>
        </div>
      </Card>

      {/* Grid panels */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel 1 */}
        <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MonitorPlay className="size-4 text-primary" />
              Camera Giám sát thông minh (AI)
            </CardTitle>
            <CardDescription className="text-xs">Giám sát lưu lượng giao thông tại cửa khẩu và an ninh các nút giao trọng điểm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden group border border-border/40">
              <div className="absolute inset-0 bg-radial from-transparent to-black/50" />
              <Globe className="size-10 text-muted-foreground animate-pulse" />
              <span className="absolute top-2 left-2 bg-rose-500/90 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE
              </span>
              <span className="absolute bottom-2 left-2 text-[9px] text-white font-semibold">Nút giao Cửa khẩu Lao Bảo (Cam 01)</span>
            </div>
            <div className="flex gap-2 flex-col">
              <Button size="xs" variant="outline" className="w-full text-[10px] h-8 cursor-pointer" onClick={() => toast.success("Đang kết nối camera luồng AI...")}>
                Kết nối luồng
              </Button>
              <Button size="xs" variant="outline" className="w-full text-[10px] h-8 cursor-pointer" onClick={() => toast.success("Đang phân tích lưu lượng giao thông...")}>
                Phân tích lưu lượng
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Panel 2 */}
        <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="size-4 text-emerald-600" />
              Cảm biến &amp; Hệ thống Đo mưa tự động
            </CardTitle>
            <CardDescription className="text-xs">Cập nhật mực nước sông Sê Pôn và lượng mưa đo được từ các trạm đo tự động</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center p-2 bg-muted/40 rounded-lg border border-border/30">
                <span className="text-xs text-muted-foreground font-semibold">Mực nước sông Sê Pôn:</span>
                <span className="text-xs font-bold text-amber-500">3.85m (Mức Báo động 1)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/40 rounded-lg border border-border/30">
                <span className="text-xs text-muted-foreground font-semibold">Lượng mưa Ka Tăng (24h):</span>
                <span className="text-xs font-bold text-foreground">42.5 mm</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/40 rounded-lg border border-border/30">
                <span className="text-xs text-muted-foreground font-semibold">Lượng mưa Bản Vây (24h):</span>
                <span className="text-xs font-bold text-foreground">28.0 mm</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full text-[10px] h-8 cursor-pointer" onClick={() => toast.success("Yêu cầu lấy dữ liệu trạm quan trắc tự động...")}>
              Chi tiết trạm đo
            </Button>
          </CardContent>
        </Card>

        {/* Panel 3 */}
        <Card className="border-border bg-card/50 backdrop-blur-xs shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Radio className="size-4 text-indigo-600" />
              Tiếp nhận Phản ánh kiến nghị (PAKN)
            </CardTitle>
            <CardDescription className="text-xs">Các phản ánh từ ứng dụng LaoBao Smart của người dân gửi về IOC</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-xs">
              <div className="border-b border-border/40 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-foreground">Hỏng đèn đường tại đường Lê Thế Tiết</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 text-[8px] h-4">
                    Đang xử lý
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">Người gửi: hoang***@gmail.com - 2 giờ trước</span>
              </div>
              <div className="border-b border-border/40 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-foreground">Rác thải ứ đọng tại Khóm Duy Tân</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[8px] h-4">
                    Đã xong
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">Người gửi: nguyen***@gmail.com - 5 giờ trước</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full text-[10px] h-8 cursor-pointer" onClick={() => toast.success("Đang chuyển hướng sang trang quản trị PAKN...")}>
              Xem tất cả phản ánh
            </Button>
          </CardContent>
        </Card>
        </div>
        <div className="xl:col-span-1">
          <OperationsCenterAiPanel />
        </div>
      </div>
    </div>
  );
}
