export type MapMode = 'gis' | 'weather';

export type WeatherLayerId = 'temperature' | 'precipitation' | 'wind';

export interface WeatherGridPoint {
  latitude: number;
  longitude: number;
  elevation: number | null;
  temperature: Array<number | null>;
  precipitation: Array<number | null>;
  windSpeed: Array<number | null>;
  windDirection: Array<number | null>;
  cloudCover: Array<number | null>;
}

export interface WeatherForecastData {
  source: 'open-meteo';
  attribution: string;
  generatedAt: string;
  timezone: string;
  model: string;
  forecastHours: string[];
  grid: {
    rows: number;
    columns: number;
    west: number;
    south: number;
    east: number;
    north: number;
  };
  points: WeatherGridPoint[];
}
