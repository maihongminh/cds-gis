'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTableShell, DataTableColumn } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { ActionMenu } from '@/components/common';
import { HouseholdEconomyRecord } from '@/types/household-economy';
import { formatVND } from '../../components/dashboard-kpi-grid';
import { toast } from 'sonner';
import { EconomicClassification } from '@/types/household';

interface EconomyTableProps {
  data: HouseholdEconomyRecord[];
  loading?: boolean;
}

const CLASSIFICATION_MAP: Record<EconomicClassification, { label: string; statusType: string }> = {
  poor: { label: 'Hộ nghèo', statusType: 'none' }, // will map to rose
  nearPoor: { label: 'Hộ cận nghèo', statusType: 'pending' }, // will map to amber
  average: { label: 'Hộ trung bình', statusType: 'active' }, // will map to emerald
  betterOff: { label: 'Hộ khá/giàu', statusType: 'active' }, // will map to emerald
};

export function EconomyTable({ data, loading = false }: EconomyTableProps) {
  const router = useRouter();

  const handleViewDetails = (rec: HouseholdEconomyRecord) => {
    router.push(`/dashboard/household-economy/${rec.id}`);
  };

  const handleEdit = (rec: HouseholdEconomyRecord) => {
    toast.info(`Cập nhật chỉ tiêu kinh tế hộ ${rec.householdCode} (Demo)`);
  };

  const handleDelete = (rec: HouseholdEconomyRecord) => {
    toast.success(`Đã xóa hồ sơ kinh tế hộ ${rec.householdCode} (Demo)`);
  };

  const columns: DataTableColumn<HouseholdEconomyRecord>[] = React.useMemo(() => [
    {
      header: 'Hộ dân / Chủ hộ',
      accessorKey: 'householdHeadName',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            href={`/dashboard/household-economy/${row.id}`}
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
      header: 'Thu nhập trồng trọt',
      accessorKey: 'cropRevenue',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-medium">{formatVND(row.cropRevenue, true)}</span>,
    },
    {
      header: 'Thu nhập chăn nuôi',
      accessorKey: 'livestockRevenue',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-medium">{formatVND(row.livestockRevenue, true)}</span>,
    },
    {
      header: 'Thu nhập DVMTR',
      accessorKey: 'forestDvmtrRevenue',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-medium">{formatVND(row.forestDvmtrRevenue, true)}</span>,
    },
    {
      header: 'Thu nhập khác',
      accessorKey: 'otherRevenue',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-medium">{formatVND(row.otherRevenue, true)}</span>,
    },
    {
      header: 'Chi phí sản xuất',
      accessorKey: 'totalCost',
      sortable: true,
      align: 'right',
      render: (row) => <span className="text-rose-600 dark:text-rose-400 font-medium">{formatVND(row.totalCost, true)}</span>,
    },
    {
      header: 'Thu nhập ròng',
      accessorKey: 'netIncome',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          {formatVND(row.netIncome, true)}
        </span>
      ),
    },
    {
      header: 'Thu nhập / Người',
      accessorKey: 'incomePerCapita',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-bold text-foreground">
          {formatVND(row.incomePerCapita, true)}
        </span>
      ),
    },
    {
      header: 'Phân loại kinh tế',
      accessorKey: 'economicClassificationAfter',
      sortable: true,
      render: (row) => {
        const cls = CLASSIFICATION_MAP[row.economicClassificationAfter] || { label: row.economicClassificationAfter, statusType: 'inactive' };
        return <StatusBadge status={cls.statusType} customLabel={cls.label} />;
      },
    },
    {
      header: 'Thao tác',
      align: 'center',
      render: (row) => (
        <ActionMenu
          entityName="hồ sơ kinh tế hộ"
          onView={() => handleViewDetails(row)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
          deleteConfirmMessage={`Bạn có chắc muốn xóa bản ghi kinh tế hộ ${row.householdCode}?`}
        />
      ),
    },
  ], [router]);

  return (
    <DataTableShell
      data={data}
      columns={columns}
      loading={loading}
      searchKeys={['householdHeadName', 'householdCode']}
      searchPlaceholder="Tìm kiếm theo chủ hộ, mã hộ..."
      initialPageSize={10}
    />
  );
}

