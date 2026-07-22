'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_LIVESTOCK } from '@/data/mock-livestock';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { PageHeader } from '@/components/common';
import { Breadcrumbs } from '@/components/common';
import { CommonTabs } from '@/components/common';
import { LabelValueGrid } from '@/components/common';
import { SectionCard } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { Button } from '@/components/ui';
import { ChevronLeft, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface LivestockDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LivestockDetailPage({ params }: LivestockDetailPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  // Find target livestock record
  const live = React.useMemo(() => {
    return MOCK_LIVESTOCK.find((l) => l.id === id);
  }, [id]);

  // Find linked household
  const household = React.useMemo(() => {
    if (!live) return null;
    return MOCK_HOUSEHOLDS.find((h) => h.id === live.householdId);
  }, [live]);

  if (!live) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-xl bg-card">
          <ShieldAlert className="w-10 h-10 text-destructive mb-3" />
          <h3 className="text-base font-bold text-foreground">Không tìm thấy dữ liệu chăn nuôi</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Mã bản ghi chăn nuôi không tồn tại hoặc đã bị xóa khỏi hệ thống.
          </p>
          <Button asChild size="sm" className="mt-5 cursor-pointer shadow-none">
            <Link href="/dashboard/livestock">
              <ArrowLeft className="size-4.5" />
              Quay lại danh sách chăn nuôi
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa bản ghi chăn nuôi này?`)) {
      toast.success('Đã xóa bản ghi chăn nuôi thành công!');
      router.push('/dashboard/livestock');
    }
  };

  // 1. Overview Tab Content
  const overviewItems = [
    { label: 'Mã số bản ghi', value: live.id },
    { label: 'Loại vật nuôi', value: live.livestockTypeName },
    { label: 'Tổng số lượng đàn', value: `${live.quantity} con` },
    { label: 'Hình thức nuôi thả', value: 'Chăn thả bán hoang dã' }, // Mock method details
    { label: 'Trạng thái dữ liệu', value: <StatusBadge status={live.status} /> },
  ];

  // 2. Health & Vaccines Tab Content
  const healthItems = [
    { label: 'Đã tiêm chủng vắc-xin', value: `${live.vaccinatedQuantity} / ${live.quantity} con` },
    { label: 'Ngày tiêm chủng gần nhất', value: live.lastVaccinatedDate || 'Chưa ghi nhận' },
    { label: 'Tình trạng dịch hại đàn', value: <StatusBadge status={live.diseaseStatus} /> },
    { label: 'Số lượng vật nuôi mắc bệnh', value: `${live.diseaseQuantity} con` },
    { label: 'Chẩn đoán dịch bệnh', value: live.diseaseType || 'Không ghi nhận bệnh dịch' },
  ];

  const detailTabs = [
    {
      value: 'info',
      label: 'Thông tin đàn vật nuôi',
      content: (
        <SectionCard title="Chi tiết quy mô chăn nuôi">
          <LabelValueGrid items={overviewItems} columns={2} />
        </SectionCard>
      ),
    },
    {
      value: 'health',
      label: 'Tiêm chủng & Dịch bệnh',
      content: (
        <SectionCard title="Giám sát y tế đàn vật nuôi">
          <LabelValueGrid items={healthItems} columns={2} />
        </SectionCard>
      ),
    },
    {
      value: 'household',
      label: 'Chủ hộ chăn nuôi',
      content: (
        <SectionCard title="Thông tin hộ gia đình sở hữu">
          {household ? (
            <div className="space-y-4">
              <LabelValueGrid
                items={[
                  { label: 'Họ tên chủ hộ', value: household.headName },
                  { label: 'Số điện thoại', value: household.phone || 'Chưa cập nhật' },
                  { label: 'Dân tộc', value: household.ethnicity },
                  { label: 'Địa chỉ cư trú', value: `${household.hamletName}, Xã Lao Bảo` },
                ]}
                columns={2}
              />
              <div className="pt-2 flex justify-end">
                <Button asChild size="sm" className="cursor-pointer shadow-none text-xs font-semibold">
                  <Link href={`/dashboard/households/${household.id}`}>
                    Xem chi tiết hồ sơ hộ dân
                    <ArrowRight className="size-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground text-xs">
              Hồ sơ hộ dân liên kết đã bị xóa khỏi hệ thống.
            </div>
          )}
        </SectionCard>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />

      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground cursor-pointer shadow-none pl-0">
          <Link href="/dashboard/livestock">
            <ChevronLeft className="size-4" />
            Quay lại danh sách chăn nuôi
          </Link>
        </Button>
      </div>

      <PageHeader
        title={live.livestockTypeName}
        description={`Mã bản ghi: ${live.id} — Hộ khai báo: ${live.householdHeadName}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Mở biểu mẫu chỉnh sửa (Demo)')} className="bg-card border-border cursor-pointer shadow-none text-xs h-9">
              Chỉnh sửa
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive border-border hover:bg-destructive/10 cursor-pointer shadow-none text-xs h-9">
              Xóa đàn nuôi
            </Button>
          </div>
        }
      />

      <CommonTabs tabs={detailTabs} defaultValue="info" />
    </div>
  );
}
