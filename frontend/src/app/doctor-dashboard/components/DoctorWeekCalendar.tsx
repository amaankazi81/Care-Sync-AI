'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

import appointmentService from '@/services/appointmentService';
import { Appointment } from '@/types/Appointment';
import { useAuth } from '@/context/AuthContext';

const days = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

/*
 * Convert a Date object into YYYY-MM-DD.
 */
function formatDate(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/*
 * Format a date for toast messages.
 */
function formatDisplayDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/*
 * Get the Monday of the week containing
 * the supplied date.
 */
function getMonday(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  const day = result.getDay();

  /*
   * JavaScript:
   *
   * Sunday    = 0
   * Monday    = 1
   * Tuesday   = 2
   * Wednesday = 3
   * Thursday  = 4
   * Friday    = 5
   * Saturday  = 6
   */
  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() + difference
  );

  return result;
}

/*
 * Generate the seven dates for the
 * selected week.
 *
 * weekOffset:
 *
 *  0  = current week
 * -1  = previous week
 * +1  = next week
 */
function getWeekDates(
  weekOffset: number
) {
  const today = new Date();

  const monday = getMonday(today);

  monday.setDate(
    monday.getDate() +
      weekOffset * 7
  );

  return Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(monday);

      date.setDate(
        monday.getDate() + index
      );

      return date;
    }
  );
}

/*
 * Get today's date in YYYY-MM-DD format.
 */
function getTodayDate() {
  return formatDate(new Date());
}

/*
 * Format the currently displayed week.
 *
 * Examples:
 *
 * Aug 3 – 9, 2026
 * Aug 31 – Sep 6, 2026
 */
function formatWeekRange(
  dates: Date[]
) {
  if (dates.length === 0) {
    return '';
  }

  const first = dates[0];
  const last = dates[dates.length - 1];

  /*
   * Same year
   */
  if (
    first.getFullYear() ===
    last.getFullYear()
  ) {
    /*
     * Same month
     */
    if (
      first.getMonth() ===
      last.getMonth()
    ) {
      return `${first.toLocaleDateString(
        'en-US',
        {
          month: 'short',
        }
      )} ${first.getDate()} – ${
        last.getDate()
      }, ${last.getFullYear()}`;
    }

    /*
     * Different months but same year
     */
    return `${first.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
      }
    )} – ${last.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
      }
    )}, ${last.getFullYear()}`;
  }

  /*
   * Different years
   */
  return `${first.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  )} – ${last.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  )}`;
}

