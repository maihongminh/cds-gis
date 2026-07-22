import {
  EconomicIndicatorRecord,
  SocialIndicatorRecord,
  LaborEmploymentIndicatorRecord,
  InfrastructureIndicatorRecord,
} from '@/types/socio-economic';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(101); // distinct seed for socio-economic to avoid overlap

// 1. Economic Indicator Records (Commune level, 2024-2026)
export const MOCK_ECONOMIC_INDICATORS: EconomicIndicatorRecord[] = [
  {
    id: 'econ-2024',
    year: 2024,
    gdpGrowthPercent: 6.5,
    totalProductionValueBillion: 120.4,
    agricultureProductionValueBillion: 48.2,
    industryConstructionValueBillion: 32.1,
    serviceValueBillion: 40.1,
    averageIncomePerCapitaMillion: 28.5,
    budgetRevenueMillion: 5200,
    budgetExpenditureMillion: 4950,
    note: 'Kinh tế phục hồi sau đại dịch, nhóm dịch vụ tăng trưởng khá.',
  },
  {
    id: 'econ-2025',
    year: 2025,
    gdpGrowthPercent: 7.2,
    totalProductionValueBillion: 135.8,
    agricultureProductionValueBillion: 52.3,
    industryConstructionValueBillion: 38.5,
    serviceValueBillion: 45.0,
    averageIncomePerCapitaMillion: 32.2,
    budgetRevenueMillion: 5850,
    budgetExpenditureMillion: 5500,
    note: 'Sản xuất nông nghiệp ổn định, các cơ sở SXKD dịch vụ phát triển mạnh.',
  },
  {
    id: 'econ-2026',
    year: 2026,
    gdpGrowthPercent: 7.8,
    totalProductionValueBillion: 152.5,
    agricultureProductionValueBillion: 58.1,
    industryConstructionValueBillion: 44.4,
    serviceValueBillion: 50.0,
    averageIncomePerCapitaMillion: 36.8,
    budgetRevenueMillion: 6500,
    budgetExpenditureMillion: 6100,
    note: 'Chỉ tiêu ước tính năm 2026 dựa trên tốc độ phát triển nửa đầu năm.',
  },
];

// 2. Social Indicator Records (Commune and Hamlet level)
export const MOCK_SOCIAL_INDICATORS: SocialIndicatorRecord[] = [];

// Generate Commune Level Social Indicators
MOCK_ECONOMIC_INDICATORS.forEach((econ) => {
  const year = econ.year;
  const poorPercent = year === 2024 ? 22.4 : year === 2025 ? 18.5 : 15.2;
  const nearPoorPercent = year === 2024 ? 12.1 : year === 2025 ? 10.5 : 9.1;

  MOCK_SOCIAL_INDICATORS.push({
    id: `social-commune-${year}`,
    year,
    totalPopulation: year === 2024 ? 4850 : year === 2025 ? 5020 : 5200,
    totalHouseholds: year === 2024 ? 1120 : year === 2025 ? 1165 : 1210,
    poorHouseholdsCount: Math.round((year === 2024 ? 1120 : year === 2025 ? 1165 : 1210) * poorPercent / 100),
    poorHouseholdsPercent: poorPercent,
    nearPoorHouseholdsCount: Math.round((year === 2024 ? 1120 : year === 2025 ? 1165 : 1210) * nearPoorPercent / 100),
    nearPoorHouseholdsPercent: nearPoorPercent,
    nationalStandardSchoolsCount: year === 2024 ? 2 : year === 2025 ? 3 : 3,
    cultureVillagePercent: year === 2024 ? 62.5 : year === 2025 ? 75.0 : 87.5,
    healthInsurancePercent: year === 2024 ? 92.4 : year === 2025 ? 95.8 : 98.2,
    note: `Báo cáo tổng hợp văn hóa - xã hội toàn xã năm ${year}.`,
  });
});

