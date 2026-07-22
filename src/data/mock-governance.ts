// src/data/mock-governance.ts

import { SeededRandomHelper } from './seeded-random';
import { COMMUNE as LAOBAO_COMMUNE, VILLAGES } from './laobao-administrative-units';
import {
  DataGroup,
  SecurityLevel,
  FormTemplate,
  IndicatorDefinition,
  IndicatorValue,
  IndicatorCategory,
  ImportJob,
  ImportRowError,
  ExportJob,
  Notification,
  AdministrativeBoundary,
  MapLayer,
  SpatialFeature,
  LayerPermission,
  WorkflowStatus
} from '@/types';

const rng = new SeededRandomHelper(42);

// 1. GENERATE FORM TEMPLATES
export const MOCK_FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "temp-adm",
    title: "Biểu mẫu báo cáo dân số & lao động thôn",
    dataGroup: "administrative_population",
    schemaId: "schema-adm-pop",
    updateFrequency: "monthly",
    isActive: true,
    excelTemplateUrl: "/templates/Bieu_mau_Dan_so_Lao_dong.xlsx"
  },
  {
    id: "temp-eco",
    title: "Biểu mẫu thống kê doanh nghiệp & OCOP",
    dataGroup: "economy",
    schemaId: "schema-economy",
    updateFrequency: "quarterly",
    isActive: true,
    excelTemplateUrl: "/templates/Bieu_mau_Doanh_nghiep_OCOP.xlsx"
  },
  {
    id: "temp-tour",
    title: "Biểu mẫu cơ sở lưu trú & điểm du lịch",
    dataGroup: "tourism_services",
    schemaId: "schema-tourism",
    updateFrequency: "quarterly",
    isActive: true,
    excelTemplateUrl: "/templates/Bieu_mau_Du_lich_Dich_vu.xlsx"
  },
  {
    id: "temp-land",
    title: "Biểu mẫu báo cáo quy hoạch & xây dựng",
    dataGroup: "land_planning",
    schemaId: "schema-land",
    updateFrequency: "monthly",
    isActive: true,
    excelTemplateUrl: "/templates/Bieu_mau_Quy_hoach_Xay_dung.xlsx"
  },
  {
    id: "temp-agri",
    title: "Biểu mẫu nông nghiệp & hiện trạng môi trường",
    dataGroup: "agriculture_environment",
    schemaId: "schema-agri-env",
    updateFrequency: "monthly",
    isActive: true,
    excelTemplateUrl: "/templates/Bieu_mau_Nong_nghiep_Moi_truong.xlsx"
  },
  {
    id: "temp-edu",
    title: "Biểu mẫu giáo dục, trường lớp & trạm y tế",
    dataGroup: "education_health",
    schemaId: "schema-edu-health",
    updateFrequency: "yearly",
    isActive: true,
    excelTemplateUrl: "/templates/Bieu_mau_Giao_duc_Y_te.xlsx"
  },
  {
    id: "temp-welf",
    title: "Biểu mẫu thống kê hộ nghèo & an sinh xã hội",
    dataGroup: "social_welfare",
    schemaId: "schema-welfare",
    updateFrequency: "monthly",
    isActive: true,
    excelTemplateUrl: "/templates/Bieu_mau_An_sinh_Xa_hoi.xlsx"
  },
  {
    id: "temp-sec",
    title: "Biểu mẫu thống kê an ninh trật tự & tuyển quân",
    dataGroup: "security_defense",
    schemaId: "schema-sec-def",
    updateFrequency: "onChange",
    isActive: true,
    excelTemplateUrl: "/templates/Bieu_mau_Quoc_phong_An_ninh.xlsx"
  },
  {
    id: "temp-dis",
    title: "Biểu mẫu phòng chống thiên tai & vật tư 4 tại chỗ",
    dataGroup: "disaster_emergency",
    schemaId: "schema-disaster",
    updateFrequency: "monthly",
    isActive: true,
    excelTemplateUrl: "/templates/Bieu_mau_Thien_tai_Khan_cap.xlsx"
  }
];

// 2. GENERATE 62 INDICATORS DEFINITIONS
const dataGroupsList: DataGroup[] = [
  "administrative_population", "economy", "tourism_services", "land_planning",
  "agriculture_environment", "education_health", "social_welfare", "security_defense", "disaster_emergency"
];

