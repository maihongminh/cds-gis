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
import { SocioEconomicSummary } from './components/socio-economic-summary';
import { SocioEconomicFilters } from './components/socio-economic-filters';
import { SocioEconomicFormDialog } from './components/socio-economic-form-dialog';
import {
  EconomicTable,
  SocialTable,
  LaborTable,
  InfrastructureTable,
} from './components/socio-economic-tables';

// Import Types
import {
  SocioEconomicItem,
  EconomicIndicatorRecord,
  SocialIndicatorRecord,
  LaborEmploymentIndicatorRecord,
  InfrastructureIndicatorRecord,
} from '@/types/socio-economic';

// Import Mock Data
import {
  MOCK_ECONOMIC_INDICATORS,
  MOCK_SOCIAL_INDICATORS,
  MOCK_LABOR_INDICATORS,
  MOCK_INFRASTRUCTURE_INDICATORS,
} from '@/data/mock-socio-economic';

export default function SocioEconomicPage() {
  const { selectedHamletCode, currentRole } = useTenant();
  const userRole = currentRole || 'commune_officer';
  const isLeader = userRole === 'leader';

  // Active Tab state
  const [activeTab, setActiveTab] = React.useState<string>('economic');

  // Filter states
  const [selectedHamlet, setSelectedHamlet] = React.useState(selectedHamletCode);
  const [selectedYear, setSelectedYear] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formTabType, setFormTabType] = React.useState('economic');
  const [editingItem, setEditingItem] = React.useState<SocioEconomicItem | null>(null);

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setSelectedHamlet('all');
    setSelectedYear('all');
  }, []);

  // Sync form tab type with active tab
  const handleAddClick = () => {
    setEditingItem(null);
    setFormTabType(activeTab);
    setIsFormOpen(true);
  };

  // Filter datasets
  // 1. Economic (commune only, ignores hamlet filter)
  const filteredEconomics = React.useMemo(() => {
    return MOCK_ECONOMIC_INDICATORS.filter((r) => {
      if (selectedYear !== 'all' && r.year !== Number(selectedYear)) return false;
      return true;
    });
  }, [selectedYear]);

  // 2. Social
  const filteredSocials = React.useMemo(() => {
    return MOCK_SOCIAL_INDICATORS.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      // When selectedHamlet is not 'all', exclude the commune-wide record (undefined villageCode)
      if (selectedHamlet === 'all' && r.villageCode === undefined) {
        // Show all
      } else if (selectedHamlet !== 'all' && r.villageCode === undefined) {
        return false;
      }
      if (selectedYear !== 'all' && r.year !== Number(selectedYear)) return false;
      return true;
    });
  }, [selectedHamlet, selectedYear]);

  // 3. Labor
  const filteredLabors = React.useMemo(() => {
    return MOCK_LABOR_INDICATORS.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedHamlet === 'all' && r.villageCode === undefined) {
        // Show all
      } else if (selectedHamlet !== 'all' && r.villageCode === undefined) {
        return false;
      }
      if (selectedYear !== 'all' && r.year !== Number(selectedYear)) return false;
      return true;
    });
  }, [selectedHamlet, selectedYear]);

  // 4. Infrastructure
  const filteredInfras = React.useMemo(() => {
    return MOCK_INFRASTRUCTURE_INDICATORS.filter((r) => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedHamlet === 'all' && r.villageCode === undefined) {
        // Show all
      } else if (selectedHamlet !== 'all' && r.villageCode === undefined) {
        return false;
      }
      if (selectedYear !== 'all' && r.year !== Number(selectedYear)) return false;
      return true;
    });
  }, [selectedHamlet, selectedYear]);

  // Edit / Delete callbacks
  const handleEditItem = (tab: string, item: SocioEconomicItem) => {
    setEditingItem(item);
    setFormTabType(tab);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (item: SocioEconomicItem) => {
    toast.success('Xóa dữ liệu thành công!', {
      description: `Đã gỡ bỏ bản ghi thống kê ra khỏi chỉ số.`,
    });
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang kết xuất báo cáo thống kê KT-XH tổng hợp...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải xuống.',
        error: 'Lỗi khi xuất dữ liệu.',
      }
    );
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'economic': return 'Chỉ tiêu Kinh tế';
      case 'social': return 'Chỉ tiêu Xã hội';
      case 'labor': return 'Số liệu Lao động';
      case 'infrastructure': return 'Đánh giá Hạ tầng';
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
        value: 'economic',
        label: 'Kinh tế',
        content: (
          <EconomicTable
            data={filteredEconomics}
            userRole={userRole}
            onEdit={(item) => handleEditItem('economic', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'social',
        label: 'Xã hội',
        content: (
          <SocialTable
            data={filteredSocials}
            userRole={userRole}
            onEdit={(item) => handleEditItem('social', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'labor',
        label: 'Lao động - việc làm',
        content: (
          <LaborTable
            data={filteredLabors}
            userRole={userRole}
            onEdit={(item) => handleEditItem('labor', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'infrastructure',
        label: 'Hạ tầng',
        content: (
          <InfrastructureTable
            data={filteredInfras}
            userRole={userRole}
            onEdit={(item) => handleEditItem('infrastructure', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
    ],
    [filteredEconomics, filteredSocials, filteredLabors, filteredInfras, userRole]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <PageHeader
        title="Kinh tế - Xã hội tổng hợp"
        description="Tổng hợp chỉ tiêu phát triển kinh tế vĩ mô, dân sinh, cơ cấu lao động việc làm và cơ sở hạ tầng nông thôn toàn xã Lao Bảo"
        actions={actions}
      />

      {/* Summary Cards */}
      <SocioEconomicSummary selectedHamletCode={selectedHamlet} />

      {/* Filters Shell */}
      <SocioEconomicFilters
        activeTab={activeTab}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        onReset={handleResetFilters}
      />

      {/* Interactive Tabs Layout */}
      <CommonTabs
        tabs={tabs}
        defaultValue="economic"
        onValueChange={setActiveTab}
      />

      {/* Shared Dialog Form */}
      <SocioEconomicFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabType={formTabType}
        editingItem={editingItem}
      />
    </div>
  );
}
