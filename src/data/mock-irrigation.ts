import {
  IrrigationFacility,
  IrrigationOperationRecord,
  IrrigationManagementUnit,
} from '@/types/irrigation';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(303);

// 1. Management Units (6 records)
export const MOCK_IRRIGATION_UNITS: IrrigationManagementUnit[] = [
  {
    id: 'unit-1',
    name: 'Hợp tác xã Nông nghiệp Dịch vụ Lao Bảo',
    type: 'cooperative',
    typeName: 'Hợp tác xã Nông nghiệp',
    contactPerson: 'Nguyễn Văn Hùng',
    phoneNumber: '0987654321',
    facilityCount: 3,
  },
  {
    id: 'unit-2',
    name: 'Tổ quản lý thủy lợi Thôn 01',
    type: 'villageGroup',
    typeName: 'Tổ quản lý thủy lợi thôn',
    contactPerson: 'Hồ Văn Thanh',
    phoneNumber: '0912345678',
    facilityCount: 2,
  },
  {
    id: 'unit-3',
    name: 'Tổ quản lý thủy lợi Thôn 03',
    type: 'villageGroup',
    typeName: 'Tổ quản lý thủy lợi thôn',
    contactPerson: 'Hồ Văn Bla',
    phoneNumber: '0905999888',
    facilityCount: 2,
  },
  {
    id: 'unit-4',
    name: 'Tổ quản lý thủy lợi Thôn 05',
    type: 'villageGroup',
    typeName: 'Tổ quản lý thủy lợi thôn',
    contactPerson: 'Lê Hoàng Minh',
    phoneNumber: '0934123456',
    facilityCount: 2,
  },
  {
    id: 'unit-5',
    name: 'Tổ quản lý thủy lợi Thôn 07',
    type: 'villageGroup',
    typeName: 'Tổ quản lý thủy lợi thôn',
    contactPerson: 'Hồ Văn Nghĩa',
    phoneNumber: '0977665544',
    facilityCount: 2,
  },
  {
    id: 'unit-6',
    name: 'Ban chỉ đạo Phát triển Thủy lợi xã Lao Bảo',
    type: 'communeTeam',
    typeName: 'Ban quản lý Thủy lợi xã',
    contactPerson: 'Trần Thanh Nam',
    phoneNumber: '0988776655',
    facilityCount: 1,
  },
];

// 2. Irrigation Facilities (12 records)
export const MOCK_IRRIGATION_FACILITIES: IrrigationFacility[] = [];

const facilityNames = [
  'Đập dâng suối nước lóng',
  'Đập dâng thôn 1',
  'Kênh dẫn nước mương ông Hùng',
  'Đập chứa nước Nà Lau',
  'Trạm bơm điện Thôn 3',
  'Kênh tưới chính Thôn 4',
  'Đập dâng tạm khe đá',
  'Kênh mương nội đồng Thôn 5',
  'Đập chứa nước Nước Xa',
  'Trạm bơm dã chiến Thôn 6',
  'Mương dẫn nước Nước Ui',
  'Đập dâng kiên cố Thôn 7',
];

const facilityTypes = [
  { type: 'dam', typeName: 'Đập dâng kiên cố', capacity: '1,500 m3' },
  { type: 'dam', typeName: 'Đập dâng tạm thời', capacity: '300 m3' },
  { type: 'canal', typeName: 'Kênh mương kiên cố', capacity: '1.2 km' },
  { type: 'reservoir', typeName: 'Đập chứa nước', capacity: '5,000 m3' },
  { type: 'pumpingStation', typeName: 'Trạm bơm điện', capacity: '250 m3/h' },
  { type: 'canal', typeName: 'Kênh dẫn bê tông', capacity: '0.8 km' },
  { type: 'dam', typeName: 'Đập dâng dã chiến', capacity: '200 m3' },
  { type: 'canal', typeName: 'Kênh mương nội đồng', capacity: '1.5 km' },
  { type: 'reservoir', typeName: 'Hồ chứa nước nhỏ', capacity: '3,500 m3' },
  { type: 'pumpingStation', typeName: 'Trạm bơm dã chiến', capacity: '120 m3/h' },
  { type: 'canal', typeName: 'Mương dẫn đất tự nhiên', capacity: '1.0 km' },
  { type: 'dam', typeName: 'Đập dâng kiên cố', capacity: '1,200 m3' },
] as const;

