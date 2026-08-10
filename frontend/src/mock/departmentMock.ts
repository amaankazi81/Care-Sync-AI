import { Department } from '@/types/Department';

export const departments: Department[] = [
  {
    id: 'DEP-001',
    name: 'Cardiology',
    description: 'Heart related treatments',
    hod: 'Dr. Amit Patel',
    doctors: 8,
    location: '2nd Floor',
  },

  {
    id: 'DEP-002',
    name: 'Neurology',
    description: 'Brain & Nervous System',
    hod: 'Dr. Priya Shah',
    doctors: 6,
    location: '3rd Floor',
  },

  {
    id: 'DEP-003',
    name: 'Orthopedics',
    description: 'Bones & Joints',
    hod: 'Dr. Raj Mehta',
    doctors: 5,
    location: '1st Floor',
  },
];
