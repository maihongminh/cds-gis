import { DashboardSummary, DashboardMetricSummary, HamletMetricSummary, DashboardAlert } from '@/types/dashboard';
import { MOCK_HOUSEHOLDS } from './mock-households';
import { MOCK_CROPS } from './mock-crops';
import { MOCK_LIVESTOCK } from './mock-livestock';
import { MOCK_LANDS } from './mock-lands';
import { MOCK_FOREST_DVMTR } from './mock-forest-dvmtr';
import { MOCK_HOUSEHOLD_ECONOMY } from './mock-household-economy';
import { MOCK_HAMLETS } from './mock-administrative-units';
import { MOCK_CROP_TYPES, MOCK_LIVESTOCK_TYPES } from './mock-catalogs';

// Import v1.1 Mock Data
import { MOCK_WASTE_RECORDS, MOCK_WASTE_CLASSIFICATION, MOCK_WASTE_TREATMENT_HOUSEHOLDS, MOCK_ENV_PERMITS } from './mock-environment';
import { MOCK_CLEAN_WATER_USAGE, MOCK_HYGIENIC_WATER_USAGE, MOCK_CENTRALIZED_WATER_FACILITIES, MOCK_SMALL_WATER_FACILITIES, MOCK_GROUNDWATER_PERMITS } from './mock-water-resources';
import { MOCK_DISASTER_EVENTS, MOCK_AGRI_RISK_ALERTS } from './mock-climate';
import { MOCK_HOUSING_RECORDS, MOCK_HOUSING_SUPPORTS, MOCK_HOUSING_SUPPORT_NEEDS } from './mock-housing';
import { MOCK_BUSINESS_HOUSEHOLDS, MOCK_BUSINESS_REVENUES, MOCK_NON_AGRI_LABORS } from './mock-business-households';
import { MOCK_IRRIGATION_FACILITIES } from './mock-irrigation';
import { getTransportationSummary, MOCK_TRAFFIC_DISRUPTIONS, MOCK_TRANSPORT_STRUCTURES } from './mock-transportation';

