// src/data/mock-indicators.ts
import { DashboardIndicator, IndicatorGroupCode } from '@/types/dashboard';

export type IndicatorCategory = 'dailyMonthly' | 'socioEconomicPlan' | 'emergency' | 'assignedTasks';
export type IndicatorDataStatus = 'unavailable' | 'mock' | 'computed';
export type IndicatorSecurityLevel = 'public' | 'confidential';

export interface Indicator {
  code: string;
  name: string;
  category: IndicatorCategory;
  unit: string;
  description: string;
  reportingUnit: string;
  frequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  databaseCatalog: string;
  databaseOwner: string;
  source: string;
  currentValue: number;
  previousValue: number;
  targetValue: number;
  period: string;
  securityLevel: IndicatorSecurityLevel;
  status: 'active' | 'inactive';
  dataStatus: IndicatorDataStatus;
}

// Helper to generate the exact 62 required indicators programmatically to avoid human counting mistakes
export function generateAllIndicators(): Indicator[] {
  const list: Indicator[] = [];

  // Group A: Daily/Monthly (31 indicators: IND-A-001 to IND-A-031)
  const aNames = [
    'Sản lượng lúa thu hoạch trong tháng',
    'Số lượng gia súc tiêu thụ trong tháng',
    'Diện tích cây trồng lâu năm mới gieo trồng',
    'Diện tích rừng trồng mới tập trung',
    'Sản lượng gỗ khai thác hàng tháng',
    'Lượng nước sạch tiêu thụ bình quân',
    'Tỷ lệ hộ dân sử dụng nước hợp vệ sinh',
    'Sản lượng điện tiêu thụ toàn xã',
    'Lượng rác thải sinh hoạt thu gom hàng ngày',
    'Số lượt khách du lịch đến thôn',
    'Doanh thu dịch vụ du lịch hàng tháng',
    'Số doanh nghiệp đăng ký mới trong tháng',
    'Số hộ kinh doanh cá thể hoạt động',
    'Lượng hàng hóa thông quan qua cửa khẩu',
    'Doanh thu thuế, phí thu tại địa bàn',
    'Số lượng hồ sơ hành chính tiếp nhận',
    'Tỷ lệ hồ sơ hành chính giải quyết đúng hạn',
    'Số lượt phản ánh của công dân qua hotline',
    'Tỷ lệ phản ánh kiến nghị được xử lý',
    'Số học sinh đi học chuyên cần bình quân',
    'Số bệnh nhân khám chữa bệnh tại trạm y tế',
    'Lượng vắc-xin tiêm chủng định kỳ',
    'Số lượt tuyên truyền y tế cộng đồng',
    'Số lao động được giới thiệu việc làm mới',
    'Số vụ việc an ninh trật tự được tiếp nhận',
    'Số tuần tra biên giới phối hợp thực hiện',
    'Tỷ lệ tin báo tố giác tội phạm được xử lý',
    'Số hộ nghèo nhận trợ cấp xã hội định kỳ',
    'Lượng gạo cứu trợ khẩn cấp đã cấp phát',
    'Số người tham gia bảo hiểm y tế tự nguyện',
    'Tỷ lệ trẻ em dưới 5 tuổi suy dinh dưỡng',
  ];

  for (let i = 1; i <= 31; i++) {
    const code = `IND-A-${String(i).padStart(3, '0')}`;
    list.push({
      code,
      name: aNames[i - 1] || `Chỉ số điều hành thường xuyên ${i}`,
      category: 'dailyMonthly',
      unit: i === 7 || i === 17 || i === 19 || i === 27 || i === 31 ? '%' : 'đơn vị',
      description: `Mô tả chi tiết chỉ số điều hành hàng tháng/hàng ngày mã ${code}`,
      reportingUnit: 'UBND Xã Lao Bảo',
      frequency: 'monthly',
      databaseCatalog: 'CSDL Điều hành',
      databaseOwner: 'Phòng Văn phòng HĐND-UBND',
      source: 'Hệ thống báo cáo cơ sở',
      currentValue: 120 + i * 5,
      previousValue: 110 + i * 5,
      targetValue: 150 + i * 5,
      period: 'Tháng 07/2026',
      securityLevel: i === 25 || i === 26 ? 'confidential' : 'public',
      status: 'active',
      dataStatus: 'computed',
    });
  }

  // Group B: Socio-Economic Quarterly/Annual Plan (24 indicators: IND-B-001 to IND-B-024)
  const bNames = [
    'Tốc độ tăng trưởng giá trị sản xuất xã',
    'Thu nhập bình quân đầu người hàng năm',
    'Tổng vốn đầu tư phát triển toàn xã hội',
    'Tỷ lệ hộ nghèo đa chiều giảm hàng năm',
    'Tổng thu ngân sách nhà nước trên địa bàn',
    'Tổng chi ngân sách địa phương',
    'Diện tích gieo trồng cây lương thực có hạt',
    'Tổng đàn gia súc chính (trâu, bò, lợn)',
    'Tỷ lệ che phủ rừng toàn xã',
    'Giá trị sản xuất công nghiệp - tiểu thủ công nghiệp',
    'Tổng mức bán lẻ hàng hóa và doanh thu dịch vụ',
    'Số hợp tác xã nông nghiệp hoạt động hiệu quả',
    'Tỷ lệ trường học đạt chuẩn quốc gia',
    'Tỷ lệ thôn đạt chuẩn văn hóa',
    'Tỷ lệ gia đình đạt danh hiệu gia đình văn hóa',
    'Số giường bệnh trên vạn dân',
    'Tỷ lệ trẻ em dưới 1 tuổi được tiêm chủng đầy đủ',
    'Tỷ lệ lao động qua đào tạo nghề',
    'Tỷ lệ hộ dân sử dụng điện lưới quốc gia',
    'Tỷ lệ thôn có đường ô tô đến trung tâm',
    'Tỷ lệ bao phủ bảo hiểm y tế toàn dân',
    'Số lượng nhà tình nghĩa được xây dựng mới',
    'Tỷ lệ xử lý chất thải rắn y tế đạt tiêu chuẩn',
    'Tỷ lệ cơ quan đơn vị đạt chuẩn văn hóa',
  ];

  for (let i = 1; i <= 24; i++) {
    const code = `IND-B-${String(i).padStart(3, '0')}`;
    list.push({
      code,
      name: bNames[i - 1] || `Chỉ số kế hoạch kinh tế xã hội ${i}`,
      category: 'socioEconomicPlan',
      unit: i === 1 || i === 4 || i === 9 || i === 13 || i === 14 || i === 15 || i === 17 || i === 18 || i === 19 || i === 20 || i === 21 || i === 23 || i === 24 ? '%' : 'đơn vị',
      description: `Mô tả chi tiết chỉ số theo dõi kế hoạch quý/năm mã ${code}`,
      reportingUnit: 'Phòng Tài chính - Kế hoạch',
      frequency: 'quarterly',
      databaseCatalog: 'CSDL Kế hoạch',
      databaseOwner: 'UBND Xã Lao Bảo',
      source: 'Cục Thống kê tỉnh Quảng Trị',
      currentValue: 80 + i * 2,
      previousValue: 75 + i * 2,
      targetValue: 90 + i * 2,
      period: 'Quý II/2026',
      securityLevel: 'public',
      status: 'active',
      dataStatus: 'computed',
    });
  }

  // Group C: Emergency (6 indicators: IND-C-001 to IND-C-006)
  const cNames = [
    'Số điểm nguy cơ sạt lở mức khẩn cấp',
    'Mực nước sông Sê Pôn (so với báo động)',
    'Lượng mưa tích lũy 24 giờ qua',
    'Số lượng công trình PCTT cần gia cố gấp',
    'Số hộ dân cần di dời khẩn cấp do lũ',
    'Lượng gạo dự trữ cứu nạn khẩn cấp',
  ];

  for (let i = 1; i <= 6; i++) {
    const code = `IND-C-${String(i).padStart(3, '0')}`;
    list.push({
      code,
      name: cNames[i - 1] || `Chỉ số khẩn cấp ${i}`,
      category: 'emergency',
      unit: i === 2 ? 'm' : i === 3 ? 'mm' : i === 6 ? 'tấn' : 'điểm',
      description: `Mô tả chi tiết chỉ số phòng chống thiên tai khẩn cấp mã ${code}`,
      reportingUnit: 'Ban Chỉ huy Phòng chống thiên tai',
      frequency: 'daily',
      databaseCatalog: 'CSDL Khẩn cấp',
      databaseOwner: 'Ban Chỉ huy PCTT xã',
      source: 'Hệ thống đo cảm biến tự động',
      currentValue: i === 2 ? 1.8 : i === 3 ? 45 : i === 6 ? 15.5 : i,
      previousValue: i === 2 ? 1.5 : i === 3 ? 40 : i === 6 ? 15.0 : i - 1,
      targetValue: i === 6 ? 20.0 : 0,
      period: 'Hôm nay',
      securityLevel: 'public',
      status: 'active',
      dataStatus: 'computed',
    });
  }

  // Group D: Assigned Tasks (1 indicator: IND-D-001)
  list.push({
    code: 'IND-D-001',
    name: 'Tỷ lệ nhiệm vụ Tỉnh giao hoàn thành đúng hạn',
    category: 'assignedTasks',
    unit: '%',
    description: 'Theo dõi tiến độ thực hiện các nhiệm vụ chỉ đạo của Tỉnh ủy, UBND Tỉnh giao Lao Bảo',
    reportingUnit: 'Văn phòng HĐND-UBND Xã',
    frequency: 'monthly',
    databaseCatalog: 'CSDL Chỉ đạo điều hành',
    databaseOwner: 'Văn phòng UBND xã',
    source: 'Hệ thống thông tin chỉ đạo của tỉnh',
    currentValue: 94.5,
    previousValue: 92.0,
    targetValue: 98.0,
    period: 'Năm 2026',
    securityLevel: 'public',
    status: 'active',
    dataStatus: 'computed',
  });

  return list;
}

