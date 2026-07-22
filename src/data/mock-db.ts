import { SeededRandomHelper } from './seeded-random';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { MOCK_CROP_TYPES, MOCK_LIVESTOCK_TYPES, MOCK_LAND_TYPES, MOCK_SEASONS } from './mock-catalogs';
import { MOCK_SETTINGS } from './mock-settings';
import { Household, EconomicClassification, HouseholdStatus } from '@/types/household';
import { LandRecord, LandOwnershipType, LandCertificateStatus } from '@/types/land';
import { CropRecord } from '@/types/crop';
import { LivestockRecord, LivestockDiseaseStatus } from '@/types/livestock';
import { ForestDvmtrRecord, ForestDvmtrPaymentStatus } from '@/types/forest-dvmtr';
import { HouseholdEconomyRecord } from '@/types/household-economy';
import { AuditLogEntry } from '@/types/audit-log';
import { ReportTemplate, GeneratedReport } from '@/types/report';
import { MOCK_USERS } from './mock-users';

// Initialize seeded random helper with seed = 42
const rng = new SeededRandomHelper(42);

// --- 1. USER MOCKS ---
export { MOCK_USERS };

// Names generation structures
const VIETNAMESE_SURNAMES = ['Hồ', 'Nguyễn', 'Trần', 'Lê', 'Đinh', 'Quỳnh', 'Phạm', 'Võ', 'Bùi'];
const INDIGENOUS_SURNAMES = ['A Rất', 'Zơ Râm', 'Bhling', 'Cơ Lâu', 'Pơ Loong', 'Alăng'];
const MID_NAMES = ['Văn', 'Thị', 'Hoàng', 'Minh', 'Đức', 'Quang', 'Hữu', 'Anh', 'Ngọc', 'Xuân'];
const GIVEN_NAMES = ['Đang', 'Hin', 'Thắng', 'Linh', 'Sơn', 'Duy', 'Khang', 'Tuấn', 'Hải', 'Cường', 'Nam', 'Thịnh', 'Lộc', 'Phát', 'Trang', 'Hương', 'Lan', 'Mai', 'Vy', 'Phượng', 'Hòa', 'Bách', 'Việt', 'Trị', 'Tân', 'Quý', 'Tiến', 'Hùng', 'Bình', 'Huy'];

function generateHeadName(): string {
  const isIndigenous = rng.boolean(0.3);
  const surname = isIndigenous ? rng.element(INDIGENOUS_SURNAMES) : rng.element(VIETNAMESE_SURNAMES);
  const mid = rng.element(MID_NAMES);
  const given = rng.element(GIVEN_NAMES);
  return `${surname} ${mid} ${given}`;
}

// Generate households database
const rawHouseholds: Household[] = [];
for (let i = 1; i <= 180; i++) {
  const id = `hh-${i}`;
  const code = `HH-30-${String(i).padStart(3, '0')}`;
  const hamletIndex = (i - 1) % 8;
  const hamlet = MOCK_HAMLETS[hamletIndex];

  const headName = generateHeadName();
  
  let ethnicity = 'Vân Kiều';
  let localGroup: string | undefined = undefined;
  const randVal = rng.range(1, 100);
  if (randVal <= 15) {
    ethnicity = 'Kinh';
  } else if (randVal <= 80) {
    ethnicity = 'Vân Kiều';
    localGroup = 'Pa Cô';
  } else if (randVal <= 95) {
    ethnicity = 'Vân Kiều';
  } else {
    ethnicity = 'Vân Kiều';
    localGroup = 'Pa Cô';
  }

  const memberCount = rng.range(3, 9);
  const laborCount = rng.range(1, memberCount);
  const establishedYear = rng.range(1990, 2025);

  // Random status
  let status: HouseholdStatus = 'active';
  if (i > 170) {
    status = rng.boolean(0.5) ? 'changed' : 'archived';
  }

  // Identifiers
  const identityNumber = `205${rng.range(100000000, 999999999)}`;
  const phone = `09${rng.range(10000000, 99999999)}`;

  rawHouseholds.push({
    id,
    code,
    headName,
    identityNumber,
    phone,
    hamletCode: hamlet.code,
    hamletName: hamlet.name,
    ethnicity,
    localGroup,
    memberCount,
    agriculturalLaborCount: laborCount,
    establishedYear,
    economicClassification: 'average', // calculated later
    mainCropTypes: [],
    livestockTypes: [],
    totalLandAreaHa: 0,
    totalAnnualIncome: 0,
    totalAnnualCost: 0,
    netAnnualIncome: 0,
    incomePerCapita: 0,
    status,
    createdAt: `2025-01-${String(rng.range(10, 28)).padStart(2, '0')}T08:00:00Z`,
    updatedAt: `2026-06-${String(rng.range(1, 15)).padStart(2, '0')}T10:00:00Z`,
  });
}