const indicatorNames: { category: IndicatorCategory; name: string; unit: string; group: DataGroup }[] = [
  // 1-10: Administrative & Population
  { category: "socioEconomicPlan", name: "Tổng dân số thường trú", unit: "người", group: "administrative_population" },
  { category: "socioEconomicPlan", name: "Tổng số hộ gia đình thường trú", unit: "hộ", group: "administrative_population" },
  { category: "socioEconomicPlan", name: "Tỷ lệ tăng dân số tự nhiên", unit: "%", group: "administrative_population" },
  { category: "dailyMonthly", name: "Số nhân khẩu tạm trú mới trong tháng", unit: "người", group: "administrative_population" },
  { category: "dailyMonthly", name: "Số nhân khẩu khai báo tạm vắng trong tháng", unit: "người", group: "administrative_population" },
  { category: "socioEconomicPlan", name: "Tỷ lệ dân tộc thiểu số", unit: "%", group: "administrative_population" },
  { category: "socioEconomicPlan", name: "Số lao động trong độ tuổi có việc làm", unit: "người", group: "administrative_population" },
  { category: "socioEconomicPlan", name: "Tỷ lệ lao động qua đào tạo", unit: "%", group: "administrative_population" },
  { category: "assignedTasks", name: "Số hồ sơ thủ tục hành chính tiếp nhận", unit: "hồ sơ", group: "administrative_population" },
  { category: "assignedTasks", name: "Tỷ lệ giải quyết hồ sơ đúng hạn", unit: "%", group: "administrative_population" },

  // 11-20: Economy
  { category: "socioEconomicPlan", name: "Tốc độ tăng trưởng sản xuất", unit: "%", group: "economy" },
  { category: "socioEconomicPlan", name: "Tổng giá trị sản xuất trên địa bàn", unit: "tỷ VND", group: "economy" },
  { category: "socioEconomicPlan", name: "Thu ngân sách nhà nước trên địa bàn", unit: "triệu VND", group: "economy" },
  { category: "socioEconomicPlan", name: "Chi ngân sách địa phương", unit: "triệu VND", group: "economy" },
  { category: "socioEconomicPlan", name: "Số lượng doanh nghiệp đang hoạt động", unit: "doanh nghiệp", group: "economy" },
  { category: "socioEconomicPlan", name: "Số hợp tác xã và tổ hợp tác hoạt động hiệu quả", unit: "đơn vị", group: "economy" },
  { category: "socioEconomicPlan", name: "Số lượng sản phẩm OCOP đạt 3 sao trở lên", unit: "sản phẩm", group: "economy" },
  { category: "assignedTasks", name: "Tỷ lệ giải ngân vốn đầu tư công", unit: "%", group: "economy" },
  { category: "socioEconomicPlan", name: "Thu nhập bình quân đầu người", unit: "triệu VND/năm", group: "economy" },
  { category: "dailyMonthly", name: "Số lượt giao dịch tại Cửa khẩu Quốc tế Lao Bảo", unit: "lượt", group: "economy" },

  // 21-27: Tourism & Services
  { category: "socioEconomicPlan", name: "Tổng lượt khách du lịch đến địa bàn", unit: "lượt khách", group: "tourism_services" },
  { category: "socioEconomicPlan", name: "Doanh thu dịch vụ du lịch thương mại", unit: "triệu VND", group: "tourism_services" },
  { category: "socioEconomicPlan", name: "Số lượng cơ sở kinh doanh lưu trú", unit: "cơ sở", group: "tourism_services" },
  { category: "socioEconomicPlan", name: "Số di tích lịch sử văn hóa được bảo tồn", unit: "di tích", group: "tourism_services" },
  { category: "dailyMonthly", name: "Lượng tin tức quảng bá thương mại phát hành", unit: "tin bài", group: "tourism_services" },
  { category: "socioEconomicPlan", name: "Số hộ kinh doanh cá thể ngành dịch vụ", unit: "hộ", group: "tourism_services" },
  { category: "assignedTasks", name: "Số chương trình xúc tiến thương mại du lịch tổ chức", unit: "chương trình", group: "tourism_services" },

  // 28-34: Land & Infrastructure
  { category: "socioEconomicPlan", name: "Tỷ lệ đất ở nông thôn được cấp GCN", unit: "%", group: "land_planning" },
  { category: "socioEconomicPlan", name: "Tỷ lệ phủ kín quy hoạch chi tiết thôn", unit: "%", group: "land_planning" },
  { category: "assignedTasks", name: "Số giấy phép xây dựng nhà ở cấp trong kỳ", unit: "giấy phép", group: "land_planning" },
  { category: "socioEconomicPlan", name: "Tỷ lệ hộ sử dụng điện lưới quốc gia", unit: "%", group: "land_planning" },
  { category: "socioEconomicPlan", name: "Tỷ lệ cứng hóa đường giao thông nông thôn", unit: "%", group: "land_planning" },
  { category: "assignedTasks", name: "Số dự án đầu tư hạ tầng kỹ thuật đang thi công", unit: "dự án", group: "land_planning" },
  { category: "emergency", name: "Số điểm nguy cơ sụt lún hành lang giao thông", unit: "điểm", group: "land_planning" },

  // 35-42: Agriculture & Environment
  { category: "socioEconomicPlan", name: "Tổng diện tích gieo trồng cây hàng năm", unit: "ha", group: "agriculture_environment" },
  { category: "socioEconomicPlan", name: "Tổng sản lượng cây có hạt (ngô, lúa)", unit: "tấn", group: "agriculture_environment" },
  { category: "socioEconomicPlan", name: "Tổng đàn gia súc gia cầm trên địa bàn", unit: "con", group: "agriculture_environment" },
  { category: "socioEconomicPlan", name: "Tỷ lệ thu gom rác thải sinh hoạt", unit: "%", group: "agriculture_environment" },
  { category: "socioEconomicPlan", name: "Tỷ lệ hộ thực hiện phân loại rác tại nguồn", unit: "%", group: "agriculture_environment" },
  { category: "assignedTasks", name: "Số giấy phép môi trường được cấp mới", unit: "giấy phép", group: "agriculture_environment" },
  { category: "assignedTasks", name: "Số cuộc thanh tra kiểm tra bảo vệ môi trường", unit: "cuộc", group: "agriculture_environment" },
  { category: "dailyMonthly", name: "Khối lượng chất thải rắn phát sinh trung bình ngày", unit: "tấn/ngày", group: "agriculture_environment" },

  // 43-49: Education & Health
  { category: "socioEconomicPlan", name: "Tỷ lệ trường học đạt chuẩn quốc gia", unit: "%", group: "education_health" },
  { category: "socioEconomicPlan", name: "Tỷ lệ huy động trẻ em đi học đúng tuổi", unit: "%", group: "education_health" },
  { category: "socioEconomicPlan", name: "Tỷ lệ người dân tham gia BHYT tự nguyện", unit: "%", group: "education_health" },
  { category: "socioEconomicPlan", name: "Tỷ lệ trẻ em dưới 5 tuổi suy dinh dưỡng", unit: "%", group: "education_health" },
  { category: "dailyMonthly", name: "Số lượt khám chữa bệnh tại trạm y tế xã trong tháng", unit: "lượt", group: "education_health" },
  { category: "socioEconomicPlan", name: "Tỷ lệ tiêm chủng đầy đủ cho trẻ em dưới 1 tuổi", unit: "%", group: "education_health" },
  { category: "assignedTasks", name: "Số hoạt động truyền thông sức khỏe học đường", unit: "buổi", group: "education_health" },

  // 50-55: Social Welfare
  { category: "socioEconomicPlan", name: "Tỷ lệ hộ nghèo đa chiều", unit: "%", group: "social_welfare" },
  { category: "socioEconomicPlan", name: "Tỷ lệ hộ cận nghèo", unit: "%", group: "social_welfare" },
  { category: "socioEconomicPlan", name: "Số nhà tạm, nhà dột nát đã xóa", unit: "nhà", group: "social_welfare" },
  { category: "socioEconomicPlan", name: "Số đối tượng nhận trợ cấp bảo trợ xã hội", unit: "người", group: "social_welfare" },
  { category: "assignedTasks", name: "Kinh phí hỗ trợ người nghèo giải ngân trong kỳ", unit: "triệu VND", group: "social_welfare" },
  { category: "assignedTasks", name: "Số suất quà hỗ trợ gia đình chính sách dịp lễ tết", unit: "suất", group: "social_welfare" },

  // 56-59: Security & Defense (Confidential)
  { category: "socioEconomicPlan", name: "Tỷ lệ thanh niên khám nghĩa vụ quân sự đạt yêu cầu", unit: "%", group: "security_defense" },
  { category: "socioEconomicPlan", name: "Số lượng lực lượng dân quân tự vệ nòng cốt", unit: "chiến sĩ", group: "security_defense" },
  { category: "dailyMonthly", name: "Số vụ vi phạm trật tự an toàn xã hội xảy ra", unit: "vụ", group: "security_defense" },
  { category: "assignedTasks", name: "Số đợt tuần tra kiểm soát biên giới liên ngành", unit: "lượt", group: "security_defense" },

  // 60-62: Disaster Prevention
  { category: "emergency", name: "Số vụ thiên tai lũ quét, sạt lở ghi nhận", unit: "vụ", group: "disaster_emergency" },
  { category: "emergency", name: "Số điểm xung yếu có nguy cơ sạt lở cao", unit: "điểm", group: "disaster_emergency" },
  { category: "emergency", name: "Tỷ lệ chuẩn bị dự trữ vật tư phòng chống bão lụt", unit: "%", group: "disaster_emergency" },
];

