'use client';

import Link from 'next/link';
import { Doctor } from '@/types/Doctor';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface DoctorTableProps {
  doctors: Doctor[];
  onDelete: (id: string) => void;
}

export default function DoctorTable({
  doctors,
  onDelete,
}: DoctorTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr className="text-left text-sm text-slate-700">
            <th className="px-5 py-3">Doctor</th>

            <th className="px-5 py-3">Specialization</th>

            <th className="px-5 py-3">Qualification</th>

            <th className="px-5 py-3">Experience</th>

            <th className="px-5 py-3">Room</th>

            <th className="px-5 py-3">Status</th>

            <th className="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((doctor) => (
            <tr
              key={doctor.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <div>
                  <p className="font-semibold">
                    {doctor.firstName} {doctor.lastName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {doctor.email}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                {doctor.specialization}
              </td>

              <td className="px-5 py-4">
                {doctor.qualification}
              </td>

              <td className="px-5 py-4">
                {doctor.experience} Years
              </td>

              <td className="px-5 py-4">
                {doctor.roomNumber}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    doctor.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {doctor.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-center items-center gap-4">
                  <Link href={`/admin-dashboard/doctors/${doctor.id}`}>
                    <Eye
                      size={18}
                      className="cursor-pointer text-cyan-700 transition hover:scale-110"
                    />
                  </Link>

                  <Link
                    href={`/admin-dashboard/doctors/${doctor.id}/edit`}
                  >
                    <Pencil
                      size={18}
                      className="cursor-pointer text-amber-600 transition hover:scale-110"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onDelete(doctor.id)}
                  >
                    <Trash2
                      size={18}
                      className="cursor-pointer text-red-600 transition hover:scale-110"
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {doctors.length === 0 && (
        <div className="p-8 text-center text-slate-500">
          No doctors found.
        </div>
      )}
    </div>
  );
}