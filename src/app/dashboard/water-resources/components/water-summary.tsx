'use client';

import * as React from 'react';
import { MetricCard } from '@/components/common';
import { 
  Droplet, 
  Waves, 
  ShowerHead, 
  Building2, 
  Home, 
  Wrench 
} from 'lucide-react';
import { 
  MOCK_GROUNDWATER_PERMITS, 
  MOCK_CLEAN_WATER_USAGE, 
  MOCK_HYGIENIC_WATER_USAGE, 
  MOCK_CENTRALIZED_WATER_FACILITIES, 
  MOCK_SMALL_WATER_FACILITIES, 
  MOCK_WATER_TREATMENT_SYSTEMS 
} from '@/data/mock-water-resources';
import { MOCK_HAMLETS } from '@/data/mock-administrative-units';

interface WaterSummaryProps {
  selectedHamletCode: string;
}

export function WaterSummary({ selectedHamletCode }: WaterSummaryProps) {
  // 1. Groundwater Permits
  const permits = MOCK_GROUNDWATER_PERMITS.filter(
    r => selectedHamletCode === 'all' || r.villageCode === selectedHamletCode
  );
  const activePermits = permits.filter(r => r.status === 'active').length;

  // 2. Clean Water Usage
  const cleanWaterData = MOCK_CLEAN_WATER_USAGE.filter(
    r => selectedHamletCode === 'all' || r.villageCode === selectedHamletCode
  );
  const totalCleanHh = cleanWaterData.reduce((sum, r) => sum + r.totalHouseholds, 0);
  const cleanHh = cleanWaterData.reduce((sum, r) => sum + r.cleanWaterHouseholds, 0);
  const cleanRate = totalCleanHh > 0 ? Number(((cleanHh / totalCleanHh) * 100).toFixed(1)) : 0;

  // 3. Hygienic Water Usage
  const hygienicWaterData = MOCK_HYGIENIC_WATER_USAGE.filter(
    r => selectedHamletCode === 'all' || r.villageCode === selectedHamletCode
  );
  const totalHygienicHh = hygienicWaterData.reduce((sum, r) => sum + r.totalHouseholds, 0);
  const hygienicHh = hygienicWaterData.reduce((sum, r) => sum + r.hygienicWaterHouseholds, 0);
  const hygienicRate = totalHygienicHh > 0 ? Number(((hygienicHh / totalHygienicHh) * 100).toFixed(1)) : 0;

  // 4. Centralized Water Facilities
  const centralized = MOCK_CENTRALIZED_WATER_FACILITIES.filter(
    r => selectedHamletCode === 'all' || r.villageCode === selectedHamletCode
  );
  const activeCentralized = centralized.filter(r => r.status === 'active').length;

  // 5. Small Water Facilities
  const small = MOCK_SMALL_WATER_FACILITIES.filter(
    r => selectedHamletCode === 'all' || r.villageCode === selectedHamletCode
  );
  const hygienicSmall = small.filter(r => r.isHygienic).length;

  // 6. Water Treatment Systems
  const currentHamlet = MOCK_HAMLETS.find(h => h.code === selectedHamletCode);
  const systems = MOCK_WATER_TREATMENT_SYSTEMS.filter(r => {
    if (selectedHamletCode === 'all') return true;
    return currentHamlet ? r.location.includes(currentHamlet.name) : true;
  });
  const activeSystems = systems.filter(r => r.status === 'active').length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <MetricCard
        title="Hồ sơ nước dưới đất"
        value={`${activePermits} hồ sơ`}
        description={`Tổng số: ${permits.length} giấy phép`}
        icon={<Waves className="size-4 text-blue-500" />}
      />

      <MetricCard
        title="Hộ dùng nước sạch"
        value={`${cleanRate}%`}
        description={`Đạt: ${cleanHh}/${Math.round(totalCleanHh)} hộ dân`}
        icon={<Droplet className="size-4 text-sky-500" />}
      />

      <MetricCard
        title="Hộ dùng nước hợp vệ sinh"
        value={`${hygienicRate}%`}
        description={`Đạt: ${hygienicHh}/${Math.round(totalHygienicHh)} hộ`}
        icon={<ShowerHead className="size-4 text-indigo-500" />}
      />

      <MetricCard
        title="Trạm cấp nước tập trung"
        value={`${centralized.length} trạm`}
        description={`Đang hoạt động: ${activeCentralized} trạm`}
        icon={<Building2 className="size-4 text-cyan-500" />}
      />

      <MetricCard
        title="Công trình nhỏ lẻ"
        value={`${small.length} giếng/bể`}
        description={`Hợp vệ sinh: ${hygienicSmall} giếng`}
        icon={<Home className="size-4 text-teal-500" />}
      />

      <MetricCard
        title="Hệ thống xử lý nước"
        value={`${systems.length} hệ thống`}
        description={`Vận hành ổn định: ${activeSystems}`}
        icon={<Wrench className="size-4 text-emerald-500" />}
      />
    </div>
  );
}
