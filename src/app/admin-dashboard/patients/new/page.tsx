import AppLayout from '@/components/AppLayout';

import PatientForm from '../../components/PatientForm';

export default function AddPatientPage() {
  return (
    <AppLayout
      role="admin"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/admin-dashboard',
        },
        {
          label: 'Patients',
          href: '/admin-dashboard/patients',
        },
        {
          label: 'Add Patient',
        },
      ]}
    >
      <PatientForm />
    </AppLayout>
  );
}