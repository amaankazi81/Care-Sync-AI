'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  CalendarDays,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

import appointmentService from '@/services/appointmentService';
import { Appointment } from '@/types/Appointment';
import { useAuth } from '@/context/AuthContext';

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatTime(time: string) {
  if (!time) return '-';

  const parts = time.split(':');

  if (parts.length < 2) {
    return time;
  }

  const hours = Number(parts[0]);
  const minutes = parts[1];

  if (Number.isNaN(hours)) {
    return time;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
}

function getDayName(date: string) {
  if (!date) return '-';

  const [year, month, day] = date
    .split('-')
    .map(Number);

  if (!year || !month || !day) {
    return '-';
  }

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  return parsedDate.toLocaleDateString('en-US', {
    weekday: 'short',
  });
}

function getDateNumber(date: string) {
  if (!date) return '-';

  const [, , day] = date.split('-');

  return day ? String(Number(day)) : '-';
}

function getDateTimeValue(
  date: string,
  time: string
) {
  return `${date}T${time || '00:00:00'}`;
}

export default function DoctorUpcomingList() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

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
        'Failed to load upcoming doctor appointments:',
        error
      );

      toast.error(
        'Failed to load upcoming appointments.'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Get the logged-in doctor's full name.
   *
   * The authentication profile currently does not
   * expose the doctor's database ID, so we use
   * doctorName from AppointmentDto.
   */
  const loggedInDoctorName = useMemo(() => {
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
   * Get today's date.
   */
  const today = useMemo(() => {
    return getTodayDate();
  }, []);

  /*
   * Calculate the next 7-day date range.
   */
  const nextSevenDays = useMemo(() => {
    const startDate = new Date();

    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);

    endDate.setDate(
      endDate.getDate() + 7
    );

    return {
      start: startDate,
      end: endDate,
    };
  }, []);

  /*
   * Filter upcoming appointments for the
   * currently logged-in doctor.
   */
  const upcoming = useMemo(() => {
    if (!user || !loggedInDoctorName) {
      return [];
    }

    const now = new Date();

    return appointments
      .filter((appointment) => {
        /*
         * Doctor filtering
         */
        const appointmentDoctorName =
          appointment.doctorName
            ?.trim()
            .toLowerCase() ?? '';

        const doctorMatches =
          appointmentDoctorName ===
            loggedInDoctorName ||
          appointmentDoctorName.includes(
            loggedInDoctorName
          ) ||
          loggedInDoctorName.includes(
            appointmentDoctorName
          );

        if (!doctorMatches) {
          return false;
        }

        /*
         * Only BOOKED and CONFIRMED
         * appointments are upcoming.
         */
        if (
          appointment.status !== 'BOOKED' &&
          appointment.status !== 'CONFIRMED'
        ) {
          return false;
        }

        /*
         * Appointment must have a date.
         */
        if (!appointment.appointmentDate) {
          return false;
        }

        const [year, month, day] =
          appointment.appointmentDate
            .split('-')
            .map(Number);

        if (!year || !month || !day) {
          return false;
        }

        const appointmentDate = new Date(
          year,
          month - 1,
          day
        );

        appointmentDate.setHours(
          0,
          0,
          0,
          0
        );

        /*
         * Appointment must be within
         * the next 7 days.
         */
        if (
          appointmentDate <
            nextSevenDays.start ||
          appointmentDate >
            nextSevenDays.end
        ) {
          return false;
        }

        /*
         * If appointment is today,
         * don't display appointments
         * whose time has already passed.
         */
        if (
          appointment.appointmentDate === today
        ) {
          const appointmentDateTime =
            new Date(
              getDateTimeValue(
                appointment.appointmentDate,
                appointment.appointmentTime
              )
            );

          if (
            appointmentDateTime < now
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateTimeA =
          getDateTimeValue(
            a.appointmentDate,
            a.appointmentTime
          );

        const dateTimeB =
          getDateTimeValue(
            b.appointmentDate,
            b.appointmentTime
          );

        return dateTimeA.localeCompare(
          dateTimeB
        );
      })
      /*
       * Show only the first 6 appointments
       * on the dashboard.
       */
      .slice(0, 6);
  }, [
    appointments,
    user,
    loggedInDoctorName,
    today,
    nextSevenDays,
  ]);

  /*
   * Loading state
   */
  if (authLoading || loading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <CalendarDays
                size={16}
                className="text-accent"
              />
            </div>

            <div>
              <h3 className="text-sm font-600 text-foreground">
                Upcoming Appointments
              </h3>

              <p className="text-xs text-muted-foreground">
                Next 7 days
              </p>
            </div>
          </div>
        </div>

        {/* Skeleton */}
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={`upcoming-skeleton-${index}`}
                className="px-5 py-3.5 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted" />

                  <div className="flex-1">
                    <div className="h-3.5 w-36 rounded bg-muted" />

                    <div className="h-2.5 w-24 rounded bg-muted mt-2" />

                    <div className="h-2.5 w-40 rounded bg-muted mt-2" />
                  </div>

                  <div className="w-16 h-6 rounded-full bg-muted" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <CalendarDays
              size={16}
              className="text-accent"
            />
          </div>

          <div>
            <h3 className="text-sm font-600 text-foreground">
              Upcoming Appointments
            </h3>

            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </div>
        </div>

        <span className="text-xs font-600 text-primary">
          {upcoming.length} Scheduled
        </span>
      </div>

      {/* Empty State */}
      {upcoming.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <CalendarDays
              size={21}
              className="text-primary"
            />
          </div>

          <h4 className="mt-4 text-sm font-600 text-foreground">
            No upcoming appointments
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            You don&apos;t have any appointments
            scheduled for the next 7 days.
          </p>
        </div>
      ) : (
        /* Appointment List */
        <div className="divide-y divide-border">
          {upcoming.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group cursor-pointer"
              onClick={() =>
                toast.info(
                  `Opening ${apt.appointmentNumber}`
                )
              }
            >
              {/* Date */}
              <div className="w-12 flex-shrink-0 text-center bg-secondary rounded-xl py-2">
                <p className="text-[10px] font-600 uppercase text-primary">
                  {getDayName(
                    apt.appointmentDate
                  )}
                </p>

                <p className="text-base font-700 text-primary leading-tight">
                  {getDateNumber(
                    apt.appointmentDate
                  )}
                </p>
              </div>

              {/* Appointment Details */}
              <div className="flex-1 min-w-0">
                <div>
                  <p className="text-sm font-600 text-foreground truncate">
                    {apt.patientName ||
                      'Unknown Patient'}
                  </p>

                  <p className="text-[10px] text-muted-foreground truncate">
                    {apt.appointmentNumber ||
                      '-'}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {formatTime(
                    apt.appointmentTime
                  )}{' '}
                  •{' '}
                  {apt.reason ||
                    'Consultation'}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge
                  status={apt.status}
                  size="sm"
                />

                <ArrowRight
                  size={14}
                  className="text-border group-hover:text-primary transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border">
        <button
          type="button"
          className="w-full text-center text-xs font-600 text-primary hover:text-accent transition-colors"
          onClick={() =>
            router.push(
              '/doctor-dashboard/appointments'
            )
          }
        >
          View Complete Schedule →
        </button>
      </div>
    </div>
  );
}