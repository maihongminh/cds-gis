import {
  GroundwaterPermitRecord,
  CleanWaterUsageRecord,
  HygienicWaterUsageRecord,
  CentralizedWaterFacility,
  SmallWaterFacility,
  WaterTreatmentSystem,
} from '@/types/water-resource';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { MOCK_HOUSEHOLDS } from './mock-db';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(42);

// 1. Groundwater Permits (28 records)
export const MOCK_GROUNDWATER_PERMITS: GroundwaterPermitRecord[] = [];
const permitOwners = [
  'HTX Nông nghiệp Lao Bảo', 'Trại heo giống Hòa Bình', 'Cơ sở chế biến nông sản Thôn 1',
  'UBND xã Lao Bảo', 'Trường Tiểu học Lao Bảo', 'Trạm Y tế xã Lao Bảo',
  'Hộ kinh doanh Nguyễn Văn Lâm', 'Hộ kinh doanh Hồ Văn Tèo'
];

for (let i = 1; i <= 28; i++) {
  const hamlet = rng.element(MOCK_HAMLETS);
  const owner = i <= 8 ? permitOwners[i - 1] : `Hộ gia đình ông ${rng.boolean(0.5) ? 'Hồ Văn' : 'Nguyễn Văn'} ${i}`;
  const year = rng.range(2023, 2026);
  MOCK_GROUNDWATER_PERMITS.push({
    id: `gw-permit-${i}`,
    permitNumber: `GP-NĐĐ-${year}-${String(i).padStart(3, '0')}`,
    ownerName: owner,
    villageCode: hamlet.code,
    villageName: hamlet.name,
    depthMeters: rng.range(25, 80),
    capacityM3Day: rng.range(5, 50),
    purpose: rng.boolean(0.7) ? 'Sinh hoạt gia đình/tưới tiêu nhỏ' : 'Kinh doanh dịch vụ/sản xuất',
    issueDate: `${year}-04-10`,
    expiryDate: `${year + 5}-04-10`,
    status: rng.boolean(0.9) ? 'active' : 'expired',
  });
}

// 2. Clean Water Usage Records (8 records - one for each hamlet)
export const MOCK_CLEAN_WATER_USAGE: CleanWaterUsageRecord[] = MOCK_HAMLETS.map((h, i) => {
  const totalHh = 180 / 8; // approx 22-23 households
  const cleanHh = rng.range(8, 16); // 8 to 16 households use clean water
  return {
    id: `clean-water-${i + 1}`,
    villageCode: h.code,
    villageName: h.name,
    totalHouseholds: totalHh,
    cleanWaterHouseholds: cleanHh,
    percentage: Number((cleanHh / totalHh * 100).toFixed(1)),
    year: 2026,
  };
});

// 3. Hygienic Water Usage Records (8 records - one for each hamlet)
export const MOCK_HYGIENIC_WATER_USAGE: HygienicWaterUsageRecord[] = MOCK_HAMLETS.map((h, i) => {
  const totalHh = 180 / 8;
  const hygienicHh = rng.range(16, 21); // 16 to 21 households use hygienic water (higher than clean water)
  return {
    id: `hygienic-water-${i + 1}`,
    villageCode: h.code,
    villageName: h.name,
    totalHouseholds: totalHh,
    hygienicWaterHouseholds: hygienicHh,
    percentage: Number((hygienicHh / totalHh * 100).toFixed(1)),
    year: 2026,
  };
});

// 4. Centralized Water Facilities (8 records - e.g. 1 per hamlet)
export const MOCK_CENTRALIZED_WATER_FACILITIES: CentralizedWaterFacility[] = MOCK_HAMLETS.map((h, i) => {
  const types: ('gravity' | 'pump' | 'drilledWell')[] = ['gravity', 'pump', 'drilledWell'];
  const type = rng.element(types);
  const facilityName = `Công trình cấp nước tự chảy ${h.name}`;
  return {
    id: `cw-facility-${i + 1}`,
    facilityName,
    facilityType: type,
    villageCode: h.code,
    villageName: h.name,
    capacityM3Day: rng.range(50, 200),
    servedHouseholds: rng.range(40, 120),
    managementUnit: i % 2 === 0 ? 'Ban quản lý Thôn' : 'UBND xã Lao Bảo',
    status: rng.boolean(0.8) ? 'active' : rng.boolean(0.5) ? 'maintenance' : 'inactive',
    lastCheckedDate: `2026-05-${String(rng.range(1, 28)).padStart(2, '0')}`,
  };
});

// 5. Small Water Facilities (60 records)
export const MOCK_SMALL_WATER_FACILITIES: SmallWaterFacility[] = [];
const smallTypes: ('diggedWell' | 'drilledWell' | 'gravityTank' | 'rainwaterHarvest')[] = [
  'diggedWell',
  'drilledWell',
  'gravityTank',
  'rainwaterHarvest',
];

const selectedSmallHh = MOCK_HOUSEHOLDS.slice(80, 140); // 60 households
selectedSmallHh.forEach((hh, i) => {
  MOCK_SMALL_WATER_FACILITIES.push({
    id: `small-wf-${i + 1}`,
    householdId: hh.id,
    householdHeadName: hh.headName,
    villageCode: hh.hamletCode,
    villageName: hh.hamletName,
    facilityType: rng.element(smallTypes),
    isHygienic: rng.boolean(0.75),
    status: 'active',
  });
});

// 6. Water Treatment Systems (12 records)
export const MOCK_WATER_TREATMENT_SYSTEMS: WaterTreatmentSystem[] = [];
const technologies = [
  'Hệ thống lọc cát áp lực có khử trùng Clo',
  'Hệ thống lọc RO công nghiệp',
  'Hệ thống lọc tự chảy bể lọc chậm truyền thống',
  'Hệ thống lọc lắng cơ học kết hợp phèn chua'
];

for (let i = 1; i <= 12; i++) {
  const hamlet = MOCK_HAMLETS[(i - 1) % 8];
  MOCK_WATER_TREATMENT_SYSTEMS.push({
    id: `wt-system-${i}`,
    systemName: `Hệ thống lọc nước sinh hoạt ${hamlet.name} - Trạm ${i}`,
    technology: rng.element(technologies),
    capacityM3Day: rng.range(15, 60),
    location: `${hamlet.name}, gần nhà sinh hoạt cộng đồng`,
    status: rng.boolean(0.85) ? 'active' : 'maintenance',
    lastInspectionDate: `2026-06-${String(rng.range(1, 15)).padStart(2, '0')}`,
  });
}
