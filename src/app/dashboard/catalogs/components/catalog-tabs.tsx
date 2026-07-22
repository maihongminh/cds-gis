'use client';

import * as React from 'react';
import { CommonTabs } from '@/components/common';
import { CatalogTable, CatalogTableItem } from './catalog-table';
import { CatalogTabType } from './catalog-form-dialog';
import { MapPin, Sprout, Footprints, Landmark, Calendar, Scale, Users } from 'lucide-react';

interface CatalogTabsProps {
  activeTab: CatalogTabType;
  setActiveTab: (tab: CatalogTabType) => void;
  catalogData: {
    hamlet: CatalogTableItem[];
    crop: CatalogTableItem[];
    livestock: CatalogTableItem[];
    land: CatalogTableItem[];
    season: CatalogTableItem[];
    poverty: CatalogTableItem[];
    ethnicity: CatalogTableItem[];
  };
  onEdit: (tab: CatalogTabType, item: CatalogTableItem) => void;
  onDelete: (tab: CatalogTabType, item: CatalogTableItem) => void;
}

export function CatalogTabs({
  activeTab,
  setActiveTab,
  catalogData,
  onEdit,
  onDelete,
}: CatalogTabsProps) {
  const tabs = React.useMemo(() => [
    {
      value: 'hamlet' as const,
      label: 'Thôn',
      icon: <MapPin className="size-4" />,
      content: (
        <CatalogTable
          tabType="hamlet"
          data={catalogData.hamlet}
          onEdit={(item) => onEdit('hamlet', item)}
          onDelete={(item) => onDelete('hamlet', item)}
        />
      ),
    },
    {
      value: 'crop' as const,
      label: 'Loại cây trồng',
      icon: <Sprout className="size-4" />,
      content: (
        <CatalogTable
          tabType="crop"
          data={catalogData.crop}
          onEdit={(item) => onEdit('crop', item)}
          onDelete={(item) => onDelete('crop', item)}
        />
      ),
    },
    {
      value: 'livestock' as const,
      label: 'Loại vật nuôi',
      icon: <Footprints className="size-4" />,
      content: (
        <CatalogTable
          tabType="livestock"
          data={catalogData.livestock}
          onEdit={(item) => onEdit('livestock', item)}
          onDelete={(item) => onDelete('livestock', item)}
        />
      ),
    },
    {
      value: 'land' as const,
      label: 'Loại đất nông nghiệp',
      icon: <Landmark className="size-4" />,
      content: (
        <CatalogTable
          tabType="land"
          data={catalogData.land}
          onEdit={(item) => onEdit('land', item)}
          onDelete={(item) => onDelete('land', item)}
        />
      ),
    },
    {
      value: 'season' as const,
      label: 'Vụ / Năm canh tác',
      icon: <Calendar className="size-4" />,
      content: (
        <CatalogTable
          tabType="season"
          data={catalogData.season}
          onEdit={(item) => onEdit('season', item)}
          onDelete={(item) => onDelete('season', item)}
        />
      ),
    },
    {
      value: 'poverty' as const,
      label: 'Phân loại kinh tế hộ',
      icon: <Scale className="size-4" />,
      content: (
        <CatalogTable
          tabType="poverty"
          data={catalogData.poverty}
          onEdit={(item) => onEdit('poverty', item)}
          onDelete={(item) => onDelete('poverty', item)}
        />
      ),
    },
    {
      value: 'ethnicity' as const,
      label: 'Dân tộc',
      icon: <Users className="size-4" />,
      content: (
        <CatalogTable
          tabType="ethnicity"
          data={catalogData.ethnicity}
          onEdit={(item) => onEdit('ethnicity', item)}
          onDelete={(item) => onDelete('ethnicity', item)}
        />
      ),
    },
  ], [catalogData, onEdit, onDelete]);

  return (
    <CommonTabs
      tabs={tabs}
      defaultValue={activeTab}
      onValueChange={(val) => setActiveTab(val as CatalogTabType)}
    />
  );
}
