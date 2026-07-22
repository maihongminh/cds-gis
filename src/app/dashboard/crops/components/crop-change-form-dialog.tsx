'use client';

import * as React from 'react';
import { Button, Input, Label, Checkbox } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CropChangeRecord, CropChangeReason } from '@/types/crop-change';
import { MOCK_CROP_TYPES, MOCK_SEASONS } from '@/data/mock-catalogs';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';

interface CropChangeFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: CropChangeRecord | null;
}

const REASONS: { code: CropChangeReason; label: string }[] = [
  { code: 'cropConversion', label: 'Chuyển đổi cơ cấu cây trồng' },
  { code: 'naturalDisaster', label: 'Thiên tai (Lũ lụt, sạt lở, hạn hán...)' },
  { code: 'disease', label: 'Dịch bệnh hại cây trồng' },
  { code: 'poorHarvest', label: 'Thất thu mùa vụ / Thời tiết kém' },
  { code: 'marketChange', label: 'Biến động thị trường giá cả' },
  { code: 'landChange', label: 'Thay đổi đất đai (Khai hoang, hiến đất...)' },
  { code: 'other', label: 'Nguyên nhân khác' },
];

export function CropChangeFormDialog({
  isOpen,
  onOpenChange,
  editingItem,
}: CropChangeFormDialogProps) {
  const isEdit = !!editingItem;

  // Form State
  const [hhCode, setHhCode] = React.useState('');
  const [cropType, setCropType] = React.useState('');
  const [period, setPeriod] = React.useState('2026-XH');
  const [prevArea, setPrevArea] = React.useState('');
  const [currArea, setCurrArea] = React.useState('');
  const [prevOutput, setPrevOutput] = React.useState('');
  const [currOutput, setCurrOutput] = React.useState('');
  const [reason, setReason] = React.useState<CropChangeReason>('cropConversion');
  const [note, setNote] = React.useState('');

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      const hh = MOCK_HOUSEHOLDS.find(h => h.id === editingItem.householdId);
      setHhCode(hh ? hh.code : editingItem.householdId);
      setCropType(editingItem.cropTypeCode);
      setPeriod(editingItem.period);
      setPrevArea(String(editingItem.previousAreaHa));
      setCurrArea(String(editingItem.currentAreaHa));
      setPrevOutput(String(editingItem.previousOutputKg));
      setCurrOutput(String(editingItem.currentOutputKg));
      setReason(editingItem.reason);
      setNote(editingItem.note || '');
    } else {
      setHhCode('');
      setCropType('');
      setPeriod('2026-XH');
      setPrevArea('');
      setCurrArea('');
      setPrevOutput('');
      setCurrOutput('');
      setReason('cropConversion');
      setNote('');
    }
  }, [editingItem, isOpen]);

  // Compute live change percentages
  const computedAreaChange = React.useMemo(() => {
    const prev = parseFloat(prevArea);
    const curr = parseFloat(currArea);
    if (isNaN(prev) || isNaN(curr) || prev === 0) return null;
    const diff = curr - prev;
    const pct = (diff / prev) * 100;
    return {
      diff: Number(diff.toFixed(2)),
      pct: Number(pct.toFixed(1)),
    };
  }, [prevArea, currArea]);

  const computedOutputChange = React.useMemo(() => {
    const prev = parseInt(prevOutput);
    const curr = parseInt(currOutput);
    if (isNaN(prev) || isNaN(curr) || prev === 0) return null;
    const diff = curr - prev;
    const pct = (diff / prev) * 100;
    return {
      diff,
      pct: Number(pct.toFixed(1)),
    };
  }, [prevOutput, currOutput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hhCode || !cropType || !prevArea || !currArea || !prevOutput || !currOutput) {
      toast.error('Vui lòng nhập đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    const hh = MOCK_HOUSEHOLDS.find((h) => h.code === hhCode || h.id === hhCode);
    if (!hh) {
      toast.error('Mã hộ dân cư không hợp lệ hoặc không tồn tại trên địa bàn!');
      return;
    }

    const cropTypeName = MOCK_CROP_TYPES.find((c) => c.code === cropType)?.name || cropType;

    toast.success(`${isEdit ? 'Cập nhật' : 'Ghi nhận'} biến động cây trồng thành công!`, {
      description: `Hộ ${hh.headName} — Cây trồng: ${cropTypeName} (${currArea} ha)`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">
            {isEdit ? 'Cập nhật ghi nhận biến động số liệu' : 'Khai báo biến động số liệu cây trồng'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Theo dõi sự thay đổi diện tích gieo trồng và sản lượng nông sản để đánh giá biến động định kỳ cấp thôn/xã.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Household */}
            <div className="space-y-1">
              <Label htmlFor="hhCode" className="text-xs">Mã hộ dân cư <span className="text-destructive">*</span></Label>
              <Input
                id="hhCode"
                value={hhCode}
                onChange={(e) => setHhCode(e.target.value)}
                placeholder="HH-30-001..."
                className="h-9 text-xs"
                disabled={isEdit}
              />
            </div>

            {/* Crop Type */}
            <div className="space-y-1">
              <Label htmlFor="cropType" className="text-xs">Loại cây trồng <span className="text-destructive">*</span></Label>
              <Select value={cropType} onValueChange={setCropType} disabled={isEdit}>
                <SelectTrigger id="cropType" className="h-9 text-xs bg-card">
                  <SelectValue placeholder="Chọn cây trồng..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  {MOCK_CROP_TYPES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="cursor-pointer">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period */}
            <div className="space-y-1">
              <Label htmlFor="period" className="text-xs">Kỳ vụ ghi nhận <span className="text-destructive">*</span></Label>
              <Select value={period} onValueChange={setPeriod} disabled={isEdit}>
                <SelectTrigger id="period" className="h-9 text-xs bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  {MOCK_SEASONS.map((s) => (
                    <SelectItem key={s.code} value={s.code} className="cursor-pointer">
                      {s.season} {s.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <Label htmlFor="reason" className="text-xs">Lý do biến động <span className="text-destructive">*</span></Label>
              <Select value={reason} onValueChange={(val: CropChangeReason) => setReason(val)}>
                <SelectTrigger id="reason" className="h-9 text-xs bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  {REASONS.map((r) => (
                    <SelectItem key={r.code} value={r.code} className="cursor-pointer">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area block */}
            <div className="border border-border/40 rounded-xl p-3 bg-muted/5 space-y-2 col-span-1 sm:col-span-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Thông số diện tích</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="prevArea" className="text-[11px]">Diện tích kỳ trước (ha) <span className="text-destructive">*</span></Label>
                  <Input
                    id="prevArea"
                    type="number"
                    step="0.01"
                    value={prevArea}
                    onChange={(e) => setPrevArea(e.target.value)}
                    placeholder="0.85"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="currArea" className="text-[11px]">Diện tích kỳ này (ha) <span className="text-destructive">*</span></Label>
                  <Input
                    id="currArea"
                    type="number"
                    step="0.01"
                    value={currArea}
                    onChange={(e) => setCurrArea(e.target.value)}
                    placeholder="1.10"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              {computedAreaChange && (
                <div className="text-[11px] pt-1">
                  Biến động diện tích: {' '}
                  <span className={`font-bold ${computedAreaChange.diff > 0 ? 'text-emerald-600 dark:text-emerald-400' : computedAreaChange.diff < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'}`}>
                    {computedAreaChange.diff > 0 ? '+' : ''}{computedAreaChange.diff} ha ({computedAreaChange.diff > 0 ? '+' : ''}{computedAreaChange.pct}%)
                  </span>
                </div>
              )}
            </div>

            {/* Output block */}
            <div className="border border-border/40 rounded-xl p-3 bg-muted/5 space-y-2 col-span-1 sm:col-span-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Thông số sản lượng</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="prevOutput" className="text-[11px]">Sản lượng kỳ trước (kg) <span className="text-destructive">*</span></Label>
                  <Input
                    id="prevOutput"
                    type="number"
                    value={prevOutput}
                    onChange={(e) => setPrevOutput(e.target.value)}
                    placeholder="450"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="currOutput" className="text-[11px]">Sản lượng kỳ này (kg) <span className="text-destructive">*</span></Label>
                  <Input
                    id="currOutput"
                    type="number"
                    value={currOutput}
                    onChange={(e) => setCurrOutput(e.target.value)}
                    placeholder="520"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              {computedOutputChange && (
                <div className="text-[11px] pt-1">
                  Biến động sản lượng: {' '}
                  <span className={`font-bold ${computedOutputChange.diff > 0 ? 'text-emerald-600 dark:text-emerald-400' : computedOutputChange.diff < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'}`}>
                    {computedOutputChange.diff > 0 ? '+' : ''}{computedOutputChange.diff.toLocaleString()} kg ({computedOutputChange.diff > 0 ? '+' : ''}{computedOutputChange.pct}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <Label htmlFor="note" className="text-xs">Chi tiết nguyên nhân / Ghi chú</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Chuyển đổi một phần diện tích đất lúa bạc màu sang trồng quế thơm..."
              className="text-xs min-h-[70px] bg-card border-border"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
            </DialogClose>
            <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu biến động</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
