import * as React from 'react';
import { SectionCard } from '@/components/common';
import { LabelValueGrid } from '@/components/common';
import { Household } from '@/types/household';
import { formatVND } from '../../../components/dashboard-kpi-grid';
import { StatusBadge } from '@/components/common';

interface HouseholdOverviewTabProps {
  household: Household;
}

export function HouseholdOverviewTab({ household }: HouseholdOverviewTabProps) {
  // Format economic classification tag
  const getEconomicClassText = (val: string) => {
    switch (val) {
      case 'poor': return 'Hộ nghèo';
      case 'nearPoor': return 'Hộ cận nghèo';
      case 'average': return 'Hộ trung bình';
      case 'betterOff': return 'Hộ khá / giàu';
      default: return val;
    }
  };

  const personalInfo = [
    { label: 'Họ và tên chủ hộ', value: household.headName },
    { label: 'Số CCCD / Định danh', value: household.identityNumber },
    { label: 'Số điện thoại', value: household.phone || 'Chưa cập nhật' },
    { label: 'Thành phần dân tộc', value: household.ethnicity },
    { label: 'Địa bàn cư trú', value: `${household.hamletName}, Xã Lao Bảo` },
  ];

  const householdInfo = [
    { label: 'Mã số quản lý hộ', value: household.code },
    { label: 'Số thành viên trong hộ', value: `${household.memberCount} nhân khẩu` },
    { label: 'Lao động nông nghiệp', value: `${household.agriculturalLaborCount} lao động` },
    { label: 'Năm lập hộ', value: household.establishedYear },
    { label: 'Trạng thái hồ sơ', value: <StatusBadge status={household.status} /> },
  ];

  const economyInfo = [
    { label: 'Xếp loại kinh tế', value: getEconomicClassText(household.economicClassification) },
    { label: 'Tổng thu nhập bình quân', value: formatVND(household.totalAnnualIncome, false) },
    { label: 'Chi phí sản xuất ước tính', value: formatVND(household.totalAnnualCost, false) },
    { label: 'Thu nhập ròng hàng năm', value: formatVND(household.netAnnualIncome, false) },
    { label: 'Thu nhập bình quân đầu người', value: `${formatVND(household.incomePerCapita, false)} / năm` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Personal Profile */}
        <SectionCard title="Thông tin chủ hộ đại diện">
          <LabelValueGrid items={personalInfo} columns={1} />
        </SectionCard>

        {/* Right Card: Household Specs */}
        <SectionCard title="Cơ cấu nhân khẩu & Đăng ký">
          <LabelValueGrid items={householdInfo} columns={1} />
        </SectionCard>
      </div>

      {/* Full width Card: Financials Overview */}
      <SectionCard title="Tóm tắt phân loại kinh tế & Thu nhập">
        <LabelValueGrid items={economyInfo} columns={3} />
      </SectionCard>
    </div>
  );
}
