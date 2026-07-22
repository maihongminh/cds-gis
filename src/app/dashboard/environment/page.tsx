'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Breadcrumbs,
  CommonTabs,
  PageHeader,
  ConfirmDialog
} from '@/components/common';
import { Button } from '@/components/ui';
import { Plus, Download } from 'lucide-react';
import { toast } from 'sonner';

// Import v1.1 Environment Components
import { EnvironmentSummary } from './components/environment-summary';
import { EnvironmentFilters } from './components/environment-filters';
import { EnvironmentFormDialog } from './components/environment-form-dialog';
import {
  WasteTable,
  PermitsTable,
  ViolationsTable,
  ComplaintsTable,
  TrainingsTable
} from './components/environment-tables';

import { EnvironmentItem } from '@/types/environment';

// Import Mock Data
import {
  MOCK_WASTE_RECORDS,
  MOCK_WASTE_CLASSIFICATION,
  MOCK_ENV_REGISTRATIONS,
  MOCK_ENV_PERMITS,
  MOCK_ENV_VIOLATIONS,
  MOCK_ENV_PENALTIES,
  MOCK_ENV_COMPLAINTS,
  MOCK_ENV_TRAININGS
} from '@/data/mock-environment';

export default function EnvironmentPage() {
  const { selectedHamletCode, currentRole } = useTenant();
  const userRole = currentRole || 'commune_officer';
  const isLeader = userRole === 'leader';

  // Active Tab state
  const [activeTab, setActiveTab] = React.useState<string>('waste');

  // Filter states
  const [selectedHamlet, setSelectedHamlet] = React.useState(selectedHamletCode);
  const [selectedMonth, setSelectedMonth] = React.useState('all');
  const [selectedYear, setSelectedYear] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedSeverity, setSelectedSeverity] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formTabType, setFormTabType] = React.useState('waste');
  const [editingItem, setEditingItem] = React.useState<EnvironmentItem | null>(null);

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setSelectedHamlet('all');
    setSelectedMonth('all');
    setSelectedYear('all');
    setSelectedStatus('all');
    setSelectedSeverity('all');
  }, []);

  // Sync form tab type with active tab
  const handleAddClick = () => {
    setEditingItem(null);
    setFormTabType(activeTab);
    setIsFormOpen(true);
  };

  // Filter datasets
  const filteredWaste = React.useMemo(() => {
    return MOCK_WASTE_RECORDS.filter(r => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedMonth !== 'all' && String(r.month) !== selectedMonth) return false;
      if (selectedYear !== 'all' && String(r.year) !== selectedYear) return false;
      return true;
    });
  }, [selectedHamlet, selectedMonth, selectedYear]);

  const filteredClass = React.useMemo(() => {
    return MOCK_WASTE_CLASSIFICATION.filter(r => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedYear !== 'all' && String(r.year) !== selectedYear) return false;
      return true;
    });
  }, [selectedHamlet, selectedYear]);

  const filteredRegistrations = React.useMemo(() => {
    return MOCK_ENV_REGISTRATIONS.filter(r => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedYear !== 'all' && !r.registrationDate.startsWith(selectedYear)) return false;
      return true;
    });
  }, [selectedHamlet, selectedStatus, selectedYear]);

  const filteredPermits = React.useMemo(() => {
    return MOCK_ENV_PERMITS.filter(r => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedYear !== 'all' && !r.issueDate.startsWith(selectedYear)) return false;
      return true;
    });
  }, [selectedHamlet, selectedYear]);

  const filteredViolations = React.useMemo(() => {
    return MOCK_ENV_VIOLATIONS.filter(r => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedSeverity !== 'all' && r.severity !== selectedSeverity) return false;
      if (selectedYear !== 'all' && !r.recordedDate.startsWith(selectedYear)) return false;
      return true;
    });
  }, [selectedHamlet, selectedStatus, selectedSeverity, selectedYear]);

  const filteredPenalties = React.useMemo(() => {
    const violMap = new Map(MOCK_ENV_VIOLATIONS.map(v => [v.id, v]));
    return MOCK_ENV_PENALTIES.filter(r => {
      const viol = violMap.get(r.violationId);
      if (!viol) return false;
      if (selectedHamlet !== 'all' && viol.villageCode !== selectedHamlet) return false;
      if (selectedYear !== 'all' && !r.issueDate.startsWith(selectedYear)) return false;
      return true;
    });
  }, [selectedHamlet, selectedYear]);

  const filteredComplaints = React.useMemo(() => {
    return MOCK_ENV_COMPLAINTS.filter(r => {
      if (selectedHamlet !== 'all' && r.villageCode !== selectedHamlet) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedYear !== 'all' && !r.receivedDate.startsWith(selectedYear)) return false;
      return true;
    });
  }, [selectedHamlet, selectedStatus, selectedYear]);

  const filteredTrainings = React.useMemo(() => {
    return MOCK_ENV_TRAININGS.filter(r => {
      if (selectedYear !== 'all' && !r.trainingDate.startsWith(selectedYear)) return false;
      return true;
    });
  }, [selectedYear]);

  // Edit / Delete / Action callbacks
  const handleEditItem = (tab: string, item: EnvironmentItem) => {
    setEditingItem(item);
    setFormTabType(tab);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (item: EnvironmentItem) => {
    toast.success('Xóa dữ liệu thành công!', {
      description: `Đã gỡ bỏ bản ghi khỏi danh sách môi trường.`,
    });
  };

  const handleResolveAction = (type: string, item: EnvironmentItem) => {
    toast.success('Cập nhật trạng thái thành công!', {
      description: `Đã duyệt hoặc giải quyết thành công bản ghi môi trường.`,
    });
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang chuẩn bị báo cáo môi trường...',
        success: 'Xuất dữ liệu thành công! Tệp Excel đã được tải xuống.',
        error: 'Lỗi khi xuất dữ liệu.',
      }
    );
  };

  // Dynamic actions based on tab & role
  const getButtonText = () => {
    switch (activeTab) {
      case 'waste': return 'Ghi nhận rác thải';
      case 'registrations': return 'Thêm đăng ký hồ sơ';
      case 'violations': return 'Lập biên bản vi phạm';
      case 'complaints': return 'Tiếp nhận khiếu nại';
      case 'trainings': return 'Lên lịch tập huấn';
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

  // Tab definitions
  const tabs = React.useMemo(() => [
    {
      value: 'waste',
      label: 'Rác thải & Phân loại',
      content: (
        <WasteTable
          wasteData={filteredWaste}
          classData={filteredClass}
          userRole={userRole}
          onEdit={(item) => handleEditItem('waste', item)}
          onDelete={handleDeleteItem}
        />
      ),
    },
    {
      value: 'registrations',
      label: 'Hồ sơ & Giấy phép',
      content: (
        <PermitsTable
          registrationData={filteredRegistrations}
          permitData={filteredPermits}
          userRole={userRole}
          onEditReg={(item) => handleEditItem('registrations', item)}
          onDeleteReg={handleDeleteItem}
          onEditPermit={(item) => handleEditItem('registrations', item)}
          onDeletePermit={handleDeleteItem}
          onApproveReg={(item) => handleResolveAction('registration', item)}
        />
      ),
    },
    {
      value: 'violations',
      label: 'Vi phạm & Xử phạt',
      content: (
        <ViolationsTable
          violationData={filteredViolations}
          penaltyData={filteredPenalties}
          userRole={userRole}
          onEditViol={(item) => handleEditItem('violations', item)}
          onDeleteViol={handleDeleteItem}
          onEditPen={(item) => handleEditItem('violations', item)}
          onDeletePen={handleDeleteItem}
          onResolveViol={(item) => handleResolveAction('violation', item)}
        />
      ),
    },
    {
      value: 'complaints',
      label: 'Kiến nghị & Khiếu nại',
      content: (
        <ComplaintsTable
          data={filteredComplaints}
          userRole={userRole}
          onEdit={(item) => handleEditItem('complaints', item)}
          onDelete={handleDeleteItem}
          onResolve={(item) => handleResolveAction('complaint', item)}
        />
      ),
    },
    {
      value: 'trainings',
      label: 'Tập huấn & Tuyên truyền',
      content: (
        <TrainingsTable
          data={filteredTrainings}
          userRole={userRole}
          onEdit={(item) => handleEditItem('trainings', item)}
          onDelete={handleDeleteItem}
        />
      ),
    },
  ], [
    filteredWaste,
    filteredClass,
    filteredRegistrations,
    filteredPermits,
    filteredViolations,
    filteredPenalties,
    filteredComplaints,
    filteredTrainings,
    userRole
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <PageHeader
        title="Bảo vệ Môi trường"
        description="Theo dõi chất thải, hồ sơ cam kết, cấp giấy phép môi trường, vi phạm hành chính, kiến nghị của người dân và kế hoạch tuyên truyền tại xã Lao Bảo"
        actions={actions}
      />

      {/* Summary Cards */}
      <EnvironmentSummary selectedHamletCode={selectedHamlet} />

      {/* Filters Shell */}
      <EnvironmentFilters
        activeTab={activeTab}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        onReset={handleResetFilters}
      />

      {/* Interactive Tabs Layout */}
      <CommonTabs
        tabs={tabs}
        defaultValue="waste"
        onValueChange={setActiveTab}
      />

      {/* Shared Dialog Form */}
      <EnvironmentFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabType={formTabType}
        editingItem={editingItem}
      />
    </div>
  );
}
