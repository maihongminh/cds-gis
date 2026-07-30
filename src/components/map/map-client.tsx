// OpenLayers GIS client for the Lao Bao map workspace.
'use client';

import * as React from 'react';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import LineString from 'ol/geom/LineString';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Graticule from 'ol/layer/Graticule';
import LayerGroup from 'ol/layer/Group';
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
  deleteUserDemoGisFeatures,
  fetchDemoGisFeatures,
  saveDemoGisFeature as persistDemoGisFeature,
} from '@/lib/demo-gis-api';
import { BASE_LAYERS, LAOBAO_CENTER } from '@/lib/map-config';
import {
  buildIconPinMarkerSvg,
  type MapMarkerIconName,
} from '@/lib/map-style-config';
import { cn } from '@/lib/utils';
import type { DemoGisFeature } from '@/types/demo-gis';

export interface MapState {
  activeLayerIds: string[];
  toggleLayer: (id: string) => void;
  enableAllInGroup: (groupId: string) => void;
  disableAllInGroup: (groupId: string) => void;
  resetToDefaults: () => void;
  selectedVillageCode: string | null;
  setSelectedVillageCode: (code: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  flyToCoords: [number, number, number?] | null;
  setFlyToCoords: (c: [number, number, number?] | null) => void;
  activeBaseLayerId: string;
  setActiveBaseLayerId: (id: string) => void;
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

const geoJsonFormat = new GeoJSON();

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

function planningComparisonStyle(feature: FeatureLike) {
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
    return planningComparisonStyle(feature);
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
}

export default function MapClient({
  mapState,
  onObjectEditorOpen,
  onObjectEditorClose,
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
  const editableLayerRef = React.useRef<VectorLayer | null>(null);
  const selectInteractionRef = React.useRef<Select | null>(null);
  const activeDrawInteractionRef = React.useRef<Draw | null>(null);
  const drawCoordinateOverlayRef = React.useRef<HTMLDivElement>(null);
  const objectPopupElementRef = React.useRef<HTMLDivElement>(null);
  const objectPopupOverlayRef = React.useRef<Overlay | null>(null);
  const activeEditorInteractionsRef = React.useRef<Array<Draw | Modify | Snap>>([]);
  const eventKeysRef = React.useRef<EventsKey[]>([]);
  const hasFitDemoDataRef = React.useRef(false);

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

  const closeSavedObjectPopup = React.useCallback(() => {
    objectPopupOverlayRef.current?.setPosition(undefined);
    setSavedObjectPopup(null);
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

    const editableLayer = new VectorLayer({
      source: editableSourceRef.current,
      style: (feature, resolution) => {
        const layerId = String(feature.get('layerId') ?? '');
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
        ...registeredLayers.map(([, layer]) => layer),
        sovereigntyLayer,
        editableLayer,
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
    eventKeysRef.current.push(administrativeMoveKey, administrativeProvinceLoadKey);

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
      const savedEditableFeature = map
        .getFeaturesAtPixel(event.pixel, {
          hitTolerance: 8,
          layerFilter: (layer) => layer === editableLayer,
        })
        .filter(
          (feature): feature is Feature =>
            feature instanceof Feature &&
            feature.get('status') === 'saved',
        )
        .sort(compareSavedFeatureHitPriority)[0];
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
      selectInteractionRef.current = null;
      registry.clear();
    };
  }, [
    clearSelectedFeatureState,
    closeSavedObjectPopup,
    loadSelectedFeatureState,
    onObjectEditorClose,
    onObjectEditorOpen,
    openSavedObjectPopup,
    refreshEditableFeatureStats,
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
  }, [mapReady, refreshEditableFeatureStats]);

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
  }, [editorMode]);

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

  async function clearEditableFeatures() {
    activeDrawInteractionRef.current?.abortDrawing();
    setEditorMode('view');
    setIsDrawing(false);
    setIsPersisting(true);
    try {
      const { deletedCount } = await deleteUserDemoGisFeatures();
      editableSourceRef.current
        .getFeatures()
        .filter((feature) => feature.get('source') === 'user')
        .forEach((feature) =>
          editableSourceRef.current.removeFeature(feature),
        );
      selectInteractionRef.current?.getFeatures().clear();
      clearSelectedFeatureState();
      closeSavedObjectPopup();
      onObjectEditorClose?.();
      toast.success(
        deletedCount > 0
          ? `Đã xóa ${deletedCount} đối tượng POC dùng chung.`
          : 'Đã xóa các bản nháp POC trên bản đồ.',
      );
    } catch (error) {
      console.error('Không thể xóa dữ liệu POC dùng chung', error);
      toast.error('Không thể xóa toàn bộ đối tượng POC.');
    } finally {
      setIsPersisting(false);
    }
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
      <div
        ref={drawCoordinateOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-30 whitespace-nowrap rounded-md border border-border/80 bg-card/95 px-2 py-1 font-mono text-[9px] font-semibold text-foreground opacity-0 shadow-md backdrop-blur-sm transition-opacity will-change-transform"
      />
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

      <div className="absolute bottom-2 left-2.5 z-10 max-h-[calc(100%-6rem)] w-[min(26rem,calc(100%-1.25rem))] overflow-y-auto rounded-xl border border-border/70 bg-card/95 p-2.5 shadow-lg backdrop-blur-sm">
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
            onClick={clearEditableFeatures}
            disabled={editableFeatureCount === 0 || isPersisting}
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
