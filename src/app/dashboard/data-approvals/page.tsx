// src/app/dashboard/data-approvals/page.tsx

'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { canPerform } from '@/lib/rbac';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Badge,
  Input,
  Label,
} from '@/components/ui';
import { CheckSquare, Eye, Send, ArrowLeft, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_ORGANIZATIONS } from '@/data/mock-organizations';
import { WorkflowStatus, SecurityLevel } from '@/types';
import { WorkflowStatusBadge } from '@/components/common/WorkflowStatusBadge';
import { SecurityLevelBadge } from '@/components/common/SecurityLevelBadge';
import { PageHeader } from '@/components/common';

interface ApprovalTask {
  id: string;
  title: string;
  dataGroup: string;
  reportingPeriod: string;
  organizationUnitId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  securityLevel: SecurityLevel;
  workflowStatus: WorkflowStatus;
  version: number;
  previewData: Record<string, string>;
  timeline: {
    time: string;
    author: string;
    action: string;
    note?: string;
  }[];
}

const INITIAL_APPROVAL_TASKS: ApprovalTask[] = [
  {
    id: 'tsk-1',
    title: 'Báo cáo Tuần tra Lâm nghiệp Ka Tăng - Quý 1/2026',
    dataGroup: 'Nông nghiệp & Môi trường',
    reportingPeriod: '2026-Q1',
    organizationUnitId: 'unit-services',
    createdBy: 'Hồ Văn Trung (Cán bộ thôn Ka Tăng)',
    createdAt: '2026-06-12T08:00:00Z',
    updatedAt: '2026-06-13T14:30:00Z',
    securityLevel: 'shared',
    workflowStatus: 'submitted',
    version: 1,
    previewData: {
      'Diện tích rừng bảo vệ': '241.5 ha',
      'Số lượt tuần tra thực tế': '12 lượt',
      'Phát hiện xâm hại': 'Không phát hiện ổ lấn chiếm'
    },
    timeline: [
      { time: '12/06/2026 15:00', author: 'Hồ Văn Trung (Cán bộ thôn Ka Tăng)', action: 'Gửi phê duyệt báo cáo tuần tra rừng Ka Tăng Quý 1/2026.' }
    ]
  },
  {
    id: 'tsk-2',
    title: 'Thống kê Sản lượng Lúa rẫy Ka Tăng - Vụ Hè Thu 2026',
    dataGroup: 'Nông nghiệp & Môi trường',
    reportingPeriod: '2026-M06',
    organizationUnitId: 'unit-eco',
    createdBy: 'Trần Văn Cường (Khuyến nông viên Ka Tăng)',
    createdAt: '2026-06-14T09:15:00Z',
    updatedAt: '2026-06-14T09:15:00Z',
    securityLevel: 'public',
    workflowStatus: 'submitted',
    version: 1,
    previewData: {
      'Diện tích gieo trồng': '15.2 ha',
      'Năng suất trung bình': '42.5 tạ/ha',
      'Tổng sản lượng ước đạt': '64.6 tấn'
    },
    timeline: [
      { time: '14/06/2026 09:15', author: 'Trần Văn Cường (Khuyến nông viên Ka Tăng)', action: 'Tải lên từ tệp Excel và gửi trình lãnh đạo bộ phận duyệt chỉ tiêu sản lượng lúa.' }
    ]
  },
  {
    id: 'tsk-3',
    title: 'Hồ sơ Kê khai Hộ kinh doanh Homestay Ka Tăng',
    dataGroup: 'Du lịch & Dịch vụ',
    reportingPeriod: '2026',
    organizationUnitId: 'unit-culture',
    createdBy: 'Lê Thị Mai (Cán bộ Văn hóa xã)',
    createdAt: '2026-06-10T10:00:00Z',
    updatedAt: '2026-06-14T11:20:00Z',
    securityLevel: 'public',
    workflowStatus: 'unit_approved',
    version: 2,
    previewData: {
      'Số homestay đăng ký mới': '3 cơ sở',
      'Tổng số phòng lưu trú': '24 phòng',
      'Đạt chuẩn OCOP du lịch': '1 cơ sở (Ka Tăng Homestay)'
    },
    timeline: [
      { time: '10/06/2026 10:00', author: 'Lê Thị Mai (Cán bộ Văn hóa xã)', action: 'Tạo mới hồ sơ khảo sát lưu trú Ka Tăng.' },
      { time: '12/06/2026 16:30', author: 'Trần Thanh Hải (Trưởng phòng Văn hóa)', action: 'Đã ký duyệt cấp phòng chuyên môn và trình Văn phòng UBND xã thẩm định.' }
    ]
  }
];