// --- 2. LAND PLOTS GENERATION (240 records) ---
export const MOCK_LANDS: LandRecord[] = [];
const landsPerHousehold: Record<string, LandRecord[]> = {};

let landIdCounter = 1;
// First, make sure every household has at least one plot of land
rawHouseholds.forEach((hh) => {
  const plotsCount = rng.range(1, 3); // 1 to 2 plots
  const hhPlots: LandRecord[] = [];

  for (let p = 0; p < plotsCount; p++) {
    const id = `land-${landIdCounter++}`;
    // Type distributions
    let typeCode = 'dat-cay-lau-nam';
    if (p === 0) {
      typeCode = rng.boolean(0.5) ? 'dat-cay-lau-nam' : rng.boolean(0.8) ? 'dat-lua-ray' : 'dat-o-nong-thon';
    } else {
      typeCode = rng.boolean(0.6) ? 'dat-rung-san-xuat' : 'dat-rung-phong-ho';
    }

    const catalogType = MOCK_LAND_TYPES.find(t => t.code === typeCode) || MOCK_LAND_TYPES[0];

    let areaHa = 0.5;
    if (typeCode === 'dat-o-nong-thon') {
      areaHa = rng.range(3, 10) / 100; // 0.03 to 0.10 Ha
    } else if (typeCode === 'dat-lua-ray') {
      areaHa = rng.range(10, 150) / 100; // 0.1 to 1.5 Ha
    } else if (typeCode === 'dat-cay-lau-nam') {
      areaHa = rng.range(20, 250) / 100; // 0.2 to 2.5 Ha
    } else {
      areaHa = rng.range(100, 500) / 100; // 1.0 to 5.0 Ha
    }

    const certStatus: LandCertificateStatus = rng.boolean(0.7) ? 'granted' : rng.boolean(0.6) ? 'pending' : 'none';
    const certNumber = certStatus === 'granted' ? `CH${rng.range(100000, 999999)}` : undefined;
    const ownership: LandOwnershipType = typeCode === 'dat-rung-phong-ho' ? 'rented' : 'household';

    const parcelCode = `TB-${hh.hamletCode.toUpperCase().replace('-', '')}-${rng.range(100, 999)}`;
    const mapSheetNumber = rng.range(1, 15);

    const purpose = typeCode === 'dat-cay-lau-nam'
      ? 'Trồng Chuối Lao Bảo & Cà phê Arabica'
      : typeCode === 'dat-lua-ray'
        ? 'Trồng lúa rẫy và ngô'
        : typeCode === 'dat-rung-san-xuat'
          ? 'Trồng keo và xoan'
          : typeCode === 'dat-rung-phong-ho'
            ? 'Khoán bảo vệ rừng đầu nguồn'
            : 'Nhà ở và vườn cây ăn trái';

    const plot: LandRecord = {
      id,
      householdId: hh.id,
      householdCode: hh.code,
      householdHeadName: hh.headName,
      landTypeCode: typeCode,
      landTypeName: catalogType.name,
      parcelCode,
      mapSheetNumber: String(mapSheetNumber),
      areaHa,
      ownershipType: ownership,
      certificateStatus: certStatus,
      certificateNumber: certNumber,
      purpose,
      status: 'active',
      createdAt: hh.createdAt,
      updatedAt: hh.updatedAt,
    };

    MOCK_LANDS.push(plot);
    hhPlots.push(plot);
  }
  landsPerHousehold[hh.id] = hhPlots;
});

// Add remaining land plots to reach 240
while (MOCK_LANDS.length < 240) {
  const hh = rng.element(rawHouseholds);
  const id = `land-${landIdCounter++}`;
  const typeCode = rng.element(MOCK_LAND_TYPES).code;
  const catalogType = MOCK_LAND_TYPES.find(t => t.code === typeCode)!;

  let areaHa = 0.5;
  if (typeCode === 'dat-o-nong-thon') continue; // Only 1 residential plot max
  else if (typeCode === 'dat-lua-ray') areaHa = rng.range(20, 100) / 100;
  else if (typeCode === 'dat-cay-lau-nam') areaHa = rng.range(50, 150) / 100;
  else areaHa = rng.range(150, 400) / 100;

  const certStatus: LandCertificateStatus = rng.boolean(0.8) ? 'granted' : 'pending';
  const certNumber = certStatus === 'granted' ? `CH${rng.range(100000, 999999)}` : undefined;

  const plot: LandRecord = {
    id,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    landTypeCode: typeCode,
    landTypeName: catalogType.name,
    parcelCode: `TB-${hh.hamletCode.toUpperCase().replace('-', '')}-${rng.range(100, 999)}`,
    mapSheetNumber: String(rng.range(1, 15)),
    areaHa,
    ownershipType: 'household',
    certificateStatus: certStatus,
    certificateNumber: certNumber,
    purpose: catalogType.name,
    status: 'active',
    createdAt: hh.createdAt,
    updatedAt: hh.updatedAt,
  };
  MOCK_LANDS.push(plot);
  landsPerHousehold[hh.id].push(plot);
}

