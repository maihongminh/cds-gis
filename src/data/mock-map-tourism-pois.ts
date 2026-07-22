// src/data/mock-map-tourism-pois.ts
// Mock tourism POI and historical site data for Lao Bao GIS demo.
// dataStatus: "mock" — positions and descriptions are approximated for demo purposes.
// Do not assert legal/historical significance without verified sources.

import type { TourismPoi } from '@/types/map';

export const MOCK_TOURISM_POIS: TourismPoi[] = [
  // ── Historical Sites ──────────────────────────────────────────────────────
  {
    id: 'poi-01',
    code: 'LS-001',
    name: 'Di tích Làng Vây (Trận chiến 1968)',
    type: 'historical_site',
    villageCode: 'lang-vay',
    villageName: 'Làng Vây',
    coordinates: [106.655194, 16.612398],
    shortDescription:
      'Khu vực di tích lịch sử ghi dấu Trận Làng Vây năm 1968 trong kháng chiến chống Mỹ. Điểm giáo dục truyền thống yêu nước.',
    operatingStatus: 'open',
    openingHours: '07:00 – 17:00 (Thứ 2 – Chủ nhật)',
    contact: '0237 XXXX XXX',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
    linkedEntityType: 'tourism_site',
    linkedEntityId: 'ts-lang-vay-1968',
  },
  {
    id: 'poi-02',
    code: 'LS-002',
    name: 'Cột mốc biên giới Việt – Lào (Khu vực Ka Tăng)',
    type: 'historical_site',
    villageCode: 'ka-tang',
    villageName: 'Ka Tăng',
    coordinates: [106.573106, 16.6389],
    shortDescription:
      'Cột mốc phân định biên giới quốc gia Việt Nam – Lào tại khu vực thôn Ka Tăng, mang giá trị lịch sử và chủ quyền lãnh thổ.',
    operatingStatus: 'open',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'poi-03',
    code: 'LS-003',
    name: 'Nhà lưu niệm Đường 9 – Khe Sanh',
    type: 'historical_site',
    villageCode: 'trieu-phuoc',
    villageName: 'Triệu Phước',
    coordinates: [106.60118, 16.629771],
    shortDescription:
      'Điểm lưu niệm về chiến trường Đường 9 – Khe Sanh lịch sử, lưu trữ hiện vật và ảnh tư liệu kháng chiến.',
    operatingStatus: 'open',
    openingHours: '08:00 – 16:30 (Thứ 3 – Chủ nhật)',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1553342385-111fd6bc6ab3?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
    linkedEntityType: 'tourism_site',
    linkedEntityId: 'ts-dul-kg-1',
  },

  // ── Tourist Attractions ────────────────────────────────────────────────────
  {
    id: 'poi-04',
    code: 'DL-001',
    name: 'Khu kinh tế thương mại đặc biệt Lao Bảo',
    type: 'tourist_attraction',
    villageCode: 'trieu-phuoc',
    villageName: 'Triệu Phước',
    coordinates: [106.624983, 16.624471],
    shortDescription:
      'Khu kinh tế cửa khẩu quốc tế Lao Bảo — điểm thương mại sầm uất, cửa ngõ Việt – Lào trên Hành lang kinh tế Đông – Tây.',
    operatingStatus: 'open',
    openingHours: 'Mở cửa hàng ngày',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
    linkedEntityType: 'tourism_site',
    linkedEntityId: 'ts-kkt-lb-1',
  },
  {
    id: 'poi-05',
    code: 'DL-002',
    name: 'Suối nước khoáng Tân Thành',
    type: 'tourist_attraction',
    villageCode: 'tan-thanh',
    villageName: 'Tân Thành',
    coordinates: [106.642072, 16.66069],
    shortDescription:
      'Suối nước khoáng tự nhiên tại thôn Tân Thành, nước trong mát, có tiềm năng phát triển du lịch sinh thái nghỉ dưỡng.',
    operatingStatus: 'seasonal',
    openingHours: 'Mùa khô: 06:00 – 18:00',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'poi-06',
    code: 'DL-003',
    name: 'Rừng phòng hộ Ka Tăng (Trải nghiệm sinh thái)',
    type: 'tourist_attraction',
    villageCode: 'ka-tang',
    villageName: 'Ka Tăng',
    coordinates: [106.583176, 16.637428],
    shortDescription:
      'Khu rừng phòng hộ biên giới với nhiều loài thực vật quý hiếm, phù hợp trekking và trải nghiệm sinh thái cộng đồng.',
    operatingStatus: 'open',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'poi-07',
    code: 'DL-004',
    name: 'Hồ sinh thái Triệu Long',
    type: 'tourist_attraction',
    villageCode: 'trieu-long',
    villageName: 'Triệu Long',
    coordinates: [106.664348, 16.612987],
    shortDescription:
      'Hồ nước nhân tạo kết hợp nuôi trồng thủy sản và điểm ngắm cảnh thiên nhiên, thu hút du khách cuối tuần.',
    operatingStatus: 'open',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
  },

  // ── Scenic Spots ──────────────────────────────────────────────────────────
  {
    id: 'poi-08',
    code: 'DS-001',
    name: 'Đồi vọng cảnh biên giới (Ka Tăng)',
    type: 'scenic_spot',
    villageCode: 'ka-tang',
    villageName: 'Ka Tăng',
    coordinates: [106.582871, 16.633305],
    shortDescription:
      'Đỉnh đồi nhìn ra toàn cảnh vùng biên giới Việt – Lào, phong cảnh núi rừng hùng vĩ, đặc biệt đẹp vào buổi sáng sớm.',
    operatingStatus: 'open',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'poi-09',
    code: 'DS-002',
    name: 'Bờ sông Sê Pôn (Tân Kim)',
    type: 'scenic_spot',
    villageCode: 'tan-kim',
    villageName: 'Tân Kim',
    coordinates: [106.596603, 16.627416],
    shortDescription:
      'Đoạn sông Sê Pôn chảy qua thôn Tân Kim với bờ bãi cát mịn, phong cảnh bình yên và hệ sinh thái đất ngập nước ven sông.',
    operatingStatus: 'open',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
  },

  // ── Check-in Points ───────────────────────────────────────────────────────
  {
    id: 'poi-10',
    code: 'CI-001',
    name: 'Cổng chào Lao Bảo – Quảng Trị',
    type: 'check_in',
    villageCode: 'trieu-phuoc',
    villageName: 'Triệu Phước',
    coordinates: [106.607589, 16.637722],
    shortDescription:
      'Cổng chào mang biểu tượng Xã Lao Bảo, điểm chụp ảnh lưu niệm nổi tiếng với du khách.',
    operatingStatus: 'open',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
  {
    id: 'poi-11',
    code: 'CI-002',
    name: 'Quảng trường trung tâm xã Lao Bảo',
    type: 'check_in',
    villageCode: 'trieu-phuoc',
    villageName: 'Triệu Phước',
    coordinates: [106.614302, 16.617993],
    shortDescription:
      'Quảng trường trung tâm hành chính, nơi tổ chức các sự kiện văn hóa và lễ hội địa phương.',
    operatingStatus: 'open',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
  },

  // ── Local Product Points ──────────────────────────────────────────────────
  {
    id: 'poi-12',
    code: 'SP-001',
    name: 'Điểm trưng bày sản phẩm OCOP Lao Bảo',
    type: 'local_product_point',
    villageCode: 'trieu-phuoc',
    villageName: 'Triệu Phước',
    coordinates: [106.59996, 16.629183],
    shortDescription:
      'Điểm giới thiệu và bán sản phẩm OCOP địa phương: cà phê Lao Bảo, mật ong rừng, lâm sản ngoài gỗ và đặc sản vùng biên.',
    operatingStatus: 'open',
    openingHours: '07:00 – 19:00',
    contact: '0237 XXXX XXX',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
    linkedEntityType: 'tourism_site',
    linkedEntityId: 'ts-ocop-1',
  },
  {
    id: 'poi-13',
    code: 'SP-002',
    name: 'Làng nghề đan lát truyền thống Tây Chín',
    type: 'local_product_point',
    villageCode: 'tay-chin',
    villageName: 'Tây Chín',
    coordinates: [106.602706, 16.613576],
    shortDescription:
      'Làng nghề thủ công đan lát của đồng bào các dân tộc thiểu số — sản phẩm mây tre đan, túi thổ cẩm độc đáo.',
    operatingStatus: 'open',
    imagePlaceholder:
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=60',
    securityLevel: 'public',
    dataStatus: 'mock',
  },
];
