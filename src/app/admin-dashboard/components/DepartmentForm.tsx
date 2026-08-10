'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import departmentService from '@/services/departmentService';

import {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/types/Department';

interface Props {
  department?: Department;
}

export default function DepartmentForm({
  department,
}: Props) {
  const router = useRouter();

  const [name, setName] = useState(
    department?.name ?? ''
  );

  const [description, setDescription] = useState(
    department?.description ?? ''
  );

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      if (department) {
        const payload: UpdateDepartmentRequest = {
          name,
          description,
        };

        await departmentService.updateDepartment(
          department.id,
          payload
        );

        alert('Department updated successfully');
      } else {
        const payload: CreateDepartmentRequest = {
          name,
          description,
        };

        await departmentService.createDepartment(
          payload
        );

        alert('Department created successfully');
      }

      router.push('/admin-dashboard/departments');
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-white p-8 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Department Name
        </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
          placeholder="Department Name"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          rows={5}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full rounded-lg border px-4 py-2"
          placeholder="Department Description"
          required
        />
      </div>

      <button className="rounded-lg bg-cyan-700 px-6 py-3 font-semibold text-white hover:bg-cyan-800">
        {department
          ? 'Update Department'
          : 'Add Department'}
      </button>
    </form>
  );
}