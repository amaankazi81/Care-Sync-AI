import { Billing } from '@/types/Billing';

export const billingMock: Billing[] = [
  {
    id: '1',
    invoiceNo: 'INV-1001',
    hospital: 'CityCare Hospital',
    doctorName: 'Dr. Amit Patel',
    amount: 2500,
    status: 'PAID',
    billDate: '26 Jul 2026',
  },
  {
    id: '2',
    invoiceNo: 'INV-1002',
    hospital: 'Apollo Clinic',
    doctorName: 'Dr. Meera Shah',
    amount: 4200,
    status: 'PENDING',
    billDate: '18 Jul 2026',
  },
  {
    id: '3',
    invoiceNo: 'INV-1003',
    hospital: 'Metro Hospital',
    doctorName: 'Dr. Rajesh Kumar',
    amount: 1800,
    status: 'PAID',
    billDate: '05 Jul 2026',
  },
  {
    id: '4',
    invoiceNo: 'INV-1004',
    hospital: 'CityCare Hospital',
    doctorName: 'Dr. Amit Patel',
    amount: 3200,
    status: 'CANCELLED',
    billDate: '28 Jun 2026',
  },
];
