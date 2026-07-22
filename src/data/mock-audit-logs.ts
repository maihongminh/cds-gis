// src/data/mock-audit-logs.ts

export interface AuditLog {
  id: string;
  userFullName: string;
  role: string;
  organization: string;
  action: 'access' | 'view' | 'create' | 'update' | 'delete' | 'import' | 'export' | 'submit' | 'approve' | 'return' | 'publish' | 'version_restore' | 'qp_an_access' | 'qp_an_export' | 'qp_an_2fa_challenge';
  module: string;
  entity: string;
  description: string;
  ipAddress: string;
  timestamp: string;
  result: 'success' | 'denied' | 'failed_2fa';
  targetFeatureCode?: string;
  reasonCode?: string;
}

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', userFullName: 'Nguyễn Văn A', role: 'admin', organization: 'UBND Xã Lao Bảo', action: 'create', module: 'agricultural', entity: 'Vùng trồng OCOP Vinh Dong', description: 'Khởi tạo vùng sản xuất lúa rẫy mới diện tích 4.5ha', ipAddress: '192.168.1.15', timestamp: '2026-07-14T08:15:22Z', result: 'success' },
  { id: 'log-2', userFullName: 'Trần Thị B', role: 'data_officer', organization: 'Trạm Y tế Lao Bảo', action: 'update', module: 'health', entity: 'Hồ sơ tiêm chủng Ka Tăng', description: 'Cập nhật số liệu tiêm chủng định kỳ tháng 07/2026', ipAddress: '192.168.1.28', timestamp: '2026-07-14T08:24:45Z', result: 'success' },
  { id: 'log-3', userFullName: 'Lê Văn C', role: 'unit_leader', organization: 'Sở GD-ĐT tỉnh Quảng Trị', action: 'approve', module: 'education', entity: 'Trường MN Ka Tăng', description: 'Phê duyệt hồ sơ cải tạo nâng cấp điểm trường mầm non', ipAddress: '10.0.4.12', timestamp: '2026-07-14T08:30:00Z', result: 'success' },
  { id: 'log-4', userFullName: 'Phạm Minh D', role: 'data_governance', organization: 'Phòng Thống kê UBND', action: 'export', module: 'reports', entity: 'Báo cáo tổng hợp KT-XH Quý 2', description: 'Kết xuất báo cáo PDF tổng hợp phục vụ giao ban HĐND', ipAddress: '192.168.1.50', timestamp: '2026-07-14T09:05:10Z', result: 'success' },
  // Dedicated QP-AN logs (DATA-SECDEF-07)
  { id: 'log-5', userFullName: 'Nguyễn Văn Biên', role: 'commune_leader', organization: 'UBND Xã Lao Bảo', action: 'qp_an_access', module: 'security_defense', entity: 'Mốc biên giới 605', description: 'Xem vị trí mốc tọa độ quốc phòng mốc 605', ipAddress: '192.168.2.1', timestamp: '2026-07-14T09:12:35Z', result: 'success', targetFeatureCode: 'feat-4', reasonCode: 'RC-INSPECT-MON' },
  { id: 'log-6', userFullName: 'Lê Văn Cường', role: 'admin', organization: 'UBND Xã Lao Bảo', action: 'qp_an_export', module: 'security_defense', entity: 'Bản đồ vùng cấm QP-AN', description: 'Trích xuất bản đồ phân vùng cấm thôn Ka Tăng', ipAddress: '192.168.2.15', timestamp: '2026-07-14T09:20:00Z', result: 'success', targetFeatureCode: 'feat-5', reasonCode: 'RC-BORDER-PATROL' },
  { id: 'log-7', userFullName: 'Trần Văn Dũng', role: 'data_officer', organization: 'Ban CHQS Xã Lao Bảo', action: 'qp_an_2fa_challenge', module: 'security_defense', entity: 'Vùng phòng thủ biên giới', description: 'Thử nghiệm xác thực 2FA truy cập CSDL quốc phòng', ipAddress: '192.168.2.30', timestamp: '2026-07-14T09:25:12Z', result: 'failed_2fa', targetFeatureCode: 'feat-5', reasonCode: 'RC-2FA-FAILED' },
  { id: 'log-8', userFullName: 'Hoàng Thị Thảo', role: 'unit_leader', organization: 'Sở GD-ĐT tỉnh Quảng Trị', action: 'qp_an_access', module: 'security_defense', entity: 'Mốc biên giới 605', description: 'Truy cập danh mục mốc biên giới quốc phòng', ipAddress: '10.0.4.99', timestamp: '2026-07-14T09:32:00Z', result: 'denied', targetFeatureCode: 'feat-4', reasonCode: 'RC-INSUFFICIENT-ROLE' },
];

export interface PeriodicSecurityReport {
  period: string;
  totalQPAccess: number;
  totalQPExport: number;
  totalDenied: number;
  failed2FA: number;
  byRole: Record<string, number>;
}

export const MOCK_SECURITY_REPORT: PeriodicSecurityReport = {
  period: 'Tháng 07/2026',
  totalQPAccess: 145,
  totalQPExport: 12,
  totalDenied: 8,
  failed2FA: 3,
  byRole: {
    admin: 42,
    commune_leader: 78,
    data_governance: 25,
    unit_leader: 12,
  }
};
