'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

import { Button } from '@/components/ui';
import type { MapState } from '@/components/map/map-client';

export function WeatherTimeline({ mapState }: { mapState: MapState }) {
  const {
    weatherData,
    weatherForecastIndex,
    setWeatherForecastIndex,
  } = mapState;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const hours = React.useMemo(
    () => weatherData?.forecastHours ?? [],
    [weatherData?.forecastHours],
  );
  const maximumIndex = Math.max(0, hours.length - 1);
  const dayGroups = React.useMemo(() => {
    const groups: Array<{
      key: string;
      label: string;
      date: string;
      startIndex: number;
    }> = [];
    hours.forEach((hour, index) => {
      const value = new Date(hour);
      const key = `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
      const current = groups.at(-1);
      if (current?.key === key) {
        return;
      }
      groups.push({
        key,
        label: value.toLocaleDateString('vi-VN', { weekday: 'long' }),
        date: value.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
        }),
        startIndex: index,
      });
    });
    return groups;
  }, [hours]);

  React.useEffect(() => {
    if (!isPlaying || hours.length < 2) return;
    const timer = window.setInterval(() => {
      setWeatherForecastIndex((current) =>
        current >= maximumIndex ? 0 : current + 1,
      );
    }, 900);
    return () => window.clearInterval(timer);
  }, [hours.length, isPlaying, maximumIndex, setWeatherForecastIndex]);

  React.useEffect(() => {
    if (weatherForecastIndex <= maximumIndex) return;
    setWeatherForecastIndex(maximumIndex);
  }, [maximumIndex, setWeatherForecastIndex, weatherForecastIndex]);

  const selectedTime = hours[weatherForecastIndex];
  const selectedDayKey = selectedTime
    ? (() => {
        const value = new Date(selectedTime);
        return `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
      })()
    : '';

  return (
    <div className="absolute right-2.5 bottom-7 left-2.5 z-1000 rounded-xl border border-border/70 bg-card/92 px-3 py-2 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon-xs"
          variant="outline"
          onClick={() => setIsPlaying((current) => !current)}
          disabled={hours.length < 2}
          aria-label={isPlaying ? 'Tạm dừng thời gian' : 'Phát dự báo'}
        >
          {isPlaying ? (
            <Pause className="size-3.5" />
          ) : (
            <Play className="size-3.5" />
          )}
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setWeatherForecastIndex(Math.max(0, weatherForecastIndex - 1))
          }
          disabled={weatherForecastIndex === 0}
          aria-label="Mốc dự báo trước"
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <input
          type="range"
          min="0"
          max={maximumIndex}
          step="1"
          value={Math.min(weatherForecastIndex, maximumIndex)}
          onChange={(event) =>
            setWeatherForecastIndex(Number(event.target.value))
          }
          disabled={hours.length === 0}
          className="h-1.5 min-w-0 flex-1 cursor-pointer accent-primary"
          aria-label="Thời gian dự báo"
        />
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setWeatherForecastIndex(
              Math.min(maximumIndex, weatherForecastIndex + 1),
            )
          }
          disabled={weatherForecastIndex >= maximumIndex}
          aria-label="Mốc dự báo tiếp theo"
        >
          <ChevronRight className="size-3.5" />
        </Button>
        <div className="w-36 shrink-0 text-right max-sm:w-24">
          <p className="text-[10px] font-bold text-foreground">
            {selectedTime
              ? new Date(selectedTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '--:--'}
          </p>
          <p className="text-[8px] text-muted-foreground">
            {selectedTime
              ? new Date(selectedTime).toLocaleDateString('vi-VN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                })
              : 'Đang tải dữ liệu'}
          </p>
        </div>
      </div>
      {dayGroups.length > 0 && (
        <div className="mt-1.5 flex overflow-hidden rounded-md border border-border/50 bg-background/45">
          {dayGroups.map((day) => (
            <button
              key={day.key}
              type="button"
              onClick={() => setWeatherForecastIndex(day.startIndex)}
              className={`min-w-0 flex-1 border-r border-border/50 px-2 py-1 text-center text-[8px] transition-colors last:border-r-0 ${
                selectedDayKey === day.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="font-semibold capitalize">{day.label}</span>{' '}
              <span>{day.date}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
