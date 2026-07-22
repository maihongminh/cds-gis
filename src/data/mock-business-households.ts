import {
  BusinessHouseholdRecord,
  BusinessRevenueRecord,
  NonAgriculturalLaborRecord,
} from '@/types/business-household';
import { MOCK_HOUSEHOLDS } from './mock-db';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(42);

// 1. Business Household Records (45 records)
export const MOCK_BUSINESS_HOUSEHOLDS: BusinessHouseholdRecord[] = [];
const industries = ['Tạp hóa', 'Sửa chữa xe máy', 'Cơ sở xay xát lúa', 'Thu mua lâm sản (Quế, Sâm)', 'Quán ăn/Cà phê', 'Dịch vụ vận tải nhỏ'];
const businessNames = ['Tạp hóa Cát Tường', 'Sửa xe Minh Đức', 'Xay xát gạo Thôn 1', 'Đại lý nông sản Lao Bảo', 'Quán cơm vùng cao', 'Vận tải Hồ Văn'];

const selectedBizHh = MOCK_HOUSEHOLDS.slice(40, 85); // 45 households
selectedBizHh.forEach((hh, i) => {
  const ind = rng.element(industries);
  const baseName = rng.element(businessNames);
  const hasReg = rng.boolean(0.7);
  const regNum = hasReg ? `ĐKKD-30-${String(i + 1).padStart(4, '0')}` : undefined;

  MOCK_BUSINESS_HOUSEHOLDS.push({
    id: `biz-${i + 1}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    villageCode: hh.hamletCode,
    villageName: hh.hamletName,
    businessName: `${baseName} - ${hh.headName.split(' ').pop()}`,
    industry: ind,
    scale: rng.element(['small', 'medium', 'large']),
    hasRegistration: hasReg,
    registrationNumber: regNum,
    isActive: true,
    createdAt: hh.createdAt,
    updatedAt: hh.updatedAt,
  });
});

// 2. Business Revenue Records (90 records - 2 per business household)
export const MOCK_BUSINESS_REVENUES: BusinessRevenueRecord[] = [];

MOCK_BUSINESS_HOUSEHOLDS.forEach((biz, i) => {
  const baseRev = rng.range(30, 200) * 1000000; // 30M to 200M VND
  // Quarter 1/2026
  MOCK_BUSINESS_REVENUES.push({
    id: `rev-${i * 2 + 1}`,
    businessId: biz.id,
    businessName: biz.businessName,
    householdHeadName: biz.householdHeadName,
    period: 'Quý 1/2026',
    estimatedRevenueVnd: baseRev,
    dataSource: rng.element(['survey', 'estimate', 'taxDeclaration']),
  });

  // Quarter 2/2026
  MOCK_BUSINESS_REVENUES.push({
    id: `rev-${i * 2 + 2}`,
    businessId: biz.id,
    businessName: biz.businessName,
    householdHeadName: biz.householdHeadName,
    period: 'Quý 2/2026',
    estimatedRevenueVnd: Math.round(baseRev * rng.range(90, 120) / 100),
    dataSource: rng.element(['survey', 'estimate', 'taxDeclaration']),
  });
});

// 3. Non-Agricultural Labor Records (80 records)
export const MOCK_NON_AGRI_LABORS: NonAgriculturalLaborRecord[] = [];
// Select 80 households (some having business households, some general)
const laborHh = MOCK_HOUSEHOLDS.slice(20, 100);
laborHh.forEach((hh, i) => {
  const totalLabor = hh.agriculturalLaborCount + rng.range(0, 2);
  const nonAgriLabor = rng.range(0, totalLabor);
  const awayLabor = rng.range(0, Math.max(1, totalLabor - nonAgriLabor));

  MOCK_NON_AGRI_LABORS.push({
    id: `non-agri-lab-${i + 1}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    villageCode: hh.hamletCode,
    villageName: hh.hamletName,
    totalLaborCount: totalLabor,
    nonAgriculturalLaborCount: nonAgriLabor,
    awayLaborCount: awayLabor,
    year: 2026,
  });
});
