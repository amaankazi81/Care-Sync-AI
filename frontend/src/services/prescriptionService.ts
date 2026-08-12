// src/services/prescriptionService.ts

import dotnetApi from '@/lib/dotnetApi';
import { Prescription } from '@/types/Prescription';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreatePrescriptionRequest {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  medicines: string;
  instructions: string;
  followUpDate: string | null;
}

export interface UpdatePrescriptionRequest {
  diagnosis: string;
  medicines: string;
  instructions: string;
  followUpDate: string | null;
}

class PrescriptionService {

  // ============================================================
  // GET PRESCRIPTIONS
  // ============================================================

  async getPrescriptions(): Promise<Prescription[]> {

    const response =
      await dotnetApi.get<ApiResponse<Prescription[]>>(
        '/prescriptions'
      );

    return response.data.data || [];
  }

  // ============================================================
  // GET PRESCRIPTION BY ID
  // ============================================================

  async getPrescriptionById(
    id: string
  ): Promise<Prescription> {

    if (!id) {
      throw new Error(
        'Prescription ID is required.'
      );
    }

    const response =
      await dotnetApi.get<ApiResponse<Prescription>>(
        `/prescriptions/${id}`
      );

    if (!response.data.data) {
      throw new Error(
        'Prescription data was not returned by the server.'
      );
    }

    return response.data.data;
  }

  // ============================================================
  // CREATE PRESCRIPTION
  // ============================================================

  async createPrescription(
    data: CreatePrescriptionRequest
  ): Promise<Prescription> {

    if (!data.appointmentId) {
      throw new Error(
        'Appointment ID is required.'
      );
    }

    if (!data.patientId) {
      throw new Error(
        'Patient ID is required.'
      );
    }

    if (!data.doctorId) {
      throw new Error(
        'Doctor ID is required.'
      );
    }

    const requestBody = {
      appointmentId: data.appointmentId,
      patientId: data.patientId,
      doctorId: data.doctorId,
      diagnosis: data.diagnosis,
      medicines: data.medicines,
      instructions: data.instructions,
      followUpDate: data.followUpDate
        ? `${data.followUpDate}T00:00:00.000Z`
        : null,
    };

    const response =
      await dotnetApi.post<ApiResponse<Prescription>>(
        '/prescriptions',
        requestBody
      );

    if (!response.data.data) {
      throw new Error(
        'Prescription was created but no data was returned.'
      );
    }

    return response.data.data;
  }

  // ============================================================
  // UPDATE PRESCRIPTION
  // ============================================================

  async updatePrescription(
    id: string,
    data: UpdatePrescriptionRequest
  ): Promise<Prescription | null> {

    if (!id) {
      throw new Error(
        'Prescription ID is required.'
      );
    }

    const requestBody = {
      diagnosis: data.diagnosis,
      medicines: data.medicines,
      instructions: data.instructions,
      followUpDate: data.followUpDate
        ? `${data.followUpDate}T00:00:00.000Z`
        : null,
    };

    const response =
      await dotnetApi.put<ApiResponse<Prescription>>(
        `/prescriptions/${id}`,
        requestBody
      );

    return response.data?.data || null;
  }

  // ============================================================
  // DELETE PRESCRIPTION
  // ============================================================

  async deletePrescription(
    id: string
  ): Promise<void> {

    if (!id) {
      throw new Error(
        'Prescription ID is required.'
      );
    }

    await dotnetApi.delete(
      `/prescriptions/${id}`
    );
  }
}

export default new PrescriptionService();