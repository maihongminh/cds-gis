'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Breadcrumbs,
  PageHeader,
  CommonTabs,
} from '@/components/common';
import { Button } from '@/components/ui';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

// Import Components
import { TransportationSummary } from './components/transportation-summary';
import { TransportationFilters } from './components/transportation-filters';
import { TransportationFormDialog } from './components/transportation-form-dialog';
import { TransportationReportSection } from './components/transportation-report-section';
import {
  RoadsTable,
  StructuresTable,
  DisruptionsTable,
  MaintenancePlansTable,
  TrafficSafetyTable
} from './components/transportation-tables';

// Import Types
import {
  RoadRecord,
  TransportStructureRecord,
  TrafficDisruptionRecord,
  RoadMaintenancePlan,
  TrafficSafetyRecord
} from '@/types/transportation';

// Import Mock Data
import {
  MOCK_ROADS,
  MOCK_TRANSPORT_STRUCTURES,
  MOCK_TRAFFIC_DISRUPTIONS,
  MOCK_ROAD_MAINTENANCE_PLANS,
  MOCK_TRAFFIC_SAFETY_RECORDS
} from '@/data/mock-transportation';

// Hamlets helper for custom naming
const HAMLETS = [
  { code: 'thon-01', name: 'Thôn 01' },
  { code: 'thon-02', name: 'Thôn 02' },
  { code: 'thon-03', name: 'Thôn 03' },
  { code: 'thon-04', name: 'Thôn 04' },
  { code: 'thon-05', name: 'Thôn 05' },
  { code: 'thon-06', name: 'Thôn 06' },
  { code: 'thon-07', name: 'Thôn 07' },
  { code: 'thon-08', name: 'Thôn 08' }
];

