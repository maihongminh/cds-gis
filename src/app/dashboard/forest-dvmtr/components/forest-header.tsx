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
import { Plus, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ForestHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  // Form State
  const [hhCode, setHhCode] = React.useState('');
  const [contractCode, setContractCode] = React.useState('');
  const [forestBlock, setForestBlock] = React.useState('');
  const [area, setArea] = React.useState('');
  const [paymentRate, setPaymentRate] = React.useState('600000');
  const [paymentStatus, setPaymentStatus] = React.useState('pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hhCode || !contractCode || !forestBlock || !area) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    toast.success('Thêm hợp đồng nhận khoán bảo vệ rừng thành công!', {
      description: `Hợp đồng: ${contractCode} — Hộ nhận khoán: ${hhCode} — Diện tích: ${area} ha`,
    });

    setHhCode('');
    setContractCode('');
    setForestBlock('');
    setArea('');
    setPaymentRate('600000');
    setPaymentStatus('pending');
    setIsOpen(false);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang trích xuất báo cáo DVMTR...',
        success: 'Xuất báo cáo chi trả dịch vụ môi trường rừng thành công! Tệp Excel đã tải về.',
        error: 'Lỗi xuất dữ liệu.',
      }
    );
  };

  const actions = (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* Export Button */}
      <Button variant="outline" size="sm" onClick={handleExport} className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
        <Download className="size-4 text-muted-foreground" />
        Export báo cáo DVMTR
      </Button>

      {/* Add Contract Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold">
            <Plus className="size-4" />
            Thêm hợp đồng
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Thêm hợp đồng nhận khoán bảo vệ rừng</DialogTitle>
            <DialogDescription className="text-xs">
              Khai báo mã hợp đồng bảo vệ rừng đầu nguồn, vị trí tiểu khu và hạn mức chi trả DVMTR.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="contractCode" className="text-xs">Mã số hợp đồng <span className="text-destructive">*</span></Label>
                <Input id="contractCode" value={contractCode} onChange={(e) => setContractCode(e.target.value)} placeholder="HĐ-BVR-30-..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hhCode" className="text-xs">Mã hộ nhận khoán <span className="text-destructive">*</span></Label>
                <Input id="hhCode" value={hhCode} onChange={(e) => setHhCode(e.target.value)} placeholder="HH-30-001..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="forestBlock" className="text-xs">Vị trí rừng (Tiểu khu, Khoảnh) <span className="text-destructive">*</span></Label>
                <Input id="forestBlock" value={forestBlock} onChange={(e) => setForestBlock(e.target.value)} placeholder="Ví dụ: Tiểu khu 154, Khoảnh 2" className="h-9 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="area" className="text-xs">Diện tích giao (ha) <span className="text-destructive">*</span></Label>
                  <Input id="area" type="number" step="0.01" value={area} onChange={(e) => setArea(e.target.value)} placeholder="8.5..." className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="paymentRate" className="text-xs">Định mức chi trả (VND/ha)</Label>
                  <Input id="paymentRate" type="number" value={paymentRate} onChange={(e) => setPaymentRate(e.target.value)} className="h-9 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="paymentStatus" className="text-xs">Trạng thái thanh toán</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger id="paymentStatus" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="paid" className="cursor-pointer">Đã chi trả toàn phần</SelectItem>
                    <SelectItem value="partially_paid" className="cursor-pointer">Đã chi trả một phần</SelectItem>
                    <SelectItem value="pending" className="cursor-pointer">Chưa chi trả (Đang chờ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu hợp đồng</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <PageHeader
      title="Quản lý Lâm nghiệp & DVMTR"
      description="Quản lý giao khoán bảo vệ rừng đầu nguồn, định mức chi trả Dịch vụ môi trường rừng (DVMTR), tiến độ thanh toán và phân bổ diện tích bảo hộ"
      actions={actions}
    />
  );
}
