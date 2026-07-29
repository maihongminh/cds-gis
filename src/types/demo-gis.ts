import type {
  Feature,
  FeatureCollection,
  Geometry,
} from 'geojson';

export type DemoGisObjectType = 'point' | 'line' | 'polygon';
export type DemoGisObjectSource = 'seed' | 'user';
export type DemoGisDataAccuracy = 'verified' | 'approximate';

export interface DemoGisProperties {
  layerId: string;
  name: string;
  category: string;
  description: string;
  objectType: DemoGisObjectType;
  status: 'saved';
  source: DemoGisObjectSource;
  dataAccuracy: DemoGisDataAccuracy;
  createdAt: string;
  updatedAt: string;
  strokeColor?: string;
  fillColor?: string;
  details?: Record<string, string | number | boolean | null>;
  [key: string]: unknown;
}

export type DemoGisFeature = Feature<Geometry, DemoGisProperties>;
export type DemoGisFeatureCollection = FeatureCollection<
  Geometry,
  DemoGisProperties
> & {
  demoSeedVersion?: number;
};
