'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import AppLayout from '@/components/AppLayout';

import appointmentService from '@/services/appointmentService';

import { Appointment } from '@/types/Appointment';

import AppointmentStatusBadge from '@/components/appointments/AppointmentStatusBadge';

export default function DoctorAppointmentDetails() {
  const params = useParams();

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ---------------------------------------------------------
   * LOAD APPOINTMENT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!params.id) {
      return;
    }

    async function loadAppointment() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await appointmentService.getAppointmentById(
            params.id as string
          );

        if (!data) {
          setAppointment(null);
          return;
        }

        setAppointment(data);
      } catch (error) {
        console.error(
          'Failed to load appointment details:',
          error
        );

        setError(
          'Failed to load appointment details.'
        );

        setAppointment(null);
      } finally {
        setLoading(false);
      }
    }

    loadAppointment();
  }, [params.id]);

  /*
   * ---------------------------------------------------------
   * LOADING STATE
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <AppLayout role="doctor">
        <div className="space-y-6">
          <div>
            <div className="h-8 w-64 rounded bg-muted animate-pulse" />

            <div className="h-4 w-80 rounded bg-muted animate-pulse mt-2" />
          </div>

          <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
            <div className="h-6 w-48 rounded bg-muted mb-6" />

            <div className="grid md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={`details-loading-${index}`}
                  >
                    <div className="h-3 w-24 rounded bg-muted" />

                    <div className="h-5 w-40 rounded bg-muted mt-2" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * ---------------------------------------------------------
   * ERROR STATE
   * ---------------------------------------------------------
   */

  if (error) {
    return (
      <AppLayout role="doctor">
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Unable to load appointment
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            {error}
          </p>

          <Link
            href="/doctor-dashboard/appointments"
            className="inline-flex mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Back to Appointments
          </Link>
        </div>
      </AppLayout>
    );
  }

  /*
   * ---------------------------------------------------------
   * APPOINTMENT NOT FOUND
   * ---------------------------------------------------------
   */

  if (!appointment) {
    return (
      <AppLayout role="doctor">
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Appointment not found
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            The requested appointment could not be
            found.
          </p>

          <Link
            href="/doctor-dashboard/appointments"
            className="inline-flex mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Back to Appointments
          </Link>
        </div>
      </AppLayout>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN DETAILS PAGE
   * ---------------------------------------------------------
   */

  return (
    <AppLayout
      role="doctor"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/doctor-dashboard',
        },
        {
          label: 'Appointments',
          href: '/doctor-dashboard/appointments',
        },
        {
          label: 'Appointment Details',
        },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Appointment Details
            </h1>

            <p className="text-muted-foreground mt-1">
              View the complete details of this patient
              appointment.
            </p>
          </div>

          {/* Create Medical Record */}

          <Link
            href={`/doctor-dashboard/medical-records/new?appointmentId=${appointment.id}&patientId=${appointment.patientId}&doctorId=${appointment.doctorId}&visitDate=${encodeURIComponent(appointment.appointmentDate)}`}
            className="inline-flex items-center justify-center rounded-lg border border-primary bg-card px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            Create Medical Record
          </Link>

          {/* Create Prescription */}

          <Link
            href={`/doctor-dashboard/prescriptions/new?appointmentId=${appointment.id}&patientId=${appointment.patientId}&doctorId=${appointment.doctorId}`}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Create Prescription
          </Link>
        </div>

        {/* Patient Information */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-5">
            Patient Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Patient Name
              </p>

              <p className="font-semibold text-foreground mt-1">
                {appointment.patientName ||
                  'Unknown Patient'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Patient ID
              </p>

              <p className="font-semibold text-foreground mt-1 break-all">
                {appointment.patientId || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Appointment Number
              </p>

              <p className="font-semibold text-foreground mt-1">
                {appointment.appointmentNumber ||
                  '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Appointment Status
              </p>

              <div className="mt-2">
                <AppointmentStatusBadge
                  status={appointment.status}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Information */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-5">
            Appointment
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Date
              </p>

              <p className="font-semibold text-foreground mt-1">
                {appointment.appointmentDate || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Time
              </p>

              <p className="font-semibold text-foreground mt-1">
                {appointment.appointmentTime || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Department
              </p>

              <p className="font-semibold text-foreground mt-1">
                {appointment.department ||
                  'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Doctor
              </p>

              <p className="font-semibold text-foreground mt-1">
                {appointment.doctorName ||
                  'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Visit Details */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-5">
            Visit Details
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Reason for Visit
              </p>

              <p className="text-sm text-foreground mt-1 leading-relaxed">
                {appointment.reason ||
                  'No reason provided.'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Notes
              </p>

              <p className="text-sm text-foreground mt-1 leading-relaxed">
                {appointment.notes ||
                  'No notes provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div>
          <Link
            href="/doctor-dashboard/appointments"
            className="text-sm font-medium text-primary hover:text-accent transition-colors"
          >
            ← Back to My Appointments
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}