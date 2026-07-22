'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { MOCK_LIVESTOCK } from '@/data/mock-livestock';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { Breadcrumbs } from '@/components/common';
import { LivestockHeader } from './components/livestock-header';
import { LivestockFilters } from './components/livestock-filters';
import { LivestockTable } from './components/livestock-table';

export default function LivestockPage() {
  const { selectedHamletCode } = useTenant();
  const initialHamlet = selectedHamletCode;

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedAnimalType, setSelectedAnimalType] = React.useState('all');
  const [selectedHamlet, setSelectedHamlet] = React.useState(initialHamlet);
  const [selectedDisease, setSelectedDisease] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Handle filter resets
  const handleResetFilters = React.useCallback(() => {
    setSearchQuery('');
    setSelectedAnimalType('all');
    setSelectedHamlet('all');
    setSelectedDisease('all');
  }, []);

  // Compute filtered livestock records list
  const filteredLivestock = React.useMemo(() => {
    const hhMap = new Map(MOCK_HOUSEHOLDS.map(h => [h.id, h]));

    return MOCK_LIVESTOCK.filter((live) => {
      const hh = hhMap.get(live.householdId);
      if (!hh) return false;

      // 1. Hamlet filter
      if (selectedHamlet !== 'all' && hh.hamletCode !== selectedHamlet) {
        return false;
      }

      // 2. Animal type filter
      if (selectedAnimalType !== 'all' && live.livestockTypeCode !== selectedAnimalType) {
        return false;
      }

      // 3. Disease filter
      if (selectedDisease !== 'all' && live.diseaseStatus !== selectedDisease) {
        return false;
      }

      // 4. Keyword search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = live.id.toLowerCase().includes(query);
        const matchesHhName = live.householdHeadName.toLowerCase().includes(query);
        const matchesHhCode = live.householdCode.toLowerCase().includes(query);
        const matchesAnimalName = live.livestockTypeName.toLowerCase().includes(query);
        const matchesDiseaseType = live.diseaseType?.toLowerCase().includes(query);

        if (!matchesId && !matchesHhName && !matchesHhCode && !matchesAnimalName && !matchesDiseaseType) {
          return false;
        }
      }

      return true;
    });
  }, [selectedHamlet, selectedAnimalType, selectedDisease, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation breadcrumbs */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <LivestockHeader />

      {/* Interactive filters */}
      <LivestockFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedAnimalType={selectedAnimalType}
        setSelectedAnimalType={setSelectedAnimalType}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedDisease={selectedDisease}
        setSelectedDisease={setSelectedDisease}
        onReset={handleResetFilters}
      />

      {/* Visual lists panel */}
      <LivestockTable data={filteredLivestock} />
    </div>
  );
}
