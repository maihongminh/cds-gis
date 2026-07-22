'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Breadcrumbs,
  PageHeader,
  CommonTabs
} from '@/components/common';
import { Button } from '@/components/ui';
import { Plus, Download } from 'lucide-react';
import { toast } from 'sonner';

// Import v1.1 Housing Components
import { HousingSummary } from './components/housing-summary';
import { HousingFilters } from './components/housing-filters';
import { HousingFormDialog } from './components/housing-form-dialog';
import {
  HousingRecordsTable,
  HousingSupportsTable,
  HousingSupportNeedsTable
} from './components/housing-tables';

// Import Types
import {
  HousingItem,
  HousingRecord,
  HousingSupportRecord,
  HousingSupportNeed
} from '@/types/housing';

// Import Mock Data
import {
  MOCK_HOUSING_RECORDS,
  MOCK_HOUSING_SUPPORTS,
  MOCK_HOUSING_SUPPORT_NEEDS
} from '@/data/mock-housing';

export default function HousingPage() {
  const { selectedHamletCode, currentRole } = useTenant();
  const userRole = currentRole || 'commune_officer';
  const isLeader = userRole === 'leader';

  // Active Tab state
  const [activeTab, setActiveTab] = React.useState<string>('list');

  // Filter states
  const [selectedHamlet, setSelectedHamlet] = React.useState(selectedHamletCode);
  const [selectedHousingType, setSelectedHousingType] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedPriority, setSelectedPriority] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formTabType, setFormTabType] = React.useState('list');
  const [editingItem, setEditingItem] = React.useState<HousingItem | null>(null);

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setSelectedHamlet('all');
    setSelectedHousingType('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
  }, []);

  // Sync form tab type with active tab
  const handleAddClick = () => {
    setEditingItem(null);
    setFormTabType(activeTab);
    setIsFormOpen(true);
  };

  // Filter datasets
  // 1. List
  const filteredRecords = React.useMemo(() => {
    return MOCK_HOUSING_RECORDS.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedHousingType !== 'all' && r.housingType !== selectedHousingType) return false;
      return true;
    });
  }, [selectedHamlet, selectedHousingType]);

  // 2. Support
  const filteredSupports = React.useMemo(() => {
    return MOCK_HOUSING_SUPPORTS.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedHamlet, selectedStatus]);

  // 3. Need
  const filteredNeeds = React.useMemo(() => {
    return MOCK_HOUSING_SUPPORT_NEEDS.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedPriority !== 'all' && r.priorityLevel !== selectedPriority) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedHamlet, selectedPriority, selectedStatus]);

  // Edit / Delete / Action callbacks
  const handleEditItem = (tab: string, item: HousingItem) => {
    setEditingItem(item);
    setFormTabType(tab);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (item: HousingItem) => {
    toast.success('Xóa dữ liệu thành công!', {
      description: `Đã gỡ bỏ bản ghi nhà ở khỏi danh sách.`,
    });
  };

  const handleApproveNeed = (item: HousingSupportNeed) => {
    toast.success('Phê duyệt nhu cầu thành công!', {
      description: `Đã duyệt đơn kiến nghị hỗ trợ nhà ở cho hộ ông/bà ${item.householdHeadName}.`,
    });
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang kết xuất báo cáo nhà ở & hỗ trợ kinh phí...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải xuống.',
        error: 'Lỗi khi xuất dữ liệu.',
      }
    );
  };

  // Button text depending on active tab
  const getButtonText = () => {
    switch (activeTab) {
      case 'list': return 'Khảo sát nhà ở';
      case 'support': return 'Ghi nhận hỗ trợ';
      case 'need': return 'Tiếp nhận nhu cầu';
      default: return 'Ghi nhận thông tin';
    }
  };

  const actions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleExport} className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
        <Download className="size-4 text-muted-foreground" />
        Xuất báo cáo
      </Button>

      {!isLeader && (
        <Button size="sm" onClick={handleAddClick} className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold">
          <Plus className="size-4" />
          {getButtonText()}
        </Button>
      )}
    </div>
  );

  const tabs = React.useMemo(() => [
    {
      value: 'list',
      label: 'Danh sách nhà ở',
      content: (
        <HousingRecordsTable
          data={filteredRecords}
          userRole={userRole}
          onEdit={(item) => handleEditItem('list', item)}
          onDelete={handleDeleteItem}
        />
      ),
    },
    {
      value: 'support',
      label: 'Hỗ trợ nhà ở',
      content: (
        <HousingSupportsTable
          data={filteredSupports}
          userRole={userRole}
          onEdit={(item) => handleEditItem('support', item)}
          onDelete={handleDeleteItem}
        />
      ),
    },
    {
      value: 'need',
      label: 'Nhu cầu hỗ trợ',
      content: (
        <HousingSupportNeedsTable
          data={filteredNeeds}
          userRole={userRole}
          onEdit={(item) => handleEditItem('need', item)}
          onDelete={handleDeleteItem}
          onApprove={handleApproveNeed}
        />
      ),
    },
  ], [filteredRecords, filteredSupports, filteredNeeds, userRole]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <PageHeader
        title="Quản lý Nhà ở"
        description="Quản lý phân loại nhà ở, tình trạng xuống cấp, hỗ trợ kinh phí xóa nhà tạm và tiếp nhận nhu cầu nhà ở xã Lao Bảo"
        actions={actions}
      />

      {/* Summary Cards */}
      <HousingSummary selectedHamletCode={selectedHamlet} />

      {/* Filters Shell */}
      <HousingFilters
        activeTab={activeTab}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedHousingType={selectedHousingType}
        setSelectedHousingType={setSelectedHousingType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        onReset={handleResetFilters}
      />

      {/* Interactive Tabs Layout */}
      <CommonTabs
        tabs={tabs}
        defaultValue="list"
        onValueChange={setActiveTab}
      />

      {/* Shared Dialog Form */}
      <HousingFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabType={formTabType}
        editingItem={editingItem}
      />
    </div>
  );
}
