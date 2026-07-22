export type ReportType = 'excel' | 'pdf' | 'word';
export type ReportModule = 
  | 'general' 
  | 'household' 
  | 'crop' 
  | 'livestock' 
  | 'land' 
  | 'economy' 
  | 'forest'
  | 'crop-change'
  | 'environment'
  | 'water-resources'
  | 'housing'
  | 'business-households'
  | 'socio-economic'
  | 'irrigation'
  | 'transportation';
export type ReportStatus = 'completed' | 'processing' | 'failed';

export interface ReportTemplate {
  id: string;
  code: string;
  title: string;
  description: string;
  module: ReportModule;
  supportedFormats: ReportType[];
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  templateCode: string;
  title: string;
  type: ReportType;
  module: ReportModule;
  description: string;
  generatedBy: string;
  generatedAt: string;
  fileUrl?: string;
  fileSize?: string;
  status: ReportStatus;
}
