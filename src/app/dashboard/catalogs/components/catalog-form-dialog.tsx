'use client';

import * as React from 'react';
import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Checkbox } from '@/components/ui';
import { toast } from 'sonner';
import { CatalogTableItem } from './catalog-table';

export type CatalogTabType = 'hamlet' | 'crop' | 'livestock' | 'land' | 'season' | 'poverty' | 'ethnicity';

interface CatalogFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: CatalogTabType;
  editingItem: CatalogTableItem | null;
}

export function CatalogFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: CatalogFormDialogProps) {
  const isEdit = !!editingItem;

  // Form states
  const [code, setCode] = React.useState('');
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');

  // Tab-specific states
  const [ethnicity, setEthnicity] = React.useState('Vân Kiều');
  const [unit, setUnit] = React.useState('');
  const [isSpecialty, setIsSpecialty] = React.useState(false);
  const [vaccineInterval, setVaccineInterval] = React.useState('');
  const [landGroup, setLandGroup] = React.useState('nong-nghiep');
  const [season, setSeason] = React.useState('Đông Xuân');
  const [year, setYear] = React.useState('2026');
  const [isLocked, setIsLocked] = React.useState(false);
  const [threshold, setThreshold] = React.useState('');

  // Ethnicity states
  const [localGroup, setLocalGroup] = React.useState('');
  const [parentEthnicityCode, setParentEthnicityCode] = React.useState('none');
  const [status, setStatus] = React.useState<'active' | 'inactive'>('active');

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      setCode(editingItem.code || '');
      setName(editingItem.name || '');
      setDesc(editingItem.description || '');
      setEthnicity(editingItem.ethnicity || 'Vân Kiều');
      setUnit(editingItem.unit || '');
      setIsSpecialty(!!editingItem.isSpecialty);
      setVaccineInterval(String(editingItem.vaccinationIntervalMonths || ''));
      setLandGroup(editingItem.group || 'nong-nghiep');
      setSeason(editingItem.season || 'Đông Xuân');
      setYear(String(editingItem.year || '2026'));
      setIsLocked(!!editingItem.isLocked);
      setThreshold(editingItem.threshold || '');
      setLocalGroup(editingItem.localGroup || '');
      setParentEthnicityCode(editingItem.parentEthnicityCode || 'none');
      setStatus(editingItem.status || 'active');
    } else {
      setCode('');
      setName('');
      setDesc('');
      setEthnicity('Vân Kiều');
      setUnit('');
      setIsSpecialty(false);
      setVaccineInterval('');
      setLandGroup('nong-nghiep');
      setSeason('Đông Xuân');
      setYear('2026');
      setIsLocked(false);
      setThreshold('');
      setLocalGroup('');
      setParentEthnicityCode('none');
      setStatus('active');
    }
  }, [editingItem, tabType, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || (!name && tabType !== 'season')) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    toast.success(`${isEdit ? 'Cập nhật' : 'Thêm mới'} danh mục thành công!`, {
      description: `Mã: ${code} — ${name || `${season} ${year}`}`,
    });

    onOpenChange(false);
  };

  const renderFormFields = () => {
    switch (tabType) {
      case 'hamlet':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="code" className="text-xs">Mã Thôn <span className="text-destructive">*</span></Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} disabled={isEdit} placeholder="thon-01..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Tên Thôn <span className="text-destructive">*</span></Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Thôn Ông..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ethnicity" className="text-xs">Dân tộc đa số</Label>
              <Select value={ethnicity} onValueChange={setEthnicity}>
                <SelectTrigger id="ethnicity" className="h-9 text-xs bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="Vân Kiều" className="cursor-pointer">Dân tộc Vân Kiều</SelectItem>
                  <SelectItem value="Pa Cô" className="cursor-pointer">Dân tộc Pa Cô</SelectItem>
                  <SelectItem value="M'Nông" className="cursor-pointer">{"Dân tộc M'Nông"}</SelectItem>
                  <SelectItem value="Kinh" className="cursor-pointer">Dân tộc Kinh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="desc" className="text-xs">Mô tả đặc điểm</Label>
              <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Vùng đồi, trồng quế..." className="h-9 text-xs" />
            </div>
          </>
        );
      case 'crop':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="code" className="text-xs">Mã loại cây trồng <span className="text-destructive">*</span></Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} disabled={isEdit} placeholder="sam-day..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Tên loại cây trồng <span className="text-destructive">*</span></Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sâm dây..." className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="unit" className="text-xs">Đơn vị tính <span className="text-destructive">*</span></Label>
                <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Cây / Tấn / Kg..." className="h-9 text-xs" />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox id="isSpecialty" checked={isSpecialty} onCheckedChange={(checked: boolean | 'indeterminate') => setIsSpecialty(!!checked)} className="cursor-pointer" />
                <Label htmlFor="isSpecialty" className="text-xs cursor-pointer select-none">Cây đặc sản địa phương</Label>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="desc" className="text-xs">Mô tả đặc điểm</Label>
              <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Cây thảo dược ưa bóng..." className="h-9 text-xs" />
            </div>
          </>
        );
      case 'livestock':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="code" className="text-xs">Mã vật nuôi <span className="text-destructive">*</span></Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} disabled={isEdit} placeholder="vit-co..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Tên vật nuôi <span className="text-destructive">*</span></Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vịt cỏ bản địa..." className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="unit" className="text-xs">Đơn vị đếm</Label>
                <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Con..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vaccineInterval" className="text-xs">Chu kỳ tiêm phòng (Tháng)</Label>
                <Input id="vaccineInterval" type="number" value={vaccineInterval} onChange={(e) => setVaccineInterval(e.target.value)} placeholder="6..." className="h-9 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="desc" className="text-xs">Mô tả đặc điểm</Label>
              <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Dễ nuôi thả đồi..." className="h-9 text-xs" />
            </div>
          </>
        );
      case 'land':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="code" className="text-xs">Mã loại đất <span className="text-destructive">*</span></Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} disabled={isEdit} placeholder="dat-rung-dac-dung..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Tên loại đất <span className="text-destructive">*</span></Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Đất rừng đặc dụng..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="landGroup" className="text-xs">Nhóm đất đai</Label>
              <Select value={landGroup} onValueChange={setLandGroup}>
                <SelectTrigger id="landGroup" className="h-9 text-xs bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="nong-nghiep" className="cursor-pointer">Đất nông nghiệp</SelectItem>
                  <SelectItem value="lam-nghiep" className="cursor-pointer">Đất lâm nghiệp (Rừng)</SelectItem>
                  <SelectItem value="phi-nong-nghiep" className="cursor-pointer">Đất phi nông nghiệp (Đất ở, hạ tầng)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="desc" className="text-xs">Mô tả mục đích sử dụng</Label>
              <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Nhóm đất quy hoạch đặc biệt..." className="h-9 text-xs" />
            </div>
          </>
        );
      case 'season':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="code" className="text-xs">Mã mùa vụ <span className="text-destructive">*</span></Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} disabled={isEdit} placeholder="2026-DH..." className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="season" className="text-xs">Vụ canh tác</Label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger id="season" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="Đông Xuân" className="cursor-pointer">Vụ Đông Xuân</SelectItem>
                    <SelectItem value="Xuân Hè" className="cursor-pointer">Vụ Xuân Hè</SelectItem>
                    <SelectItem value="Hè Thu" className="cursor-pointer">Vụ Hè Thu</SelectItem>
                    <SelectItem value="Quanh Năm" className="cursor-pointer">Vụ Quanh Năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="year" className="text-xs">Năm gieo trồng</Label>
                <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox id="isLocked" checked={isLocked} onCheckedChange={(checked: boolean | 'indeterminate') => setIsLocked(!!checked)} className="cursor-pointer" />
              <Label htmlFor="isLocked" className="text-xs cursor-pointer select-none">Khóa dữ liệu vụ này (Lưu kho trữ)</Label>
            </div>
          </>
        );
      case 'poverty':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="code" className="text-xs">Mã phân loại <span className="text-destructive">*</span></Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} disabled={isEdit} placeholder="average..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Tên phân loại <span className="text-destructive">*</span></Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Hộ trung bình..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="threshold" className="text-xs">Ngưỡng thu nhập bình quân</Label>
              <Input id="threshold" value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="Ví dụ: Dưới 1.500.000đ/tháng" className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="desc" className="text-xs">Mô tả tiêu chuẩn phân loại</Label>
              <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Định mức hộ nghèo nông thôn..." className="h-9 text-xs" />
            </div>
          </>
        );
      case 'ethnicity':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="code" className="text-xs">Mã dân tộc <span className="text-destructive">*</span></Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} disabled={isEdit} placeholder="pa-co..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Tên dân tộc / Thành phần <span className="text-destructive">*</span></Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vân Kiều..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="localGroup" className="text-xs">Nhóm địa phương (nếu có)</Label>
              <Input id="localGroup" value={localGroup} onChange={(e) => setLocalGroup(e.target.value)} placeholder="Pa Cô / Pa Cô..." className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="parentEthnicity" className="text-xs">Dân tộc gốc (cha)</Label>
                <Select value={parentEthnicityCode} onValueChange={setParentEthnicityCode}>
                  <SelectTrigger id="parentEthnicity" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="none" className="cursor-pointer">Không có (Dân tộc gốc)</SelectItem>
                    <SelectItem value="van-kieu" className="cursor-pointer">Vân Kiều</SelectItem>
                    <SelectItem value="kinh" className="cursor-pointer">Kinh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="status" className="text-xs">Trạng thái hoạt động</Label>
                <Select value={status} onValueChange={(val: 'active' | 'inactive') => setStatus(val)}>
                  <SelectTrigger id="status" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="active" className="cursor-pointer">Kích hoạt</SelectItem>
                    <SelectItem value="inactive" className="cursor-pointer">Vô hiệu hóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="desc" className="text-xs">Mô tả đặc điểm</Label>
              <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Mô tả đặc tính phân bố..." className="h-9 text-xs" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Thêm mới';
    switch (tabType) {
      case 'hamlet': return `${prefix} Thôn`;
      case 'crop': return `${prefix} loại cây trồng`;
      case 'livestock': return `${prefix} loài vật nuôi`;
      case 'land': return `${prefix} phân loại đất địa chính`;
      case 'season': return `${prefix} mùa vụ canh tác`;
      case 'poverty': return `${prefix} phân loại hộ nghèo`;
      case 'ethnicity': return `${prefix} Dân tộc`;
      default: return `${prefix} danh mục`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-xs">
            Vui lòng nhập các trường dữ liệu bắt buộc để thiết lập thông tin danh mục hệ thống.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
            </DialogClose>
            <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu danh mục</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
