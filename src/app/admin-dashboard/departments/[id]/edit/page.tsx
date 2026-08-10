'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import DepartmentForm from '../../../components/DepartmentForm';

import departmentService from '@/services/departmentService';
import { Department } from '@/types/Department';

export default function EditDepartmentPage() {
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
      notFound();
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppLayout role="admin">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          Loading department...
        </div>
      </AppLayout>
    );
  }

  if (!department) return null;

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
          label: 'Edit Department',
        },
      ]}
    >
      <DepartmentForm department={department} />
    </AppLayout>
  );
}