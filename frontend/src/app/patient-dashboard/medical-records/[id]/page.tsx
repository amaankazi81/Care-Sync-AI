'use client';

import {
  useEffect,
  useState,
} from 'react';

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

import medicalRecordService from '@/services/medicalRecordService';

import type { MedicalRecord } from '@/types/MedicalRecord';

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
      month: 'long',
      year: 'numeric',
    }
  );
}

export default function MedicalRecordDetailsPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const recordId =
    typeof params.id === 'string'
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : '';

  const [
    record,
    setRecord,
  ] = useState<MedicalRecord | null>(
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
    if (!recordId) {
      setError(
        'Medical record ID is missing.'
      );

      setLoading(false);

      return;
    }

    async function loadRecord() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await medicalRecordService.getMedicalRecordById(
            recordId
          );

        setRecord(
          data
        );
      } catch (err) {
        console.error(
          'Failed to load medical record:',
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load medical record.';

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

    loadRecord();
  }, [
    recordId,
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
            label: 'Medical Records',
            href: '/patient-dashboard/medical-records',
          },
          {
            label: 'Record Details',
          },
        ]}
      >
        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex items-center gap-2 text-sm text-muted-foreground">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading medical record...

          </div>

        </div>
      </AppLayout>
    );
  }

  if (
    error ||
    !record
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
            href: '/patient-dashboard/medical-records',
          },
          {
            label: 'Record Details',
          },
        ]}
      >
        <div className="rounded-xl border bg-card p-10 text-center">

          <FileText
            size={40}
            className="mx-auto text-muted-foreground"
          />

          <h2 className="mt-4 text-xl font-semibold">
            Medical Record Not Found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error ||
              'The requested medical record could not be found.'}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/patient-dashboard/medical-records'
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <ArrowLeft
              size={15}
            />

            Back to Medical Records
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
          label: 'Medical Records',
          href: '/patient-dashboard/medical-records',
        },
        {
          label: 'Record Details',
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
                '/patient-dashboard/medical-records'
              )
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft
              size={16}
            />

            Back to Medical Records
          </button>

          <h1 className="text-3xl font-bold">
            Medical Record
          </h1>

          <p className="mt-2 text-muted-foreground">
            Complete consultation and treatment record.
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
                Visit Information
              </h2>

              <p className="text-xs text-muted-foreground">
                Record ID: {record.id}
              </p>

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <Info
              label="Doctor"
              value={
                record.doctorName ||
                '—'
              }
              icon={
                <Stethoscope
                  size={16}
                />
              }
            />

            <Info
              label="Visit Date"
              value={
                formatDate(
                  record.visitDate
                )
              }
              icon={
                <CalendarDays
                  size={16}
                />
              }
            />

            <Info
              label="Appointment ID"
              value={
                record.appointmentId
              }
            />

            <Info
              label="Diagnosis"
              value={
                record.diagnosis ||
                '—'
              }
            />

          </div>

        </div>

        {/* SYMPTOMS */}

        <Section
          title="Symptoms"
          value={
            record.symptoms
          }
        />

        {/* TREATMENT */}

        <Section
          title="Treatment"
          value={
            record.treatment
          }
        />

        {/* DOCTOR NOTES */}

        <Section
          title="Doctor's Notes"
          value={
            record.doctorNotes
          }
        />

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

interface SectionProps {
  title: string;
  value: string;
}

function Section({
  title,
  value,
}: SectionProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">

      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <div className="mt-4 rounded-lg border bg-muted/20 p-5">

        <p className="whitespace-pre-wrap text-sm leading-7">
          {value ||
            `No ${title.toLowerCase()} recorded.`}
        </p>

      </div>

    </div>
  );
}