'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { CalendarDays, Building2 } from 'lucide-react';

const AppointmentTrendChart = dynamic(() => import('./charts/AppointmentTrendChart'), {
  ssr: false,
  loading: () => <ChartSkeleton height={220} />,
});

const DepartmentPieChart = dynamic(() => import('./charts/DepartmentPieChart'), {
  ssr: false,
  loading: () => <ChartSkeleton height={220} />,
});

export default function AdminChartsRow() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // BACKEND INTEGRATION: replace with GET /api/admin/dashboard/charts
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Appointment trend — wider */}
      <div className="xl:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarDays size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-600 text-foreground">Appointment Volume</h3>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
              Total
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-positive inline-block" />
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-negative inline-block" />
              Cancelled
            </span>
          </div>
        </div>
        {loaded ? <AppointmentTrendChart /> : <ChartSkeleton height={220} />}
      </div>

      {/* Department distribution */}
      <div className="xl:col-span-1 bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Building2 size={16} className="text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-600 text-foreground">By Department</h3>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
        </div>
        {loaded ? <DepartmentPieChart /> : <ChartSkeleton height={220} />}
      </div>
    </div>
  );
}