export default function DataApprovalsPage() {
  const { currentRole } = useTenant();
  const [tasks, setTasks] = React.useState<ApprovalTask[]>(INITIAL_APPROVAL_TASKS);
  const [selectedTask, setSelectedTask] = React.useState<ApprovalTask | null>(null);
  const [comment, setComment] = React.useState('');

  const getOrgName = (unitId: string) => {
    const org = MOCK_ORGANIZATIONS.find((o) => o.id === unitId);
    return org ? org.name : 'Không xác định';
  };

  const handleApprove = () => {
    if (!selectedTask) return;

    let nextStatus: WorkflowStatus = 'published';
    let actionName = 'Công bố dữ liệu';

    if (currentRole === 'unit_leader') {
      nextStatus = 'unit_approved';
      actionName = 'Phê duyệt cấp phòng';
    } else if (currentRole === 'data_governance' || currentRole === 'admin') {
      nextStatus = 'published';
      actionName = 'Thẩm định & Công bố';
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
            ...t,
            workflowStatus: nextStatus,
            timeline: [
              ...t.timeline,
              {
                time: new Date().toLocaleString('vi-VN'),
                author: `${currentRole?.toUpperCase() || 'Lãnh đạo'}`,
                action: `${actionName} thành công.`,
                note: comment || 'Không ghi chú.'
              }
            ]
          }
          : t
      )
    );

    toast.success(`Đã thực hiện "${actionName}" thành công!`);
    setSelectedTask(null);
    setComment('');
  };

  const handleReturn = () => {
    if (!selectedTask) return;
    if (!comment.trim()) {
      toast.error('Vui lòng nhập lý do trả lại dữ liệu để cán bộ lập báo cáo sửa đổi.');
      return;
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
            ...t,
            workflowStatus: 'returned',
            timeline: [
              ...t.timeline,
              {
                time: new Date().toLocaleString('vi-VN'),
                author: `${currentRole?.toUpperCase() || 'Lãnh đạo'}`,
                action: 'Trả lại yêu cầu để cán bộ rà soát sửa đổi.',
                note: comment
              }
            ]
          }
          : t
      )
    );

    toast.warning('Đã trả lại hồ sơ dữ liệu yêu cầu cập nhật lại.');
    setSelectedTask(null);
    setComment('');
  };

  // Filter tasks waiting for approval depending on role
  const pendingTasks = React.useMemo(() => {
    return tasks.filter((t) => {
      if (t.workflowStatus === 'published' || t.workflowStatus === 'returned') return false;

      // If unit leader, they check 'submitted' records
      if (currentRole === 'unit_leader') {
        return t.workflowStatus === 'submitted';
      }

      // If governance, they check 'unit_approved' records
      if (currentRole === 'data_governance' || currentRole === 'admin') {
        return ['submitted', 'unit_approved'].includes(t.workflowStatus);
      }

      return true;
    });
  }, [tasks, currentRole]);

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <CheckSquare className="w-6 h-6 text-primary" />
            Quy trình Phê duyệt Số liệu
          </>
        }
        description="Thẩm định báo cáo chuyên ngành và công bố thông tin dùng chung xã Lao Bảo."
      />

      {selectedTask ? (
        <div className="space-y-6">
          <Button
            onClick={() => { setSelectedTask(null); setComment(''); }}
            variant="outline"
            size="sm"
            className="h-8 text-xs cursor-pointer gap-1.5 shadow-none"
          >
            <ArrowLeft className="size-4" />
            Quay lại Hộp thư duyệt
          </Button>

          {/* Workflow detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-border bg-card shadow-2xs">
                <CardHeader>
                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <CardTitle className="text-sm font-bold text-foreground">{selectedTask.title}</CardTitle>
                    <Badge variant="outline" className="font-semibold bg-primary/5 text-primary">v{selectedTask.version}</Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Kỳ báo cáo: {selectedTask.reportingPeriod} | Khởi tạo bởi {selectedTask.createdBy}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Indicators Preview */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Thông số dữ liệu báo cáo</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {Object.entries(selectedTask.previewData).map(([key, val]) => (
                        <div key={key} className="p-3.5 border border-border bg-card rounded-xl flex flex-col gap-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{key}</span>
                          <span className="text-xs font-bold text-foreground leading-none">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-border/60" />

                  {/* Approve / Return note actions form */}
                  <div className="space-y-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="approval-comment" className="text-xs font-bold text-foreground">
                        Ý kiến thẩm định / Ghi chú lý do trả lại
                      </Label>
                      <textarea
                        id="approval-comment"
                        placeholder="Nhập nhận xét hoặc chỉ dẫn rà soát dữ liệu..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1 justify-end">
                      <Button
                        onClick={handleReturn}
                        variant="destructive"
                        size="sm"
                        className="h-9 text-xs cursor-pointer gap-1 px-4 shadow-none"
                      >
                        <XCircle className="size-4" />
                        Trả lại hồ sơ
                      </Button>
                      <Button
                        onClick={handleApprove}
                        variant="default"
                        size="sm"
                        className="h-9 text-xs cursor-pointer gap-1 px-4 shadow-none"
                      >
                        <CheckCircle2 className="size-4" />
                        Duyệt & Chuyển bước tiếp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {/* Task workflow status panel */}
              <Card className="border-border bg-card shadow-2xs">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Phân cấp & Bảo mật</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Độ bảo mật:</span>
                    <SecurityLevelBadge level={selectedTask.securityLevel} />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <WorkflowStatusBadge status={selectedTask.workflowStatus} />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Cơ quan:</span>
                    <span className="font-semibold text-foreground">{getOrgName(selectedTask.organizationUnitId)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action logs */}
              <Card className="border-border bg-card shadow-2xs">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Nhật ký quy trình (Timeline)</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative pl-3 border-l border-border space-y-4">
                    {selectedTask.timeline.map((log, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-[18.5px] top-0.5 flex size-2 items-center justify-center rounded-full bg-primary" />
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground leading-tight">{log.action}</p>
                          <p className="text-[10px] text-muted-foreground">{log.time} bởi {log.author}</p>
                          {log.note && (
                            <p className="text-[10px] text-muted-foreground/80 italic mt-1 bg-muted/30 p-2 border border-border/40 rounded-lg">
                              &quot; {log.note} &quot;
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-foreground">Hộp thư phê duyệt chờ xử lý ({pendingTasks.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-foreground">Hộp thư phê duyệt sạch hoàn toàn!</p>
                  <p className="text-[10px] text-muted-foreground">Không có hồ sơ dữ liệu chuyên ngành nào đang đợi bạn thẩm định.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="outline" className="px-1.5 py-0 rounded text-[9px] font-bold text-primary border-primary/20 bg-primary/5 uppercase">
                            {task.dataGroup}
                          </Badge>
                          <WorkflowStatusBadge status={task.workflowStatus} />
                          <SecurityLevelBadge level={task.securityLevel} showIcon={false} />
                        </div>
                        <h3 className="text-xs font-bold text-foreground leading-snug truncate">
                          {task.title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground">
                          Kỳ: {task.reportingPeriod} | Gửi bởi: {task.createdBy}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer gap-1 shadow-none">
                          <Eye className="size-3.5" />
                          Thẩm định
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
