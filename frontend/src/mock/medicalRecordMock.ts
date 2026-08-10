import { MedicalRecord } from '@/types/MedicalRecord';

export const medicalRecords: MedicalRecord[] = [
  {
    id: 'MR-1001',
    patientId: 'PAT-001',
    doctorName: 'Dr. Amit Patel',
    department: 'Cardiology',
    visitDate: '26 Jul 2026',
    diagnosis: 'Hypertension',
    prescription: 'Amlodipine 5mg',
    remarks: 'Follow-up after 15 days',
  },
  {
    id: 'MR-1002',
    patientId: 'PAT-001',
    doctorName: 'Dr. Meera Shah',
    department: 'General Medicine',
    visitDate: '18 Jul 2026',
    diagnosis: 'Viral Fever',
    prescription: 'Paracetamol',
    remarks: 'Take proper rest',
  },
  {
    id: 'MR-1003',
    patientId: 'PAT-001',
    doctorName: 'Dr. Rajesh Kumar',
    department: 'Orthopedics',
    visitDate: '04 Jul 2026',
    diagnosis: 'Knee Pain',
    prescription: 'Pain Relief Gel',
    remarks: 'Physiotherapy recommended',
  },
];
