// src/components/map/village-boundary-layer.tsx
// Renders all 12 village boundary polygons with distinct fill colors,
// hover highlighting, click popup and labels at centroid.
'use client';

import * as React from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';
import { VILLAGE_FILL_COLORS, VILLAGE_BOUNDARY_HOVER_STYLE } from '@/lib/map-style-config';
import { VILLAGES } from '@/data/laobao-administrative-units';

interface VillageBoundaryLayerProps {
  data: FeatureCollection;
  visible: boolean;
  labelsVisible: boolean;
  selectedVillageCode?: string | null;
  onVillageClick?: (villageCode: string) => void;
}

/** Returns village fill color by position in VILLAGES array (stable ordering). */
function getVillageFillColor(villageCode: string): string {
  const idx = VILLAGES.findIndex((v) => v.code === villageCode);
  return VILLAGE_FILL_COLORS[idx >= 0 ? idx : 0];
}

/** Computes centroid of a polygon for label placement. */
function computeCentroid(coords: number[][][]): [number, number] {
  const ring = coords[0];
  let lat = 0;
  let lng = 0;
  ring.forEach(([lo, la]) => {
    lng += lo;
    lat += la;
  });
  return [lat / ring.length, lng / ring.length];
}

export function VillageBoundaryLayer({
  data,
  visible,
  labelsVisible,
  selectedVillageCode,
  onVillageClick,
}: VillageBoundaryLayerProps) {
  if (!visible) return null;

  const getStyle = (feature?: Feature): PathOptions => {
    const code = feature?.properties?.villageCode as string | undefined;
    const isSelected = !!code && code === selectedVillageCode;
    const fillColor = getVillageFillColor(code ?? '');

    return {
      color: isSelected ? '#2563eb' : '#64748b',
      weight: isSelected ? 2.5 : 1.5,
      fillColor,
      fillOpacity: isSelected ? 0.35 : 0.12,
      opacity: isSelected ? 1 : 0.75,
    };
  };

  const onEachFeature = (feature: Feature, leafletLayer: Layer) => {
    const props = feature.properties ?? {};
    const code = props.villageCode as string;
    const name = props.villageName as string;
    const pop = (props.population as number)?.toLocaleString('vi-VN') ?? '—';
    const hh = (props.householdCount as number)?.toLocaleString('vi-VN') ?? '—';
    const area = (props.areaHa as number)?.toLocaleString('vi-VN') ?? '—';
    const village = VILLAGES.find((v) => v.code === code);
    const popDisplay = pop !== '—' ? pop : (village?.population?.toLocaleString('vi-VN') ?? '—');
    const hhDisplay = hh !== '—' ? hh : (village?.householdCount?.toLocaleString('vi-VN') ?? '—');
    const areaDisplay = area !== '—' ? area : (village?.areaHa?.toLocaleString('vi-VN') ?? '—');

    // Bind a rich HTML popup
    leafletLayer.bindPopup(`
      <div style="font-family: system-ui, sans-serif; font-size: 11px; min-width: 170px; line-height:1.5;">
        <h4 style="font-weight:700; font-size:13px; color:#1e293b; margin:0 0 6px 0;">Thôn ${name}</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 8px; margin-bottom:8px;">
          <span style="color:#64748b;">Diện tích</span>
          <span style="font-weight:600; color:#0f172a;">${areaDisplay} ha</span>
          <span style="color:#64748b;">Dân số</span>
          <span style="font-weight:600; color:#0f172a;">${popDisplay} người</span>
          <span style="color:#64748b;">Số hộ</span>
          <span style="font-weight:600; color:#0f172a;">${hhDisplay} hộ</span>
        </div>
        <div style="font-size:9px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:6px;">
          ⚠ Ranh giới mô phỏng — không có giá trị pháp lý
        </div>
      </div>
    `);

    // Hover effect
    const path = leafletLayer as unknown as {
      setStyle: (s: PathOptions) => void;
      getElement: () => HTMLElement | undefined;
    };
    leafletLayer.on('mouseover', () => {
      path.setStyle({
        weight: VILLAGE_BOUNDARY_HOVER_STYLE.weight,
        fillOpacity: VILLAGE_BOUNDARY_HOVER_STYLE.fillOpacity,
        opacity: VILLAGE_BOUNDARY_HOVER_STYLE.opacity,
      });
    });
    leafletLayer.on('mouseout', () => {
      path.setStyle(getStyle(feature));
    });
    leafletLayer.on('click', () => {
      if (onVillageClick && code) {
        onVillageClick(code);
      }
    });

    // Bind label tooltip at centroid if geometry is Polygon
    if (labelsVisible && feature.geometry.type === 'Polygon' && name) {
      const center = computeCentroid(feature.geometry.coordinates as number[][][]);
      leafletLayer.bindTooltip(name, {
        permanent: true,
        direction: 'center',
        className: 'village-label-tooltip',
        offset: [0, 0],
      });
    }
  };

  return (
    <GeoJSON
      key={`villages-${selectedVillageCode ?? 'none'}-${labelsVisible}`}
      data={data}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  );
}
