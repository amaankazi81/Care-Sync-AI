'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import AppLayout from '@/components/AppLayout';

import {
  CalendarDays,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Stethoscope,
} from 'lucide-react';

import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';

import patientService from '@/services/patientService';
import appointmentService from '@/services/appointmentService';
import prescriptionService from '@/services/prescriptionService';

import type { Appointment } from '@/types/Appointment';
import type { Patient } from '@/types/Patient';
import type { Prescription } from '@/types/Prescription';

function formatDate(
  value: string | null | undefined
): string {
  if (!value) {
    return '—';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );
}

export default function PatientPrescriptionsPage() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    patient,
    setPatient,
  ] = useState<Patient | null>(null);

  const [
    appointments,
    setAppointments,
  ] = useState<Appointment[]>([]);

  const [
    prescriptions,
    setPrescriptions,
  ] = useState<Prescription[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        return;
      }

      /*
       * ------------------------------------------------------
       * Find the patient record.
       *
       * user.patientId is preferred if available.
       * Otherwise match the logged-in user's email.
       * ------------------------------------------------------
       */

      let patientData: Patient | null =
        null;

      if (user.patientId) {
        try {
          patientData =
            await patientService.getPatientById(
              user.patientId
            );
        } catch {
          patientData = null;
        }
      }

      if (!patientData) {
        const patients =
          await patientService.getPatients();

        patientData =
          patients.find(
            (item) =>
              item.email
                ?.trim()
                .toLowerCase() ===
              user.email
                ?.trim()
                .toLowerCase()
          ) || null;
      }

      if (!patientData) {
        throw new Error(
          'Patient profile could not be found.'
        );
      }

      setPatient(
        patientData
      );

      /*
       * ------------------------------------------------------
       * Load:
       *
       * 1. Patient appointments
       * 2. All prescriptions
       *
       * Prescription is connected to patient through
       * appointmentId.
       * ------------------------------------------------------
       */

      const [
        patientAppointments,
        allPrescriptions,
      ] = await Promise.all([
        appointmentService.getAppointmentsByPatientId(
          patientData.id
        ),

        prescriptionService.getPrescriptions(),
      ]);

      setAppointments(
        patientAppointments
      );

      /*
       * Only prescriptions belonging to this
       * patient's appointments.
       */

      const appointmentIds =
        new Set(
          patientAppointments.map(
            (appointment) =>
              appointment.id
          )
        );

      const patientPrescriptions =
        allPrescriptions.filter(
          (prescription) =>
            appointmentIds.has(
              prescription.appointmentId
            )
        );

      setPrescriptions(
        patientPrescriptions
      );
    } catch (err) {
      console.error(
        'Failed to load patient prescriptions:',
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load prescriptions.';

      setError(
        message
      );

      toast.error(
        message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    loadData();
  }, [
    authLoading,
    user,
  ]);

  const sortedPrescriptions =
    useMemo(() => {
      return [
        ...prescriptions,
      ].sort(
        (a, b) => {
          const dateA =
            a.followUpDate
              ? new Date(
                  a.followUpDate
                ).getTime()
              : 0;

          const dateB =
            b.followUpDate
              ? new Date(
                  b.followUpDate
                ).getTime()
              : 0;

          return dateB - dateA;
        }
      );
    }, [
      prescriptions,
    ]);

  if (
    authLoading ||
    loading
  ) {
    return (
      <AppLayout
        role="patient"
        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/patient-dashboard',
          },
          {
            label: 'Prescriptions',
          },
        ]}
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading prescriptions...
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      role="patient"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/patient-dashboard',
        },
        {
          label: 'Prescriptions',
        },
      ]}
    >
      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              My Prescriptions
            </h1>

            <p className="mt-2 text-muted-foreground">
              View prescriptions issued by your doctors.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:opacity-60"
          >
            <RefreshCw
              size={16}
            />

            Refresh
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* PATIENT INFO */}

        {patient && (
          <div className="rounded-xl border bg-card p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText
                  size={20}
                />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Patient
                </p>

                <p className="font-semibold">
                  {patient.firstName}{' '}
                  {patient.lastName}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* SUMMARY */}

        <div className="grid gap-5 sm:grid-cols-2">

          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Prescriptions
            </p>

            <p className="mt-2 text-2xl font-bold">
              {prescriptions.length}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Appointments
            </p>

            <p className="mt-2 text-2xl font-bold">
              {appointments.length}
            </p>
          </div>

        </div>

        {/* PRESCRIPTIONS */}

        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">

          <div className="border-b p-5">

            <div className="flex items-center gap-2">

              <FileText
                size={19}
                className="text-primary"
              />

              <h2 className="font-semibold">
                Prescription History
              </h2>

            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Prescriptions saved by your doctors.
            </p>

          </div>

          {sortedPrescriptions.length === 0 ? (
            <div className="px-5 py-14 text-center">

              <FileText
                size={42}
                className="mx-auto text-muted-foreground"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No prescriptions found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Prescriptions issued during your appointments will appear here.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-muted/40">

                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">

                    <th className="px-5 py-3">
                      Doctor
                    </th>

                    <th className="px-5 py-3">
                      Diagnosis
                    </th>

                    <th className="px-5 py-3">
                      Medicines
                    </th>

                    <th className="px-5 py-3">
                      Follow-up
                    </th>

                    <th className="px-5 py-3 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {sortedPrescriptions.map(
                    (prescription) => (
                      <tr
                        key={
                          prescription.id
                        }
                        className="border-t transition hover:bg-muted/20"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <Stethoscope
                              size={16}
                              className="text-primary"
                            />

                            <span className="font-medium">
                              {prescription.doctorName ||
                                'Doctor'}
                            </span>

                          </div>

                        </td>

                        <td className="px-5 py-4">
                          {prescription.diagnosis ||
                            '—'}
                        </td>

                        <td className="max-w-[300px] px-5 py-4">

                          <p className="whitespace-pre-wrap text-sm">
                            {prescription.medicines ||
                              '—'}
                          </p>

                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">

                          <div className="flex items-center gap-2">

                            <CalendarDays
                              size={15}
                              className="text-muted-foreground"
                            />

                            {formatDate(
                              prescription.followUpDate
                            )}

                          </div>

                        </td>

                        <td className="px-5 py-4 text-right">

                          <Link
                            href={`/patient-dashboard/prescriptions/${prescription.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5"
                          >
                            <Eye
                              size={14}
                            />

                            View

                          </Link>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </AppLayout>
  );
}