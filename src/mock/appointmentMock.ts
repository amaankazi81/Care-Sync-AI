import { Appointment } from '@/types/Appointment';

export const appointments: Appointment[] = [
  {
    id: '1',
    appointmentNumber: 'APT-2018',
    appointmentDate: '26 Jul 2026',
    appointmentTime: '10:30 AM',
    status: 'COMPLETED',

    patientId: 'PAT-001',
    patientName: 'Rahul Sharma',

    doctorId: 'DOC-001',
    doctorName: 'Dr. Amit Patel',

    department: 'Cardiology',

    reason: 'Chest pain and regular cardiac consultation',

    notes: 'Patient has previous cardiac history.',

    createdAt: '2026-07-26',
    updatedAt: '2026-07-26',
  },

  {
    id: '2',
    appointmentNumber: 'APT-1987',
    appointmentDate: '18 Jul 2026',
    appointmentTime: '11:15 AM',
    status: 'COMPLETED',

    patientId: 'PAT-002',
    patientName: 'Sneha Kulkarni',

    doctorId: 'DOC-002',
    doctorName: 'Dr. Meera Shah',

    department: 'General Medicine',

    reason: 'General fever and weakness',

    notes: 'Medication prescribed for 5 days.',

    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  {
    id: '3',
    appointmentNumber: 'APT-1944',
    appointmentDate: '05 Jul 2026',
    appointmentTime: '09:00 AM',
    status: 'COMPLETED',

    patientId: 'PAT-003',
    patientName: 'Vijay More',

    doctorId: 'DOC-003',
    doctorName: 'Dr. Rajesh Kumar',

    department: 'Orthopedics',

    reason: 'Knee pain consultation',

    notes: 'Physiotherapy suggested.',

    createdAt: '2026-07-05',
    updatedAt: '2026-07-05',
  },

  {
    id: '4',
    appointmentNumber: 'APT-1898',
    appointmentDate: '27 Jun 2026',
    appointmentTime: '04:00 PM',
    status: 'CANCELLED',

    patientId: 'PAT-004',
    patientName: 'Anita Joshi',

    doctorId: 'DOC-004',
    doctorName: 'Dr. Neha Joshi',

    department: 'Dermatology',

    reason: 'Skin allergy consultation',

    notes: 'Appointment cancelled by patient.',

    createdAt: '2026-06-27',
    updatedAt: '2026-06-27',
  },

  {
    id: '5',
    appointmentNumber: 'APT-2052',
    appointmentDate: '30 Jul 2026',
    appointmentTime: '10:30 AM',
    status: 'BOOKED',

    patientId: 'PAT-005',
    patientName: 'Kiran Patil',

    doctorId: 'DOC-001',
    doctorName: 'Dr. Amit Patel',

    department: 'Cardiology',

    reason: 'Follow-up consultation',

    notes: 'Waiting for doctor confirmation.',

    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
];

export const appointmentMock = appointments;
