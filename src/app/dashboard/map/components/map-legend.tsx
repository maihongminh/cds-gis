// src/app/dashboard/map/components/map-legend.tsx
// Map legend — shows only currently active layer symbols.
'use client';

import * as React from 'react';
import { Eye, MapPin, HeartPulse, GraduationCap, Landmark, Building } from 'lucide-react';
import { COMMUNE_BOUNDARY_STYLE } from '@/lib/map-style-config';
import {
  TOURISM_POI_COLORS,
  TOURISM_POI_LABELS,
  FACILITY_COLORS,
  FACILITY_LABELS,
  RISK_LEVEL_STYLES,
  RISK_LEVEL_LABELS,
} from '@/lib/map-style-config';
import type { RiskLevel } from '@/types/map';
import { cn } from '@/lib/utils';

const RISK_LEVELS: RiskLevel[] = ['critical', 'high', 'medium', 'low'];

interface MapLegendProps {
  activeLayerIds: string[];
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function LegendRow({
  color,
  label,
  shape = 'circle',
  outline,
  icon,
}: {
  color: string;
  label: string;
  shape?: 'circle' | 'square' | 'polygon';
  outline?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      {icon ? (
        <div style={{ color: color }} className="flex items-center justify-center size-3">
          {React.createElement(icon, { className: "size-3 shrink-0" })}
        </div>
      ) : shape === 'circle' ? (
        <span
          className="size-3 rounded-full shrink-0 border-[1.5px] border-white"
          style={{ background: color }}
        />
      ) : (
        <span
          className="size-3 rounded-sm shrink-0 border"
          style={{ background: color + '30', borderColor: outline ?? color }}
        />
      )}
      <span className="text-foreground/80 leading-none">{label}</span>
    </div>
  );
}

export function MapLegend({
  activeLayerIds,
  className,
  collapsed = false,
  onToggleCollapse,
}: MapLegendProps) {
  const hasCommune = activeLayerIds.includes('layer-commune');
  const hasVillages = activeLayerIds.includes('layer-villages');
  const hasSovereigntyIslands = activeLayerIds.includes('layer-sovereignty-islands');
  const hasTourism = activeLayerIds.includes('layer-tourism');
  const hasHealth = activeLayerIds.includes('layer-health');
  const hasEducation = activeLayerIds.includes('layer-education');
  const hasCultural = activeLayerIds.includes('layer-cultural');
  const hasAdminOffices = activeLayerIds.includes('layer-admin-offices');
  const hasLandslide = activeLayerIds.includes('layer-disaster-landslide');
  const hasFlood = activeLayerIds.includes('layer-disaster-flood');

  const showFacilities = hasHealth || hasEducation || hasCultural || hasAdminOffices;
  const showDisaster = hasLandslide || hasFlood;
  const hasContent =
    hasCommune || hasVillages || hasSovereigntyIslands || hasTourism || showFacilities || showDisaster;

  if (!hasContent) return null;

  return (
    <div
      className={cn(
        'rounded-lg border border-border/60 bg-card/95 backdrop-blur-sm shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Toggle header */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
        aria-label={collapsed ? 'Mở chú giải' : 'Thu gọn chú giải'}
      >
        <span className="flex items-center gap-1.5">
          <Eye className="size-3 text-primary" />
          Chú giải bản đồ
        </span>
        <span className="text-muted-foreground">{collapsed ? '▲' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 space-y-3 border-t border-border/50">
          {/* Administrative */}
          {(hasCommune || hasVillages || hasSovereigntyIslands) && (
            <div className="space-y-1.5 pt-2">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                Hành chính
              </p>
              {hasCommune && (
                <LegendRow
                  color={COMMUNE_BOUNDARY_STYLE.fillColor}
                  outline={COMMUNE_BOUNDARY_STYLE.color}
                  label="Ranh giới xã Lao Bảo"
                  shape="polygon"
                />
              )}
              {hasVillages && (
                <LegendRow
                  color="#94a3b820"
                  outline="#64748b"
                  label="Ranh giới 12 thôn"
                  shape="polygon"
                />
              )}
              {hasSovereigntyIslands && (
                <LegendRow
                  color="#dc2626"
                  outline="#facc15"
                  label="Hoàng Sa, Trường Sa (Việt Nam)"
                />
              )}
            </div>
          )}

          {/* Tourism */}
          {hasTourism && (
            <div className="space-y-1.5">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                Du lịch & Di tích
              </p>
              {(['tourist_attraction', 'historical_site', 'scenic_spot'] as const).map((t) => (
                <LegendRow key={t} color={TOURISM_POI_COLORS[t]} label={TOURISM_POI_LABELS[t]} icon={MapPin} />
              ))}
            </div>
          )}

          {/* Facilities */}
          {showFacilities && (
            <div className="space-y-1.5">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                Công trình công cộng
              </p>
              {hasHealth && (
                <LegendRow color={FACILITY_COLORS.health_station} label={FACILITY_LABELS.health_station} icon={HeartPulse} />
              )}
              {hasEducation && (
                <LegendRow color={FACILITY_COLORS.school} label={FACILITY_LABELS.school} icon={GraduationCap} />
              )}
              {hasCultural && (
                <LegendRow color={FACILITY_COLORS.cultural_house} label={FACILITY_LABELS.cultural_house} icon={Landmark} />
              )}
              {hasAdminOffices && (
                <LegendRow color={FACILITY_COLORS.administrative_office} label="Hành chính & Hạ tầng" icon={Building} />
              )}
            </div>
          )}

          {/* Disaster */}
          {showDisaster && (
            <div className="space-y-1.5">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                Mức độ rủi ro
              </p>
              {RISK_LEVELS.map((level) => {
                const s = RISK_LEVEL_STYLES[level];
                return (
                  <LegendRow
                    key={level}
                    color={s.fillColor}
                    outline={s.color}
                    label={RISK_LEVEL_LABELS[level]}
                    shape="polygon"
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
