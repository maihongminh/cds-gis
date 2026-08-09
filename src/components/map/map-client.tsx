// OpenLayers GIS client for the Lao Bao map workspace.
'use client';

import * as React from 'react';
import turfArea from '@turf/area';
import intersect from '@turf/intersect';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import LineString from 'ol/geom/LineString';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Graticule from 'ol/layer/Graticule';
import LayerGroup from 'ol/layer/Group';
import ImageLayer from 'ol/layer/Image';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control/defaults';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';
import Snap from 'ol/interaction/Snap';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import ImageCanvasSource from 'ol/source/ImageCanvas';
import XYZ from 'ol/source/XYZ';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import IconStyle from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import type { FeatureLike } from 'ol/Feature';
import type { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';
import { apply as applyMapboxStyle } from 'ol-mapbox-style';
import {
  Download,
  Eraser,
  GitCompareArrows,
  MapPinPlus,
  Pentagon,
  Pencil,
  Plus,
  Route,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import type {
  Feature as GeoJsonFeature,
  FeatureCollection as GeoJsonFeatureCollection,
  MultiPolygon as GeoJsonMultiPolygon,
  Polygon as GeoJsonPolygon,
} from 'geojson';

import {
  Button,
  Input,
  Select as UiSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import {
  GIS_LAYER_GROUPS,
  INITIAL_MAP_LAYERS,
  MAP_LAYER_BY_ID,
} from '@/data/mock-map-layers';
import {
  deleteDemoGisFeature as deletePersistedDemoGisFeature,
  fetchDemoGisFeatures,
  saveDemoGisFeature as persistDemoGisFeature,
} from '@/lib/demo-gis-api';
import { BASE_LAYERS, LAOBAO_CENTER, VIETNAM_CENTER } from '@/lib/map-config';
import {
  buildIconPinMarkerSvg,
  type MapMarkerIconName,
} from '@/lib/map-style-config';
import {
  getPrecipitationColor,
  getTemperatureColor,
  getWindColor,
  interpolateWeatherValue,
} from '@/lib/weather-config';
import { cn } from '@/lib/utils';
import type { DemoGisFeature } from '@/types/demo-gis';
import type {
  MapMode,
  WeatherForecastData,
  WeatherLayerId,
} from '@/types/weather';

export interface MapState {
  activeLayerIds: string[];
  toggleLayer: (id: string) => void;
  enableAllInGroup: (groupId: string) => void;
  disableAllInGroup: (groupId: string) => void;
  resetToDefaults: () => void;
  layerFeatureCounts: Record<string, number>;
  setLayerFeatureCounts: (counts: Record<string, number>) => void;
  selectedVillageCode: string | null;
  setSelectedVillageCode: (code: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  flyToCoords: [number, number, number?] | null;
  setFlyToCoords: (c: [number, number, number?] | null) => void;
  activeBaseLayerId: string;
  setActiveBaseLayerId: (id: string) => void;
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
  weatherLayerId: WeatherLayerId;
  setWeatherLayerId: (layerId: WeatherLayerId) => void;
  weatherForecastIndex: number;
  setWeatherForecastIndex: React.Dispatch<React.SetStateAction<number>>;
  weatherOpacity: number;
  setWeatherOpacity: (opacity: number) => void;
  weatherSelectedCoordinates: [number, number] | null;
  setWeatherSelectedCoordinates: (coordinates: [number, number] | null) => void;
  weatherData: WeatherForecastData | null;
  weatherIsLoading: boolean;
  weatherError: string | null;
  reloadWeather: () => void;
  currentRole: string | null;
}

type EditorMode = 'view' | 'point' | 'line' | 'polygon' | 'modify';
type EditableGeometryKind = 'point' | 'line' | 'polygon';
type EditableFeatureStatus = 'draft' | 'saved';

interface SavedObjectPopup {
  featureId: string;
  name: string;
  category: string;
  description: string;
  geometryKind: EditableGeometryKind;
  layerId: string;
  details: Record<string, string | number | boolean | null>;
}

interface WeatherPopup {
  latitude: number;
  longitude: number;
  time: string;
  temperature: number | null;
  precipitation: number | null;
  windSpeed: number | null;
  windDirection: number | null;
}

type PlanningPolygonGeometry = GeoJsonPolygon | GeoJsonMultiPolygon;

interface PlanningComparisonObject {
  id: string;
  name: string;
  layerId: string;
  layerName: string;
  geometryType: string;
  areaSquareMeters: number;
}

interface PlanningComparisonSelection {
  id: string;
  name: string;
  layerName: string;
  geometryType: string;
}

interface PlanningComparisonResult {
  first: PlanningComparisonObject;
  second: PlanningComparisonObject;
  overlapSquareMeters: number;
  onlyFirstSquareMeters: number;
  onlySecondSquareMeters: number;
  overlapFirstPercent: number;
  overlapSecondPercent: number;
  summary: string;
  analysis: {
    scaleComparison: string;
    firstAdvantages: string[];
    secondAdvantages: string[];
    assessment: string;
    recommendation: string;
  };
}

const geoJsonFormat = new GeoJSON();

const PLANNING_COMPARISON_LAYER_IDS = new Set([
  'layer-active-investment-projects',
  'layer-land-use-planning',
  'layer-construction-planning',
  'layer-zoning-planning',
]);

function readGeoJsonFeatures(data: object) {
  return geoJsonFormat.readFeatures(data, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });
}

const markerImageCache = new globalThis.Map<string, IconStyle>();
const markerStyleCache = new globalThis.Map<string, Style>();

function markerImage(color: string, icon: MapMarkerIconName, size = 30) {
  const cacheKey = `${color}:${icon}:${size}`;
  const cachedImage = markerImageCache.get(cacheKey);
  if (cachedImage) return cachedImage;

  const svg = buildIconPinMarkerSvg(color, icon, size);
  const image = new IconStyle({
    src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
  });
  markerImageCache.set(cacheKey, image);
  return image;
}

function markerStyle(color: string, icon: MapMarkerIconName, size = 30) {
  const cacheKey = `${color}:${icon}:${size}`;
  const cachedStyle = markerStyleCache.get(cacheKey);
  if (cachedStyle) return cachedStyle;

  const style = new Style({ image: markerImage(color, icon, size) });
  markerStyleCache.set(cacheKey, style);
  return style;
}

const communeStyle = new Style({
  stroke: new Stroke({ color: '#1d4ed8', width: 3 }),
  fill: new Fill({ color: 'rgba(59, 130, 246, 0.07)' }),
});

const villageStyle = new Style({
  stroke: new Stroke({ color: '#64748b', width: 1.25 }),
  fill: new Fill({ color: 'rgba(148, 163, 184, 0.06)' }),
});

const selectedVillageStyle = new Style({
  stroke: new Stroke({ color: '#0f766e', width: 3 }),
  fill: new Fill({ color: 'rgba(20, 184, 166, 0.22)' }),
});

const villageLabelStyleCache = new WeakMap<FeatureLike, Style>();

function villageLabelStyle(feature: FeatureLike) {
  const cachedStyle = villageLabelStyleCache.get(feature);
  if (cachedStyle) return cachedStyle;

  const geometry = feature.getGeometry();
  const style = new Style({
    geometry: geometry instanceof Polygon ? geometry.getInteriorPoint() : undefined,
    text: new Text({
      text: String(feature.get('villageName') ?? ''),
      font: '600 11px var(--font-be-vietnam-pro), sans-serif',
      fill: new Fill({ color: '#0f172a' }),
      stroke: new Stroke({ color: 'rgba(255,255,255,0.95)', width: 3 }),
    }),
  });
  villageLabelStyleCache.set(feature, style);
  return style;
}

const sovereigntyStyleCache = new globalThis.Map<string, Style>();

function sovereigntyReferenceStyle(feature: FeatureLike) {
  const geometryType = feature.getGeometry()?.getType() ?? 'unknown';
  const cacheKey = `${geometryType}:${String(feature.getId() ?? feature.get('name') ?? 'sovereignty')}`;
  const cachedStyle = sovereigntyStyleCache.get(cacheKey);
  if (cachedStyle) return cachedStyle;

  const style = geometryType === 'Point'
    ? new Style({
        image: markerImage('#dc2626', 'flag', 32),
        text: new Text({
          text: String(feature.get('label') ?? feature.get('name') ?? ''),
          font: '700 12px var(--font-be-vietnam-pro), sans-serif',
          offsetY: -44,
          textAlign: 'center',
          padding: [3, 5, 3, 5],
          fill: new Fill({ color: '#b91c1c' }),
          stroke: new Stroke({ color: 'rgba(255,255,255,0.98)', width: 4 }),
          backgroundFill: new Fill({ color: 'rgba(255,255,255,0.84)' }),
          backgroundStroke: new Stroke({ color: 'rgba(220,38,38,0.5)', width: 1 }),
        }),
      })
    : new Style({
        stroke: new Stroke({ color: '#dc2626', width: 1.5 }),
        fill: new Fill({ color: 'rgba(239,68,68,0.16)' }),
      });
  sovereigntyStyleCache.set(cacheKey, style);
  return style;
}

const administrativePalette = [
  '#bfdbfe',
  '#bbf7d0',
  '#fde68a',
  '#ddd6fe',
  '#fecdd3',
  '#bae6fd',
  '#fed7aa',
] as const;
const administrativeProvinceStyleCache = new globalThis.Map<string, Style>();
const administrativeCommuneStyleCache = new globalThis.Map<string, Style>();

function administrativeProvinceStyle(feature: FeatureLike, resolution: number) {
  const provinceCode = String(feature.get('provinceCode') ?? '0');
  const showLabel = resolution >= 250;
  const cacheKey = `${provinceCode}:${showLabel ? 'label' : 'shape'}`;
  const cachedStyle = administrativeProvinceStyleCache.get(cacheKey);
  if (cachedStyle) return cachedStyle;

  const paletteIndex = Number.parseInt(provinceCode, 10) % administrativePalette.length;
  const style = new Style({
    stroke: new Stroke({ color: '#475569', width: 1.2 }),
    fill: new Fill({ color: `${administrativePalette[paletteIndex]}cc` }),
    text: showLabel
      ? new Text({
          text: String(feature.get('name') ?? ''),
          font: '700 11px var(--font-be-vietnam-pro), sans-serif',
          overflow: false,
          fill: new Fill({ color: '#0f172a' }),
          stroke: new Stroke({ color: 'rgba(255,255,255,0.95)', width: 3 }),
        })
      : undefined,
  });
  administrativeProvinceStyleCache.set(cacheKey, style);
  return style;
}

function administrativeCommuneStyle(feature: FeatureLike, resolution: number) {
  const communeCode = String(feature.get('communeCode') ?? 'unknown');
  const showLabel = resolution <= 180;
  const cacheKey = `${communeCode}:${showLabel ? 'label' : 'shape'}`;
  const cachedStyle = administrativeCommuneStyleCache.get(cacheKey);
  if (cachedStyle) return cachedStyle;

  const style = new Style({
    stroke: new Stroke({ color: 'rgba(71,85,105,0.8)', width: 0.8 }),
    fill: new Fill({ color: 'rgba(255,255,255,0.08)' }),
    text: showLabel
      ? new Text({
          text: String(feature.get('name') ?? ''),
          font: '600 10px var(--font-be-vietnam-pro), sans-serif',
          overflow: false,
          fill: new Fill({ color: '#334155' }),
          stroke: new Stroke({ color: 'rgba(255,255,255,0.95)', width: 3 }),
        })
      : undefined,
  });
  administrativeCommuneStyleCache.set(cacheKey, style);
  return style;
}

const draftEditableStyle = new Style({
  stroke: new Stroke({ color: '#ea580c', width: 3, lineDash: [7, 4] }),
  fill: new Fill({ color: 'rgba(249, 115, 22, 0.2)' }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({ color: '#ea580c' }),
    stroke: new Stroke({ color: '#ffffff', width: 2 }),
  }),
});

const currentPlanningStyle = new Style({
  stroke: new Stroke({ color: '#0284c7', width: 2 }),
  fill: new Fill({ color: 'rgba(56, 189, 248, 0.25)' }),
});

const plannedPlanningStyle = new Style({
  stroke: new Stroke({ color: '#7c3aed', width: 2, lineDash: [8, 5] }),
  fill: new Fill({ color: 'rgba(167, 139, 250, 0.24)' }),
});

function planningScenarioStyle(feature: FeatureLike) {
  return feature.get('scenario') === 'planned'
    ? plannedPlanningStyle
    : currentPlanningStyle;
}

const savedEditableStyleCache = new globalThis.Map<string, Style>();

const catalogMarkerIconFallbacks: Record<string, MapMarkerIconName> = {
  AlertTriangle: 'warning',
  BriefcaseBusiness: 'building',
  Building: 'building',
  Compass: 'attraction',
  Construction: 'infrastructure',
  GraduationCap: 'school',
  HeartHandshake: 'building',
  HeartPulse: 'medical',
  Landmark: 'landmark',
  Leaf: 'water',
  Map: 'landmark',
  MapPin: 'attraction',
  Shield: 'warning',
};

function editableFeatureStyle(feature: FeatureLike, resolution = 0) {
  const status = String(feature.get('status') ?? 'draft');
  const layerId = String(
    feature.get('previewLayerId') || feature.get('layerId') || '',
  );
  const layerConfig = MAP_LAYER_BY_ID.get(layerId);
  if (status !== 'saved' && !layerConfig) return draftEditableStyle;

  const color = String(
    feature.get('previewStrokeColor') ||
      feature.get('strokeColor') ||
      layerConfig?.styleConfig.color ||
      '#0f766e',
  );
  const fillColor = String(
    feature.get('previewFillColor') ||
      feature.get('fillColor') ||
      layerConfig?.styleConfig.fillColor ||
      color,
  );
  const markerIcon =
    layerConfig?.styleConfig.markerIcon ??
    catalogMarkerIconFallbacks[layerConfig?.styleConfig.icon ?? ''];
  const geometryType = feature.getGeometry()?.getType() ?? '';
  const name = String(feature.get('name') ?? 'Đối tượng');
  const showName = status !== 'saved' || resolution <= 20;
  const cacheKey = `${status}:${geometryType}:${layerId}:${name}:${color}:${fillColor}:${markerIcon ?? 'circle'}:${showName ? 'label' : 'symbol'}`;
  const cachedStyle = savedEditableStyleCache.get(cacheKey);
  if (cachedStyle) return cachedStyle;

  const style = new Style({
    zIndex:
      geometryType === 'Point'
        ? 30
        : geometryType === 'LineString'
          ? 20
          : 10,
    stroke: new Stroke({
      color,
      width: layerConfig?.styleConfig.weight ?? 3,
      lineDash: status === 'saved' ? undefined : [7, 4],
    }),
    fill: new Fill({ color: `${fillColor}33` }),
    image:
      geometryType === 'Point'
        ? markerIcon
          ? markerImage(color, markerIcon, 30)
          : new CircleStyle({
              radius: layerConfig?.styleConfig.radius ?? 7,
              fill: new Fill({ color }),
              stroke: new Stroke({ color: '#ffffff', width: 2 }),
            })
        : undefined,
    text: showName
      ? new Text({
          text: name,
          placement: geometryType === 'LineString' ? 'line' : 'point',
          offsetY:
            geometryType === 'Point'
              ? markerIcon
                ? -48
                : -18
              : 0,
          font: '600 10px var(--font-be-vietnam-pro), sans-serif',
          fill: new Fill({ color: '#0f172a' }),
          stroke: new Stroke({ color: 'rgba(255,255,255,0.95)', width: 3 }),
        })
      : undefined,
  });
  savedEditableStyleCache.set(cacheKey, style);
  return style;
}

const selectedEditableStyle = new Style({
  stroke: new Stroke({ color: '#dc2626', width: 4 }),
  fill: new Fill({ color: 'rgba(239, 68, 68, 0.25)' }),
  image: new CircleStyle({
    radius: 9,
    fill: new Fill({ color: '#dc2626' }),
    stroke: new Stroke({ color: '#ffffff', width: 3 }),
  }),
});

const planningComparisonStyles = {
  first: new Style({
    zIndex: 40,
    stroke: new Stroke({ color: '#2563eb', width: 4 }),
    fill: new Fill({ color: 'rgba(37, 99, 235, 0.2)' }),
  }),
  second: new Style({
    zIndex: 41,
    stroke: new Stroke({ color: '#f97316', width: 4 }),
    fill: new Fill({ color: 'rgba(249, 115, 22, 0.2)' }),
  }),
  overlap: new Style({
    zIndex: 42,
    stroke: new Stroke({ color: '#dc2626', width: 3, lineDash: [7, 4] }),
    fill: new Fill({ color: 'rgba(220, 38, 38, 0.42)' }),
  }),
} as const;

function planningComparisonOverlayStyle(feature: FeatureLike) {
  const role = String(feature.get('comparisonRole') ?? '');
  if (role === 'first') return planningComparisonStyles.first;
  if (role === 'second') return planningComparisonStyles.second;
  return planningComparisonStyles.overlap;
}

const riskStyleCache = new globalThis.Map<string, Style>();

function riskStyle(feature: FeatureLike) {
  const level = feature.get('riskLevel');
  const color =
    level === 'critical'
      ? '#b91c1c'
      : level === 'high'
        ? '#dc2626'
        : level === 'medium'
          ? '#f97316'
          : '#eab308';
  const geometryType = feature.getGeometry()?.getType() ?? 'unknown';
  if (geometryType === 'Point') {
    return markerStyle(color, 'warning', 32);
  }

  const cachedStyle = riskStyleCache.get(color);
  if (cachedStyle) return cachedStyle;

  const style = new Style({
    stroke: new Stroke({ color, width: 2 }),
    fill: new Fill({ color: `${color}38` }),
  });
  riskStyleCache.set(color, style);
  return style;
}

function demoFeatureStyle(
  feature: FeatureLike,
  selectedVillageCode: string | null,
  resolution = 0,
) {
  const layerId = String(feature.get('layerId') ?? '');
  if (layerId === 'layer-commune') return communeStyle;
  if (layerId === 'layer-villages') {
    return feature.get('villageCode') === selectedVillageCode
      ? selectedVillageStyle
      : villageStyle;
  }
  if (layerId === 'layer-village-labels') return villageLabelStyle(feature);
  if (layerId === 'layer-land-use-planning') {
    return planningScenarioStyle(feature);
  }
  if (
    layerId === 'layer-landslide-risk' ||
    layerId === 'layer-flood-risk' ||
    layerId === 'layer-critical-areas'
  ) {
    return riskStyle(feature);
  }
  return editableFeatureStyle(feature, resolution);
}

const WEATHER_REFERENCE_LAYER_IDS = new Set([
  'layer-commune',
  'layer-villages',
  'layer-village-labels',
]);

function createWeatherCanvasSource(
  weatherData: WeatherForecastData,
  forecastIndex: number,
  layerId: WeatherLayerId,
) {
  const { rows, columns } = weatherData.grid;
  const valueAt = (row: number, column: number) => {
    const point = weatherData.points[row * columns + column];
    if (!point) return null;
    if (layerId === 'temperature') return point.temperature[forecastIndex];
    if (layerId === 'precipitation') return point.precipitation[forecastIndex];
    return point.windSpeed[forecastIndex];
  };
  const parseColor = (color: string) =>
    [1, 3, 5].map((index) =>
      Number.parseInt(color.slice(index, index + 2), 16),
    );
  const colorCache = new globalThis.Map<number, number[]>();
  const colorForValue = (value: number) => {
    const precision = layerId === 'wind' ? 2 : 10;
    const cacheKey = Math.round(value * precision) / precision;
    const cached = colorCache.get(cacheKey);
    if (cached) return cached;
    const color = parseColor(
      layerId === 'temperature'
        ? getTemperatureColor(cacheKey)
        : layerId === 'precipitation'
          ? getPrecipitationColor(cacheKey)
          : getWindColor(cacheKey),
    );
    colorCache.set(cacheKey, color);
    return color;
  };

  return new ImageCanvasSource({
    attributions: weatherData.attribution,
    projection: 'EPSG:3857',
    // Keep one zoom level of weather raster outside the viewport. OpenLayers
    // reuses this image while the view is animating, so the buffer prevents
    // the canvas edge from becoming visible during normal zoom-out gestures.
    ratio: 2,
    interpolate: true,
    canvasFunction: (extent, _resolution, _pixelRatio, size) => {
      const canvas = document.createElement('canvas');
      canvas.width = size[0];
      canvas.height = size[1];
      const context = canvas.getContext('2d');
      if (!context) return canvas;

      const renderWidth = Math.min(260, Math.max(1, size[0]));
      const renderHeight = Math.min(
        200,
        Math.max(1, Math.round((renderWidth * size[1]) / size[0])),
      );
      const workingCanvas = document.createElement('canvas');
      workingCanvas.width = renderWidth;
      workingCanvas.height = renderHeight;
      const workingContext = workingCanvas.getContext('2d');
      if (!workingContext) return canvas;
      const image = workingContext.createImageData(renderWidth, renderHeight);
      const earthRadius = 6_378_137;
      const radiansToDegrees = 180 / Math.PI;

      for (let y = 0; y < renderHeight; y += 1) {
        const projectedY =
          extent[3] -
          (y / Math.max(1, renderHeight - 1)) * (extent[3] - extent[1]);
        const latitude =
          Math.atan(Math.sinh(projectedY / earthRadius)) * radiansToDegrees;
        const normalizedGridY =
          ((latitude - weatherData.grid.south) /
            (weatherData.grid.north - weatherData.grid.south)) *
          (rows - 1);
        const gridY = Math.max(0, Math.min(rows - 1, normalizedGridY));
        const row0 = Math.floor(gridY);
        const row1 = Math.min(rows - 1, row0 + 1);
        const rowRatio = gridY - row0;

        for (let x = 0; x < renderWidth; x += 1) {
          const projectedX =
            extent[0] +
            (x / Math.max(1, renderWidth - 1)) * (extent[2] - extent[0]);
          const longitude = (projectedX / earthRadius) * radiansToDegrees;
          const normalizedGridX =
            ((longitude - weatherData.grid.west) /
              (weatherData.grid.east - weatherData.grid.west)) *
            (columns - 1);
          const gridX = Math.max(0, Math.min(columns - 1, normalizedGridX));
          const column0 = Math.floor(gridX);
          const column1 = Math.min(columns - 1, column0 + 1);
          const columnRatio = gridX - column0;
          const values = [
            valueAt(row0, column0),
            valueAt(row0, column1),
            valueAt(row1, column0),
            valueAt(row1, column1),
          ];
          if (values.some((value) => value === null || value === undefined)) {
            continue;
          }
          const [topLeft, topRight, bottomLeft, bottomRight] =
            values as number[];
          const top = topLeft + (topRight - topLeft) * columnRatio;
          const bottom = bottomLeft + (bottomRight - bottomLeft) * columnRatio;
          const value = top + (bottom - top) * rowRatio;
          const color = colorForValue(value);
          const offset = (y * renderWidth + x) * 4;
          image.data[offset] = color[0];
          image.data[offset + 1] = color[1];
          image.data[offset + 2] = color[2];
          image.data[offset + 3] =
            layerId === 'precipitation' && value < 0.05 ? 28 : 230;
        }
      }

      workingContext.putImageData(image, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(workingCanvas, 0, 0, canvas.width, canvas.height);
      return canvas;
    },
  });
}

function editableGeometryKind(feature: Feature): EditableGeometryKind | null {
  const geometryType = feature.getGeometry()?.getType();
  if (geometryType === 'Point' || geometryType === 'MultiPoint') return 'point';
  if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
    return 'line';
  }
  if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
    return 'polygon';
  }
  return null;
}

function savedFeatureGeometryPriority(geometryType: string | undefined) {
  if (geometryType === 'Point' || geometryType === 'MultiPoint') return 0;
  if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
    return 1;
  }
  if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') return 2;
  return 3;
}