export const MOCK_INDICATOR_DEFINITIONS: IndicatorDefinition[] = indicatorNames.map((item, idx) => {
  const code = `IND-${String(idx + 1).padStart(3, '0')}`;
  const isConfidential = item.group === "security_defense";
  return {
    id: `ind-def-${idx + 1}`,
    code,
    name: item.name,
    category: item.category,
    unit: item.unit,
    description: `Chỉ số đo lường hiệu quả hoạt động: ${item.name} cấp xã.`,
    frequency: item.category === "dailyMonthly" ? "monthly" : "yearly",
    reportingUnit: item.group === "security_defense" ? "unit-police" : item.group === "economy" ? "unit-eco" : "unit-ubnd",
    databaseCatalog: `catalog-${item.group}`,
    databaseOwner: "VanPhongUBND",
    securityLevel: isConfidential ? "confidential" : "public"
  };
});

// 3. GENERATE INDICATOR VALUES (Monthly values for 2026)
export const MOCK_INDICATOR_VALUES: IndicatorValue[] = [];
let valId = 1;

MOCK_INDICATOR_DEFINITIONS.forEach((def, idx) => {
  // We generate values for two periods: "2025" (past value) and "2026-M06" (current value)
  const isPercent = def.unit === "%";
  
  // Base values
  let baseVal = 0;
  let targetVal = 0;
  if (isPercent) {
    baseVal = rng.range(60, 92);
    targetVal = rng.range(baseVal, 98);
  } else if (def.unit === "người" || def.unit === "hộ" || def.unit === "lượt khách" || def.unit === "lượt") {
    if (def.name.includes("Tổng dân số")) {
      baseVal = 23135;
      targetVal = 23500;
    } else if (def.name.includes("Tổng số hộ")) {
      baseVal = 5445;
      targetVal = 5500;
    } else {
      baseVal = rng.range(500, 3000);
      targetVal = Math.round(baseVal * 1.05);
    }
  } else if (def.unit.includes("tỷ") || def.unit.includes("triệu")) {
    baseVal = rng.range(100, 8000);
    targetVal = Math.round(baseVal * 1.08);
  } else {
    baseVal = rng.range(5, 100);
    targetVal = Math.round(baseVal * 1.1);
  }

  // Value for previous year 2025
  MOCK_INDICATOR_VALUES.push({
    id: `ind-val-${valId++}`,
    indicatorCode: def.code,
    period: "2025",
    currentValue: Math.round(baseVal * 0.95),
    targetValue: baseVal,
    previousValue: Math.round(baseVal * 0.9),
    status: "on_track",
    lastUpdatedAt: "2025-12-31T23:59:59Z"
  });

  // Value for active monitoring period 2026-M06
  const statusChance = rng.range(1, 100);
  const status: "on_track" | "warning" | "critical" = statusChance > 85 ? "critical" : statusChance > 70 ? "warning" : "on_track";
  let actualVal = baseVal;
  if (status === "warning") actualVal = Math.round(targetVal * 0.9);
  else if (status === "critical") actualVal = Math.round(targetVal * 0.8);

  MOCK_INDICATOR_VALUES.push({
    id: `ind-val-${valId++}`,
    indicatorCode: def.code,
    period: "2026-M06",
    currentValue: actualVal,
    targetValue: targetVal,
    previousValue: Math.round(baseVal * 0.95),
    status,
    lastUpdatedAt: "2026-06-30T17:00:00Z"
  });
});

