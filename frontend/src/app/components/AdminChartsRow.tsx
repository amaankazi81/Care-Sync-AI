'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

import {
  CalendarDays,
  Building2,
} from 'lucide-react';

import dotnetApi from '@/lib/dotnetApi';

/* =========================================================
   Dynamic chart imports
   ========================================================= */

const MonthlyRevenueChart = dynamic(
  () => import('@/app/components/charts/MonthlyRevenueChart'),
  {
    ssr: false,
    loading: () => (
      <ChartSkeleton height={220} />
    ),
  }
);

const DepartmentPieChart = dynamic(
  () => import('@/app/components/charts/DepartmentPieChart'),
  {
    ssr: false,
    loading: () => (
      <ChartSkeleton height={220} />
    ),
  }
);

/* =========================================================
   API Types
   ========================================================= */

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface DepartmentStatistic {
  departmentName: string;
  doctorCount: number;
  appointmentCount: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* =========================================================
   Component
   ========================================================= */

export default function AdminChartsRow() {
  const [monthlyRevenue, setMonthlyRevenue] =
    useState<MonthlyRevenue[]>([]);

  const [departments, setDepartments] =
    useState<DepartmentStatistic[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  /* =======================================================
     Fetch dashboard chart data
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchCharts = async () => {
      try {
        setLoading(true);
        setError(false);

        const [
          revenueResponse,
          departmentResponse,
        ] = await Promise.all([
          dotnetApi.get<
            ApiResponse<MonthlyRevenue[]>
          >(
            '/dashboard/monthly-revenue'
          ),

          dotnetApi.get<
            ApiResponse<DepartmentStatistic[]>
          >(
            '/dashboard/department-statistics'
          ),
        ]);

        if (!mounted) {
          return;
        }

        /* -------------------------------------------------
           Monthly Revenue
           ------------------------------------------------- */

        if (
          revenueResponse.data?.success
        ) {
          setMonthlyRevenue(
            revenueResponse.data.data ?? []
          );
        } else {
          setMonthlyRevenue([]);
        }

        /* -------------------------------------------------
           Department Statistics
           ------------------------------------------------- */

        if (
          departmentResponse.data?.success
        ) {
          setDepartments(
            departmentResponse.data.data ?? []
          );
        } else {
          setDepartments([]);
        }
      } catch (err) {
        console.error(
          'Dashboard charts error:',
          err
        );

        if (mounted) {
          setError(true);
          setMonthlyRevenue([]);
          setDepartments([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCharts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     Render
     ======================================================= */

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* ===================================================
          MONTHLY REVENUE
          =================================================== */}

      <div className="xl:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarDays
                size={16}
                className="text-primary"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Monthly Revenue
              </h3>

              <p className="text-xs text-muted-foreground">
                Revenue recorded by the hospital
              </p>
            </div>

          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            Revenue
          </div>

        </div>

        {/* Chart */}
        {loading ? (
          <ChartSkeleton height={220} />
        ) : error ? (
          <div className="h-[220px] flex items-center justify-center">
            <p className="text-xs text-negative">
              Unable to load dashboard charts.
            </p>
          </div>
        ) : (
          <MonthlyRevenueChart
            data={monthlyRevenue}
          />
        )}

      </div>

      {/* ===================================================
          DEPARTMENT STATISTICS
          =================================================== */}

      <div className="xl:col-span-1 bg-card rounded-xl border border-border shadow-card p-5">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">

          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Building2
              size={16}
              className="text-accent"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              By Department
            </h3>

            <p className="text-xs text-muted-foreground">
              Current appointment distribution
            </p>
          </div>

        </div>

        {/* Chart */}
        {loading ? (
          <ChartSkeleton height={220} />
        ) : error ? (
          <div className="h-[220px] flex items-center justify-center">
            <p className="text-xs text-negative">
              Unable to load dashboard charts.
            </p>
          </div>
        ) : (
          <DepartmentPieChart
            data={departments}
          />
        )}

      </div>

    </div>
  );
}