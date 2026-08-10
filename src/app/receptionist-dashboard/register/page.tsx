import AppLayout from '@/components/AppLayout';

import RegisterPatientForm from '../components/RegisterPatientForm';

export default function RegisterPatientPage() {
  return (
    <AppLayout
      role="receptionist"

      breadcrumbs={[
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Register Patient',
        },
      ]}
    >
      <h1
        className="
text-3xl
font-bold
mb-2
"
      >
        Register Patient
      </h1>

      <p
        className="
text-slate-500
mb-6
"
      >
        Create new patient profile.
      </p>

      <RegisterPatientForm />
    </AppLayout>
  );
}
