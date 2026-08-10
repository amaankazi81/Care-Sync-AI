export interface Patient {
  id: string;

  firstName: string;

  lastName: string;

  dateOfBirth: string;

  gender: string;

  bloodGroup: string;

  email: string;

  phone: string;

  address: string;

  emergencyContactName: string;

  emergencyContactNumber: string;
}

export interface PatientApiResponse {
  success: boolean;
  message: string;
  data: Patient[];
}

export interface PatientResponse {
  success: boolean;
  message: string;
  data: Patient;
}

export interface CreatePatientRequest {
  firstName: string;

  lastName: string;

  dateOfBirth: string;

  gender: string;

  bloodGroup: string;

  email: string;

  phone: string;

  address: string;

  emergencyContactName: string;

  emergencyContactNumber: string;
}

export interface UpdatePatientRequest {
  firstName: string;

  lastName: string;

  dateOfBirth: string;

  gender: string;

  bloodGroup: string;

  email: string;

  phone: string;

  address: string;

  emergencyContactName: string;

  emergencyContactNumber: string;
}