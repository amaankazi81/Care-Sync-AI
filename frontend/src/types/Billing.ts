// src/types/Billing.ts

export type BillingPaymentStatus =
  | 'Paid'
  | 'Pending'
  | 'Cancelled'
  | 'Partially Paid'
  | string;

export interface Billing {
  id: string;

  appointmentId: string;

  invoiceNumber: string;

  patientName: string;

  doctorName: string;

  consultationFee: number;

  medicineCharges: number;

  labCharges: number;

  otherCharges: number;

  totalAmount: number;

  paidAmount: number;

  dueAmount: number;

  paymentStatus: BillingPaymentStatus;

  paymentMethod: string;

  billDate: string;
}

/*
 * ==========================================================
 * CREATE BILLING REQUEST
 * ==========================================================
 */

export interface CreateBillingRequest {
  appointmentId: string;

  consultationFee: number;

  medicineCharges: number;

  labCharges: number;

  otherCharges: number;

  paidAmount: number;

  paymentMethod: string;
}

/*
 * ==========================================================
 * UPDATE BILLING REQUEST
 * ==========================================================
 */

export interface UpdateBillingRequest {
  consultationFee?: number;

  medicineCharges?: number;

  labCharges?: number;

  otherCharges?: number;

  paidAmount?: number;

  paymentMethod?: string;

  paymentStatus?: string;
}

/*
 * ==========================================================
 * API RESPONSES
 * ==========================================================
 */

export interface BillingApiResponse {
  success: boolean;

  message: string;

  data: Billing[];
}

export interface BillingResponse {
  success: boolean;

  message: string;

  data: Billing;
}