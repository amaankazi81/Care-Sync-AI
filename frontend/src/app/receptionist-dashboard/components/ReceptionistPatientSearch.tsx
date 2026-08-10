'use client';

import React, { useEffect, useState } from 'react';

import {
  Search,
  User,
  Phone,
  Mail,
  CalendarPlus,
  FileText,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import patientService from '@/services/patientService';

import { Patient } from '@/types/Patient';

export default function ReceptionistPatientSearch() {
  const router = useRouter();

  const [search, setSearch] = useState('');

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const loadPatients = async () => {
    try {
      setLoading(true);

      setError(null);

      const data =
        await patientService.getPatients();

      setPatients(data);
    } catch (err) {
      console.error(
        'Failed to load patients:',
        err
      );

      setError(
        'Unable to load patient records.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients =
    patients.filter((patient) => {
      const fullName =
        `${patient.firstName} ${patient.lastName}`.toLowerCase();

      const query =
        search.toLowerCase().trim();

      if (!query) {
        return true;
      }

      return (
        fullName.includes(query) ||
        patient.id
          .toLowerCase()
          .includes(query) ||
        patient.email
          .toLowerCase()
          .includes(query) ||
        patient.phone
          .toLowerCase()
          .includes(query)
      );
    });

  const handleViewRecord = (
    patientId: string
  ) => {
    router.push(
      `/receptionist-dashboard/patients/${patientId}`
    );
  };

  const handleBookAppointment = (
    patientId: string
  ) => {
    router.push(
      `/receptionist-dashboard/appointments/new?patientId=${encodeURIComponent(
        patientId
      )}`
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* HEADER */}

      <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Patient Search
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            Find patient records quickly.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push(
              '/receptionist-dashboard/register'
            )
          }
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
        >
          <CalendarPlus size={16} />

          Register Patient
        </button>
      </div>

      {/* SEARCH */}

      <div className="p-6">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by patient name, ID, email or phone..."
            className="
w-full
rounded-lg
border
border-border
bg-background
py-3
pl-11
pr-4
text-sm
focus:outline-none
focus:ring-2
focus:ring-primary
"
          />
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="px-6 py-10 text-center text-sm text-muted-foreground">
          Loading patients...
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadPatients}
            className="mt-3 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* PATIENT LIST */}

      {!loading &&
        !error &&
        filteredPatients.length > 0 && (
          <div className="divide-y divide-border">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="px-6 py-5 hover:bg-muted/20 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  {/* PATIENT INFORMATION */}

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User
                        size={19}
                        className="text-primary"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        {patient.firstName}{' '}
                        {patient.lastName}
                      </p>

                      <p className="text-xs text-primary font-medium mt-1">
                        Patient ID: {patient.id}
                      </p>

                      <p className="text-xs text-muted-foreground mt-2">
                        {patient.gender} ·{' '}
                        {patient.dateOfBirth}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleViewRecord(
                          patient.id
                        )
                      }
                      className="
flex
items-center
gap-1.5
px-3
py-2
rounded-lg
border
border-border
text-xs
font-semibold
hover:bg-muted
transition
"
                    >
                      <FileText size={14} />

                      View Record
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleBookAppointment(
                          patient.id
                        )
                      }
                      className="
flex
items-center
gap-1.5
px-3
py-2
rounded-lg
bg-primary
text-white
text-xs
font-semibold
hover:opacity-90
transition
"
                    >
                      <CalendarPlus size={14} />

                      Book Appointment
                    </button>
                  </div>
                </div>

                {/* CONTACT INFORMATION */}

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-background border border-border p-4">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Contact
                    </p>

                    <p className="text-sm flex items-center gap-2 mt-2">
                      <Phone size={14} />

                      {patient.phone}
                    </p>

                    <p className="text-sm flex items-center gap-2 mt-2">
                      <Mail size={14} />

                      {patient.email}
                    </p>
                  </div>

                  <div className="rounded-lg bg-background border border-border p-4">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Medical Information
                    </p>

                    <p className="text-sm mt-2">
                      Blood Group:{' '}
                      <span className="font-semibold">
                        {patient.bloodGroup ||
                          'Not Available'}
                      </span>
                    </p>

                    <p className="text-sm mt-2">
                      Address:{' '}
                      <span className="font-semibold">
                        {patient.address ||
                          'Not Available'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* NO RESULT */}

      {!loading &&
        !error &&
        filteredPatients.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Search
              size={28}
              className="mx-auto text-muted-foreground"
            />

            <p className="mt-3 text-sm font-medium">
              No patient found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try another name, patient ID, email or phone number.
            </p>
          </div>
        )}
    </div>
  );
}