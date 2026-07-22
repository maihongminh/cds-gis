export interface SecurityIncidentRecord {
  id: string;
  incidentCode: string;
  year: number;
  month: number;
  incidentType: string; // e.g. "Trộm cắp tài sản", "Gây rối trật tự công cộng", "Tranh chấp đất đai"
  severity: 'low' | 'medium' | 'high';
  villageCode: string;
  villageName: string;
  description: string;
  reporterName: string;
  handlerName: string;
  status: 'resolved' | 'processing' | 'pending';
  recordedDate: string;
  resolutionNote?: string;
}

export interface DefenseStatisticRecord {
  id: string;
  year: number;
  milForceCount: number; // Lực lượng dân quân tự vệ
  youthEnlistedCount: number; // Thanh niên nhập ngũ
  trainingClassCount: number; // Lớp huấn luyện quốc phòng
  trainingAttendeeCount: number; // Số người huấn luyện
  patrolCount: number; // Số lượt tuần tra địa bàn
  budgetDefenseVnd: number; // Ngân sách quốc phòng địa phương
  note?: string;
}

export interface SocialIssueRecord {
  id: string;
  issueCode: string;
  year: number;
  month: number;
  issueType: string; // e.g. "Nghiện chất kích thích", "Tệ nạn cờ bạc", "Bạo lực gia đình", "Tảo hôn"
  villageCode: string;
  villageName: string;
  affectedCount: number;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'underMonitoring' | 'resolved';
  handlerDepartment: string;
  recordedDate: string;
  resolutionNote?: string;
}

export type SecurityDefenseItem =
  | SecurityIncidentRecord
  | DefenseStatisticRecord
  | SocialIssueRecord;

