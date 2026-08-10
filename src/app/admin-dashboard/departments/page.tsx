'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import AppLayout from '@/components/AppLayout';

import DepartmentTable from '../components/DepartmentTable';

import departmentService from '@/services/departmentService';

import { Department } from '@/types/Department';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      const response = await departmentService.getDepartments();
      setDepartments(response);
    } catch (error) {
      console.error('Failed to load departments', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this department?'
    );

    if (!confirmed) return;

    try {
      await departmentService.deleteDepartment(id);

      setDepartments((prev) =>
        prev.filter((department) => department.id !== id)
      );

      alert('Department deleted successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to delete department.');
    }
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
          label: 'Departments',
        },
      ]}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Department Management
          </h1>

          <p className="mt-1 text-slate-500">
            View and manage all hospital departments.
          </p>
        </div>

        <Link
          href="/admin-dashboard/departments/new"
          className="rounded-lg bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800"
        >
          + Add Department
        </Link>
      </div>

      {loading ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          Loading departments...
        </div>
      ) : (
        <DepartmentTable
          departments={departments}
          onDelete={handleDelete}
        />
      )}
    </AppLayout>
  );
}