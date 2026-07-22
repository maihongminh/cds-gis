'use client';

import { Badge } from '@/components/ui';
import { AuditLogEntry, AuditLogModule } from '@/types/audit-log';
import { DataTableShell, DataTableColumn } from '@/components/common';

const MODULE_LABELS: Record<AuditLogModule, string> = {
  auth: 'Đăng nhập',
  household: 'Hộ dân',
  crop: 'Cây trồng',
  livestock: 'Chăn nuôi',
  land: 'Đất đai',
  economy: 'Kinh tế hộ',
  forest: 'Rừng & DVMTR',
  settings: 'Cài đặt',
};

const MODULE_VARIANT: Record<AuditLogModule, 'default' | 'secondary' | 'outline'> = {
  auth: 'default',
  household: 'secondary',
  crop: 'secondary',
  livestock: 'secondary',
  land: 'secondary',
  economy: 'secondary',
  forest: 'secondary',
  settings: 'outline',
};

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface AuditLogTableProps {
  logs: AuditLogEntry[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const columns: DataTableColumn<AuditLogEntry>[] = [
    {
      header: 'Thời gian',
      accessorKey: 'timestamp',
      sortable: true,
      render: (row) => <span className="text-muted-foreground text-xs whitespace-nowrap">{formatTimestamp(row.timestamp)}</span>,
    },
    {
      header: 'Người dùng',
      accessorKey: 'userFullName',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-foreground text-xs">{row.userFullName}</div>
          <div className="text-[10px] text-muted-foreground">@{row.username}</div>
        </div>
      ),
    },
    {
      header: 'Vai trò',
      accessorKey: 'role',
      render: (row) => <span className="text-xs">{row.role}</span>,
    },
    {
      header: 'Hành động',
      accessorKey: 'action',
      sortable: true,
      render: (row) => <span className="font-semibold text-xs text-foreground">{row.action}</span>,
    },
    {
      header: 'Module',
      accessorKey: 'module',
      render: (row) => (
        <Badge variant={MODULE_VARIANT[row.module]} className="text-[10px] px-1.5 py-0.5 whitespace-nowrap">
          {MODULE_LABELS[row.module]}
        </Badge>
      ),
    },
    {
      header: 'Đối tượng',
      accessorKey: 'targetObject',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-[10px] text-foreground bg-muted border border-border/40 px-1.5 py-0.5 rounded">
          {row.targetObject ?? '—'}
        </span>
      ),
    },
    {
      header: 'Mô tả',
      accessorKey: 'description',
      render: (row) => (
        <span className="text-muted-foreground text-xs block max-w-[280px] truncate" title={row.description}>
          {row.description}
        </span>
      ),
    },
    {
      header: 'IP',
      accessorKey: 'ipAddress',
      render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.ipAddress ?? '—'}</span>,
    },
  ];

  return (
    <DataTableShell
      data={logs}
      columns={columns}
      initialPageSize={10}
    />
  );
}
