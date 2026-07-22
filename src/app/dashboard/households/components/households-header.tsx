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
import { useTenant } from '@/components/layout/tenant-context';
import { Plus, Upload, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function HouseholdsHeader() {
  const { hamlets } = useTenant();
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importing, setImporting] = React.useState(false);

  // Form State
  const [name, setName] = React.useState('');
  const [cccd, setCccd] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [hamlet, setHamlet] = React.useState('');
  const [ethnicity, setEthnicity] = React.useState('Vân Kiều');
  const [members, setMembers] = React.useState('4');
  const [labors, setLabors] = React.useState('2');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cccd || !hamlet) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    toast.success('Đã thêm hộ dân thành công!', {
      description: `Chủ hộ: ${name} — ${hamlets.find(h => h.code === hamlet)?.name}`,
    });

    // Reset form
    setName('');
    setCccd('');
    setPhone('');
    setHamlet('');
    setIsAddOpen(false);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);

    setTimeout(() => {
      setImporting(false);
      setIsImportOpen(false);
      toast.success('Đã nhập dữ liệu thành công!', {
        description: 'Đã cập nhật thông tin cho 12 hộ dân từ tệp Excel.',
      });
    }, 2000);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang trích xuất dữ liệu hộ dân...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải về.',
        error: 'Lỗi xuất dữ liệu.',
      }
    );
  };

  const actions = (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* 1. Import Excel Trigger */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
            <Upload className="size-4 text-muted-foreground" />
            Nhập Excel
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Nhập dữ liệu từ Excel</DialogTitle>
            <DialogDescription className="text-xs">
              Tải lên tệp danh sách hộ dân dạng `.xlsx` hoặc `.xls` theo mẫu của hệ thống.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-xl p-8 bg-muted/10 cursor-pointer hover:bg-muted/20 hover:border-primary/30 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground/60 mb-2" />
              <span className="text-xs font-semibold text-foreground">Kéo thả tệp vào đây hoặc click chọn</span>
              <span className="text-[9px] text-muted-foreground mt-1">Dung lượng tối đa 10MB</span>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" disabled={importing} className="cursor-pointer shadow-none text-xs">
                {importing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  'Tải lên'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Export Excel Trigger */}
      <Button variant="outline" size="sm" onClick={handleExport} className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
        <Download className="size-4 text-muted-foreground" />
        Xuất Excel
      </Button>

      {/* 3. Add Household Trigger */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold">
            <Plus className="size-4" />
            Thêm hộ dân
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Thêm hồ sơ hộ dân mới</DialogTitle>
            <DialogDescription className="text-xs">
              Điền thông tin nhân khẩu và chủ hộ đại diện để tạo hồ sơ quản lý mới.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">Họ tên chủ hộ <span className="text-destructive">*</span></Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập họ và tên..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cccd" className="text-xs">Số CCCD / Định danh <span className="text-destructive">*</span></Label>
                <Input id="cccd" value={cccd} onChange={(e) => setCccd(e.target.value)} placeholder="Định danh 12 số..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs">Số điện thoại liên hệ</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hamlet" className="text-xs">Thôn cư trú <span className="text-destructive">*</span></Label>
                <Select value={hamlet} onValueChange={setHamlet}>
                  <SelectTrigger id="hamlet" className="h-9 text-xs bg-card">
                    <SelectValue placeholder="Chọn Thôn..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {hamlets.map((h) => (
                      <SelectItem key={h.code} value={h.code} className="text-xs cursor-pointer">
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="ethnicity" className="text-xs">Dân tộc</Label>
                <Select value={ethnicity} onValueChange={setEthnicity}>
                  <SelectTrigger id="ethnicity" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="Vân Kiều" className="cursor-pointer">Vân Kiều</SelectItem>
                    <SelectItem value="Cà Dong" className="cursor-pointer">Cà Dong</SelectItem>
                    <SelectItem value="Kinh" className="cursor-pointer">Kinh</SelectItem>
                    <SelectItem value="Mơ Nông" className="cursor-pointer">Mơ Nông</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="members" className="text-xs">Số nhân khẩu</Label>
                  <Input id="members" type="number" min="1" max="20" value={members} onChange={(e) => setMembers(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="labors" className="text-xs">Số lao động NN</Label>
                  <Input id="labors" type="number" min="0" max="20" value={labors} onChange={(e) => setLabors(e.target.value)} className="h-9 text-xs" />
                </div>
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
      title="Hồ sơ hộ dân"
      description="Quản lý thông tin hộ dân cư, nhân khẩu học, lao động nông thôn và phân loại hộ nghèo xã Lao Bảo"
      actions={actions}
    />
  );
}
