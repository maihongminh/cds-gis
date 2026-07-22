export interface DisasterEvent {
  id: string;
  eventCode: string;
  disasterType: 'landslide' | 'flashFlood' | 'storm' | 'frost' | 'drought' | 'other';
  eventDate: string;
  affectedHamlets: string[]; // names of affected hamlets
  severity: 'low' | 'medium' | 'high';
  estimatedDamageVnd: number;
  status: 'active' | 'resolved' | 'processing';
  note?: string;
}

export interface WeatherMonthlyRecord {
  id: string;
  year: number;
  month: number;
  averageTemperature: number;
  rainfallMm: number;
  humidityPercentage: number;
  sunshineHours: number;
  source: string;
  note?: string;
}

export interface AgricultureRiskAlert {
  id: string;
  alertCode: string;
  riskType: string; // e.g. "Sương muối kéo dài", "Ngập úng lúa rẫy", "Đột biến sâu hại sâm"
  affectedCropTypeCodes: string[];
  affectedHamlets: string[];
  severity: 'info' | 'warning' | 'critical';
  recommendations: string;
  status: 'active' | 'archived';
  publishDate: string;
}

export type ClimateItem =
  | DisasterEvent
  | WeatherMonthlyRecord
  | AgricultureRiskAlert;