// Generate Hamlet Level Social Indicators
const years = [2024, 2025, 2026];
years.forEach((yr) => {
  MOCK_HAMLETS.forEach((h) => {
    // Generate hamlet specific baseline
    const baseHh = 100 + rng.range(20, 80); // 120 to 180 households per hamlet
    const households = yr === 2024 ? baseHh : yr === 2025 ? Math.round(baseHh * 1.03) : Math.round(baseHh * 1.06);
    const population = Math.round(households * rng.range(40, 48) / 10); // 4.0 to 4.8 members per hh

    // Poor households percent drops over years
    const poorPercent = yr === 2024 ? rng.range(18, 30) : yr === 2025 ? rng.range(14, 25) : rng.range(10, 20);
    const nearPoorPercent = yr === 2024 ? rng.range(10, 16) : yr === 2025 ? rng.range(8, 14) : rng.range(6, 12);

    const poorCount = Math.round(households * poorPercent / 100);
    const nearPoorCount = Math.round(households * nearPoorPercent / 100);

    MOCK_SOCIAL_INDICATORS.push({
      id: `social-hamlet-${yr}-${h.code}`,
      year: yr,
      villageCode: h.code,
      villageName: h.name,
      totalPopulation: population,
      totalHouseholds: households,
      poorHouseholdsCount: poorCount,
      poorHouseholdsPercent: Number(poorPercent.toFixed(1)),
      nearPoorHouseholdsCount: nearPoorCount,
      nearPoorHouseholdsPercent: Number(nearPoorPercent.toFixed(1)),
      healthInsurancePercent: Number((yr === 2024 ? rng.range(85, 93) : yr === 2025 ? rng.range(90, 97) : rng.range(95, 100)).toFixed(1)),
      note: `Báo cáo dân sinh ${h.name} năm ${yr}.`,
    });
  });
});

// 3. Labor & Employment Indicator Records (Commune and Hamlet level)
export const MOCK_LABOR_INDICATORS: LaborEmploymentIndicatorRecord[] = [];

// Generate Commune Level Labor Indicators
years.forEach((yr) => {
  const commSocial = MOCK_SOCIAL_INDICATORS.find(s => s.year === yr && s.villageCode === undefined);
  if (!commSocial) return;

  const totalPop = commSocial.totalPopulation;
  const workingAge = Math.round(totalPop * 0.58); // ~58% in working age
  const trainedLaborPercent = yr === 2024 ? 35.5 : yr === 2025 ? 40.2 : 45.8;
  const trainedLabor = Math.round(workingAge * trainedLaborPercent / 100);
  const agLabor = Math.round(workingAge * (yr === 2024 ? 0.75 : yr === 2025 ? 0.70 : 0.65));
  const nonAgLabor = Math.round(workingAge * (yr === 2024 ? 0.20 : yr === 2025 ? 0.26 : 0.32));
  const unemployed = workingAge - agLabor - nonAgLabor;

  MOCK_LABOR_INDICATORS.push({
    id: `labor-commune-${yr}`,
    year: yr,
    workingAgePopulation: workingAge,
    trainedLaborCount: trainedLabor,
    trainedLaborPercent,
    agriculturalLaborCount: agLabor,
    nonAgriculturalLaborCount: nonAgLabor,
    unemployedCount: unemployed,
    note: `Thống kê lao động việc làm xã Lao Bảo năm ${yr}.`,
  });
});

