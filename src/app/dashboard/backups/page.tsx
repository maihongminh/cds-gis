// src/app/dashboard/backups/page.tsx
"use client";

import { ActionMenu, PageHeader } from "@/components/common";
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
} from "@/components/ui";
import { Database, Info, Plus, RotateCcw, ShieldAlert } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface BackupRecord {
  id: string;
  fileName: string;
  size: string;
  startedAt: string;
  completedAt: string;
  status: "completed" | "failed" | "running";
  initiatedBy: string;
  type: "daily" | "weekly" | "manual";
}

const INITIAL_BACKUPS: BackupRecord[] = [
  {
    id: "bak-1",
    fileName: "backup_laobao_db_20260714_0000.sql.gz",
    size: "42.5 MB",
    startedAt: "2026-07-14T00:00:01Z",
    completedAt: "2026-07-14T00:01:15Z",
    status: "completed",
    initiatedBy: "Hệ thống tự động",
    type: "daily",
  },
  {
    id: "bak-2",
    fileName: "backup_laobao_db_20260713_0000.sql.gz",
    size: "42.3 MB",
    startedAt: "2026-07-13T00:00:01Z",
    completedAt: "2026-07-13T00:01:12Z",
    status: "completed",
    initiatedBy: "Hệ thống tự động",
    type: "daily",
  },
  {
    id: "bak-3",
    fileName: "backup_laobao_db_20260712_0000.sql.gz",
    size: "42.1 MB",
    startedAt: "2026-07-12T00:00:02Z",
    completedAt: "2026-07-12T00:01:14Z",
    status: "completed",
    initiatedBy: "Hệ thống tự động",
    type: "daily",
  },
  {
    id: "bak-4",
    fileName: "backup_laobao_db_20260705_weekly.sql.gz",
    size: "280.4 MB",
    startedAt: "2026-07-05T01:00:00Z",
    completedAt: "2026-07-05T01:08:45Z",
    status: "completed",
    initiatedBy: "Hệ thống tự động",
    type: "weekly",
  },
  {
    id: "bak-5",
    fileName: "backup_laobao_db_manual_edit_layers.sql.gz",
    size: "41.8 MB",
    startedAt: "2026-07-10T15:20:10Z",
    completedAt: "2026-07-10T15:21:20Z",
    status: "completed",
    initiatedBy: "Nguyễn Văn A (admin)",
    type: "manual",
  },
];

