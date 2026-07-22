'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTableShell, DataTableColumn } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { ActionMenu } from '@/components/common';
import { ForestDvmtrRecord, ForestDvmtrPaymentStatus } from '@/types/forest-dvmtr';
import { formatVND } from '../../components/dashboard-kpi-grid';
import { toast } from 'sonner';

interface ForestTableProps {
  data: ForestDvmtrRecord[];
  loading?: boolean;
}

const PAYMENT_STATUS_MAP: Record<ForestDvmtrPaymentStatus, { label: string; statusType: string }> = {
  paid: { label: 'Đã thanh toán', statusType: 'paid' },
  partially_paid: { label: 'Thanh toán một phần', statusType: 'partially_paid' },
  pending: { label: 'Chưa thanh toán', statusType: 'inactive' }, // will map to gray
};

export function ForestTable({ data, loading = false }: ForestTableProps) {
  const router = useRouter();

  const handleViewDetails = (contract: ForestDvmtrRecord) => {
    router.push(`/dashboard/forest-dvmtr/${contract.id}`);
  };

  const handleEdit = (contract: ForestDvmtrRecord) => {
    toast.info(`Cập nhật hợp đồng ${contract.contractCode} (Demo)`);
  };

  const handleDelete = (contract: ForestDvmtrRecord) => {
    toast.success(`Đã xóa hợp đồng nhận khoán ${contract.contractCode} (Demo)`);
  };

  const columns: DataTableColumn<ForestDvmtrRecord>[] = React.useMemo(() => [
    {
      header: 'Mã hợp đồng',
      accessorKey: 'contractCode',
      sortable: true,
      render: (row) => (
        <Link
          href={`/dashboard/forest-dvmtr/${row.id}`}
          className="font-mono text-[11px] font-bold text-primary hover:underline hover:text-primary/80"
        >
          {row.contractCode}
        </Link>
      ),
    },
    {
      header: 'Hộ nhận khoán',
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
      header: 'Khu vực rừng',
      accessorKey: 'forestBlock',
      sortable: true,
      render: (row) => <span className="font-medium text-foreground">{row.forestBlock}</span>,
    },
    {
      header: 'Diện tích giao',
      accessorKey: 'contractedAreaHa',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-semibold">{row.contractedAreaHa.toFixed(2)} ha</span>,
    },
    {
      header: 'Định mức chi trả',
      accessorKey: 'paymentRatePerHa',
      sortable: true,
      align: 'right',
      render: (row) => <span className="text-muted-foreground font-sans">{formatVND(row.paymentRatePerHa, true)} / ha</span>,
    },
    {
      header: 'Tổng tiền chi trả',
      accessorKey: 'totalAmount',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-bold text-foreground font-sans">
          {formatVND(row.totalAmount, true)}
        </span>
      ),
    },
    {
      header: 'Năm',
      accessorKey: 'paymentYear',
      sortable: true,
      align: 'center',
    },
    {
      header: 'Thanh toán DVMTR',
      accessorKey: 'paymentStatus',
      sortable: true,
      render: (row) => {
        const item = PAYMENT_STATUS_MAP[row.paymentStatus] || { label: row.paymentStatus, statusType: 'inactive' };
        return <StatusBadge status={item.statusType} customLabel={item.label} />;
      },
    },
    {
      header: 'Trạng thái hợp đồng',
      accessorKey: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Thao tác',
      align: 'center',
      render: (row) => (
        <ActionMenu
          entityName="hợp đồng rừng"
          onView={() => handleViewDetails(row)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
          deleteConfirmMessage={`Bạn có chắc muốn xóa hợp đồng nhận khoán ${row.contractCode} của hộ ${row.householdHeadName}?`}
        />
      ),
    },
  ], [router]);

  return (
    <DataTableShell
      data={data}
      columns={columns}
      loading={loading}
      searchKeys={['contractCode', 'householdHeadName', 'householdCode', 'forestBlock']}
      searchPlaceholder="Tìm mã hợp đồng, chủ hộ, tiểu khu..."
      initialPageSize={10}
    />
  );
}

