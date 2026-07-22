'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTableShell, DataTableColumn } from '@/components/common';
import { LandStatusBadge } from './land-status-badge';
import { ActionMenu } from '@/components/common';
import { LandRecord, LandOwnershipType } from '@/types/land';
import { toast } from 'sonner';

interface LandsTableProps {
  data: LandRecord[];
  loading?: boolean;
}

const OWNERSHIP_LABELS: Record<LandOwnershipType, string> = {
  household: 'Hộ gia đình',
  communal: 'Đất tập thể',
  rented: 'Giao khoán bảo vệ',
  other: 'Khác',
};

export function LandsTable({ data, loading = false }: LandsTableProps) {
  const router = useRouter();

  const handleViewDetails = (land: LandRecord) => {
    router.push(`/dashboard/lands/${land.id}`);
  };

  const handleEdit = (land: LandRecord) => {
    toast.info(`Cập nhật thông tin thửa đất ${land.parcelCode} (Demo)`);
  };

  const handleDelete = (_land: LandRecord) => {
    toast.success('Đã xóa hồ sơ thửa đất (Demo)');
  };

  const columns: DataTableColumn<LandRecord>[] = React.useMemo(() => [
    {
      header: 'Mã thửa',
      accessorKey: 'parcelCode',
      sortable: true,
      render: (row) => (
        <Link
          href={`/dashboard/lands/${row.id}`}
          className="font-mono text-[11px] font-bold text-primary hover:underline hover:text-primary/80"
        >
          {row.parcelCode}
        </Link>
      ),
    },
    {
      header: 'Chủ hộ / Hộ dân',
      accessorKey: 'householdHeadName',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            href={`/dashboard/households/${row.householdId}`}
            className="font-bold text-foreground hover:text-primary transition-colors"
          >
            {row.householdHeadName}
          </Link>
          <span className="text-[10px] text-muted-foreground/60 font-mono font-semibold">
            {row.householdCode}
          </span>
        </div>
      ),
    },
    {
      header: 'Loại đất',
      accessorKey: 'landTypeName',
      sortable: true,
      render: (row) => <span className="font-semibold text-foreground">{row.landTypeName}</span>,
    },
    {
      header: 'Diện tích',
      accessorKey: 'areaHa',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-semibold">{row.areaHa} ha</span>,
    },
    {
      header: 'Tờ bản đồ',
      accessorKey: 'mapSheetNumber',
      sortable: true,
      align: 'center',
      render: (row) => <span>{row.mapSheetNumber ? `Tờ số ${row.mapSheetNumber}` : '-'}</span>,
    },
    {
      header: 'Hình thức sở hữu',
      accessorKey: 'ownershipType',
      sortable: true,
      render: (row) => <span>{OWNERSHIP_LABELS[row.ownershipType] || row.ownershipType}</span>,
    },
    {
      header: 'Tình trạng GCN',
      accessorKey: 'certificateStatus',
      sortable: true,
      render: (row) => <LandStatusBadge status={row.certificateStatus} />,
    },
    {
      header: 'Trạng thái sử dụng',
      accessorKey: 'status',
      sortable: true,
      render: (row) => (
        <span className={row.status === 'active' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}>
          {row.status === 'active' ? 'Đang canh tác' : 'Bỏ trống / Chưa sử dụng'}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      align: 'center',
      render: (row) => (
        <ActionMenu
          entityName="thửa đất"
          onView={() => handleViewDetails(row)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
          deleteConfirmMessage={`Bạn có chắc muốn xóa thửa đất ${row.parcelCode} của hộ ${row.householdHeadName}?`}
        />
      ),
    },
  ], []);

  return (
    <DataTableShell
      data={data}
      columns={columns}
      loading={loading}
      searchKeys={['parcelCode', 'householdHeadName', 'householdCode', 'landTypeName', 'certificateNumber']}
      searchPlaceholder="Tìm mã thửa, chủ hộ, số sổ đỏ..."
      initialPageSize={10}
    />
  );
}