// 4. GENERATE IMPORT JOBS
export const MOCK_IMPORT_JOBS: ImportJob[] = [];
for (let i = 1; i <= 15; i++) {
  const dataGroup = rng.element(dataGroupsList);
  const total = rng.range(50, 300);
  const statusVal = rng.boolean(0.85) ? "success" as const : "failed" as const;
  const success = statusVal === "success" ? total : total - rng.range(1, 10);
  const failed = total - success;

  const errors: ImportRowError[] = [];
  if (failed > 0) {
    for (let e = 1; e <= failed; e++) {
      errors.push({
        rowNumber: rng.range(2, total),
        columnName: rng.element(["ma_dinh_danh", "ho_ten", "dien_tich_ha", "toa_do"]),
        errorMessage: rng.element([
          "Trường bắt buộc không được để trống",
          "Giá trị số vượt mức cho phép",
          "Định dạng mã không hợp lệ",
          "Thôn không khớp danh mục hành chính Lao Bảo"
        ])
      });
    }
  }

  MOCK_IMPORT_JOBS.push({
    id: `job-import-${i}`,
    dataGroup,
    fileName: `danh_sach_nhap_lieu_${dataGroup}_dong_${i}.xlsx`,
    startedAt: `2026-06-${String(rng.range(1, 30)).padStart(2, '0')}T08:00:00Z`,
    completedAt: `2026-06-${String(rng.range(1, 30)).padStart(2, '0')}T08:02:15Z`,
    totalRows: total,
    successRows: success,
    failedRows: failed,
    status: statusVal,
    errors
  });
}
// Sort by start date descending
MOCK_IMPORT_JOBS.sort((a, b) => b.startedAt.localeCompare(a.startedAt));

