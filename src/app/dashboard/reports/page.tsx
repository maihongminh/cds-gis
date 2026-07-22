// src/app/dashboard/reports/page.tsx
'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Breadcrumbs,
  PageHeader,
  CommonTabs,
  SectionCard,
  ActionMenu,
} from '@/components/common';
import {
  Button,
  Badge,
  Card,
  CardContent,
  Label,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  FileSpreadsheet,
  FileDown,
  Download,
  Trash2,
  CheckCircle2,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { ExportReportDialog } from './components/export-report-dialog';
import { ALL_INDICATORS } from '@/data/mock-indicators';
import { VILLAGES } from '@/data/laobao-administrative-units';

interface ReportTemplate {
  id: string;
  code: string;
  title: string;
  dataGroup: string;
  description: string;
  securityLevel: 'public' | 'confidential';
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 'rep-1', code: 'BC-NN', title: 'Báo cáo nông nghiệp & vùng trồng OCOP', dataGroup: 'agriculture', description: 'Thống kê chi tiết diện tích hoa màu, sản lượng sâm, lúa rẫy và tiến độ thu hoạch.', securityLevel: 'public' },
  { id: 'rep-2', code: 'BC-DD', title: 'Báo cáo quản lý quy hoạch đất đai', dataGroup: 'land', description: 'Tổng hợp quỹ đất công ích, tình trạng chuyển đổi mục đích canh tác nông nghiệp.', securityLevel: 'public' },
  { id: 'rep-3', code: 'BC-DL', title: 'Báo cáo phát triển du lịch dịch vụ', dataGroup: 'tourism', description: 'Lượt khách tham quan, doanh thu bán vé, hạ tầng cơ sở lưu trú thôn.', securityLevel: 'public' },
  { id: 'rep-4', code: 'BC-GT', title: 'Báo cáo hạ tầng giao thông thôn', dataGroup: 'transportation', description: 'Tình trạng hư hỏng mặt đường bê tông, kế hoạch duy tu đường dân sinh biên giới.', securityLevel: 'public' },
  { id: 'rep-5', code: 'BC-GD', title: 'Báo cáo mạng lưới giáo dục xã', dataGroup: 'education', description: 'Tỷ lệ học sinh đến trường, cơ sở vật chất các điểm trường vùng khó khăn.', securityLevel: 'public' },
  { id: 'rep-6', code: 'BC-YT', title: 'Báo cáo chỉ số sức khỏe & y tế cơ sở', dataGroup: 'health', description: 'Tiêm chủng mở rộng, khám chữa bệnh BHYT và phòng chống dịch bệnh.', securityLevel: 'public' },
  { id: 'rep-7', code: 'BC-ASXH', title: 'Báo cáo an sinh xã hội & trợ cấp nghèo', dataGroup: 'welfare', description: 'Hồ sơ người có công, chi trả trợ cấp bảo trợ xã hội và cấp phát quà cứu tế.', securityLevel: 'public' },
  { id: 'rep-8', code: 'BC-QPAN', title: 'Báo cáo an ninh trật tự & mốc biên giới', dataGroup: 'security_defense', description: 'Mật độ vụ việc, kết quả tuần tra phối hợp mốc giới quốc phòng.', securityLevel: 'confidential' },
  { id: 'rep-9', code: 'BC-PCTT', title: 'Báo cáo rủi ro thiên tai & sơ tán khẩn cấp', dataGroup: 'disaster', description: 'Tổng hợp điểm sạt lở xung yếu, trữ lượng vật tư 4 tại chỗ.', securityLevel: 'public' },
  { id: 'rep-10', code: 'BC-DH-TH', title: 'Báo cáo điều hành tổng hợp UBND xã', dataGroup: 'general', description: 'Tổng hợp chỉ số KPI 9 cụm dữ liệu phục vụ chỉ đạo điều hành cấp xã.', securityLevel: 'public' },
];

