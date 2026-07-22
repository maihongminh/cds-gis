// src/app/dashboard/education-health/page.tsx
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
  GraduationCap,
  Stethoscope,
  ShieldPlus,
  Syringe,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { ActionMenu, PageHeader } from '@/components/common';
import { WorkflowStatusBadge } from '@/components/common/WorkflowStatusBadge';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { WorkflowStatus } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type EducationLevel = 'Mầm non' | 'Tiểu học' | 'THCS';
type NationalStandard = 'Mức 1' | 'Mức 2' | 'Chưa đạt';
type SchoolStatus = 'Active' | 'Renovation' | 'Merged';
type FacilityType = 'TrampYte' | 'PhongKham' | 'NhaThuoc';

interface SchoolRecord {
  id: string;
  name: string;
  educationLevel: EducationLevel;
  villageCode: string;
  classCount: number;
  teacherCount: number;
  studentCount: number;
  nationalStandard: NationalStandard;
  status: SchoolStatus;
  workflowStatus: WorkflowStatus;
}

interface EducationIndicator {
  id: string;
  period: string;
  educationLevel: EducationLevel;
  schoolCount: number;
  classCount: number;
  teacherCount: number;
  studentCount: number;
  nationalStandardRate: number;
  workflowStatus: WorkflowStatus;
}

interface HealthFacility {
  id: string;
  name: string;
  facilityType: FacilityType;
  villageCode: string;
  staffingCount: number;
  bedsCount: number;
  status: 'Active' | 'Inactive';
  workflowStatus: WorkflowStatus;
}

interface HealthInsuranceRecord {
  id: string;
  period: string;
  villageCode: string;
  totalHouseholds: number;
  insuredPersons: number;
  coverageRate: number;
  workflowStatus: WorkflowStatus;
}

