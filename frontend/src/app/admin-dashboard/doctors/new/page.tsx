import AppLayout from '@/components/AppLayout';

import DoctorForm from '../../components/DoctorForm';

export default function AddDoctorPage() {
  return (
    <AppLayout
      role="admin"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        {
          label: 'Doctors',
          href: '/admin-dashboard/doctors',
        },
        { label: 'Add Doctor' },
      ]}
    >
      <DoctorForm />
    </AppLayout>
  );
}
