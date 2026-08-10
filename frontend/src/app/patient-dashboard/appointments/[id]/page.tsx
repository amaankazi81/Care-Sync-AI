'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import type { Appointment } from '@/types/Appointment';

import appointmentService from '@/services/appointmentService';

import {
  CalendarClock,
  Clock3,
  UserRound,
  Building2,
  FileText,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

import Link from 'next/link';

/*
 * ============================================================
 * PATIENT APPOINTMENT DETAILS
 * ============================================================
 *
 * IMPORTANT:
 *
 * [id] here represents the APPOINTMENT ID.
 *
 * It does NOT represent the patient ID.
 *
 * Flow:
 *
 * Logged-in Patient
 *       ↓
 * Patient ID
 *       ↓
 * Get only that patient's appointments
 *       ↓
 * Find selected appointment using [id]
 *       ↓
 * Display appointment details
 *
 * We intentionally DO NOT use:
 *
 * appointmentService.getAppointmentById()
 *
 * because this is the patient portal.
 *
 * The patient should only be able to see appointments
 * belonging to the currently logged-in patient.
 * ============================================================
 */

export default function PatientAppointmentDetailsPage() {
  const params = useParams();

  /*
   * [id] = appointment ID
   */
  const appointmentId = String(params.id || '');

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ============================================================
   * LOAD SELECTED PATIENT APPOINTMENT
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    async function loadAppointment() {
      try {
        setLoading(true);
        setError(null);

        /*
         * ------------------------------------------------------
         * GET LOGGED-IN PATIENT ID
         * ------------------------------------------------------
         *
         * The patient ID is already used by the patient
         * appointment history / booking functionality.
         *
         * We reuse the same patient ID instead of asking
         * the patient to login again.
         */

        const patientId =
          localStorage.getItem('patientId');

        if (!patientId) {
          if (!mounted) {
            return;
          }

          setError(
            'Patient information could not be identified. Please login again.'
          );

          return;
        }

        /*
         * ------------------------------------------------------
         * GET ONLY THIS PATIENT'S APPOINTMENTS
         * ------------------------------------------------------
         *
         * This is the important security/ownership step.
         *
         * We DO NOT request:
         *
         * GET /appointments/{id}
         *
         * Instead we request:
         *
         * GET /patient/appointments/{patientId}
         *
         * and then find the requested appointment.
         */

        const patientAppointments =
          await appointmentService.getAppointmentsByPatientId(
            patientId
          );

        if (!mounted) {
          return;
        }

        /*
         * ------------------------------------------------------
         * FIND SELECTED APPOINTMENT
         * ------------------------------------------------------
         */

        const selectedAppointment =
          patientAppointments.find(
            (item) =>
              String(item.id) ===
              appointmentId
          );

        /*
         * ------------------------------------------------------
         * APPOINTMENT DOES NOT BELONG TO THIS PATIENT
         * ------------------------------------------------------
         *
         * If somebody manually changes the URL to another
         * appointment ID, it will not exist in this patient's
         * appointment list.
         */

        if (!selectedAppointment) {
          setAppointment(null);

          setError(
            'This appointment was not found in your appointment history.'
          );

          return;
        }

        /*
         * ------------------------------------------------------
         * SUCCESS
         * ------------------------------------------------------
         */

        setAppointment(
          selectedAppointment
        );
      } catch (err) {
        console.error(
          'Failed to load patient appointment:',
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load appointment.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (appointmentId) {
      loadAppointment();
    } else {
      setError(
        'Invalid appointment.'
      );

      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [appointmentId]);

  /*
   * ============================================================
   * STATUS STYLE
   * ============================================================
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
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <AppLayout
        role="patient"
        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/patient-dashboard',
          },
          {
            label: 'Appointment History',
            href: '/patient-dashboard/appointments',
          },
          {
            label: 'Appointment Details',
          },
        ]}
      >
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading appointment...
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * ============================================================
   * ERROR / NOT FOUND
   * ============================================================
   */

  if (error || !appointment) {
    return (
      <AppLayout
        role="patient"
        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/patient-dashboard',
          },
          {
            label: 'Appointment History',
            href: '/patient-dashboard/appointments',
          },
          {
            label: 'Appointment Details',
          },
        ]}
      >
        <div className="py-16">
          <div className="max-w-xl mx-auto rounded-xl border border-border bg-card p-8 text-center">
            <CalendarClock
              size={44}
              className="mx-auto text-muted-foreground"
            />

            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Appointment Not Found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {error ||
                'The requested appointment could not be found.'}
            </p>

            <Link
              href="/patient-dashboard/appointments"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              <ArrowLeft size={16} />

              Back to Appointments
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * ============================================================
   * MAIN PAGE
   * ============================================================
   */

  return (
    <AppLayout
      role="patient"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/patient-dashboard',
        },
        {
          label: 'Appointment History',
          href: '/patient-dashboard/appointments',
        },
        {
          label: 'Appointment Details',
        },
      ]}
    >
      <div className="space-y-6">

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Appointment Details
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              View complete information about your appointment.
            </p>
          </div>

          <Link
            href="/patient-dashboard/appointments"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
          >
            <ArrowLeft size={16} />

            Back to Appointments
          </Link>

        </div>

        {/* ====================================================
            APPOINTMENT HEADER CARD
        ==================================================== */}

        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">

          <div className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Appointment
              </p>

              <h2 className="mt-1 text-xl font-bold text-primary">
                {appointment.appointmentNumber ||
                  'Appointment'}
              </h2>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                appointment.status
              )}`}
            >
              {appointment.status ||
                'UNKNOWN'}
            </span>

          </div>

          {/* ==================================================
              APPOINTMENT INFORMATION
          ================================================== */}

          <div className="p-6">

            <div className="grid gap-5 md:grid-cols-2">

              <Info
                title="Appointment No."
                value={
                  appointment.appointmentNumber ||
                  '—'
                }
                icon={
                  <CalendarClock size={18} />
                }
              />

              <Info
                title="Patient"
                value={
                  appointment.patientName ||
                  'You'
                }
                icon={
                  <UserRound size={18} />
                }
              />

              <Info
                title="Doctor"
                value={
                  appointment.doctorName ||
                  'Doctor'
                }
                icon={
                  <UserRound size={18} />
                }
              />

              <Info
                title="Department"
                value={
                  appointment.department ||
                  '—'
                }
                icon={
                  <Building2 size={18} />
                }
              />

              <Info
                title="Appointment Date"
                value={
                  appointment.appointmentDate ||
                  '—'
                }
                icon={
                  <CalendarClock size={18} />
                }
              />

              <Info
                title="Appointment Time"
                value={
                  appointment.appointmentTime ||
                  '—'
                }
                icon={
                  <Clock3 size={18} />
                }
              />

            </div>

          </div>
        </div>

        {/* ====================================================
            REASON / NOTES
        ==================================================== */}

        <div className="rounded-xl border border-border bg-card shadow-card p-6">

          <h2 className="text-lg font-semibold text-foreground">
            Appointment Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {/* REASON */}

            <div className="rounded-lg border border-border p-4">

              <div className="flex items-center gap-2 text-muted-foreground">

                <FileText size={18} />

                <p className="text-sm">
                  Reason for Visit
                </p>

              </div>

              <p className="mt-3 text-sm font-medium text-foreground whitespace-pre-wrap break-words">
                {appointment.reason ||
                  'No reason provided'}
              </p>

            </div>

            {/* NOTES */}

            <div className="rounded-lg border border-border p-4">

              <div className="flex items-center gap-2 text-muted-foreground">

                <FileText size={18} />

                <p className="text-sm">
                  Notes
                </p>

              </div>

              <p className="mt-3 text-sm font-medium text-foreground whitespace-pre-wrap break-words">
                {appointment.notes ||
                  'No notes available'}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================
            ADDITIONAL INFORMATION
        ==================================================== */}

        <div className="rounded-xl border border-border bg-card shadow-card p-6">

          <h2 className="text-lg font-semibold text-foreground">
            Additional Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <Info
              title="Created At"
              value={
                appointment.createdAt
                  ? formatDateTime(
                      appointment.createdAt
                    )
                  : '—'
              }
            />

            <Info
              title="Last Updated"
              value={
                appointment.updatedAt
                  ? formatDateTime(
                      appointment.updatedAt
                    )
                  : '—'
              }
            />

          </div>

        </div>

      </div>
    </AppLayout>
  );
}

/*
 * ============================================================
 * INFO COMPONENT
 * ============================================================
 */

interface InfoProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

function Info({
  title,
  value,
  icon,
}: InfoProps) {
  return (
    <div className="rounded-lg border border-border p-4">

      <div className="flex items-center gap-2 text-muted-foreground">

        {icon && (
          <span className="shrink-0">
            {icon}
          </span>
        )}

        <p className="text-sm">
          {title}
        </p>

      </div>

      <p className="mt-2 font-semibold text-foreground break-words">
        {value}
      </p>

    </div>
  );
}

/*
 * ============================================================
 * DATE / TIME FORMATTER
 * ============================================================
 */

function formatDateTime(
  value: string
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString();
}