function savedFeatureGeometryArea(feature: Feature) {
  const geometry = feature.getGeometry();
  if (geometry instanceof Polygon || geometry instanceof MultiPolygon) {
    return geometry.getArea();
  }
  return Number.POSITIVE_INFINITY;
}

function compareSavedFeatureHitPriority(
  firstFeature: Feature,
  secondFeature: Feature,
) {
  const firstGeometry = firstFeature.getGeometry();
  const secondGeometry = secondFeature.getGeometry();
  const priorityDifference =
    savedFeatureGeometryPriority(firstGeometry?.getType()) -
    savedFeatureGeometryPriority(secondGeometry?.getType());
  if (priorityDifference !== 0) return priorityDifference;

  return (
    savedFeatureGeometryArea(firstFeature) -
    savedFeatureGeometryArea(secondFeature)
  );
}

function formatComparisonArea(squareMeters: number) {
  const hectares = squareMeters / 10_000;
  if (hectares >= 1) {
    return `${hectares.toLocaleString('vi-VN', {
      maximumFractionDigits: 2,
    })} ha`;
  }
  return `${squareMeters.toLocaleString('vi-VN', {
    maximumFractionDigits: 0,
  })} m²`;
}

function planningComparisonSummary(
  firstArea: number,
  secondArea: number,
  overlapArea: number,
) {
  if (overlapArea <= 0) {
    return 'Hai vùng không có diện tích giao nhau.';
  }
  const smallerArea = Math.min(firstArea, secondArea);
  const smallerCoverage = smallerArea > 0 ? overlapArea / smallerArea : 0;
  if (smallerCoverage >= 0.95) {
    return 'Một vùng gần như nằm hoàn toàn trong vùng còn lại.';
  }
  if (smallerCoverage >= 0.7) {
    return 'Hai vùng có mức độ chồng lấn cao.';
  }
  if (smallerCoverage >= 0.3) {
    return 'Hai vùng chồng lấn một phần đáng kể.';
  }
  return 'Hai vùng chỉ chồng lấn một phần nhỏ.';
}

function buildPlanningComparisonAnalysis(
  firstName: string,
  secondName: string,
  firstArea: number,
  secondArea: number,
  overlapArea: number,
) {
  const onlyFirstArea = Math.max(0, firstArea - overlapArea);
  const onlySecondArea = Math.max(0, secondArea - overlapArea);
  const firstExclusivePercent =
    firstArea > 0 ? (onlyFirstArea / firstArea) * 100 : 0;
  const secondExclusivePercent =
    secondArea > 0 ? (onlySecondArea / secondArea) * 100 : 0;
  const areaDifference = Math.abs(firstArea - secondArea);
  const areaDifferencePercent =
    firstArea > 0 ? (areaDifference / firstArea) * 100 : 0;
  const smallerArea = Math.min(firstArea, secondArea);
  const overlapOfSmaller =
    smallerArea > 0 ? (overlapArea / smallerArea) * 100 : 0;
  const isNearlyEqual =
    Math.max(firstArea, secondArea) > 0 &&
    areaDifference / Math.max(firstArea, secondArea) < 0.05;

  const scaleComparison = isNearlyEqual
    ? 'A và B có quy mô diện tích gần tương đương.'
    : secondArea > firstArea
      ? `B mở rộng thêm ${formatComparisonArea(areaDifference)}, tương đương ${areaDifferencePercent.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}% so với A.`
      : `B thu hẹp ${formatComparisonArea(areaDifference)}, tương đương ${areaDifferencePercent.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}% so với A.`;

  const firstAdvantages = [
    firstArea >= secondArea
      ? `A có phạm vi bao phủ lớn hơn hoặc bằng B (${formatComparisonArea(firstArea)}).`
      : `A có phạm vi tập trung hơn B, ít hơn ${formatComparisonArea(areaDifference)}.`,
    `A giữ ${formatComparisonArea(onlyFirstArea)} không gian riêng, chiếm ${firstExclusivePercent.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}% diện tích A.`,
  ];
  const secondAdvantages = [
    secondArea >= firstArea
      ? `B có phạm vi bao phủ lớn hơn hoặc bằng A (${formatComparisonArea(secondArea)}).`
      : `B có phạm vi tập trung hơn A, ít hơn ${formatComparisonArea(areaDifference)}.`,
    `B có ${formatComparisonArea(onlySecondArea)} không gian mới/riêng, chiếm ${secondExclusivePercent.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}% diện tích B.`,
  ];

  const assessment =
    overlapArea <= 0
      ? 'Hai phương án độc lập về không gian, không phát sinh vùng chồng lấn trực tiếp.'
      : overlapOfSmaller >= 95
        ? `Phạm vi nhỏ hơn gần như nằm trọn trong phạm vi lớn hơn (${overlapOfSmaller.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%).`
        : overlapOfSmaller >= 70
          ? `Hai phương án duy trì phần lớn phạm vi chung (${overlapOfSmaller.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}% của vùng nhỏ hơn).`
          : `Hai phương án có mức thay đổi ranh giới đáng kể; phần giao chiếm ${overlapOfSmaller.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}% vùng nhỏ hơn.`;

  const recommendation =
    overlapArea <= 0
      ? 'Nên kiểm tra kết nối hạ tầng, mục đích sử dụng đất và tác động giữa hai khu vực tách biệt.'
      : overlapOfSmaller >= 70
        ? 'Nên ưu tiên rà soát chỉ tiêu và pháp lý tại phần giao; phần ngoài vùng giao là khu vực thay đổi chính.'
        : 'Nên rà soát riêng phần chỉ thuộc A và phần chỉ thuộc B để xác định khu vực bị loại bỏ, bổ sung hoặc chuyển đổi.';

  return {
    scaleComparison,
    firstAdvantages: firstAdvantages.map((text) =>
      text.replace(/^A/, firstName || 'A'),
    ),
    secondAdvantages: secondAdvantages.map((text) =>
      text.replace(/^B/, secondName || 'B'),
    ),
    assessment,
    recommendation,
  };
}

const editableGeometryLabels: Record<EditableGeometryKind, string> = {
  point: 'Điểm',
  line: 'Đường',
  polygon: 'Vùng',
};