// --- 3. CROP RECORDS GENERATION (320 records) ---
export const MOCK_CROPS: CropRecord[] = [];
const cropsPerHousehold: Record<string, CropRecord[]> = {};

let cropIdCounter = 1;

// Seed crops based on household lands and geographical suitability.
// Cà phê Arabica grows best at high elevations (Thôn 03, 04, 05 represent highlands).
rawHouseholds.forEach((hh) => {
  cropsPerHousehold[hh.id] = [];
  const hhLands = landsPerHousehold[hh.id];

  // Cultivate crops based on land parcels
  hhLands.forEach((land) => {
    if (land.landTypeCode === 'dat-cay-lau-nam') {
      // Cultivate Chuối Lao Bảo (grown in all hamlets)
      const queRecord: CropRecord = {
        id: `crop-${cropIdCounter++}`,
        householdId: hh.id,
        householdCode: hh.code,
        householdHeadName: hh.headName,
        cropTypeCode: 'chuoi-laobao',
        cropTypeName: 'Chuối Lao Bảo',
        areaHa: land.areaHa * rng.range(60, 90) / 100, // cultivates 60%-90% of the land
        plantingYear: rng.range(2010, 2024),
        seasonYear: '2026-XH',
        cultivationMethod: rng.boolean(0.4) ? 'Hữu cơ' : 'Truyền thống',
        harvestOutputKg: rng.range(200, 1200),
        salePrice: rng.range(50, 85) * 1000, // 50,000 - 85,000 VND per kg
        salesChannel: 'Thương lái thu mua tại vườn',
        growingAreaCode: `GAC-QUE-${hh.hamletCode.toUpperCase()}-${rng.range(10, 99)}`,
        diseaseStatus: rng.boolean(0.9) ? 'none' : rng.boolean(0.7) ? 'monitoring' : 'treated',
        status: 'active',
        createdAt: hh.createdAt,
        updatedAt: hh.updatedAt,
      };
      MOCK_CROPS.push(queRecord);
      cropsPerHousehold[hh.id].push(queRecord);

      // Cà phê Arabica grows in highland hamlets (noc-03, noc-04, noc-05)
      const isHighlandHamlet = ['noc-03', 'noc-04', 'noc-05'].includes(hh.hamletCode);
      if (isHighlandHamlet && rng.boolean(0.7)) {
        // High suitability, grow Ginseng!
        const samRecord: CropRecord = {
          id: `crop-${cropIdCounter++}`,
          householdId: hh.id,
          householdCode: hh.code,
          householdHeadName: hh.headName,
          cropTypeCode: 'ca-phe-arabica',
          cropTypeName: 'Cà phê Arabica',
          areaHa: land.areaHa * rng.range(10, 30) / 100, // small area for ginseng (0.02 - 0.5 Ha)
          plantingYear: rng.range(2018, 2025),
          seasonYear: '2026-XH',
          cultivationMethod: rng.boolean(0.8) ? 'Hữu cơ' : 'VietGAP',
          harvestOutputKg: rng.range(5, 35), // 5 - 35 kg of ginseng roots
          salePrice: rng.range(60, 110) * 1000000, // 60M - 110M VND per kg!
          salesChannel: 'Hợp tác xã nông nghiệp Lao Bảo',
          growingAreaCode: `GAC-SAM-${hh.hamletCode.toUpperCase()}-${rng.range(10, 99)}`,
          diseaseStatus: rng.boolean(0.92) ? 'none' : rng.boolean(0.6) ? 'monitoring' : 'treated',
          status: 'active',
          createdAt: hh.createdAt,
          updatedAt: hh.updatedAt,
        };
        MOCK_CROPS.push(samRecord);
        cropsPerHousehold[hh.id].push(samRecord);
      }
    } else if (land.landTypeCode === 'dat-lua-ray') {
      // Grow Lúa rẫy
      const luaRecord: CropRecord = {
        id: `crop-${cropIdCounter++}`,
        householdId: hh.id,
        householdCode: hh.code,
        householdHeadName: hh.headName,
        cropTypeCode: 'lua-ray',
        cropTypeName: 'Lúa rẫy',
        areaHa: land.areaHa,
        plantingYear: 2025,
        seasonYear: '2026-DH',
        cultivationMethod: 'Truyền thống',
        harvestOutputKg: rng.range(600, 2500), // 0.6 to 2.5 tons
        salePrice: rng.range(8, 12) * 1000, // 8,000 - 12,000 VND / kg
        salesChannel: 'Tự tiêu thụ / Bán lẻ tại chợ địa phương',
        diseaseStatus: rng.boolean(0.85) ? 'none' : 'monitoring',
        status: 'active',
        createdAt: hh.createdAt,
        updatedAt: hh.updatedAt,
      };
      MOCK_CROPS.push(luaRecord);
      cropsPerHousehold[hh.id].push(luaRecord);

      // Grow Ngô lai as sub-crop
      if (rng.boolean(0.5)) {
        const ngoRecord: CropRecord = {
          id: `crop-${cropIdCounter++}`,
          householdId: hh.id,
          householdCode: hh.code,
          householdHeadName: hh.headName,
          cropTypeCode: 'ngo-lai',
          cropTypeName: 'Ngô lai',
          areaHa: land.areaHa * rng.range(30, 60) / 100,
          plantingYear: 2025,
          seasonYear: '2026-DH',
          cultivationMethod: 'Truyền thống',
          harvestOutputKg: rng.range(400, 1500),
          salePrice: rng.range(6, 9) * 1000, // 6,000 - 9,000 VND / kg
          salesChannel: 'Tự tiêu thụ / Bán lẻ tại chợ địa phương',
          diseaseStatus: 'none',
          status: 'active',
          createdAt: hh.createdAt,
          updatedAt: hh.updatedAt,
        };
        MOCK_CROPS.push(ngoRecord);
        cropsPerHousehold[hh.id].push(ngoRecord);
      }
    }
  });
});

