// src/lib/map-style-config.ts
// Centralized GIS color and style configuration for Lao Bao digital map.
// All literal colors for map layers must come from this file — never scattered in components.

import type { RiskLevel, TourismPoiType, PublicFacilityType } from '@/types/map';

// ─── Commune / Village Boundary Styles ───────────────────────────────────────

export const COMMUNE_BOUNDARY_STYLE = {
  color: '#1d4ed8',       // Strong blue border for the outer commune boundary
  fillColor: '#3b82f6',
  weight: 3.5,
  fillOpacity: 0.04,
  opacity: 1,
} as const;

export const VILLAGE_BOUNDARY_DEFAULT_STYLE = {
  color: '#64748b',       // Muted slate for village internal borders
  weight: 1.5,
  fillOpacity: 0.08,
  opacity: 0.8,
  dashArray: undefined as string | undefined,
} as const;

export const VILLAGE_BOUNDARY_HOVER_STYLE = {
  weight: 2.5,
  fillOpacity: 0.22,
  opacity: 1,
} as const;

export const VILLAGE_BOUNDARY_SELECTED_STYLE = {
  color: '#2563eb',
  weight: 2.5,
  fillOpacity: 0.25,
  opacity: 1,
} as const;

/** 12 distinct fill colors for village polygons — one per village in VILLAGES order */
export const VILLAGE_FILL_COLORS: string[] = [
  '#dbeafe', // trieu-phuoc    — light blue
  '#dcfce7', // tan-kim        — light green
  '#fef9c3', // tan-phuoc      — light yellow
  '#fce7f3', // ka-tang        — light pink
  '#ede9fe', // tan-thanh      — light violet
  '#ffedd5', // trieu-thanh    — light orange
  '#e0f2fe', // tan-long       — light sky
  '#d1fae5', // trieu-long     — light emerald
  '#fef3c7', // lang-vay       — light amber
  '#f3e8ff', // vinh-dong      — light purple
  '#ecfdf5', // trung-chin     — light mint
  '#fff7ed', // tay-chin       — light peach
];

// ─── Disaster Risk Level Styles ───────────────────────────────────────────────

export const RISK_LEVEL_STYLES: Record<
  RiskLevel,
  { color: string; fillColor: string; fillOpacity: number; weight: number }
> = {
  low: {
    color: '#ca8a04',
    fillColor: '#fef08a',
    fillOpacity: 0.25,
    weight: 1.5,
  },
  medium: {
    color: '#ea580c',
    fillColor: '#fed7aa',
    fillOpacity: 0.3,
    weight: 2,
  },
  high: {
    color: '#dc2626',
    fillColor: '#fca5a5',
    fillOpacity: 0.35,
    weight: 2.5,
  },
  critical: {
    color: '#7f1d1d',
    fillColor: '#ef4444',
    fillOpacity: 0.45,
    weight: 3,
  },
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  critical: 'Rất cao / Khẩn cấp',
};

export const RISK_LEVEL_BADGE_CLASSES: Record<RiskLevel, string> = {
  low: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  critical: 'bg-red-900 text-red-100 dark:bg-red-950 dark:text-red-200',
};

// ─── Tourism POI Styles ───────────────────────────────────────────────────────

export const TOURISM_POI_COLORS: Record<TourismPoiType, string> = {
  tourist_attraction: '#8b5cf6',    // violet
  historical_site: '#d97706',       // amber
  scenic_spot: '#10b981',           // emerald
  check_in: '#ec4899',              // pink
  local_product_point: '#f59e0b',   // yellow
};

export const TOURISM_POI_LABELS: Record<TourismPoiType, string> = {
  tourist_attraction: 'Điểm du lịch',
  historical_site: 'Di tích lịch sử',
  scenic_spot: 'Danh lam thắng cảnh',
  check_in: 'Điểm check-in',
  local_product_point: 'Sản phẩm địa phương',
};

// ─── Public Facility Styles ───────────────────────────────────────────────────

export const FACILITY_COLORS: Record<PublicFacilityType, string> = {
  health_station: '#10b981',        // emerald
  school: '#f59e0b',                // amber
  cultural_house: '#3b82f6',        // blue
  administrative_office: '#6366f1', // indigo
  market: '#f97316',                // orange
  sports_facility: '#14b8a6',       // teal
  water_facility: '#06b6d4',        // cyan
  public_infrastructure: '#64748b', // slate
};

