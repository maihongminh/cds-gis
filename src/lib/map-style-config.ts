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
