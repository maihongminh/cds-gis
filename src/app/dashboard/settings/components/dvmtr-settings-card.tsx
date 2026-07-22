'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { SystemSettings } from '@/types/settings';
import { toast } from 'sonner';
import { Save, Trees } from 'lucide-react';

interface DvmtrSettingsCardProps {
  settings: SystemSettings;
}

export function DvmtrSettingsCard({ settings }: DvmtrSettingsCardProps) {
  const [paymentRate, setPaymentRate] = useState(
    String(settings.dvmtrPaymentRatePerHa)
  );
  const [applicableYear, setApplicableYear] = useState('2026');

  function handleSave() {
    const rate = parseInt(paymentRate);
    if (isNaN(rate) || rate <= 0) {
      toast.error('Đơn giá DVMTR phải là số dương');
      return;
    }
    toast.success(
      `Đã cập nhật đơn giá DVMTR áp dụng cho năm ${applicableYear}: ${rate.toLocaleString('vi-VN')} VND/ha/năm`
    );
  }

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3">
        <Trees className="size-5 text-primary shrink-0" />
        <div>
          <CardTitle className="text-base">Cấu hình Dịch vụ Môi trường Rừng</CardTitle>
          <CardDescription className="text-xs">
            Cài đặt đơn giá DVMTR chi trả cho hộ gia đình nhận khoán bảo vệ rừng
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="setting-dvmtr-rate">Đơn giá chi trả (VND/ha/năm)</Label>
            <Input
              id="setting-dvmtr-rate"
              type="number"
              value={paymentRate}
              onChange={(e) => setPaymentRate(e.target.value)}
              className="h-9 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Hiện tại: {settings.dvmtrPaymentRatePerHa.toLocaleString('vi-VN')} VND/ha/năm
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="setting-dvmtr-year">Năm áp dụng đơn giá</Label>
            <Input
              id="setting-dvmtr-year"
              type="number"
              value={applicableYear}
              onChange={(e) => setApplicableYear(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="rounded-md border border-border/60 bg-muted/20 p-3.5 text-xs space-y-1.5">
          <p className="font-semibold text-foreground">Công thức chi trả DVMTR:</p>
          <div className="font-mono bg-muted/50 p-2 rounded border border-border/40 text-[10px] text-primary select-all">
            Thực nhận = Diện tích nhận khoán (ha) x Đơn giá (VND/ha) x Hệ số K
          </div>
          <p className="text-muted-foreground text-[10px] leading-relaxed">
            * Hệ số K được tính dựa trên trữ lượng rừng, trạng thái rừng và mục đích phòng hộ theo quyết định của Chi cục Lâm nghiệp tỉnh.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button id="btn-save-dvmtr-settings" size="sm" onClick={handleSave} className="cursor-pointer gap-1.5 text-xs h-8.5">
            <Save className="size-3.5" />
            Lưu đơn giá DVMTR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