interface HealthIndicator {
  id: string;
  metricName: string;
  value: number;
  unit: string;
  target: number;
  period: string;
  source: string;
  workflowStatus: WorkflowStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SCHOOL_DATA: SchoolRecord[] = [
  {
    id: 'sch-1',
    name: 'Trường Mầm non Lao Bảo',
    educationLevel: 'Mầm non',
    villageCode: 'vinh-dong',
    classCount: 8,
    teacherCount: 16,
    studentCount: 210,
    nationalStandard: 'Mức 1',
    status: 'Active',
    workflowStatus: 'published',
  },
  {
    id: 'sch-2',
    name: 'Trường Tiểu học Lao Bảo',
    educationLevel: 'Tiểu học',
    villageCode: 'vinh-dong',
    classCount: 15,
    teacherCount: 24,
    studentCount: 480,
    nationalStandard: 'Mức 2',
    status: 'Active',
    workflowStatus: 'published',
  },
  {
    id: 'sch-3',
    name: 'Trường Tiểu học Làng Vây',
    educationLevel: 'Tiểu học',
    villageCode: 'lang-vay',
    classCount: 5,
    teacherCount: 9,
    studentCount: 125,
    nationalStandard: 'Mức 1',
    status: 'Active',
    workflowStatus: 'published',
  },
  {
    id: 'sch-4',
    name: 'Điểm trường Mầm non Ka Tăng',
    educationLevel: 'Mầm non',
    villageCode: 'ka-tang',
    classCount: 2,
    teacherCount: 4,
    studentCount: 52,
    nationalStandard: 'Chưa đạt',
    status: 'Active',
    workflowStatus: 'unit_approved',
  },
  {
    id: 'sch-5',
    name: 'Trường THCS Lao Bảo',
    educationLevel: 'THCS',
    villageCode: 'vinh-dong',
    classCount: 12,
    teacherCount: 22,
    studentCount: 390,
    nationalStandard: 'Mức 2',
    status: 'Active',
    workflowStatus: 'published',
  },
];

const EDUCATION_INDICATORS: EducationIndicator[] = [
  { id: 'ei-1', period: '2026-Q1', educationLevel: 'Mầm non', schoolCount: 1, classCount: 10, teacherCount: 20, studentCount: 262, nationalStandardRate: 75, workflowStatus: 'published' },
  { id: 'ei-2', period: '2026-Q1', educationLevel: 'Tiểu học', schoolCount: 2, classCount: 20, teacherCount: 33, studentCount: 605, nationalStandardRate: 100, workflowStatus: 'published' },
  { id: 'ei-3', period: '2026-Q1', educationLevel: 'THCS', schoolCount: 1, classCount: 12, teacherCount: 22, studentCount: 390, nationalStandardRate: 100, workflowStatus: 'published' },
];

const HEALTH_FACILITIES: HealthFacility[] = [
  {
    id: 'hf-1',
    name: 'Trạm Y tế xã Lao Bảo',
    facilityType: 'TrampYte',
    villageCode: 'vinh-dong',
    staffingCount: 7,
    bedsCount: 12,
    status: 'Active',
    workflowStatus: 'published',
  },
  {
    id: 'hf-2',
    name: 'Phòng khám tư nhân Lao Bảo',
    facilityType: 'PhongKham',
    villageCode: 'vinh-dong',
    staffingCount: 3,
    bedsCount: 4,
    status: 'Active',
    workflowStatus: 'published',
  },
  {
    id: 'hf-3',
    name: 'Nhà thuốc Tân Dược Biên giới',
    facilityType: 'NhaThuoc',
    villageCode: 'vinh-dong',
    staffingCount: 2,
    bedsCount: 0,
    status: 'Active',
    workflowStatus: 'published',
  },
  {
    id: 'hf-4',
    name: 'Điểm y tế thôn Ka Tăng',
    facilityType: 'TrampYte',
    villageCode: 'ka-tang',
    staffingCount: 1,
    bedsCount: 2,
    status: 'Active',
    workflowStatus: 'unit_approved',
  },
];

const HEALTH_INSURANCE_DATA: HealthInsuranceRecord[] = [
  { id: 'hi-1', period: '2026-Q1', villageCode: 'vinh-dong', totalHouseholds: 890, insuredPersons: 3180, coverageRate: 96.2, workflowStatus: 'published' },
  { id: 'hi-2', period: '2026-Q1', villageCode: 'ka-tang', totalHouseholds: 520, insuredPersons: 1890, coverageRate: 92.4, workflowStatus: 'published' },
  { id: 'hi-3', period: '2026-Q1', villageCode: 'lang-vay', totalHouseholds: 340, insuredPersons: 1140, coverageRate: 88.6, workflowStatus: 'unit_approved' },
  { id: 'hi-4', period: '2026-Q1', villageCode: 'tan-kim', totalHouseholds: 415, insuredPersons: 1420, coverageRate: 90.1, workflowStatus: 'published' },
];

const HEALTH_INDICATORS: HealthIndicator[] = [
  { id: 'hind-1', metricName: 'Tỷ lệ bao phủ BHYT toàn xã', value: 93.8, unit: '%', target: 95, period: '2026-Q1', source: 'Trạm Y tế xã', workflowStatus: 'published' },
  { id: 'hind-2', metricName: 'Trẻ dưới 1 tuổi tiêm chủng đầy đủ', value: 98.2, unit: '%', target: 95, period: '2026-Q1', source: 'Trạm Y tế xã', workflowStatus: 'published' },
  { id: 'hind-3', metricName: 'Tỷ lệ trẻ suy dinh dưỡng thể nhẹ cân', value: 8.5, unit: '%', target: 8, period: '2026-Q1', source: 'Trạm Y tế xã', workflowStatus: 'published' },
  { id: 'hind-4', metricName: 'Tỷ lệ bà mẹ được khám thai định kỳ', value: 91.3, unit: '%', target: 90, period: '2026-Q1', source: 'Trạm Y tế xã', workflowStatus: 'unit_approved' },
  { id: 'hind-5', metricName: 'Số ca sốt xuất huyết lũy kế', value: 12, unit: 'ca', target: 0, period: '2026-Q1', source: 'Trạm Y tế xã', workflowStatus: 'published' },
  { id: 'hind-6', metricName: 'Tỷ lệ sinh có nhân viên y tế đỡ đẻ', value: 99.1, unit: '%', target: 98, period: '2026-Q1', source: 'Trạm Y tế xã', workflowStatus: 'published' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getVillageName = (code: string) => {
  const v = VILLAGES.find((vv) => vv.code === code);
  return v ? `Thôn ${v.name}` : code;
};

const STANDARD_CONFIG: Record<NationalStandard, { className: string }> = {
  'Mức 1': { className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  'Mức 2': { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  'Chưa đạt': { className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
};

const FACILITY_LABELS: Record<FacilityType, string> = {
  TrampYte: 'Trạm Y tế',
  PhongKham: 'Phòng khám',
  NhaThuoc: 'Nhà thuốc',
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EducationHealthPage() {
  const { currentRole } = useTenant();
  const [activeTab, setActiveTab] = React.useState('schools');
  const [searchQuery, setSearchQuery] = React.useState('');

  const [schools, setSchools] = React.useState<SchoolRecord[]>(SCHOOL_DATA);
  const [facilities, setFacilities] = React.useState<HealthFacility[]>(HEALTH_FACILITIES);
  const [educationIndicators] = React.useState<EducationIndicator[]>(EDUCATION_INDICATORS);
  const [healthInsurance] = React.useState<HealthInsuranceRecord[]>(HEALTH_INSURANCE_DATA);
  const [healthIndicators] = React.useState<HealthIndicator[]>(HEALTH_INDICATORS);

  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formType, setFormType] = React.useState<'school' | 'facility'>('school');
  const [formRecord, setFormRecord] = React.useState<any>({});

  // KPIs
  const kpis = React.useMemo(() => {
    const totalStudents = schools.reduce((s, r) => s + r.studentCount, 0);
    const totalTeachers = schools.reduce((s, r) => s + r.teacherCount, 0);
    const avgBhyt = healthInsurance.length > 0
      ? (healthInsurance.reduce((s, r) => s + r.coverageRate, 0) / healthInsurance.length).toFixed(1)
      : 0;
    const vaccinationRate = healthIndicators.find((h) => h.id === 'hind-2')?.value ?? 0;
    return { totalStudents, totalTeachers, avgBhyt, vaccinationRate };
  }, [schools, healthInsurance, healthIndicators]);

  const handleWorkflow = (rec: any, dataset: string, next: WorkflowStatus) => {
    if (dataset === 'school') setSchools((p) => p.map((r) => r.id === rec.id ? { ...r, workflowStatus: next } : r));
    else if (dataset === 'facility') setFacilities((p) => p.map((r) => r.id === rec.id ? { ...r, workflowStatus: next } : r));
    toast.success('Đã cập nhật trạng thái quy trình phê duyệt!');
    setIsDetailOpen(false);
  };

  const handleDelete = (id: string, dataset: string, name: string) => {
    if (!confirm(`Xóa bản ghi: ${name}?`)) return;
    if (dataset === 'school') setSchools((p) => p.filter((r) => r.id !== id));
    else if (dataset === 'facility') setFacilities((p) => p.filter((r) => r.id !== id));
    toast.info(`Đã xóa: ${name}`);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === 'school') {
      if (formRecord.id) {
        setSchools((p) => p.map((r) => r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: 'draft' as WorkflowStatus } : r));
        toast.success('Đã cập nhật thông tin trường học!');
      } else {
        setSchools((p) => [{
          id: `sch-${Date.now()}`,
          name: formRecord.name || 'Trường mới',
          educationLevel: formRecord.educationLevel || 'Tiểu học',
          villageCode: formRecord.villageCode || VILLAGES[0].code,
          classCount: Number(formRecord.classCount) || 0,
          teacherCount: Number(formRecord.teacherCount) || 0,
          studentCount: Number(formRecord.studentCount) || 0,
          nationalStandard: formRecord.nationalStandard || 'Chưa đạt',
          status: 'Active',
          workflowStatus: 'draft',
        }, ...p]);
        toast.success('Đã thêm mới trường học!');
      }
    } else {
      if (formRecord.id) {
        setFacilities((p) => p.map((r) => r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: 'draft' as WorkflowStatus } : r));
        toast.success('Đã cập nhật cơ sở y tế!');
      } else {
        setFacilities((p) => [{
          id: `hf-${Date.now()}`,
          name: formRecord.name || 'Cơ sở y tế mới',
          facilityType: formRecord.facilityType || 'TrampYte',
          villageCode: formRecord.villageCode || VILLAGES[0].code,
          staffingCount: Number(formRecord.staffingCount) || 0,
          bedsCount: Number(formRecord.bedsCount) || 0,
          status: 'Active',
          workflowStatus: 'draft',
        }, ...p]);
        toast.success('Đã thêm mới cơ sở y tế!');
      }
    }
    setIsFormOpen(false);
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

  const filteredSchools = schools.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.educationLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFacilities = facilities.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TABS = [
    { id: 'schools', label: 'Trường học & Điểm trường', icon: GraduationCap },
    { id: 'edu-indicators', label: 'Chỉ số giáo dục', icon: BookOpen },
    { id: 'health-facilities', label: 'Cơ sở y tế', icon: Stethoscope },
    { id: 'bhyt', label: 'Bảo hiểm Y tế', icon: ShieldPlus },
    { id: 'vaccination', label: 'Tiêm chủng & Chỉ tiêu y tế', icon: Syringe },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <GraduationCap className="w-6 h-6 text-primary" />
            CSDL Giáo dục &amp; Y tế
          </>
        }
        description="Chủ trì bởi Phòng Văn hóa - Xã hội, phối hợp Trạm Y tế xã và các trường học. Cập nhật hàng quý."
        actions={
          <>
            <Button onClick={() => toast.success('Đang kết xuất báo cáo Giáo dục & Y tế xã Lao Bảo...')} variant="outline" size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border">
              <FileSpreadsheet className="size-4" />
              Báo cáo GD-YT
            </Button>
            {(currentRole === 'admin' || currentRole === 'data_officer') && (
              <Button
                onClick={() => {
                  const type = activeTab === 'health-facilities' ? 'facility' : 'school';
                  setFormType(type);
                  setFormRecord(type === 'facility'
                    ? { name: '', facilityType: 'TrampYte', villageCode: VILLAGES[0].code, staffingCount: '', bedsCount: '' }
                    : { name: '', educationLevel: 'Tiểu học', villageCode: VILLAGES[0].code, classCount: '', teacherCount: '', studentCount: '', nationalStandard: 'Chưa đạt' });
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
          { label: 'Tổng học sinh toàn xã', value: `${kpis.totalStudents.toLocaleString()} HS`, icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Tổng giáo viên các cấp', value: `${kpis.totalTeachers} GV`, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Bao phủ BHYT bình quân', value: `${kpis.avgBhyt}%`, icon: ShieldPlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Tiêm chủng đầy đủ dưới 1 tuổi', value: `${kpis.vaccinationRate}%`, icon: Syringe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
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

      {/* Search bar (for table tabs) */}
      {['schools', 'health-facilities'].includes(activeTab) && (
        <Card className="border-border bg-card shadow-2xs">
          <CardContent className="p-4">
            <Input
              placeholder="Tìm kiếm trường học, cơ sở y tế..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border text-xs h-9 shadow-none"
            />
          </CardContent>
        </Card>
      )}

      {/* ────────── TAB: Schools ────────── */}
      {activeTab === 'schools' && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Tên trường / Điểm trường</th>
                  <th className="py-3.5 px-4">Cấp học</th>
                  <th className="py-3.5 px-4">Thôn</th>
                  <th className="py-3.5 px-4 text-right">Số lớp</th>
                  <th className="py-3.5 px-4 text-right">Giáo viên</th>
                  <th className="py-3.5 px-4 text-right">Học sinh</th>
                  <th className="py-3.5 px-4">Chuẩn QG</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredSchools.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                      <GraduationCap className="size-3.5 text-primary shrink-0" /> {r.name}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{r.educationLevel}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.classCount}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.teacherCount}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.studentCount}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${STANDARD_CONFIG[r.nationalStandard].className}`}>
                        {r.nationalStandard}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                    <td className="py-3.5 px-4 text-center">
                      <ActionMenu
                        entityName="trường học"
                        onView={() => { setActiveRecord({ ...r, _dataset: 'school' }); setIsDetailOpen(true); }}
                        onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => { setFormType('school'); setFormRecord({ ...r }); setIsFormOpen(true); } : undefined}
                        onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setSchools((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Totals row */}
              <tfoot className="bg-muted/20 border-t border-border/60">
                <tr>
                  <td className="py-3 px-4 font-bold text-foreground" colSpan={3}>Tổng cộng ({schools.length} cơ sở)</td>
                  <td className="py-3 px-4 text-right font-bold text-foreground">{schools.reduce((s, r) => s + r.classCount, 0)}</td>
                  <td className="py-3 px-4 text-right font-bold text-foreground">{schools.reduce((s, r) => s + r.teacherCount, 0)}</td>
                  <td className="py-3 px-4 text-right font-bold text-foreground">{schools.reduce((s, r) => s + r.studentCount, 0)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* ────────── TAB: Education Indicators ────────── */}
      {activeTab === 'edu-indicators' && (
        <div className="space-y-4">
          {/* Per-level summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {educationIndicators.map((r) => (
              <Card key={r.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold uppercase text-primary border-primary/20 bg-primary/5">
                      {r.educationLevel}
                    </Badge>
                    <WorkflowStatusBadge status={r.workflowStatus} />
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-2">{r.educationLevel}</CardTitle>
                  <p className="text-[10px] text-muted-foreground">{r.period}</p>
                </CardHeader>
                <CardContent className="pt-3 border-t border-border/40 space-y-2">
                  {[
                    { label: 'Số trường / điểm trường', value: `${r.schoolCount} trường` },
                    { label: 'Tổng số lớp học', value: `${r.classCount} lớp` },
                    { label: 'Tổng số giáo viên', value: `${r.teacherCount} GV` },
                    { label: 'Tổng học sinh', value: `${r.studentCount} HS` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-bold text-foreground">{item.value}</span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-border/40">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground">Đạt chuẩn quốc gia</span>
                      <span className={`font-bold ${r.nationalStandardRate === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{r.nationalStandardRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${r.nationalStandardRate === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${r.nationalStandardRate}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Grand total */}
          <Card className="border-border bg-card shadow-2xs p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Tổng số trường', value: educationIndicators.reduce((s, r) => s + r.schoolCount, 0), unit: 'trường', icon: GraduationCap },
                { label: 'Tổng số lớp', value: educationIndicators.reduce((s, r) => s + r.classCount, 0), unit: 'lớp', icon: BookOpen },
                { label: 'Tổng giáo viên', value: educationIndicators.reduce((s, r) => s + r.teacherCount, 0), unit: 'GV', icon: Users },
                { label: 'Tổng học sinh', value: educationIndicators.reduce((s, r) => s + r.studentCount, 0).toLocaleString(), unit: 'HS', icon: GraduationCap },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <item.icon className="size-5 text-muted-foreground mx-auto" />
                  <p className="text-xl font-bold text-foreground">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground">{item.unit}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ────────── TAB: Health Facilities ────────── */}
      {activeTab === 'health-facilities' && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Tên cơ sở y tế</th>
                  <th className="py-3.5 px-4">Loại hình</th>
                  <th className="py-3.5 px-4">Thôn</th>
                  <th className="py-3.5 px-4 text-right">Nhân viên</th>
                  <th className="py-3.5 px-4 text-right">Giường bệnh</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredFacilities.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                      <Stethoscope className="size-3.5 text-emerald-500 shrink-0" /> {r.name}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{FACILITY_LABELS[r.facilityType]}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.staffingCount}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.bedsCount > 0 ? r.bedsCount : '—'}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${r.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-muted/40 text-muted-foreground border-border'}`}>
                        {r.status === 'Active' ? 'Hoạt động' : 'Ngừng HĐ'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                    <td className="py-3.5 px-4 text-center">
                      <ActionMenu
                        entityName="cơ sở y tế"
                        onView={() => { setActiveRecord({ ...r, _dataset: 'facility' }); setIsDetailOpen(true); }}
                        onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => { setFormType('facility'); setFormRecord({ ...r }); setIsFormOpen(true); } : undefined}
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

      {/* ────────── TAB: BHYT ────────── */}
      {activeTab === 'bhyt' && (
        <div className="space-y-4">
          <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Thôn</th>
                    <th className="py-3.5 px-4 text-right">Tổng số hộ</th>
                    <th className="py-3.5 px-4 text-right">Người có BHYT</th>
                    <th className="py-3.5 px-4 text-right">Tỷ lệ bao phủ</th>
                    <th className="py-3.5 px-4">Tiến độ vs. KH 95%</th>
                    <th className="py-3.5 px-4">Quy trình</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {healthInsurance.map((r) => {
                    const pct = Math.min((r.coverageRate / 95) * 100, 100);
                    const onTrack = r.coverageRate >= 90;
                    return (
                      <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                          <ShieldPlus className="size-3.5 text-emerald-500 shrink-0" /> {getVillageName(r.villageCode)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-muted-foreground">{r.totalHouseholds.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.insuredPersons.toLocaleString()}</td>
                        <td className={`py-3.5 px-4 text-right font-bold ${onTrack ? 'text-emerald-600' : 'text-amber-600'}`}>{r.coverageRate}%</td>
                        <td className="py-3.5 px-4 w-40">
                          <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${onTrack ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                        </td>
                        <td className="py-3.5 px-4"><WorkflowStatusBadge status={r.workflowStatus} /></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-muted/20 border-t border-border/60">
                  <tr>
                    <td className="py-3 px-4 font-bold text-foreground">Toàn xã (bình quân)</td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">{healthInsurance.reduce((s, r) => s + r.totalHouseholds, 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">{healthInsurance.reduce((s, r) => s + r.insuredPersons, 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      {(healthInsurance.reduce((s, r) => s + r.coverageRate, 0) / healthInsurance.length).toFixed(1)}%
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ────────── TAB: Vaccination & Health Indicators ────────── */}
      {activeTab === 'vaccination' && (
        <div className="space-y-4">
          <p className="text-[10px] text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/40 italic">
            * Chỉ sử dụng số liệu tổng hợp cấp xã. Không lưu hồ sơ bệnh án, danh sách trẻ em hay thông tin sức khỏe cá nhân theo quy định bảo mật dữ liệu.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {healthIndicators.map((r) => {
              const isLowerBetter = r.metricName.includes('suy dinh dưỡng') || r.metricName.includes('sốt');
              const isOnTarget = isLowerBetter
                ? (r.target === 0 ? r.value === 0 : r.value <= r.target)
                : r.value >= r.target;
              const pct = r.target > 0 ? Math.min((r.value / r.target) * 100, 100) : (r.value === 0 ? 100 : 0);

              return (
                <Card key={r.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-snug">{r.metricName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{r.period} · Nguồn: {r.source}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          {isOnTarget
                            ? <CheckCircle2 className="size-3.5 text-emerald-500" />
                            : <AlertCircle className="size-3.5 text-amber-500" />
                          }
                          <span className={`text-sm font-bold ${isOnTarget ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {r.value}{r.unit}
                          </span>
                        </div>
                        {r.target > 0 && (
                          <span className="text-[10px] text-muted-foreground">KH: {r.target}{r.unit}</span>
                        )}
                      </div>
                    </div>
                    {r.target > 0 && (
                      <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isOnTarget ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                    <div className="flex justify-end">
                      <WorkflowStatusBadge status={r.workflowStatus} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trend summary */}
          <Card className="border-border bg-card p-4 flex items-center gap-3">
            <TrendingUp className="size-5 text-emerald-500 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">Nhận xét tổng hợp Q1/2026:</span> Tỷ lệ tiêm chủng, BHYT và sinh có hỗ trợ y tế đều vượt kế hoạch. Tỷ lệ suy dinh dưỡng trẻ em cần tiếp tục giảm, cần tăng cường giám sát dinh dưỡng tại thôn Ka Tăng và Làng Vây.
            </p>
          </Card>
        </div>
      )}

      {/* ─── Detail Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Chi tiết CSDL Giáo dục &amp; Y tế</DialogTitle>
            <DialogDescription className="text-xs">Trích xuất dữ liệu CSDL xã Lao Bảo</DialogDescription>
          </DialogHeader>

          {activeRecord && (
            <div className="space-y-3 py-2 text-xs">
              {activeRecord._dataset === 'school' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên trường</span>
                    <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Cấp học</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.educationLevel}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Thôn</span>
                      <p className="font-bold text-foreground mt-0.5">{getVillageName(activeRecord.villageCode)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Số lớp</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.classCount}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Giáo viên</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.teacherCount}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Học sinh</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.studentCount}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Chuẩn quốc gia</span>
                    <Badge variant="outline" className={`mt-1 text-[9px] px-1.5 py-0 font-bold uppercase ${STANDARD_CONFIG[activeRecord.nationalStandard as NationalStandard].className}`}>
                      {activeRecord.nationalStandard}
                    </Badge>
                  </div>
                </>
              )}

              {activeRecord._dataset === 'facility' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên cơ sở y tế</span>
                    <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.name}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Loại hình</span>
                      <p className="font-bold text-foreground mt-0.5">{FACILITY_LABELS[activeRecord.facilityType as FacilityType]}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Nhân viên</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.staffingCount}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Giường bệnh</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.bedsCount > 0 ? activeRecord.bedsCount : '—'}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Thôn</span>
                    <p className="font-bold text-foreground mt-0.5">{getVillageName(activeRecord.villageCode)}</p>
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

      {/* ─── Add/Edit Form Dialog ─────────────────────────────────────────── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id ? 'Cập nhật' : 'Thêm mới'} — {formType === 'school' ? 'Trường học / Điểm trường' : 'Cơ sở Y tế'}
            </DialogTitle>
            <DialogDescription className="text-xs">Nhập thông tin đơn vị giáo dục / y tế xã Lao Bảo.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            {formType === 'school' && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên trường / Điểm trường</label>
                  <Input value={formRecord.name || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, name: e.target.value }))} placeholder="VD: Trường Tiểu học Lao Bảo..." className="bg-background border-border text-xs h-9 shadow-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Cấp học</label>
                    <Select
                      value={formRecord.educationLevel || 'Tiểu học'}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, educationLevel: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Cấp học" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="Mầm non" className="cursor-pointer">Mầm non</SelectItem>
                        <SelectItem value="Tiểu học" className="cursor-pointer">Tiểu học</SelectItem>
                        <SelectItem value="THCS" className="cursor-pointer">THCS</SelectItem>
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
                    <label className="font-bold text-foreground">Số lớp</label>
                    <Input type="number" value={formRecord.classCount || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, classCount: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Giáo viên</label>
                    <Input type="number" value={formRecord.teacherCount || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, teacherCount: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Học sinh</label>
                    <Input type="number" value={formRecord.studentCount || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, studentCount: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Chuẩn quốc gia</label>
                  <Select
                    value={formRecord.nationalStandard || 'Chưa đạt'}
                    onValueChange={(val) => setFormRecord((p: any) => ({ ...p, nationalStandard: val }))}
                  >
                    <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                      <SelectValue placeholder="Chuẩn quốc gia" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="Mức 1" className="cursor-pointer">Mức 1</SelectItem>
                      <SelectItem value="Mức 2" className="cursor-pointer">Mức 2</SelectItem>
                      <SelectItem value="Chưa đạt" className="cursor-pointer">Chưa đạt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formType === 'facility' && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên cơ sở y tế</label>
                  <Input value={formRecord.name || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, name: e.target.value }))} placeholder="VD: Trạm Y tế xã..." className="bg-background border-border text-xs h-9 shadow-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Loại hình</label>
                    <Select
                      value={formRecord.facilityType || 'TrampYte'}
                      onValueChange={(val) => setFormRecord((p: any) => ({ ...p, facilityType: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Loại hình" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="TrampYte" className="cursor-pointer">Trạm Y tế</SelectItem>
                        <SelectItem value="PhongKham" className="cursor-pointer">Phòng khám</SelectItem>
                        <SelectItem value="NhaThuoc" className="cursor-pointer">Nhà thuốc</SelectItem>
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
                    <label className="font-bold text-foreground">Nhân viên y tế</label>
                    <Input type="number" value={formRecord.staffingCount || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, staffingCount: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Giường bệnh</label>
                    <Input type="number" value={formRecord.bedsCount || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, bedsCount: Number(e.target.value) }))} className="bg-background border-border text-xs h-9 shadow-none" />
                  </div>
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
