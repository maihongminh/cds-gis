// src/app/dashboard/land-planning/page.tsx

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
  Map,
  Layers,
  Building2,
  TreePine,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileSpreadsheet,
  MapPin,
  Calendar,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from 'lucide-react';
import { toast } from 'sonner';
import { ActionMenu, PageHeader } from '@/components/common';
import { WorkflowStatusBadge } from '@/components/common/WorkflowStatusBadge';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { WorkflowStatus } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type LandType =
  | 'Residential'
  | 'Agricultural'
  | 'Forestry'
  | 'Commercial'
  | 'Public'
  | 'Defense'
  | 'Unused';

type PlanStatus = 'Approved' | 'Draft' | 'UnderReview' | 'Expired';
type InfraCondition = 'Good' | 'Fair' | 'Poor' | 'UnderConstruction';

interface LandUseRecord {
  id: string;
  landType: LandType;
  areaHa: number;
  villageCode: string;
  reportingPeriod: string;
  note: string;
  workflowStatus: WorkflowStatus;
}

interface PlanningRecord {
  id: string;
  planName: string;
  approvalAuthority: string;
  planningPeriod: string;
  approvalDate: string;
  status: PlanStatus;
  attachmentNote: string;
  workflowStatus: WorkflowStatus;
}

interface InfrastructureRecord {
  id: string;
  name: string;
  structureType: string;
  villageCode: string;
  managingUnit: string;
  condition: InfraCondition;
  operatingStatus: 'Active' | 'Inactive' | 'UnderConstruction';
  workflowStatus: WorkflowStatus;
}

interface UrbanDevelopmentRecord {
  id: string;
  name: string;
  type: string;
  areaHa: number;
  status: 'Planning' | 'UnderDevelopment' | 'Completed';
  workflowStatus: WorkflowStatus;
}

interface PublicInvestmentRecord {
  id: string;
  projectName: string;
  category: string;
  totalBudgetBillion: number;
  disbursedBillion: number;
  disbursementRate: number;
  villageCode: string;
  contractor: string;
  startDate: string;
  expectedEndDate: string;
  progressPercent: number;
  status: 'InProgress' | 'Completed' | 'Paused';
  workflowStatus: WorkflowStatus;
}

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const LAND_USE_DATA: LandUseRecord[] = [
  { id: 'lu-1', landType: 'Agricultural', areaHa: 3420, villageCode: 'ka-tang', reportingPeriod: '2026-Q1', note: 'Đất lúa và cây trồng ngắn ngày', workflowStatus: 'published' },
  { id: 'lu-2', landType: 'Forestry', areaHa: 2180, villageCode: 'lang-vay', reportingPeriod: '2026-Q1', note: 'Rừng phòng hộ và rừng sản xuất', workflowStatus: 'published' },
  { id: 'lu-3', landType: 'Residential', areaHa: 512, villageCode: 'vinh-dong', reportingPeriod: '2026-Q1', note: 'Đất ở nông thôn và đất ở đô thị hóa', workflowStatus: 'published' },
  { id: 'lu-4', landType: 'Commercial', areaHa: 187, villageCode: 'vinh-dong', reportingPeriod: '2026-Q1', note: 'Đất thương mại, dịch vụ cửa khẩu', workflowStatus: 'published' },
  { id: 'lu-5', landType: 'Public', areaHa: 893, villageCode: 'tan-kim', reportingPeriod: '2026-Q1', note: 'Đất công cộng: trường học, trạm y tế, trụ sở', workflowStatus: 'unit_approved' },
  { id: 'lu-6', landType: 'Defense', areaHa: 445, villageCode: 'trieu-phuoc', reportingPeriod: '2026-Q1', note: 'Đất quốc phòng - an ninh biên giới', workflowStatus: 'published' },
  { id: 'lu-7', landType: 'Unused', areaHa: 666, villageCode: 'tay-chin', reportingPeriod: '2026-Q1', note: 'Đất chưa sử dụng, đất bằng chưa khai thác', workflowStatus: 'draft' },
];