// 5. GENERATE EXPORT JOBS
export const MOCK_EXPORT_JOBS: ExportJob[] = [];
const formatList: ("xlsx" | "csv" | "pdf")[] = ["xlsx", "csv", "pdf"];
const exporters = ["Nguyễn Văn Trị", "Hồ Văn Đang", "Lê Hoàng Việt"];

for (let i = 1; i <= 20; i++) {
  const format = rng.element(formatList);
  const requester = rng.element(exporters);
  const dataGroup = rng.element(dataGroupsList);

  MOCK_EXPORT_JOBS.push({
    id: `job-export-${i}`,
    requestedBy: requester,
    requestedAt: `2026-06-${String(rng.range(1, 30)).padStart(2, '0')}T14:30:00Z`,
    filtersUsed: {
      dataGroup,
      villageCode: rng.boolean(0.5) ? rng.element(VILLAGES).code : "all",
      status: "published"
    },
    format,
    downloadUrl: `/downloads/export_${dataGroup}_${2026}.${format}`,
    status: "completed"
  });
}
MOCK_EXPORT_JOBS.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

// 6. GENERATE ADMINISTRATIVE BOUNDARIES (MOCK FOR LAO BAO)
// Based on coordinate: center = [106.6000, 16.6333]
export const MOCK_ADMIN_BOUNDARIES: AdministrativeBoundary[] = [
  {
    code: LAOBAO_COMMUNE.code,
    name: LAOBAO_COMMUNE.name,
    type: "commune",
    areaHa: LAOBAO_COMMUNE.areaHa,
    centerCoordinate: [16.6333, 106.6000],
    geometryGeoJson: {
      type: "Polygon",
      coordinates: [
        [
          [106.560, 16.660],
          [106.640, 16.660],
          [106.650, 16.610],
          [106.570, 16.590],
          [106.560, 16.660]
        ]
      ]
    },
    disclaimer: "Ranh giới hành chính xã Lao Bảo mang tính chất mô phỏng hiển thị trực quan FE mockup, không có giá trị pháp lý chính thức."
  },
  ...VILLAGES.map((v) => {
    const lat = v.center ? v.center[1] : 16.6333;
    const lng = v.center ? v.center[0] : 106.6000;
    // Generate dummy square around center coordinate for village polygon
    const delta = 0.008;
    return {
      code: v.code,
      name: v.name,
      type: "village" as const,
      areaHa: v.areaHa,
      centerCoordinate: [lat, lng] as [number, number],
      geometryGeoJson: {
        type: "Polygon",
        coordinates: [
          [
            [lng - delta, lat + delta],
            [lng + delta, lat + delta],
            [lng + delta, lat - delta],
            [lng - delta, lat - delta],
            [lng - delta, lat + delta]
          ]
        ]
      },
      disclaimer: `Ranh giới thôn ${v.name} mô phỏng phục vụ FE mockup.`
    };
  })
];

