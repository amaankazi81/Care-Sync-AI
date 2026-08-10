'use client';

import { useParams } from 'next/navigation';

import AppLayout from '@/components/AppLayout';
import { patientPrescriptions } from '@/mock/patientPrescriptionMock';

export default function PrescriptionDetailsPage() {
  const params = useParams();

  const prescription = patientPrescriptions.find((item) => item.id === String(params.id));

  if (!prescription) {
    return (
      <AppLayout role="patient">
        <div className="text-center py-20">Prescription Not Found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      role="patient"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/patient-dashboard',
        },
        {
          label: 'Prescriptions',
          href: '/patient-dashboard/prescriptions',
        },
        {
          label: 'Prescription Details',
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Prescription Details</h1>

          <p className="text-muted-foreground mt-2">View complete prescription information.</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-5">Prescription Information</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <Info title="Prescription ID" value={prescription.id} />

            <Info title="Appointment ID" value={prescription.appointmentId} />

            <Info title="Doctor" value={prescription.doctorName} />

            <Info title="Department" value={prescription.department} />

            <Info title="Diagnosis" value={prescription.diagnosis} />

            <Info title="Prescription Date" value={prescription.prescriptionDate} />

            <Info title="Follow Up" value={prescription.followUpDate} />
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-3">Medicines</h3>

            <ul className="list-disc pl-6 space-y-2">
              {prescription.medicines.map((medicine) => (
                <li key={medicine}>{medicine}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

interface InfoProps {
  title: string;
  value: string;
}

function Info({ title, value }: InfoProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
