'use client';

import {
  useSearchParams,
  useRouter,
} from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import MedicalRecordForm from '@/components/doctor/MedicalRecordForm';

import {
  ArrowLeft,
  FileText,
} from 'lucide-react';

export default function NewMedicalRecordPage() {
  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const appointmentId =
    searchParams.get(
      'appointmentId'
    ) || '';

  const patientId =
    searchParams.get(
      'patientId'
    ) || '';

  const doctorId =
    searchParams.get(
      'doctorId'
    ) || '';

  const visitDate =
    searchParams.get(
      'visitDate'
    ) || '';

  /*
   * ---------------------------------------------------------
   * Missing appointment context
   * ---------------------------------------------------------
   */

  if (!appointmentId) {
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
            label: 'Medical Record',
          },
        ]}
      >
        <div className="rounded-xl border bg-card p-10 text-center">
          <FileText
            size={42}
            className="mx-auto text-muted-foreground"
          />

          <h2 className="mt-4 text-xl font-semibold">
            Appointment information is missing
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Please open the medical record form from an appointment.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/doctor-dashboard/appointments'
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft
              size={16}
            />

            Back to Appointments
          </button>
        </div>
      </AppLayout>
    );
  }

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
          label: 'Create Medical Record',
        },
      ]}
    >
      <div className="space-y-6">
        {/* =================================================
            HEADER
            ================================================= */}

        <div>
          <button
            type="button"
            onClick={() =>
              router.push(
                `/doctor-dashboard/appointments/${appointmentId}`
              )
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft
              size={16}
            />

            Back to Appointment
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText
                size={22}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Create Medical Record
              </h1>

              <p className="mt-1 text-muted-foreground">
                Record the patient's consultation and treatment details.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            APPOINTMENT CONTEXT
            ================================================= */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Appointment ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold">
                {appointmentId}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Patient ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold">
                {patientId ||
                  'Not available'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Doctor ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold">
                {doctorId ||
                  'Not available'}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            FORM
            ================================================= */}

        <MedicalRecordForm
          appointmentId={
            appointmentId
          }
          patientId={
            patientId
          }
          doctorId={
            doctorId
          }
          visitDate={
            visitDate
          }
        />
      </div>
    </AppLayout>
  );
}