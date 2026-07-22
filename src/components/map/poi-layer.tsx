// src/components/map/poi-layer.tsx
// Tourism POI marker layer using custom DivIcon SVG pins.
// Groups markers by type and shows rich popup on click.
'use client';

import * as React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { MapPin } from 'lucide-react';
import type { TourismPoi } from '@/types/map';
import { TOURISM_POI_COLORS, TOURISM_POI_LABELS } from '@/lib/map-style-config';

interface PoiLayerProps {
  pois: TourismPoi[];
  visible: boolean;
  onSelect?: (poi: TourismPoi) => void;
}

function OperatingBadge({ status }: { status: TourismPoi['operatingStatus'] }) {
  const map = {
    open: { label: 'Đang mở cửa', color: '#10b981' },
    closed: { label: 'Đóng cửa', color: '#ef4444' },
    seasonal: { label: 'Theo mùa', color: '#f59e0b' },
    under_renovation: { label: 'Đang sửa chữa', color: '#6366f1' },
  } as const;
  const cfg = map[status];
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

export function PoiLayer({ pois, visible, onSelect }: PoiLayerProps) {
  if (!visible) return null;

  return (
    <>
      {pois.map((poi) => {
        const color = TOURISM_POI_COLORS[poi.type] ?? '#8b5cf6';
        const [lng, lat] = poi.coordinates;

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
            <MapPin size={16} strokeWidth={2.5} />
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
            key={poi.id}
            position={[lat, lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onSelect?.(poi),
            }}
          >
            <Popup maxWidth={240} minWidth={200}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, lineHeight: 1.5 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: color,
                      flexShrink: 0,
                      marginTop: 2,
                      display: 'inline-block',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {TOURISM_POI_LABELS[poi.type]}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', lineHeight: 1.3 }}>
                      {poi.name}
                    </div>
                  </div>
                </div>

                {/* Image */}
                {poi.imagePlaceholder && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={poi.imagePlaceholder}
                    alt={poi.name}
                    style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                  />
                )}

                {/* Description */}
                <p style={{ color: '#64748b', margin: '0 0 8px 0', fontSize: 10, lineHeight: 1.5 }}>
                  {poi.shortDescription}
                </p>

                {/* Meta */}
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 8px', marginBottom: 8 }}>
                  <span style={{ color: '#94a3b8', fontSize: 9 }}>Thôn</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 10 }}>{poi.villageName}</span>
                  {poi.openingHours && (
                    <>
                      <span style={{ color: '#94a3b8', fontSize: 9 }}>Giờ mở</span>
                      <span style={{ color: '#0f172a', fontSize: 10 }}>{poi.openingHours}</span>
                    </>
                  )}
                  <span style={{ color: '#94a3b8', fontSize: 9 }}>Trạng thái</span>
                  <div><OperatingBadge status={poi.operatingStatus} /></div>
                </div>

                <div style={{ fontSize: 8, color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: 6 }}>
                  Dữ liệu mô phỏng — {poi.code}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
