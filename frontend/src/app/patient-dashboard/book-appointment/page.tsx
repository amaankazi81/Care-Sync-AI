'use client';

import AppLayout from '@/components/AppLayout';
import BookingForm from '@/components/patient/BookingForm';

export default function BookAppointmentPage() {
  return (
    <AppLayout
      role="patient"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/patient-dashboard',
        },
        {
          label: 'Book Appointment',
        },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Book Appointment</h1>

          <p className="text-muted-foreground mt-2">
            Select department, doctor and available time slot.
          </p>
        </div>

        {/* Booking Form */}

        <BookingForm />
      </div>
    </AppLayout>
  );
}
