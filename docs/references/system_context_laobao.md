# TÀI LIỆU KHẢO SÁT & ĐÓNG GÓI BỐI CẢNH TOÀN BỘ MÃ NGUỒN HIỆN TẠI (SYSTEM CONTEXT SNAPSHOT)

Tài liệu này đóng gói và đặc tả toàn bộ bối cảnh mã nguồn hiện tại của dự án (được clone từ Hệ thống dữ liệu Kinh tế - Xã hội xã Trà Tập). Tài liệu được viết chi tiết, chính xác dựa trên việc quét thực tế mã nguồn, không suy đoán, nhằm mục đích làm dữ liệu đầu vào (system context) gửi cho các LLM khác (như ChatGPT) kết hợp với các yêu cầu mới.

---

## 1. THÔNG TIN CÔNG NGHỆ CHỦ ĐẠO (TECH STACK)
*   **Framework**: Next.js v16.2.6 (sử dụng cấu trúc App Router).
*   **Thư viện UI chính**: React v19.2.3, React DOM v19.2.3.
*   **Kiểu dữ liệu**: TypeScript v5 (Strict mode).
*   **CSS & Styling**: Tailwind CSS v4, sử dụng `@tailwindcss/postcss` và cấu trúc OKLCH color space trong globals.css.
*   **Icons**: `lucide-react` v0.575.0.
*   **Theme**: `next-themes` v0.4.6 hỗ trợ đồng bộ Light/Dark Mode.
*   **Xử lý API (Future)**: `@tanstack/react-query` v5.90.21 và `axios` v1.13.5 (Đã có sẵn hooks nhưng các trang giao diện hiện tại chủ yếu đọc dữ liệu từ Mock).
*   **Môi trường chạy**: Tương thích deploy lên Cloudflare Workers/Pages qua `@opennextjs/cloudflare` v1.19.11 và `wrangler` v4.86.0.
    *   Tập tin cấu hình: [wrangler.toml](file:///d:/Git/cds-demo/laobao/wrangler.toml)
    *   Workers Name: `laobao`
    *   Production URL: `https://laobao.windify.workers.dev`

---

## 2. CẤU TRÚC THƯ MỤC VÀ TẬP TIN CỐT LÕI
```
laobao/
├── public/                          # Static assets (logo.png, favicon...)
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── globals.css              # Custom Tailwind v4 tokens & styles
│   │   ├── layout.tsx               # Root Layout & Providers (ThemeProvider, ApiProvider)
│   │   ├── page.tsx                 # Landing Page (Giới thiệu chung)
│   │   ├── login/                   # Trang đăng nhập demo
│   │   └── dashboard/               # Trang quản trị chính (phân quyền RBAC)
│   ├── components/
│   │   ├── common/                  # Component dùng chung (DataTable, MetricCard, PageHeader...)
│   │   ├── layout/                  # AppSidebar, DashboardHeader, Context Providers
│   │   └── ui/                      # shadcn/ui primitives gốc
│   ├── data/                        # Mock database & bộ sinh dữ liệu ngẫu nhiên hạt giống (Seed = 42)
│   ├── types/                       # Khai báo kiểu dữ liệu TypeScript cho toàn bộ thực thể
│   ├── hooks/                       # Thư viện React Hooks gọi API (dành cho tích hợp API tương lai)
│   └── lib/                         # Cấu hình app, RBAC logic, axios client, utils (cn)
```

---

## 3. ĐẶC TẢ CHI TIẾT TYPES DỮ LIỆU CHÍNH (TYPES SPECIFICATION)

Toàn bộ các thực thể được định nghĩa bằng các interfaces TypeScript nghiêm ngặt tại thư mục `src/types/`. Dưới đây là đặc tả chi tiết của từng thực thể để tránh bị lệch cấu trúc dữ liệu khi code tính năng mới:

### 3.1. Hộ dân (`src/types/household.ts`)
```typescript
export type EconomicClassification = 'poor' | 'nearPoor' | 'average' | 'betterOff';
export type HouseholdStatus = 'active' | 'changed' | 'archived';

export interface Household {
  id: string;
  code: string; // HH-30-XXX
  headName: string;
  identityNumber: string; // CCCD
  phone: string;
  hamletCode: string;
  hamletName: string;
  ethnicity: string;
  localGroup?: string;
  memberCount: number;
  agriculturalLaborCount: number;
  establishedYear: number;
  economicClassification: EconomicClassification;
  mainCropTypes: string[];
  livestockTypes: string[];
  totalLandAreaHa: number;
  totalAnnualIncome: number;
  totalAnnualCost: number;
  netAnnualIncome: number;
  incomePerCapita: number;
  status: HouseholdStatus;
  createdAt: string;
  updatedAt: string;
}
```

### 3.2. Đất đai (`src/types/land.ts`)
```typescript
export type LandOwnershipType = 'household' | 'communal' | 'rented' | 'other';
export type LandCertificateStatus = 'granted' | 'pending' | 'none';
export type LandRecordStatus = 'active' | 'inactive';

export interface LandRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  landTypeCode: string; // dat-o-nong-thon | dat-lua-ray | dat-cay-lau-nam | dat-rung-san-xuat | dat-rung-phong-ho
  landTypeName: string;
  parcelCode: string;
  mapSheetNumber?: string;
  areaHa: number;
  ownershipType: LandOwnershipType;
  certificateStatus: LandCertificateStatus;
  certificateNumber?: string;
  purpose: string;
  status: LandRecordStatus;
  createdAt: string;
  updatedAt: string;
}
```

### 3.3. Cây trồng (`src/types/crop.ts` & `src/types/crop-change.ts`)
```typescript
export type CropDiseaseStatus = 'none' | 'monitoring' | 'treated';
export type CropRecordStatus = 'active' | 'inactive';

export interface CropRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  cropTypeCode: string;
  cropTypeName: string;
  areaHa: number;
  plantingYear: number;
  seasonYear: string;
  cultivationMethod: string;
  harvestOutputKg: number;
  salePrice: number;
  salesChannel: string;
  growingAreaCode?: string;
  diseaseStatus: CropDiseaseStatus;
  status: CropRecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CropChangeReason =
  | 'cropConversion'
  | 'naturalDisaster'
  | 'disease'
  | 'poorHarvest'
  | 'marketChange'
  | 'landChange'
  | 'other';

export interface CropChangeRecord {
  id: string;
  cropRecordId: string;
  householdId: string;
  villageCode: string;
  villageName: string;
  cropTypeCode: string;
  cropTypeName: string;
  year: number;
  period: string; // e.g. "2025-DH", "2026-XH"
  previousAreaHa: number;
  currentAreaHa: number;
  areaChangeHa: number;
  previousOutputKg: number;
  currentOutputKg: number;
  outputChangeKg: number;
  changePercent: number;
  reason: CropChangeReason;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3.4. Chăn nuôi (`src/types/livestock.ts`)
```typescript
export type LivestockDiseaseStatus = 'none' | 'monitoring' | 'quarantined' | 'treated';
export type LivestockRecordStatus = 'active' | 'inactive';

export interface LivestockRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  livestockTypeCode: string;
  livestockTypeName: string;
  quantity: number;
  vaccinatedQuantity: number;
  lastVaccinatedDate?: string;
  diseaseQuantity: number;
  diseaseType?: string;
  diseaseStatus: LivestockDiseaseStatus;
  notes?: string;
  status: LivestockRecordStatus;
  createdAt: string;
  updatedAt: string;
}
```

### 3.5. Lâm nghiệp & DVMTR (`src/types/forest-dvmtr.ts`)
```typescript
export type ForestDvmtrPaymentStatus = 'paid' | 'partially_paid' | 'pending';
export type ForestDvmtrRecordStatus = 'active' | 'inactive';