const PLANNING_DATA: PlanningRecord[] = [
  {
    id: 'plan-1',
    planName: 'Quy hoạch sử dụng đất xã Lao Bảo giai đoạn 2021–2030',
    approvalAuthority: 'UBND Tỉnh Quảng Trị',
    planningPeriod: '2021–2030',
    approvalDate: '2021-06-15',
    status: 'Approved',
    attachmentNote: 'Bản đồ quy hoạch 1/5000 đã phê duyệt',
    workflowStatus: 'published',
  },
  {
    id: 'plan-2',
    planName: 'Quy hoạch xây dựng khu dân cư mới Ka Tăng',
    approvalAuthority: 'Sở Xây dựng tỉnh Quảng Trị',
    planningPeriod: '2024–2028',
    approvalDate: '2024-03-10',
    status: 'Approved',
    attachmentNote: 'Bản đồ thiết kế đô thị cư dân biên giới',
    workflowStatus: 'published',
  },
  {
    id: 'plan-3',
    planName: 'Điều chỉnh quy hoạch khu thương mại cửa khẩu Lao Bảo',
    approvalAuthority: 'UBND tỉnh Quảng Trị',
    planningPeriod: '2025–2035',
    approvalDate: '',
    status: 'UnderReview',
    attachmentNote: 'Đang trình hội đồng thẩm định cấp tỉnh',
    workflowStatus: 'submitted',
  },
];

const INFRA_DATA: InfrastructureRecord[] = [
  { id: 'inf-1', name: 'Trụ sở UBND xã Lao Bảo', structureType: 'Administrative', villageCode: 'vinh-dong', managingUnit: 'Văn phòng HĐND-UBND xã', condition: 'Good', operatingStatus: 'Active', workflowStatus: 'published' },
  { id: 'inf-2', name: 'Trường THCS Lao Bảo', structureType: 'Education', villageCode: 'vinh-dong', managingUnit: 'Phòng Văn hóa - Xã hội', condition: 'Good', operatingStatus: 'Active', workflowStatus: 'published' },
  { id: 'inf-3', name: 'Trạm Y tế xã Lao Bảo', structureType: 'Healthcare', villageCode: 'vinh-dong', managingUnit: 'Sở Y tế tỉnh Quảng Trị', condition: 'Good', operatingStatus: 'Active', workflowStatus: 'published' },
  { id: 'inf-4', name: 'Đường liên thôn Ka Tăng - Vĩnh Đông (DH.23)', structureType: 'Road', villageCode: 'ka-tang', managingUnit: 'Sở GTVT tỉnh Quảng Trị', condition: 'Fair', operatingStatus: 'Active', workflowStatus: 'published' },
  { id: 'inf-5', name: 'Nhà văn hóa thôn Làng Vây', structureType: 'Cultural', villageCode: 'lang-vay', managingUnit: 'Phòng Văn hóa - Xã hội', condition: 'UnderConstruction', operatingStatus: 'UnderConstruction', workflowStatus: 'unit_approved' },
  { id: 'inf-6', name: 'Hệ thống cấp nước sạch liên thôn Tân Kim - Tân Phước', structureType: 'WaterSupply', villageCode: 'tan-kim', managingUnit: 'Sở NN&PTNT tỉnh Quảng Trị', condition: 'Good', operatingStatus: 'Active', workflowStatus: 'published' },
  { id: 'inf-7', name: 'Kè chống sạt lở bờ sông Sê Pôn (Đoạn Ka Tăng)', structureType: 'Hydraulic', villageCode: 'ka-tang', managingUnit: 'Sở NN&PTNT tỉnh Quảng Trị', condition: 'UnderConstruction', operatingStatus: 'UnderConstruction', workflowStatus: 'draft' },
];

const URBAN_DATA: UrbanDevelopmentRecord[] = [
  { id: 'ud-1', name: 'Khu dân cư mới Ka Tăng', type: 'ResidentialZone', areaHa: 28.5, status: 'UnderDevelopment', workflowStatus: 'unit_approved' },
  { id: 'ud-2', name: 'Khu thương mại phi thuế quan cửa khẩu Lao Bảo', type: 'CommercialZone', areaHa: 65.0, status: 'Completed', workflowStatus: 'published' },
  { id: 'ud-3', name: 'Khu tái định cư Tân Thành', type: 'ResettlementZone', areaHa: 12.3, status: 'Planning', workflowStatus: 'draft' },
];

