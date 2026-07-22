// src/app/dashboard/security-defense/page.tsx
"use client";

import { ActionMenu, PageHeader, SearchInput } from "@/components/common";
import { WorkflowStatusBadge } from "@/components/common/WorkflowStatusBadge";
import { useTenant } from "@/components/layout/tenant-context";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
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
import { CheckCircle, Eye, FileLock, FileSpreadsheet, Flame, History, KeyRound, Lock, Plus, Shield, ShieldAlert, Users } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DefenseIndicator {
  id: string;
  metricType: string;
  count: number;
  unit: string;
  target: number;
  period: string;
  status: "Completed" | "InProgress" | "Pending";
  workflowStatus: WorkflowStatus;
}

interface MilitiaForce {
  id: string;
  squadName: string;
  villageCode: string;
  forceCount: number;
  equipmentStatus: string;
  patrolsPerMonth: number;
  workflowStatus: WorkflowStatus;
}

interface RecruitmentTarget {
  id: string;
  year: string;
  recruitmentTarget: number;
  completedCount: number;
  enlistedStatus: string;
  workflowStatus: WorkflowStatus;
}

interface SecurityIncident {
  id: string;
  incidentCategory: string;
  villageCode: string;
  totalCases: number;
  resolvedCases: number;
  unresolvedCases: number;
  severity: "Low" | "Medium" | "High";
  period: string;
  workflowStatus: WorkflowStatus;
}

interface FireSafety {
  id: string;
  name: string;
  villageCode: string;
  fireSafetyFacilityCount: number;
  inspections: number;
  incidents: number;
  status: "Safe" | "Warning" | "Urgent";
  workflowStatus: WorkflowStatus;
}

interface DrugPrevention {
  id: string;
  category: string;
  monitoredCases: number;
  rehabCount: number;
  resolvedCount: number;
  period: string;
  workflowStatus: WorkflowStatus;
}

