import { SystemSettings } from '@/types/settings';

export const MOCK_SETTINGS: SystemSettings = {
  communeName: 'Xã Lao Bảo',
  provinceName: 'Tỉnh Quảng Trị',
  povertyIncomeThresholdMonthly: 1500000, // 1.5 million VND / person / month
  nearPovertyIncomeThresholdMonthly: 2000000, // 2.0 million VND / person / month
  dvmtrPaymentRatePerHa: 400000, // 400,000 VND / ha / year
  activeCultivationSeasonCode: '2026-XH', // Spring-Summer season 2026
  allowSelfRegistration: false,
  systemBackupIntervalDays: 7,
  updatedAt: '2026-06-15T08:00:00Z',
  updatedBy: 'admin',
};
