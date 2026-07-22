const fs = require('fs');

const pagePath = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// Replace all chart imports
const importRegex = /import\s+\{[^}]+\}\s+from\s+['"]@\/app\/dashboard\/components\/charts\/[^'"]+['"];/g;
content = content.replace(importRegex, '');

const newImports = `
import { BudgetCompletionGauge } from '@/app/dashboard/components/charts/budget-completion-gauge';
import { BudgetRevenueTimeSeriesChart } from '@/app/dashboard/components/charts/budget-revenue-time-series-chart';
import { AdministrativeProcedureDonutChart } from '@/app/dashboard/components/charts/administrative-procedure-donut-chart';
import { AdministrativeIndicatorsProgress } from '@/app/dashboard/components/charts/administrative-indicators-progress';
import { OcopProductBarChart } from '@/app/dashboard/components/charts/ocop-product-bar-chart';
import { AgricultureProductionTimeSeriesChart } from '@/app/dashboard/components/charts/agriculture-production-time-series-chart';
import { BudgetCompositionStackedBarChart } from '@/app/dashboard/components/charts/budget-composition-stacked-bar-chart';
import { LocalEconomyHorizontalBarChart } from '@/app/dashboard/components/charts/local-economy-horizontal-bar-chart';
import { EconomicStructureDonutChart } from '@/app/dashboard/components/charts/economic-structure-donut-chart';
import { VillageEmergencyRiskHeatmap } from '@/app/dashboard/components/charts/village-emergency-risk-heatmap';
import { EmergencyWeatherTimeSeriesChart } from '@/app/dashboard/components/charts/emergency-weather-time-series-chart';
import { AssignedTaskStatusDonutChart } from '@/app/dashboard/components/charts/assigned-task-status-donut-chart';
import { AssignedTaskTimeSeriesChart } from '@/app/dashboard/components/charts/assigned-task-time-series-chart';
`;