// Ensure 320 records by adding seasonal logs for prior seasons (e.g. 2025-DH and 2025-XH)
while (MOCK_CROPS.length < 320) {
  const hh = rng.element(rawHouseholds);
  const season = rng.element(MOCK_SEASONS.filter(s => s.code !== '2026-XH'));
  const cropType = rng.element(MOCK_CROP_TYPES);

  let areaHa = rng.range(10, 100) / 100;
  let harvest = rng.range(100, 1000);
  let price = rng.range(10, 30) * 1000;

  if (cropType.code === 'ca-phe-arabica') {
    if (!['noc-03', 'noc-04', 'noc-05'].includes(hh.hamletCode)) continue;
    areaHa = rng.range(2, 10) / 100;
    harvest = rng.range(2, 15);
    price = rng.range(70, 95) * 1000000;
  } else if (cropType.code === 'chuoi-laobao') {
    price = rng.range(45, 75) * 1000;
  } else if (cropType.code === 'lua-ray') {
    price = rng.range(8, 11) * 1000;
  } else if (cropType.code === 'ngo-lai') {
    price = rng.range(6, 8) * 1000;
  } else {
    price = rng.range(15, 22) * 1000;
  }

  const prevCrop: CropRecord = {
    id: `crop-${cropIdCounter++}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    cropTypeCode: cropType.code,
    cropTypeName: cropType.name,
    areaHa,
    plantingYear: season.year - rng.range(1, 4),
    seasonYear: season.code,
    cultivationMethod: 'Truyền thống',
    harvestOutputKg: harvest,
    salePrice: price,
    salesChannel: cropType.isSpecialty ? 'Thương lái thu mua tại vườn' : 'Tự tiêu thụ / Bán lẻ tại chợ địa phương',
    diseaseStatus: 'none',
    status: 'active',
    createdAt: hh.createdAt,
    updatedAt: hh.updatedAt,
  };
  MOCK_CROPS.push(prevCrop);
  cropsPerHousehold[hh.id].push(prevCrop);
}

// --- 4. LIVESTOCK RECORDS GENERATION (220 records) ---
export const MOCK_LIVESTOCK: LivestockRecord[] = [];
const livestockPerHousehold: Record<string, LivestockRecord[]> = {};

let livestockIdCounter = 1;

// Ensure every household has at least some livestock
rawHouseholds.forEach((hh) => {
  livestockPerHousehold[hh.id] = [];
  const animalsCount = rng.range(1, 2);

  for (let a = 0; a < animalsCount; a++) {
    const typeCode = a === 0
      ? rng.boolean(0.5) ? 'lon-ban-dia' : rng.boolean(0.6) ? 'ga-ban-dia' : 'bo'
      : rng.boolean(0.4) ? 'de-co' : 'trau';

    const catalogType = MOCK_LIVESTOCK_TYPES.find(t => t.code === typeCode) || MOCK_LIVESTOCK_TYPES[0];

    let quantity = 1;
    if (typeCode === 'ga-ban-dia') quantity = rng.range(20, 80);
    else if (typeCode === 'lon-ban-dia') quantity = rng.range(2, 8);
    else if (typeCode === 'de-co') quantity = rng.range(3, 12);
    else quantity = rng.range(1, 4); // cows, buffaloes

    const vacPercent = rng.range(60, 100) / 100;
    const vaccinatedQuantity = Math.floor(quantity * vacPercent);
    const lastVaccinatedDate = vaccinatedQuantity > 0
      ? `2026-03-${String(rng.range(1, 30)).padStart(2, '0')}`
      : undefined;

    const hasDisease = rng.boolean(0.08); // 8% disease chance
    const diseaseQuantity = hasDisease ? rng.range(1, Math.ceil(quantity / 2)) : 0;
    const diseaseType = hasDisease
      ? typeCode === 'lon-ban-dia' ? 'Dịch tả heo Châu Phi' : typeCode === 'ga-ban-dia' ? 'Cúm gia cầm' : 'Lở mồm long móng'
      : undefined;
    const diseaseStatus: LivestockDiseaseStatus = hasDisease
      ? rng.boolean(0.5) ? 'monitoring' : 'quarantined'
      : 'none';

    const livestock: LivestockRecord = {
      id: `live-${livestockIdCounter++}`,
      householdId: hh.id,
      householdCode: hh.code,
      householdHeadName: hh.headName,
      livestockTypeCode: typeCode,
      livestockTypeName: catalogType.name,
      quantity,
      vaccinatedQuantity,
      lastVaccinatedDate,
      diseaseQuantity,
      diseaseType,
      diseaseStatus,
      status: 'active',
      createdAt: hh.createdAt,
      updatedAt: hh.updatedAt,
    };
    MOCK_LIVESTOCK.push(livestock);
    livestockPerHousehold[hh.id].push(livestock);
  }
});

// Add leftover to match 220
while (MOCK_LIVESTOCK.length < 220) {
  const hh = rng.element(rawHouseholds);
  const typeCode = rng.element(MOCK_LIVESTOCK_TYPES).code;
  const catalogType = MOCK_LIVESTOCK_TYPES.find(t => t.code === typeCode)!;

  let quantity = rng.range(2, 6);
  if (typeCode === 'ga-ban-dia') quantity = rng.range(30, 100);

  const livestock: LivestockRecord = {
    id: `live-${livestockIdCounter++}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    livestockTypeCode: typeCode,
    livestockTypeName: catalogType.name,
    quantity,
    vaccinatedQuantity: Math.floor(quantity * 0.8),
    lastVaccinatedDate: `2026-04-${String(rng.range(1, 28)).padStart(2, '0')}`,
    diseaseQuantity: 0,
    diseaseStatus: 'none',
    status: 'active',
    createdAt: hh.createdAt,
    updatedAt: hh.updatedAt,
  };
  MOCK_LIVESTOCK.push(livestock);
  livestockPerHousehold[hh.id].push(livestock);
}

