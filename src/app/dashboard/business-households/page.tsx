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

// Import v1.1 Business Households Components
import { BusinessSummary } from './components/business-summary';
import { BusinessFilters } from './components/business-filters';
import { BusinessFormDialog } from './components/business-form-dialog';
import {
  BusinessHouseholdsTable,
  BusinessRevenuesTable,
  NonAgriLaborTable,
} from './components/business-tables';

// Import Types
import {
  BusinessHouseholdItem,
  BusinessHouseholdRecord,
  BusinessRevenueRecord,
  NonAgriculturalLaborRecord,
} from '@/types/business-household';

// Import Mock Data
import {
  MOCK_BUSINESS_HOUSEHOLDS,
  MOCK_BUSINESS_REVENUES,
  MOCK_NON_AGRI_LABORS,
} from '@/data/mock-business-households';

export default function BusinessHouseholdsPage() {
  const { selectedHamletCode, currentRole } = useTenant();
  const userRole = currentRole || 'commune_officer';
  const isLeader = userRole === 'leader';

  // Active Tab state
  const [activeTab, setActiveTab] = React.useState<string>('list');

  // Filter states
  const [selectedHamlet, setSelectedHamlet] = React.useState(selectedHamletCode);
  const [selectedIndustry, setSelectedIndustry] = React.useState('all');
  const [selectedScale, setSelectedScale] = React.useState('all');
  const [selectedHasRegistration, setSelectedHasRegistration] = React.useState('all');
  const [selectedPeriod, setSelectedPeriod] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formTabType, setFormTabType] = React.useState('list');
  const [editingItem, setEditingItem] = React.useState<BusinessHouseholdItem | null>(null);

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setSelectedHamlet('all');
    setSelectedIndustry('all');
    setSelectedScale('all');
    setSelectedHasRegistration('all');
    setSelectedPeriod('all');
  }, []);

  // Sync form tab type with active tab
  const handleAddClick = () => {
    setEditingItem(null);
    setFormTabType(activeTab);
    setIsFormOpen(true);
  };

  // Filter datasets
  // 1. Business Households (list)
  const filteredRecords = React.useMemo(() => {
    return MOCK_BUSINESS_HOUSEHOLDS.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedIndustry !== 'all' && r.industry !== selectedIndustry) return false;
      if (selectedScale !== 'all' && r.scale !== selectedScale) return false;
      if (selectedHasRegistration !== 'all') {
        const wantsReg = selectedHasRegistration === 'yes';
        if (r.hasRegistration !== wantsReg) return false;
      }
      return true;
    });
  }, [selectedHamlet, selectedIndustry, selectedScale, selectedHasRegistration]);

  // 2. Revenue
  const filteredRevenues = React.useMemo(() => {
    // Find businesses matching filter first to obtain their IDs
    const filteredBizIds = new Set(
      MOCK_BUSINESS_HOUSEHOLDS.filter((b) => {
        if (selectedHamlet !== 'all' && b.villageCode !== selectedHamlet) return false;
        return true;
      }).map((b) => b.id)
    );

    return MOCK_BUSINESS_REVENUES.filter((r) => {
      if (!filteredBizIds.has(r.businessId)) return false;
      if (selectedPeriod !== 'all' && r.period !== selectedPeriod) return false;
      return true;
    });
  }, [selectedHamlet, selectedPeriod]);

  // 3. Labor
  const filteredLabors = React.useMemo(() => {
    return MOCK_NON_AGRI_LABORS.filter((l) => {
      if (selectedHamlet !== 'all' && l.villageCode !== selectedHamlet) return false;
      return true;
    });
  }, [selectedHamlet]);

  // Edit / Delete callbacks
  const handleEditItem = (tab: string, item: BusinessHouseholdItem) => {
    setEditingItem(item);
    setFormTabType(tab);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (item: BusinessHouseholdItem) => {
    toast.success('Xóa dữ liệu thành công!', {
      description: `Đã gỡ bỏ bản ghi khỏi hệ thống.`,
    });
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang kết xuất báo cáo hộ SXKD & lao động...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải xuống.',
        error: 'Lỗi khi xuất dữ liệu.',
      }
    );
  };

  // Button text depending on active tab
  const getButtonText = () => {
    switch (activeTab) {
      case 'list':
        return 'Hộ sản xuất kinh doanh';
      case 'revenue':
        return 'Ghi nhận doanh thu';
      case 'labor':
        return 'Thống kê lao động';
      default:
        return 'Ghi nhận thông tin';
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
        value: 'list',
        label: 'Hộ SXKD',
        content: (
          <BusinessHouseholdsTable
            data={filteredRecords}
            userRole={userRole}
            onEdit={(item) => handleEditItem('list', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'revenue',
        label: 'Doanh thu',
        content: (
          <BusinessRevenuesTable
            data={filteredRevenues}
            userRole={userRole}
            onEdit={(item) => handleEditItem('revenue', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'labor',
        label: 'Lao động phi nông nghiệp',
        content: (
          <NonAgriLaborTable
            data={filteredLabors}
            userRole={userRole}
            onEdit={(item) => handleEditItem('labor', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
    ],
    [filteredRecords, filteredRevenues, filteredLabors, userRole]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <PageHeader
        title="Hộ sản xuất kinh doanh phi nông nghiệp"
        description="Quản lý hộ sản xuất kinh doanh cá thể phi nông nghiệp, doanh thu định kỳ và lao động phi nông nghiệp trên địa bàn xã Lao Bảo"
        actions={actions}
      />

      {/* Summary Cards */}
      <BusinessSummary selectedHamletCode={selectedHamlet} />

      {/* Filters Shell */}
      <BusinessFilters
        activeTab={activeTab}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        selectedScale={selectedScale}
        setSelectedScale={setSelectedScale}
        selectedHasRegistration={selectedHasRegistration}
        setSelectedHasRegistration={setSelectedHasRegistration}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        onReset={handleResetFilters}
      />

      {/* Interactive Tabs Layout */}
      <CommonTabs
        tabs={tabs}
        defaultValue="list"
        onValueChange={setActiveTab}
      />

      {/* Shared Dialog Form */}
      <BusinessFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabType={formTabType}
        editingItem={editingItem}
      />
    </div>
  );
}
