import {
  WasteRecord,
  WasteClassificationRecord,
  WasteTreatmentHouseholdRecord,
  EnvironmentRegistrationRecord,
  EnvironmentPermit,
  EnvironmentViolation,
  EnvironmentComplaint,
  EnvironmentPenalty,
  EnvironmentTraining,
} from '@/types/environment';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { MOCK_HOUSEHOLDS } from './mock-db';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(42);

// 1. Waste Records (36 records)
export const MOCK_WASTE_RECORDS: WasteRecord[] = [];
// Let's generate data for 6 months (Jan to June 2026) across 8 hamlets (48 records total, >= 36)
const months = [1, 2, 3, 4, 5, 6];
let wasteId = 1;

months.forEach((m) => {
  MOCK_HAMLETS.forEach((h) => {
    const totalWaste = Number((rng.range(50, 150) / 10).toFixed(2)); // 5.0 to 15.0 tons
    const organic = Number((totalWaste * rng.range(60, 75) / 100).toFixed(2));
    const inorganic = Number((totalWaste * rng.range(20, 30) / 100).toFixed(2));
    const hazardous = Number((totalWaste - organic - inorganic).toFixed(2));
    const collected = Number((totalWaste * rng.range(40, 90) / 100).toFixed(2));

    MOCK_WASTE_RECORDS.push({
      id: `waste-${wasteId++}`,
      villageCode: h.code,
      villageName: h.name,
      year: 2026,
      month: m,
      totalWasteTons: totalWaste,
      organicWasteTons: organic,
      inorganicWasteTons: inorganic,
      hazardousWasteTons: hazardous,
      collectedTons: collected,
    });
  });
});

// 2. Waste Classification Records (same dimension)
export const MOCK_WASTE_CLASSIFICATION: WasteClassificationRecord[] = MOCK_HAMLETS.map((h, i) => {
  const hhCount = 180 / 8; // approx 22 households
  const classified = rng.range(8, 18);
  return {
    id: `class-${i + 1}`,
    villageCode: h.code,
    villageName: h.name,
    householdCount: hhCount,
    classifiedCount: classified,
    notClassifiedCount: hhCount - classified,
    year: 2026,
    month: 6,
  };
});

// 3. Waste Treatment Household Records (80 records)
export const MOCK_WASTE_TREATMENT_HOUSEHOLDS: WasteTreatmentHouseholdRecord[] = [];
const methods: ('centralized' | 'selfTreatmentOrganic' | 'bury' | 'burn' | 'other')[] = [
  'centralized',
  'selfTreatmentOrganic',
  'bury',
  'burn',
  'other',
];
const selectedHh = MOCK_HOUSEHOLDS.slice(0, 80);
selectedHh.forEach((hh, i) => {
  MOCK_WASTE_TREATMENT_HOUSEHOLDS.push({
    id: `treat-hh-${i + 1}`,
    householdId: hh.id,
    householdCode: hh.code,
    householdHeadName: hh.headName,
    villageCode: hh.hamletCode,
    villageName: hh.hamletName,
    treatmentMethod: rng.element(methods),
    hasClassification: rng.boolean(0.6),
    registeredDate: `2025-${String(rng.range(1, 12)).padStart(2, '0')}-${String(rng.range(1, 28)).padStart(2, '0')}`,
  });
});

// 4. Environment Registration Records (24 records)
export const MOCK_ENV_REGISTRATIONS: EnvironmentRegistrationRecord[] = [];
const businessNames = [
  'Trại heo giống Lao Bảo', 'Xưởng gỗ mộc Hòa Bình', 'Cửa hàng tạp hóa cô Vy',
  'Cơ sở sấy chuối Lao Bảo', 'HTX Cà phê Arabica Lao Bảo', 'Nhà máy gạch ngói Lao Bảo',
  'Trại gà đồi Thôn 3', 'Nhà nghỉ Phong Lan', 'Cơ sở xay xát lúa rẫy',
  'Quán ăn ẩm thực vùng cao', 'Cơ sở thu mua nông sản', 'Xưởng chế biến tinh dầu quế'
];
const officers = ['Nguyễn Văn Trị', 'Hồ Văn Đang', 'Lê Hoàng Việt'];

