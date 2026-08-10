'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import AppLayout from '@/components/AppLayout';

import AppointmentForm from '@/components/appointments/AppointmentForm';

import appointmentService from '@/services/appointmentService';
import { CreateAppointmentRequest } from '@/types/Appointment';

export default function NewAppointmentPage() {
  const router = useRouter();

  async function handleCreateAppointment(
    data: CreateAppointmentRequest
  ) {
    try {
      await appointmentService.createAppointment(data);

      toast.success(
        'Appointment booked successfully.'
      );

      router.push('/admin-dashboard/appointments');
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          'Failed to book appointment.'
      );
    }
  }

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
          href: '/admin-dashboard/appointments',
        },
        {
          label: 'Book Appointment',
        },
      ]}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Book New Appointment
        </h1>

        <p className="mt-1 text-slate-500">
          Schedule a new appointment for a patient.
        </p>
      </div>

      <AppointmentForm
        onSubmit={handleCreateAppointment}
      />
    </AppLayout>
  );
}