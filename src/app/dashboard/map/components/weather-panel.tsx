'use client';

import * as React from 'react';
import {
  CloudRain,
  LoaderCircle,
  RefreshCw,
  Thermometer,
  Wind,
} from 'lucide-react';

import { Button } from '@/components/ui';
import type { MapState } from '@/components/map/map-client';
import {
  interpolateWeatherValue,
  WEATHER_LAYER_BY_ID,
  WEATHER_LAYERS,
} from '@/lib/weather-config';
import { cn } from '@/lib/utils';
import type { WeatherLayerId } from '@/types/weather';

const WEATHER_ICONS = {
  temperature: Thermometer,
  precipitation: CloudRain,
  wind: Wind,
} satisfies Record<WeatherLayerId, React.ElementType>;

function formatValue(value: number | null | undefined, digits = 1) {
  return typeof value === 'number'
    ? value.toLocaleString('vi-VN', { maximumFractionDigits: digits })
    : '—';
}

export function WeatherPanel({ mapState }: { mapState: MapState }) {
  const {
    weatherData,
    weatherError,
    weatherForecastIndex,
    weatherIsLoading,
    weatherLayerId,
    weatherOpacity,
    weatherSelectedCoordinates,
    reloadWeather,
    setWeatherLayerId,
    setWeatherOpacity,
  } = mapState;
  const selectedValues = React.useMemo(() => {
    if (!weatherData || !weatherSelectedCoordinates) return null;
    const [longitude, latitude] = weatherSelectedCoordinates;
    return {
      temperature: interpolateWeatherValue(
        weatherData,
        'temperature',
        weatherForecastIndex,
        longitude,
        latitude,
      ),
      precipitation: interpolateWeatherValue(
        weatherData,
        'precipitation',
        weatherForecastIndex,
        longitude,
        latitude,
      ),
      windSpeed: interpolateWeatherValue(
        weatherData,
        'windSpeed',
        weatherForecastIndex,
        longitude,
        latitude,
      ),
    };
  }, [weatherData, weatherForecastIndex, weatherSelectedCoordinates]);
  const forecastTime = weatherData?.forecastHours[weatherForecastIndex];
  const selectedLayer = WEATHER_LAYER_BY_ID.get(weatherLayerId);

  return (
    <div className="absolute top-17 left-2.5 z-1000 w-[19rem] max-w-[calc(100%-1.25rem)] overflow-hidden rounded-xl border border-border/70 bg-card/92 p-2.5 shadow-lg backdrop-blur-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Wind className="size-3.5 text-primary" />
            Khí tượng – thời tiết
          </p>
          <p className="mt-0.5 text-[8px] text-muted-foreground">
            {weatherSelectedCoordinates
              ? `${weatherSelectedCoordinates[1].toFixed(4)}, ${weatherSelectedCoordinates[0].toFixed(4)}`
              : 'Click một vị trí trên bản đồ để xem chỉ số'}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={reloadWeather}
          disabled={weatherIsLoading}
          title="Tải lại dữ liệu"
          aria-label="Tải lại dữ liệu thời tiết"
        >
          <RefreshCw
            className={cn('size-3.5', weatherIsLoading && 'animate-spin')}
          />
        </Button>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1">
        {WEATHER_LAYERS.map((layer) => {
          const Icon = WEATHER_ICONS[layer.id];
          const isActive = weatherLayerId === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setWeatherLayerId(layer.id)}
              className={cn(
                'flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md border px-1.5 text-[9px] font-semibold transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background/70 text-foreground hover:bg-muted',
              )}
              title={layer.description}
            >
              <Icon className="size-3.5" />
              {layer.shortName}
            </button>
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-border/60 bg-background/65 px-2.5 py-2">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[7px] uppercase text-muted-foreground">Nhiệt độ</p>
            <p className="text-[11px] font-bold text-red-600">
              {formatValue(selectedValues?.temperature)}°
            </p>
          </div>
          <div>
            <p className="text-[7px] uppercase text-muted-foreground">Mưa</p>
            <p className="text-[11px] font-bold text-blue-600">
              {formatValue(selectedValues?.precipitation)} mm
            </p>
          </div>
          <div>
            <p className="text-[7px] uppercase text-muted-foreground">Gió</p>
            <p className="text-[11px] font-bold text-emerald-600">
              {formatValue(selectedValues?.windSpeed, 0)} km/h
            </p>
          </div>
        </div>
        <div className="border-l border-border/60 pl-2 text-right">
          <p className="text-[8px] font-semibold text-foreground">
            {forecastTime
              ? new Date(forecastTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '--:--'}
          </p>
          <p className="text-[7px] text-muted-foreground">
            {forecastTime
              ? new Date(forecastTime).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                })
              : 'Đang tải'}
          </p>
        </div>
      </div>

      <label className="mt-2 flex items-center gap-2 text-[8px] font-medium text-muted-foreground">
        <span className="shrink-0">Độ phủ</span>
        <input
          type="range"
          min="0.25"
          max="0.95"
          step="0.05"
          value={weatherOpacity}
          onChange={(event) => setWeatherOpacity(Number(event.target.value))}
          className="h-1 min-w-0 flex-1 cursor-pointer accent-primary"
          aria-label="Độ trong suốt lớp thời tiết"
        />
        <strong className="w-7 text-right text-foreground">
          {Math.round(weatherOpacity * 100)}%
        </strong>
      </label>

      {weatherIsLoading && !weatherData && (
        <div className="mt-2 flex items-center gap-2 text-[9px] text-muted-foreground">
          <LoaderCircle className="size-3 animate-spin text-primary" />
          Đang tải dự báo...
        </div>
      )}
      {weatherError && (
        <div className="mt-2 rounded-md border border-destructive/30 bg-destructive/8 px-2 py-1.5 text-[8px] text-destructive">
          {weatherError}
        </div>
      )}
      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-border/40 pt-1.5">
        <p className="truncate text-[7px] text-muted-foreground" title={selectedLayer?.description}>
          {selectedLayer?.description}
        </p>
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-[7px] text-primary hover:underline"
        >
          Open-Meteo
        </a>
      </div>
    </div>
  );
}
