'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTableShell, DataTableColumn } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { ActionMenu } from '@/components/common';
import { LivestockRecord } from '@/types/livestock';
import { toast } from 'sonner';

interface LivestockTableProps {
  data: LivestockRecord[];
  loading?: boolean;
}

export function LivestockTable({ data, loading = false }: LivestockTableProps) {
  const router = useRouter();

  const handleEdit = (live: LivestockRecord) => {
    toast.info(`Cập nhật thông tin vật nuôi ${live.id} (Demo)`);
  };

  const handleDelete = (live: LivestockRecord) => {
    // mock delete
  };

  const columns: DataTableColumn<LivestockRecord>[] = React.useMemo(() => [
    {
      header: 'Mã bản ghi',
      accessorKey: 'id',
      sortable: true,
      render: (row) => (
        <Link
          href={`/dashboard/livestock/${row.id}`}
          className="font-mono text-[11px] font-bold text-primary hover:underline hover:text-primary/80"
        >
          {row.id}
        </Link>
      ),
    },
    {
      header: 'Hộ dân / Chủ hộ',
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
      header: 'Loại vật nuôi',
      accessorKey: 'livestockTypeName',
      sortable: true,
      render: (row) => <span className="font-semibold text-foreground">{row.livestockTypeName}</span>,
    },
    {
      header: 'Số lượng',
      accessorKey: 'quantity',
      sortable: true,
      align: 'center',
      render: (row) => <span className="font-bold text-foreground">{row.quantity} con</span>,
    },
    {
      header: 'Đã tiêm chủng',
      accessorKey: 'vaccinatedQuantity',
      sortable: true,
      align: 'center',
      render: (row) => {
        const percent = row.quantity > 0 ? (row.vaccinatedQuantity / row.quantity) * 100 : 0;
        return (
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-medium text-foreground">
              {row.vaccinatedQuantity} / {row.quantity} con
            </span>
            <span className="text-[9px] text-muted-foreground/65 font-bold">
              ({percent.toFixed(0)}%)
            </span>
          </div>
        );
      },
    },
    {
      header: 'Tiêm chủng gần nhất',
      accessorKey: 'lastVaccinatedDate',
      sortable: true,
      render: (row) => row.lastVaccinatedDate || 'Chưa ghi nhận',
    },
    {
      header: 'Ổ dịch bệnh',
      accessorKey: 'diseaseStatus',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col items-center gap-0.5">
          <StatusBadge status={row.diseaseStatus} />
          {row.diseaseQuantity > 0 && (
            <span className="text-[9px] text-rose-500 font-bold">
              ({row.diseaseQuantity} con mắc)
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Thao tác',
      align: 'center',
      render: (row) => (
        <ActionMenu
          entityName="bản ghi chăn nuôi"
          onView={() => router.push(`/dashboard/livestock/${row.id}`)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
          deleteConfirmMessage={`Bạn có chắc muốn xóa bản ghi chăn nuôi ${row.livestockTypeName} của hộ ${row.householdHeadName}?`}
        />
      ),
    },
  ], [router]);

  return (
    <DataTableShell
      data={data}
      columns={columns}
      loading={loading}
      searchKeys={['id', 'householdHeadName', 'householdCode', 'livestockTypeName', 'diseaseType']}
      searchPlaceholder="Tìm kiếm nhanh nhật ký chăn nuôi..."
      initialPageSize={10}
    />
  );
}
