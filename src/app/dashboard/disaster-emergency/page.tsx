// src/app/dashboard/disaster-emergency/page.tsx
'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Input,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  AlertOctagon,
  Flame,
  Droplets,
  Mountain,
  Users,
  Compass,
  FileText,
  Activity,
  ShieldAlert,
  HelpCircle,
  Play,
  RotateCcw,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  FileSpreadsheet,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { ActionMenu, PageHeader } from '@/components/common';
import { WorkflowStatusBadge } from '@/components/common/WorkflowStatusBadge';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { WorkflowStatus } from '@/types';
import { EmergencyWeatherTimeSeriesChart } from '../components/charts/emergency-weather-time-series-chart';

// ─── Types ────────────────────────────────────────────────────────────────────

type HazardLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type AlertStatus = 'Normal' | 'Warning' | 'Emergency';
type SafetyStatus = 'Safe' | 'CheckRequired' | 'Defective';

interface RiskPoint {
  id: string;
  riskPointName: string;
  type: 'Landslide' | 'Flood' | 'VulnerableArea';
  villageCode: string;
  hazardLevel: HazardLevel;
  alertStatus: AlertStatus;
  crackWidthMm: number;
  rainfall24hMm: number;
  soilMoisturePct: number;
  lastInspectedDate: string;
  workflowStatus: WorkflowStatus;
}

interface DisasterFacility {
  id: string;
  facilityName: string;
  facilityType: 'dyke' | 'reservoir' | 'evacuationShelter';
  capacity: string;
  villageCode: string;
  safetyStatus: SafetyStatus;
  workflowStatus: WorkflowStatus;
}

interface LocalResource {
  id: string;
  groupName: 'Militia' | 'Medical' | 'Logistics';
  personnelCount: number;
  equipmentDesc: string;
  foodStockTons: number;
  status: 'Ready' | 'Deployed' | 'Standby';
  workflowStatus: WorkflowStatus;
}

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const INITIAL_RISK_POINTS: RiskPoint[] = [
  { id: 'risk-1', riskPointName: 'Khu vực vách núi sạt lở ven đèo Ka Tăng', type: 'Landslide', villageCode: 'ka-tang', hazardLevel: 'High', alertStatus: 'Normal', crackWidthMm: 12, rainfall24hMm: 45, soilMoisturePct: 62, lastInspectedDate: '2026-07-12', workflowStatus: 'published' },
  { id: 'risk-2', riskPointName: 'Vùng trũng thấp có nguy cơ ngập lũ ven sông Sê Pôn thôn Tân Kim', type: 'Flood', villageCode: 'tan-kim', hazardLevel: 'Medium', alertStatus: 'Normal', crackWidthMm: 0, rainfall24hMm: 48, soilMoisturePct: 75, lastInspectedDate: '2026-07-13', workflowStatus: 'published' },
  { id: 'risk-3', riskPointName: 'Đường dân sinh ven sông sụt lún sạt trượt đất thôn Làng Vây', type: 'Landslide', villageCode: 'lang-vay', hazardLevel: 'High', alertStatus: 'Normal', crackWidthMm: 28, rainfall24hMm: 50, soilMoisturePct: 80, lastInspectedDate: '2026-07-14', workflowStatus: 'published' },
  { id: 'risk-4', riskPointName: 'Khu dân cư xung yếu thôn Ka Tăng gần bờ sông', type: 'VulnerableArea', villageCode: 'ka-tang', hazardLevel: 'Critical', alertStatus: 'Normal', crackWidthMm: 5, rainfall24hMm: 40, soilMoisturePct: 65, lastInspectedDate: '2026-07-10', workflowStatus: 'unit_approved' },
];

const INITIAL_FACILITIES: DisasterFacility[] = [
  { id: 'fac-1', facilityName: 'Kè bê tông chống sạt lở bờ sông Sê Pôn đoạn Ka Tăng', facilityType: 'dyke', capacity: 'Đê kè kiên cố dài 1.2km', villageCode: 'ka-tang', safetyStatus: 'Safe', workflowStatus: 'published' },
  { id: 'fac-2', facilityName: 'Hồ chứa nước điều tiết lũ Lao Bảo', facilityType: 'reservoir', capacity: 'Dung tích 2.5 triệu m3', villageCode: 'tan-kim', safetyStatus: 'CheckRequired', workflowStatus: 'published' },
  { id: 'fac-3', facilityName: 'Nhà văn hóa tránh lũ thôn Làng Vây', facilityType: 'evacuationShelter', capacity: 'Sức chứa tối đa 150 người', villageCode: 'lang-vay', safetyStatus: 'Safe', workflowStatus: 'published' },
  { id: 'fac-4', facilityName: 'Trường Tiểu học số 2 Lao Bảo (Điểm sơ tán khẩn cấp)', facilityType: 'evacuationShelter', capacity: 'Sức chứa tối đa 300 người', villageCode: 'vinh-dong', safetyStatus: 'Safe', workflowStatus: 'unit_approved' },
];

