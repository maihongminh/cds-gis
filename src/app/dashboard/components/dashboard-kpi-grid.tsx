'use client';

import * as React from 'react';
import { MetricCard, CommonTabs } from '@/components/common';
import { DashboardMetricSummary } from '@/types/dashboard';
import {
  Home,
  AlertTriangle,
  Sprout,
  Beef,
  Trees,
  Coins,
  CreditCard,
  TrendingUp,
  Recycle,
  Trash,
  FileSpreadsheet,
  Droplet,
  Droplets,
  Building2,
  CheckCircle,
  Store,
  Users,
  Waves,
  CloudRain,
  Activity,
  FileText,
  Route,
} from 'lucide-react';

interface DashboardKpiGridProps {
  metrics: DashboardMetricSummary;
  loading?: boolean;
}

export function formatVND(value: number, compact = true): string {
  if (compact) {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)} tỷ ₫`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)} tr ₫`;
    }
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardKpiGrid({ metrics, loading = false }: DashboardKpiGridProps) {
  const tabs = React.useMemo(() => [
    {
      value: 'agriculture',
      label: 'Nông nghiệp & Kinh tế hộ',
      content: (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pt-4">
          <MetricCard
            title="Tổng hộ dân"
            value={loading ? 0 : `${metrics.totalHouseholds} hộ`}
            description="Toàn bộ địa bàn quản lý"
            icon={<Home className="w-4 h-4 text-slate-500" />}
            loading={loading}
          />
          <MetricCard
            title="Tỷ lệ hộ nghèo"
            value={loading ? 0 : `${metrics.povertyRate}%`}
            description={loading ? '' : `Cận nghèo: ${metrics.nearPovertyRate}%`}
            trend={{
              value: loading ? 0 : Number((metrics.povertyRate * 0.05).toFixed(1)),
              isPositive: false,
              label: 'giảm so với năm ngoái',
            }}
            icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
            loading={loading}
          />
          <MetricCard
            title="Diện tích cây trồng"
            value={loading ? 0 : `${metrics.totalCropsAreaHa} ha`}
            description="Cà phê Arabica, Quế & Lúa rẫy"
            icon={<Sprout className="w-4 h-4 text-emerald-500" />}
            loading={loading}
          />
          <MetricCard
            title="Tổng đàn vật nuôi"
            value={loading ? 0 : `${metrics.totalLivestockCount.toLocaleString()} con`}
            description="Trâu, bò, heo đen Lao Bảo"
            icon={<Beef className="w-4 h-4 text-orange-500" />}
            loading={loading}
          />
          <MetricCard
            title="Rừng nhận bảo vệ"
            value={loading ? 0 : `${metrics.totalForestContractedAreaHa} ha`}
            description="Khoán giữ rừng đầu nguồn"
            icon={<Trees className="w-4 h-4 text-emerald-600" />}
            loading={loading}
          />
          <MetricCard
            title="Chi trả DVMTR"
            value={loading ? 0 : formatVND(metrics.totalDvmtrPaid)}
            description="Thanh toán dịch vụ môi trường rừng"
            icon={<Coins className="w-4 h-4 text-yellow-600" />}
            loading={loading}
          />
          <MetricCard
            title="Thu nhập bình quân"
            value={loading ? 0 : `${formatVND(metrics.averageIncomePerCapita, false)}`}
            description="Bình quân đầu người / năm"
            icon={<CreditCard className="w-4 h-4 text-blue-500" />}
            loading={loading}
          />
          <MetricCard
            title="Doanh thu nông nghiệp"
            value={loading ? 0 : formatVND(metrics.totalAnnualRevenue)}
            description="Doanh thu nông lâm nghiệp"
            icon={<TrendingUp className="w-4 h-4 text-primary" />}
            loading={loading}
          />
        </div>
      ),
    },
    {
      value: 'environment',
      label: 'Môi trường & Nước sạch',
      content: (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pt-4">
          <MetricCard
            title="Lượng rác phát sinh"
            value={loading ? 0 : `${metrics.totalWasteTonsMonth} tấn`}
            description="Tháng hiện tại (Tháng 6/2026)"
            icon={<Trash className="w-4 h-4 text-slate-500" />}
            loading={loading}
          />
          <MetricCard
            title="Thu gom rác thải"
            value={loading ? 0 : `${metrics.wasteCollectionRate}%`}
            description="Tỷ lệ rác được thu gom"
            icon={<Recycle className="w-4 h-4 text-emerald-500" />}
            loading={loading}
          />
          <MetricCard
            title="Hộ tự phân loại rác"
            value={loading ? 0 : `${metrics.wasteClassificationRate}%`}
            description="Phân loại rác tại nguồn"
            icon={<Activity className="w-4 h-4 text-blue-500" />}
            loading={loading}
          />
          <MetricCard
            title="Xử lý rác tập trung"
            value={loading ? 0 : `${metrics.centralizedWasteTreatmentCount} hộ`}
            description="Đăng ký thu gom tập trung"
            icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
            loading={loading}
          />
          <MetricCard
            title="Giấy phép môi trường"
            value={loading ? 0 : `${metrics.envPermitsActiveCount} giấy phép`}
            description="Còn hiệu lực hoạt động"
            icon={<FileSpreadsheet className="w-4 h-4 text-indigo-500" />}
            loading={loading}
          />
          <MetricCard
            title="Tỷ lệ sử dụng nước sạch"
            value={loading ? 0 : `${metrics.cleanWaterUsageRate}%`}
            description="Theo tiêu chuẩn vệ sinh bộ Y tế"
            icon={<Droplet className="w-4 h-4 text-blue-600" />}
            loading={loading}
          />
          <MetricCard
            title="Sử dụng nước hợp vệ sinh"
            value={loading ? 0 : `${metrics.hygienicWaterUsageRate}%`}
            description="Bao gồm nước tự chảy, giếng khoan"
            icon={<Droplets className="w-4 h-4 text-cyan-500" />}
            loading={loading}
          />
          <MetricCard
            title="Trạm cấp nước tập trung"
            value={loading ? 0 : `${metrics.centralizedWaterFacilityCount} trạm`}
            description="Quy mô thôn bản đang hoạt động"
            icon={<Building2 className="w-4 h-4 text-slate-600" />}
            loading={loading}
          />
        </div>
      ),
    },
    {
      value: 'social_infra',
      label: 'Xã hội, Nhà ở & Hạ tầng',
      content: (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pt-4">
          <MetricCard
            title="Hộ cần hỗ trợ nhà ở"
            value={loading ? 0 : `${metrics.needsHousingSupportCount} hộ`}
            description="Nhu cầu cấp thiết xóa nhà tạm"
            icon={<Home className="w-4 h-4 text-rose-500" />}
            loading={loading}
          />
          <MetricCard
            title="Xóa nhà tạm (2026)"
            value={loading ? 0 : `${metrics.housingSupportGivenCount} hộ`}
            description="Đã được hỗ trợ kinh phí"
            icon={<CheckCircle className="w-4 h-4 text-emerald-500" />}
            loading={loading}
          />
          <MetricCard
            title="Nhà ở kiên cố / bán kiên cố"
            value={loading ? 0 : `${metrics.solidHouseholdsPercent}%`}
            description="Đạt chuẩn tiêu chí nhà ở nông thôn"
            icon={<Home className="w-4 h-4 text-indigo-600" />}
            loading={loading}
          />
          <MetricCard
            title="Hộ sản xuất KD phi nông nghiệp"
            value={loading ? 0 : `${metrics.businessHouseholdsCount} hộ`}
            description="Đang hoạt động trên địa bàn"
            icon={<Store className="w-4 h-4 text-amber-600" />}
            loading={loading}
          />
          <MetricCard
            title="Tỷ lệ hộ kinh doanh có ĐKKD"
            value={loading ? 0 : `${metrics.businessRegistrationRate}%`}
            description="Đăng ký kinh doanh hợp lệ"
            icon={<FileText className="w-4 h-4 text-slate-500" />}
            loading={loading}
          />
          <MetricCard
            title="Lao động phi nông nghiệp"
            value={loading ? 0 : `${metrics.nonAgLaborCount.toLocaleString()} người`}
            description="Tại chỗ & đi làm ăn xa"
            icon={<Users className="w-4 h-4 text-blue-500" />}
            loading={loading}
          />
          <MetricCard
            title="Công trình thủy lợi"
            value={loading ? 0 : `${metrics.irrigationFacilityCount} đập/trạm`}
            description={`Cần bảo trì: ${metrics.irrigationNeedsRepairCount + metrics.irrigationDamagedCount}`}
            icon={<Waves className="w-4 h-4 text-blue-600" />}
            loading={loading}
          />
          <MetricCard
            title="Thiên tai (2026)"
            value={loading ? 0 : `${metrics.disasterEventsCountYear} sự kiện`}
            description={`Gây thiệt hại: ${(metrics.disasterDamageEstimate / 1e6).toFixed(0)} triệu`}
            icon={<CloudRain className="w-4 h-4 text-rose-600" />}
            loading={loading}
          />
          <MetricCard
            title="Đường cứng hóa"
            value={loading ? 0 : `${metrics.concreteOrAsphaltRate}%`}
            description={`Tổng chiều dài: ${metrics.totalRoadLengthKm} km`}
            icon={<Route className="w-4 h-4 text-emerald-500" />}
            loading={loading}
          />
          <MetricCard
            title="Điểm chia cắt mở"
            value={loading ? 0 : `${metrics.openDisruptions} vị trí`}
            description={`Tổng ngày chia cắt: ${metrics.totalDisruptionDaysThisYear} ngày`}
            icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
            loading={loading}
          />
        </div>
      ),
    },
  ], [metrics, loading]);

  return (
    <div className="w-full">
      <CommonTabs tabs={tabs} defaultValue="agriculture" />
    </div>
  );
}