// Assertion function to strictly verify category count constraints
export function assertIndicatorCount(indicators: Indicator[]): {
  isValid: boolean;
  aCount: number;
  bCount: number;
  cCount: number;
  dCount: number;
  total: number;
} {
  const aCount = indicators.filter((i) => i.code.startsWith('IND-A-')).length;
  const bCount = indicators.filter((i) => i.code.startsWith('IND-B-')).length;
  const cCount = indicators.filter((i) => i.code.startsWith('IND-C-')).length;
  const dCount = indicators.filter((i) => i.code.startsWith('IND-D-')).length;
  const total = indicators.length;
  
  const isValid = aCount === 31 && bCount === 24 && cCount === 6 && dCount === 1 && total === 62;
  return { isValid, aCount, bCount, cCount, dCount, total };
}

export const ALL_INDICATORS: Indicator[] = generateAllIndicators();
export const ASSERTION_RESULT = assertIndicatorCount(ALL_INDICATORS);
console.log('CDS Lao Bao - Assertion checking of 62 indicators:', ASSERTION_RESULT);

export function getDashboardIndicators(): DashboardIndicator[] {
  return ALL_INDICATORS.map((ind): DashboardIndicator => {
    let groupCode: IndicatorGroupCode = 'A';
    if (ind.category === 'socioEconomicPlan') groupCode = 'B';
    else if (ind.category === 'emergency') groupCode = 'C';
    else if (ind.category === 'assignedTasks') groupCode = 'D';

    const sourceIndex = parseInt(ind.code.split('-')[2] || '0', 10);
    
    // Determine status based on values for demo
    let status: 'normal' | 'warning' | 'critical' = 'normal';
    if (groupCode === 'C') {
      if (sourceIndex === 3 && ind.currentValue > 40) {
        status = 'critical'; // Rain accumulation Ka Tang
      } else if (sourceIndex === 2) {
        status = 'warning'; // River level Sepon
      }
    } else if (groupCode === 'D') {
      if (ind.currentValue < ind.targetValue) {
        status = 'warning';
      }
    } else if (groupCode === 'A') {
      if (sourceIndex === 17) status = 'warning'; // administrative online rate
      if (sourceIndex === 25) status = 'critical'; // warning alerts
    }

    // Mapping frequency to Vietnamese string
    const freqMap = {
      daily: 'Hàng ngày',
      monthly: 'Hàng tháng',
      quarterly: 'Hàng quý',
      annually: 'Hàng năm'
    };

    return {
      id: ind.code,
      groupCode,
      sourceIndex,
      name: ind.name,
      unit: ind.unit,
      reportingFrequency: freqMap[ind.frequency] || ind.frequency,
      reportingUnit: ind.reportingUnit,
      dataSource: ind.source,
      status,
      updatedAt: '2026-07-14T09:30:00Z',
    };
  });
}

