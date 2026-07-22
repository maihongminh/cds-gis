import {
  RoadRecord,
  TransportStructureRecord,
  TrafficDisruptionRecord,
  RoadMaintenancePlan,
  TrafficSafetyRecord,
  TransportationSummary,
  RoadCategory,
  RoadSurfaceType,
  InfrastructureCondition,
  TrafficIncidentType,
  MaintenanceProgress
} from '@/types/transportation';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { SeededRandomHelper } from './seeded-random';

const rng = new SeededRandomHelper(24); // Stable seed for transportation

// 1. GENERATE ROADS (24 records)
export const MOCK_ROADS: RoadRecord[] = [];
const roadNames = [
  'Đường liên xã Lao Bảo - Trà Cang',
  'Tuyến đường trung tâm xã Lao Bảo',
  'Tuyến Thôn 01 đi khu sản xuất',
  'Đường nội thôn Thôn 02',
  'Tuyến tránh sạt lở Thôn 03',
  'Đường lên nóc ông Đề Thôn 03',
  'Đường vào vùng dược liệu Thôn 04',
  'Tuyến dân sinh Thôn 04',
  'Đường phục vụ sản xuất Thôn 05',
  'Tuyến Thôn 05 đi Thôn 06',
  'Tuyến đường nội vùng cà phê Arabica Thôn 06',
  'Đường liên thôn Thôn 06 - Thôn 07',
  'Tuyến đường quanh đồi Quế Thôn 07',
  'Đường vào khu định cư mới Thôn 08',
  'Tuyến lâm nghiệp Thôn 08',
  'Đường cứu hộ cứu nạn Lao Bảo',
  'Đường nội bộ UBND xã',
  'Tuyến tuần tra rừng bảo hộ',
  'Đường vào trạm y tế Lao Bảo',
  'Đường dân sinh ven suối nước là',
  'Đường đi Thôn 01 - Thôn 03',
  'Tuyến Thôn 02 đi Thôn 04',
  'Tuyến Thôn 07 đi khu sản xuất',
  'Đường liên thôn Thôn 05 - Thôn 08'
];

for (let i = 0; i < 24; i++) {
  const id = `road-${i + 1}`;
  const code = `RD-${String(i + 1).padStart(3, '0')}`;
  const name = roadNames[i];
  
  // Distribute across hamlets
  const hamletIndex = i % 8;
  const hamlet = MOCK_HAMLETS[hamletIndex];
  
  const lengthKm = Number((rng.range(5, 120) / 10).toFixed(1)); // 0.5 to 12.0 km
  let category: RoadCategory = 'villageRoad';
  if (i < 2) category = 'communeRoad';
  else if (i % 4 === 0) category = 'productionRoad';
  else if (i % 5 === 0) category = 'fieldRoad';
  
  let surfaceType: RoadSurfaceType = 'concrete';
  if (i % 3 === 0) surfaceType = 'asphalt';
  else if (i % 4 === 0) surfaceType = 'gravel';
  else if (i % 5 === 0) surfaceType = 'soil';
  else if (i % 7 === 0) surfaceType = 'mixed';

  let condition: InfrastructureCondition = 'good';
  if (i % 4 === 0) condition = 'fair';
  else if (i % 7 === 0) condition = 'degraded';
  else if (i === 11 || i === 22) condition = 'dangerous'; // Some dangerous roads

  const builtYear = rng.range(2010, 2024);
  const latestRepairYear = rng.boolean(0.6) ? rng.range(builtYear + 1, 2025) : undefined;

  const villageCodes = [hamlet.code];
  const villageNames = [hamlet.name];
  // Some roads pass through multiple hamlets
  if (i % 6 === 0 && hamletIndex < 7) {
    const nextHamlet = MOCK_HAMLETS[hamletIndex + 1];
    villageCodes.push(nextHamlet.code);
    villageNames.push(nextHamlet.name);
  }

  MOCK_ROADS.push({
    id,
    code,
    name,
    startPoint: i % 2 === 0 ? 'Ngã ba Trung tâm xã' : `Cổng chào ${hamlet.name}`,
    endPoint: `Điểm cuối khu dân sinh ${villageNames[villageNames.length - 1]}`,
    villageCodes,
    villageNames,
    lengthKm,
    category,
    surfaceType,
    builtOrUpgradedYear: builtYear,
    latestRepairYear,
    condition,
    note: i % 7 === 0 ? 'Cần mở rộng và gia cố taluy dương' : undefined,
    createdAt: `2025-01-${String(rng.range(10, 28)).padStart(2, '0')}T08:00:00Z`,
    updatedAt: `2026-06-${String(rng.range(1, 15)).padStart(2, '0')}T10:00:00Z`
  });
}

