'use client';

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Loader2,
  Stethoscope,
} from 'lucide-react';

import { toast } from 'sonner';

import prescriptionService from '@/services/prescriptionService';

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
      month: 'long',
      year: 'numeric',
    }
  );
}

export default function PatientPrescriptionDetailsPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const prescriptionId =
    typeof params.id === 'string'
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : '';

  const [
    prescription,
    setPrescription,
  ] = useState<Prescription | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (!prescriptionId) {
      setError(
        'Prescription ID is missing.'
      );

      setLoading(false);

      return;
    }

    async function loadPrescription() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await prescriptionService.getPrescriptionById(
            prescriptionId
          );

        setPrescription(
          data
        );
      } catch (err) {
        console.error(
          'Failed to load prescription:',
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load prescription.';

        setError(
          message
        );

        toast.error(
          message
        );
      } finally {
        setLoading(false);
      }
    }

    loadPrescription();
  }, [
    prescriptionId,
  ]);

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
            label: 'Prescriptions',
            href: '/patient-dashboard/prescriptions',
          },
          {
            label: 'Details',
          },
        ]}
      >
        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex items-center gap-2 text-sm text-muted-foreground">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading prescription...

          </div>

        </div>
      </AppLayout>
    );
  }

  if (
    error ||
    !prescription
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
            href: '/patient-dashboard/prescriptions',
          },
          {
            label: 'Details',
          },
        ]}
      >
        <div className="rounded-xl border bg-card p-10 text-center">

          <FileText
            size={40}
            className="mx-auto text-muted-foreground"
          />

          <h2 className="mt-4 text-xl font-semibold">
            Prescription Not Found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error ||
              'The requested prescription could not be found.'}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/patient-dashboard/prescriptions'
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <ArrowLeft
              size={15}
            />

            Back to Prescriptions
          </button>

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
          href: '/patient-dashboard/prescriptions',
        },
        {
          label: 'Prescription Details',
        },
      ]}
    >
      <div className="space-y-6">

        {/* HEADER */}

        <div>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/patient-dashboard/prescriptions'
              )
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft
              size={16}
            />

            Back to Prescriptions
          </button>

          <h1 className="text-3xl font-bold">
            Prescription Details
          </h1>

          <p className="mt-2 text-muted-foreground">
            Complete prescription information.
          </p>

        </div>

        {/* BASIC INFORMATION */}

        <div className="rounded-xl border bg-card p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText
                size={21}
              />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Prescription Information
              </h2>

              <p className="text-xs text-muted-foreground">
                ID: {prescription.id}
              </p>

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <Info
              label="Doctor"
              value={
                prescription.doctorName ||
                '—'
              }
              icon={
                <Stethoscope
                  size={16}
                />
              }
            />

            <Info
              label="Appointment ID"
              value={
                prescription.appointmentId
              }
            />

            <Info
              label="Diagnosis"
              value={
                prescription.diagnosis ||
                '—'
              }
            />

            <Info
              label="Follow-up Date"
              value={
                formatDate(
                  prescription.followUpDate
                )
              }
              icon={
                <CalendarDays
                  size={16}
                />
              }
            />

          </div>

        </div>

        {/* MEDICINES */}

        <div className="rounded-xl border bg-card p-6 shadow-sm">

          <h2 className="text-xl font-semibold">
            Medicines
          </h2>

          <div className="mt-4 rounded-lg border bg-muted/20 p-5">

            <p className="whitespace-pre-wrap text-sm leading-7">
              {prescription.medicines ||
                'No medicines specified.'}
            </p>

          </div>

        </div>

        {/* INSTRUCTIONS */}

        <div className="rounded-xl border bg-card p-6 shadow-sm">

          <h2 className="text-xl font-semibold">
            Doctor's Instructions
          </h2>

          <div className="mt-4 rounded-lg border bg-muted/20 p-5">

            <p className="whitespace-pre-wrap text-sm leading-7">
              {prescription.instructions ||
                'No additional instructions.'}
            </p>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}

interface InfoProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function Info({
  label,
  value,
  icon,
}: InfoProps) {
  return (
    <div className="rounded-lg border p-4">

      <div className="flex items-center gap-2 text-xs text-muted-foreground">

        {icon}

        {label}

      </div>

      <p className="mt-2 break-words font-semibold">
        {value}
      </p>

    </div>
  );
}