export const FACILITY_LABELS: Record<PublicFacilityType, string> = {
  health_station: 'Trạm y tế',
  school: 'Trường học',
  cultural_house: 'Nhà văn hóa',
  administrative_office: 'Trụ sở hành chính',
  market: 'Chợ / Dịch vụ',
  sports_facility: 'Thể thao / Cộng đồng',
  water_facility: 'Cấp nước',
  public_infrastructure: 'Hạ tầng kỹ thuật',
};

export type MapMarkerIconName =
  | 'attraction'
  | 'building'
  | 'camera'
  | 'flag'
  | 'infrastructure'
  | 'landmark'
  | 'market'
  | 'medical'
  | 'mountain'
  | 'search'
  | 'school'
  | 'sports'
  | 'water'
  | 'warning';

const MAP_MARKER_ICON_PATHS: Record<MapMarkerIconName, string> = {
  attraction:
    '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3Z"/>',
  building:
    '<path d="M4 21h16M6 21V5h12v16M9 9h2M13 9h2M9 13h2M13 13h2M10 21v-4h4v4"/>',
  camera:
    '<path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z"/><circle cx="12" cy="13.5" r="3.5"/>',
  flag: '<path d="M6 21V4m0 1h11l-2 4 2 4H6"/>',
  infrastructure:
    '<path d="m14.7 6.3 3-3a5 5 0 0 1-6.4 6.4l-6.6 6.6a2.1 2.1 0 0 0 3 3l6.6-6.6a5 5 0 0 1 6.4-6.4l-3 3-3-3Z"/>',
  landmark:
    '<path d="M3 21h18M5 18h14M6 18v-8m4 8v-8m4 8v-8m4 8v-8M4 7l8-4 8 4H4Z"/>',
  market:
    '<path d="M4 10h16l-1.5-5h-13L4 10Zm1 0v10h14V10M8 20v-6h5v6"/>',
  medical: '<path d="M12 5v14M5 12h14"/>',
  mountain: '<path d="m3 19 6-10 4 6 2-3 6 7H3Zm6-10 2 3"/>',
  search:
    '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  school:
    '<path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v5c3.5 2.5 8.5 2.5 12 0v-5m4-3v6"/>',
  sports:
    '<circle cx="12" cy="12" r="8"/><path d="m9 5 3 3 3-3m-7 6-4 1m12-1 4 1m-11 6 3-4 3 4"/>',
  water: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z"/>',
  warning: '<path d="M12 3 2.5 20h19L12 3Zm0 6v5m0 3h.01"/>',
};

/** Builds a self-contained map pin with a semantic icon for OpenLayers. */
export function buildIconPinMarkerSvg(
  color: string,
  icon: MapMarkerIconName,
  size = 30,
) {
  const height = Math.round(size * 1.3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${height}" viewBox="0 0 32 40"><path d="M16 1C7.72 1 1 7.72 1 16c0 10.8 15 23 15 23s15-12.2 15-23C31 7.72 24.28 1 16 1Z" fill="${color}" stroke="white" stroke-width="2"/><circle cx="16" cy="16" r="10" fill="white" fill-opacity=".96"/><g transform="translate(8 8) scale(.6667)" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${MAP_MARKER_ICON_PATHS[icon]}</g></svg>`;
}

// ─── SVG Marker Builders ──────────────────────────────────────────────────────

/**
 * Returns an SVG string for a circle marker.
 * Used for creating custom Leaflet DivIcons.
 */
export function buildCircleMarkerSvg(color: string, size = 20): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${color}" fill-opacity="0.9" stroke="white" stroke-width="2"/>
    </svg>
  `.trim();
}

/**
 * Returns an SVG string for a pin/drop marker.
 */
export function buildPinMarkerSvg(color: string, size = 24): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.4)}" viewBox="0 0 24 32">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 20 8 20S20 13.25 20 8c0-4.42-3.58-8-8-8z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="8" r="4" fill="white"/>
    </svg>
  `.trim();
}
