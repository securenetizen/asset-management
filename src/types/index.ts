export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'manager' | 'admin';
  department: string;
}

export interface Requisition {
  id: string;
  title: string;
  description: string;
  items: RequisitionItem[];
  totalCost: number;
  status: RequisitionStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  processingNotes?: string;
}

export interface RequisitionItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  estimatedCost: number;
  justification: string;
}

export type RequisitionStatus = 
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'completed';

export interface RequisitionFormData {
  title: string;
  description: string;
  items: {
    name: string;
    description: string;
    quantity: number;
    estimatedCost: number;
    justification: string;
  }[];
}

export interface ApprovalAction {
  requisitionId: string;
  action: 'approve' | 'reject';
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}