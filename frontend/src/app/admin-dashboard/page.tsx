import React from 'react';

import AppLayout from '@/components/AppLayout';

import AdminKPIGrid from '@/app/components/AdminKPIGrid';
import AdminChartsRow from '@/app/components/AdminChartsRow';
import AdminAppointmentsTable from '@/app/components/AdminAppointmentsTable';
import AdminActivityFeed from '@/app/components/AdminActivityFeed';
import AdminQuickActions from '@/app/components/AdminQuickActions';

export default function AdminDashboardPage() {
  return (
    <AppLayout
      role="admin"
      breadcrumbs={[{ label: 'Home', href: '/admin-dashboard' }, { label: 'Admin Dashboard' }]}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hospital Overview</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Saturday, July 26, 2026 · Last updated 2 minutes ago
          </p>
        </div>

        <AdminQuickActions />
      </div>

      <AdminKPIGrid />

      <AdminChartsRow />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <AdminAppointmentsTable />
        </div>

        <div className="xl:col-span-1">
          <AdminActivityFeed />
        </div>
      </div>
    </AppLayout>
  );
}
