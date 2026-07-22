'use client';

import * as React from 'react';
import { Breadcrumbs } from '@/components/common';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { CatalogTabs } from './components/catalog-tabs';
import { CatalogFormDialog, CatalogTabType } from './components/catalog-form-dialog';
import { CatalogTableItem } from './components/catalog-table';
import { MOCK_HAMLETS } from '@/data/mock-administrative-units';
import { MOCK_CROP_TYPES, MOCK_LIVESTOCK_TYPES, MOCK_LAND_TYPES, MOCK_SEASONS, MOCK_ETHNICITIES } from '@/data/mock-catalogs';
import { toast } from 'sonner';

// Mock Poverty criteria
const MOCK_POVERTY = [
  { code: 'poor', name: 'Hộ nghèo', threshold: 'Dưới 1.500.000đ/người/tháng', description: 'Định mức chuẩn nghèo đa chiều khu vực nông thôn.' },
  { code: 'nearPoor', name: 'Hộ cận nghèo', threshold: 'Dưới 2.000.000đ/người/tháng', description: 'Định mức chuẩn cận nghèo đa chiều khu vực nông thôn.' },
  { code: 'average', name: 'Hộ trung bình', threshold: 'Từ 2.000.000đ đến 5.000.000đ/người/tháng', description: 'Mức sống ổn định trung bình, cơ sở hạ tầng cơ bản.' },
  { code: 'betterOff', name: 'Hộ khá/giàu', threshold: 'Trên 5.000.000đ/người/tháng', description: 'Thu nhập cao, có tích lũy tài sản và đầu tư sản xuất.' },
];

// Enrich hamlets with attributes for catalog view
const ENRICHED_HAMLETS = MOCK_HAMLETS.map((h, idx) => {
  const ethnicities = ['Vân Kiều', 'Vân Kiều', 'Pa Cô', 'Pa Cô', 'M\'Nông', 'Vân Kiều', 'Pa Cô', 'M\'Nông'];
  const descriptions = [
    'Cao điểm cà phê Arabica đặc chủng, độ dốc lớn',
    'Vùng trồng Chuối Lao Bảo trọng điểm của thôn',
    'Vực lúa rẫy sông Tranh, thuận tiện chăn nuôi',
    'Địa giới lâm nghiệp bảo vệ rừng phòng hộ đầu nguồn',
    'Địa hình chăn nuôi trâu bò bản địa thả rông',
    'Thượng nguồn bảo vệ suối đặc dụng, trồng thảo dược',
    'Canh tác chăn nuôi dê núi tự nhiên đồi cỏ tranh',
    'Vùng phát triển rau lủi đồi dốc hữu cơ sạch',
  ];
  return {
    ...h,
    ethnicity: ethnicities[idx] || 'Vân Kiều',
    description: descriptions[idx] || 'Vùng đồi núi canh tác nông nghiệp',
  };
});

export default function CatalogsPage() {
  const [activeTab, setActiveTab] = React.useState<CatalogTabType>('hamlet');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<CatalogTableItem | null>(null);

  // Lists state
  const [hamlets, setHamlets] = React.useState(ENRICHED_HAMLETS);
  const [crops, setCrops] = React.useState(MOCK_CROP_TYPES);
  const [livestock, setLivestock] = React.useState(MOCK_LIVESTOCK_TYPES);
  const [lands, setLands] = React.useState(MOCK_LAND_TYPES);
  const [seasons, setSeasons] = React.useState(MOCK_SEASONS);
  const [poverty, setPoverty] = React.useState(MOCK_POVERTY);
  const [ethnicities, setEthnicities] = React.useState(MOCK_ETHNICITIES);

  const handleAddClick = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tab: CatalogTabType, item: CatalogTableItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (tab: CatalogTabType, item: CatalogTableItem) => {
    // Delete simulation
    toast.success('Xóa danh mục thành công!', {
      description: `Đã xóa bản ghi ${item.name || item.code} khỏi danh mục.`,
    });
  };

  const catalogData = React.useMemo(() => ({
    hamlet: hamlets,
    crop: crops,
    livestock: livestock,
    land: lands,
    season: seasons,
    poverty: poverty,
    ethnicity: ethnicities,
  }), [hamlets, crops, livestock, lands, seasons, poverty, ethnicities]);

  const getButtonText = () => {
    switch (activeTab) {
      case 'hamlet': return 'Thêm Thôn';
      case 'crop': return 'Thêm loại cây trồng';
      case 'livestock': return 'Thêm loại vật nuôi';
      case 'land': return 'Thêm loại đất';
      case 'season': return 'Thêm vụ canh tác';
      case 'poverty': return 'Thêm phân loại';
      case 'ethnicity': return 'Thêm Dân tộc';
      default: return 'Thêm danh mục';
    }
  };

  const actions = (
    <Button size="sm" onClick={handleAddClick} className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold">
      <Plus className="size-4" />
      {getButtonText()}
    </Button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Breadcrumbs */}
      <Breadcrumbs />

      {/* Page Header */}
      <PageHeader
        title="Danh mục hệ thống"
        description="Quản lý các danh mục nền dùng chung cho toàn hệ thống: thôn, loại cây trồng, vật nuôi, phân loại đất, mùa vụ và các tiêu chí nghèo đói tại xã Lao Bảo"
        actions={actions}
      />

      {/* Catalog tabs layout */}
      <CatalogTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        catalogData={catalogData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Dialog Form */}
      <CatalogFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabType={activeTab}
        editingItem={editingItem}
      />
    </div>
  );
}
