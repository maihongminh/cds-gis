'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { MOCK_HOUSEHOLD_ECONOMY } from '@/data/mock-household-economy';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { Breadcrumbs } from '@/components/common';
import { EconomyHeader } from './components/economy-header';
import { EconomyFilters } from './components/economy-filters';
import { EconomySummary } from './components/economy-summary';
import { EconomyTable } from './components/economy-table';

export default function HouseholdEconomyPage() {
  const { selectedHamletCode } = useTenant();
  const initialHamlet = selectedHamletCode;

  // Filter States
  const [selectedYear, setSelectedYear] = React.useState('2026');
  const [selectedHamlet, setSelectedHamlet] = React.useState(initialHamlet);
  const [selectedClassification, setSelectedClassification] = React.useState('all');
  const [selectedIncomeRange, setSelectedIncomeRange] = React.useState('all');

  // Sync with global header tenant switcher
  React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);

  // Handle filter resets
  const handleResetFilters = React.useCallback(() => {
    setSelectedYear('2026');
    setSelectedHamlet('all');
    setSelectedClassification('all');
    setSelectedIncomeRange('all');
  }, []);

  // Compute filtered household economy list
  const filteredEconomy = React.useMemo(() => {
    const hhMap = new Map(MOCK_HOUSEHOLDS.map((h) => [h.id, h]));

    return MOCK_HOUSEHOLD_ECONOMY.filter((rec) => {
      const hh = hhMap.get(rec.householdId);
      if (!hh) return false;

      // 1. Hamlet filter
      if (selectedHamlet !== 'all' && hh.hamletCode !== selectedHamlet) {
        return false;
      }

      // 2. Year filter
      if (rec.year !== Number(selectedYear)) {
        return false;
      }

      // 3. Poverty classification filter
      if (selectedClassification !== 'all' && rec.economicClassificationAfter !== selectedClassification) {
        return false;
      }

      // 4. Income range brackets
      if (selectedIncomeRange !== 'all') {
        const net = rec.netIncome;
        if (selectedIncomeRange === 'under_30' && net >= 30000000) return false;
        if (selectedIncomeRange === '30_60' && (net < 30000000 || net >= 60000000)) return false;
        if (selectedIncomeRange === '60_100' && (net < 60000000 || net >= 100000000)) return false;
        if (selectedIncomeRange === 'over_100' && net < 100000000) return false;
      }

      return true;
    });
  }, [selectedHamlet, selectedYear, selectedClassification, selectedIncomeRange]);

  // Compute financial totals
  const aggregates = React.useMemo(() => {
    const count = filteredEconomy.length;
    if (count === 0) {
      return {
        totalRevenue: 0,
        totalCost: 0,
        totalNetIncome: 0,
        avgHouseholdIncome: 0,
        avgPerCapitaIncome: 0,
        povertyRate: 0,
        poorCount: 0,
        nearPoorCount: 0,
      };
    }

    let totalRevenue = 0;
    let totalCost = 0;
    let totalNetIncome = 0;
    let totalPerCapitaIncome = 0;
    let poorCount = 0;
    let nearPoorCount = 0;

    filteredEconomy.forEach((rec) => {
      totalRevenue += rec.totalRevenue;
      totalCost += rec.totalCost;
      totalNetIncome += rec.netIncome;
      totalPerCapitaIncome += rec.incomePerCapita;

      if (rec.economicClassificationAfter === 'poor') {
        poorCount++;
      } else if (rec.economicClassificationAfter === 'nearPoor') {
        nearPoorCount++;
      }
    });

    const avgHouseholdIncome = Math.round(totalNetIncome / count);
    const avgPerCapitaIncome = Math.round(totalPerCapitaIncome / count);
    const povertyRate = ((poorCount + nearPoorCount) / count) * 100;

    return {
      totalRevenue,
      totalCost,
      totalNetIncome,
      avgHouseholdIncome,
      avgPerCapitaIncome,
      povertyRate,
      poorCount,
      nearPoorCount,
    };
  }, [filteredEconomy]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Breadcrumbs */}
      <Breadcrumbs />

      {/* Main Module Header */}
      <EconomyHeader />

      {/* Summary grid cards */}
      <EconomySummary
        totalRevenue={aggregates.totalRevenue}
        totalCost={aggregates.totalCost}
        totalNetIncome={aggregates.totalNetIncome}
        avgHouseholdIncome={aggregates.avgHouseholdIncome}
        avgPerCapitaIncome={aggregates.avgPerCapitaIncome}
        povertyRate={aggregates.povertyRate}
        totalCount={filteredEconomy.length}
        poorCount={aggregates.poorCount}
        nearPoorCount={aggregates.nearPoorCount}
      />

      {/* Filters bar */}
      <EconomyFilters
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedHamlet={selectedHamlet}
        setSelectedHamlet={setSelectedHamlet}
        selectedClassification={selectedClassification}
        setSelectedClassification={setSelectedClassification}
        selectedIncomeRange={selectedIncomeRange}
        setSelectedIncomeRange={setSelectedIncomeRange}
        onReset={handleResetFilters}
      />

      {/* Table grid */}
      <EconomyTable data={filteredEconomy} />
    </div>
  );
}
