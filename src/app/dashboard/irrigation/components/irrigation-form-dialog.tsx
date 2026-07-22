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
  IrrigationItem,
  IrrigationFacility,
  IrrigationOperationRecord,
  IrrigationManagementUnit,
} from '@/types/irrigation';
import { MOCK_IRRIGATION_UNITS, MOCK_IRRIGATION_FACILITIES } from '@/data/mock-irrigation';

interface IrrigationFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: string; // 'facilities' | 'operations' | 'units'
  editingItem: IrrigationItem | null;
}

export function IrrigationFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: IrrigationFormDialogProps) {
  const { hamlets } = useTenant();
  const isEdit = !!editingItem;

  // Common Fields
  const [villageCode, setVillageCode] = React.useState('noc-01');
  const [status, setStatus] = React.useState('good');

  // 1. Facility fields
  const [facilityCode, setFacilityCode] = React.useState('');
  const [facilityName, setFacilityName] = React.useState('');
  const [facType, setFacType] = React.useState<'dam' | 'reservoir' | 'canal' | 'pumpingStation' | 'other'>('dam');
  const [facTypeName, setFacTypeName] = React.useState('Đập dâng kiên cố');
  const [capacity, setCapacity] = React.useState('');
  const [irrigatedAreaHa, setIrrigatedAreaHa] = React.useState('');
  const [investedYear, setInvestedYear] = React.useState('2025');
  const [managementUnitId, setManagementUnitId] = React.useState('unit-1');

  // 2. Operation fields
  const [selectedFacId, setSelectedFacId] = React.useState('');
  const [checkDate, setCheckDate] = React.useState('2026-06-22');
  const [inspectorName, setInspectorName] = React.useState('');
  const [operationStatus, setOperationStatus] = React.useState<'stable' | 'issuesFound'>('stable');
  const [issuesRecorded, setIssuesRecorded] = React.useState('');
  const [actionProposed, setActionProposed] = React.useState('');
  const [opRecordStatus, setOpRecordStatus] = React.useState<'resolved' | 'pending' | 'monitoring'>('resolved');

  // 3. Unit fields
  const [unitName, setUnitName] = React.useState('');
  const [unitType, setUnitType] = React.useState<'cooperative' | 'villageGroup' | 'communeTeam' | 'other'>('villageGroup');
  const [unitTypeName, setUnitTypeName] = React.useState('Tổ quản lý thủy lợi thôn');
  const [contactPerson, setContactPerson] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [facilityCount, setFacilityCount] = React.useState('');

  // Handle facility select (for operations)
  const handleFacilitySelect = (facId: string) => {
    setSelectedFacId(facId);
    const fac = MOCK_IRRIGATION_FACILITIES.find((f) => f.id === facId);
    if (fac) {
      setFacilityName(fac.name);
    }
  };

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      if (tabType === 'facilities') {
        const item = editingItem as IrrigationFacility;
        setFacilityCode(item.facilityCode || '');
        setFacilityName(item.name || '');
        setFacType(item.type || 'dam');
        setFacTypeName(item.typeName || 'Đập dâng kiên cố');
        setVillageCode(item.villageCode || 'noc-01');
        setCapacity(item.capacity || '');
        setIrrigatedAreaHa(String(item.irrigatedAreaHa || ''));
        setStatus(item.status || 'good');
        setInvestedYear(String(item.investedYear || '2025'));
        setManagementUnitId(item.managementUnitId || 'unit-1');
      } else if (tabType === 'operations') {
        const item = editingItem as IrrigationOperationRecord;
        setSelectedFacId(item.facilityId || '');
        setFacilityName(item.facilityName || '');
        setCheckDate(item.checkDate || '2026-06-22');
        setInspectorName(item.inspectorName || '');
        setOperationStatus(item.operationStatus || 'stable');
        setIssuesRecorded(item.issuesRecorded || '');
        setActionProposed(item.actionProposed || '');
        setOpRecordStatus(item.status || 'resolved');
      } else if (tabType === 'units') {
        const item = editingItem as IrrigationManagementUnit;
        setUnitName(item.name || '');
        setUnitType(item.type || 'villageGroup');
        setUnitTypeName(item.typeName || 'Tổ quản lý thủy lợi thôn');
        setContactPerson(item.contactPerson || '');
        setPhoneNumber(item.phoneNumber || '');
        setFacilityCount(String(item.facilityCount || ''));
      }
    } else {
      // Reset values
      setVillageCode('noc-01');
      setStatus('good');

      setFacilityCode('');
      setFacilityName('');
      setFacType('dam');
      setFacTypeName('Đập dâng kiên cố');
      setCapacity('');
      setIrrigatedAreaHa('');
      setInvestedYear('2025');
      setManagementUnitId('unit-1');

      setSelectedFacId('');
      setCheckDate('2026-06-22');
      setInspectorName('');
      setOperationStatus('stable');
      setIssuesRecorded('');
      setActionProposed('');
      setOpRecordStatus('resolved');

      setUnitName('');
      setUnitType('villageGroup');
      setUnitTypeName('Tổ quản lý thủy lợi thôn');
      setContactPerson('');
      setPhoneNumber('');
      setFacilityCount('');
    }
  }, [editingItem, isOpen, tabType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success(`${isEdit ? 'Cập nhật' : 'Thêm mới'} thông tin thành công!`, {
      description: `Đã lưu hồ sơ quản lý thủy lợi vào cơ sở dữ liệu.`,
    });

    onOpenChange(false);
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Ghi nhận';
    switch (tabType) {
      case 'facilities': return `${prefix} Công trình thủy lợi`;
      case 'operations': return `${prefix} Nhật ký vận hành`;
      case 'units': return `${prefix} Đơn vị quản lý`;
      default: return `${prefix} thông tin thủy lợi`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-xs">
            Quản lý cơ sở vật chất hạ tầng thủy lợi, nhật ký kiểm tra định kỳ và hồ sơ tổ chức quản lý khai thác Lao Bảo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Section 1: Choose facility or location */}
          {!isEdit && tabType === 'operations' && (
            <div className="space-y-1">
              <Label htmlFor="facSelect" className="text-xs">Chọn công trình kiểm tra <span className="text-destructive">*</span></Label>
              <Select value={selectedFacId} onValueChange={handleFacilitySelect}>
                <SelectTrigger id="facSelect" className="h-9 text-xs bg-card">
                  <SelectValue placeholder="Chọn công trình..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs max-h-[200px]">
                  {MOCK_IRRIGATION_FACILITIES.map((f) => (
                    <SelectItem key={f.id} value={f.id} className="cursor-pointer">{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isEdit && tabType === 'operations' && (
            <div className="bg-muted/20 p-2 rounded-lg border border-border text-xs">
              <span className="text-[10px] text-muted-foreground uppercase block font-bold">Công trình kiểm tra</span>
              <span className="font-bold text-foreground">{facilityName}</span>
            </div>
          )}

          {/* Tab Specific Fields */}
          {tabType === 'facilities' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="facilityCode" className="text-xs">Mã công trình <span className="text-destructive">*</span></Label>
                  <Input id="facilityCode" value={facilityCode} onChange={(e) => setFacilityCode(e.target.value)} placeholder="CTTL-..." className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="facilityName" className="text-xs">Tên công trình <span className="text-destructive">*</span></Label>
                  <Input id="facilityName" value={facilityName} onChange={(e) => setFacilityName(e.target.value)} placeholder="Ví dụ: Đập dâng suối..." className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="facType" className="text-xs">Phân loại kỹ thuật</Label>
                  <Select value={facType} onValueChange={(v) => setFacType(v as any)}>
                    <SelectTrigger id="facType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="dam" className="cursor-pointer">Đập dâng</SelectItem>
                      <SelectItem value="reservoir" className="cursor-pointer">Hồ chứa nước</SelectItem>
                      <SelectItem value="canal" className="cursor-pointer">Kênh mương</SelectItem>
                      <SelectItem value="pumpingStation" className="cursor-pointer">Trạm bơm điện</SelectItem>
                      <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="facTypeName" className="text-xs">Tên loại hình cụ thể</Label>
                  <Input id="facTypeName" value={facTypeName} onChange={(e) => setFacTypeName(e.target.value)} placeholder="Ví dụ: Đập dâng kiên cố" className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="villageCode" className="text-xs">Thôn địa bàn</Label>
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
                <div className="space-y-1">
                  <Label htmlFor="capacity" className="text-xs">Quy mô thiết kế / Sức chứa</Label>
                  <Input id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Ví dụ: 1200 m3 / 1.5 km" className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="irrigatedAreaHa" className="text-xs">Diện tích tưới (ha) <span className="text-destructive">*</span></Label>
                  <Input id="irrigatedAreaHa" type="number" value={irrigatedAreaHa} onChange={(e) => setIrrigatedAreaHa(e.target.value)} placeholder="15" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="investedYear" className="text-xs">Năm đầu tư vận hành</Label>
                  <Input id="investedYear" type="number" value={investedYear} onChange={(e) => setInvestedYear(e.target.value)} className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 font-semibold">
                  <Label htmlFor="status" className="text-xs">Hiện trạng</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="good" className="cursor-pointer">Hoạt động tốt</SelectItem>
                      <SelectItem value="needsRepair" className="cursor-pointer">Cần sửa chữa</SelectItem>
                      <SelectItem value="damaged" className="cursor-pointer">Hư hại nặng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 font-semibold">
                  <Label htmlFor="managementUnitId" className="text-xs">Đơn vị quản lý</Label>
                  <Select value={managementUnitId} onValueChange={setManagementUnitId}>
                    <SelectTrigger id="managementUnitId" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      {MOCK_IRRIGATION_UNITS.map(u => (
                        <SelectItem key={u.id} value={u.id} className="cursor-pointer">{u.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {tabType === 'operations' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="checkDate" className="text-xs">Ngày kiểm tra</Label>
                  <Input id="checkDate" type="date" value={checkDate} onChange={(e) => setCheckDate(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="inspectorName" className="text-xs">Người kiểm tra <span className="text-destructive">*</span></Label>
                  <Input id="inspectorName" value={inspectorName} onChange={(e) => setInspectorName(e.target.value)} placeholder="Tên cán bộ kỹ thuật" className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="operationStatus" className="text-xs">Tình trạng vận hành</Label>
                  <Select value={operationStatus} onValueChange={(v) => setOperationStatus(v as any)}>
                    <SelectTrigger id="operationStatus" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="stable" className="cursor-pointer">Ổn định bình thường</SelectItem>
                      <SelectItem value="issuesFound" className="cursor-pointer">Ghi nhận sự cố</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="opRecordStatus" className="text-xs">Trạng thái xử lý lỗi</Label>
                  <Select value={opRecordStatus} onValueChange={(v) => setOpRecordStatus(v as any)}>
                    <SelectTrigger id="opRecordStatus" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="resolved" className="cursor-pointer">Đã xử lý xong</SelectItem>
                      <SelectItem value="pending" className="cursor-pointer">Yêu cầu khắc phục</SelectItem>
                      <SelectItem value="monitoring" className="cursor-pointer">Đang theo dõi thêm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="issuesRecorded" className="text-xs">Chi tiết sự cố ghi nhận (nếu có)</Label>
                <Input
                  id="issuesRecorded"
                  value={issuesRecorded}
                  onChange={(e) => setIssuesRecorded(e.target.value)}
                  disabled={operationStatus === 'stable'}
                  placeholder="Ví dụ: Rò rỉ nước thân đập, bùn bồi lắng..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="actionProposed" className="text-xs">Biện pháp / Đề xuất đề nghị xử lý</Label>
                <Input
                  id="actionProposed"
                  value={actionProposed}
                  onChange={(e) => setActionProposed(e.target.value)}
                  disabled={operationStatus === 'stable'}
                  placeholder="Ví dụ: Đề nghị nạo vét kênh, gia cố bê tông..."
                  className="h-9 text-xs"
                />
              </div>
            </>
          )}

          {tabType === 'units' && (
            <>
              <div className="space-y-1">
                <Label htmlFor="unitName" className="text-xs">Tên đơn vị quản lý <span className="text-destructive">*</span></Label>
                <Input id="unitName" value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="Ví dụ: Tổ quản lý thủy lợi..." className="h-9 text-xs" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="unitType" className="text-xs">Hình thức tổ chức</Label>
                  <Select value={unitType} onValueChange={(v) => setUnitType(v as any)}>
                    <SelectTrigger id="unitType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="cooperative" className="cursor-pointer">Hợp tác xã</SelectItem>
                      <SelectItem value="villageGroup" className="cursor-pointer">Tổ quản lý thôn</SelectItem>
                      <SelectItem value="communeTeam" className="cursor-pointer">Ban quản lý xã</SelectItem>
                      <SelectItem value="other" className="cursor-pointer">Hình thức khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="unitTypeName" className="text-xs">Tên mô hình</Label>
                  <Input id="unitTypeName" value={unitTypeName} onChange={(e) => setUnitTypeName(e.target.value)} placeholder="Tổ quản lý thủy lợi thôn" className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="contactPerson" className="text-xs">Đại diện liên hệ <span className="text-destructive">*</span></Label>
                  <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Họ và tên" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber" className="text-xs">Số điện thoại liên hệ <span className="text-destructive">*</span></Label>
                  <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="09xxxxxxxx" className="h-9 text-xs" required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="facilityCount" className="text-xs font-semibold">Số lượng công trình phụ trách quản lý</Label>
                <Input id="facilityCount" type="number" value={facilityCount} onChange={(e) => setFacilityCount(e.target.value)} placeholder="2" className="h-9 text-xs" />
              </div>
            </>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
            </DialogClose>
            <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu thông tin</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
