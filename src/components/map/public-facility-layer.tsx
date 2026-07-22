// src/components/map/public-facility-layer.tsx
// Public facility marker layer with type-based color coding and rich popup.
'use client';

import * as React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { HeartPulse, GraduationCap, Landmark, Building } from 'lucide-react';
import type { PublicFacility, PublicFacilityType } from '@/types/map';
import { FACILITY_COLORS, FACILITY_LABELS } from '@/lib/map-style-config';

// Layer ID → facility types mapping (must match mock-map-layers.ts)
const LAYER_FACILITY_TYPES: Record<string, PublicFacilityType[]> = {
  'layer-health': ['health_station'],
  'layer-education': ['school'],
  'layer-cultural': ['cultural_house'],
  'layer-admin-offices': ['administrative_office', 'market', 'sports_facility', 'water_facility', 'public_infrastructure'],
};

const FACILITY_ICONS: Record<PublicFacilityType, React.ElementType> = {
  health_station: HeartPulse,
  school: GraduationCap,
  cultural_house: Landmark,
  administrative_office: Building,
  market: Building,
  sports_facility: Building,
  water_facility: Building,
  public_infrastructure: Building,
};

interface PublicFacilityLayerProps {
  facilities: PublicFacility[];
  /** Which layer IDs are currently active */
  activeLayerIds: string[];
  onSelect?: (facility: PublicFacility) => void;
}

function ConditionBadge({ condition }: { condition: PublicFacility['condition'] }) {
  const cfg = {
    good: { label: 'Tốt', color: '#10b981' },
    fair: { label: 'Trung bình', color: '#f59e0b' },
    needs_attention: { label: 'Cần sửa chữa', color: '#ef4444' },
  }[condition];
  return (
    <span
      style={{
        background: cfg.color + '20',
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
        borderRadius: 4,
        padding: '1px 6px',
        fontSize: 9,
        fontWeight: 700,
      }}
    >
      {cfg.label}
    </span>
  );
}

export function PublicFacilityLayer({
  facilities,
  activeLayerIds,
  onSelect,
}: PublicFacilityLayerProps) {
  // Determine which facility types are currently visible
  const visibleTypes = React.useMemo<Set<PublicFacilityType>>(() => {
    const types = new Set<PublicFacilityType>();
    for (const [layerId, fTypes] of Object.entries(LAYER_FACILITY_TYPES)) {
      if (activeLayerIds.includes(layerId)) {
        fTypes.forEach((t) => types.add(t));
      }
    }
    return types;
  }, [activeLayerIds]);

  const visibleFacilities = facilities.filter((f) => visibleTypes.has(f.facilityType));

  if (visibleFacilities.length === 0) return null;

  return (
    <>
      {visibleFacilities.map((fac) => {
        const color = FACILITY_COLORS[fac.facilityType] ?? '#64748b';
        const [lng, lat] = fac.coordinates;
        const Icon = FACILITY_ICONS[fac.facilityType] || Building;

        const iconHtml = renderToString(
          <div style={{
            backgroundColor: '#ffffff',
            border: `2px solid ${color}`,
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            color: color
          }}>
            <Icon size={16} strokeWidth={2.5} />
          </div>
        );

        const customIcon = L.divIcon({
          html: iconHtml,
          className: '', // remove default leaflet class
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        return (
          <Marker
            key={fac.id}
            position={[lat, lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onSelect?.(fac),
            }}
          >
            <Popup maxWidth={240} minWidth={180}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, lineHeight: 1.5 }}>
                {/* Type badge */}
                <div style={{ marginBottom: 4 }}>
                  <span
                    style={{
                      background: color + '20',
                      color,
                      border: `1px solid ${color}40`,
                      borderRadius: 4,
                      padding: '1px 6px',
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {FACILITY_LABELS[fac.facilityType]}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: 12, color: '#1e293b', marginBottom: 6, lineHeight: 1.3 }}>
                  {fac.name}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 8px', marginBottom: 8 }}>
                  <span style={{ color: '#94a3b8', fontSize: 9 }}>Thôn</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 10 }}>{fac.villageName}</span>

                  <span style={{ color: '#94a3b8', fontSize: 9 }}>Quản lý</span>
                  <span style={{ color: '#0f172a', fontSize: 10 }}>{fac.managingOrganization}</span>

                  {fac.capacity && (
                    <>
                      <span style={{ color: '#94a3b8', fontSize: 9 }}>Quy mô</span>
                      <span style={{ color: '#0f172a', fontSize: 10 }}>{fac.capacity}</span>
                    </>
                  )}

                  <span style={{ color: '#94a3b8', fontSize: 9 }}>Tình trạng</span>
                  <div><ConditionBadge condition={fac.condition} /></div>
                </div>

                <div style={{ fontSize: 8, color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: 6 }}>
                  Dữ liệu mô phỏng — {fac.code}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