export default function TransportationPage() {
  const { selectedHamletCode, currentRole } = useTenant();
  const userRole = currentRole || 'commune_officer';
  const isLeader = userRole === 'leader';

  // Active Tab state
  const [activeTab, setActiveTab] = React.useState<string>('roads');

  // Interactive Mock Data States
  const [roads, setRoads] = React.useState<RoadRecord[]>(MOCK_ROADS);
  const [structures, setStructures] = React.useState<TransportStructureRecord[]>(MOCK_TRANSPORT_STRUCTURES);
  const [disruptions, setDisruptions] = React.useState<TrafficDisruptionRecord[]>(MOCK_TRAFFIC_DISRUPTIONS);
  const [maintenancePlans, setMaintenancePlans] = React.useState<RoadMaintenancePlan[]>(MOCK_ROAD_MAINTENANCE_PLANS);
  const [safetyRecords, setSafetyRecords] = React.useState<TrafficSafetyRecord[]>(MOCK_TRAFFIC_SAFETY_RECORDS);

  // Filter states
  const [selectedHamlet, setSelectedHamlet] = React.useState(selectedHamletCode);
  
  // Roads filters
  const [roadCategory, setRoadCategory] = React.useState('all');
  const [surfaceType, setSurfaceType] = React.useState('all');
  const [roadCondition, setRoadCondition] = React.useState('all');
  
  // Structures filters
  const [structureType, setStructureType] = React.useState('all');
  const [riskLevel, setRiskLevel] = React.useState('all');
  const [structCondition, setStructCondition] = React.useState('all');

  // Disruptions filters
  const [incidentType, setIncidentType] = React.useState('all');
  const [severity, setSeverity] = React.useState('all');
  const [disruptStatus, setDisruptStatus] = React.useState('all');

  // Maintenance filters
  const [maintenanceProgress, setMaintenanceProgress] = React.useState('all');
  const [fundingSource, setFundingSource] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formTabType, setFormTabType] = React.useState('roads');
  const [editingItem, setEditingItem] = React.useState<RoadRecord | TransportStructureRecord | TrafficDisruptionRecord | RoadMaintenancePlan | TrafficSafetyRecord | null>(null);

  // Reset filters
  const handleResetFilters = React.useCallback(() => {
    setSelectedHamlet('all');
    setRoadCategory('all');
    setSurfaceType('all');
    setRoadCondition('all');
    setStructureType('all');
    setRiskLevel('all');
    setStructCondition('all');
    setIncidentType('all');
    setSeverity('all');
    setDisruptStatus('all');
    setMaintenanceProgress('all');
    setFundingSource('all');
  }, []);

  // Sync form tab type with active tab
  const handleAddClick = () => {
    setEditingItem(null);
    setFormTabType(activeTab);
    setIsFormOpen(true);
  };

  // 1. Roads Filtering
  const filteredRoads = React.useMemo(() => {
    return roads.filter((r) => {
      if (selectedHamlet !== 'all' && !r.villageCodes.includes(selectedHamlet)) return false;
      if (roadCategory !== 'all' && r.category !== roadCategory) return false;
      if (surfaceType !== 'all' && r.surfaceType !== surfaceType) return false;
      if (roadCondition !== 'all' && r.condition !== roadCondition) return false;
      return true;
    });
  }, [roads, selectedHamlet, roadCategory, surfaceType, roadCondition]);

  // 2. Structures Filtering
  const filteredStructures = React.useMemo(() => {
    return structures.filter((s) => {
      if (selectedHamlet !== 'all' && s.villageCode !== selectedHamlet) return false;
      if (structureType !== 'all' && s.type !== structureType) return false;
      if (riskLevel !== 'all' && s.riskLevel !== riskLevel) return false;
      if (structCondition !== 'all' && s.condition !== structCondition) return false;
      return true;
    });
  }, [structures, selectedHamlet, structureType, riskLevel, structCondition]);

  // 3. Disruptions Filtering
  const filteredDisruptions = React.useMemo(() => {
    return disruptions.filter((d) => {
      if (selectedHamlet !== 'all' && d.villageCode !== selectedHamlet) return false;
      if (incidentType !== 'all' && d.incidentType !== incidentType) return false;
      if (severity !== 'all' && d.severity !== severity) return false;
      if (disruptStatus !== 'all' && d.status !== disruptStatus) return false;
      return true;
    });
  }, [disruptions, selectedHamlet, incidentType, severity, disruptStatus]);

  // 4. Maintenance plans Filtering
  const filteredPlans = React.useMemo(() => {
    return maintenancePlans.filter((p) => {
      if (selectedHamlet !== 'all' && p.villageCode !== selectedHamlet) return false;
      if (maintenanceProgress !== 'all' && p.progress !== maintenanceProgress) return false;
      if (fundingSource !== 'all' && p.fundingSource !== fundingSource) return false;
      return true;
    });
  }, [maintenancePlans, selectedHamlet, maintenanceProgress, fundingSource]);

  // 5. Safety records Filtering
  const filteredSafety = React.useMemo(() => {
    return safetyRecords.map(s => {
      // Dynamic village mock label
      const name = selectedHamlet === 'all' ? 'Toàn xã Lao Bảo' : (HAMLETS.find(h => h.code === selectedHamlet)?.name || 'Toàn xã');
      return { ...s, villageName: name };
    });
  }, [safetyRecords, selectedHamlet]);

  // Edit / Delete callbacks
  const handleEditItem = React.useCallback((tab: string, item: RoadRecord | TransportStructureRecord | TrafficDisruptionRecord | RoadMaintenancePlan | TrafficSafetyRecord) => {
    setEditingItem(item);
    setFormTabType(tab);
    setIsFormOpen(true);
  }, []);

  const handleDeleteItem = React.useCallback((item: RoadRecord | TransportStructureRecord | TrafficDisruptionRecord | RoadMaintenancePlan | TrafficSafetyRecord) => {
    toast.success('Xóa dữ liệu thành công!', {
      description: `Đã gỡ bỏ bản ghi ra khỏi cơ sở dữ liệu giao thông vận tải.`,
    });

    if (activeTab === 'roads') {
      setRoads(prev => prev.filter(r => r.id !== item.id));
    } else if (activeTab === 'structures') {
      setStructures(prev => prev.filter(s => s.id !== item.id));
    } else if (activeTab === 'disruptions') {
      setDisruptions(prev => prev.filter(d => d.id !== item.id));
    } else if (activeTab === 'maintenance') {
      setMaintenancePlans(prev => prev.filter(p => p.id !== item.id));
    } else if (activeTab === 'safety') {
      setSafetyRecords(prev => prev.filter(s => s.id !== item.id));
    }
  }, [activeTab]);

  const handleResolveDisruption = React.useCallback((item: TrafficDisruptionRecord) => {
    toast.success('Thông tuyến thành công!', {
      description: `Đã xác nhận tuyến đường ${item.roadName} đã thông suốt trở lại.`,
    });

    setDisruptions((prev) =>
      prev.map((d) =>
        d.id === item.id
          ? {
              ...d,
              status: 'resolved',
              reopenedAt: new Date().toISOString(),
              disruptionDays: Math.ceil(
                (new Date().getTime() - new Date(d.occurredAt).getTime()) / (1000 * 60 * 60 * 24)
              ) || 1,
            }
          : d
      )
    );
  }, []);

  const handleExport = React.useCallback((title: string, format: 'excel' | 'pdf') => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Đang kết xuất báo cáo ${title.replace(/_/g, ' ')} dạng ${format.toUpperCase()}...`,
        success: `Xuất dữ liệu thành công! Tệp đã được lưu trữ trong danh sách lịch sử.`,
        error: 'Lỗi khi xuất dữ liệu.',
      }
    );
  }, []);

  const getButtonText = () => {
    switch (activeTab) {
      case 'roads': return 'Tuyến đường';
      case 'structures': return 'Cầu / cống';
      case 'disruptions': return 'Sự cố chia cắt';
      case 'maintenance': return 'Kế hoạch duy tu';
      case 'safety': return 'Vụ việc ATGT';
      default: return 'Ghi nhận';
    }
  };

  const actions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('Báo_cáo_giao_thông_vận_tải_tổng_hợp', 'excel')}
        className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none font-semibold text-emerald-600"
      >
        <FileSpreadsheet className="size-4 mr-1.5" />
        Xuất Excel
      </Button>

      {!isLeader && activeTab !== 'report' && (
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
        value: 'roads',
        label: 'Tuyến đường',
        content: (
          <RoadsTable
            data={filteredRoads}
            userRole={userRole}
            onEdit={(item) => handleEditItem('roads', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'structures',
        label: 'Cầu, cống, ngầm tràn',
        content: (
          <StructuresTable
            data={filteredStructures}
            userRole={userRole}
            onEdit={(item) => handleEditItem('structures', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'disruptions',
        label: 'Sự cố chia cắt',
        content: (
          <DisruptionsTable
            data={filteredDisruptions}
            userRole={userRole}
            onEdit={(item) => handleEditItem('disruptions', item)}
            onDelete={handleDeleteItem}
            onResolve={handleResolveDisruption}
          />
        ),
      },
      {
        value: 'maintenance',
        label: 'Duy tu, sửa chữa',
        content: (
          <MaintenancePlansTable
            data={filteredPlans}
            userRole={userRole}
            onEdit={(item) => handleEditItem('maintenance', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'safety',
        label: 'An ninh giao thông',
        content: (
          <TrafficSafetyTable
            data={filteredSafety}
            userRole={userRole}
            onEdit={(item) => handleEditItem('safety', item)}
            onDelete={handleDeleteItem}
          />
        ),
      },
      {
        value: 'report',
        label: 'Báo cáo hiện trạng',
        content: (
          <TransportationReportSection
            selectedHamletCode={selectedHamlet}
            onExport={handleExport}
          />
        ),
      },
    ],
    [
      filteredRoads,
      filteredStructures,
      filteredDisruptions,
      filteredPlans,
      filteredSafety,
      selectedHamlet,
      userRole,
      handleEditItem,
      handleDeleteItem,
      handleResolveDisruption,
      handleExport
    ]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <PageHeader
        title="Quản lý Giao thông vận tải"
        description="Giám sát hiện trạng mạng lưới tuyến đường giao thông, danh mục cầu cống ngầm tràn, theo dõi lịch sử sạt lở ách tắc và dự án duy tu sửa chữa xã Lao Bảo"
        actions={actions}
      />

      {/* Summary metric cards */}
      <TransportationSummary selectedHamletCode={selectedHamlet} />

      {/* Filters bar */}
      <TransportationFilters
        activeTab={activeTab}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        
        roadCategory={roadCategory}
        setRoadCategory={setRoadCategory}
        surfaceType={surfaceType}
        setSurfaceType={setSurfaceType}
        condition={activeTab === 'roads' ? roadCondition : structCondition}
        setCondition={activeTab === 'roads' ? setRoadCondition : setStructCondition}
        
        structureType={structureType}
        setStructureType={setStructureType}
        riskLevel={riskLevel}
        setRiskLevel={setRiskLevel}
        
        incidentType={incidentType}
        setIncidentType={setIncidentType}
        severity={severity}
        setSeverity={setSeverity}
        disruptStatus={disruptStatus}
        setDisruptStatus={setDisruptStatus}
        
        maintenanceProgress={maintenanceProgress}
        setMaintenanceProgress={setMaintenanceProgress}
        fundingSource={fundingSource}
        setFundingSource={setFundingSource}
        
        onReset={handleResetFilters}
      />

      {/* Interactive Tabs Layout */}
      <CommonTabs
        tabs={tabs}
        defaultValue="roads"
        onValueChange={setActiveTab}
      />

      {/* Form dialog to Add or Edit */}
      <TransportationFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabType={formTabType}
        editingItem={editingItem}
      />
    </div>
  );
}
