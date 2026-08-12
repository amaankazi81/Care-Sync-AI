import AppLayout from '@/components/AppLayout';
import DepartmentForm from '../../components/DepartmentForm';

export default function AddDepartmentPage() {
  return (
    <AppLayout
      role="admin"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/admin-dashboard',
        },
        {
          label: 'Departments',
          href: '/admin-dashboard/departments',
        },
        {
          label: 'Add Department',
        },
      ]}
    >
      <DepartmentForm />
    </AppLayout>
  );
}