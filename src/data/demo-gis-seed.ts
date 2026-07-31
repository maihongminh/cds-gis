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
export const DEMO_GIS_SEED_VERSION = 4;
export const DEMO_GIS_RETIRED_SEED_IDS = [
  'demo-layer-households',
  'demo-layer-working-age-population',
  'demo-layer-active-investment-projects',
  'demo-layer-construction-planning',
  'demo-layer-zoning-planning',
  ...VILLAGES.flatMap((village) =>
    [1, 2, 3].map((index) => `household-${village.code}-${index}`),
  ),
  ...VILLAGES.map((village) => `working-age-zone-${village.code}`),
] as const;

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

interface ResidentialCluster {
  id: string;
  name: string;
  areaDescription: string;
  buildingCenters: Array<[number, number]>;
}

const residentialClusters: ResidentialCluster[] = [
  {
    id: 'central-1',
    name: 'Cụm dân cư trung tâm 1',
    areaDescription: 'Khu Lê Thế Tiết - Thạch Hãn',
    buildingCenters: [
      [106.5870917, 16.6111822],
      [106.586456, 16.6118402],
      [106.5869152, 16.6119096],
      [106.5870032, 16.6120535],
      [106.5862818, 16.6121743],
      [106.5860268, 16.6120998],
    ],
  },
  {
    id: 'central-2',
    name: 'Cụm dân cư trung tâm 2',
    areaDescription: 'Khu Lê Lai - Lê Thế Tiết',
    buildingCenters: [
      [106.5926063, 16.6112079],
      [106.5923461, 16.6111102],
      [106.5923515, 16.6113004],
      [106.5926385, 16.6114392],
      [106.5923606, 16.6114392],
      [106.592214, 16.6111591],
    ],
  },
  {
    id: 'central-3',
    name: 'Cụm dân cư trung tâm 3',
    areaDescription: 'Khu Thạch Hãn - Lê Văn Huân',
    buildingCenters: [
      [106.5985681, 16.6112259],
      [106.5985073, 16.6110999],
      [106.5984143, 16.6112901],
      [106.5983543, 16.6110948],
      [106.598393, 16.6114803],
      [106.598795, 16.611321],
    ],
  },
  {
    id: 'central-4',
    name: 'Cụm dân cư trung tâm 4',
    areaDescription: 'Khu phía tây đường Lê Quý Đôn',
    buildingCenters: [
      [106.5865204, 16.6139426],
      [106.5868269, 16.6139606],
      [106.5867645, 16.6137679],
      [106.5869827, 16.6137936],
      [106.5871802, 16.6138347],
      [106.5868235, 16.6134517],
    ],
  },
  {
    id: 'central-5',
    name: 'Cụm dân cư trung tâm 5',
    areaDescription: 'Khu trung tâm đường Lê Quý Đôn',
    buildingCenters: [
      [106.5925492, 16.6146417],
      [106.5923957, 16.6147214],
      [106.5929548, 16.6142819],
      [106.5919962, 16.6142768],
      [106.5923148, 16.6138681],
      [106.5931342, 16.6140377],
    ],
  },
  {
    id: 'central-6',
    name: 'Cụm dân cư trung tâm 6',
    areaDescription: 'Khu phía đông đường Lê Quý Đôn',
    buildingCenters: [
      [106.5983873, 16.6144413],
      [106.5982868, 16.6143385],
      [106.5983731, 16.6141508],
      [106.5982263, 16.6142048],
      [106.5983821, 16.6138758],
      [106.5981098, 16.6139375],
    ],
  },
];

interface HouseholdDemoRecord {
  id: string;
  clusterId: string;
  coordinates: [number, number];
  memberCount: number;
  workingAgeMemberCount: number;
  feature: DemoGisFeature;
}

