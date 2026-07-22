import { COMMUNE, VILLAGES } from '@/data/laobao-administrative-units';

export const ADMIN_INVARIANTS = {
  TOTAL_AREA_HA: 8303,
  TOTAL_POPULATION: 23135,
  TOTAL_HOUSEHOLDS: 5445,
  VILLAGE_COUNT: 12,
} as const;

export interface InvariantCheckResult {
  isValid: boolean;
  errors: string[];
}

export function verifyAdministrativeInvariants(): InvariantCheckResult {
  const errors: string[] = [];

  // Check village count
  if (VILLAGES.length !== ADMIN_INVARIANTS.VILLAGE_COUNT) {
    errors.push(
      `Village count invariant failed: Expected ${ADMIN_INVARIANTS.VILLAGE_COUNT}, got ${VILLAGES.length}`
    );
  }

  // Calculate sums
  const totalArea = VILLAGES.reduce((sum, v) => sum + v.areaHa, 0);
  const totalPopulation = VILLAGES.reduce((sum, v) => sum + v.population, 0);
  const totalHouseholds = VILLAGES.reduce((sum, v) => sum + v.householdCount, 0);

  // Check area sum
  if (totalArea !== ADMIN_INVARIANTS.TOTAL_AREA_HA) {
    errors.push(
      `Total area invariant failed: Expected ${ADMIN_INVARIANTS.TOTAL_AREA_HA} ha, got ${totalArea} ha`
    );
  }

  // Check population sum
  if (totalPopulation !== ADMIN_INVARIANTS.TOTAL_POPULATION) {
    errors.push(
      `Total population invariant failed: Expected ${ADMIN_INVARIANTS.TOTAL_POPULATION}, got ${totalPopulation}`
    );
  }

  // Check households sum
  if (totalHouseholds !== ADMIN_INVARIANTS.TOTAL_HOUSEHOLDS) {
    errors.push(
      `Total households invariant failed: Expected ${ADMIN_INVARIANTS.TOTAL_HOUSEHOLDS}, got ${totalHouseholds}`
    );
  }

  // Check commune matching totals
  if (COMMUNE.areaHa !== ADMIN_INVARIANTS.TOTAL_AREA_HA) {
    errors.push(`Commune area mismatch: Commune has ${COMMUNE.areaHa}, invariant is ${ADMIN_INVARIANTS.TOTAL_AREA_HA}`);
  }
  if (COMMUNE.population !== ADMIN_INVARIANTS.TOTAL_POPULATION) {
    errors.push(`Commune population mismatch: Commune has ${COMMUNE.population}, invariant is ${ADMIN_INVARIANTS.TOTAL_POPULATION}`);
  }
  if (COMMUNE.householdCount !== ADMIN_INVARIANTS.TOTAL_HOUSEHOLDS) {
    errors.push(`Commune household count mismatch: Commune has ${COMMUNE.householdCount}, invariant is ${ADMIN_INVARIANTS.TOTAL_HOUSEHOLDS}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Automatically assert invariants on module load
const result = verifyAdministrativeInvariants();
if (!result.isValid) {
  console.error('=== ADMINISTRATIVE INVARIANT FAILURE ===');
  result.errors.forEach((err) => console.error(` - ${err}`));
  console.error('=========================================');
}
