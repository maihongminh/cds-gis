'use client';

import * as React from 'react';
import { CommonTabs } from '@/components/common';
import { GroundwaterPermitsTable } from './groundwater-permits-table';
import { WaterUsageTable } from './water-usage-table';
import { WaterFacilitiesTable } from './water-facilities-table';
import { WaterTreatmentTable } from './water-treatment-table';
import {
  GroundwaterPermitRecord,
  CleanWaterUsageRecord,
  HygienicWaterUsageRecord,
  CentralizedWaterFacility,
  SmallWaterFacility,
  WaterTreatmentSystem,
} from '@/types/water-resource';

interface WaterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  userRole: string;

  filteredPermits: GroundwaterPermitRecord[];
  filteredCleanUsage: CleanWaterUsageRecord[];
  filteredHygienicUsage: HygienicWaterUsageRecord[];
  filteredCentralized: CentralizedWaterFacility[];
  filteredSmall: SmallWaterFacility[];
  filteredTreatment: WaterTreatmentSystem[];

  onEditGroundwater: (item: GroundwaterPermitRecord) => void;
  onDeleteGroundwater: (item: GroundwaterPermitRecord) => void;
  onRenewGroundwater: (item: GroundwaterPermitRecord) => void;

  onEditCleanUsage: (item: CleanWaterUsageRecord) => void;
  onEditHygienicUsage: (item: HygienicWaterUsageRecord) => void;

  onEditCentralized: (item: CentralizedWaterFacility) => void;
  onDeleteCentralized: (item: CentralizedWaterFacility) => void;
  onToggleStatusCentral: (item: CentralizedWaterFacility) => void;

  onEditSmall: (item: SmallWaterFacility) => void;
  onDeleteSmall: (item: SmallWaterFacility) => void;
  onToggleStatusSmall: (item: SmallWaterFacility) => void;

  onEditTreatment: (item: WaterTreatmentSystem) => void;
  onDeleteTreatment: (item: WaterTreatmentSystem) => void;
  onMaintainTreatment: (item: WaterTreatmentSystem) => void;
}

export function WaterTabs({
  activeTab,
  onTabChange,
  userRole,
  filteredPermits,
  filteredCleanUsage,
  filteredHygienicUsage,
  filteredCentralized,
  filteredSmall,
  filteredTreatment,
  onEditGroundwater,
  onDeleteGroundwater,
  onRenewGroundwater,
  onEditCleanUsage,
  onEditHygienicUsage,
  onEditCentralized,
  onDeleteCentralized,
  onToggleStatusCentral,
  onEditSmall,
  onDeleteSmall,
  onToggleStatusSmall,
  onEditTreatment,
  onDeleteTreatment,
  onMaintainTreatment,
}: WaterTabsProps) {
  const tabs = React.useMemo(
    () => [
      {
        value: 'groundwater',
        label: 'Nước dưới đất',
        content: (
          <GroundwaterPermitsTable
            data={filteredPermits}
            userRole={userRole}
            onEdit={onEditGroundwater}
            onDelete={onDeleteGroundwater}
            onRenew={onRenewGroundwater}
          />
        ),
      },
      {
        value: 'usage',
        label: 'Sử dụng nước',
        content: (
          <WaterUsageTable
            cleanData={filteredCleanUsage}
            hygienicData={filteredHygienicUsage}
            userRole={userRole}
            onEditClean={onEditCleanUsage}
            onEditHygienic={onEditHygienicUsage}
          />
        ),
      },
      {
        value: 'facilities',
        label: 'Công trình cấp nước',
        content: (
          <WaterFacilitiesTable
            centralizedData={filteredCentralized}
            smallData={filteredSmall}
            userRole={userRole}
            onEditCentralized={onEditCentralized}
            onDeleteCentralized={onDeleteCentralized}
            onEditSmall={onEditSmall}
            onDeleteSmall={onDeleteSmall}
            onToggleStatusCentralized={onToggleStatusCentral}
            onToggleStatusSmall={onToggleStatusSmall}
          />
        ),
      },
      {
        value: 'treatment',
        label: 'Hệ thống xử lý nước',
        content: (
          <WaterTreatmentTable
            data={filteredTreatment}
            userRole={userRole}
            onEdit={onEditTreatment}
            onDelete={onDeleteTreatment}
            onMaintain={onMaintainTreatment}
          />
        ),
      },
    ],
    [
      filteredPermits,
      filteredCleanUsage,
      filteredHygienicUsage,
      filteredCentralized,
      filteredSmall,
      filteredTreatment,
      userRole,
      onEditGroundwater,
      onDeleteGroundwater,
      onRenewGroundwater,
      onEditCleanUsage,
      onEditHygienicUsage,
      onEditCentralized,
      onDeleteCentralized,
      onToggleStatusCentral,
      onEditSmall,
      onDeleteSmall,
      onToggleStatusSmall,
      onEditTreatment,
      onDeleteTreatment,
      onMaintainTreatment,
    ]
  );

  return (
    <CommonTabs
      tabs={tabs}
      defaultValue="groundwater"
      onValueChange={onTabChange}
    />
  );
}
