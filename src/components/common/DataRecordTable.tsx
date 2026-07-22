// src/components/common/DataRecordTable.tsx

import * as React from 'react';
import { DataRecordBase, UserRole } from '@/types';
import { DataTableShell, DataTableColumn } from './data-table-shell';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { SecurityLevelBadge } from './SecurityLevelBadge';
import { ActionMenu } from './action-menu';
import { Eye, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { canPerform } from '@/lib/rbac';

interface DataRecordTableProps<T extends DataRecordBase> {
  data: T[];
  moduleKey: string;
  userRole: UserRole;
  customColumns?: DataTableColumn<T>[];
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onSubmitForApproval?: (record: T) => void;
}

export function DataRecordTable<T extends DataRecordBase>({
  data,
  moduleKey,
  userRole,
  customColumns = [],
  onView,
  onEdit,
  onDelete,
  onSubmitForApproval
}: DataRecordTableProps<T>) {
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

  const columns: DataTableColumn<T>[] = [
    // Prepend custom columns (like specific record details)
    ...customColumns,
    {
      header: 'Kỳ báo cáo',
      accessorKey: 'reportingPeriod',
      render: (row) => <span className="font-medium text-foreground text-xs">{formatPeriod(row.reportingPeriod)}</span>,
    },
    {
      header: 'Bảo mật',
      accessorKey: 'securityLevel',
      render: (row) => <SecurityLevelBadge level={row.securityLevel} showIcon={false} />,
    },
    {
      header: 'Trạng thái duyệt',
      accessorKey: 'workflowStatus',
      render: (row) => <WorkflowStatusBadge status={row.workflowStatus} />,
    },
    {
      header: 'Phiên bản',
      accessorKey: 'version',
      render: (row) => (
        <Badge variant="outline" className="px-1.5 py-0 rounded text-[9px] font-bold bg-muted/60 border-border/80 text-muted-foreground">
          v{row.version}
        </Badge>
      ),
    },
    {
      header: 'Cập nhật cuối',
      render: (row) => (
        <span className="text-[10px] text-muted-foreground leading-snug">
          {new Date(row.updatedAt).toLocaleDateString('vi-VN')} bởi {row.updatedBy}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      align: 'right',
      render: (row) => {
        const canEdit = canPerform(userRole, moduleKey as any, 'update') && ['draft', 'returned'].includes(row.workflowStatus);
        const canDelete = canPerform(userRole, moduleKey as any, 'delete') && ['draft', 'returned'].includes(row.workflowStatus);
        const canSubmit = canPerform(userRole, moduleKey as any, 'submit') && ['draft', 'returned'].includes(row.workflowStatus);

        const customActions = [];
        
        if (canSubmit && onSubmitForApproval) {
          customActions.push({
            label: 'Gửi phê duyệt',
            icon: <Send className="size-3.5 text-primary" />,
            onClick: () => onSubmitForApproval(row),
          });
        }

        if (onView) {
          customActions.push({
            label: 'Xem chi tiết',
            icon: <Eye className="size-3.5 text-muted-foreground" />,
            onClick: () => onView(row),
          });
        }

        return (
          <ActionMenu
            entityName="bản ghi"
            onEdit={canEdit && onEdit ? () => onEdit(row) : undefined}
            onDelete={canDelete && onDelete ? () => onDelete(row) : undefined}
            customActions={customActions}
          />
        );
      },
    },
  ];

  return (
    <DataTableShell
      data={data}
      columns={columns}
      searchPlaceholder="Tìm kiếm bản ghi..."
      searchKeys={['reportingPeriod', 'updatedBy']}
      initialPageSize={10}
    />
  );
}
