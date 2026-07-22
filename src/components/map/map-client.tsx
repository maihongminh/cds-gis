// src/components/map/map-client.tsx
// Main Leaflet map container for Lao Bao GIS demo.
// This component is client-only (dynamically imported with ssr:false via map-shell.tsx).
'use client';

import * as React from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { LAOBAO_CENTER, BASE_LAYERS } from '@/lib/map-config';
import { COMMUNE_BOUNDARY_STYLE } from '@/lib/map-style-config';
import { MOCK_LAOBAO_COMMUNE_BOUNDARY } from '@/data/mock-laobao-commune-boundary';
import { MOCK_VILLAGE_BOUNDARIES } from '@/data/mock-laobao-boundary';
import { MOCK_TOURISM_POIS } from '@/data/mock-map-tourism-pois';
import { MOCK_PUBLIC_FACILITIES } from '@/data/mock-map-public-facilities';
import { MOCK_DISASTER_RISK_ZONES } from '@/data/mock-map-disaster-risks';
import { INITIAL_MAP_LAYERS, GIS_LAYER_GROUPS } from '@/data/mock-map-layers';
import { useTenant } from '@/components/layout/tenant-context';

import { VillageBoundaryLayer } from './village-boundary-layer';
import { PoiLayer } from './poi-layer';
import { PublicFacilityLayer } from './public-facility-layer';
import { DisasterRiskLayer } from './disaster-risk-layer';

import type { TourismPoi, PublicFacility, DisasterRiskZone } from '@/types/map';

// Fix Leaflet default marker icon paths
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Exported state interface (shared with overlay UI) ────────────────────────

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
  flyToCoords: [number, number] | null;
  setFlyToCoords: (c: [number, number] | null) => void;
  activeBaseLayerId: string;
  setActiveBaseLayerId: (id: string) => void;
  currentRole: string | null;
}

// ─── Sub-component: Map controller (fly/fit) ──────────────────────────────────

