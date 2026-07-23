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
import { Home, Layers, Map as MapIcon, MapPinned } from 'lucide-react';
import { VILLAGES, COMMUNE } from '@/data/laobao-administrative-units';
import { BASE_LAYERS, VIETNAM_CENTER } from '@/lib/map-config';
import type { MapState } from '@/components/map/map-client';
import { MapSearch } from './map-search';
import { MapLocationSearch } from './map-location-search';
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

  function handleFitVietnam() {
    setSelectedVillageCode(null);
    setFlyToCoords([VIETNAM_CENTER.lat, VIETNAM_CENTER.lng, VIETNAM_CENTER.zoom]);
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          'flex items-center gap-1.5 flex-nowrap overflow-hidden p-1.5 rounded-lg border border-border/60 bg-card/95 backdrop-blur-sm shadow-sm',
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

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitVietnam}
              className="h-8 gap-1.5 border-border px-2.5 text-xs shadow-none cursor-pointer"
              aria-label="Xem toàn Việt Nam"
            >
              <MapPinned className="size-3.5 text-primary" />
              <span className="hidden lg:inline font-medium">Toàn Việt Nam</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Thu nhỏ để xem toàn Việt Nam</TooltipContent>
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

        {/* Independent location search for the currently selected basemap */}
        <MapLocationSearch mapState={mapState} />

        {/* Base layer switcher */}
        <Select value={activeBaseLayerId} onValueChange={setActiveBaseLayerId}>
          <SelectTrigger
            className="h-8 w-48 shrink-0 cursor-pointer border-border bg-background text-xs shadow-none sm:w-56"
            aria-label="Chọn bản đồ nền"
          >
            <MapIcon className="size-3.5 shrink-0 text-primary" />
            <SelectValue placeholder="Chọn bản đồ nền" />
          </SelectTrigger>
          <SelectContent align="end" className="border-border bg-card text-xs">
            {BASE_LAYERS.map((layer) => (
              <SelectItem
                key={layer.id}
                value={layer.id}
                className="cursor-pointer"
                title={layer.description}
              >
                {layer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Layer panel toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isLayerPanelOpen ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleLayerPanel}
              className="h-8 shrink-0 px-2.5 gap-1.5 text-xs border-border shadow-none cursor-pointer border!"
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