// 2. GENERATE STRUCTURES (32 bridge/culvert records)
export const MOCK_TRANSPORT_STRUCTURES: TransportStructureRecord[] = [];
const structureTypes = ['suspensionBridge', 'concreteBridge', 'culvert', 'overflowSpillway', 'other'] as const;
const structureNames = [
  'Cầu treo Thôn 01', 'Cầu bản bê tông suối Nước Là', 'Cống hộp Thôn 02', 'Ngầm tràn Thôn 02',
  'Cầu treo Nóc ông Đề', 'Cầu treo sông Tranh', 'Cống thoát nước Thôn 03', 'Ngầm tràn Thôn 03',
  'Cầu bản bê tông Khe Sông', 'Cống Thôn 04', 'Cầu gỗ dân sinh Thôn 04', 'Ngầm tràn Thôn 04',
  'Cầu treo Thôn 05', 'Cầu treo Nóc ông Đốc', 'Cống hộp Thôn 05', 'Ngầm tràn Thôn 05',
  'Cầu bê tông cốt thép Thôn 06', 'Cầu treo khu sản xuất sâm', 'Cống thoát nước Thôn 06', 'Ngầm tràn Thôn 06',
  'Cầu treo Thôn 07', 'Cống tràn Thôn 07', 'Cống hộp Thôn 07', 'Ngầm tràn Thôn 07',
  'Cầu sắt dân sinh Thôn 08', 'Cầu treo qua suối lớn', 'Cống hộp Thôn 08', 'Ngầm tràn Thôn 08',
  'Cầu treo liên thôn 1-3', 'Cống tràn suối Nước Mét', 'Cống bản Thôn 04', 'Cầu gỗ Nóc ông Rinh'
];

for (let i = 0; i < 32; i++) {
  const id = `struct-${i + 1}`;
  const code = `ST-${String(i + 1).padStart(3, '0')}`;
  const name = structureNames[i];
  
  const roadIndex = i % 24;
  const road = MOCK_ROADS[roadIndex];
  const hamletCode = road.villageCodes[0];
  const hamletName = road.villageNames[0];

  const type = structureTypes[i % structureTypes.length];
  
  let condition: InfrastructureCondition = 'good';
  if (i % 5 === 0) condition = 'fair';
  else if (i % 7 === 0) condition = 'degraded';
  else if (i === 13 || i === 27) condition = 'dangerous'; // Dangerous structures

  const builtYear = rng.range(2008, 2023);
  const loadCapacityTon = type === 'concreteBridge' ? rng.range(10, 30) : type === 'suspensionBridge' ? 2 : type === 'overflowSpillway' ? 5 : undefined;

  MOCK_TRANSPORT_STRUCTURES.push({
    id,
    code,
    name,
    roadId: road.id,
    roadName: road.name,
    kmPosition: `Km ${Number((rng.range(1, road.lengthKm * 10) / 10).toFixed(1))}`,
    villageCode: hamletCode,
    villageName: hamletName,
    type,
    loadCapacityTon,
    builtYear,
    condition,
    riskLevel: condition === 'dangerous' ? 'high' : condition === 'degraded' ? 'medium' : 'low',
    note: condition === 'dangerous' ? 'Có nguy cơ sạt lở mố cầu khi mưa lũ lớn' : undefined,
    createdAt: road.createdAt,
    updatedAt: road.updatedAt
  });
}

// 3. GENERATE TRAFFIC DISRUPTIONS (36 records)
export const MOCK_TRAFFIC_DISRUPTIONS: TrafficDisruptionRecord[] = [];
const incidentTypes: TrafficIncidentType[] = ['landslide', 'flooding', 'erosion', 'bridgeDamage', 'roadDamage', 'other'];

