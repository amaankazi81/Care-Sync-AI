'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  CalendarPlus,
  Eye,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import AppLayout from '@/components/AppLayout';

import type { Appointment } from '@/types/Appointment';

import appointmentService from '@/services/appointmentService';

export default function PatientAppointmentsPage() {
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
   * IMPORTANT:
   * We are keeping the existing working appointment API.
   *
   * Patient ID is currently stored in localStorage when the
   * patient logs in / patient information is loaded.
   *
   * We are NOT changing:
   * - appointmentService
   * - patientService
   * - dotnetApi
   * - booking form
   * - backend
   *
   * Only the page layout has been corrected.
   * ==========================================================
   */

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const storedPatientId =
        localStorage.getItem('patientId');
        console.log(
            'CURRENT LOGGED-IN PATIENT ID:',
            storedPatientId
          );

      if (!storedPatientId) {
        setAppointments([]);

        setError(
          'Patient information could not be found. Please login again.'
        );

        return;
      }

      const data =
        await appointmentService.getAppointmentsByPatientId(
          storedPatientId
        );
        console.log(
          'PATIENT APPOINTMENTS FROM API:',
          data
        );

      setAppointments(data || []);
    } catch (err) {
      console.error(
        'Failed to load patient appointments:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load appointments.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================================
   * INITIAL LOAD
   * ==========================================================
   */

  useEffect(() => {
    loadAppointments();
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
   * PAGE CONTENT
   * ==========================================================
   */

  const pageContent = (
    <div className="p-6 space-y-6">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-xl font-semibold text-foreground">
            My Appointments
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            View your upcoming and previous appointments.
          </p>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={loadAppointments}
            disabled={loading}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted transition disabled:opacity-50"
            title="Refresh appointments"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />
          </button>

          <Link
            href="/patient-dashboard/book-appointment"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            <CalendarPlus size={17} />

            Book Appointment
          </Link>

        </div>

      </div>

      {/* ======================================================
          LOADING
          ====================================================== */}

      {loading && (
        <div className="bg-card rounded-xl border border-border shadow-card">

          <div className="p-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading appointments...

          </div>

        </div>
      )}

      {/* ======================================================
          ERROR
          ====================================================== */}

      {!loading && error && (
        <div className="bg-card rounded-xl border border-border shadow-card">

          <div className="p-6">

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="text-sm font-semibold text-red-700">
                Unable to load appointments
              </p>

              <p className="text-xs text-red-600 mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={loadAppointments}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition"
              >
                <RefreshCw size={14} />

                Try Again
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================
          EMPTY STATE
          ====================================================== */}

      {!loading &&
        !error &&
        appointments.length === 0 && (
          <div className="bg-card rounded-xl border border-border shadow-card">

            <div className="p-10 text-center">

              <CalendarPlus
                size={40}
                className="mx-auto text-muted-foreground"
              />

              <h2 className="mt-4 text-base font-semibold text-foreground">
                No appointments found
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                You have not booked any appointments yet.
              </p>

              <Link
                href="/patient-dashboard/book-appointment"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                <CalendarPlus size={17} />

                Book Your First Appointment
              </Link>

            </div>

          </div>
        )}

      {/* ======================================================
          APPOINTMENTS
          ====================================================== */}

      {!loading &&
        !error &&
        appointments.length > 0 && (

          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">

            {/* ==================================================
                DESKTOP TABLE
                ================================================== */}

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

                        {/* Appointment Number */}

                        <td className="px-5 py-4">

                          <span className="font-semibold text-primary">
                            {appointment.appointmentNumber}
                          </span>

                        </td>

                        {/* Doctor */}

                        <td className="px-5 py-4 text-sm">
                          {appointment.doctorName ||
                            'Doctor'}
                        </td>

                        {/* Department */}

                        <td className="px-5 py-4 text-sm">
                          {appointment.department ||
                            '—'}
                        </td>

                        {/* Date */}

                        <td className="px-5 py-4 text-sm">
                          {appointment.appointmentDate}
                        </td>

                        {/* Time */}

                        <td className="px-5 py-4 text-sm">
                          {appointment.appointmentTime}
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>

                        </td>

                        {/* Action */}

                        <td className="px-5 py-4 text-center">

                          <Link
                            href={`/patient-dashboard/appointments/${appointment.id}`}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted transition"
                            title="View appointment"
                          >
                            <Eye size={16} />
                          </Link>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* ==================================================
                MOBILE APPOINTMENTS
                ================================================== */}

            <div className="lg:hidden divide-y divide-border">

              {appointments.map(
                (appointment) => (

                  <div
                    key={appointment.id}
                    className="p-4"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        {/* Appointment Number */}

                        <p className="font-semibold text-primary">
                          {appointment.appointmentNumber}
                        </p>

                        {/* Doctor */}

                        <p className="text-sm font-medium mt-1">
                          {appointment.doctorName ||
                            'Doctor'}
                        </p>

                        {/* Department */}

                        <p className="text-sm text-muted-foreground">
                          {appointment.department ||
                            '—'}
                        </p>

                        {/* Date & Time */}

                        <div className="mt-3 space-y-1">

                          <p className="text-xs text-muted-foreground">

                            Date:{' '}

                            <span className="text-foreground">
                              {appointment.appointmentDate}
                            </span>

                          </p>

                          <p className="text-xs text-muted-foreground">

                            Time:{' '}

                            <span className="text-foreground">
                              {appointment.appointmentTime}
                            </span>

                          </p>

                        </div>

                        {/* Status */}

                        <span
                          className={`inline-flex mt-3 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>

                      </div>

                      {/* View */}

                      <Link
                        href={`/patient-dashboard/appointments/${appointment.id}`}
                        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0 hover:bg-muted transition"
                        title="View appointment"
                      >
                        <Eye size={16} />
                      </Link>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

    </div>
  );

  /*
   * ==========================================================
   * SHARED PATIENT DASHBOARD LAYOUT
   * ==========================================================
   *
   * THIS IS THE IMPORTANT CHANGE.
   *
   * Previously the page returned only:
   *
   * <div className="p-6">...</div>
   *
   * Therefore the shared sidebar/header were missing.
   *
   * Now the entire page is rendered inside AppLayout,
   * exactly like the other dashboard pages.
   * ==========================================================
   */

  return (
  <AppLayout role="patient">
    {pageContent}
  </AppLayout>
);
}