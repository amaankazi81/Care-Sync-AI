import { PatientPrescription } from '@/types/PatientPrescription';

export const patientPrescriptions: PatientPrescription[] = [
  {
    id: 'PR-1001',
    appointmentId: 'APT-2018',
    doctorName: 'Dr. Amit Patel',
    department: 'Cardiology',
    prescriptionDate: '26 Jul 2026',
    diagnosis: 'Hypertension',
    medicines: ['Amlodipine 5mg', 'Ecosprin 75mg', 'Vitamin D'],
    followUpDate: '10 Aug 2026',
  },

  {
    id: 'PR-1002',
    appointmentId: 'APT-1987',
    doctorName: 'Dr. Meera Shah',
    department: 'General Medicine',
    prescriptionDate: '18 Jul 2026',
    diagnosis: 'Viral Fever',
    medicines: ['Paracetamol', 'Vitamin C', 'ORS'],
    followUpDate: '25 Jul 2026',
  },

  {
    id: 'PR-1003',
    appointmentId: 'APT-1944',
    doctorName: 'Dr. Rajesh Kumar',
    department: 'Orthopedics',
    prescriptionDate: '04 Jul 2026',
    diagnosis: 'Knee Pain',
    medicines: ['Pain Relief Gel', 'Calcium Tablets'],
    followUpDate: '20 Jul 2026',
  },
];