// --- 5. FOREST PROTECTION CONTRACTS (120 records) ---
export const MOCK_FOREST_DVMTR: ForestDvmtrRecord[] = [];
const forestPerHousehold: Record<string, ForestDvmtrRecord[]> = {};

let forestIdCounter = 1;
// Randomly assign 120 forest contracts to households
const forestHhIndices = new Set<number>();
while (forestHhIndices.size < 120) {
  forestHhIndices.add(rng.range(0, 180));
}

Array.from(forestHhIndices).forEach((hhIdx) => {
  const hh = rawHouseholds[hhIdx];
  forestPerHousehold[hh.id] = [];

  const contractedAreaHa = rng.range(200, 1500) / 100; // 2.0 to 15.0 Ha
  const paymentRatePerHa = MOCK_SETTINGS.dvmtrPaymentRatePerHa;
  const totalAmount = Math.round(contractedAreaHa * paymentRatePerHa);

  const pStatus: ForestDvmtrPaymentStatus = rng.boolean(0.8) ? 'paid' : rng.boolean(0.7) ? 'partially_paid' : 'pending';
  const paymentDate = pStatus === 'paid' ? `2026-05-${String(rng.range(1, 28)).padStart(2, '0')}` : undefined;

  const contract: ForestDvmtrRecord = {
    id: `forest-${forestIdCounter++}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    contractCode: `HĐ-BVR-30-${String(forestIdCounter).padStart(3, '0')}`,
    forestBlock: `Tiểu khu ${rng.range(150, 165)}, Khoảnh ${rng.range(1, 8)}`,
    contractedAreaHa,
    paymentRatePerHa,
    totalAmount,
    paymentYear: 2026,
    paymentStatus: pStatus,
    paymentDate,
    status: 'active',
    createdAt: hh.createdAt,
    updatedAt: hh.updatedAt,
  };

  MOCK_FOREST_DVMTR.push(contract);
  forestPerHousehold[hh.id] = [contract];
});

// --- 6. HOUSEHOLD ECONOMY GENERATION (180 records) ---
export const MOCK_HOUSEHOLD_ECONOMY: HouseholdEconomyRecord[] = [];

rawHouseholds.forEach((hh) => {
  // Crop revenue for 2026 (sum crop records for 2026-DH and 2026-XH)
  const hhCrops = cropsPerHousehold[hh.id] || [];
  const crop2026 = hhCrops.filter(c => c.seasonYear.startsWith('2026'));
  const cropRevenue = crop2026.reduce((sum, c) => sum + (c.harvestOutputKg * c.salePrice), 0);
  const cropCost = cropRevenue > 0 ? Math.round(cropRevenue * rng.range(20, 35) / 100) : 0;

  // Livestock sales (simulated for 2026)
  const hhAnimals = livestockPerHousehold[hh.id] || [];
  let livestockRevenue = 0;
  if (hhAnimals.length > 0) {
    hhAnimals.forEach((l) => {
      if (l.livestockTypeCode === 'lon-ban-dia') {
        livestockRevenue += rng.range(1, 3) * rng.range(3, 5) * 1000000; // sells some pigs
      } else if (l.livestockTypeCode === 'ga-ban-dia') {
        livestockRevenue += rng.range(10, 30) * rng.range(120, 180) * 1000; // chickens
      } else if (rng.boolean(0.15)) {
        livestockRevenue += rng.range(1, 2) * rng.range(15, 25) * 1000000; // cows/buffaloes
      }
    });
  }
  const livestockCost = livestockRevenue > 0 ? Math.round(livestockRevenue * rng.range(30, 50) / 100) : rng.range(1, 5) * 500000;

  // DVMTR protection contracts
  const hhForest = forestPerHousehold[hh.id] || [];
  const forestDvmtrRevenue = hhForest.reduce((sum, f) => sum + (f.paymentStatus === 'paid' ? f.totalAmount : f.paymentStatus === 'partially_paid' ? Math.round(f.totalAmount * 0.5) : 0), 0);
  const forestDvmtrCost = forestDvmtrRevenue > 0 ? Math.round(forestDvmtrRevenue * 0.08) : 0;

  // Other revenues (salary, labor, foraging, support)
  const otherRevenue = rng.range(5, 25) * 1000000;
  const otherCost = Math.round(otherRevenue * rng.range(15, 30) / 100);

  const totalRevenue = cropRevenue + livestockRevenue + forestDvmtrRevenue + otherRevenue;
  const totalCost = cropCost + livestockCost + forestDvmtrCost + otherCost;
  const netIncome = totalRevenue - totalCost;

  const incomePerCapita = Math.round(netIncome / hh.memberCount);
  const monthlyIncomePerCapita = incomePerCapita / 12;

  // Set Economic classification based on settings thresholds
  // Poverty = 1.5M/capita/month. Near poverty = 2M/capita/month.
  let classification: EconomicClassification = 'poor';
  if (monthlyIncomePerCapita > 2000000) {
    classification = monthlyIncomePerCapita > 5000000 ? 'betterOff' : 'average';
  } else if (monthlyIncomePerCapita > 1500000) {
    classification = 'nearPoor';
  } else {
    classification = 'poor';
  }

  // Previous year classification (for progress tracking)
  let prevClassification = classification;
  if (classification === 'average' && rng.boolean(0.4)) prevClassification = 'nearPoor';
  if (classification === 'nearPoor' && rng.boolean(0.5)) prevClassification = 'poor';
  if (classification === 'betterOff' && rng.boolean(0.6)) prevClassification = 'average';

  // Support policies
  const supportPolicies: string[] = [];
  if (classification === 'poor' || classification === 'nearPoor') {
    supportPolicies.push('Hỗ trợ gạo mùa giáp hạt');
    if (rng.boolean(0.6)) supportPolicies.push('Cấp thẻ BHYT miễn phí');
    if (rng.boolean(0.4)) supportPolicies.push('Hỗ trợ cây cà phê Arabica giống');
  }
  if (forestDvmtrRevenue > 0) {
    supportPolicies.push('Nhận khoán bảo vệ rừng DVMTR');
  }

  const economyRecord: HouseholdEconomyRecord = {
    id: `econ-${hh.id}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    year: 2026,
    cropRevenue,
    livestockRevenue,
    forestDvmtrRevenue,
    otherRevenue,
    totalRevenue,
    cropCost,
    livestockCost,
    forestDvmtrCost,
    otherCost,
    totalCost,
    netIncome,
    incomePerCapita,
    economicClassificationBefore: prevClassification,
    economicClassificationAfter: classification,
    supportPoliciesReceived: supportPolicies,
    status: 'active',
    createdAt: hh.createdAt,
    updatedAt: hh.updatedAt,
  };

  MOCK_HOUSEHOLD_ECONOMY.push(economyRecord);

  // Update original household object with totals and classification
  hh.totalLandAreaHa = Number(landsPerHousehold[hh.id].reduce((sum, l) => sum + l.areaHa, 0).toFixed(2));
  hh.totalAnnualIncome = totalRevenue;
  hh.totalAnnualCost = totalCost;
  hh.netAnnualIncome = netIncome;
  hh.incomePerCapita = incomePerCapita;
  hh.economicClassification = classification;
  hh.mainCropTypes = Array.from(new Set((cropsPerHousehold[hh.id] || []).map(c => c.cropTypeName)));
  hh.livestockTypes = Array.from(new Set((livestockPerHousehold[hh.id] || []).map(l => l.livestockTypeName)));
});

