'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { MOCK_CROPS } from '@/data/mock-crops';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { MOCK_CROP_CHANGES } from '@/data/mock-crop-changes';
import { Breadcrumbs, CommonTabs, PageHeader, SectionCard, StatusBadge } from '@/components/common';
import { CropsHeader } from './components/crops-header';
import { CropsFilters } from './components/crops-filters';
import { CropsTable } from './components/crops-table';

// Import v1.1 Crop Changes components
import { CropChangesFilters } from './components/crop-changes-filters';
import { CropChangesTable } from './components/crop-changes-table';
import { CropChangeFormDialog } from './components/crop-change-form-dialog';
import { CropChangeRecord } from '@/types/crop-change';
import { Sprout, TrendingUp, ScanLine, AlertTriangle, ShieldCheck, MapPin, BadgePercent } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { toast } from 'sonner';

export default function CropsPage() {
  const { selectedHamletCode } = useTenant();
  const initialHamlet = selectedHamletCode;

  // Active Tab State
  const [activeTab, setActiveTab] = React.useState<string>('crops');

  // Tab 1: Crops filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCropType, setSelectedCropType] = React.useState('all');
  const [selectedHamlet, setSelectedHamlet] = React.useState(initialHamlet);
  const [selectedSeason, setSelectedSeason] = React.useState('all');
  const [selectedDisease, setSelectedDisease] = React.useState('all');

  // Tab 2: Changes filter states
  const [changeSearchQuery, setChangeSearchQuery] = React.useState('');
  const [changeCropType, setChangeCropType] = React.useState('all');
  const [changeHamlet, setChangeHamlet] = React.useState(initialHamlet);
  const [changePeriod, setChangePeriod] = React.useState('all');
  const [changeReason, setChangeReason] = React.useState('all');
  const [filterSignificant, setFilterSignificant] = React.useState(false);

  // Crop change dialog states
  const [isChangeFormOpen, setIsChangeFormOpen] = React.useState(false);
  const [editingChangeItem, setEditingChangeItem] = React.useState<CropChangeRecord | null>(null);

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
    setChangeHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Handle resets
  const handleResetFilters = React.useCallback(() => {
    setSearchQuery('');
    setSelectedCropType('all');
    setSelectedHamlet('all');
    setSelectedSeason('all');
    setSelectedDisease('all');
  }, []);

  const handleResetChangeFilters = React.useCallback(() => {
    setChangeSearchQuery('');
    setChangeCropType('all');
    setChangeHamlet('all');
    setChangePeriod('all');
    setChangeReason('all');
    setFilterSignificant(false);
  }, []);

  // Compute filtered crops list (Tab 1)
  const filteredCrops = React.useMemo(() => {
    const hhMap = new Map(MOCK_HOUSEHOLDS.map(h => [h.id, h]));
    return MOCK_CROPS.filter((crop) => {
      const hh = hhMap.get(crop.householdId);
      if (!hh) return false;

      if (selectedHamlet !== 'all' && hh.hamletCode !== selectedHamlet) return false;
      if (selectedCropType !== 'all' && crop.cropTypeCode !== selectedCropType) return false;
      if (selectedSeason !== 'all' && crop.seasonYear !== selectedSeason) return false;
      if (selectedDisease !== 'all' && crop.diseaseStatus !== selectedDisease) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = crop.id.toLowerCase().includes(query);
        const matchesHhName = crop.householdHeadName.toLowerCase().includes(query);
        const matchesHhCode = crop.householdCode.toLowerCase().includes(query);
        const matchesCropName = crop.cropTypeName.toLowerCase().includes(query);
        const matchesAreaCode = crop.growingAreaCode?.toLowerCase().includes(query);

        if (!matchesId && !matchesHhName && !matchesHhCode && !matchesCropName && !matchesAreaCode) {
          return false;
        }
      }
      return true;
    });
  }, [selectedHamlet, selectedCropType, selectedSeason, selectedDisease, searchQuery]);

  // Compute filtered changes list (Tab 2)
  const filteredChanges = React.useMemo(() => {
    return MOCK_CROP_CHANGES.filter((item) => {
      if (changeHamlet !== 'all' && item.villageCode !== changeHamlet) return false;
      if (changeCropType !== 'all' && item.cropTypeCode !== changeCropType) return false;
      if (changePeriod !== 'all' && item.period !== changePeriod) return false;
      if (changeReason !== 'all' && item.reason !== changeReason) return false;

      if (filterSignificant && Math.abs(item.changePercent) < 20) return false;

      if (changeSearchQuery.trim() !== '') {
        const query = changeSearchQuery.toLowerCase().trim();
        const matchesHhId = item.householdId.toLowerCase().includes(query);
        const matchesVillage = item.villageName.toLowerCase().includes(query);
        const matchesCrop = item.cropTypeName.toLowerCase().includes(query);
        const matchesNote = item.note?.toLowerCase().includes(query);

        if (!matchesHhId && !matchesVillage && !matchesCrop && !matchesNote) {
          return false;
        }
      }
      return true;
    });
  }, [changeHamlet, changeCropType, changePeriod, changeReason, filterSignificant, changeSearchQuery]);

  // Change table actions
  const handleEditChange = (item: CropChangeRecord) => {
    setEditingChangeItem(item);
    setIsChangeFormOpen(true);
  };

  const handleDeleteChange = (item: CropChangeRecord) => {
    toast.success('Xóa ghi nhận biến động thành công!', {
      description: `Đã xóa bản ghi biến động mã ${item.id}`,
    });
  };

  const handleAddChangeClick = () => {
    setEditingChangeItem(null);
    setIsChangeFormOpen(true);
  };

  const handleExportChangeReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang kết xuất báo cáo biến động...',
        success: 'Xuất báo cáo thành công! Tệp PDF báo cáo biến động đã được tải về.',
        error: 'Lỗi xuất báo cáo.',
      }
    );
  };

  // Build Tab structures
  const tabs = React.useMemo(() => [
    {
      value: 'crops',
      label: 'Dữ liệu cây trồng',
      icon: <Sprout className="size-4" />,
      content: (
        <div className="space-y-4">
          <CropsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCropType={selectedCropType}
            setSelectedCropType={setSelectedCropType}
            selectedHamlet={selectedHamlet}
            setSelectedHamlet={setSelectedHamlet}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
            selectedDisease={selectedDisease}
            setSelectedDisease={setSelectedDisease}
            onReset={handleResetFilters}
          />
          <CropsTable data={filteredCrops} />
        </div>
      ),
    },
    {
      value: 'changes',
      label: 'Biến động số liệu',
      icon: <TrendingUp className="size-4" />,
      content: (
        <div className="space-y-4">
          <CropChangesFilters
            searchQuery={changeSearchQuery}
            setSearchQuery={setChangeSearchQuery}
            selectedCropType={changeCropType}
            setSelectedCropType={setChangeCropType}
            selectedHamlet={changeHamlet}
            setSelectedHamlet={setChangeHamlet}
            selectedPeriod={changePeriod}
            setSelectedPeriod={setChangePeriod}
            selectedReason={changeReason}
            setSelectedReason={setChangeReason}
            filterSignificant={filterSignificant}
            setFilterSignificant={setFilterSignificant}
            onReset={handleResetChangeFilters}
          />
          <CropChangesTable
            data={filteredChanges}
            onEdit={handleEditChange}
            onDelete={handleDeleteChange}
          />
        </div>
      ),
    },
    {
      value: 'gac',
      label: 'Mã số vùng trồng',
      icon: <ScanLine className="size-4" />,
      content: (
        <SectionCard title="Mã số vùng trồng (GAC - Growing Area Code)">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 font-semibold text-primary bg-primary/10 rounded-full border border-primary/20">Chức năng nâng cao</span>
              <span className="text-xs text-muted-foreground">Theo dõi mã xuất khẩu chính ngạch sâm và quế xã Lao Bảo</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Mã số vùng trồng là mã số định danh cho một vùng sản xuất nhằm phục vụ việc kiểm soát nguồn gốc và đáp ứng các tiêu chuẩn vệ sinh dịch tễ để xuất khẩu. Hệ thống đang đồng bộ định danh với Cục Bảo vệ thực vật.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { code: 'GAC-SAM-TRATAP-01', location: 'Thôn 01 - Đỉnh Ngọc Linh', area: '15.5 ha', crop: 'Cà phê Arabica', status: 'active', label: 'Đang hoạt động' },
                { code: 'GAC-QUE-TRATAP-02', location: 'Thôn 03 - Thung lũng sông Tranh', area: '42.0 ha', crop: 'Chuối Lao Bảo', status: 'active', label: 'Đang hoạt động' },
                { code: 'GAC-SAM-TRATAP-03', location: 'Thôn 05 - Đồi Mây', area: '8.2 ha', crop: 'Cà phê Arabica', status: 'pending', label: 'Đang kiểm định' }
              ].map((g, i) => (
                <Card key={i} className="bg-muted/10 border-border">
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-primary">{g.code}</span>
                      <StatusBadge status={g.status === 'active' ? 'active' : 'processing'} customLabel={g.label} />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Địa bàn:</span> <span className="font-medium text-foreground">{g.location}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Diện tích:</span> <span className="font-medium text-foreground">{g.area}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Cây trồng:</span> <span className="font-medium text-foreground">{g.crop}</span></div>
                    </div>
                    <div className="pt-2 border-t border-border/40 flex justify-end">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-primary hover:bg-primary/5 cursor-pointer shadow-none">
                        Xem bản vẽ ranh giới (GIS)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </SectionCard>
      ),
    },
    {
      value: 'diseases',
      label: 'Dịch bệnh hại',
      icon: <AlertTriangle className="size-4" />,
      content: (
        <SectionCard title="Tình hình sâu bệnh và dịch hại nông nghiệp">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 font-semibold text-rose-600 bg-rose-500/10 rounded-full border border-rose-500/20">Cảnh báo rủi ro</span>
              <span className="text-xs text-muted-foreground">Giám sát các ổ dịch bệnh hại ảnh hưởng sản xuất nông nghiệp</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Theo dõi diễn biến các loại bệnh hại như bệnh thối củ cà phê Arabica, rầy nâu hại lúa rẫy và bệnh nấm quế non. Đưa ra các khuyến cáo kịp thời cho bà con nông dân.
            </p>

            <div className="space-y-3">
              {[
                { title: 'Bệnh thối củ cà phê Arabica (Nấm Phytophthora)', location: 'Thôn 02', area: '1.2 ha sâm bị ảnh hưởng', severity: 'high', status: 'Đang khoanh vùng xử lý' },
                { title: 'Rầy nâu phá hoại lúa rẫy', location: 'Thôn 05', area: '3.5 ha lúa rẫy', severity: 'medium', status: 'Đang theo dõi' },
                { title: 'Bệnh khô cành hại chuối Lao Bảo', location: 'Thôn 03', area: '500 cây quế non', severity: 'low', status: 'Đã dập dịch hoàn toàn' }
              ].map((d, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border bg-muted/10 rounded-xl gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-sm ${d.severity === 'high' ? 'bg-rose-500/10 text-rose-500' : d.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                        Mức độ {d.severity === 'high' ? 'Nghiêm trọng' : d.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" /> {d.location}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-foreground">{d.title}</h5>
                    <p className="text-xs text-muted-foreground">{d.area}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:self-center">
                    <StatusBadge status={d.severity === 'high' ? 'inactive' : d.severity === 'medium' ? 'warning' : 'active'} customLabel={d.status} />
                    <Button variant="outline" size="xs" className="h-8 text-xs cursor-pointer shadow-none">
                      Xem khuyến cáo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      ),
    },
  ], [searchQuery, selectedCropType, selectedHamlet, selectedSeason, selectedDisease, filteredCrops, handleResetFilters, changeSearchQuery, changeCropType, changeHamlet, changePeriod, changeReason, filterSignificant, filteredChanges, handleResetChangeFilters]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Dynamic Header */}
      <CropsHeader
        activeTab={activeTab}
        onAddChangeClick={handleAddChangeClick}
        onExportChangeClick={handleExportChangeReport}
      />

      {/* Tabs Layout */}
      <CommonTabs
        tabs={tabs}
        defaultValue="crops"
        onValueChange={setActiveTab}
      />

      {/* Dialog for recording crop changes */}
      <CropChangeFormDialog
        isOpen={isChangeFormOpen}
        onOpenChange={setIsChangeFormOpen}
        editingItem={editingChangeItem}
      />
    </div>
  );
}
