'use client';

import React, { useState, useEffect } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { MetricCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { Stethoscope, Users, CalendarCheck, CheckCircle2, XCircle, DollarSign } from 'lucide-react';

const metrics = [
  {
    id: 'kpi-doctors',
    title: 'Total Doctors',
    value: '148',
    subtitle: '12 on leave today',
    trend: { value: 4.2, label: 'vs last month' },
    icon: <Stethoscope size={20} className="text-primary" />,
    iconBg: 'bg-primary/10',
    variant: 'primary' as const,
    colSpan: 'col-span-1',
  },
  {
    id: 'kpi-patients',
    title: 'Total Patients',
    value: '4,821',
    subtitle: '38 new this week',
    trend: { value: 6.8, label: 'vs last month' },
    icon: <Users size={20} className="text-accent" />,
    iconBg: 'bg-accent/10',
    variant: 'default' as const,
    colSpan: 'col-span-1',
  },
  {
    id: 'kpi-today',
    title: "Today\'s Appointments",
    value: '94',
    subtitle: '17 yet to check in',
    trend: { value: 11.3, label: 'vs yesterday' },
    icon: <CalendarCheck size={20} className="text-primary" />,
    iconBg: 'bg-primary/10',
    variant: 'primary' as const,
    colSpan: 'col-span-1 md:col-span-2 xl:col-span-1',
  },
  {
    id: 'kpi-completed',
    title: 'Completed Today',
    value: '61',
    subtitle: '64.9% completion rate',
    trend: { value: 3.1, label: 'vs yesterday' },
    icon: <CheckCircle2 size={20} className="text-positive" />,
    iconBg: 'bg-[var(--positive-bg)]',
    variant: 'positive' as const,
    colSpan: 'col-span-1',
  },
  {
    id: 'kpi-cancelled',
    title: 'Cancelled Today',
    value: '9',
    subtitle: '9.6% cancellation rate',
    trend: { value: -2.4, label: 'vs yesterday' },
    icon: <XCircle size={20} className="text-negative" />,
    iconBg: 'bg-[var(--negative-bg)]',
    variant: 'negative' as const,
    colSpan: 'col-span-1',
  },
  {
    id: 'kpi-revenue',
    title: "Today\'s Revenue",
    value: '$12,480',
    subtitle: 'Billing in progress',
    trend: { value: 8.7, label: 'vs yesterday' },
    icon: <DollarSign size={20} className="text-warning" />,
    iconBg: 'bg-[var(--warning-bg)]',
    variant: 'warning' as const,
    colSpan: 'col-span-1',
  },
];

export default function AdminKPIGrid() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BACKEND INTEGRATION: replace with GET /api/admin/dashboard/kpis
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricCardSkeleton key={`kpi-skel-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
      {metrics.map((m) => (
        <div key={m.id} className={m.colSpan}>
          <MetricCard
            title={m.title}
            value={m.value}
            subtitle={m.subtitle}
            trend={m.trend}
            icon={m.icon}
            iconBg={m.iconBg}
            variant={m.variant}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
}
