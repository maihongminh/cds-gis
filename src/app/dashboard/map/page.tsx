// src/app/dashboard/map/page.tsx
// Main GIS dashboard page for Xa Lao Bao.
// This is a 'use client' page that owns all shared MapState and composes sub-components.
'use client';

import * as React from 'react';
import { ShieldAlert } from 'lucide-react';
import { MapShell } from '@/components/map/map-shell';
import { MapToolbar } from './components/map-toolbar';
import { MapLayerPanel } from './components/map-layer-panel';
import { MapLegend } from './components/map-legend';
import { DisasterAlertPanel } from './components/disaster-alert-panel';
import { INITIAL_MAP_LAYERS, GIS_LAYER_GROUPS } from '@/data/mock-map-layers';
import { useTenant } from '@/components/layout/tenant-context';
import type {
  LocationSearchMarker,
  MapState,
} from '@/components/map/map-client';
import { DEFAULT_BASE_LAYER_ID, LAOBAO_CENTER } from '@/lib/map-config';

/** Commune center for "fit all" button */
const COMMUNE_CENTER: [number, number] = [LAOBAO_CENTER.lat, LAOBAO_CENTER.lng];

export default function MapPage() {
  const { currentRole } = useTenant();

  // ── Layer visibility state ─────────────────────────────────────────────────
  const defaultActiveIds = INITIAL_MAP_LAYERS
    .filter((l) => l.visibleByDefault)
    .map((l) => l.id);

  const [activeLayerIds, setActiveLayerIds] = React.useState<string[]>(defaultActiveIds);

  const toggleLayer = React.useCallback((id: string) => {
    setActiveLayerIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const enableAllInGroup = React.useCallback((groupId: string) => {
    const group = GIS_LAYER_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    setActiveLayerIds((prev) => {
      const next = new Set(prev);
      group.layers.forEach((lid) => next.add(lid));
      return Array.from(next);
    });
  }, []);

  const disableAllInGroup = React.useCallback((groupId: string) => {
    const group = GIS_LAYER_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    setActiveLayerIds((prev) => prev.filter((id) => !group.layers.includes(id)));
  }, []);

  const resetToDefaults = React.useCallback(() => {
    setActiveLayerIds(defaultActiveIds);
  }, [defaultActiveIds]);

  // ── Map navigation state ───────────────────────────────────────────────────
  const [selectedVillageCode, setSelectedVillageCode] = React.useState<string | null>(null);
  const [flyToCoords, setFlyToCoords] = React.useState<
    [number, number, number?] | null
  >(null);
  const [activeBaseLayerId, setActiveBaseLayerId] = React.useState(DEFAULT_BASE_LAYER_ID);
  const [locationSearchMarker, setLocationSearchMarker] =
    React.useState<LocationSearchMarker | null>(null);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLayerPanelOpen, setIsLayerPanelOpen] = React.useState(true);
  const [isLegendCollapsed, setIsLegendCollapsed] = React.useState(false);
  const [isAlertCollapsed, setIsAlertCollapsed] = React.useState(true);

  // Detect mobile via window width (hydration-safe)
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Shared MapState object passed to MapShell / MapClient ─────────────────
  const mapState: MapState = React.useMemo(
    () => ({
      activeLayerIds,
      toggleLayer,
      enableAllInGroup,
      disableAllInGroup,
      resetToDefaults,
      selectedVillageCode,
      setSelectedVillageCode,
      searchQuery,
      setSearchQuery,
      locationSearchMarker,
      setLocationSearchMarker,
      flyToCoords,
      setFlyToCoords,
      activeBaseLayerId,
      setActiveBaseLayerId,
      currentRole: currentRole ?? null,
    }),
    [
      activeLayerIds,
      toggleLayer,
      enableAllInGroup,
      disableAllInGroup,
      resetToDefaults,
      selectedVillageCode,
      searchQuery,
      locationSearchMarker,
      flyToCoords,
      activeBaseLayerId,
      currentRole,
    ]
  );

  function handleFitCommune() {
    setSelectedVillageCode(null);
    setFlyToCoords([...COMMUNE_CENTER, 14]);
  }

  return (
    <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] xl:w-[calc(100%+4rem)] h-[calc(100vh-4rem)] -m-4 md:-m-6 xl:-m-8 overflow-hidden animate-fade-in">
      {/* Map container */}
      <div className="absolute inset-0 z-0">
        <MapShell mapState={mapState} minHeight={480} />
      </div>

      {/* ── Toolbar — top center ── */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-1000 pointer-events-none">
        <div className="pointer-events-auto">
          <MapToolbar
            mapState={mapState}
            onToggleLayerPanel={() => setIsLayerPanelOpen((p) => !p)}
            isLayerPanelOpen={isLayerPanelOpen}
            onFitCommune={handleFitCommune}
          />
        </div>
      </div>

      {/* ── Layer Panel (desktop inline, mobile Sheet) ── */}
      <MapLayerPanel
        mapState={mapState}
        isOpen={isLayerPanelOpen}
        onClose={() => setIsLayerPanelOpen(false)}
        isMobile={isMobile}
      />

      {/* ── Legend — bottom left ── */}
      <div className="absolute bottom-8 right-12 z-1000 w-42">
        <MapLegend
          activeLayerIds={activeLayerIds}
          collapsed={isLegendCollapsed}
          onToggleCollapse={() => setIsLegendCollapsed((p) => !p)}
        />
      </div>

      {/* ── Disaster alert panel — bottom right ── */}
      <div className="absolute top-17 right-2.5 z-1000 w-43">
        <DisasterAlertPanel
          collapsed={isAlertCollapsed}
          onToggleCollapse={() => setIsAlertCollapsed((prev) => !prev)}
        />
      </div>

      {/* ── Mock data disclaimer ── */}
      <div className="absolute bottom-0 right-0 z-1000 flex items-center gap-1.5 px-2 py-1.5 rounded-tl-lg bg-background/90 backdrop-blur-xs border-t border-l border-border/80 shadow-sm">
        <ShieldAlert className="size-3 text-amber-500 shrink-0" />
        <p className="text-[8px] text-muted-foreground leading-none">
          Ranh giới xã/thôn nghiệp vụ là dữ liệu mô phỏng. Nền hành chính và dữ liệu Hoàng Sa, Trường Sa được tải từ gis.vn; không dùng thay hồ sơ pháp lý. Hệ quy chiếu: EPSG:4326
        </p>
      </div>
    </div>
  );
}
