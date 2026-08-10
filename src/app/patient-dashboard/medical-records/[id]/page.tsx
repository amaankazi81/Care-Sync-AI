'use client';

import { useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { medicalRecords } from '@/mock/medicalRecordMock';

export default function MedicalRecordDetailsPage() {
  const params = useParams();

  const record = medicalRecords.find((item) => item.id === String(params.id));

  if (!record) {
    return (
      <AppLayout role="patient">
        <div className="text-center py-20">Medical Record Not Found</div>
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
          label: 'Medical Records',
          href: '/patient-dashboard/medical-records',
        },
        {
          label: 'Record Details',
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Medical Record</h1>

          <p className="text-muted-foreground">View complete medical record.</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="grid md:grid-cols-2 gap-5">
            <Info title="Record No." value={record.id} />

            <Info title="Doctor" value={record.doctorName} />

            <Info title="Department" value={record.department} />

            <Info title="Diagnosis" value={record.diagnosis} />

            <Info title="Visit Date" value={record.visitDate} />

            <Info title="Prescription" value={record.prescription} />

            <Info title="Remarks" value={record.remarks} />
          </div>

          <div className="mt-6 rounded-lg border p-5">
            <h3 className="font-semibold mb-2">Remarks</h3>

            <p>{record.remarks}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}
