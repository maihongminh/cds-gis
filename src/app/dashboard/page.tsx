// src/app/dashboard/page.tsx
"use client";

import { Breadcrumbs, PageHeader, CommonTabs } from "@/components/common";
import { useTenant } from "@/components/layout/tenant-context";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Activity, AlertCircle, AppWindow, Briefcase, Building, Home, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AdministrativeIndicatorsProgress } from "./components/charts/administrative-indicators-progress";
import { AdministrativeProcedureDonutChart } from "./components/charts/administrative-procedure-donut-chart";
import { AgricultureProductionTimeSeriesChart } from "./components/charts/agriculture-production-time-series-chart";
import { AssignedTaskStatusDonutChart } from "./components/charts/assigned-task-status-donut-chart";
import { AssignedTaskTimeSeriesChart } from "./components/charts/assigned-task-time-series-chart";
import { BudgetCompletionGauge } from "./components/charts/budget-completion-gauge";
import { BudgetCompositionStackedBarChart } from "./components/charts/budget-composition-stacked-bar-chart";
import { BudgetRevenueTimeSeriesChart } from "./components/charts/budget-revenue-time-series-chart";
import { EconomicStructureDonutChart } from "./components/charts/economic-structure-donut-chart";
import { EmergencyWeatherTimeSeriesChart } from "./components/charts/emergency-weather-time-series-chart";
import { LocalEconomyHorizontalBarChart } from "./components/charts/local-economy-horizontal-bar-chart";
import { OcopProductBarChart } from "./components/charts/ocop-product-bar-chart";
import { VillageEmergencyRiskHeatmap } from "./components/charts/village-emergency-risk-heatmap";
import { SocioEconomicTargetHeatmap } from "./components/charts/socio-economic-target-heatmap";
import { TaskOverdueHeatmap } from "./components/charts/task-overdue-heatmap";
import { DashboardAiInsightsSection } from "./components/ai/dashboard-ai-insights-section";

