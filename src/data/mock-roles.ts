// src/data/mock-roles.ts

import { UserRole } from '@/types';

export interface SystemRoleDefinition {
  code: UserRole;
  name: string;
  description: string;
  isActive: boolean;
}

export const MOCK_ROLES: SystemRoleDefinition[] = [
  {
    code: "admin",
    name: "Quản trị viên (Admin)",
    description: "Quản trị toàn bộ tài khoản, quyền truy cập, nhật ký hệ thống và cấu hình tích hợp.",
    isActive: true
  },
  {
    code: "data_officer",
    name: "Cán bộ nhập liệu (Data Entry Officer)",
    description: "Tạo, sửa và gửi phê duyệt các báo cáo thuộc lĩnh vực đơn vị phụ trách.",
    isActive: true
  },
  {
    code: "unit_leader",
    name: "Lãnh đạo đơn vị (Unit Leader)",
    description: "Review, ký duyệt hoặc trả lại các báo cáo dữ liệu của cấp dưới trực thuộc đơn vị.",
    isActive: true
  },
  {
    code: "data_governance",
    name: "Cán bộ Văn phòng UBND (Data Governance)",
    description: "Thẩm định chất lượng dữ liệu toàn kho, quản lý biểu mẫu và thực hiện công bố dữ liệu dùng chung.",
    isActive: true
  },
  {
    code: "commune_leader",
    name: "Lãnh đạo xã (Commune Leader)",
    description: "Xem toàn bộ dashboard chỉ tiêu, báo cáo phân tích, bản đồ GIS chuyên đề để giám sát.",
    isActive: true
  }
];
