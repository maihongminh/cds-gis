import type { FeatureCollection, Polygon } from 'geojson';

type ScenarioProperties = {
  id: string;
  name: string;
  scenario: 'current' | 'planned';
  dataStatus: 'mock';
};

/**
 * Demonstration-only geometries used to validate the current/planned layer
 * workflow. They must be replaced by approved planning datasets.
 */
export const MOCK_CURRENT_STATE: FeatureCollection<Polygon, ScenarioProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'current-zone-01',
      properties: {
        id: 'current-zone-01',
        name: 'Khu hiện trạng minh họa',
        scenario: 'current',
        dataStatus: 'mock',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [106.603, 16.626],
          [106.619, 16.626],
          [106.621, 16.638],
          [106.607, 16.643],
          [106.601, 16.635],
          [106.603, 16.626],
        ]],
      },
    },
  ],
};

export const MOCK_PLANNED_STATE: FeatureCollection<Polygon, ScenarioProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'planned-zone-01',
      properties: {
        id: 'planned-zone-01',
        name: 'Khu kế hoạch minh họa',
        scenario: 'planned',
        dataStatus: 'mock',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [106.611, 16.623],
          [106.629, 16.625],
          [106.632, 16.639],
          [106.619, 16.647],
          [106.608, 16.639],
          [106.611, 16.623],
        ]],
      },
    },
  ],
};