function MapController({
  flyToCoords,
  clearFlyTo,
  fitBoundsOnMount,
}: {
  flyToCoords: [number, number] | null;
  clearFlyTo: () => void;
  fitBoundsOnMount: boolean;
}) {
  const map = useMap();

  // FitBounds to commune boundary on first render
  React.useEffect(() => {
    if (!fitBoundsOnMount) return;
    const coords = MOCK_LAOBAO_COMMUNE_BOUNDARY.features[0]?.geometry;
    if (coords && (coords as { type: string; coordinates: number[][][] }).type === 'Polygon') {
      const rings = (coords as { type: string; coordinates: number[][][] }).coordinates[0];
      const latlngs = rings.map(([lng, lat]) => L.latLng(lat, lng));
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FlyTo on search/village select
  React.useEffect(() => {
    if (flyToCoords) {
      map.flyTo(flyToCoords, 16, { animate: true, duration: 1.2 });
      clearFlyTo();
    }
  }, [flyToCoords, map, clearFlyTo]);

  return null;
}

// ─── MapClient Props ──────────────────────────────────────────────────────────

export interface MapClientProps {
  /** Shared state passed from page/shell so toolbar/panels can control the map */
  mapState: MapState;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MapClient({ mapState }: MapClientProps) {
  const { currentRole } = useTenant();
  const {
    activeLayerIds,
    selectedVillageCode,
    setSelectedVillageCode,
    flyToCoords,
    setFlyToCoords,
    activeBaseLayerId,
  } = mapState;

  // Filter confidential layers by role
  const allowedLayerIds = React.useMemo(() => {
    return INITIAL_MAP_LAYERS
      .filter((l) => {
        if (l.securityLevel === 'confidential') {
          return ['admin', 'data_governance', 'commune_leader'].includes(currentRole ?? '');
        }
        return true;
      })
      .map((l) => l.id);
  }, [currentRole]);

  const effectiveActiveLayerIds = activeLayerIds.filter((id) =>
    allowedLayerIds.includes(id)
  );

  const activeBaseLayer = BASE_LAYERS.find((l) => l.id === activeBaseLayerId) ?? BASE_LAYERS[0];

  // Filter POIs/facilities/zones by security (all public for now)
  const visiblePois = MOCK_TOURISM_POIS.filter((p) => p.securityLevel === 'public');
  const visibleFacilities = MOCK_PUBLIC_FACILITIES.filter((f) => f.securityLevel === 'public');
  const visibleZones = MOCK_DISASTER_RISK_ZONES.filter((z) => z.securityLevel === 'public' || z.securityLevel === 'shared');

  const handleVillageClick = (code: string) => {
    setSelectedVillageCode(selectedVillageCode === code ? null : code);
  };

  return (
    <>
      {/* Leaflet CSS village label override */}
      <style>{`
        .village-label-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          font-size: 10px;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
          text-shadow: 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff;
          pointer-events: none;
        }
        .village-label-tooltip::before {
          display: none !important;
        }
        .dark .village-label-tooltip {
          color: #f8fafc;
          text-shadow: 0 0 3px #0f172a, 0 0 3px #0f172a;
        }
      `}</style>

      <MapContainer
        center={[LAOBAO_CENTER.lat, LAOBAO_CENTER.lng]}
        zoom={LAOBAO_CENTER.zoom}
        zoomControl={false}
        className="w-full h-full z-0"
        style={{ minHeight: '520px' }}
      >
        <MapController
          flyToCoords={flyToCoords}
          clearFlyTo={() => setFlyToCoords(null)}
          fitBoundsOnMount
        />

        {/* Base tile layer */}
        <TileLayer
          key={activeBaseLayer.id}
          url={activeBaseLayer.url}
          attribution={activeBaseLayer.attribution}
          maxZoom={activeBaseLayer.maxZoom}
        />

        <ZoomControl position="bottomright" />

        {/* ── Layer: Commune boundary ── */}
        {effectiveActiveLayerIds.includes('layer-commune') && (
          <GeoJSON
            data={MOCK_LAOBAO_COMMUNE_BOUNDARY}
            style={() => COMMUNE_BOUNDARY_STYLE}
            onEachFeature={(feature, layer) => {
              const p = feature.properties ?? {};
              layer.bindPopup(`
                <div style="font-family:system-ui,sans-serif;font-size:11px;min-width:190px;line-height:1.6;">
                  <h4 style="font-weight:700;font-size:14px;color:#1e293b;margin:0 0 6px 0;">Xã Lao Bảo</h4>
                  <div style="display:grid;grid-template-columns:auto 1fr;gap:3px 10px;margin-bottom:8px;">
                    <span style="color:#64748b;">Tỉnh</span><span style="font-weight:600;">Quảng Trị</span>
                    <span style="color:#64748b;">Diện tích</span><span style="font-weight:600;">${Number(p.areaHa).toLocaleString('vi-VN')} ha</span>
                    <span style="color:#64748b;">Dân số</span><span style="font-weight:600;">${Number(p.population).toLocaleString('vi-VN')} người</span>
                    <span style="color:#64748b;">Số hộ</span><span style="font-weight:600;">${Number(p.householdCount).toLocaleString('vi-VN')} hộ</span>
                    <span style="color:#64748b;">Số thôn</span><span style="font-weight:600;">12 thôn</span>
                  </div>
                  <div style="font-size:8px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:6px;">
                    ⚠ Ranh giới mô phỏng — không có giá trị pháp lý
                  </div>
                </div>
              `);
            }}
          />
        )}

        {/* ── Layer: Village boundaries ── */}
        <VillageBoundaryLayer
          data={MOCK_VILLAGE_BOUNDARIES}
          visible={effectiveActiveLayerIds.includes('layer-villages')}
          labelsVisible={effectiveActiveLayerIds.includes('layer-village-labels')}
          selectedVillageCode={selectedVillageCode}
          onVillageClick={handleVillageClick}
        />

        {/* ── Layer: Tourism POIs ── */}
        <PoiLayer
          pois={visiblePois}
          visible={effectiveActiveLayerIds.includes('layer-tourism')}
        />

        {/* ── Layers: Public facilities (health, education, cultural, admin) ── */}
        <PublicFacilityLayer
          facilities={visibleFacilities}
          activeLayerIds={effectiveActiveLayerIds}
        />

        {/* ── Layers: Disaster risk zones ── */}
        <DisasterRiskLayer
          zones={visibleZones}
          activeLayerIds={effectiveActiveLayerIds}
        />
      </MapContainer>
    </>
  );
}
