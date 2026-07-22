// src/app/dashboard/social-welfare/page.tsx
"use client";

import { ActionMenu, PageHeader, SearchInput } from "@/components/common";
import { WorkflowStatusBadge } from "@/components/common/WorkflowStatusBadge";
import { useTenant } from "@/components/layout/tenant-context";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui";
import { VILLAGES } from "@/data/laobao-administrative-units";
import { WorkflowStatus } from "@/types";
import { Activity, AlertCircle, Baby, FileSpreadsheet, FileText, Heart, Plus, ShieldAlert, TrendingDown, TrendingUp, UserCheck, Users } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type BeneficiaryCategory =
  | "Meritorious" // Người có công
  | "SocialProtection" // Bảo trợ xã hội
  | "Disabled" // Người khuyết tật
  | "Elderly" // Người cao tuổi
  | "SpecialChildren"; // Trẻ em đặc biệt

interface BeneficiaryRecord {
  id: string;
  category: BeneficiaryCategory;
  displayCode: string;
  fullName: string;
  villageCode: string;
  benefitType: string;
  allowanceAmount: number; // VNĐ per month
  certificateMeta: string;
  workflowStatus: WorkflowStatus;
}

interface PovertyIndicator {
  id: string;
  villageCode: string;
  period: string;
  newPoorHouseholds: number;
  newNearPoorHouseholds: number;
  cumulativePoorHouseholds: number;
  cumulativeNearPoorHouseholds: number;
  multidimensionalPovertyRate: number; // %
  samePeriodComparison: string; // e.g. "Giảm 1.2% so với cùng kỳ"
  workflowStatus: WorkflowStatus;
}

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const BENEFICIARY_DATA: BeneficiaryRecord[] = [
  // Người có công (Meritorious)
  {
    id: "ben-1",
    category: "Meritorious",
    displayCode: "NCC-001",
    fullName: "Nguyễn Văn A",
    villageCode: "tan-kim",
    benefitType: "Thương binh hạng 2/4",
    allowanceAmount: 2650000,
    certificateMeta: "Quyết định 142/QĐ-NCC",
    workflowStatus: "published",
  },
  {
    id: "ben-2",
    category: "Meritorious",
    displayCode: "NCC-002",
    fullName: "Trần Thị B",
    villageCode: "lang-vay",
    benefitType: "Thân nhân Liệt sĩ",
    allowanceAmount: 1850000,
    certificateMeta: "Quyết định 992/QĐ-Sở",
    workflowStatus: "published",
  },
  {
    id: "ben-3",
    category: "Meritorious",
    displayCode: "NCC-003",
    fullName: "Hồ Văn C",
    villageCode: "ka-tang",
    benefitType: "Người nhiễm chất độc hóa học",
    allowanceAmount: 2100000,
    certificateMeta: "Quyết định 354/QĐ-NCC",
    workflowStatus: "unit_approved",
  },

  // Bảo trợ xã hội (SocialProtection)
  {
    id: "ben-4",
    category: "SocialProtection",
    displayCode: "BTXH-001",
    fullName: "Lê Văn D",
    villageCode: "vinh-dong",
    benefitType: "Đối tượng cô đơn không nơi nương tựa",
    allowanceAmount: 540000,
    certificateMeta: "Sổ BTXH số 88",
    workflowStatus: "published",
  },
  {
    id: "ben-5",
    category: "SocialProtection",
    displayCode: "BTXH-002",
    fullName: "Phạm Thị E",
    villageCode: "trieu-phuoc",
    benefitType: "Trợ cấp xã hội hàng tháng",
    allowanceAmount: 540000,
    certificateMeta: "Sổ BTXH số 142",
    workflowStatus: "draft",
  },

  // Người khuyết tật (Disabled)
  {
    id: "ben-6",
    category: "Disabled",
    displayCode: "NKT-001",
    fullName: "Hồ Thị F",
    villageCode: "ka-tang",
    benefitType: "Khuyết tật vận động nặng",
    allowanceAmount: 720000,
    certificateMeta: "Giấy xác nhận khuyết tật số 12",
    workflowStatus: "published",
  },
  {
    id: "ben-7",
    category: "Disabled",
    displayCode: "NKT-002",
    fullName: "Nguyễn Văn G",
    villageCode: "tan-long",
    benefitType: "Khuyết tật đặc biệt nặng",
    allowanceAmount: 1080000,
    certificateMeta: "Giấy xác nhận khuyết tật số 45",
    workflowStatus: "unit_approved",
  },

  // Người cao tuổi (Elderly)
  {
    id: "ben-8",
    category: "Elderly",
    displayCode: "NCT-001",
    fullName: "Hoàng Thị H",
    villageCode: "trieu-thanh",
    benefitType: "Người cao tuổi từ 80 tuổi trở lên",
    allowanceAmount: 360000,
    certificateMeta: "Quyết định NCT 2024",
    workflowStatus: "published",
  },
  {
    id: "ben-9",
    category: "Elderly",
    displayCode: "NCT-002",
    fullName: "Đỗ Văn I",
    villageCode: "tan-phuoc",
    benefitType: "Người cao tuổi cô đơn nghèo",
    allowanceAmount: 720000,
    certificateMeta: "Quyết định NCT 2025",
    workflowStatus: "published",
  },

  // Trẻ em đặc biệt (SpecialChildren)
  {
    id: "ben-10",
    category: "SpecialChildren",
    displayCode: "TE-001",
    fullName: "Lê Thị K",
    villageCode: "vinh-dong",
    benefitType: "Trẻ em mồ côi cả cha lẫn mẹ",
    allowanceAmount: 900000,
    certificateMeta: "Sổ ưu đãi trẻ em số 05",
    workflowStatus: "published",
  },
  {
    id: "ben-11",
    category: "SpecialChildren",
    displayCode: "TE-002",
    fullName: "Hồ Văn L",
    villageCode: "lang-vay",
    benefitType: "Trẻ em khuyết tật nặng",
    allowanceAmount: 720000,
    certificateMeta: "Sổ ưu đãi trẻ em số 11",
    workflowStatus: "submitted",
  },
];