export default function ReportsPage() {
  const { selectedHamletCode, currentRole } = useTenant();

  // Filters state
  const [selectedHamlet, setSelectedHamlet] = React.useState(selectedHamletCode);
  const [selectedPeriod, setSelectedPeriod] = React.useState('Tháng 07/2026');
  const [selectedGroup, setSelectedGroup] = React.useState('all');
  const [selectedSecurity, setSelectedSecurity] = React.useState('all');

  // Dialog export states
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<'excel' | 'pdf'>('excel');
  const [exportTitle, setExportTitle] = React.useState('');

  const [generatedReports, setGeneratedReports] = React.useState<any[]>([]);

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setSelectedHamlet('all');
    setSelectedPeriod('Tháng 07/2026');
    setSelectedGroup('all');
    setSelectedSecurity('all');
  }, []);

  const triggerExport = (title: string, format: 'excel' | 'pdf') => {
    setExportTitle(title.replace(/\s+/g, '_'));
    setExportFormat(format);
    setIsExportOpen(true);

    // Mock adding report to history list after short timeout
    setTimeout(() => {
      const newReport = {
        id: `rep-new-${Date.now()}`,
        title: `${title} - Kết xuất kỳ ${selectedPeriod}`,
        type: format,
        generatedBy: currentRole === 'admin' ? 'Cán bộ quản trị (admin)' : 'Cán bộ chuyên môn',
        generatedAt: new Date().toISOString(),
        fileSize: '342 KB',
        status: 'completed',
      };
      setGeneratedReports((prev) => [newReport, ...prev]);
    }, 2000);
  };

  const handleDeleteReport = (id: string) => {
    setGeneratedReports((prev) => prev.filter((r) => r.id !== id));
    toast.success('Đã gỡ bỏ bản ghi lịch sử kết xuất.');
  };

  const handleDownload = (filename: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Đang tải xuống tệp ${filename}...`,
        success: `Đã tải xuống thành công tệp ${filename}!`,
        error: 'Lỗi tải xuống.',
      }
    );
  };

  // Filter templates based on security level and selected option
  const filteredTemplates = React.useMemo(() => {
    return REPORT_TEMPLATES.filter((tmpl) => {
      // Role-based security check
      if (tmpl.securityLevel === 'confidential') {
        if (!['admin', 'data_governance', 'commune_leader'].includes(currentRole || '')) {
          return false;
        }
      }

      const matchesGroup = selectedGroup === 'all' || tmpl.dataGroup === selectedGroup;
      const matchesSecurity = selectedSecurity === 'all' || tmpl.securityLevel === selectedSecurity;

      return matchesGroup && matchesSecurity;
    });
  }, [selectedGroup, selectedSecurity, currentRole]);

  // Aggregate indicators computed summary values (Executive summary report simulation)
  const reportIndicators = React.useMemo(() => {
    return ALL_INDICATORS.filter((ind) => {
      if (ind.securityLevel === 'confidential') {
        return ['admin', 'data_governance', 'commune_leader'].includes(currentRole || '');
      }
      return true;
    }).slice(0, 15); // Show first 15 representative indicators for executive summary view
  }, [currentRole]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Main Header */}
      <PageHeader
        title={
          <>
            <FileText className="w-6 h-6 text-primary" />
            Phân hệ Báo cáo &amp; Thống kê Định kỳ
          </>
        }
        description="Trung tâm kết xuất biểu mẫu báo cáo tổng hợp theo 9 phân hệ kinh tế xã hội và chỉ đạo điều hành cấp xã."
      />

      {/* 2. Filters bar */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 min-w-[120px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Thôn địa bàn</Label>
            <Select value={selectedHamlet} onValueChange={setSelectedHamlet}>
              <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                <SelectValue placeholder="Chọn thôn" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Toàn xã Lao Bảo</SelectItem>
                {VILLAGES.map((v) => (
                  <SelectItem key={v.code} value={v.code} className="cursor-pointer">Thôn {v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 min-w-[120px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Kỳ báo cáo</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                <SelectValue placeholder="Kỳ báo cáo" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="Tháng 07/2026" className="cursor-pointer">Tháng 07/2026</SelectItem>
                <SelectItem value="Quý II/2026" className="cursor-pointer">Quý II/2026</SelectItem>
                <SelectItem value="Năm 2026" className="cursor-pointer">Cả năm 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 min-w-[120px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Nhóm dữ liệu chuyên ngành</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                <SelectValue placeholder="Chọn phân hệ" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả phân hệ</SelectItem>
                <SelectItem value="agriculture" className="cursor-pointer">Nông nghiệp</SelectItem>
                <SelectItem value="land" className="cursor-pointer">Đất đai</SelectItem>
                <SelectItem value="tourism" className="cursor-pointer">Du lịch dịch vụ</SelectItem>
                <SelectItem value="transportation" className="cursor-pointer">Giao thông</SelectItem>
                <SelectItem value="education" className="cursor-pointer">Giáo dục</SelectItem>
                <SelectItem value="health" className="cursor-pointer">Y tế</SelectItem>
                <SelectItem value="welfare" className="cursor-pointer">An sinh xã hội</SelectItem>
                <SelectItem value="security_defense" className="cursor-pointer">Quốc phòng an ninh</SelectItem>
                <SelectItem value="disaster" className="cursor-pointer">Thiên tai khẩn cấp</SelectItem>
                <SelectItem value="general" className="cursor-pointer">Điều hành tổng hợp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 min-w-[100px]">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Cấp độ bảo mật</Label>
            <Select value={selectedSecurity} onValueChange={setSelectedSecurity}>
              <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                <SelectValue placeholder="Độ bảo mật" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả bảo mật</SelectItem>
                <SelectItem value="public" className="cursor-pointer">Công khai</SelectItem>
                <SelectItem value="confidential" className="cursor-pointer">Bảo mật / Mật</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(selectedHamlet !== 'all' ||
            selectedPeriod !== 'Tháng 07/2026' ||
            selectedGroup !== 'all' ||
            selectedSecurity !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer shadow-none flex items-center gap-1.5"
              >
                <RotateCcw className="size-4" />
                Xóa bộ lọc
              </Button>
            )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <CommonTabs
        defaultValue="templates"
        tabs={[
          {
            value: 'templates',
            label: 'Mẫu báo cáo 9 cụm dữ liệu & Tổng hợp',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-4">
                {filteredTemplates.map((tmpl) => (
                  <Card key={tmpl.id} className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[9px] uppercase font-bold text-muted-foreground">
                          {tmpl.code}
                        </Badge>
                        <Badge variant="secondary" className={`text-[8px] uppercase font-bold ${tmpl.securityLevel === 'confidential' ? 'bg-rose-500/10 text-rose-600' : 'bg-primary/10 text-primary'}`}>
                          {tmpl.securityLevel === 'confidential' ? 'CONFIDENTIAL (Mật)' : 'PUBLIC'}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-bold text-foreground leading-normal">{tmpl.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-4 mt-2 border-t border-border/40">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => triggerExport(tmpl.title, 'excel')}
                        className="text-[10px] text-emerald-600 hover:text-emerald-700 bg-card border-border hover:bg-muted shadow-none cursor-pointer flex-1"
                      >
                        <FileSpreadsheet className="size-3.5 mr-1" />
                        Xuất Excel
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => triggerExport(tmpl.title, 'pdf')}
                        className="text-[10px] text-rose-600 hover:text-rose-700 bg-card border-border hover:bg-muted shadow-none cursor-pointer flex-1"
                      >
                        <FileDown className="size-3.5 mr-1" />
                        Xuất PDF
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            value: 'executive-summary',
            label: 'Xem trước Báo cáo điều hành tổng hợp',
            content: (
              <div className="space-y-4 pt-4">
                <SectionCard
                  title={`Xem trước dữ liệu điều hành tổng hợp UBND xã Lao Bảo — Kỳ báo cáo: ${selectedPeriod}`}
                  actions={
                    <Button
                      size="sm"
                      onClick={() => triggerExport('Báo_cáo_điều_hành_tổng_hợp_UBND_Lao_Bảo', 'pdf')}
                      className="h-8 text-xs cursor-pointer shadow-none font-semibold text-rose-600 bg-card border border-border hover:bg-muted"
                    >
                      <FileDown className="size-4 mr-1.5" />
                      Kết xuất Báo cáo PDF
                    </Button>
                  }
                >
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <Table>
                      <TableHeader className="bg-muted/40 border-b border-border/60">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-xs">Mã chỉ số</TableHead>
                          <TableHead className="text-xs">Tên chỉ số phát triển</TableHead>
                          <TableHead className="text-right text-xs">Giá trị hiện tại</TableHead>
                          <TableHead className="text-right text-xs">Giá trị kỳ trước</TableHead>
                          <TableHead className="text-right text-xs">Chỉ tiêu đích kế hoạch</TableHead>
                          <TableHead className="text-xs">Đơn vị phụ trách</TableHead>
                          <TableHead className="text-xs">Độ tin cậy</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportIndicators.map((ind) => (
                          <TableRow key={ind.code} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                            <TableCell className="font-bold text-primary font-mono">{ind.code}</TableCell>
                            <TableCell className="font-semibold text-foreground leading-normal">{ind.name}</TableCell>
                            <TableCell className="text-right font-bold text-foreground">{ind.currentValue.toLocaleString()} {ind.unit}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{ind.previousValue.toLocaleString()} {ind.unit}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">
                              {ind.targetValue > 0 ? `${ind.targetValue.toLocaleString()} ${ind.unit}` : '—'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{ind.databaseOwner}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] uppercase font-bold">
                                {ind.dataStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </SectionCard>
              </div>
            ),
          },
          {
            value: 'history',
            label: 'Lịch sử kết xuất báo cáo số',
            content: (
              <div className="space-y-4 pt-4">
                <SectionCard title="Danh sách báo cáo số đã kết xuất thành công trong phiên">
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <Table>
                      <TableHeader className="bg-muted/40 border-b border-border/60">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-xs">Tên tệp báo cáo</TableHead>
                          <TableHead className="text-xs">Loại tệp</TableHead>
                          <TableHead className="text-xs font-semibold text-center">Dung lượng</TableHead>
                          <TableHead className="text-xs">Người thực hiện</TableHead>
                          <TableHead className="text-xs">Thời điểm tạo</TableHead>
                          <TableHead className="text-center text-xs">Trạng thái</TableHead>
                          <TableHead className="w-16 text-center text-xs">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generatedReports.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                              Chưa có tệp báo cáo nào được kết xuất trong phiên làm việc này.
                            </TableCell>
                          </TableRow>
                        ) : (
                          generatedReports.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                              <TableCell className="font-bold text-foreground">
                                <div className="flex items-center gap-2">
                                  {item.type === 'excel' ? <FileSpreadsheet className="size-5 text-emerald-600" /> : <FileDown className="size-5 text-rose-600" />}
                                  {item.title}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono uppercase font-bold text-muted-foreground">{item.type}</TableCell>
                              <TableCell className="text-center font-medium">{item.fileSize}</TableCell>
                              <TableCell className="text-muted-foreground">{item.generatedBy}</TableCell>
                              <TableCell className="text-muted-foreground">{new Date(item.generatedAt).toLocaleString()}</TableCell>
                              <TableCell className="text-center">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                  <CheckCircle2 className="size-3" />
                                  Tệp sẵn sàng
                                </span>
                              </TableCell>
                              <TableCell className="py-2 text-center">
                                <ActionMenu
                                  entityName="bản ghi báo cáo"
                                  customActions={[
                                    {
                                      label: 'Tải xuống báo cáo',
                                      icon: <Download className="size-3.5" />,
                                      onClick: () => handleDownload(item.title)
                                    }
                                  ]}
                                  onDelete={() => handleDeleteReport(item.id)}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </SectionCard>
              </div>
            ),
          },
        ]}
      />

      {/* Export progress popup */}
      <ExportReportDialog
        isOpen={isExportOpen}
        onOpenChange={setIsExportOpen}
        format={exportFormat}
        reportTitle={exportTitle}
      />
    </div>
  );
}
