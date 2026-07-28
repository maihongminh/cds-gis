// src/app/dashboard/map/components/map-layer-panel.tsx
// Layer control panel — grouped checkboxes/switches with feature counts.
// Desktop: sliding card panel. Mobile: Shadcn Sheet.
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui';
import { Checkbox, Button } from '@/components/ui';
import { INITIAL_MAP_LAYERS, GIS_LAYER_GROUPS } from '@/data/mock-map-layers';
import {
  AlertTriangle,
  BriefcaseBusiness,
  Building,
  Compass,
  Construction,
  Eye,
  EyeOff,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Landmark,
  Layers,
  Leaf,
  Map,
  MapPin,
  RotateCcw,
  Shield,
  ChevronRight,
} from 'lucide-react';
import type { MapState } from '@/components/map/map-client';
import { cn } from '@/lib/utils';

// Icon map for group icons
const GROUP_ICONS = {
  Map,
  BriefcaseBusiness,
  Compass,
  Construction,
  Leaf,
  GraduationCap,
  HeartHandshake,
  Shield,
  AlertTriangle,
} as const;

// Icon map for specific layer icons
const LAYER_ICONS: Record<string, React.ElementType> = {
  MapPin,
  HeartPulse,
  GraduationCap,
  Landmark,
  Building,
};

interface MapLayerPanelProps {
  mapState: MapState;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

function LayerPanelContent({ mapState }: { mapState: MapState }) {
  const { activeLayerIds, toggleLayer, enableAllInGroup, disableAllInGroup, resetToDefaults, currentRole } = mapState;
  const [expandedGroupIds, setExpandedGroupIds] = React.useState(
    () => new Set(['administrative_population']),
  );

  function toggleExpandedGroup(groupId: string) {
    setExpandedGroupIds((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  // Only show layers the current role can see
  const allowedLayers = INITIAL_MAP_LAYERS.filter((l) => {
    if (l.securityLevel === 'confidential') {
      return ['admin', 'data_governance', 'commune_leader'].includes(currentRole ?? '');
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Global actions */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          size="xs"
          variant="outline"
          className="h-7 text-[10px] gap-1 cursor-pointer border-border shadow-none"
          onClick={() => {
            GIS_LAYER_GROUPS.forEach((g) => enableAllInGroup(g.id));
          }}
        >
          <Eye className="size-3" /> Bật tất cả
        </Button>
        <Button
          size="xs"
          variant="outline"
          className="h-7 text-[10px] gap-1 cursor-pointer border-border shadow-none"
          onClick={() => {
            GIS_LAYER_GROUPS.forEach((g) => disableAllInGroup(g.id));
          }}
        >
          <EyeOff className="size-3" /> Tắt tất cả
        </Button>
        <Button
          size="xs"
          variant="outline"
          className="h-7 text-[10px] gap-1 cursor-pointer border-border shadow-none"
          onClick={resetToDefaults}
        >
          <RotateCcw className="size-3" /> Mặc định
        </Button>
      </div>

      {/* Layer groups */}
      {GIS_LAYER_GROUPS.map((group) => {
        const groupLayers = group.layers
          .map((id) => allowedLayers.find((l) => l.id === id))
          .filter(Boolean) as typeof allowedLayers;

        if (groupLayers.length === 0) return null;

        const IconComp = GROUP_ICONS[group.icon as keyof typeof GROUP_ICONS] ?? Layers;
        const allOn = groupLayers.every((l) => activeLayerIds.includes(l.id));
        const allOff = groupLayers.every((l) => !activeLayerIds.includes(l.id));
        const isExpanded = expandedGroupIds.has(group.id);

        return (
          <div key={group.id} className="space-y-1.5">
            {/* Group header */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleExpandedGroup(group.id)}
                className="flex min-w-0 items-center gap-1 text-left text-[10px] font-bold uppercase tracking-wider text-foreground"
                aria-expanded={isExpanded}
              >
                <ChevronRight
                  className={cn(
                    'size-3 shrink-0 text-muted-foreground transition-transform',
                    isExpanded && 'rotate-90',
                  )}
                />
                <IconComp className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">{group.label}</span>
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => enableAllInGroup(group.id)}
                  className={cn(
                    'text-[8px] px-1.5 py-0.5 rounded border cursor-pointer transition-colors',
                    allOn
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'text-muted-foreground border-border hover:text-foreground'
                  )}
                >
                  Bật
                </button>
                <button
                  type="button"
                  onClick={() => disableAllInGroup(group.id)}
                  className={cn(
                    'text-[8px] px-1.5 py-0.5 rounded border cursor-pointer transition-colors',
                    allOff
                      ? 'bg-muted text-foreground border-border'
                      : 'text-muted-foreground border-border hover:text-foreground'
                  )}
                >
                  Tắt
                </button>
              </div>
            </div>

            {/* Layer items */}
            {isExpanded && <div className="space-y-1 pl-1">
              {groupLayers.map((layer) => {
                const isActive = activeLayerIds.includes(layer.id);
                return (
                  <label
                    key={layer.id}
                    className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {layer.styleConfig.icon && LAYER_ICONS[layer.styleConfig.icon] ? (
                        <div style={{ color: layer.styleConfig.color }} className="flex items-center justify-center size-3">
                          {React.createElement(LAYER_ICONS[layer.styleConfig.icon], { className: "size-3 shrink-0" })}
                        </div>
                      ) : (
                        <span
                          className="size-2.5 rounded-full shrink-0"
                          style={{ background: layer.styleConfig.color }}
                        />
                      )}
                      <span className="text-[11px] text-foreground truncate">{layer.shortLabel ?? layer.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {layer.featureCount !== undefined && layer.featureCount > 0 && (
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {layer.featureCount}
                        </span>
                      )}
                      <Checkbox
                        checked={isActive}
                        onCheckedChange={() => toggleLayer(layer.id)}
                        className="size-3.5 cursor-pointer"
                        aria-label={`Bật/tắt lớp ${layer.shortLabel}`}
                      />
                    </div>
                  </label>
                );
              })}
            </div>}
          </div>
        );
      })}

      <p className="text-[8px] text-muted-foreground pt-2 border-t border-border/40 leading-relaxed">
        Dữ liệu ranh giới và vị trí trên bản đồ là dữ liệu mô phỏng, không sử dụng cho mục đích pháp lý.
      </p>
    </div>
  );
}

export function MapLayerPanel({ mapState, isOpen, onClose, isMobile }: MapLayerPanelProps) {
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="left" className="w-72 p-4 overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-sm">
              <Layers className="size-4 text-primary" />
              Điều khiển lớp dữ liệu
            </SheetTitle>
            <SheetDescription className="text-[10px]">
              Bật/tắt các lớp bản đồ GIS
            </SheetDescription>
          </SheetHeader>
          <LayerPanelContent mapState={mapState} />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: absolutely positioned card panel
  if (!isOpen) return null;

  return (
    <div className="absolute top-17 bottom-72 left-2.5 z-1000 flex w-76 flex-col overflow-hidden rounded-xl border border-border/70 bg-card/95 p-3 shadow-lg backdrop-blur-sm">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h3 className="font-bold text-xs text-foreground flex items-center gap-1.5">
          <Layers className="size-3.5 text-primary" />
          Lớp dữ liệu GIS
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground cursor-pointer text-xs"
          aria-label="Đóng bảng điều khiển"
        >
          ✕
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <LayerPanelContent mapState={mapState} />
      </div>
    </div>
  );
}