for (let i = 0; i < 12; i++) {
  const hamlet = MOCK_HAMLETS[i % MOCK_HAMLETS.length];
  const unit = MOCK_IRRIGATION_UNITS[i % MOCK_IRRIGATION_UNITS.length];
  const typeInfo = facilityTypes[i];
  const status = i === 2 ? 'needsRepair' : i === 6 ? 'damaged' : i === 8 ? 'needsRepair' : 'good';

  MOCK_IRRIGATION_FACILITIES.push({
    id: `irr-fac-${i + 1}`,
    facilityCode: `CTTL-${String(i + 1).padStart(3, '0')}`,
    name: facilityNames[i],
    type: typeInfo.type,
    typeName: typeInfo.typeName,
    villageCode: hamlet.code,
    villageName: hamlet.name,
    capacity: typeInfo.capacity,
    irrigatedAreaHa: rng.range(5, 25),
    status,
    investedYear: rng.range(2018, 2025),
    managementUnitId: unit.id,
    managementUnitName: unit.name,
  });
}

// 3. Irrigation Operation Records (48 records)
export const MOCK_IRRIGATION_OPERATIONS: IrrigationOperationRecord[] = [];

const inspectors = ['Nguyễn Văn A', 'Hồ Văn B', 'Lê Hoàng C', 'Trần Thanh D'];
const issuesList = [
  'Thân đập có vết nứt nhỏ, nước rò rỉ nhẹ.',
  'Kênh dẫn bị bồi lắng cát sỏi sau mưa lớn, dòng chảy yếu.',
  'Trạm bơm bị hỏng tủ điện điều khiển do sét đánh.',
  'Sạt lở bờ mương mộc dài khoảng 5m làm thất thoát nước tưới.',
  'Cửa van điều tiết nước bị rỉ sét khó đóng mở.',
];
const actionProposals = [
  'Đề xuất trát vữa xi măng gia cố vết nứt trước mùa mưa.',
  'Cần tổ chức ra quân nạo vét khơi thông dòng chảy.',
  'Liên hệ thợ điện sửa chữa thay thế linh kiện điện tử.',
  'Đề xuất kè đá gia cố đoạn bờ kênh bị sạt lở.',
  'Bôi trơn dầu mỡ cạo rỉ sét cửa van.',
];

let opId = 1;
// Generate 4 checks for each of the 12 facilities to get 48 records
MOCK_IRRIGATION_FACILITIES.forEach((fac) => {
  const checkMonths = [3, 5, 8, 10]; // Four inspection periods in a year
  checkMonths.forEach((m) => {
    // Determine status based on facility baseline status
    let opStatus: 'stable' | 'issuesFound' = 'stable';
    let issue: string | undefined = undefined;
    let proposal: string | undefined = undefined;
    let recordStatus: 'resolved' | 'pending' | 'monitoring' = 'resolved';

    // Good facilities rarely have issues, damaged/needsRepair facilities always show issues
    if (fac.status !== 'good') {
      opStatus = 'issuesFound';
      issue = rng.element(issuesList);
      proposal = rng.element(actionProposals);
      recordStatus = fac.status === 'damaged' ? 'pending' : 'monitoring';
    } else if (rng.boolean(0.15)) {
      opStatus = 'issuesFound';
      issue = 'Rác thải cản trở dòng chảy tại miệng cống.';
      proposal = 'Vớt dọn rác khai thông cống.';
      recordStatus = 'resolved';
    }

    MOCK_IRRIGATION_OPERATIONS.push({
      id: `irr-op-${opId++}`,
      facilityId: fac.id,
      facilityName: fac.name,
      checkDate: `2025-${String(m).padStart(2, '0')}-${String(rng.range(1, 28)).padStart(2, '0')}`,
      inspectorName: rng.element(inspectors),
      operationStatus: opStatus,
      issuesRecorded: issue,
      actionProposed: proposal,
      status: recordStatus,
    });
  });
});

// Sort operations by date descending
MOCK_IRRIGATION_OPERATIONS.sort((a, b) => b.checkDate.localeCompare(a.checkDate));