const coordinateInputPlaceholders: Record<EditableGeometryKind, string> = {
  point: '106.633245, 16.636031',
  line: '106.630000, 16.636000\n106.635000, 16.638000',
  polygon:
    '106.630000, 16.634000\n106.636000, 16.634000\n106.636000, 16.639000',
};

function parseCoordinateInput(
  value: string,
  geometryKind: EditableGeometryKind,
):
  | { ok: true; coordinates: [number, number][] }
  | { ok: false; error: string } {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { ok: false, error: 'Hãy nhập ít nhất một cặp kinh độ, vĩ độ.' };
  }

  const coordinates: [number, number][] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const parts = lines[index]
      .replace(/[[\]()]/g, '')
      .split(/[,\s;]+/)
      .filter(Boolean);
    if (parts.length !== 2) {
      return {
        ok: false,
        error: `Dòng ${index + 1} phải có đúng dạng: kinh độ, vĩ độ.`,
      };
    }

    const longitude = Number(parts[0]);
    const latitude = Number(parts[1]);
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      return {
        ok: false,
        error: `Tọa độ tại dòng ${index + 1} không phải số hợp lệ.`,
      };
    }
    if (longitude < -180 || longitude > 180) {
      return {
        ok: false,
        error: `Kinh độ tại dòng ${index + 1} phải từ -180 đến 180.`,
      };
    }
    if (latitude < -90 || latitude > 90) {
      return {
        ok: false,
        error: `Vĩ độ tại dòng ${index + 1} phải từ -90 đến 90.`,
      };
    }
    coordinates.push([longitude, latitude]);
  }

  const requiredCoordinateCount =
    geometryKind === 'point' ? 1 : geometryKind === 'line' ? 2 : 3;
  if (geometryKind === 'point' && coordinates.length !== 1) {
    return { ok: false, error: 'Điểm chỉ được nhập một cặp tọa độ.' };
  }
  if (coordinates.length < requiredCoordinateCount) {
    return {
      ok: false,
      error: `${editableGeometryLabels[geometryKind]} cần ít nhất ${requiredCoordinateCount} cặp tọa độ.`,
    };
  }

  const uniqueCoordinates = new Set(
    coordinates.map(([longitude, latitude]) => `${longitude},${latitude}`),
  );
  if (uniqueCoordinates.size < requiredCoordinateCount) {
    return {
      ok: false,
      error: `${editableGeometryLabels[geometryKind]} cần ít nhất ${requiredCoordinateCount} tọa độ khác nhau.`,
    };
  }

  return { ok: true, coordinates };
}

interface MapClientProps {
  mapState: MapState;
  onObjectEditorOpen?: () => void;
  onObjectEditorClose?: () => void;
  onPlanningComparisonOpen?: () => void;
  onPlanningComparisonClose?: () => void;
}