export interface ForestDvmtrRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  contractCode: string; // HĐ-BVR-30-XXX
  forestBlock: string;
  contractedAreaHa: number;
  paymentRatePerHa: number;
  totalAmount: number;
  paymentYear: number;
  paymentStatus: ForestDvmtrPaymentStatus;
  paymentDate?: string;
  status: ForestDvmtrRecordStatus;
  createdAt: string;
  updatedAt: string;
}
```

### 3.6. Kinh tế hộ (`src/types/household-economy.ts`)
```typescript
export interface HouseholdEconomyRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  year: number;
  cropRevenue: number;
  livestockRevenue: number;
  forestDvmtrRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
  cropCost: number;
  livestockCost: number;
  forestDvmtrCost: number;
  otherCost: number;
  totalCost: number;
  netIncome: number;
  incomePerCapita: number;
  economicClassificationBefore: 'poor' | 'nearPoor' | 'average' | 'betterOff';
  economicClassificationAfter: 'poor' | 'nearPoor' | 'average' | 'betterOff';
  supportPoliciesReceived: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
```

### 3.7. Môi trường (`src/types/environment.ts`)
Bao gồm quản lý rác thải sinh hoạt, phân loại rác, giấy phép cam kết, đơn khiếu nại, xử phạt, tập huấn:
```typescript
export interface WasteRecord {
  id: string;
  villageCode: string;
  villageName: string;
  year: number;
  month: number;
  totalWasteTons: number;
  organicWasteTons: number;
  inorganicWasteTons: number;
  hazardousWasteTons: number;
  collectedTons: number;
  note?: string;
}

