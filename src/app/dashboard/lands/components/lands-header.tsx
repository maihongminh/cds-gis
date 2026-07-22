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
import { Plus, Download, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_LAND_TYPES } from '@/data/mock-catalogs';

export function LandsHeader() {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importing, setImporting] = React.useState(false);

  // Form State
  const [hhCode, setHhCode] = React.useState('');
  const [landType, setLandType] = React.useState('');
  const [area, setArea] = React.useState('');
  const [parcelCode, setParcelCode] = React.useState('');
  const [mapSheet, setMapSheet] = React.useState('');
  const [ownership, setOwnership] = React.useState('household');
  const [certStatus, setCertStatus] = React.useState('granted');
  const [certNumber, setCertNumber] = React.useState('');
  const [purpose, setPurpose] = React.useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hhCode || !landType || !area || !parcelCode) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    const landTypeName = MOCK_LAND_TYPES.find((l) => l.code === landType)?.name || landType;

    toast.success('Đăng ký thửa đất mới thành công!', {
      description: `Mã thửa: ${parcelCode} — Hộ dân: ${hhCode} — Diện tích: ${area} ha`,
    });

    // Reset Form
    setHhCode('');
    setLandType('');
    setArea('');
    setParcelCode('');
    setMapSheet('');
    setOwnership('household');
    setCertStatus('granted');
    setCertNumber('');
    setPurpose('');
    setIsAddOpen(false);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);

    setTimeout(() => {
      setImporting(false);
      setIsImportOpen(false);
      toast.success('Đã nhập dữ liệu bản đồ địa chính thành công!', {
        description: 'Đã thêm mới 14 thửa đất từ tệp Excel.',
      });
    }, 2000);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang trích xuất dữ liệu địa chính đất đai...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải về.',
        error: 'Lỗi xuất dữ liệu.',
      }
    );
  };

  const actions = (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
            <Upload className="size-4 text-muted-foreground" />
            Nhập Excel
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Nhập dữ liệu đất đai từ Excel</DialogTitle>
            <DialogDescription className="text-xs">
              Tải lên tệp danh sách các thửa đất, tờ bản đồ và tình trạng pháp lý.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-xl p-8 bg-muted/10 cursor-pointer hover:bg-muted/20 hover:border-primary/30 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground/60 mb-2" />
              <span className="text-xs font-semibold text-foreground">Kéo thả tệp hoặc click chọn</span>
              <span className="text-[9px] text-muted-foreground mt-1">Hỗ trợ tệp định dạng .xlsx, .csv</span>
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

      {/* Export Button */}
      <Button variant="outline" size="sm" onClick={handleExport} className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
        <Download className="size-4 text-muted-foreground" />
        Xuất Excel
      </Button>

      {/* Add Land Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold">
            <Plus className="size-4" />
            Đăng ký thửa đất
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Khai báo thửa đất nông nghiệp mới</DialogTitle>
            <DialogDescription className="text-xs">
              Đăng ký thông tin thửa đất, diện tích canh tác và tình trạng pháp lý giấy chứng nhận.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="hhCode" className="text-xs">Mã hộ dân cư <span className="text-destructive">*</span></Label>
                <Input id="hhCode" value={hhCode} onChange={(e) => setHhCode(e.target.value)} placeholder="HH-30-001..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="landType" className="text-xs">Loại đất đai <span className="text-destructive">*</span></Label>
                <Select value={landType} onValueChange={setLandType}>
                  <SelectTrigger id="landType" className="h-9 text-xs bg-card">
                    <SelectValue placeholder="Chọn loại đất..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    {MOCK_LAND_TYPES.map((l) => (
                      <SelectItem key={l.code} value={l.code} className="cursor-pointer">
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="parcelCode" className="text-xs">Mã số thửa đất <span className="text-destructive">*</span></Label>
                <Input id="parcelCode" value={parcelCode} onChange={(e) => setParcelCode(e.target.value)} placeholder="TB-TTA-235..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mapSheet" className="text-xs">Tờ bản đồ số</Label>
                <Input id="mapSheet" value={mapSheet} onChange={(e) => setMapSheet(e.target.value)} placeholder="Tờ số 05..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="area" className="text-xs">Diện tích thửa (ha) <span className="text-destructive">*</span></Label>
                <Input id="area" type="number" step="0.01" value={area} onChange={(e) => setArea(e.target.value)} placeholder="1.25..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ownership" className="text-xs">Hình thức sở hữu</Label>
                <Select value={ownership} onValueChange={setOwnership}>
                  <SelectTrigger id="ownership" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="household" className="cursor-pointer">Hộ gia đình</SelectItem>
                    <SelectItem value="communal" className="cursor-pointer">Đất tập thể</SelectItem>
                    <SelectItem value="rented" className="cursor-pointer">Thuê/Khoán bảo vệ</SelectItem>
                    <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="certStatus" className="text-xs">Tình trạng pháp lý GCN</Label>
                <Select value={certStatus} onValueChange={setCertStatus}>
                  <SelectTrigger id="certStatus" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="granted" className="cursor-pointer">Đã cấp sổ đỏ</SelectItem>
                    <SelectItem value="pending" className="cursor-pointer">Đang chờ duyệt cấp</SelectItem>
                    <SelectItem value="none" className="cursor-pointer">Chưa có sổ đỏ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="certNumber" className="text-xs">Số hiệu GCN (nếu có)</Label>
                <Input id="certNumber" value={certNumber} onChange={(e) => setCertNumber(e.target.value)} placeholder="CH123456..." className="h-9 text-xs" disabled={certStatus !== 'granted'} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="purpose" className="text-xs">Mục đích sử dụng chính</Label>
                <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Ví dụ: Trồng Cà phê Arabica dưới tán rừng, trồng lúa rẫy..." className="h-9 text-xs" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Đăng ký thửa đất</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <PageHeader
      title="Quản lý thửa đất nông nghiệp"
      description="Quản lý hiện trạng thửa đất canh tác, loại đất lâm - nông nghiệp, tờ bản đồ và hiện trạng cấp giấy chứng nhận (GCN) tại xã Lao Bảo"
      actions={actions}
    />
  );
}
