'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTableShell, DataTableColumn } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { ActionMenu } from '@/components/common';
import { Household, EconomicClassification } from '@/types/household';
import { formatVND } from '../../components/dashboard-kpi-grid';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface HouseholdsTableProps {
  data: Household[];
  loading?: boolean;
}

const ECONOMIC_LABEL_MAP: Record<EconomicClassification, { label: string; className: string }> = {
  poor: { label: 'Hộ nghèo', className: 'text-rose-600 bg-rose-500/10 border-rose-500/20' },
  nearPoor: { label: 'Hộ cận nghèo', className: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
  average: { label: 'Hộ trung bình', className: 'text-sky-600 bg-sky-500/10 border-sky-500/20' },
  betterOff: { label: 'Hộ khá / giàu', className: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
};

export function HouseholdsTable({ data, loading = false }: HouseholdsTableProps) {
  const router = useRouter();

  const handleEdit = (hh: Household) => {
    toast.info(`Mở biểu mẫu chỉnh sửa cho hộ ${hh.headName} (Demo)`);
  };

  const handleDelete = (hh: Household) => {
    // Perform mock delete logic (e.g. state modifications in real apps)
  };

  const columns: DataTableColumn<Household>[] = React.useMemo(() => [
    {
      header: 'Mã hộ',
      accessorKey: 'code',
      sortable: true,
      render: (row) => (
        <Link
          href={`/dashboard/households/${row.id}`}
          className="font-mono text-[11px] font-bold text-primary hover:underline hover:text-primary/80"
        >
          {row.code}
        </Link>
      ),
    },
    {
      header: 'Chủ hộ',
      accessorKey: 'headName',
      sortable: true,
      render: (row) => (
        <Link
          href={`/dashboard/households/${row.id}`}
          className="font-bold text-foreground hover:text-primary transition-colors"
        >
          {row.headName}
        </Link>
      ),
    },
    {
      header: 'Thôn',
      accessorKey: 'hamletName',
      sortable: true,
    },
    {
      header: 'Dân tộc',
      accessorKey: 'ethnicity',
      sortable: true,
    },
    {
      header: 'Nhân khẩu',
      accessorKey: 'memberCount',
      sortable: true,
      align: 'center',
    },
    {
      header: 'Lao động NN',
      accessorKey: 'agriculturalLaborCount',
      sortable: true,
      align: 'center',
    },
    {
      header: 'Phân loại kinh tế',
      accessorKey: 'economicClassification',
      sortable: true,
      render: (row) => {
        const item = ECONOMIC_LABEL_MAP[row.economicClassification];
        return (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap",
              item.className
            )}
          >
            {item.label}
          </span>
        );
      },
    },
    {
      header: 'Thu nhập ròng',
      accessorKey: 'netAnnualIncome',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-bold text-foreground font-sans">
          {formatVND(row.netAnnualIncome, true)}
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Thao tác',
      align: 'center',
      render: (row) => (
        <ActionMenu
          entityName="hộ dân"
          onView={() => router.push(`/dashboard/households/${row.id}`)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
          deleteConfirmMessage={`Bạn có chắc muốn xóa hồ sơ hộ dân cư ${row.headName} (${row.code})?`}
        />
      ),
    },
  ], [router]);

  return (
    <DataTableShell
      data={data}
      columns={columns}
      loading={loading}
      searchKeys={['code', 'headName', 'identityNumber', 'phone']}
      searchPlaceholder="Tìm kiếm nhanh hộ dân..."
      initialPageSize={10}
    />
  );
}
