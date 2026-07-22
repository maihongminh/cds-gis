'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_HOUSEHOLD_ECONOMY } from '@/data/mock-household-economy';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { PageHeader } from '@/components/common';
import { Breadcrumbs } from '@/components/common';
import { CommonTabs } from '@/components/common';
import { LabelValueGrid } from '@/components/common';
import { SectionCard } from '@/components/common';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ChevronLeft, ShieldAlert, ArrowLeft, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface HouseholdEconomyDetailPageProps {
  params: Promise<{ id: string }>;
}

const CLASSIFICATION_LABELS: Record<string, string> = {
  poor: 'Hộ nghèo',
  nearPoor: 'Hộ cận nghèo',
  average: 'Hộ trung bình',
  betterOff: 'Hộ khá / Giàu',
};

const CLASSIFICATION_VARIANTS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  poor: 'destructive',
  nearPoor: 'secondary',
  average: 'outline',
  betterOff: 'default',
};

function formatVND(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ đồng`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} triệu đồng`;
  return `${amount.toLocaleString('vi-VN')} đồng`;
}

export default function HouseholdEconomyDetailPage({ params }: HouseholdEconomyDetailPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  const record = React.useMemo(
    () => MOCK_HOUSEHOLD_ECONOMY.find((r) => r.id === id),
    [id]
  );

  const household = React.useMemo(() => {
    if (!record) return null;
    return MOCK_HOUSEHOLDS.find((h) => h.id === record.householdId);
  }, [record]);

  if (!record) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-xl bg-card">
          <ShieldAlert className="w-10 h-10 text-destructive mb-3" />
          <h3 className="text-base font-bold text-foreground">Không tìm thấy bản ghi kinh tế</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Mã bản ghi không tồn tại hoặc đã bị xóa khỏi hệ thống.
          </p>
          <Button asChild size="sm" className="mt-5 cursor-pointer shadow-none">
            <Link href="/dashboard/household-economy">
              <ArrowLeft className="size-4.5" />
              Quay lại danh sách kinh tế hộ
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const classificationChanged =
    record.economicClassificationBefore !== record.economicClassificationAfter;

  const incomeItems = [
    { label: 'Năm tài chính', value: `Năm ${record.year}` },
    { label: 'Tổng doanh thu', value: <strong className="text-foreground">{formatVND(record.totalRevenue)}</strong> },
    { label: 'Tổng chi phí sản xuất', value: formatVND(record.totalCost) },
    {
      label: 'Thu nhập ròng',
      value: (
        <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-sans">
          {formatVND(record.netIncome)}
        </strong>
      ),
    },
    { label: 'Thu nhập bình quân đầu người', value: formatVND(record.incomePerCapita) },
  ];

  const revenueBreakdownItems = [
    { label: 'Doanh thu cây trồng', value: formatVND(record.cropRevenue) },
    { label: 'Doanh thu chăn nuôi', value: formatVND(record.livestockRevenue) },
    { label: 'Thu từ DVMTR (rừng)', value: formatVND(record.forestDvmtrRevenue) },
    { label: 'Thu nhập khác', value: formatVND(record.otherRevenue) },
    { label: 'Chi phí cây trồng', value: formatVND(record.cropCost) },
    { label: 'Chi phí chăn nuôi', value: formatVND(record.livestockCost) },
    { label: 'Chi phí lâm nghiệp', value: formatVND(record.forestDvmtrCost) },
    { label: 'Chi phí khác', value: formatVND(record.otherCost) },
  ];

  const classificationItems = [
    {
      label: 'Xếp loại trước đánh giá',
      value: (
        <Badge variant={CLASSIFICATION_VARIANTS[record.economicClassificationBefore]}>
          {CLASSIFICATION_LABELS[record.economicClassificationBefore]}
        </Badge>
      ),
    },
    {
      label: 'Xếp loại sau đánh giá',
      value: (
        <Badge variant={CLASSIFICATION_VARIANTS[record.economicClassificationAfter]}>
          {CLASSIFICATION_LABELS[record.economicClassificationAfter]}
        </Badge>
      ),
    },
    {
      label: 'Biến động xếp loại',
      value: classificationChanged ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="size-4" />
          Thay đổi phân loại trong năm
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <TrendingDown className="size-4" />
          Giữ nguyên phân loại
        </span>
      ),
    },
    {
      label: 'Chính sách hỗ trợ',
      value: record.supportPoliciesReceived.length > 0
        ? record.supportPoliciesReceived.join(', ')
        : 'Không có hỗ trợ trong năm',
    },
  ];

  const detailTabs = [
    {
      value: 'income',
      label: 'Thu nhập & Chi phí',
      content: (
        <div className="space-y-4">
          <SectionCard title="Tổng hợp thu nhập năm">
            <LabelValueGrid items={incomeItems} columns={2} />
          </SectionCard>
          <SectionCard title="Cơ cấu thu nhập & chi phí chi tiết">
            <LabelValueGrid items={revenueBreakdownItems} columns={2} />
          </SectionCard>
        </div>
      ),
    },
    {
      value: 'classification',
      label: 'Phân loại kinh tế',
      content: (
        <SectionCard title="Kết quả xếp loại kinh tế hộ">
          <LabelValueGrid items={classificationItems} columns={2} />
        </SectionCard>
      ),
    },
    {
      value: 'household',
      label: 'Hộ liên kết',
      content: (
        <SectionCard title="Thông tin hộ gia đình">
          {household ? (
            <div className="space-y-4">
              <LabelValueGrid
                items={[
                  { label: 'Mã hộ', value: household.code },
                  { label: 'Chủ hộ', value: household.headName },
                  { label: 'Số điện thoại', value: household.phone || 'Chưa cập nhật' },
                  { label: 'Dân tộc', value: household.ethnicity },
                  { label: 'Thôn', value: household.hamletName },
                  { label: 'Số nhân khẩu', value: `${household.memberCount} người` },
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
          <Link href="/dashboard/household-economy">
            <ChevronLeft className="size-4" />
            Quay lại danh sách kinh tế hộ
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`${record.householdHeadName} — Năm ${record.year}`}
        description={`Mã hồ sơ: ${record.id} — Mã hộ: ${record.householdCode}`}
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
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa bản ghi kinh tế này?')) {
                  toast.success('Đã xóa bản ghi kinh tế hộ thành công!');
                  router.push('/dashboard/household-economy');
                }
              }}
              className="text-destructive border-border hover:bg-destructive/10 cursor-pointer shadow-none text-xs h-9"
            >
              Xóa bản ghi
            </Button>
          </div>
        }
      />

      <CommonTabs tabs={detailTabs} defaultValue="income" />
    </div>
  );
}
