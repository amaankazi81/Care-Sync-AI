import dotnetApi from '@/lib/dotnetApi';

import {
  Doctor,
  DoctorApiResponse,
  DoctorResponse,
  CreateDoctorRequest,
  UpdateDoctorRequest,
} from '@/types/Doctor';

const BASE_URL = '/doctors';

const doctorService = {
  // --------------------------------------------------
  // GET ALL DOCTORS
  // --------------------------------------------------

  getDoctors: async (): Promise<Doctor[]> => {
    const response =
      await dotnetApi.get<DoctorApiResponse>(
        BASE_URL
      );

    return response.data.data || [];
  },

  // --------------------------------------------------
  // GET DOCTOR BY ID
  // --------------------------------------------------

  getDoctorById: async (
    id: string
  ): Promise<Doctor> => {
    const response =
      await dotnetApi.get<DoctorResponse>(
        `${BASE_URL}/${id}`
      );

    return response.data.data;
  },

  // --------------------------------------------------
  // GET AVAILABLE DOCTORS
  // --------------------------------------------------

  getAvailableDoctors: async (): Promise<Doctor[]> => {
    const response =
      await dotnetApi.get<DoctorApiResponse>(
        `${BASE_URL}?available=true`
      );

    return response.data.data || [];
  },

  // --------------------------------------------------
  // SEARCH DOCTORS
  // --------------------------------------------------

  searchDoctors: async (
    search: string
  ): Promise<Doctor[]> => {
    const response =
      await dotnetApi.get<DoctorApiResponse>(
        `${BASE_URL}?search=${encodeURIComponent(search)}`
      );

    return response.data.data || [];
  },

  // --------------------------------------------------
  // GET DOCTORS BY DEPARTMENT
  // --------------------------------------------------

  getDoctorsByDepartment: async (
    departmentId: string
  ): Promise<Doctor[]> => {
    const response =
      await dotnetApi.get<DoctorApiResponse>(
        `${BASE_URL}?departmentId=${departmentId}`
      );

    return response.data.data || [];
  },

  // --------------------------------------------------
  // CREATE DOCTOR
  // --------------------------------------------------

  createDoctor: async (
    doctor: CreateDoctorRequest
  ) => {
    const response =
      await dotnetApi.post(
        BASE_URL,
        doctor
      );

    return response.data;
  },

  // --------------------------------------------------
  // UPDATE DOCTOR
  // --------------------------------------------------

  updateDoctor: async (
    id: string,
    doctor: UpdateDoctorRequest
  ) => {
    const response =
      await dotnetApi.put(
        `${BASE_URL}/${id}`,
        doctor
      );

    return response.data;
  },

  // --------------------------------------------------
  // DELETE DOCTOR
  // --------------------------------------------------

  deleteDoctor: async (
    id: string
  ) => {
    const response =
      await dotnetApi.delete(
        `${BASE_URL}/${id}`
      );

    return response.data;
  },
};

export default doctorService;