const INVESTMENT_DATA: PublicInvestmentRecord[] = [
  {
    id: 'inv-1',
    projectName: 'Nâng cấp đường Ka Tăng - Khe Đá',
    category: 'Giao thông',
    totalBudgetBillion: 8.5,
    disbursedBillion: 6.8,
    disbursementRate: 80,
    villageCode: 'ka-tang',
    contractor: 'Công ty TNHH XD Hướng Hóa',
    startDate: '2025-03-01',
    expectedEndDate: '2026-12-31',
    progressPercent: 80,
    status: 'InProgress',
    workflowStatus: 'published',
  },
  {
    id: 'inv-2',
    projectName: 'Xây dựng Nhà văn hóa Làng Vây',
    category: 'Văn hóa - Xã hội',
    totalBudgetBillion: 3.2,
    disbursedBillion: 2.4,
    disbursementRate: 75,
    villageCode: 'lang-vay',
    contractor: 'Công ty CP XD Quảng Trị',
    startDate: '2025-06-01',
    expectedEndDate: '2026-11-30',
    progressPercent: 75,
    status: 'InProgress',
    workflowStatus: 'published',
  },
  {
    id: 'inv-3',
    projectName: 'Hệ thống tưới tiêu thôn Tân Kim - Tân Phước',
    category: 'Thủy lợi',
    totalBudgetBillion: 5.6,
    disbursedBillion: 5.6,
    disbursementRate: 100,
    villageCode: 'tan-kim',
    contractor: 'Công ty TNHH TL Miền Trung',
    startDate: '2024-07-01',
    expectedEndDate: '2025-12-31',
    progressPercent: 100,
    status: 'Completed',
    workflowStatus: 'published',
  },
  {
    id: 'inv-4',
    projectName: 'Kè chống sạt lở bờ sông Sê Pôn đoạn Ka Tăng',
    category: 'Phòng chống thiên tai',
    totalBudgetBillion: 12.0,
    disbursedBillion: 3.1,
    disbursementRate: 26,
    villageCode: 'ka-tang',
    contractor: 'Chưa lựa chọn nhà thầu',
    startDate: '2026-04-01',
    expectedEndDate: '2027-06-30',
    progressPercent: 22,
    status: 'InProgress',
    workflowStatus: 'unit_approved',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LAND_TYPE_LABELS: Record<LandType, string> = {
  Residential: 'Đất ở',
  Agricultural: 'Đất nông nghiệp',
  Forestry: 'Đất lâm nghiệp',
  Commercial: 'Đất thương mại',
  Public: 'Đất công cộng',
  Defense: 'Đất quốc phòng - AN',
  Unused: 'Đất chưa sử dụng',
};

const LAND_TYPE_COLORS: Record<LandType, string> = {
  Residential: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Agricultural: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Forestry: 'bg-green-700/10 text-green-700 border-green-700/20',
  Commercial: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Public: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  Defense: 'bg-rose-700/10 text-rose-700 border-rose-700/20',
  Unused: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
};

const INFRA_TYPE_LABELS: Record<string, string> = {
  Administrative: 'Trụ sở - Hành chính',
  Education: 'Giáo dục',
  Healthcare: 'Y tế',
  Road: 'Giao thông',
  Cultural: 'Văn hóa',
  WaterSupply: 'Cấp nước',
  Hydraulic: 'Thủy lợi',
};

const CONDITION_CONFIG: Record<InfraCondition, { label: string; className: string }> = {
  Good: { label: 'Tốt', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  Fair: { label: 'Trung bình', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  Poor: { label: 'Xuống cấp', className: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
  UnderConstruction: { label: 'Đang thi công', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
};

const getVillageName = (code: string) => {
  const v = VILLAGES.find((vv) => vv.code === code);
  return v ? `Thôn ${v.name}` : code;
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LandPlanningPage() {
  const { currentRole } = useTenant();
  const [activeTab, setActiveTab] = React.useState('land-use');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Datasets (local state for CRUD simulation)
  const [landUseRecords, setLandUseRecords] = React.useState<LandUseRecord[]>(LAND_USE_DATA);
  const [planningRecords, setPlanningRecords] = React.useState<PlanningRecord[]>(PLANNING_DATA);
  const [infraRecords, setInfraRecords] = React.useState<InfrastructureRecord[]>(INFRA_DATA);
  const [urbanRecords] = React.useState<UrbanDevelopmentRecord[]>(URBAN_DATA);
  const [investmentRecords, setInvestmentRecords] = React.useState<PublicInvestmentRecord[]>(INVESTMENT_DATA);

  // Detail dialog
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<any | null>(null);

  // Form dialog
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formType, setFormType] = React.useState<'land-use' | 'infra'>('land-use');
  const [formRecord, setFormRecord] = React.useState<any>({});

  // ─── Summary KPIs ─────────────────────────────────────────────────────────
  const summaryStats = React.useMemo(() => {
    const totalLandHa = landUseRecords.reduce((s, r) => s + r.areaHa, 0);
    const approvedPlans = planningRecords.filter((p) => p.status === 'Approved').length;
    const infraCount = infraRecords.length;
    const activeInvestment = investmentRecords.filter((i) => i.status === 'InProgress').length;
    return { totalLandHa, approvedPlans, infraCount, activeInvestment };
  }, [landUseRecords, planningRecords, infraRecords, investmentRecords]);

  // ─── Workflow Action ───────────────────────────────────────────────────────
  const handleWorkflowAction = (rec: any, dataset: string, nextStatus: WorkflowStatus) => {
    if (dataset === 'land-use') {
      setLandUseRecords((prev) => prev.map((r) => (r.id === rec.id ? { ...r, workflowStatus: nextStatus } : r)));
    } else if (dataset === 'planning') {
      setPlanningRecords((prev) => prev.map((r) => (r.id === rec.id ? { ...r, workflowStatus: nextStatus } : r)));
    } else if (dataset === 'infra') {
      setInfraRecords((prev) => prev.map((r) => (r.id === rec.id ? { ...r, workflowStatus: nextStatus } : r)));
    } else if (dataset === 'investment') {
      setInvestmentRecords((prev) => prev.map((r) => (r.id === rec.id ? { ...r, workflowStatus: nextStatus } : r)));
    }
    toast.success('Đã cập nhật trạng thái quy trình phê duyệt!');
    setIsDetailOpen(false);
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = (id: string, dataset: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa: ${name}?`)) return;
    if (dataset === 'land-use') setLandUseRecords((prev) => prev.filter((r) => r.id !== id));
    else if (dataset === 'infra') setInfraRecords((prev) => prev.filter((r) => r.id !== id));
    toast.info(`Đã xóa bản ghi: ${name}`);
  };

  // ─── Form Save ─────────────────────────────────────────────────────────────
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === 'land-use') {
      if (formRecord.id) {
        setLandUseRecords((prev) => prev.map((r) => (r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: 'draft' as WorkflowStatus } : r)));
        toast.success('Đã cập nhật hiện trạng sử dụng đất!');
      } else {
        const newRec: LandUseRecord = {
          id: `lu-${Date.now()}`,
          landType: formRecord.landType || 'Unused',
          areaHa: Number(formRecord.areaHa) || 0,
          villageCode: formRecord.villageCode || VILLAGES[0].code,
          reportingPeriod: formRecord.reportingPeriod || '2026-Q1',
          note: formRecord.note || '',
          workflowStatus: 'draft',
        };
        setLandUseRecords((prev) => [newRec, ...prev]);
        toast.success('Đã thêm mới bản ghi hiện trạng sử dụng đất!');
      }
    } else if (formType === 'infra') {
      if (formRecord.id) {
        setInfraRecords((prev) => prev.map((r) => (r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: 'draft' as WorkflowStatus } : r)));
        toast.success('Đã cập nhật công trình hạ tầng!');
      } else {
        const newRec: InfrastructureRecord = {
          id: `inf-${Date.now()}`,
          name: formRecord.name || 'Công trình mới',
          structureType: formRecord.structureType || 'Administrative',
          villageCode: formRecord.villageCode || VILLAGES[0].code,
          managingUnit: formRecord.managingUnit || '',
          condition: formRecord.condition || 'Good',
          operatingStatus: formRecord.operatingStatus || 'Active',
          workflowStatus: 'draft',
        };
        setInfraRecords((prev) => [newRec, ...prev]);
        toast.success('Đã thêm mới công trình hạ tầng!');
      }
    }
    setIsFormOpen(false);
  };

  // ─── Filtered data ─────────────────────────────────────────────────────────
  const filteredLandUse = React.useMemo(
    () => landUseRecords.filter((r) => LAND_TYPE_LABELS[r.landType].toLowerCase().includes(searchQuery.toLowerCase()) || getVillageName(r.villageCode).toLowerCase().includes(searchQuery.toLowerCase())),
    [landUseRecords, searchQuery]
  );

  const filteredPlanning = React.useMemo(
    () => planningRecords.filter((r) => r.planName.toLowerCase().includes(searchQuery.toLowerCase())),
    [planningRecords, searchQuery]
  );

  const filteredInfra = React.useMemo(
    () => infraRecords.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [infraRecords, searchQuery]
  );

  // ─── Workflow Buttons (shared) ─────────────────────────────────────────────
  const renderWorkflowButtons = (rec: any, dataset: string) => {
    const s = rec.workflowStatus as WorkflowStatus;
    return (
      <div className="flex flex-wrap gap-2 pt-2 justify-end border-t border-border/40">
        {s === 'draft' && (currentRole === 'admin' || currentRole === 'data_officer') && (
          <Button onClick={() => handleWorkflowAction(rec, dataset, 'submitted')} size="xs" className="h-8 text-xs cursor-pointer shadow-none">
            Trình phê duyệt
          </Button>
        )}
        {s === 'submitted' && currentRole === 'unit_leader' && (
          <>
            <Button onClick={() => handleWorkflowAction(rec, dataset, 'returned')} variant="destructive" size="xs" className="h-8 text-xs cursor-pointer shadow-none">
              Trả lại
            </Button>
            <Button onClick={() => handleWorkflowAction(rec, dataset, 'unit_approved')} size="xs" className="h-8 text-xs cursor-pointer shadow-none bg-emerald-600 hover:bg-emerald-700">
              Ký duyệt cấp phòng
            </Button>
          </>
        )}
        {['submitted', 'unit_approved'].includes(s) && (currentRole === 'data_governance' || currentRole === 'admin') && (
          <>
            <Button onClick={() => handleWorkflowAction(rec, dataset, 'returned')} variant="destructive" size="xs" className="h-8 text-xs cursor-pointer shadow-none">
              Trả lại
            </Button>
            <Button onClick={() => handleWorkflowAction(rec, dataset, 'published')} size="xs" className="h-8 text-xs cursor-pointer shadow-none">
              Công bố chính thức
            </Button>
          </>
        )}
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Map className="w-6 h-6 text-primary" />
            CSDL Đất đai, Quy hoạch &amp; Xây dựng
          </>
        }
        description="Chủ trì bởi Phòng Kinh tế xã Lao Bảo. Cập nhật 06 tháng/lần hoặc khi có biến động sử dụng đất."
        actions={
          <>
            <Button
              onClick={() => toast.success('Đang kết xuất báo cáo Đất đai & Quy hoạch xã Lao Bảo...')}
              variant="outline"
              size="sm"
              className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border"
            >
              <FileSpreadsheet className="size-4" />
              Báo cáo đất đai
            </Button>
            {(currentRole === 'admin' || currentRole === 'data_officer') && (
              <Button
                onClick={() => {
                  setFormType(activeTab === 'infra' ? 'infra' : 'land-use');
                  setFormRecord(activeTab === 'infra' ? { name: '', structureType: 'Administrative', villageCode: VILLAGES[0].code, managingUnit: '', condition: 'Good', operatingStatus: 'Active' } : { landType: 'Agricultural', areaHa: '', villageCode: VILLAGES[0].code, reportingPeriod: '2026-Q1', note: '' });
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
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0"><Map className="size-5" /></div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Tổng diện tích đất</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{summaryStats.totalLandHa.toLocaleString()} ha</h3>
          </div>
        </Card>
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0"><CheckCircle2 className="size-5" /></div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Quy hoạch đã phê duyệt</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{summaryStats.approvedPlans} đồ án</h3>
          </div>
        </Card>
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0"><Building2 className="size-5" /></div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Công trình hạ tầng</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{summaryStats.infraCount} công trình</h3>
          </div>
        </Card>
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0"><BarChart3 className="size-5" /></div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Dự án đang triển khai</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{summaryStats.activeInvestment} dự án</h3>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px">
        {[
          { id: 'land-use', label: 'Hiện trạng sử dụng đất' },
          { id: 'planning', label: 'Quy hoạch & Xây dựng' },
          { id: 'infra', label: 'Hạ tầng kỹ thuật & Công trình' },
          { id: 'urban', label: 'Khu vực phát triển đô thị' },
          { id: 'investment', label: 'Dự án đầu tư công' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      {activeTab !== 'urban' && (
        <Card className="border-border bg-card shadow-2xs">
          <CardContent className="p-4">
            <Input
              placeholder="Tìm kiếm theo tên, loại đất, thôn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border text-xs h-9 shadow-none"
            />
          </CardContent>
        </Card>
      )}

      {/* ──────────────────── TAB: Land Use ──────────────────── */}
      {activeTab === 'land-use' && (
        <div className="space-y-3">
          {/* Land use breakdown chart */}
          <Card className="border-border bg-card shadow-2xs overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-foreground">Cơ cấu phân loại đất xã Lao Bảo (2026-Q1)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {landUseRecords.map((r) => {
                  const pct = ((r.areaHa / summaryStats.totalLandHa) * 100).toFixed(1);
                  return (
                    <div key={r.id} className="flex items-center gap-3">
                      <span className="w-36 text-[10px] font-semibold text-muted-foreground shrink-0 truncate">{LAND_TYPE_LABELS[r.landType]}</span>
                      <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-foreground w-14 text-right shrink-0">{r.areaHa.toLocaleString()} ha</span>
                      <span className="text-[10px] text-muted-foreground w-10 text-right shrink-0">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="py-0!">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Loại đất</th>
                    <th className="py-3.5 px-4">Thôn</th>
                    <th className="py-3.5 px-4 text-right">Diện tích (ha)</th>
                    <th className="py-3.5 px-4">Kỳ báo cáo</th>
                    <th className="py-3.5 px-4">Ghi chú</th>
                    <th className="py-3.5 px-4">Quy trình</th>
                    <th className="py-3.5 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {filteredLandUse.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${LAND_TYPE_COLORS[r.landType]}`}>
                          {LAND_TYPE_LABELS[r.landType]}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.areaHa.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">{r.reportingPeriod}</td>
                      <td className="py-3.5 px-4 text-muted-foreground max-w-[200px] truncate">{r.note}</td>
                      <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                      <td className="py-3.5 px-4 text-center">
                        <ActionMenu
                          entityName="dữ liệu sử dụng đất"
                          onView={() => { setActiveRecord({ ...r, _dataset: 'land-use' }); setIsDetailOpen(true); }}
                          onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => { setFormType('land-use'); setFormRecord({ ...r }); setIsFormOpen(true); } : undefined}
                          onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setLandUseRecords((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
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

      {/* ──────────────────── TAB: Planning ──────────────────── */}
      {activeTab === 'planning' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlanning.map((p) => (
            <Card key={p.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
              <CardHeader className="pb-3 flex flex-row items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${p.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      p.status === 'UnderReview' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        'bg-muted/40 text-muted-foreground border-border'
                      }`}>
                      {p.status === 'Approved' ? 'Đã phê duyệt' : p.status === 'UnderReview' ? 'Đang thẩm định' : p.status === 'Draft' ? 'Dự thảo' : 'Hết hiệu lực'}
                    </Badge>
                    <WorkflowStatusBadge status={p.workflowStatus} />
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground leading-tight mt-1">{p.planName}</CardTitle>
                </div>
                <Button onClick={() => { setActiveRecord({ ...p, _dataset: 'planning' }); setIsDetailOpen(true); }} variant="outline" size="xs" className="h-7 w-7 p-0 cursor-pointer border-border shrink-0">
                  <Eye className="size-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="pt-3 pb-4 border-t border-border/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <CheckCircle2 className="size-3.5" />
                  <span>Cơ quan phê duyệt: <span className="font-semibold text-foreground">{p.approvalAuthority}</span></span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>Thời kỳ quy hoạch: <span className="font-semibold text-foreground">{p.planningPeriod}</span></span>
                </div>
                {p.approvalDate && (
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    <span>Ngày phê duyệt: <span className="font-semibold text-foreground">{p.approvalDate}</span></span>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-1 bg-muted/20 p-2 rounded-lg border border-border/40">{p.attachmentNote}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ──────────────────── TAB: Infrastructure ──────────────────── */}
      {activeTab === 'infra' && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Tên công trình</th>
                  <th className="py-3.5 px-4">Loại hạ tầng</th>
                  <th className="py-3.5 px-4">Thôn</th>
                  <th className="py-3.5 px-4">Đơn vị quản lý</th>
                  <th className="py-3.5 px-4">Tình trạng</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredInfra.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate max-w-[200px]">{r.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{INFRA_TYPE_LABELS[r.structureType] || r.structureType}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-[160px] truncate">{r.managingUnit}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${CONDITION_CONFIG[r.condition].className}`}>
                        {CONDITION_CONFIG[r.condition].label}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                    <td className="py-3.5 px-4 text-center">
                      <ActionMenu
                        entityName="công trình hạ tầng"
                        onView={() => { setActiveRecord({ ...r, _dataset: 'infra' }); setIsDetailOpen(true); }}
                        onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => { setFormType('infra'); setFormRecord({ ...r }); setIsFormOpen(true); } : undefined}
                        onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setInfraRecords((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ──────────────────── TAB: Urban Development ──────────────────── */}
      {activeTab === 'urban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {urbanRecords.map((u) => (
            <Card key={u.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                  <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${u.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                    u.status === 'UnderDevelopment' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                      'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                    {u.status === 'Completed' ? 'Hoàn thành' : u.status === 'UnderDevelopment' ? 'Đang triển khai' : 'Lập quy hoạch'}
                  </Badge>
                  <WorkflowStatusBadge status={u.workflowStatus} />
                </div>
                <CardTitle className="text-sm font-bold text-foreground leading-tight">{u.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-3 border-t border-border/40 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Layers className="size-3.5" />
                  {u.type === 'ResidentialZone' ? 'Khu dân cư' : u.type === 'CommercialZone' ? 'Khu thương mại' : 'Khu tái định cư'}
                </span>
                <span className="text-xs font-bold text-foreground">{u.areaHa} ha</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ──────────────────── TAB: Public Investment ──────────────────── */}
      {activeTab === 'investment' && (
        <div className="space-y-4">
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Tổng ngân sách đầu tư', value: `${investmentRecords.reduce((s, r) => s + r.totalBudgetBillion, 0).toFixed(1)} tỷ đồng`, icon: BarChart3, color: 'text-primary' },
              { label: 'Đã giải ngân lũy kế', value: `${investmentRecords.reduce((s, r) => s + r.disbursedBillion, 0).toFixed(1)} tỷ đồng`, icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Tỷ lệ giải ngân bình quân', value: `${Math.round(investmentRecords.reduce((s, r) => s + r.disbursementRate, 0) / investmentRecords.length)}%`, icon: AlertCircle, color: 'text-amber-500' },
            ].map((item) => (
              <Card key={item.label} className="border-border bg-card p-4 flex items-center gap-3">
                <item.icon className={`size-5 shrink-0 ${item.color}`} />
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">{item.label}</span>
                  <h3 className="text-sm font-bold text-foreground">{item.value}</h3>
                </div>
              </Card>
            ))}
          </div>

          {/* Projects list */}
          <div className="space-y-3">
            {investmentRecords.filter((r) => r.projectName.toLowerCase().includes(searchQuery.toLowerCase())).map((r) => (
              <Card key={r.id} className="border-border bg-card shadow-2xs hover:shadow-xs transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${r.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                          r.status === 'InProgress' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                            'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}>
                          {r.status === 'Completed' ? 'Hoàn thành' : r.status === 'InProgress' ? 'Đang triển khai' : 'Tạm dừng'}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold uppercase text-muted-foreground border-border">
                          {r.category}
                        </Badge>
                        <WorkflowStatusBadge status={r.workflowStatus} />
                      </div>
                      <h3 className="text-sm font-bold text-foreground leading-snug">{r.projectName}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="size-3" /> {getVillageName(r.villageCode)} &nbsp;|&nbsp; Nhà thầu: {r.contractor}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-muted-foreground">Ngân sách</span>
                      <p className="text-sm font-bold text-foreground">{r.totalBudgetBillion} tỷ đ</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-semibold">
                      <span className="text-muted-foreground">Tiến độ thi công: <span className="text-foreground">{r.progressPercent}%</span></span>
                      <span className="text-muted-foreground">Giải ngân: <span className="text-emerald-600 font-bold">{r.disbursedBillion} / {r.totalBudgetBillion} tỷ ({r.disbursementRate}%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all bg-primary/70"
                        style={{ width: `${r.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                      <Calendar className="size-3.5" />
                      <span>Thời gian: {r.startDate} → {r.expectedEndDate}</span>
                    </div>
                  </div>

                  {/* View detail action */}
                  <div className="flex justify-end mt-3">
                    <Button
                      onClick={() => { setActiveRecord({ ...r, _dataset: 'investment' }); setIsDetailOpen(true); }}
                      variant="outline"
                      size="xs"
                      className="h-7 text-xs cursor-pointer border-border gap-1"
                    >
                      <Eye className="size-3.5" /> Xem chi tiết <ChevronRight className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── Detail Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Chi tiết CSDL Đất đai &amp; Quy hoạch</DialogTitle>
            <DialogDescription className="text-xs">Trích xuất dữ liệu CSDL xã Lao Bảo</DialogDescription>
          </DialogHeader>

          {activeRecord && (
            <div className="space-y-3 py-2 text-xs">
              {activeRecord._dataset === 'land-use' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Loại đất</span>
                    <p className="font-bold text-foreground mt-0.5">{LAND_TYPE_LABELS[activeRecord.landType as LandType]}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Diện tích</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.areaHa.toLocaleString()} ha</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Thôn</span>
                      <p className="font-bold text-foreground mt-0.5">{getVillageName(activeRecord.villageCode)}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Kỳ báo cáo</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.reportingPeriod}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Ghi chú</span>
                    <p className="font-medium text-foreground mt-0.5 leading-normal">{activeRecord.note}</p>
                  </div>
                  <p className="text-[9px] text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/40 italic">
                    * Ranh giới hình học là dữ liệu mô phỏng, không có giá trị pháp lý. Vui lòng tham chiếu bản đồ quy hoạch đã phê duyệt.
                  </p>
                </>
              )}

              {activeRecord._dataset === 'planning' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên đồ án quy hoạch</span>
                    <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.planName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Cơ quan phê duyệt</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.approvalAuthority}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Thời kỳ</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.planningPeriod}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Thông tin tài liệu đính kèm</span>
                    <p className="font-medium text-foreground mt-0.5">{activeRecord.attachmentNote}</p>
                  </div>
                </>
              )}

              {activeRecord._dataset === 'infra' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên công trình</span>
                    <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Loại hạ tầng</span>
                      <p className="font-bold text-foreground mt-0.5">{INFRA_TYPE_LABELS[activeRecord.structureType] || activeRecord.structureType}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tình trạng</span>
                      <p className="font-bold text-foreground mt-0.5">{CONDITION_CONFIG[activeRecord.condition as InfraCondition].label}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Đơn vị quản lý</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.managingUnit}</p>
                  </div>
                </>
              )}

              {activeRecord._dataset === 'investment' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên dự án đầu tư công</span>
                    <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.projectName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Ngân sách duyệt</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.totalBudgetBillion} tỷ đồng</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Đã giải ngân</span>
                      <p className="font-bold text-emerald-600 mt-0.5">{activeRecord.disbursedBillion} tỷ ({activeRecord.disbursementRate}%)</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tiến độ thi công</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.progressPercent}%</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Nhà thầu thi công</span>
                      <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.contractor}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Thời gian thi công</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.startDate} → {activeRecord.expectedEndDate}</p>
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

      {/* ─── Form Dialog ───────────────────────────────────────────────────── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id ? 'Cập nhật bản ghi' : 'Thêm mới bản ghi'} — {formType === 'land-use' ? 'Hiện trạng sử dụng đất' : 'Hạ tầng kỹ thuật'}
            </DialogTitle>
            <DialogDescription className="text-xs">Nhập các tham số định danh đất đai xã Lao Bảo.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            {formType === 'land-use' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Select
                      value={formRecord.landType || 'Agricultural'}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, landType: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Chọn loại đất" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        {(Object.keys(LAND_TYPE_LABELS) as LandType[]).map((k) => (
                          <SelectItem key={k} value={k} className="cursor-pointer">
                            {LAND_TYPE_LABELS[k]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Diện tích (ha)</label>
                    <Input type="number" step="0.01" value={formRecord.areaHa || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, areaHa: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
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
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Ghi chú / Mô tả loại đất</label>
                  <textarea value={formRecord.note || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, note: e.target.value }))} className="w-full min-h-[60px] rounded-md border border-border bg-background px-3 py-2 text-xs focus-visible:outline-hidden" />
                </div>
              </>
            )}

            {formType === 'infra' && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên công trình hạ tầng</label>
                  <Input value={formRecord.name || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, name: e.target.value }))} placeholder="Nhập tên công trình..." className="bg-background border-border text-xs h-9 shadow-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Select
                      value={formRecord.structureType || 'Administrative'}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, structureType: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Loại hạ tầng" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        {Object.entries(INFRA_TYPE_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k} className="cursor-pointer">
                            {v}
                          </SelectItem>
                        ))}
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Tình trạng kỹ thuật</label>
                    <Select
                      value={formRecord.condition || 'Good'}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, condition: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Tình trạng" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        {(Object.keys(CONDITION_CONFIG) as InfraCondition[]).map((k) => (
                          <SelectItem key={k} value={k} className="cursor-pointer">
                            {CONDITION_CONFIG[k].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Trạng thái hoạt động</label>
                    <Select
                      value={formRecord.operatingStatus || 'Active'}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, operatingStatus: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="Active" className="cursor-pointer">Đang hoạt động</SelectItem>
                        <SelectItem value="Inactive" className="cursor-pointer">Ngừng hoạt động</SelectItem>
                        <SelectItem value="UnderConstruction" className="cursor-pointer">Đang thi công</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Đơn vị quản lý</label>
                  <Input value={formRecord.managingUnit || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, managingUnit: e.target.value }))} className="bg-background border-border text-xs h-9 shadow-none" />
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
