'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import AppLayout from '@/components/AppLayout';
import AppointmentForm from '@/components/appointments/AppointmentForm';

import appointmentService from '@/services/appointmentService';

import {
  Appointment,
  UpdateAppointmentRequest,
} from '@/types/Appointment';

export default function EditAppointmentPage() {
  const router = useRouter();

  const params = useParams();

  const id = params.id as string;

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);

        const data =
          await appointmentService.getAppointmentById(id);

        if (data) {
          setAppointment(data);
        } else {
          setError('Appointment not found');
        }
      } catch (err) {
        console.error(err);

        setError('Unable to load appointment');
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [id]);

  const handleSubmit = async (
    data: UpdateAppointmentRequest
  ) => {
    try {
      setSaving(true);

      setError('');

      await appointmentService.updateAppointment(
        id,
        data
      );

      router.push(
        `/receptionist-dashboard/appointments/${id}`
      );

      router.refresh();
    } catch (err) {
      console.error(err);

      setError('Unable to update appointment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout role="receptionist">
        <div className="p-10 text-center">
          Loading appointment...
        </div>
      </AppLayout>
    );
  }

  if (!appointment) {
    return (
      <AppLayout role="receptionist">
        <div className="p-10 text-center text-red-600">
          {error || 'Appointment not found'}
        </div>
      </AppLayout>
    );
  }

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
          label: 'Edit Appointment',
        },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold">
            Edit Appointment
          </h1>

          <p className="text-muted-foreground mt-1">
            Update appointment information
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}

        <AppointmentForm
          initialValues={{
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            appointmentDate:
              appointment.appointmentDate,
            appointmentTime:
              appointment.appointmentTime,
            reason:
              appointment.reason ?? '',
            notes:
              appointment.notes ?? '',
            status:
              appointment.status ?? 'BOOKED',
          }}

          isEdit={true}

          onSubmit={handleSubmit}
        />

      </div>
    </AppLayout>
  );
}