for (let i = 1; i <= 24; i++) {
  const hamlet = rng.element(MOCK_HAMLETS);
  const busName = `${rng.element(businessNames)} #${rng.range(1, 50)}`;
  MOCK_ENV_REGISTRATIONS.push({
    id: `env-reg-${i}`,
    businessName: busName,
    ownerName: rng.boolean(0.5) ? 'Nguyễn Văn A' : 'Hồ Văn B',
    villageCode: hamlet.code,
    villageName: hamlet.name,
    businessType: rng.boolean(0.6) ? 'Chăn nuôi/Trồng trọt' : 'Sản xuất/Kinh doanh dịch vụ',
    registrationDate: `2026-${String(rng.range(1, 5)).padStart(2, '0')}-${String(rng.range(1, 28)).padStart(2, '0')}`,
    status: rng.boolean(0.7) ? 'approved' : rng.boolean(0.5) ? 'pending' : 'rejected',
    officerInCharge: rng.element(officers),
  });
}

// 5. Environment Permits (16 records)
export const MOCK_ENV_PERMITS: EnvironmentPermit[] = [];
const approvedRegistrations = MOCK_ENV_REGISTRATIONS.filter(r => r.status === 'approved').slice(0, 16);
approvedRegistrations.forEach((reg, i) => {
  const year = rng.range(2025, 2026);
  MOCK_ENV_PERMITS.push({
    id: `env-permit-${i + 1}`,
    permitNumber: `GP-MT-${year}-${String(i + 1).padStart(3, '0')}`,
    businessName: reg.businessName,
    villageCode: reg.villageCode,
    villageName: reg.villageName,
    issueDate: `${year}-02-15`,
    expiryDate: `${year + 5}-02-15`,
    status: rng.boolean(0.9) ? 'active' : 'expired',
  });
});
// Ensure we have exactly 16 records
while (MOCK_ENV_PERMITS.length < 16) {
  const idx = MOCK_ENV_PERMITS.length;
  MOCK_ENV_PERMITS.push({
    id: `env-permit-${idx + 1}`,
    permitNumber: `GP-MT-2026-${String(idx + 1).padStart(3, '0')}`,
    businessName: `Cơ sở sản xuất gỗ #${idx + 1}`,
    villageCode: 'noc-01',
    villageName: 'Thôn 01',
    issueDate: '2026-01-10',
    expiryDate: '2031-01-10',
    status: 'active',
  });
}

// 6. Environment Violations (30 records)
export const MOCK_ENV_VIOLATIONS: EnvironmentViolation[] = [];
const violationTypes = [
  'Xả nước thải chưa qua xử lý ra suối',
  'Đổ rác thải sinh hoạt bừa bãi ven đường',
  'Đốt phụ phẩm nông nghiệp gây khói bụi lớn',
  'Sử dụng thuốc BVTV cận nguồn nước sinh hoạt',
  'Khai thác cát sỏi trái phép gây sạt lở sông',
  'Gây tiếng ồn lớn vượt chuẩn trong khu dân cư'
];

for (let i = 1; i <= 30; i++) {
  const hamlet = rng.element(MOCK_HAMLETS);
  MOCK_ENV_VIOLATIONS.push({
    id: `env-viol-${i}`,
    violationCode: `VP-MT-${2026}-${String(i).padStart(3, '0')}`,
    offenderName: rng.boolean(0.5) ? 'Cơ sở thu mua nông sản Thôn ' + i : 'Hộ gia đình ông ' + (rng.boolean(0.5) ? 'Hồ Văn A' : 'Nguyễn Văn B'),
    violationType: rng.element(violationTypes),
    villageCode: hamlet.code,
    villageName: hamlet.name,
    recordedDate: `2026-${String(rng.range(1, 6)).padStart(2, '0')}-${String(rng.range(1, 28)).padStart(2, '0')}`,
    severity: rng.element(['low', 'medium', 'high']),
    status: rng.element(['resolved', 'processing', 'pending']),
  });
}