const householdDemoRecords: HouseholdDemoRecord[] =
  residentialClusters.flatMap((cluster, clusterIndex) =>
    cluster.buildingCenters.map((coordinates, index) => {
      const sequence = clusterIndex * cluster.buildingCenters.length + index + 1;
      const householdCode = `HD-LB-${String(sequence).padStart(3, '0')}`;
      const memberCount = 3 + ((clusterIndex + index) % 4);
      const workingAgeMemberCount = Math.max(
        1,
        memberCount - 1 - ((clusterIndex + index) % 2),
      );
      const id = `household-building-${String(sequence).padStart(3, '0')}`;
      const feature = createSeedFeature(
        id,
        'layer-households',
        { type: 'Point', coordinates },
        {
          name: `Hộ dân mẫu ${householdCode}`,
          description: `Hộ dân mô phỏng.`,
          details: {
            'Mã hộ': householdCode,
            'Khu vực': cluster.areaDescription,
            'Vị trí nhà': '',
            'Số nhân khẩu': memberCount,
            'Trong độ tuổi lao động': workingAgeMemberCount,
            'Tình trạng nhà ở':
              (clusterIndex + index) % 3 === 0
                ? 'Nhà kiên cố'
                : 'Nhà bán kiên cố',
            'Nguồn vị trí':
              '',
          },
          extra: {
            householdCode,
            residentialClusterId: cluster.id,
            residentialClusterName: cluster.name,
            memberCount,
            workingAgeMemberCount,
            buildingFootprintMatched: true,
            mockGenerated: true,
          },
        },
      );

      return {
        id,
        clusterId: cluster.id,
        coordinates,
        memberCount,
        workingAgeMemberCount,
        feature,
      };
    }),
  );

const householdFeatures = householdDemoRecords.map((record) => record.feature);

