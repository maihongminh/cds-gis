import { NextResponse } from 'next/server';

import {
  createWeatherGridCoordinates,
  REGIONAL_WEATHER_GRID,
  WEATHER_DATASET_VERSION,
  WEATHER_FORECAST_HOURS,
  WEATHER_REFRESH_SECONDS,
} from '@/lib/weather-config';
import type {
  WeatherForecastData,
  WeatherGridPoint,
} from '@/types/weather';

// Next.js requires this route segment value to be a statically analyzable literal.
export const revalidate = 3600;
export const dynamic = 'force-dynamic';

interface OpenMeteoLocationResponse {
  latitude?: number;
  longitude?: number;
  elevation?: number;
  timezone?: string;
  hourly?: {
    time?: string[];
    temperature_2m?: Array<number | null>;
    precipitation?: Array<number | null>;
    wind_speed_10m?: Array<number | null>;
    wind_direction_10m?: Array<number | null>;
    cloud_cover?: Array<number | null>;
  };
}

interface WeatherRuntimeCache {
  data: WeatherForecastData | null;
  fetchedAt: number;
  version?: string;
}

const weatherGlobal = globalThis as typeof globalThis & {
  __cdsWeatherCache?: WeatherRuntimeCache;
};
const weatherRuntimeCache =
  weatherGlobal.__cdsWeatherCache ??
  (weatherGlobal.__cdsWeatherCache = { data: null, fetchedAt: 0 });

function weatherResponse(data: WeatherForecastData, stale = false) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      ...(stale ? { 'X-Weather-Data': 'stale' } : {}),
    },
  });
}

function normalizeValues(
  values: Array<number | null> | undefined,
  length: number,
) {
  return Array.from({ length }, (_, index) => {
    const value = values?.[index];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  });
}

export async function GET() {
  if (
    weatherRuntimeCache.data &&
    weatherRuntimeCache.version === WEATHER_DATASET_VERSION &&
    Date.now() - weatherRuntimeCache.fetchedAt < WEATHER_REFRESH_SECONDS * 1000
  ) {
    return weatherResponse(weatherRuntimeCache.data);
  }
  const grid = REGIONAL_WEATHER_GRID;
  const coordinates = createWeatherGridCoordinates(grid);
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set(
    'latitude',
    coordinates.map((coordinate) => coordinate.latitude).join(','),
  );
  url.searchParams.set(
    'longitude',
    coordinates.map((coordinate) => coordinate.longitude).join(','),
  );
  url.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'precipitation',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
  );
  url.searchParams.set('forecast_hours', String(WEATHER_FORECAST_HOURS));
  url.searchParams.set('timezone', 'Asia/Ho_Chi_Minh');
  url.searchParams.set('temperature_unit', 'celsius');
  url.searchParams.set('precipitation_unit', 'mm');
  url.searchParams.set('wind_speed_unit', 'kmh');

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: WEATHER_REFRESH_SECONDS },
    });
    if (!response.ok) {
      const upstreamMessage = (await response.text()).slice(0, 240);
      throw new Error(
        `Open-Meteo phản hồi HTTP ${response.status}${upstreamMessage ? `: ${upstreamMessage}` : '.'}`,
      );
    }

    const payload = (await response.json()) as
      | OpenMeteoLocationResponse
      | OpenMeteoLocationResponse[];
    const locations = Array.isArray(payload) ? payload : [payload];
    const forecastHours = locations[0]?.hourly?.time ?? [];
    if (forecastHours.length === 0) {
      throw new Error('Nguồn dự báo không trả về mốc thời gian hợp lệ.');
    }

    const points: WeatherGridPoint[] = locations.flatMap((location, index) => {
      const requestedCoordinate = coordinates[index];
      const latitude = requestedCoordinate?.latitude ?? location.latitude;
      const longitude = requestedCoordinate?.longitude ?? location.longitude;
      if (
        typeof latitude !== 'number' ||
        typeof longitude !== 'number' ||
        !location.hourly
      ) {
        return [];
      }

      return [
        {
          latitude,
          longitude,
          elevation:
            typeof location.elevation === 'number' ? location.elevation : null,
          temperature: normalizeValues(
            location.hourly.temperature_2m,
            forecastHours.length,
          ),
          precipitation: normalizeValues(
            location.hourly.precipitation,
            forecastHours.length,
          ),
          windSpeed: normalizeValues(
            location.hourly.wind_speed_10m,
            forecastHours.length,
          ),
          windDirection: normalizeValues(
            location.hourly.wind_direction_10m,
            forecastHours.length,
          ),
          cloudCover: normalizeValues(
            location.hourly.cloud_cover,
            forecastHours.length,
          ),
        },
      ];
    });

    if (points.length === 0) {
      throw new Error('Nguồn dự báo không trả về điểm lưới hợp lệ.');
    }

    const result: WeatherForecastData = {
      source: 'open-meteo',
      attribution: 'Weather data by Open-Meteo.com · CC BY 4.0',
      generatedAt: new Date().toISOString(),
      timezone: locations[0]?.timezone ?? 'Asia/Ho_Chi_Minh',
      model: 'Open-Meteo Best Match',
      forecastHours,
      grid,
      points,
    };
    weatherRuntimeCache.data = result;
    weatherRuntimeCache.fetchedAt = Date.now();
    weatherRuntimeCache.version = WEATHER_DATASET_VERSION;
    return weatherResponse(result);
  } catch (error) {
    if (weatherRuntimeCache.data) {
      return weatherResponse(weatherRuntimeCache.data, true);
    }
    const message =
      error instanceof Error ? error.message : 'Không thể tải dữ liệu thời tiết.';
    return NextResponse.json(
      {
        error: 'Không thể tải dữ liệu dự báo thời tiết.',
        detail: message,
      },
      {
        status: message.includes('HTTP 429') ? 503 : 502,
        headers: message.includes('HTTP 429')
          ? { 'Retry-After': '60' }
          : undefined,
      },
    );
  }
}