const INITIAL_RESOURCES: LocalResource[] = [
  { id: 'res-1', groupName: 'Militia', personnelCount: 35, equipmentDesc: '2 xuồng máy, 50 áo phao, dụng cụ cứu hộ', foodStockTons: 0, status: 'Ready', workflowStatus: 'published' },
  { id: 'res-2', groupName: 'Medical', personnelCount: 12, equipmentDesc: '2 cáng cứu thương, túi thuốc sơ cấp cứu khẩn cấp', foodStockTons: 0, status: 'Ready', workflowStatus: 'published' },
  { id: 'res-3', groupName: 'Logistics', personnelCount: 15, equipmentDesc: 'Xe vận tải nhỏ tiếp tế, dụng cụ dựng lán trại dã chiến', foodStockTons: 3.5, status: 'Ready', workflowStatus: 'published' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getVillageName = (code: string) => {
  const v = VILLAGES.find((vv) => vv.code === code);
  return v ? `Thôn ${v.name}` : code;
};

const HAZARD_LEVEL_COLORS: Record<HazardLevel, string> = {
  Low: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  High: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  Critical: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
};

const ALERT_STATUS_CONFIG: Record<AlertStatus, { label: string; className: string }> = {
  Normal: { label: 'Bình thường', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  Warning: { label: 'Cảnh báo', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20 animate-pulse' },
  Emergency: { label: 'KHẨN CẤP', className: 'bg-rose-600 text-white border-rose-600 font-bold animate-bounce' },
};

// ─── Component ────────────────────────────────────────────────────────────────

const MOCK_WEATHER_DATA = [
  { hour: '00:00', rainfallMm: 8.5 },
  { hour: '04:00', rainfallMm: 12.0 },
  { hour: '08:00', rainfallMm: 18.5 },
  { hour: '12:00', rainfallMm: 24.0 },
  { hour: '16:00', rainfallMm: 15.5 },
  { hour: '20:00', rainfallMm: 22.0 },
];

export default function DisasterEmergencyPage() {
  const { currentRole } = useTenant();
  const [activeTab, setActiveTab] = React.useState('risk-points');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Local state for simulator
  const [riskPoints, setRiskPoints] = React.useState<RiskPoint[]>(INITIAL_RISK_POINTS);
  const [facilities, setFacilities] = React.useState<DisasterFacility[]>(INITIAL_FACILITIES);
  const [resources, setResources] = React.useState<LocalResource[]>(INITIAL_RESOURCES);

  // Global emergency indicator (simulated state)
  const [emergencyActive, setEmergencyActive] = React.useState(false);
  const [emergencyType, setEmergencyType] = React.useState<'landslide' | 'flood' | null>(null);

  // Modal Detail states
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<any | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formRecord, setFormRecord] = React.useState<any>({});

  // ─── Emergency Simulator Operations ──────────────────────────────────────────

  const simulateLandslide = () => {
    setEmergencyActive(true);
    setEmergencyType('landslide');

    // Update Ka Tăng landslide risks to critical values
    setRiskPoints((prev) =>
      prev.map((r) => {
        if (r.id === 'risk-1') {
          return {
            ...r,
            alertStatus: 'Emergency',
            hazardLevel: 'Critical',
            crackWidthMm: 85, // threshold crack
            rainfall24hMm: 185, // above threshold heavy rain
            soilMoisturePct: 98,
          };
        }
        return r;
      })
    );

    // Deploy militia and logistics
    setResources((prev) =>
      prev.map((res) => {
        if (res.groupName === 'Militia' || res.groupName === 'Logistics') {
          return { ...res, status: 'Deployed' };
        }
        return res;
      })
    );

    toast.error('CẢNH BÁO SẠT LỞ KHẨN CẤP THÔN KA TĂNG!', {
      description: 'Lượng mưa vượt ngưỡng 180mm. Độ sụt lún sườn đồi đạt 85mm. Lực lượng cứu nạn đã được triển khai.',
      duration: 10000,
    });
  };

  const simulateHeavyRainFlooding = () => {
    setEmergencyActive(true);
    setEmergencyType('flood');

    // Update Tân Kim flood risks to critical values
    setRiskPoints((prev) =>
      prev.map((r) => {
        if (r.id === 'risk-2') {
          return {
            ...r,
            alertStatus: 'Emergency',
            hazardLevel: 'Critical',
            rainfall24hMm: 245, // extreme rain
            soilMoisturePct: 99,
          };
        }
        return r;
      })
    );

    // Deploy medical & militia
    setResources((prev) =>
      prev.map((res) => {
        if (res.groupName === 'Militia' || res.groupName === 'Medical') {
          return { ...res, status: 'Deployed' };
        }
        return res;
      })
    );

    toast.error('CẢNH BÁO LŨ LỤT, NGẬP SÂU THÔN TÂN KIM!', {
      description: 'Mực nước sông Sê Pôn dâng nhanh vượt báo động 3. Lượng mưa 24h qua là 245mm. Điểm sơ tán đang đón người dân.',
      duration: 10000,
    });
  };

  const resolveEmergency = () => {
    setEmergencyActive(false);
    setEmergencyType(null);

    // Restore to initial values
    setRiskPoints(INITIAL_RISK_POINTS);
    setResources(INITIAL_RESOURCES);

    toast.success('Đã khắc phục sự cố khẩn cấp thành công.', {
      description: 'Đưa hệ thống giám sát thiên tai về trạng thái đo lường bình thường.',
    });
  };

  // ─── CRUD Actions ─────────────────────────────────────────────────────────────

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'risk-points') {
      if (formRecord.id) {
        setRiskPoints((p) => p.map((r) => r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: 'draft' as WorkflowStatus } : r));
        toast.success('Cập nhật điểm nguy cơ thành công!');
      } else {
        setRiskPoints((p) => [{
          id: `risk-${Date.now()}`,
          riskPointName: formRecord.riskPointName || 'Điểm nguy cơ mới',
          type: formRecord.type || 'Landslide',
          villageCode: formRecord.villageCode || VILLAGES[0].code,
          hazardLevel: formRecord.hazardLevel || 'Medium',
          alertStatus: 'Normal',
          crackWidthMm: Number(formRecord.crackWidthMm) || 0,
          rainfall24hMm: Number(formRecord.rainfall24hMm) || 0,
          soilMoisturePct: Number(formRecord.soilMoisturePct) || 0,
          lastInspectedDate: new Date().toISOString().split('T')[0],
          workflowStatus: 'draft',
        }, ...p]);
        toast.success('Thêm mới điểm nguy cơ thiên tai thành công!');
      }
    } else if (activeTab === 'facilities') {
      if (formRecord.id) {
        setFacilities((p) => p.map((r) => r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: 'draft' as WorkflowStatus } : r));
        toast.success('Cập nhật công trình phòng chống thành công!');
      } else {
        setFacilities((p) => [{
          id: `fac-${Date.now()}`,
          facilityName: formRecord.facilityName || 'Công trình mới',
          facilityType: formRecord.facilityType || 'evacuationShelter',
          capacity: formRecord.capacity || '',
          villageCode: formRecord.villageCode || VILLAGES[0].code,
          safetyStatus: 'Safe',
          workflowStatus: 'draft',
        }, ...p]);
        toast.success('Thêm mới công trình thành công!');
      }
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, dataset: string, name: string) => {
    if (!confirm(`Xóa bản ghi: ${name}?`)) return;
    if (dataset === 'risk-points') setRiskPoints((p) => p.filter((r) => r.id !== id));
    else if (dataset === 'facilities') setFacilities((p) => p.filter((r) => r.id !== id));
    toast.info(`Đã gỡ bỏ bản ghi: ${name}`);
  };

  const handleWorkflow = (rec: any, dataset: string, next: WorkflowStatus) => {
    if (dataset === 'risk-points') setRiskPoints((p) => p.map((r) => r.id === rec.id ? { ...r, workflowStatus: next } : r));
    else if (dataset === 'facilities') setFacilities((p) => p.map((r) => r.id === rec.id ? { ...r, workflowStatus: next } : r));
    toast.success('Đã cập nhật trạng thái quy trình phê duyệt!');
    setIsDetailOpen(false);
  };

  const renderWorkflowButtons = (rec: any, dataset: string) => {
    const s = rec.workflowStatus as WorkflowStatus;
    return (
      <div className="flex flex-wrap gap-2 pt-2 justify-end border-t border-border/40">
        {s === 'draft' && (currentRole === 'admin' || currentRole === 'data_officer') && (
          <Button onClick={() => handleWorkflow(rec, dataset, 'submitted')} size="xs" className="h-8 text-xs cursor-pointer shadow-none">Trình phê duyệt</Button>
        )}
        {s === 'submitted' && currentRole === 'unit_leader' && (
          <>
            <Button onClick={() => handleWorkflow(rec, dataset, 'returned')} variant="destructive" size="xs" className="h-8 text-xs cursor-pointer shadow-none">Trả lại</Button>
            <Button onClick={() => handleWorkflow(rec, dataset, 'unit_approved')} size="xs" className="h-8 text-xs cursor-pointer shadow-none bg-emerald-600 hover:bg-emerald-700">Ký duyệt cấp phòng</Button>
          </>
        )}
        {['submitted', 'unit_approved'].includes(s) && (currentRole === 'data_governance' || currentRole === 'admin') && (
          <>
            <Button onClick={() => handleWorkflow(rec, dataset, 'returned')} variant="destructive" size="xs" className="h-8 text-xs cursor-pointer shadow-none">Trả lại</Button>
            <Button onClick={() => handleWorkflow(rec, dataset, 'published')} size="xs" className="h-8 text-xs cursor-pointer shadow-none">Công bố chính thức</Button>
          </>
        )}
      </div>
    );
  };

  // Filters
  const filteredRiskPoints = riskPoints.filter((r) => r.riskPointName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFacilities = facilities.filter((r) => r.facilityName.toLowerCase().includes(searchQuery.toLowerCase()));

  // ──────────────────── Render UI ────────────────────

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Emergency Global Flashing Status Banner */}
      {emergencyActive && (
        <Card className="border-rose-600 bg-rose-600 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <AlertOctagon className="size-8 shrink-0" />
            <div>
              <p className="font-extrabold text-sm uppercase tracking-wider">HỆ THỐNG ĐANG TRONG TRẠNG THÁI KHẨN CẤP</p>
              <p className="text-[10px] text-rose-100">
                {emergencyType === 'landslide'
                  ? 'Kích hoạt cảnh báo sạt lở đồi Ka Tăng. Nguy hiểm cực độ!'
                  : 'Phát hiện ngập lụt cục bộ ven sông thôn Tân Kim. Đang sơ tán dân cư.'}
              </p>
            </div>
          </div>
          <Button onClick={resolveEmergency} className="bg-white text-rose-700 hover:bg-rose-100 font-bold px-4 h-9 shadow-none text-xs shrink-0 cursor-pointer">
            <RotateCcw className="size-4" /> Khắc phục khẩn cấp
          </Button>
        </Card>
      )}

      {/* Header */}
      <PageHeader
        title={
          <>
            <AlertOctagon className="w-6 h-6 text-primary" />
            CSDL Phòng chống thiên tai &amp; Tìm kiếm cứu nạn
          </>
        }
        description="Chủ trì bởi Ban Chỉ huy Phòng thủ dân sự xã Lao Bảo. Giám sát các chỉ số sạt lở, ngập lụt theo thời gian thực."
        actions={
          <>
            <Button onClick={() => toast.success('Đang kết xuất báo cáo Phòng chống thiên tai xã Lao Bảo...')} variant="outline" size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border">
              <FileSpreadsheet className="size-4" />
              Xuất báo cáo cứu nạn
            </Button>
            {(currentRole === 'admin' || currentRole === 'data_officer') && (
              <Button
                onClick={() => {
                  setFormRecord(activeTab === 'facilities'
                    ? { facilityName: '', facilityType: 'evacuationShelter', capacity: '', villageCode: VILLAGES[0].code }
                    : { riskPointName: '', type: 'Landslide', villageCode: VILLAGES[0].code, hazardLevel: 'Medium', crackWidthMm: '', rainfall24hMm: '', soilMoisturePct: '' });
                  setIsFormOpen(true);
                }}
                size="sm"
                className="h-9 text-xs cursor-pointer gap-1.5 shadow-none"
              >
                <Plus className="size-4" />
                Thêm mới
              </Button>
            )}
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl shrink-0"><Mountain className="size-5" /></div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Điểm sạt lở theo dõi</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{riskPoints.filter(r => r.type === 'Landslide').length} điểm</h3>
          </div>
        </Card>
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0"><Droplets className="size-5" /></div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Điểm ngập lụt xung yếu</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{riskPoints.filter(r => r.type === 'Flood').length} vùng</h3>
          </div>
        </Card>
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0"><CheckCircle className="size-5" /></div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Công trình phòng thiên tai</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{facilities.length} công trình</h3>
          </div>
        </Card>
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0"><Users className="size-5" /></div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Lực lượng ứng phó tại chỗ</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">62 nhân sự</h3>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px">
        {[
          { id: 'risk-points', label: 'Điểm nguy cơ thiên tai' },
          { id: 'facilities', label: 'Công trình PCTT & Sơ tán' },
          { id: 'resources', label: 'Phương án & Vật tư &quot;4 tại chỗ&quot;' },
          { id: 'simulator', label: 'Giả lập tình huống khẩn cấp' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            dangerouslySetInnerHTML={{ __html: tab.label }}
          />
        ))}
      </div>

      {/* Search box (except for resources & simulator) */}
      {!['resources', 'simulator'].includes(activeTab) && (
        <Card className="border-border bg-card shadow-2xs">
          <CardContent className="flex items-center gap-2">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Tìm kiếm khu vực nguy cơ, đê kè, công trình tránh lũ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border text-xs h-9 shadow-none"
            />
          </CardContent>
        </Card>
      )}

      {/* ────────── TAB: Risk Points ────────── */}
      {activeTab === 'risk-points' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <EmergencyWeatherTimeSeriesChart
              data={MOCK_WEATHER_DATA}
              windSpeedKmh={45}
              warningLevel="CẤP II"
              bulletinCount={5}
              lastBulletinTime="10:30 14/07"
            />
          </div>
          <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Điểm cảnh báo nguy cơ</th>
                    <th className="py-3.5 px-4">Phân loại</th>
                    <th className="py-3.5 px-4">Thôn</th>
                    <th className="py-3.5 px-4 text-center">Độ nguy hiểm</th>
                    <th className="py-3.5 px-4 text-right">Lượng mưa (24h)</th>
                    <th className="py-3.5 px-4 text-right">Độ dịch chuyển đồi (mm)</th>
                    <th className="py-3.5 px-4 text-center">Trạng thái báo động</th>
                    <th className="py-3.5 px-4">Quy trình</th>
                    <th className="py-3.5 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {filteredRiskPoints.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                        {r.type === 'Landslide'
                          ? <Mountain className="size-3.5 text-amber-600 shrink-0" />
                          : r.type === 'Flood'
                            ? <Droplets className="size-3.5 text-blue-500 shrink-0" />
                            : <Compass className="size-3.5 text-slate-500 shrink-0" />
                        }
                        <span className="truncate max-w-[200px]">{r.riskPointName}</span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {r.type === 'Landslide' ? 'Sạt lở đồi núi' : r.type === 'Flood' ? 'Vùng ngập lụt' : 'Khu vực xung yếu'}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${HAZARD_LEVEL_COLORS[r.hazardLevel]}`}>
                          {r.hazardLevel === 'Critical' ? 'CỰC KỲ NGUY HIỂM' : r.hazardLevel === 'High' ? 'Cao' : r.hazardLevel === 'Medium' ? 'Vừa' : 'Thấp'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.rainfall24hMm} mm</td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.type === 'Landslide' ? `${r.crackWidthMm} mm` : '—'}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold border ${ALERT_STATUS_CONFIG[r.alertStatus].className}`}>
                          {ALERT_STATUS_CONFIG[r.alertStatus].label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                      <td className="py-3.5 px-4 text-center">
                        <ActionMenu
                          entityName="điểm nguy cơ"
                          onView={() => { setActiveRecord({ ...r, _dataset: 'risk-points' }); setIsDetailOpen(true); }}
                          onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => { setFormRecord({ ...r }); setIsFormOpen(true); } : undefined}
                          onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setRiskPoints((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}


      {/* ────────── TAB: Facilities ────────── */}
      {activeTab === 'facilities' && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Tên công trình PCTT / Sơ tán</th>
                  <th className="py-3.5 px-4">Thôn</th>
                  <th className="py-3.5 px-4">Loại hình</th>
                  <th className="py-3.5 px-4">Quy mô sức chứa / thông số</th>
                  <th className="py-3.5 px-4">Trạng thái an toàn</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredFacilities.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">{r.facilityName}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {r.facilityType === 'dyke' ? 'Kè sông/Đê bao' : r.facilityType === 'reservoir' ? 'Hồ chứa điều hòa' : 'Điểm sơ tán tránh bão lũ'}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">{r.capacity}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${r.safetyStatus === 'Safe' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        r.safetyStatus === 'CheckRequired' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-600 border-rose-500/20'
                        }`}>
                        {r.safetyStatus === 'Safe' ? 'An toàn' : r.safetyStatus === 'CheckRequired' ? 'Cần kiểm tra' : 'Hư hỏng / Lỗi'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                    <td className="py-3.5 px-4 text-center">
                      <ActionMenu
                        entityName="công trình PCTT"
                        onView={() => { setActiveRecord({ ...r, _dataset: 'facilities' }); setIsDetailOpen(true); }}
                        onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => { setFormRecord({ ...r }); setIsFormOpen(true); } : undefined}
                        onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setFacilities((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ────────── TAB: 4-On-Site Resources ────────── */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((r) => (
              <Card key={r.id} className="border-border bg-card">
                <CardHeader className="pb-3 px-4 pt-4 border-b border-border/40 flex flex-row justify-between items-center">
                  <div>
                    <h3 className="font-bold text-foreground">
                      {r.groupName === 'Militia' ? 'Lực lượng Chỉ huy & Cứu nạn' : r.groupName === 'Medical' ? 'Tổ Y tế cơ động' : 'Tổ Hậu cần dã chiến'}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">Phương án &quot;4 tại chỗ&quot; Lao Bảo</p>
                  </div>
                  <WorkflowStatusBadge status={r.workflowStatus} />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground font-semibold">Nhân sự huy động</span>
                    <span className="font-bold text-foreground">{r.personnelCount} cán bộ/chiến sĩ</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground font-semibold">Phương tiện &amp; Khí tài</span>
                    <span className="font-bold text-foreground truncate max-w-[180px] text-right">{r.equipmentDesc}</span>
                  </div>
                  {r.foodStockTons > 0 && (
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground font-semibold">Lương thực dữ trữ</span>
                      <span className="font-bold text-foreground">{r.foodStockTons} tấn gạo &amp; thực phẩm</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] pt-1.5 border-t border-border/30">
                    <span className="text-muted-foreground font-semibold">Trạng thái ứng phó</span>
                    <Badge variant="outline" className={`text-[9px] font-bold ${r.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      r.status === 'Deployed' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse' :
                        'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                      {r.status === 'Ready' ? 'Sẵn sàng ứng phó' : r.status === 'Deployed' ? 'ĐANG TRIỂN KHAI' : 'Trực chiến'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ────────── TAB: Emergency Simulator ────────── */}
      {activeTab === 'simulator' && (
        <Card className="border-border bg-card shadow-2xs">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Play className="size-5 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Giả lập các sự cố thiên tai khẩn cấp xã Lao Bảo</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-normal max-w-2xl">
              Chương trình giả lập các cảnh báo khẩn cấp (Sạt lở sườn núi do mưa lớn tại thôn Ka Tăng, Lũ lụt cục bộ dâng cao tại thôn Tân Kim).
              Khi kích hoạt, hệ thống đo lường rủi ro sẽ chuyển sang trạng thái cảnh báo khẩn cấp, cập nhật vượt ngưỡng chỉ số và huy động nguồn lực cứu hộ.
            </p>
            <Separator className="bg-border" />
            <div className="flex flex-wrap gap-3">
              <Button onClick={simulateLandslide} className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer h-9 text-xs font-semibold shadow-none">
                <Mountain className="size-4" /> Kích hoạt Sạt lở Ka Tăng
              </Button>
              <Button onClick={simulateHeavyRainFlooding} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-9 text-xs font-semibold shadow-none">
                <Droplets className="size-4" /> Kích hoạt Ngập lũ Tân Kim
              </Button>
              <Button onClick={resolveEmergency} variant="outline" className="border-border cursor-pointer h-9 text-xs font-semibold shadow-none">
                <RotateCcw className="size-4" /> Đưa về trạng thái an toàn
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Detail Dialog ─── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="size-4 text-primary" />
              Chi tiết Giám sát Thiên tai &amp; Cứu nạn
            </DialogTitle>
            <DialogDescription className="text-xs">Hồ sơ đo lường rủi ro và an toàn công trình xã Lao Bảo.</DialogDescription>
          </DialogHeader>

          {activeRecord && (
            <div className="space-y-3 py-2 text-xs">
              {activeRecord._dataset === 'risk-points' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên điểm cảnh báo nguy cơ</span>
                    <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.riskPointName}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Thôn</span>
                      <p className="font-bold text-foreground mt-0.5">{getVillageName(activeRecord.villageCode)}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Mức độ nguy hại</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.hazardLevel}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Lần kiểm tra cuối</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.lastInspectedDate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Lượng mưa (24h)</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.rainfall24hMm} mm</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Vết nứt (Đồi dốc)</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.crackWidthMm} mm</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Độ ẩm đất</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.soilMoisturePct}%</p>
                    </div>
                  </div>
                </>
              )}

              {activeRecord._dataset === 'facilities' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên công trình</span>
                    <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.facilityName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Quy mô / Dung lượng</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.capacity}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Trạng thái an toàn</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.safetyStatus}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator className="bg-border/60" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground">Trạng thái phê duyệt:</span>
                <WorkflowStatusBadge status={activeRecord.workflowStatus} />
              </div>
              {renderWorkflowButtons(activeRecord, activeRecord._dataset)}
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-border/40">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer shadow-none border-border">Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add/Edit Form Dialog ─── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id ? 'Cập nhật' : 'Thêm mới'} — {activeTab === 'facilities' ? 'Công trình phòng tránh' : 'Điểm nguy cơ'}
            </DialogTitle>
            <DialogDescription className="text-xs">Nhập dữ liệu giám sát phòng chống thiên tai.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            {activeTab === 'risk-points' && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên điểm cảnh báo nguy cơ</label>
                  <Input value={formRecord.riskPointName || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, riskPointName: e.target.value }))} className="bg-background border-border text-xs h-9 shadow-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Select
                      value={formRecord.type || 'Landslide'}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, type: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Loại rủi ro" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="Landslide" className="cursor-pointer">Sạt lở đồi núi</SelectItem>
                        <SelectItem value="Flood" className="cursor-pointer">Vùng ngập lụt</SelectItem>
                        <SelectItem value="VulnerableArea" className="cursor-pointer">Khu vực xung yếu khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Thôn</label>
                    <Select
                      value={formRecord.villageCode || VILLAGES[0].code}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, villageCode: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Chọn thôn" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        {VILLAGES.map((v) => (
                          <SelectItem key={v.code} value={v.code} className="cursor-pointer">
                            Thôn {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Mưa 24h (mm)</label>
                    <Input type="number" value={formRecord.rainfall24hMm || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, rainfall24hMm: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Độ mở vết nứt (mm)</label>
                    <Input type="number" value={formRecord.crackWidthMm || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, crackWidthMm: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Độ ẩm đất (%)</label>
                    <Input type="number" value={formRecord.soilMoisturePct || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, soilMoisturePct: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'facilities' && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên công trình PCTT</label>
                  <Input value={formRecord.facilityName || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, facilityName: e.target.value }))} className="bg-background border-border text-xs h-9 shadow-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Select
                      value={formRecord.facilityType || 'evacuationShelter'}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, facilityType: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Loại hình" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="dyke" className="cursor-pointer">Đê bao / Kè bảo vệ</SelectItem>
                        <SelectItem value="reservoir" className="cursor-pointer">Hồ chứa điều nước</SelectItem>
                        <SelectItem value="evacuationShelter" className="cursor-pointer">Nhà tránh lũ / Sơ tán</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Thôn</label>
                    <Select
                      value={formRecord.villageCode || VILLAGES[0].code}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, villageCode: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Chọn thôn" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        {VILLAGES.map((v) => (
                          <SelectItem key={v.code} value={v.code} className="cursor-pointer">
                            Thôn {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Quy mô sức chứa / Chiều dài đê kè</label>
                  <Input value={formRecord.capacity || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, capacity: e.target.value }))} className="bg-background border-border text-xs h-9 shadow-none" />
                </div>
              </>
            )}

            <DialogFooter className="pt-2 border-t border-border/40 gap-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs cursor-pointer shadow-none border-border">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="h-9 text-xs cursor-pointer shadow-none">Lưu lại</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
