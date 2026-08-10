import { Patient } from '@/types/Patient';

export const receptionistPatients: Patient[] = [
  {
    id: 'pat-001',
    patientId: 'PAT-1001',
    firstName: 'Rahul',
    lastName: 'Sharma',
    age: 45,
    gender: 'Male',
    phone: '9876543210',
    email: 'rahul@gmail.com',
    bloodGroup: 'O+',
    address: 'Mumbai',
    status: 'ACTIVE',
    lastVisit: '2026-07-20',
  },

  {
    id: 'pat-002',
    patientId: 'PAT-1002',
    firstName: 'Sneha',
    lastName: 'Kulkarni',
    age: 32,
    gender: 'Female',
    phone: '9988776655',
    email: 'sneha@gmail.com',
    bloodGroup: 'A+',
    address: 'Pune',
    status: 'ACTIVE',
    lastVisit: '2026-07-25',
  },

  {
    id: 'pat-003',
    patientId: 'PAT-1003',
    firstName: 'Vijay',
    lastName: 'More',
    age: 60,
    gender: 'Male',
    phone: '8899776655',
    email: 'vijay@gmail.com',
    bloodGroup: 'B+',
    address: 'Nashik',
    status: 'INACTIVE',
    lastVisit: '2026-06-10',
  },
];
