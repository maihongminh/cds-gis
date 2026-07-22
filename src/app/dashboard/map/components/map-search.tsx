// src/app/dashboard/map/components/map-search.tsx
// Command-based search across villages, POIs, facilities and disaster zones.
// Selecting a result enables the relevant layer and flyTo the feature.
'use client';

import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from '@/components/ui';
import { Search, Map, Compass, Building2, AlertTriangle } from 'lucide-react';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { MOCK_TOURISM_POIS } from '@/data/mock-map-tourism-pois';
import { MOCK_PUBLIC_FACILITIES } from '@/data/mock-map-public-facilities';
import { MOCK_DISASTER_RISK_ZONES } from '@/data/mock-map-disaster-risks';
import { FACILITY_LABELS } from '@/lib/map-style-config';
import type { MapState } from '@/components/map/map-client';
import { toast } from 'sonner';

// Determine lat/lng center of a village polygon from its center field
function getVillageCenter(code: string): [number, number] | null {
  const v = VILLAGES.find((v) => v.code === code);
  if (!v?.center) return null;
  const [lng, lat] = v.center;
  return [lat, lng];
}

interface MapSearchProps {
  mapState: MapState;
  className?: string;
}

export function MapSearch({ mapState, className }: MapSearchProps) {
  const [open, setOpen] = React.useState(false);
  const { setFlyToCoords, activeLayerIds, toggleLayer } = mapState;

  function ensureLayerActive(layerId: string) {
    if (!activeLayerIds.includes(layerId)) {
      toggleLayer(layerId);
    }
  }

  function handleVillage(code: string, name: string) {
    const center = getVillageCenter(code);
    if (center) {
      ensureLayerActive('layer-villages');
      setFlyToCoords(center);
      toast.success(`Đã định vị thôn ${name}`);
    }
    setOpen(false);
  }

  function handlePoi(id: string) {
    const poi = MOCK_TOURISM_POIS.find((p) => p.id === id);
    if (!poi) return;
    const [lng, lat] = poi.coordinates;
    ensureLayerActive('layer-tourism');
    setFlyToCoords([lat, lng]);
    toast.success(`Đã định vị: ${poi.name}`);
    setOpen(false);
  }

  function handleFacility(id: string) {
    const fac = MOCK_PUBLIC_FACILITIES.find((f) => f.id === id);
    if (!fac) return;
    const [lng, lat] = fac.coordinates;
    // Ensure appropriate layer is active
    const layerMap: Record<string, string> = {
      health_station: 'layer-health',
      school: 'layer-education',
      cultural_house: 'layer-cultural',
    };
    const layerId = layerMap[fac.facilityType] ?? 'layer-admin-offices';
    ensureLayerActive(layerId);
    setFlyToCoords([lat, lng]);
    toast.success(`Đã định vị: ${fac.name}`);
    setOpen(false);
  }

  function handleDisaster(id: string) {
    const zone = MOCK_DISASTER_RISK_ZONES.find((z) => z.id === id);
    if (!zone) return;
    const isLandslide = zone.riskType === 'landslide';
    const layerId = isLandslide ? 'layer-disaster-landslide' : 'layer-disaster-flood';
    ensureLayerActive(layerId);

    if (zone.geometry.type === 'Point') {
      const [lng, lat] = zone.geometry.coordinates as [number, number];
      setFlyToCoords([lat, lng]);
    } else {
      // Polygon: use centroid from first vertex
      const coords = (zone.geometry.coordinates as [number, number][][])[0];
      const lat = coords.reduce((s, [, la]) => s + la, 0) / coords.length;
      const lng = coords.reduce((s, [lo]) => s + lo, 0) / coords.length;
      setFlyToCoords([lat, lng]);
    }
    toast.warning(`Cảnh báo: ${zone.name}`);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 text-xs border-border shadow-none bg-background cursor-pointer xl:w-[300px] justify-start"
          aria-label="Tìm kiếm địa điểm trên bản đồ"
        >
          <Search className="size-3.5 text-muted-foreground" />
          <span className="hidden sm:inline text-muted-foreground">Tìm kiếm địa điểm...</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border-border bg-card shadow-xl" align="start">
        <Command>
          <CommandInput placeholder="Nhập tên thôn, điểm du lịch, công trình..." className="h-9 text-xs" />
          <CommandList className="max-h-80">
            <CommandEmpty className="text-xs text-muted-foreground py-6 text-center">
              Không tìm thấy kết quả.
            </CommandEmpty>

            {/* Villages */}
            <CommandGroup heading="Thôn" className="[&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
              {VILLAGES.map((v) => (
                <CommandItem
                  key={v.code}
                  value={`thon-${v.name}`}
                  onSelect={() => handleVillage(v.code, v.name)}
                  className="text-xs cursor-pointer gap-2"
                >
                  <Map className="size-3.5 text-blue-500 shrink-0" />
                  <span>{v.name}</span>
                  <span className="ml-auto text-[9px] text-muted-foreground">{v.areaHa} ha</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Tourism POIs */}
            <CommandGroup heading="Du lịch & Di tích" className="[&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
              {MOCK_TOURISM_POIS.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`poi-${p.name}`}
                  onSelect={() => handlePoi(p.id)}
                  className="text-xs cursor-pointer gap-2"
                >
                  <Compass className="size-3.5 text-violet-500 shrink-0" />
                  <span className="truncate">{p.name}</span>
                  <span className="ml-auto text-[9px] text-muted-foreground shrink-0">{p.villageName}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Facilities */}
            <CommandGroup heading="Công trình công cộng" className="[&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
              {MOCK_PUBLIC_FACILITIES.map((f) => (
                <CommandItem
                  key={f.id}
                  value={`fac-${f.name}`}
                  onSelect={() => handleFacility(f.id)}
                  className="text-xs cursor-pointer gap-2"
                >
                  <Building2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{f.name}</span>
                  <span className="ml-auto text-[9px] text-muted-foreground shrink-0">
                    {FACILITY_LABELS[f.facilityType]}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Disaster zones */}
            <CommandGroup heading="Cảnh báo thiên tai" className="[&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
              {MOCK_DISASTER_RISK_ZONES.map((z) => (
                <CommandItem
                  key={z.id}
                  value={`disaster-${z.name}`}
                  onSelect={() => handleDisaster(z.id)}
                  className="text-xs cursor-pointer gap-2"
                >
                  <AlertTriangle className="size-3.5 text-red-500 shrink-0" />
                  <span className="truncate">{z.name}</span>
                  <span
                    className="ml-auto text-[9px] font-bold shrink-0"
                    style={{
                      color: { low: '#ca8a04', medium: '#ea580c', high: '#dc2626', critical: '#7f1d1d' }[z.riskLevel],
                    }}
                  >
                    {z.riskLevel}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
