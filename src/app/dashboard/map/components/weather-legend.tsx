'use client';

import { Eye } from 'lucide-react';

import type { MapState } from '@/components/map/map-client';
import {
  PRECIPITATION_LEGEND,
  TEMPERATURE_LEGEND,
  WEATHER_LAYER_BY_ID,
  WIND_LEGEND,
} from '@/lib/weather-config';

export function WeatherLegend({ mapState }: { mapState: MapState }) {
  const definitions =
    mapState.weatherLayerId === 'temperature'
      ? TEMPERATURE_LEGEND
      : mapState.weatherLayerId === 'precipitation'
        ? PRECIPITATION_LEGEND
        : WIND_LEGEND;
  const layer = WEATHER_LAYER_BY_ID.get(mapState.weatherLayerId);
  const gradient = `linear-gradient(90deg, ${definitions
    .map((definition) => definition.color)
    .join(', ')})`;

  return (
    <div className="rounded-lg border border-border/60 bg-card/88 px-2.5 py-2 shadow-sm backdrop-blur-md">
      <div className="mb-1.5 flex items-center justify-between text-[8px] font-semibold text-foreground">
        <span className="flex items-center gap-1">
          <Eye className="size-2.5 text-primary" />
          {layer?.name}
        </span>
        <span className="text-muted-foreground">{layer?.unit}</span>
      </div>
      <div
        className="h-2.5 rounded-full border border-white/30"
        style={{ background: gradient }}
      />
      <div className="mt-1 flex justify-between gap-1 text-[7px] text-muted-foreground">
        {definitions.map((definition) => (
          <span key={definition.label}>{definition.label}</span>
        ))}
      </div>
    </div>
  );
}