export function getDashboardSummary(hamletCode?: string): DashboardSummary {
  // 1. Filter households based on hamletCode
  const filteredHouseholds = hamletCode
    ? MOCK_HOUSEHOLDS.filter(hh => hh.hamletCode === hamletCode)
    : MOCK_HOUSEHOLDS;
    
  const hhIds = new Set(filteredHouseholds.map(hh => hh.id));

  // Get Transportation Summary
  const transSummary = getTransportationSummary(hamletCode);

  // 2. Filter related records
  const filteredCrops = MOCK_CROPS.filter(c => hhIds.has(c.householdId) && c.status === 'active');
  const filteredLivestock = MOCK_LIVESTOCK.filter(l => hhIds.has(l.householdId) && l.status === 'active');
  const filteredForest = MOCK_FOREST_DVMTR.filter(f => hhIds.has(f.householdId) && f.status === 'active');
  const filteredEconomy = MOCK_HOUSEHOLD_ECONOMY.filter(e => hhIds.has(e.householdId) && e.status === 'active');

  // 3. Compute metrics
  const totalHouseholds = filteredHouseholds.length;
  
  // Sum area for the latest season '2026-XH' to avoid double counting across years
  const totalCropsAreaHa = Number(
    filteredCrops
      .filter(c => c.seasonYear === '2026-XH')
      .reduce((sum, c) => sum + c.areaHa, 0)
      .toFixed(2)
  );
  
  const totalLivestockCount = filteredLivestock.reduce((sum, l) => sum + l.quantity, 0);
  const totalForestContractedAreaHa = Number(
    filteredForest.reduce((sum, f) => sum + f.contractedAreaHa, 0).toFixed(2)
  );
  
  const totalAnnualRevenue = filteredEconomy.reduce((sum, e) => sum + e.totalRevenue, 0);
  const totalAnnualCost = filteredEconomy.reduce((sum, e) => sum + e.totalCost, 0);
  const totalNetIncome = filteredEconomy.reduce((sum, e) => sum + e.netIncome, 0);
  
  const totalDvmtrPaid = filteredForest
    .filter(f => f.paymentStatus === 'paid')
    .reduce((sum, f) => sum + f.totalAmount, 0);

  const totalMembers = filteredHouseholds.reduce((sum, hh) => sum + hh.memberCount, 0);
  const averageIncomePerCapita = totalMembers > 0 ? Math.round(totalNetIncome / totalMembers) : 0;

  // Poverty classifications
  let poorHouseholdsCount = 0;
  let nearPoorHouseholdsCount = 0;
  let averageHouseholdsCount = 0;
  let betterOffHouseholdsCount = 0;

  filteredHouseholds.forEach((hh) => {
    if (hh.economicClassification === 'poor') poorHouseholdsCount++;
    else if (hh.economicClassification === 'nearPoor') nearPoorHouseholdsCount++;
    else if (hh.economicClassification === 'average') averageHouseholdsCount++;
    else if (hh.economicClassification === 'betterOff') betterOffHouseholdsCount++;
  });

  const povertyRate = totalHouseholds > 0 ? Number(((poorHouseholdsCount / totalHouseholds) * 100).toFixed(1)) : 0;
  const nearPovertyRate = totalHouseholds > 0 ? Number(((nearPoorHouseholdsCount / totalHouseholds) * 100).toFixed(1)) : 0;

  // === v1.1 Computations ===
  const activeHamlet = hamletCode ? MOCK_HAMLETS.find(h => h.code === hamletCode) : undefined;
  const activeHamletName = activeHamlet?.name;

  // Environment
  const envWasteRecords = hamletCode
    ? MOCK_WASTE_RECORDS.filter(r => r.villageCode === hamletCode && r.month === 6 && r.year === 2026)
    : MOCK_WASTE_RECORDS.filter(r => r.month === 6 && r.year === 2026);
  const totalWasteTonsMonth = Number(envWasteRecords.reduce((sum, r) => sum + r.totalWasteTons, 0).toFixed(2));
  const totalWasteCollected = envWasteRecords.reduce((sum, r) => sum + r.collectedTons, 0);
  const wasteCollectionRate = totalWasteTonsMonth > 0 ? Number(((totalWasteCollected / totalWasteTonsMonth) * 100).toFixed(1)) : 0;

  const envClassRecords = hamletCode
    ? MOCK_WASTE_CLASSIFICATION.filter(r => r.villageCode === hamletCode && r.month === 6 && r.year === 2026)
    : MOCK_WASTE_CLASSIFICATION.filter(r => r.month === 6 && r.year === 2026);
  const totalClassHh = envClassRecords.reduce((sum, r) => sum + r.householdCount, 0);
  const classifiedHh = envClassRecords.reduce((sum, r) => sum + r.classifiedCount, 0);
  const wasteClassificationRate = totalClassHh > 0 ? Number(((classifiedHh / totalClassHh) * 100).toFixed(1)) : 0;

  const centralizedWasteTreatmentCount = MOCK_WASTE_TREATMENT_HOUSEHOLDS.filter(
    r => (!hamletCode || r.villageCode === hamletCode) && r.treatmentMethod === 'centralized'
  ).length;

  const envPermitsActiveCount = MOCK_ENV_PERMITS.filter(
    r => (!hamletCode || r.villageCode === hamletCode) && r.status === 'active'
  ).length;

  // Water Resource
  const waterCleanRecords = hamletCode
    ? MOCK_CLEAN_WATER_USAGE.filter(r => r.villageCode === hamletCode && r.year === 2026)
    : MOCK_CLEAN_WATER_USAGE.filter(r => r.year === 2026);
  const waterCleanTotalHh = waterCleanRecords.reduce((sum, r) => sum + r.totalHouseholds, 0);
  const cleanWaterHh = waterCleanRecords.reduce((sum, r) => sum + r.cleanWaterHouseholds, 0);
  const cleanWaterUsageRate = waterCleanTotalHh > 0 ? Number(((cleanWaterHh / waterCleanTotalHh) * 100).toFixed(1)) : 0;

  const waterHygienicRecords = hamletCode
    ? MOCK_HYGIENIC_WATER_USAGE.filter(r => r.villageCode === hamletCode && r.year === 2026)
    : MOCK_HYGIENIC_WATER_USAGE.filter(r => r.year === 2026);
  const waterHygienicTotalHh = waterHygienicRecords.reduce((sum, r) => sum + r.totalHouseholds, 0);
  const hygienicWaterHh = waterHygienicRecords.reduce((sum, r) => sum + r.hygienicWaterHouseholds, 0);
  const hygienicWaterUsageRate = waterHygienicTotalHh > 0 ? Number(((hygienicWaterHh / waterHygienicTotalHh) * 100).toFixed(1)) : 0;

  const centralizedWaterFacilityCount = MOCK_CENTRALIZED_WATER_FACILITIES.filter(
    r => (!hamletCode || r.villageCode === hamletCode) && r.status === 'active'
  ).length;

  const smallWaterFacilityCount = MOCK_SMALL_WATER_FACILITIES.filter(
    r => (!hamletCode || r.villageCode === hamletCode) && r.status === 'active'
  ).length;

  const groundwaterPermitCount = MOCK_GROUNDWATER_PERMITS.filter(
    r => (!hamletCode || r.villageCode === hamletCode) && r.status === 'active'
  ).length;

  // Climate
  const climateEvents = MOCK_DISASTER_EVENTS.filter(
    r => r.eventDate.startsWith('2026') && (!activeHamletName || r.affectedHamlets.includes(activeHamletName))
  );
  const disasterEventsCountYear = climateEvents.length;
  const disasterDamageEstimate = climateEvents.reduce((sum, r) => sum + r.estimatedDamageVnd, 0);

  const activeRiskAlertsCount = MOCK_AGRI_RISK_ALERTS.filter(
    r => r.status === 'active' && (!activeHamletName || r.affectedHamlets.includes(activeHamletName))
  ).length;

  // Housing
  const houseRecords = MOCK_HOUSING_RECORDS.filter(r => !hamletCode || r.villageCode === hamletCode);
  const solidHouseCount = houseRecords.filter(r => r.housingType === 'kiên cố' || r.housingType === 'bán kiên cố').length;
  const solidHouseholdsPercent = houseRecords.length > 0 ? Number(((solidHouseCount / houseRecords.length) * 100).toFixed(1)) : 0;

  const needsHousingSupportCount = MOCK_HOUSING_SUPPORT_NEEDS.filter(
    r => (!hamletCode || r.villageCode === hamletCode) && r.status === 'pending'
  ).length;

  const housingSupportGivenCount = MOCK_HOUSING_SUPPORTS.filter(
    r => (!hamletCode || r.villageCode === hamletCode) && r.status === 'completed' && r.year === 2026
  ).length;

  // Business Household
  const activeBusinesses = MOCK_BUSINESS_HOUSEHOLDS.filter(
    r => (!hamletCode || r.villageCode === hamletCode) && r.isActive
  );
  const businessHouseholdsCount = activeBusinesses.length;
  const registeredBizCount = activeBusinesses.filter(r => r.hasRegistration).length;
  const businessRegistrationRate = businessHouseholdsCount > 0 ? Number(((registeredBizCount / businessHouseholdsCount) * 100).toFixed(1)) : 0;

  const bizIds = new Set(activeBusinesses.map(r => r.id));
  const q2Revenues = MOCK_BUSINESS_REVENUES.filter(r => bizIds.has(r.businessId) && r.period === 'Quý 2/2026');
  const totalBusinessRevenueEstimate = Number((q2Revenues.reduce((sum, r) => sum + r.estimatedRevenueVnd, 0) / 1e9).toFixed(3)); // in Billion VND

  const nonAgLaborRecords = MOCK_NON_AGRI_LABORS.filter(r => !hamletCode || r.villageCode === hamletCode);
  const nonAgLaborCount = nonAgLaborRecords.reduce((sum, r) => sum + r.nonAgriculturalLaborCount, 0);

  // Irrigation
  const irrigationFacilities = MOCK_IRRIGATION_FACILITIES.filter(r => !hamletCode || r.villageCode === hamletCode);
  const irrigationFacilityCount = irrigationFacilities.length;
  const irrigationNeedsRepairCount = irrigationFacilities.filter(r => r.status === 'needsRepair').length;
  const irrigationDamagedCount = irrigationFacilities.filter(r => r.status === 'damaged').length;
  const irrigationAreaHa = irrigationFacilities.reduce((sum, r) => sum + r.irrigatedAreaHa, 0);

  const metrics: DashboardMetricSummary = {
    totalHouseholds,
    totalCropsAreaHa,
    totalLivestockCount,
    totalForestContractedAreaHa,
    totalAnnualRevenue,
    totalAnnualCost,
    totalNetIncome,
    totalDvmtrPaid,
    averageIncomePerCapita,
    poorHouseholdsCount,
    nearPoorHouseholdsCount,
    averageHouseholdsCount,
    betterOffHouseholdsCount,
    povertyRate,
    nearPovertyRate,
    // v1.1
    totalWasteTonsMonth,
    wasteCollectionRate,
    wasteClassificationRate,
    centralizedWasteTreatmentCount,
    envPermitsActiveCount,
    cleanWaterUsageRate,
    hygienicWaterUsageRate,
    centralizedWaterFacilityCount,
    smallWaterFacilityCount,
    groundwaterPermitCount,
    disasterEventsCountYear,
    disasterDamageEstimate,
    activeRiskAlertsCount,
    solidHouseholdsPercent,
    needsHousingSupportCount,
    housingSupportGivenCount,
    businessHouseholdsCount,
    businessRegistrationRate,
    totalBusinessRevenueEstimate,
    nonAgLaborCount,
    irrigationFacilityCount,
    irrigationNeedsRepairCount,
    irrigationDamagedCount,
    irrigationAreaHa,
    // Transportation
    totalRoads: transSummary.totalRoads,
    totalRoadLengthKm: transSummary.totalRoadLengthKm,
    concreteOrAsphaltRate: transSummary.concreteOrAsphaltRate,
    totalStructures: transSummary.totalStructures,
    degradedStructures: transSummary.degradedStructures,
    dangerousStructures: transSummary.dangerousStructures,
    openDisruptions: transSummary.openDisruptions,
    totalDisruptionDaysThisYear: transSummary.totalDisruptionDaysThisYear,
    maintenancePlansInProgress: transSummary.maintenancePlansInProgress,
    trafficSafetyIncidentsThisYear: transSummary.trafficSafetyIncidentsThisYear,
  };

  // 4. Hamlet distribution comparisons
  const hamletDistribution: HamletMetricSummary[] = MOCK_HAMLETS.map((hamlet) => {
    const hamletHhs = MOCK_HOUSEHOLDS.filter(hh => hh.hamletCode === hamlet.code);
    const hIds = new Set(hamletHhs.map(h => h.id));
    
    const hCrops = MOCK_CROPS.filter(c => hIds.has(c.householdId) && c.seasonYear === '2026-XH' && c.status === 'active');
    const hLive = MOCK_LIVESTOCK.filter(l => hIds.has(l.householdId) && l.status === 'active');
    const hForest = MOCK_FOREST_DVMTR.filter(f => hIds.has(f.householdId) && f.status === 'active');
    const hEcon = MOCK_HOUSEHOLD_ECONOMY.filter(e => hIds.has(e.householdId) && e.status === 'active');
    
    const hMembers = hamletHhs.reduce((sum, h) => sum + h.memberCount, 0);
    const hNet = hEcon.reduce((sum, e) => sum + e.netIncome, 0);
    const hPoor = hamletHhs.filter(h => h.economicClassification === 'poor').length;
    
    return {
      hamletCode: hamlet.code,
      hamletName: hamlet.name,
      totalHouseholds: hamletHhs.length,
      totalCropsAreaHa: Number(hCrops.reduce((sum, c) => sum + c.areaHa, 0).toFixed(2)),
      totalLivestockCount: hLive.reduce((sum, l) => sum + l.quantity, 0),
      totalForestContractedAreaHa: Number(hForest.reduce((sum, f) => sum + f.contractedAreaHa, 0).toFixed(2)),
      povertyRate: hamletHhs.length > 0 ? Number(((hPoor / hamletHhs.length) * 100).toFixed(1)) : 0,
      averageIncomePerCapita: hMembers > 0 ? Math.round(hNet / hMembers) : 0,
    };
  });

  // 5. Dynamic Alerts
  const alerts: DashboardAlert[] = [];
  
  // A. Check livestock diseases
  const diseaseAnimals = filteredLivestock.filter(l => l.diseaseQuantity > 0);
  diseaseAnimals.forEach((l) => {
    const hh = filteredHouseholds.find(h => h.id === l.householdId);
    alerts.push({
      id: `alert-live-${l.id}`,
      type: 'disease',
      severity: l.diseaseQuantity >= 5 ? 'critical' : 'warning',
      title: 'Dịch bệnh gia súc',
      message: `${hh ? hh.hamletName : 'Thôn bản'}: Phát hiện ổ dịch ${l.diseaseType || 'truyền nhiễm'} trên đàn ${l.livestockTypeName} của hộ ${l.householdHeadName} (${l.diseaseQuantity} con bị nhiễm).`,
      date: l.updatedAt.split('T')[0],
      resolved: false,
    });
  });

  // B. Check crop diseases
  const diseaseCrops = filteredCrops.filter(c => c.diseaseStatus === 'monitoring');
  diseaseCrops.forEach((c) => {
    const hh = filteredHouseholds.find(h => h.id === c.householdId);
    alerts.push({
      id: `alert-crop-${c.id}`,
      type: 'disease',
      severity: 'warning',
      title: 'Cây trồng nhiễm bệnh',
      message: `${hh ? hh.hamletName : 'Thôn bản'}: Cây đặc sản ${c.cropTypeName} của hộ ${c.householdHeadName} đang theo dõi bệnh dịch hại trên diện tích ${c.areaHa} Ha.`,
      date: c.updatedAt.split('T')[0],
      resolved: false,
    });
  });

  // C. High poverty rate alert (if hamlet filtered or default)
  if (hamletCode) {
    const activeHamletObj = MOCK_HAMLETS.find(h => h.code === hamletCode);
    const poorRate = povertyRate;
    if (poorRate > 45 && activeHamletObj) {
      alerts.push({
        id: `alert-pov-${hamletCode}`,
        type: 'poverty',
        severity: 'info',
        title: 'Tỷ lệ nghèo cao',
        message: `${activeHamletObj.name} có tỷ lệ hộ nghèo là ${poorRate}%, vượt mức trung bình xã. Cần tăng cường ưu tiên các chính sách hỗ trợ phát triển kinh tế vườn sâm và rừng DVMTR.`,
        date: '2026-06-15',
        resolved: false,
      });
    }
  } else {
    // Check if any hamlet has poverty rate > 50%
    hamletDistribution.forEach((hd) => {
      if (hd.povertyRate > 45) {
        alerts.push({
          id: `alert-pov-${hd.hamletCode}`,
          type: 'poverty',
          severity: 'info',
          title: 'Điểm nóng nghèo đói',
          message: `${hd.hamletName} có tỷ lệ hộ nghèo rất cao (${hd.povertyRate}%). Khuyến nghị đẩy mạnh vay vốn ưu đãi trồng cà phê Arabica và chuối Lao Bảo.`,
          date: '2026-06-15',
          resolved: false,
        });
      }
    });
  }

  // D. Add new v1.1 Alerts
  // Irrigation Needs Repair
  const needingRepairIrr = irrigationFacilities.filter(r => r.status === 'needsRepair' || r.status === 'damaged');
  needingRepairIrr.forEach((fac) => {
    alerts.push({
      id: `alert-irr-${fac.id}`,
      type: 'land', // Map irrigation to land/infrastructure alerts
      severity: fac.status === 'damaged' ? 'critical' : 'warning',
      title: 'Công trình thủy lợi xuống cấp',
      message: `${fac.villageName}: Công trình "${fac.name}" đang bị ${fac.status === 'damaged' ? 'hư hỏng nặng' : 'xuống cấp cần sửa chữa'}, ảnh hưởng tưới tiêu cho ${fac.irrigatedAreaHa} ha hoa màu.`,
      date: '2026-06-10',
      resolved: false,
    });
  });

  // Climate Event alert
  climateEvents.forEach((ev) => {
    if (ev.severity === 'high' || ev.status === 'active') {
      alerts.push({
        id: `alert-disaster-${ev.id}`,
        type: 'system',
        severity: ev.severity === 'high' ? 'critical' : 'warning',
        title: `Thiên tai: ${ev.disasterType === 'landslide' ? 'Sạt lở đất' : ev.disasterType === 'flashFlood' ? 'Lũ quét' : 'Bão/Lốc xoáy'}`,
        message: `Khu vực bị ảnh hưởng: ${ev.affectedHamlets.join(', ')}. Thiệt hại ước tính khoảng ${(ev.estimatedDamageVnd / 1e6).toFixed(0)} triệu đồng. Trạng thái khắc phục: ${ev.status === 'active' ? 'Đang ứng phó' : 'Đang xử lý'}.`,
        date: ev.eventDate,
        resolved: false,
      });
    }
  });

  // E. Transportation Alerts
  // 1. Open disruptions
  const activeDisruptions = MOCK_TRAFFIC_DISRUPTIONS.filter(
    d => d.status === 'open' && (!hamletCode || d.villageCode === hamletCode)
  );
  activeDisruptions.forEach((d) => {
    alerts.push({
      id: `alert-disrupt-${d.id}`,
      type: 'system',
      severity: d.severity === 'critical' ? 'critical' : 'warning',
      title: `Chia cắt giao thông: ${d.incidentType === 'landslide' ? 'Sạt lở' : d.incidentType === 'flooding' ? 'Ngập lụt' : 'Sự cố'}`,
      message: `${d.villageName}: Tuyến ${d.roadName || ''} đang bị chia cắt tại ${d.affectedArea}. Số ngày bị tắc: ${d.disruptionDays} ngày.`,
      date: d.occurredAt.split('T')[0],
      resolved: false,
    });
  });

  // 2. Dangerous structures
  const dangerousStructs = MOCK_TRANSPORT_STRUCTURES.filter(
    s => s.condition === 'dangerous' && (!hamletCode || s.villageCode === hamletCode)
  );
  dangerousStructs.forEach((s) => {
    alerts.push({
      id: `alert-struct-dangerous-${s.id}`,
      type: 'land',
      severity: 'critical',
      title: 'Công trình giao thông nguy hiểm',
      message: `${s.villageName}: Cầu/cống "${s.name}" trên tuyến ${s.roadName} đang bị hư hỏng nguy hiểm. Cần hạn chế tải trọng xe qua lại.`,
      date: '2026-06-25',
      resolved: false,
    });
  });

  // 6. Crop distribution grouping
  const cropAreaMap: Record<string, { name: string; area: number }> = {};
  let cropAreaTotal = 0;
  
  filteredCrops.forEach((c) => {
    if (!cropAreaMap[c.cropTypeCode]) {
      cropAreaMap[c.cropTypeCode] = { name: c.cropTypeName, area: 0 };
    }
    cropAreaMap[c.cropTypeCode].area += c.areaHa;
    cropAreaTotal += c.areaHa;
  });

  const cropDistribution = Object.entries(cropAreaMap).map(([code, data]) => ({
    cropTypeCode: code,
    cropTypeName: data.name,
    areaHa: Number(data.area.toFixed(2)),
    percentage: cropAreaTotal > 0 ? Number(((data.area / cropAreaTotal) * 100).toFixed(1)) : 0,
  })).sort((a, b) => b.areaHa - a.areaHa);

  // 7. Livestock distribution grouping
  const liveQtyMap: Record<string, { name: string; qty: number }> = {};
  let liveQtyTotal = 0;

  filteredLivestock.forEach((l) => {
    if (!liveQtyMap[l.livestockTypeCode]) {
      liveQtyMap[l.livestockTypeCode] = { name: l.livestockTypeName, qty: 0 };
    }
    liveQtyMap[l.livestockTypeCode].qty += l.quantity;
    liveQtyTotal += l.quantity;
  });

  const livestockDistribution = Object.entries(liveQtyMap).map(([code, data]) => ({
    livestockTypeCode: code,
    livestockTypeName: data.name,
    quantity: data.qty,
    percentage: liveQtyTotal > 0 ? Number(((data.qty / liveQtyTotal) * 100).toFixed(1)) : 0,
  })).sort((a, b) => b.quantity - a.quantity);

  return {
    communeCode: 'lao-bao',
    communeName: 'Xã Lao Bảo',
    hamletCode,
    metrics,
    hamletDistribution,
    alerts: alerts.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15), // cap at 15 alerts sorted by date descending
    cropDistribution,
    livestockDistribution,
  };
}
