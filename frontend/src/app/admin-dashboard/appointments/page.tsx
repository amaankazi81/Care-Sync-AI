'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import AppLayout from '@/components/AppLayout';
import AppointmentTable from '../../../components/appointments/AppointmentTable';
import AppointmentFilters from '@/components/appointments/AppointmentFilters';

import appointmentService from '@/services/appointmentService';
import { Appointment } from '@/types/Appointment';

import { toast } from 'sonner';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);

      const response =
        await appointmentService.getAppointments();

      setAppointments(response);
    } catch (error) {
      console.error(error);

      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        (appointment.patientName ?? '')
          .toLowerCase()
          .includes(keyword) ||
        (appointment.doctorName ?? '')
          .toLowerCase()
          .includes(keyword) ||
        (appointment.appointmentNumber ?? '')
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        status === 'ALL' ||
        appointment.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, status]);

  return (
    <AppLayout
      role="admin"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/',
        },
        {
          label: 'Appointments',
        },
      ]}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Appointment Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage all hospital appointments.
          </p>
        </div>

        <Link
          href="/admin-dashboard/appointments/new"
          className="rounded-lg bg-cyan-700 px-5 py-2 text-white transition hover:bg-cyan-800"
        >
          + Book Appointment
        </Link>
      </div>

      <AppointmentFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-slate-500">
            Loading appointments...
          </div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center text-slate-500">
          No appointments found.
        </div>
      ) : (
        <AppointmentTable
          appointments={filteredAppointments}
        />
      )}
    </AppLayout>
  );
}