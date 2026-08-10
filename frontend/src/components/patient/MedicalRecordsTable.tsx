'use client';

import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MedicalRecord } from '@/types/MedicalRecord';

interface Props {
  records: MedicalRecord[];
}

export default function MedicalRecordsTable({ records }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-5 py-4 text-left">Record ID</th>

            <th className="px-5 py-4 text-left">Doctor</th>

            <th className="px-5 py-4 text-left">Department</th>

            <th className="px-5 py-4 text-left">Visit Date</th>

            <th className="px-5 py-4 text-left">Diagnosis</th>

            <th className="px-5 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center">
                No Medical Records Found
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id} className="border-t hover:bg-muted/40 transition">
                <td className="px-5 py-4">{record.id}</td>

                <td className="px-5 py-4">{record.doctorName}</td>

                <td className="px-5 py-4">{record.department}</td>

                <td className="px-5 py-4">{record.visitDate}</td>

                <td className="px-5 py-4">{record.diagnosis}</td>

                <td className="px-5 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => router.push(`/patient-dashboard/medical-records/${record.id}`)}
                      className="rounded-lg border p-2 hover:bg-cyan-50 transition"
                    >
                      <Eye size={17} className="text-cyan-700" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