export default function BackupsPage() {
  const { currentRole } = useTenant();
  const [backups, setBackups] = React.useState<BackupRecord[]>(INITIAL_BACKUPS);

  // Backup configurations
  const [schedule, setSchedule] = React.useState<"daily" | "weekly" | "monthly">("daily");
  const [retentionDays, setRetentionDays] = React.useState<number>(30);

  // Restore Dialog states
  const [isRestoreOpen, setIsRestoreOpen] = React.useState(false);
  const [activeBackup, setActiveBackup] = React.useState<BackupRecord | null>(null);

  const isEditable = currentRole === "admin";

  const handleCreateManualBackup = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          const newBackup: BackupRecord = {
            id: `bak-${Date.now()}`,
            fileName: `backup_laobao_db_manual_${Date.now()}.sql.gz`,
            size: "42.6 MB",
            startedAt: new Date().toISOString(),
            completedAt: new Date(Date.now() + 75000).toISOString(),
            status: "completed",
            initiatedBy: "Nguyễn Văn A (admin)",
            type: "manual",
          };
          setBackups((prev) => [newBackup, ...prev]);
          resolve(true);
        }, 2000);
      }),
      {
        loading: "Đang khởi tạo sao lưu cơ sở dữ liệu GIS và hồ sơ nghiệp vụ...",
        success: "Khởi tạo sao lưu cơ sở dữ liệu thành công!",
        error: "Lỗi sao lưu.",
      },
    );
  };

  const handleDeleteBackup = (id: string, fileName: string) => {
    if (!confirm(`Xóa vĩnh viễn tệp sao lưu: ${fileName}?`)) return;
    setBackups((prev) => prev.filter((b) => b.id !== id));
    toast.info(`Đã gỡ bỏ bản sao lưu: ${fileName}`);
  };

  const handleTriggerRestore = () => {
    setIsRestoreOpen(false);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 3000)), {
      loading: `Đang giải nén và phục hồi cơ sở dữ liệu từ tệp ${activeBackup?.fileName}...`,
      success: "Khôi phục dữ liệu hệ thống thành công! Toàn bộ chỉ số và lớp bản đồ đã được đồng bộ.",
      error: "Lỗi phục hồi.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Database className="w-6 h-6 text-primary" />
            Quản trị Sao lưu &amp; Phục hồi dữ liệu
          </>
        }
        description="Thiết lập lịch trình sao lưu cơ sở dữ liệu GIS, chỉ số và cấu hình hệ thống tự động."
        actions={
          isEditable && (
            <Button onClick={handleCreateManualBackup} size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none font-semibold">
              <Plus className="size-4" />
              Sao lưu ngay (Manual)
            </Button>
          )
        }
      />

      {/* Warning UI Mock alert */}
      <Card className="border-rose-500/20 bg-rose-500/5 p-4 rounded-xl flex gap-3">
        <div className="flex gap-2">
          <ShieldAlert className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-rose-700 dark:text-rose-400">
            <p className="font-bold text-xs uppercase tracking-wider">Cảnh báo mô phỏng giao diện (UI Mock Only)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Các tính năng sao lưu, nén dữ liệu (.sql.gz) và phục hồi cơ sở dữ liệu trên trang này hoàn toàn là mô phỏng giao diện điều khiển. Thao tác khôi phục dữ liệu thực sự yêu cầu quyền quản
              trị cơ sở dữ liệu trực tiếp trên máy chủ backend.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduler config panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <h3 className="font-bold text-foreground">Cấu hình lịch trình sao lưu</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Thiết lập tự động sao lưu định kỳ</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Tần suất sao lưu hệ thống</label>
                <Select disabled={!isEditable} value={schedule} onValueChange={(val: any) => setSchedule(val)}>
                  <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                    <SelectValue placeholder="Tần suất sao lưu" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="daily" className="cursor-pointer">
                      Hằng ngày (00:00 AM)
                    </SelectItem>
                    <SelectItem value="weekly" className="cursor-pointer">
                      Hằng tuần (Chủ nhật 01:00 AM)
                    </SelectItem>
                    <SelectItem value="monthly" className="cursor-pointer">
                      Hằng tháng (Ngày 01 đầu tháng)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Thời hạn lưu giữ tệp (Retention Policy)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    disabled={!isEditable}
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(Number(e.target.value))}
                    className="bg-background border-border text-xs h-9 shadow-none w-24"
                  />
                  <span className="text-muted-foreground">ngày gần nhất</span>
                </div>
                <p className="text-[9px] text-muted-foreground leading-normal mt-1">Các tệp sao lưu quá thời gian trên sẽ tự động bị xóa để giải phóng ổ đĩa.</p>
              </div>

              {isEditable && (
                <Button onClick={() => toast.success("Đã lưu cấu hình tự động sao lưu dữ liệu.")} className="w-full h-9 text-xs cursor-pointer shadow-none font-semibold">
                  Lưu cấu hình
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Backups List Table */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card shadow-2xs overflow-hidden">
            <CardHeader>
              <h3 className="font-bold text-foreground flex items-center gap-1.5">
                <Database className="size-4 text-primary" /> Nhật ký danh sách các bản sao lưu (.sql.gz)
              </h3>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Tên tệp sao lưu</th>
                    <th className="py-3.5 px-4">Dung lượng</th>
                    <th className="py-3.5 px-4">Khởi tạo bởi</th>
                    <th className="py-3.5 px-4">Thời điểm tạo</th>
                    <th className="py-3.5 px-4 text-center">Trạng thái</th>
                    {isEditable && <th className="py-3.5 px-4 text-center">Thao tác</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {backups.map((bak) => (
                    <tr key={bak.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">{bak.fileName}</td>
                      <td className="py-3.5 px-4 font-semibold text-muted-foreground">{bak.size}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">{bak.initiatedBy}</td>
                      <td className="py-3.5 px-4 text-muted-foreground font-mono">{new Date(bak.startedAt).toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] uppercase font-bold">
                          Thành công
                        </Badge>
                      </td>
                      {isEditable && (
                        <td className="py-3.5 px-4 text-center">
                          <ActionMenu
                            entityName="tệp sao lưu"
                            customActions={[
                              {
                                label: "Khôi phục hệ thống (Restore)",
                                icon: <RotateCcw className="size-3.5" />,
                                onClick: () => {
                                  setActiveBackup(bak);
                                  setIsRestoreOpen(true);
                                },
                              },
                            ]}
                            onDelete={() => {
                              setBackups((prev) => prev.filter((b) => b.id !== bak.id));
                              toast.info(`Đã gỡ bỏ bản sao lưu: ${bak.fileName}`);
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Restore Confirmation Dialog ─── */}
      <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="size-4 text-rose-600" />
              Yêu cầu xác nhận Khôi phục hệ thống (Restore)
            </DialogTitle>
            <DialogDescription className="text-xs">Thao tác này sẽ ghi đè dữ liệu hiện tại bằng dữ liệu trong tệp sao lưu.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-muted/20 border border-border rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên tệp phục hồi chọn lọc</span>
              <p className="font-bold text-foreground mt-0.5 font-mono">{activeBackup?.fileName}</p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Vui lòng đảm bảo không có giao dịch nhập liệu hoặc duyệt dữ liệu nào đang diễn ra trong lúc khôi phục. Mọi thay đổi chưa sao lưu sau thời điểm tạo tệp (
              {activeBackup ? new Date(activeBackup.startedAt).toLocaleString() : ""}) sẽ bị mất.
            </p>

            <div className="p-3 bg-rose-500/5 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-500/20 text-[10px] leading-relaxed flex items-start gap-1.5">
              <Info className="size-4 shrink-0 mt-0.5 text-rose-500" />
              <span>
                <strong>Nhãn:</strong> Mock — no real backup operation will occur. Thao tác khôi phục trên hệ thống thật yêu cầu tạm dừng web server để nạp lại sql dump.
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border/40 gap-2">
            <Button onClick={handleTriggerRestore} size="sm" className="h-9 text-xs cursor-pointer shadow-none font-semibold bg-rose-600 hover:bg-rose-700 text-white">
              Đồng ý Khôi phục
            </Button>
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-9 text-xs cursor-pointer shadow-none border-border">
                Hủy bỏ
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
