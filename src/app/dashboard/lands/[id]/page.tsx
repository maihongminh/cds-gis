'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_LANDS } from '@/data/mock-lands';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { PageHeader } from '@/components/common';
import { Breadcrumbs } from '@/components/common';
import { CommonTabs } from '@/components/common';
import { LabelValueGrid } from '@/components/common';
import { SectionCard } from '@/components/common';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ChevronLeft, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface LandDetailPageProps {
  params: Promise<{ id: string }>;
}

const CERT_STATUS_LABELS: Record<string, string> = {
  granted: 'Đã cấp sổ đỏ (GCN)',
  pending: 'Đang chờ cấp phép',
  none: 'Chưa có chứng nhận',
};

const CERT_STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  granted: 'default',
  pending: 'secondary',
  none: 'outline',
};

const OWNERSHIP_LABELS: Record<string, string> = {
  household: 'Hộ gia đình',
  communal: 'Cộng đồng thôn',
  rented: 'Thuê / Mượn',
  other: 'Khác',
};

export default function LandDetailPage({ params }: LandDetailPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  const land = React.useMemo(() => MOCK_LANDS.find((l) => l.id === id), [id]);
  const household = React.useMemo(() => {
    if (!land) return null;
    return MOCK_HOUSEHOLDS.find((h) => h.id === land.householdId);
  }, [land]);

  if (!land) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-xl bg-card">
          <ShieldAlert className="w-10 h-10 text-destructive mb-3" />
          <h3 className="text-base font-bold text-foreground">Không tìm thấy thửa đất</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Mã thửa đất không tồn tại hoặc đã bị xóa khỏi hệ thống.
          </p>
          <Button asChild size="sm" className="mt-5 cursor-pointer shadow-none">
            <Link href="/dashboard/lands">
              <ArrowLeft className="size-4.5" />
              Quay lại danh sách đất đai
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa hồ sơ thửa đất này?')) {
      toast.success('Đã xóa hồ sơ thửa đất thành công!');
      router.push('/dashboard/lands');
    }
  };

  const landInfoItems = [
    { label: 'Mã thửa đất', value: land.parcelCode },
    { label: 'Số tờ bản đồ', value: land.mapSheetNumber ?? '—' },
    { label: 'Loại đất', value: land.landTypeName },
    { label: 'Diện tích', value: `${land.areaHa} ha` },
    { label: 'Hình thức sở hữu', value: OWNERSHIP_LABELS[land.ownershipType] ?? land.ownershipType },
    { label: 'Mục đích sử dụng', value: land.purpose },
    {
      label: 'Tình trạng pháp lý',
      value: (
        <Badge variant={CERT_STATUS_VARIANTS[land.certificateStatus]}>
          {CERT_STATUS_LABELS[land.certificateStatus]}
        </Badge>
      ),
    },
    { label: 'Số GCN / Sổ đỏ', value: land.certificateNumber ?? 'Chưa cấp' },
    { label: 'Ngày tạo hồ sơ', value: new Date(land.createdAt).toLocaleDateString('vi-VN') },
    { label: 'Cập nhật lần cuối', value: new Date(land.updatedAt).toLocaleDateString('vi-VN') },
  ];

  const detailTabs = [
    {
      value: 'info',
      label: 'Thông tin thửa đất',
      content: (
        <SectionCard title="Chi tiết hồ sơ địa chính">
          <LabelValueGrid items={landInfoItems} columns={2} />
        </SectionCard>
      ),
    },
    {
      value: 'household',
      label: 'Chủ hộ sử dụng',
      content: (
        <SectionCard title="Thông tin hộ gia đình sử dụng đất">
          {household ? (
            <div className="space-y-4">
              <LabelValueGrid
                items={[
                  { label: 'Mã hộ', value: household.code },
                  { label: 'Chủ hộ', value: household.headName },
                  { label: 'Số điện thoại', value: household.phone || 'Chưa cập nhật' },
                  { label: 'Dân tộc', value: household.ethnicity },
                  { label: 'Thôn', value: household.hamletName },
                  { label: 'Phân loại kinh tế', value: household.economicClassification },
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
          <Link href="/dashboard/lands">
            <ChevronLeft className="size-4" />
            Quay lại danh sách đất đai
          </Link>
        </Button>
      </div>

      <PageHeader
        title={land.landTypeName}
        description={`Mã thửa: ${land.parcelCode} — Chủ hộ: ${land.householdHeadName}`}
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
              Xóa hồ sơ
            </Button>
          </div>
        }
      />

      <CommonTabs tabs={detailTabs} defaultValue="info" />
    </div>
  );
}