export interface WasteClassificationRecord {
  id: string;
  villageCode: string;
  villageName: string;
  householdCount: number;
  classifiedCount: number;
  notClassifiedCount: number;
  year: number;
  month: number;
}

export interface WasteTreatmentHouseholdRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  treatmentMethod: 'centralized' | 'selfTreatmentOrganic' | 'bury' | 'burn' | 'other';
  hasClassification: boolean;
  registeredDate: string;
}

export interface EnvironmentRegistrationRecord {
  id: string;
  businessName: string;
  ownerName: string;
  villageCode: string;
  villageName: string;
  businessType: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  officerInCharge: string;
}

export interface EnvironmentPermit {
  id: string;
  permitNumber: string;
  businessName: string;
  villageCode: string;
  villageName: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface EnvironmentViolation {
  id: string;
  violationCode: string;
  offenderName: string;
  violationType: string;
  villageCode: string;
  villageName: string;
  recordedDate: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'resolved' | 'processing';
}

export interface EnvironmentComplaint {
  id: string;
  complaintCode: string;
  complainantName: string;
  villageCode: string;
  villageName: string;
  description: string;
  receivedDate: string;
  status: 'received' | 'processing' | 'resolved';
  resolutionNote?: string;
  dueDate: string;
}

export interface EnvironmentPenalty {
  id: string;
  penaltyNumber: string;
  offenderName: string;
  violationId: string;
  fineAmountVnd: number;
  paymentStatus: 'paid' | 'unpaid';
  issueDate: string;
}

export interface EnvironmentTraining {
  id: string;
  topic: string;
  trainingDate: string;
  location: string;
  attendeeTarget: string;
  attendeeCount: number;
  resultRating: 'excellent' | 'good' | 'average';
}
```

### 3.8. Tài nguyên nước (`src/types/water-resource.ts`)
```typescript
export interface GroundwaterPermitRecord {
  id: string;
  permitNumber: string;
  ownerName: string;
  villageCode: string;
  villageName: string;
  depthMeters: number;
  capacityM3Day: number;
  purpose: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface CleanWaterUsageRecord {
  id: string;
  villageCode: string;
  villageName: string;
  totalHouseholds: number;
  cleanWaterHouseholds: number;
  percentage: number;
  year: number;
}

export interface HygienicWaterUsageRecord {
  id: string;
  villageCode: string;
  villageName: string;
  totalHouseholds: number;
  hygienicWaterHouseholds: number;
  percentage: number;
  year: number;
}

export interface CentralizedWaterFacility {
  id: string;
  facilityName: string;
  facilityType: 'gravity' | 'pump' | 'drilledWell' | 'other';
  villageCode: string;
  villageName: string;
  capacityM3Day: number;
  servedHouseholds: number;
  managementUnit: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastCheckedDate: string;
}

export interface SmallWaterFacility {
  id: string;
  householdId: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  facilityType: 'diggedWell' | 'drilledWell' | 'gravityTank' | 'rainwaterHarvest';
  isHygienic: boolean;
  status: 'active' | 'inactive';
}

export interface WaterTreatmentSystem {
  id: string;
  systemName: string;
  technology: string;
  capacityM3Day: number;
  location: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastInspectionDate: string;
}
```

### 3.9. Khí hậu (`src/types/climate.ts`)
```typescript
export interface DisasterEvent {
  id: string;
  eventCode: string;
  disasterType: 'landslide' | 'flashFlood' | 'storm' | 'frost' | 'drought' | 'other';
  eventDate: string;
  affectedHamlets: string[];
  severity: 'low' | 'medium' | 'high';
  estimatedDamageVnd: number;
  status: 'active' | 'resolved' | 'processing';
  note?: string;
}

export interface WeatherMonthlyRecord {
  id: string;
  year: number;
  month: number;
  averageTemperature: number;
  rainfallMm: number;
  humidityPercentage: number;
  sunshineHours: number;
  source: string;
  note?: string;
}

export interface AgricultureRiskAlert {
  id: string;
  alertCode: string;
  riskType: string;
  affectedCropTypeCodes: string[];
  affectedHamlets: string[];
  severity: 'info' | 'warning' | 'critical';
  recommendations: string;
  status: 'active' | 'archived';
  publishDate: string;
}
```

### 3.10. Nhà ở (`src/types/housing.ts`)
```typescript
export type HousingType = 'kiên cố' | 'bán kiên cố' | 'nhà tạm' | 'dột nát';
export type HousingSupportStatus = 'completed' | 'ongoing' | 'pending' | 'rejected';

export interface HousingRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  housingType: HousingType;
  areaSqm: number;
  builtYear: number;
  conditionRating: 'good' | 'average' | 'poor' | 'dangerous';
  degradationPercentage: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HousingSupportRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  programName: string;
  supportType: 'buildNew' | 'repair';
  amountVnd: number;
  year: number;
  status: HousingSupportStatus;
  notes?: string;
}

export interface HousingSupportNeed {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  needType: 'buildNew' | 'repair';
  priorityLevel: 'high' | 'medium' | 'low';
  estimatedCostVnd: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}
```

### 3.11. Hộ sản xuất phi nông nghiệp (`src/types/business-household.ts`)
```typescript
export interface BusinessHouseholdRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  businessName: string;
  industry: string;
  scale: 'small' | 'medium' | 'large';
  hasRegistration: boolean;
  registrationNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRevenueRecord {
  id: string;
  businessId: string;
  businessName: string;
  householdHeadName: string;
  period: string;
  estimatedRevenueVnd: number;
  dataSource: 'taxDeclaration' | 'survey' | 'estimate';
  notes?: string;
}

export interface NonAgriculturalLaborRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  totalLaborCount: number;
  nonAgriculturalLaborCount: number;
  awayLaborCount: number;
  year: number;
}
```

### 3.12. Chỉ tiêu kinh tế xã hội tổng hợp (`src/types/socio-economic.ts`)
```typescript
export interface EconomicIndicatorRecord {
  id: string;
  year: number;
  gdpGrowthPercent: number;
  totalProductionValueBillion: number;
  agricultureProductionValueBillion: number;
  industryConstructionValueBillion: number;
  serviceValueBillion: number;
  averageIncomePerCapitaMillion: number;
  budgetRevenueMillion: number;
  budgetExpenditureMillion: number;
  note?: string;
}

