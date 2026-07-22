// src/app/dashboard/data-publication/page.tsx

"use client";

import { PageHeader } from "@/components/common";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ArrowRight, BookOpen, CheckCircle2, FileSpreadsheet, FileText, Globe } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface PublishedDataset {
  id: string;
  title: string;
  dataGroup: string;
  period: string;
  publishedAt: string;
  syncStatus: "synced" | "pending";
  recordsCount: number;
  description: string;
}

const MOCK_PUBLISHED_DATASETS: PublishedDataset[] = [
  {
    id: "pub-1",
    title: "CSDL Hộ gia đình & Nhân khẩu Lao Bảo năm 2026",
    dataGroup: "Dân cư",
    period: "Năm 2026",
    publishedAt: "2026-06-15T09:00:00Z",
    syncStatus: "synced",
    recordsCount: 1450,
    description: "Dữ liệu chuẩn hóa nhân khẩu, hộ khẩu, phân bố dân cư theo 12 thôn trên địa bàn xã Lao Bảo.",
  },
  {
    id: "pub-2",
    title: "Sản lượng và diện tích canh tác Cây trồng Vụ Xuân năm 2026",
    dataGroup: "Nông nghiệp",
    period: "Quý I/2026",
    publishedAt: "2026-06-08T15:30:00Z",
    syncStatus: "synced",
    recordsCount: 42,
    description: "Chỉ tiêu thống kê diện tích gieo trồng và sản lượng thu hoạch ngô, sắn, cây dược liệu vụ xuân.",
  },
  {
    id: "pub-3",
    title: "Hiện trạng cơ sở Homestay và lượt khách Du lịch Quý 1/2026",
    dataGroup: "Du lịch & Dịch vụ",
    period: "Quý I/2026",
    publishedAt: "2026-06-12T10:00:00Z",
    syncStatus: "pending",
    recordsCount: 18,
    description: "Thống kê tình hình hoạt động cơ sở lưu trú homestay Ka Tăng và lượt khách tham quan biên giới.",
  },
];

export default function DataPublicationPage() {
  const [datasets, setDatasets] = React.useState<PublishedDataset[]>(MOCK_PUBLISHED_DATASETS);

  const handleDownload = (ds: PublishedDataset, format: "excel" | "pdf" | "csv") => {
    toast.success(`Đang tải dữ liệu "${ds.title}" dạng tệp ${format.toUpperCase()}...`, {
      description: "Hệ thống đang trích xuất dữ liệu trực tiếp từ CSDL dùng chung xã Lao Bảo.",
    });
  };

  const handleSyncToProvince = (ds: PublishedDataset) => {
    toast.loading("Đang khởi tạo kết nối API đồng bộ lên Trung tâm tích hợp dữ liệu tỉnh Quảng Trị...");
    setTimeout(() => {
      toast.dismiss();
      setDatasets((prev) => prev.map((d) => (d.id === ds.id ? { ...d, syncStatus: "synced" } : d)));
      toast.success("Đồng bộ dữ liệu lên cổng thông tin tích hợp tỉnh thành công!");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Globe className="w-6 h-6 text-primary" />
            Công bộ Dữ liệu Chuẩn hóa
          </>
        }
        description="Lưu trữ và phát hành các bộ chỉ tiêu số liệu đã được kiểm duyệt chính thức của xã Lao Bảo lên CSDL dùng chung."
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Bộ dữ liệu công bố</span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">{datasets.length} Phân hệ</h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
            <Globe className="size-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Cổng liên kết Tỉnh</span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">Đã kết nối</h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0">
            <BookOpen className="size-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Trạng thái đồng bộ</span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">
              {datasets.filter((d) => d.syncStatus === "synced").length}/{datasets.length} Đồng bộ
            </h3>
          </div>
        </Card>
      </div>

      {/* Datasets List */}
      <div className="space-y-4">
        {datasets.map((ds) => (
          <Card key={ds.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
            <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="px-1.5 py-0 rounded text-[9px] font-bold text-primary border-primary/20 bg-primary/5 uppercase">
                    {ds.dataGroup}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-semibold bg-muted/60 px-2 py-0.5 rounded-sm">Kỳ: {ds.period}</span>
                  {ds.syncStatus === "synced" ? (
                    <Badge variant="default" className="text-[8px] bg-emerald-500 hover:bg-emerald-600 px-1.5 py-0 font-semibold h-4">
                      Đã đồng bộ cổng tỉnh
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[8px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0 font-semibold h-4 animate-pulse">
                      Chờ đồng bộ
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm font-bold text-foreground leading-tight mt-1">{ds.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed max-w-2xl mt-1">{ds.description}</CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => handleDownload(ds, "excel")} variant="outline" size="sm" className="h-8 text-xs cursor-pointer gap-1 px-3 shadow-none">
                  <FileSpreadsheet className="size-3.5" />
                  Excel
                </Button>
                <Button onClick={() => handleDownload(ds, "pdf")} variant="outline" size="sm" className="h-8 text-xs cursor-pointer gap-1 px-3 shadow-none">
                  <FileText className="size-3.5" />
                  PDF
                </Button>
                {ds.syncStatus !== "synced" && (
                  <Button onClick={() => handleSyncToProvince(ds)} variant="default" size="sm" className="h-8 text-xs cursor-pointer gap-1 px-3 shadow-none">
                    Đồng bộ Tỉnh
                    <ArrowRight className="size-3.5" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-4 flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Thời gian phát hành: {new Date(ds.publishedAt).toLocaleString("vi-VN")}</span>
              <span>
                Tổng số chỉ mục dữ liệu: <strong className="text-foreground font-bold">{ds.recordsCount} bản ghi</strong>
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
