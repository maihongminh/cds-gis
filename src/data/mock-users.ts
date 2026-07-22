// src/data/mock-users.ts

import { User } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: "user-admin",
    username: "admin",
    fullName: "Nguyễn Văn Trị",
    role: "admin",
    email: "admin.laobao@quangtri.gov.vn",
    phone: "0988776655",
    isActive: true,
    lastLogin: "2026-07-14T08:00:00Z",
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2026-07-14T08:00:00Z",
    organizationUnitId: "unit-ubnd",
    scope: {
      organizationUnitIds: ["unit-ubnd", "unit-eco", "unit-culture", "unit-police", "unit-military", "unit-medical", "unit-services"],
      allowedDataGroups: ["administrative_population", "economy", "tourism_services", "land_planning", "agriculture_environment", "education_health", "social_welfare", "security_defense", "disaster_emergency"],
      allowedVillageCodes: ["all"],
      maxSecurityLevel: "confidential"
    }
  },
  {
    id: "user-officer-eco",
    username: "data_officer",
    fullName: "Hồ Văn Đang",
    role: "data_officer",
    email: "officer.eco@laobao.gov.vn",
    phone: "0912345678",
    isActive: true,
    lastLogin: "2026-07-14T08:15:00Z",
    createdAt: "2025-01-12T09:00:00Z",
    updatedAt: "2026-07-14T08:15:00Z",
    organizationUnitId: "unit-eco",
    scope: {
      organizationUnitIds: ["unit-eco"],
      allowedDataGroups: ["economy", "agriculture_environment"],
      allowedVillageCodes: ["trieu-phuoc", "tan-kim", "tan-phuoc", "ka-tang"], // Limited villages for demo
      maxSecurityLevel: "shared"
    }
  },
  {
    id: "user-leader-eco",
    username: "unit_leader",
    fullName: "Lê Hoàng Việt",
    role: "unit_leader",
    email: "leader.eco@laobao.gov.vn",
    phone: "0905999888",
    isActive: true,
    lastLogin: "2026-07-14T07:45:00Z",
    createdAt: "2025-01-05T08:00:00Z",
    updatedAt: "2026-07-14T07:45:00Z",
    organizationUnitId: "unit-eco",
    scope: {
      organizationUnitIds: ["unit-eco"],
      allowedDataGroups: ["economy", "agriculture_environment"],
      allowedVillageCodes: ["all"],
      maxSecurityLevel: "shared"
    }
  },
  {
    id: "user-governance",
    username: "data_governance",
    fullName: "Trần Thị Vy",
    role: "data_governance",
    email: "governance.vp@laobao.gov.vn",
    phone: "0934567890",
    isActive: true,
    lastLogin: "2026-07-14T08:05:00Z",
    createdAt: "2025-02-01T08:00:00Z",
    updatedAt: "2026-07-14T08:05:00Z",
    organizationUnitId: "unit-ubnd",
    scope: {
      organizationUnitIds: ["unit-ubnd", "unit-eco", "unit-culture", "unit-police", "unit-military", "unit-medical", "unit-services"],
      allowedDataGroups: ["administrative_population", "economy", "tourism_services", "land_planning", "agriculture_environment", "education_health", "social_welfare", "security_defense", "disaster_emergency"],
      allowedVillageCodes: ["all"],
      maxSecurityLevel: "confidential"
    }
  },
  {
    id: "user-leader-commune",
    username: "commune_leader",
    fullName: "Hồ Văn Linh",
    role: "commune_leader",
    email: "president.laobao@quangtri.gov.vn",
    phone: "0905111222",
    isActive: true,
    lastLogin: "2026-07-14T07:30:00Z",
    createdAt: "2025-01-01T08:00:00Z",
    updatedAt: "2026-07-14T07:30:00Z",
    organizationUnitId: "unit-ubnd",
    scope: {
      organizationUnitIds: ["unit-ubnd", "unit-eco", "unit-culture", "unit-police", "unit-military", "unit-medical", "unit-services"],
      allowedDataGroups: ["administrative_population", "economy", "tourism_services", "land_planning", "agriculture_environment", "education_health", "social_welfare", "security_defense", "disaster_emergency"],
      allowedVillageCodes: ["all"],
      maxSecurityLevel: "confidential"
    }
  }
];
