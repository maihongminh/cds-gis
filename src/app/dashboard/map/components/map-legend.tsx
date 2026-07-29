// Dynamic map legend generated from the shared GIS layer catalog.
'use client';

import * as React from 'react';
import { Eye } from 'lucide-react';
import {
  GIS_LAYER_GROUPS,
  MAP_LAYER_BY_ID,
} from '@/data/mock-map-layers';
import type { MapLayer } from '@/data/gis-layer-catalog';
import { cn } from '@/lib/utils';
import { MapLayerSymbol } from './map-layer-symbol';

interface MapLegendProps {
  activeLayerIds: string[];
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function LegendRow({
  color,
  label,
  geometryType = 'point',
  styleConfig,
}: {
  color: string;
  label: string;
  geometryType?: 'point' | 'line' | 'polygon';
  styleConfig?: MapLayer['styleConfig'];
}) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <MapLayerSymbol
        geometryType={geometryType}
        styleConfig={styleConfig ?? { color }}
      />
      <span className="leading-tight text-foreground/80">{label}</span>
    </div>
  );
}

export function MapLegend({
  activeLayerIds,
  className,
  collapsed = false,
  onToggleCollapse,
}: MapLegendProps) {
  const activeGroups = GIS_LAYER_GROUPS.map((group) => ({
    ...group,
    layers: group.layers
      .filter((layerId) => activeLayerIds.includes(layerId))
      .map((layerId) => MAP_LAYER_BY_ID.get(layerId))
      .filter((layer) => layer !== undefined),
  })).filter(
    (group) =>
      group.layers.length > 0 || group.id === 'administrative_population',
  );

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-border/60 bg-card/95 shadow-sm backdrop-blur-sm',
        className,
      )}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-[10px] font-bold text-foreground transition-colors hover:bg-muted/40"
        aria-label={collapsed ? 'Mở chú giải' : 'Thu gọn chú giải'}
      >
        <span className="flex items-center gap-1.5">
          <Eye className="size-3 text-primary" />
          Chú giải bản đồ
        </span>
        <span className="text-muted-foreground">{collapsed ? '▲' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="max-h-[55vh] space-y-3 overflow-y-auto border-t border-border/50 px-3 pb-3">
          {activeGroups.map((group) => (
            <div key={group.id} className="space-y-1.5 pt-2">
              <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.layers.map((layer) =>
                layer.id === 'layer-land-use-planning' ? (
                  <React.Fragment key={layer.id}>
                    <LegendRow
                      color="#0284c7"
                      label="Hiện trạng sử dụng đất (minh họa)"
                      geometryType="polygon"
                    />
                    <LegendRow
                      color="#7c3aed"
                      label="Kế hoạch sử dụng đất (minh họa)"
                      geometryType="polygon"
                    />
                  </React.Fragment>
                ) : (
                  <LegendRow
                    key={layer.id}
                    color={layer.styleConfig.color}
                    label={layer.shortLabel ?? layer.name}
                    geometryType={layer.geometryType}
                    styleConfig={layer.styleConfig}
                  />
                ),
              )}
              {group.id === 'administrative_population' && (
                <LegendRow
                  color="#dc2626"
                  label="Hoàng Sa, Trường Sa (Việt Nam)"
                  styleConfig={{ color: '#dc2626', icon: 'MapPin' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
