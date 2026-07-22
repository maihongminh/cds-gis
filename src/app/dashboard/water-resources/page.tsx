'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Breadcrumbs,
  PageHeader
} from '@/components/common';
import { Button } from '@/components/ui';
import { Plus, Download } from 'lucide-react';
import { toast } from 'sonner';

// Import v1.1 Water Resource Components
import { WaterSummary } from './components/water-summary';
import { WaterFilters } from './components/water-filters';
import { WaterTabs } from './components/water-tabs';
import { WaterFormDialog } from './components/water-form-dialog';

// Import Types
import {
  WaterItem,
  GroundwaterPermitRecord,
  CleanWaterUsageRecord,
  HygienicWaterUsageRecord,
  CentralizedWaterFacility,
  SmallWaterFacility,
  WaterTreatmentSystem,
} from '@/types/water-resource';

// Import Mock Data
import {
  MOCK_GROUNDWATER_PERMITS,
  MOCK_CLEAN_WATER_USAGE,
  MOCK_HYGIENIC_WATER_USAGE,
  MOCK_CENTRALIZED_WATER_FACILITIES,
  MOCK_SMALL_WATER_FACILITIES,
  MOCK_WATER_TREATMENT_SYSTEMS,
} from '@/data/mock-water-resources';
import { MOCK_HAMLETS } from '@/data/mock-administrative-units';

