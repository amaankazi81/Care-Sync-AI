'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import ReceptionistPatientSearch from './components/ReceptionistPatientSearch';
import ReceptionistDoctorSchedule from './components/ReceptionistDoctorSchedule';
import ReceptionistQuickActions from './components/ReceptionistQuickActions';

import AppointmentTable from '@/components/appointments/AppointmentTable';
import AppointmentStats from '@/components/appointments/AppointmentStats';

import useAppointments from '@/hooks/useAppointments';

export default function ReceptionistDashboardPage() {
  const router = useRouter();

  const {
    appointments,
    loading,
    cancelAppointment,
  } = useAppointments();

  return (
    <AppLayout
      role="receptionist"
      breadcrumbs={[
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Receptionist Dashboard',
        },
      ]}
    >
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Receptionist Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage Appointment, Patient and Doctor schedules.
          </p>
        </div>
      </div>

      {/* =====================================================
          QUICK ACTIONS
          ===================================================== */}

      <section className="mb-6">
        <ReceptionistQuickActions />
      </section>

      {/* =====================================================
          REAL APPOINTMENT STATISTICS
          ===================================================== */}

      <section className="mt-6">
        <AppointmentStats
          appointments={appointments}
        />
      </section>

      {/* =====================================================
          RECENT APPOINTMENTS
          ===================================================== */}

      <section className="mt-6">
        <div
          className="
            rounded-xl
            border
            bg-white
            shadow-sm
            overflow-hidden
          "
        >
          {/* SECTION HEADER */}

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Appointments
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                View and manage recent patient appointments.
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-3">
              <Link
                href="/receptionist-dashboard/appointments"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  hover:bg-slate-50
                "
              >
                View All
              </Link>

              <Link
                href="/receptionist-dashboard/appointments/new"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                <CalendarPlus size={17} />

                Book Appointment
              </Link>
            </div>
          </div>

          {/* TABLE */}

          <div className="p-4 sm:p-6">
            <AppointmentTable
              appointments={appointments.slice(0, 5)}
              loading={loading}
              onView={(id: string) => {
                router.push(
                  `/receptionist-dashboard/appointments/${id}`
                );
              }}
              onEdit={(id: string) => {
                router.push(
                  `/receptionist-dashboard/appointments/${id}/edit`
                );
              }}
              onCancel={async (id: string) => {
                await cancelAppointment(id);
              }}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          DOCTOR SCHEDULE
          ===================================================== */}

      <section className="mt-6">
        <div
          className="
            w-full
            rounded-xl
            border
            bg-white
            shadow-sm
            overflow-hidden
          "
        >
          <ReceptionistDoctorSchedule />
        </div>
      </section>

      {/* =====================================================
          PATIENT SEARCH
          ===================================================== */}

      <section className="mt-6">
        <div
          className="
            w-full
            rounded-xl
            border
            bg-white
            shadow-sm
            overflow-hidden
          "
        >
          <ReceptionistPatientSearch />
        </div>
      </section>
    </AppLayout>
  );
}