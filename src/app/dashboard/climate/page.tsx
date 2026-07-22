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

// Import v1.1 Climate Components
import { ClimateSummary } from './components/climate-summary';
import { ClimateFilters } from './components/climate-filters';
import { ClimateFormDialog } from './components/climate-form-dialog';
import {
  DisasterEventsTable,
  WeatherRecordsTable,
  RiskAlertsTable
} from './components/climate-tables';

// Import Types
import {
  ClimateItem,
  DisasterEvent,
  WeatherMonthlyRecord,
  AgricultureRiskAlert
} from '@/types/climate';

// Import Mock Data
import {
  MOCK_DISASTER_EVENTS,
  MOCK_WEATHER_RECORDS,
  MOCK_AGRI_RISK_ALERTS
} from '@/data/mock-climate';
import { MOCK_HAMLETS } from '@/data/mock-administrative-units';

export default function ClimatePage() {
  const { selectedHamletCode, currentRole } = useTenant();
  const userRole = currentRole || 'commune_officer';
  const isLeader = userRole === 'leader';

  // Active Tab state
  const [activeTab, setActiveTab] = React.useState<string>('disaster');

  // Filter states
  const [selectedHamlet, setSelectedHamlet] = React.useState(selectedHamletCode);
  const [selectedYear, setSelectedYear] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');

  // Sync with global tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formTabType, setFormTabType] = React.useState('disaster');
  const [editingItem, setEditingItem] = React.useState<ClimateItem | null>(null);

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setSelectedHamlet('all');
    setSelectedYear('all');
    setSelectedStatus('all');
  }, []);

  // Sync form tab type with active tab
  const handleAddClick = () => {
    setEditingItem(null);
    setFormTabType(activeTab);
    setIsFormOpen(true);
  };

  // Filter datasets
  // 1. Disaster events
  const filteredEvents = React.useMemo(() => {
    const hamlet = MOCK_HAMLETS.find(h => h.code === selectedHamlet);
    return MOCK_DISASTER_EVENTS.filter(r => {
      if (selectedHamlet !== 'all' && hamlet && !r.affectedHamlets.includes(hamlet.name)) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedHamlet, selectedStatus]);

  // 2. Weather records
  const filteredWeather = React.useMemo(() => {
    return MOCK_WEATHER_RECORDS.filter(r => {
      if (selectedYear !== 'all' && String(r.year) !== selectedYear) return false;
      return true;
    });
  }, [selectedYear]);

  // 3. Risk alerts
  const filteredAlerts = React.useMemo(() => {
    const hamlet = MOCK_HAMLETS.find(h => h.code === selectedHamlet);
    return MOCK_AGRI_RISK_ALERTS.filter(r => {
      if (selectedHamlet !== 'all' && hamlet && !r.affectedHamlets.includes(hamlet.name)) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedHamlet, selectedStatus]);

  // Edit / Delete / Action callbacks
  const handleEditItem = (tab: string, item: ClimateItem) => {
    setEditingItem(item);
    setFormTabType(tab);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (item: ClimateItem) => {
    toast.success('Xóa dữ liệu thành công!', {
      description: `Đã gỡ bỏ bản ghi khí hậu khỏi hệ thống.`,
    });
  };

  const handleResolveDisaster = (item: DisasterEvent) => {
    toast.success('Khắc phục thiên tai thành công!', {
      description: `Đã ghi nhận hoàn tất khắc phục hậu quả thiên tai cho sự kiện ${item.eventCode}.`,
    });
  };

  const handleArchiveAlert = (item: AgricultureRiskAlert) => {
    toast.success('Lưu trữ cảnh báo thành công!', {
      description: `Đã ngưng phát sóng và lưu trữ cảnh báo ${item.alertCode}.`,
    });
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang kết xuất báo cáo khí hậu & thiên tai...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải xuống.',
        error: 'Lỗi khi xuất dữ liệu.',
      }
    );
  };

  // Button text depending on active tab
  const getButtonText = () => {
    switch (activeTab) {
      case 'disaster': return 'Ghi nhận thiên tai';
      case 'weather': return 'Cập nhật thời tiết';
      case 'alerts': return 'Phát cảnh báo rủi ro';
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
      value: 'disaster',
      label: 'Sự kiện thiên tai',
      content: (
        <DisasterEventsTable
          data={filteredEvents}
          userRole={userRole}
          onEdit={(item) => handleEditItem('disaster', item)}
          onDelete={handleDeleteItem}
          onResolve={handleResolveDisaster}
        />
      ),
    },
    {
      value: 'weather',
      label: 'Dữ liệu thời tiết',
      content: (
        <WeatherRecordsTable
          data={filteredWeather}
        />
      ),
    },
    {
      value: 'alerts',
      label: 'Cảnh báo rủi ro',
      content: (
        <RiskAlertsTable
          data={filteredAlerts}
          userRole={userRole}
          onEdit={(item) => handleEditItem('alerts', item)}
          onDelete={handleDeleteItem}
          onArchive={handleArchiveAlert}
        />
      ),
    },
  ], [filteredEvents, filteredWeather, filteredAlerts, userRole]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <PageHeader
        title="Khí hậu & Thiên tai"
        description="Ghi nhận sự kiện thiên tai, dữ liệu thời tiết cơ bản và cảnh báo rủi ro ảnh hưởng đến sản xuất nông nghiệp tại xã Lao Bảo"
        actions={actions}
      />

      {/* Summary Cards */}
      <ClimateSummary selectedHamletCode={selectedHamlet} />

      {/* Filters Shell */}
      <ClimateFilters
        activeTab={activeTab}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onReset={handleResetFilters}
      />

      {/* Interactive Tabs Layout */}
      <CommonTabs
        tabs={tabs}
        defaultValue="disaster"
        onValueChange={setActiveTab}
      />

      {/* Shared Dialog Form */}
      <ClimateFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabType={formTabType}
        editingItem={editingItem}
      />
    </div>
  );
}
