'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import PatientForm from '../../../components/PatientForm';

import patientService from '@/services/patientService';

import { Patient } from '@/types/Patient';

export default function EditPatientPage() {
  const { id } = useParams();

  const [patient, setPatient] = useState<Patient | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPatient(id as string);
    }
  }, [id]);

  async function loadPatient(id: string) {
    try {
      const response =
        await patientService.getPatientById(id);

      setPatient(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppLayout role="admin">
        <div className="rounded-lg border bg-white p-10 text-center">
          Loading patient...
        </div>
      </AppLayout>
    );
  }

  if (!patient) {
    return (
      <AppLayout role="admin">
        <div className="rounded-lg border bg-white p-10 text-center">
          Patient not found.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      role="admin"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/admin-dashboard',
        },
        {
          label: 'Patients',
          href: '/admin-dashboard/patients',
        },
        {
          label: 'Edit Patient',
        },
      ]}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Edit Patient
        </h1>

        <Link
          href="/admin-dashboard/patients"
          className="text-cyan-700 hover:underline"
        >
          ← Back
        </Link>
      </div>

      <PatientForm patient={patient} />
    </AppLayout>
  );
}