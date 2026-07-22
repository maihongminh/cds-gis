'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { MOCK_FOREST_DVMTR } from '@/data/mock-forest-dvmtr';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { MOCK_LANDS } from '@/data/mock-lands';
import { Breadcrumbs } from '@/components/common';
import { ForestHeader } from './components/forest-header';
import { ForestFilters } from './components/forest-filters';
import { ForestSummary } from './components/forest-summary';
import { ForestTable } from './components/forest-table';

export default function ForestDvmtrPage() {
  const { selectedHamletCode } = useTenant();
  const initialHamlet = selectedHamletCode;

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedForestType, setSelectedForestType] = React.useState('all');
  const [selectedHamlet, setSelectedHamlet] = React.useState(initialHamlet);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = React.useState('all');
  const [selectedContractStatus, setSelectedContractStatus] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Handle filter resets
  const handleResetFilters = React.useCallback(() => {
    setSearchQuery('');
    setSelectedForestType('all');
    setSelectedHamlet('all');
    setSelectedPaymentStatus('all');
    setSelectedContractStatus('all');
  }, []);

  // Compute filtered forest guard contracts list
  const filteredContracts = React.useMemo(() => {
    const hhMap = new Map(MOCK_HOUSEHOLDS.map((h) => [h.id, h]));

    // Group land plots by household ID for forest type checking
    const hhLandsMap = new Map<string, typeof MOCK_LANDS>();
    MOCK_LANDS.forEach((l) => {
      const existing = hhLandsMap.get(l.householdId) || [];
      hhLandsMap.set(l.householdId, [...existing, l]);
    });

    return MOCK_FOREST_DVMTR.filter((contract) => {
      const hh = hhMap.get(contract.householdId);
      if (!hh) return false;

      // 1. Hamlet filter
      if (selectedHamlet !== 'all' && hh.hamletCode !== selectedHamlet) {
        return false;
      }

      // 2. Forest type filter (derived from land plots)
      if (selectedForestType !== 'all') {
        const lands = hhLandsMap.get(contract.householdId) || [];
        const matchesType = lands.some((l) => l.landTypeCode === selectedForestType);
        if (!matchesType) return false;
      }

      // 3. Payment Status filter
      if (selectedPaymentStatus !== 'all' && contract.paymentStatus !== selectedPaymentStatus) {
        return false;
      }

      // 4. Contract Status filter
      if (selectedContractStatus !== 'all' && contract.status !== selectedContractStatus) {
        return false;
      }

      // 5. Keyword search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = contract.contractCode.toLowerCase().includes(query);
        const matchesHhName = contract.householdHeadName.toLowerCase().includes(query);
        const matchesHhCode = contract.householdCode.toLowerCase().includes(query);
        const matchesBlock = contract.forestBlock.toLowerCase().includes(query);

        if (!matchesCode && !matchesHhName && !matchesHhCode && !matchesBlock) {
          return false;
        }
      }

      return true;
    });
  }, [selectedHamlet, selectedForestType, selectedPaymentStatus, selectedContractStatus, searchQuery]);

  // Compute totals for summary statistics
  const aggregates = React.useMemo(() => {
    let totalArea = 0;
    let totalBudget = 0;
    let totalPaidAmount = 0;
    const participatingHouseholds = new Set<string>();

    filteredContracts.forEach((c) => {
      totalArea += c.contractedAreaHa;
      totalBudget += c.totalAmount;
      participatingHouseholds.add(c.householdId);

      if (c.paymentStatus === 'paid') {
        totalPaidAmount += c.totalAmount;
      } else if (c.paymentStatus === 'partially_paid') {
        totalPaidAmount += Math.round(c.totalAmount * 0.5); // 50% paid simulation
      }
    });

    const payoutProgress = totalBudget > 0 ? (totalPaidAmount / totalBudget) * 100 : 0;

    return {
      totalArea,
      totalBudget,
      totalPaidAmount,
      payoutProgress,
      householdCount: participatingHouseholds.size,
    };
  }, [filteredContracts]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Breadcrumbs */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <ForestHeader />

      {/* Summary metric cards */}
      <ForestSummary
        totalArea={aggregates.totalArea}
        totalBudget={aggregates.totalBudget}
        payoutProgress={aggregates.payoutProgress}
        householdCount={aggregates.householdCount}
        totalPaidAmount={aggregates.totalPaidAmount}
      />

      {/* Filters bar */}
      <ForestFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedForestType={selectedForestType}
        setSelectedForestType={setSelectedForestType}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedPaymentStatus={selectedPaymentStatus}
        setSelectedPaymentStatus={setSelectedPaymentStatus}
        selectedContractStatus={selectedContractStatus}
        setSelectedContractStatus={setSelectedContractStatus}
        onReset={handleResetFilters}
      />

      {/* Table grid */}
      <ForestTable data={filteredContracts} />
    </div>
  );
}
