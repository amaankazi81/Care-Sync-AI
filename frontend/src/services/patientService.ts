import dotnetApi from '@/lib/dotnetApi';

import {
  Patient,
  PatientApiResponse,
  PatientResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '@/types/Patient';

const BASE_URL = '/patients';

const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    const response =
      await dotnetApi.get<PatientApiResponse>(BASE_URL);

    return response.data.data;
  },

  getPatientById: async (
    id: string
  ): Promise<Patient> => {
    const response =
      await dotnetApi.get<PatientResponse>(
        `${BASE_URL}/${id}`
      );

    return response.data.data;
  },

  createPatient: async (
    patient: CreatePatientRequest
  ) => {
    const response =
      await dotnetApi.post(BASE_URL, patient);

    return response.data;
  },

  updatePatient: async (
    id: string,
    patient: UpdatePatientRequest
  ) => {
    const response =
      await dotnetApi.put(
        `${BASE_URL}/${id}`,
        patient
      );

    return response.data;
  },

  deletePatient: async (id: string) => {
    const response =
      await dotnetApi.delete(
        `${BASE_URL}/${id}`
      );

    return response.data;
  },
};

export default patientService;