'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import AppLayout from '@/components/AppLayout';

import DoctorFilters from '@/components/doctors/DoctorFilters';
import DoctorTable from '../components/DoctorTable';

import doctorService from '@/services/doctorService';
import departmentService from '@/services/departmentService';

import { Doctor } from '@/types/Doctor';
import { Department } from '@/types/Department';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [doctorResponse, departmentResponse] = await Promise.all([
        doctorService.getDoctors(),
        departmentService.getDepartments(),
      ]);

      setDoctors(doctorResponse);
      setDepartments(departmentResponse);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this doctor?'
    );

    if (!confirmed) return;

    try {
      await doctorService.deleteDoctor(id);

      setDoctors((prev) =>
        prev.filter((doctor) => doctor.id !== id)
      );

      alert('Doctor deleted successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to delete doctor.');
    }
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        `${doctor.firstName} ${doctor.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        doctor.specialization
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDepartment =
        department === '' || doctor.departmentId === department;

      const matchesStatus =
        status === '' ||
        (status === 'AVAILABLE'
          ? doctor.isAvailable
          : !doctor.isAvailable);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [doctors, search, department, status]);

  /**
   * Attach Department Name to every doctor
   */
  const doctorsWithDepartment = useMemo(() => {
    return filteredDoctors.map((doctor) => ({
      ...doctor,
      departmentName:
        departments.find(
          (d) => d.id === doctor.departmentId
        )?.name ?? '-',
    }));
  }, [filteredDoctors, departments]);

  return (
    <AppLayout
      role="admin"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/admin-dashboard',
        },
        {
          label: 'Doctors',
        },
      ]}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Doctor Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage all registered doctors.
          </p>
        </div>

        <Link
          href="/admin-dashboard/doctors/new"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800"
        >
          <Plus size={18} />
          Add Doctor
        </Link>
      </div>

      <DoctorFilters
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        status={status}
        onStatusChange={setStatus}
        departments={departments}
      />

      {loading ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          Loading doctors...
        </div>
      ) : (
        <DoctorTable
          doctors={doctorsWithDepartment}
          onDelete={handleDelete}
        />
      )}
    </AppLayout>
  );
}