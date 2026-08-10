'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import departmentService from '@/services/departmentService';
import { Department } from '@/types/Department';

export default function DepartmentDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [department, setDepartment] =
    useState<Department | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartment();
  }, []);

  async function loadDepartment() {
    try {
      const data =
        await departmentService.getDepartmentById(id);

      setDepartment(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppLayout role="admin">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          Loading...
        </div>
      </AppLayout>
    );
  }

  if (!department) {
    return (
      <AppLayout role="admin">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          Department not found.
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
          label: 'Departments',
          href: '/admin-dashboard/departments',
        },
        {
          label: department.name,
        },
      ]}
    >
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Department Details
          </h1>

          <Link
            href="/admin-dashboard/departments"
            className="text-cyan-700 hover:underline"
          >
            ← Back
          </Link>
        </div>

        <div className="space-y-6">
          <Info
            label="Department Name"
            value={department.name}
          />

          <div>
            <p className="mb-2 text-sm text-slate-500">
              Description
            </p>

            <div className="rounded-lg border bg-slate-50 p-4">
              {department.description}
            </div>
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
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}