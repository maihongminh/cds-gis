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
  ClimateItem,
  DisasterEvent,
  WeatherMonthlyRecord,
  AgricultureRiskAlert
} from '@/types/climate';

interface ClimateFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: string;
  editingItem: ClimateItem | null;
}

export function ClimateFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: ClimateFormDialogProps) {
  const { hamlets } = useTenant();
  const isEdit = !!editingItem;

  // 1. Disaster event fields
  const [eventCode, setEventCode] = React.useState('');
  const [disasterType, setDisasterType] = React.useState<'landslide' | 'flashFlood' | 'storm' | 'frost' | 'drought' | 'other'>('landslide');
  const [eventDate, setEventDate] = React.useState('2026-06-22');
  const [disasterSeverity, setDisasterSeverity] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [damageVnd, setDamageVnd] = React.useState('');
  const [disasterStatus, setDisasterStatus] = React.useState<'active' | 'resolved' | 'processing'>('active');
  const [disasterNote, setDisasterNote] = React.useState('');
  const [selectedDisasterHamlets, setSelectedDisasterHamlets] = React.useState<string[]>([]);

  // 2. Weather fields
  const [weatherYear, setWeatherYear] = React.useState('2026');
  const [weatherMonth, setWeatherMonth] = React.useState('6');
  const [avgTemp, setAvgTemp] = React.useState('');
  const [rainfall, setRainfall] = React.useState('');
  const [humidity, setHumidity] = React.useState('');
  const [sunshine, setSunshine] = React.useState('');
  const [weatherSource, setWeatherSource] = React.useState('Trạm khí tượng Quảng Trị (mock)');

  // 3. Risk alert fields
  const [alertCode, setAlertCode] = React.useState('');
  const [riskType, setRiskType] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'info' | 'warning' | 'critical'>('warning');
  const [recommendations, setRecommendations] = React.useState('');
  const [alertStatus, setAlertStatus] = React.useState<'active' | 'archived'>('active');
  const [alertDate, setAlertDate] = React.useState('2026-06-22');
  const [selectedAlertHamlets, setSelectedAlertHamlets] = React.useState<string[]>([]);
  const [affectedCrops, setAffectedCrops] = React.useState<string[]>([]);

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      if (tabType === 'disaster') {
        const item = editingItem as DisasterEvent;
        setEventCode(item.eventCode || '');
        setDisasterType(item.disasterType || 'landslide');
        setEventDate(item.eventDate || '');
        setDisasterSeverity(item.severity || 'medium');
        setDamageVnd(String(item.estimatedDamageVnd || ''));
        setDisasterStatus(item.status || 'active');
        setDisasterNote(item.note || '');
        setSelectedDisasterHamlets(item.affectedHamlets || []);
      } else if (tabType === 'weather') {
        const item = editingItem as WeatherMonthlyRecord;
        setWeatherYear(String(item.year || '2026'));
        setWeatherMonth(String(item.month || '6'));
        setAvgTemp(String(item.averageTemperature || ''));
        setRainfall(String(item.rainfallMm || ''));
        setHumidity(String(item.humidityPercentage || ''));
        setSunshine(String(item.sunshineHours || ''));
        setWeatherSource(item.source || '');
      } else if (tabType === 'alerts') {
        const item = editingItem as AgricultureRiskAlert;
        setAlertCode(item.alertCode || '');
        setRiskType(item.riskType || '');
        setAlertSeverity(item.severity || 'warning');
        setRecommendations(item.recommendations || '');
        setAlertStatus(item.status || 'active');
        setAlertDate(item.publishDate || '');
        setSelectedAlertHamlets(item.affectedHamlets || []);
        setAffectedCrops(item.affectedCropTypeCodes || []);
      }
    } else {
      // Reset values
      setEventCode('');
      setDisasterType('landslide');
      setEventDate('2026-06-22');
      setDisasterSeverity('medium');
      setDamageVnd('');
      setDisasterStatus('active');
      setDisasterNote('');
      setSelectedDisasterHamlets([]);
      setWeatherYear('2026');
      setWeatherMonth('6');
      setAvgTemp('');
      setRainfall('');
      setHumidity('');
      setSunshine('');
      setWeatherSource('Trạm khí tượng Quảng Trị (mock)');
      setAlertCode('');
      setRiskType('');
      setAlertSeverity('warning');
      setRecommendations('');
      setAlertStatus('active');
      setAlertDate('2026-06-22');
      setSelectedAlertHamlets([]);
      setAffectedCrops([]);
    }
  }, [editingItem, isOpen, tabType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success(`${isEdit ? 'Cập nhật' : 'Ghi nhận'} thông tin thành công!`, {
      description: `Đã lưu bản ghi khí hậu vào hệ thống.`,
    });

    onOpenChange(false);
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Ghi nhận';
    switch (tabType) {
      case 'disaster': return `${prefix} Sự kiện thiên tai`;
      case 'weather': return `${prefix} Số liệu thời tiết`;
      case 'alerts': return `${prefix} Cảnh báo rủi ro`;
      default: return `${prefix} thông tin khí hậu`;
    }
  };

  const toggleHamletSelect = (name: string, isDisaster: boolean) => {
    if (isDisaster) {
      setSelectedDisasterHamlets(prev =>
        prev.includes(name) ? prev.filter(h => h !== name) : [...prev, name]
      );
    } else {
      setSelectedAlertHamlets(prev =>
        prev.includes(name) ? prev.filter(h => h !== name) : [...prev, name]
      );
    }
  };

  const toggleCropSelect = (code: string) => {
    setAffectedCrops(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const renderFields = () => {
    switch (tabType) {
      case 'disaster':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="eventCode" className="text-xs">Mã sự kiện <span className="text-destructive">*</span></Label>
                <Input id="eventCode" value={eventCode} onChange={(e) => setEventCode(e.target.value)} placeholder="TT-2026-..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="disasterType" className="text-xs">Loại thiên tai</Label>
                <Select value={disasterType} onValueChange={(v) => setDisasterType(v as any)}>
                  <SelectTrigger id="disasterType" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="landslide" className="cursor-pointer">Sạt lở đất</SelectItem>
                    <SelectItem value="flashFlood" className="cursor-pointer">Lũ quét</SelectItem>
                    <SelectItem value="storm" className="cursor-pointer">Giông lốc lớn</SelectItem>
                    <SelectItem value="frost" className="cursor-pointer">Sương muối</SelectItem>
                    <SelectItem value="drought" className="cursor-pointer">Hạn hán</SelectItem>
                    <SelectItem value="other" className="cursor-pointer">Thiên tai khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="eventDate" className="text-xs">Thời gian xảy ra</Label>
                <Input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="disasterSeverity" className="text-xs">Mức độ nghiêm trọng</Label>
                <Select value={disasterSeverity} onValueChange={(v) => setDisasterSeverity(v as any)}>
                  <SelectTrigger id="disasterSeverity" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="low" className="cursor-pointer">Thấp</SelectItem>
                    <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                    <SelectItem value="high" className="cursor-pointer">Nghiêm trọng (High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="damageVnd" className="text-xs">Thiệt hại ước tính (VND) <span className="text-destructive">*</span></Label>
                <Input id="damageVnd" type="number" value={damageVnd} onChange={(e) => setDamageVnd(e.target.value)} placeholder="50000000..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="disasterStatus" className="text-xs">Tình trạng xử lý</Label>
                <Select value={disasterStatus} onValueChange={(v) => setDisasterStatus(v as any)}>
                  <SelectTrigger id="disasterStatus" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="active" className="cursor-pointer">Đang diễn ra</SelectItem>
                    <SelectItem value="processing" className="cursor-pointer">Đang ứng phó</SelectItem>
                    <SelectItem value="resolved" className="cursor-pointer">Đã khắc phục</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Thôn ảnh hưởng (Chọn nhiều)</Label>
              <div className="grid grid-cols-4 gap-2 pt-1 border border-border rounded-lg p-2 bg-muted/20">
                {hamlets.map(h => {
                  const isSelected = selectedDisasterHamlets.includes(h.name);
                  return (
                    <button
                      key={h.code}
                      type="button"
                      onClick={() => toggleHamletSelect(h.name, true)}
                      className={`text-[10px] py-1 border rounded-md font-semibold transition-all ${isSelected ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}
                    >
                      {h.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="disasterNote" className="text-xs">Chi tiết ghi nhận / Biện pháp ứng phó</Label>
              <Input id="disasterNote" value={disasterNote} onChange={(e) => setDisasterNote(e.target.value)} placeholder="Tập trung di tản dân, gia cố nhà..." className="h-9 text-xs" />
            </div>
          </>
        );
      case 'weather':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="weatherYear" className="text-xs">Năm ghi nhận</Label>
                <Input id="weatherYear" type="number" value={weatherYear} onChange={(e) => setWeatherYear(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weatherMonth" className="text-xs">Tháng ghi nhận</Label>
                <Input id="weatherMonth" type="number" value={weatherMonth} onChange={(e) => setWeatherMonth(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="avgTemp" className="text-xs">Nhiệt độ trung bình (°C) <span className="text-destructive">*</span></Label>
                <Input id="avgTemp" type="number" step="0.1" value={avgTemp} onChange={(e) => setAvgTemp(e.target.value)} placeholder="24.5" className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="rainfall" className="text-xs">Lượng mưa (mm) <span className="text-destructive">*</span></Label>
                <Input id="rainfall" type="number" value={rainfall} onChange={(e) => setRainfall(e.target.value)} placeholder="220" className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="humidity" className="text-xs">Độ ẩm trung bình (%)</Label>
                <Input id="humidity" type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} placeholder="85" className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sunshine" className="text-xs">Số giờ nắng (giờ)</Label>
                <Input id="sunshine" type="number" value={sunshine} onChange={(e) => setSunshine(e.target.value)} placeholder="160" className="h-9 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="weatherSource" className="text-xs">Nguồn dữ liệu kiểm định</Label>
              <Input id="weatherSource" value={weatherSource} onChange={(e) => setWeatherSource(e.target.value)} className="h-9 text-xs" />
            </div>
          </>
        );
      case 'alerts':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="alertCode" className="text-xs">Mã cảnh báo <span className="text-destructive">*</span></Label>
                <Input id="alertCode" value={alertCode} onChange={(e) => setAlertCode(e.target.value)} placeholder="CB-KH-2026-..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="riskType" className="text-xs">Loại rủi ro cảnh báo <span className="text-destructive">*</span></Label>
                <Input id="riskType" value={riskType} onChange={(e) => setRiskType(e.target.value)} placeholder="Ví dụ: Sương muối hại sâm..." className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="alertSeverity" className="text-xs">Mức độ cảnh báo</Label>
                <Select value={alertSeverity} onValueChange={(v) => setAlertSeverity(v as any)}>
                  <SelectTrigger id="alertSeverity" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="info" className="cursor-pointer">Thông tin (Info)</SelectItem>
                    <SelectItem value="warning" className="cursor-pointer">Cảnh báo (Warning)</SelectItem>
                    <SelectItem value="critical" className="cursor-pointer">Nguy hại cấp bách (Critical)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="alertDate" className="text-xs">Ngày phát hành</Label>
                <Input id="alertDate" type="date" value={alertDate} onChange={(e) => setAlertDate(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Cây trồng bị ảnh hưởng (Chọn nhiều)</Label>
              <div className="flex gap-2 pt-1">
                {['ca-phe-arabica', 'chuoi-laobao', 'lua-ray'].map(crop => {
                  const isSelected = affectedCrops.includes(crop);
                  const label = crop === 'ca-phe-arabica' ? 'Cà phê Arabica' : crop === 'chuoi-laobao' ? 'Chuối Lao Bảo' : 'Lúa rẫy';
                  return (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCropSelect(crop)}
                      className={`text-xs px-3 py-1 border rounded-full font-semibold transition-all ${isSelected ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Khu vực phát sóng cảnh báo</Label>
              <div className="grid grid-cols-4 gap-2 pt-1 border border-border rounded-lg p-2 bg-muted/20">
                {hamlets.map(h => {
                  const isSelected = selectedAlertHamlets.includes(h.name);
                  return (
                    <button
                      key={h.code}
                      type="button"
                      onClick={() => toggleHamletSelect(h.name, false)}
                      className={`text-[10px] py-1 border rounded-md font-semibold transition-all ${isSelected ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}
                    >
                      {h.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="recommendations" className="text-xs">Khuyến nghị nông vụ kỹ thuật <span className="text-destructive">*</span></Label>
              <Input id="recommendations" value={recommendations} onChange={(e) => setRecommendations(e.target.value)} placeholder="Che chắn bọc nilon, thoát nước rãnh..." className="h-9 text-xs" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="alertStatus" className="text-xs">Trạng thái phát thông báo</Label>
              <Select value={alertStatus} onValueChange={(v) => setAlertStatus(v as any)}>
                <SelectTrigger id="alertStatus" className="h-9 text-xs bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="active" className="cursor-pointer">Có hiệu lực (Phát thanh)</SelectItem>
                  <SelectItem value="archived" className="cursor-pointer">Lưu trữ lưu hồ sơ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-xs">
            Ghi nhận và giám sát các chỉ số thời tiết, phòng chống thiên tai và phát hành khuyến cáo khẩn cấp xã Lao Bảo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}

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
