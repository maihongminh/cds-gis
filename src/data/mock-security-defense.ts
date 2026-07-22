import {
  SecurityIncidentRecord,
  DefenseStatisticRecord,
  SocialIssueRecord,
} from '@/types/security-defense';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(202);

// 1. Security Incidents (30 records)
export const MOCK_SECURITY_INCIDENTS: SecurityIncidentRecord[] = [];

const incidentTypes = [
  'Trộm cắp vặt nông sản',
  'Gây rối trật tự công cộng',
  'Tranh chấp ranh giới đất đai',
  'Vi phạm quy định phòng cháy rừng',
  'Lấn chiếm hành lang an toàn giao thông',
  'Xích mích nội bộ gia đình',
];

const reporterNames = [
  'Hồ Văn Bê', 'Trần Văn Cường', 'Lê Thị Đào', 'Hồ Văn Giang', 'Nguyễn Thị Hoa',
  'Hồ Văn Lực', 'Đinh Thị Mai', 'Phạm Văn Nam', 'Hồ Văn Phong', 'Lê Thị Quỳnh'
];

const handlerNames = [
  'Đại úy Nguyễn Văn Quân',
  'Thượng úy Hồ Văn Tuyến',
  'Trung úy Lê Hồng Phong',
  'Cán bộ Tư pháp xã',
  'Cán bộ Địa chính xã'
];

const incidentDescriptions = [
  'Mất cắp một số dụng cụ làm nông và nông sản thu hoạch tại nương rẫy.',
  'Xảy ra to tiếng, cãi vã giữa nhóm thanh niên trong dịp lễ hội thôn.',
  'Tranh chấp ranh giới đất canh tác quế giữa hai hộ dân lân cận.',
  'Hộ dân đốt dọn nương rẫy không kiểm soát tốt gây khói lan sang rừng phòng hộ.',
  'Tự ý đặt vật liệu xây dựng lấn ra phần đường đất chung của thôn.',
  'Mâu thuẫn lời qua tiếng lại giữa các thành viên trong gia đình về việc chia chia tài sản thừa kế.',
];

for (let i = 1; i <= 30; i++) {
  const hamlet = rng.element(MOCK_HAMLETS);
  const typeIdx = rng.range(0, incidentTypes.length);
  const m = rng.range(1, 12);
  const d = rng.range(1, 28);
  const status = rng.boolean(0.7) ? 'resolved' : rng.boolean(0.5) ? 'processing' : 'pending';
  const severity = rng.element(['low', 'medium', 'high'] as const);

  MOCK_SECURITY_INCIDENTS.push({
    id: `sec-${i}`,
    incidentCode: `VU-AN-${2026}-${String(i).padStart(3, '0')}`,
    year: 2026,
    month: m,
    incidentType: incidentTypes[typeIdx],
    severity,
    villageCode: hamlet.code,
    villageName: hamlet.name,
    description: incidentDescriptions[typeIdx],
    reporterName: rng.element(reporterNames),
    handlerName: rng.element(handlerNames),
    status,
    recordedDate: `2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    resolutionNote: status === 'resolved' ? 'Đã phối hợp với Ban nhân dân thôn hòa giải thành công và lập biên bản cam kết.' : undefined
  });
}

// Sort incidents by date descending
MOCK_SECURITY_INCIDENTS.sort((a, b) => b.recordedDate.localeCompare(a.recordedDate));

// 2. Defense Statistics (3 years: 2024, 2025, 2026)
export const MOCK_DEFENSE_STATISTICS: DefenseStatisticRecord[] = [
  {
    id: 'def-2024',
    year: 2024,
    milForceCount: 120,
    youthEnlistedCount: 12,
    trainingClassCount: 4,
    trainingAttendeeCount: 120,
    patrolCount: 48,
    budgetDefenseVnd: 180000000, // 180 triệu đồng
    note: 'Hoàn thành 100% chỉ tiêu tuyển quân và huấn luyện dân quân tự vệ năm 2024.'
  },
  {
    id: 'def-2025',
    year: 2025,
    milForceCount: 125,
    youthEnlistedCount: 14,
    trainingClassCount: 4,
    trainingAttendeeCount: 125,
    patrolCount: 52,
    budgetDefenseVnd: 200000000, // 200 triệu đồng
    note: 'Tổ chức thành công diễn tập phòng thủ dân sự cấp xã.'
  },
  {
    id: 'def-2026',
    year: 2026,
    milForceCount: 130,
    youthEnlistedCount: 15,
    trainingClassCount: 3,
    trainingAttendeeCount: 95, // 95 trained so far in 2026
    patrolCount: 28,
    budgetDefenseVnd: 220000000,
    note: 'Dữ liệu tính đến hết quý II năm 2026. Chỉ tiêu huấn luyện đang tiếp tục thực hiện.'
  }
];

// 3. Social Issues (20 records)
export const MOCK_SOCIAL_ISSUES: SocialIssueRecord[] = [];

const issueTypes = [
  'Học sinh có nguy cơ bỏ học',
  'Tảo hôn / Kết hôn cận huyết thống',
  'Người cần hỗ trợ cai nghiện',
  'Hộ có dấu hiệu bạo lực gia đình',
  'Trẻ em hoàn cảnh đặc biệt khó khăn',
];

const departments = [
  'Đoàn Thanh niên xã',
  'Hội Phụ nữ xã',
  'Công an xã',
  'Cán bộ Lao động - TB&XH',
  'Ban nhân dân thôn'
];

for (let i = 1; i <= 20; i++) {
  const hamlet = rng.element(MOCK_HAMLETS);
  const typeIdx = rng.range(0, issueTypes.length);
  const m = rng.range(1, 12);
  const d = rng.range(1, 28);
  const status = rng.boolean(0.5) ? 'resolved' : rng.boolean(0.6) ? 'underMonitoring' : 'active';
  const severity = rng.element(['low', 'medium', 'high'] as const);

  MOCK_SOCIAL_ISSUES.push({
    id: `soc-issue-${i}`,
    issueCode: `VD-XH-${2026}-${String(i).padStart(3, '0')}`,
    year: 2026,
    month: m,
    issueType: issueTypes[typeIdx],
    villageCode: hamlet.code,
    villageName: hamlet.name,
    affectedCount: rng.range(1, 4),
    severity,
    status,
    handlerDepartment: rng.element(departments),
    recordedDate: `2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    resolutionNote: status === 'resolved' ? 'Đã tổ chức tuyên truyền, vận động và hỗ trợ gia đình vượt qua khó khăn.' : undefined
  });
}

// Sort by date descending
MOCK_SOCIAL_ISSUES.sort((a, b) => b.recordedDate.localeCompare(a.recordedDate));
