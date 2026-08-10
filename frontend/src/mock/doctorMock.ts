import { Doctor } from '@/types/Doctor';

export const doctors: Doctor[] = [
  {
    id: 'DOC-001',
    name: 'Dr. Amit Patel',
    specialization: 'Cardiologist',
    department: 'Cardiology',
    room: 'Room 204',
    availableSlots: 8,
    bookedSlots: 6,
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    status: 'AVAILABLE',
  },

  {
    id: 'DOC-002',
    name: 'Dr. Priya Shah',
    specialization: 'Neurologist',
    department: 'Neurology',
    room: 'Room 305',
    availableSlots: 6,
    bookedSlots: 6,
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    status: 'BUSY',
  },

  {
    id: 'DOC-003',
    name: 'Dr. Raj Mehta',
    specialization: 'Orthopedic',
    department: 'Orthopedics',
    room: 'Room 112',
    availableSlots: 5,
    bookedSlots: 2,
    startTime: '09:30 AM',
    endTime: '02:30 PM',
    status: 'AVAILABLE',
  },

  {
    id: 'DOC-004',
    name: 'Dr. Sneha Joshi',
    specialization: 'Dermatologist',
    department: 'Dermatology',
    room: 'Room 410',
    availableSlots: 0,
    bookedSlots: 0,
    startTime: '-',
    endTime: '-',
    status: 'OFFLINE',
  },
];
