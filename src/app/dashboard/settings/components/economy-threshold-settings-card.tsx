'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { SystemSettings } from '@/types/settings';
import { toast } from 'sonner';
import { Save, Scale } from 'lucide-react';

function formatVND(amount: number) {
  return amount.toLocaleString('vi-VN');
}

interface EconomyThresholdSettingsCardProps {
  settings: SystemSettings;
}

export function EconomyThresholdSettingsCard({ settings }: EconomyThresholdSettingsCardProps) {
  const [povertyThreshold, setPovertyThreshold] = useState(
    String(settings.povertyIncomeThresholdMonthly)
  );
  const [nearPovertyThreshold, setNearPovertyThreshold] = useState(
    String(settings.nearPovertyIncomeThresholdMonthly)
  );
  const [standardsNote, setStandardsNote] = useState('Nghị định số 07/2021/NĐ-CP chuẩn nghèo đa chiều');

  function handleSave() {
    const p = parseInt(povertyThreshold);
    const np = parseInt(nearPovertyThreshold);
    if (isNaN(p) || isNaN(np)) {
      toast.error('Vui lòng nhập số hợp lệ');
      return;
    }
    if (p >= np) {
      toast.error('Ngưỡng nghèo phải nhỏ hơn ngưỡng cận nghèo');
      return;
    }
    toast.success(`Đã lưu ngưỡng phân loại kinh tế: Nghèo < ${formatVND(p)} đ, Cận nghèo < ${formatVND(np)} đ`);
  }

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3">
        <Scale className="size-5 text-primary shrink-0" />
        <div>
          <CardTitle className="text-base">Chuẩn nghèo & Cận nghèo</CardTitle>
          <CardDescription className="text-xs">
            Cấu hình mức thu nhập bình quân/người/tháng để xếp loại kinh tế hộ
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="setting-poverty-threshold">
              Ngưỡng hộ nghèo (VND/người/tháng)
            </Label>
            <Input
              id="setting-poverty-threshold"
              type="number"
              value={povertyThreshold}
              onChange={(e) => setPovertyThreshold(e.target.value)}
              className="h-9 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Hiện tại: {formatVND(settings.povertyIncomeThresholdMonthly)} VND
            </p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="setting-near-poverty-threshold">
              Ngưỡng cận nghèo (VND/người/tháng)
            </Label>
            <Input
              id="setting-near-poverty-threshold"
              type="number"
              value={nearPovertyThreshold}
              onChange={(e) => setNearPovertyThreshold(e.target.value)}
              className="h-9 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Hiện tại: {formatVND(settings.nearPovertyIncomeThresholdMonthly)} VND
            </p>
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="setting-standards-note">Chuẩn áp dụng / Căn cứ pháp lý</Label>
          <Input
            id="setting-standards-note"
            value={standardsNote}
            onChange={(e) => setStandardsNote(e.target.value)}
            placeholder="VD: Nghị định 07/2021/NĐ-CP"
            className="h-9 text-xs"
          />
        </div>

        <div className="rounded-md border border-border/60 bg-muted/20 p-3.5 text-xs space-y-1.5">
          <p className="font-semibold text-foreground">Phân tích xếp loại tự động:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Thu nhập đầu người ≤ Ngưỡng nghèo: Phân loại <span className="font-semibold text-rose-600 dark:text-rose-400">Hộ nghèo</span></li>
            <li>Ngưỡng nghèo &lt; Thu nhập ≤ Ngưỡng cận nghèo: Phân loại <span className="font-semibold text-amber-600 dark:text-amber-400">Hộ cận nghèo</span></li>
            <li>Thu nhập &gt; Ngưỡng cận nghèo: Phân loại <span className="font-semibold text-emerald-600 dark:text-emerald-400">Hộ trung bình trở lên</span></li>
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <Button id="btn-save-economy-thresholds" size="sm" onClick={handleSave} className="cursor-pointer gap-1.5 text-xs h-8.5">
            <Save className="size-3.5" />
            Lưu ngưỡng phân loại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
