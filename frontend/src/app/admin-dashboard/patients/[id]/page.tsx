'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import patientService from '@/services/patientService';
import { Patient } from '@/types/Patient';

export default function PatientDetailsPage() {
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

  function calculateAge(dateOfBirth: string) {
    const dob = new Date(dateOfBirth);

    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const month =
      today.getMonth() - dob.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
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
          label: 'Patient Details',
        },
      ]}
    >
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Patient Details
          </h1>

          <Link
            href="/admin-dashboard/patients"
            className="text-cyan-700 hover:underline"
          >
            ← Back
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Info
            label="First Name"
            value={patient.firstName}
          />

          <Info
            label="Last Name"
            value={patient.lastName}
          />

          <Info
            label="Age"
            value={calculateAge(
              patient.dateOfBirth
            ).toString()}
          />

          <Info
            label="Gender"
            value={patient.gender}
          />

          <Info
            label="Blood Group"
            value={patient.bloodGroup}
          />

          <Info
            label="Email"
            value={patient.email}
          />

          <Info
            label="Phone"
            value={patient.phone}
          />

          <Info
            label="Emergency Contact"
            value={patient.emergencyContactName}
          />

          <Info
            label="Emergency Number"
            value={patient.emergencyContactNumber}
          />

          <Info
            label="Date of Birth"
            value={patient.dateOfBirth}
          />
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">
            Address
          </h2>

          <div className="rounded-lg border bg-slate-50 p-4">
            {patient.address}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
}