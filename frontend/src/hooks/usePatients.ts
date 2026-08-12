'use client';

import { useCallback, useEffect, useState } from 'react';

import patientService from '@/services/patientService';

import {
  Patient,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '@/types/Patient';

export default function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
   * =========================================================
   * GET ALL PATIENTS
   * =========================================================
   */

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const data =
        await patientService.getPatients();

      setPatients(data);
    } catch (err) {
      console.error(
        'Failed to fetch patients:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load patients.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * =========================================================
   * GET PATIENT BY ID
   * =========================================================
   */

  const getPatientById = async (
    id: string
  ): Promise<Patient | undefined> => {
    try {
      if (!id) {
        return undefined;
      }

      return await patientService.getPatientById(id);
    } catch (err) {
      console.error(
        'Failed to fetch patient:',
        err
      );

      return undefined;
    }
  };

  /*
   * =========================================================
   * CREATE PATIENT
   * =========================================================
   */

  const createPatient = async (
    patient: CreatePatientRequest
  ) => {
    try {
      const created =
        await patientService.createPatient(
          patient
        );

      /*
       * Refresh from backend so the
       * actual patient returned by .NET
       * becomes the source of truth.
       */

      await fetchPatients();

      return created;
    } catch (err) {
      console.error(
        'Failed to create patient:',
        err
      );

      throw err;
    }
  };

  /*
   * =========================================================
   * UPDATE PATIENT
   * =========================================================
   */

  const updatePatient = async (
    id: string,
    patient: UpdatePatientRequest
  ) => {
    try {
      const updated =
        await patientService.updatePatient(
          id,
          patient
        );

      /*
       * Refresh patient list after update.
       */

      await fetchPatients();

      return updated;
    } catch (err) {
      console.error(
        'Failed to update patient:',
        err
      );

      throw err;
    }
  };

  /*
   * =========================================================
   * DELETE PATIENT
   * =========================================================
   */

  const deletePatient = async (
    id: string
  ) => {
    try {
      const result =
        await patientService.deletePatient(id);

      setPatients((previous) =>
        previous.filter(
          (patient) => patient.id !== id
        )
      );

      return result;
    } catch (err) {
      console.error(
        'Failed to delete patient:',
        err
      );

      throw err;
    }
  };

  /*
   * =========================================================
   * REFRESH
   * =========================================================
   */

  const refreshPatients = () => {
    fetchPatients();
  };

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,

    loading,

    error,

    fetchPatients,

    refreshPatients,

    getPatientById,

    createPatient,

    updatePatient,

    deletePatient,
  };
}