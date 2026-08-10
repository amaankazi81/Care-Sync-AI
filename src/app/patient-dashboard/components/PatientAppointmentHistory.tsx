'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Eye,
  CalendarClock,
  Loader2,
} from 'lucide-react';

import type { Appointment } from '@/types/Appointment';

import appointmentService from '@/services/appointmentService';

import patientService from '@/services/patientService';

import { useAuth } from '@/context/AuthContext';

export default function PatientAppointmentHistory() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ==========================================================
   * LOAD PATIENT APPOINTMENTS
   * ==========================================================
   *
   * Flow:
   *
   * 1. Get logged-in user from AuthContext
   * 2. Find matching patient in .NET patients table
   * 3. Get patient.id
   * 4. Load appointments using existing appointmentService
   *
   * No changes are required to:
   *
   * - dotnetApi.ts
   * - api.ts
   * - Patient.ts
   * - appointmentService.ts
   * - patientService.ts
   * - other dashboards
   *
   * ==========================================================
   */

  useEffect(() => {
    let mounted = true;

    async function loadAppointments() {
      /*
       * Wait until AuthContext finishes loading.
       */
      if (authLoading) {
        return;
      }

      /*
       * No logged-in user.
       */
      if (!user) {
        if (mounted) {
          setError(
            'Unable to identify the logged-in patient.'
          );

          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError(null);

        /*
         * ======================================================
         * STEP 1
         * Get all patients from the existing .NET service.
         * ======================================================
         */

        const patients =
          await patientService.getPatients();

        if (!mounted) {
          return;
        }

        /*
         * ======================================================
         * STEP 2
         * Find the .NET patient belonging to the
         * currently logged-in Spring Boot user.
         *
         * We use email because the existing UserProfile
         * contains email and the existing Patient interface
         * also contains email.
         * ======================================================
         */

        const currentPatient =
          patients.find(
            (patient) =>
              patient.email?.toLowerCase() ===
              user.email?.toLowerCase()
          );

        /*
         * Patient does not exist in .NET.
         */
        if (!currentPatient) {
          setAppointments([]);

          setError(
            'Patient profile could not be found.'
          );

          return;
        }

        /*
         * ======================================================
         * STEP 3
         * Get appointments for this patient's .NET ID.
         * ======================================================
         */

        const data =
          await appointmentService
            .getAppointmentsByPatientId(
              currentPatient.id
            );

        if (!mounted) {
          return;
        }

        /*
         * ======================================================
         * STEP 4
         * Store appointments.
         * ======================================================
         */

        setAppointments(data || []);
      } catch (err) {
        console.error(
          'Failed to load patient appointments:',
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load appointments.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAppointments();

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  /*
   * ==========================================================
   * STATUS STYLE
   * ==========================================================
   */

  const getStatusClass = (
    status: Appointment['status']
  ) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';

      case 'BOOKED':
        return 'bg-blue-100 text-blue-700';

      case 'CONFIRMED':
        return 'bg-cyan-100 text-cyan-700';

      case 'CHECKED_IN':
        return 'bg-yellow-100 text-yellow-700';

      case 'CANCELLED':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading || authLoading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">

        <div className="px-5 py-4 border-b border-border flex items-center gap-2">

          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarClock
              size={18}
              className="text-primary"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Appointment History
            </h3>

            <p className="text-xs text-muted-foreground">
              Previous consultations
            </p>
          </div>

        </div>

        <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading appointments...

        </div>

      </div>
    );
  }

  /*
   * ==========================================================
   * ERROR
   * ==========================================================
   */

  if (error) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">

        <div className="px-5 py-4 border-b border-border flex items-center gap-2">

          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarClock
              size={18}
              className="text-primary"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Appointment History
            </h3>

            <p className="text-xs text-muted-foreground">
              Previous consultations
            </p>
          </div>

        </div>

        <div className="p-6">

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-semibold text-red-700">
              Unable to load appointments
            </p>

            <p className="text-xs text-red-600 mt-1">
              {error}
            </p>

          </div>

        </div>

      </div>
    );
  }

  /*
   * ==========================================================
   * EMPTY
   * ==========================================================
   */

  if (appointments.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">

        <div className="px-5 py-4 border-b border-border flex items-center gap-2">

          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">

            <CalendarClock
              size={18}
              className="text-primary"
            />

          </div>

          <div>

            <h3 className="text-sm font-semibold text-foreground">
              Appointment History
            </h3>

            <p className="text-xs text-muted-foreground">
              Previous consultations
            </p>

          </div>

        </div>

        <div className="p-8 text-center">

          <CalendarClock
            size={32}
            className="mx-auto text-muted-foreground"
          />

          <p className="mt-3 text-sm font-semibold text-foreground">
            No appointments found
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Your appointment history will appear here.
          </p>

        </div>

      </div>
    );
  }

  /*
   * ==========================================================
   * DATA
   * ==========================================================
   */

  return (
    <div className="bg-card rounded-xl border border-border shadow-card">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="px-5 py-4 border-b border-border flex items-center gap-2">

        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">

          <CalendarClock
            size={18}
            className="text-primary"
          />

        </div>

        <div>

          <h3 className="text-sm font-semibold text-foreground">
            Appointment History
          </h3>

          <p className="text-xs text-muted-foreground">
            Previous consultations
          </p>

        </div>

      </div>

      {/* ======================================================
          DESKTOP
      ====================================================== */}

      <div className="hidden lg:block overflow-x-auto">

        <table className="w-full">

          <thead className="bg-muted/40">

            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">

              <th className="px-5 py-3">
                Appointment
              </th>

              <th className="px-5 py-3">
                Doctor
              </th>

              <th className="px-5 py-3">
                Department
              </th>

              <th className="px-5 py-3">
                Date
              </th>

              <th className="px-5 py-3">
                Time
              </th>

              <th className="px-5 py-3">
                Status
              </th>

              <th className="px-5 py-3 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {appointments.map(
              (appointment) => (
                <tr
                  key={appointment.id}
                  className="border-t border-border hover:bg-muted/20 transition"
                >

                  <td className="px-5 py-4 font-semibold text-primary">
                    {appointment.appointmentNumber}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {appointment.doctorName ||
                      'Doctor'}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {appointment.department ||
                      '—'}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {appointment.appointmentDate}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {appointment.appointmentTime}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-center">

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/patient-dashboard/appointments/${appointment.id}`
                        )
                      }
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted transition"
                    >

                      <Eye size={16} />

                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* ======================================================
          MOBILE
      ====================================================== */}

      <div className="lg:hidden divide-y divide-border">

        {appointments.map(
          (appointment) => (
            <div
              key={appointment.id}
              className="p-4"
            >

              <div className="flex justify-between gap-3">

                <div>

                  <p className="font-semibold text-primary">
                    {appointment.appointmentNumber}
                  </p>

                  <p className="font-medium text-sm mt-1">
                    {appointment.doctorName ||
                      'Doctor'}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {appointment.department ||
                      '—'}
                  </p>

                  <p className="text-xs mt-2">
                    {appointment.appointmentDate}
                  </p>

                  <p className="text-xs">
                    {appointment.appointmentTime}
                  </p>

                  <span
                    className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/patient-dashboard/appointments/${appointment.id}`
                    )
                  }
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0"
                >

                  <Eye size={16} />

                </button>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}