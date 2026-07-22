export type ForestDvmtrPaymentStatus = 'paid' | 'pending' | 'partially_paid';
export type ForestDvmtrStatus = 'active' | 'inactive';

export interface ForestDvmtrRecord {
  id: string;
  householdId: string;
  householdCode: string;
  householdHeadName: string;
  contractCode: string;
  forestBlock: string;
  contractedAreaHa: number;
  paymentRatePerHa: number;
  totalAmount: number;
  paymentYear: number;
  paymentStatus: ForestDvmtrPaymentStatus;
  paymentDate?: string;
  status: ForestDvmtrStatus;
  createdAt: string;
  updatedAt: string;
}