export default function WaterResourcesPage() {
  const { selectedHamletCode, currentRole } = useTenant();
  const userRole = currentRole || 'commune_officer';
  const isLeader = userRole === 'leader';

  // Active Tab state
  const [activeTab, setActiveTab] = React.useState<string>('groundwater');

  // Filter states
  const [selectedHamlet, setSelectedHamlet] = React.useState(selectedHamletCode);
  const [selectedYear, setSelectedYear] = React.useState('all');
  const [selectedFacilityType, setSelectedFacilityType] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedOperatingStatus, setSelectedOperatingStatus] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formTabType, setFormTabType] = React.useState('groundwater');
  const [editingItem, setEditingItem] = React.useState<WaterItem | null>(null);

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setSelectedHamlet('all');
    setSelectedYear('all');
    setSelectedFacilityType('all');
    setSelectedStatus('all');
    setSelectedOperatingStatus('all');
  }, []);

  // Sync form tab type with active tab
  const handleAddClick = () => {
    setEditingItem(null);
    setFormTabType(activeTab);
    setIsFormOpen(true);
  };

  // Filter datasets
  // 1. Groundwater
  const filteredPermits = React.useMemo(() => {
    return MOCK_GROUNDWATER_PERMITS.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedYear !== 'all' && !r.issueDate.startsWith(selectedYear)) return false;
      return true;
    });
  }, [selectedHamlet, selectedStatus, selectedYear]);

  // 2. Clean Water Usage
  const filteredCleanUsage = React.useMemo(() => {
    return MOCK_CLEAN_WATER_USAGE.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedYear !== 'all' && String(r.year) !== selectedYear) return false;
      return true;
    });
  }, [selectedHamlet, selectedYear]);

  // 3. Hygienic Water Usage
  const filteredHygienicUsage = React.useMemo(() => {
    return MOCK_HYGIENIC_WATER_USAGE.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedYear !== 'all' && String(r.year) !== selectedYear) return false;
      return true;
    });
  }, [selectedHamlet, selectedYear]);

  // 4. Centralized facilities
  const filteredCentralized = React.useMemo(() => {
    return MOCK_CENTRALIZED_WATER_FACILITIES.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedOperatingStatus !== 'all' && r.status !== selectedOperatingStatus) return false;

      // Filter by type
      if (selectedFacilityType !== 'all') {
        if (selectedFacilityType === 'small') return false; // centralized is never small
        if (selectedFacilityType === 'centralized') return true;
        if (r.facilityType !== selectedFacilityType) return false;
      }
      return true;
    });
  }, [selectedHamlet, selectedOperatingStatus, selectedFacilityType]);

  // 5. Small facilities
  const filteredSmall = React.useMemo(() => {
    return MOCK_SMALL_WATER_FACILITIES.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;

      // Filter by type
      if (selectedFacilityType !== 'all') {
        if (selectedFacilityType === 'centralized') return false; // small is never centralized
        if (selectedFacilityType === 'small') return true;
        if (r.facilityType !== selectedFacilityType) return false;
      }
      return true;
    });
  }, [selectedHamlet, selectedFacilityType]);

  // 6. Water Treatment systems
  const filteredTreatment = React.useMemo(() => {
    const currentHamlet = MOCK_HAMLETS.find((h) => h.code === selectedHamlet);
    return MOCK_WATER_TREATMENT_SYSTEMS.filter((r) => {
      if (selectedHamlet !== 'all' && currentHamlet && !r.location.includes(currentHamlet.name)) {
        return false;
      }
      if (selectedOperatingStatus !== 'all' && r.status !== selectedOperatingStatus) return false;
      return true;
    });
  }, [selectedHamlet, selectedOperatingStatus]);

  // Edit / Delete / Action callbacks
  const handleEditItem = (tab: string, item: WaterItem) => {
    setEditingItem(item);
    setFormTabType(tab);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (item: WaterItem) => {
    toast.success('Xóa dữ liệu thành công!', {
      description: `Đã gỡ bỏ bản ghi công trình/hồ sơ nước khỏi danh sách.`,
    });
  };

  const handleRenewPermit = (item: GroundwaterPermitRecord) => {
    toast.success('Gia hạn giấy phép thành công!', {
      description: `Đã thực hiện gia hạn 5 năm cho giấy phép số ${item.permitNumber}.`,
    });
  };

  const handleToggleCentralStatus = (item: CentralizedWaterFacility) => {
    toast.success('Cập nhật trạng thái công trình thành công!', {
      description: `Đã chuyển đổi trạng thái hoạt động của công trình ${item.facilityName}.`,
    });
  };

  const handleToggleSmallStatus = (item: SmallWaterFacility) => {
    toast.success('Cập nhật chỉ tiêu vệ sinh thành công!', {
      description: `Đã cập nhật tình trạng đạt tiêu chuẩn vệ sinh của hộ ${item.householdHeadName}.`,
    });
  };

  const handleMaintainTreatment = (item: WaterTreatmentSystem) => {
    toast.success('Ghi nhận bảo trì thành công!', {
      description: `Hệ thống ${item.systemName} đã được lập lịch bảo dưỡng kỹ thuật.`,
    });
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang chuẩn bị báo cáo tài nguyên nước...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải xuống.',
        error: 'Lỗi khi xuất dữ liệu.',
      }
    );
  };

  // Button text depending on active tab
  const getButtonText = () => {
    switch (activeTab) {
      case 'groundwater': return 'Cấp phép nước dưới đất';
      case 'usage': return 'Thống kê sử dụng nước';
      case 'facilities': return 'Thêm công trình';
      case 'treatment': return 'Thêm hệ thống xử lý';
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <PageHeader
        title="Tài nguyên nước"
        description="Quản lý nước dưới đất, nước sạch, nước sinh hoạt hợp vệ sinh và công trình cấp nước trên địa bàn xã Lao Bảo"
        actions={actions}
      />

      {/* Summary Cards */}
      <WaterSummary selectedHamletCode={selectedHamlet} />

      {/* Filters Shell */}
      <WaterFilters
        activeTab={activeTab}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedFacilityType={selectedFacilityType}
        setSelectedFacilityType={setSelectedFacilityType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedOperatingStatus={selectedOperatingStatus}
        setSelectedOperatingStatus={setSelectedOperatingStatus}
        onReset={handleResetFilters}
      />

      {/* Interactive Tabs Layout */}
      <WaterTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={userRole}
        filteredPermits={filteredPermits}
        filteredCleanUsage={filteredCleanUsage}
        filteredHygienicUsage={filteredHygienicUsage}
        filteredCentralized={filteredCentralized}
        filteredSmall={filteredSmall}
        filteredTreatment={filteredTreatment}

        onEditGroundwater={(item) => handleEditItem('groundwater', item)}
        onDeleteGroundwater={handleDeleteItem}
        onRenewGroundwater={handleRenewPermit}

        onEditCleanUsage={(item) => handleEditItem('usage', item)}
        onEditHygienicUsage={(item) => handleEditItem('usage', item)}

        onEditCentralized={(item) => handleEditItem('facilities', item)}
        onDeleteCentralized={handleDeleteItem}
        onToggleStatusCentral={handleToggleCentralStatus}

        onEditSmall={(item) => handleEditItem('facilities', item)}
        onDeleteSmall={handleDeleteItem}
        onToggleStatusSmall={handleToggleSmallStatus}

        onEditTreatment={(item) => handleEditItem('treatment', item)}
        onDeleteTreatment={handleDeleteItem}
        onMaintainTreatment={handleMaintainTreatment}
      />

      {/* Shared Dialog Form */}
      <WaterFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabType={formTabType}
        editingItem={editingItem}
      />
    </div>
  );
}
