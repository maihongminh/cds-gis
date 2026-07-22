export interface CatalogItem {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CropType extends CatalogItem {
  unit: string;
  isSpecialty: boolean;
}

export interface LivestockType extends CatalogItem {
  unit: string;
  vaccinationIntervalMonths: number;
}

export interface LandType extends CatalogItem {
  group: 'nong-nghiep' | 'lam-nghiep' | 'phi-nong-nghiep';
}

export interface CultivationSeason {
  code: string;
  year: number;
  season: string;
  isLocked: boolean;
}

export interface EconomicThreshold extends CatalogItem {
  incomeThresholdPerCapitaMax: number;
}

export interface EthnicityCatalogItem {
  id: string;
  code: string;
  name: string;
  localGroup?: string;
  parentEthnicityCode?: string;
  description?: string;
  status: "active" | "inactive";
}