interface AuditLogEntry {
  id: string;
  actionType: "qp_an_access" | "qp_an_export";
  operator: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const DEFENSE_INDICATORS: DefenseIndicator[] = [
  { id: "di-1", metricType: "Lực lượng tự vệ cơ động", count: 130, unit: "chiến sĩ", target: 130, period: "2026-Q1", status: "Completed", workflowStatus: "published" },
  { id: "di-2", metricType: "Huấn luyện kỹ thuật chiến đấu", count: 95, unit: "lượt người", target: 125, period: "2026-Q1", status: "InProgress", workflowStatus: "published" },
  { id: "di-3", metricType: "Tuần tra liên hợp biên giới", count: 28, unit: "lượt", target: 48, period: "2026-Q1", status: "InProgress", workflowStatus: "unit_approved" },
];

const MILITIA_FORCES: MilitiaForce[] = [
  { id: "mf-1", squadName: "Trung đội dân quân cơ động xã", villageCode: "vinh-dong", forceCount: 28, equipmentStatus: "Đầy đủ trang bị cơ bản", patrolsPerMonth: 12, workflowStatus: "published" },
  {
    id: "mf-2",
    squadName: "Tiểu đội dân quân thường trực Ka Tăng",
    villageCode: "ka-tang",
    forceCount: 10,
    equipmentStatus: "Trang bị nâng cao biên giới",
    patrolsPerMonth: 24,
    workflowStatus: "published",
  },
  { id: "mf-3", squadName: "Tiểu đội dân quân tự vệ Làng Vây", villageCode: "lang-vay", forceCount: 9, equipmentStatus: "Đầy đủ công cụ hỗ trợ", patrolsPerMonth: 8, workflowStatus: "unit_approved" },
];

const RECRUITMENT_DATA: RecruitmentTarget[] = [
  { id: "rt-1", year: "2024", recruitmentTarget: 12, completedCount: 12, enlistedStatus: "Đạt 100% kế hoạch", workflowStatus: "published" },
  { id: "rt-2", year: "2025", recruitmentTarget: 14, completedCount: 14, enlistedStatus: "Đạt 100% kế hoạch", workflowStatus: "published" },
  { id: "rt-3", year: "2026", recruitmentTarget: 15, completedCount: 15, enlistedStatus: "Hoàn thành bàn giao quân", workflowStatus: "published" },
];

const INCIDENT_DATA: SecurityIncident[] = [
  {
    id: "inc-1",
    incidentCategory: "Trộm cắp vặt biên giới",
    villageCode: "ka-tang",
    totalCases: 6,
    resolvedCases: 5,
    unresolvedCases: 1,
    severity: "Low",
    period: "2026-Q1",
    workflowStatus: "published",
  },
  {
    id: "inc-2",
    incidentCategory: "Gây rối trật tự công cộng",
    villageCode: "vinh-dong",
    totalCases: 3,
    resolvedCases: 3,
    unresolvedCases: 0,
    severity: "Medium",
    period: "2026-Q1",
    workflowStatus: "published",
  },
  {
    id: "inc-3",
    incidentCategory: "Tranh chấp đất đai biên giới",
    villageCode: "lang-vay",
    totalCases: 2,
    resolvedCases: 1,
    unresolvedCases: 1,
    severity: "High",
    period: "2026-Q1",
    workflowStatus: "unit_approved",
  },
];

const FIRE_SAFETY_DATA: FireSafety[] = [
  { id: "fs-1", name: "Khu thương mại Lao Bảo", villageCode: "vinh-dong", fireSafetyFacilityCount: 12, inspections: 4, incidents: 0, status: "Safe", workflowStatus: "published" },
  { id: "fs-2", name: "Điểm tập kết hàng hóa cửa khẩu", villageCode: "ka-tang", fireSafetyFacilityCount: 6, inspections: 2, incidents: 0, status: "Warning", workflowStatus: "published" },
  { id: "fs-3", name: "Cụm công nghiệp Lao Bảo", villageCode: "tan-kim", fireSafetyFacilityCount: 18, inspections: 5, incidents: 0, status: "Safe", workflowStatus: "unit_approved" },
];

const DRUG_PREVENTION_DATA: DrugPrevention[] = [
  { id: "dp-1", category: "Quản lý đối tượng nghiện ma túy", monitoredCases: 18, rehabCount: 12, resolvedCount: 6, period: "2026-Q1", workflowStatus: "published" },
  { id: "dp-2", category: "Tuyên truyền phòng chống tệ nạn", monitoredCases: 120, rehabCount: 0, resolvedCount: 120, period: "2026-Q1", workflowStatus: "published" },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: "log-1", actionType: "qp_an_access", operator: "admin", ipAddress: "192.168.1.12", timestamp: "2026-07-14T08:30:15Z", details: "Truy cập xem danh sách Chỉ tiêu Quốc phòng Lao Bảo" },
  {
    id: "log-2",
    actionType: "qp_an_export",
    operator: "data_governance",
    ipAddress: "192.168.1.45",
    timestamp: "2026-07-14T08:35:22Z",
    details: "Kết xuất báo cáo Dân quân Tự vệ biên giới sang Excel",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getVillageName = (code: string) => {
  const v = VILLAGES.find((vv) => vv.code === code);
  return v ? `Thôn ${v.name}` : code;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SecurityDefensePage() {
  const { currentRole } = useTenant();
  const [activeTab, setActiveTab] = React.useState("indicators");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Datasets
  const [indicators, setIndicators] = React.useState<DefenseIndicator[]>(DEFENSE_INDICATORS);
  const [militia, setMilitia] = React.useState<MilitiaForce[]>(MILITIA_FORCES);
  const [recruitment, setRecruitment] = React.useState<RecruitmentTarget[]>(RECRUITMENT_DATA);
  const [incidents, setIncidents] = React.useState<SecurityIncident[]>(INCIDENT_DATA);
  const [fireSafety, setFireSafety] = React.useState<FireSafety[]>(FIRE_SAFETY_DATA);
  const [drugs, setDrugs] = React.useState<DrugPrevention[]>(DRUG_PREVENTION_DATA);
  const [auditLogs, setAuditLogs] = React.useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // 2FA Security Challenge States
  const [is2faOpen, setIs2faOpen] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [pendingAction, setPendingAction] = React.useState<"view" | "export" | null>(null);
  const [pendingItem, setPendingItem] = React.useState<any | null>(null);

  // Detail Modal States
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<any | null>(null);

  // Add/Edit Dialog States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formRecord, setFormRecord] = React.useState<any>({});

  // RBAC Access Control Check
  // Allowed: admin, data_governance, commune_leader
  const hasAccess = React.useMemo(() => {
    return ["admin", "data_governance", "commune_leader"].includes(currentRole || "");
  }, [currentRole]);

  // Handle opening 2FA before triggering actual operations
  const triggerConfidentialAction = (action: "view" | "export", item: any = null) => {
    setPendingAction(action);
    setPendingItem(item);
    setOtpCode("");
    setIs2faOpen(true);
  };

  const handle2faSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== "123456") {
      toast.error("Mã xác thực OTP không chính xác. Thử lại với mã: 123456");
      return;
    }

    const action = pendingAction;
    const item = pendingItem;

    setIs2faOpen(false);

    // Write Dedicated Audit Log Event
    const logType = action === "export" ? "qp_an_export" : "qp_an_access";
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      actionType: logType,
      operator: currentRole || "unknown",
      ipAddress: "192.168.1.100",
      timestamp: new Date().toISOString(),
      details: action === "export" ? `Xuất dữ liệu mật QP-AN (${activeTab})` : `Xem chi tiết bản ghi mật ID: ${item?.id || "unknown"}`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);

    // Perform target action
    if (action === "view") {
      setActiveRecord({ ...item, _dataset: activeTab });
      setIsDetailOpen(true);
      toast.success("Xác thực 2FA thành công. Đã cấp quyền truy cập bản ghi.");
    } else if (action === "export") {
      toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
        loading: "Đang mã hóa tệp dữ liệu quốc phòng...",
        success: "Xuất dữ liệu mật thành công! Tệp Excel đã được tải xuống an toàn.",
        error: "Lỗi xuất dữ liệu.",
      });
    }

    setPendingAction(null);
    setPendingItem(null);
  };

  // Workflow Handlers
  const handleWorkflow = (rec: any, dataset: string, next: WorkflowStatus) => {
    if (dataset === "indicators") setIndicators((p) => p.map((r) => (r.id === rec.id ? { ...r, workflowStatus: next } : r)));
    else if (dataset === "militia") setMilitia((p) => p.map((r) => (r.id === rec.id ? { ...r, workflowStatus: next } : r)));
    else if (dataset === "recruitment") setRecruitment((p) => p.map((r) => (r.id === rec.id ? { ...r, workflowStatus: next } : r)));
    else if (dataset === "incidents") setIncidents((p) => p.map((r) => (r.id === rec.id ? { ...r, workflowStatus: next } : r)));
    else if (dataset === "fireSafety") setFireSafety((p) => p.map((r) => (r.id === rec.id ? { ...r, workflowStatus: next } : r)));
    else if (dataset === "drugs") setDrugs((p) => p.map((r) => (r.id === rec.id ? { ...r, workflowStatus: next } : r)));

    toast.success("Đã cập nhật trạng thái quy trình phê duyệt!");
    setIsDetailOpen(false);
  };

  // Add/Edit Handlers
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "indicators") {
      if (formRecord.id) {
        setIndicators((p) => p.map((r) => (r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: "draft" as WorkflowStatus } : r)));
        toast.success("Cập nhật chỉ số quốc phòng thành công!");
      } else {
        setIndicators((p) => [
          {
            id: `di-${Date.now()}`,
            metricType: formRecord.metricType || "",
            count: Number(formRecord.count) || 0,
            unit: formRecord.unit || "chiến sĩ",
            target: Number(formRecord.target) || 0,
            period: formRecord.period || "2026-Q1",
            status: "InProgress",
            workflowStatus: "draft",
          },
          ...p,
        ]);
        toast.success("Thêm mới chỉ số quốc phòng thành công!");
      }
    } else if (activeTab === "militia") {
      if (formRecord.id) {
        setMilitia((p) => p.map((r) => (r.id === formRecord.id ? { ...r, ...formRecord, workflowStatus: "draft" as WorkflowStatus } : r)));
        toast.success("Cập nhật thông tin trung đội dân quân tự vệ thành công!");
      } else {
        setMilitia((p) => [
          {
            id: `mf-${Date.now()}`,
            squadName: formRecord.squadName || "",
            villageCode: formRecord.villageCode || VILLAGES[0].code,
            forceCount: Number(formRecord.forceCount) || 0,
            equipmentStatus: formRecord.equipmentStatus || "Đầy đủ",
            patrolsPerMonth: Number(formRecord.patrolsPerMonth) || 0,
            workflowStatus: "draft",
          },
          ...p,
        ]);
        toast.success("Thêm mới dân quân tự vệ thôn thành công!");
      }
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, dataset: string, name: string) => {
    if (!confirm(`Xóa bản ghi mật: ${name}?`)) return;
    if (dataset === "indicators") setIndicators((p) => p.filter((r) => r.id !== id));
    else if (dataset === "militia") setMilitia((p) => p.filter((r) => r.id !== id));
    toast.info(`Đã gỡ bỏ bản ghi khỏi CSDL Quốc phòng: ${name}`);
  };

  // Rendering Workflow Buttons
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

  // Filters
  const filteredIndicators = indicators.filter((r) => r.metricType.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMilitia = militia.filter((r) => r.squadName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredIncidents = incidents.filter((r) => r.incidentCategory.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFireSafety = fireSafety.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // ──────────────────── Access Denied View ────────────────────
  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-xs">
        <Card className="border-rose-500/20 bg-rose-500/5 max-w-md w-full shadow-lg">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Lock className="size-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-sm font-bold text-rose-700 dark:text-rose-400">TRUY CẬP BỊ TỪ CHỐI — CSDL MẬT</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tài liệu và chỉ tiêu liên quan tới Quốc phòng - An ninh thuộc cấp bảo mật &quot;confidential&quot;. Tài khoản của bạn không được cấp quyền{" "}
                <code className="bg-rose-500/10 px-1 py-0.5 rounded font-mono">viewConfidential</code>.
              </p>
            </div>
            <div className="text-[9px] text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border">
              Mọi hành vi truy cập trái phép đều được ghi nhận tự động vào hệ thống Audit Log xã Lao Bảo.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ──────────────────── Render UI ────────────────────
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Restrict warning banner */}
      <Card className="border-rose-500/30 bg-rose-500/5 text-rose-800 dark:text-rose-300 p-3.5 flex items-start gap-2.5 rounded-xl">
        <ShieldAlert className="size-4 shrink-0 mt-0.5 text-rose-500" />
        <div className="space-y-1.5">
          <p className="font-bold text-[10px] uppercase tracking-wide">Cảnh báo: Dữ liệu giới hạn lưu hành nội bộ xã Lao Bảo</p>
          <p className="text-[9px] text-muted-foreground">
            CSDL Quốc phòng - An ninh biên giới được mã hóa và bảo mật nghiêm ngặt. Xác thực 2FA (OTP) được yêu cầu trước khi xem chi tiết hoặc tải tệp dữ liệu mật.
          </p>
        </div>
      </Card>

      {/* Header */}
      <PageHeader
        title={
          <>
            <Shield className="w-6 h-6 text-primary" />
            CSDL Quốc phòng &amp; An ninh Biên giới
          </>
        }
        description="Chủ trì bởi Công an xã và Ban Chỉ huy Quân sự xã Lao Bảo. Bảo vệ ranh giới an toàn địa bàn."
        actions={
          <>
            <Button onClick={() => triggerConfidentialAction("export")} variant="outline" size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border">
              <FileSpreadsheet className="size-4" />
              Tải CSDL mật (Excel)
            </Button>
            {(currentRole === "admin" || currentRole === "data_officer") && (
              <Button
                onClick={() => {
                  setFormRecord(
                    activeTab === "militia"
                      ? { squadName: "", villageCode: VILLAGES[0].code, forceCount: "", equipmentStatus: "", patrolsPerMonth: "" }
                      : { metricType: "", count: "", unit: "chiến sĩ", target: "", period: "2026-Q1" },
                  );
                  setIsFormOpen(true);
                }}
                size="sm"
                className="h-9 text-xs cursor-pointer gap-1.5 shadow-none"
              >
                <Plus className="size-4" />
                Thêm chỉ tiêu
              </Button>
            )}
          </>
        }
      />

      {/* Security requirements status panel */}
      <Card className="border-border bg-card shadow-2xs">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Lock className="size-4" />
            </div>
            <div>
              <p className="font-bold text-[10px] text-foreground">Mã hóa tĩnh (At Rest)</p>
              <p className="text-[9px] text-muted-foreground">
                Cơ sở dữ liệu mật: <span className="font-bold text-amber-500">Planned (Kế hoạch)</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <KeyRound className="size-4" />
            </div>
            <div>
              <p className="font-bold text-[10px] text-foreground">Xác thực 2 lớp (2FA)</p>
              <p className="text-[9px] text-muted-foreground">
                Yêu cầu OTP truy cập:{" "}
                <span className="font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  <CheckCircle className="size-3" /> Đã hoạt động (Mock)
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <History className="size-4" />
            </div>
            <div>
              <p className="font-bold text-[10px] text-foreground">Audit Trail độc lập</p>
              <p className="text-[9px] text-muted-foreground">
                Giám sát truy vết:{" "}
                <span className="font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  <CheckCircle className="size-3" /> Đã hoạt động (Mock)
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px">
        {[
          { id: "indicators", label: "Chỉ tiêu Quốc phòng" },
          { id: "militia", label: "Lực lượng Dân quân" },
          { id: "recruitment", label: "Chỉ tiêu Tuyển quân" },
          { id: "security", label: "An ninh trật tự" },
          { id: "pccc", label: "PCCC &amp; Phòng cháy" },
          { id: "drugs", label: "PC Ma túy &amp; Tệ nạn" },
          { id: "audit-logs", label: "Nhật ký bảo mật (Audit)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery("");
            }}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            dangerouslySetInnerHTML={{ __html: tab.label }}
          />
        ))}
      </div>

      {/* Search box (except for recruitment and logs) */}
      {!["recruitment", "drugs", "audit-logs"].includes(activeTab) && (
        <Card className="border-border bg-card shadow-2xs">
          <CardContent className="p-0">
            <SearchInput
              placeholder="Tìm kiếm thông tin quốc phòng, an ninh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputClassName="border-none bg-transparent focus-visible:ring-0"
              iconClassName="left-3"
            />
          </CardContent>
        </Card>
      )}

      {/* ────────── TAB: Defense Indicators ────────── */}
      {activeTab === "indicators" && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Chỉ tiêu quốc phòng</th>
                  <th className="py-3.5 px-4 text-right">Thực tế g.nhận</th>
                  <th className="py-3.5 px-4 text-right">Chỉ tiêu giao</th>
                  <th className="py-3.5 px-4">Độ bao phủ</th>
                  <th className="py-3.5 px-4">Kỳ báo cáo</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredIndicators.map((r) => {
                  const pct = Math.min((r.count / r.target) * 100, 100);
                  return (
                    <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">{r.metricType}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">
                        {r.count} {r.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-muted-foreground">
                        {r.target} {r.unit}
                      </td>
                      <td className="py-3.5 px-4 w-36">
                        <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                          <div className="h-full bg-primary/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{r.period}</td>
                      <td className="py-3.5 px-4">
                        <WorkflowStatusBadge status={r.workflowStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <ActionMenu
                          entityName="chỉ tiêu quốc phòng"
                          onView={() => triggerConfidentialAction("view", r)}
                          onEdit={
                            currentRole === "admin"
                              ? () => {
                                  setFormRecord({ ...r });
                                  setIsFormOpen(true);
                                }
                              : undefined
                          }
                          onDelete={currentRole === "admin" ? () => setIndicators((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
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

      {/* ────────── TAB: Militia Forces ────────── */}
      {activeTab === "militia" && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Tên trung đội/tiểu đội</th>
                  <th className="py-3.5 px-4">Thôn phụ trách</th>
                  <th className="py-3.5 px-4 text-right">Lực lượng (Chiến sĩ)</th>
                  <th className="py-3.5 px-4">Tình trạng trang bị</th>
                  <th className="py-3.5 px-4 text-right">Lượt tuần tra / tháng</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredMilitia.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                      <Users className="size-3.5 text-blue-500 shrink-0" /> {r.squadName}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.forceCount}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{r.equipmentStatus}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-indigo-600">{r.patrolsPerMonth}</td>
                    <td className="py-3.5 px-4">
                      <WorkflowStatusBadge status={r.workflowStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <ActionMenu
                        entityName="lực lượng dân quân"
                        onView={() => triggerConfidentialAction("view", r)}
                        onEdit={
                          currentRole === "admin"
                            ? () => {
                                setFormRecord({ ...r });
                                setIsFormOpen(true);
                              }
                            : undefined
                        }
                        onDelete={currentRole === "admin" ? () => setMilitia((prev) => prev.filter((item) => item.id !== r.id)) : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ────────── TAB: Recruitment Target ────────── */}
      {activeTab === "recruitment" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recruitment.map((r) => {
            const pct = Math.min((r.completedCount / r.recruitmentTarget) * 100, 100);
            return (
              <Card key={r.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
                <CardHeader className="pb-3 flex flex-row justify-between items-center px-4 pt-4 border-b border-border/40">
                  <div>
                    <h3 className="font-bold text-foreground">Năm tuyển quân: {r.year}</h3>
                    <p className="text-[10px] text-muted-foreground">Kế hoạch Quốc phòng xã Lao Bảo</p>
                  </div>
                  <WorkflowStatusBadge status={r.workflowStatus} />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground font-semibold">Chỉ tiêu bàn giao</span>
                    <span className="font-bold text-foreground">{r.recruitmentTarget} thanh niên</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground font-semibold">Thực tế giao quân</span>
                    <span className="font-bold text-emerald-600">
                      {r.completedCount} thanh niên ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[9px] font-semibold text-muted-foreground bg-muted/30 p-2 border border-border/50 rounded-lg">{r.enlistedStatus}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ────────── TAB: Incident Log ────────── */}
      {activeTab === "security" && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Loại sự việc mất ANTT</th>
                  <th className="py-3.5 px-4">Thôn</th>
                  <th className="py-3.5 px-4 text-right">Tổng vụ việc</th>
                  <th className="py-3.5 px-4 text-right">Đã giải quyết</th>
                  <th className="py-3.5 px-4 text-right">Đang thụ lý</th>
                  <th className="py-3.5 px-4">Mức độ nguy cơ</th>
                  <th className="py-3.5 px-4">Quy trình</th>
                  <th className="py-3.5 px-4 text-center">HĐ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredIncidents.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldAlert className="size-3.5 text-rose-500 shrink-0" /> {r.incidentCategory}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.totalCases}</td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 font-bold">{r.resolvedCases}</td>
                    <td className="py-3.5 px-4 text-right text-amber-600 font-bold">{r.unresolvedCases}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 font-bold uppercase ${r.severity === "High" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : r.severity === "Medium" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"}`}
                      >
                        {r.severity === "High" ? "Cao" : r.severity === "Medium" ? "Vừa" : "Thấp"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <WorkflowStatusBadge status={r.workflowStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Button
                        onClick={() => triggerConfidentialAction("view", r)}
                        variant="outline"
                        size="xs"
                        className="h-7 w-7 p-0 cursor-pointer border-border mx-auto flex items-center justify-center"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ────────── TAB: Fire Safety ────────── */}
      {activeTab === "pccc" && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Cơ sở trọng điểm PCCC</th>
                  <th className="py-3.5 px-4">Thôn</th>
                  <th className="py-3.5 px-4 text-right">Thiết bị PCCC</th>
                  <th className="py-3.5 px-4 text-right">Lượt kiểm tra</th>
                  <th className="py-3.5 px-4 text-right">Sự cố cháy nổ</th>
                  <th className="py-3.5 px-4">Đánh giá an toàn</th>
                  <th className="py-3.5 px-4 text-center">HĐ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {filteredFireSafety.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                      <Flame className="size-3.5 text-amber-500 shrink-0" /> {r.name}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{getVillageName(r.villageCode)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{r.fireSafetyFacilityCount} thiết bị</td>
                    <td className="py-3.5 px-4 text-right text-muted-foreground">{r.inspections} lượt</td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-600">{r.incidents}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 font-bold uppercase ${r.status === "Safe" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}
                      >
                        {r.status === "Safe" ? "An toàn" : "Cần khắc phục"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Button
                        onClick={() => triggerConfidentialAction("view", r)}
                        variant="outline"
                        size="xs"
                        className="h-7 w-7 p-0 cursor-pointer border-border mx-auto flex items-center justify-center"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ────────── TAB: Drug Prevention ────────── */}
      {activeTab === "drugs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drugs.map((r) => (
            <Card key={r.id} className="border-border bg-card">
              <CardHeader className="pb-3 px-4 pt-4 border-b border-border/40 flex flex-row justify-between items-center">
                <div>
                  <h3 className="font-bold text-foreground">{r.category}</h3>
                  <p className="text-[10px] text-muted-foreground">{r.period} · UBND xã Lao Bảo</p>
                </div>
                <WorkflowStatusBadge status={r.workflowStatus} />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground font-semibold">Số đối tượng đưa vào quản lý</span>
                  <span className="font-bold text-foreground">{r.monitoredCases} trường hợp</span>
                </div>
                {r.rehabCount > 0 && (
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground font-semibold">Đang cai nghiện tập trung/tại cộng đồng</span>
                    <span className="font-bold text-blue-600">{r.rehabCount} trường hợp</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] pt-1.5 border-t border-border/30">
                  <span className="text-muted-foreground font-semibold">Đã hoàn thành chương trình / Xử lý xong</span>
                  <span className="font-bold text-emerald-600">{r.resolvedCount} trường hợp</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ────────── TAB: Audit Logs ────────── */}
      {activeTab === "audit-logs" && (
        <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Loại sự kiện</th>
                  <th className="py-3.5 px-4">Tài khoản thực hiện</th>
                  <th className="py-3.5 px-4">Địa chỉ IP</th>
                  <th className="py-3.5 px-4">Thời gian xảy ra</th>
                  <th className="py-3.5 px-4">Nội dung chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {auditLogs.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 font-bold uppercase ${r.actionType === "qp_an_export" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"}`}
                      >
                        {r.actionType === "qp_an_export" ? "Export" : "Access/View"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-muted-foreground">{r.operator}</td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">{r.ipAddress}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{r.timestamp}</td>
                    <td className="py-3.5 px-4 text-foreground font-medium">{r.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ─── 2FA Mock OTP Dialog (OTP Challenge Modal) ─── */}
      <Dialog open={is2faOpen} onOpenChange={setIs2faOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center space-y-2">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-1">
              <KeyRound className="size-6 animate-pulse" />
            </div>
            <DialogTitle className="text-sm font-bold text-foreground">YÊU CẦU XÁC THỰC HAI LỚP (2FA)</DialogTitle>
            <DialogDescription className="text-xs">Mã bảo mật OTP đã được gửi đến thiết bị di động của bạn. Nhập mã OTP để xác nhận quyền truy cập dữ liệu Quốc phòng mật.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handle2faSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground text-xs">Mã xác thực OTP (Mã thử nghiệm: 123456)</label>
              <Input
                type="text"
                placeholder="Nhập 6 ký tự số..."
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="bg-background border-border text-xs text-center font-mono font-bold text-lg tracking-widest h-10 shadow-none"
              />
            </div>
            <DialogFooter className="pt-2 border-t border-border/40 gap-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs cursor-pointer shadow-none border-border">
                  Hủy bỏ
                </Button>
              </DialogClose>
              <Button type="submit" size="sm" className="h-9 text-xs cursor-pointer shadow-none">
                Xác nhận
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Detail Dialog ─── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileLock className="size-4 text-rose-500" />
              Chi tiết CSDL Quốc phòng - Mật
            </DialogTitle>
            <DialogDescription className="text-xs">Dữ liệu mật hạn chế lưu hành cấp cơ sở.</DialogDescription>
          </DialogHeader>

          {activeRecord && (
            <div className="space-y-3 py-2 text-xs">
              {activeRecord._dataset === "indicators" && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Chỉ tiêu quốc phòng</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.metricType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Thực tế tích lũy</span>
                      <p className="font-bold text-foreground mt-0.5">
                        {activeRecord.count} {activeRecord.unit}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Chỉ tiêu giao quân</span>
                      <p className="font-bold text-foreground mt-0.5">
                        {activeRecord.target} {activeRecord.unit}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Kỳ báo cáo</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.period}</p>
                  </div>
                </>
              )}

              {activeRecord._dataset === "militia" && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên lực lượng</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.squadName}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Thôn</span>
                      <p className="font-bold text-foreground mt-0.5">{getVillageName(activeRecord.villageCode)}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Lực lượng quân số</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.forceCount} chiến sĩ</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tuần tra / tháng</span>
                      <p className="font-bold text-indigo-600 mt-0.5">{activeRecord.patrolsPerMonth} lượt</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Trạng thái khí tài, trang bị</span>
                    <p className="font-bold text-foreground mt-0.5 leading-normal">{activeRecord.equipmentStatus}</p>
                  </div>
                </>
              )}

              {activeRecord._dataset === "security" && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Phân loại vụ việc an ninh</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.incidentCategory}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tổng vụ việc</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.totalCases} vụ</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Đã xử lý xong</span>
                      <p className="font-bold text-emerald-600 mt-0.5">{activeRecord.resolvedCases} vụ</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Đang thụ lý</span>
                      <p className="font-bold text-amber-600 mt-0.5">{activeRecord.unresolvedCases} vụ</p>
                    </div>
                  </div>
                </>
              )}

              {activeRecord._dataset === "pccc" && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Cơ sở trọng điểm PCCC</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.name}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Số thiết bị PCCC</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.fireSafetyFacilityCount} thiết bị</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Lượt kiểm tra</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.inspections} lượt</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Số vụ tai nạn</span>
                      <p className="font-bold text-rose-600 mt-0.5">{activeRecord.incidents} vụ</p>
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
              <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer shadow-none border-border">
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add/Edit Form Dialog ─── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id ? "Cập nhật" : "Thêm mới"} — {activeTab === "militia" ? "Lực lượng Dân quân" : "Chỉ tiêu Quốc phòng"}
            </DialogTitle>
            <DialogDescription className="text-xs">Nhập dữ liệu và lưu ý bảo mật.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            {activeTab === "indicators" && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Chỉ tiêu quốc phòng</label>
                  <Input
                    value={formRecord.metricType || ""}
                    onChange={(e) => setFormRecord((p: any) => ({ ...p, metricType: e.target.value }))}
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Thực tế</label>
                    <Input
                      type="number"
                      value={formRecord.count || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, count: Number(e.target.value) }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Kế hoạch giao</label>
                    <Input
                      type="number"
                      value={formRecord.target || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, target: Number(e.target.value) }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Đơn vị đo</label>
                    <Input
                      value={formRecord.unit || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, unit: e.target.value }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Kỳ báo cáo</label>
                    <Input
                      value={formRecord.period || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, period: e.target.value }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "militia" && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên trung đội/tiểu đội</label>
                  <Input
                    value={formRecord.squadName || ""}
                    onChange={(e) => setFormRecord((p: any) => ({ ...p, squadName: e.target.value }))}
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Thôn phụ trách</label>
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
                    <label className="font-bold text-foreground">Số chiến sĩ</label>
                    <Input
                      type="number"
                      value={formRecord.forceCount || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, forceCount: Number(e.target.value) }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Tuần tra / tháng</label>
                    <Input
                      type="number"
                      value={formRecord.patrolsPerMonth || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, patrolsPerMonth: Number(e.target.value) }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Trang bị khí tài</label>
                    <Input
                      value={formRecord.equipmentStatus || ""}
                      onChange={(e) => setFormRecord((p: any) => ({ ...p, equipmentStatus: e.target.value }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
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
