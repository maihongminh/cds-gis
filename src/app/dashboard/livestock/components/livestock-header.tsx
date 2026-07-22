'use client';

import * as React from 'react';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Plus, BarChart2, Coins, TrendingUp, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_LIVESTOCK_TYPES } from '@/data/mock-catalogs';

export function LivestockHeader() {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isChangeOpen, setIsChangeOpen] = React.useState(false);

  // Form State - Add
  const [hhCode, setHhCode] = React.useState('');
  const [animalType, setAnimalType] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [method, setMethod] = React.useState('semiGrazing');

  // Form State - Change
  const [recordId, setRecordId] = React.useState('');
  const [changeType, setChangeType] = React.useState('sold');
  const [changeQty, setChangeQty] = React.useState('');
  const [reason, setReason] = React.useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hhCode || !animalType || !quantity) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    const typeName = MOCK_LIVESTOCK_TYPES.find((l) => l.code === animalType)?.name || animalType;

    toast.success('Đăng ký vật nuôi thành công!', {
      description: `Hộ dân: ${hhCode} — Vật nuôi: ${typeName} (${quantity} con)`,
    });

    setHhCode('');
    setAnimalType('');
    setQuantity('');
    setIsAddOpen(false);
  };

  const handleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId || !changeQty) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }

    const typeLabel = changeType === 'born' ? 'Tăng đàn (Sinh sản)' : changeType === 'dead' ? 'Hao hụt (Chết/Bệnh)' : 'Giảm đàn (Bán tiêu thụ)';

    toast.success('Ghi nhận biến động đàn thành công!', {
      description: `Mã bản ghi: ${recordId} — ${typeLabel} số lượng ${changeQty} con.`,
    });

    setRecordId('');
    setChangeQty('');
    setReason('');
    setIsChangeOpen(false);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang kết xuất báo cáo chăn nuôi...',
        success: 'Tải xuống thành công! Bản tổng hợp Excel đã sẵn sàng.',
        error: 'Lỗi xuất dữ liệu.',
      }
    );
  };

  const actions = (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* 1. Fluctuation Dialog Trigger */}
      <Dialog open={isChangeOpen} onOpenChange={setIsChangeOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
            <TrendingUp className="size-4 text-muted-foreground" />
            Báo cáo biến động
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Khai báo biến động đàn gia súc</DialogTitle>
            <DialogDescription className="text-xs">
              Ghi nhận các trường hợp đẻ thêm, chết bệnh, hoặc bán thương phẩm.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangeSubmit} className="space-y-4">
            <div className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="recordId" className="text-xs">Mã số bản ghi chăn nuôi <span className="text-destructive">*</span></Label>
                <Input id="recordId" value={recordId} onChange={(e) => setRecordId(e.target.value)} placeholder="Ví dụ: live-15..." className="h-9 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="changeType" className="text-xs">Loại biến động</Label>
                  <Select value={changeType} onValueChange={setChangeType}>
                    <SelectTrigger id="changeType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="born" className="cursor-pointer">Sinh sản (+)</SelectItem>
                      <SelectItem value="dead" className="cursor-pointer">Hao hụt / Chết (-)</SelectItem>
                      <SelectItem value="sold" className="cursor-pointer">Bán tiêu thụ (-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="changeQty" className="text-xs">Số lượng biến động <span className="text-destructive">*</span></Label>
                  <Input id="changeQty" type="number" value={changeQty} onChange={(e) => setChangeQty(e.target.value)} placeholder="3..." className="h-9 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="reason" className="text-xs">Lý do chi tiết</Label>
                <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Lở mồm long móng, đẻ thêm lứa mới, xuất bán thương lái..." className="h-9 text-xs" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Ghi nhận</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Export Button */}
      <Button variant="outline" size="sm" onClick={handleExport} className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
        <BarChart2 className="size-4 text-muted-foreground" />
        Xuất báo cáo
      </Button>

      {/* 3. Add Dialog Trigger */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold">
            <Plus className="size-4" />
            Đăng ký vật nuôi
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Khai báo đàn vật nuôi mới</DialogTitle>
            <DialogDescription className="text-xs">
              Thêm mới số lượng đàn gia súc hoặc gia cầm thuộc sở hữu hộ gia đình.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="hhCode" className="text-xs">Mã hộ chăn nuôi <span className="text-destructive">*</span></Label>
                <Input id="hhCode" value={hhCode} onChange={(e) => setHhCode(e.target.value)} placeholder="HH-30-001..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="animalType" className="text-xs">Loại vật nuôi <span className="text-destructive">*</span></Label>
                <Select value={animalType} onValueChange={setAnimalType}>
                  <SelectTrigger id="animalType" className="h-9 text-xs bg-card">
                    <SelectValue placeholder="Chọn vật nuôi..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    {MOCK_LIVESTOCK_TYPES.map((l) => (
                      <SelectItem key={l.code} value={l.code} className="cursor-pointer">
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="quantity" className="text-xs">Số lượng bắt đầu (con) <span className="text-destructive">*</span></Label>
                <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="5..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="method" className="text-xs">Hình thức nuôi thả</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="method" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="freeRange" className="cursor-pointer">Thả rông tự nhiên</SelectItem>
                    <SelectItem value="enclosed" className="cursor-pointer">Nuôi nhốt hoàn toàn</SelectItem>
                    <SelectItem value="semiGrazing" className="cursor-pointer">Bán chăn thả (Chuồng có bãi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu hồ sơ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <PageHeader
      title="Nhật ký chăn nuôi"
      description="Quản lý quy mô đàn gia súc gia cầm, tình hình dịch bệnh và lịch tiêm chủng định kỳ tại xã Lao Bảo"
      actions={actions}
    />
  );
}
