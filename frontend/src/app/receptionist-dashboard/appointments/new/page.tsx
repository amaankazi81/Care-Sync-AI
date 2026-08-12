'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import AppLayout from '@/components/AppLayout';
import AppointmentForm from '@/components/appointments/AppointmentForm';

import { CreateAppointmentRequest } from '@/types/Appointment';
import appointmentService from '@/services/appointmentService';

export default function NewAppointmentPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateAppointmentRequest) => {
    try {
      await appointmentService.createAppointment(data);

      toast.success('Appointment booked successfully');

      router.push('/receptionist-dashboard/appointments');
    } catch (error) {
      console.error(error);

      toast.error('Failed to create appointment');
    }
  };

  return (
    <AppLayout
      role="receptionist"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/receptionist-dashboard',
        },
        {
          label: 'Appointments',
          href: '/receptionist-dashboard/appointments',
        },
        {
          label: 'New Appointment',
        },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Book New Appointment
          </h1>

          <p className="text-muted-foreground mt-1">
            Create appointment for patient
          </p>
        </div>

        <AppointmentForm
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  );
}