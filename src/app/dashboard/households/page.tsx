'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { Breadcrumbs } from '@/components/common';
import { HouseholdsHeader } from './components/households-header';
import { HouseholdsFilters } from './components/households-filters';
import { HouseholdsTable } from './components/households-table';

export default function HouseholdsPage() {
  const { selectedHamletCode } = useTenant();
  const initialHamlet = selectedHamletCode;

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedHamlet, setSelectedHamlet] = React.useState(initialHamlet);
  const [selectedEthnicity, setSelectedEthnicity] = React.useState('all');
  const [selectedClassification, setSelectedClassification] = React.useState('all');
  const [selectedCropType, setSelectedCropType] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Handle filter resets
  const handleResetFilters = React.useCallback(() => {
    setSearchQuery('');
    setSelectedHamlet('all');
    setSelectedEthnicity('all');
    setSelectedClassification('all');
    setSelectedCropType('all');
  }, []);

  // Compute filtered household lists
  const filteredHouseholds = React.useMemo(() => {
    return MOCK_HOUSEHOLDS.filter((hh) => {
      // 1. Hamlet filter
      if (selectedHamlet !== 'all' && hh.hamletCode !== selectedHamlet) {
        return false;
      }

      // 2. Ethnicity filter
      if (selectedEthnicity !== 'all' && hh.ethnicity !== selectedEthnicity) {
        return false;
      }

      // 3. Poverty classification filter
      if (selectedClassification !== 'all' && hh.economicClassification !== selectedClassification) {
        return false;
      }

      // 4. Crop type filter
      if (selectedCropType !== 'all' && !hh.mainCropTypes.includes(selectedCropType)) {
        return false;
      }

      // 5. Keyword search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = hh.code.toLowerCase().includes(query);
        const matchesName = hh.headName.toLowerCase().includes(query);
        const matchesCccd = hh.identityNumber.includes(query);
        const matchesPhone = hh.phone.includes(query);

        if (!matchesCode && !matchesName && !matchesCccd && !matchesPhone) {
          return false;
        }
      }

      return true;
    });
  }, [selectedHamlet, selectedEthnicity, selectedClassification, selectedCropType, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation breadcrumb trail */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <HouseholdsHeader />

      {/* Interactive filter console */}
      <HouseholdsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedEthnicity={selectedEthnicity}
        setSelectedEthnicity={setSelectedEthnicity}
        selectedClassification={selectedClassification}
        setSelectedClassification={setSelectedClassification}
        selectedCropType={selectedCropType}
        setSelectedCropType={setSelectedCropType}
        onReset={handleResetFilters}
      />

      {/* Visual lists panel */}
      <HouseholdsTable data={filteredHouseholds} />
    </div>
  );
}
