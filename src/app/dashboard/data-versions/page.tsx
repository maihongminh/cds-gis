// src/app/dashboard/data-versions/page.tsx

'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Badge,
} from '@/components/ui';
import { GitCommit, Undo2, Calendar, User, Eye, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common';

interface VersionChange {
  version: number;
  author: string;
  time: string;
  comment: string;
  changes: {
    field: string;
    oldVal: string;
    newVal: string;
  }[];
}

const MOCK_VERSION_CHANGES: VersionChange[] = [
  {
    version: 3,
    author: 'Trần Văn Cường (Khuyến nông xã)',
    time: '2026-06-15T08:30:00Z',
    comment: 'Cập nhật năng suất thu hoạch sắn thực tế của thôn Ka Tăng tăng thêm do thời vụ tốt.',
    changes: [
      { field: 'Năng suất sắn (tạ/ha)', oldVal: '18.5', newVal: '21.2' },
      { field: 'Tổng sản lượng (tấn)', oldVal: '45.2', newVal: '51.8' }
    ]
  },
  {
    version: 2,
    author: 'Hồ Văn Trung (Cán bộ thôn Ka Tăng)',
    time: '2026-06-12T14:15:00Z',
    comment: 'Rà soát sửa đổi sai số đo đạc diện tích thực địa khu vực Ka Tăng.',
    changes: [
      { field: 'Diện tích trồng sắn (ha)', oldVal: '25.4', newVal: '24.4' }
    ]
  },
  {
    version: 1,
    author: 'Hồ Văn Trung (Cán bộ thôn Ka Tăng)',
    time: '2026-06-10T09:00:00Z',
    comment: 'Khởi tạo số liệu dự kiến sản xuất sắn Vụ Xuân 2026.',
    changes: [
      { field: 'Diện tích trồng sắn (ha)', oldVal: '—', newVal: '25.4' },
      { field: 'Năng suất sắn (tạ/ha)', oldVal: '—', newVal: '18.5' }
    ]
  }
];

export default function DataVersionsPage() {
  const { currentRole } = useTenant();
  const [selectedVer, setSelectedVer] = React.useState<VersionChange>(MOCK_VERSION_CHANGES[0]);

  const hasGovernancePermission = React.useMemo(() => {
    return currentRole === 'admin' || currentRole === 'data_governance';
  }, [currentRole]);

  const handleRollback = (ver: VersionChange) => {
    if (!hasGovernancePermission) {
      toast.error('Quyền hạn bị từ chối! Chỉ cán bộ Quản trị dữ liệu hoặc Admin mới được phép khôi phục phiên bản lịch sử.');
      return;
    }

    toast.success(`Đã thực hiện rollback thành công về Phiên bản v${ver.version}!`, {
      description: 'Dữ liệu hiện tại đã được ghi đè và nâng lên phiên bản v4 trong nhật ký hoạt động.'
    });
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <GitCommit className="w-6 h-6 text-primary" />
            Nhật ký Phiên bản &amp; Rollback
          </>
        }
        description="Theo dõi vết lịch sử chỉnh sửa chỉ tiêu số liệu và thực hiện khôi phục dữ liệu gốc xã Lao Bảo."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List Card */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-foreground">Nhật ký thay đổi chỉ tiêu sắn</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/60">
              {MOCK_VERSION_CHANGES.map((ver) => {
                const isSelected = selectedVer.version === ver.version;
                return (
                  <div
                    key={ver.version}
                    onClick={() => setSelectedVer(ver)}
                    className={`p-4 flex flex-col gap-2 transition-colors cursor-pointer hover:bg-muted/5 ${isSelected ? 'bg-primary/15 border-primary' : ''
                      }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <Badge variant="outline" className="font-bold text-xs">v{ver.version}</Badge>
                      <span className="text-[9px] text-muted-foreground">
                        {new Date(ver.time).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-xs text-foreground font-semibold leading-snug truncate">
                      {ver.comment}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      Bởi: {ver.author}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader className="py-4 border-b border-border/60 flex flex-row items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  Chi tiết thay đổi phiên bản v{selectedVer.version}
                </CardTitle>
                <CardDescription className="text-xs">
                  Nhận sự chỉnh sửa: {selectedVer.author} | Thời gian: {new Date(selectedVer.time).toLocaleString('vi-VN')}
                </CardDescription>
              </div>

              {hasGovernancePermission && (
                <Button
                  onClick={() => handleRollback(selectedVer)}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs cursor-pointer gap-1.5 shadow-none"
                >
                  <Undo2 className="size-3.5" />
                  Rollback về v{selectedVer.version}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Comment Box */}
              <div className="p-3 border border-border bg-muted/20 rounded-xl text-xs space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold">Ghi chú chỉnh sửa</span>
                <p className="font-medium text-foreground leading-relaxed">
                  &quot;{selectedVer.comment}&quot;
                </p>
              </div>

              {/* Changes comparison table */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Đối chiếu sai lệch trị số
                </h3>
                <div className="border border-border/60 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Tên trường dữ liệu</th>
                        <th className="py-2.5 px-3">Trị số cũ (Old)</th>
                        <th className="py-2.5 px-3">Trị số mới (New)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-medium">
                      {selectedVer.changes.map((c, idx) => (
                        <tr key={idx} className="hover:bg-muted/5 transition-colors">
                          <td className="py-2.5 px-3 text-foreground font-semibold">{c.field}</td>
                          <td className="py-2.5 px-3 text-rose-500 line-through">{c.oldVal}</td>
                          <td className="py-2.5 px-3 text-emerald-500 font-bold">{c.newVal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
