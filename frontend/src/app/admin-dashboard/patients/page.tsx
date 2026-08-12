'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import AppLayout from '@/components/AppLayout';

import PatientFilters from '../components/PatientFilters';
import PatientTable from '../components/PatientTable';

import patientService from '@/services/patientService';

import { Patient } from '@/types/Patient';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const response = await patientService.getPatients();
      setPatients(response);
    } catch (error) {
      console.error('Failed to load patients', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this patient?'
    );

    if (!confirmed) return;

    try {
      await patientService.deletePatient(id);

      setPatients((prev) =>
        prev.filter((patient) => patient.id !== id)
      );

      alert('Patient deleted successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to delete patient.');
    }
  }

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        patient.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesGender =
        gender === '' || patient.gender === gender;

      const matchesBloodGroup =
        bloodGroup === '' ||
        patient.bloodGroup === bloodGroup;

      return (
        matchesSearch &&
        matchesGender &&
        matchesBloodGroup
      );
    });
  }, [patients, search, gender, bloodGroup]);

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
        },
      ]}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Patient Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage all registered patients.
          </p>
        </div>

        <Link
          href="/admin-dashboard/patients/new"
          className="rounded-lg bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800"
        >
          + Add Patient
        </Link>
      </div>

      <PatientFilters
        search={search}
        onSearchChange={setSearch}
        gender={gender}
        onGenderChange={setGender}
        bloodGroup={bloodGroup}
        onBloodGroupChange={setBloodGroup}
      />

      {loading ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          Loading patients...
        </div>
      ) : (
        <PatientTable
          patients={filteredPatients}
          onDelete={handleDelete}
        />
      )}
    </AppLayout>
  );
}