// Finalize Households export list
export const MOCK_HOUSEHOLDS: Household[] = rawHouseholds;

// --- 7. AUDIT LOGS GENERATION (30 records) ---
export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [];
const actionLogs = [
  { action: 'Đăng nhập hệ thống', module: 'auth' as const, desc: 'Người dùng đăng nhập thành công vào hệ thống', target: 'Hệ thống' },
  { action: 'Cập nhật thông tin hộ gia đình', module: 'household' as const, desc: 'Cập nhật số nhân khẩu và lao động của hộ gia đình', target: 'Hộ HH-30-' },
  { action: 'Thêm mới nhật ký trồng trọt', module: 'crop' as const, desc: 'Ghi nhận diện tích gieo trồng Cà phê Arabica mới vụ Xuân Hè', target: 'Cây Cà phê Arabica' },
  { action: 'Khai báo tình hình dịch bệnh chăn nuôi', module: 'livestock' as const, desc: 'Báo cáo 2 con trâu mắc bệnh Lở mồm long móng tại Thôn 02', target: 'Đàn vật nuôi' },
  { action: 'Cấp chứng nhận quyền sử dụng đất', module: 'land' as const, desc: 'Cập nhật mã sổ hồng cho thửa đất số', target: 'Thửa đất TB-' },
  { action: 'Chi trả tiền khoán bảo vệ rừng DVMTR', module: 'forest' as const, desc: 'Xác nhận thanh toán tiền dịch vụ môi trường rừng đợt 1 năm 2026', target: 'Tiểu khu 150' },
  { action: 'Tải xuống báo cáo thống kê', module: 'settings' as const, desc: 'Xuất dữ liệu thống kê tổng hợp kinh tế xã dạng Excel', target: 'Báo cáo & Thống kê' },
  { action: 'Cập nhật ngưỡng nghèo', module: 'settings' as const, desc: 'Điều chỉnh cấu hình ngưỡng thu nhập bình quân đầu người nông thôn', target: 'Cấu hình Ngưỡng nghèo' },
];