// 7. Environment Complaints (20 records)
export const MOCK_ENV_COMPLAINTS: EnvironmentComplaint[] = [];
const complaintDescs = [
  'Mùi hôi phát sinh từ trại heo gây ảnh hưởng sinh hoạt',
  'Nước suối chuyển màu đen và có cá chết',
  'Xưởng cưa hoạt động gây tiếng ồn lớn ban đêm',
  'Hộ dân phía sau xả rác bừa bãi làm nghẹt cống thoát nước',
  'Bụi từ cơ sở xay xát bay vào nhà dân xung quanh'
];

for (let i = 1; i <= 20; i++) {
  const hamlet = rng.element(MOCK_HAMLETS);
  const m = rng.range(1, 6);
  const d = rng.range(1, 20);
  MOCK_ENV_COMPLAINTS.push({
    id: `env-comp-${i}`,
    complaintCode: `ĐƠN-MT-2026-${String(i).padStart(3, '0')}`,
    complainantName: rng.boolean(0.5) ? 'Hồ Văn Linh' : 'Trần Thị Vy',
    villageCode: hamlet.code,
    villageName: hamlet.name,
    description: rng.element(complaintDescs),
    receivedDate: `2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    status: rng.element(['resolved', 'processing', 'received']),
    resolutionNote: rng.boolean(0.6) ? 'Đã lập biên bản làm việc và yêu cầu khắc phục triệt để.' : undefined,
    dueDate: `2026-${String(m).padStart(2, '0')}-${String(d + 7).padStart(2, '0')}`,
  });
}

// 8. Environment Penalties (16 records)
export const MOCK_ENV_PENALTIES: EnvironmentPenalty[] = [];
const violationsToPenalize = MOCK_ENV_VIOLATIONS.slice(0, 16);
violationsToPenalize.forEach((viol, i) => {
  MOCK_ENV_PENALTIES.push({
    id: `env-pen-${i + 1}`,
    penaltyNumber: `QĐ-XP-${2026}-${String(i + 1).padStart(3, '0')}`,
    offenderName: viol.offenderName,
    violationId: viol.id,
    fineAmountVnd: rng.range(2, 20) * 1000000, // 2M to 20M VND
    paymentStatus: rng.boolean(0.7) ? 'paid' : 'unpaid',
    issueDate: `2026-05-${String(rng.range(1, 28)).padStart(2, '0')}`,
  });
});

// 9. Environment Training (12 records)
export const MOCK_ENV_TRAININGS: EnvironmentTraining[] = [];
const topics = [
  'Hướng dẫn phân loại rác thải tại nguồn và làm phân compost',
  'Tuyên truyền bảo vệ nguồn nước sạch và vệ sinh môi trường nông thôn',
  'Tập huấn an toàn sử dụng thuốc bảo vệ thực vật trong trồng trọt',
  'Phổ biến Luật Bảo vệ Môi trường cho hộ sản xuất kinh doanh',
  'Thu gom vỏ chai thuốc BVTV và vệ sinh đồng ruộng'
];

for (let i = 1; i <= 12; i++) {
  MOCK_ENV_TRAININGS.push({
    id: `env-train-${i}`,
    topic: rng.element(topics),
    trainingDate: `2026-${String(rng.range(1, 6)).padStart(2, '0')}-${String(rng.range(1, 28)).padStart(2, '0')}`,
    location: `Nhà sinh hoạt cộng đồng Thôn 0${rng.range(1, 8)}`,
    attendeeTarget: rng.boolean(0.5) ? 'Đại diện các hộ dân' : 'Hộ sản xuất kinh doanh',
    attendeeCount: rng.range(30, 80),
    resultRating: rng.element(['excellent', 'good', 'average']),
  });
}
