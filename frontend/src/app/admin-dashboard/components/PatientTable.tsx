'use client';

import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { Patient } from '@/types/Patient';

interface Props {
  patients: Patient[];
  onDelete: (id: string) => void;
}

export default function PatientTable({
  patients,
  onDelete,
}: Props) {
  function calculateAge(dateOfBirth: string) {
    const dob = new Date(dateOfBirth);

    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const month =
      today.getMonth() - dob.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr className="text-left">
            <th className="px-5 py-4">Patient</th>

            <th className="px-5 py-4">Age</th>

            <th className="px-5 py-4">Gender</th>

            <th className="px-5 py-4">Phone</th>

            <th className="px-5 py-4">Blood Group</th>

            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <div>
                  <p className="font-semibold">
                    {patient.firstName}{' '}
                    {patient.lastName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {patient.email}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                {calculateAge(patient.dateOfBirth)}
              </td>

              <td className="px-5 py-4">
                {patient.gender}
              </td>

              <td className="px-5 py-4">
                {patient.phone}
              </td>

              <td className="px-5 py-4">
                {patient.bloodGroup}
              </td>

              <td className="px-5 py-4">
                <div className="flex gap-4">
                  <Link
                    href={`/admin-dashboard/patients/${patient.id}`}
                  >
                    <Eye
                      size={18}
                      className="text-cyan-700 hover:scale-110"
                    />
                  </Link>

                  <Link
                    href={`/admin-dashboard/patients/${patient.id}/edit`}
                  >
                    <Pencil
                      size={18}
                      className="text-amber-600 hover:scale-110"
                    />
                  </Link>

                  <button
                    onClick={() => onDelete(patient.id)}
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