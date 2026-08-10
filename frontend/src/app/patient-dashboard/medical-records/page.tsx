'use client';

import AppLayout from '@/components/AppLayout';
import MedicalRecordsTable from '@/components/patient/MedicalRecordsTable';

import { medicalRecords } from '@/mock/medicalRecordMock';

export default function MedicalRecordsPage() {
  return (
    <AppLayout
      role="patient"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/patient-dashboard',
        },
        {
          label: 'Medical Records',
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>

          <p className="text-muted-foreground mt-2">View all your previous consultation records.</p>
        </div>

        <MedicalRecordsTable records={medicalRecords} />
      </div>
    </AppLayout>
  );
}
