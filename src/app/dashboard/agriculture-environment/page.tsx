// src/app/dashboard/agriculture-environment/page.tsx
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
  Wheat,
  Beef,
  Fish,
  TreePine,
  AlertTriangle,
  Droplets,
  Trash2 as TrashIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';
import { ActionMenu, PageHeader } from '@/components/common';
import { WorkflowStatusBadge } from '@/components/common/WorkflowStatusBadge';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { WorkflowStatus } from '@/types';
import { AgricultureProductionTimeSeriesChart } from '../components/charts/agriculture-production-time-series-chart';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CropRecord {
  id: string;
  cropCategory: string;
  cropName: string;
  villageCode: string;
  plantedAreaHa: number;
  harvestAreaHa: number;
  newPlantingAreaHa: number;
  outputTons: number;
  previousPeriodOutputTons: number;
  samePeriodLastYearOutputTons: number;
  reportingPeriod: string;
  workflowStatus: WorkflowStatus;
}

interface LivestockRecord {
  id: string;
  animalType: string;
  villageCode: string;
  totalHerd: number;
  previousMonth: number;
  samePeriodLastYear: number;
  cumulativeLiveWeightTons: number;
  reportingPeriod: string;
  workflowStatus: WorkflowStatus;
}

interface AquacultureRecord {
  id: string;
  type: string;
  areaHa: number;
  cageCount: number;
  naturalCatchTons: number;
  farmedOutputTons: number;
  cumulativeOutputTons: number;
  reportingPeriod: string;
  workflowStatus: WorkflowStatus;
}

interface ForestRecord {
  id: string;
  forestType: string;
  totalAreaHa: number;
  newPlantingAreaHa: number;
  harvestedAreaHa: number;
  outputM3: number;
  coverageRate: number;
  reportingPeriod: string;
  workflowStatus: WorkflowStatus;
}

interface PollutionPoint {
  id: string;
  name: string;
  villageCode: string;
  pollutionType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Treated' | 'Monitoring';
  workflowStatus: WorkflowStatus;
}