export default function MapClient({
  mapState,
  onObjectEditorOpen,
  onObjectEditorClose,
  onPlanningComparisonOpen,
  onPlanningComparisonClose,
}: MapClientProps) {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<OlMap | null>(null);
  const mapStateRef = React.useRef(mapState);
  const baseLayerRef = React.useRef<TileLayer<XYZ> | null>(null);
  const baseOverlayLayerRef = React.useRef<TileLayer<XYZ> | null>(null);
  const styledBaseLayerRef = React.useRef<LayerGroup | null>(null);
  const administrativeBaseLayerRef = React.useRef<LayerGroup | null>(null);
  const styledBaseLayerUrlRef = React.useRef<string | null>(null);
  const loadVisibleAdministrativeCommunesRef = React.useRef<() => void>(() => {});
  const graticuleRef = React.useRef<Graticule | null>(null);
  const tileSourceCacheRef = React.useRef(new globalThis.Map<string, XYZ>());
  const layerRegistryRef = React.useRef(new globalThis.Map<string, VectorLayer>());
  const villageLayerRef = React.useRef<VectorLayer | null>(null);
  const editableSourceRef = React.useRef(new VectorSource());
  const planningComparisonSourceRef = React.useRef(new VectorSource());
  const editableLayerRef = React.useRef<VectorLayer | null>(null);
  const weatherRasterLayerRef = React.useRef<ImageLayer<ImageCanvasSource> | null>(null);
  const selectInteractionRef = React.useRef<Select | null>(null);
  const activeDrawInteractionRef = React.useRef<Draw | null>(null);
  const drawCoordinateOverlayRef = React.useRef<HTMLDivElement>(null);
  const weatherParticleCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const objectPopupElementRef = React.useRef<HTMLDivElement>(null);
  const objectPopupOverlayRef = React.useRef<Overlay | null>(null);
  const weatherPopupElementRef = React.useRef<HTMLDivElement>(null);
  const weatherPopupOverlayRef = React.useRef<Overlay | null>(null);
  const activeEditorInteractionsRef = React.useRef<Array<Draw | Modify | Snap>>([]);
  const eventKeysRef = React.useRef<EventsKey[]>([]);
  const hasFitDemoDataRef = React.useRef(false);
  const previousMapModeRef = React.useRef<MapMode>(mapState.mapMode);
  const mapViewBeforeWeatherRef = React.useRef<{
    center: number[];
    zoom: number;
  } | null>(null);
  const isPlanningComparisonModeRef = React.useRef(false);
  const planningComparisonFeatureIdsRef = React.useRef<string[]>([]);

  const [mapReady, setMapReady] = React.useState(false);
  const [editorMode, setEditorMode] = React.useState<EditorMode>('view');
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [isPersisting, setIsPersisting] = React.useState(false);
  const [editableFeatureCount, setEditableFeatureCount] = React.useState(0);
  const [savedFeatureCount, setSavedFeatureCount] = React.useState(0);
  const [selectedFeatureId, setSelectedFeatureId] = React.useState<string | null>(null);
  const [selectedGeometryKind, setSelectedGeometryKind] =
    React.useState<EditableGeometryKind | null>(null);
  const [selectedFeatureStatus, setSelectedFeatureStatus] =
    React.useState<EditableFeatureStatus | null>(null);
  const [selectedFeatureName, setSelectedFeatureName] = React.useState('');
  const [selectedFeatureLayerId, setSelectedFeatureLayerId] =
    React.useState('');
  const [selectedFeatureDescription, setSelectedFeatureDescription] =
    React.useState('');
  const [selectedFeatureStrokeColor, setSelectedFeatureStrokeColor] =
    React.useState('#ea580c');
  const [selectedFeatureFillColor, setSelectedFeatureFillColor] =
    React.useState('#fb923c');
  const [savedObjectPopup, setSavedObjectPopup] =
    React.useState<SavedObjectPopup | null>(null);
  const [weatherPopup, setWeatherPopup] =
    React.useState<WeatherPopup | null>(null);
  const [featureFormError, setFeatureFormError] = React.useState<string | null>(
    null,
  );
  const [coordinateInputs, setCoordinateInputs] = React.useState<
    Record<EditableGeometryKind, string>
  >({
    point: '',
    line: '',
    polygon: '',
  });
  const [coordinateInputError, setCoordinateInputError] = React.useState<
    string | null
  >(null);
  const [isPlanningComparisonMode, setIsPlanningComparisonMode] =
    React.useState(false);
  const [planningComparisonFeatureIds, setPlanningComparisonFeatureIds] =
    React.useState<string[]>([]);
  const [planningComparisonSelections, setPlanningComparisonSelections] =
    React.useState<PlanningComparisonSelection[]>([]);
  const [planningComparisonResult, setPlanningComparisonResult] =
    React.useState<PlanningComparisonResult | null>(null);
  const [planningComparisonError, setPlanningComparisonError] =
    React.useState<string | null>(null);

  const clearSelectedFeatureState = React.useCallback(() => {
    setSelectedFeatureId(null);
    setSelectedGeometryKind(null);
    setSelectedFeatureStatus(null);
    setSelectedFeatureName('');
    setSelectedFeatureLayerId('');
    setSelectedFeatureDescription('');
    setSelectedFeatureStrokeColor('#ea580c');
    setSelectedFeatureFillColor('#fb923c');
    setFeatureFormError(null);
  }, []);

  const loadSelectedFeatureState = React.useCallback((feature: Feature) => {
    const id = String(feature.getId() ?? 'editable-feature');
    const geometryKind = editableGeometryKind(feature);
    setSelectedFeatureId(id);
    setSelectedGeometryKind(geometryKind);
    setSelectedFeatureStatus(
      feature.get('status') === 'saved' ? 'saved' : 'draft',
    );
    setSelectedFeatureName(String(feature.get('name') ?? ''));
    const layerId = String(
      feature.get('previewLayerId') ||
        feature.get('layerId') ||
        feature.get('category') ||
        '',
    );
    const layerStyle = MAP_LAYER_BY_ID.get(layerId)?.styleConfig;
    setSelectedFeatureLayerId(layerId);
    setSelectedFeatureDescription(String(feature.get('description') ?? ''));
    setSelectedFeatureStrokeColor(
      String(
        feature.get('previewStrokeColor') ||
          feature.get('strokeColor') ||
          layerStyle?.color ||
          '#ea580c',
      ),
    );
    setSelectedFeatureFillColor(
      String(
        feature.get('previewFillColor') ||
          feature.get('fillColor') ||
          layerStyle?.fillColor ||
          layerStyle?.color ||
          '#fb923c',
      ),
    );
    setFeatureFormError(null);
  }, []);

  const refreshEditableFeatureStats = React.useCallback(() => {
    const features = editableSourceRef.current
      .getFeatures()
      .filter((feature) => feature.get('source') === 'user');
    setEditableFeatureCount(features.length);
    setSavedFeatureCount(
      features.filter((feature) => feature.get('status') === 'saved').length,
    );
  }, []);

  const refreshLayerFeatureCounts = React.useCallback(() => {
    const counts: Record<string, number> = {};
    editableSourceRef.current.getFeatures().forEach((feature) => {
      if (feature.get('status') !== 'saved') return;
      const layerId = String(feature.get('layerId') ?? '');
      if (!layerId || !MAP_LAYER_BY_ID.has(layerId)) return;
      counts[layerId] = (counts[layerId] ?? 0) + 1;
    });
    mapStateRef.current.setLayerFeatureCounts(counts);
  }, []);

  const resetPlanningComparisonSelection = React.useCallback(() => {
    planningComparisonFeatureIdsRef.current = [];
    setPlanningComparisonFeatureIds([]);
    setPlanningComparisonSelections([]);
    setPlanningComparisonResult(null);
    setPlanningComparisonError(null);
    planningComparisonSourceRef.current.clear();
  }, []);

  const reportPlanningComparisonError = React.useCallback((message: string) => {
    setPlanningComparisonError(message);
    toast.error(message);
  }, []);

  const stopPlanningComparison = React.useCallback(() => {
    isPlanningComparisonModeRef.current = false;
    setIsPlanningComparisonMode(false);
    resetPlanningComparisonSelection();
    const viewport = mapRef.current?.getViewport();
    if (viewport) viewport.style.cursor = '';
    onPlanningComparisonClose?.();
  }, [onPlanningComparisonClose, resetPlanningComparisonSelection]);

  const startPlanningComparison = React.useCallback(() => {
    activeDrawInteractionRef.current?.abortDrawing();
    activeDrawInteractionRef.current = null;
    setIsDrawing(false);
    setEditorMode('view');
    selectInteractionRef.current?.getFeatures().clear();
    clearSelectedFeatureState();
    objectPopupOverlayRef.current?.setPosition(undefined);
    setSavedObjectPopup(null);
    resetPlanningComparisonSelection();
    onPlanningComparisonOpen?.();
    isPlanningComparisonModeRef.current = true;
    setIsPlanningComparisonMode(true);
    const viewport = mapRef.current?.getViewport();
    if (viewport) viewport.style.cursor = 'crosshair';
    toast.info('Chọn đối tượng quy hoạch thứ nhất trên bản đồ.');
  }, [
    clearSelectedFeatureState,
    onPlanningComparisonOpen,
    resetPlanningComparisonSelection,
  ]);

  const selectPlanningFeatureForComparison = React.useCallback(
    (feature: Feature) => {
      const featureId = String(feature.getId() ?? '');
      const layerId = String(feature.get('layerId') ?? '');
      const geometryType = feature.getGeometry()?.getType() ?? '';
      if (!featureId) {
        reportPlanningComparisonError(
          'Đối tượng chưa có mã định danh để so sánh.',
        );
        return;
      }

      const selectedIds = planningComparisonFeatureIdsRef.current;
      if (selectedIds.includes(featureId)) {
        reportPlanningComparisonError(
          'Không thể so sánh một đối tượng với chính nó.',
        );
        return;
      }
      if (selectedIds.length >= 2) {
        toast.info('Hãy bấm Chọn lại để thực hiện phép so sánh mới.');
        return;
      }

      if (selectedIds.length === 0) {
        setPlanningComparisonError(null);
        const firstClone = feature.clone();
        firstClone.setId(`planning-comparison-first-${featureId}`);
        firstClone.set('comparisonRole', 'first');
        planningComparisonSourceRef.current.clear();
        planningComparisonSourceRef.current.addFeature(firstClone);
        planningComparisonFeatureIdsRef.current = [featureId];
        setPlanningComparisonFeatureIds([featureId]);
        setPlanningComparisonSelections([
          {
            id: featureId,
            name: String(feature.get('name') ?? 'Đối tượng thứ nhất'),
            layerName:
              MAP_LAYER_BY_ID.get(layerId)?.name ?? 'Lớp quy hoạch',
            geometryType,
          },
        ]);
        toast.info('Đã chọn đối tượng thứ nhất. Hãy chọn đối tượng thứ hai.');
        return;
      }

      const firstFeature = editableSourceRef.current.getFeatureById(
        selectedIds[0],
      );
      if (!firstFeature) {
        resetPlanningComparisonSelection();
        reportPlanningComparisonError(
          'Không còn tìm thấy đối tượng thứ nhất. Hãy chọn lại.',
        );
        return;
      }

      const firstLayerId = String(firstFeature.get('layerId') ?? '');
      const firstGeometryType = firstFeature.getGeometry()?.getType() ?? '';
      if (firstLayerId !== layerId) {
        reportPlanningComparisonError(
          'Hai đối tượng khác lớp. Chỉ được so sánh hai đối tượng cùng lớp quy hoạch.',
        );
        return;
      }
      if (firstGeometryType !== geometryType) {
        reportPlanningComparisonError(
          `Hai đối tượng không cùng kiểu hình học (${firstGeometryType} và ${geometryType}).`,
        );
        return;
      }
      if (geometryType !== 'Polygon' && geometryType !== 'MultiPolygon') {
        reportPlanningComparisonError(
          'Phân tích quy hoạch hiện chỉ hỗ trợ đối tượng vùng Polygon hoặc MultiPolygon.',
        );
        return;
      }

      const firstGeoJson = geoJsonFormat.writeFeatureObject(firstFeature, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
        decimals: 7,
      }) as GeoJsonFeature<PlanningPolygonGeometry>;
      const secondGeoJson = geoJsonFormat.writeFeatureObject(feature, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
        decimals: 7,
      }) as GeoJsonFeature<PlanningPolygonGeometry>;
      const collection: GeoJsonFeatureCollection<PlanningPolygonGeometry> = {
        type: 'FeatureCollection',
        features: [firstGeoJson, secondGeoJson],
      };

      try {
        const firstArea = turfArea(firstGeoJson);
        const secondArea = turfArea(secondGeoJson);
        const overlapFeature = intersect(collection, {
          properties: { comparisonRole: 'overlap' },
        });
        const overlapArea = overlapFeature ? turfArea(overlapFeature) : 0;
        const layerName =
          MAP_LAYER_BY_ID.get(layerId)?.name ?? 'Lớp quy hoạch';
        const firstObject: PlanningComparisonObject = {
          id: selectedIds[0],
          name: String(firstFeature.get('name') ?? 'Đối tượng thứ nhất'),
          layerId,
          layerName,
          geometryType,
          areaSquareMeters: firstArea,
        };
        const secondObject: PlanningComparisonObject = {
          id: featureId,
          name: String(feature.get('name') ?? 'Đối tượng thứ hai'),
          layerId,
          layerName,
          geometryType,
          areaSquareMeters: secondArea,
        };
        setPlanningComparisonError(null);

        const secondClone = feature.clone();
        secondClone.setId(`planning-comparison-second-${featureId}`);
        secondClone.set('comparisonRole', 'second');
        planningComparisonSourceRef.current.addFeature(secondClone);
        if (overlapFeature) {
          const overlapOlFeature = readGeoJsonFeatures(overlapFeature)[0];
          if (overlapOlFeature) {
            overlapOlFeature.setId('planning-comparison-overlap');
            overlapOlFeature.set('comparisonRole', 'overlap');
            planningComparisonSourceRef.current.addFeature(overlapOlFeature);
          }
        }

        planningComparisonFeatureIdsRef.current = [
          selectedIds[0],
          featureId,
        ];
        setPlanningComparisonFeatureIds([selectedIds[0], featureId]);
        setPlanningComparisonSelections([
          {
            id: firstObject.id,
            name: firstObject.name,
            layerName: firstObject.layerName,
            geometryType: firstObject.geometryType,
          },
          {
            id: secondObject.id,
            name: secondObject.name,
            layerName: secondObject.layerName,
            geometryType: secondObject.geometryType,
          },
        ]);
        setPlanningComparisonResult({
          first: firstObject,
          second: secondObject,
          overlapSquareMeters: overlapArea,
          onlyFirstSquareMeters: Math.max(0, firstArea - overlapArea),
          onlySecondSquareMeters: Math.max(0, secondArea - overlapArea),
          overlapFirstPercent:
            firstArea > 0 ? (overlapArea / firstArea) * 100 : 0,
          overlapSecondPercent:
            secondArea > 0 ? (overlapArea / secondArea) * 100 : 0,
          summary: planningComparisonSummary(
            firstArea,
            secondArea,
            overlapArea,
          ),
          analysis: buildPlanningComparisonAnalysis(
            firstObject.name,
            secondObject.name,
            firstArea,
            secondArea,
            overlapArea,
          ),
        });

        const comparisonExtent =
          planningComparisonSourceRef.current.getExtent();
        if (comparisonExtent && comparisonExtent.every(Number.isFinite)) {
          mapRef.current?.getView().fit(comparisonExtent, {
            padding: [100, 100, 220, 100],
            duration: 450,
            maxZoom: 17,
          });
        }
        toast.success('Đã hoàn thành phân tích hai vùng quy hoạch.');
      } catch (error) {
        console.error('Không thể phân tích hai vùng quy hoạch', error);
        reportPlanningComparisonError(
          'Không thể phân tích hình học của hai đối tượng. Hãy kiểm tra lại các đỉnh vùng.',
        );
      }
    },
    [reportPlanningComparisonError, resetPlanningComparisonSelection],
  );

  const closeSavedObjectPopup = React.useCallback(() => {
    objectPopupOverlayRef.current?.setPosition(undefined);
    setSavedObjectPopup(null);
  }, []);

  const closeWeatherPopup = React.useCallback(() => {
    weatherPopupOverlayRef.current?.setPosition(undefined);
    setWeatherPopup(null);
  }, []);

  const openSavedObjectPopup = React.useCallback(
    (feature: Feature, coordinate: number[]) => {
      const featureId = String(feature.getId() ?? '');
      const layerId = String(feature.get('layerId') ?? '');
      if (!featureId) return;

      setSavedObjectPopup({
        featureId,
        name: String(feature.get('name') ?? 'Đối tượng chưa đặt tên'),
        category: String(
          feature.get('category') ??
            MAP_LAYER_BY_ID.get(layerId)?.name ??
            'Chưa phân loại',
        ),
        description: String(feature.get('description') ?? ''),
        geometryKind: editableGeometryKind(feature) ?? 'point',
        layerId,
        details:
          feature.get('details') &&
          typeof feature.get('details') === 'object'
            ? (feature.get('details') as Record<
                string,
                string | number | boolean | null
              >)
            : {},
      });
      objectPopupOverlayRef.current?.setPosition(coordinate);
    },
    [],
  );

  React.useEffect(() => {
    if (!savedObjectPopup) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      const popupElement = objectPopupElementRef.current;
      if (
        popupElement &&
        event.target instanceof Node &&
        popupElement.contains(event.target)
      ) {
        return;
      }
      closeSavedObjectPopup();
    };

    document.addEventListener('pointerdown', handlePointerDownOutside, true);
    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDownOutside,
        true,
      );
    };
  }, [closeSavedObjectPopup, savedObjectPopup]);

  React.useEffect(() => {
    if (!weatherPopup) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      const popupElement = weatherPopupElementRef.current;
      if (
        popupElement &&
        event.target instanceof Node &&
        popupElement.contains(event.target)
      ) {
        return;
      }
      closeWeatherPopup();
    };

    document.addEventListener('pointerdown', handlePointerDownOutside, true);
    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDownOutside,
        true,
      );
    };
  }, [closeWeatherPopup, weatherPopup]);

  React.useEffect(() => {
    mapStateRef.current = mapState;
  }, [mapState]);

  React.useEffect(() => {
    if (!targetRef.current) return;

    const registry = layerRegistryRef.current;
    const tileSourceCache = tileSourceCacheRef.current;
    const baseLayer = new TileLayer<XYZ>({
      visible: false,
      zIndex: 0,
      preload: 1,
      useInterimTilesOnError: true,
    });
    baseLayerRef.current = baseLayer;
    const baseOverlayLayer = new TileLayer<XYZ>({
      visible: false,
      zIndex: 2,
      preload: 1,
      useInterimTilesOnError: true,
    });
    baseOverlayLayerRef.current = baseOverlayLayer;
    const styledBaseLayer = new LayerGroup({ visible: false, zIndex: 0 });
    styledBaseLayerRef.current = styledBaseLayer;

    const administrativeProvinceSource = new VectorSource({
      url: '/gis-source/vietnam-administrative?level=provinces',
      format: new GeoJSON(),
      attributions: 'Dữ liệu hành chính &copy; gis.vn',
      wrapX: false,
    });
    const administrativeCommuneSource = new VectorSource({ wrapX: false });
    const administrativeProvinceLayer = new VectorLayer({
      source: administrativeProvinceSource,
      background: '#dbeafe',
      declutter: 'administrative-labels',
      renderBuffer: 32,
      style: administrativeProvinceStyle,
      updateWhileAnimating: false,
      updateWhileInteracting: false,
      zIndex: 0,
    });
    const administrativeCommuneLayer = new VectorLayer({
      source: administrativeCommuneSource,
      declutter: 'administrative-labels',
      minZoom: 8,
      renderBuffer: 32,
      style: administrativeCommuneStyle,
      updateWhileAnimating: false,
      updateWhileInteracting: false,
      zIndex: 1,
    });
    const administrativeBaseLayer = new LayerGroup({
      layers: [administrativeProvinceLayer, administrativeCommuneLayer],
      visible: false,
      zIndex: 0,
    });
    administrativeBaseLayerRef.current = administrativeBaseLayer;

    const sovereigntyLayer = new VectorLayer({
      source: new VectorSource({
        url: '/gis-source/vietnam-islands',
        format: new GeoJSON(),
        wrapX: false,
      }),
      declutter: true,
      renderBuffer: 96,
      style: sovereigntyReferenceStyle,
      zIndex: 90,
    });

    const weatherRasterLayer = new ImageLayer<ImageCanvasSource>({
      visible: false,
      zIndex: 24,
    });
    weatherRasterLayer.set('layerId', 'weather-raster');
    weatherRasterLayerRef.current = weatherRasterLayer;

    const editableLayer = new VectorLayer({
      source: editableSourceRef.current,
      style: (feature, resolution) => {
        const layerId = String(feature.get('layerId') ?? '');
        if (mapStateRef.current.mapMode === 'weather') {
          if (!WEATHER_REFERENCE_LAYER_IDS.has(layerId)) return undefined;
          return demoFeatureStyle(
            feature,
            mapStateRef.current.selectedVillageCode,
            resolution,
          );
        }
        const layerConfig = MAP_LAYER_BY_ID.get(layerId);
        const canViewLayer =
          !layerConfig ||
          layerConfig.securityLevel !== 'confidential' ||
          layerConfig.allowedRoles.includes(
            mapStateRef.current.currentRole ?? '',
          );
        if (
          layerId &&
          (!mapStateRef.current.activeLayerIds.includes(layerId) ||
            !canViewLayer)
        ) {
          return undefined;
        }
        return demoFeatureStyle(
          feature,
          mapStateRef.current.selectedVillageCode,
          resolution,
        );
      },
      renderBuffer: 64,
      zIndex: 100,
    });
    const planningComparisonLayer = new VectorLayer({
      source: planningComparisonSourceRef.current,
      style: planningComparisonOverlayStyle,
      renderBuffer: 64,
      zIndex: 110,
    });
    editableLayerRef.current = editableLayer;
    villageLayerRef.current = editableLayer;
    const emptyCatalogLayers: Array<[string, VectorLayer]> = INITIAL_MAP_LAYERS
      .map((layer, index) => [
        layer.id,
        new VectorLayer({
          source: new VectorSource(),
          zIndex: 35 + (index % 10),
        }),
      ]);
    const registeredLayers = emptyCatalogLayers;
    registeredLayers.forEach(([id, layer]) => {
      layer.set('layerId', id);
      layer.setVisible(false);
      registry.set(id, layer);
    });

    const graticule = new Graticule({
      strokeStyle: new Stroke({ color: 'rgba(100,116,139,0.28)', width: 1 }),
      showLabels: true,
      wrapX: false,
      zIndex: 1,
      visible: false,
    });
    graticuleRef.current = graticule;

    const map = new OlMap({
      target: targetRef.current,
      layers: [
        baseLayer,
        baseOverlayLayer,
        styledBaseLayer,
        administrativeBaseLayer,
        graticule,
        weatherRasterLayer,
        ...registeredLayers.map(([, layer]) => layer),
        sovereigntyLayer,
        editableLayer,
        planningComparisonLayer,
      ],
      view: new View({
        center: fromLonLat([LAOBAO_CENTER.lng, LAOBAO_CENTER.lat]),
        zoom: LAOBAO_CENTER.zoom,
        minZoom: 4,
        maxZoom: 20,
      }),
      controls: defaultControls({ rotate: false }),
      pixelRatio: Math.min(window.devicePixelRatio || 1, 1.25),
    });
    mapRef.current = map;
    if (objectPopupElementRef.current) {
      const objectPopupOverlay = new Overlay({
        element: objectPopupElementRef.current,
        positioning: 'bottom-center',
        offset: [0, -12],
        stopEvent: true,
      });
      objectPopupOverlayRef.current = objectPopupOverlay;
      map.addOverlay(objectPopupOverlay);
    }
    if (weatherPopupElementRef.current) {
      const weatherPopupOverlay = new Overlay({
        element: weatherPopupElementRef.current,
        positioning: 'bottom-center',
        offset: [0, -12],
        stopEvent: true,
      });
      weatherPopupOverlayRef.current = weatherPopupOverlay;
      map.addOverlay(weatherPopupOverlay);
    }

    const loadedAdministrativeProvinceIds = new Set<string>();
    const loadingAdministrativeProvinceIds = new Set<string>();
    const administrativeFetchControllers = new Set<AbortController>();

    const loadVisibleAdministrativeCommunes = () => {
      if (
        mapStateRef.current.activeBaseLayerId !== 'gis-vn-administrative' ||
        (map.getView().getZoom() ?? 0) < 8
      ) {
        return;
      }

      const visibleProvinceIds = Array.from(
        new Set(
          administrativeProvinceSource
            .getFeaturesInExtent(map.getView().calculateExtent(map.getSize()))
            .map((feature) => feature.get('provinceCode'))
            .filter((value): value is string => typeof value === 'string'),
        ),
      ).slice(0, 6);

      visibleProvinceIds.forEach((provinceCode) => {
        if (
          loadedAdministrativeProvinceIds.has(provinceCode) ||
          loadingAdministrativeProvinceIds.has(provinceCode)
        ) {
          return;
        }

        loadingAdministrativeProvinceIds.add(provinceCode);
        const controller = new AbortController();
        administrativeFetchControllers.add(controller);

        void fetch(
          `/gis-source/vietnam-administrative?level=communes&province=${encodeURIComponent(provinceCode)}`,
          { signal: controller.signal },
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            return response.json() as Promise<object>;
          })
          .then((data) => {
            const features = readGeoJsonFeatures(data);
            administrativeCommuneSource.addFeatures(features);
            loadedAdministrativeProvinceIds.add(provinceCode);
          })
          .catch((error: unknown) => {
            if (!controller.signal.aborted) {
              console.warn(
                `Không thể tải ranh giới xã thuộc tỉnh ${provinceCode}`,
                error,
              );
            }
          })
          .finally(() => {
            loadingAdministrativeProvinceIds.delete(provinceCode);
            administrativeFetchControllers.delete(controller);
          });
      });
    };
    loadVisibleAdministrativeCommunesRef.current = loadVisibleAdministrativeCommunes;
    const administrativeMoveKey = map.on(
      'moveend',
      loadVisibleAdministrativeCommunes,
    );
    const administrativeProvinceLoadKey = administrativeProvinceSource.on(
      'featuresloadend',
      loadVisibleAdministrativeCommunes,
    );
    eventKeysRef.current.push(
      administrativeMoveKey,
      administrativeProvinceLoadKey,
    );

    const selection = new Select({
      layers: [editableLayer],
      filter: (feature) => feature.get('status') !== 'saved',
      style: (feature, resolution) => [
        selectedEditableStyle,
        demoFeatureStyle(
          feature,
          mapStateRef.current.selectedVillageCode,
          resolution,
        ),
      ],
      hitTolerance: 8,
    });
    selectInteractionRef.current = selection;
    map.addInteraction(selection);

    const selectionKey = selection.on('select', (event) => {
      event.deselected.forEach((feature) => {
        feature.unset('previewLayerId', true);
        feature.unset('previewStrokeColor', true);
        feature.unset('previewFillColor', true);
        feature.changed();
      });
      const feature = event.selected[0];
      if (!feature) {
        clearSelectedFeatureState();
        onObjectEditorClose?.();
        return;
      }
      onObjectEditorOpen?.();
      loadSelectedFeatureState(feature);
    });
    eventKeysRef.current.push(selectionKey);

    const clickKey = map.on('singleclick', (event) => {
      if (mapStateRef.current.mapMode === 'weather') {
        closeSavedObjectPopup();
        const weatherData = mapStateRef.current.weatherData;
        const [clickedLongitude, clickedLatitude] = toLonLat(event.coordinate);
        if (
          !weatherData ||
          clickedLongitude < weatherData.grid.west ||
          clickedLongitude > weatherData.grid.east ||
          clickedLatitude < weatherData.grid.south ||
          clickedLatitude > weatherData.grid.north
        ) {
          closeWeatherPopup();
          return;
        }
        const forecastIndex = Math.min(
          mapStateRef.current.weatherForecastIndex,
          Math.max(0, weatherData.forecastHours.length - 1),
        );
        mapStateRef.current.setWeatherSelectedCoordinates([
          clickedLongitude,
          clickedLatitude,
        ]);
        setWeatherPopup({
          latitude: clickedLatitude,
          longitude: clickedLongitude,
          time: weatherData.forecastHours[forecastIndex] ?? '',
          temperature: interpolateWeatherValue(
            weatherData,
            'temperature',
            forecastIndex,
            clickedLongitude,
            clickedLatitude,
          ),
          precipitation: interpolateWeatherValue(
            weatherData,
            'precipitation',
            forecastIndex,
            clickedLongitude,
            clickedLatitude,
          ),
          windSpeed: interpolateWeatherValue(
            weatherData,
            'windSpeed',
            forecastIndex,
            clickedLongitude,
            clickedLatitude,
          ),
          windDirection: interpolateWeatherValue(
            weatherData,
            'windDirection',
            forecastIndex,
            clickedLongitude,
            clickedLatitude,
          ),
        });
        weatherPopupOverlayRef.current?.setPosition(event.coordinate);
        return;
      }

      closeWeatherPopup();
      const savedEditableFeatures = map
        .getFeaturesAtPixel(event.pixel, {
          hitTolerance: 8,
          layerFilter: (layer) => layer === editableLayer,
        })
        .filter(
          (feature): feature is Feature =>
            feature instanceof Feature &&
            feature.get('status') === 'saved',
        )
        .sort(compareSavedFeatureHitPriority);

      if (isPlanningComparisonModeRef.current) {
        closeSavedObjectPopup();
        selectInteractionRef.current?.getFeatures().clear();
        clearSelectedFeatureState();
        const clickedFeature = savedEditableFeatures[0];
        if (!clickedFeature) {
          reportPlanningComparisonError(
            'Không tìm thấy đối tượng tại vị trí đã chọn.',
          );
          return;
        }
        if (
          !PLANNING_COMPARISON_LAYER_IDS.has(
            String(clickedFeature.get('layerId') ?? ''),
          )
        ) {
          const clickedLayerName =
            MAP_LAYER_BY_ID.get(
              String(clickedFeature.get('layerId') ?? ''),
            )?.name ?? 'không xác định';
          reportPlanningComparisonError(
            `Lớp “${clickedLayerName}” không thuộc bốn lớp được hỗ trợ so sánh quy hoạch.`,
          );
          return;
        }
        selectPlanningFeatureForComparison(clickedFeature);
        return;
      }

      const savedEditableFeature = savedEditableFeatures[0];
      if (savedEditableFeature) {
        if (savedEditableFeature.get('layerId') === 'layer-villages') {
          const code = savedEditableFeature.get('villageCode');
          if (typeof code === 'string') {
            const current = mapStateRef.current.selectedVillageCode;
            mapStateRef.current.setSelectedVillageCode(
              current === code ? null : code,
            );
            editableLayer.changed();
          }
        }
        selectInteractionRef.current?.getFeatures().clear();
        clearSelectedFeatureState();
        const savedGeometry = savedEditableFeature.getGeometry();
        openSavedObjectPopup(
          savedEditableFeature,
          savedGeometry instanceof Point
            ? savedGeometry.getCoordinates()
            : event.coordinate,
        );
        return;
      }

      closeSavedObjectPopup();
    });
    eventKeysRef.current.push(clickKey);

    const addKey = editableSourceRef.current.on(
      'addfeature',
      refreshEditableFeatureStats,
    );
    const removeKey = editableSourceRef.current.on(
      'removefeature',
      refreshEditableFeatureStats,
    );
    const clearKey = editableSourceRef.current.on(
      'clear',
      refreshEditableFeatureStats,
    );
    eventKeysRef.current.push(addKey, removeKey, clearKey);

    setMapReady(true);

    return () => {
      activeEditorInteractionsRef.current.forEach((interaction) =>
        map.removeInteraction(interaction),
      );
      activeDrawInteractionRef.current?.abortDrawing();
      activeDrawInteractionRef.current = null;
      administrativeFetchControllers.forEach((controller) => controller.abort());
      eventKeysRef.current.forEach(unByKey);
      eventKeysRef.current = [];
      map.setTarget(undefined);
      mapRef.current = null;
      objectPopupOverlayRef.current = null;
      weatherPopupOverlayRef.current = null;
      baseLayerRef.current = null;
      baseOverlayLayerRef.current = null;
      styledBaseLayerRef.current = null;
      administrativeBaseLayerRef.current = null;
      styledBaseLayerUrlRef.current = null;
      loadVisibleAdministrativeCommunesRef.current = () => {};
      graticuleRef.current = null;
      tileSourceCache.clear();
      villageLayerRef.current = null;
      hasFitDemoDataRef.current = false;
      editableLayerRef.current = null;
      weatherRasterLayerRef.current = null;
      selectInteractionRef.current = null;
      registry.clear();
    };
  }, [
    clearSelectedFeatureState,
    closeWeatherPopup,
    closeSavedObjectPopup,
    loadSelectedFeatureState,
    onObjectEditorClose,
    onObjectEditorOpen,
    openSavedObjectPopup,
    refreshEditableFeatureStats,
    reportPlanningComparisonError,
    selectPlanningFeatureForComparison,
  ]);

  React.useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const controller = new AbortController();
    const loadDemoData = async () => {
      try {
        const collection = await fetchDemoGisFeatures(controller.signal);
        if (controller.signal.aborted) return;

        const features = readGeoJsonFeatures(collection);
        const source = editableSourceRef.current;
        source.clear();
        source.addFeatures(features);
        refreshEditableFeatureStats();
        refreshLayerFeatureCounts();

        if (!hasFitDemoDataRef.current) {
          const communeFeature = features.find(
            (feature) => feature.get('layerId') === 'layer-commune',
          );
          const extent = communeFeature?.getGeometry()?.getExtent();
          if (extent && extent.every(Number.isFinite)) {
            mapRef.current?.getView().fit(extent, {
              padding: [80, 80, 80, 80],
              duration: 0,
              maxZoom: 14,
            });
            hasFitDemoDataRef.current = true;
          }
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Không thể tải dữ liệu GIS demo', error);
        toast.error('Không thể tải dữ liệu GIS demo dùng chung.');
      }
    };

    void loadDemoData();
    return () => controller.abort();
  }, [
    mapReady,
    refreshEditableFeatureStats,
    refreshLayerFeatureCounts,
  ]);

  React.useEffect(() => {
    if (!mapReady) return;
    const allowedLayerIds = new Set(
      INITIAL_MAP_LAYERS.filter((layer) => {
        if (layer.securityLevel === 'confidential') {
          return ['admin', 'data_governance', 'commune_leader'].includes(
            mapState.currentRole ?? '',
          );
        }
        return true;
      }).map((layer) => layer.id),
    );
    layerRegistryRef.current.forEach((layer, id) => {
      layer.setVisible(mapState.activeLayerIds.includes(id) && allowedLayerIds.has(id));
    });
    editableLayerRef.current?.changed();

    const selection = selectInteractionRef.current?.getFeatures();
    const selectedFeature = selection?.item(0);
    const selectedLayerId = String(selectedFeature?.get('layerId') ?? '');
    if (
      selectedFeature &&
      selectedLayerId &&
      (!mapState.activeLayerIds.includes(selectedLayerId) ||
        !allowedLayerIds.has(selectedLayerId))
    ) {
      selection?.clear();
      clearSelectedFeatureState();
      if (editorMode === 'modify') setEditorMode('view');
    }

    if (
      savedObjectPopup?.layerId &&
      (!mapState.activeLayerIds.includes(savedObjectPopup.layerId) ||
        !allowedLayerIds.has(savedObjectPopup.layerId))
    ) {
      closeSavedObjectPopup();
    }
  }, [
    closeSavedObjectPopup,
    clearSelectedFeatureState,
    editorMode,
    mapReady,
    mapState.activeLayerIds,
    mapState.currentRole,
    savedObjectPopup,
  ]);

  React.useEffect(() => {
    if (!mapReady) return;
    villageLayerRef.current?.changed();
  }, [mapReady, mapState.selectedVillageCode]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    const previousMode = previousMapModeRef.current;
    if (previousMode === mapState.mapMode) return;

    const view = map.getView();
    if (mapState.mapMode === 'weather') {
      const center = view.getCenter();
      mapViewBeforeWeatherRef.current =
        center && typeof view.getZoom() === 'number'
          ? { center: [...center], zoom: view.getZoom()! }
          : null;
      view.animate({
        center: fromLonLat([VIETNAM_CENTER.lng, VIETNAM_CENTER.lat]),
        zoom: VIETNAM_CENTER.zoom,
        duration: 500,
      });
    } else if (mapViewBeforeWeatherRef.current) {
      view.animate({
        center: mapViewBeforeWeatherRef.current.center,
        zoom: mapViewBeforeWeatherRef.current.zoom,
        duration: 500,
      });
      mapViewBeforeWeatherRef.current = null;
    }
    previousMapModeRef.current = mapState.mapMode;
  }, [mapReady, mapState.mapMode]);

  React.useEffect(() => {
    const weatherRasterLayer = weatherRasterLayerRef.current;
    if (!mapReady || !weatherRasterLayer) return;

    const isWeatherMode = mapState.mapMode === 'weather';
    weatherRasterLayer.setVisible(
      isWeatherMode && Boolean(mapState.weatherData),
    );
    weatherRasterLayer.setOpacity(mapState.weatherOpacity);
    editableLayerRef.current?.changed();

    if (!isWeatherMode) {
      closeWeatherPopup();
      return;
    }

    closeSavedObjectPopup();
    closeWeatherPopup();
    selectInteractionRef.current?.getFeatures().clear();
    clearSelectedFeatureState();
    setEditorMode('view');

    const weatherData = mapState.weatherData;
    if (!weatherData) return;
    const forecastIndex = Math.min(
      mapState.weatherForecastIndex,
      Math.max(0, weatherData.forecastHours.length - 1),
    );
    const weatherCanvasSource = createWeatherCanvasSource(
      weatherData,
      forecastIndex,
      mapState.weatherLayerId,
    );
    weatherRasterLayer.setSource(weatherCanvasSource);
  }, [
    clearSelectedFeatureState,
    closeSavedObjectPopup,
    closeWeatherPopup,
    mapReady,
    mapState.mapMode,
    mapState.weatherData,
    mapState.weatherForecastIndex,
    mapState.weatherLayerId,
    mapState.weatherOpacity,
  ]);

  React.useEffect(() => {
    const canvas = weatherParticleCanvasRef.current;
    const map = mapRef.current;
    const weatherData = mapState.weatherData;
    if (
      !mapReady ||
      !canvas ||
      !map ||
      mapState.mapMode !== 'weather' ||
      mapState.weatherLayerId !== 'wind' ||
      !weatherData
    ) {
      const context = canvas?.getContext('2d');
      if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const context = canvas.getContext('2d');
    const target = targetRef.current;
    if (!context || !target) return;
    const forecastIndex = Math.min(
      mapState.weatherForecastIndex,
      Math.max(0, weatherData.forecastHours.length - 1),
    );
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const resizeCanvas = () => {
      const bounds = target.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(target);

    interface WindParticle {
      x: number;
      y: number;
      age: number;
      maxAge: number;
    }
    const particles: WindParticle[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * target.clientWidth,
      y: Math.random() * target.clientHeight,
      age: Math.random() * 80,
      maxAge: 50 + Math.random() * 70,
    }));
    const resetParticle = (particle: WindParticle) => {
      particle.x = Math.random() * target.clientWidth;
      particle.y = Math.random() * target.clientHeight;
      particle.age = 0;
      particle.maxAge = 50 + Math.random() * 70;
    };
    const { rows, columns, west, south, east, north } = weatherData.grid;
    const vectorAt = (row: number, column: number) => {
      const point = weatherData.points[row * columns + column];
      const speed = point?.windSpeed[forecastIndex];
      const direction = point?.windDirection[forecastIndex];
      if (speed === null || speed === undefined || direction === null || direction === undefined) {
        return [0, 0] as const;
      }
      const radians = (direction * Math.PI) / 180;
      return [-speed * Math.sin(radians), speed * Math.cos(radians)] as const;
    };
    const sampleVector = (longitude: number, latitude: number) => {
      const gridX = Math.max(
        0,
        Math.min(columns - 1, ((longitude - west) / (east - west)) * (columns - 1)),
      );
      const gridY = Math.max(
        0,
        Math.min(rows - 1, ((latitude - south) / (north - south)) * (rows - 1)),
      );
      const column0 = Math.floor(gridX);
      const column1 = Math.min(columns - 1, column0 + 1);
      const row0 = Math.floor(gridY);
      const row1 = Math.min(rows - 1, row0 + 1);
      const xRatio = gridX - column0;
      const yRatio = gridY - row0;
      const topLeft = vectorAt(row0, column0);
      const topRight = vectorAt(row0, column1);
      const bottomLeft = vectorAt(row1, column0);
      const bottomRight = vectorAt(row1, column1);
      const interpolate = (index: 0 | 1) => {
        const top = topLeft[index] + (topRight[index] - topLeft[index]) * xRatio;
        const bottom = bottomLeft[index] + (bottomRight[index] - bottomLeft[index]) * xRatio;
        return top + (bottom - top) * yRatio;
      };
      return [interpolate(0), interpolate(1)] as const;
    };

    let animationFrame = 0;
    let previousFrame = 0;
    const animate = (timestamp: number) => {
      animationFrame = window.requestAnimationFrame(animate);
      if (document.hidden || timestamp - previousFrame < 32) return;
      previousFrame = timestamp;
      const width = target.clientWidth;
      const height = target.clientHeight;
      context.save();
      context.globalCompositeOperation = 'destination-out';
      context.fillStyle = 'rgba(0,0,0,0.13)';
      context.fillRect(0, 0, width, height);
      context.restore();
      context.save();
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 1.05;
      context.strokeStyle = 'rgba(255,255,255,0.92)';

      particles.forEach((particle) => {
        if (
          particle.age >= particle.maxAge ||
          particle.x < 0 ||
          particle.x > width ||
          particle.y < 0 ||
          particle.y > height
        ) {
          resetParticle(particle);
        }
        const coordinate = map.getCoordinateFromPixel([particle.x, particle.y]);
        if (!coordinate) {
          resetParticle(particle);
          return;
        }
        const [longitude, latitude] = toLonLat(coordinate);
        const [windX, windY] = sampleVector(longitude, latitude);
        const speedScale = 0.035;
        const nextX = particle.x + windX * speedScale;
        const nextY = particle.y + windY * speedScale;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(nextX, nextY);
        context.stroke();
        particle.x = nextX;
        particle.y = nextY;
        particle.age += 1;
      });
      context.restore();
    };
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [
    mapReady,
    mapState.mapMode,
    mapState.weatherData,
    mapState.weatherForecastIndex,
    mapState.weatherLayerId,
  ]);

  React.useEffect(() => {
    if (
      !mapReady ||
      !baseLayerRef.current ||
      !baseOverlayLayerRef.current ||
      !styledBaseLayerRef.current ||
      !administrativeBaseLayerRef.current
    )
      return;
    const config = BASE_LAYERS.find((item) => item.id === mapState.activeBaseLayerId);
    const view = mapRef.current?.getView();
    const viewMaxZoom = config?.viewMaxZoom ?? 20;
    view?.setMaxZoom(viewMaxZoom);
    if ((view?.getZoom() ?? 0) > viewMaxZoom) {
      view?.cancelAnimations();
      view?.setZoom(viewMaxZoom);
    }
    const tileLayer = baseLayerRef.current;
    const overlayLayer = baseOverlayLayerRef.current;
    const styledLayer = styledBaseLayerRef.current;
    const administrativeLayer = administrativeBaseLayerRef.current;
    tileLayer.setVisible(false);
    overlayLayer.setVisible(false);
    styledLayer.setVisible(false);
    administrativeLayer.setVisible(false);
    graticuleRef.current?.setVisible(config?.type === 'blank');

    if (config?.type === 'administrative') {
      administrativeLayer.setVisible(true);
      loadVisibleAdministrativeCommunesRef.current();
      return;
    }

    if (config?.type === 'style' && config.url) {
      const styleUrl = config.url;
      let cancelled = false;
      const loadStyle = async () => {
        if (styledBaseLayerUrlRef.current !== styleUrl) {
          styledLayer.getLayers().clear();
          await applyMapboxStyle(styledLayer, styleUrl);
          styledBaseLayerUrlRef.current = styleUrl;
        }
        if (!cancelled) styledLayer.setVisible(true);
      };
      void loadStyle();
      return () => {
        cancelled = true;
      };
    }

    if (config?.type === 'xyz' && config.url) {
      tileLayer.setPreload(config.preload ?? 1);
      const sourceCache = tileSourceCacheRef.current;
      const sourceKey = `${config.id}:base`;
      let tileSource = sourceCache.get(sourceKey);
      if (!tileSource) {
        tileSource = new XYZ({
          url: config.url,
          attributions: config.attribution,
          maxZoom: config.maxZoom,
          crossOrigin: 'anonymous',
          wrapX: false,
          transition: 80,
        });
        sourceCache.set(sourceKey, tileSource);
      }
      tileLayer.setSource(tileSource);
      tileLayer.setVisible(true);
      if (config.overlayUrl) {
        const overlaySourceKey = `${config.id}:overlay`;
        let overlaySource = sourceCache.get(overlaySourceKey);
        if (!overlaySource) {
          overlaySource = new XYZ({
            url: config.overlayUrl,
            attributions: config.attribution,
            maxZoom: config.maxZoom,
            crossOrigin: 'anonymous',
            wrapX: false,
            transition: 80,
          });
          sourceCache.set(overlaySourceKey, overlaySource);
        }
        overlayLayer.setSource(overlaySource);
        overlayLayer.setVisible(true);
      } else {
        overlayLayer.setSource(null);
      }
    } else {
      tileLayer.setSource(null);
      overlayLayer.setSource(null);
    }
  }, [mapReady, mapState.activeBaseLayerId]);

  React.useEffect(() => {
    const flyToCoords = mapState.flyToCoords;
    const setFlyToCoords = mapState.setFlyToCoords;
    if (!mapReady || !flyToCoords || !mapRef.current) return;
    const [lat, lng, zoom = 16] = flyToCoords;
    mapRef.current.getView().animate({
      center: fromLonLat([lng, lat]),
      zoom,
      duration: 700,
    });
    setFlyToCoords(null);
  }, [mapReady, mapState.flyToCoords, mapState.setFlyToCoords]);

  React.useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const selection = selectInteractionRef.current;
    activeEditorInteractionsRef.current.forEach((interaction) =>
      map.removeInteraction(interaction),
    );
    activeEditorInteractionsRef.current = [];
    activeDrawInteractionRef.current = null;

    const source = editableSourceRef.current;
    const interactions: Array<Draw | Modify | Snap> = [];
    if (mapState.mapMode === 'weather') {
      selection?.setActive(false);
      return;
    }
    const isDrawMode =
      editorMode === 'point' ||
      editorMode === 'line' ||
      editorMode === 'polygon';
    selection?.setActive(!isDrawMode);

    if (editorMode === 'point' || editorMode === 'line' || editorMode === 'polygon') {
      const geometryKind: EditableGeometryKind = editorMode;
      const draw = new Draw({
        source,
        type:
          editorMode === 'point'
            ? 'Point'
            : editorMode === 'line'
              ? 'LineString'
              : 'Polygon',
        stopClick: true,
      });
      activeDrawInteractionRef.current = draw;
      draw.on('drawstart', () => {
        setIsDrawing(true);
      });
      draw.on('drawabort', () => {
        setIsDrawing(false);
        draw.setActive(false);
        activeDrawInteractionRef.current = null;
        setEditorMode('view');
      });
      draw.on('drawend', (event) => {
        activeDrawInteractionRef.current = null;
        setIsDrawing(false);
        const id = `object-${geometryKind}-${Date.now()}`;
        const objectNumber =
          source
            .getFeatures()
            .filter((feature) => feature.get('source') === 'user').length + 1;
        const defaultName = `${editableGeometryLabels[geometryKind]} mới ${objectNumber}`;
        event.feature.setId(id);
        event.feature.setProperties({
          objectType: geometryKind,
          name: defaultName,
          layerId: '',
          description: '',
          status: 'draft',
          source: 'user',
          dataAccuracy: 'approximate',
          creationMethod: 'draw',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        const selectedFeatures = selection?.getFeatures();
        selectedFeatures?.clear();
        selectedFeatures?.push(event.feature);
        onObjectEditorOpen?.();
        loadSelectedFeatureState(event.feature);
        setEditorMode('view');
        toast.info(
          `${editableGeometryLabels[geometryKind]} đã vẽ xong. Hãy nhập thông tin và bấm Lưu đối tượng.`,
        );
      });
      interactions.push(draw, new Snap({ source }));
    } else if (editorMode === 'modify') {
      const selectedFeatures = selection?.getFeatures();
      if (selectedFeatures && selectedFeatures.getLength() > 0) {
        const modify = new Modify({ features: selectedFeatures });
        modify.on('modifyend', (event) => {
          const now = new Date().toISOString();
          event.features.forEach((feature) => {
            feature.set('updatedAt', now);
            feature.changed();
          });
          const selectedFeature = selectedFeatures.item(0);
          if (selectedFeature) loadSelectedFeatureState(selectedFeature);
        });
        interactions.push(modify, new Snap({ source }));
      } else {
        setEditorMode('view');
      }
    }

    interactions.forEach((interaction) => map.addInteraction(interaction));
    activeEditorInteractionsRef.current = interactions;

    return () => {
      interactions.forEach((interaction) => map.removeInteraction(interaction));
      if (activeDrawInteractionRef.current === interactions[0]) {
        activeDrawInteractionRef.current = null;
      }
    };
  }, [
    editorMode,
    loadSelectedFeatureState,
    mapReady,
    mapState.mapMode,
    onObjectEditorOpen,
  ]);

  React.useEffect(() => {
    const map = mapRef.current;
    const overlay = drawCoordinateOverlayRef.current;
    const isDrawingMode =
      editorMode === 'point' ||
      editorMode === 'line' ||
      editorMode === 'polygon';

    if (!mapReady || !map || !overlay || !isDrawingMode) {
      if (overlay) overlay.style.opacity = '0';
      return;
    }

    let animationFrame: number | null = null;
    let pendingPosition:
      | { pixel: [number, number]; coordinate: [number, number] }
      | null = null;

    const hideOverlay = () => {
      pendingPosition = null;
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      overlay.style.opacity = '0';
    };

    const pointerMoveKey = map.on('pointermove', (event) => {
      const [longitude, latitude] = toLonLat(event.coordinate);
      pendingPosition = {
        pixel: [event.pixel[0], event.pixel[1]],
        coordinate: [longitude, latitude],
      };
      if (animationFrame !== null) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        if (!pendingPosition) return;

        const { pixel, coordinate } = pendingPosition;
        const [mapWidth, mapHeight] = map.getSize() ?? [0, 0];
        const tooltipWidth = 174;
        const tooltipHeight = 28;
        const left =
          pixel[0] + tooltipWidth + 16 > mapWidth
            ? Math.max(8, pixel[0] - tooltipWidth - 14)
            : pixel[0] + 14;
        const top =
          pixel[1] + tooltipHeight + 16 > mapHeight
            ? Math.max(8, pixel[1] - tooltipHeight - 14)
            : pixel[1] + 14;

        overlay.textContent = `KĐ ${coordinate[0].toFixed(6)} · VĐ ${coordinate[1].toFixed(6)}`;
        overlay.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        overlay.style.opacity = '1';
      });
    });

    const viewport = map.getViewport();
    viewport.addEventListener('pointerleave', hideOverlay);

    return () => {
      unByKey(pointerMoveKey);
      viewport.removeEventListener('pointerleave', hideOverlay);
      hideOverlay();
    };
  }, [editorMode, mapReady]);

  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;

      if (isPlanningComparisonModeRef.current) {
        event.preventDefault();
        stopPlanningComparison();
        toast.info('Đã đóng chế độ so sánh quy hoạch.');
        return;
      }

      if (
        editorMode === 'point' ||
        editorMode === 'line' ||
        editorMode === 'polygon'
      ) {
        event.preventDefault();
        activeDrawInteractionRef.current?.abortDrawing();
        setIsDrawing(false);
        setEditorMode('view');
        toast.info('Đã dừng thao tác vẽ.');
        return;
      }

      if (editorMode === 'modify') {
        event.preventDefault();
        setEditorMode('view');
        toast.info('Đã kết thúc chỉnh sửa đỉnh.');
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [editorMode, stopPlanningComparison]);

  function handleEditorModeChange(nextMode: EditorMode) {
    if (nextMode === 'modify' && !selectedFeatureId) {
      toast.error('Hãy chọn một đối tượng trước khi sửa đỉnh.');
      return;
    }

    if (
      nextMode === 'point' ||
      nextMode === 'line' ||
      nextMode === 'polygon'
    ) {
      closeSavedObjectPopup();
    }

    setCoordinateInputError(null);
    const currentlyDrawing =
      editorMode === 'point' ||
      editorMode === 'line' ||
      editorMode === 'polygon';
    if (currentlyDrawing) {
      activeDrawInteractionRef.current?.abortDrawing();
      setIsDrawing(false);
    }

    if (nextMode === editorMode && nextMode !== 'view') {
      setEditorMode('view');
      return;
    }
    setEditorMode(nextMode);
  }

  function createEditableFeatureFromCoordinates() {
    if (
      editorMode !== 'point' &&
      editorMode !== 'line' &&
      editorMode !== 'polygon'
    ) {
      return;
    }

    const geometryKind: EditableGeometryKind = editorMode;
    const result = parseCoordinateInput(
      coordinateInputs[geometryKind],
      geometryKind,
    );
    if (!result.ok) {
      setCoordinateInputError(result.error);
      return;
    }

    const projectedCoordinates = result.coordinates.map((coordinate) =>
      fromLonLat(coordinate),
    );
    const geometry =
      geometryKind === 'point'
        ? new Point(projectedCoordinates[0])
        : geometryKind === 'line'
          ? new LineString(projectedCoordinates)
          : new Polygon([
              (() => {
                const ring = projectedCoordinates.map((coordinate) => [
                  coordinate[0],
                  coordinate[1],
                ]);
                const first = ring[0];
                const last = ring[ring.length - 1];
                if (first[0] !== last[0] || first[1] !== last[1]) {
                  ring.push([first[0], first[1]]);
                }
                return ring;
              })(),
            ]);

    activeDrawInteractionRef.current?.abortDrawing();
    setIsDrawing(false);

    const source = editableSourceRef.current;
    const objectNumber =
      source
        .getFeatures()
        .filter((item) => item.get('source') === 'user').length + 1;
    const id = `object-${geometryKind}-${Date.now()}`;
    const now = new Date().toISOString();
    const feature = new Feature({
      geometry,
      objectType: geometryKind,
      name: `${editableGeometryLabels[geometryKind]} mới ${objectNumber}`,
      layerId: '',
      description: '',
      status: 'draft',
      source: 'user',
      dataAccuracy: 'approximate',
      creationMethod: 'coordinates',
      createdAt: now,
      updatedAt: now,
    });
    feature.setId(id);
    source.addFeature(feature);

    const selectedFeatures = selectInteractionRef.current?.getFeatures();
    selectedFeatures?.clear();
    selectedFeatures?.push(feature);
    onObjectEditorOpen?.();
    loadSelectedFeatureState(feature);
    setCoordinateInputs((current) => ({ ...current, [geometryKind]: '' }));
    setCoordinateInputError(null);
    setEditorMode('view');

    const view = mapRef.current?.getView();
    if (geometry instanceof Point) {
      view?.animate({
        center: geometry.getCoordinates(),
        zoom: Math.max(view.getZoom() ?? 14, 17),
        duration: 450,
      });
    } else {
      view?.fit(geometry.getExtent(), {
        padding: [100, 100, 100, 100],
        duration: 450,
        maxZoom: 17,
      });
    }

    toast.info(
      `${editableGeometryLabels[geometryKind]} đã được tạo từ tọa độ. Hãy nhập thông tin và bấm Lưu đối tượng.`,
    );
  }

  async function saveSelectedFeature() {
    const feature = selectInteractionRef.current?.getFeatures().item(0);
    if (!feature) {
      setFeatureFormError('Hãy chọn một đối tượng để lưu.');
      return;
    }

    const name = selectedFeatureName.trim();
    if (!name) {
      setFeatureFormError('Tên đối tượng không được để trống.');
      return;
    }
    if (!selectedFeatureLayerId || !MAP_LAYER_BY_ID.has(selectedFeatureLayerId)) {
      setFeatureFormError('Hãy chọn nhóm / loại dữ liệu cho đối tượng.');
      return;
    }

    const featureId = String(feature.getId() ?? selectedFeatureId ?? '');
    if (!featureId) {
      setFeatureFormError('Đối tượng chưa có mã định danh.');
      return;
    }

    const geometryKind = editableGeometryKind(feature);
    if (!geometryKind) {
      setFeatureFormError('Kiểu hình học của đối tượng không được hỗ trợ.');
      return;
    }

    const now = new Date().toISOString();
    const selectedLayer = MAP_LAYER_BY_ID.get(selectedFeatureLayerId);
    const serializedFeature = geoJsonFormat.writeFeatureObject(feature, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
      decimals: 7,
    });
    const properties: Record<string, unknown> = {
      ...(serializedFeature.properties ?? {}),
      name,
      layerId: selectedFeatureLayerId,
      category: selectedLayer?.name ?? '',
      description: selectedFeatureDescription.trim(),
      strokeColor: selectedFeatureStrokeColor,
      fillColor:
        selectedGeometryKind === 'polygon'
          ? selectedFeatureFillColor
          : undefined,
      objectType: geometryKind,
      status: 'saved' as const,
      source: feature.get('source') === 'seed' ? ('seed' as const) : ('user' as const),
      dataAccuracy:
        feature.get('dataAccuracy') === 'verified'
          ? ('verified' as const)
          : ('approximate' as const),
      createdAt: String(feature.get('createdAt') ?? now),
      updatedAt: now,
      savedAt: feature.get('savedAt') ?? now,
    };
    delete properties.previewLayerId;
    delete properties.previewStrokeColor;
    delete properties.previewFillColor;

    const demoFeature = {
      ...serializedFeature,
      id: featureId,
      properties,
    } as unknown as DemoGisFeature;

    setIsPersisting(true);
    setFeatureFormError(null);
    try {
      const persistedFeature = await persistDemoGisFeature(demoFeature);
      feature.setProperties(persistedFeature.properties);
      feature.unset('previewLayerId', true);
      feature.unset('previewStrokeColor', true);
      feature.unset('previewFillColor', true);
      feature.changed();
      editableSourceRef.current.changed();
      if (!mapState.activeLayerIds.includes(selectedFeatureLayerId)) {
        mapState.toggleLayer(selectedFeatureLayerId);
      }
      refreshEditableFeatureStats();
      refreshLayerFeatureCounts();
      selectInteractionRef.current?.getFeatures().clear();
      clearSelectedFeatureState();
      if (editorMode === 'modify') setEditorMode('view');
      onObjectEditorClose?.();
      toast.success(`Đã lưu ${name} vào dữ liệu demo dùng chung.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể lưu đối tượng.';
      setFeatureFormError(message);
      toast.error('Không thể lưu đối tượng vào dữ liệu demo.');
    } finally {
      setIsPersisting(false);
    }
  }

  function deselectEditableFeature() {
    const selection = selectInteractionRef.current?.getFeatures();
    const feature = selection?.item(0);
    feature?.unset('previewLayerId', true);
    feature?.unset('previewStrokeColor', true);
    feature?.unset('previewFillColor', true);
    feature?.changed();
    selection?.clear();
    clearSelectedFeatureState();
    if (editorMode === 'modify') setEditorMode('view');
    onObjectEditorClose?.();
  }

  function previewSelectedFeatureColor(
    property: 'previewStrokeColor' | 'previewFillColor',
    color: string,
  ) {
    const feature = selectInteractionRef.current?.getFeatures().item(0);
    if (!feature) return;
    feature.set(property, color);
    feature.changed();
  }

  function editSavedObjectFromPopup() {
    if (!savedObjectPopup) return;
    const feature = editableSourceRef.current.getFeatureById(
      savedObjectPopup.featureId,
    );
    if (!feature) {
      closeSavedObjectPopup();
      return;
    }

    closeSavedObjectPopup();
    const selection = selectInteractionRef.current?.getFeatures();
    selection?.clear();
    selection?.push(feature);
    loadSelectedFeatureState(feature);
    onObjectEditorOpen?.();
  }

  async function deleteSelectedFeature() {
    const selection = selectInteractionRef.current?.getFeatures();
    const feature = selection?.item(0);
    if (!feature) return;

    const featureId = String(feature.getId() ?? '');
    setIsPersisting(true);
    try {
      if (feature.get('status') === 'saved' && featureId) {
        await deletePersistedDemoGisFeature(featureId);
      }
      editableSourceRef.current.removeFeature(feature);
      refreshLayerFeatureCounts();
      selection?.clear();
      clearSelectedFeatureState();
      if (editorMode === 'modify') setEditorMode('view');
      onObjectEditorClose?.();
      toast.success('Đã xóa đối tượng khỏi dữ liệu demo dùng chung.');
    } catch (error) {
      console.error('Không thể xóa đối tượng GIS demo', error);
      toast.error('Không thể xóa đối tượng khỏi dữ liệu demo.');
    } finally {
      setIsPersisting(false);
    }
  }

  function clearDraftFeatures() {
    activeDrawInteractionRef.current?.abortDrawing();
    setEditorMode('view');
    setIsDrawing(false);
    const source = editableSourceRef.current;
    const draftFeatures = source
      .getFeatures()
      .filter((feature) => feature.get('status') !== 'saved');
    if (draftFeatures.length === 0) return;

    const selectedFeature =
      selectInteractionRef.current?.getFeatures().item(0);
    const isSelectedFeatureDraft =
      selectedFeature !== undefined &&
      draftFeatures.includes(selectedFeature);
    draftFeatures.forEach((feature) => source.removeFeature(feature));

    if (isSelectedFeatureDraft) {
      selectInteractionRef.current?.getFeatures().clear();
      clearSelectedFeatureState();
      closeSavedObjectPopup();
      onObjectEditorClose?.();
    }
    refreshEditableFeatureStats();
    toast.success(`Đã xóa ${draftFeatures.length} bản nháp POC.`);
  }

  function exportEditableGeoJson() {
    const data = geoJsonFormat.writeFeaturesObject(
      editableSourceRef.current
        .getFeatures()
        .filter((feature) => feature.get('source') === 'user'),
      {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
        decimals: 7,
      },
    );
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/geo+json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `lao-bao-draft-${new Date().toISOString().slice(0, 10)}.geojson`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const editorButtons: Array<{
    mode: EditorMode;
    label: string;
    icon: React.ElementType;
  }> = [
    { mode: 'point', label: 'Vẽ điểm', icon: MapPinPlus },
    { mode: 'line', label: 'Vẽ đường', icon: Route },
    { mode: 'polygon', label: 'Vẽ vùng', icon: Pentagon },
    { mode: 'modify', label: 'Sửa đỉnh', icon: Pencil },
  ];
  const activeDrawGeometryKind: EditableGeometryKind | null =
    editorMode === 'point' ||
    editorMode === 'line' ||
    editorMode === 'polygon'
      ? editorMode
      : null;
  const isDrawMode = activeDrawGeometryKind !== null;
  const draftFeatureCount = editableFeatureCount - savedFeatureCount;
  const editableCatalogGroups = GIS_LAYER_GROUPS.map((group) => ({
    ...group,
    layers: group.layers.flatMap((layerId) => {
      const layer = MAP_LAYER_BY_ID.get(layerId);
      if (!layer) return [];
      const canViewLayer =
        layer.securityLevel !== 'confidential' ||
        layer.allowedRoles.includes(mapState.currentRole ?? '');
      return canViewLayer ? [layer] : [];
    }),
  })).filter((group) => group.layers.length > 0);
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
      <div ref={targetRef} className="h-full min-h-[520px] w-full" aria-label="Bản đồ GIS OpenLayers" />
      <canvas
        ref={weatherParticleCanvasRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 z-[5]',
          (mapState.mapMode !== 'weather' || mapState.weatherLayerId !== 'wind') &&
            'hidden',
        )}
      />
      <div
        ref={drawCoordinateOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-30 whitespace-nowrap rounded-md border border-border/80 bg-card/95 px-2 py-1 font-mono text-[9px] font-semibold text-foreground opacity-0 shadow-md backdrop-blur-sm transition-opacity will-change-transform"
      />
      <div
        ref={weatherPopupElementRef}
        className={cn(
          'relative z-[1100] w-64 rounded-xl border border-border/80 bg-card/98 p-3 text-foreground shadow-xl backdrop-blur-md',
          !weatherPopup && 'hidden',
        )}
      >
        {weatherPopup && (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold">Dự báo tại điểm chọn</p>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  {weatherPopup.time
                    ? new Date(weatherPopup.time).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })
                    : 'Chưa có thời gian dự báo'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeWeatherPopup}
                className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Đóng thông tin thời tiết"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
              <div className="rounded-md bg-red-500/10 px-1 py-2">
                <p className="text-[8px] text-muted-foreground">Nhiệt độ</p>
                <p className="mt-0.5 text-[11px] font-bold text-red-600">
                  {weatherPopup.temperature?.toLocaleString('vi-VN', {
                    maximumFractionDigits: 1,
                  }) ?? '—'}°C
                </p>
              </div>
              <div className="rounded-md bg-blue-500/10 px-1 py-2">
                <p className="text-[8px] text-muted-foreground">Mưa</p>
                <p className="mt-0.5 text-[11px] font-bold text-blue-600">
                  {weatherPopup.precipitation?.toLocaleString('vi-VN', {
                    maximumFractionDigits: 1,
                  }) ?? '—'} mm
                </p>
              </div>
              <div className="rounded-md bg-emerald-500/10 px-1 py-2">
                <p className="text-[8px] text-muted-foreground">Gió</p>
                <p className="mt-0.5 text-[11px] font-bold text-emerald-600">
                  {weatherPopup.windSpeed?.toLocaleString('vi-VN', {
                    maximumFractionDigits: 0,
                  }) ?? '—'} km/h
                </p>
              </div>
            </div>
            <p className="mt-2 text-[8px] text-muted-foreground">
              {weatherPopup.latitude.toFixed(4)}, {weatherPopup.longitude.toFixed(4)}
              {weatherPopup.windDirection !== null
                ? ` · hướng gió ${Math.round(weatherPopup.windDirection)}°`
                : ''}
            </p>
            <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-border/80 bg-card" />
          </>
        )}
      </div>
      <div
        ref={objectPopupElementRef}
        className={cn(
          'relative z-[1100] flex min-h-44 w-72 flex-col rounded-xl border border-border/80 bg-card/98 p-3.5 text-foreground shadow-xl backdrop-blur-md',
          !savedObjectPopup && 'hidden',
        )}
      >
        {savedObjectPopup && (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">
                  {savedObjectPopup.name}
                </p>
                <p className="mt-1 truncate text-[9px] font-medium text-primary">
                  {savedObjectPopup.category}
                </p>
              </div>
              <button
                type="button"
                onClick={closeSavedObjectPopup}
                className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Đóng thông tin đối tượng"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <p className="mt-2.5 max-h-24 flex-1 overflow-y-auto whitespace-pre-wrap break-words pr-1 text-[11px] leading-5 text-muted-foreground">
              {savedObjectPopup.description || 'Chưa có mô tả cho đối tượng này.'}
            </p>

            {Object.keys(savedObjectPopup.details).length > 0 && (
              <dl className="mt-2 max-h-28 space-y-1 overflow-y-auto border-t border-border/50 pt-2 pr-3 text-[10px] leading-4 [scrollbar-gutter:stable]">
                {Object.entries(savedObjectPopup.details).map(
                  ([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-2"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="break-words text-right font-medium">
                        {value === null || value === ''
                          ? '—'
                          : typeof value === 'boolean'
                            ? value
                              ? 'Có'
                              : 'Không'
                            : String(value)}
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            )}

            <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2.5">
              <span className="rounded bg-muted px-1.5 py-0.5 text-[9px]">
                {editableGeometryLabels[savedObjectPopup.geometryKind]}
              </span>
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={editSavedObjectFromPopup}
                className="h-7 gap-1 px-2 text-[10px] shadow-none"
              >
                <Pencil className="size-3" />
                Chỉnh sửa
              </Button>
            </div>
            <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-border/80 bg-card" />
          </>
        )}
      </div>

      <div
        className={cn(
          'absolute bottom-2 left-2.5 z-10 max-h-[calc(100%-6rem)] w-[min(26rem,calc(100%-1.25rem))] overflow-y-auto rounded-xl border border-border/70 bg-card/95 p-2.5 shadow-lg backdrop-blur-sm',
          (isPlanningComparisonMode || mapState.mapMode === 'weather') &&
            'hidden',
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-foreground">Biên tập đối tượng (POC)</p>
            <p className="text-[9px] text-muted-foreground">
              {savedFeatureCount} đã lưu · {draftFeatureCount} nháp · dữ liệu
              demo dùng chung
            </p>
          </div>
          {selectedFeatureId && (
            <span className="max-w-32 truncate rounded bg-orange-500/10 px-1.5 py-0.5 font-mono text-[9px] text-orange-700 dark:text-orange-300">
              {selectedFeatureId}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {editorButtons.map(({ mode, label, icon: Icon }) => (
            <Button
              key={mode}
              type="button"
              size="xs"
              variant={editorMode === mode ? 'default' : 'outline'}
              onClick={() => handleEditorModeChange(mode)}
              disabled={mode === 'modify' && !selectedFeatureId}
              className={cn('h-7 gap-1 px-2 text-[10px] shadow-none', editorMode === mode && 'border-primary')}
              title={label}
            >
              <Icon className="size-3" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
          {isDrawMode && (
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={() => handleEditorModeChange('view')}
              className="h-7 gap-1 px-2 text-[10px] shadow-none"
              title="Dừng vẽ (Esc)"
            >
              <X className="size-3" />
              Dừng
            </Button>
          )}
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={deleteSelectedFeature}
            disabled={!selectedFeatureId || isPersisting}
            className="h-7 gap-1 px-2 text-[10px] text-destructive shadow-none"
            title="Xóa đối tượng đang chọn"
          >
            <Trash2 className="size-3" />
          </Button>
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={clearDraftFeatures}
            disabled={draftFeatureCount === 0 || isPersisting}
            className="h-7 gap-1 px-2 text-[10px] shadow-none"
            title="Xóa toàn bộ bản nháp"
          >
            <Eraser className="size-3" />
          </Button>
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={exportEditableGeoJson}
            disabled={editableFeatureCount === 0 || isPersisting}
            className="h-7 gap-1 px-2 text-[10px] shadow-none"
            title="Xuất GeoJSON"
          >
            <Download className="size-3" />
          </Button>
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={startPlanningComparison}
            className="h-7 gap-1 px-2 text-[10px] shadow-none"
            title="So sánh hai đối tượng quy hoạch"
          >
            <GitCompareArrows className="size-3" />
            <span className="hidden sm:inline">So sánh QH</span>
          </Button>
        </div>

        {activeDrawGeometryKind && (
          <div className="mt-2 rounded-md border border-primary/25 bg-primary/5 px-2 py-1.5 text-[9px] leading-4 text-foreground">
            {activeDrawGeometryKind === 'point'
              ? 'Nhấp một lần để đặt điểm.'
              : isDrawing
                ? 'Tiếp tục thêm đỉnh, nhấp đúp để hoàn thành.'
                : 'Nhấp để bắt đầu, nhấp đúp để hoàn thành.'}{' '}
            Nhấn{' '}
            <kbd className="rounded border bg-background px-1 font-mono">
              Esc
            </kbd>{' '}
            để hủy và dừng vẽ.

            <div className="mt-1.5 border-t border-primary/15 pt-1.5">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="font-semibold">
                  Hoặc tạo{' '}
                  {editableGeometryLabels[
                    activeDrawGeometryKind
                  ].toLocaleLowerCase('vi')}{' '}
                  bằng tọa độ
                </p>
                <span className="text-muted-foreground">Kinh độ, vĩ độ</span>
              </div>
              <Textarea
                value={coordinateInputs[activeDrawGeometryKind]}
                onChange={(event) => {
                  const value = event.target.value;
                  setCoordinateInputs((current) => ({
                    ...current,
                    [activeDrawGeometryKind]: value,
                  }));
                  setCoordinateInputError(null);
                }}
                aria-label={`Tọa độ ${editableGeometryLabels[activeDrawGeometryKind]}`}
                placeholder={coordinateInputPlaceholders[activeDrawGeometryKind]}
                rows={activeDrawGeometryKind === 'point' ? 1 : 3}
                className="min-h-10 resize-y bg-background px-2 py-1.5 font-mono text-[10px] leading-4 shadow-none md:text-[10px]"
              />
              {coordinateInputError && (
                <p className="mt-1 font-medium text-destructive">
                  {coordinateInputError}
                </p>
              )}
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-muted-foreground">
                  {activeDrawGeometryKind === 'point'
                    ? 'Nhập đúng một dòng.'
                    : 'Mỗi dòng là một đỉnh.'}
                </p>
                <Button
                  type="button"
                  size="xs"
                  onClick={createEditableFeatureFromCoordinates}
                  className="h-7 gap-1 px-2 text-[10px] shadow-none"
                >
                  <Plus className="size-3" />
                  Tạo {editableGeometryLabels[activeDrawGeometryKind]}
                </Button>
              </div>
            </div>
          </div>
        )}

        {selectedFeatureId && selectedGeometryKind && (
          <div className="mt-2 rounded-lg border border-border bg-background/70 p-2">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold text-foreground">
                Thông tin {editableGeometryLabels[selectedGeometryKind].toLocaleLowerCase('vi')}
              </p>
              <div className="flex items-center gap-1">
                <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                  {editableGeometryLabels[selectedGeometryKind]}
                </span>
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[9px] font-medium',
                    selectedFeatureStatus === 'saved'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
                  )}
                >
                  {selectedFeatureStatus === 'saved' ? 'Đã lưu' : 'Nháp'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <Input
                value={selectedFeatureName}
                onChange={(event) => setSelectedFeatureName(event.target.value)}
                aria-label="Tên đối tượng"
                placeholder="Tên đối tượng *"
                className="h-7 px-2 font-sans text-[10px] font-normal shadow-none md:text-[10px]"
              />
              <UiSelect
                value={selectedFeatureLayerId || undefined}
                onValueChange={(value) => {
                  const layerStyle = MAP_LAYER_BY_ID.get(value)?.styleConfig;
                  const strokeColor = layerStyle?.color ?? '#0f766e';
                  const fillColor =
                    layerStyle?.fillColor ?? layerStyle?.color ?? '#14b8a6';
                  setSelectedFeatureLayerId(value);
                  setSelectedFeatureStrokeColor(strokeColor);
                  setSelectedFeatureFillColor(fillColor);
                  setFeatureFormError(null);
                  const feature =
                    selectInteractionRef.current?.getFeatures().item(0);
                  if (feature) {
                    feature.set('previewLayerId', value);
                    feature.set('previewStrokeColor', strokeColor);
                    feature.set('previewFillColor', fillColor);
                    feature.changed();
                  }
                }}
              >
                <SelectTrigger
                  size="sm"
                  aria-label="Nhóm và loại dữ liệu"
                  className="h-7 bg-background px-2 text-[10px] shadow-none"
                >
                  <SelectValue placeholder="Chọn nhóm / loại *" />
                </SelectTrigger>
                <SelectContent className="z-[1100] max-h-80 text-xs">
                  {editableCatalogGroups.map((group) => (
                    <SelectGroup key={group.id}>
                      <SelectLabel className="text-[10px] font-bold uppercase text-primary">
                        {group.label}
                      </SelectLabel>
                      {group.layers.map((layer) => (
                        <SelectItem
                          key={layer.id}
                          value={layer.id}
                          className="cursor-pointer text-[11px]"
                        >
                          {layer.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </UiSelect>
            </div>
            <Textarea
              value={selectedFeatureDescription}
              onChange={(event) =>
                setSelectedFeatureDescription(event.target.value)
              }
              aria-label="Mô tả đối tượng"
              placeholder="Mô tả, ghi chú..."
              rows={2}
              className="mt-1.5 min-h-14 resize-none px-2 py-1.5 font-sans text-[10px] leading-4 font-normal shadow-none md:text-[10px]"
            />
            <div
              className={cn(
                'mt-1.5 grid gap-1.5',
                selectedGeometryKind === 'polygon'
                  ? 'grid-cols-2'
                  : 'grid-cols-1',
              )}
            >
              <label className="space-y-1 text-[9px] font-medium text-muted-foreground">
                <span>
                  {selectedGeometryKind === 'polygon'
                    ? 'Màu viền'
                    : selectedGeometryKind === 'line'
                      ? 'Màu đường'
                      : 'Màu ký hiệu'}
                </span>
                <span className="flex h-7 items-center gap-2 rounded-md border border-input bg-background px-1.5">
                  <Input
                    type="color"
                    value={selectedFeatureStrokeColor}
                    onChange={(event) => {
                      const color = event.target.value;
                      setSelectedFeatureStrokeColor(color);
                      previewSelectedFeatureColor(
                        'previewStrokeColor',
                        color,
                      );
                    }}
                    aria-label={
                      selectedGeometryKind === 'polygon'
                        ? 'Màu viền vùng'
                        : 'Màu đối tượng'
                    }
                    className="h-5 w-7 cursor-pointer border-0 bg-transparent p-0 shadow-none"
                  />
                  <span className="font-mono uppercase">
                    {selectedFeatureStrokeColor}
                  </span>
                </span>
              </label>

              {selectedGeometryKind === 'polygon' && (
                <label className="space-y-1 text-[9px] font-medium text-muted-foreground">
                  <span>Màu bên trong</span>
                  <span className="flex h-7 items-center gap-2 rounded-md border border-input bg-background px-1.5">
                    <Input
                      type="color"
                      value={selectedFeatureFillColor}
                      onChange={(event) => {
                        const color = event.target.value;
                        setSelectedFeatureFillColor(color);
                        previewSelectedFeatureColor(
                          'previewFillColor',
                          color,
                        );
                      }}
                      aria-label="Màu bên trong vùng"
                      className="h-5 w-7 cursor-pointer border-0 bg-transparent p-0 shadow-none"
                    />
                    <span className="font-mono uppercase">
                      {selectedFeatureFillColor}
                    </span>
                  </span>
                </label>
              )}
            </div>
            {featureFormError && (
              <p className="mt-1 text-[9px] font-medium text-destructive">
                {featureFormError}
              </p>
            )}
            <div className="mt-1.5 flex justify-end gap-1">
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={deselectEditableFeature}
                className="h-7 gap-1 px-2 text-[10px] shadow-none"
              >
                <X className="size-3" />
                Bỏ chọn
              </Button>
              <Button
                type="button"
                size="xs"
                onClick={saveSelectedFeature}
                disabled={isPersisting}
                className="h-7 gap-1 px-2 text-[10px] shadow-none"
              >
                <Save className="size-3" />
                {isPersisting ? 'Đang lưu...' : 'Lưu đối tượng'}
              </Button>
            </div>
          </div>
        )}

      </div>

      {mapState.mapMode === 'gis' && isPlanningComparisonMode && (
        <div className="absolute bottom-2 left-2.5 z-20 max-h-[calc(100%-6rem)] w-[min(32rem,calc(100%-1.25rem))] overflow-y-auto rounded-xl border border-border/70 bg-card/97 p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                <GitCompareArrows className="size-4 text-primary" />
                So sánh quy hoạch
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                Phân tích hình học demo. Chỉ hỗ trợ hai object cùng lớp và cùng
                kiểu.
              </p>
            </div>
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              onClick={stopPlanningComparison}
              aria-label="Đóng so sánh quy hoạch"
              title="Đóng (Esc)"
            >
              <X className="size-3.5" />
            </Button>
          </div>

          <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-2 text-[11px] leading-5">
            {planningComparisonFeatureIds.length === 0
              ? 'Chọn vùng quy hoạch thứ nhất trên bản đồ.'
              : planningComparisonFeatureIds.length === 1
                ? 'Đã chọn vùng thứ nhất. Chọn tiếp vùng thứ hai cùng lớp.'
                : 'Phân tích hoàn tất. Có thể xem kết quả hoặc chọn lại.'}
          </div>

          {planningComparisonError && (
            <div
              role="alert"
              className="mt-2 rounded-md border border-destructive/40 bg-destructive/10 px-2.5 py-2 text-[10px] font-medium leading-5 text-destructive"
            >
              {planningComparisonError}
            </div>
          )}

          <div className="mt-2 grid grid-cols-2 gap-2">
            {[0, 1].map((index) => {
              const selection = planningComparisonSelections[index];
              const isFirst = index === 0;
              return (
                <div
                  key={isFirst ? 'first' : 'second'}
                  className={cn(
                    'min-h-16 rounded-lg border p-2',
                    isFirst
                      ? 'border-blue-500/40 bg-blue-500/8'
                      : 'border-orange-500/40 bg-orange-500/8',
                  )}
                >
                  <p
                    className={cn(
                      'text-[10px] font-bold uppercase',
                      isFirst ? 'text-blue-600' : 'text-orange-600',
                    )}
                  >
                    {isFirst ? 'Đối tượng A' : 'Đối tượng B'}
                  </p>
                  {selection ? (
                    <>
                      <p className="mt-1 truncate text-[11px] font-semibold">
                        {selection.name}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        {selection.layerName} · {selection.geometryType}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Chưa chọn
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {planningComparisonResult && (
            <div className="mt-2 rounded-lg border border-border bg-background/75 p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold">
                  Kết quả phân tích không gian
                </p>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                  {planningComparisonResult.first.layerName}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-[10px]">
                <div>
                  <p className="text-muted-foreground">Diện tích A</p>
                  <p className="font-semibold text-blue-600">
                    {formatComparisonArea(
                      planningComparisonResult.first.areaSquareMeters,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Diện tích B</p>
                  <p className="font-semibold text-orange-600">
                    {formatComparisonArea(
                      planningComparisonResult.second.areaSquareMeters,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phần giao nhau</p>
                  <p className="font-semibold text-red-600">
                    {formatComparisonArea(
                      planningComparisonResult.overlapSquareMeters,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chênh lệch diện tích</p>
                  <p className="font-semibold">
                    {formatComparisonArea(
                      Math.abs(
                        planningComparisonResult.first.areaSquareMeters -
                          planningComparisonResult.second.areaSquareMeters,
                      ),
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chỉ thuộc A</p>
                  <p className="font-semibold">
                    {formatComparisonArea(
                      planningComparisonResult.onlyFirstSquareMeters,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chỉ thuộc B</p>
                  <p className="font-semibold">
                    {formatComparisonArea(
                      planningComparisonResult.onlySecondSquareMeters,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 rounded-md bg-muted/50 px-2 py-1.5 text-[10px]">
                <span>
                  Giao/A:{' '}
                  <strong>
                    {planningComparisonResult.overlapFirstPercent.toLocaleString(
                      'vi-VN',
                      { maximumFractionDigits: 1 },
                    )}
                    %
                  </strong>
                </span>
                <span>
                  Giao/B:{' '}
                  <strong>
                    {planningComparisonResult.overlapSecondPercent.toLocaleString(
                      'vi-VN',
                      { maximumFractionDigits: 1 },
                    )}
                    %
                  </strong>
                </span>
              </div>

              <p className="mt-2 border-l-2 border-primary pl-2 text-[10px] leading-5 text-foreground">
                {planningComparisonResult.summary}
              </p>

              <div className="mt-2.5 border-t border-border/60 pt-2.5">
                <p className="text-[11px] font-bold text-foreground">
                  Phân tích demo
                </p>
                <p className="mt-1.5 rounded-md bg-muted/50 px-2 py-1.5 text-[10px] font-medium leading-5">
                  {planningComparisonResult.analysis.scaleComparison}
                </p>

                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md border border-blue-500/25 bg-blue-500/5 p-2">
                    <p className="text-[10px] font-bold text-blue-600">
                      Lợi thế không gian của A
                    </p>
                    <ul className="mt-1 space-y-1 text-[10px] leading-5 text-foreground">
                      {planningComparisonResult.analysis.firstAdvantages.map(
                        (advantage) => (
                          <li key={advantage} className="flex gap-1.5">
                            <span className="text-blue-600">•</span>
                            <span>{advantage}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div className="rounded-md border border-orange-500/25 bg-orange-500/5 p-2">
                    <p className="text-[10px] font-bold text-orange-600">
                      Lợi thế không gian của B
                    </p>
                    <ul className="mt-1 space-y-1 text-[10px] leading-5 text-foreground">
                      {planningComparisonResult.analysis.secondAdvantages.map(
                        (advantage) => (
                          <li key={advantage} className="flex gap-1.5">
                            <span className="text-orange-600">•</span>
                            <span>{advantage}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-2 space-y-1.5 text-[10px] leading-5">
                  <p>
                    <strong>Nhận định:</strong>{' '}
                    {planningComparisonResult.analysis.assessment}
                  </p>
                  <p>
                    <strong>Gợi ý rà soát:</strong>{' '}
                    {planningComparisonResult.analysis.recommendation}
                  </p>
                </div>
                <p className="mt-2 text-[9px] italic leading-4 text-muted-foreground">
                  Nội dung được sinh bằng quy tắc hình học để minh họa giao
                  diện, không phải kết luận chuyên môn hoặc pháp lý.
                </p>
              </div>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <i className="size-2 rounded-sm bg-blue-600" /> A
              </span>
              <span className="flex items-center gap-1">
                <i className="size-2 rounded-sm bg-orange-500" /> B
              </span>
              <span className="flex items-center gap-1">
                <i className="size-2 rounded-sm bg-red-600" /> Phần giao
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={() => {
                  resetPlanningComparisonSelection();
                  toast.info('Đã xóa lựa chọn. Chọn lại đối tượng thứ nhất.');
                }}
                disabled={planningComparisonFeatureIds.length === 0}
                className="h-7 px-2 text-[10px]"
              >
                Chọn lại
              </Button>
              <Button
                type="button"
                size="xs"
                onClick={stopPlanningComparison}
                className="h-7 px-2 text-[10px]"
              >
                Hoàn tất
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ol-zoom {
          top: auto;
          right: 0.75rem;
          bottom: 2.5rem;
          left: auto;
        }
        .ol-attribution {
          right: 0;
          bottom: 1.75rem;
          max-width: min(70vw, 36rem);
          font-size: 9px;
        }
        .ol-control button {
          background: color-mix(in srgb, var(--card) 92%, transparent);
          color: var(--foreground);
          cursor: pointer;
        }
        .ol-control button:hover,
        .ol-control button:focus {
          background: var(--primary);
          color: var(--primary-foreground);
        }
        .ol-scale-line {
          bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
