import type { WeatherForecastData, WeatherLayerId } from '@/types/weather';

export const WEATHER_MAP_MODE_ID = 'weather-map';
export const WEATHER_FORECAST_HOURS = 72;
export const WEATHER_REFRESH_SECONDS = 60 * 60;
export const WEATHER_DATASET_VERSION = 'southeast-asia-v1';

// Regional coverage around Vietnam: mainland Southeast Asia, the East Sea,
// Malaysia, the Philippines and southern China.
export const REGIONAL_WEATHER_GRID = {
  rows: 11,
  columns: 15,
  west: 95,
  south: -5,
  east: 130,
  north: 30,
} as const;

export interface WeatherLayerDefinition {
  id: WeatherLayerId;
  name: string;
  shortName: string;
  unit: string;
  description: string;
}

export const WEATHER_LAYERS: WeatherLayerDefinition[] = [
  {
    id: 'temperature',
    name: 'Nhiệt độ',
    shortName: 'Nhiệt độ',
    unit: '°C',
    description: 'Nhiệt độ không khí ở độ cao 2 m',
  },
  {
    id: 'precipitation',
    name: 'Lượng mưa',
    shortName: 'Mưa',
    unit: 'mm',
    description: 'Tổng lượng mưa dự báo trong giờ',
  },
  {
    id: 'wind',
    name: 'Gió',
    shortName: 'Gió',
    unit: 'km/h',
    description: 'Tốc độ và hướng gió ở độ cao 10 m',
  },
];

export const WEATHER_LAYER_BY_ID = new Map(
  WEATHER_LAYERS.map((layer) => [layer.id, layer]),
);

export const TEMPERATURE_LEGEND = [
  { label: '≤ 18°C', color: '#313695' },
  { label: '19–22°C', color: '#4575b4' },
  { label: '23–26°C', color: '#74add1' },
  { label: '27–30°C', color: '#fee090' },
  { label: '31–34°C', color: '#f46d43' },
  { label: '≥ 35°C', color: '#a50026' },
] as const;

export const PRECIPITATION_LEGEND = [
  { label: 'Không mưa', color: '#e2e8f0' },
  { label: '0,1–1 mm', color: '#7dd3fc' },
  { label: '1–5 mm', color: '#38bdf8' },
  { label: '5–15 mm', color: '#2563eb' },
  { label: '15–30 mm', color: '#7c3aed' },
  { label: '> 30 mm', color: '#be123c' },
] as const;

export const WIND_LEGEND = [
  { label: '≤ 10 km/h', color: '#22c55e' },
  { label: '11–20 km/h', color: '#84cc16' },
  { label: '21–30 km/h', color: '#eab308' },
  { label: '31–50 km/h', color: '#f97316' },
  { label: '> 50 km/h', color: '#dc2626' },
] as const;

function interpolateHexColor(
  value: number,
  stops: ReadonlyArray<readonly [number, string]>,
) {
  const lowerIndex = stops.findLastIndex(([threshold]) => value >= threshold);
  if (lowerIndex < 0) return stops[0][1];
  if (lowerIndex >= stops.length - 1) return stops.at(-1)![1];
  const [lowerValue, lowerColor] = stops[lowerIndex];
  const [upperValue, upperColor] = stops[lowerIndex + 1];
  const ratio = Math.max(
    0,
    Math.min(1, (value - lowerValue) / (upperValue - lowerValue)),
  );
  const parse = (color: string) => [1, 3, 5].map((index) =>
    Number.parseInt(color.slice(index, index + 2), 16),
  );
  const lowerRgb = parse(lowerColor);
  const upperRgb = parse(upperColor);
  return `#${lowerRgb
    .map((channel, index) =>
      Math.round(channel + (upperRgb[index] - channel) * ratio)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

export function getTemperatureColor(value: number) {
  return interpolateHexColor(value, [
    [14, '#313695'],
    [19, '#4575b4'],
    [23, '#74add1'],
    [27, '#fee090'],
    [31, '#f46d43'],
    [36, '#a50026'],
  ]);
}

export function getPrecipitationColor(value: number) {
  return interpolateHexColor(value, [
    [0, '#e2e8f0'],
    [0.1, '#7dd3fc'],
    [1, '#38bdf8'],
    [5, '#2563eb'],
    [15, '#7c3aed'],
    [30, '#be123c'],
  ]);
}

export function getWindColor(value: number) {
  return interpolateHexColor(value, [
    [0, '#22c55e'],
    [10, '#84cc16'],
    [20, '#eab308'],
    [35, '#f97316'],
    [55, '#dc2626'],
  ]);
}

export type WeatherSeriesKey =
  | 'temperature'
  | 'precipitation'
  | 'windSpeed'
  | 'windDirection';

export function interpolateWeatherValue(
  weatherData: WeatherForecastData,
  series: WeatherSeriesKey,
  forecastIndex: number,
  longitude: number,
  latitude: number,
) {
  const { rows, columns, west, south, east, north } = weatherData.grid;
  if (
    longitude < west ||
    longitude > east ||
    latitude < south ||
    latitude > north
  ) {
    return null;
  }
  const gridX = ((longitude - west) / (east - west)) * (columns - 1);
  const gridY = ((latitude - south) / (north - south)) * (rows - 1);
  const column0 = Math.floor(gridX);
  const column1 = Math.min(columns - 1, column0 + 1);
  const row0 = Math.floor(gridY);
  const row1 = Math.min(rows - 1, row0 + 1);
  const xRatio = gridX - column0;
  const yRatio = gridY - row0;
  const valueAt = (row: number, column: number) =>
    weatherData.points[row * columns + column]?.[series][forecastIndex] ?? null;
  const values = [
    valueAt(row0, column0),
    valueAt(row0, column1),
    valueAt(row1, column0),
    valueAt(row1, column1),
  ];
  if (values.some((value) => value === null)) return null;
  const [topLeft, topRight, bottomLeft, bottomRight] = values as number[];
  const top = topLeft + (topRight - topLeft) * xRatio;
  const bottom = bottomLeft + (bottomRight - bottomLeft) * xRatio;
  return top + (bottom - top) * yRatio;
}

export function createWeatherGridCoordinates(
  grid = REGIONAL_WEATHER_GRID,
) {
  const longitudeStep =
    (grid.east - grid.west) / (grid.columns - 1);
  const latitudeStep =
    (grid.north - grid.south) / (grid.rows - 1);

  return Array.from(
    { length: grid.rows * grid.columns },
    (_, index) => {
      const row = Math.floor(index / grid.columns);
      const column = index % grid.columns;
      return {
        latitude: Number(
          (grid.south + row * latitudeStep).toFixed(5),
        ),
        longitude: Number(
          (grid.west + column * longitudeStep).toFixed(5),
        ),
      };
    },
  );
}
