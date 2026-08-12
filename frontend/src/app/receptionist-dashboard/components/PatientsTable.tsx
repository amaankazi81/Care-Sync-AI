'use client';

import Link from 'next/link';

import {
  Eye,
  Loader2,
} from 'lucide-react';

import { Patient } from '@/types/Patient';

interface Props {
  patients: Patient[];

  loading?: boolean;
}

export default function PatientsTable({
  patients,
  loading = false,
}: Props) {
  /*
   * =========================================================
   * CALCULATE AGE
   * =========================================================
   */

  const calculateAge = (
    dateOfBirth: string
  ): number | string => {
    if (!dateOfBirth) {
      return '-';
    }

    const birthDate =
      new Date(dateOfBirth);

    if (Number.isNaN(
      birthDate.getTime()
    )) {
      return '-';
    }

    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() <
          birthDate.getDate()
      )
    ) {
      age--;
    }

    return age;
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div
        className="
          bg-white
          rounded-xl
          border
          overflow-hidden
        "
      >
        <div
          className="
            flex
            items-center
            justify-center
            gap-3
            py-16
            text-slate-500
          "
        >
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>
            Loading patients...
          </span>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * EMPTY
   * =========================================================
   */

  if (patients.length === 0) {
    return (
      <div
        className="
          bg-white
          rounded-xl
          border
          px-6
          py-16
          text-center
        "
      >
        <p className="font-semibold text-slate-700">
          No patients found
        </p>

        <p className="text-sm text-slate-500 mt-1">
          No registered patient matches your search.
        </p>
      </div>
    );
  }

  /*
   * =========================================================
   * TABLE
   * =========================================================
   */

  return (
    <div
      className="
        bg-white
        rounded-xl
        border
        overflow-hidden
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Patient
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-center
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Age
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-center
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Gender
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-center
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Blood Group
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-center
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Phone
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-center
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="
                  border-t
                  hover:bg-slate-50
                  transition
                "
              >
                {/* PATIENT */}

                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-800">
                    {patient.firstName}{' '}
                    {patient.lastName}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {patient.email}
                  </p>
                </td>

                {/* AGE */}

                <td className="px-5 py-4 text-center">
                  {calculateAge(
                    patient.dateOfBirth
                  )}
                </td>

                {/* GENDER */}

                <td className="px-5 py-4 text-center">
                  {patient.gender || '-'}
                </td>

                {/* BLOOD GROUP */}

                <td className="px-5 py-4 text-center">
                  {patient.bloodGroup || '-'}
                </td>

                {/* PHONE */}

                <td className="px-5 py-4 text-center">
                  {patient.phone || '-'}
                </td>

                {/* ACTION */}

                <td className="px-5 py-4 text-center">
                  <Link
                    href={`/receptionist-dashboard/patients/${patient.id}`}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      w-9
                      h-9
                      rounded-lg
                      text-cyan-600
                      hover:bg-cyan-50
                      hover:text-cyan-800
                      transition
                    "
                    title="View patient"
                  >
                    <Eye size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}

      <div
        className="
          border-t
          bg-slate-50
          px-5
          py-3
          text-sm
          text-slate-500
        "
      >
        Showing{' '}
        <span className="font-semibold text-slate-700">
          {patients.length}
        </span>{' '}
        patient
        {patients.length !== 1
          ? 's'
          : ''}
      </div>
    </div>
  );
}