export interface SocialIndicatorRecord {
  id: string;
  year: number;
  villageCode?: string;
  villageName?: string;
  totalPopulation: number;
  totalHouseholds: number;
  poorHouseholdsCount: number;
  poorHouseholdsPercent: number;
  nearPoorHouseholdsCount: number;
  nearPoorHouseholdsPercent: number;
  nationalStandardSchoolsCount?: number;
  cultureVillagePercent?: number;
  healthInsurancePercent: number;
  note?: string;
}

export interface LaborEmploymentIndicatorRecord {
  id: string;
  year: number;
  villageCode?: string;
  villageName?: string;
  workingAgePopulation: number;
  trainedLaborCount: number;
  trainedLaborPercent: number;
  agriculturalLaborCount: number;
  nonAgriculturalLaborCount: number;
  unemployedCount: number;
  note?: string;
}

export interface InfrastructureIndicatorRecord {
  id: string;
  year: number;
  villageCode?: string;
  villageName?: string;
  concreteRoadPercent: number;
  nationalGridPowerPercent: number;
  solidHousePercent: number;
  hygienicLatrinePercent: number;
  irrigationChannelConcretePercent: number;
  note?: string;
}
```

### 3.13. An ninh quốc phòng (`src/types/security-defense.ts`)
```typescript
export interface SecurityIncidentRecord {
  id: string;
  incidentCode: string;
  year: number;
  month: number;
  incidentType: string;
  severity: 'low' | 'medium' | 'high';
  villageCode: string;
  villageName: string;
  description: string;
  reporterName: string;
  handlerName: string;
  status: 'resolved' | 'processing' | 'pending';
  recordedDate: string;
  resolutionNote?: string;
}

