'use client';

import AppLayout from '@/components/AppLayout';

import PatientPrescriptionTable from '@/components/patient/PatientPrescriptionTable';

import { patientPrescriptions } from '@/mock/patientPrescriptionMock';

export default function PatientPrescriptionsPage() {
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
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Prescriptions</h1>

          <p className="text-muted-foreground mt-2">View prescriptions issued by your doctors.</p>
        </div>

        <PatientPrescriptionTable prescriptions={patientPrescriptions} />
      </div>
    </AppLayout>
  );
}