for (let j = 1; j <= 30; j++) {
  const logTemplate = rng.element(actionLogs);
  const user = rng.element(MOCK_USERS);
  const randomDay = rng.range(1, 15);
  const randomHour = rng.range(8, 17);
  const randomMin = rng.range(10, 59);

  const targetCode = logTemplate.target.endsWith('-')
    ? `${logTemplate.target}${String(rng.range(100, 999))}`
    : logTemplate.target;

  MOCK_AUDIT_LOGS.push({
    id: `log-${j}`,
    userId: user.id,
    username: user.username,
    userFullName: user.fullName,
    role: user.role === 'admin' ? 'Quản trị viên' :
          user.role === 'data_officer' ? 'Cán bộ nhập liệu' :
          user.role === 'unit_leader' ? 'Lãnh đạo đơn vị' :
          user.role === 'data_governance' ? 'Cán bộ Văn phòng' : 'Lãnh đạo xã',
    action: logTemplate.action,
    module: logTemplate.module,
    targetObject: targetCode,
    description: `${logTemplate.desc} ${rng.range(100, 999)}`,
    ipAddress: `192.168.1.${rng.range(10, 254)}`,
    timestamp: `2026-06-${String(randomDay).padStart(2, '0')}T${String(randomHour).padStart(2, '0')}:${String(randomMin).padStart(2, '0')}:00Z`,
  });
}

