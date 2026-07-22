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
  WaterItem,
  GroundwaterPermitRecord,
  CleanWaterUsageRecord,
  HygienicWaterUsageRecord,
  CentralizedWaterFacility,
  SmallWaterFacility,
  WaterTreatmentSystem
} from '@/types/water-resource';

interface WaterFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: string;
  editingItem: WaterItem | null;
}

export function WaterFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: WaterFormDialogProps) {
  const { hamlets } = useTenant();
  const isEdit = !!editingItem;

  // Generic fields
  const [villageCode, setVillageCode] = React.useState('noc-01');

  // 1. Groundwater Permit fields
  const [permitNumber, setPermitNumber] = React.useState('');
  const [ownerName, setOwnerName] = React.useState('');
  const [purpose, setPurpose] = React.useState('Sinh hoạt gia đình/tưới tiêu nhỏ');
  const [depth, setDepth] = React.useState('');
  const [capacity, setCapacity] = React.useState('');
  const [issueDate, setIssueDate] = React.useState('2026-06-01');
  const [expiryDate, setExpiryDate] = React.useState('2031-06-01');
  const [permitStatus, setPermitStatus] = React.useState<'active' | 'expired' | 'revoked'>('active');

  // 2. Water Usage fields (for Clean or Hygienic updates)
  const [isCleanUsage, setIsCleanUsage] = React.useState(true);
  const [totalHh, setTotalHh] = React.useState('');
  const [targetHh, setTargetHh] = React.useState('');
  const [usageYear, setUsageYear] = React.useState('2026');

  // 3. Water Facility fields
  const [facilityScale, setFacilityScale] = React.useState<'centralized' | 'small'>('centralized');

  // Centralized fields
  const [facName, setFacName] = React.useState('');
  const [facTypeCentral, setFacTypeCentral] = React.useState<'gravity' | 'pump' | 'drilledWell' | 'other'>('gravity');
  const [facCapacity, setFacCapacity] = React.useState('');
  const [servedHh, setServedHh] = React.useState('');
  const [mgmtUnit, setMgmtUnit] = React.useState('Ban quản lý Thôn');
  const [facStatus, setFacStatus] = React.useState<'active' | 'maintenance' | 'inactive'>('active');
  const [lastCheck, setLastCheck] = React.useState('2026-06-15');

  // Small fields
  const [hhHeadName, setHhHeadName] = React.useState('');
  const [facTypeSmall, setFacTypeSmall] = React.useState<'diggedWell' | 'drilledWell' | 'gravityTank' | 'rainwaterHarvest'>('diggedWell');
  const [isHygienic, setIsHygienic] = React.useState('true');
  const [smallStatus, setSmallStatus] = React.useState<'active' | 'inactive'>('active');

  // 4. Water Treatment System fields
  const [sysName, setSysName] = React.useState('');
  const [technology, setTechnology] = React.useState('');
  const [sysCapacity, setSysCapacity] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [sysStatus, setSysStatus] = React.useState<'active' | 'maintenance' | 'inactive'>('active');
  const [lastInspect, setLastInspect] = React.useState('2026-06-20');

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      if ('villageCode' in editingItem) {
        setVillageCode(editingItem.villageCode || 'noc-01');
      } else {
        setVillageCode('noc-01');
      }

      if (tabType === 'groundwater') {
        const item = editingItem as GroundwaterPermitRecord;
        setPermitNumber(item.permitNumber || '');
        setOwnerName(item.ownerName || '');
        setPurpose(item.purpose || 'Sinh hoạt gia đình/tưới tiêu nhỏ');
        setDepth(String(item.depthMeters || ''));
        setCapacity(String(item.capacityM3Day || ''));
        setIssueDate(item.issueDate || '2026-06-01');
        setExpiryDate(item.expiryDate || '2031-06-01');
        setPermitStatus(item.status || 'active');
      } else if (tabType === 'usage') {
        const cleanVal = 'cleanWaterHouseholds' in editingItem;
        setIsCleanUsage(cleanVal);
        const usageItem = editingItem as CleanWaterUsageRecord;
        setUsageYear(String(usageItem.year || '2026'));
        setTotalHh(String(usageItem.totalHouseholds || ''));
        if (cleanVal) {
          const item = editingItem as CleanWaterUsageRecord;
          setTargetHh(String(item.cleanWaterHouseholds || ''));
        } else {
          const item = editingItem as HygienicWaterUsageRecord;
          setTargetHh(String(item.hygienicWaterHouseholds || ''));
        }
      } else if (tabType === 'facilities') {
        const isCent = 'facilityName' in editingItem;
        if (isCent) {
          const item = editingItem as CentralizedWaterFacility;
          setFacilityScale('centralized');
          setFacName(item.facilityName || '');
          setFacTypeCentral(item.facilityType || 'gravity');
          setFacCapacity(String(item.capacityM3Day || ''));
          setServedHh(String(item.servedHouseholds || ''));
          setMgmtUnit(item.managementUnit || 'Ban quản lý Thôn');
          setFacStatus(item.status || 'active');
          setLastCheck(item.lastCheckedDate || '2026-06-15');
        } else {
          const item = editingItem as SmallWaterFacility;
          setFacilityScale('small');
          setHhHeadName(item.householdHeadName || '');
          setFacTypeSmall(item.facilityType || 'diggedWell');
          setIsHygienic(item.isHygienic ? 'true' : 'false');
          setSmallStatus(item.status || 'active');
        }
      } else if (tabType === 'treatment') {
        const item = editingItem as WaterTreatmentSystem;
        setSysName(item.systemName || '');
        setTechnology(item.technology || '');
        setSysCapacity(String(item.capacityM3Day || ''));
        setLocation(item.location || '');
        setSysStatus(item.status || 'active');
        setLastInspect(item.lastInspectionDate || '2026-06-20');
      }
    } else {
      // Reset values
      setVillageCode('noc-01');
      setPermitNumber('');
      setOwnerName('');
      setPurpose('Sinh hoạt gia đình/tưới tiêu nhỏ');
      setDepth('');
      setCapacity('');
      setIssueDate('2026-06-01');
      setExpiryDate('2031-06-01');
      setPermitStatus('active');
      setTotalHh('');
      setTargetHh('');
      setUsageYear('2026');
      setFacilityScale('centralized');
      setFacName('');
      setFacTypeCentral('gravity');
      setFacCapacity('');
      setServedHh('');
      setMgmtUnit('Ban quản lý Thôn');
      setFacStatus('active');
      setLastCheck('2026-06-15');
      setHhHeadName('');
      setFacTypeSmall('diggedWell');
      setIsHygienic('true');
      setSmallStatus('active');
      setSysName('');
      setTechnology('');
      setSysCapacity('');
      setLocation('');
      setSysStatus('active');
      setLastInspect('2026-06-20');
    }
  }, [editingItem, isOpen, tabType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success(`${isEdit ? 'Cập nhật' : 'Ghi nhận'} thông tin thành công!`, {
      description: `Đã lưu bản ghi tài nguyên nước vào hệ thống.`,
    });

    onOpenChange(false);
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Thêm mới';
    switch (tabType) {
      case 'groundwater': return `${prefix} Giấy phép nước dưới đất`;
      case 'usage': return `${prefix} Số liệu sử dụng nước`;
      case 'facilities': return `${prefix} Công trình cấp nước`;
      case 'treatment': return `${prefix} Hệ thống xử lý nước`;
      default: return `${prefix} bản ghi nước`;
    }
  };

  const renderFields = () => {
    switch (tabType) {
      case 'groundwater':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="permitNumber" className="text-xs">Số giấy phép <span className="text-destructive">*</span></Label>
                <Input id="permitNumber" value={permitNumber} onChange={(e) => setPermitNumber(e.target.value)} placeholder="GP-NĐĐ-..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ownerName" className="text-xs">Chủ hộ / Tổ chức <span className="text-destructive">*</span></Label>
                <Input id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Tên chủ giấy phép..." className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="villageCode" className="text-xs">Thôn địa bàn</Label>
                <Select value={villageCode} onValueChange={setVillageCode}>
                  <SelectTrigger id="villageCode" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    {hamlets.map(h => (
                      <SelectItem key={h.code} value={h.code} className="cursor-pointer">{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="purpose" className="text-xs">Mục đích sử dụng</Label>
                <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="depth" className="text-xs">Độ sâu giếng (m) <span className="text-destructive">*</span></Label>
                <Input id="depth" type="number" value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="50" className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="capacity" className="text-xs">Công suất khai thác (m³/ngày)</Label>
                <Input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="15" className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="issueDate" className="text-xs">Ngày cấp phép</Label>
                <Input id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="expiryDate" className="text-xs">Ngày hết hạn</Label>
                <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="permitStatus" className="text-xs">Trạng thái hiệu lực</Label>
              <Select value={permitStatus} onValueChange={(v) => setPermitStatus(v as 'active' | 'expired' | 'revoked')}>
                <SelectTrigger id="permitStatus" className="h-9 text-xs bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="active" className="cursor-pointer">Còn hiệu lực</SelectItem>
                  <SelectItem value="expired" className="cursor-pointer">Hết hiệu lực</SelectItem>
                  <SelectItem value="revoked" className="cursor-pointer">Đã thu hồi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'usage':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="villageCode" className="text-xs">Thôn địa bàn</Label>
                <Select value={villageCode} onValueChange={setVillageCode} disabled={isEdit}>
                  <SelectTrigger id="villageCode" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    {hamlets.map(h => (
                      <SelectItem key={h.code} value={h.code} className="cursor-pointer">{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="usageYear" className="text-xs">Năm thống kê</Label>
                <Input id="usageYear" type="number" value={usageYear} onChange={(e) => setUsageYear(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="totalHh" className="text-xs">Tổng số hộ dân trong thôn</Label>
                <Input id="totalHh" type="number" value={totalHh} onChange={(e) => setTotalHh(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="targetHh" className="text-xs">
                  {isCleanUsage ? 'Số hộ dùng nước sạch' : 'Số hộ dùng nước hợp vệ sinh'}
                </Label>
                <Input id="targetHh" type="number" value={targetHh} onChange={(e) => setTargetHh(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
          </>
        );
      case 'facilities':
        return (
          <>
            {!isEdit && (
              <div className="space-y-1">
                <Label className="text-xs">Quy mô công trình</Label>
                <Select value={facilityScale} onValueChange={(v) => setFacilityScale(v as 'centralized' | 'small')}>
                  <SelectTrigger className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="centralized" className="cursor-pointer">Công trình cấp nước tập trung</SelectItem>
                    <SelectItem value="small" className="cursor-pointer">Công trình hộ gia đình nhỏ lẻ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {facilityScale === 'centralized' ? (
              <>
                <div className="space-y-1">
                  <Label htmlFor="facName" className="text-xs">Tên công trình cấp nước <span className="text-destructive">*</span></Label>
                  <Input id="facName" value={facName} onChange={(e) => setFacName(e.target.value)} placeholder="Công trình tự chảy thôn..." className="h-9 text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="facTypeCentral" className="text-xs">Loại công trình</Label>
                    <Select value={facTypeCentral} onValueChange={(v) => setFacTypeCentral(v as 'gravity' | 'pump' | 'drilledWell' | 'other')}>
                      <SelectTrigger id="facTypeCentral" className="h-9 text-xs bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="gravity" className="cursor-pointer">Tự chảy tự nhiên</SelectItem>
                        <SelectItem value="pump" className="cursor-pointer">Trạm bơm điện</SelectItem>
                        <SelectItem value="drilledWell" className="cursor-pointer">Giếng khoan công nghiệp</SelectItem>
                        <SelectItem value="other" className="cursor-pointer">Loại hình khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="villageCode" className="text-xs">Thôn địa bàn</Label>
                    <Select value={villageCode} onValueChange={setVillageCode}>
                      <SelectTrigger id="villageCode" className="h-9 text-xs bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        {hamlets.map(h => (
                          <SelectItem key={h.code} value={h.code} className="cursor-pointer">{h.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="facCapacity" className="text-xs">Công suất thiết kế (m³/ngày)</Label>
                    <Input id="facCapacity" type="number" value={facCapacity} onChange={(e) => setFacCapacity(e.target.value)} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="servedHh" className="text-xs">Số hộ thụ hưởng</Label>
                    <Input id="servedHh" type="number" value={servedHh} onChange={(e) => setServedHh(e.target.value)} className="h-9 text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="mgmtUnit" className="text-xs">Đơn vị quản lý vận hành</Label>
                    <Input id="mgmtUnit" value={mgmtUnit} onChange={(e) => setMgmtUnit(e.target.value)} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastCheck" className="text-xs">Ngày kiểm định gần nhất</Label>
                    <Input id="lastCheck" type="date" value={lastCheck} onChange={(e) => setLastCheck(e.target.value)} className="h-9 text-xs" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="facStatus" className="text-xs">Tình trạng hoạt động</Label>
                  <Select value={facStatus} onValueChange={(v) => setFacStatus(v as 'active' | 'maintenance' | 'inactive')}>
                    <SelectTrigger id="facStatus" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="active" className="cursor-pointer">Hoạt động bình thường</SelectItem>
                      <SelectItem value="maintenance" className="cursor-pointer">Đang bảo trì/Sửa chữa</SelectItem>
                      <SelectItem value="inactive" className="cursor-pointer">Ngừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="hhHeadName" className="text-xs">Chủ hộ gia đình <span className="text-destructive">*</span></Label>
                    <Input id="hhHeadName" value={hhHeadName} onChange={(e) => setHhHeadName(e.target.value)} placeholder="Tên chủ hộ..." className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="villageCode" className="text-xs">Thôn địa bàn</Label>
                    <Select value={villageCode} onValueChange={setVillageCode}>
                      <SelectTrigger id="villageCode" className="h-9 text-xs bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        {hamlets.map(h => (
                          <SelectItem key={h.code} value={h.code} className="cursor-pointer">{h.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="facTypeSmall" className="text-xs">Loại nguồn nước hộ</Label>
                    <Select value={facTypeSmall} onValueChange={(v) => setFacTypeSmall(v as 'diggedWell' | 'drilledWell' | 'gravityTank' | 'rainwaterHarvest')}>
                      <SelectTrigger id="facTypeSmall" className="h-9 text-xs bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="diggedWell" className="cursor-pointer">Giếng đào</SelectItem>
                        <SelectItem value="drilledWell" className="cursor-pointer">Giếng khoan hộ</SelectItem>
                        <SelectItem value="gravityTank" className="cursor-pointer">Bể nước tự chảy hộ</SelectItem>
                        <SelectItem value="rainwaterHarvest" className="cursor-pointer">Bể thu trữ nước mưa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="isHygienic" className="text-xs">Đạt chuẩn vệ sinh</Label>
                    <Select value={isHygienic} onValueChange={setIsHygienic}>
                      <SelectTrigger id="isHygienic" className="h-9 text-xs bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="true" className="cursor-pointer">Đạt chuẩn (Hợp vệ sinh)</SelectItem>
                        <SelectItem value="false" className="cursor-pointer">Chưa đạt chuẩn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="smallStatus" className="text-xs">Tình trạng hoạt động</Label>
                  <Select value={smallStatus} onValueChange={(v) => setSmallStatus(v as 'active' | 'inactive')}>
                    <SelectTrigger id="smallStatus" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="active" className="cursor-pointer">Đang sử dụng</SelectItem>
                      <SelectItem value="inactive" className="cursor-pointer">Ngừng sử dụng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        );
      case 'treatment':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="sysName" className="text-xs">Tên hệ thống xử lý <span className="text-destructive">*</span></Label>
              <Input id="sysName" value={sysName} onChange={(e) => setSysName(e.target.value)} placeholder="Hệ thống lọc nước..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="technology" className="text-xs">Công nghệ lọc / xử lý <span className="text-destructive">*</span></Label>
              <Input id="technology" value={technology} onChange={(e) => setTechnology(e.target.value)} placeholder="Lọc RO công nghiệp, lọc cát áp lực..." className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sysCapacity" className="text-xs">Công suất (m³/ngày)</Label>
                <Input id="sysCapacity" type="number" value={sysCapacity} onChange={(e) => setSysCapacity(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastInspect" className="text-xs">Kiểm định gần nhất</Label>
                <Input id="lastInspect" type="date" value={lastInspect} onChange={(e) => setLastInspect(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="location" className="text-xs">Vị trí lắp đặt chi tiết <span className="text-destructive">*</span></Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Nhà văn hóa Thôn 3..." className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sysStatus" className="text-xs">Tình trạng hoạt động</Label>
              <Select value={sysStatus} onValueChange={(v) => setSysStatus(v as 'active' | 'maintenance' | 'inactive')}>
                <SelectTrigger id="sysStatus" className="h-9 text-xs bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="active" className="cursor-pointer">Đang vận hành tốt</SelectItem>
                  <SelectItem value="maintenance" className="cursor-pointer">Đang bảo trì kỹ thuật</SelectItem>
                  <SelectItem value="inactive" className="cursor-pointer">Tạm ngừng vận hành</SelectItem>
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
            Cập nhật các số liệu tài nguyên nước sạch và giám sát công trình cấp nước tại xã Lao Bảo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
            </DialogClose>
            <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu dữ liệu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
