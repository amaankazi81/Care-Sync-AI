'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';

import DoctorKPIGrid from './components/DoctorKPIGrid';
import DoctorTodaySchedule from './components/DoctorTodaySchedule';
import DoctorWeekCalendar from './components/DoctorWeekCalendar';
import DoctorUpcomingList from './components/DoctorUpcomingList';
import DoctorRecentPrescriptions from './components/DoctorRecentPrescriptions';

export default function DoctorDashboardPage() {
  const { user } = useAuth();

  const hour = new Date().getHours();

  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <AppLayout
      role="doctor"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Doctor Dashboard' }]}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {greeting}, {user ? `Dr. ${user.firstName} ${user.lastName}` : 'Doctor'}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Here's your schedule and patient summary for today.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <DoctorKPIGrid />

      {/* Schedule + Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <DoctorTodaySchedule />
        </div>

        <div>
          <DoctorWeekCalendar />
        </div>
      </div>

      {/* Upcoming + Prescriptions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div>
          <DoctorUpcomingList />
        </div>

        <div className="xl:col-span-2">
          <DoctorRecentPrescriptions />
        </div>
      </div>
    </AppLayout>
  );
}
