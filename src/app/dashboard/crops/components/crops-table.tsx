'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTableShell, DataTableColumn } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { ActionMenu } from '@/components/common';
import { CropRecord } from '@/types/crop';
import { formatVND } from '../../components/dashboard-kpi-grid';
import { toast } from 'sonner';

interface CropsTableProps {
  data: CropRecord[];
  loading?: boolean;
}

export function CropsTable({ data, loading = false }: CropsTableProps) {
  const router = useRouter();

  const handleEdit = (crop: CropRecord) => {
    toast.info(`Cập nhật nhật ký cây trồng ${crop.id} (Demo)`);
  };

  const handleDelete = (crop: CropRecord) => {
    // mock delete
  };

  const formatSeason = (val: string) => {
    if (val === '2026-XH') return 'Xuân Hè 26';
    if (val === '2026-DH') return 'Đông Xuân 26';
    if (val === '2025-XH') return 'Xuân Hè 25';
    if (val === '2025-DH') return 'Đông Xuân 25';
    return val;
  };

  const columns: DataTableColumn<CropRecord>[] = React.useMemo(() => [
    {
      header: 'Mã nhật ký',
      accessorKey: 'id',
      sortable: true,
      render: (row) => (
        <Link
          href={`/dashboard/crops/${row.id}`}
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
      header: 'Loại cây trồng',
      accessorKey: 'cropTypeName',
      sortable: true,
      render: (row) => <span className="font-semibold text-foreground">{row.cropTypeName}</span>,
    },
    {
      header: 'Diện tích',
      accessorKey: 'areaHa',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-semibold">{row.areaHa} ha</span>,
    },
    {
      header: 'Năm trồng',
      accessorKey: 'plantingYear',
      sortable: true,
      align: 'center',
    },
    {
      header: 'Mùa vụ',
      accessorKey: 'seasonYear',
      sortable: true,
      render: (row) => formatSeason(row.seasonYear),
    },
    {
      header: 'Sản lượng',
      accessorKey: 'harvestOutputKg',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-medium text-foreground">
          {row.harvestOutputKg.toLocaleString()} kg
        </span>
      ),
    },
    {
      header: 'Đơn giá',
      accessorKey: 'salePrice',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="text-muted-foreground font-sans font-medium">
          {formatVND(row.salePrice, true)}
        </span>
      ),
    },
    {
      header: 'Doanh thu',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-bold text-foreground font-sans">
          {formatVND(row.harvestOutputKg * row.salePrice, true)}
        </span>
      ),
    },
    {
      header: 'Vùng trồng (GAC)',
      accessorKey: 'growingAreaCode',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-[10px] text-muted-foreground/80 font-bold">
          {row.growingAreaCode || '-'}
        </span>
      ),
    },
    {
      header: 'Dịch bệnh',
      accessorKey: 'diseaseStatus',
      sortable: true,
      render: (row) => <StatusBadge status={row.diseaseStatus} />,
    },
    {
      header: 'Thao tác',
      align: 'center',
      render: (row) => (
        <ActionMenu
          entityName="nhật ký cây trồng"
          onView={() => router.push(`/dashboard/crops/${row.id}`)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
          deleteConfirmMessage={`Bạn có chắc muốn xóa nhật ký cây trồng ${row.cropTypeName} của hộ ${row.householdHeadName}?`}
        />
      ),
    },
  ], [router]);

  return (
    <DataTableShell
      data={data}
      columns={columns}
      loading={loading}
      searchKeys={['id', 'householdHeadName', 'householdCode', 'cropTypeName', 'growingAreaCode']}
      searchPlaceholder="Tìm kiếm nhanh nhật ký cây trồng..."
      initialPageSize={10}
    />
  );
}
