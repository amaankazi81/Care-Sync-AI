// src/types/Appointment.ts

export type AppointmentStatus =
  | 'BOOKED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Appointment {
  id: string;

  appointmentNumber: string;

  appointmentDate: string;

  appointmentTime: string;

  status: AppointmentStatus;

  patientId: string;

  patientName: string | null;

  doctorId: string;

  doctorName: string | null;

  department: string | null;

  reason: string;

  notes: string | null;

  createdAt: string;

  updatedAt: string | null;
}

export interface CreateAppointmentRequest {
  patientId: string;

  doctorId: string;

  appointmentDate: string;

  appointmentTime: string;

  reason: string;

  notes?: string;
}

export interface UpdateAppointmentRequest {
  patientId?: string;

  doctorId?: string;

  appointmentDate?: string;

  appointmentTime?: string;

  reason?: string;

  notes?: string;

  status?: AppointmentStatus;
}

export interface AppointmentApiResponse {
  success: boolean;
  message: string;
  data: Appointment[];
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment;
}