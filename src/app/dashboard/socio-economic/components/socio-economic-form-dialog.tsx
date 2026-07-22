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
  SocioEconomicItem,
  EconomicIndicatorRecord,
  SocialIndicatorRecord,
  LaborEmploymentIndicatorRecord,
  InfrastructureIndicatorRecord,
} from '@/types/socio-economic';

interface SocioEconomicFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: string; // 'economic' | 'social' | 'labor' | 'infrastructure'
  editingItem: SocioEconomicItem | null;
}

export function SocioEconomicFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: SocioEconomicFormDialogProps) {
  const { hamlets } = useTenant();
  const isEdit = !!editingItem;

  // Common fields
  const [year, setYear] = React.useState('2026');
  const [villageCode, setVillageCode] = React.useState('all');
  const [note, setNote] = React.useState('');

  // 1. Economic fields
  const [gdpGrowth, setGdpGrowth] = React.useState('');
  const [totalProd, setTotalProd] = React.useState('');
  const [agProd, setAgProd] = React.useState('');
  const [indProd, setIndProd] = React.useState('');
  const [srvProd, setSrvProd] = React.useState('');
  const [avgIncome, setAvgIncome] = React.useState('');
  const [budgetRev, setBudgetRev] = React.useState('');
  const [budgetExp, setBudgetExp] = React.useState('');

  // 2. Social fields
  const [totalPop, setTotalPop] = React.useState('');
  const [totalHh, setTotalHh] = React.useState('');
  const [poorHhCount, setPoorHhCount] = React.useState('');
  const [poorHhPercent, setPoorHhPercent] = React.useState('');
  const [nearPoorHhCount, setNearPoorHhCount] = React.useState('');
  const [nearPoorHhPercent, setNearPoorHhPercent] = React.useState('');
  const [standardSchools, setStandardSchools] = React.useState('');
  const [cultureVillagePercent, setCultureVillagePercent] = React.useState('');
  const [healthInsurancePercent, setHealthInsurancePercent] = React.useState('');

  // 3. Labor fields
  const [workingAgePop, setWorkingAgePop] = React.useState('');
  const [trainedLaborCount, setTrainedLaborCount] = React.useState('');
  const [trainedLaborPercent, setTrainedLaborPercent] = React.useState('');
  const [agLaborCount, setAgLaborCount] = React.useState('');
  const [nonAgLaborCount, setNonAgLaborCount] = React.useState('');
  const [unemployedCount, setUnemployedCount] = React.useState('');

  // 4. Infrastructure fields
  const [concreteRoadPercent, setConcreteRoadPercent] = React.useState('');
  const [powerPercent, setPowerPercent] = React.useState('');
  const [solidHousePercent, setSolidHousePercent] = React.useState('');
  const [latrinePercent, setLatrinePercent] = React.useState('');
  const [irrigationConcretePercent, setIrrigationConcretePercent] = React.useState('');

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      setYear(String(editingItem.year || '2026'));
      setNote(editingItem.note || '');

      if (tabType === 'economic') {
        const item = editingItem as EconomicIndicatorRecord;
        setGdpGrowth(String(item.gdpGrowthPercent || ''));
        setTotalProd(String(item.totalProductionValueBillion || ''));
        setAgProd(String(item.agricultureProductionValueBillion || ''));
        setIndProd(String(item.industryConstructionValueBillion || ''));
        setSrvProd(String(item.serviceValueBillion || ''));
        setAvgIncome(String(item.averageIncomePerCapitaMillion || ''));
        setBudgetRev(String(item.budgetRevenueMillion || ''));
        setBudgetExp(String(item.budgetExpenditureMillion || ''));
      } else if (tabType === 'social') {
        const item = editingItem as SocialIndicatorRecord;
        setVillageCode(item.villageCode || 'all');
        setTotalPop(String(item.totalPopulation || ''));
        setTotalHh(String(item.totalHouseholds || ''));
        setPoorHhCount(String(item.poorHouseholdsCount || ''));
        setPoorHhPercent(String(item.poorHouseholdsPercent || ''));
        setNearPoorHhCount(String(item.nearPoorHouseholdsCount || ''));
        setNearPoorHhPercent(String(item.nearPoorHouseholdsPercent || ''));
        setStandardSchools(String(item.nationalStandardSchoolsCount ?? ''));
        setCultureVillagePercent(String(item.cultureVillagePercent ?? ''));
        setHealthInsurancePercent(String(item.healthInsurancePercent || ''));
      } else if (tabType === 'labor') {
        const item = editingItem as LaborEmploymentIndicatorRecord;
        setVillageCode(item.villageCode || 'all');
        setWorkingAgePop(String(item.workingAgePopulation || ''));
        setTrainedLaborCount(String(item.trainedLaborCount || ''));
        setTrainedLaborPercent(String(item.trainedLaborPercent || ''));
        setAgLaborCount(String(item.agriculturalLaborCount || ''));
        setNonAgLaborCount(String(item.nonAgriculturalLaborCount || ''));
        setUnemployedCount(String(item.unemployedCount || ''));
      } else if (tabType === 'infrastructure') {
        const item = editingItem as InfrastructureIndicatorRecord;
        setVillageCode(item.villageCode || 'all');
        setConcreteRoadPercent(String(item.concreteRoadPercent || ''));
        setPowerPercent(String(item.nationalGridPowerPercent || ''));
        setSolidHousePercent(String(item.solidHousePercent || ''));
        setLatrinePercent(String(item.hygienicLatrinePercent || ''));
        setIrrigationConcretePercent(String(item.irrigationChannelConcretePercent || ''));
      }
    } else {
      // Reset values
      setYear('2026');
      setVillageCode('all');
      setNote('');

      setGdpGrowth('');
      setTotalProd('');
      setAgProd('');
      setIndProd('');
      setSrvProd('');
      setAvgIncome('');
      setBudgetRev('');
      setBudgetExp('');

      setTotalPop('');
      setTotalHh('');
      setPoorHhCount('');
      setPoorHhPercent('');
      setNearPoorHhCount('');
      setNearPoorHhPercent('');
      setStandardSchools('');
      setCultureVillagePercent('');
      setHealthInsurancePercent('');

      setWorkingAgePop('');
      setTrainedLaborCount('');
      setTrainedLaborPercent('');
      setAgLaborCount('');
      setNonAgLaborCount('');
      setUnemployedCount('');

      setConcreteRoadPercent('');
      setPowerPercent('');
      setSolidHousePercent('');
      setLatrinePercent('');
      setIrrigationConcretePercent('');
    }
  }, [editingItem, isOpen, tabType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success(`${isEdit ? 'Cập nhật' : 'Thêm mới'} chỉ tiêu thành công!`, {
      description: `Đã lưu hồ sơ thống kê vào cơ sở dữ liệu.`,
    });

    onOpenChange(false);
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Thêm mới';
    switch (tabType) {
      case 'economic': return `${prefix} Chỉ tiêu Kinh tế`;
      case 'social': return `${prefix} Chỉ tiêu Xã hội & Dân cư`;
      case 'labor': return `${prefix} Chỉ tiêu Lao động - Việc làm`;
      case 'infrastructure': return `${prefix} Chỉ tiêu Hạ tầng nông thôn`;
      default: return `${prefix} Chỉ tiêu tổng hợp`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-xs">
            Cập nhật các số liệu thống kê kinh tế - xã hội tổng hợp theo năm và thôn để phục vụ báo cáo và lập kế hoạch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Common Section: Year & Hamlet selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="year" className="text-xs">Năm báo cáo <span className="text-destructive">*</span></Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            {tabType !== 'economic' && (
              <div className="space-y-1">
                <Label htmlFor="villageSelect" className="text-xs">Địa bàn áp dụng</Label>
                <Select value={villageCode} onValueChange={setVillageCode}>
                  <SelectTrigger id="villageSelect" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="all" className="cursor-pointer">Toàn xã Lao Bảo</SelectItem>
                    {hamlets.map(h => (
                      <SelectItem key={h.code} value={h.code} className="cursor-pointer">{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Form fields based on tabType */}
          {tabType === 'economic' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="gdpGrowth" className="text-xs font-semibold">Tốc độ tăng trưởng (%)</Label>
                  <Input id="gdpGrowth" type="number" step="0.1" value={gdpGrowth} onChange={(e) => setGdpGrowth(e.target.value)} placeholder="7.5" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="totalProd" className="text-xs font-semibold">Tổng giá trị SX (Tỷ VND) <span className="text-destructive">*</span></Label>
                  <Input id="totalProd" type="number" step="0.1" value={totalProd} onChange={(e) => setTotalProd(e.target.value)} placeholder="150" className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="agProd" className="text-xs">SX Nông - Lâm - Thủy sản</Label>
                  <Input id="agProd" type="number" step="0.1" value={agProd} onChange={(e) => setAgProd(e.target.value)} placeholder="55" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="indProd" className="text-xs">Công nghiệp - Xây dựng</Label>
                  <Input id="indProd" type="number" step="0.1" value={indProd} onChange={(e) => setIndProd(e.target.value)} placeholder="42" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="srvProd" className="text-xs">Dịch vụ thương mại</Label>
                  <Input id="srvProd" type="number" step="0.1" value={srvProd} onChange={(e) => setSrvProd(e.target.value)} placeholder="48" className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="avgIncome" className="text-xs">Thu nhập bình quân (Tr.đ)</Label>
                  <Input id="avgIncome" type="number" step="0.1" value={avgIncome} onChange={(e) => setAvgIncome(e.target.value)} placeholder="36" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="budgetRev" className="text-xs">Thu ngân sách xã (Tr.đ)</Label>
                  <Input id="budgetRev" type="number" value={budgetRev} onChange={(e) => setBudgetRev(e.target.value)} placeholder="6500" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="budgetExp" className="text-xs">Chi ngân sách xã (Tr.đ)</Label>
                  <Input id="budgetExp" type="number" value={budgetExp} onChange={(e) => setBudgetExp(e.target.value)} placeholder="6000" className="h-9 text-xs" />
                </div>
              </div>
            </>
          )}

          {tabType === 'social' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="totalPop" className="text-xs">Tổng số dân (Người) <span className="text-destructive">*</span></Label>
                  <Input id="totalPop" type="number" value={totalPop} onChange={(e) => setTotalPop(e.target.value)} placeholder="450" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="totalHh" className="text-xs">Tổng số hộ gia đình <span className="text-destructive">*</span></Label>
                  <Input id="totalHh" type="number" value={totalHh} onChange={(e) => setTotalHh(e.target.value)} placeholder="110" className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border border-border p-2 rounded-lg bg-muted/20">
                <div className="space-y-2 col-span-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Tỷ lệ nghèo & cận nghèo</span>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="poorHhCount" className="text-xs">Số hộ nghèo <span className="text-destructive">*</span></Label>
                  <Input id="poorHhCount" type="number" value={poorHhCount} onChange={(e) => setPoorHhCount(e.target.value)} placeholder="15" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="poorHhPercent" className="text-xs">Tỷ lệ nghèo (%) <span className="text-destructive">*</span></Label>
                  <Input id="poorHhPercent" type="number" step="0.1" value={poorHhPercent} onChange={(e) => setPoorHhPercent(e.target.value)} placeholder="13.6" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nearPoorHhCount" className="text-xs">Số hộ cận nghèo</Label>
                  <Input id="nearPoorHhCount" type="number" value={nearPoorHhCount} onChange={(e) => setNearPoorHhCount(e.target.value)} placeholder="8" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nearPoorHhPercent" className="text-xs">Tỷ lệ cận nghèo (%)</Label>
                  <Input id="nearPoorHhPercent" type="number" step="0.1" value={nearPoorHhPercent} onChange={(e) => setNearPoorHhPercent(e.target.value)} placeholder="7.2" className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="standardSchools" className="text-xs">Trường chuẩn QG (nếu toàn xã)</Label>
                  <Input id="standardSchools" type="number" value={standardSchools} onChange={(e) => setStandardSchools(e.target.value)} placeholder="3" className="h-9 text-xs" disabled={villageCode !== 'all'} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cultureVillagePercent" className="text-xs">Thôn văn hóa (%)</Label>
                  <Input id="cultureVillagePercent" type="number" step="0.1" value={cultureVillagePercent} onChange={(e) => setCultureVillagePercent(e.target.value)} placeholder="85" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="healthInsurancePercent" className="text-xs">Tỷ lệ BHYT (%) <span className="text-destructive">*</span></Label>
                  <Input id="healthInsurancePercent" type="number" step="0.1" value={healthInsurancePercent} onChange={(e) => setHealthInsurancePercent(e.target.value)} placeholder="98" className="h-9 text-xs" required />
                </div>
              </div>
            </>
          )}

          {tabType === 'labor' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="workingAgePop" className="text-xs font-semibold">Dân số độ tuổi lao động <span className="text-destructive">*</span></Label>
                  <Input id="workingAgePop" type="number" value={workingAgePop} onChange={(e) => setWorkingAgePop(e.target.value)} placeholder="320" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="unemployedCount" className="text-xs">Số người thất nghiệp</Label>
                  <Input id="unemployedCount" type="number" value={unemployedCount} onChange={(e) => setUnemployedCount(e.target.value)} placeholder="5" className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border border-border p-2 rounded-lg bg-muted/20">
                <div className="space-y-2 col-span-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Đào tạo nghề nghiệp</span>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="trainedLaborCount" className="text-xs">Lao động qua đào tạo <span className="text-destructive">*</span></Label>
                  <Input id="trainedLaborCount" type="number" value={trainedLaborCount} onChange={(e) => setTrainedLaborCount(e.target.value)} placeholder="140" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="trainedLaborPercent" className="text-xs">Tỷ lệ đào tạo (%) <span className="text-destructive">*</span></Label>
                  <Input id="trainedLaborPercent" type="number" step="0.1" value={trainedLaborPercent} onChange={(e) => setTrainedLaborPercent(e.target.value)} placeholder="43.8" className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="agLaborCount" className="text-xs">Lao động nông nghiệp</Label>
                  <Input id="agLaborCount" type="number" value={agLaborCount} onChange={(e) => setAgLaborCount(e.target.value)} placeholder="180" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nonAgLaborCount" className="text-xs">Lao động phi nông nghiệp</Label>
                  <Input id="nonAgLaborCount" type="number" value={nonAgLaborCount} onChange={(e) => setNonAgLaborCount(e.target.value)} placeholder="135" className="h-9 text-xs" />
                </div>
              </div>
            </>
          )}

          {tabType === 'infrastructure' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="concreteRoadPercent" className="text-xs">Đường bê tông hóa (%) <span className="text-destructive">*</span></Label>
                  <Input id="concreteRoadPercent" type="number" step="0.1" value={concreteRoadPercent} onChange={(e) => setConcreteRoadPercent(e.target.value)} placeholder="80" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="powerPercent" className="text-xs">Hộ dùng điện lưới quốc gia (%) <span className="text-destructive">*</span></Label>
                  <Input id="powerPercent" type="number" step="0.1" value={powerPercent} onChange={(e) => setPowerPercent(e.target.value)} placeholder="98.5" className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="solidHousePercent" className="text-xs">Hộ có nhà ở kiên cố (%)</Label>
                  <Input id="solidHousePercent" type="number" step="0.1" value={solidHousePercent} onChange={(e) => setSolidHousePercent(e.target.value)} placeholder="85" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="latrinePercent" className="text-xs">Nhà tiêu hợp vệ sinh (%)</Label>
                  <Input id="latrinePercent" type="number" step="0.1" value={latrinePercent} onChange={(e) => setLatrinePercent(e.target.value)} placeholder="75" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="irrigationConcretePercent" className="text-xs">Kênh mương kiên cố (%)</Label>
                  <Input id="irrigationConcretePercent" type="number" step="0.1" value={irrigationConcretePercent} onChange={(e) => setIrrigationConcretePercent(e.target.value)} placeholder="65" className="h-9 text-xs" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <Label htmlFor="note" className="text-xs">Ghi chú thống kê / Nguồn báo cáo</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú thêm..."
              className="h-9 text-xs"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
            </DialogClose>
            <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu chỉ tiêu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
