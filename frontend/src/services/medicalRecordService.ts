import dotnetApi from '@/lib/dotnetApi';

import type {
  MedicalRecord,
  CreateMedicalRecordRequest,
  UpdateMedicalRecordRequest,
} from '@/types/MedicalRecord';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const medicalRecordService = {
  // ============================================================
  // GET ALL
  // ============================================================

  async getMedicalRecords(): Promise<MedicalRecord[]> {
    const response = await dotnetApi.get<ApiResponse<MedicalRecord[]>>('/medicalrecords');

    return response.data.data || [];
  },

  // ============================================================
  // GET PATIENT MEDICAL RECORDS
  // ============================================================

  async getPatientMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    if (!patientId) {
      throw new Error('Patient ID is required.');
    }

    const response = await dotnetApi.get<ApiResponse<MedicalRecord[]>>(
      `/medicalrecords/patient/${patientId}`
    );

    return response.data.data || [];
  },

  // ============================================================
  // GET BY ID
  // ============================================================

  async getMedicalRecordById(id: string): Promise<MedicalRecord> {
    if (!id) {
      throw new Error('Medical record ID is required.');
    }

    const response = await dotnetApi.get<ApiResponse<MedicalRecord>>(`/medicalrecords/${id}`);

    if (!response.data.data) {
      throw new Error('Medical record data was not returned.');
    }

    return response.data.data;
  },

  // ============================================================
  // CREATE
  // ============================================================

  async createMedicalRecord(data: CreateMedicalRecordRequest): Promise<MedicalRecord> {
    const response = await dotnetApi.post<ApiResponse<MedicalRecord>>('/medicalrecords', data);

    if (!response.data.data) {
      throw new Error('Medical record was created but no data was returned.');
    }

    return response.data.data;
  },

  // ============================================================
  // UPDATE
  // ============================================================

  async updateMedicalRecord(id: string, data: UpdateMedicalRecordRequest): Promise<MedicalRecord> {
    await dotnetApi.put(`/medicalrecords/${id}`, data);

    return this.getMedicalRecordById(id);
  },

  // ============================================================
  // DELETE
  // ============================================================

  async deleteMedicalRecord(id: string): Promise<void> {
    await dotnetApi.delete(`/medicalrecords/${id}`);
  },
};

export default medicalRecordService;