for (let i = 0; i < 36; i++) {
  const id = `disrupt-${i + 1}`;
  const code = `TD-${String(i + 1).padStart(3, '0')}`;
  
  const road = MOCK_ROADS[i % 24];
  const structure = i % 2 === 0 ? MOCK_TRANSPORT_STRUCTURES[i % 32] : undefined;
  
  const villageCode = road.villageCodes[0];
  const villageName = road.villageNames[0];

  const incidentType = incidentTypes[i % incidentTypes.length];
  const severity = i % 8 === 0 ? 'critical' : i % 5 === 0 ? 'high' : i % 3 === 0 ? 'medium' : 'low';
  
  const status = i < 3 ? 'open' : i < 6 ? 'monitoring' : 'resolved'; // 3 open, 3 monitoring, 30 resolved
  
  // Date setup
  const year = rng.element([2025, 2026]);
  const month = rng.range(1, 12);
  const day = rng.range(1, 28);
  const hour = rng.range(6, 20);
  
  const occurredAt = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00Z`;
  
  let reopenedAt: string | undefined;
  let disruptionDays = 1;
  if (status === 'resolved') {
    disruptionDays = rng.range(1, 14);
    const occurDate = new Date(occurredAt);
    const reopenDate = new Date(occurDate.getTime() + disruptionDays * 24 * 60 * 60 * 1000);
    reopenedAt = reopenDate.toISOString();
  } else {
    // calculate disruption days relative to "now" (2026-07-06)
    const occurDate = new Date(occurredAt);
    const nowDate = new Date('2026-07-06T18:00:00Z');
    const diffTime = Math.max(0, nowDate.getTime() - occurDate.getTime());
    disruptionDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }

  MOCK_TRAFFIC_DISRUPTIONS.push({
    id,
    code,
    roadId: road.id,
    roadName: road.name,
    structureId: structure?.id,
    structureName: structure?.name,
    villageCode,
    villageName,
    incidentType,
    severity,
    affectedArea: `Khu vực sườn đồi Thôn ${String(i % 8 + 1).padStart(2, '0')}`,
    occurredAt,
    reopenedAt,
    disruptionDays,
    description: incidentType === 'landslide' ? 'Đất đá từ taluy dương sạt lở vùi lấp mặt đường gây ách tắc hoàn toàn' :
                 incidentType === 'flooding' ? 'Mưa lớn gây ngập tràn ngầm sâu 1.2m, nước chảy xiết không thể qua lại' :
                 incidentType === 'erosion' ? 'Sạt lở bờ suối làm ăn sâu vào nền đường nhựa 2m' :
                 incidentType === 'bridgeDamage' ? 'Đứt cáp neo cầu treo làm nghiêng nhịp cầu treo gỗ' : 'Mặt đường đất bị xói lún, lầy lội xe máy không đi lại được',
    status,
    createdAt: occurredAt,
    updatedAt: reopenedAt || occurredAt
  });
}

// 4. GENERATE MAINTENANCE PLANS (24 records)
export const MOCK_ROAD_MAINTENANCE_PLANS: RoadMaintenancePlan[] = [];
const fundingSources = ['communeBudget', 'districtBudget', 'newRuralProgram', 'other'] as const;
const progressStates: MaintenanceProgress[] = ['planned', 'approved', 'inProgress', 'completed', 'delayed'];

for (let i = 0; i < 24; i++) {
  const id = `plan-${i + 1}`;
  const code = `MP-${String(i + 1).padStart(3, '0')}`;
  
  const isRoad = i % 2 === 0;
  const road = MOCK_ROADS[i % 24];
  const structure = !isRoad ? MOCK_TRANSPORT_STRUCTURES[i % 32] : undefined;

  const villageCode = road.villageCodes[0];
  const villageName = road.villageNames[0];

  const estimatedBudgetVnd = rng.range(20, 800) * 1000000; // 20M to 800M VND
  const fundingSource = fundingSources[i % fundingSources.length];
  const progress = progressStates[i % progressStates.length];

  const year = 2026;
  const startMonth = rng.range(1, 9);
  const startDay = rng.range(1, 28);
  const plannedStartDate = `${year}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
  const plannedCompletionDate = `${year}-${String(startMonth + 3).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
  
  const actualCompletionDate = progress === 'completed' ? plannedCompletionDate : undefined;

  MOCK_ROAD_MAINTENANCE_PLANS.push({
    id,
    code,
    targetType: isRoad ? 'road' : 'structure',
    roadId: road.id,
    roadName: road.name,
    structureId: structure?.id,
    structureName: structure?.name,
    villageCode,
    villageName,
    workItems: isRoad ? ['Gia cố hành lang', 'Đổ bê tông mặt đường', 'Khơi thông cống rãnh'] : ['Sửa cáp neo cầu treo', 'Sơn chống rỉ lan can', 'Lát tấm chống trượt'],
    estimatedBudgetVnd,
    fundingSource,
    implementingUnit: i % 2 === 0 ? 'Công ty Xây dựng Nam Quảng Trị' : 'Hợp tác xã dịch vụ xây dựng Lao Bảo',
    progress,
    plannedStartDate,
    plannedCompletionDate,
    actualCompletionDate,
    note: progress === 'delayed' ? 'Chưa được giải ngân nguồn vốn đối ứng' : undefined,
    createdAt: `${year}-01-10T08:00:00Z`,
    updatedAt: `${year}-06-20T17:00:00Z`
  });
}

// 5. GENERATE TRAFFIC SAFETY RECORDS (12 records)
export const MOCK_TRAFFIC_SAFETY_RECORDS: TrafficSafetyRecord[] = [];

for (let i = 1; i <= 12; i++) {
  const totalIncidents = rng.range(0, 4);
  const resolvedIncidents = totalIncidents > 0 ? rng.range(0, totalIncidents) : 0;
  const unresolvedIncidents = totalIncidents - resolvedIncidents;

  MOCK_TRAFFIC_SAFETY_RECORDS.push({
    id: `safety-${i}`,
    code: `TS-${String(i).padStart(3, '0')}`,
    month: i,
    year: 2026,
    totalIncidents,
    resolvedIncidents,
    unresolvedIncidents,
    description: totalIncidents > 0 ? `Ghi nhận va chạm xe máy nhỏ do đường trơn trượt mùa mưa, xã đã tiến hành rà soát cắm biển báo.` : 'Tình hình trật tự an toàn giao thông ổn định.',
    createdAt: `2026-${String(i).padStart(2, '0')}-28T09:00:00Z`,
    updatedAt: `2026-${String(i).padStart(2, '0')}-30T17:00:00Z`
  });
}

// 6. SUMMARY STATS COMPUTE FUNCTION
export function getTransportationSummary(hamletCode?: string): TransportationSummary {
  // Filter roads
  const filteredRoads = hamletCode && hamletCode !== 'all'
    ? MOCK_ROADS.filter(r => r.villageCodes.includes(hamletCode))
    : MOCK_ROADS;

  // Filter structures
  const filteredStructures = hamletCode && hamletCode !== 'all'
    ? MOCK_TRANSPORT_STRUCTURES.filter(s => s.villageCode === hamletCode)
    : MOCK_TRANSPORT_STRUCTURES;

  // Filter disruptions
  const filteredDisruptions = hamletCode && hamletCode !== 'all'
    ? MOCK_TRAFFIC_DISRUPTIONS.filter(d => d.villageCode === hamletCode)
    : MOCK_TRAFFIC_DISRUPTIONS;

  // Filter maintenance plans
  const filteredPlans = hamletCode && hamletCode !== 'all'
    ? MOCK_ROAD_MAINTENANCE_PLANS.filter(p => p.villageCode === hamletCode)
    : MOCK_ROAD_MAINTENANCE_PLANS;

  // Compute metrics
  const totalRoads = filteredRoads.length;
  const totalRoadLengthKm = Number(filteredRoads.reduce((sum, r) => sum + r.lengthKm, 0).toFixed(1));

  const asphaltOrConcreteLength = filteredRoads
    .filter(r => r.surfaceType === 'concrete' || r.surfaceType === 'asphalt')
    .reduce((sum, r) => sum + r.lengthKm, 0);
  
  const concreteOrAsphaltRate = totalRoadLengthKm > 0 
    ? Number(((asphaltOrConcreteLength / totalRoadLengthKm) * 100).toFixed(1)) 
    : 0;

  const totalStructures = filteredStructures.length;
  const degradedStructures = filteredStructures.filter(s => s.condition === 'degraded').length;
  const dangerousStructures = filteredStructures.filter(s => s.condition === 'dangerous').length;

  const openDisruptions = filteredDisruptions.filter(d => d.status === 'open').length;
  const totalDisruptionDaysThisYear = filteredDisruptions
    .filter(d => d.occurredAt.startsWith('2026'))
    .reduce((sum, d) => sum + d.disruptionDays, 0);

  const maintenancePlansInProgress = filteredPlans.filter(p => p.progress === 'inProgress').length;
  
  const trafficSafetyIncidentsThisYear = MOCK_TRAFFIC_SAFETY_RECORDS
    .reduce((sum, s) => sum + s.totalIncidents, 0);

  return {
    totalRoads,
    totalRoadLengthKm,
    concreteOrAsphaltRate,
    totalStructures,
    degradedStructures,
    dangerousStructures,
    openDisruptions,
    totalDisruptionDaysThisYear,
    maintenancePlansInProgress,
    trafficSafetyIncidentsThisYear
  };
}
