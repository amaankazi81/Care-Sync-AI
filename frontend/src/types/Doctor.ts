export interface Doctor {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  gender: string;

  specialization: string;

  qualification: string;

  experience: number;

  roomNumber: string;

  isAvailable: boolean;

  departmentId: string;
}

export interface DoctorApiResponse {
  success: boolean;

  message: string;

  data: Doctor[];
}

export interface DoctorResponse {
  success: boolean;

  message: string;

  data: Doctor;
}

export interface CreateDoctorRequest {
  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  gender: string;

  specialization: string;

  qualification: string;

  experience: number;

  roomNumber: string;

  isAvailable: boolean;

  departmentId: string;
}

export interface UpdateDoctorRequest {
  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  gender: string;

  specialization: string;

  qualification: string;

  experience: number;

  roomNumber: string;

  isAvailable: boolean;

  departmentId: string;
}