'use client';

import { useCallback, useEffect, useState } from 'react';
import appointmentService from '@/services/appointmentService';
import {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '@/types/Appointment';

export default function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all appointments
   */
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await appointmentService.getAppointments();

      setAppointments(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get appointment by id
   */
  const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
    try {
      return await appointmentService.getAppointmentById(id);
    } catch (err) {
      console.error(err);
      return undefined;
    }
  };

  /**
   * Create appointment
   */
  const createAppointment = async (appointment: CreateAppointmentRequest) => {
    try {
      const newAppointment = await appointmentService.createAppointment(appointment);

      setAppointments((prev) => [newAppointment, ...prev]);

      return newAppointment;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * Update appointment
   */
  const updateAppointment = async (id: string, appointment: UpdateAppointmentRequest) => {
    try {
      const updated = await appointmentService.updateAppointment(id, appointment);

      if (!updated) return null;

      setAppointments((prev) => prev.map((item) => (item.id === id ? updated : item)));

      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * Cancel appointment
   */
  const cancelAppointment = async (id: string) => {
    try {
      const cancelled = await appointmentService.cancelAppointment(id);

      if (!cancelled) return null;

      setAppointments((prev) => prev.map((item) => (item.id === id ? cancelled : item)));

      return cancelled;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * Delete appointment
   */
  const deleteAppointment = async (id: string) => {
    try {
      const success = await appointmentService.deleteAppointment(id);

      if (success) {
        setAppointments((prev) => prev.filter((item) => item.id !== id));
      }

      return success;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * Refresh appointments
   */
  const refreshAppointments = () => {
    fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,

    fetchAppointments,
    refreshAppointments,

    getAppointmentById,

    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
  };
}
