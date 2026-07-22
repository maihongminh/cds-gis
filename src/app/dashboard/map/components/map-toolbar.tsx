// src/app/dashboard/map/components/map-toolbar.tsx
// Floating toolbar above the map: village selector, full-commune fit, base layer switcher,
// layer panel toggle, search trigger.
'use client';

import * as React from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { Home, Layers } from 'lucide-react';
import { VILLAGES, COMMUNE } from '@/data/laobao-administrative-units';
import { BASE_LAYERS } from '@/lib/map-config';
import type { MapState } from '@/components/map/map-client';
import { MapSearch } from './map-search';
import { cn } from '@/lib/utils';

interface MapToolbarProps {
  mapState: MapState;
  onToggleLayerPanel: () => void;
  isLayerPanelOpen: boolean;
  /** Called when user selects "Toàn xã" — parent flyTo commune center */
  onFitCommune: () => void;
  className?: string;
}

export function MapToolbar({
  mapState,
  onToggleLayerPanel,
  isLayerPanelOpen,
  onFitCommune,
  className,
}: MapToolbarProps) {
  const { selectedVillageCode, setSelectedVillageCode, setFlyToCoords, activeBaseLayerId, setActiveBaseLayerId } =
    mapState;

  function handleVillageChange(code: string) {
    if (code === 'all') {
      setSelectedVillageCode(null);
      onFitCommune();
      return;
    }
    const v = VILLAGES.find((v) => v.code === code);
    if (v?.center) {
      const [lng, lat] = v.center;
      setSelectedVillageCode(code);
      setFlyToCoords([lat, lng]);
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          'flex items-center gap-1.5 flex-wrap p-1.5 rounded-lg border border-border/60 bg-card/95 backdrop-blur-sm shadow-sm',
          className
        )}
      >
        {/* Fit commune */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onFitCommune}
              className="h-8 px-2.5 gap-1.5 text-xs border-border shadow-none cursor-pointer"
              aria-label="Toàn xã Lao Bảo"
            >
              <Home className="size-3.5 text-primary" />
              <span className="hidden sm:inline font-medium">Toàn xã</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Về toàn xã Lao Bảo</TooltipContent>
        </Tooltip>

        {/* Village selector */}
        <Select value={selectedVillageCode ?? 'all'} onValueChange={handleVillageChange}>
          <SelectTrigger
            className="h-8 text-xs border-border shadow-none bg-background w-36 sm:w-44 cursor-pointer"
            aria-label="Chọn thôn để xem"
          >
            <SelectValue placeholder="Chọn thôn..." />
          </SelectTrigger>
          <SelectContent className="border-border bg-card text-xs">
            <SelectItem value="all" className="cursor-pointer font-medium text-primary">
              📍 Toàn {COMMUNE.name}
            </SelectItem>
            {VILLAGES.map((v) => (
              <SelectItem key={v.code} value={v.code} className="cursor-pointer">
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <MapSearch mapState={mapState} />

        <div className="flex-1" />

        {/* Base layer switcher */}
        <div className="hidden sm:flex items-center gap-1 border-r border-border/50 pr-2">
          {BASE_LAYERS.map((layer) => (
            <Tooltip key={layer.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setActiveBaseLayerId(layer.id)}
                  className={cn(
                    'h-7 px-2 text-[10px] font-medium rounded-md border transition-colors cursor-pointer',
                    activeBaseLayerId === layer.id
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                  )}
                  aria-label={`Bản đồ nền: ${layer.name}`}
                >
                  {layer.name}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {layer.description ?? layer.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Layer panel toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isLayerPanelOpen ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleLayerPanel}
              className="h-8 px-2.5 gap-1.5 text-xs border-border shadow-none cursor-pointer border!"
              aria-label="Bật/tắt bảng điều khiển lớp"
            >
              <Layers className="size-3.5" />
              <span className="hidden md:inline">Lớp dữ liệu</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Điều khiển lớp GIS</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
