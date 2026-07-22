// src/components/common/RecordMetadataPanel.tsx

import * as React from 'react';
import { DataRecordBase } from '@/types';
import { MOCK_ORGANIZATIONS } from '@/data/mock-organizations';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { SecurityLevelBadge } from './SecurityLevelBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator, Badge } from '@/components/ui';
import { Calendar, User, Clock, Shield, History, Landmark } from 'lucide-react';

interface RecordMetadataPanelProps {
  record: DataRecordBase;
  className?: string;
}

export function RecordMetadataPanel({ record, className }: RecordMetadataPanelProps) {
  const foundOrg = MOCK_ORGANIZATIONS.find((o) => o.id === record.organizationUnitId);
  const orgName = foundOrg ? foundOrg.name : 'Không xác định';

  const formatPeriod = (period: string) => {
    if (period.includes('-M')) {
      const parts = period.split('-M');
      return `Tháng ${parts[1]}/${parts[0]}`;
    }
    if (period.includes('-Q')) {
      const parts = period.split('-Q');
      return `Quý ${parts[1]}/${parts[0]}`;
    }
    return `Năm ${period}`;
  };

  const formatDate = (iso: string | undefined) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="py-3 px-4 border-b border-border/60">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <History className="size-3.5 text-primary" />
          Thông tin quản trị & Audit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3.5 text-xs">
        {/* State Row */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
              <Shield className="size-3" />
              Độ bảo mật
            </span>
            <SecurityLevelBadge level={record.securityLevel} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
              <Clock className="size-3" />
              Trạng thái duyệt
            </span>
            <WorkflowStatusBadge status={record.workflowStatus} />
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Info list */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground flex items-center gap-1 shrink-0">
              <Landmark className="size-3 text-muted-foreground/60" />
              Đơn vị báo cáo:
            </span>
            <span className="font-semibold text-foreground text-right truncate" title={orgName}>
              {orgName}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground flex items-center gap-1 shrink-0">
              <Calendar className="size-3 text-muted-foreground/60" />
              Kỳ báo cáo:
            </span>
            <span className="font-semibold text-foreground">
              {formatPeriod(record.reportingPeriod)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground flex items-center gap-1 shrink-0">
              <History className="size-3 text-muted-foreground/60" />
              Phiên bản hiện tại:
            </span>
            <Badge variant="outline" className="font-bold border-primary/20 bg-primary/5 text-primary">
              v{record.version}
            </Badge>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Timestamps and users */}
        <div className="space-y-2 text-[11px] text-muted-foreground">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-[10px] uppercase text-muted-foreground/80">Khởi tạo</span>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {record.createdBy}
              </span>
              <span>{formatDate(record.createdAt)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-[10px] uppercase text-muted-foreground/80">Cập nhật cuối</span>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {record.updatedBy}
              </span>
              <span>{formatDate(record.updatedAt)}</span>
            </div>
          </div>

          {record.publishedAt && (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[10px] uppercase text-emerald-600 dark:text-emerald-400">Thời gian công bố</span>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-300">
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  Hệ thống
                </span>
                <span>{formatDate(record.publishedAt)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