export interface DefenseStatisticRecord {
  id: string;
  year: number;
  milForceCount: number;
  youthEnlistedCount: number;
  trainingClassCount: number;
  trainingAttendeeCount: number;
  patrolCount: number;
  budgetDefenseVnd: number;
  note?: string;
}

export interface SocialIssueRecord {
  id: string;
  issueCode: string;
  year: number;
  month: number;
  issueType: string;
  villageCode: string;
  villageName: string;
  affectedCount: number;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'underMonitoring' | 'resolved';
  handlerDepartment: string;
  recordedDate: string;
  resolutionNote?: string;
}
```

### 3.14. Thủy lợi (`src/types/irrigation.ts`)
```typescript
export interface IrrigationFacility {
  id: string;
  facilityCode: string;
  name: string;
  type: 'dam' | 'reservoir' | 'canal' | 'pumpingStation' | 'other';
  typeName: string;
  villageCode: string;
  villageName: string;
  capacity: string;
  irrigatedAreaHa: number;
  status: 'good' | 'needsRepair' | 'damaged';
  investedYear: number;
  managementUnitId: string;
  managementUnitName: string;
}

export interface IrrigationOperationRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  checkDate: string;
  inspectorName: string;
  operationStatus: 'stable' | 'issuesFound';
  issuesRecorded?: string;
  actionProposed?: string;
  status: 'resolved' | 'pending' | 'monitoring';
}

export interface IrrigationManagementUnit {
  id: string;
  name: string;
  type: 'cooperative' | 'villageGroup' | 'communeTeam' | 'other';
  typeName: string;
  contactPerson: string;
  phoneNumber: string;
  facilityCount: number;
}
```

### 3.15. Giao thông / Cơ sở hạ tầng (`src/types/transportation.ts`)
```typescript
export type RoadSurfaceType = "asphalt" | "concrete" | "gravel" | "soil" | "mixed";
export type RoadCategory = "communeRoad" | "villageRoad" | "fieldRoad" | "productionRoad" | "other";
export type InfrastructureCondition = "good" | "fair" | "degraded" | "dangerous" | "closed";
export type TrafficIncidentType = "landslide" | "flooding" | "erosion" | "bridgeDamage" | "roadDamage" | "other";
export type MaintenanceProgress = "planned" | "approved" | "inProgress" | "completed" | "delayed";