// Generate Hamlet Level Labor Indicators
years.forEach((yr) => {
  MOCK_HAMLETS.forEach((h) => {
    const hamletSocial = MOCK_SOCIAL_INDICATORS.find(s => s.year === yr && s.villageCode === h.code);
    if (!hamletSocial) return;

    const pop = hamletSocial.totalPopulation;
    const workingAge = Math.round(pop * (0.55 + rng.range(1, 5) / 100)); // 56% to 60%
    const trainedLaborPercent = yr === 2024 ? rng.range(25, 38) : yr === 2025 ? rng.range(32, 45) : rng.range(40, 52);
    const trainedLabor = Math.round(workingAge * trainedLaborPercent / 100);

    const agRatio = yr === 2024 ? rng.range(72, 82) : yr === 2025 ? rng.range(66, 76) : rng.range(60, 70);
    const agLabor = Math.round(workingAge * agRatio / 100);
    const nonAgLabor = Math.round(workingAge * (rng.range(15, 25) / 100));
    const unemployed = Math.max(0, workingAge - agLabor - nonAgLabor);

    MOCK_LABOR_INDICATORS.push({
      id: `labor-hamlet-${yr}-${h.code}`,
      year: yr,
      villageCode: h.code,
      villageName: h.name,
      workingAgePopulation: workingAge,
      trainedLaborCount: trainedLabor,
      trainedLaborPercent: Number(trainedLaborPercent.toFixed(1)),
      agriculturalLaborCount: agLabor,
      nonAgriculturalLaborCount: nonAgLabor,
      unemployedCount: unemployed,
      note: `Báo cáo lao động thôn ${h.name} năm ${yr}.`,
    });
  });
});

// 4. Infrastructure Indicator Records (Commune and Hamlet level)
export const MOCK_INFRASTRUCTURE_INDICATORS: InfrastructureIndicatorRecord[] = [];

// Generate Commune Level Infrastructure Indicators
years.forEach((yr) => {
  const road = yr === 2024 ? 65.0 : yr === 2025 ? 75.0 : 85.0;
  const power = yr === 2024 ? 90.0 : yr === 2025 ? 94.5 : 98.0;
  const solidHouse = yr === 2024 ? 70.0 : yr === 2025 ? 78.0 : 84.5;
  const latrine = yr === 2024 ? 60.0 : yr === 2025 ? 68.0 : 78.0;
  const canal = yr === 2024 ? 50.0 : yr === 2025 ? 58.0 : 68.5;

  MOCK_INFRASTRUCTURE_INDICATORS.push({
    id: `infra-commune-${yr}`,
    year: yr,
    concreteRoadPercent: road,
    nationalGridPowerPercent: power,
    solidHousePercent: solidHouse,
    hygienicLatrinePercent: latrine,
    irrigationChannelConcretePercent: canal,
    note: `Tổng hợp hiện trạng hạ tầng nông thôn xã Lao Bảo năm ${yr}.`,
  });
});

// Generate Hamlet Level Infrastructure Indicators
years.forEach((yr) => {
  MOCK_HAMLETS.forEach((h) => {
    MOCK_INFRASTRUCTURE_INDICATORS.push({
      id: `infra-hamlet-${yr}-${h.code}`,
      year: yr,
      villageCode: h.code,
      villageName: h.name,
      concreteRoadPercent: Number((yr === 2024 ? rng.range(50, 75) : yr === 2025 ? rng.range(62, 85) : rng.range(75, 95)).toFixed(1)),
      nationalGridPowerPercent: Number((yr === 2024 ? rng.range(80, 95) : yr === 2025 ? rng.range(88, 98) : rng.range(94, 100)).toFixed(1)),
      solidHousePercent: Number((yr === 2024 ? rng.range(60, 78) : yr === 2025 ? rng.range(68, 86) : rng.range(76, 94)).toFixed(1)),
      hygienicLatrinePercent: Number((yr === 2024 ? rng.range(50, 70) : yr === 2025 ? rng.range(58, 80) : rng.range(68, 90)).toFixed(1)),
      irrigationChannelConcretePercent: Number((yr === 2024 ? rng.range(40, 60) : yr === 2025 ? rng.range(48, 70) : rng.range(58, 80)).toFixed(1)),
      note: `Đánh giá tiêu chí cơ sở hạ tầng thôn ${h.name} năm ${yr}.`,
    });
  });
});