// 7. GENERATE MAP LAYERS
export const MOCK_MAP_LAYERS: MapLayer[] = [
  {
    id: "layer-boundary-commune",
    name: "Ranh giới xã Lao Bảo",
    dataGroup: "administrative_population",
    geometryType: "polygon",
    order: 1,
    visibleByDefault: true,
    styleConfig: { color: "#3b82f6", weight: 3, fillOpacity: 0.05 },
    securityLevel: "public"
  },
  {
    id: "layer-boundary-villages",
    name: "Ranh giới Thôn",
    dataGroup: "administrative_population",
    geometryType: "polygon",
    order: 2,
    visibleByDefault: true,
    styleConfig: { color: "#10b981", weight: 1.5, fillOpacity: 0.1, dashArray: "5, 5" },
    securityLevel: "public"
  },
  {
    id: "layer-water-resources",
    name: "Công trình nước & giếng khoan",
    dataGroup: "water_resources" as any, // mapping to agricultural-env data group for schema
    geometryType: "point",
    order: 3,
    visibleByDefault: false,
    styleConfig: { icon: "droplet", markerColor: "blue" },
    securityLevel: "public"
  },
  {
    id: "layer-infrastructure-roads",
    name: "Mạng lưới Giao thông đường bộ",
    dataGroup: "land_planning",
    geometryType: "line",
    order: 4,
    visibleByDefault: false,
    styleConfig: { color: "#f97316", weight: 2 },
    securityLevel: "public"
  },
  {
    id: "layer-land-plots",
    name: "Thửa đất canh tác & Đất ở",
    dataGroup: "land_planning",
    geometryType: "polygon",
    order: 5,
    visibleByDefault: false,
    styleConfig: { color: "#eab308", weight: 1, fillOpacity: 0.2 },
    securityLevel: "shared"
  },
  {
    id: "layer-defense-areas",
    name: "Địa bàn Quốc phòng & Công trình Biên giới",
    dataGroup: "security_defense",
    geometryType: "polygon",
    order: 6,
    visibleByDefault: false,
    styleConfig: { color: "#ef4444", weight: 2, fillOpacity: 0.3, dashArray: "3, 3" },
    securityLevel: "confidential"
  }
];

// 8. GENERATE SPATIAL FEATURES LINKED TO ENTERPRISES / LANDS
export const MOCK_SPATIAL_FEATURES: SpatialFeature[] = [];
let featId = 1;

// Generate point features for water facilities and businesses
VILLAGES.forEach((v) => {
  const lat = v.center ? v.center[1] : 16.6333;
  const lng = v.center ? v.center[0] : 106.6000;

  // Add water facility point
  MOCK_SPATIAL_FEATURES.push({
    id: `feat-${featId++}`,
    layerId: "layer-water-resources",
    name: `Trạm cấp nước tự chảy thôn ${v.name}`,
    geometryGeoJson: {
      type: "Point",
      coordinates: [lng + 0.002, lat - 0.003]
    },
    linkedEntityType: "waterFacility",
    linkedEntityId: `wf-${v.code}`,
    properties: {
      capacity: "150 m3/ngày",
      servedHouseholds: v.householdCount - rng.range(50, 100),
      status: "active"
    }
  });

  // Add road line feature
  MOCK_SPATIAL_FEATURES.push({
    id: `feat-${featId++}`,
    layerId: "layer-infrastructure-roads",
    name: `Tuyến đường liên thôn ${v.name}`,
    geometryGeoJson: {
      type: "LineString",
      coordinates: [
        [lng - 0.005, lat - 0.005],
        [lng, lat],
        [lng + 0.005, lat + 0.005]
      ]
    },
    linkedEntityType: "road",
    linkedEntityId: `road-${v.code}`,
    properties: {
      lengthKm: 1.8,
      surfaceType: "concrete",
      condition: "good"
    }
  });
});

