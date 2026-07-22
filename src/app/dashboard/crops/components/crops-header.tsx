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
import { Plus, Upload, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_CROP_TYPES } from '@/data/mock-catalogs';

interface CropsHeaderProps {
  activeTab?: string;
  onAddChangeClick?: () => void;
  onExportChangeClick?: () => void;
}

export function CropsHeader({
  activeTab = 'crops',
  onAddChangeClick,
  onExportChangeClick,
}: CropsHeaderProps) {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importing, setImporting] = React.useState(false);

  // Form State
  const [hhCode, setHhCode] = React.useState('');
  const [cropType, setCropType] = React.useState('');
  const [area, setArea] = React.useState('');
  const [plantingYear, setPlantingYear] = React.useState('2025');
  const [season, setSeason] = React.useState('2026-XH');
  const [method, setMethod] = React.useState('Hữu cơ');
  const [output, setOutput] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [salesChannel, setSalesChannel] = React.useState('Thương lái thu mua tại vườn');
  const [growingAreaCode, setGrowingAreaCode] = React.useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hhCode || !cropType || !area || !output || !price) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    const cropTypeName = MOCK_CROP_TYPES.find((c) => c.code === cropType)?.name || cropType;

    toast.success('Đăng ký cây trồng thành công!', {
      description: `Hộ dân: ${hhCode} — Cây trồng: ${cropTypeName} (${area} ha)`,
    });

    // Reset Form
    setHhCode('');
    setCropType('');
    setArea('');
    setOutput('');
    setPrice('');
    setGrowingAreaCode('');
    setIsAddOpen(false);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);

    setTimeout(() => {
      setImporting(false);
      setIsImportOpen(false);
      toast.success('Đã nhập dữ liệu cây trồng thành công!', {
        description: 'Đã cập nhật 28 nhật ký canh tác từ tệp Excel.',
      });
    }, 2000);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang trích xuất dữ liệu canh tác...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải về.',
        error: 'Lỗi xuất dữ liệu.',
      }
    );
  };

  const actions = activeTab === 'changes' ? (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* Export changes report */}
      <Button variant="outline" size="sm" onClick={onExportChangeClick} className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
        <Download className="size-4 text-muted-foreground" />
        Xuất báo cáo biến động
      </Button>

      {/* Record change */}
      <Button size="sm" onClick={onAddChangeClick} className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold">
        <Plus className="size-4" />
        Ghi nhận biến động
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* 1. Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
            <Upload className="size-4 text-muted-foreground" />
            Nhập Excel
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Nhập dữ liệu trồng trọt từ Excel</DialogTitle>
            <DialogDescription className="text-xs">
              Tải lên tệp nhật ký trồng trọt và sản lượng thu hoạch nông nghiệp.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-xl p-8 bg-muted/10 cursor-pointer hover:bg-muted/20 hover:border-primary/30 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground/60 mb-2" />
              <span className="text-xs font-semibold text-foreground">Kéo thả tệp hoặc click chọn</span>
              <span className="text-[9px] text-muted-foreground mt-1">Hỗ trợ tệp định dạng .xlsx</span>
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

      {/* 2. Export Button */}
      <Button variant="outline" size="sm" onClick={handleExport} className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
        <Download className="size-4 text-muted-foreground" />
        Xuất Excel
      </Button>

      {/* 3. Add Crop Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold">
            <Plus className="size-4" />
            Đăng ký cây trồng
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Khai báo nhật ký cây trồng mới</DialogTitle>
            <DialogDescription className="text-xs">
              Đăng ký diện tích gieo trồng và sản lượng thu hoạch của hộ dân.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="hhCode" className="text-xs">Mã hộ dân cư <span className="text-destructive">*</span></Label>
                <Input id="hhCode" value={hhCode} onChange={(e) => setHhCode(e.target.value)} placeholder="HH-30-001..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cropType" className="text-xs">Loại cây trồng <span className="text-destructive">*</span></Label>
                <Select value={cropType} onValueChange={setCropType}>
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
              <div className="space-y-1">
                <Label htmlFor="area" className="text-xs">Diện tích canh tác (ha) <span className="text-destructive">*</span></Label>
                <Input id="area" type="number" step="0.01" value={area} onChange={(e) => setArea(e.target.value)} placeholder="0.25..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="plantingYear" className="text-xs">Năm bắt đầu trồng</Label>
                <Input id="plantingYear" type="number" value={plantingYear} onChange={(e) => setPlantingYear(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="season" className="text-xs">Vụ / Năm canh tác</Label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger id="season" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="2026-XH" className="cursor-pointer">Vụ Xuân Hè 2026</SelectItem>
                    <SelectItem value="2026-DH" className="cursor-pointer">Vụ Đông Xuân 2026</SelectItem>
                    <SelectItem value="2025-XH" className="cursor-pointer">Vụ Xuân Hè 2025</SelectItem>
                    <SelectItem value="2025-DH" className="cursor-pointer">Vụ Đông Xuân 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="method" className="text-xs">Phương thức canh tác</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="method" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="Hữu cơ" className="cursor-pointer">Canh tác hữu cơ</SelectItem>
                    <SelectItem value="Truyền thống" className="cursor-pointer">Canh tác truyền thống</SelectItem>
                    <SelectItem value="VietGAP" className="cursor-pointer">Canh tác VietGAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="output" className="text-xs">Sản lượng thu hoạch (kg) <span className="text-destructive">*</span></Label>
                <Input id="output" type="number" value={output} onChange={(e) => setOutput(e.target.value)} placeholder="500..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="price" className="text-xs">Giá bán đơn vị (VND/kg) <span className="text-destructive">*</span></Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="65000..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="salesChannel" className="text-xs">Kênh tiêu thụ chính</Label>
                <Input id="salesChannel" value={salesChannel} onChange={(e) => setSalesChannel(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="growingAreaCode" className="text-xs">Mã số vùng trồng (GAC) nếu có</Label>
                <Input id="growingAreaCode" value={growingAreaCode} onChange={(e) => setGrowingAreaCode(e.target.value)} placeholder="GAC-SAM-..." className="h-9 text-xs" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu khai báo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <PageHeader
      title={activeTab === 'changes' ? 'Theo dõi biến động cây trồng' : 'Nhật ký cây trồng'}
      description={activeTab === 'changes' ? 'Giám sát và phân tích xu hướng thay đổi diện tích gieo trồng và sản lượng thu hoạch nông nghiệp' : 'Giám sát hiện trạng diện tích, năm trồng, sản lượng thu hoạch và mã số vùng trồng cây đặc sản tại xã Lao Bảo'}
      actions={actions}
    />
  );
}
