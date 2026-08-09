'use client';

import * as React from 'react';

import { WEATHER_DATASET_VERSION } from '@/lib/weather-config';
import type { WeatherForecastData } from '@/types/weather';

interface WeatherApiError {
  error?: string;
  detail?: string;
}

export function useWeatherForecast(enabled: boolean) {
  const [data, setData] = React.useState<WeatherForecastData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadToken, setReloadToken] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let retryTimer: number | null = null;
    setIsLoading(true);
    setError(null);

    void fetch(
      `/weather-api/forecast?dataset=${encodeURIComponent(WEATHER_DATASET_VERSION)}`,
      {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      },
    )
      .then(async (response) => {
        const payload = (await response.json()) as
          | WeatherForecastData
          | WeatherApiError;
        if (!response.ok || 'error' in payload) {
          const apiError = payload as WeatherApiError;
          throw new Error(
            apiError.detail || apiError.error || 'Không thể tải dự báo.',
          );
        }
        return payload as WeatherForecastData;
      })
      .then((forecast) => {
        if (!controller.signal.aborted) setData(forecast);
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Không thể tải dữ liệu thời tiết.';
        setError(message);
        if (message.includes('HTTP 429')) {
          retryTimer = window.setTimeout(() => {
            setReloadToken((current) => current + 1);
          }, 61_000);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => {
      controller.abort();
      if (retryTimer !== null) window.clearTimeout(retryTimer);
    };
  }, [enabled, reloadToken]);

  const reload = React.useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  return { data, isLoading, error, reload };
}