export default function DashboardPage() {
  const { currentRole, selectedHamletCode, hamlets } = useTenant();
  const router = useRouter();

  const dashboardState = "ready";

  // Sync village/hamlet scope name
  const scopeName = React.useMemo(() => {
    if (selectedHamletCode === "all") return "Toàn xã Lao Bảo";
    const hamlet = hamlets.find((h) => h.code === selectedHamletCode);
    return hamlet ? `Thôn ${hamlet.name}` : selectedHamletCode;
  }, [selectedHamletCode, hamlets]);

  // Alerts list with access control
  const alertList = React.useMemo(() => {
    return [
      { id: "alt-1", title: "Hồ sơ Y tế - Giáo dục chờ duyệt", desc: "Có 3 hồ sơ cập nhật điểm trường Ka Tăng chưa được phê duyệt cấp phòng.", severity: "medium" },
      { id: "alt-2", title: "Chỉ tiêu tăng trưởng chưa đạt", desc: "Tốc độ tăng trưởng sản xuất lúa vụ Hè Thu đang thấp hơn 1.2% so với mục tiêu.", severity: "low" },
      { id: "alt-3", title: "Lượng mưa tích lũy Ka Tăng vượt ngưỡng", desc: "Hệ thống đo lường khẩn cấp cảnh báo Ka Tăng đạt 185mm/24h.", severity: "high" },
      { id: "alt-4", title: "Nhiệm vụ Tỉnh giao sắp quá hạn", desc: "Nhiệm vụ báo cáo số liệu chuyển đổi số nông thôn mới hạn chót 15/07/2026.", severity: "high" },
    ].filter((alt) => {
      // Hide emergency flood alert if the user doesn't have appropriate roles
      if (alt.id === "alt-3" && !["admin", "data_governance", "commune_leader", "unit_leader"].includes(currentRole || "")) {
        return false;
      }
      return true;
    });
  }, [currentRole]);

  // Mock data definitions for business charts
  const budgetTrendData = [
    { month: "Tháng 1", revenue: 1.1e9 },
    { month: "Tháng 2", revenue: 1.4e9 },
    { month: "Tháng 3", revenue: 1.8e9 },
    { month: "Tháng 4", revenue: 1.2e9 },
    { month: "Tháng 5", revenue: 2.1e9 },
    { month: "Tháng 6", revenue: 2.5e9 },
    { month: "Tháng 7", revenue: 1.9e9 },
    { month: "Tháng 8", revenue: 2.2e9 },
    { month: "Tháng 9", revenue: 2.6e9 },
    { month: "Tháng 10", revenue: 2.0e9 },
    { month: "Tháng 11", revenue: 2.4e9 },
    { month: "Tháng 12", revenue: 2.8e9 },
  ];

  const ocopData = [
    { label: "OCOP 3 Sao", value: 14 },
    { label: "OCOP 4 Sao", value: 8 },
    { label: "OCOP 5 Sao", value: 2 },
  ];

  const cropTrendData = [
    { period: "Vụ Đ.Xuân 24", areaHa: 120, outputTons: 620 },
    { period: "Vụ X.Hè 24", areaHa: 95, outputTons: 480 },
    { period: "Vụ H.Thu 24", areaHa: 130, outputTons: 680 },
    { period: "Vụ Đ.Xuân 25", areaHa: 125, outputTons: 640 },
  ];

  const livestockData = [
    { label: "Trâu", value: 1250 },
    { label: "Bò", value: 2400 },
    { label: "Lợn", value: 4800 },
    { label: "Gia cầm", value: 32000 },
  ];

  const economicStructureData = [
    { label: "Nông, Lâm & Thủy sản", value: 24.5 },
    { label: "Công nghiệp & Xây dựng", value: 38.2 },
    { label: "Dịch vụ & Thương mại", value: 37.3 },
  ];

  const investmentTrendData = [
    { year: "2023", capitalBillion: 120, projectCount: 5 },
    { year: "2024", capitalBillion: 180, projectCount: 8 },
    { year: "2025", capitalBillion: 240, projectCount: 12 },
    { year: "2026", capitalBillion: 310, projectCount: 15 },
  ];

  const socialQualityData = [
    { label: "Bao phủ nước sạch", value: 92, target: 95 },
    { label: "Sử dụng smartphone", value: 88, target: 90 },
    { label: "Truy cập Internet", value: 85, target: 88 },
    { label: "Chỉ số hạnh phúc", value: 78, target: 80 },
  ];

  const weatherRainfallData = [
    { hour: "00:00", rainfallMm: 2 },
    { hour: "04:00", rainfallMm: 8 },
    { hour: "08:00", rainfallMm: 15 },
    { hour: "12:00", rainfallMm: 34 },
    { hour: "16:00", rainfallMm: 42 },
    { hour: "20:00", rainfallMm: 12 },
  ];

  const readinessData = [
    { label: "Chỉ huy tại chỗ", value: 92 },
    { label: "Lực lượng tại chỗ", value: 88 },
    { label: "Phương tiện tại chỗ", value: 75 },
    { label: "Hậu cần tại chỗ", value: 82 },
  ];

  const taskStatusData = [
    { label: "Đúng hạn", value: 86 },
    { label: "Đang triển khai", value: 24 },
    { label: "Chưa bắt đầu", value: 6 },
    { label: "Quá hạn", value: 4 },
  ];

  const taskTrendData = [
    { month: "Tháng 1", assigned: 15, completed: 12 },
    { month: "Tháng 2", assigned: 18, completed: 14 },
    { month: "Tháng 3", assigned: 25, completed: 20 },
    { month: "Tháng 4", assigned: 22, completed: 18 },
    { month: "Tháng 5", assigned: 30, completed: 24 },
    { month: "Tháng 6", assigned: 28, completed: 26 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Breadcrumbs */}
      <Breadcrumbs />

      {/* Top Header */}
      <PageHeader
        title={
          <>
            <LayoutDashboard className="w-6 h-6 text-primary" />
            Trung tâm Điều hành Chỉ số Lãnh đạo
          </>
        }
        description={
          <>
            Hệ thống giám sát chỉ tiêu kinh tế - xã hội thời gian thực. <br />
            Phạm vi: <strong>{scopeName}</strong>
          </>
        }
        actions={
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button onClick={() => router.push("/dashboard/operations-center")} size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-xs font-bold">
              <AppWindow className="size-4" />
              Mở Trung tâm điều hành
            </Button>
            <Button
              onClick={() => router.push("/dashboard/indicators")}
              variant="outline"
              size="sm"
              className="h-9 text-xs cursor-pointer gap-1.5 shadow-xs font-bold border-border bg-card hover:bg-muted"
            >
              <Activity className="size-4 text-emerald-600" />
              Xem Bộ chỉ số
            </Button>
          </div>
        }
      />

      <DashboardAiInsightsSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Business Chart Widgets (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6 @container/left-col">
          <CommonTabs
            defaultValue="A"
            tabs={[
              {
                value: "A",
                label: "Thường xuyên (A)",
                content: (
                  <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 @2xl:grid-cols-4 gap-4">
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold flex items-center gap-1.5">
                          <Building className="size-3.5 text-blue-500" /> Doanh nghiệp hoạt động
                        </span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">86</span>
                          <span className="text-xs text-muted-foreground">đơn vị</span>
                        </div>
                        <span className="text-[9px] text-emerald-600 font-bold block mt-2">+3 so với quý trước</span>
                      </Card>
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold flex items-center gap-1.5">
                          <Briefcase className="size-3.5 text-emerald-500" /> Hợp tác xã
                        </span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">12</span>
                          <span className="text-xs text-muted-foreground">đơn vị</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-semibold block mt-2">Đạt 100% kế hoạch</span>
                      </Card>
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold flex items-center gap-1.5">
                          <Home className="size-3.5 text-amber-500" /> Hộ kinh doanh
                        </span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">420</span>
                          <span className="text-xs text-muted-foreground">hộ</span>
                        </div>
                        <span className="text-[9px] text-rose-500 font-bold block mt-2">-5 so với quý trước</span>
                      </Card>
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold flex items-center gap-1.5">
                          <Activity className="size-3.5 text-purple-500" /> Thu ngân sách lũy kế
                        </span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">16.2</span>
                          <span className="text-xs text-muted-foreground">tỷ VNĐ</span>
                        </div>
                        <span className="text-[9px] text-emerald-600 font-bold block mt-2">Đạt 73.6% dự toán</span>
                      </Card>
                    </div>

                    {/* Ngân sách */}
                    <div className="grid grid-cols-1 @3xl:grid-cols-12 gap-6">
                      <div className="@3xl:col-span-4">
                        <BudgetCompletionGauge currentValue={16.2e9} targetValue={22e9} status={dashboardState} />
                      </div>
                      <div className="@3xl:col-span-8">
                        <BudgetRevenueTimeSeriesChart data={budgetTrendData} status={dashboardState} />
                      </div>
                    </div>
                    <BudgetCompositionStackedBarChart status={dashboardState} />

                    {/* Kinh tế địa phương */}
                    <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6">
                      <OcopProductBarChart data={ocopData} status={dashboardState} />
                      <AgricultureProductionTimeSeriesChart data={cropTrendData} status={dashboardState} />
                    </div>

                    {/* Cải cách hành chính */}
                    <div className="grid grid-cols-1 @3xl:grid-cols-12 gap-6">
                      <div className="@3xl:col-span-6">
                        <AdministrativeProcedureDonutChart status={dashboardState} />
                      </div>
                      <div className="@3xl:col-span-6">
                        <AdministrativeIndicatorsProgress status={dashboardState} />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                value: "B",
                label: "Kế hoạch KT-XH (B)",
                content: (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-4">
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Hộ nghèo đa chiều</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">142</span>
                          <span className="text-xs text-muted-foreground">hộ</span>
                        </div>
                        <span className="text-[9px] text-emerald-600 font-bold block mt-2">Tỷ lệ nghèo: 2.6%</span>
                      </Card>
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Hộ cận nghèo</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">210</span>
                          <span className="text-xs text-muted-foreground">hộ</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-semibold block mt-2">Tỷ lệ cận nghèo: 3.8%</span>
                      </Card>
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Giải quyết việc làm mới</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">340</span>
                          <span className="text-xs text-muted-foreground">lao động</span>
                        </div>
                        <span className="text-[9px] text-emerald-600 font-bold block mt-2">Đạt 85% kế hoạch năm</span>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6">
                      <LocalEconomyHorizontalBarChart status={dashboardState} />
                      <EconomicStructureDonutChart status={dashboardState} />
                    </div>
                    <SocioEconomicTargetHeatmap status={dashboardState} />
                  </div>
                ),
              },
              {
                value: "C",
                label: "Tình huống khẩn cấp (C)",
                content: (
                  <div className="space-y-6">
                    <Card className="border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl flex items-start gap-3 shadow-2xs">
                      <div className="flex gap-2">
                        <ShieldCheck className="size-6 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-1.5">
                          <p className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">Tuân thủ bảo mật QP-AN (DATA-SECDEF-07)</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Trang tổng hợp này chỉ hiển thị dữ liệu phòng chống thiên tai, tìm kiếm cứu nạn và khí tượng thủy văn ở mức tổng hợp. Toàn bộ tọa độ chi tiết của các công trình quốc phòng, dữ
                            liệu tác chiến và danh tính lực lượng mật được lọc tự động và bảo mật tại cấp cơ sở dữ liệu.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <VillageEmergencyRiskHeatmap />
                    <EmergencyWeatherTimeSeriesChart data={weatherRainfallData} windSpeedKmh={28} warningLevel="Cảnh báo cấp 2" bulletinCount={4} lastBulletinTime="18:30 Hôm nay" status={dashboardState} />
                  </div>
                ),
              },
              {
                value: "D",
                label: "Nhiệm vụ giao (D)",
                content: (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-4">
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Nhiệm vụ Tỉnh giao</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">42</span>
                          <span className="text-xs text-muted-foreground">nhiệm vụ</span>
                        </div>
                        <span className="text-[9px] text-emerald-600 font-bold block mt-2">100% hoàn thành đúng hạn</span>
                      </Card>
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Nhiệm vụ Huyện giao</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">78</span>
                          <span className="text-xs text-muted-foreground">nhiệm vụ</span>
                        </div>
                        <span className="text-[9px] text-amber-500 font-bold block mt-2">4 nhiệm vụ đang trễ hạn</span>
                      </Card>
                      <Card className="border-border bg-card/50 p-4">
                        <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Tỷ lệ chung đúng hạn</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-foreground">94.5%</span>
                          <span className="text-xs text-muted-foreground">tổng số</span>
                        </div>
                        <span className="text-[9px] text-rose-500 font-bold block mt-2">-1.5% so với tháng trước</span>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6">
                      <AssignedTaskStatusDonutChart data={taskStatusData} status={dashboardState} />
                      <AssignedTaskTimeSeriesChart data={taskTrendData} status={dashboardState} />
                    </div>
                    <TaskOverdueHeatmap status={dashboardState} />
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Sidebar Alerts / Incidents (Col-span 1) */}
        <div className="@4xl:col-span-1 space-y-4">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <AlertCircle className="size-4 text-rose-500" /> Cảnh báo điều hành &amp; Giám sát
              </CardTitle>
              <CardDescription className="text-xs">Các rủi ro chỉ tiêu và điểm nóng cần chỉ đạo kịp thời từ Thường trực UBND xã</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertList.map((alt) => (
                <div key={alt.id} className="p-3 bg-muted/30 border border-border/50 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs leading-normal">{alt.title}</span>
                    <Badge
                      variant="outline"
                      className={`text-[8px] font-bold uppercase ${alt.severity === "high" ? "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse" : alt.severity === "medium" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"}`}
                    >
                      {alt.severity === "high" ? "Nguy cấp" : alt.severity === "medium" ? "Trung bình" : "Thấp"}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">{alt.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