// 9. LAYER PERMISSIONS
export const MOCK_LAYER_PERMISSIONS: LayerPermission[] = [
  {
    layerId: "layer-boundary-commune",
    allowedRoles: ["admin", "data_officer", "unit_leader", "data_governance", "commune_leader"],
    maxSecurityLevel: "public"
  },
  {
    layerId: "layer-boundary-villages",
    allowedRoles: ["admin", "data_officer", "unit_leader", "data_governance", "commune_leader"],
    maxSecurityLevel: "public"
  },
  {
    layerId: "layer-water-resources",
    allowedRoles: ["admin", "data_officer", "unit_leader", "data_governance", "commune_leader"],
    maxSecurityLevel: "public"
  },
  {
    layerId: "layer-infrastructure-roads",
    allowedRoles: ["admin", "data_officer", "unit_leader", "data_governance", "commune_leader"],
    maxSecurityLevel: "public"
  },
  {
    layerId: "layer-land-plots",
    allowedRoles: ["admin", "data_officer", "unit_leader", "data_governance", "commune_leader"],
    maxSecurityLevel: "shared"
  },
  {
    layerId: "layer-defense-areas",
    allowedRoles: ["admin", "data_governance", "commune_leader"],
    maxSecurityLevel: "confidential"
  }
];

// 10. GENERATE NOTIFICATIONS
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    userId: "user-admin",
    title: "Yêu cầu duyệt dữ liệu mới",
    content: "Cán bộ thôn Ka Tăng vừa gửi báo cáo rác thải tháng 06/2026 chờ phê duyệt.",
    type: "info",
    isRead: false,
    createdAt: "2026-07-13T08:30:00Z",
    relatedEntityId: "sub-1",
    relatedEntityType: "dataSubmission"
  },
  {
    id: "notif-2",
    userId: "user-governance",
    title: "Cảnh báo chỉ số vượt ngưỡng",
    content: "Tỷ lệ xử lý rác thải tại Thôn Khe Đá đang giảm mạnh so với chỉ tiêu kế hoạch năm.",
    type: "warning",
    isRead: false,
    createdAt: "2026-07-12T14:15:00Z",
    relatedEntityId: "IND-038",
    relatedEntityType: "indicator"
  },
  {
    id: "notif-3",
    userId: "user-leader",
    title: "Sự cố chia cắt giao thông mới",
    content: "Sạt lở nghiêm trọng trên tuyến đường đi Thôn Lào Bảo Trong gây ách tắc giao thông.",
    type: "critical",
    isRead: true,
    createdAt: "2026-07-10T16:45:00Z",
    relatedEntityId: "disrupt-1",
    relatedEntityType: "trafficDisruption"
  }
];

// 11. CENTRAL MOCK DATA GETTER FOR DATA WORKFLOWS
export function getIndicatorSummary() {
  const planIndicators = MOCK_INDICATOR_DEFINITIONS.filter(d => d.category === "socioEconomicPlan");
  const onTrack = MOCK_INDICATOR_VALUES.filter(v => v.period === "2026-M06" && v.status === "on_track").length;
  const warning = MOCK_INDICATOR_VALUES.filter(v => v.period === "2026-M06" && v.status === "warning").length;
  const critical = MOCK_INDICATOR_VALUES.filter(v => v.period === "2026-M06" && v.status === "critical").length;

  return {
    totalIndicators: MOCK_INDICATOR_DEFINITIONS.length,
    planIndicatorsCount: planIndicators.length,
    onTrack,
    warning,
    critical,
  };
}
