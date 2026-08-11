'use client';

import React, { useEffect, useState } from 'react';

import MetricCard from '@/components/ui/MetricCard';
import { MetricCardSkeleton } from '@/components/ui/LoadingSkeleton';

import {
  Stethoscope,
  Users,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from 'lucide-react';

import dotnetApi from '@/lib/dotnetApi';

interface DashboardSummary {
  totalDoctors: number;
  totalPatients: number;
  totalDepartments: number;
  totalAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default function AdminKPIGrid() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        setError(false);

        const response =
          await dotnetApi.get<ApiResponse<DashboardSummary>>(
            '/dashboard/summary'
          );

        if (!mounted) return;

        if (response.data?.success) {
          setSummary(response.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(
          'Dashboard summary error:',
          err
        );

        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardSummary();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <MetricCardSkeleton
            key={`kpi-skeleton-${index}`}
          />
        ))}
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card p-5 mb-6">
        <p className="text-sm font-600 text-negative">
          Unable to load dashboard statistics.
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          Please make sure the backend is running on
          port 5036.
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const metrics = [
    {
      id: 'kpi-doctors',
      title: 'Total Doctors',
      value: String(summary.totalDoctors),
      subtitle: `${summary.totalDepartments} departments`,
      icon: (
        <Stethoscope
          size={20}
          className="text-primary"
        />
      ),
      iconBg: 'bg-primary/10',
      variant: 'primary' as const,
      colSpan: 'col-span-1',
    },

    {
      id: 'kpi-patients',
      title: 'Total Patients',
      value: String(summary.totalPatients),
      subtitle: 'Registered patients',
      icon: (
        <Users
          size={20}
          className="text-accent"
        />
      ),
      iconBg: 'bg-accent/10',
      variant: 'default' as const,
      colSpan: 'col-span-1',
    },

    {
      id: 'kpi-today',
      title: "Today's Appointments",
      value: String(summary.todayAppointments),
      subtitle: `${summary.totalAppointments} total appointments`,
      icon: (
        <CalendarCheck
          size={20}
          className="text-primary"
        />
      ),
      iconBg: 'bg-primary/10',
      variant: 'primary' as const,
      colSpan:
        'col-span-1 md:col-span-2 xl:col-span-1',
    },

    {
      id: 'kpi-completed',
      title: 'Completed',
      value: String(summary.completedAppointments),
      subtitle: 'Completed appointments',
      icon: (
        <CheckCircle2
          size={20}
          className="text-positive"
        />
      ),
      iconBg: 'bg-[var(--positive-bg)]',
      variant: 'positive' as const,
      colSpan: 'col-span-1',
    },

    {
      id: 'kpi-pending',
      title: 'Pending',
      value: String(summary.pendingAppointments),
      subtitle: 'Appointments pending',
      icon: (
        <Clock3
          size={20}
          className="text-warning"
        />
      ),
      iconBg: 'bg-[var(--warning-bg)]',
      variant: 'warning' as const,
      colSpan: 'col-span-1',
    },

    {
      id: 'kpi-revenue',
      title: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      subtitle: `This month: ${formatCurrency(
        summary.monthlyRevenue
      )}`,
      icon: (
        <IndianRupee
          size={20}
          className="text-warning"
        />
      ),
      iconBg: 'bg-[var(--warning-bg)]',
      variant: 'warning' as const,
      colSpan: 'col-span-1',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className={metric.colSpan}
        >
          <MetricCard
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
            icon={metric.icon}
            iconBg={metric.iconBg}
            variant={metric.variant}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
}