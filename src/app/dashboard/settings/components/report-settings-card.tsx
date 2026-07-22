'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { toast } from 'sonner';
import { Save, BarChart3 } from 'lucide-react';

export function ReportSettingsCard() {
  const [autoExport, setAutoExport] = useState(false);
  const [includeHamletBreakdown, setIncludeHamletBreakdown] = useState(true);
  const [includePovertyClassification, setIncludePovertyClassification] = useState(true);
  const [includeSpecialCrops, setIncludeSpecialCrops] = useState(true);

  // New fields
  const [signingOfficer, setSigningOfficer] = useState('Lê Hoàng Việt - Chủ tịch UBND xã');
  const [defaultFormat, setDefaultFormat] = useState('excel');
  const [defaultPeriod, setDefaultPeriod] = useState('month');

  function handleSave() {
    toast.success('Đã lưu cấu hình thông số báo cáo mặc định.');
  }

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3">
        <BarChart3 className="size-5 text-primary shrink-0" />
        <div>
          <CardTitle className="text-base">Cấu hình xuất báo cáo</CardTitle>
          <CardDescription className="text-xs">
            Tùy chỉnh thông tin người ký và định dạng xuất báo cáo định kỳ
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-1.5">
          <Label htmlFor="setting-signing-officer">Đại diện ký duyệt báo cáo mặc định</Label>
          <Input
            id="setting-signing-officer"
            value={signingOfficer}
            onChange={(e) => setSigningOfficer(e.target.value)}
            placeholder="Nhập chức danh và họ tên..."
            className="h-9 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="setting-default-format">Định dạng mẫu mặc định</Label>
            <Select value={defaultFormat} onValueChange={setDefaultFormat}>
              <SelectTrigger id="setting-default-format" className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel" className="text-xs cursor-pointer">Microsoft Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf" className="text-xs cursor-pointer">Adobe PDF (.pdf)</SelectItem>
                <SelectItem value="word" className="text-xs cursor-pointer">Microsoft Word (.docx)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="setting-default-period">Kỳ tổng hợp mặc định</Label>
            <Select value={defaultPeriod} onValueChange={setDefaultPeriod}>
              <SelectTrigger id="setting-default-period" className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month" className="text-xs cursor-pointer">Hằng tháng</SelectItem>
                <SelectItem value="quarter" className="text-xs cursor-pointer">Hằng quý</SelectItem>
                <SelectItem value="year" className="text-xs cursor-pointer">Hằng năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-border/40 pt-3 space-y-3">
          <p className="text-xs font-semibold text-foreground">Tùy chỉnh nội dung đính kèm</p>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="setting-auto-export" className="text-xs font-medium">Tự động xuất báo cáo định kỳ</Label>
              <p className="text-[10px] text-muted-foreground">Xuất dữ liệu tổng hợp vào ngày 01 hàng tháng</p>
            </div>
            <Switch
              id="setting-auto-export"
              checked={autoExport}
              onCheckedChange={setAutoExport}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="setting-hamlet-breakdown" className="text-xs font-medium">Báo cáo phân rã theo thôn</Label>
              <p className="text-[10px] text-muted-foreground">Bao gồm chi tiết so sánh giữa các thôn</p>
            </div>
            <Switch
              id="setting-hamlet-breakdown"
              checked={includeHamletBreakdown}
              onCheckedChange={setIncludeHamletBreakdown}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="setting-poverty-classification" className="text-xs font-medium">Phân nhóm hộ nghèo đa chiều</Label>
              <p className="text-[10px] text-muted-foreground">Bao gồm danh sách phân loại hộ thu nhập thấp</p>
            </div>
            <Switch
              id="setting-poverty-classification"
              checked={includePovertyClassification}
              onCheckedChange={setIncludePovertyClassification}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="setting-special-crops" className="text-xs font-medium">Lọc cây trồng đặc sản chủ lực</Label>
              <p className="text-[10px] text-muted-foreground">Bao gồm phân tích Cà phê Arabica, Chuối Lao Bảo</p>
            </div>
            <Switch
              id="setting-special-crops"
              checked={includeSpecialCrops}
              onCheckedChange={setIncludeSpecialCrops}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button id="btn-save-report-settings" size="sm" onClick={handleSave} className="cursor-pointer gap-1.5 text-xs h-8.5">
            <Save className="size-3.5" />
            Lưu cấu hình
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
