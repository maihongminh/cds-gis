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
  BusinessHouseholdItem,
  BusinessHouseholdRecord,
  BusinessRevenueRecord,
  NonAgriculturalLaborRecord,
} from '@/types/business-household';
import { MOCK_HOUSEHOLDS } from '@/data/mock-db';
import { MOCK_BUSINESS_HOUSEHOLDS } from '@/data/mock-business-households';

interface BusinessFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: string; // 'list' | 'revenue' | 'labor'
  editingItem: BusinessHouseholdItem | null;
}

export function BusinessFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: BusinessFormDialogProps) {
  const { hamlets } = useTenant();
  const isEdit = !!editingItem;

  // Common household info
  const [selectedHhId, setSelectedHhId] = React.useState('');
  const [householdHeadName, setHouseholdHeadName] = React.useState('');
  const [householdCode, setHouseholdCode] = React.useState('');
  const [villageCode, setVillageCode] = React.useState('noc-01');

  // 1. Business Household (list) fields
  const [businessName, setBusinessName] = React.useState('');
  const [industry, setIndustry] = React.useState('Tạp hóa');
  const [scale, setScale] = React.useState<'small' | 'medium' | 'large'>('small');
  const [hasRegistration, setHasRegistration] = React.useState('no');
  const [registrationNumber, setRegistrationNumber] = React.useState('');
  const [isActive, setIsActive] = React.useState('yes');

  // 2. Business Revenue fields
  const [selectedBizId, setSelectedBizId] = React.useState('');
  const [period, setPeriod] = React.useState('Quý 2/2026');
  const [estimatedRevenueVnd, setEstimatedRevenueVnd] = React.useState('');
  const [dataSource, setDataSource] = React.useState<'taxDeclaration' | 'survey' | 'estimate'>('survey');
  const [notes, setNotes] = React.useState('');

  // 3. Labor fields
  const [totalLaborCount, setTotalLaborCount] = React.useState('');
  const [nonAgriculturalLaborCount, setNonAgriculturalLaborCount] = React.useState('');
  const [awayLaborCount, setAwayLaborCount] = React.useState('');
  const [surveyYear, setSurveyYear] = React.useState('2026');

  // Handle household select
  const handleHouseholdChange = (hhId: string) => {
    setSelectedHhId(hhId);
    const hh = MOCK_HOUSEHOLDS.find((h) => h.id === hhId);
    if (hh) {
      setHouseholdHeadName(hh.headName);
      setHouseholdCode(hh.code);
      setVillageCode(hh.hamletCode);
    }
  };

  // Handle business select (for revenue)
  const handleBusinessChange = (bizId: string) => {
    setSelectedBizId(bizId);
    const biz = MOCK_BUSINESS_HOUSEHOLDS.find((b) => b.id === bizId);
    if (biz) {
      setBusinessName(biz.businessName);
      setHouseholdHeadName(biz.householdHeadName);
    }
  };

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      if (tabType === 'list') {
        const item = editingItem as BusinessHouseholdRecord;
        setSelectedHhId(item.householdId || '');
        setHouseholdHeadName(item.householdHeadName || '');
        setHouseholdCode(item.householdCode || '');
        setVillageCode(item.villageCode || 'noc-01');
        setBusinessName(item.businessName || '');
        setIndustry(item.industry || 'Tạp hóa');
        setScale(item.scale || 'small');
        setHasRegistration(item.hasRegistration ? 'yes' : 'no');
        setRegistrationNumber(item.registrationNumber || '');
        setIsActive(item.isActive ? 'yes' : 'no');
      } else if (tabType === 'revenue') {
        const item = editingItem as BusinessRevenueRecord;
        setSelectedBizId(item.businessId || '');
        setBusinessName(item.businessName || '');
        setHouseholdHeadName(item.householdHeadName || '');
        setPeriod(item.period || 'Quý 2/2026');
        setEstimatedRevenueVnd(String(item.estimatedRevenueVnd || ''));
        setDataSource(item.dataSource || 'survey');
        setNotes(item.notes || '');
      } else if (tabType === 'labor') {
        const item = editingItem as NonAgriculturalLaborRecord;
        setSelectedHhId(item.householdId || '');
        setHouseholdHeadName(item.householdHeadName || '');
        setHouseholdCode(item.householdCode || '');
        setVillageCode(item.villageCode || 'noc-01');
        setTotalLaborCount(String(item.totalLaborCount || ''));
        setNonAgriculturalLaborCount(String(item.nonAgriculturalLaborCount || ''));
        setAwayLaborCount(String(item.awayLaborCount || ''));
        setSurveyYear(String(item.year || '2026'));
      }
    } else {
      // Reset values
      setSelectedHhId('');
      setHouseholdHeadName('');
      setHouseholdCode('');
      setVillageCode('noc-01');
      setBusinessName('');
      setIndustry('Tạp hóa');
      setScale('small');
      setHasRegistration('no');
      setRegistrationNumber('');
      setIsActive('yes');

      setSelectedBizId('');
      setPeriod('Quý 2/2026');
      setEstimatedRevenueVnd('');
      setDataSource('survey');
      setNotes('');

      setTotalLaborCount('');
      setNonAgriculturalLaborCount('');
      setAwayLaborCount('');
      setSurveyYear('2026');
    }
  }, [editingItem, isOpen, tabType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success(`${isEdit ? 'Cập nhật' : 'Thêm mới'} thông tin thành công!`, {
      description: `Đã lưu hồ sơ hộ sản xuất kinh doanh vào hệ thống.`,
    });

    onOpenChange(false);
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Thêm mới';
    switch (tabType) {
      case 'list':
        return `${prefix} Hộ sản xuất kinh doanh`;
      case 'revenue':
        return `${prefix} Doanh thu ước tính`;
      case 'labor':
        return `${prefix} Thống kê lao động`;
      default:
        return `${prefix} thông tin kinh doanh`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-xs">
            Quản lý và giám sát thông tin đăng ký kinh doanh, doanh thu định kỳ và lao động phi nông nghiệp của các hộ dân Lao Bảo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Hộ dân hoặc Hộ KD selection (if creating new) */}
          {!isEdit ? (
            tabType === 'revenue' ? (
              <div className="space-y-1">
                <Label htmlFor="bizSelect" className="text-xs">Cơ sở / Hộ KD <span className="text-destructive">*</span></Label>
                <Select value={selectedBizId} onValueChange={handleBusinessChange}>
                  <SelectTrigger id="bizSelect" className="h-9 text-xs bg-card">
                    <SelectValue placeholder="Chọn hộ kinh doanh..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs max-h-[200px]">
                    {MOCK_BUSINESS_HOUSEHOLDS.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="cursor-pointer">
                        {b.businessName} ({b.householdHeadName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1">
                <Label htmlFor="hhSelect" className="text-xs">Hộ gia đình <span className="text-destructive">*</span></Label>
                <Select value={selectedHhId} onValueChange={handleHouseholdChange}>
                  <SelectTrigger id="hhSelect" className="h-9 text-xs bg-card">
                    <SelectValue placeholder="Chọn hộ dân..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs max-h-[200px]">
                    {MOCK_HOUSEHOLDS.slice(0, 50).map((hh) => (
                      <SelectItem key={hh.id} value={hh.id} className="cursor-pointer">
                        {hh.headName} ({hh.code}) - {hh.hamletName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 gap-3 bg-muted/20 p-2 rounded-lg border border-border">
              {tabType === 'revenue' ? (
                <>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-bold">Tên cơ sở</span>
                    <span className="text-xs font-bold text-foreground">{businessName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-bold">Chủ hộ</span>
                    <span className="text-xs text-muted-foreground font-semibold">{householdHeadName}</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-bold">Chủ hộ</span>
                    <span className="text-xs font-bold text-foreground">{householdHeadName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-bold">Mã hộ / Thôn</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {householdCode} - {hamlets.find((h) => h.code === villageCode)?.name}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section 2: Input fields conditional on tabType */}
          {tabType === 'list' && (
            <>
              <div className="space-y-1">
                <Label htmlFor="businessName" className="text-xs">Tên cơ sở kinh doanh <span className="text-destructive">*</span></Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ví dụ: Tạp hóa Cát Tường"
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="industry" className="text-xs">Ngành nghề</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="Tạp hóa" className="cursor-pointer">Tạp hóa</SelectItem>
                      <SelectItem value="Sửa chữa xe máy" className="cursor-pointer">Sửa chữa xe máy</SelectItem>
                      <SelectItem value="Cơ sở xay xát lúa" className="cursor-pointer">Cơ sở xay xát lúa</SelectItem>
                      <SelectItem value="Thu mua lâm sản (Quế, Sâm)" className="cursor-pointer">Thu mua lâm sản</SelectItem>
                      <SelectItem value="Quán ăn/Cà phê" className="cursor-pointer">Quán ăn/Cà phê</SelectItem>
                      <SelectItem value="Dịch vụ vận tải nhỏ" className="cursor-pointer">Dịch vụ vận tải nhỏ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="scale" className="text-xs">Quy mô hộ kinh doanh</Label>
                  <Select value={scale} onValueChange={(v) => setScale(v as any)}>
                    <SelectTrigger id="scale" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="small" className="cursor-pointer">Nhỏ (Dưới 3 lao động)</SelectItem>
                      <SelectItem value="medium" className="cursor-pointer">Vừa (3 - 9 lao động)</SelectItem>
                      <SelectItem value="large" className="cursor-pointer">Lớn (Trên 10 lao động)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="hasRegistration" className="text-xs">Giấy phép đăng ký kinh doanh</Label>
                  <Select value={hasRegistration} onValueChange={setHasRegistration}>
                    <SelectTrigger id="hasRegistration" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="yes" className="cursor-pointer">Đã đăng ký (Có giấy ĐKKD)</SelectItem>
                      <SelectItem value="no" className="cursor-pointer">Chưa đăng ký</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="registrationNumber" className="text-xs">Số ĐKKD (nếu có)</Label>
                  <Input
                    id="registrationNumber"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    disabled={hasRegistration === 'no'}
                    placeholder="ĐKKD-30-..."
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="isActive" className="text-xs">Trạng thái hoạt động</Label>
                <Select value={isActive} onValueChange={setIsActive}>
                  <SelectTrigger id="isActive" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="yes" className="cursor-pointer">Đang hoạt động</SelectItem>
                    <SelectItem value="no" className="cursor-pointer">Tạm ngưng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {tabType === 'revenue' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="period" className="text-xs">Kỳ ghi nhận doanh thu <span className="text-destructive">*</span></Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger id="period" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="Quý 1/2026" className="cursor-pointer">Quý 1/2026</SelectItem>
                      <SelectItem value="Quý 2/2026" className="cursor-pointer">Quý 2/2026</SelectItem>
                      <SelectItem value="Quý 3/2026" className="cursor-pointer">Quý 3/2026</SelectItem>
                      <SelectItem value="Quý 4/2026" className="cursor-pointer">Quý 4/2026</SelectItem>
                      <SelectItem value="Năm 2025" className="cursor-pointer">Cả năm 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="dataSource" className="text-xs">Nguồn số liệu doanh thu</Label>
                  <Select value={dataSource} onValueChange={(v) => setDataSource(v as any)}>
                    <SelectTrigger id="dataSource" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="survey" className="cursor-pointer">Khảo sát thực tế</SelectItem>
                      <SelectItem value="taxDeclaration" className="cursor-pointer">Tự kê khai thuế</SelectItem>
                      <SelectItem value="estimate" className="cursor-pointer">Ước tính thống kê</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="estimatedRevenueVnd" className="text-xs">Doanh thu ước tính (VND) <span className="text-destructive">*</span></Label>
                <Input
                  id="estimatedRevenueVnd"
                  type="number"
                  value={estimatedRevenueVnd}
                  onChange={(e) => setEstimatedRevenueVnd(e.target.value)}
                  placeholder="Ví dụ: 120000000"
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs">Ghi chú thêm</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Hoạt động thời vụ đông khách hơn..."
                  className="h-9 text-xs"
                />
              </div>
            </>
          )}

          {tabType === 'labor' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="surveyYear" className="text-xs">Năm khảo sát</Label>
                  <Input
                    id="surveyYear"
                    type="number"
                    value={surveyYear}
                    onChange={(e) => setSurveyYear(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="totalLaborCount" className="text-xs">Tổng số lao động trong hộ <span className="text-destructive">*</span></Label>
                  <Input
                    id="totalLaborCount"
                    type="number"
                    value={totalLaborCount}
                    onChange={(e) => setTotalLaborCount(e.target.value)}
                    placeholder="4"
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="nonAgriculturalLaborCount" className="text-xs">Lao động phi nông nghiệp <span className="text-destructive">*</span></Label>
                  <Input
                    id="nonAgriculturalLaborCount"
                    type="number"
                    value={nonAgriculturalLaborCount}
                    onChange={(e) => setNonAgriculturalLaborCount(e.target.value)}
                    placeholder="2"
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="awayLaborCount" className="text-xs">Lao động đi làm ăn xa <span className="text-destructive">*</span></Label>
                  <Input
                    id="awayLaborCount"
                    type="number"
                    value={awayLaborCount}
                    onChange={(e) => setAwayLaborCount(e.target.value)}
                    placeholder="1"
                    className="h-9 text-xs"
                    required
                  />
                </div>
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
