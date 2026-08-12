export interface Prescription {
  id: string;

  appointmentId: string;

  patientName: string;

  doctorName: string;

  diagnosis: string;

  medicines: string;

  instructions: string;

  followUpDate: string | null;
}