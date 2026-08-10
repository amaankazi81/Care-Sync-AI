export interface PatientPrescription {
  id: string;
  appointmentId: string;
  doctorName: string;
  department: string;
  prescriptionDate: string;
  diagnosis: string;
  medicines: string[];
  followUpDate: string;
}
