export interface IrrigationFacility {
  id: string;
  facilityCode: string;
  name: string;
  type: 'dam' | 'reservoir' | 'canal' | 'pumpingStation' | 'other';
  typeName: string; // e.g. "Đập dâng kiên cố", "Đập dâng tạm thời", "Kênh mương kiên cố", "Trạm bơm điện"
  villageCode: string;
  villageName: string;
  capacity: string; // e.g. "1200 m3/h", "300 m3", "1.5 km"
  irrigatedAreaHa: number; // Diện tích tưới phục vụ (ha)
  status: 'good' | 'needsRepair' | 'damaged';
  investedYear: number;
  managementUnitId: string;
  managementUnitName: string;
}

export interface IrrigationOperationRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  checkDate: string;
  inspectorName: string;
  operationStatus: 'stable' | 'issuesFound';
  issuesRecorded?: string;
  actionProposed?: string;
  status: 'resolved' | 'pending' | 'monitoring';
}

export interface IrrigationManagementUnit {
  id: string;
  name: string;
  type: 'cooperative' | 'villageGroup' | 'communeTeam' | 'other';
  typeName: string; // e.g. "Hợp tác xã Nông nghiệp", "Tổ quản lý thủy lợi thôn", "Ban quản lý Thủy lợi xã"
  contactPerson: string;
  phoneNumber: string;
  facilityCount: number;
}

export type IrrigationItem =
  | IrrigationFacility
  | IrrigationOperationRecord
  | IrrigationManagementUnit;

