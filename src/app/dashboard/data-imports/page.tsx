// src/app/dashboard/data-imports/page.tsx

'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { ReportingPeriodPicker } from '@/components/common/ReportingPeriodPicker';
import { OrganizationSelect } from '@/components/common/OrganizationSelect';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { FileDown, Upload, FileSpreadsheet, AlertCircle, CheckCircle2, ChevronRight, ListFilter } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common';

interface ValidationErr {
  row: number;
  col: string;
  val: string;
  msg: string;
}

export default function DataImportsPage() {
  const { currentRole } = useTenant();
  const [dataGroup, setDataGroup] = React.useState('agriculture');
  const [period, setPeriod] = React.useState('2026-M06');
  const [orgUnit, setOrgUnit] = React.useState('unit-eco');
  const [file, setFile] = React.useState<File | null>(null);

  // Validation status
  const [isValidated, setIsValidated] = React.useState(false);
  const [validationReport, setValidationReport] = React.useState<{
    total: number;
    valid: number;
    duplicate: number;
    invalid: number;
    errors: ValidationErr[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setIsValidated(false);
      setValidationReport(null);
    }
  };

  const handleValidate = () => {
    if (!file) {
      toast.error('Vui lòng chọn hoặc kéo thả tệp Excel dữ liệu cần kiểm tra.');
      return;
    }

    toast.loading('Đang chạy kiểm tra định dạng và tính toàn vẹn dữ liệu...');
    setTimeout(() => {
      toast.dismiss();
      setIsValidated(true);

      // Simulate checking: if filename has "err" or is second upload, show mock errors
      if (file.name.toLowerCase().includes('error') || file.name.toLowerCase().includes('loi')) {
        setValidationReport({
          total: 45,
          valid: 38,
          duplicate: 4,
          invalid: 3,
          errors: [
            { row: 5, col: 'Diện tích (ha)', val: '-1.5', msg: 'Diện tích không thể là giá trị âm.' },
            { row: 18, col: 'Năng suất', val: 'abc', msg: 'Giá trị năng suất phải là định dạng số thực.' },
            { row: 32, col: 'Mã thôn', val: 'KHAM-12', msg: 'Mã địa bàn không khớp danh mục xã Lao Bảo.' }
          ]
        });
        toast.warning('Phát hiện lỗi định dạng chỉ tiêu dữ liệu!');
      } else {
        setValidationReport({
          total: 62,
          valid: 62,
          duplicate: 0,
          invalid: 0,
          errors: []
        });
        toast.success('Kiểm tra dữ liệu hoàn tất! Tệp sẵn sàng để nhập.');
      }
    }, 1200);
  };

  const handleImport = () => {
    if (!validationReport) return;
    if (validationReport.invalid > 0) {
      toast.error('Không thể nhập tệp chứa dòng dữ liệu không hợp lệ. Vui lòng sửa lại tệp Excel.');
      return;
    }

    toast.success(`Đã nhập thành công ${validationReport.valid} bản ghi dữ liệu chỉ tiêu!`, {
      description: `Kỳ báo cáo: ${period} | Trạng thái: Bản nháp chờ phê duyệt.`
    });
    setFile(null);
    setIsValidated(false);
    setValidationReport(null);
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Upload className="w-6 h-6 text-primary" />
            Nhập Dữ liệu
          </>
        }
        description="Tải lên các biểu mẫu chỉ tiêu số liệu định kỳ xã Lao Bảo. Hệ thống sẽ chạy kiểm dịch và đối soát logic chéo tự động."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Control Card */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-foreground">Cấu hình tham số nhập liệu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-foreground">Lĩnh vực dữ liệu</Label>
                <Select value={dataGroup} onValueChange={setDataGroup}>
                  <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                    <SelectValue placeholder="Lĩnh vực dữ liệu" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="population" className="cursor-pointer">Hành chính &amp; Dân cư</SelectItem>
                    <SelectItem value="agriculture" className="cursor-pointer">Nông nghiệp &amp; Môi trường</SelectItem>
                    <SelectItem value="economy" className="cursor-pointer">Dữ liệu Kinh tế</SelectItem>
                    <SelectItem value="tourism" className="cursor-pointer">Du lịch &amp; Dịch vụ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-foreground">Kỳ báo cáo dữ liệu</Label>
                <ReportingPeriodPicker
                  value={period}
                  onValueChange={setPeriod}
                  className="bg-background border-border text-xs h-9"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-foreground">Đơn vị chịu trách nhiệm</Label>
                <OrganizationSelect
                  value={orgUnit}
                  onValueChange={setOrgUnit}
                  className="bg-background border-border text-xs h-9"
                />
              </div>

              <Separator className="bg-border/60" />

              {/* Upload Drag zone */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">Chọn tệp dữ liệu nguồn</Label>
                <div className="border border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/10 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileSpreadsheet className="size-8 text-primary mx-auto mb-2" />
                  <p className="text-[11px] font-semibold text-foreground">
                    {file ? file.name : 'Kéo thả hoặc Click để chọn tệp'}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Hỗ trợ tệp định dạng .xlsx hoặc .xls tối đa 10MB
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={handleValidate}
                  disabled={!file}
                  className="w-full text-xs h-9 cursor-pointer"
                  variant="outline"
                >
                  Kiểm tra định dạng
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!isValidated || (validationReport?.invalid || 0) > 0}
                  className="w-full text-xs h-9 cursor-pointer"
                >
                  Nhập vào hệ thống
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 space-y-4">
          {isValidated && validationReport ? (
            <Card className="border-border bg-card shadow-2xs">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-4.5 text-primary" />
                  Báo cáo kiểm thử định dạng & đối soát chỉ tiêu
                </CardTitle>
                <CardDescription className="text-xs">
                  Kết quả quét đối chiếu cấu trúc cột chỉ tiêu schema chuẩn của xã Lao Bảo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 border border-border bg-muted/20 rounded-xl">
                    <span className="text-[10px] text-muted-foreground font-semibold">Tổng số dòng quét</span>
                    <p className="text-base font-bold text-foreground mt-0.5">{validationReport.total}</p>
                  </div>
                  <div className="p-3 border border-border bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 rounded-xl">
                    <span className="text-[10px] text-muted-foreground font-semibold">Dòng hợp lệ</span>
                    <p className="text-base font-bold mt-0.5">{validationReport.valid}</p>
                  </div>
                  <div className="p-3 border border-border bg-amber-500/5 text-amber-700 dark:text-amber-400 rounded-xl">
                    <span className="text-[10px] text-muted-foreground font-semibold">Dòng trùng lặp</span>
                    <p className="text-base font-bold mt-0.5">{validationReport.duplicate}</p>
                  </div>
                  <div className="p-3 border border-border bg-rose-500/5 text-rose-700 dark:text-rose-400 rounded-xl">
                    <span className="text-[10px] text-muted-foreground font-semibold">Dòng lỗi dữ liệu</span>
                    <p className="text-base font-bold mt-0.5">{validationReport.invalid}</p>
                  </div>
                </div>

                {/* Error Table if any */}
                {validationReport.errors.length > 0 ? (
                  <div className="space-y-3.5">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="size-4.5 text-rose-500" />
                      Chi tiết các lỗi cần sửa đổi
                    </h3>
                    <div className="border border-border/60 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead className="w-16 text-center text-xs font-bold">Dòng</TableHead>
                            <TableHead className="w-32 text-xs font-bold">Cột chỉ tiêu</TableHead>
                            <TableHead className="w-24 text-xs font-bold">Giá trị lỗi</TableHead>
                            <TableHead className="text-xs font-bold">Thông điệp lỗi hệ thống</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationReport.errors.map((err, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-center py-2 px-3 font-semibold text-foreground text-xs">{err.row}</TableCell>
                              <TableCell className="py-2 px-3 text-muted-foreground font-semibold text-xs">{err.col}</TableCell>
                              <TableCell className="py-2 px-3 text-rose-600 dark:text-rose-400 font-bold text-xs">{err.val}</TableCell>
                              <TableCell className="py-2 px-3 text-rose-600 dark:text-rose-400 text-xs font-medium">{err.msg}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 text-center space-y-2">
                    <CheckCircle2 className="size-8 text-emerald-500 mx-auto" />
                    <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Tệp dữ liệu sạch hoàn toàn!</h4>
                    <p className="text-[10px] text-muted-foreground max-w-sm mx-auto">
                      Hệ thống không tìm thấy bất kỳ lỗi logic hay sai lệch biểu mẫu nào. Bạn có thể nhấn nút &quot;Nhập vào hệ thống&quot; ở bảng cấu hình bên trái.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="border border-border/80 rounded-xl p-10 text-center space-y-3 bg-muted/5 flex flex-col justify-center items-center h-full min-h-[300px]">
              <div className="w-12 h-12 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground/60 bg-card shadow-2xs">
                <FileSpreadsheet className="w-5.5 h-5.5 text-primary" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-xs font-bold text-foreground">Chưa có tệp kiểm tra</h3>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Kéo thả hoặc click chọn tệp báo cáo Excel, cấu hình lĩnh vực, kỳ báo cáo dữ liệu ở bảng bên trái rồi nhấn &quot;Kiểm tra định dạng&quot;.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
