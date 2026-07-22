// src/types/organization.ts

export interface OrganizationUnit {
  id: string;
  code: string; // e.g. "VP-UBND", "P-KT"
  name: string; // e.g. "Văn phòng HĐND và UBND xã", "Phòng Kinh tế"
  parentId?: string; // For hierarchical structures
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