const workingAgeZoneFeatures = residentialClusters.map((cluster) => {
  const households = householdDemoRecords.filter(
    (record) => record.clusterId === cluster.id,
  );
  const longitudes = households.map(
    (household) => household.coordinates[0],
  );
  const latitudes = households.map((household) => household.coordinates[1]);
  const padding = 0.00018;
  const minimumLongitude = Math.min(...longitudes) - padding;
  const maximumLongitude = Math.max(...longitudes) + padding;
  const minimumLatitude = Math.min(...latitudes) - padding;
  const maximumLatitude = Math.max(...latitudes) + padding;
  const population = households.reduce(
    (total, household) => total + household.memberCount,
    0,
  );
  const workingAgePopulation = households.reduce(
    (total, household) => total + household.workingAgeMemberCount,
    0,
  );
  const workingAgeRate = Number(
    ((workingAgePopulation / population) * 100).toFixed(1),
  );

  return createSeedFeature(
    `working-age-cluster-${cluster.id}`,
    'layer-working-age-population',
    {
      type: 'Polygon',
      coordinates: [
        [
          [minimumLongitude, minimumLatitude],
          [maximumLongitude, minimumLatitude],
          [maximumLongitude, maximumLatitude],
          [minimumLongitude, maximumLatitude],
          [minimumLongitude, minimumLatitude],
        ],
      ],
    },
    {
      name: `Vùng độ tuổi lao động - ${cluster.name}`,
      description: `Vùng tổng hợp mô phỏng.`,
      details: {
        'Khu vực': cluster.areaDescription,
        'Số hộ mẫu': households.length,
        'Tổng nhân khẩu mẫu': population,
        'Trong độ tuổi lao động': workingAgePopulation,
        'Tỷ lệ độ tuổi lao động (%)': workingAgeRate,
        Nguồn: 'Tổng hợp từ cụm hộ dân mô phỏng',
      },
      extra: {
        residentialClusterId: cluster.id,
        residentialClusterName: cluster.name,
        householdIds: households.map((household) => household.id),
        population,
        workingAgePopulation,
        workingAgeRate,
        mockGenerated: true,
      },
    },
  );
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

const planningComparisonDemoFeatures = [
  createSeedFeature(
    'investment-project-demo-a',
    'layer-active-investment-projects',
    {
      type: 'Polygon',
      coordinates: [[
        [106.6015, 16.615],
        [106.607, 16.615],
        [106.607, 16.619],
        [106.6015, 16.619],
        [106.6015, 16.615],
      ]],
    },
    {
      name: 'Dự án đầu tư khu dịch vụ A',
      description: 'Phạm vi dự án đầu tư đang triển khai dùng cho demo so sánh.',
      details: {
        'Mã dự án': 'DA-LB-01',
        'Giai đoạn': 'Đang triển khai',
        'Nguồn': 'Dữ liệu mô phỏng POC',
      },
      extra: { mockGenerated: true, comparisonDemo: true },
    },
  ),
  createSeedFeature(
    'investment-project-demo-b',
    'layer-active-investment-projects',
    {
      type: 'Polygon',
      coordinates: [[
        [106.604, 16.6165],
        [106.6095, 16.6165],
        [106.6095, 16.6205],
        [106.604, 16.6205],
        [106.604, 16.6165],
      ]],
    },
    {
      name: 'Dự án đầu tư khu dịch vụ B',
      description: 'Phạm vi dự án đầu tư đề xuất dùng cho demo so sánh.',
      details: {
        'Mã dự án': 'DA-LB-02',
        'Giai đoạn': 'Đề xuất điều chỉnh',
        'Nguồn': 'Dữ liệu mô phỏng POC',
      },
      extra: { mockGenerated: true, comparisonDemo: true },
    },
  ),
  createSeedFeature(
    'construction-planning-demo-a',
    'layer-construction-planning',
    {
      type: 'Polygon',
      coordinates: [[
        [106.5935, 16.6165],
        [106.599, 16.6165],
        [106.599, 16.621],
        [106.5935, 16.621],
        [106.5935, 16.6165],
      ]],
    },
    {
      name: 'Quy hoạch xây dựng khu trung tâm A',
      description: 'Phạm vi quy hoạch xây dựng hiện tại dùng cho demo so sánh.',
      details: {
        'Mã đồ án': 'QHXD-LB-01',
        'Phiên bản': 'Hiện tại',
        'Nguồn': 'Dữ liệu mô phỏng POC',
      },
      extra: { mockGenerated: true, comparisonDemo: true },
    },
  ),
  createSeedFeature(
    'construction-planning-demo-b',
    'layer-construction-planning',
    {
      type: 'Polygon',
      coordinates: [[
        [106.596, 16.618],
        [106.6015, 16.618],
        [106.6015, 16.6225],
        [106.596, 16.6225],
        [106.596, 16.618],
      ]],
    },
    {
      name: 'Quy hoạch xây dựng khu trung tâm B',
      description: 'Phạm vi quy hoạch xây dựng điều chỉnh dùng cho demo so sánh.',
      details: {
        'Mã đồ án': 'QHXD-LB-02',
        'Phiên bản': 'Điều chỉnh',
        'Nguồn': 'Dữ liệu mô phỏng POC',
      },
      extra: { mockGenerated: true, comparisonDemo: true },
    },
  ),
  createSeedFeature(
    'zoning-planning-demo-a',
    'layer-zoning-planning',
    {
      type: 'Polygon',
      coordinates: [[
        [106.587, 16.6075],
        [106.5925, 16.6075],
        [106.5925, 16.612],
        [106.587, 16.612],
        [106.587, 16.6075],
      ]],
    },
    {
      name: 'Quy hoạch phân khu phía Tây A',
      description: 'Ranh giới phân khu hiện tại dùng cho demo so sánh.',
      details: {
        'Mã phân khu': 'PK-LB-01',
        'Phiên bản': 'Hiện tại',
        'Nguồn': 'Dữ liệu mô phỏng POC',
      },
      extra: { mockGenerated: true, comparisonDemo: true },
    },
  ),
  createSeedFeature(
    'zoning-planning-demo-b',
    'layer-zoning-planning',
    {
      type: 'Polygon',
      coordinates: [[
        [106.5895, 16.609],
        [106.595, 16.609],
        [106.595, 16.6135],
        [106.5895, 16.6135],
        [106.5895, 16.609],
      ]],
    },
    {
      name: 'Quy hoạch phân khu phía Tây B',
      description: 'Ranh giới phân khu điều chỉnh dùng cho demo so sánh.',
      details: {
        'Mã phân khu': 'PK-LB-02',
        'Phiên bản': 'Điều chỉnh',
        'Nguồn': 'Dữ liệu mô phỏng POC',
      },
      extra: { mockGenerated: true, comparisonDemo: true },
    },
  ),
];

const baseSeedFeatures = [
  ...communeFeatures,
  ...villageBoundaryFeatures,
  ...villageLabelFeatures,
  ...householdFeatures,
  ...workingAgeZoneFeatures,
  ...tourismFeatures,
  ...facilityFeatures,
  ...disasterFeatures,
  ...planningFeatures,
  ...planningComparisonDemoFeatures,
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
