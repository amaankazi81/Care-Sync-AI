import dotnetApi from '@/lib/dotnetApi';

import {
  Appointment,
  AppointmentApiResponse,
  AppointmentResponse,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '@/types/Appointment';

const BASE_URL = '/appointments';

const appointmentService = {
  //---------------------------------------
  // GET ALL
  //---------------------------------------

  async getAppointments(): Promise<Appointment[]> {
    const response =
      await dotnetApi.get<AppointmentApiResponse>(
        BASE_URL
      );

    return response.data.data;
  },

  //---------------------------------------
  // GET BY ID
  //---------------------------------------

  async getAppointmentById(
    id: string
  ): Promise<Appointment> {
    const response =
      await dotnetApi.get<AppointmentResponse>(
        `${BASE_URL}/${id}`
      );

    return response.data.data;
  },

  //---------------------------------------
  // CREATE
  //---------------------------------------

  async createAppointment(
    appointment: CreateAppointmentRequest
  ) {
    const response =
      await dotnetApi.post(
        BASE_URL,
        appointment
      );

    return response.data;
  },

  //---------------------------------------
  // UPDATE FULL APPOINTMENT
  //---------------------------------------

  async updateAppointment(
    id: string,
    appointment: UpdateAppointmentRequest
  ) {
    const response =
      await dotnetApi.put(
        `${BASE_URL}/${id}`,
        appointment
      );

    return response.data;
  },

  //---------------------------------------
  // UPDATE STATUS ONLY
  //---------------------------------------

  async updateAppointmentStatus(
    id: string,
    status: string
  ) {
    const response =
      await dotnetApi.put(
        `${BASE_URL}/${id}`,
        {
          status: status,
        }
      );

    return response.data;
  },

  //---------------------------------------
  // GET PATIENT APPOINTMENTS
  //---------------------------------------

  async getAppointmentsByPatientId(
    patientId: string
  ): Promise<Appointment[]> {

    const response =
      await dotnetApi.get<AppointmentApiResponse>(
        `/patient/appointments/${patientId}`
      );

    return response.data.data;
  },

  //---------------------------------------
  // CANCEL APPOINTMENT
  //---------------------------------------

  async cancelAppointment(
    id: string
  ): Promise<Appointment | null> {
    try {
      const response =
        await this.updateAppointmentStatus(
          id,
          'CANCELLED'
        );

      /*
       * The API may return either:
       *
       * {
       *   data: appointment
       * }
       *
       * or directly:
       *
       * appointment
       *
       * Handle both cases.
       */

      if (!response) {
        return null;
      }

      if (response.data) {
        return response.data as Appointment;
      }

      return response as Appointment;
    } catch (error) {
      console.error(
        'Failed to cancel appointment:',
        error
      );

      throw error;
    }
  },

  //---------------------------------------
  // DELETE
  //---------------------------------------

  async deleteAppointment(
    id: string
  ) {
    const response =
      await dotnetApi.delete(
        `${BASE_URL}/${id}`
      );

    return response.data;
  },
};

export default appointmentService;