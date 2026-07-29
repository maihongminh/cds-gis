import type { Feature, Geometry } from 'geojson';

import { VILLAGES } from './laobao-administrative-units';
import { MOCK_LAOBAO_COMMUNE_BOUNDARY } from './mock-laobao-commune-boundary';
import { MOCK_VILLAGE_BOUNDARIES } from './mock-laobao-boundary';
import { MOCK_DISASTER_RISK_ZONES } from './mock-map-disaster-risks';
import { MOCK_PUBLIC_FACILITIES } from './mock-map-public-facilities';
import {
  MOCK_CURRENT_STATE,
  MOCK_PLANNED_STATE,
} from './mock-map-scenarios';
import { MOCK_TOURISM_POIS } from './mock-map-tourism-pois';
import {
  INITIAL_MAP_LAYERS,
  MAP_LAYER_BY_ID,
  type MapLayer,
} from './gis-layer-catalog';
import type {
  DemoGisFeature,
  DemoGisFeatureCollection,
  DemoGisObjectType,
  DemoGisProperties,
} from '@/types/demo-gis';

const SEED_TIMESTAMP = '2026-07-29T00:00:00.000Z';
export const DEMO_GIS_SEED_VERSION = 1;

const tourismLayerIds = {
  tourist_attraction: 'layer-tourist-attractions',
  historical_site: 'layer-historical-sites',
  scenic_spot: 'layer-scenic-spots',
  check_in: 'layer-check-ins',
  local_product_point: 'layer-tourist-attractions',
} as const;

const facilityLayerIds = {
  health_station: 'layer-health-facilities',
  school: 'layer-schools',
  cultural_house: 'layer-cultural-houses',
  administrative_office: 'layer-administrative-offices',
  market: 'layer-markets',
  sports_facility: 'layer-cultural-houses',
  water_facility: 'layer-water-supply',
  public_infrastructure: 'layer-technical-infrastructure',
} as const;

const disasterLayerIds = {
  landslide: 'layer-landslide-risk',
  flooding: 'layer-flood-risk',
  erosion: 'layer-critical-areas',
  critical_area: 'layer-critical-areas',
} as const;

function objectTypeFromGeometry(geometry: Geometry): DemoGisObjectType {
  if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
    return 'point';
  }
  if (geometry.type === 'LineString' || geometry.type === 'MultiLineString') {
    return 'line';
  }
  return 'polygon';
}

