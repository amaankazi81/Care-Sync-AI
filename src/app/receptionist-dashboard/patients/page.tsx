'use client';

import { useEffect, useMemo, useState } from 'react';

import AppLayout from '@/components/AppLayout';

import PatientSearch from '../components/PatientSearch';
import PatientsTable from '../components/PatientsTable';

import patientService from '@/services/patientService';

import { Patient } from '@/types/Patient';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await patientService.getPatients();

        setPatients(data);
      } catch (err) {
        console.error('Failed to load patients:', err);

        setError('Failed to load patients.');
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return patients;
    }

    return patients.filter((patient) => {
      const fullName =
        `${patient.firstName} ${patient.lastName}`.toLowerCase();

      return (
        fullName.includes(searchValue) ||
        patient.id.toLowerCase().includes(searchValue) ||
        patient.email.toLowerCase().includes(searchValue) ||
        patient.phone.toLowerCase().includes(searchValue)
      );
    });
  }, [patients, search]);

  return (
    <AppLayout
      role="receptionist"
      breadcrumbs={[
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Patients',
        },
      ]}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Patients Management
        </h1>

        <p className="text-slate-500 mt-1">
          Search and manage registered patients.
        </p>
      </div>

      <PatientSearch
        search={search}
        setSearch={setSearch}
      />

      {loading && (
        <div className="mt-6 bg-white rounded-xl border p-8 text-center">
          <p className="text-slate-500">
            Loading patients...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-700 font-medium">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6">
          <PatientsTable
            patients={filteredPatients}
          />
        </div>
      )}

      {!loading &&
        !error &&
        patients.length > 0 &&
        filteredPatients.length === 0 && (
          <div className="mt-6 bg-white rounded-xl border p-8 text-center">
            <p className="text-slate-500">
              No patients found matching your search.
            </p>
          </div>
        )}
    </AppLayout>
  );
}