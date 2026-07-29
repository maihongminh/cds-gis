// Runtime-backed search across every saved GIS object.
'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

import type { MapState } from '@/components/map/map-client';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import {
  GIS_LAYER_GROUPS,
  MAP_LAYER_BY_ID,
  type MapLayer,
} from '@/data/gis-layer-catalog';
import { fetchDemoGisFeatures } from '@/lib/demo-gis-api';
import type { DemoGisFeature } from '@/types/demo-gis';
import { MapLayerSymbol } from './map-layer-symbol';

interface MapSearchProps {
  mapState: MapState;
  className?: string;
}

interface SearchResult {
  feature: DemoGisFeature;
  layer: MapLayer;
  searchValue: string;
}

const geometryLabels = {
  point: 'Điểm',
  line: 'Đường',
  polygon: 'Vùng',
} as const;

function collectCoordinatePairs(
  value: unknown,
  coordinates: Array<[number, number]>,
) {
  if (!Array.isArray(value)) return;
  if (
    value.length >= 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number' &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  ) {
    coordinates.push([value[0], value[1]]);
    return;
  }
  value.forEach((item) => collectCoordinatePairs(item, coordinates));
}

function getFeatureTarget(
  feature: DemoGisFeature,
): [number, number, number] | null {
  const coordinates: Array<[number, number]> = [];
  if ('coordinates' in feature.geometry) {
    collectCoordinatePairs(feature.geometry.coordinates, coordinates);
  } else if (feature.geometry.type === 'GeometryCollection') {
    feature.geometry.geometries.forEach((geometry) => {
      if ('coordinates' in geometry) {
        collectCoordinatePairs(geometry.coordinates, coordinates);
      }
    });
  }
  if (coordinates.length === 0) return null;

  const longitudes = coordinates.map(([longitude]) => longitude);
  const latitudes = coordinates.map(([, latitude]) => latitude);
  const longitude =
    (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
  const latitude = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
  const layerId = feature.properties.layerId;
  const zoom =
    layerId === 'layer-commune'
      ? 13
      : feature.properties.objectType === 'point'
        ? 17
        : feature.properties.objectType === 'line'
          ? 16
          : 15;

  return [latitude, longitude, zoom];
}

function buildSearchValue(feature: DemoGisFeature, layer: MapLayer) {
  const detailValues = Object.entries(feature.properties.details ?? {}).flatMap(
    ([label, value]) => [label, value === null ? '' : String(value)],
  );
  return [
    String(feature.id),
    feature.properties.name,
    feature.properties.category,
    feature.properties.description,
    layer.name,
    ...detailValues,
  ]
    .filter(Boolean)
    .join(' ');
}

export function MapSearch({ mapState, className }: MapSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [features, setFeatures] = React.useState<DemoGisFeature[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const {
    activeLayerIds,
    currentRole,
    setFlyToCoords,
    setSelectedVillageCode,
    toggleLayer,
  } = mapState;

  React.useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const loadFeatures = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const collection = await fetchDemoGisFeatures(controller.signal);
        if (!controller.signal.aborted) {
          setFeatures(collection.features);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error
            ? error.message
            : 'Không thể tải dữ liệu tìm kiếm.';
        setLoadError(message);
        toast.error('Không thể tải dữ liệu tìm kiếm bản đồ.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadFeatures();
    return () => controller.abort();
  }, [open]);

  const groupedResults = React.useMemo(
    () =>
      GIS_LAYER_GROUPS.map((group) => {
        const layerIds = new Set(group.layers);
        const results = features.flatMap((feature): SearchResult[] => {
          const layer = MAP_LAYER_BY_ID.get(feature.properties.layerId);
          if (
            !layer ||
            !layerIds.has(layer.id) ||
            (layer.securityLevel === 'confidential' &&
              !layer.allowedRoles.includes(currentRole ?? ''))
          ) {
            return [];
          }
          return [
            {
              feature,
              layer,
              searchValue: buildSearchValue(feature, layer),
            },
          ];
        });
        return { ...group, results };
      }).filter((group) => group.results.length > 0),
    [currentRole, features],
  );

  function handleResult(result: SearchResult) {
    const target = getFeatureTarget(result.feature);
    if (!target) {
      toast.error('Đối tượng không có tọa độ hợp lệ.');
      return;
    }

    if (!activeLayerIds.includes(result.layer.id)) {
      toggleLayer(result.layer.id);
    }
    const villageCode = result.feature.properties.villageCode;
    if (
      (result.layer.id === 'layer-villages' ||
        result.layer.id === 'layer-village-labels') &&
      typeof villageCode === 'string'
    ) {
      setSelectedVillageCode(villageCode);
    }
    setFlyToCoords(target);
    setOpen(false);
    toast.success(`Đã định vị: ${result.feature.properties.name}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 cursor-pointer justify-start gap-2 border-border bg-background text-xs shadow-none xl:w-[300px] ${className ?? ''}`}
          aria-label="Tìm kiếm đối tượng trên bản đồ"
        >
          <Search className="size-3.5 text-muted-foreground" />
          <span className="hidden text-muted-foreground sm:inline">
            Tìm kiếm đối tượng...
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[1200] w-88 border-border bg-card p-0 shadow-xl"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Nhập tên, lớp, mô tả hoặc thông tin..."
            className="h-9 text-xs"
          />
          <CommandList className="max-h-96">
            <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
              {isLoading
                ? 'Đang tải dữ liệu...'
                : loadError
                  ? loadError
                  : 'Không tìm thấy đối tượng.'}
            </CommandEmpty>

            {!isLoading &&
              groupedResults.map((group) => (
                <CommandGroup
                  key={group.id}
                  heading={group.label}
                  className="[&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
                >
                  {group.results.map((result) => (
                    <CommandItem
                      key={String(result.feature.id)}
                      value={result.searchValue}
                      onSelect={() => handleResult(result)}
                      className="cursor-pointer gap-2 text-xs"
                    >
                      <MapLayerSymbol
                        geometryType={result.layer.geometryType}
                        styleConfig={result.layer.styleConfig}
                        className="size-3.5"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {result.feature.properties.name}
                        </span>
                        <span className="block truncate text-[9px] text-muted-foreground">
                          {result.layer.name}
                        </span>
                      </span>
                      <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[8px] text-muted-foreground">
                        {result.feature.properties.source === 'user'
                          ? 'POC'
                          : geometryLabels[result.feature.properties.objectType]}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
