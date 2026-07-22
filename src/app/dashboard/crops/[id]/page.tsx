'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_CROPS } from '@/data/mock-crops';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { PageHeader } from '@/components/common';
import { Breadcrumbs } from '@/components/common';
import { CommonTabs } from '@/components/common';
import { LabelValueGrid } from '@/components/common';
import { SectionCard } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { Button } from '@/components/ui';
import { ChevronLeft, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { formatVND } from '../../components/dashboard-kpi-grid';
import { toast } from 'sonner';

interface CropDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CropDetailPage({ params }: CropDetailPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  // Find target crop log
  const crop = React.useMemo(() => {
    return MOCK_CROPS.find((c) => c.id === id);
  }, [id]);

  // Find linked household
  const household = React.useMemo(() => {
    if (!crop) return null;
    return MOCK_HOUSEHOLDS.find((h) => h.id === crop.householdId);
  }, [crop]);

  if (!crop) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-xl bg-card">
          <ShieldAlert className="w-10 h-10 text-destructive mb-3" />
          <h3 className="text-base font-bold text-foreground">Không tìm thấy dữ liệu cây trồng</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Mã nhật ký không tồn tại hoặc đã bị xóa khỏi hệ thống.
          </p>
          <Button asChild size="sm" className="mt-5 cursor-pointer shadow-none">
            <Link href="/dashboard/crops">
              <ArrowLeft className="size-4.5" />
              Quay lại danh sách cây trồng
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa nhật ký cây trồng này?`)) {
      toast.success('Đã xóa bản ghi thành công!');
      router.push('/dashboard/crops');
    }
  };

  const formatSeason = (val: string) => {
    if (val === '2026-XH') return 'Vụ Xuân Hè 2026';
    if (val === '2026-DH') return 'Vụ Đông Xuân 2026';
    if (val === '2025-XH') return 'Vụ Xuân Hè 2025';
    if (val === '2025-DH') return 'Vụ Đông Xuân 2025';
    return val;
  };

  // 1. Details Tab Content
  const overviewItems = [
    { label: 'Mã số nhật ký', value: crop.id },
    { label: 'Loại cây trồng', value: crop.cropTypeName },
    { label: 'Diện tích gieo trồng', value: `${crop.areaHa} ha` },
    { label: 'Năm bắt đầu trồng', value: crop.plantingYear },
    { label: 'Mùa vụ hiện tại', value: formatSeason(crop.seasonYear) },
    { label: 'Mã vùng trồng (GAC)', value: crop.growingAreaCode || 'Không có' },
    { label: 'Phương thức canh tác', value: crop.cultivationMethod },
    { label: 'Trạng thái dữ liệu', value: <StatusBadge status={crop.status} /> },
  ];

  // 2. Harvesting & Commerce Tab Content
  const harvestItems = [
    { label: 'Sản lượng thu hoạch', value: `${crop.harvestOutputKg.toLocaleString()} kg` },
    { label: 'Giá bán đơn vị', value: `${formatVND(crop.salePrice, false)}` },
    { label: 'Tổng doanh thu ước tính', value: <strong className="text-emerald-600 dark:text-emerald-400 font-sans">{formatVND(crop.harvestOutputKg * crop.salePrice, false)}</strong> },
    { label: 'Kênh tiêu thụ / Đối tác', value: crop.salesChannel },
  ];

  const detailTabs = [
    {
      value: 'info',
      label: 'Thông tin gieo trồng',
      content: (
        <SectionCard title="Chi tiết hồ sơ cây trồng">
          <LabelValueGrid items={overviewItems} columns={2} />
        </SectionCard>
      ),
    },
    {
      value: 'harvest',
      label: 'Thu hoạch & Tiêu thụ',
      content: (
        <SectionCard title="Chi tiết sản lượng & Thương mại">
          <LabelValueGrid items={harvestItems} columns={2} />
        </SectionCard>
      ),
    },
    {
      value: 'disease',
      label: 'Tình hình dịch hại',
      content: (
        <SectionCard title="Giám sát dịch bệnh cây trồng">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-muted-foreground">Trạng thái theo dõi:</span>
              <StatusBadge status={crop.diseaseStatus} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
              {crop.diseaseStatus === 'none'
                ? 'Khu vực gieo trồng khỏe mạnh, không ghi nhận sự xuất hiện của sâu bệnh hại hoặc các tác nhân gây suy giảm sản lượng.'
                : crop.diseaseStatus === 'monitoring'
                  ? 'Đang có báo cáo dịch hại nhẹ tại vùng trồng. Cán bộ bảo vệ thực vật đang giám sát kiểm dịch và hỗ trợ hộ dân xử lý sinh học.'
                  : 'Đã hoàn thành khoanh vùng dập dịch bệnh hại thành công. Diện tích trồng trọt đã phục hồi trạng thái an toàn.'}
            </p>
          </div>
        </SectionCard>
      ),
    },
    {
      value: 'household',
      label: 'Chủ hộ liên kết',
      content: (
        <SectionCard title="Thông tin hộ gia đình canh tác">
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
          <Link href="/dashboard/crops">
            <ChevronLeft className="size-4" />
            Quay lại danh sách cây trồng
          </Link>
        </Button>
      </div>

      <PageHeader
        title={crop.cropTypeName}
        description={`Mã nhật ký: ${crop.id} — Hộ khai báo: ${crop.householdHeadName}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Mở biểu mẫu chỉnh sửa (Demo)')} className="bg-card border-border cursor-pointer shadow-none text-xs h-9">
              Chỉnh sửa
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive border-border hover:bg-destructive/10 cursor-pointer shadow-none text-xs h-9">
              Xóa nhật ký
            </Button>
          </div>
        }
      />

      <CommonTabs tabs={detailTabs} defaultValue="info" />
    </div>
  );
}
