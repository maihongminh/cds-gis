// src/data/mock-laobao-commune-boundary.ts
// Official outer boundary polygon for the entire Lao Bao commune (Xa Lao Bao)
// loaded from local geometry data (src/data/map/response_1784027650504.json).
// sourceCrs: VN-2000 | displayCrs: EPSG:4326 | dataStatus: verified

import type { FeatureCollection } from 'geojson';
import { COMMUNE } from './laobao-administrative-units';
import boundaryJson from './map/response_1784027650504.json';

const officialGeometry = boundaryJson.data.geometry;

export const MOCK_LAOBAO_COMMUNE_BOUNDARY: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'commune-lao-bao',
      properties: {
        code: COMMUNE.code,
        name: COMMUNE.name,
        provinceCode: 'quang-tri',
        provinceName: 'Tỉnh Quảng Trị',
        areaHa: COMMUNE.areaHa,
        population: COMMUNE.population,
        householdCount: COMMUNE.householdCount,
        villageCount: 12,
        dataStatus: 'verified',
        sourceCrs: 'VN-2000',
        displayCrs: 'EPSG:4326',
        disclaimer:
          'Dữ liệu ranh giới và vị trí trên bản đồ hiện là dữ liệu mô phỏng phục vụ thử nghiệm giao diện, chưa sử dụng cho mục đích pháp lý chính thức.',
      },
      geometry: officialGeometry as any,
    },
  ],
};