const POVERTY_DATA: PovertyIndicator[] = [
  {
    id: "pov-1",
    villageCode: "lang-vay",
    period: "2026-Q1",
    newPoorHouseholds: 2,
    newNearPoorHouseholds: 3,
    cumulativePoorHouseholds: 24,
    cumulativeNearPoorHouseholds: 31,
    multidimensionalPovertyRate: 8.2,
    samePeriodComparison: "Giảm 1.4% so với cùng kỳ năm trước",
    workflowStatus: "published",
  },
  {
    id: "pov-2",
    villageCode: "ka-tang",
    period: "2026-Q1",
    newPoorHouseholds: 1,
    newNearPoorHouseholds: 4,
    cumulativePoorHouseholds: 32,
    cumulativeNearPoorHouseholds: 38,
    multidimensionalPovertyRate: 11.5,
    samePeriodComparison: "Giảm 0.8% so với cùng kỳ năm trước",
    workflowStatus: "published",
  },
  {
    id: "pov-3",
    villageCode: "trieu-phuoc",
    period: "2026-Q1",
    newPoorHouseholds: 0,
    newNearPoorHouseholds: 1,
    cumulativePoorHouseholds: 8,
    cumulativeNearPoorHouseholds: 14,
    multidimensionalPovertyRate: 2.4,
    samePeriodComparison: "Giảm 0.5% so với cùng kỳ năm trước",
    workflowStatus: "published",
  },
  {
    id: "pov-4",
    villageCode: "tan-kim",
    period: "2026-Q1",
    newPoorHouseholds: 1,
    newNearPoorHouseholds: 2,
    cumulativePoorHouseholds: 12,
    cumulativeNearPoorHouseholds: 19,
    multidimensionalPovertyRate: 3.1,
    samePeriodComparison: "Giảm 0.9% so với cùng kỳ năm trước",
    workflowStatus: "unit_approved",
  },
  {
    id: "pov-5",
    villageCode: "vinh-dong",
    period: "2026-Q1",
    newPoorHouseholds: 0,
    newNearPoorHouseholds: 0,
    cumulativePoorHouseholds: 5,
    cumulativeNearPoorHouseholds: 9,
    multidimensionalPovertyRate: 1.1,
    samePeriodComparison: "Giảm 0.2% so với cùng kỳ năm trước",
    workflowStatus: "published",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<BeneficiaryCategory, string> = {
  Meritorious: "Người có công & thân nhân",
  SocialProtection: "Đối tượng bảo trợ xã hội",
  Disabled: "Người khuyết tật",
  Elderly: "Người cao tuổi",
  SpecialChildren: "Trẻ em có HC đặc biệt",
};

const getVillageName = (code: string) => {
  const v = VILLAGES.find((vv) => vv.code === code);
  return v ? `Thôn ${v.name}` : code;
};

// ─── Privacy Guard Helper ─────────────────────────────────────────────────────

const maskName = (name: string, role: string) => {
  if (role === "commune_leader") {
    const parts = name.trim().split(" ");
    if (parts.length <= 1) return "*";
    return parts
      .map((part, idx) => {
        if (idx === 0) return part; // Keep first name initial or last name
        return part[0] + "**";
      })
      .join(" ");
  }
  return name;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SocialWelfarePage() {
  const { currentRole } = useTenant();
  const [activeTab, setActiveTab] = React.useState<string>("poverty");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const [beneficiaries, setBeneficiaries] = React.useState<BeneficiaryRecord[]>(BENEFICIARY_DATA);
  const [povertyList, setPovertyList] = React.useState<PovertyIndicator[]>(POVERTY_DATA);

  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<any | null>(null);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formRecord, setFormRecord] = React.useState<any>({});

  // Checks if the current user has access to raw PII records
  const hasRecordLevelAccess = currentRole !== "commune_leader";

  // Computed stats
  const kpis = React.useMemo(() => {
    const totalWelfareBeneficiaries = beneficiaries.length;
    const totalPoorHouseholds = povertyList.reduce((s, r) => s + r.cumulativePoorHouseholds, 0);
    const totalNearPoorHouseholds = povertyList.reduce((s, r) => s + r.cumulativeNearPoorHouseholds, 0);
    const avgPovertyRate = povertyList.length > 0 ? (povertyList.reduce((s, r) => s + r.multidimensionalPovertyRate, 0) / povertyList.length).toFixed(1) : 0;
    return { totalWelfareBeneficiaries, totalPoorHouseholds, totalNearPoorHouseholds, avgPovertyRate };
  }, [beneficiaries, povertyList]);

  // Workflow handlers
  const handleWorkflow = (rec: any, dataset: string, next: WorkflowStatus) => {
    if (dataset === "beneficiary") {
      setBeneficiaries((prev) => prev.map((r) => (r.id === rec.id ? { ...r, workflowStatus: next } : r)));
    } else if (dataset === "poverty") {
      setPovertyList((prev) => prev.map((r) => (r.id === rec.id ? { ...r, workflowStatus: next } : r)));
    }
    toast.success("Đã cập nhật trạng thái quy trình phê duyệt!");
    setIsDetailOpen(false);
  };

  const handleDelete = (id: string, dataset: string, name: string) => {
    if (!confirm(`Xóa bản ghi: ${name}?`)) return;
    if (dataset === "beneficiary") setBeneficiaries((prev) => prev.filter((r) => r.id !== id));
    else if (dataset === "poverty") setPovertyList((prev) => prev.filter((r) => r.id !== id));
    toast.info(`Đã xóa: ${name}`);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "poverty") {
      if (formRecord.id) {
        setPovertyList((p) => p.map((r) => (r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: "draft" as WorkflowStatus } : r)));
        toast.success("Đã cập nhật chỉ số hộ nghèo / cận nghèo!");
      } else {
        setPovertyList((p) => [
          {
            id: `pov-${Date.now()}`,
            villageCode: formRecord.villageCode || VILLAGES[0].code,
            period: formRecord.period || "2026-Q1",
            newPoorHouseholds: Number(formRecord.newPoorHouseholds) || 0,
            newNearPoorHouseholds: Number(formRecord.newNearPoorHouseholds) || 0,
            cumulativePoorHouseholds: Number(formRecord.cumulativePoorHouseholds) || 0,
            cumulativeNearPoorHouseholds: Number(formRecord.cumulativeNearPoorHouseholds) || 0,
            multidimensionalPovertyRate: Number(formRecord.multidimensionalPovertyRate) || 0,
            samePeriodComparison: formRecord.samePeriodComparison || "",
            workflowStatus: "draft",
          },
          ...p,
        ]);
        toast.success("Thêm mới chỉ số hộ nghèo / cận nghèo thành công!");
      }
    } else {
      // Beneficiary CRUD
      const targetCategory = activeTab as BeneficiaryCategory;
      if (formRecord.id) {
        setBeneficiaries((p) => p.map((r) => (r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: "draft" as WorkflowStatus } : r)));
        toast.success("Đã cập nhật thông tin đối tượng chính sách!");
      } else {
        setBeneficiaries((p) => [
          {
            id: `ben-${Date.now()}`,
            category: targetCategory,
            displayCode: formRecord.displayCode || "CODE-NEW",
            fullName: formRecord.fullName || "Người nhận trợ cấp",
            villageCode: formRecord.villageCode || VILLAGES[0].code,
            benefitType: formRecord.benefitType || "",
            allowanceAmount: Number(formRecord.allowanceAmount) || 0,
            certificateMeta: formRecord.certificateMeta || "",
            workflowStatus: "draft",
          },
          ...p,
        ]);
        toast.success("Thêm mới đối tượng chính sách thành công!");
      }
    }
    setIsFormOpen(false);
  };

  // Filters
  const filteredBeneficiaries = React.useMemo(() => {
    return beneficiaries.filter((r) => {
      const matchCat = r.category === activeTab;
      const matchQuery =
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.displayCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.benefitType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [beneficiaries, activeTab, searchQuery]);

  const filteredPoverty = React.useMemo(() => {
    return povertyList.filter((r) => {
      return getVillageName(r.villageCode).toLowerCase().includes(searchQuery.toLowerCase()) || r.period.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [povertyList, searchQuery]);

  const renderWorkflowButtons = (rec: any, dataset: string) => {
    const s = rec.workflowStatus as WorkflowStatus;
    return (
      <div className="flex flex-wrap gap-2 pt-2 justify-end border-t border-border/40">
        {s === "draft" && (currentRole === "admin" || currentRole === "data_officer") && (
          <Button onClick={() => handleWorkflow(rec, dataset, "submitted")} size="xs" className="h-8 text-xs cursor-pointer shadow-none">
            Trình phê duyệt
          </Button>
        )}
        {s === "submitted" && currentRole === "unit_leader" && (
          <>
            <Button onClick={() => handleWorkflow(rec, dataset, "returned")} variant="destructive" size="xs" className="h-8 text-xs cursor-pointer shadow-none">
              Trả lại
            </Button>
            <Button onClick={() => handleWorkflow(rec, dataset, "unit_approved")} size="xs" className="h-8 text-xs cursor-pointer shadow-none bg-emerald-600 hover:bg-emerald-700">
              Ký duyệt cấp phòng
            </Button>
          </>
        )}
        {["submitted", "unit_approved"].includes(s) && (currentRole === "data_governance" || currentRole === "admin") && (
          <>
            <Button onClick={() => handleWorkflow(rec, dataset, "returned")} variant="destructive" size="xs" className="h-8 text-xs cursor-pointer shadow-none">
              Trả lại
            </Button>
            <Button onClick={() => handleWorkflow(rec, dataset, "published")} size="xs" className="h-8 text-xs cursor-pointer shadow-none">
              Công bố chính thức
            </Button>
          </>
        )}
      </div>
    );
  };

  const TABS = [
    { id: "poverty", label: "Hộ nghèo & Cận nghèo", icon: TrendingDown },
    { id: "Meritorious", label: "Người có công", icon: UserCheck },
    { id: "SocialProtection", label: "Bảo trợ xã hội", icon: Heart },
    { id: "Disabled", label: "Người khuyết tật", icon: Activity },
    { id: "Elderly", label: "Người cao tuổi", icon: Users },
    { id: "SpecialChildren", label: "Trẻ em đặc biệt", icon: Baby },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Heart className="w-6 h-6 text-primary" />
            CSDL An sinh xã hội &amp; Hộ nghèo
          </>
        }
        description="Chủ trì bởi Phòng Văn hóa - Xã hội. Quản lý hộ nghèo, cận nghèo và các đối tượng hưởng bảo trợ xã hội."
        actions={
          <>
            <Button
              onClick={() => {
                if (currentRole === "commune_leader") {
                  toast.warning("Tài khoản Lãnh đạo chỉ xuất file tổng hợp thống kê, thông tin cá nhân chi tiết đã bị lọc.");
                }
                toast.success("Đang kết xuất báo cáo An sinh xã hội &amp; Hộ nghèo xã Lao Bảo...");
              }}
              variant="outline"
              size="sm"
              className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border"
            >
              <FileSpreadsheet className="size-4" />
              Báo cáo an sinh
            </Button>
            {(currentRole === "admin" || currentRole === "data_officer") && (
              <Button
                onClick={() => {
                  if (activeTab === "poverty") {
                    setFormRecord({
                      villageCode: VILLAGES[0].code,
                      period: "2026-Q1",
                      newPoorHouseholds: "",
                      newNearPoorHouseholds: "",
                      cumulativePoorHouseholds: "",
                      cumulativeNearPoorHouseholds: "",
                      multidimensionalPovertyRate: "",
                      samePeriodComparison: "",
                    });
                  } else {
                    setFormRecord({
                      displayCode: `${activeTab.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
                      fullName: "",
                      villageCode: VILLAGES[0].code,
                      benefitType: "",
                      allowanceAmount: "",
                      certificateMeta: "",
                    });
                  }
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
          { label: "Hộ nghèo tích lũy", value: `${kpis.totalPoorHouseholds} hộ`, icon: TrendingDown, color: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Hộ cận nghèo tích lũy", value: `${kpis.totalNearPoorHouseholds} hộ`, icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-500/10" },
          { label: "Tỷ lệ nghèo đa chiều", value: `${kpis.avgPovertyRate}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Người nhận trợ cấp", value: `${kpis.totalWelfareBeneficiaries} người`, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border bg-card p-4 flex items-center gap-3">
            <div className={`p-3 ${kpi.bg} ${kpi.color} rounded-xl shrink-0`}>
              <kpi.icon className="size-5" />
            </div>
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
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Privacy Warning Banner (if leader) */}
      {!hasRecordLevelAccess && (
        <Card className="border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 p-3 flex items-start gap-2 rounded-xl">
          <ShieldAlert className="size-4 shrink-0 mt-0.5 text-amber-600" />
          <div className="space-y-1.5">
            <p className="font-semibold text-[10px]">Chế độ bảo mật danh tính đang kích hoạt (Commune Leader)</p>
            <p className="text-[9px] text-muted-foreground">
              Tên người nhận trợ cấp chính sách và thông tin nhạy cảm đã được làm mờ tự động. Chỉ tài khoản chuyên viên nhập liệu và thẩm định mới được xem thông tin đầy đủ.
            </p>
          </div>
        </Card>
      )}

      {/* Search box */}
      <Card className="border-border bg-card shadow-2xs">
        <CardContent className="p-0">
          <SearchInput
            placeholder={activeTab === "poverty" ? "Tìm kiếm thôn, kỳ báo cáo..." : "Tìm kiếm theo tên, mã số, loại trợ cấp..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputClassName="border-none bg-transparent focus-visible:ring-0"
            iconClassName="left-3"
          />
        </CardContent>
      </Card>

      {/* ────────── TAB: Poverty Indicators ────────── */}
      {activeTab === "poverty" && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Thôn</th>
                  <th className="py-3.5 px-4 text-right">Hộ nghèo mới</th>
                  <th className="py-3.5 px-4 text-right">Cận nghèo mới</th>
                  <th className="py-3.5 px-4 text-right">Lũy kế nghèo</th>
                  <th className="py-3.5 px-4 text-right">Lũy kế cận nghèo</th>
                  <th className="py-3.5 px-4 text-right">Tỷ lệ nghèo đa chiều</th>
                  <th className="py-3.5 px-4">So sánh kỳ trước</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredPoverty.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">{getVillageName(r.villageCode)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-600">+{r.newPoorHouseholds}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-blue-600">+{r.newNearPoorHouseholds}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.cumulativePoorHouseholds}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.cumulativeNearPoorHouseholds}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.multidimensionalPovertyRate}%</td>
                    <td className="py-3.5 px-4 text-emerald-600 flex items-center gap-1 mt-1.5">{r.samePeriodComparison}</td>
                    <td className="py-3.5 px-4">
                      <WorkflowStatusBadge status={r.workflowStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <ActionMenu
                        entityName="dự liệu nghèo"
                        onView={() => {
                          setActiveRecord({ ...r, _dataset: "poverty" });
                          setIsDetailOpen(true);
                        }}
                        onEdit={
                          currentRole === "admin" || currentRole === "data_officer"
                            ? () => {
                                setFormRecord({ ...r });
                                setIsFormOpen(true);
                              }
                            : undefined
                        }
                        onDelete={currentRole === "admin" || currentRole === "data_officer" ? () => setPovertyList((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ────────── TAB: Beneficiaries (Dynamic Category) ────────── */}
      {activeTab !== "poverty" && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Mã đối tượng</th>
                  <th className="py-3.5 px-4">Họ và tên</th>
                  <th className="py-3.5 px-4">Thôn</th>
                  <th className="py-3.5 px-4">Diện trợ cấp</th>
                  <th className="py-3.5 px-4 text-right">Mức trợ cấp (tháng)</th>
                  <th className="py-3.5 px-4">Chứng thư / Quyết định</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredBeneficiaries.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-muted-foreground">{r.displayCode}</td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">{maskName(r.fullName, currentRole || "")}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                    <td className="py-3.5 px-4 text-muted-foreground font-semibold">{r.benefitType}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.allowanceAmount.toLocaleString()} VNĐ</td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-[150px] truncate">{r.certificateMeta}</td>
                    <td className="py-3.5 px-4">
                      <WorkflowStatusBadge status={r.workflowStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <ActionMenu
                        entityName="đối tượng bảo trợ"
                        onView={() => {
                          setActiveRecord({ ...r, _dataset: "beneficiary" });
                          setIsDetailOpen(true);
                        }}
                        onEdit={
                          currentRole === "admin" || currentRole === "data_officer"
                            ? () => {
                                setFormRecord({ ...r });
                                setIsFormOpen(true);
                              }
                            : undefined
                        }
                        onDelete={currentRole === "admin" || currentRole === "data_officer" ? () => setBeneficiaries((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ─── Detail Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Chi tiết đối tượng bảo trợ xã hội</DialogTitle>
            <DialogDescription className="text-xs">Trích xuất hồ sơ CSDL An sinh xã hội Lao Bảo</DialogDescription>
          </DialogHeader>

          {activeRecord && (
            <div className="space-y-3 py-2 text-xs">
              {activeRecord._dataset === "poverty" ? (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Thôn</span>
                    <p className="font-bold text-foreground mt-0.5">{getVillageName(activeRecord.villageCode)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Hộ nghèo phát sinh</span>
                      <p className="font-bold text-rose-600 mt-0.5">+{activeRecord.newPoorHouseholds} hộ</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Hộ cận nghèo phát sinh</span>
                      <p className="font-bold text-blue-600 mt-0.5">+{activeRecord.newNearPoorHouseholds} hộ</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tổng hộ nghèo tích lũy</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.cumulativePoorHouseholds} hộ</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tổng hộ cận nghèo tích lũy</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.cumulativeNearPoorHouseholds} hộ</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tỷ lệ nghèo đa chiều</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.multidimensionalPovertyRate}%</p>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl flex items-center gap-2">
                    <TrendingDown className="size-4 text-emerald-500 shrink-0" />
                    <p className="font-medium text-emerald-600 mt-0.5">{activeRecord.samePeriodComparison}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Mã đối tượng</span>
                      <p className="font-mono font-bold text-foreground mt-0.5">{activeRecord.displayCode}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Họ và tên</span>
                      <p className="font-bold text-foreground mt-0.5">{maskName(activeRecord.fullName, currentRole || "")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Thôn cư trú</span>
                      <p className="font-bold text-foreground mt-0.5">{getVillageName(activeRecord.villageCode)}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Trợ cấp tháng</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.allowanceAmount.toLocaleString()} VNĐ</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Chính sách áp dụng</span>
                    <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.benefitType}</p>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground shrink-0" />
                    <p className="font-medium text-foreground mt-0.5">Số hiệu chứng từ: {activeRecord.certificateMeta}</p>
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
              <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer shadow-none border-border">
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add/Edit Form Dialog ─────────────────────────────────────────── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id ? "Cập nhật" : "Thêm mới"} — {activeTab === "poverty" ? "Hộ nghèo & Cận nghèo" : CATEGORY_LABELS[activeTab as BeneficiaryCategory]}
            </DialogTitle>
            <DialogDescription className="text-xs">Điền dữ liệu biểu mẫu. Tuyệt đối bảo mật thông tin định danh công dân thật.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            {activeTab === "poverty" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Select value={formRecord.villageCode || VILLAGES[0].code} onValueChange={(val) => setFormRecord((p: any) => ({ ...p, villageCode: val }))}>
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
                    <Input
                      value={formRecord.period || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, period: e.target.value }))}
                      placeholder="2026-Q1"
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Hộ nghèo phát sinh</label>
                    <Input
                      type="number"
                      value={formRecord.newPoorHouseholds || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, newPoorHouseholds: e.target.value }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Hộ cận nghèo phát sinh</label>
                    <Input
                      type="number"
                      value={formRecord.newNearPoorHouseholds || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, newNearPoorHouseholds: e.target.value }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Lũy kế nghèo</label>
                    <Input
                      type="number"
                      value={formRecord.cumulativePoorHouseholds || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, cumulativePoorHouseholds: e.target.value }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Lũy kế cận nghèo</label>
                    <Input
                      type="number"
                      value={formRecord.cumulativeNearPoorHouseholds || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, cumulativeNearPoorHouseholds: e.target.value }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tỷ lệ nghèo đa chiều (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formRecord.multidimensionalPovertyRate || ""}
                    onChange={(e) => setFormRecord((p: any) => ({ ...p, multidimensionalPovertyRate: e.target.value }))}
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Đánh giá / So sánh</label>
                  <Input
                    value={formRecord.samePeriodComparison || ""}
                    onChange={(e) => setFormRecord((p: any) => ({ ...p, samePeriodComparison: e.target.value }))}
                    placeholder="VD: Giảm 1.2% so với cùng kỳ năm trước"
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Mã đối tượng</label>
                    <Input
                      value={formRecord.displayCode || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, displayCode: e.target.value }))}
                      placeholder="VD: NCT-045"
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Họ và tên</label>
                    <Input
                      value={formRecord.fullName || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, fullName: e.target.value }))}
                      placeholder="VD: Nguyễn Văn X"
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Select value={formRecord.villageCode || VILLAGES[0].code} onValueChange={(val) => setFormRecord((p: any) => ({ ...p, villageCode: val }))}>
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
                    <label className="font-bold text-foreground">Trợ cấp tháng (VNĐ)</label>
                    <Input
                      type="number"
                      value={formRecord.allowanceAmount || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, allowanceAmount: e.target.value }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Chính sách áp dụng / Diện trợ cấp</label>
                  <Input
                    value={formRecord.benefitType || ""}
                    onChange={(e) => setFormRecord((p: any) => ({ ...p, benefitType: e.target.value }))}
                    placeholder="VD: Khuyết tật vận động nặng..."
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Số quyết định / Hồ sơ chứng thực</label>
                  <Input
                    value={formRecord.certificateMeta || ""}
                    onChange={(e) => setFormRecord((p: any) => ({ ...p, certificateMeta: e.target.value }))}
                    placeholder="VD: Quyết định 142/QĐ-NCC"
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
              </>
            )}

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
    </div>
  );
}
