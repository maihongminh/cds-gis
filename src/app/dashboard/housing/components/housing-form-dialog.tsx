'use client';

import * as React from 'react';
import { Button, Input, Label } from '@/components/ui';
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
import { useTenant } from '@/components/layout/tenant-context';
import { toast } from 'sonner';
import {
  HousingItem,
  HousingRecord,
  HousingSupportRecord,
  HousingSupportNeed,
  HousingType,
  HousingSupportStatus
} from '@/types/housing';
import { MOCK_HOUSEHOLDS } from '@/data/mock-db';

interface HousingFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: string;
  editingItem: HousingItem | null;
}

export function HousingFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: HousingFormDialogProps) {
  const { hamlets } = useTenant();
  const isEdit = !!editingItem;

  // Household selection
  const [selectedHhId, setSelectedHhId] = React.useState('');
  const [villageCode, setVillageCode] = React.useState('noc-01');
  const [householdHeadName, setHouseholdHeadName] = React.useState('');
  const [householdCode, setHouseholdCode] = React.useState('');

  // 1. Housing Record fields
  const [housingType, setHousingType] = React.useState<HousingType>('bán kiên cố');
  const [areaSqm, setAreaSqm] = React.useState('');
  const [builtYear, setBuiltYear] = React.useState('2020');
  const [condition, setCondition] = React.useState<'good' | 'average' | 'poor' | 'dangerous'>('average');
  const [degradation, setDegradation] = React.useState('');
  const [housingNote, setHousingNote] = React.useState('');

  // 2. Housing Support fields
  const [programName, setProgramName] = React.useState('Chương trình MTQG 1719 (Phát triển KT-XH vùng đồng bào DTTS)');
  const [supportType, setSupportType] = React.useState<'buildNew' | 'repair'>('buildNew');
  const [amountVnd, setAmountVnd] = React.useState('');
  const [supportYear, setSupportYear] = React.useState('2026');
  const [supportStatus, setSupportStatus] = React.useState<HousingSupportStatus>('completed');
  const [supportNote, setSupportNote] = React.useState('');

  // 3. Support Need fields
  const [needType, setNeedType] = React.useState<'buildNew' | 'repair'>('buildNew');
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [estimatedCost, setEstimatedCost] = React.useState('');
  const [needStatus, setNeedStatus] = React.useState<'pending' | 'approved' | 'rejected'>('pending');
  const [requestDate, setRequestDate] = React.useState('2026-06-22');

  // Handle household select
  const handleHouseholdChange = (hhId: string) => {
    setSelectedHhId(hhId);
    const hh = MOCK_HOUSEHOLDS.find(h => h.id === hhId);
    if (hh) {
      setHouseholdHeadName(hh.headName);
      setHouseholdCode(hh.code);
      setVillageCode(hh.hamletCode);
    }
  };

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      setSelectedHhId(editingItem.householdId || '');
      setHouseholdHeadName(editingItem.householdHeadName || '');
      setHouseholdCode(editingItem.householdCode || '');
      setVillageCode(editingItem.villageCode || 'noc-01');

      if (tabType === 'list') {
        const item = editingItem as HousingRecord;
        setHousingType(item.housingType || 'bán kiên cố');
        setAreaSqm(String(item.areaSqm || ''));
        setBuiltYear(String(item.builtYear || '2020'));
        setCondition(item.conditionRating || 'average');
        setDegradation(String(item.degradationPercentage || ''));
        setHousingNote(item.note || '');
      } else if (tabType === 'support') {
        const item = editingItem as HousingSupportRecord;
        setProgramName(item.programName || '');
        setSupportType(item.supportType || 'buildNew');
        setAmountVnd(String(item.amountVnd || ''));
        setSupportYear(String(item.year || '2026'));
        setSupportStatus(item.status || 'completed');
        setSupportNote(item.notes || '');
      } else if (tabType === 'need') {
        const item = editingItem as HousingSupportNeed;
        setNeedType(item.needType || 'buildNew');
        setPriority(item.priorityLevel || 'medium');
        setEstimatedCost(String(item.estimatedCostVnd || ''));
        setNeedStatus(item.status || 'pending');
        setRequestDate(item.requestDate || '2026-06-22');
      }
    } else {
      setSelectedHhId('');
      setHouseholdHeadName('');
      setHouseholdCode('');
      setVillageCode('noc-01');
      setHousingType('bán kiên cố');
      setAreaSqm('');
      setBuiltYear('2020');
      setCondition('average');
      setDegradation('');
      setHousingNote('');
      setProgramName('Chương trình MTQG 1719 (Phát triển KT-XH vùng đồng bào DTTS)');
      setSupportType('buildNew');
      setAmountVnd('');
      setSupportYear('2026');
      setSupportStatus('completed');
      setSupportNote('');
      setNeedType('buildNew');
      setPriority('medium');
      setEstimatedCost('');
      setNeedStatus('pending');
      setRequestDate('2026-06-22');
    }
  }, [editingItem, isOpen, tabType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success(`${isEdit ? 'Cập nhật' : 'Ghi nhận'} thông tin thành công!`, {
      description: `Đã lưu hồ sơ nhà ở hộ gia đình vào cơ sở dữ liệu.`,
    });

    onOpenChange(false);
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Thêm mới';
    switch (tabType) {
      case 'list': return `${prefix} Khảo sát nhà ở`;
      case 'support': return `${prefix} Ghi nhận hỗ trợ`;
      case 'need': return `${prefix} Đơn nhu cầu hỗ trợ`;
      default: return `${prefix} thông tin nhà ở`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-xs">
            Cập nhật hiện trạng, hỗ trợ kinh phí xóa nhà tạm và tiếp nhận nhu cầu về nhà ở của hộ dân tại xã Lao Bảo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Household Select dropdown - only available when creating new */}
          {!isEdit ? (
            <div className="space-y-1">
              <Label htmlFor="hhSelect" className="text-xs">Hộ gia đình <span className="text-destructive">*</span></Label>
              <Select value={selectedHhId} onValueChange={handleHouseholdChange}>
                <SelectTrigger id="hhSelect" className="h-9 text-xs bg-card">
                  <SelectValue placeholder="Chọn hộ dân khảo sát..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs max-h-[200px]">
                  {MOCK_HOUSEHOLDS.slice(0, 50).map(hh => (
                    <SelectItem key={hh.id} value={hh.id} className="cursor-pointer">
                      {hh.headName} ({hh.code}) - {hh.hamletName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 bg-muted/20 p-2 rounded-lg border border-border">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block font-bold">Chủ hộ</span>
                <span className="text-xs font-bold text-foreground">{householdHeadName}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block font-bold">Mã hộ / Thôn</span>
                <span className="text-xs text-muted-foreground font-mono">{householdCode} - {hamlets.find(h => h.code === villageCode)?.name}</span>
              </div>
            </div>
          )}

          {tabType === 'list' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="housingType" className="text-xs">Phân loại nhà</Label>
                  <Select value={housingType} onValueChange={(v) => setHousingType(v as HousingType)}>
                    <SelectTrigger id="housingType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="kiên cố" className="cursor-pointer">Kiên cố</SelectItem>
                      <SelectItem value="bán kiên cố" className="cursor-pointer">Bán kiên cố</SelectItem>
                      <SelectItem value="nhà tạm" className="cursor-pointer">Nhà tạm</SelectItem>
                      <SelectItem value="dột nát" className="cursor-pointer">Dột nát</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="areaSqm" className="text-xs">Diện tích sử dụng (m²) <span className="text-destructive">*</span></Label>
                  <Input id="areaSqm" type="number" value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} placeholder="65" className="h-9 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="builtYear" className="text-xs">Năm xây dựng</Label>
                  <Input id="builtYear" type="number" value={builtYear} onChange={(e) => setBuiltYear(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="condition" className="text-xs">Hiện trạng kết cấu</Label>
                  <Select value={condition} onValueChange={(v) => setCondition(v as any)}>
                    <SelectTrigger id="condition" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="good" className="cursor-pointer">Còn tốt</SelectItem>
                      <SelectItem value="average" className="cursor-pointer">Trung bình</SelectItem>
                      <SelectItem value="poor" className="cursor-pointer">Xuống cấp</SelectItem>
                      <SelectItem value="dangerous" className="cursor-pointer">Nguy hiểm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="degradation" className="text-xs">Mức độ xuống cấp (%) <span className="text-destructive">*</span></Label>
                  <Input id="degradation" type="number" value={degradation} onChange={(e) => setDegradation(e.target.value)} placeholder="15" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="villageCode" className="text-xs">Khu vực (Thôn)</Label>
                  <Select value={villageCode} onValueChange={setVillageCode}>
                    <SelectTrigger id="villageCode" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      {hamlets.map(h => (
                        <SelectItem key={h.code} value={h.code} className="cursor-pointer">{h.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="housingNote" className="text-xs">Ghi chú khảo sát</Label>
                <Input id="housingNote" value={housingNote} onChange={(e) => setHousingNote(e.target.value)} placeholder="Mái ngói mục nát, tường gạch nứt nhẹ..." className="h-9 text-xs" />
              </div>
            </>
          )}

          {tabType === 'support' && (
            <>
              <div className="space-y-1">
                <Label htmlFor="programName" className="text-xs">Chương trình hỗ trợ <span className="text-destructive">*</span></Label>
                <Input id="programName" value={programName} onChange={(e) => setProgramName(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="supportType" className="text-xs">Phương thức hỗ trợ</Label>
                  <Select value={supportType} onValueChange={(v) => setSupportType(v as 'buildNew' | 'repair')}>
                    <SelectTrigger id="supportType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="buildNew" className="cursor-pointer">Xây dựng mới nhà</SelectItem>
                      <SelectItem value="repair" className="cursor-pointer">Sửa chữa cải tạo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="amountVnd" className="text-xs">Số tiền hỗ trợ (VND) <span className="text-destructive">*</span></Label>
                  <Input id="amountVnd" type="number" value={amountVnd} onChange={(e) => setAmountVnd(e.target.value)} placeholder="60000000" className="h-9 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="supportYear" className="text-xs">Năm thực hiện</Label>
                  <Input id="supportYear" type="number" value={supportYear} onChange={(e) => setSupportYear(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="supportStatus" className="text-xs">Trạng thái giải ngân</Label>
                  <Select value={supportStatus} onValueChange={(v) => setSupportStatus(v as HousingSupportStatus)}>
                    <SelectTrigger id="supportStatus" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="completed" className="cursor-pointer">Đã hoàn thành</SelectItem>
                      <SelectItem value="ongoing" className="cursor-pointer">Đang xây dựng</SelectItem>
                      <SelectItem value="pending" className="cursor-pointer">Chờ kinh phí</SelectItem>
                      <SelectItem value="rejected" className="cursor-pointer">Bị từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="supportNote" className="text-xs">Nhật ký chương trình</Label>
                <Input id="supportNote" value={supportNote} onChange={(e) => setSupportNote(e.target.value)} placeholder="Đã bàn giao nhà đại đoàn kết..." className="h-9 text-xs" />
              </div>
            </>
          )}

          {tabType === 'need' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="needType" className="text-xs">Loại nhu cầu</Label>
                  <Select value={needType} onValueChange={(v) => setNeedType(v as 'buildNew' | 'repair')}>
                    <SelectTrigger id="needType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="buildNew" className="cursor-pointer">Xây mới nhà ở</SelectItem>
                      <SelectItem value="repair" className="cursor-pointer">Sửa chữa gia cố</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="priority" className="text-xs">Độ ưu tiên xét duyệt</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                    <SelectTrigger id="priority" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="high" className="cursor-pointer">Khẩn cấp (Cao)</SelectItem>
                      <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                      <SelectItem value="low" className="cursor-pointer">Thấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="estimatedCost" className="text-xs">Ước tính kinh phí (VND) <span className="text-destructive">*</span></Label>
                  <Input id="estimatedCost" type="number" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} placeholder="80000000" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="requestDate" className="text-xs">Ngày nộp đơn</Label>
                  <Input id="requestDate" type="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} className="h-9 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="needStatus" className="text-xs">Trạng thái xét duyệt</Label>
                <Select value={needStatus} onValueChange={(v) => setNeedStatus(v as any)}>
                  <SelectTrigger id="needStatus" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="pending" className="cursor-pointer">Chờ xét duyệt</SelectItem>
                    <SelectItem value="approved" className="cursor-pointer">Đã phê duyệt</SelectItem>
                    <SelectItem value="rejected" className="cursor-pointer">Bị từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
            </DialogClose>
            <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu dữ liệu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
