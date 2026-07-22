// src/app/dashboard/audit-logs/page.tsx
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
} from '@/components/ui';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Info,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, SearchInput } from '@/components/common';
import { MOCK_AUDIT_LOGS, MOCK_SECURITY_REPORT, AuditLog } from '@/data/mock-audit-logs';

export default function AuditLogsPage() {
  const { currentRole } = useTenant();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeActionFilter, setActiveActionFilter] = React.useState<'all' | 'qpan'>('all');
  const [isReportOpen, setIsReportOpen] = React.useState(false);

  // Check permission for QP-AN security logs (DATA-SECDEF-07)
  const hasQPAccessPermission = React.useMemo(() => {
    return ['admin', 'data_governance', 'commune_leader'].includes(currentRole || '');
  }, [currentRole]);

  // Filter logs list
  const filteredLogs = React.useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((log) => {
      // Exclude QP-AN logs completely if the user has no permissions
      const isQPLog = ['qp_an_access', 'qp_an_export', 'qp_an_2fa_challenge'].includes(log.action);
      if (isQPLog && !hasQPAccessPermission) {
        return false;
      }

      // Filter by specialized button QP-AN
      if (activeActionFilter === 'qpan' && !isQPLog) {
        return false;
      }

      const matchesSearch = log.userFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery, activeActionFilter, hasQPAccessPermission]);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <PageHeader
        title={
          <>
            <ShieldCheck className="w-6 h-6 text-primary" />
            Nhật ký giám sát hệ thống (Audit Logs)
          </>
        }
        description="Lịch sử vết truy vết chi tiết mọi hoạt động truy cập, cập nhật và kết xuất dữ liệu bản đồ số xã Lao Bảo."
        actions={
          hasQPAccessPermission && (
            <Button
              onClick={() => setIsReportOpen(true)}
              variant="outline"
              size="sm"
              className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border"
            >
              <Calendar className="size-4 text-primary" />
              Xem Báo cáo An ninh Tháng
            </Button>
          )
        }
      />

      {/* Info security notice */}
      <Card className="border-border bg-card p-4 flex gap-3">
        <div className="flex gap-2">
          <Info className="size-5 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground leading-normal">
            <strong>Tiêu chuẩn an toàn dữ liệu QP-AN:</strong> Tuân thủ yêu cầu <code className="bg-rose-500/10 px-1 py-0.5 rounded text-rose-600 font-bold">DATA-SECDEF-07</code>, hệ thống chỉ ghi lại lịch sử siêu dữ liệu (metadata) của các hành vi truy cập hoặc kết xuất vùng cấm quốc phòng (tên người dùng, vai trò, mốc thời gian, mã sự kiện), tuyệt đối không lưu giữ payload dữ liệu thô hay tọa độ nhạy cảm trong log.
          </p>
        </div>
      </Card>

      {/* Filter and Search controls */}
      <Card className="border-border bg-card shadow-2xs">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchInput
            placeholder="Tìm kiếm theo cán bộ, hành động, phân hệ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="grow"
            inputClassName="border-none bg-transparent focus-visible:ring-0"
            iconClassName="left-2"
          />

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => {
                setActiveActionFilter('all');
                toast.info('Đang hiển thị toàn bộ nhật ký truy vết.');
              }}
              variant={activeActionFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="h-9 text-xs cursor-pointer shadow-none"
            >
              Tất cả hoạt động
            </Button>
            {hasQPAccessPermission && (
              <Button
                onClick={() => {
                  setActiveActionFilter('qpan');
                  toast.info('Đã lọc: Hiển thị nhật ký QP-AN access & export.');
                }}
                variant={activeActionFilter === 'qpan' ? 'destructive' : 'outline'}
                size="sm"
                className="h-9 text-xs cursor-pointer gap-1.5 shadow-none"
              >
                <Lock className="size-3.5" />
                QP-AN access &amp; export log
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-[160px]">Mốc thời gian (UTC)</th>
                <th className="py-3.5 px-4">Cán bộ thực hiện</th>
                <th className="py-3.5 px-4">Đơn vị</th>
                <th className="py-3.5 px-4">Hành động</th>
                <th className="py-3.5 px-4">Phân hệ</th>
                <th className="py-3.5 px-4">Chi tiết nghiệp vụ</th>
                <th className="py-3.5 px-4">Mã sự kiện / Code</th>
                <th className="py-3.5 px-4 text-center">Kết quả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {filteredLogs.map((log) => {
                const isQPAction = ['qp_an_access', 'qp_an_export', 'qp_an_2fa_challenge'].includes(log.action);
                return (
                  <tr key={log.id} className={`hover:bg-muted/5 transition-colors ${isQPAction ? 'bg-rose-500/5 hover:bg-rose-500/10' : ''}`}>
                    <td className="py-3.5 px-4 text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1">
                      {isQPAction && <Lock className="size-3 text-rose-600 shrink-0" />}
                      {log.userFullName}
                      <Badge variant="secondary" className="text-[8px] px-1 font-bold py-0">{log.role}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{log.organization}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={`text-[8px] px-1.5 py-0 font-bold uppercase ${log.action === 'create' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                        log.action === 'delete' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                          log.action.startsWith('qp_an') ? 'bg-rose-600 text-white border-rose-600 font-bold animate-pulse' :
                            'bg-slate-500/10 text-slate-600 border-slate-500/20'
                        }`}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground uppercase text-[9px] font-bold">{log.module}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{log.description}</td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground text-[10px]">
                      {isQPAction ? (
                        <div className="flex flex-col gap-0.5">
                          <span>Target: {log.targetFeatureCode || '—'}</span>
                          <span>Reason: {log.reasonCode || '—'}</span>
                        </div>
                      ) : (
                        <span>Entity: {log.entity}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${log.result === 'success' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        log.result === 'denied' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold'
                        }`}>
                        {log.result === 'success' ? 'Thành công' : log.result === 'denied' ? 'Từ chối' : 'Lỗi 2FA'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Security Report Dialog ─── */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Lock className="size-4 text-rose-600" />
              Báo cáo giám sát an ninh dữ liệu QP-AN ({MOCK_SECURITY_REPORT.period})
            </DialogTitle>
            <DialogDescription className="text-xs">
              Mẫu báo cáo định kỳ của phân hệ quốc phòng, an ninh và mốc giới Lao Bảo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-muted/20 border border-border rounded-xl">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Tổng lượt truy cập</span>
                <p className="text-lg font-bold text-foreground mt-0.5">{MOCK_SECURITY_REPORT.totalQPAccess} lượt</p>
              </div>
              <div className="p-3 bg-muted/20 border border-border rounded-xl">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Lượt kết xuất (Export)</span>
                <p className="text-lg font-bold text-foreground mt-0.5">{MOCK_SECURITY_REPORT.totalQPExport} lần</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <span className="text-[10px] text-rose-700 dark:text-rose-400 uppercase font-bold">Bị từ chối (Denied)</span>
                <p className="text-lg font-bold text-rose-600 mt-0.5">{MOCK_SECURITY_REPORT.totalDenied} lượt</p>
              </div>
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold">Lỗi xác thực 2FA</span>
                <p className="text-lg font-bold text-amber-600 mt-0.5">{MOCK_SECURITY_REPORT.failed2FA} lần</p>
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-1">
              <h4 className="font-bold text-foreground">Số lượng truy cập phân theo vai trò tài khoản:</h4>
              <div className="space-y-1.5 pt-1">
                {Object.entries(MOCK_SECURITY_REPORT.byRole).map(([role, count]) => (
                  <div key={role} className="flex justify-between border-b border-border/40 pb-1 uppercase text-[10px]">
                    <span className="text-muted-foreground font-semibold">Vai trò: {role}</span>
                    <span className="font-bold text-foreground">{count} truy cập</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-primary/5 text-primary rounded-xl border border-primary/20 text-[10px] leading-relaxed flex items-start gap-1.5">
              <Info className="size-4 shrink-0 mt-0.5 text-primary" />
              <span>
                <strong>Nhãn:</strong> Mock — backend reporting required. Tính năng sinh báo cáo tự động từ cơ sở dữ liệu thật yêu cầu cấu hình máy chủ giám sát tập trung.
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border/40 gap-2">
            <Button
              onClick={() => {
                toast.success('Gửi báo cáo an ninh lên Sở Công an Tỉnh thành công! (Mock)');
                setIsReportOpen(false);
              }}
              size="sm"
              className="h-9 text-xs cursor-pointer shadow-none font-semibold"
            >
              Gửi báo cáo Tỉnh
            </Button>
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-9 text-xs cursor-pointer shadow-none border-border">Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
