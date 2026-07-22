// src/app/dashboard/administrative-population/page.tsx

'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { checkPermission } from '@/lib/permissions';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
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
  Users,
  Map,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Radio,
  UserCheck,
  Shield,
  Smartphone,
  Globe2,
  CreditCard,
  UserX,
} from 'lucide-react';
import { toast } from 'sonner';
import { ActionMenu, PageHeader } from '@/components/common';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { WorkflowStatus, SecurityLevel } from '@/types';
import { WorkflowStatusBadge } from '@/components/common/WorkflowStatusBadge';
import { SecurityLevelBadge } from '@/components/common/SecurityLevelBadge';

interface AdminPopRecord {
  id: string;
  villageCode: string;
  villageName: string;
  areaHa: number;
  population: number;
  householdCount: number;
  ethnicities: {
    kinh: number;
    vanKieu: number;
    paCo: number;
    other: number;
  };
  workingAge: number;
  employed: number;
  healthInsuranceRate: number;
  smartphoneRate: number;
  internetRate: number;
  onlinePaymentRate: number;
  workflowStatus: WorkflowStatus;
  securityLevel: SecurityLevel;
}

const INITIAL_RECORDS: AdminPopRecord[] = [
  {
    id: 'ap-1',
    villageCode: 'trieu-phuoc',
    villageName: 'Triệu Phước',
    areaHa: 800,
    population: 2000,
    householdCount: 470,
    ethnicities: { kinh: 1800, vanKieu: 150, paCo: 30, other: 20 },
    workingAge: 1200,
    employed: 1100,
    healthInsuranceRate: 94.2,
    smartphoneRate: 88.5,
    internetRate: 85.0,
    onlinePaymentRate: 64.2,
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'ap-2',
    villageCode: 'tan-kim',
    villageName: 'Tân Kim',
    areaHa: 700,
    population: 1800,
    householdCount: 420,
    ethnicities: { kinh: 1600, vanKieu: 120, paCo: 50, other: 30 },
    workingAge: 1050,
    employed: 950,
    healthInsuranceRate: 92.5,
    smartphoneRate: 84.0,
    internetRate: 80.5,
    onlinePaymentRate: 58.0,
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'ap-3',
    villageCode: 'tan-phuoc',
    villageName: 'Tân Phước',
    areaHa: 750,
    population: 1900,
    householdCount: 440,
    ethnicities: { kinh: 1700, vanKieu: 130, paCo: 40, other: 30 },
    workingAge: 1100,
    employed: 1020,
    healthInsuranceRate: 95.0,
    smartphoneRate: 90.0,
    internetRate: 87.5,
    onlinePaymentRate: 68.5,
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'ap-4',
    villageCode: 'ka-tang',
    villageName: 'Ka Tăng',
    areaHa: 900,
    population: 2500,
    householdCount: 580,
    ethnicities: { kinh: 200, vanKieu: 2100, paCo: 150, other: 50 },
    workingAge: 1400,
    employed: 1200,
    healthInsuranceRate: 89.4,
    smartphoneRate: 72.5,
    internetRate: 68.0,
    onlinePaymentRate: 46.5,
    workflowStatus: 'submitted',
    securityLevel: 'shared',
  },
  {
    id: 'ap-5',
    villageCode: 'tan-thanh',
    villageName: 'Tân Thành',
    areaHa: 850,
    population: 2400,
    householdCount: 560,
    ethnicities: { kinh: 2200, vanKieu: 120, paCo: 50, other: 30 },
    workingAge: 1450,
    employed: 1380,
    healthInsuranceRate: 96.5,
    smartphoneRate: 92.0,
    internetRate: 89.0,
    onlinePaymentRate: 74.0,
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'ap-6',
    villageCode: 'trieu-thanh',
    villageName: 'Triệu Thành',
    areaHa: 600,
    population: 1600,
    householdCount: 380,
    ethnicities: { kinh: 1450, vanKieu: 100, paCo: 30, other: 20 },
    workingAge: 950,
    employed: 880,
    healthInsuranceRate: 93.8,
    smartphoneRate: 85.5,
    internetRate: 82.0,
    onlinePaymentRate: 60.5,
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'ap-7',
    villageCode: 'tan-long',
    villageName: 'Tân Long',
    areaHa: 650,
    population: 1750,
    householdCount: 410,
    ethnicities: { kinh: 1500, vanKieu: 180, paCo: 50, other: 20 },
    workingAge: 1020,
    employed: 960,
    healthInsuranceRate: 94.0,
    smartphoneRate: 87.0,
    internetRate: 84.0,
    onlinePaymentRate: 63.0,
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'ap-8',
    villageCode: 'trieu-long',
    villageName: 'Triệu Long',
    areaHa: 500,
    population: 1500,
    householdCount: 350,
    ethnicities: { kinh: 1300, vanKieu: 140, paCo: 40, other: 20 },
    workingAge: 900,
    employed: 820,
    healthInsuranceRate: 91.2,
    smartphoneRate: 81.5,
    internetRate: 78.0,
    onlinePaymentRate: 54.0,
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'ap-9',
    villageCode: 'lang-vay',
    villageName: 'Làng Vây',
    areaHa: 950,
    population: 2200,
    householdCount: 520,
    ethnicities: { kinh: 300, vanKieu: 1700, paCo: 150, other: 50 },
    workingAge: 1300,
    employed: 1100,
    healthInsuranceRate: 90.0,
    smartphoneRate: 75.0,
    internetRate: 71.5,
    onlinePaymentRate: 48.0,
    workflowStatus: 'draft',
    securityLevel: 'public',
  },
  {
    id: 'ap-10',
    villageCode: 'vinh-dong',
    villageName: 'Vĩnh Đông',
    areaHa: 550,
    population: 1650,
    householdCount: 390,
    ethnicities: { kinh: 1400, vanKieu: 180, paCo: 40, other: 30 },
    workingAge: 980,
    employed: 900,
    healthInsuranceRate: 93.0,
    smartphoneRate: 83.5,
    internetRate: 81.0,
    onlinePaymentRate: 59.0,
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'ap-11',
    villageCode: 'trung-chin',
    villageName: 'Trung Chín',
    areaHa: 520,
    population: 1835,
    householdCount: 430,
    ethnicities: { kinh: 400, vanKieu: 1200, paCo: 200, other: 35 },
    workingAge: 1100,
    employed: 950,
    healthInsuranceRate: 91.5,
    smartphoneRate: 78.0,
    internetRate: 75.0,
    onlinePaymentRate: 51.5,
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'ap-12',
    villageCode: 'tay-chin',
    villageName: 'Tây Chín',
    areaHa: 533,
    population: 2000,
    householdCount: 495,
    ethnicities: { kinh: 500, vanKieu: 1300, paCo: 170, other: 30 },
    workingAge: 1200,
    employed: 1050,
    healthInsuranceRate: 92.0,
    smartphoneRate: 80.0,
    internetRate: 77.0,
    onlinePaymentRate: 53.0,
    workflowStatus: 'published',
    securityLevel: 'public',
  }
];

