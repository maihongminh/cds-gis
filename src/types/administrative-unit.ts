export interface Province {
  code: string;
  name: string;
}

export interface Commune {
  code: string;
  name: string;
  provinceCode: string;
  areaHa: number;
  population: number;
  householdCount: number;
}

export interface Village {
  code: string;
  name: string;
  communeCode: string;
  areaHa: number;
  population: number;
  householdCount: number;
  center?: [number, number]; // [Lng, Lat]
  geometryStatus: 'none' | 'point' | 'polygon';
}

/**
 * Backward compatibility type mapping to support existing code
 */
export interface AdministrativeUnit {
  code: string;
  name: string;
  type: 'commune' | 'hamlet';
  parentCode?: string;
  areaHa?: number;
  population?: number;
  householdCount?: number;
}
