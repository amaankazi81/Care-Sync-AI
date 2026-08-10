'use client';

import AppLayout from '@/components/AppLayout';
import ReceptionistDoctorSchedule from '../components/ReceptionistDoctorSchedule';

export default function DoctorSchedulePage() {
  return (
    <AppLayout
      role="receptionist"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/receptionist-dashboard',
        },
        {
          label: 'Doctor Schedule',
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Doctor Schedule</h1>

          <p className="text-muted-foreground mt-1">View doctor availability and schedules.</p>
        </div>

        <ReceptionistDoctorSchedule />
      </div>
    </AppLayout>
  );
}
