import {
  DisasterEvent,
  WeatherMonthlyRecord,
  AgricultureRiskAlert,
} from '@/types/climate';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(42);

// 1. Disaster Events (20 records)
export const MOCK_DISASTER_EVENTS: DisasterEvent[] = [];
const disasterTypes: ('landslide' | 'flashFlood' | 'storm' | 'frost' | 'drought')[] = [
  'landslide',
  'flashFlood',
  'storm',
  'frost',
  'drought'
];

for (let i = 1; i <= 20; i++) {
  const type = rng.element(disasterTypes);
  const hamlet1 = MOCK_HAMLETS[rng.range(0, 7)].name;
  const hamlet2 = MOCK_HAMLETS[rng.range(0, 7)].name;
  const affected = Array.from(new Set([hamlet1, hamlet2]));

  MOCK_DISASTER_EVENTS.push({
    id: `disaster-${i}`,
    eventCode: `TT-2026-${String(i).padStart(3, '0')}`,
    disasterType: type,
    eventDate: `2026-${String(rng.range(1, 6)).padStart(2, '0')}-${String(rng.range(1, 28)).padStart(2, '0')}`,
    affectedHamlets: affected,
    severity: rng.element(['low', 'medium', 'high']),
    estimatedDamageVnd: rng.range(10, 150) * 1000000, // 10M to 150M VND
    status: rng.element(['resolved', 'processing', 'active']),
    note: `Ghi nhận thiệt hại nông nghiệp tại các thôn ảnh hưởng.`,
  });
}

// 2. Weather Monthly Records (12 records - e.g. July 2025 to June 2026)
export const MOCK_WEATHER_RECORDS: WeatherMonthlyRecord[] = [];
const baseTemps = [18, 19, 21, 24, 27, 28, 28, 27, 26, 23, 21, 19]; // approximate monthly temps in highlands
const baseRainfalls = [120, 90, 80, 150, 220, 240, 210, 230, 320, 450, 380, 210]; // rainfall in mm

for (let m = 1; m <= 12; m++) {
  const is2025 = m <= 6;
  const year = is2025 ? 2025 : 2026;
  const monthVal = is2025 ? m + 6 : m - 6;

  MOCK_WEATHER_RECORDS.push({
    id: `weather-${m}`,
    year,
    month: monthVal,
    averageTemperature: Number((baseTemps[monthVal - 1] + rng.range(-15, 15) / 10).toFixed(1)),
    rainfallMm: Math.round(baseRainfalls[monthVal - 1] + rng.range(-40, 40)),
    humidityPercentage: rng.range(75, 92),
    sunshineHours: rng.range(120, 220),
    source: 'Trạm khí tượng thủy văn tỉnh Quảng Trị (mock)',
  });
}
// Sort by year and month
MOCK_WEATHER_RECORDS.sort((a, b) => {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
});

// 3. Agriculture Risk Alerts (20 records)
export const MOCK_AGRI_RISK_ALERTS: AgricultureRiskAlert[] = [];
const riskTypes = [
  'Sương muối kéo dài vùng cao',
  'Ngập úng lúa rẫy sườn dốc',
  'Nấm cổ rễ phát triển hại cà phê Arabica',
  'Khô hạn thiếu nước tưới tiêu',
  'Gió lốc mạnh làm đổ quế non'
];

for (let i = 1; i <= 20; i++) {
  const type = rng.element(riskTypes);
  const crops = rng.boolean(0.5) ? ['ca-phe-arabica'] : ['chuoi-laobao', 'lua-ray'];
  const hamlets = [MOCK_HAMLETS[rng.range(0, 7)].name];

  MOCK_AGRI_RISK_ALERTS.push({
    id: `alert-${i}`,
    alertCode: `CB-KH-${2026}-${String(i).padStart(3, '0')}`,
    riskType: type,
    affectedCropTypeCodes: crops,
    affectedHamlets: hamlets,
    severity: rng.element(['info', 'warning', 'critical']),
    recommendations: 'Đề nghị bà con chú ý che chắn nilon cho sâm non, tháo thoát nước cho lúa rẫy.',
    status: rng.boolean(0.8) ? 'active' : 'archived',
    publishDate: `2026-06-${String(rng.range(1, 20)).padStart(2, '0')}`,
  });
}
