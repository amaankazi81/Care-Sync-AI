'use client';

import {
  Eye,
  Phone,
  User,
} from 'lucide-react';

import { Patient } from '@/types/Patient';


interface DoctorPatientsTableProps {
  patients: Patient[];

  onView?: (
    id: string
  ) => void;
}


/*
 * ---------------------------------------------------------
 * AGE CALCULATOR
 * ---------------------------------------------------------
 */

function calculateAge(
  dateOfBirth: string
): number | string {
  if (!dateOfBirth) {
    return '-';
  }

  const birthDate =
    new Date(dateOfBirth);

  if (
    Number.isNaN(
      birthDate.getTime()
    )
  ) {
    return '-';
  }

  const today =
    new Date();

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
}


/*
 * ---------------------------------------------------------
 * TABLE
 * ---------------------------------------------------------
 */

export default function DoctorPatientsTable({
  patients,
  onView,
}: DoctorPatientsTableProps) {

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-muted">

            <tr>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Patient ID
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Patient Name
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Age
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Gender
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Blood Group
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Phone
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Record
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {patients.length === 0 ? (

              <tr>

                <td
                  colSpan={8}
                  className="py-12 text-center"
                >

                  <div className="flex flex-col items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">

                      <User
                        size={22}
                        className="text-primary"
                      />

                    </div>

                    <div>

                      <p className="font-medium">
                        No patients found
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        No patients match your search.
                      </p>

                    </div>

                  </div>

                </td>

              </tr>

            ) : (

              patients.map(
                (patient) => (

                  <tr
                    key={patient.id}
                    className="border-t transition hover:bg-muted/30"
                  >

                    {/* PATIENT ID */}

                    <td className="px-5 py-4">

                      <span className="font-mono text-xs">
                        {patient.id}
                      </span>

                    </td>


                    {/* PATIENT NAME */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">

                          <User
                            size={17}
                            className="text-primary"
                          />

                        </div>

                        <div>

                          <p className="font-medium">
                            {patient.firstName}{' '}
                            {patient.lastName}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {patient.email}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* AGE */}

                    <td className="px-5 py-4">
                      {calculateAge(
                        patient.dateOfBirth
                      )}
                    </td>


                    {/* GENDER */}

                    <td className="px-5 py-4">
                      {patient.gender || '-'}
                    </td>


                    {/* BLOOD GROUP */}

                    <td className="px-5 py-4">

                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                        {patient.bloodGroup || '-'}
                      </span>

                    </td>


                    {/* PHONE */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Phone
                          size={14}
                          className="text-muted-foreground"
                        />

                        <span className="text-sm">
                          {patient.phone || '-'}
                        </span>

                      </div>

                    </td>


                    {/* RECORD STATUS */}

                    <td className="px-5 py-4">

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Available
                      </span>

                    </td>


                    {/* ACTION */}

                    <td className="px-5 py-4">

                      <div className="flex justify-center">

                        <button
                          type="button"
                          onClick={() =>
                            onView?.(
                              patient.id
                            )
                          }
                          className="rounded-lg border p-2 transition hover:border-primary hover:bg-primary/5"
                          title="View Patient"
                        >

                          <Eye
                            size={17}
                            className="text-primary"
                          />

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* FOOTER */}

      <div className="flex justify-between border-t px-5 py-4 text-sm text-muted-foreground">

        <span>
          Showing{' '}
          <strong className="text-foreground">
            {patients.length}
          </strong>{' '}
          Patient
          {patients.length !== 1
            ? 's'
            : ''}
        </span>

        <span>
          Total Records:{' '}
          <strong className="text-foreground">
            {patients.length}
          </strong>
        </span>

      </div>

    </div>
  );
}