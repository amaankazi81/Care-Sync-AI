'use client';

import React, { useEffect, useState } from 'react';

import {
  CalendarClock,
  Clock3,
  UserRound,
  Building2,
  Loader2,
  ArrowRight,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

import type { Appointment } from '@/types/Appointment';

import appointmentService from '@/services/appointmentService';
import patientService from '@/services/patientService';
import profileService from '@/services/profileService';

export default function PatientNextAppointment() {
  const router = useRouter();

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ==========================================================
   * LOAD NEXT APPOINTMENT
   * ==========================================================
   *
   * Existing architecture is preserved:
   *
   * Spring Boot
   *      ↓
   * /users/me
   *      ↓
   * current user's email
   *
   * .NET
   *      ↓
   * /patients
   *      ↓
   * find matching patient
   *
   * .NET
   *      ↓
   * /patient/appointments/{patientId}
   *      ↓
   * appointments
   *
   * No new service is required.
   */

  useEffect(() => {
    let mounted = true;

    async function loadNextAppointment() {
      try {
        setLoading(true);
        setError(null);

        /*
         * ------------------------------------------------------
         * 1. Get currently logged-in user's profile
         * ------------------------------------------------------
         */

        const profile =
          await profileService.getCurrentUserProfile();

        if (!mounted) {
          return;
        }

        /*
         * ------------------------------------------------------
         * 2. Get patients from existing .NET patient service
         * ------------------------------------------------------
         */

        const patients =
          await patientService.getPatients();

        if (!mounted) {
          return;
        }

        /*
         * ------------------------------------------------------
         * 3. Find patient belonging to logged-in user
         * ------------------------------------------------------
         *
         * During registration the same email is stored in:
         *
         * Spring Boot users.email
         *        +
         * .NET patients.email
         *
         */

        const currentPatient =
          patients.find(
            (patient) =>
              patient.email?.toLowerCase() ===
              profile.email?.toLowerCase()
          );

        if (!currentPatient) {
          if (mounted) {
            setAppointment(null);
            setError(
              'Patient profile could not be found.'
            );
          }

          return;
        }

        /*
         * ------------------------------------------------------
         * 4. Get patient's appointments
         * ------------------------------------------------------
         */

        const appointments =
          await appointmentService
            .getAppointmentsByPatientId(
              currentPatient.id
            );

        if (!mounted) {
          return;
        }

        /*
         * ------------------------------------------------------
         * 5. Remove cancelled/completed appointments
         * ------------------------------------------------------
         *
         * We need the NEXT upcoming appointment.
         */

        const today =
          new Date();

        const upcomingAppointments =
          appointments
            .filter(
              (item) =>
                item.status !== 'CANCELLED' &&
                item.status !== 'COMPLETED'
            )
            .filter((item) => {
              const appointmentDateTime =
                new Date(
                  `${item.appointmentDate}T${item.appointmentTime}`
                );

              return (
                !Number.isNaN(
                  appointmentDateTime.getTime()
                ) &&
                appointmentDateTime >= today
              );
            })
            .sort((a, b) => {
              const dateA =
                new Date(
                  `${a.appointmentDate}T${a.appointmentTime}`
                ).getTime();

              const dateB =
                new Date(
                  `${b.appointmentDate}T${b.appointmentTime}`
                ).getTime();

              return dateA - dateB;
            });

        /*
         * ------------------------------------------------------
         * 6. Select first appointment
         * ------------------------------------------------------
         */

        if (mounted) {
          setAppointment(
            upcomingAppointments.length > 0
              ? upcomingAppointments[0]
              : null
          );
        }
      } catch (err) {
        console.error(
          'Failed to load next appointment:',
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load next appointment.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadNextAppointment();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ==========================================================
   * STATUS STYLE
   * ==========================================================
   */

  const getStatusClass = (
    status: Appointment['status']
  ) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-blue-100 text-blue-700';

      case 'CONFIRMED':
        return 'bg-cyan-100 text-cyan-700';

      case 'CHECKED_IN':
        return 'bg-yellow-100 text-yellow-700';

      case 'COMPLETED':
        return 'bg-green-100 text-green-700';

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

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">

        <div className="px-5 py-4 border-b border-border flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarClock
              size={18}
              className="text-primary"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Next Appointment
            </h3>

            <p className="text-xs text-muted-foreground">
              Your upcoming consultation
            </p>
          </div>

        </div>

        <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading appointment...

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

        <div className="px-5 py-4 border-b border-border flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarClock
              size={18}
              className="text-primary"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Next Appointment
            </h3>

            <p className="text-xs text-muted-foreground">
              Your upcoming consultation
            </p>
          </div>

        </div>

        <div className="p-6">

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-semibold text-red-700">
              Unable to load appointment
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
   * NO APPOINTMENT
   * ==========================================================
   */

  if (!appointment) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">

        <div className="px-5 py-4 border-b border-border flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarClock
              size={18}
              className="text-primary"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Next Appointment
            </h3>

            <p className="text-xs text-muted-foreground">
              Your upcoming consultation
            </p>
          </div>

        </div>

        <div className="p-8 text-center">

          <CalendarClock
            size={34}
            className="mx-auto text-muted-foreground"
          />

          <p className="mt-3 text-sm font-semibold text-foreground">
            No upcoming appointments
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            You don't have any upcoming appointments.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/patient-dashboard/book-appointment'
              )
            }
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Book Appointment
            <ArrowRight size={16} />
          </button>

        </div>

      </div>
    );
  }

  /*
   * ==========================================================
   * APPOINTMENT DATA
   * ==========================================================
   */

  return (
    <div className="bg-card rounded-xl border border-border shadow-card">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarClock
              size={18}
              className="text-primary"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Next Appointment
            </h3>

            <p className="text-xs text-muted-foreground">
              Your upcoming consultation
            </p>
          </div>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
            appointment.status
          )}`}
        >
          {appointment.status}
        </span>

      </div>

      {/* ======================================================
          APPOINTMENT BODY
      ====================================================== */}

      <div className="p-5">

        {/* Appointment Number */}

        <div className="mb-5">

          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Appointment
          </p>

          <p className="mt-1 text-lg font-bold text-primary">
            {appointment.appointmentNumber}
          </p>

        </div>

        {/* ====================================================
            DATE + TIME
        ==================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="rounded-lg border border-border bg-muted/20 p-4">

            <div className="flex items-center gap-2">

              <CalendarClock
                size={17}
                className="text-primary"
              />

              <span className="text-xs font-medium text-muted-foreground">
                Date
              </span>

            </div>

            <p className="mt-2 text-sm font-semibold text-foreground">
              {appointment.appointmentDate}
            </p>

          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-4">

            <div className="flex items-center gap-2">

              <Clock3
                size={17}
                className="text-primary"
              />

              <span className="text-xs font-medium text-muted-foreground">
                Time
              </span>

            </div>

            <p className="mt-2 text-sm font-semibold text-foreground">
              {appointment.appointmentTime}
            </p>

          </div>

        </div>

        {/* ====================================================
            DOCTOR
        ==================================================== */}

        <div className="mt-4 rounded-lg border border-border p-4">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">

              <UserRound
                size={17}
                className="text-primary"
              />

            </div>

            <div>

              <p className="text-xs text-muted-foreground">
                Doctor
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {appointment.doctorName ||
                  'Doctor'}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================
            DEPARTMENT
        ==================================================== */}

        <div className="mt-3 rounded-lg border border-border p-4">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">

              <Building2
                size={17}
                className="text-primary"
              />

            </div>

            <div>

              <p className="text-xs text-muted-foreground">
                Department
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {appointment.department ||
                  '—'}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================
            REASON
        ==================================================== */}

        {appointment.reason && (
          <div className="mt-4">

            <p className="text-xs font-medium text-muted-foreground">
              Reason for Visit
            </p>

            <p className="mt-1 text-sm text-foreground">
              {appointment.reason}
            </p>

          </div>
        )}

        {/* ====================================================
            ACTION
        ==================================================== */}

        <div className="mt-5 flex justify-end">

          <button
            type="button"
            onClick={() =>
              router.push(
                `/patient-dashboard/appointments/${appointment.id}`
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            View Appointment
            <ArrowRight size={16} />
          </button>

        </div>

      </div>

    </div>
  );
}