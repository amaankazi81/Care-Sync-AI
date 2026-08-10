'use client';

import React, { useEffect, useState } from 'react';

import { CalendarDays, FileText, FolderOpen, CreditCard } from 'lucide-react';

import MetricCard from '@/components/ui/MetricCard';
import { MetricCardSkeleton } from '@/components/ui/LoadingSkeleton';

const metrics = [
  {
    id: 'pkpi-1',
    title: 'Upcoming Appointments',
    value: '2',
    subtitle: 'Next visit tomorrow',
    trend: {
      value: 0,
      label: 'Scheduled',
    },
    icon: <CalendarDays size={20} className="text-primary" />,
    iconBg: 'bg-primary/10',
    variant: 'primary' as const,
  },

  {
    id: 'pkpi-2',
    title: 'Active Prescriptions',
    value: '5',
    subtitle: 'Currently prescribed',
    trend: {
      value: 12.5,
      label: 'Updated recently',
    },
    icon: <FileText size={20} className="text-positive" />,
    iconBg: 'bg-[var(--positive-bg)]',
    variant: 'positive' as const,
  },

  {
    id: 'pkpi-3',
    title: 'Medical Records',
    value: '18',
    subtitle: 'Available reports',
    trend: {
      value: 8.2,
      label: 'New reports',
    },
    icon: <FolderOpen size={20} className="text-warning" />,
    iconBg: 'bg-[var(--warning-bg)]',
    variant: 'warning' as const,
  },

  {
    id: 'pkpi-4',
    title: 'Pending Bills',
    value: '₹2,450',
    subtitle: 'Due this month',
    trend: {
      value: -15,
      label: 'Lower than last month',
    },
    icon: <CreditCard size={20} className="text-accent" />,
    iconBg: 'bg-accent/10',
    variant: 'default' as const,
  },
];

export default function PatientKPIGrid() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
      BACKEND API

      GET /api/patient/dashboard/kpis

      Response

      {
        upcomingAppointments,
        activePrescriptions,
        medicalRecords,
        pendingBills
      }

    */

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          subtitle={metric.subtitle}
          trend={metric.trend}
          icon={metric.icon}
          iconBg={metric.iconBg}
          variant={metric.variant}
        />
      ))}
    </div>
  );
}
