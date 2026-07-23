'use client';

import * as React from 'react';
import { LoaderCircle, MapPin, Navigation, Search } from 'lucide-react';
import { toast } from 'sonner';

import type { MapState } from '@/components/map/map-client';
import {
  Button,
  Input,
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui';
import { BASE_LAYERS } from '@/lib/map-config';
import { cn } from '@/lib/utils';

interface LocationSearchResult {
  id: string;
  label: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
  zoom: number;
  score: number;
}

interface LocationSearchResponse {
  provider?: string;
  results?: LocationSearchResult[];
  error?: string;
}

interface MapLocationSearchProps {
  mapState: MapState;
  className?: string;
}

export function MapLocationSearch({
  mapState,
  className,
}: MapLocationSearchProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<LocationSearchResult[]>([]);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestControllerRef = React.useRef<AbortController | null>(null);

  const activeBaseLayer =
    BASE_LAYERS.find((layer) => layer.id === mapState.activeBaseLayerId) ??
    BASE_LAYERS[0];

  React.useEffect(
    () => () => {
      requestControllerRef.current?.abort();
    },
    [],
  );

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    requestControllerRef.current?.abort();
    setQuery(event.target.value);
    setResults([]);
    setError(null);
    setHasSearched(false);
    setIsLoading(false);
    setOpen(false);
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
      toast.error('Hãy nhập ít nhất 2 ký tự để tìm địa điểm.');
      return;
    }

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setResults([]);
    setOpen(true);

    try {
      const response = await fetch(
        `/gis-source/location-search?q=${encodeURIComponent(normalizedQuery)}`,
        { signal: controller.signal },
      );
      const data = (await response.json()) as LocationSearchResponse;
      if (!response.ok) {
        throw new Error(data.error ?? `HTTP ${response.status}`);
      }
      if (!controller.signal.aborted) {
        setResults(data.results ?? []);
      }
    } catch (searchError) {
      if (
        !controller.signal.aborted &&
        !(searchError instanceof DOMException && searchError.name === 'AbortError')
      ) {
        setError(
          searchError instanceof Error
            ? searchError.message
            : 'Không thể tìm kiếm địa điểm.',
        );
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }

  function handleSelect(result: LocationSearchResult) {
    setQuery(result.address);
    setOpen(false);
    mapState.setSelectedVillageCode(null);
    mapState.setLocationSearchMarker({
      label: result.label,
      latitude: result.latitude,
      longitude: result.longitude,
    });
    mapState.setFlyToCoords([
      result.latitude,
      result.longitude,
      result.zoom,
    ]);
    toast.success(`Đã định vị: ${result.label}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <form
          onSubmit={handleSearch}
          className={cn(
            'flex h-8 w-52 min-w-0 shrink-0 lg:w-60 2xl:w-72',
            className,
          )}
          role="search"
          aria-label={`Tìm địa điểm trên ${activeBaseLayer.name}`}
        >
          <div className="relative min-w-0 flex-1">
            <MapPin className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={handleQueryChange}
              onFocus={() => {
                if (hasSearched || isLoading || error) setOpen(true);
              }}
              className="h-8 rounded-r-none border-r-0 bg-background pr-2 pl-8 text-xs shadow-none focus-visible:z-10"
              placeholder={`Tìm trên ${activeBaseLayer.name}...`}
              title={`Tìm địa điểm trên ${activeBaseLayer.name}`}
              autoComplete="off"
              maxLength={120}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-8 rounded-l-none px-2.5 shadow-none"
            disabled={isLoading}
            aria-label="Tìm vị trí"
            title="Tìm vị trí"
          >
            {isLoading ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <Search className="size-3.5" />
            )}
          </Button>
        </form>
      </PopoverAnchor>

      <PopoverContent
        align="end"
        className="w-[min(25rem,calc(100vw-1.25rem))] overflow-hidden border-border bg-card p-0 shadow-xl"
      >
        <div className="border-b border-border px-3 py-2.5">
          <p className="truncate text-xs font-semibold">
            Kết quả trên {activeBaseLayer.name}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Tìm kiếm địa danh và địa chỉ tại Việt Nam
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto p-1.5">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 px-3 py-8 text-xs text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin text-primary" />
              Đang tìm địa điểm...
            </div>
          )}

          {!isLoading && error && (
            <p className="px-3 py-7 text-center text-xs text-destructive">
              {error}
            </p>
          )}

          {!isLoading && !error && hasSearched && results.length === 0 && (
            <p className="px-3 py-7 text-center text-xs text-muted-foreground">
              Không tìm thấy địa điểm phù hợp.
            </p>
          )}

          {!isLoading &&
            !error &&
            results.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Navigation className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium">
                    {result.label}
                  </span>
                  {result.address !== result.label && (
                    <span className="mt-0.5 block line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                      {result.address}
                    </span>
                  )}
                </span>
                <span className="mt-1 shrink-0 rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                  {result.type}
                </span>
              </button>
            ))}
        </div>

        <div className="border-t border-border px-3 py-1.5 text-[9px] text-muted-foreground">
          Nguồn định vị: Esri World Geocoding Service
        </div>
      </PopoverContent>
    </Popover>
  );
}
