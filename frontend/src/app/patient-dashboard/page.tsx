'use client';

import React from 'react';

import AppLayout from '@/components/AppLayout';

import PatientKPIGrid from './components/PatientKPIGrid';
import PatientNextAppointment from './components/PatientNextAppointment';
import PatientAppointmentHistory from './components/PatientAppointmentHistory';
import PatientHealthTips from './components/PatientHealthTips';
import PatientBookingCTA from './components/PatientBookingCTA';
import PatientPrescriptions from './components/PatientPrescriptions';

import { useAuth } from '@/context/AuthContext';

export default function PatientDashboardPage() {
  const { user } = useAuth();

  const patientName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Patient';

  return (
    <AppLayout
      role="patient"
      breadcrumbs={[
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Patient Dashboard',
        },
      ]}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome, {patientName}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your appointments and healthcare
            information from one place.
          </p>
        </div>
      </div>

      {/* ======================================================
          KPI GRID
          ====================================================== */}

      <PatientKPIGrid />

      {/* ======================================================
          NEXT APPOINTMENT + HEALTH TIPS
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <PatientNextAppointment />
        </div>

        <div>
          <PatientHealthTips />
        </div>
      </div>

      {/* ======================================================
          RECENT PRESCRIPTIONS
      ====================================================== */}

      <div className="mt-6">
        <PatientPrescriptions />
      </div>

      {/* ======================================================
          BOOK APPOINTMENT CTA
      ====================================================== */}

      <div className="mt-6">
        <PatientBookingCTA />
      </div>

      {/* ======================================================
          APPOINTMENT HISTORY
      ====================================================== */}

      <div className="mt-6">
        <PatientAppointmentHistory />
      </div>
    </AppLayout>
  );
}