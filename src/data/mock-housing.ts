import {
  HousingRecord,
  HousingSupportRecord,
  HousingSupportNeed,
  HousingType,
} from '@/types/housing';
import { MOCK_HOUSEHOLDS } from './mock-db';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(42);

// 1. Housing Records (180 records - one for each household in mock-db)
export const MOCK_HOUSING_RECORDS: HousingRecord[] = [];

MOCK_HOUSEHOLDS.forEach((hh, i) => {
  // Let poor/near-poor households have temporary or poor housing
  let housingType: HousingType = 'bán kiên cố';
  let cond: 'good' | 'average' | 'poor' | 'dangerous' = 'average';
  let degPercent = rng.range(5, 25);

  if (hh.economicClassification === 'poor') {
    housingType = rng.boolean(0.6) ? 'nhà tạm' : rng.boolean(0.5) ? 'dột nát' : 'bán kiên cố';
    cond = rng.boolean(0.5) ? 'poor' : 'dangerous';
    degPercent = rng.range(35, 75);
  } else if (hh.economicClassification === 'nearPoor') {
    housingType = rng.boolean(0.4) ? 'nhà tạm' : 'bán kiên cố';
    cond = rng.boolean(0.6) ? 'poor' : 'average';
    degPercent = rng.range(25, 45);
  } else if (hh.economicClassification === 'betterOff') {
    housingType = 'kiên cố';
    cond = 'good';
    degPercent = rng.range(0, 10);
  } else {
    // average
    housingType = rng.boolean(0.25) ? 'kiên cố' : 'bán kiên cố';
    cond = rng.boolean(0.7) ? 'average' : 'good';
    degPercent = rng.range(10, 30);
  }

  MOCK_HOUSING_RECORDS.push({
    id: `house-${i + 1}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    villageCode: hh.hamletCode,
    villageName: hh.hamletName,
    housingType,
    areaSqm: rng.range(35, 120),
    builtYear: rng.range(1995, 2024),
    conditionRating: cond,
    degradationPercentage: degPercent,
    createdAt: hh.createdAt,
    updatedAt: hh.updatedAt,
  });
});

// 2. Housing Support Records (40 records)
export const MOCK_HOUSING_SUPPORTS: HousingSupportRecord[] = [];
const programs = [
  'Nghị quyết 01/2022/NQ-HĐND về hỗ trợ nhà ở',
  'Chương trình MTQG 1719 (Phát triển KT-XH vùng đồng bào DTTS)',
  'Quỹ vì người nghèo cấp Tỉnh',
  'Quỹ thiện nguyện MobiFone hỗ trợ vùng cao'
];

const selectedSupportHh = MOCK_HOUSEHOLDS.slice(0, 40); // 40 households
selectedSupportHh.forEach((hh, i) => {
  const isBuildNew = rng.boolean(0.7);
  MOCK_HOUSING_SUPPORTS.push({
    id: `house-supp-${i + 1}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    villageCode: hh.hamletCode,
    villageName: hh.hamletName,
    programName: rng.element(programs),
    supportType: isBuildNew ? 'buildNew' : 'repair',
    amountVnd: isBuildNew ? rng.range(40, 80) * 1000000 : rng.range(15, 30) * 1000000,
    year: rng.range(2023, 2026),
    status: rng.element(['completed', 'ongoing']),
  });
});

// 3. Housing Support Needs (35 records)
export const MOCK_HOUSING_SUPPORT_NEEDS: HousingSupportNeed[] = [];
// Get poor/near-poor households that have poor or temporary houses
const poorHhWithPoorHousing = MOCK_HOUSING_RECORDS.filter(
  (hr) => hr.housingType === 'nhà tạm' || hr.housingType === 'dột nát' || hr.conditionRating === 'poor' || hr.conditionRating === 'dangerous'
).slice(0, 35);

poorHhWithPoorHousing.forEach((hr, i) => {
  const isBuildNew = hr.housingType === 'nhà tạm' || hr.housingType === 'dột nát';
  MOCK_HOUSING_SUPPORT_NEEDS.push({
    id: `house-need-${i + 1}`,
    householdId: hr.householdId,
    householdCode: hr.householdCode,
    householdHeadName: hr.householdHeadName,
    villageCode: hr.villageCode,
    villageName: hr.villageName,
    needType: isBuildNew ? 'buildNew' : 'repair',
    priorityLevel: hr.conditionRating === 'dangerous' ? 'high' : 'medium',
    estimatedCostVnd: isBuildNew ? 80000000 : 30000000,
    status: rng.element(['pending', 'approved']),
    requestDate: `2026-05-${String(rng.range(1, 28)).padStart(2, '0')}`,
  });
});
// Fill up to exactly 35 records
while (MOCK_HOUSING_SUPPORT_NEEDS.length < 35) {
  const i = MOCK_HOUSING_SUPPORT_NEEDS.length;
  const hh = MOCK_HOUSEHOLDS[i % MOCK_HOUSEHOLDS.length];
  MOCK_HOUSING_SUPPORT_NEEDS.push({
    id: `house-need-${i + 1}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    villageCode: hh.hamletCode,
    villageName: hh.hamletName,
    needType: 'repair',
    priorityLevel: 'low',
    estimatedCostVnd: 20000000,
    status: 'pending',
    requestDate: '2026-06-01',
  });
}
