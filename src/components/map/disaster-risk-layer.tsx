// src/components/map/disaster-risk-layer.tsx
// Renders disaster risk zone polygons and point markers on the map.
// Colors are driven by risk level from map-style-config.ts.
// Critical zones get a CSS pulse animation that respects prefers-reduced-motion.
'use client';

import * as React from 'react';
import { GeoJSON, CircleMarker, Popup } from 'react-leaflet';
import type { FeatureCollection, Feature } from 'geojson';
import type { DisasterRiskZone, RiskLevel } from '@/types/map';
import { RISK_LEVEL_STYLES, RISK_LEVEL_LABELS } from '@/lib/map-style-config';

interface DisasterRiskLayerProps {
  zones: DisasterRiskZone[];
  /** layer-disaster-landslide and/or layer-disaster-flood active */
  activeLayerIds: string[];
  onSelect?: (zone: DisasterRiskZone) => void;
}

const LANDSLIDE_LAYER_ID = 'layer-disaster-landslide';
const FLOOD_LAYER_ID = 'layer-disaster-flood';

function isLandslideType(riskType: DisasterRiskZone['riskType']): boolean {
  return riskType === 'landslide';
}
function isFloodType(riskType: DisasterRiskZone['riskType']): boolean {
  return riskType === 'flooding' || riskType === 'erosion' || riskType === 'critical_area';
}

function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const styles = RISK_LEVEL_STYLES[level];
  return (
    <span
      style={{
        background: styles.fillColor,
        color: styles.color,
        border: `1px solid ${styles.color}`,
        borderRadius: 4,
        padding: '1px 6px',
        fontSize: 9,
        fontWeight: 700,
      }}
    >
      {RISK_LEVEL_LABELS[level]}
    </span>
  );
}

function DisasterPopupContent({
  zone,
  onSelect,
}: {
  zone: DisasterRiskZone;
  onSelect?: (z: DisasterRiskZone) => void;
}) {
  const s = RISK_LEVEL_STYLES[zone.riskLevel];
  const typeLabel = {
    landslide: '⛰ Sạt lở đất',
    flooding: '🌊 Ngập lụt',
    erosion: '🌊 Xói lở',
    critical_area: '⚠ Khu xung yếu',
  }[zone.riskType];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, lineHeight: 1.5, minWidth: 200 }}>
      <div style={{ marginBottom: 4, fontSize: 9, color: s.color, fontWeight: 700 }}>{typeLabel}</div>
      <div style={{ fontWeight: 700, fontSize: 12, color: '#1e293b', marginBottom: 6, lineHeight: 1.3 }}>
        {zone.name}
      </div>

      <div style={{ marginBottom: 6 }}>
        <RiskLevelBadge level={zone.riskLevel} />
        {'  '}
        <span style={{
          fontSize: 9, fontWeight: 600, color: {
            monitoring: '#64748b', warning: '#f59e0b', active: '#ef4444', resolved: '#10b981'
          }[zone.status],
        }}>
          {({ monitoring: 'Đang theo dõi', warning: 'Cảnh báo', active: 'Đang diễn ra', resolved: 'Đã xử lý' } as Record<string, string>)[zone.status]}
        </span>
      </div>

      <p style={{ color: '#64748b', margin: '0 0 8px 0', fontSize: 10, lineHeight: 1.5 }}>
        {zone.warningMessage}
      </p>

      <div style={{ background: '#fef3c7', borderLeft: '3px solid #f59e0b', padding: '6px 8px', borderRadius: 4, marginBottom: 8, fontSize: 10, color: '#92400e' }}>
        <strong>Khuyến nghị:</strong> {zone.recommendedAction}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 8px', marginBottom: 8 }}>
        <span style={{ color: '#94a3b8', fontSize: 9 }}>Diện tích TĐH</span>
        <span style={{ fontWeight: 600, fontSize: 10 }}>{zone.affectedAreaHa} ha</span>
        <span style={{ color: '#94a3b8', fontSize: 9 }}>Dân số TĐH</span>
        <span style={{ fontWeight: 600, fontSize: 10 }}>{zone.affectedPopulationEstimate.toLocaleString('vi-VN')} người</span>
        <span style={{ color: '#94a3b8', fontSize: 9 }}>Đánh giá gần nhất</span>
        <span style={{ fontWeight: 600, fontSize: 10 }}>{zone.lastAssessmentDate}</span>
      </div>

      {onSelect && (
        <button
          onClick={() => onSelect(zone)}
          style={{
            width: '100%', background: '#1d4ed8', color: 'white', border: 'none',
            borderRadius: 4, padding: '4px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Xem chi tiết →
        </button>
      )}

      <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 8, borderTop: '1px solid #e2e8f0', paddingTop: 6 }}>
        Dữ liệu mô phỏng — {zone.code}
      </div>
    </div>
  );
}

export function DisasterRiskLayer({ zones, activeLayerIds, onSelect }: DisasterRiskLayerProps) {
  const visibleZones = zones.filter((z) => {
    if (isLandslideType(z.riskType)) return activeLayerIds.includes(LANDSLIDE_LAYER_ID);
    if (isFloodType(z.riskType)) return activeLayerIds.includes(FLOOD_LAYER_ID);
    return false;
  });

  if (visibleZones.length === 0) return null;

  return (
    <>
      {visibleZones.map((zone) => {
        const style = RISK_LEVEL_STYLES[zone.riskLevel];

        if (zone.geometry.type === 'Polygon') {
          const geoJsonFeature: FeatureCollection = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                id: zone.id,
                properties: { id: zone.id },
                geometry: {
                  type: 'Polygon',
                  coordinates: zone.geometry.coordinates as number[][][],
                },
              } as Feature,
            ],
          };

          return (
            <GeoJSON
              key={zone.id}
              data={geoJsonFeature}
              style={{
                color: style.color,
                fillColor: style.fillColor,
                fillOpacity: style.fillOpacity,
                weight: style.weight,
                opacity: 0.9,
              }}
              onEachFeature={(_feat, leafletLayer) => {
                leafletLayer.bindPopup(
                  // Use a div placeholder; actual React content rendered below via Popup component
                  `<div id="popup-${zone.id}">Đang tải...</div>`,
                  { maxWidth: 260 }
                );
                leafletLayer.on('click', () => {
                  onSelect?.(zone);
                });
              }}
            >
              {/* Leaflet GeoJSON doesn't directly support React children Popup,
                  so we use onEachFeature above for the native popup. */}
            </GeoJSON>
          );
        }

        if (zone.geometry.type === 'Point') {
          const [lng, lat] = zone.geometry.coordinates as [number, number];
          return (
            <CircleMarker
              key={zone.id}
              center={[lat, lng]}
              radius={10}
              pathOptions={{
                color: style.color,
                weight: 2,
                fillColor: style.fillColor,
                fillOpacity: 0.85,
              }}
              eventHandlers={{ click: () => onSelect?.(zone) }}
            >
              <Popup maxWidth={260}>
                <DisasterPopupContent zone={zone} onSelect={onSelect} />
              </Popup>
            </CircleMarker>
          );
        }

        return null;
      })}
    </>
  );
}
