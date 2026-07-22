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
  RoadRecord,
  TransportStructureRecord,
  TrafficDisruptionRecord,
  RoadMaintenancePlan,
  TrafficSafetyRecord,
  RoadCategory,
  RoadSurfaceType,
  InfrastructureCondition,
  TrafficIncidentType,
  MaintenanceProgress
} from '@/types/transportation';
import { MOCK_ROADS } from '@/data/mock-transportation';

interface TransportationFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: string; // 'roads' | 'structures' | 'disruptions' | 'maintenance' | 'safety'
  editingItem: RoadRecord | TransportStructureRecord | TrafficDisruptionRecord | RoadMaintenancePlan | TrafficSafetyRecord | null;
}

export function TransportationFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: TransportationFormDialogProps) {
  const { hamlets } = useTenant();
  const isEdit = !!editingItem;

  // Generic and common fields
  const [villageCode, setVillageCode] = React.useState('thon-01');
  const [condition, setCondition] = React.useState<InfrastructureCondition>('good');
  const [note, setNote] = React.useState('');

  // 1. Roads fields
  const [roadCode, setRoadCode] = React.useState('');
  const [roadName, setRoadName] = React.useState('');
  const [startPoint, setStartPoint] = React.useState('');
  const [endPoint, setEndPoint] = React.useState('');
  const [lengthKm, setLengthKm] = React.useState('');
  const [category, setCategory] = React.useState<RoadCategory>('villageRoad');
  const [surfaceType, setSurfaceType] = React.useState<RoadSurfaceType>('concrete');
  const [builtOrUpgradedYear, setBuiltOrUpgradedYear] = React.useState('2025');
  const [latestRepairYear, setLatestRepairYear] = React.useState('');

  // 2. Structures fields
  const [structCode, setStructCode] = React.useState('');
  const [structName, setStructName] = React.useState('');
  const [roadId, setRoadId] = React.useState('');
  const [kmPosition, setKmPosition] = React.useState('');
  const [structType, setStructType] = React.useState<'suspensionBridge' | 'concreteBridge' | 'culvert' | 'overflowSpillway' | 'other'>('suspensionBridge');
  const [loadCapacityTon, setLoadCapacityTon] = React.useState('');
  const [builtYear, setBuiltYear] = React.useState('2025');
  const [riskLevel, setRiskLevel] = React.useState<'low' | 'medium' | 'high'>('low');

  // 3. Disruptions fields
  const [disruptCode, setDisruptCode] = React.useState('');
  const [disruptRoadId, setDisruptRoadId] = React.useState('');
  const [disruptStructId, setDisruptStructId] = React.useState('');
  const [incidentType, setIncidentType] = React.useState<TrafficIncidentType>('landslide');
  const [severity, setSeverity] = React.useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [affectedArea, setAffectedArea] = React.useState('');
  const [occurredAt, setOccurredAt] = React.useState('2026-07-06T08:00');
  const [reopenedAt, setReopenedAt] = React.useState('');
  const [disruptStatus, setDisruptStatus] = React.useState<'open' | 'monitoring' | 'resolved'>('open');
  const [description, setDescription] = React.useState('');

  // 4. Maintenance fields
  const [planCode, setPlanCode] = React.useState('');
  const [targetType, setTargetType] = React.useState<'road' | 'structure'>('road');
  const [maintRoadId, setMaintRoadId] = React.useState('');
  const [maintStructId, setMaintStructId] = React.useState('');
  const [workItems, setWorkItems] = React.useState('');
  const [estimatedBudgetVnd, setEstimatedBudgetVnd] = React.useState('');
  const [fundingSource, setFundingSource] = React.useState<'communeBudget' | 'districtBudget' | 'newRuralProgram' | 'other'>('communeBudget');
  const [implementingUnit, setImplementingUnit] = React.useState('');
  const [progress, setProgress] = React.useState<MaintenanceProgress>('planned');
  const [plannedStartDate, setPlannedStartDate] = React.useState('2026-07-06');
  const [plannedCompletionDate, setPlannedCompletionDate] = React.useState('2026-10-06');

  // 5. Safety fields
  const [safetyCode, setSafetyCode] = React.useState('');
  const [month, setMonth] = React.useState('7');
  const [year, setYear] = React.useState('2026');
  const [totalIncidents, setTotalIncidents] = React.useState('');
  const [resolvedIncidents, setResolvedIncidents] = React.useState('');

  // Synchronize state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      type PartialRecord = Partial<RoadRecord & TransportStructureRecord & TrafficDisruptionRecord & RoadMaintenancePlan & TrafficSafetyRecord>;
      const item = editingItem as PartialRecord;
      setNote(item.note || '');
      setVillageCode(item.villageCode || item.villageCodes?.[0] || 'thon-01');
      setCondition(item.condition || 'good');

      if (tabType === 'roads') {
        const item = editingItem as RoadRecord;
        setRoadCode(item.code || '');
        setRoadName(item.name || '');
        setStartPoint(item.startPoint || '');
        setEndPoint(item.endPoint || '');
        setLengthKm(String(item.lengthKm || ''));
        setCategory(item.category || 'villageRoad');
        setSurfaceType(item.surfaceType || 'concrete');
        setBuiltOrUpgradedYear(String(item.builtOrUpgradedYear || '2025'));
        setLatestRepairYear(String(item.latestRepairYear || ''));
      } else if (tabType === 'structures') {
        const item = editingItem as TransportStructureRecord;
        setStructCode(item.code || '');
        setStructName(item.name || '');
        setRoadId(item.roadId || '');
        setKmPosition(item.kmPosition || '');
        setStructType(item.type || 'suspensionBridge');
        setLoadCapacityTon(String(item.loadCapacityTon || ''));
        setBuiltYear(String(item.builtYear || '2025'));
        setRiskLevel(item.riskLevel || 'low');
      } else if (tabType === 'disruptions') {
        const item = editingItem as TrafficDisruptionRecord;
        setDisruptCode(item.code || '');
        setDisruptRoadId(item.roadId || '');
        setDisruptStructId(item.structureId || '');
        setIncidentType(item.incidentType || 'landslide');
        setSeverity(item.severity || 'low');
        setAffectedArea(item.affectedArea || '');
        setOccurredAt(item.occurredAt ? item.occurredAt.slice(0, 16) : '2026-07-06T08:00');
        setReopenedAt(item.reopenedAt ? item.reopenedAt.slice(0, 16) : '');
        setDisruptStatus(item.status || 'open');
        setDescription(item.description || '');
      } else if (tabType === 'maintenance') {
        const item = editingItem as RoadMaintenancePlan;
        setPlanCode(item.code || '');
        setTargetType(item.targetType || 'road');
        setMaintRoadId(item.roadId || '');
        setMaintStructId(item.structureId || '');
        setWorkItems(item.workItems.join(', ') || '');
        setEstimatedBudgetVnd(String(item.estimatedBudgetVnd || ''));
        setFundingSource(item.fundingSource || 'communeBudget');
        setImplementingUnit(item.implementingUnit || '');
        setProgress(item.progress || 'planned');
        setPlannedStartDate(item.plannedStartDate || '2026-07-06');
        setPlannedCompletionDate(item.plannedCompletionDate || '2026-10-06');
      } else if (tabType === 'safety') {
        const item = editingItem as TrafficSafetyRecord;
        setSafetyCode(item.code || '');
        setMonth(String(item.month || '7'));
        setYear(String(item.year || '2026'));
        setTotalIncidents(String(item.totalIncidents || '0'));
        setResolvedIncidents(String(item.resolvedIncidents || '0'));
        setDescription(item.description || '');
      }
    } else {
      // Reset defaults
      setNote('');
      setVillageCode('thon-01');
      setCondition('good');

      setRoadCode('');
      setRoadName('');
      setStartPoint('');
      setEndPoint('');
      setLengthKm('');
      setCategory('villageRoad');
      setSurfaceType('concrete');
      setBuiltOrUpgradedYear('2025');
      setLatestRepairYear('');

      setStructCode('');
      setStructName('');
      setRoadId('');
      setKmPosition('');
      setStructType('suspensionBridge');
      setLoadCapacityTon('');
      setBuiltYear('2025');
      setRiskLevel('low');

      setDisruptCode('');
      setDisruptRoadId('');
      setDisruptStructId('');
      setIncidentType('landslide');
      setSeverity('low');
      setAffectedArea('');
      setOccurredAt('2026-07-06T08:00');
      setReopenedAt('');
      setDisruptStatus('open');
      setDescription('');

      setPlanCode('');
      setTargetType('road');
      setMaintRoadId('');
      setMaintStructId('');
      setWorkItems('');
      setEstimatedBudgetVnd('');
      setFundingSource('communeBudget');
      setImplementingUnit('');
      setProgress('planned');
      setPlannedStartDate('2026-07-06');
      setPlannedCompletionDate('2026-10-06');

      setSafetyCode('');
      setMonth('7');
      setYear('2026');
      setTotalIncidents('');
      setResolvedIncidents('');
    }
  }, [editingItem, isOpen, tabType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success(`${isEdit ? 'Cập nhật' : 'Thêm mới'} thông tin thành công!`, {
      description: `Đã lưu hồ sơ quản lý giao thông vào hệ thống.`,
    });

    onOpenChange(false);
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Thêm mới / Ghi nhận';
    switch (tabType) {
      case 'roads': return `${prefix} Tuyến đường giao thông`;
      case 'structures': return `${prefix} Cầu, cống, ngầm tràn`;
      case 'disruptions': return `${prefix} Sự cố chia cắt giao thông`;
      case 'maintenance': return `${prefix} Kế hoạch duy tu, sửa chữa`;
      case 'safety': return `${prefix} Số liệu trật tự an toàn giao thông`;
      default: return `${prefix} hồ sơ`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-foreground">{getTitle()}</DialogTitle>
          <DialogDescription className="text-xs">
            Quản lý và cập nhật thông tin mạng lưới cầu đường, sự cố ách tắc, và dự án cải tạo giao thông.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. ROADS FORM FIELDS */}
          {tabType === 'roads' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="roadCode" className="text-xs">Mã tuyến đường <span className="text-destructive">*</span></Label>
                  <Input id="roadCode" value={roadCode} onChange={(e) => setRoadCode(e.target.value)} placeholder="RD-025" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="roadName" className="text-xs">Tên tuyến đường <span className="text-destructive">*</span></Label>
                  <Input id="roadName" value={roadName} onChange={(e) => setRoadName(e.target.value)} placeholder="Tuyến Nóc ông..." className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="startPoint" className="text-xs">Điểm đầu <span className="text-destructive">*</span></Label>
                  <Input id="startPoint" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} placeholder="Ngã ba thôn..." className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endPoint" className="text-xs">Điểm cuối <span className="text-destructive">*</span></Label>
                  <Input id="endPoint" value={endPoint} onChange={(e) => setEndPoint(e.target.value)} placeholder="Khu sản xuất..." className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="villageCode" className="text-xs">Thôn đi qua</Label>
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
                  <Label htmlFor="lengthKm" className="text-xs">Chiều dài (km) <span className="text-destructive">*</span></Label>
                  <Input id="lengthKm" type="number" step="0.1" value={lengthKm} onChange={(e) => setLengthKm(e.target.value)} placeholder="2.5" className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="category" className="text-xs">Phân loại đường</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as RoadCategory)}>
                    <SelectTrigger id="category" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="communeRoad" className="cursor-pointer">Đường xã</SelectItem>
                      <SelectItem value="villageRoad" className="cursor-pointer">Đường thôn</SelectItem>
                      <SelectItem value="productionRoad" className="cursor-pointer">Đường sản xuất</SelectItem>
                      <SelectItem value="fieldRoad" className="cursor-pointer">Đường nội đồng</SelectItem>
                      <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="surfaceType" className="text-xs">Loại mặt đường</Label>
                  <Select value={surfaceType} onValueChange={(v) => setSurfaceType(v as RoadSurfaceType)}>
                    <SelectTrigger id="surfaceType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="concrete" className="cursor-pointer">Bê tông</SelectItem>
                      <SelectItem value="asphalt" className="cursor-pointer">Nhựa</SelectItem>
                      <SelectItem value="gravel" className="cursor-pointer">Cấp phối / Đá dăm</SelectItem>
                      <SelectItem value="soil" className="cursor-pointer">Đường đất</SelectItem>
                      <SelectItem value="mixed" className="cursor-pointer">Hỗn hợp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="builtOrUpgradedYear" className="text-xs">Năm hoàn thành / Nâng cấp</Label>
                  <Input id="builtOrUpgradedYear" type="number" value={builtOrUpgradedYear} onChange={(e) => setBuiltOrUpgradedYear(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="latestRepairYear" className="text-xs">Năm sửa chữa gần nhất</Label>
                  <Input id="latestRepairYear" type="number" value={latestRepairYear} onChange={(e) => setLatestRepairYear(e.target.value)} className="h-9 text-xs" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="roadCondition" className="text-xs">Tình trạng mặt đường</Label>
                <Select value={condition} onValueChange={(v) => setCondition(v as InfrastructureCondition)}>
                  <SelectTrigger id="roadCondition" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="good" className="cursor-pointer">Tốt</SelectItem>
                    <SelectItem value="fair" className="cursor-pointer">Khá / Bình thường</SelectItem>
                    <SelectItem value="degraded" className="cursor-pointer">Lầy lội / Xuống cấp</SelectItem>
                    <SelectItem value="dangerous" className="cursor-pointer">Nguy hiểm / Cần sửa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* 2. STRUCTURES FORM FIELDS */}
          {tabType === 'structures' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="structCode" className="text-xs">Mã công trình <span className="text-destructive">*</span></Label>
                  <Input id="structCode" value={structCode} onChange={(e) => setStructCode(e.target.value)} placeholder="ST-033" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="structName" className="text-xs">Tên công trình <span className="text-destructive">*</span></Label>
                  <Input id="structName" value={structName} onChange={(e) => setStructName(e.target.value)} placeholder="Cầu treo Thôn..." className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="roadId" className="text-xs">Tuyến đường liên kết</Label>
                  <Select value={roadId} onValueChange={setRoadId}>
                    <SelectTrigger id="roadId" className="h-9 text-xs bg-card">
                      <SelectValue placeholder="Chọn tuyến đường..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs max-h-[160px]">
                      {MOCK_ROADS.map(r => (
                        <SelectItem key={r.id} value={r.id} className="cursor-pointer">{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="kmPosition" className="text-xs">Vị trí (Ví dụ: Km 1.5)</Label>
                  <Input id="kmPosition" value={kmPosition} onChange={(e) => setKmPosition(e.target.value)} placeholder="Km 2.1" className="h-9 text-xs" />
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
                  <Label htmlFor="structType" className="text-xs">Loại cầu / cống</Label>
                  <Select value={structType} onValueChange={(v) => setStructType(v as 'suspensionBridge' | 'concreteBridge' | 'culvert' | 'overflowSpillway' | 'other')}>
                    <SelectTrigger id="structType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="suspensionBridge" className="cursor-pointer">Cầu treo dân sinh</SelectItem>
                      <SelectItem value="concreteBridge" className="cursor-pointer">Cầu bản bê tông</SelectItem>
                      <SelectItem value="culvert" className="cursor-pointer">Cống thoát nước</SelectItem>
                      <SelectItem value="overflowSpillway" className="cursor-pointer">Ngầm tràn giao thông</SelectItem>
                      <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="loadCapacityTon" className="text-xs">Tải trọng thiết kế (tấn)</Label>
                  <Input id="loadCapacityTon" type="number" value={loadCapacityTon} onChange={(e) => setLoadCapacityTon(e.target.value)} placeholder="5" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="builtYear" className="text-xs">Năm xây dựng</Label>
                  <Input id="builtYear" type="number" value={builtYear} onChange={(e) => setBuiltYear(e.target.value)} className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="structCondition" className="text-xs">Tình trạng kết cấu</Label>
                  <Select value={condition} onValueChange={(v) => setCondition(v as InfrastructureCondition)}>
                    <SelectTrigger id="structCondition" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="good" className="cursor-pointer">Tốt / Ổn định</SelectItem>
                      <SelectItem value="fair" className="cursor-pointer">Trung bình</SelectItem>
                      <SelectItem value="degraded" className="cursor-pointer">Xuống cấp / Khuyên yếu</SelectItem>
                      <SelectItem value="dangerous" className="cursor-pointer">Nguy hiểm cực kỳ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="riskLevel" className="text-xs">Mức độ rủi ro thiên tai</Label>
                  <Select value={riskLevel} onValueChange={(v) => setRiskLevel(v as 'low' | 'medium' | 'high')}>
                    <SelectTrigger id="riskLevel" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="low" className="cursor-pointer">Thấp</SelectItem>
                      <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                      <SelectItem value="high" className="cursor-pointer">Cao nguy hiểm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* 3. DISRUPTIONS FORM FIELDS */}
          {tabType === 'disruptions' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="disruptCode" className="text-xs">Mã sự cố <span className="text-destructive">*</span></Label>
                  <Input id="disruptCode" value={disruptCode} onChange={(e) => setDisruptCode(e.target.value)} placeholder="TD-037" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="incidentType" className="text-xs">Loại sự cố</Label>
                  <Select value={incidentType} onValueChange={(v) => setIncidentType(v as TrafficIncidentType)}>
                    <SelectTrigger id="incidentType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="landslide" className="cursor-pointer">Sạt lở đất</SelectItem>
                      <SelectItem value="flooding" className="cursor-pointer">Ngập lụt tràn nước</SelectItem>
                      <SelectItem value="erosion" className="cursor-pointer">Xói mòn lún đường</SelectItem>
                      <SelectItem value="bridgeDamage" className="cursor-pointer">Hư hại kết cấu cầu</SelectItem>
                      <SelectItem value="roadDamage" className="cursor-pointer">Hỏng nền mặt đường</SelectItem>
                      <SelectItem value="other" className="cursor-pointer">Nguyên nhân khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="disruptRoadId" className="text-xs">Tuyến đường sạt lở</Label>
                  <Select value={disruptRoadId} onValueChange={setDisruptRoadId}>
                    <SelectTrigger id="disruptRoadId" className="h-9 text-xs bg-card">
                      <SelectValue placeholder="Chọn tuyến đường..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs max-h-[160px]">
                      {MOCK_ROADS.map(r => (
                        <SelectItem key={r.id} value={r.id} className="cursor-pointer">{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="villageCode" className="text-xs">Thôn xảy ra sự cố</Label>
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

              {disruptStructId && (
                <div className="text-[10px] text-muted-foreground font-semibold px-1">
                  Công trình cầu/cống liên kết: <span className="font-mono text-slate-600 bg-muted px-1.5 py-0.5 rounded">{disruptStructId}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="severity" className="text-xs">Mức độ nghiêm trọng</Label>
                  <Select value={severity} onValueChange={(v) => setSeverity(v as 'low' | 'medium' | 'high' | 'critical')}>
                    <SelectTrigger id="severity" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="low" className="cursor-pointer">Thấp</SelectItem>
                      <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                      <SelectItem value="high" className="cursor-pointer">Cao (Tắc cục bộ)</SelectItem>
                      <SelectItem value="critical" className="cursor-pointer">Nghiêm trọng (Cô lập)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="disruptStatus" className="text-xs">Trạng thái thông xe</Label>
                  <Select value={disruptStatus} onValueChange={(v) => setDisruptStatus(v as 'open' | 'monitoring' | 'resolved')}>
                    <SelectTrigger id="disruptStatus" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="open" className="cursor-pointer">Đang chia cắt</SelectItem>
                      <SelectItem value="monitoring" className="cursor-pointer">Đang khắc phục / Theo dõi</SelectItem>
                      <SelectItem value="resolved" className="cursor-pointer">Đã thông tuyến</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="affectedArea" className="text-xs">Điểm cụ thể bị ách tắc <span className="text-destructive">*</span></Label>
                <Input id="affectedArea" value={affectedArea} onChange={(e) => setAffectedArea(e.target.value)} placeholder="Ví dụ: Km 3+500 sườn đồi phía Tây" className="h-9 text-xs" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="occurredAt" className="text-xs">Thời gian xảy ra</Label>
                  <Input id="occurredAt" type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reopenedAt" className="text-xs">Thời gian thông xe dự kiến/thực tế</Label>
                  <Input id="reopenedAt" type="datetime-local" value={reopenedAt} onChange={(e) => setReopenedAt(e.target.value)} className="h-9 text-xs" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs">Mô tả chi tiết khối lượng thiệt hại</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Khối lượng sạt lở khoảng 150m3 đất đá..." className="h-9 text-xs" />
              </div>
            </>
          )}

          {/* 4. MAINTENANCE PLANS FORM FIELDS */}
          {tabType === 'maintenance' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="planCode" className="text-xs">Mã dự án/kế hoạch <span className="text-destructive">*</span></Label>
                  <Input id="planCode" value={planCode} onChange={(e) => setPlanCode(e.target.value)} placeholder="MP-025" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="targetType" className="text-xs">Đối tượng duy tu</Label>
                  <Select value={targetType} onValueChange={(v) => setTargetType(v as 'road' | 'structure')}>
                    <SelectTrigger id="targetType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="road" className="cursor-pointer">Tuyến đường</SelectItem>
                      <SelectItem value="structure" className="cursor-pointer">Cầu / Cống / Tràn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="maintRoadId" className="text-xs">Chọn tuyến đường bảo trì</Label>
                  <Select value={maintRoadId} onValueChange={setMaintRoadId}>
                    <SelectTrigger id="maintRoadId" className="h-9 text-xs bg-card">
                      <SelectValue placeholder="Chọn tuyến đường..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs max-h-[160px]">
                      {MOCK_ROADS.map(r => (
                        <SelectItem key={r.id} value={r.id} className="cursor-pointer">{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="villageCode" className="text-xs">Thôn thụ hưởng dự án</Label>
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

              {maintStructId && (
                <div className="text-[10px] text-muted-foreground font-semibold px-1">
                  Công trình cầu/cống liên kết: <span className="font-mono text-slate-600 bg-muted px-1.5 py-0.5 rounded">{maintStructId}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="estimatedBudgetVnd" className="text-xs">Kinh phí ước tính (VNĐ) <span className="text-destructive">*</span></Label>
                  <Input id="estimatedBudgetVnd" type="number" value={estimatedBudgetVnd} onChange={(e) => setEstimatedBudgetVnd(e.target.value)} placeholder="150000000" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fundingSource" className="text-xs">Nguồn vốn cấp phát</Label>
                  <Select value={fundingSource} onValueChange={(v) => setFundingSource(v as 'communeBudget' | 'districtBudget' | 'newRuralProgram' | 'other')}>
                    <SelectTrigger id="fundingSource" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="communeBudget" className="cursor-pointer">Ngân sách xã</SelectItem>
                      <SelectItem value="districtBudget" className="cursor-pointer">Ngân sách huyện</SelectItem>
                      <SelectItem value="newRuralProgram" className="cursor-pointer">Nông thôn mới</SelectItem>
                      <SelectItem value="other" className="cursor-pointer">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="implementingUnit" className="text-xs">Đơn vị thi công <span className="text-destructive">*</span></Label>
                  <Input id="implementingUnit" value={implementingUnit} onChange={(e) => setImplementingUnit(e.target.value)} placeholder="Công ty Xây dựng..." className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="progress" className="text-xs">Tiến độ thi công</Label>
                  <Select value={progress} onValueChange={(v) => setProgress(v as MaintenanceProgress)}>
                    <SelectTrigger id="progress" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="planned" className="cursor-pointer">Đã lập kế hoạch</SelectItem>
                      <SelectItem value="approved" className="cursor-pointer">Đã duyệt dự án</SelectItem>
                      <SelectItem value="inProgress" className="cursor-pointer">Đang thi công</SelectItem>
                      <SelectItem value="completed" className="cursor-pointer">Đã nghiệm thu bàn giao</SelectItem>
                      <SelectItem value="delayed" className="cursor-pointer">Chậm tiến độ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="plannedStartDate" className="text-xs">Ngày khởi công dự kiến</Label>
                  <Input id="plannedStartDate" type="date" value={plannedStartDate} onChange={(e) => setPlannedStartDate(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="plannedCompletionDate" className="text-xs">Ngày hoàn thành dự kiến</Label>
                  <Input id="plannedCompletionDate" type="date" value={plannedCompletionDate} onChange={(e) => setPlannedCompletionDate(e.target.value)} className="h-9 text-xs" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="workItems" className="text-xs">Hạng mục công việc (cách nhau bằng dấu phẩy) <span className="text-destructive">*</span></Label>
                <Input id="workItems" value={workItems} onChange={(e) => setWorkItems(e.target.value)} placeholder="Đổ bê tông mặt đường, Gia cố taluy, Đặt cống tròn..." className="h-9 text-xs" required />
              </div>
            </>
          )}

          {/* 5. SAFETY FORM FIELDS */}
          {tabType === 'safety' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="month" className="text-xs">Tháng thống kê <span className="text-destructive">*</span></Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger id="month" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs max-h-[150px]">
                      {Array.from({ length: 12 }, (_, idx) => (
                        <SelectItem key={idx + 1} value={String(idx + 1)} className="cursor-pointer">Tháng {idx + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="year" className="text-xs">Năm</Label>
                  <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="villageCode" className="text-xs">Địa bàn</Label>
                  <Select value={villageCode} onValueChange={setVillageCode}>
                    <SelectTrigger id="villageCode" className="h-9 text-xs bg-card">
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
              </div>

              {safetyCode && (
                <div className="text-[10px] text-muted-foreground font-semibold px-1">
                  Mã thống kê: <span className="font-mono text-slate-600 bg-muted px-1.5 py-0.5 rounded">{safetyCode}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="totalIncidents" className="text-xs">Số vụ phát sinh <span className="text-destructive">*</span></Label>
                  <Input id="totalIncidents" type="number" value={totalIncidents} onChange={(e) => setTotalIncidents(e.target.value)} placeholder="0" className="h-9 text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="resolvedIncidents" className="text-xs">Đã xử lý xong <span className="text-destructive">*</span></Label>
                  <Input id="resolvedIncidents" type="number" value={resolvedIncidents} onChange={(e) => setResolvedIncidents(e.target.value)} placeholder="0" className="h-9 text-xs" required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs">Mô tả vụ việc an ninh chính trị / trật tự ATGT</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="1 vụ va chạm nhỏ tại Thôn 3 đã tự hòa giải ổn định..." className="h-9 text-xs" />
              </div>
            </>
          )}

          <div className="space-y-1 pt-1">
            <Label htmlFor="note" className="text-xs">Ghi chú / Nhận xét bổ sung</Label>
            <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú (nếu có)..." className="h-9 text-xs" />
          </div>

          <DialogFooter className="pt-2 border-t border-border/40">
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