export default function DoctorWeekCalendar() {
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

  const [
    weekOffset,
    setWeekOffset,
  ] = useState(0);

  /*
   * Load appointments from the existing
   * appointment API.
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

  /*
   * Fetch all appointments.
   *
   * We are intentionally using the existing
   * appointment API.
   *
   * No backend modification is required.
   */
  async function loadAppointments() {
    try {
      setLoading(true);

      const data =
        await appointmentService.getAppointments();

      setAppointments(data);
    } catch (error) {
      console.error(
        'Failed to load appointments for weekly summary:',
        error
      );

      toast.error(
        'Failed to load weekly appointments.'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Generate the seven dates for the
   * currently selected week.
   */
  const weekDates = useMemo(() => {
    return getWeekDates(
      weekOffset
    );
  }, [weekOffset]);

  /*
   * Get the currently logged-in doctor's name.
   *
   * The current authentication profile does not
   * expose the doctor's database ID, therefore
   * we use doctorName from AppointmentDto.
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
   * Filter appointments belonging to the
   * currently logged-in doctor.
   *
   * We currently compare doctor names because
   * the frontend authentication user does not
   * provide the doctor's database ID.
   */
  const doctorAppointments =
    useMemo(() => {
      if (!user) {
        return [];
      }

      /*
       * If the user does not have a name,
       * don't attempt name-based matching.
       */
      if (!loggedInDoctorName) {
        return [];
      }

      return appointments.filter(
        (appointment) => {
          const appointmentDoctorName =
            appointment.doctorName
              ?.trim()
              .toLowerCase() ?? '';

          /*
           * If the appointment does not contain
           * a doctor name, it cannot safely be
           * associated with this doctor.
           */
          if (!appointmentDoctorName) {
            return false;
          }

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
   * Create the actual weekly appointment
   * summary.
   *
   * Example:
   *
   * Monday    -> 2
   * Tuesday   -> 0
   * Wednesday -> 1
   * Thursday  -> 0
   * Friday    -> 3
   * Saturday  -> 0
   * Sunday    -> 0
   */
  const weeklySummary =
    useMemo(() => {
      return weekDates.map(
        (date, index) => {
          const dateString =
            formatDate(date);

          /*
           * Get appointments for this
           * exact calendar date.
           */
          const dayAppointments =
            doctorAppointments.filter(
              (appointment) =>
                appointment.appointmentDate ===
                dateString
            );

          const total =
            dayAppointments.length;

          /*
           * Completed appointments.
           */
          const completed =
            dayAppointments.filter(
              (appointment) =>
                appointment.status ===
                'COMPLETED'
            ).length;

          /*
           * Cancelled appointments.
           */
          const cancelled =
            dayAppointments.filter(
              (appointment) =>
                appointment.status ===
                'CANCELLED'
            ).length;

          /*
           * Upcoming appointments.
           *
           * CHECKED_IN is also considered active/upcoming
           * for the dashboard summary.
           */
          const upcoming =
            dayAppointments.filter(
              (appointment) =>
                appointment.status ===
                  'BOOKED' ||
                appointment.status ===
                  'CONFIRMED' ||
                appointment.status ===
                  'CHECKED_IN'
            ).length;

          return {
            dayIndex: index,
            date,
            dateString,
            dayName: days[index],
            total,
            completed,
            cancelled,
            upcoming,
            appointments:
              dayAppointments,
          };
        }
      );
    }, [
      weekDates,
      doctorAppointments,
    ]);

  /*
   * Total appointments for the selected week.
   */
  const totalAppointments =
    useMemo(() => {
      return weeklySummary.reduce(
        (total, day) =>
          total + day.total,
        0
      );
    }, [weeklySummary]);

  /*
   * Completed appointments for the selected week.
   */
  const completedAppointments =
    useMemo(() => {
      return weeklySummary.reduce(
        (total, day) =>
          total + day.completed,
        0
      );
    }, [weeklySummary]);

  /*
   * Upcoming appointments for the selected week.
   */
  const upcomingAppointments =
    useMemo(() => {
      return weeklySummary.reduce(
        (total, day) =>
          total + day.upcoming,
        0
      );
    }, [weeklySummary]);

  /*
   * Cancelled appointments for the selected week.
   */
  const cancelledAppointments =
    useMemo(() => {
      return weeklySummary.reduce(
        (total, day) =>
          total + day.cancelled,
        0
      );
    }, [weeklySummary]);

  /*
   * Today's date.
   */
  const today = getTodayDate();

  /*
   * Loading state.
   */
  if (
    authLoading ||
    loading
  ) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border">
          <div className="animate-pulse">
            <div className="h-4 w-40 rounded bg-muted" />

            <div className="h-3 w-32 rounded bg-muted mt-2" />
          </div>
        </div>

        {/* Calendar skeleton */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({
              length: 7,
            }).map((_, index) => (
              <div
                key={`calendar-loading-${index}`}
                className="h-24 rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>

          {/* Statistics skeleton */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={`stats-loading-${index}`}
                className="h-16 rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      {/* ========================================================= */}
      {/* HEADER                                                    */}
      {/* ========================================================= */}

      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        {/* Title */}
        <div>
          <h3 className="text-sm font-600 text-foreground">
            Weekly Appointments
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            {formatWeekRange(
              weekDates
            )}
          </p>
        </div>

        {/* Week navigation */}
        <div className="flex items-center gap-1">
          {/* Previous week */}
          <button
            type="button"
            onClick={() =>
              setWeekOffset(
                (current) =>
                  current - 1
              )
            }
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft
              size={14}
            />
          </button>

          {/* Today */}
          <button
            type="button"
            onClick={() =>
              setWeekOffset(0)
            }
            className={`px-2 py-1 text-[10px] font-600 rounded transition-colors ${
              weekOffset === 0
                ? 'bg-secondary text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-primary'
            }`}
          >
            Today
          </button>

          {/* Next week */}
          <button
            type="button"
            onClick={() =>
              setWeekOffset(
                (current) =>
                  current + 1
              )
            }
            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Next week"
          >
            <ChevronRight
              size={14}
            />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* WEEKLY SUMMARY                                            */}
      {/* ========================================================= */}

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1.5">
          {weeklySummary.map(
            (day) => {
              /*
               * Highlight today's date only
               * when viewing the current week.
               */
              const isToday =
                day.dateString ===
                  today &&
                weekOffset === 0;

              return (
                <button
                  type="button"
                  key={day.dateString}
                  onClick={() => {
                    if (
                      day.total === 0
                    ) {
                      toast.info(
                        `No appointments scheduled for ${day.dayName}.`
                      );

                      return;
                    }

                    toast.info(
                      `${day.dayName}, ${formatDisplayDate(
                        day.date
                      )}: ${
                        day.total
                      } appointment${
                        day.total === 1
                          ? ''
                          : 's'
                      }`
                    );
                  }}
                  className={`
                    flex flex-col
                    items-center
                    justify-center
                    gap-1
                    min-w-0
                    p-2
                    rounded-xl
                    transition-all
                    text-center
                    ${
                      isToday
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }
                  `}
                >
                  {/* Day name */}
                  <span
                    className={`text-[10px] font-600 uppercase ${
                      isToday
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {day.dayName}
                  </span>

                  {/* Date number */}
                  <span
                    className={`text-sm font-700 leading-tight ${
                      isToday
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {day.date.getDate()}
                  </span>

                  {/* Appointment count */}
                  <span
                    className={`text-lg font-700 leading-none ${
                      isToday
                        ? 'text-primary-foreground'
                        : 'text-primary'
                    }`}
                  >
                    {day.total}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* ======================================================= */}
        {/* WEEKLY STATISTICS                                       */}
        {/* ======================================================= */}

        <div className="grid grid-cols-2 gap-2 mt-4">
          {/* Total */}
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalendarDays
                  size={14}
                  className="text-primary"
                />
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground">
                  Total
                </p>

                <p className="text-sm font-700 text-foreground">
                  {totalAppointments}
                </p>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-positive/5 rounded-xl p-3 border border-positive/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-positive/10 flex items-center justify-center">
                <CheckCircle2
                  size={14}
                  className="text-positive"
                />
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground">
                  Completed
                </p>

                <p className="text-sm font-700 text-foreground">
                  {
                    completedAppointments
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-warning/5 rounded-xl p-3 border border-warning/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock
                  size={14}
                  className="text-warning"
                />
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground">
                  Upcoming
                </p>

                <p className="text-sm font-700 text-foreground">
                  {
                    upcomingAppointments
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-negative/5 rounded-xl p-3 border border-negative/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-negative/10 flex items-center justify-center">
                <span className="text-xs font-700 text-negative">
                  ×
                </span>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground">
                  Cancelled
                </p>

                <p className="text-sm font-700 text-foreground">
                  {
                    cancelledAppointments
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* EMPTY WEEK MESSAGE                                      */}
        {/* ======================================================= */}

        {totalAppointments ===
          0 && (
          <div className="mt-4 bg-muted/30 rounded-xl p-4 text-center">
            <CalendarDays
              size={20}
              className="mx-auto text-muted-foreground"
            />

            <p className="text-xs font-600 text-foreground mt-2">
              No appointments this
              week
            </p>

            <p className="text-[10px] text-muted-foreground mt-1">
              There are no appointments
              scheduled for this week.
            </p>
          </div>
        )}

        {/* ======================================================= */}
        {/* FOOTER                                                   */}
        {/* ======================================================= */}

        {totalAppointments >
          0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center">
              Showing appointments from
              your existing appointment
              schedule
            </p>
          </div>
        )}
      </div>
    </div>
  );
}