function cleanDetails(
  details: Record<string, string | number | boolean | null | undefined>,
) {
  return Object.fromEntries(
    Object.entries(details).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean | null>;
}

function createSeedFeature(
  id: string,
  layerId: string,
  geometry: Geometry,
  input: {
    name: string;
    description?: string;
    dataAccuracy?: DemoGisProperties['dataAccuracy'];
    details?: Record<string, string | number | boolean | null | undefined>;
    extra?: Record<string, unknown>;
  },
): DemoGisFeature {
  return {
    type: 'Feature',
    id,
    geometry,
    properties: {
      layerId,
      name: input.name,
      category: MAP_LAYER_BY_ID.get(layerId)?.name ?? layerId,
      description: input.description ?? '',
      objectType: objectTypeFromGeometry(geometry),
      status: 'saved',
      source: 'seed',
      dataAccuracy: input.dataAccuracy ?? 'approximate',
      createdAt: SEED_TIMESTAMP,
      updatedAt: SEED_TIMESTAMP,
      details: cleanDetails(input.details ?? {}),
      ...input.extra,
    },
  };
}

const communeFeatures = MOCK_LAOBAO_COMMUNE_BOUNDARY.features.flatMap(
  (feature) => {
    if (!feature.geometry) return [];
    const properties = feature.properties ?? {};
    return [
      createSeedFeature(
        String(feature.id ?? 'commune-lao-bao'),
        'layer-commune',
        feature.geometry,
        {
          name: String(properties.name ?? 'Xã Lao Bảo'),
          description: String(properties.disclaimer ?? ''),
          dataAccuracy:
            properties.dataStatus === 'verified' ? 'verified' : 'approximate',
          details: {
            'Mã đơn vị': String(properties.code ?? ''),
            'Diện tích (ha)': Number(properties.areaHa ?? 0),
            'Dân số': Number(properties.population ?? 0),
            'Số hộ': Number(properties.householdCount ?? 0),
            'Số thôn': Number(properties.villageCount ?? 0),
          },
          extra: properties,
        },
      ),
    ];
  },
);

const villageBoundaryFeatures = MOCK_VILLAGE_BOUNDARIES.features.flatMap(
  (feature, index) => {
    if (!feature.geometry) return [];
    const properties = feature.properties ?? {};
    return [
      createSeedFeature(
        String(feature.id ?? properties.villageCode ?? `village-${index + 1}`),
        'layer-villages',
        feature.geometry,
        {
          name: String(properties.villageName ?? 'Ranh giới thôn'),
          description: String(properties.disclaimer ?? ''),
          details: {
            'Mã thôn': String(properties.villageCode ?? ''),
            'Diện tích (ha)': Number(properties.areaHa ?? 0),
            'Dân số': Number(properties.population ?? 0),
            'Số hộ': Number(properties.householdCount ?? 0),
          },
          extra: properties,
        },
      ),
    ];
  },
);

const villageLabelFeatures = VILLAGES.flatMap((village) => {
  if (!village.center) return [];
  return [
    createSeedFeature(
      `village-label-${village.code}`,
      'layer-village-labels',
      {
        type: 'Point',
        coordinates: village.center,
      },
      {
        name: village.name,
        description: `Nhãn vị trí trung tâm thôn ${village.name}.`,
        details: {
          'Mã thôn': village.code,
          'Diện tích (ha)': village.areaHa,
          'Dân số': village.population,
          'Số hộ': village.householdCount,
        },
        extra: {
          villageCode: village.code,
          villageName: village.name,
        },
      },
    ),
  ];
});

const tourismFeatures = MOCK_TOURISM_POIS.map((poi) => {
  const layerId = tourismLayerIds[poi.type];
  return createSeedFeature(
    poi.id,
    layerId,
    { type: 'Point', coordinates: poi.coordinates },
    {
      name: poi.name,
      description: poi.shortDescription,
      dataAccuracy: poi.dataStatus === 'verified' ? 'verified' : 'approximate',
      details: {
        'Mã dữ liệu': poi.code,
        Thôn: poi.villageName,
        'Trạng thái': poi.operatingStatus,
        'Giờ mở cửa': poi.openingHours,
        'Liên hệ': poi.contact,
      },
      extra: {
        tourismType: poi.type,
        villageCode: poi.villageCode,
        villageName: poi.villageName,
        imagePlaceholder: poi.imagePlaceholder,
      },
    },
  );
});

const facilityFeatures = MOCK_PUBLIC_FACILITIES.map((facility) => {
  const layerId = facilityLayerIds[facility.facilityType];
  return createSeedFeature(
    facility.id,
    layerId,
    { type: 'Point', coordinates: facility.coordinates },
    {
      name: facility.name,
      description: facility.addressDisplay,
      dataAccuracy:
        facility.dataStatus === 'verified' ? 'verified' : 'approximate',
      details: {
        'Mã dữ liệu': facility.code,
        Thôn: facility.villageName,
        'Đơn vị quản lý': facility.managingOrganization,
        'Địa chỉ': facility.addressDisplay,
        'Tình trạng': facility.condition,
        'Hoạt động': facility.operatingStatus,
        'Quy mô': facility.capacity,
      },
      extra: {
        facilityType: facility.facilityType,
        villageCode: facility.villageCode,
        villageName: facility.villageName,
      },
    },
  );
});

const disasterFeatures = MOCK_DISASTER_RISK_ZONES.map((zone) => {
  const layerId = disasterLayerIds[zone.riskType];
  return createSeedFeature(zone.id, layerId, zone.geometry as Geometry, {
    name: zone.name,
    description: zone.warningMessage,
    dataAccuracy: zone.dataStatus === 'verified' ? 'verified' : 'approximate',
    details: {
      'Mã dữ liệu': zone.code,
      'Mức rủi ro': zone.riskLevel,
      'Diện tích ảnh hưởng (ha)': zone.affectedAreaHa,
      'Dân số ảnh hưởng': zone.affectedPopulationEstimate,
      'Ngày đánh giá': zone.lastAssessmentDate,
      'Khuyến nghị': zone.recommendedAction,
    },
    extra: {
      riskType: zone.riskType,
      riskLevel: zone.riskLevel,
      villageCodes: zone.villageCodes,
    },
  });
});

const planningFeatures = [
  ...MOCK_CURRENT_STATE.features,
  ...MOCK_PLANNED_STATE.features,
].flatMap((feature: Feature<Geometry>, index) => {
  if (!feature.geometry) return [];
  return [
    createSeedFeature(
      String(feature.id ?? feature.properties?.id ?? `planning-${index + 1}`),
      'layer-land-use-planning',
      feature.geometry,
      {
        name: String(feature.properties?.name ?? 'Khu quy hoạch minh họa'),
        description:
          feature.properties?.scenario === 'planned'
            ? 'Dữ liệu kế hoạch sử dụng đất minh họa.'
            : 'Dữ liệu hiện trạng sử dụng đất minh họa.',
        details: {
          'Kịch bản':
            feature.properties?.scenario === 'planned'
              ? 'Kế hoạch'
              : 'Hiện trạng',
        },
        extra: {
          scenario: feature.properties?.scenario,
        },
      },
    ),
  ];
});

const baseSeedFeatures = [
  ...communeFeatures,
  ...villageBoundaryFeatures,
  ...villageLabelFeatures,
  ...tourismFeatures,
  ...facilityFeatures,
  ...disasterFeatures,
  ...planningFeatures,
];

const demoAnchorVillages = VILLAGES.filter(
  (village) => village.center !== undefined,
);

function createFallbackGeometry(
  geometryType: MapLayer['geometryType'],
  index: number,
): Geometry {
  const village = demoAnchorVillages[index % demoAnchorVillages.length];
  const [anchorLongitude, anchorLatitude] = village.center!;
  const longitude =
    anchorLongitude + ((index % 3) - 1) * 0.00035;
  const latitude =
    anchorLatitude + ((Math.floor(index / 3) % 3) - 1) * 0.00035;

  if (geometryType === 'point') {
    return { type: 'Point', coordinates: [longitude, latitude] };
  }
  if (geometryType === 'line') {
    return {
      type: 'LineString',
      coordinates: [
        [longitude - 0.0012, latitude - 0.0005],
        [longitude, latitude + 0.0006],
        [longitude + 0.0012, latitude - 0.0001],
      ],
    };
  }

  const delta = 0.001;
  return {
    type: 'Polygon',
    coordinates: [
      [
        [longitude - delta, latitude - delta],
        [longitude + delta, latitude - delta],
        [longitude + delta, latitude + delta],
        [longitude - delta, latitude + delta],
        [longitude - delta, latitude - delta],
      ],
    ],
  };
}

const populatedLayerIds = new Set(
  baseSeedFeatures.map((feature) => feature.properties.layerId),
);

const fallbackDemoFeatures = INITIAL_MAP_LAYERS.filter(
  (layer) => !populatedLayerIds.has(layer.id),
).map((layer, index) => {
  const village = demoAnchorVillages[index % demoAnchorVillages.length];
  return createSeedFeature(
    `demo-${layer.id}`,
    layer.id,
    createFallbackGeometry(layer.geometryType, index),
    {
      name: `${layer.name} minh họa`,
      description: `Đối tượng ${layer.name.toLocaleLowerCase('vi')} dùng để minh họa chức năng lớp dữ liệu tại ${village.name}.`,
      details: {
        'Mã dữ liệu': `DEMO-${String(index + 1).padStart(3, '0')}`,
        Thôn: village.name,
        Nguồn: 'Dữ liệu mô phỏng POC',
        'Trạng thái': 'Đang hoạt động',
        'Độ chính xác': 'Vị trí minh họa',
      },
      extra: {
        mockGenerated: true,
        villageCode: village.code,
        villageName: village.name,
      },
    },
  );
});

export const DEMO_GIS_SEED: DemoGisFeatureCollection = {
  type: 'FeatureCollection',
  demoSeedVersion: DEMO_GIS_SEED_VERSION,
  features: [
    ...baseSeedFeatures,
    ...fallbackDemoFeatures,
  ],
};