export interface RoadRecord {
  id: string;
  code: string;
  name: string;
  startPoint: string;
  endPoint: string;
  villageCodes: string[];
  villageNames: string[];
  lengthKm: number;
  category: RoadCategory;
  surfaceType: RoadSurfaceType;
  builtOrUpgradedYear: number;
  latestRepairYear?: number;
  condition: InfrastructureCondition;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportStructureRecord {
  id: string;
  code: string;
  name: string;
  roadId: string;
  roadName: string;
  kmPosition?: string;
  villageCode: string;
  villageName: string;
  type: "suspensionBridge" | "concreteBridge" | "culvert" | "overflowSpillway" | "other";
  loadCapacityTon?: number;
  builtYear: number;
  condition: InfrastructureCondition;
  riskLevel: "low" | "medium" | "high";
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrafficDisruptionRecord {
  id: string;
  code: string;
  roadId?: string;
  roadName?: string;
  structureId?: string;
  structureName?: string;
  villageCode: string;
  villageName: string;
  incidentType: TrafficIncidentType;
  severity: "low" | "medium" | "high" | "critical";
  affectedArea: string;
  occurredAt: string;
  reopenedAt?: string;
  disruptionDays: number;
  description: string;
  status: "open" | "monitoring" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface RoadMaintenancePlan {
  id: string;
  code: string;
  targetType: "road" | "structure";
  roadId?: string;
  roadName?: string;
  structureId?: string;
  structureName?: string;
  villageCode: string;
  villageName: string;
  workItems: string[];
  estimatedBudgetVnd: number;
  fundingSource: "communeBudget" | "districtBudget" | "newRuralProgram" | "other";
  implementingUnit: string;
  progress: MaintenanceProgress;
  plannedStartDate: string;
  plannedCompletionDate: string;
  actualCompletionDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrafficSafetyRecord {
  id: string;
  code: string;
  month: number;
  year: number;
  villageCode?: string;
  villageName?: string;
  totalIncidents: number;
  resolvedIncidents: number;
  unresolvedIncidents: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. QUY TRÌNH PHÁT VÀ XỬ LÝ DỮ LIỆU (SEEDING PATTERN)

Dữ liệu mock của hệ thống tuân theo các quy tắc nghiệp vụ chặt chẽ được điều phối tự động:

1.  **Cấu trúc Đơn vị Hành chính**: Định nghĩa tại `src/data/mock-administrative-units.ts`. Phân cấp gồm xã Trà Tập (`tra-tap`) và 8 Thôn/Khóm hành chính (`thon-01` đến `thon-08`).
2.  **Seeded PRNG**: Toàn bộ dữ liệu ngẫu nhiên được điều hướng bởi `SeededRandomHelper(42)` tại `src/data/seeded-random.ts` để sinh dữ liệu nhất quán.
3.  **Mối quan hệ dữ liệu (Data Relations)**:
    *   Hộ dân được sinh ngẫu nhiên đầu tiên (180 hộ). Phân bổ đều cho các Thôn. Xếp loại kinh tế mặc định được gán ban đầu là `average`.
    *   Các thửa đất được tạo (240 bản ghi) liên kết qua `householdId`, cập nhật diện tích sở hữu ngược lại trường `totalLandAreaHa` của chủ hộ.
    *   Các bản ghi cây trồng (320 bản ghi) và chăn nuôi (220 bản ghi) được tạo ngẫu nhiên, liên kết qua `householdId`.
    *   Tính toán nguồn thu thu nhập: Thu nhập cây trồng và chăn nuôi của từng hộ trong `mock-household-economy.ts` được tính tự động từ sản lượng * giá bán trong `MOCK_CROPS` và `MOCK_LIVESTOCK`.
    *   Ngưỡng nghèo & Xếp loại kinh tế: Xếp loại kinh tế sau phân tích (`economicClassificationAfter`) được tính dựa trên ngưỡng thu nhập bình quân đầu người của hộ:
        *   Thu nhập bình quân đầu người tháng <= 1.500.000 VND: **Nghèo (poor)**
        *   1.500.000 VND < Thu nhập <= 2.000.000 VND: **Cận nghèo (nearPoor)**
        *   2.000.000 VND < Thu nhập <= 5.000.000 VND: **Trung bình (average)**
        *   Thu nhập > 5.000.000 VND: **Khá (betterOff)**
    *   Sau khi tính toán, giá trị thu nhập và xếp loại này được gán đè ngược lại thực thể `Household` chính tại `MOCK_HOUSEHOLDS` để hiển thị trên bảng.

---

## 5. HỆ THỐNG GIAO DIỆN & PHÂN QUYỀN (UI & RBAC SYSTEM)

### 5.1. Authentication & Cookie Guard
Hệ thống sử dụng Next.js Middleware (`src/middleware.ts`) kết hợp với Cookie để kiểm soát trạng thái đăng nhập và vai trò người dùng (RBAC):
*   `app_sid`: Token session mô phỏng (`demo-session` sau khi nhấn Đăng nhập).
*   `app_role`: Vai trò người dùng (`admin` | `commune_officer` | `leader`).
*   `app_hamlet_code`: Thôn đang lọc.
*   **Trang đăng nhập** (`src/app/login/page.tsx`): Cho phép chọn demo 3 Role. Khi nhấn đăng nhập, trang sẽ tạo cookie và chuyển hướng về `/dashboard`.

### 5.2. RBAC Access Matrix (`src/lib/rbac.ts`)
*   **Admin**: Được phép truy cập tất cả các route bao gồm các cấu hình hệ thống và quản lý tài khoản (`/dashboard/settings`, `/dashboard/users`, `/dashboard/audit-logs`).
*   **Cán bộ xã (commune_officer)**: Xem và thao tác tất cả các module nghiệp vụ và báo cáo, không thể truy cập module cấu hình hệ thống, người dùng và nhật ký. Không có quyền xóa (`delete`).
*   **Lãnh đạo xã (leader)**: Chỉ được phép Xem (`view`) và Xuất báo cáo (`export`) tất cả các module nghiệp vụ. Không được phép Thêm (`create`), Sửa (`update`), Xóa (`delete`) hoặc Import dữ liệu.

### 5.3. Design System & Tokens
*   **OKLCH Palette**: Màu sắc được khai báo dưới dạng biến CSS OKLCH trong `src/app/globals.css` để bảo đảm độ tương phản cao, bao gồm:
    *   `--primary`: Tông màu xanh ngọc của nông nghiệp `oklch(0.508 0.118 165.612)`.
    *   `--background`: `oklch(1 0 0)` (sáng) và `oklch(0.145 0 0)` (tối).
    *   `--card`, `--popover`, `--muted`, `--accent`, `--destructive`.
    *   `--sidebar`: `oklch(100% 0.00011 271.152)`.
*   **Fonts**: Dùng font `var(--font-be-vietnam-pro)` kế thừa từ Google Fonts.

---

## 6. DANH SÁCH COMPONENT DÙNG CHUNG (COMMON COMPONENTS)
Được quản lý và xuất barrel tại `src/components/common/index.ts`:

*   **`PageHeader`** (`page-header.tsx`): Tiêu đề trang, mô tả ngắn, các action button phía phải (Thêm mới, Excel).
*   **`Breadcrumbs`** (`breadcrumbs.tsx`): Render đường dẫn định hướng tự động dựa trên URL path.
*   **`MetricCard`** (`metric-card.tsx`): Hiển thị chỉ số KPI kèm xu hướng tăng trưởng (trend) và icon Lucide.
*   **`DataTableShell`** (`data-table-shell.tsx`): Bảng dữ liệu tự động tích hợp Sort theo cột, phân trang ảo, loading skeleton và empty state.
*   **`SectionCard`** (`section-card.tsx`): Khung hộp chứa có bo góc và viền phân tách nội dung.
*   **`ConfirmDialog`** (`confirm-dialog.tsx`): Dialog xác nhận thao tác nguy hiểm (ví dụ: Xóa).
*   **`FormDialog`** (`form-dialog.tsx`): Modal hiển thị form nhập dữ liệu nhanh.
*   **`FilterShell`** (`filter-shell.tsx`): Vùng chứa các bộ lọc dữ liệu.
*   **`LabelValueGrid`** (`label-value-grid.tsx`): Trình bày dữ liệu dạng lưới khóa-giá trị gọn gàng.
*   **`CommonTabs`** (`tabs.tsx`): Quản lý chuyển đổi tab nội dung nhanh ở phía client.

---
*Tài liệu đóng gói bối cảnh mã nguồn hiện trạng đã hoàn thành. Lập trình viên có thể cung cấp tập tin này cho ChatGPT làm System Context để AI có đầy đủ bức tranh kỹ thuật và cấu trúc của dự án trước khi sinh code bổ sung tính năng mới.*
