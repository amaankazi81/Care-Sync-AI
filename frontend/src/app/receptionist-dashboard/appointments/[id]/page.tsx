'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import { Calendar, Clock, User, Stethoscope, FileText, ArrowLeft, Edit } from 'lucide-react';

import appointmentService from '@/services/appointmentService';

import { Appointment } from '@/types/Appointment';

export default function AppointmentDetailsPage() {
  const params = useParams();

  const router = useRouter();

  const id = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const data = await appointmentService.getAppointmentById(id);

        if (data) {
          setAppointment(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [id]);

  if (loading) {
    return (
      <AppLayout role="receptionist">
        <div className="p-10 text-center">Loading appointment...</div>
      </AppLayout>
    );
  }

  if (!appointment) {
    return (
      <AppLayout role="receptionist">
        <div className="p-10 text-center">Appointment not found</div>
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
          label: 'Details',
        },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Appointment Details</h1>

            <p className="text-muted-foreground mt-1">{appointment.appointmentNumber}</p>
          </div>

          <button
            onClick={() => router.push(`/receptionist-dashboard/appointments/${id}/edit`)}

            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg"
          >
            <Edit size={16} />
            Edit
          </button>
        </div>

        {/* Patient Information */}

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User size={20} />
            Patient Information
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mt-5">
            <div>
              <p className="text-xs text-muted-foreground">Patient Name</p>

              <p className="font-semibold">{appointment.patientName}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Patient ID</p>

              <p>{appointment.patientId}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Status</p>

              <p className="font-semibold">{appointment.status}</p>
            </div>
          </div>
        </div>

        {/* Appointment Information */}

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={20} />
            Appointment Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mt-5">
            <div>
              <p className="text-xs text-muted-foreground">Date</p>

              <p>{appointment.appointmentDate}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Time</p>

              <p className="flex items-center gap-2">
                <Clock size={14} />

                {appointment.appointmentTime}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Doctor</p>

              <p className="flex items-center gap-2">
                <Stethoscope size={14} />

                {appointment.doctorName}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Department</p>

              <p>{appointment.department}</p>
            </div>
          </div>
        </div>

        {/* Reason */}

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText size={20} />
            Visit Details
          </h2>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Reason</p>

            <p>{appointment.reason}</p>
          </div>

          {appointment.notes && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Notes</p>

              <p>{appointment.notes}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => router.back()}

          className="flex items-center gap-2 border px-5 py-2 rounded-lg"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    </AppLayout>
  );
}
