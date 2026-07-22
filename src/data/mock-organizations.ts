// src/data/mock-organizations.ts

import { OrganizationUnit } from '@/types';

export const MOCK_ORGANIZATIONS: OrganizationUnit[] = [
  {
    id: "unit-ubnd",
    code: "VP-UBND",
    name: "Văn phòng HĐND và UBND xã",
    description: "Bộ phận tổng hợp, điều phối chung các hoạt động hành chính cấp xã.",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z"
  },
  {
    id: "unit-eco",
    code: "P-KT",
    name: "Phòng Kinh tế",
    description: "Quản lý kinh tế, tài chính, đầu tư, thương mại và phát triển nông thôn.",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z"
  },
  {
    id: "unit-culture",
    code: "P-VHXH",
    name: "Phòng Văn hóa - Xã hội",
    description: "Phụ trách các lĩnh vực văn hóa, thể thao, lao động, thương binh và xã hội.",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z"
  },
  {
    id: "unit-police",
    code: "CA-XA",
    name: "Công an xã",
    description: "Bảo đảm an ninh trật tự, an toàn xã hội và đăng ký cư trú địa bàn.",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z"
  },
  {
    id: "unit-military",
    code: "QS-XA",
    name: "Ban Chỉ huy Quân sự xã",
    description: "Quản lý lực lượng dân quân tự vệ, tuyển chọn gọi công dân nhập ngũ và quốc phòng địa phương.",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z"
  },
  {
    id: "unit-medical",
    code: "TYT-XA",
    name: "Trạm Y tế xã",
    description: "Chăm sóc sức khỏe ban đầu, tiêm chủng và theo dõi dịch bệnh dân sinh.",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z"
  },
  {
    id: "unit-services",
    code: "TT-DVTH",
    name: "Trung tâm Dịch vụ tổng hợp",
    description: "Dịch vụ công ích, quản lý chợ, thu gom xử lý rác thải và hạ tầng.",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z"
  }
];