interface DemographicShift {
  id: string;
  villageName: string;
  period: string;
  births: number;
  deaths: number;
  immigration: number;
  emigration: number;
  source: string;
}

const MOCK_SHIFTS: DemographicShift[] = [
  { id: 's-1', villageName: 'Ka Tăng', period: 'Quý 1/2026', births: 12, deaths: 4, immigration: 5, emigration: 3, source: 'Công an xã Lao Bảo' },
  { id: 's-2', villageName: 'Tân Thành', period: 'Quý 1/2026', births: 15, deaths: 6, immigration: 8, emigration: 4, source: 'Văn phòng Một cửa' },
  { id: 's-3', villageName: 'Triệu Phước', period: 'Quý 1/2026', births: 9, deaths: 3, immigration: 4, emigration: 2, source: 'Công an xã Lao Bảo' },
  { id: 's-4', villageName: 'Làng Vây', period: 'Quý 1/2026', births: 11, deaths: 5, immigration: 6, emigration: 3, source: 'Công an xã Lao Bảo' }
];

export default function AdministrativePopulationPage() {
  const { currentRole } = useTenant();
  const [activeTab, setActiveTab] = React.useState('villages');
  const [records, setRecords] = React.useState<AdminPopRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [period, setPeriod] = React.useState('2026-Q1');

  // Detail Modal States
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<AdminPopRecord | null>(null);

  // Form Edit/Add Modal States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formRecord, setFormRecord] = React.useState<Partial<AdminPopRecord>>({});

  // GIS Map Modal State
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const [mapTargetVillage, setMapTargetVillage] = React.useState<AdminPopRecord | null>(null);

  const getVillageCoordinates = (code: string) => {
    const found = VILLAGES.find((v) => v.code === code);
    return found?.center ? `[${found.center[0]}, ${found.center[1]}]` : '[106.59, 16.63]';
  };

  // Calculations
  const totalStats = React.useMemo(() => {
    return records.reduce(
      (acc, curr) => {
        acc.area += curr.areaHa;
        acc.population += curr.population;
        acc.households += curr.householdCount;

        acc.kinh += curr.ethnicities.kinh;
        acc.vanKieu += curr.ethnicities.vanKieu;
        acc.paCo += curr.ethnicities.paCo;
        acc.other += curr.ethnicities.other;

        acc.workingAge += curr.workingAge;
        acc.employed += curr.employed;

        acc.insAccum += curr.healthInsuranceRate * curr.population;
        acc.phoneAccum += curr.smartphoneRate * curr.population;
        acc.netAccum += curr.internetRate * curr.population;
        acc.payAccum += curr.onlinePaymentRate * curr.population;

        return acc;
      },
      { area: 0, population: 0, households: 0, kinh: 0, vanKieu: 0, paCo: 0, other: 0, workingAge: 0, employed: 0, insAccum: 0, phoneAccum: 0, netAccum: 0, payAccum: 0 }
    );
  }, [records]);

  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      const matchesSearch = r.villageName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || r.workflowStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, selectedStatus]);

  const handleExportExcel = () => {
    toast.success('Đang khởi tạo tệp Excel báo cáo thống kê dân cư...', {
      description: 'Hệ thống đang trích xuất dữ liệu của 12 thôn thuộc xã Lao Bảo.'
    });
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRecord.villageCode) {
      toast.error('Vui lòng chọn thôn.');
      return;
    }

    const matchedVillage = VILLAGES.find((v) => v.code === formRecord.villageCode);
    const vName = matchedVillage ? matchedVillage.name : 'Thôn mới';

    if (formRecord.id) {
      // Edit
      setRecords((prev) =>
        prev.map((r) =>
          r.id === formRecord.id
            ? ({
              ...r,
              ...formRecord,
              villageName: vName,
              workflowStatus: 'draft' // Reset to draft when modified
            } as AdminPopRecord)
            : r
        )
      );
      toast.success(`Cập nhật thông tin thôn ${vName} thành công!`);
    } else {
      // Add
      const newRec: AdminPopRecord = {
        id: `ap-${Date.now()}`,
        villageCode: formRecord.villageCode,
        villageName: vName,
        areaHa: Number(formRecord.areaHa || 0),
        population: Number(formRecord.population || 0),
        householdCount: Number(formRecord.householdCount || 0),
        ethnicities: {
          kinh: Number(formRecord.ethnicities?.kinh || 0),
          vanKieu: Number(formRecord.ethnicities?.vanKieu || 0),
          paCo: Number(formRecord.ethnicities?.paCo || 0),
          other: Number(formRecord.ethnicities?.other || 0),
        },
        workingAge: Number(formRecord.workingAge || 0),
        employed: Number(formRecord.employed || 0),
        healthInsuranceRate: Number(formRecord.healthInsuranceRate || 0),
        smartphoneRate: Number(formRecord.smartphoneRate || 0),
        internetRate: Number(formRecord.internetRate || 0),
        onlinePaymentRate: Number(formRecord.onlinePaymentRate || 0),
        workflowStatus: 'draft',
        securityLevel: 'public',
      };
      setRecords((prev) => [newRec, ...prev]);
      toast.success(`Thêm mới dữ liệu thôn ${vName} thành công!`);
    }

    setIsFormOpen(false);
    setFormRecord({});
  };

  const handleDeleteRecord = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bản ghi của thôn ${name}?`)) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.info(`Đã xóa dữ liệu thôn ${name}.`);
    }
  };

  const handleOpenEdit = (rec: AdminPopRecord) => {
    setFormRecord({ ...rec });
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setFormRecord({
      villageCode: '',
      areaHa: 0,
      population: 0,
      householdCount: 0,
      ethnicities: { kinh: 0, vanKieu: 0, paCo: 0, other: 0 },
      workingAge: 0,
      employed: 0,
      healthInsuranceRate: 90,
      smartphoneRate: 80,
      internetRate: 75,
      onlinePaymentRate: 50,
      workflowStatus: 'draft',
      securityLevel: 'public',
    });
    setIsFormOpen(true);
  };

  const handleWorkflowAction = (rec: AdminPopRecord, action: WorkflowStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, workflowStatus: action } : r))
    );
    toast.success(`Đã cập nhật trạng thái quy trình phê duyệt thành công!`);
    setIsDetailOpen(false);
  };

  const handleOpenMap = (rec: AdminPopRecord) => {
    setMapTargetVillage(rec);
    setIsMapOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Users className="w-6 h-6 text-primary" />
            CSDL Hành chính &amp; Dân cư
          </>
        }
        description="Chủ trì bởi Văn phòng HĐND &amp; UBND xã Lao Bảo. Quản lý thôn, dân số, dân tộc, và chỉ số công dân số."
        actions={
          <>
            <Button
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border"
            >
              <FileSpreadsheet className="size-4" />
              Xuất Excel
            </Button>
            {(currentRole === 'admin' || currentRole === 'data_officer') && (
              <Button
                onClick={handleOpenAdd}
                size="sm"
                className="h-9 text-xs cursor-pointer gap-1.5 shadow-none"
              >
                <Plus className="size-4" />
                Thêm Thôn
              </Button>
            )}
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Map className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Tổng diện tích</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">
              {totalStats.area.toLocaleString('vi-VN')} ha
            </h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Dân số toàn xã</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">
              {totalStats.population.toLocaleString('vi-VN')} người
            </h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0">
            <Radio className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Tổng số hộ gia đình</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">
              {totalStats.households.toLocaleString('vi-VN')} hộ
            </h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0">
            <UserCheck className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Lao động có việc</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">
              {((totalStats.employed / totalStats.workingAge) * 100).toFixed(1)}% tỷ lệ
            </h3>
          </div>
        </Card>
      </div>

      {/* Tabs list navigation */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px shrink-0">
        {[
          { id: 'villages', label: 'Thống kê thôn' },
          { id: 'households', label: 'Dân số & Hộ gia đình' },
          { id: 'ethnicities', label: 'Cơ cấu dân tộc' },
          { id: 'labor', label: 'Lao động & Việc làm' },
          { id: 'digital', label: 'BHYT & Công dân số' },
          { id: 'shifts', label: 'Biến động dân cư' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main filter & search bar inside Villages tab */}
      {activeTab === 'villages' && (
        <Card className="border-border bg-card shadow-2xs">
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Tìm kiếm theo tên thôn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background border-border text-xs h-9 shadow-none"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48 h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-xs">
                <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái</SelectItem>
                <SelectItem value="draft" className="cursor-pointer">Nháp</SelectItem>
                <SelectItem value="submitted" className="cursor-pointer">Chờ duyệt</SelectItem>
                <SelectItem value="unit_approved" className="cursor-pointer">Đã duyệt (Phòng)</SelectItem>
                <SelectItem value="published" className="cursor-pointer">Đã công bố</SelectItem>
                <SelectItem value="returned" className="cursor-pointer">Trả lại</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Active Tab View */}
      <div className="space-y-4">
        {activeTab === 'villages' && (
          <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Tên thôn</th>
                    <th className="py-3.5 px-4 text-right">Diện tích (ha)</th>
                    <th className="py-3.5 px-4 text-right">Dân số (người)</th>
                    <th className="py-3.5 px-4 text-right">Số hộ gia đình</th>
                    <th className="py-3.5 px-4">Độ bảo mật</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 text-foreground font-semibold flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary" />
                        {r.villageName}
                      </td>
                      <td className="py-3.5 px-4 text-right">{r.areaHa}</td>
                      <td className="py-3.5 px-4 text-right">{r.population.toLocaleString('vi-VN')}</td>
                      <td className="py-3.5 px-4 text-right">{r.householdCount.toLocaleString('vi-VN')}</td>
                      <td className="py-3.5 px-4">
                        <SecurityLevelBadge level={r.securityLevel} />
                      </td>
                      <td className="py-3.5 px-4">
                        <WorkflowStatusBadge status={r.workflowStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <ActionMenu
                          entityName="dữ liệu thôn"
                          onView={() => {
                            setActiveRecord(r);
                            setIsDetailOpen(true);
                          }}
                          customActions={[
                            {
                              label: 'Bản đồ',
                              icon: <Map className="size-3.5 text-primary shrink-0" />,
                              onClick: () => handleOpenMap(r),
                            }
                          ]}
                          onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => handleOpenEdit(r) : undefined}
                          onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setRecords((prev) => prev.filter((rec) => rec.id !== r.id)) : undefined}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'households' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border bg-card p-6 space-y-6">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Mật độ phân bố hộ gia đình và nhân khẩu theo thôn
              </h3>
              <div className="space-y-4">
                {records.map((r) => {
                  const percent = Math.min(100, (r.population / 2500) * 100);
                  return (
                    <div key={r.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{r.villageName}</span>
                        <span className="text-muted-foreground">
                          {r.population} người / {r.householdCount} hộ (Bình quân:{' '}
                          {(r.population / r.householdCount).toFixed(1)} người/hộ)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Cơ cấu quy mô hộ gia đình
              </h3>
              <div className="space-y-3.5">
                <div className="p-3 border border-border bg-muted/10 rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Số nhân khẩu trung bình</span>
                  <p className="text-lg font-bold text-foreground">
                    {(totalStats.population / totalStats.households).toFixed(2)} người / hộ
                  </p>
                </div>

                <div className="p-3 border border-border bg-muted/10 rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Mật độ dân số chung</span>
                  <p className="text-lg font-bold text-foreground">
                    {(totalStats.population / (totalStats.area / 100)).toFixed(1)} người / km²
                  </p>
                </div>

                <div className="p-3 border border-border bg-muted/10 rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Thôn đông dân nhất</span>
                  <p className="text-lg font-bold text-primary">Ka Tăng (2.500 người)</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'ethnicities' && (
          <Card className="border-border bg-card p-6 space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Cơ cấu dân tộc sinh sống tại xã Lao Bảo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 border border-border bg-card rounded-xl">
                <span className="text-[10px] text-muted-foreground font-semibold">Dân tộc Kinh</span>
                <p className="text-xl font-bold text-foreground mt-0.5">{totalStats.kinh.toLocaleString('vi-VN')}</p>
                <Badge variant="outline" className="mt-1 font-semibold text-[10px] bg-primary/5 text-primary">
                  {((totalStats.kinh / totalStats.population) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="p-4 border border-border bg-card rounded-xl">
                <span className="text-[10px] text-muted-foreground font-semibold">Dân tộc Vân Kiều</span>
                <p className="text-xl font-bold text-foreground mt-0.5">{totalStats.vanKieu.toLocaleString('vi-VN')}</p>
                <Badge variant="outline" className="mt-1 font-semibold text-[10px] bg-indigo-500/5 text-indigo-500">
                  {((totalStats.vanKieu / totalStats.population) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="p-4 border border-border bg-card rounded-xl">
                <span className="text-[10px] text-muted-foreground font-semibold">Dân tộc Pa Cô</span>
                <p className="text-xl font-bold text-foreground mt-0.5">{totalStats.paCo.toLocaleString('vi-VN')}</p>
                <Badge variant="outline" className="mt-1 font-semibold text-[10px] bg-amber-500/5 text-amber-500">
                  {((totalStats.paCo / totalStats.population) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="p-4 border border-border bg-card rounded-xl">
                <span className="text-[10px] text-muted-foreground font-semibold">Dân tộc thiểu số khác</span>
                <p className="text-xl font-bold text-foreground mt-0.5">{totalStats.other.toLocaleString('vi-VN')}</p>
                <Badge variant="outline" className="mt-1 font-semibold text-[10px] bg-muted/60 text-muted-foreground">
                  {((totalStats.other / totalStats.population) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>

            <Separator className="bg-border/60" />

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-foreground">Phân bổ dân tộc theo từng thôn</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((r) => {
                  const kinhPct = (r.ethnicities.kinh / r.population) * 100;
                  const vanKieuPct = (r.ethnicities.vanKieu / r.population) * 100;
                  const paCoPct = (r.ethnicities.paCo / r.population) * 100;
                  const otherPct = (r.ethnicities.other / r.population) * 100;

                  return (
                    <div key={r.id} className="p-3.5 border border-border rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>{r.villageName}</span>
                        <span className="text-muted-foreground">{r.population} người</span>
                      </div>
                      <div className="flex w-full h-3 bg-muted rounded-sm overflow-hidden">
                        {kinhPct > 0 && <div style={{ width: `${kinhPct}%` }} className="h-full bg-primary" title={`Kinh: ${r.ethnicities.kinh}`} />}
                        {vanKieuPct > 0 && <div style={{ width: `${vanKieuPct}%` }} className="h-full bg-indigo-500" title={`Vân Kiều: ${r.ethnicities.vanKieu}`} />}
                        {paCoPct > 0 && <div style={{ width: `${paCoPct}%` }} className="h-full bg-amber-500" title={`Pa Cô: ${r.ethnicities.paCo}`} />}
                        {otherPct > 0 && <div style={{ width: `${otherPct}%` }} className="h-full bg-muted-foreground/60" title={`Khác: ${r.ethnicities.other}`} />}
                      </div>
                      <div className="flex gap-3 text-[10px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" />Kinh ({kinhPct.toFixed(0)}%)</span>
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-indigo-500" />Vân Kiều ({vanKieuPct.toFixed(0)}%)</span>
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" />Pa Cô ({paCoPct.toFixed(0)}%)</span>
                        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-muted-foreground/60" />Khác ({otherPct.toFixed(0)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'labor' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border bg-card p-6 space-y-6">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Tỷ lệ lao động có việc làm theo thôn
              </h3>
              <div className="space-y-4">
                {records.map((r) => {
                  const empRate = (r.employed / r.workingAge) * 100;
                  return (
                    <div key={r.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{r.villageName}</span>
                        <span className="text-muted-foreground font-semibold text-[10.5px]">
                          {r.employed.toLocaleString('vi-VN')} / {r.workingAge.toLocaleString('vi-VN')} lao động ({empRate.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          style={{ width: `${empRate}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${empRate >= 90
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-amber-500 to-primary'
                            }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Tổng quan lao động toàn xã
              </h3>
              <div className="space-y-3.5">
                <div className="p-3 border border-border bg-muted/10 rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Lao động trong độ tuổi</span>
                  <p className="text-lg font-bold text-foreground">
                    {totalStats.workingAge.toLocaleString('vi-VN')} người
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Chiếm {((totalStats.workingAge / totalStats.population) * 100).toFixed(1)}% dân số.
                  </p>
                </div>

                <div className="p-3 border border-border bg-muted/10 rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Lao động có việc làm</span>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {totalStats.employed.toLocaleString('vi-VN')} người
                  </p>
                </div>

                <div className="p-3 border border-border bg-muted/10 rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Lao động chưa có việc làm</span>
                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    {(totalStats.workingAge - totalStats.employed).toLocaleString('vi-VN')} người
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'digital' && (
          <div className="space-y-6">
            {/* Rates Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <Card className="border-border bg-card p-4 flex flex-col items-center justify-center gap-1.5">
                <Shield className="size-6 text-primary" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Tỷ lệ bao phủ BHYT</span>
                <p className="text-base font-bold text-foreground">
                  {(totalStats.insAccum / totalStats.population).toFixed(1)}%
                </p>
              </Card>

              <Card className="border-border bg-card p-4 flex flex-col items-center justify-center gap-1.5">
                <Smartphone className="size-6 text-emerald-500" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Điện thoại thông minh</span>
                <p className="text-base font-bold text-foreground">
                  {(totalStats.phoneAccum / totalStats.population).toFixed(1)}%
                </p>
              </Card>

              <Card className="border-border bg-card p-4 flex flex-col items-center justify-center gap-1.5">
                <Globe2 className="size-6 text-indigo-500" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Thuê bao Internet</span>
                <p className="text-base font-bold text-foreground">
                  {(totalStats.netAccum / totalStats.population).toFixed(1)}%
                </p>
              </Card>

              <Card className="border-border bg-card p-4 flex flex-col items-center justify-center gap-1.5">
                <CreditCard className="size-6 text-amber-500" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Thanh toán trực tuyến</span>
                <p className="text-base font-bold text-foreground">
                  {(totalStats.payAccum / totalStats.population).toFixed(1)}%
                </p>
              </Card>
            </div>

            {/* Rates Table per Village */}
            <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3 px-4">Tên thôn</th>
                      <th className="py-3 px-4 text-center">Bao phủ BHYT</th>
                      <th className="py-3 px-4 text-center">Sử dụng Smartphone</th>
                      <th className="py-3 px-4 text-center">Kết nối Internet</th>
                      <th className="py-3 px-4 text-center">Thanh toán điện tử</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {records.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                        <td className="py-3 px-4 text-foreground font-semibold">{r.villageName}</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{r.healthInsuranceRate}%</td>
                        <td className="py-3 px-4 text-center text-foreground">{r.smartphoneRate}%</td>
                        <td className="py-3 px-4 text-center text-foreground">{r.internetRate}%</td>
                        <td className="py-3 px-4 text-center text-primary font-bold">{r.onlinePaymentRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="space-y-4">
            <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Địa bàn thôn</th>
                      <th className="py-3.5 px-4 text-center">Số sinh (người)</th>
                      <th className="py-3.5 px-4 text-center">Số tử (người)</th>
                      <th className="py-3.5 px-4 text-center">Chuyển đến (nhập cư)</th>
                      <th className="py-3.5 px-4 text-center">Chuyển đi (xuất cư)</th>
                      <th className="py-3.5 px-4">Kỳ báo cáo</th>
                      <th className="py-3.5 px-4">Nguồn dữ liệu đối soát</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {MOCK_SHIFTS.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/5 transition-colors">
                        <td className="py-3.5 px-4 text-foreground font-semibold">{s.villageName}</td>
                        <td className="py-3.5 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">+{s.births}</td>
                        <td className="py-3.5 px-4 text-center text-rose-500 font-bold">-{s.deaths}</td>
                        <td className="py-3.5 px-4 text-center text-indigo-500 font-semibold">+{s.immigration}</td>
                        <td className="py-3.5 px-4 text-center text-amber-600 font-semibold">-{s.emigration}</td>
                        <td className="py-3.5 px-4 text-muted-foreground font-semibold">{s.period}</td>
                        <td className="py-3.5 px-4 text-muted-foreground italic">{s.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              Chi tiết CSDL Thôn {activeRecord?.villageName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Mã địa bàn: {activeRecord?.villageCode}
            </DialogDescription>
          </DialogHeader>

          {activeRecord && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-border rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground font-semibold">Diện tích</span>
                  <p className="font-bold text-foreground mt-0.5">{activeRecord.areaHa} ha</p>
                </div>
                <div className="p-3 border border-border rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground font-semibold">Dân số</span>
                  <p className="font-bold text-foreground mt-0.5">{activeRecord.population.toLocaleString('vi-VN')} người</p>
                </div>
                <div className="p-3 border border-border rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground font-semibold">Hộ gia đình</span>
                  <p className="font-bold text-foreground mt-0.5">{activeRecord.householdCount} hộ</p>
                </div>
                <div className="p-3 border border-border rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground font-semibold">Độ bảo mật</span>
                  <div className="mt-0.5"><SecurityLevelBadge level={activeRecord.securityLevel} /></div>
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Ethnicity list */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Cơ cấu dân tộc</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between p-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Kinh:</span>
                    <span className="font-semibold text-foreground">{activeRecord.ethnicities.kinh}</span>
                  </div>
                  <div className="flex justify-between p-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Vân Kiều:</span>
                    <span className="font-semibold text-foreground">{activeRecord.ethnicities.vanKieu}</span>
                  </div>
                  <div className="flex justify-between p-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Pa Cô:</span>
                    <span className="font-semibold text-foreground">{activeRecord.ethnicities.paCo}</span>
                  </div>
                  <div className="flex justify-between p-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Khác:</span>
                    <span className="font-semibold text-foreground">{activeRecord.ethnicities.other}</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Digital rates */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Công dân số & An sinh</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between p-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Độ phủ BHYT:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeRecord.healthInsuranceRate}%</span>
                  </div>
                  <div className="flex justify-between p-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Smartphone:</span>
                    <span className="font-semibold text-foreground">{activeRecord.smartphoneRate}%</span>
                  </div>
                  <div className="flex justify-between p-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Thuê bao Internet:</span>
                    <span className="font-semibold text-foreground">{activeRecord.internetRate}%</span>
                  </div>
                  <div className="flex justify-between p-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Thanh toán trực tuyến:</span>
                    <span className="font-semibold text-primary">{activeRecord.onlinePaymentRate}%</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Workflow Actions in detail view */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">Trạng thái:</span>
                <WorkflowStatusBadge status={activeRecord.workflowStatus} />
              </div>

              {/* Workflow Transitions */}
              <div className="flex flex-wrap gap-2 pt-2 justify-end border-t border-border/60">
                {activeRecord.workflowStatus === 'draft' && (
                  <Button
                    onClick={() => handleWorkflowAction(activeRecord, 'submitted')}
                    size="xs"
                    className="h-8 text-xs cursor-pointer shadow-none"
                  >
                    Gửi duyệt số liệu
                  </Button>
                )}
                {activeRecord.workflowStatus === 'submitted' && currentRole === 'unit_leader' && (
                  <>
                    <Button
                      onClick={() => handleWorkflowAction(activeRecord, 'returned')}
                      variant="destructive"
                      size="xs"
                      className="h-8 text-xs cursor-pointer shadow-none"
                    >
                      Trả lại
                    </Button>
                    <Button
                      onClick={() => handleWorkflowAction(activeRecord, 'unit_approved')}
                      variant="default"
                      size="xs"
                      className="h-8 text-xs cursor-pointer shadow-none bg-emerald-600 hover:bg-emerald-700"
                    >
                      Duyệt cấp phòng
                    </Button>
                  </>
                )}
                {['submitted', 'unit_approved'].includes(activeRecord.workflowStatus) &&
                  (currentRole === 'data_governance' || currentRole === 'admin') && (
                    <>
                      <Button
                        onClick={() => handleWorkflowAction(activeRecord, 'returned')}
                        variant="destructive"
                        size="xs"
                        className="h-8 text-xs cursor-pointer shadow-none"
                      >
                        Trả lại rà soát
                      </Button>
                      <Button
                        onClick={() => handleWorkflowAction(activeRecord, 'published')}
                        variant="default"
                        size="xs"
                        className="h-8 text-xs cursor-pointer shadow-none bg-primary"
                      >
                        Công bố chính thức
                      </Button>
                    </>
                  )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-border/40">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer shadow-none border-border">
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Add Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id ? 'Cập nhật số liệu thôn' : 'Thêm mới số liệu thôn'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Nhập các chỉ tiêu dân số, địa bàn và công dân số của thôn xã Lao Bảo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveRecord} className="space-y-4 py-2 text-xs">
            {/* Village Selector */}
            <div className="grid gap-1.5">
              <label className="font-bold text-foreground">Thôn</label>
              {formRecord.id ? (
                <Input value={formRecord.villageName} disabled className="bg-muted text-xs h-9" />
              ) : (
                <Select
                  value={formRecord.villageCode || ''}
                  onValueChange={(val) => setFormRecord((prev) => ({ ...prev, villageCode: val }))}
                >
                  <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                    <SelectValue placeholder="-- Chọn thôn --" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    {VILLAGES.map((v) => (
                      <SelectItem key={v.code} value={v.code} className="cursor-pointer">
                        Thôn {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Diện tích (ha)</label>
                <Input
                  type="number"
                  value={formRecord.areaHa || ''}
                  onChange={(e) => setFormRecord((prev) => ({ ...prev, areaHa: Number(e.target.value) }))}
                  className="bg-background border-border text-xs h-9 shadow-none"
                />
              </div>
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Dân số (người)</label>
                <Input
                  type="number"
                  value={formRecord.population || ''}
                  onChange={(e) => setFormRecord((prev) => ({ ...prev, population: Number(e.target.value) }))}
                  className="bg-background border-border text-xs h-9 shadow-none"
                />
              </div>
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Hộ gia đình</label>
                <Input
                  type="number"
                  value={formRecord.householdCount || ''}
                  onChange={(e) => setFormRecord((prev) => ({ ...prev, householdCount: Number(e.target.value) }))}
                  className="bg-background border-border text-xs h-9 shadow-none"
                />
              </div>
            </div>

            {/* Ethnicities */}
            <div className="space-y-2 border border-border/60 p-3 rounded-lg bg-muted/20">
              <span className="font-bold text-foreground">Thành phần dân tộc</span>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="grid gap-1">
                  <label className="text-[10px] text-muted-foreground font-semibold">Kinh</label>
                  <Input
                    type="number"
                    value={formRecord.ethnicities?.kinh || ''}
                    onChange={(e) =>
                      setFormRecord((prev) => ({
                        ...prev,
                        ethnicities: { ...(prev.ethnicities || { kinh: 0, vanKieu: 0, paCo: 0, other: 0 }), kinh: Number(e.target.value) }
                      }))
                    }
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-[10px] text-muted-foreground font-semibold">Vân Kiều</label>
                  <Input
                    type="number"
                    value={formRecord.ethnicities?.vanKieu || ''}
                    onChange={(e) =>
                      setFormRecord((prev) => ({
                        ...prev,
                        ethnicities: { ...(prev.ethnicities || { kinh: 0, vanKieu: 0, paCo: 0, other: 0 }), vanKieu: Number(e.target.value) }
                      }))
                    }
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-[10px] text-muted-foreground font-semibold">Pa Cô</label>
                  <Input
                    type="number"
                    value={formRecord.ethnicities?.paCo || ''}
                    onChange={(e) =>
                      setFormRecord((prev) => ({
                        ...prev,
                        ethnicities: { ...(prev.ethnicities || { kinh: 0, vanKieu: 0, paCo: 0, other: 0 }), paCo: Number(e.target.value) }
                      }))
                    }
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-[10px] text-muted-foreground font-semibold">Khác</label>
                  <Input
                    type="number"
                    value={formRecord.ethnicities?.other || ''}
                    onChange={(e) =>
                      setFormRecord((prev) => ({
                        ...prev,
                        ethnicities: { ...(prev.ethnicities || { kinh: 0, vanKieu: 0, paCo: 0, other: 0 }), other: Number(e.target.value) }
                      }))
                    }
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
              </div>
            </div>

            {/* Labor */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Lao động trong tuổi</label>
                <Input
                  type="number"
                  value={formRecord.workingAge || ''}
                  onChange={(e) => setFormRecord((prev) => ({ ...prev, workingAge: Number(e.target.value) }))}
                  className="bg-background border-border text-xs h-9 shadow-none"
                />
              </div>
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Lao động có việc</label>
                <Input
                  type="number"
                  value={formRecord.employed || ''}
                  onChange={(e) => setFormRecord((prev) => ({ ...prev, employed: Number(e.target.value) }))}
                  className="bg-background border-border text-xs h-9 shadow-none"
                />
              </div>
            </div>

            {/* Digital Rates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Tỷ lệ BHYT (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formRecord.healthInsuranceRate || ''}
                  onChange={(e) => setFormRecord((prev) => ({ ...prev, healthInsuranceRate: Number(e.target.value) }))}
                  className="bg-background border-border text-xs h-9 shadow-none"
                />
              </div>
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Sử dụng Smartphone (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formRecord.smartphoneRate || ''}
                  onChange={(e) => setFormRecord((prev) => ({ ...prev, smartphoneRate: Number(e.target.value) }))}
                  className="bg-background border-border text-xs h-9 shadow-none"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-border/40 gap-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs cursor-pointer shadow-none border-border">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" size="sm" className="h-9 text-xs cursor-pointer shadow-none">
                Lưu lại
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* GIS Map Modal */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              Bản đồ GIS - Ranh giới thôn {mapTargetVillage?.villageName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tọa độ trung tâm: {mapTargetVillage ? getVillageCoordinates(mapTargetVillage.villageCode) : ''}
            </DialogDescription>
          </DialogHeader>

          {/* Styled GIS graphic panel */}
          <div className="relative border border-border rounded-xl p-4 bg-muted/20 flex flex-col justify-center items-center min-h-[300px] overflow-hidden">
            {/* SVG layout representing abstract border line */}
            <svg viewBox="0 0 100 100" className="w-48 h-48 opacity-80 animate-pulse text-primary/30">
              <polygon
                points="25,10 75,10 90,50 65,90 25,80 10,40"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                className="fill-primary/5 stroke-primary"
              />
              <circle cx="50" cy="50" r="2.5" fill="red" />
            </svg>

            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-xs p-2.5 border border-border rounded-lg text-[10px] space-y-1 shadow-2xs">
              <p className="font-semibold text-foreground flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                Mã GIS: VN-QT-HH-LB-{mapTargetVillage?.villageCode.toUpperCase()}
              </p>
              <p className="text-muted-foreground">Diện tích: {mapTargetVillage?.areaHa} ha | Dân cư: {mapTargetVillage?.population} người</p>
            </div>

            <div className="absolute top-4 right-4 bg-primary/10 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded text-[8.5px] uppercase">
              Ranh giới hành chính v1.0
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border/40">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer shadow-none border-border">
                Đóng bản đồ
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
