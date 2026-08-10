'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  LoaderCircle,
} from 'lucide-react';

import AppLayout from '@/components/AppLayout';

import PatientProfileCard from '../../components/PatientProfileCard';
import MedicalInfoCard from '../../components/MedicalInfoCard';
import PrescriptionHistory from '../../components/PrescriptionHistory';

import patientService from '@/services/patientService';
import { Patient } from '@/types/Patient';

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const patientId =
    typeof params.id === 'string'
      ? params.id
      : '';

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!patientId) {
      return;
    }

    loadPatient();
  }, [patientId]);

  async function loadPatient() {
    try {
      setLoading(true);
      setError(null);

      const data =
        await patientService.getPatientById(
          patientId
        );

      setPatient(data);
    } catch (err) {
      console.error(
        'Failed to load patient:',
        err
      );

      setError(
        'Unable to load this patient record.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout
      role="receptionist"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/receptionist-dashboard',
        },
        {
          label: 'Patients',
          href: '/receptionist-dashboard/patients',
        },
        {
          label: 'Patient Details',
        },
      ]}
    >
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <LoaderCircle
              size={32}
              className="animate-spin text-cyan-600"
            />

            <p className="font-medium">
              Loading patient record...
            </p>
          </div>
        </div>
      ) : error || !patient ? (
        <div className="space-y-4">
          <button
            onClick={() =>
              router.push(
                '/receptionist-dashboard/patients'
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Patients
          </button>

          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            <AlertCircle
              size={22}
              className="mt-0.5"
            />

            <div>
              <h2 className="font-semibold">
                Patient record unavailable
              </h2>

              <p className="mt-1 text-sm">
                {error ||
                  'The requested patient could not be found.'}
              </p>

              <button
                onClick={loadPatient}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-700">
                Patient Record
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {patient.firstName}{' '}
                {patient.lastName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Patient ID: {patient.id}
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  '/receptionist-dashboard/patients'
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Patients
            </button>
          </div>

          <PatientProfileCard
            patient={patient}
          />

          <MedicalInfoCard
            patient={patient}
          />

          <PrescriptionHistory
            patientId={patient.id}
          />
        </div>
      )}
    </AppLayout>
  );
}