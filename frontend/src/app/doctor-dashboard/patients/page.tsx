'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import DoctorPatientsTable from '@/components/doctor/DoctorPatientsTable';

import patientService from '@/services/patientService';
import appointmentService from '@/services/appointmentService';
import doctorService from '@/services/doctorService';

import { Patient } from '@/types/Patient';
import { Appointment } from '@/types/Appointment';

import { useAuth } from '@/context/AuthContext';

import {
  Loader2,
  Search,
  Users,
} from 'lucide-react';

import { toast } from 'sonner';

export default function DoctorPatientsPage() {
  const router = useRouter();

  const { user } = useAuth();

  const [patients, setPatients] = useState<Patient[]>([]);

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);


  /*
   * ---------------------------------------------------------
   * LOAD DOCTOR'S PATIENTS
   * ---------------------------------------------------------
   *
   * We do NOT simply display every patient.
   *
   * We first identify the logged-in doctor.
   *
   * Then we get appointments belonging to that doctor.
   *
   * Finally we display only patients who appear in those
   * appointments.
   */

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);

        setError(null);


        /*
         * Logged-in user is required.
         */

        if (!user?.email) {
          throw new Error(
            'Unable to identify the logged-in doctor.'
          );
        }


        /*
         * Load doctors, appointments and patients.
         */

        const [
          doctors,
          allAppointments,
          allPatients,
        ] = await Promise.all([
          doctorService.getDoctors(),
          appointmentService.getAppointments(),
          patientService.getPatients(),
        ]);


        /*
         * Find the currently logged-in doctor
         * using the same approach used by
         * DoctorTodaySchedule.
         */

        const loggedInEmail =
          user.email.trim().toLowerCase();


        const currentDoctor =
          doctors.find(
            (doctor) =>
              doctor.email?.trim().toLowerCase() ===
              loggedInEmail
          );


        if (!currentDoctor) {
          throw new Error(
            'Unable to identify the logged-in doctor.'
          );
        }


        /*
         * Keep only appointments belonging to
         * the logged-in doctor.
         */

        const doctorAppointments =
          allAppointments.filter(
            (appointment) =>
              appointment.doctorId ===
              currentDoctor.id
          );


        /*
         * Store doctor appointments.
         *
         * These are also useful if we later need
         * appointment information.
         */

        setAppointments(
          doctorAppointments
        );


        /*
         * Build a Set of patient IDs.
         *
         * Set prevents duplicate patients when
         * the same patient has multiple appointments.
         */

        const patientIds =
          new Set(
            doctorAppointments
              .map(
                (appointment) =>
                  appointment.patientId
              )
              .filter(Boolean)
          );


        /*
         * Filter the complete patient list.
         */

        const doctorPatients =
          allPatients.filter(
            (patient) =>
              patientIds.has(patient.id)
          );


        setPatients(
          doctorPatients
        );
      } catch (err) {
        console.error(
          'Failed to load doctor patients:',
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load patients.';

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    }


    if (user) {
      loadPatients();
    }
  }, [user]);


  /*
   * ---------------------------------------------------------
   * SEARCH
   * ---------------------------------------------------------
   */

  const filteredPatients =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      if (!keyword) {
        return patients;
      }

      return patients.filter(
        (patient) => {
          const fullName =
            `${patient.firstName} ${patient.lastName}`
              .toLowerCase();

          return (
            fullName.includes(keyword) ||
            patient.id
              .toLowerCase()
              .includes(keyword) ||
            patient.phone
              .toLowerCase()
              .includes(keyword) ||
            patient.email
              .toLowerCase()
              .includes(keyword)
          );
        }
      );
    }, [patients, search]);


  /*
   * ---------------------------------------------------------
   * VIEW PATIENT
   * ---------------------------------------------------------
   */

  const handleView = (
    id: string
  ) => {
    router.push(
      `/doctor-dashboard/patients/${id}`
    );
  };


  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <AppLayout
        role="doctor"
        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/doctor-dashboard',
          },
          {
            label: 'My Patients',
          },
        ]}
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={30}
              className="animate-spin text-primary"
            />

            <p className="text-sm text-muted-foreground">
              Loading your patients...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }


  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  if (error) {
    return (
      <AppLayout
        role="doctor"
        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/doctor-dashboard',
          },
          {
            label: 'My Patients',
          },
        ]}
      >
        <div className="space-y-6">

          <div>
            <h1 className="text-3xl font-bold">
              My Patients
            </h1>

            <p className="mt-1 text-muted-foreground">
              View patients assigned to you.
            </p>
          </div>


          <div className="rounded-xl border border-destructive/30 bg-card p-8 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Users
                size={22}
                className="text-destructive"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Unable to load patients
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>

          </div>

        </div>
      </AppLayout>
    );
  }


  /*
   * ---------------------------------------------------------
   * MAIN PAGE
   * ---------------------------------------------------------
   */

  return (
    <AppLayout
      role="doctor"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/doctor-dashboard',
        },
        {
          label: 'My Patients',
        },
      ]}
    >

      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              My Patients
            </h1>

            <p className="mt-1 text-muted-foreground">
              View patients assigned to you.
            </p>

          </div>


          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">

            <Users
              size={18}
              className="text-primary"
            />

            <span className="text-sm font-medium">
              {patients.length} Patient
              {patients.length !== 1
                ? 's'
                : ''}
            </span>

          </div>

        </div>


        {/* SEARCH */}

        <div className="rounded-xl border bg-card p-5">

          <div className="relative w-full md:w-[420px]">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search by name, ID, phone or email..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

          </div>

        </div>


        {/* PATIENT TABLE */}

        <DoctorPatientsTable
          patients={
            filteredPatients
          }
          onView={handleView}
        />

      </div>

    </AppLayout>
  );
}