import { AdministrativeUnit } from '@/types/administrative-unit';
import { COMMUNE as LAOBAO_COMMUNE, VILLAGES } from './laobao-administrative-units';

export const COMMUNE: AdministrativeUnit = {
  code: LAOBAO_COMMUNE.code,
  name: LAOBAO_COMMUNE.name,
  type: 'commune' as const,
  areaHa: LAOBAO_COMMUNE.areaHa,
  population: LAOBAO_COMMUNE.population,
  householdCount: LAOBAO_COMMUNE.householdCount,
};

export const MOCK_HAMLETS: AdministrativeUnit[] = VILLAGES.map((v) => ({
  code: v.code,
  name: v.name,
  type: 'hamlet' as const,
  parentCode: v.communeCode,
  areaHa: v.areaHa,
  population: v.population,
  householdCount: v.householdCount,
}));
