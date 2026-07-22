export interface WasteRecord {
  id: string;
  villageCode: string;
  villageName: string;
  year: number;
  month: number;
  totalWasteTons: number;
  organicWasteTons: number;
  inorganicWasteTons: number;
  hazardousWasteTons: number;
  collectedTons: number;
  note?: string;
}

export interface WasteClassificationRecord {
  id: string;
  villageCode: string;
  villageName: string;
  householdCount: number;
  classifiedCount: number; // number of households classifying waste
  notClassifiedCount: number;
  year: number;
  month: number;
}

export interface WasteTreatmentHouseholdRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  villageCode: string;
  villageName: string;
  treatmentMethod: 'centralized' | 'selfTreatmentOrganic' | 'bury' | 'burn' | 'other';
  hasClassification: boolean;
  registeredDate: string;
}

export interface EnvironmentRegistrationRecord {
  id: string;
  businessName: string;
  ownerName: string;
  villageCode: string;
  villageName: string;
  businessType: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  officerInCharge: string;
}

export interface EnvironmentPermit {
  id: string;
  permitNumber: string;
  businessName: string;
  villageCode: string;
  villageName: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface EnvironmentViolation {
  id: string;
  violationCode: string;
  offenderName: string; // business name or household head name
  violationType: string; // e.g. "xả thải trái phép", "đốt rác bừa bãi"
  villageCode: string;
  villageName: string;
  recordedDate: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'resolved' | 'processing';
}

export interface EnvironmentComplaint {
  id: string;
  complaintCode: string;
  complainantName: string;
  villageCode: string;
  villageName: string;
  description: string;
  receivedDate: string;
  status: 'received' | 'processing' | 'resolved';
  resolutionNote?: string;
  dueDate: string;
}

export interface EnvironmentPenalty {
  id: string;
  penaltyNumber: string;
  offenderName: string;
  violationId: string;
  fineAmountVnd: number;
  paymentStatus: 'paid' | 'unpaid';
  issueDate: string;
}

export interface EnvironmentTraining {
  id: string;
  topic: string;
  trainingDate: string;
  location: string;
  attendeeTarget: string;
  attendeeCount: number;
  resultRating: 'excellent' | 'good' | 'average';
}

export type EnvironmentItem =
  | WasteRecord
  | EnvironmentRegistrationRecord
  | EnvironmentPermit
  | EnvironmentViolation
  | EnvironmentPenalty
  | EnvironmentComplaint
  | EnvironmentTraining;

