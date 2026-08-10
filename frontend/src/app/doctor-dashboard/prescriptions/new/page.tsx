'use client';

import { useSearchParams } from 'next/navigation';

import AppLayout from '@/components/AppLayout';
import PrescriptionForm from '@/components/doctor/PrescriptionForm';

export default function NewPrescriptionPage() {
  const searchParams = useSearchParams();

  const appointmentId = searchParams.get('appointmentId') ?? '';

  const patientId = searchParams.get('patientId') ?? '';

  const doctorId = searchParams.get('doctorId') ?? '';

  return (
    <AppLayout
      role="doctor"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/doctor-dashboard',
        },
        {
          label: 'Prescriptions',
          href: '/doctor-dashboard/prescriptions',
        },
        {
          label: 'New Prescription',
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Prescription</h1>

          <p className="text-muted-foreground mt-2">Generate a prescription for the patient.</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Appointment ID</p>

              <p className="font-semibold">{appointmentId}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Patient ID</p>

              <p className="font-semibold">{patientId}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Doctor ID</p>

              <p className="font-semibold">{doctorId}</p>
            </div>
          </div>
        </div>

        <PrescriptionForm appointmentId={appointmentId} patientId={patientId} doctorId={doctorId} />
      </div>
    </AppLayout>
  );
}
