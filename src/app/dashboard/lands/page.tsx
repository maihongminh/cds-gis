'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { MOCK_LANDS } from '@/data/mock-lands';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { Breadcrumbs } from '@/components/common';
import { LandsHeader } from './components/lands-header';
import { LandsFilters } from './components/lands-filters';
import { LandsTable } from './components/lands-table';
import { MetricCard } from '@/components/common';
import { Map as MapIcon, Award, Sprout, Users } from 'lucide-react';

export default function LandsPage() {
  const { selectedHamletCode } = useTenant();
  const initialHamlet = selectedHamletCode;

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLandType, setSelectedLandType] = React.useState('all');
  const [selectedHamlet, setSelectedHamlet] = React.useState(initialHamlet);
  const [selectedCertStatus, setSelectedCertStatus] = React.useState('all');
  const [selectedOwnership, setSelectedOwnership] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Handle filter resets
  const handleResetFilters = React.useCallback(() => {
    setSearchQuery('');
    setSelectedLandType('all');
    setSelectedHamlet('all');
    setSelectedCertStatus('all');
    setSelectedOwnership('all');
  }, []);

  // Compute filtered land records list
  const filteredLands = React.useMemo(() => {
    const hhMap = new Map(MOCK_HOUSEHOLDS.map((h) => [h.id, h]));

    return MOCK_LANDS.filter((land) => {
      const hh = hhMap.get(land.householdId);
      if (!hh) return false;

      // 1. Hamlet filter
      if (selectedHamlet !== 'all' && hh.hamletCode !== selectedHamlet) {
        return false;
      }

      // 2. Land type filter
      if (selectedLandType !== 'all' && land.landTypeCode !== selectedLandType) {
        return false;
      }

      // 3. Cert status filter
      if (selectedCertStatus !== 'all' && land.certificateStatus !== selectedCertStatus) {
        return false;
      }

      // 4. Ownership type filter
      if (selectedOwnership !== 'all' && land.ownershipType !== selectedOwnership) {
        return false;
      }

      // 5. Keyword search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesParcel = land.parcelCode.toLowerCase().includes(query);
        const matchesHhName = land.householdHeadName.toLowerCase().includes(query);
        const matchesHhCode = land.householdCode.toLowerCase().includes(query);
        const matchesCertNum = land.certificateNumber?.toLowerCase().includes(query);

        if (!matchesParcel && !matchesHhName && !matchesHhCode && !matchesCertNum) {
          return false;
        }
      }

      return true;
    });
  }, [selectedHamlet, selectedLandType, selectedCertStatus, selectedOwnership, searchQuery]);

  // Compute summary stats
  const stats = React.useMemo(() => {
    const totalArea = filteredLands.reduce((sum, land) => sum + land.areaHa, 0);
    const grantedCount = filteredLands.filter((l) => l.certificateStatus === 'granted').length;
    const certProgress = filteredLands.length > 0 ? Math.round((grantedCount / filteredLands.length) * 100) : 0;
    const activeCount = filteredLands.filter((l) => l.status === 'active').length;
    const activeProgress = filteredLands.length > 0 ? Math.round((activeCount / filteredLands.length) * 100) : 0;
    const uniqueHouseholds = new Set(filteredLands.map((l) => l.householdId)).size;

    return {
      totalArea: totalArea.toFixed(2),
      certProgress,
      activeCount,
      activeProgress,
      uniqueHouseholds,
    };
  }, [filteredLands]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Breadcrumbs */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <LandsHeader />

      {/* Summary metric cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Tổng diện tích đất"
          value={`${stats.totalArea} ha`}
          description="Diện tích đất nông - lâm nghiệp"
          icon={<MapIcon className="w-4 h-4 text-primary" />}
        />
        <MetricCard
          title="Tỷ lệ đã cấp sổ đỏ"
          value={`${stats.certProgress}%`}
          description="Đã được phê duyệt & bàn giao GCN"
          icon={<Award className="w-4 h-4 text-emerald-500" />}
          trend={{ value: stats.certProgress, isPositive: true, label: 'Đạt chỉ tiêu' }}
        />
        <MetricCard
          title="Thửa đất đang canh tác"
          value={stats.activeCount}
          description={`Chiếm ${stats.activeProgress}% tổng số thửa`}
          icon={<Sprout className="w-4 h-4 text-amber-500" />}
        />
        <MetricCard
          title="Hộ dân có quyền sử dụng"
          value={stats.uniqueHouseholds}
          description="Tổng số hộ liên kết địa chính"
          icon={<Users className="w-4 h-4 text-blue-500" />}
        />
      </div>

      {/* Filters bar */}
      <LandsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLandType={selectedLandType}
        setSelectedLandType={setSelectedLandType}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedCertStatus={selectedCertStatus}
        setSelectedCertStatus={setSelectedCertStatus}
        selectedOwnership={selectedOwnership}
        setSelectedOwnership={setSelectedOwnership}
        onReset={handleResetFilters}
      />

      {/* Table grid */}
      <LandsTable data={filteredLands} />
    </div>
  );
}
