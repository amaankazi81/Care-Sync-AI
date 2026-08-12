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
import medicalRecordService from '@/services/medicalRecordService';

import type { Appointment } from '@/types/Appointment';
import type { MedicalRecord } from '@/types/MedicalRecord';
import type { Patient } from '@/types/Patient';

function formatDate(
  value: string
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

export default function MedicalRecordsPage() {
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
    records,
    setRecords,
  ] = useState<MedicalRecord[]>([]);

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
       * Find patient profile
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
       * Load patient appointments + all medical records
       * ------------------------------------------------------
       */

      const [
        patientAppointments,
        allRecords,
      ] = await Promise.all([
        appointmentService.getAppointmentsByPatientId(
          patientData.id
        ),

        medicalRecordService.getMedicalRecords(),
      ]);

      setAppointments(
        patientAppointments
      );

      /*
       * ------------------------------------------------------
       * MedicalRecord has appointmentId rather than
       * patientId.
       *
       * Therefore determine patient's records using
       * appointmentId.
       * ------------------------------------------------------
       */

      const appointmentIds =
        new Set(
          patientAppointments.map(
            (appointment) =>
              appointment.id
          )
        );

      const patientRecords =
        allRecords.filter(
          (record) =>
            appointmentIds.has(
              record.appointmentId
            )
        );

      setRecords(
        patientRecords
      );
    } catch (err) {
      console.error(
        'Failed to load medical records:',
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load medical records.';

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

  const sortedRecords =
    useMemo(() => {
      return [
        ...records,
      ].sort(
        (a, b) =>
          new Date(
            b.visitDate
          ).getTime() -
          new Date(
            a.visitDate
          ).getTime()
      );
    }, [
      records,
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
            label: 'Medical Records',
          },
        ]}
      >
        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex items-center gap-2 text-sm text-muted-foreground">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading medical records...

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
          label: 'Medical Records',
        },
      ]}
    >
      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Medical Records
            </h1>

            <p className="mt-2 text-muted-foreground">
              View your previous consultation and treatment records.
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

        {/* PATIENT */}

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
              Medical Records
            </p>

            <p className="mt-2 text-2xl font-bold">
              {records.length}
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

        {/* RECORDS */}

        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">

          <div className="border-b p-5">

            <div className="flex items-center gap-2">

              <FileText
                size={19}
                className="text-primary"
              />

              <h2 className="font-semibold">
                Medical History
              </h2>

            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Consultation records created during your visits.
            </p>

          </div>

          {sortedRecords.length === 0 ? (
            <div className="px-5 py-14 text-center">

              <FileText
                size={42}
                className="mx-auto text-muted-foreground"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No medical records found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Your consultation records will appear here after your doctor creates them.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-muted/40">

                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">

                    <th className="px-5 py-3">
                      Visit Date
                    </th>

                    <th className="px-5 py-3">
                      Doctor
                    </th>

                    <th className="px-5 py-3">
                      Diagnosis
                    </th>

                    <th className="px-5 py-3">
                      Treatment
                    </th>

                    <th className="px-5 py-3 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {sortedRecords.map(
                    (record) => (
                      <tr
                        key={
                          record.id
                        }
                        className="border-t transition hover:bg-muted/20"
                      >

                        <td className="px-5 py-4 whitespace-nowrap">

                          <div className="flex items-center gap-2">

                            <CalendarDays
                              size={15}
                              className="text-muted-foreground"
                            />

                            {formatDate(
                              record.visitDate
                            )}

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <Stethoscope
                              size={16}
                              className="text-primary"
                            />

                            {record.doctorName ||
                              'Doctor'}

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          {record.diagnosis ||
                            '—'}

                        </td>

                        <td className="max-w-[280px] px-5 py-4">

                          <p className="whitespace-pre-wrap text-sm">
                            {record.treatment ||
                              '—'}
                          </p>

                        </td>

                        <td className="px-5 py-4 text-right">

                          <Link
                            href={`/patient-dashboard/medical-records/${record.id}`}
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