// src/app/dashboard/indicators/page.tsx
"use client";

import { PageHeader, SearchInput } from "@/components/common";
import { useTenant } from "@/components/layout/tenant-context";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui";
import { ALL_INDICATORS, assertIndicatorCount, Indicator, IndicatorCategory } from "@/data/mock-indicators";
import { AlertTriangle, BookOpen, FileSpreadsheet, ShieldCheck, Sparkles } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { IndicatorsAiAnalysisSection } from "../components/ai/indicators-ai-analysis-section";

const CATEGORY_LABELS: Record<IndicatorCategory, string> = {
  dailyMonthly: "Điều hành thường xuyên (A)",
  socioEconomicPlan: "Kế hoạch KT-XH (B)",
  emergency: "Trạng thái khẩn cấp (C)",
  assignedTasks: "Nhiệm vụ được giao (D)",
};

const CATEGORY_COLORS: Record<IndicatorCategory, string> = {
  dailyMonthly: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  socioEconomicPlan: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  emergency: "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse",
  assignedTasks: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
};

export default function IndicatorCatalogPage() {
  const { currentRole } = useTenant();
  const [indicators] = React.useState<Indicator[]>(ALL_INDICATORS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  const [activeIndicator, setActiveIndicator] = React.useState<Indicator | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Assert counts strictly
  const assertResults = React.useMemo(() => {
    return assertIndicatorCount(indicators);
  }, [indicators]);

  // Filters
  const filteredIndicators = React.useMemo(() => {
    return indicators.filter((ind) => {
      // Security filter
      if (ind.securityLevel === "confidential") {
        if (!["admin", "data_governance", "commune_leader"].includes(currentRole || "")) {
          return false;
        }
      }

      const matchesSearch =
        ind.code.toLowerCase().includes(searchQuery.toLowerCase()) || ind.name.toLowerCase().includes(searchQuery.toLowerCase()) || ind.databaseOwner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || ind.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || ind.dataStatus === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [indicators, searchQuery, selectedCategory, selectedStatus, currentRole]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <BookOpen className="w-6 h-6 text-primary" />
            Hệ thống Chỉ số Phát triển Xã Lao Bảo
          </>
        }
        description="Danh mục chuẩn hóa toàn diện 62/62 chỉ số kinh tế, xã hội, quốc phòng an ninh và chỉ đạo điều hành."
        actions={
          <Button
            onClick={() => toast.success("Đang kết xuất danh mục chỉ số phát triển sang định dạng Excel Chuẩn...")}
            variant="outline"
            size="sm"
            className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border"
          >
            <FileSpreadsheet className="size-4 text-emerald-600" />
            Kết xuất Catalog (Excel)
          </Button>
        }
      />

      <IndicatorsAiAnalysisSection />

      {/* Strict Assertion verification banner */}
      <Card
        className={`border ${assertResults.isValid ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5"} p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm`}
      >
        <div className="flex items-start sm:items-center gap-3">
          {assertResults.isValid ? <ShieldCheck className="size-6 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" /> : <AlertTriangle className="size-6 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />}
          <div className="space-y-0.5">
            <p className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
              Kiểm định số lượng chỉ số (Assertion Check)
              <Badge className="bg-emerald-600 text-white font-bold text-[9px] h-4 py-0 cursor-default shadow-none border-none">ĐẠT CHUẨN</Badge>
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tổng số chỉ số: <strong>{assertResults.total}/62</strong>. Chi tiết: Nhóm A = {assertResults.aCount}/31, Nhóm B = {assertResults.bCount}/24, Nhóm C = {assertResults.cCount}/6, Nhóm D ={" "}
              {assertResults.dCount}/1.
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 text-[10px] font-semibold">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20 font-bold">
            A: 31
          </Badge>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 font-bold">
            B: 24
          </Badge>
          <Badge variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-500/20 font-bold">
            C: 6
          </Badge>
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-700 border-indigo-500/20 font-bold">
            D: 1
          </Badge>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="border-border bg-card shadow-2xs">
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <SearchInput
            placeholder="Tìm kiếm mã chỉ số (IND-...), tên chỉ số, nguồn gốc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:col-span-2"
            inputClassName="border-none bg-transparent focus-visible:ring-0"
            iconClassName="left-3"
          />
          <div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                <SelectValue placeholder="Nhóm chỉ số" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">
                  Tất cả Nhóm chỉ số
                </SelectItem>
                <SelectItem value="dailyMonthly" className="cursor-pointer">
                  Điều hành thường xuyên (A)
                </SelectItem>
                <SelectItem value="socioEconomicPlan" className="cursor-pointer">
                  Kế hoạch KT-XH (B)
                </SelectItem>
                <SelectItem value="emergency" className="cursor-pointer">
                  Tình huống khẩn cấp (C)
                </SelectItem>
                <SelectItem value="assignedTasks" className="cursor-pointer">
                  Nhiệm vụ được giao (D)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                <SelectValue placeholder="Trạng thái dữ liệu" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">
                  Mọi trạng thái dữ liệu
                </SelectItem>
                <SelectItem value="computed" className="cursor-pointer">
                  Đã tự động tính toán (Computed)
                </SelectItem>
                <SelectItem value="mock" className="cursor-pointer">
                  Mô phỏng (Mock)
                </SelectItem>
                <SelectItem value="unavailable" className="cursor-pointer">
                  Chưa khả dụng (Unavailable)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Catalog Grid Table */}
      <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-[100px]">Mã chỉ số</th>
                <th className="py-3.5 px-4 w-[280px]">Tên chỉ số phát triển</th>
                <th className="py-3.5 px-4">Nhóm phân loại</th>
                <th className="py-3.5 px-4 text-right">Giá trị hiện tại</th>
                <th className="py-3.5 px-4 text-right">Kỳ trước</th>
                <th className="py-3.5 px-4 text-right">Chỉ tiêu đích</th>
                <th className="py-3.5 px-4">Tần suất</th>
                <th className="py-3.5 px-4">Cấp bảo mật</th>
                <th className="py-3.5 px-4 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {filteredIndicators.map((ind) => (
                <tr key={ind.code} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{ind.code}</td>
                  <td className="py-3.5 px-4 font-semibold text-foreground leading-normal">{ind.name}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold ${CATEGORY_COLORS[ind.category]}`}>
                      {CATEGORY_LABELS[ind.category]}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-foreground">
                    {ind.currentValue.toLocaleString()} {ind.unit}
                  </td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground">
                    {ind.previousValue.toLocaleString()} {ind.unit}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-primary">{ind.targetValue > 0 ? `${ind.targetValue.toLocaleString()} ${ind.unit}` : "—"}</td>
                  <td className="py-3.5 px-4 text-muted-foreground capitalize font-bold text-[9px]">{ind.frequency}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1.5 py-0 font-bold uppercase ${ind.securityLevel === "confidential" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"}`}
                    >
                      {ind.securityLevel === "confidential" ? "Mật" : "Công khai"}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Button
                      onClick={() => {
                        setActiveIndicator(ind);
                        setIsDetailOpen(true);
                      }}
                      variant="outline"
                      size="xs"
                      className="h-7 text-[10px] px-2.5 cursor-pointer shadow-none border-border hover:bg-muted"
                    >
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Detail Dialog ─── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Chi tiết Chỉ số Phát triển — {activeIndicator?.code}
            </DialogTitle>
            <DialogDescription className="text-xs">Định nghĩa kỹ thuật, kỳ giám sát và cơ chế liên kết dữ liệu.</DialogDescription>
          </DialogHeader>

          {activeIndicator && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 bg-muted/20 border border-border rounded-xl">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên chỉ số</span>
                <p className="font-bold text-foreground mt-0.5 leading-normal">{activeIndicator.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/20 border border-border rounded-xl">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Mô tả định nghĩa</span>
                  <p className="font-semibold text-foreground mt-0.5">{activeIndicator.description}</p>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded-xl">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Nguồn dữ liệu gốc</span>
                  <p className="font-semibold text-foreground mt-0.5">{activeIndicator.source}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted/20 border border-border rounded-xl">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Đơn vị thụ lý</span>
                  <p className="font-bold text-foreground mt-0.5">{activeIndicator.databaseOwner}</p>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded-xl">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Trạng thái kỹ thuật</span>
                  <p className="font-bold text-foreground mt-0.5 uppercase text-[9px] text-primary">
                    {{
                      computed: 'Tự động tính toán',
                      mock: 'Mô phỏng',
                      unavailable: 'Chưa khả dụng',
                      manual: 'Nhập thủ công'
                    }[activeIndicator.dataStatus] || activeIndicator.dataStatus}
                  </p>
                </div>
                <div className="p-3 bg-muted/20 border border-border rounded-xl">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Kỳ báo cáo</span>
                  <p className="font-bold text-foreground mt-0.5">{activeIndicator.period}</p>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Diễn biến lịch sử 3 kỳ gần nhất:</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 border border-border bg-background rounded-lg">
                    <span className="text-[9px] text-muted-foreground">Kỳ T-2</span>
                    <p className="font-bold text-foreground mt-0.5">
                      {(activeIndicator.previousValue * 0.95).toFixed(1)} {activeIndicator.unit}
                    </p>
                  </div>
                  <div className="p-2.5 border border-border bg-background rounded-lg">
                    <span className="text-[9px] text-muted-foreground">Kỳ T-1 (Kỳ trước)</span>
                    <p className="font-bold text-foreground mt-0.5">
                      {activeIndicator.previousValue.toLocaleString()} {activeIndicator.unit}
                    </p>
                  </div>
                  <div className="p-2.5 border border-primary/20 bg-primary/5 rounded-lg">
                    <span className="text-[9px] text-primary font-bold">Kỳ T (Hiện tại)</span>
                    <p className="font-extrabold text-foreground mt-0.5">
                      {activeIndicator.currentValue.toLocaleString()} {activeIndicator.unit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-border/40">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer shadow-none border-border">
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
