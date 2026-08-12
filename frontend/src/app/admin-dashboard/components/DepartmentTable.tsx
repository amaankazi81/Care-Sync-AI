'use client';

import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { Department } from '@/types/Department';

interface Props {
  departments: Department[];
  onDelete: (id: string) => void;
}

export default function DepartmentTable({
  departments,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr className="text-left">
            <th className="px-5 py-4">Department</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((department) => (
            <tr key={department.id} className="border-t">
              <td className="px-5 py-4">
                <p className="font-semibold">{department.name}</p>

                <p className="text-sm text-slate-500">
                  {department.description}
                </p>
              </td>

              <td className="px-5 py-4">
                <div className="flex gap-4">
                  <Link href={`/admin-dashboard/departments/${department.id}`}>
                    <Eye
                      size={18}
                      className="text-cyan-700 hover:scale-110"
                    />
                  </Link>

                  <Link
                    href={`/admin-dashboard/departments/${department.id}/edit`}
                  >
                    <Pencil
                      size={18}
                      className="text-amber-600 hover:scale-110"
                    />
                  </Link>

                  <button
                    onClick={() => onDelete(department.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}