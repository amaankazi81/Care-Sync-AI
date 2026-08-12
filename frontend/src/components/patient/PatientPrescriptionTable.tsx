'use client';

import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { PatientPrescription } from '@/types/PatientPrescription';

interface Props {
  prescriptions: PatientPrescription[];
}

export default function PatientPrescriptionTable({ prescriptions }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-5 py-4 text-left">Prescription ID</th>

            <th className="px-5 py-4 text-left">Doctor</th>

            <th className="px-5 py-4 text-left">Department</th>

            <th className="px-5 py-4 text-left">Date</th>

            <th className="px-5 py-4 text-left">Diagnosis</th>

            <th className="px-5 py-4 text-left">Follow Up</th>

            <th className="px-5 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {prescriptions.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-10 text-center text-muted-foreground">
                No Prescriptions Found
              </td>
            </tr>
          ) : (
            prescriptions.map((item) => (
              <tr key={item.id} className="border-t hover:bg-muted/40 transition">
                <td className="px-5 py-4">{item.id}</td>

                <td className="px-5 py-4">{item.doctorName}</td>

                <td className="px-5 py-4">{item.department}</td>

                <td className="px-5 py-4">{item.prescriptionDate}</td>

                <td className="px-5 py-4">{item.diagnosis}</td>

                <td className="px-5 py-4">{item.followUpDate}</td>

                <td className="px-5 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => router.push(`/patient-dashboard/prescriptions/${item.id}`)}
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
