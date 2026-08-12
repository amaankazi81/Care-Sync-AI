'use client';

import { useEffect, useMemo, useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { MetricCardSkeleton } from '@/components/ui/LoadingSkeleton';

import {
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react';

import appointmentService from '@/services/appointmentService';
import { Appointment } from '@/types/Appointment';
import { useAuth } from '@/context/AuthContext';

export default function DoctorKPIGrid() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    appointments,
    setAppointments,
  ] = useState<Appointment[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
   * =========================================================
   * LOAD APPOINTMENTS
   * =========================================================
   *
   * We use the existing appointment API.
   *
   * No new backend endpoint is required.
   */
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    loadAppointments();
  }, [user, authLoading]);

  async function loadAppointments() {
    try {
      setLoading(true);

      const data =
        await appointmentService.getAppointments();

      setAppointments(data);
    } catch (error) {
      console.error(
        'Failed to load doctor dashboard appointments:',
        error
      );

      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * TODAY'S DATE
   * =========================================================
   *
   * Keep the date in the same YYYY-MM-DD format used by
   * AppointmentDto.
   */
  const today = useMemo(() => {
    const date = new Date();

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }, []);

  /*
   * =========================================================
   * LOGGED-IN DOCTOR NAME
   * =========================================================
   *
   * At the moment AuthContext does not expose the doctor's
   * database ID.
   *
   * Therefore we compare DoctorName from AppointmentDto
   * with the logged-in user's firstName + lastName.
   *
   * Once doctorId is available in AuthContext, this can
   * later be changed to ID-based filtering.
   */
  const loggedInDoctorName =
    useMemo(() => {
      if (!user) {
        return '';
      }

      return `${user.firstName ?? ''} ${
        user.lastName ?? ''
      }`
        .trim()
        .toLowerCase();
    }, [user]);

  /*
   * =========================================================
   * FILTER APPOINTMENTS FOR LOGGED-IN DOCTOR
   * =========================================================
   */
  const doctorAppointments =
    useMemo(() => {
      if (
        !user ||
        !loggedInDoctorName
      ) {
        return [];
      }

      return appointments.filter(
        (appointment) => {
          const appointmentDoctorName =
            appointment.doctorName
              ?.trim()
              .toLowerCase() ?? '';

          /*
           * We cannot safely associate an appointment
           * with the current doctor if DoctorName is missing.
           */
          if (
            !appointmentDoctorName
          ) {
            return false;
          }

          /*
           * Compare normalized names.
           *
           * Exact match is preferred, while the contains
           * checks provide some tolerance for differences
           * in how the name is returned by the backend.
           */
          return (
            appointmentDoctorName ===
              loggedInDoctorName ||
            appointmentDoctorName.includes(
              loggedInDoctorName
            ) ||
            loggedInDoctorName.includes(
              appointmentDoctorName
            )
          );
        }
      );
    }, [
      appointments,
      user,
      loggedInDoctorName,
    ]);

  /*
   * =========================================================
   * TODAY'S APPOINTMENTS
   * =========================================================
   *
   * Only appointments belonging to the logged-in doctor
   * and scheduled for today's date are included.
   */
  const todayAppointments =
    useMemo(() => {
      return doctorAppointments.filter(
        (appointment) =>
          appointment.appointmentDate ===
          today
      );
    }, [
      doctorAppointments,
      today,
    ]);

  /*
   * =========================================================
   * COMPLETED APPOINTMENTS
   * =========================================================
   */
  const completedAppointments =
    useMemo(() => {
      return todayAppointments.filter(
        (appointment) =>
          appointment.status ===
          'COMPLETED'
      );
    }, [todayAppointments]);

  /*
   * =========================================================
   * REMAINING APPOINTMENTS
   * =========================================================
   *
   * Remaining means appointments that are still active
   * and have not been completed or cancelled.
   *
   * Active statuses:
   *
   * BOOKED
   * CONFIRMED
   * CHECKED_IN
   *
   * We explicitly check these statuses instead of using
   * "anything that isn't completed/cancelled", so an unknown
   * future status cannot accidentally appear as remaining.
   */
  const remainingAppointments =
    useMemo(() => {
      return todayAppointments.filter(
        (appointment) =>
          appointment.status ===
            'BOOKED' ||
          appointment.status ===
            'CONFIRMED' ||
          appointment.status ===
            'CHECKED_IN'
      );
    }, [todayAppointments]);

  /*
   * =========================================================
   * KPI DATA
   * =========================================================
   *
   * We now have only 3 cards.
   *
   * Avg Duration has intentionally been removed because
   * AppointmentDto does not currently contain a duration
   * field.
   */
  const metrics = [
    {
      id: 'doctor-kpi-today',

      title: "Today's Patients",

      value:
        todayAppointments.length,

      subtitle:
        remainingAppointments.length ===
        1
          ? '1 remaining'
          : `${remainingAppointments.length} remaining`,

      trend: undefined,

      icon: (
        <Users
          size={20}
          className="text-primary"
        />
      ),

      iconBg:
        'bg-primary/10',

      variant:
        'primary' as const,
    },

    {
      id: 'doctor-kpi-completed',

      title: 'Completed',

      value:
        completedAppointments.length,

      subtitle:
        'Consultations done',

      trend: undefined,

      icon: (
        <CheckCircle2
          size={20}
          className="text-positive"
        />
      ),

      iconBg:
        'bg-[var(--positive-bg)]',

      variant:
        'positive' as const,
    },

    {
      id: 'doctor-kpi-remaining',

      title: 'Remaining',

      value:
        remainingAppointments.length,

      subtitle:
        'In queue today',

      trend: undefined,

      icon: (
        <Clock
          size={20}
          className="text-warning"
        />
      ),

      iconBg:
        'bg-[var(--warning-bg)]',

      variant:
        'warning' as const,
    },
  ];

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */
  if (
    authLoading ||
    loading
  ) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <MetricCardSkeleton
            key={`doctor-kpi-skeleton-${index}`}
          />
        ))}
      </div>
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {metrics.map(
        (metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            subtitle={
              metric.subtitle
            }
            trend={metric.trend}
            icon={metric.icon}
            iconBg={metric.iconBg}
            variant={
              metric.variant
            }
          />
        )
      )}
    </div>
  );
}