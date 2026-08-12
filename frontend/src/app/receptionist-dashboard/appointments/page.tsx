'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarPlus,
  RefreshCw,
  Search,
} from 'lucide-react';

import AppLayout from '@/components/AppLayout';
import AppointmentTable from '@/components/appointments/AppointmentTable';
import AppointmentStats from '@/components/appointments/AppointmentStats';

import useAppointments from '@/hooks/useAppointments';

import type { AppointmentStatus } from '@/types/Appointment';

export default function ReceptionistAppointmentsPage() {
  const router = useRouter();

  const {
    appointments,
    loading,
    error,
    refreshAppointments,
    cancelAppointment,
  } = useAppointments();

  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [doctorFilter, setDoctorFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  /*
   * ---------------------------------------------------------
   * UNIQUE DOCTORS
   * ---------------------------------------------------------
   *
   * doctorName can be null according to Appointment.ts.
   * Therefore we ignore null/empty doctor names here.
   */

  const doctors = useMemo(() => {
    const names = appointments
      .map((appointment) => appointment.doctorName)
      .filter(
        (name): name is string =>
          typeof name === 'string' && name.trim().length > 0
      );

    return Array.from(new Set(names)).sort();
  }, [appointments]);

  /*
   * ---------------------------------------------------------
   * FILTER APPOINTMENTS
   * ---------------------------------------------------------
   */

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      /*
       * Search
       */

      const patientName =
        appointment.patientName ?? '';

      const doctorName =
        appointment.doctorName ?? '';

      const appointmentNumber =
        appointment.appointmentNumber ?? '';

      const department =
        appointment.department ?? '';

      const reason =
        appointment.reason ?? '';

      const matchesSearch =
        normalizedSearch === '' ||
        patientName.toLowerCase().includes(normalizedSearch) ||
        doctorName.toLowerCase().includes(normalizedSearch) ||
        appointmentNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        department
          .toLowerCase()
          .includes(normalizedSearch) ||
        reason
          .toLowerCase()
          .includes(normalizedSearch);

      /*
       * Status
       */

      const matchesStatus =
        statusFilter === '' ||
        appointment.status === statusFilter;

      /*
       * Doctor
       */

      const matchesDoctor =
        doctorFilter === '' ||
        doctorName === doctorFilter;

      /*
       * Date
       */

      const matchesDate =
        dateFilter === '' ||
        appointment.appointmentDate === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDoctor &&
        matchesDate
      );
    });
  }, [
    appointments,
    search,
    statusFilter,
    doctorFilter,
    dateFilter,
  ]);

  /*
   * ---------------------------------------------------------
   * CLEAR FILTERS
   * ---------------------------------------------------------
   */

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDoctorFilter('');
    setDateFilter('');
  };

  /*
   * ---------------------------------------------------------
   * CANCEL
   * ---------------------------------------------------------
   */

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
    } catch (err) {
      console.error(
        'Failed to cancel appointment:',
        err
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

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
          href: '/receptionist-dashboard',
        },
        {
          label: 'Appointments',
        },
      ]}
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    '/receptionist-dashboard'
                  )
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  text-slate-500
                  hover:text-slate-800
                  transition
                "
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Appointments
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              View and manage all patient appointments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={refreshAppointments}
              disabled={loading}
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-slate-300
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                transition
              "
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh
            </button>

            <Link
              href="/receptionist-dashboard/appointments/new"
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-blue-700
                transition
              "
            >
              <CalendarPlus size={17} />

              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div
          className="
            mb-6
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-5
            py-4
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* =====================================================
          APPOINTMENT STATS
          ===================================================== */}

      <div className="mb-6">
        <AppointmentStats
          appointments={appointments}
        />
      </div>

      {/* =====================================================
          FILTER SECTION
          ===================================================== */}

      <div
        className="
          mb-6
          rounded-xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        "
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Search & Filter Appointments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Find appointments by patient, doctor,
            status or date.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* SEARCH */}

          <div className="relative">
            <label
              htmlFor="appointment-search"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Search
            </label>

            <div className="relative">
              <Search
                size={17}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="appointment-search"
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Patient, doctor or appointment..."
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>
          </div>

          {/* STATUS */}

          <div>
            <label
              htmlFor="status-filter"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                border-slate-300
                bg-white
                px-4
                py-2.5
                text-sm
                text-slate-800
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >
              <option value="">
                All Statuses
              </option>

              <option value="BOOKED">
                Booked
              </option>

              <option value="CONFIRMED">
                Confirmed
              </option>

              <option value="CHECKED_IN">
                Checked In
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>

          {/* DOCTOR */}

          <div>
            <label
              htmlFor="doctor-filter"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Doctor
            </label>

            <select
              id="doctor-filter"
              value={doctorFilter}
              onChange={(e) =>
                setDoctorFilter(e.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                border-slate-300
                bg-white
                px-4
                py-2.5
                text-sm
                text-slate-800
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >
              <option value="">
                All Doctors
              </option>

              {doctors.map((doctor) => (
                <option
                  key={doctor}
                  value={doctor}
                >
                  {doctor}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}

          <div>
            <label
              htmlFor="date-filter"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Appointment Date
            </label>

            <input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                border-slate-300
                bg-white
                px-4
                py-2.5
                text-sm
                text-slate-800
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>
        </div>

        {/* FILTER FOOTER */}

        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
            border-t
            border-slate-100
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {filteredAppointments.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-800">
              {appointments.length}
            </span>{' '}
            appointments
          </p>

          {(search ||
            statusFilter ||
            doctorFilter ||
            dateFilter) && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                text-sm
                font-semibold
                text-blue-600
                hover:text-blue-800
              "
              >
                Clear Filters
              </button>
            )}
        </div>
      </div>

      {/* =====================================================
          APPOINTMENTS TABLE
          ===================================================== */}

      <div
        className="
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
          overflow-hidden
        "
      >
        <div
          className="
            flex
            flex-col
            gap-2
            border-b
            border-slate-200
            px-6
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage patient appointments and their
              current status.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            Total:{' '}
            <span className="font-semibold text-slate-900">
              {filteredAppointments.length}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <AppointmentTable
            appointments={filteredAppointments}

            onView={(id: string) =>
              router.push(
                `/receptionist-dashboard/appointments/${id}`
              )
            }

            onEdit={(id: string) =>
              router.push(
                `/receptionist-dashboard/appointments/${id}/edit`
              )
            }

            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* =====================================================
          EMPTY FILTER RESULT
          ===================================================== */}

      {!loading &&
        appointments.length > 0 &&
        filteredAppointments.length === 0 && (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-slate-200
              bg-white
              px-6
              py-10
              text-center
              shadow-sm
            "
          >
            <h3 className="text-lg font-semibold text-slate-800">
              No appointments found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filter
              criteria.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="
                mt-4
                rounded-lg
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-blue-700
                transition
              "
            >
              Clear Filters
            </button>
          </div>
        )}
    </AppLayout>
  );
}