content = content.replace(/import { PageHeader.*?;/, match => match + '\n' + newImports);

// Replace Tab A content
content = content.replace(/{\/\* TAB A: Chỉ số điều hành thường xuyên \*\/}[\s\S]*?(?={\/\* TAB B:)/, `          {/* TAB A: Chỉ số điều hành thường xuyên */}
          {activeTab === "A" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold flex items-center gap-1.5"><Building className="size-3.5 text-blue-500" /> Doanh nghiệp hoạt động</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">86</span><span className="text-xs text-muted-foreground">đơn vị</span></div>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-2">+3 so với quý trước</span>
                </Card>
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold flex items-center gap-1.5"><Briefcase className="size-3.5 text-emerald-500" /> Hợp tác xã</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">12</span><span className="text-xs text-muted-foreground">đơn vị</span></div>
                  <span className="text-[9px] text-muted-foreground font-semibold block mt-2">Đạt 100% kế hoạch</span>
                </Card>
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold flex items-center gap-1.5"><Home className="size-3.5 text-amber-500" /> Hộ kinh doanh</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">420</span><span className="text-xs text-muted-foreground">hộ</span></div>
                  <span className="text-[9px] text-rose-500 font-bold block mt-2">-5 so với quý trước</span>
                </Card>
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold flex items-center gap-1.5"><Activity className="size-3.5 text-purple-500" /> Thu ngân sách lũy kế</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">16.2</span><span className="text-xs text-muted-foreground">tỷ VNĐ</span></div>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-2">Đạt 73.6% dự toán</span>
                </Card>
              </div>

              {/* Ngân sách */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <BudgetCompletionGauge currentValue={16.2e9} targetValue={22e9} status={dashboardState} />
                </div>
                <div className="md:col-span-8">
                  <BudgetRevenueTimeSeriesChart data={budgetTrendData} status={dashboardState} />
                </div>
              </div>
              <BudgetCompositionStackedBarChart status={dashboardState} />

              {/* Kinh tế địa phương */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OcopProductBarChart data={ocopData} status={dashboardState} />
                <AgricultureProductionTimeSeriesChart data={cropTrendData} status={dashboardState} />
              </div>

              {/* Cải cách hành chính */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-6">
                  <AdministrativeProcedureDonutChart status={dashboardState} />
                </div>
                <div className="md:col-span-6">
                  <AdministrativeIndicatorsProgress status={dashboardState} />
                </div>
              </div>
            </div>
          )}

`);

// Replace Tab B content
content = content.replace(/{\/\* TAB B: Chỉ số kế hoạch KT-XH \*\/}[\s\S]*?(?={\/\* TAB C:)/, `          {/* TAB B: Chỉ số kế hoạch KT-XH */}
          {activeTab === "B" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Hộ nghèo đa chiều</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">142</span><span className="text-xs text-muted-foreground">hộ</span></div>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-2">Tỷ lệ nghèo: 2.6%</span>
                </Card>
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Hộ cận nghèo</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">210</span><span className="text-xs text-muted-foreground">hộ</span></div>
                  <span className="text-[9px] text-muted-foreground font-semibold block mt-2">Tỷ lệ cận nghèo: 3.8%</span>
                </Card>
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Giải quyết việc làm mới</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">340</span><span className="text-xs text-muted-foreground">lao động</span></div>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-2">Đạt 85% kế hoạch năm</span>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LocalEconomyHorizontalBarChart status={dashboardState} />
                <EconomicStructureDonutChart data={[]} totalGrdp={785} status={dashboardState} />
              </div>
            </div>
          )}

`);

// Replace Tab C content
content = content.replace(/{\/\* TAB C: Chỉ số phòng chống thiên tai \(Khẩn cấp\) \*\/}[\s\S]*?(?={\/\* TAB D:)/, `          {/* TAB C: Chỉ số phòng chống thiên tai (Khẩn cấp) */}
          {activeTab === "C" && (
            <div className="space-y-6">
              <Card className="border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl flex items-start gap-3 shadow-2xs">
                <div className="flex gap-2">
                  <ShieldCheck className="size-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <p className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">Tuân thủ bảo mật QP-AN (DATA-SECDEF-07)</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Trang tổng hợp này chỉ hiển thị dữ liệu phòng chống thiên tai, tìm kiếm cứu nạn và khí tượng thủy văn ở mức tổng hợp. Toàn bộ tọa độ chi tiết của các công trình quốc phòng, dữ liệu tác chiến và danh tính lực lượng mật được lọc tự động và bảo mật tại cấp cơ sở dữ liệu.
                    </p>
                  </div>
                </div>
              </Card>

              <VillageEmergencyRiskHeatmap />
              <EmergencyWeatherTimeSeriesChart data={weatherRainfallData} windSpeedKmh={28} warningLevel="Cảnh báo cấp 2" bulletinCount={4} lastBulletinTime="18:30 Hôm nay" status={dashboardState} />
            </div>
          )}

`);

// Replace Tab D content
content = content.replace(/{\/\* TAB D: Chỉ số chỉ đạo điều hành \(Nhiệm vụ giao\) \*\/}[\s\S]*?(?=<\/div>\s*{\/\* Sidebar)/, `          {/* TAB D: Chỉ số chỉ đạo điều hành (Nhiệm vụ giao) */}
          {activeTab === "D" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Nhiệm vụ Tỉnh giao</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">42</span><span className="text-xs text-muted-foreground">nhiệm vụ</span></div>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-2">100% hoàn thành đúng hạn</span>
                </Card>
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Nhiệm vụ Huyện giao</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">78</span><span className="text-xs text-muted-foreground">nhiệm vụ</span></div>
                  <span className="text-[9px] text-amber-500 font-bold block mt-2">4 nhiệm vụ đang trễ hạn</span>
                </Card>
                <Card className="border-border bg-card/50 p-4">
                  <span className="text-[9px] text-muted-foreground uppercase font-extrabold">Tỷ lệ chung đúng hạn</span>
                  <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-bold text-foreground">94.5%</span><span className="text-xs text-muted-foreground">tổng số</span></div>
                  <span className="text-[9px] text-rose-500 font-bold block mt-2">-1.5% so với tháng trước</span>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AssignedTaskStatusDonutChart data={taskStatusData} status={dashboardState} />
                <AssignedTaskTimeSeriesChart data={taskTrendData} status={dashboardState} />
              </div>
            </div>
          )}
        `);

fs.writeFileSync(pagePath, content);
console.log('Done replacing page content');