// Sort audit logs by latest timestamp first
MOCK_AUDIT_LOGS.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// --- 8. REPORTS GENERATION ---
export const MOCK_REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 't-1', code: 'BC-TONG-HOP', title: 'Báo cáo Tổng hợp Lãnh đạo', description: 'Thống kê tổng quan thu nhập, cơ cấu cây trồng vật nuôi, tỷ lệ nghèo, môi trường và hạ tầng toàn xã Lao Bảo', module: 'general', supportedFormats: ['excel', 'pdf'] },
  { id: 't-2', code: 'BC-HO-GIA-DINH', title: 'Báo cáo Danh sách Hộ gia đình & Phân loại Nghèo', description: 'Danh sách chi tiết các hộ gia đình theo từng thôn, kèm số nhân khẩu và xếp loại kinh tế', module: 'household', supportedFormats: ['excel'] },
  { id: 't-3', code: 'BC-CAY-TRONG-DAC-SAN', title: 'Báo cáo Nông nghiệp (Trồng trọt)', description: 'Chi tiết diện tích trồng và sản lượng thu hoạch Cà phê Arabica, Chuối Lao Bảo', module: 'crop', supportedFormats: ['excel', 'pdf', 'word'] },
  { id: 't-4', code: 'BC-CHAN-NUOI-DICH-BENH', title: 'Báo cáo Nông nghiệp (Chăn nuôi & Dịch bệnh)', description: 'Tổng hợp số lượng trâu bò heo dê và các ổ dịch bệnh đang theo dõi', module: 'livestock', supportedFormats: ['excel', 'pdf'] },
  { id: 't-5', code: 'BC-CHI-TRA-DVMTR', title: 'Báo cáo Thống kê Chi trả Dịch vụ Môi trường Rừng (DVMTR)', description: 'Danh sách các hộ gia đình nhận khoán bảo vệ rừng và số tiền đã giải ngân', module: 'forest', supportedFormats: ['excel'] },
  { id: 't-6', code: 'BC-BIEN-DONG-CAY-TRONG', title: 'Báo cáo Biến động Diện tích & Sản lượng Cây trồng', description: 'Theo dõi sự thay đổi diện tích canh tác, sản lượng thu hoạch nông nghiệp và nguyên nhân biến động giữa các năm', module: 'crop-change', supportedFormats: ['excel', 'pdf'] },
  { id: 't-7', code: 'BC-MOI-TRUONG', title: 'Báo cáo Công tác Bảo vệ Môi trường', description: 'Thống kê lượng rác thải phát sinh, tỷ lệ phân loại rác tại nguồn, hồ sơ cấp phép và các quyết định xử phạt vi phạm', module: 'environment', supportedFormats: ['excel', 'pdf'] },
  { id: 't-8', code: 'BC-TAI-NGUYEN-NUOC', title: 'Báo cáo Tài nguyên Nước & Nước sạch Nông thôn', description: 'Tổng hợp tình hình khai thác nước dưới đất, tỷ lệ sử dụng nước sạch và trạng thái các công trình cấp nước', module: 'water-resources', supportedFormats: ['excel', 'pdf'] },
  { id: 't-9', code: 'BC-NHA-O-HO-TRO', title: 'Báo cáo Hiện trạng Nhà ở & Nhu cầu Hỗ trợ', description: 'Danh sách hộ gia đình có nhà tạm, dột nát, mức độ xuống cấp và danh sách đề nghị hỗ trợ xóa nhà tạm', module: 'housing', supportedFormats: ['excel', 'pdf'] },
  { id: 't-10', code: 'BC-HO-SXKD', title: 'Báo cáo Hoạt động Hộ sản xuất kinh doanh phi nông nghiệp', description: 'Thống kê các hộ kinh doanh cá thể, ngành nghề kinh doanh, doanh thu định kỳ và lao động phi nông nghiệp', module: 'business-households', supportedFormats: ['excel', 'pdf'] },
  { id: 't-11', code: 'BC-CHI-TIEU-KTXH', title: 'Báo cáo Chỉ tiêu Kinh tế - Xã hội tổng hợp', description: 'Hệ thống chỉ tiêu tăng trưởng kinh tế, thu chi ngân sách, dân sinh, văn hóa và lao động qua đào tạo cấp xã', module: 'socio-economic', supportedFormats: ['excel', 'pdf'] },
  { id: 't-12', code: 'BC-THUY-LOI-VAN-HANH', title: 'Báo cáo Hiện trạng & Vận hành Công trình Thủy lợi', description: 'Danh sách các đập, hồ chứa, kênh mương, trạng thái kỹ thuật và diện tích phục vụ tưới thực tế', module: 'irrigation', supportedFormats: ['excel', 'pdf'] },
  { id: 't-13', code: 'BC-GIAO-THONG', title: 'Báo cáo Hiện trạng & Hạ tầng Giao thông', description: 'Tổng hợp tỷ lệ cứng hóa đường giao thông, hiện trạng cầu cống xuống cấp, sự cố chia cắt do thiên tai và kế hoạch duy tu sửa chữa', module: 'transportation', supportedFormats: ['excel', 'pdf'] },
];

export const MOCK_GENERATED_REPORTS: GeneratedReport[] = [];
for (let r = 1; r <= 8; r++) {
  const template = rng.element(MOCK_REPORT_TEMPLATES);
  const type = rng.element(template.supportedFormats);
  const user = rng.element(MOCK_USERS);
  const day = rng.range(1, 14);
  const status = r === 8 ? 'processing' : 'completed';
  const size = status === 'completed' ? `${rng.range(120, 890)} KB` : undefined;
  const url = status === 'completed' ? `/exports/report_${template.code.toLowerCase()}_2026.${type}` : undefined;

  MOCK_GENERATED_REPORTS.push({
    id: `rep-${r}`,
    templateId: template.id,
    templateCode: template.code,
    title: `${template.title} - Kỳ báo cáo Tháng 05/2026`,
    type,
    module: template.module,
    description: template.description,
    generatedBy: user.fullName,
    generatedAt: `2026-06-${String(day).padStart(2, '0')}T14:30:00Z`,
    fileUrl: url,
    fileSize: size,
    status,
  });
}
MOCK_GENERATED_REPORTS.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
