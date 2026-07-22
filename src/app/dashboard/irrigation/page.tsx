'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Breadcrumbs,
  PageHeader,
  CommonTabs,
} from '@/components/common';
import { Button } from '@/components/ui';
import { Plus, Download } from 'lucide-react';
import { toast } from 'sonner';

// Import Components
import { IrrigationSummary } from './components/irrigation-summary';
import { IrrigationFilters } from './components/irrigation-filters';
import { IrrigationFormDialog } from './components/irrigation-form-dialog';
import {
  IrrigationFacilitiesTable,
  IrrigationOperationsTable,
  IrrigationManagementUnitsTable,
} from './components/irrigation-tables';

// Import Types
import {
  IrrigationItem,
  IrrigationFacility,
  IrrigationOperationRecord,
  IrrigationManagementUnit,
} from '@/types/irrigation';

// Import Mock Data
import {
  MOCK_IRRIGATION_FACILITIES,
  MOCK_IRRIGATION_OPERATIONS,
  MOCK_IRRIGATION_UNITS,
} from '@/data/mock-irrigation';

export default function IrrigationPage() {
  const { selectedHamletCode, currentRole } = useTenant();
  const userRole = currentRole || 'commune_officer';
  const isLeader = userRole === 'leader';

  // Active Tab state
  const [activeTab, setActiveTab] = React.useState<string>('facilities');

  // Filter states
  const [selectedHamlet, setSelectedHamlet] = React.useState(selectedHamletCode);
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formTabType, setFormTabType] = React.useState('facilities');
  const [editingItem, setEditingItem] = React.useState<IrrigationItem | null>(null);

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setSelectedHamlet('all');
    setSelectedType('all');
    setSelectedStatus('all');
  }, []);

  // Sync form tab type with active tab
  const handleAddClick = () => {
    setEditingItem(null);
    setFormTabType(activeTab);
    setIsFormOpen(true);
  };

  // Filter datasets
  // 1. Irrigation Facilities
  const filteredFacilities = React.useMemo(() => {
    return MOCK_IRRIGATION_FACILITIES.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedType !== 'all' && r.type !== selectedType) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedHamlet, selectedType, selectedStatus]);

  // 2. Irrigation Operations
  const filteredOperations = React.useMemo(() => {
    const facilityHamletMap = new Map(MOCK_IRRIGATION_FACILITIES.map((f) => [f.id, f.villageCode]));
    return MOCK_IRRIGATION_OPERATIONS.filter((r) => {
      const facHamlet = facilityHamletMap.get(r.facilityId);
      if (selectedHamlet !== 'all' && facHamlet !== selectedHamlet) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedHamlet, selectedStatus]);

  // 3. Management Units (no local filters)
  const filteredUnits = React.useMemo(() => {
    return MOCK_IRRIGATION_UNITS;
  }, []);

  // Edit / Delete callbacks
  const handleEditItem = (tab: string, item: IrrigationItem) => {
    setEditingItem(item);
    setFormTabType(tab);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (item: IrrigationItem) => {
    toast.success('Xóa dữ liệu thành công!', {
      description: `Đã gỡ bỏ bản ghi ra khỏi cơ sở dữ liệu thủy lợi.`,
    });
  };

  const handleResolveOperation = (item: IrrigationOperationRecord) => {
    toast.success('Cập nhật thành công!', {
      description: `Đã xác nhận sự cố tại công trình ${item.facilityName} đã được khắc phục hoàn tất.`,
    });
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang kết xuất báo cáo hạ tầng thủy lợi nông nghiệp...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải xuống.',
        error: 'Lỗi khi xuất dữ liệu.',
      }
    );
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'facilities': return 'Công trình';
      case 'operations': return 'Nhật ký vận hành';
      case 'units': return 'Đơn vị quản lý';
      default: return 'Ghi nhận';
    }
  };

  const actions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none"
      >
        <Download className="size-4 text-muted-foreground" />
        Xuất báo cáo
      </Button>

      {!isLeader && (
        <Button
          size="sm"
          onClick={handleAddClick}
          className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold"
        >
          <Plus className="size-4" />
          Thêm {getButtonText()}
        </Button>
      )}
    </div>
  );

  const tabs = React.useMemo(
    () => [
      {
        value: 'facilities',
        label: 'Công trình thủy lợi',
        content: (
          <IrrigationFacilitiesTable
            data={filteredFacilities}
            userRole={userRole}
            onEdit={(item) => handleEditItem('facilities', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'operations',
        label: 'Nhật ký vận hành',
        content: (
          <IrrigationOperationsTable
            data={filteredOperations}
            userRole={userRole}
            onEdit={(item) => handleEditItem('operations', item)}
            onDelete={handleDeleteItem}
            onResolve={handleResolveOperation}
          />
        ),
      },
      {
        value: 'units',
        label: 'Đơn vị quản lý',
        content: (
          <IrrigationManagementUnitsTable
            data={filteredUnits}
            userRole={userRole}
            onEdit={(item) => handleEditItem('units', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
    ],
    [filteredFacilities, filteredOperations, filteredUnits, userRole]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <PageHeader
        title="Quản lý Công trình Thủy lợi"
        description="Theo dõi quy mô hệ thống, công suất tưới tiêu, lập nhật ký vận hành và giám sát các tổ chức khai thác thủy lợi xã Lao Bảo"
        actions={actions}
      />

      {/* Summary Cards */}
      <IrrigationSummary selectedHamletCode={selectedHamlet} />

      {/* Filters Shell */}
      <IrrigationFilters
        activeTab={activeTab}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onReset={handleResetFilters}
      />

      {/* Interactive Tabs Layout */}
      <CommonTabs
        tabs={tabs}
        defaultValue="facilities"
        onValueChange={setActiveTab}
      />

      {/* Shared Dialog Form */}
      <IrrigationFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabType={formTabType}
        editingItem={editingItem}
      />
    </div>
  );
}
