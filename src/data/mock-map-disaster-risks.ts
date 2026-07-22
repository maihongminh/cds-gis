// src/data/mock-map-disaster-risks.ts
// Mock disaster risk zone data for Lao Bao GIS demo.
// dataStatus: "mock" — zones are approximated for demo purposes.
// Polygon coordinates in EPSG:4326 [Lng, Lat].
// Security: public/shared zones shown to all; confidential zones filtered by RBAC.

import type { DisasterRiskZone } from '@/types/map';

export const MOCK_DISASTER_RISK_ZONES: DisasterRiskZone[] = [
  // ── Landslide Zones ────────────────────────────────────────────────────────

  {
    id: 'risk-01',
    code: 'SL-001',
    name: 'Vùng nguy cơ sạt lở đèo Ka Tăng',
    riskType: 'landslide',
    riskLevel: 'critical',
    villageCodes: ['ka-tang'],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [106.557, 16.638],
        [106.562, 16.640],
        [106.567, 16.636],
        [106.564, 16.630],
        [106.557, 16.630],
        [106.555, 16.634],
        [106.557, 16.638],
      ]],
    },
    affectedAreaHa: 42,
    affectedPopulationEstimate: 320,
    lastAssessmentDate: '2026-06-15',
    warningMessage:
      'Khu vực đèo Ka Tăng có nguy cơ sạt lở đất đá rất cao trong mùa mưa bão (tháng 9–11). Vách núi dốc đứng, đất đá phong hóa mạnh.',
    recommendedAction:
      'Cấm qua lại khi có mưa to hoặc báo động thiên tai. Di dời hộ dân trong vùng nguy hiểm. Cắm biển cảnh báo và bố trí điểm chốt.',
    status: 'warning',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'risk-02',
    code: 'SL-002',
    name: 'Điểm sạt lở bờ taluy đường Hồ Chí Minh (Đoạn Tây Chín)',
    riskType: 'landslide',
    riskLevel: 'high',
    villageCodes: ['tay-chin'],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [106.563, 16.612],
        [106.570, 16.614],
        [106.572, 16.608],
        [106.566, 16.605],
        [106.560, 16.608],
        [106.563, 16.612],
      ]],
    },
    affectedAreaHa: 18,
    affectedPopulationEstimate: 85,
    lastAssessmentDate: '2026-05-20',
    warningMessage:
      'Taluy âm bờ đường HCM đoạn qua Tây Chín bị xói mòn, nguy cơ sụt lún khi mưa kéo dài trên 48 giờ.',
    recommendedAction:
      'Gia cố taluy bằng tường chắn, lắp đặt hệ thống thoát nước. Theo dõi vết nứt định kỳ.',
    status: 'monitoring',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'risk-03',
    code: 'SL-003',
    name: 'Khu vực sạt lở đất rừng Tân Kim',
    riskType: 'landslide',
    riskLevel: 'medium',
    villageCodes: ['tan-kim'],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [106.572, 16.650],
        [106.580, 16.655],
        [106.584, 16.648],
        [106.578, 16.643],
        [106.570, 16.644],
        [106.572, 16.650],
      ]],
    },
    affectedAreaHa: 25,
    affectedPopulationEstimate: 140,
    lastAssessmentDate: '2026-04-10',
    warningMessage:
      'Sườn đồi khu vực rừng Tân Kim có nguy cơ trượt đất khi lượng mưa tích lũy vượt 200mm.',
    recommendedAction:
      'Theo dõi quan trắc. Không canh tác hoặc san lấp tại khu vực cảnh báo.',
    status: 'monitoring',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'risk-04',
    code: 'SL-004',
    name: 'Nguy cơ sạt lở taluy Tân Phước',
    riskType: 'landslide',
    riskLevel: 'medium',
    villageCodes: ['tan-phuoc'],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [106.608, 16.634],
        [106.615, 16.638],
        [106.618, 16.630],
        [106.612, 16.625],
        [106.606, 16.628],
        [106.608, 16.634],
      ]],
    },
    affectedAreaHa: 12,
    affectedPopulationEstimate: 60,
    lastAssessmentDate: '2026-03-25',
    warningMessage:
      'Taluy đường liên thôn Tân Phước – Tân Thành có nguy cơ sạt lở, đặc biệt sau mưa lớn.',
    recommendedAction:
      'Phát quang thảm thực vật taluy. Khơi thông rãnh thoát nước. Kiểm tra định kỳ.',
    status: 'monitoring',
    securityLevel: 'public',
    dataStatus: 'mock',
  },

  // ── Flooding Zones ─────────────────────────────────────────────────────────

  {
    id: 'risk-05',
    code: 'LP-001',
    name: 'Vùng ngập lụt ven sông Sê Pôn (Tân Kim – Triệu Thành)',
    riskType: 'flooding',
    riskLevel: 'high',
    villageCodes: ['tan-kim', 'trieu-thanh'],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [106.573, 16.656],
        [106.582, 16.660],
        [106.592, 16.658],
        [106.590, 16.649],
        [106.580, 16.648],
        [106.572, 16.648],
        [106.571, 16.652],
        [106.573, 16.656],
      ]],
    },
    affectedAreaHa: 85,
    affectedPopulationEstimate: 680,
    lastAssessmentDate: '2026-06-01',
    warningMessage:
      'Khu vực ven sông Sê Pôn thường xuyên ngập lụt trong mùa mưa lũ (tháng 10–11), mực nước có thể dâng cao 0.5–1.2m.',
    recommendedAction:
      'Chuẩn bị phương án di dời khẩn cấp cho 680 người. Bố trí điểm tránh lũ. Kiểm tra đê và công trình thoát nước.',
    status: 'warning',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'risk-06',
    code: 'LP-002',
    name: 'Vùng ngập thấp trũng Triệu Long – Làng Vây',
    riskType: 'flooding',
    riskLevel: 'medium',
    villageCodes: ['trieu-long', 'lang-vay'],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [106.645, 16.620],
        [106.656, 16.625],
        [106.660, 16.618],
        [106.653, 16.610],
        [106.642, 16.612],
        [106.638, 16.618],
        [106.645, 16.620],
      ]],
    },
    affectedAreaHa: 55,
    affectedPopulationEstimate: 390,
    lastAssessmentDate: '2026-05-15',
    warningMessage:
      'Khu vực trũng thấp Triệu Long – Làng Vây tích nước khi có lũ từ thượng nguồn, gây ngập úng cục bộ.',
    recommendedAction:
      'Nạo vét kênh mương, đảm bảo khả năng tiêu thoát. Cảnh báo sớm khi mưa trên 150mm/ngày.',
    status: 'monitoring',
    securityLevel: 'public',
    dataStatus: 'mock',
  },

  // ── Critical / Erosion Areas ───────────────────────────────────────────────

  {
    id: 'risk-07',
    code: 'XY-001',
    name: 'Khu xung yếu — Bờ sông Sê Pôn xói lở (Tân Kim)',
    riskType: 'erosion',
    riskLevel: 'high',
    villageCodes: ['tan-kim'],
    geometry: {
      type: 'Point',
      coordinates: [106.574, 16.647],
    },
    affectedAreaHa: 8,
    affectedPopulationEstimate: 45,
    lastAssessmentDate: '2026-06-20',
    warningMessage:
      'Bờ sông Sê Pôn bị xói lở nghiêm trọng, đe dọa nhà ở và ruộng vườn của các hộ ven sông.',
    recommendedAction:
      'Kè bờ sông khẩn cấp. Không canh tác trong phạm vi 10m từ mép nước.',
    status: 'active',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'risk-08',
    code: 'XY-002',
    name: 'Điểm xung yếu — Cầu tràn đường vào Ka Tăng',
    riskType: 'critical_area',
    riskLevel: 'low',
    villageCodes: ['ka-tang'],
    geometry: {
      type: 'Point',
      coordinates: [106.567, 16.631],
    },
    affectedAreaHa: 2,
    affectedPopulationEstimate: 0,
    lastAssessmentDate: '2026-04-05',
    warningMessage:
      'Cầu tràn vào thôn Ka Tăng có nguy cơ ngập và không thể qua lại khi lũ đạt mức báo động 2.',
    recommendedAction:
      'Lắp biển cảnh báo mực nước. Có phương án phao cứu sinh và đường vòng dự phòng.',
    status: 'monitoring',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
];
