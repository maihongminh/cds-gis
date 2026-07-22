'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { SystemSettings } from '@/types/settings';
import { toast } from 'sonner';
import { Save, Building2 } from 'lucide-react';

interface GeneralSettingsCardProps {
  settings: SystemSettings;
}

export function GeneralSettingsCard({ settings }: GeneralSettingsCardProps) {
  const [communeName, setCommuneName] = useState(settings.communeName);
  const [provinceName, setProvinceName] = useState(settings.provinceName);
  const [seasonCode, setSeasonCode] = useState(settings.activeCultivationSeasonCode);
  const [reportingYear, setReportingYear] = useState('2026');

  function handleSave() {
    toast.success('Đã lưu cấu hình thông tin đơn vị thành công.');
  }

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3">
        <Building2 className="size-5 text-primary shrink-0" />
        <div>
          <CardTitle className="text-base">Thông tin đơn vị & Địa bàn</CardTitle>
          <CardDescription className="text-xs">
            Cài đặt cơ quan quản lý và kỳ báo cáo hệ thống
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-1.5">
          <Label htmlFor="setting-commune-name">Tên đơn vị cấp xã</Label>
          <Input
            id="setting-commune-name"
            value={communeName}
            onChange={(e) => setCommuneName(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
        
        <div className="grid gap-1.5">
          <Label htmlFor="setting-province-name">Tỉnh/Thành</Label>
          <Input
            id="setting-province-name"
            value={provinceName}
            onChange={(e) => setProvinceName(e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="setting-reporting-year">Năm báo cáo hiện tại</Label>
            <Input
              id="setting-reporting-year"
              type="number"
              value={reportingYear}
              onChange={(e) => setReportingYear(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="setting-season-code">Vụ canh tác chính</Label>
            <Input
              id="setting-season-code"
              value={seasonCode}
              onChange={(e) => setSeasonCode(e.target.value)}
              placeholder="VD: 2026-XH"
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button id="btn-save-general-settings" size="sm" onClick={handleSave} className="cursor-pointer gap-1.5 text-xs h-8.5">
            <Save className="size-3.5" />
            Lưu đơn vị
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
