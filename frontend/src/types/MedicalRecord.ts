export interface MedicalRecord {
  id: string;

  appointmentId: string;

  patientName: string;

  doctorName: string;

  department: string;

  visitDate: string;

  diagnosis: string;

  symptoms: string;

  treatment: string;

  doctorNotes: string;
}

export interface CreateMedicalRecordRequest {
  appointmentId: string;

  visitDate: string;

  diagnosis: string;

  symptoms: string;

  treatment: string;

  doctorNotes: string;
}

export interface UpdateMedicalRecordRequest {
  visitDate: string;

  diagnosis: string;

  symptoms: string;

  treatment: string;

  doctorNotes: string;
}