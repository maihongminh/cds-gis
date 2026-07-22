export interface SystemSettings {
  communeName: string;
  provinceName: string;
  povertyIncomeThresholdMonthly: number; // e.g. 1,500,000 VND
  nearPovertyIncomeThresholdMonthly: number; // e.g. 2,000,000 VND
  dvmtrPaymentRatePerHa: number; // e.g. 400,000 VND/ha
  activeCultivationSeasonCode: string;
  allowSelfRegistration: boolean;
  systemBackupIntervalDays: number;
  updatedAt: string;
  updatedBy: string;
}
