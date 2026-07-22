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
import { PlusCircle, MinusCircle, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function EconomyHeader() {
  const [isIncomeOpen, setIsIncomeOpen] = React.useState(false);
  const [isCostOpen, setIsCostOpen] = React.useState(false);

  // Form State - Income
  const [incHhCode, setIncHhCode] = React.useState('');
  const [incAmount, setIncAmount] = React.useState('');
  const [incSource, setIncSource] = React.useState('Khai thác lâm sản phụ');
  const [incDesc, setIncDesc] = React.useState('');

  // Form State - Cost
  const [costHhCode, setCostHhCode] = React.useState('');
  const [costAmount, setCostAmount] = React.useState('');
  const [costType, setCostType] = React.useState('Mua giống cây trồng/vật nuôi');
  const [costDesc, setCostDesc] = React.useState('');

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incHhCode || !incAmount) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    toast.success('Ghi nhận thu nhập phát sinh thành công!', {
      description: `Hộ dân: ${incHhCode} — Số tiền: ${Number(incAmount).toLocaleString('vi-VN')} VND — Nguồn: ${incSource}`,
    });

    setIncHhCode('');
    setIncAmount('');
    setIncSource('Khai thác lâm sản phụ');
    setIncDesc('');
    setIsIncomeOpen(false);
  };

  const handleCostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!costHhCode || !costAmount) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    toast.success('Ghi nhận chi phí sản xuất thành công!', {
      description: `Hộ dân: ${costHhCode} — Số tiền: ${Number(costAmount).toLocaleString('vi-VN')} VND — Loại chi phí: ${costType}`,
    });

    setCostHhCode('');
    setCostAmount('');
    setCostType('Mua giống cây trồng/vật nuôi');
    setCostDesc('');
    setIsCostOpen(false);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang trích xuất báo cáo kinh tế hộ gia đình...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải về.',
        error: 'Lỗi xuất dữ liệu.',
      }
    );
  };

  const actions = (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* Export Button */}
      <Button variant="outline" size="sm" onClick={handleExport} className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
        <Download className="size-4 text-muted-foreground" />
        Export báo cáo
      </Button>

      {/* Record Cost Dialog */}
      <Dialog open={isCostOpen} onOpenChange={setIsCostOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3 text-xs border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-pointer shadow-none">
            <MinusCircle className="size-4" />
            Ghi nhận chi phí
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <MinusCircle className="w-4 h-4" />
              Ghi nhận chi phí sản xuất phát sinh
            </DialogTitle>
            <DialogDescription className="text-xs">
              Khai báo các chi phí đầu tư, vật tư nông nghiệp hoặc thuê nhân công của hộ gia đình.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCostSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="costHhCode" className="text-xs">Mã hộ dân cư <span className="text-destructive">*</span></Label>
                <Input id="costHhCode" value={costHhCode} onChange={(e) => setCostHhCode(e.target.value)} placeholder="HH-30-001..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="costType" className="text-xs">Phân loại chi phí</Label>
                <Select value={costType} onValueChange={setCostType}>
                  <SelectTrigger id="costType" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="Mua giống cây trồng/vật nuôi" className="cursor-pointer">Mua hạt giống / con giống</SelectItem>
                    <SelectItem value="Phân bón & thuốc bảo vệ thực vật" className="cursor-pointer">Phân bón & thuốc BVTV</SelectItem>
                    <SelectItem value="Thức ăn chăn nuôi & vắc xin" className="cursor-pointer">Thức ăn & Thú y chăn nuôi</SelectItem>
                    <SelectItem value="Thuê máy móc thiết bị & nhân công" className="cursor-pointer">Thuê trang thiết bị & lao động</SelectItem>
                    <SelectItem value="Chi phí khác" className="cursor-pointer">Chi phí sản xuất khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="costAmount" className="text-xs">Số tiền chi trả (VND) <span className="text-destructive">*</span></Label>
                <Input id="costAmount" type="number" value={costAmount} onChange={(e) => setCostAmount(e.target.value)} placeholder="Ví dụ: 2500000" className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="costDesc" className="text-xs">Ghi chú chi tiết</Label>
                <Input id="costDesc" value={costDesc} onChange={(e) => setCostDesc(e.target.value)} placeholder="Ví dụ: Mua phân bón đợt 2 cho vườn sâm..." className="h-9 text-xs" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-none text-xs">Ghi nhận chi phí</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record Income Dialog */}
      <Dialog open={isIncomeOpen} onOpenChange={setIsIncomeOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="h-9 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-none font-semibold">
            <PlusCircle className="size-4" />
            Ghi nhận thu nhập khác
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <PlusCircle className="w-4 h-4" />
              Ghi nhận thu nhập phát sinh ngoài nông nghiệp
            </DialogTitle>
            <DialogDescription className="text-xs">
              Khai báo các nguồn thu nhập phụ, tiền công, hỗ trợ chính sách phát sinh của hộ dân.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleIncomeSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="incHhCode" className="text-xs">Mã hộ dân cư <span className="text-destructive">*</span></Label>
                <Input id="incHhCode" value={incHhCode} onChange={(e) => setIncHhCode(e.target.value)} placeholder="HH-30-001..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="incSource" className="text-xs">Nguồn thu nhập</Label>
                <Select value={incSource} onValueChange={setIncSource}>
                  <SelectTrigger id="incSource" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="Khai thác lâm sản phụ" className="cursor-pointer">Khai thác lâm sản phụ (măng, nấm...)</SelectItem>
                    <SelectItem value="Lao động tự do & Tiền công" className="cursor-pointer">Lao động tự do / Tiền công đi làm thuê</SelectItem>
                    <SelectItem value="Kinh doanh nhỏ lẻ tại thôn" className="cursor-pointer">Buôn bán nhỏ lẻ, tạp hóa</SelectItem>
                    <SelectItem value="Hỗ trợ chính sách / Trợ cấp xã hội" className="cursor-pointer">Hỗ trợ chính sách / Quà tặng xã hội</SelectItem>
                    <SelectItem value="Thu nhập khác" className="cursor-pointer">Nguồn thu nhập khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="incAmount" className="text-xs">Số tiền thu nhập (VND) <span className="text-destructive">*</span></Label>
                <Input id="incAmount" type="number" value={incAmount} onChange={(e) => setIncAmount(e.target.value)} placeholder="Ví dụ: 3000000" className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="incDesc" className="text-xs">Ghi chú chi tiết</Label>
                <Input id="incDesc" value={incDesc} onChange={(e) => setIncDesc(e.target.value)} placeholder="Ví dụ: Đi làm nương rẫy thuê, thu hoạch keo..." className="h-9 text-xs" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-none text-xs">Lưu thu nhập</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <PageHeader
      title="Quản lý Kinh tế hộ gia đình"
      description="Giám sát doanh thu từ các nguồn nông nghiệp (cây trồng, chăn nuôi, DVMTR), các chi phí sản xuất, tính toán thu nhập ròng và phân loại nghèo đói tại xã Lao Bảo"
      actions={actions}
    />
  );
}
