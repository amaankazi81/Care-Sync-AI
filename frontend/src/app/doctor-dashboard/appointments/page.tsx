'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import AppLayout from '@/components/AppLayout';
import DoctorAppointmentTable from '@/components/doctor/appointments/DoctorAppointmentTable';

import appointmentService from '@/services/appointmentService';
import doctorService from '@/services/doctorService';

import { Appointment } from '@/types/Appointment';
import { Doctor } from '@/types/Doctor';

import { useAuth } from '@/context/AuthContext';

export default function DoctorAppointmentsPage() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [loading, setLoading] = useState(true);

  /*
   * ---------------------------------------------------------
   * LOAD DOCTOR APPOINTMENTS
   * ---------------------------------------------------------
   *
   * Current authentication profile gives us the doctor's
   * email.
   *
   * Doctor records also contain the doctor's email and ID.
   *
   * Therefore:
   *
   * Logged-in user email
   *        ↓
   * Find matching Doctor
   *        ↓
   * Get Doctor.id
   *        ↓
   * Filter appointments using appointment.doctorId
   *
   * This removes the old hard-coded:
   *
   * appointment.doctorId === 'DOC-001'
   *
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setAppointments([]);
      setDoctor(null);
      setLoading(false);
      return;
    }

    loadDoctorAppointments();
  }, [user, authLoading]);

  async function loadDoctorAppointments() {
    try {
      setLoading(true);

      const loggedInEmail =
        user?.email?.trim().toLowerCase();

      if (!loggedInEmail) {
        console.error(
          'Logged-in user email is not available.'
        );

        setDoctor(null);
        setAppointments([]);
        return;
      }

      /*
       * Load doctors and appointments together.
       */
      const [doctors, allAppointments] =
        await Promise.all([
          doctorService.getDoctors(),
          appointmentService.getAppointments(),
        ]);

      /*
       * Find the doctor associated with the
       * logged-in account.
       */
      const currentDoctor =
        doctors.find(
          (item) =>
            item.email?.trim().toLowerCase() ===
            loggedInEmail
        ) ?? null;

      if (!currentDoctor) {
        console.error(
          'No doctor found for logged-in email:',
          loggedInEmail
        );

        setDoctor(null);
        setAppointments([]);

        return;
      }

      setDoctor(currentDoctor);

      /*
       * Filter appointments using the actual
       * doctor's database ID.
       */
      const filteredAppointments =
        allAppointments.filter(
          (appointment) =>
            appointment.doctorId === currentDoctor.id
        );

      setAppointments(filteredAppointments);
    } catch (error) {
      console.error(
        'Failed to load doctor appointments:',
        error
      );

      setAppointments([]);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * SORT APPOINTMENTS
   * ---------------------------------------------------------
   *
   * Sort by:
   *
   * 1. Appointment date
   * 2. Appointment time
   *
   * This keeps the doctor's schedule chronological.
   * ---------------------------------------------------------
   */

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const dateA =
        `${a.appointmentDate}T${
          a.appointmentTime || '00:00:00'
        }`;

      const dateB =
        `${b.appointmentDate}T${
          b.appointmentTime || '00:00:00'
        }`;

      return dateA.localeCompare(dateB);
    });
  }, [appointments]);

  /*
   * ---------------------------------------------------------
   * LOADING STATE
   * ---------------------------------------------------------
   */

  if (authLoading || loading) {
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
          },
        ]}
      >
        <div className="space-y-6">
          <div>
            <div className="h-8 w-56 rounded bg-muted animate-pulse" />

            <div className="h-4 w-80 rounded bg-muted animate-pulse mt-2" />
          </div>

          <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
            <div className="h-6 w-full rounded bg-muted mb-4" />

            <div className="space-y-3">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={`appointment-loading-${index}`}
                    className="h-14 rounded-lg bg-muted"
                  />
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
   * DOCTOR PROFILE NOT FOUND
   * ---------------------------------------------------------
   */

  if (!doctor) {
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
          },
        ]}
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">
              My Appointments
            </h1>

            <p className="text-muted-foreground mt-1">
              View patient appointments assigned to you.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              Doctor profile not found
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              We could not match your logged-in account
              with a doctor profile.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN PAGE
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
        },
      ]}
    >
      <div className="space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-bold">
            My Appointments
          </h1>

          <p className="text-muted-foreground mt-1">
            View patient appointments assigned to you.
          </p>
        </div>

        {/* Appointment table */}
        <DoctorAppointmentTable
          appointments={sortedAppointments}
          onView={(id) =>
            router.push(
              `/doctor-dashboard/appointments/${id}`
            )
          }
        />
      </div>
    </AppLayout>
  );
}