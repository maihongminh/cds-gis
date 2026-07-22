'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { 
  Trash2, 
  Leaf, 
  Milestone, 
  Home, 
  FileText, 
  Award, 
  AlertOctagon, 
  HelpCircle 
} from 'lucide-react';
import { 
  MOCK_WASTE_RECORDS, 
  MOCK_WASTE_CLASSIFICATION, 
  MOCK_WASTE_TREATMENT_HOUSEHOLDS, 
  MOCK_ENV_REGISTRATIONS, 
  MOCK_ENV_PERMITS, 
  MOCK_ENV_VIOLATIONS, 
  MOCK_ENV_COMPLAINTS 
} from '@/data/mock-environment';

interface EnvironmentSummaryProps {
  selectedHamletCode: string;
}

export function EnvironmentSummary({ selectedHamletCode }: EnvironmentSummaryProps) {
  // Filter helper
  const filterByHamlet = <T extends { villageCode?: string }>(list: T[]): T[] => {
    if (selectedHamletCode === 'all') return list;
    return list.filter(item => item.villageCode === selectedHamletCode);
  };

  // 1. Waste metrics
  const wasteRecords = filterByHamlet(MOCK_WASTE_RECORDS).filter(r => r.month === 6 && r.year === 2026);
  const totalWaste = Number(wasteRecords.reduce((sum, r) => sum + r.totalWasteTons, 0).toFixed(2));
  
  // Previous month (May 2026) for trend calculation
  const prevWasteRecords = filterByHamlet(MOCK_WASTE_RECORDS).filter(r => r.month === 5 && r.year === 2026);
  const prevTotalWaste = Number(prevWasteRecords.reduce((sum, r) => sum + r.totalWasteTons, 0).toFixed(2));
  const wasteTrend = prevTotalWaste > 0 ? Number(((totalWaste - prevTotalWaste) / prevTotalWaste * 100).toFixed(1)) : 0;

  // 2. Classification
  const classRecords = filterByHamlet(MOCK_WASTE_CLASSIFICATION).filter(r => r.month === 6 && r.year === 2026);
  const totalClassHh = classRecords.reduce((sum, r) => sum + r.householdCount, 0);
  const classifiedHh = classRecords.reduce((sum, r) => sum + r.classifiedCount, 0);
  const classificationRate = totalClassHh > 0 ? Number(((classifiedHh / totalClassHh) * 100).toFixed(1)) : 0;

  // 3. Treatment
  const treatmentRecords = MOCK_WASTE_TREATMENT_HOUSEHOLDS.filter(
    r => selectedHamletCode === 'all' || r.villageCode === selectedHamletCode
  );
  const totalTreatment = treatmentRecords.length;
  const centralized = treatmentRecords.filter(r => r.treatmentMethod === 'centralized').length;
  const centralizedRate = totalTreatment > 0 ? Number(((centralized / totalTreatment) * 100).toFixed(1)) : 0;

  const selfTreatmentCount = treatmentRecords.filter(
    r => r.treatmentMethod === 'selfTreatmentOrganic' || r.treatmentMethod === 'bury' || r.treatmentMethod === 'burn'
  ).length;

  // 4. Registrations
  const activeRegistrations = MOCK_ENV_REGISTRATIONS.filter(
    r => (selectedHamletCode === 'all' || r.villageCode === selectedHamletCode) && r.status === 'pending'
  ).length;

  // 5. Permits
  const activePermits = MOCK_ENV_PERMITS.filter(
    r => (selectedHamletCode === 'all' || r.villageCode === selectedHamletCode) && r.status === 'active'
  ).length;

  // 6. Violations
  const pendingViolations = MOCK_ENV_VIOLATIONS.filter(
    r => (selectedHamletCode === 'all' || r.villageCode === selectedHamletCode) && (r.status === 'pending' || r.status === 'processing')
  ).length;

  // 7. Complaints
  const pendingComplaints = MOCK_ENV_COMPLAINTS.filter(
    r => (selectedHamletCode === 'all' || r.villageCode === selectedHamletCode) && (r.status === 'received' || r.status === 'processing')
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Waste amount */}
      <MetricCard
        title="Rác thải phát sinh"
        value={`${totalWaste} tấn`}
        trend={{
          value: Math.abs(wasteTrend),
          isPositive: wasteTrend < 0, // negative growth is positive for environment
          label: 'so với tháng trước'
        }}
        icon={<Trash2 className="size-4" />}
      />

      {/* Classification rate */}
      <MetricCard
        title="Tỷ lệ phân loại tại nguồn"
        value={`${classificationRate}%`}
        description={`Đã phân loại: ${classifiedHh}/${totalClassHh} hộ`}
        icon={<Leaf className="size-4" />}
      />

      {/* Centralized treatment */}
      <MetricCard
        title="Xử lý rác tập trung"
        value={`${centralizedRate}%`}
        description={`Quy mô tập trung: ${centralized} hộ dân`}
        icon={<Milestone className="size-4" />}
      />

      {/* Household self-treatment */}
      <MetricCard
        title="Tự xử lý tại gia đình"
        value={`${selfTreatmentCount} hộ`}
        description="Ủ phân compost, đốt, chôn lấp"
        icon={<Home className="size-4" />}
      />

      {/* Pending registrations */}
      <MetricCard
        title="Hồ sơ đăng ký đang xử lý"
        value={activeRegistrations}
        description="Cam kết bảo vệ môi trường"
        icon={<FileText className="size-4" />}
      />

      {/* Active permits */}
      <MetricCard
        title="Giấy phép còn hiệu lực"
        value={activePermits}
        description="Giấy phép môi trường cấp xã"
        icon={<Award className="size-4" />}
      />

      {/* Pending violations */}
      <MetricCard
        title="Vi phạm chưa xử lý"
        value={pendingViolations}
        description="Đang thụ lý và xử phạt"
        icon={<AlertOctagon className="size-4" />}
      />

      {/* Pending complaints */}
      <MetricCard
        title="Khiếu nại đang xử lý"
        value={pendingComplaints}
        description="Đơn thư kiến nghị môi trường"
        icon={<HelpCircle className="size-4" />}
      />
    </div>
  );
}
