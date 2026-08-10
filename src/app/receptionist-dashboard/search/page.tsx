'use client';

import { useEffect, useState } from 'react';

import AppLayout from '@/components/AppLayout';

import patientService from '@/services/patientService';

import { Patient } from '@/types/Patient';

import PatientsTable from '../components/PatientsTable';
import PatientSearch from '../components/PatientSearch';

export default function SearchPatientPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);

        setError('');

        const data = await patientService.getPatients();

        setPatients(data);
      } catch (err) {
        console.error(err);

        setError('Unable to load patients');
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const keyword = search.trim().toLowerCase();

  const filteredPatients = patients.filter((patient) => {
    if (!keyword) {
      return true;
    }

    const firstName = patient.firstName?.toLowerCase() ?? '';

    const lastName = patient.lastName?.toLowerCase() ?? '';

    const phoneNumber = patient.phone?.toLowerCase() ?? '';

    const email = patient.email?.toLowerCase() ?? '';

    const id = patient.id?.toLowerCase() ?? '';

    return (
      firstName.includes(keyword) ||
      lastName.includes(keyword) ||
      phoneNumber.includes(keyword) ||
      email.includes(keyword) ||
      id.includes(keyword)
    );
  });

  return (
    <AppLayout
      role="receptionist"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/receptionist-dashboard',
        },
        {
          label: 'Search Patient',
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Search Patient
          </h1>

          <p className="text-muted-foreground mt-1">
            Find patients quickly.
          </p>
        </div>

        <PatientSearch
          search={search}
          setSearch={setSearch}
        />

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border bg-white p-10 text-center text-muted-foreground">
            Loading patients...
          </div>
        ) : (
          <PatientsTable
            patients={filteredPatients}
          />
        )}
      </div>
    </AppLayout>
  );
}