interface EnvironmentSummary {
  id: string;
  indicator: string;
  value: number;
  unit: string;
  target: number;
  period: string;
  trend: 'up' | 'down' | 'flat';
  workflowStatus: WorkflowStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CROP_DATA: CropRecord[] = [
  {
    id: 'crop-1',
    cropCategory: 'Lúa',
    cropName: 'Lúa nước (IR504, BC15)',
    villageCode: 'tan-kim',
    plantedAreaHa: 280,
    harvestAreaHa: 275,
    newPlantingAreaHa: 5,
    outputTons: 1375,
    previousPeriodOutputTons: 1340,
    samePeriodLastYearOutputTons: 1290,
    reportingPeriod: '2026-Q1',
    workflowStatus: 'published',
  },
  {
    id: 'crop-2',
    cropCategory: 'Cây công nghiệp',
    cropName: 'Cà phê Arabica',
    villageCode: 'lang-vay',
    plantedAreaHa: 420,
    harvestAreaHa: 390,
    newPlantingAreaHa: 30,
    outputTons: 312,
    previousPeriodOutputTons: 295,
    samePeriodLastYearOutputTons: 280,
    reportingPeriod: '2026-Q1',
    workflowStatus: 'published',
  },
  {
    id: 'crop-3',
    cropCategory: 'Cây dược liệu',
    cropName: 'Chè vằng',
    villageCode: 'ka-tang',
    plantedAreaHa: 85,
    harvestAreaHa: 80,
    newPlantingAreaHa: 5,
    outputTons: 128,
    previousPeriodOutputTons: 115,
    samePeriodLastYearOutputTons: 104,
    reportingPeriod: '2026-Q1',
    workflowStatus: 'published',
  },
  {
    id: 'crop-4',
    cropCategory: 'Cây ăn quả',
    cropName: 'Chuối, Mít, Xoài các loại',
    villageCode: 'trieu-phuoc',
    plantedAreaHa: 62,
    harvestAreaHa: 58,
    newPlantingAreaHa: 4,
    outputTons: 174,
    previousPeriodOutputTons: 160,
    samePeriodLastYearOutputTons: 148,
    reportingPeriod: '2026-Q1',
    workflowStatus: 'unit_approved',
  },
  {
    id: 'crop-5',
    cropCategory: 'Rau màu',
    cropName: 'Rau các loại (Cải, Bầu, Bí)',
    villageCode: 'vinh-dong',
    plantedAreaHa: 18,
    harvestAreaHa: 17,
    newPlantingAreaHa: 1,
    outputTons: 85,
    previousPeriodOutputTons: 78,
    samePeriodLastYearOutputTons: 70,
    reportingPeriod: '2026-Q1',
    workflowStatus: 'draft',
  },
];

const LIVESTOCK_DATA: LivestockRecord[] = [
  { id: 'ls-1', animalType: 'Trâu', villageCode: 'ka-tang', totalHerd: 820, previousMonth: 815, samePeriodLastYear: 790, cumulativeLiveWeightTons: 312, reportingPeriod: '2026-Q1', workflowStatus: 'published' },
  { id: 'ls-2', animalType: 'Bò', villageCode: 'trieu-phuoc', totalHerd: 1450, previousMonth: 1440, samePeriodLastYear: 1380, cumulativeLiveWeightTons: 580, reportingPeriod: '2026-Q1', workflowStatus: 'published' },
  { id: 'ls-3', animalType: 'Lợn (heo)', villageCode: 'tan-kim', totalHerd: 2180, previousMonth: 2200, samePeriodLastYear: 2050, cumulativeLiveWeightTons: 218, reportingPeriod: '2026-Q1', workflowStatus: 'published' },
  { id: 'ls-4', animalType: 'Gia cầm (gà, vịt)', villageCode: 'vinh-dong', totalHerd: 28500, previousMonth: 27800, samePeriodLastYear: 25600, cumulativeLiveWeightTons: 57, reportingPeriod: '2026-Q1', workflowStatus: 'unit_approved' },
  { id: 'ls-5', animalType: 'Dê', villageCode: 'lang-vay', totalHerd: 340, previousMonth: 335, samePeriodLastYear: 310, cumulativeLiveWeightTons: 34, reportingPeriod: '2026-Q1', workflowStatus: 'draft' },
];

const AQUA_DATA: AquacultureRecord[] = [
  { id: 'aq-1', type: 'Nuôi cá ao hồ', areaHa: 12.5, cageCount: 0, naturalCatchTons: 0, farmedOutputTons: 28.3, cumulativeOutputTons: 28.3, reportingPeriod: '2026-Q1', workflowStatus: 'published' },
  { id: 'aq-2', type: 'Nuôi cá lồng sông Sê Pôn', areaHa: 0, cageCount: 38, naturalCatchTons: 0, farmedOutputTons: 15.6, cumulativeOutputTons: 15.6, reportingPeriod: '2026-Q1', workflowStatus: 'published' },
  { id: 'aq-3', type: 'Khai thác thủy sản tự nhiên', areaHa: 0, cageCount: 0, naturalCatchTons: 8.2, farmedOutputTons: 0, cumulativeOutputTons: 8.2, reportingPeriod: '2026-Q1', workflowStatus: 'unit_approved' },
];

const FOREST_DATA: ForestRecord[] = [
  { id: 'for-1', forestType: 'Rừng phòng hộ', totalAreaHa: 890, newPlantingAreaHa: 12, harvestedAreaHa: 0, outputM3: 0, coverageRate: 42.8, reportingPeriod: '2026-Q1', workflowStatus: 'published' },
  { id: 'for-2', forestType: 'Rừng sản xuất', totalAreaHa: 1290, newPlantingAreaHa: 45, harvestedAreaHa: 28, outputM3: 420, coverageRate: 0, reportingPeriod: '2026-Q1', workflowStatus: 'published' },
  { id: 'for-3', forestType: 'Rừng tự nhiên phục hồi', totalAreaHa: 380, newPlantingAreaHa: 0, harvestedAreaHa: 0, outputM3: 0, coverageRate: 0, reportingPeriod: '2026-Q1', workflowStatus: 'unit_approved' },
];

const POLLUTION_DATA: PollutionPoint[] = [
  { id: 'pol-1', name: 'Điểm tập kết rác thải chưa xử lý Tân Kim', villageCode: 'tan-kim', pollutionType: 'Chất thải rắn', severity: 'Medium', status: 'Monitoring', workflowStatus: 'published' },
  { id: 'pol-2', name: 'Bãi thải vật liệu xây dựng ven đường DH.23', villageCode: 'ka-tang', pollutionType: 'Chất thải xây dựng', severity: 'Low', status: 'Active', workflowStatus: 'published' },
  { id: 'pol-3', name: 'Nước thải chăn nuôi thôn Làng Vây chưa qua xử lý', villageCode: 'lang-vay', pollutionType: 'Nước thải chăn nuôi', severity: 'High', status: 'Active', workflowStatus: 'submitted' },
];

const ENV_SUMMARY: EnvironmentSummary[] = [
  { id: 'env-1', indicator: 'Tỷ lệ dân số được dùng nước sạch hợp vệ sinh', value: 94.2, unit: '%', target: 97, period: '2026-Q1', trend: 'up', workflowStatus: 'published' },
  { id: 'env-2', indicator: 'Tỷ lệ thu gom rác thải sinh hoạt', value: 72.5, unit: '%', target: 85, period: '2026-Q1', trend: 'up', workflowStatus: 'published' },
  { id: 'env-3', indicator: 'Tỷ lệ hộ phân loại rác tại nguồn', value: 38.0, unit: '%', target: 60, period: '2026-Q1', trend: 'up', workflowStatus: 'unit_approved' },
  { id: 'env-4', indicator: 'Tỷ lệ rác thải được xử lý đúng quy định', value: 65.8, unit: '%', target: 80, period: '2026-Q1', trend: 'flat', workflowStatus: 'published' },
  { id: 'env-5', indicator: 'Độ che phủ rừng toàn xã', value: 42.8, unit: '%', target: 45, period: '2026-Q1', trend: 'up', workflowStatus: 'published' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getVillageName = (code: string) => {
  const v = VILLAGES.find((vv) => vv.code === code);
  return v ? `Thôn ${v.name}` : code;
};

const SEVERITY_CONFIG: Record<string, { label: string; className: string }> = {
  Low: { label: 'Thấp', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  Medium: { label: 'Trung bình', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  High: { label: 'Cao', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  Critical: { label: 'Nghiêm trọng', className: 'bg-rose-600/10 text-rose-700 border-rose-600/20' },
};

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) =>
  trend === 'up' ? <TrendingUp className="size-3.5 text-emerald-500" /> :
    trend === 'down' ? <TrendingDown className="size-3.5 text-rose-500" /> :
      <Minus className="size-3.5 text-muted-foreground" />;

// ─── Main Page ────────────────────────────────────────────────────────────────

const MOCK_CROP_TREND_DATA = [
  { period: "Vụ Đ.Xuân 24", areaHa: 120, outputTons: 620 },
  { period: "Vụ X.Hè 24", areaHa: 95, outputTons: 480 },
  { period: "Vụ H.Thu 24", areaHa: 130, outputTons: 680 },
  { period: "Vụ Đ.Xuân 25", areaHa: 125, outputTons: 640 },
];

export default function AgricultureEnvironmentPage() {
  const { currentRole } = useTenant();
  const [activeTab, setActiveTab] = React.useState('crops');
  const [searchQuery, setSearchQuery] = React.useState('');

  const [crops, setCrops] = React.useState<CropRecord[]>(CROP_DATA);
  const [livestock, setLivestock] = React.useState<LivestockRecord[]>(LIVESTOCK_DATA);
  const [aqua] = React.useState<AquacultureRecord[]>(AQUA_DATA);
  const [forests] = React.useState<ForestRecord[]>(FOREST_DATA);
  const [pollutions, setPollutions] = React.useState<PollutionPoint[]>(POLLUTION_DATA);
  const [envSummary] = React.useState<EnvironmentSummary[]>(ENV_SUMMARY);

  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formType, setFormType] = React.useState<'crop' | 'livestock'>('crop');
  const [formRecord, setFormRecord] = React.useState<any>({});

  // KPI summary
  const kpis = React.useMemo(() => {
    const totalCropHa = crops.reduce((s, r) => s + r.plantedAreaHa, 0);
    const totalLivestock = livestock.reduce((s, r) => s + r.totalHerd, 0);
    const totalAquaOutput = aqua.reduce((s, r) => s + r.farmedOutputTons + r.naturalCatchTons, 0);
    const forestCoverage = 42.8;
    return { totalCropHa, totalLivestock, totalAquaOutput, forestCoverage };
  }, [crops, livestock, aqua]);

  // Workflow action
  const handleWorkflow = (rec: any, dataset: string, next: WorkflowStatus) => {
    if (dataset === 'crop') setCrops((p) => p.map((r) => r.id === rec.id ? { ...r, workflowStatus: next } : r));
    else if (dataset === 'livestock') setLivestock((p) => p.map((r) => r.id === rec.id ? { ...r, workflowStatus: next } : r));
    else if (dataset === 'pollution') setPollutions((p) => p.map((r) => r.id === rec.id ? { ...r, workflowStatus: next } : r));
    toast.success('Đã cập nhật trạng thái quy trình phê duyệt!');
    setIsDetailOpen(false);
  };

  const handleDelete = (id: string, dataset: string, name: string) => {
    if (!confirm(`Xóa bản ghi: ${name}?`)) return;
    if (dataset === 'crop') setCrops((p) => p.filter((r) => r.id !== id));
    else if (dataset === 'livestock') setLivestock((p) => p.filter((r) => r.id !== id));
    toast.info(`Đã xóa: ${name}`);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === 'crop') {
      if (formRecord.id) {
        setCrops((p) => p.map((r) => r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: 'draft' as WorkflowStatus } : r));
        toast.success('Đã cập nhật bản ghi cây trồng!');
      } else {
        setCrops((p) => [{
          id: `crop-${Date.now()}`,
          cropCategory: formRecord.cropCategory || 'Cây trồng khác',
          cropName: formRecord.cropName || 'Cây trồng mới',
          villageCode: formRecord.villageCode || VILLAGES[0].code,
          plantedAreaHa: Number(formRecord.plantedAreaHa) || 0,
          harvestAreaHa: Number(formRecord.harvestAreaHa) || 0,
          newPlantingAreaHa: Number(formRecord.newPlantingAreaHa) || 0,
          outputTons: Number(formRecord.outputTons) || 0,
          previousPeriodOutputTons: 0,
          samePeriodLastYearOutputTons: 0,
          reportingPeriod: formRecord.reportingPeriod || '2026-Q1',
          workflowStatus: 'draft',
        }, ...p]);
        toast.success('Thêm mới bản ghi cây trồng thành công!');
      }
    } else if (formType === 'livestock') {
      if (formRecord.id) {
        setLivestock((p) => p.map((r) => r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: 'draft' as WorkflowStatus } : r));
        toast.success('Đã cập nhật bản ghi chăn nuôi!');
      } else {
        setLivestock((p) => [{
          id: `ls-${Date.now()}`,
          animalType: formRecord.animalType || 'Gia súc khác',
          villageCode: formRecord.villageCode || VILLAGES[0].code,
          totalHerd: Number(formRecord.totalHerd) || 0,
          previousMonth: 0,
          samePeriodLastYear: 0,
          cumulativeLiveWeightTons: Number(formRecord.cumulativeLiveWeightTons) || 0,
          reportingPeriod: formRecord.reportingPeriod || '2026-Q1',
          workflowStatus: 'draft',
        }, ...p]);
        toast.success('Thêm mới bản ghi chăn nuôi thành công!');
      }
    }
    setIsFormOpen(false);
  };

  const filteredCrops = crops.filter((r) =>
    r.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cropCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLivestock = livestock.filter((r) =>
    r.animalType.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const TABS = [
    { id: 'crops', label: 'Cây trồng', icon: Wheat },
    { id: 'livestock', label: 'Chăn nuôi', icon: Beef },
    { id: 'aquaculture', label: 'Thủy sản', icon: Fish },
    { id: 'forest', label: 'Rừng & DVMTR', icon: TreePine },
    { id: 'pollution', label: 'Ô nhiễm môi trường', icon: AlertTriangle },
    { id: 'environment', label: 'Nước & Rác thải', icon: Droplets },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Wheat className="w-6 h-6 text-primary" />
            CSDL Nông nghiệp &amp; Môi trường
          </>
        }
        description="Chủ trì bởi Phòng Kinh tế xã Lao Bảo. Cập nhật hàng quý theo chu kỳ sản xuất nông nghiệp."
        actions={
          <>
            <Button onClick={() => toast.success('Đang kết xuất báo cáo Nông nghiệp & Môi trường xã Lao Bảo...')} variant="outline" size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border">
              <FileSpreadsheet className="size-4" />
              Báo cáo nông nghiệp
            </Button>
            {(currentRole === 'admin' || currentRole === 'data_officer') && (
              <Button
                onClick={() => {
                  const type = activeTab === 'livestock' ? 'livestock' : 'crop';
                  setFormType(type);
                  setFormRecord(type === 'livestock'
                    ? { animalType: '', villageCode: VILLAGES[0].code, totalHerd: '', cumulativeLiveWeightTons: '', reportingPeriod: '2026-Q1' }
                    : { cropCategory: '', cropName: '', villageCode: VILLAGES[0].code, plantedAreaHa: '', harvestAreaHa: '', newPlantingAreaHa: '', outputTons: '', reportingPeriod: '2026-Q1' });
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
        {[
          { label: 'Diện tích gieo trồng', value: `${kpis.totalCropHa.toLocaleString()} ha`, icon: Wheat, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Tổng đàn gia súc gia cầm', value: kpis.totalLivestock.toLocaleString() + ' con', icon: Beef, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Sản lượng thủy sản', value: `${kpis.totalAquaOutput.toFixed(1)} tấn`, icon: Fish, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Độ che phủ rừng', value: `${kpis.forestCoverage}%`, icon: TreePine, color: 'text-green-700', bg: 'bg-green-700/10' },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border bg-card p-4 flex items-center gap-3">
            <div className={`p-3 ${kpi.bg} ${kpi.color} rounded-xl shrink-0`}><kpi.icon className="size-5" /></div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">{kpi.label}</span>
              <h3 className="text-base font-bold text-foreground mt-0.5">{kpi.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border gap-0.5 overflow-x-auto pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search (most tabs) */}
      {!['aquaculture', 'forest', 'environment'].includes(activeTab) && (
        <Card className="border-border bg-card shadow-2xs">
          <CardContent className="p-4">
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border text-xs h-9 shadow-none"
            />
          </CardContent>
        </Card>
      )}

      {/* ────────── TAB: Crops ────────── */}
      {activeTab === 'crops' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <AgricultureProductionTimeSeriesChart data={MOCK_CROP_TREND_DATA} />
          </div>
          <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Tên cây trồng</th>
                    <th className="py-3.5 px-4">Nhóm</th>
                    <th className="py-3.5 px-4">Thôn</th>
                    <th className="py-3.5 px-4 text-right">DT gieo (ha)</th>
                    <th className="py-3.5 px-4 text-right">DT thu hoạch (ha)</th>
                    <th className="py-3.5 px-4 text-right">Sản lượng (tấn)</th>
                    <th className="py-3.5 px-4 text-right">Cùng kỳ NTr</th>
                    <th className="py-3.5 px-4">Quy trình</th>
                    <th className="py-3.5 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {filteredCrops.map((r) => {
                    const yoyChange = r.outputTons - r.samePeriodLastYearOutputTons;
                    return (
                      <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                          <Wheat className="size-3.5 text-emerald-500 shrink-0" /> {r.cropName}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">{r.cropCategory}</td>
                        <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.plantedAreaHa}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.harvestAreaHa}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.outputTons}</td>
                        <td className={`py-3.5 px-4 text-right font-bold ${yoyChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {yoyChange >= 0 ? '+' : ''}{yoyChange}
                        </td>
                        <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                        <td className="py-3.5 px-4 text-center">
                          <ActionMenu
                            entityName="dự liệu cây trồng"
                            onView={() => { setActiveRecord({ ...r, _dataset: 'crop' }); setIsDetailOpen(true); }}
                            onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => { setFormType('crop'); setFormRecord({ ...r }); setIsFormOpen(true); } : undefined}
                            onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setCrops((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}


      {/* ────────── TAB: Livestock ────────── */}
      {activeTab === 'livestock' && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Loại gia súc / gia cầm</th>
                  <th className="py-3.5 px-4">Thôn</th>
                  <th className="py-3.5 px-4 text-right">Tổng đàn (con)</th>
                  <th className="py-3.5 px-4 text-right">Tháng trước</th>
                  <th className="py-3.5 px-4 text-right">Cùng kỳ NTr</th>
                  <th className="py-3.5 px-4 text-right">Sản lượng (tấn HH)</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredLivestock.map((r) => {
                  const momChange = r.totalHerd - r.previousMonth;
                  return (
                    <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                        <Beef className="size-3.5 text-amber-500 shrink-0" /> {r.animalType}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.totalHerd.toLocaleString()}</td>
                      <td className={`py-3.5 px-4 text-right font-bold ${momChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {momChange >= 0 ? '+' : ''}{momChange}
                      </td>
                      <td className="py-3.5 px-4 text-right text-muted-foreground">{r.samePeriodLastYear.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.cumulativeLiveWeightTons}</td>
                      <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                      <td className="py-3.5 px-4 text-center">
                        <ActionMenu
                          entityName="dữ liệu chăn nuôi"
                          onView={() => { setActiveRecord({ ...r, _dataset: 'livestock' }); setIsDetailOpen(true); }}
                          onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => { setFormType('livestock'); setFormRecord({ ...r }); setIsFormOpen(true); } : undefined}
                          onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setLivestock((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ────────── TAB: Aquaculture ────────── */}
      {activeTab === 'aquaculture' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aqua.map((r) => (
            <Card key={r.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Fish className="size-4 text-blue-500" />
                  <WorkflowStatusBadge status={r.workflowStatus} />
                </div>
                <CardTitle className="text-sm font-bold text-foreground leading-snug">{r.type}</CardTitle>
                <p className="text-[10px] text-muted-foreground">{r.reportingPeriod}</p>
              </CardHeader>
              <CardContent className="pt-3 border-t border-border/40 space-y-1.5">
                {r.areaHa > 0 && (
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Diện tích ao nuôi</span>
                    <span className="font-bold text-foreground">{r.areaHa} ha</span>
                  </div>
                )}
                {r.cageCount > 0 && (
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Số lồng bè</span>
                    <span className="font-bold text-foreground">{r.cageCount} lồng</span>
                  </div>
                )}
                {r.farmedOutputTons > 0 && (
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Sản lượng nuôi trồng</span>
                    <span className="font-bold text-foreground">{r.farmedOutputTons} tấn</span>
                  </div>
                )}
                {r.naturalCatchTons > 0 && (
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Khai thác tự nhiên</span>
                    <span className="font-bold text-foreground">{r.naturalCatchTons} tấn</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] pt-1 border-t border-border/40">
                  <span className="text-muted-foreground font-semibold">Tổng lũy kế</span>
                  <span className="font-bold text-emerald-600">{r.cumulativeOutputTons} tấn</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ────────── TAB: Forest ────────── */}
      {activeTab === 'forest' && (
        <div className="space-y-4">
          <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Loại rừng</th>
                    <th className="py-3.5 px-4 text-right">Tổng diện tích (ha)</th>
                    <th className="py-3.5 px-4 text-right">Trồng mới (ha)</th>
                    <th className="py-3.5 px-4 text-right">Khai thác (ha)</th>
                    <th className="py-3.5 px-4 text-right">Sản lượng (m³)</th>
                    <th className="py-3.5 px-4 text-right">Độ che phủ (%)</th>
                    <th className="py-3.5 px-4">Quy trình</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {forests.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                        <TreePine className="size-3.5 text-green-700 shrink-0" /> {r.forestType}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.totalAreaHa.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right text-emerald-600 font-bold">+{r.newPlantingAreaHa}</td>
                      <td className="py-3.5 px-4 text-right text-amber-600 font-bold">{r.harvestedAreaHa}</td>
                      <td className="py-3.5 px-4 text-right text-foreground font-bold">{r.outputM3 > 0 ? r.outputM3.toLocaleString() : '—'}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.coverageRate > 0 ? `${r.coverageRate}%` : '—'}</td>
                      <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/20 border-t border-border/60">
                  <tr>
                    <td className="py-3 px-4 font-bold text-foreground">Tổng cộng</td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">{forests.reduce((s, r) => s + r.totalAreaHa, 0).toLocaleString()} ha</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">+{forests.reduce((s, r) => s + r.newPlantingAreaHa, 0)}</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">{forests.reduce((s, r) => s + r.harvestedAreaHa, 0)}</td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">{forests.reduce((s, r) => s + r.outputM3, 0).toLocaleString()} m³</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">42.8%</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ────────── TAB: Pollution ────────── */}
      {activeTab === 'pollution' && (
        <div className="space-y-3">
          {pollutions.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((r) => (
            <Card key={r.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
              <CardContent className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${SEVERITY_CONFIG[r.severity].className}`}>
                      {SEVERITY_CONFIG[r.severity].label}
                    </Badge>
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${r.status === 'Active' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : r.status === 'Treated' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                      {r.status === 'Active' ? 'Đang tồn tại' : r.status === 'Treated' ? 'Đã xử lý' : 'Đang theo dõi'}
                    </Badge>
                    <WorkflowStatusBadge status={r.workflowStatus} />
                  </div>
                  <h3 className="text-xs font-bold text-foreground leading-snug">{r.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{getVillageName(r.villageCode)} &nbsp;|&nbsp; Loại ô nhiễm: <span className="font-semibold text-foreground">{r.pollutionType}</span></p>
                </div>
                <Button onClick={() => { setActiveRecord({ ...r, _dataset: 'pollution' }); setIsDetailOpen(true); }} variant="outline" size="xs" className="h-7 w-7 p-0 cursor-pointer border-border shrink-0">
                  <Eye className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ────────── TAB: Environment ────────── */}
      {activeTab === 'environment' && (
        <div className="space-y-4">
          <Card className="border-border bg-card shadow-2xs overflow-hidden">
            <CardHeader className="pb-3 pt-4 px-5 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Droplets className="size-4 text-blue-500" />
                Chỉ tiêu Nước sạch &amp; Vệ sinh môi trường (2026-Q1)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {envSummary.map((r) => {
                const pct = Math.min((r.value / r.target) * 100, 100);
                const isOnTrack = r.value >= r.target * 0.9;
                return (
                  <div key={r.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <TrendIcon trend={r.trend} />
                        <span className="text-xs font-semibold text-foreground truncate">{r.indicator}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-bold ${isOnTrack ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {r.value}{r.unit}
                        </span>
                        <span className="text-[10px] text-muted-foreground">/ KH: {r.target}{r.unit}</span>
                        <WorkflowStatusBadge status={r.workflowStatus} />
                      </div>
                    </div>
                    <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${isOnTrack ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Waste collection quick stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Điểm thu gom rác cố định', value: '14 điểm', icon: TrashIcon },
              { label: 'Xe thu gom vệ sinh', value: '3 xe', icon: Trash2 },
              { label: 'Hộ ký hợp đồng thu gom', value: '2.840 hộ', icon: Droplets },
            ].map((item) => (
              <Card key={item.label} className="border-border bg-card p-4 flex items-center gap-3">
                <item.icon className="size-5 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">{item.label}</span>
                  <p className="text-sm font-bold text-foreground">{item.value}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── Detail Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Chi tiết CSDL Nông nghiệp &amp; Môi trường</DialogTitle>
            <DialogDescription className="text-xs">Trích xuất dữ liệu CSDL xã Lao Bảo</DialogDescription>
          </DialogHeader>

          {activeRecord && (
            <div className="space-y-3 py-2 text-xs">
              {activeRecord._dataset === 'crop' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên cây trồng</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.cropName}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Diện tích gieo trồng</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.plantedAreaHa} ha</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Diện tích thu hoạch</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.harvestAreaHa} ha</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Sản lượng</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.outputTons} tấn</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Kỳ trước</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.previousPeriodOutputTons} tấn</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Cùng kỳ năm trước</span>
                      <p className={`font-bold mt-0.5 ${activeRecord.outputTons >= activeRecord.samePeriodLastYearOutputTons ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {activeRecord.samePeriodLastYearOutputTons} tấn
                      </p>
                    </div>
                  </div>
                </>
              )}

              {activeRecord._dataset === 'livestock' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Loại vật nuôi</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.animalType}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tổng đàn</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.totalHerd.toLocaleString()} con</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tháng trước</span>
                      <p className="font-bold text-muted-foreground mt-0.5">{activeRecord.previousMonth.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Trọng lượng lũy kế</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.cumulativeLiveWeightTons} tấn</p>
                    </div>
                  </div>
                </>
              )}

              {activeRecord._dataset === 'pollution' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên điểm ô nhiễm</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.name}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Loại ô nhiễm</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.pollutionType}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Mức độ</span>
                      <p className={`font-bold mt-0.5 ${SEVERITY_CONFIG[activeRecord.severity].className.split(' ')[1]}`}>
                        {SEVERITY_CONFIG[activeRecord.severity].label}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Thôn</span>
                      <p className="font-bold text-foreground mt-0.5">{getVillageName(activeRecord.villageCode)}</p>
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

      {/* ─── Add / Edit Form Dialog ────────────────────────────────────────── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id ? 'Cập nhật' : 'Thêm mới'} — {formType === 'crop' ? 'Cây trồng' : 'Chăn nuôi'}
            </DialogTitle>
            <DialogDescription className="text-xs">Nhập các tham số sản xuất nông nghiệp xã Lao Bảo.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            {formType === 'crop' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Nhóm cây trồng</label>
                    <Input value={formRecord.cropCategory || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, cropCategory: e.target.value }))} placeholder="VD: Lúa, Cây công nghiệp..." className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Tên cây trồng</label>
                    <Input value={formRecord.cropName || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, cropName: e.target.value }))} placeholder="VD: Cà phê Arabica..." className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Kỳ báo cáo</label>
                    <Input value={formRecord.reportingPeriod || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, reportingPeriod: e.target.value }))} placeholder="2026-Q1" className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">DT gieo (ha)</label>
                    <Input type="number" step="0.1" value={formRecord.plantedAreaHa || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, plantedAreaHa: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">DT thu hoạch (ha)</label>
                    <Input type="number" step="0.1" value={formRecord.harvestAreaHa || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, harvestAreaHa: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Sản lượng (tấn)</label>
                    <Input type="number" step="0.1" value={formRecord.outputTons || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, outputTons: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                </div>
              </>
            )}

            {formType === 'livestock' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Loại gia súc / gia cầm</label>
                    <Input value={formRecord.animalType || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, animalType: e.target.value }))} placeholder="VD: Trâu, Bò, Lợn..." className="bg-background border-border text-xs h-9 shadow-none" />
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Tổng đàn (con)</label>
                    <Input type="number" value={formRecord.totalHerd || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, totalHerd: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Trọng lượng lũy kế (tấn HH)</label>
                    <Input type="number" step="0.1" value={formRecord.cumulativeLiveWeightTons || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, cumulativeLiveWeightTons: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Kỳ báo cáo</label>
                  <Input value={formRecord.reportingPeriod || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, reportingPeriod: e.target.value }))} placeholder="2026-Q1" className="bg-background border-border text-xs h-9 shadow-none" />
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
