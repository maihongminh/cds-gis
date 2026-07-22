'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_FOREST_DVMTR } from '@/data/mock-forest-dvmtr';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { PageHeader } from '@/components/common';
import { Breadcrumbs } from '@/components/common';
import { CommonTabs } from '@/components/common';
import { LabelValueGrid } from '@/components/common';
import { SectionCard } from '@/components/common';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ChevronLeft, ShieldAlert, ArrowLeft, ArrowRight, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface ForestDvmtrDetailPageProps {
  params: Promise<{ id: string }>;
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: 'Đã thanh toán',
  partially_paid: 'Thanh toán một phần',
  pending: 'Chưa thanh toán',
};

const PAYMENT_STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  paid: 'default',
  partially_paid: 'secondary',
  pending: 'destructive',
};

const CONTRACT_STATUS_LABELS: Record<string, string> = {
  active: 'Hiệu lực',
  inactive: 'Hết hiệu lực',
};

const CONTRACT_STATUS_VARIANTS: Record<string, 'default' | 'outline'> = {
  active: 'default',
  inactive: 'outline',
};

function formatVND(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ đồng`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} triệu đồng`;
  return `${amount.toLocaleString('vi-VN')} đồng`;
}

export default function ForestDvmtrDetailPage({ params }: ForestDvmtrDetailPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  const contract = React.useMemo(() => MOCK_FOREST_DVMTR.find((c) => c.id === id), [id]);
  const household = React.useMemo(() => {
    if (!contract) return null;
    return MOCK_HOUSEHOLDS.find((h) => h.id === contract.householdId);
  }, [contract]);

  if (!contract) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-xl bg-card">
          <ShieldAlert className="w-10 h-10 text-destructive mb-3" />
          <h3 className="text-base font-bold text-foreground">Không tìm thấy hợp đồng DVMTR</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Hợp đồng bảo vệ rừng hoặc hồ sơ chi trả này không tồn tại trong hệ thống.
          </p>
          <Button asChild size="sm" className="mt-5 cursor-pointer shadow-none">
            <Link href="/dashboard/forest-dvmtr">
              <ArrowLeft className="size-4.5" />
              Quay lại danh sách DVMTR
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa hợp đồng nhận khoán bảo vệ rừng này?')) {
      toast.success('Đã xóa hợp đồng thành công!');
      router.push('/dashboard/forest-dvmtr');
    }
  };

  const contractInfoItems = [
    { label: 'Mã hợp đồng', value: contract.contractCode },
    { label: 'Tiểu khu / Block rừng', value: contract.forestBlock },
    { label: 'Diện tích giao khoán', value: `${contract.contractedAreaHa} ha` },
    { label: 'Đơn giá chi trả / ha', value: `${formatVND(contract.paymentRatePerHa)}/ha` },
    { label: 'Năm thực hiện', value: `Năm ${contract.paymentYear}` },
    {
      label: 'Trạng thái hợp đồng',
      value: (
        <Badge variant={CONTRACT_STATUS_VARIANTS[contract.status]}>
          {CONTRACT_STATUS_LABELS[contract.status] || contract.status}
        </Badge>
      ),
    },
    { label: 'Ngày ký kết', value: new Date(contract.createdAt).toLocaleDateString('vi-VN') },
    { label: 'Ngày cập nhật hồ sơ', value: new Date(contract.updatedAt).toLocaleDateString('vi-VN') },
  ];

  const paymentInfoItems = [
    {
      label: 'Tổng kinh phí quyết toán',
      value: (
        <strong className="text-foreground text-sm">
          {formatVND(contract.totalAmount)}
        </strong>
      ),
    },
    {
      label: 'Trạng thái giải ngân',
      value: (
        <Badge variant={PAYMENT_STATUS_VARIANTS[contract.paymentStatus]}>
          {PAYMENT_STATUS_LABELS[contract.paymentStatus] || contract.paymentStatus}
        </Badge>
      ),
    },
    {
      label: 'Ngày thực nhận',
      value: contract.paymentDate
        ? new Date(contract.paymentDate).toLocaleDateString('vi-VN')
        : 'Chưa thực hiện chi trả',
    },
    {
      label: 'Hình thức chi trả',
      value: contract.paymentStatus === 'paid' ? 'Chuyển khoản Ngân hàng Chính sách' : 'Chờ xét duyệt ngân sách',
    },
  ];

  const detailTabs = [
    {
      value: 'contract',
      label: 'Thông tin hợp đồng',
      content: (
        <SectionCard title="Chi tiết giao khoán bảo vệ rừng">
          <LabelValueGrid items={contractInfoItems} columns={2} />
        </SectionCard>
      ),
    },
    {
      value: 'payment',
      label: 'Chi trả DVMTR',
      content: (
        <SectionCard
          title="Thông tin thanh toán dịch vụ môi trường rừng"
          description="Kinh phí bảo vệ rừng được cấp từ nguồn Quỹ bảo vệ và phát triển rừng tỉnh Quảng Trị"
        >
          <LabelValueGrid items={paymentInfoItems} columns={2} />
        </SectionCard>
      ),
    },
    {
      value: 'household',
      label: 'Hộ liên kết',
      content: (
        <SectionCard title="Thông tin hộ gia đình nhận giao khoán">
          {household ? (
            <div className="space-y-4">
              <LabelValueGrid
                items={[
                  { label: 'Mã hộ', value: household.code },
                  { label: 'Chủ hộ', value: household.headName },
                  { label: 'Số điện thoại', value: household.phone || 'Chưa cập nhật' },
                  { label: 'Dân tộc', value: household.ethnicity },
                  { label: 'Thôn', value: household.hamletName },
                  { label: 'Xếp loại hộ', value: household.economicClassification },
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
              Hồ sơ hộ nhận khoán liên kết không tồn tại hoặc đã bị xóa.
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
          <Link href="/dashboard/forest-dvmtr">
            <ChevronLeft className="size-4" />
            Quay lại danh sách DVMTR
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Hợp đồng ${contract.contractCode}`}
        description={`Chủ hộ nhận khoán: ${contract.householdHeadName} — Block rừng: ${contract.forestBlock}`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Mở biểu mẫu chỉnh sửa (Demo)')}
              className="bg-card border-border cursor-pointer shadow-none text-xs h-9"
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-destructive border-border hover:bg-destructive/10 cursor-pointer shadow-none text-xs h-9"
            >
              Hủy hợp đồng
            </Button>
          </div>
        }
      />

      <CommonTabs tabs={detailTabs} defaultValue="contract" />
    </div>
  );
}
