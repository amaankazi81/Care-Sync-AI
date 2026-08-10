'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import StatusBadge from '@/components/ui/StatusBadge';

import {
  Clock,
  ChevronRight,
  User,
  Stethoscope,
  CalendarDays,
  ExternalLink,
} from 'lucide-react';

import { toast } from 'sonner';

import appointmentService from '@/services/appointmentService';
import doctorService from '@/services/doctorService';

import { useAuth } from '@/context/AuthContext';

import { Appointment } from '@/types/Appointment';
import { Doctor } from '@/types/Doctor';

/*
 * ---------------------------------------------------------
 * STATUS ORDER
 * ---------------------------------------------------------
 *
 * The doctor's active appointments should appear first.
 *
 * CHECKED_IN
 * CONFIRMED
 * BOOKED
 * COMPLETED
 * CANCELLED
 *
 * Lower number = higher priority.
 * ---------------------------------------------------------
 */

const statusOrder: Record<string, number> = {
  CHECKED_IN: 0,
  CONFIRMED: 1,
  BOOKED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
};

/*
 * ---------------------------------------------------------
 * FORMAT TIME
 * ---------------------------------------------------------
 */

function formatTime(time?: string | null) {
  if (!time) {
    return '-';
  }

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

/*
 * ---------------------------------------------------------
 * FORMAT DATE
 * ---------------------------------------------------------
 */

function formatDate(date?: string | null) {
  if (!date) {
    return '-';
  }

  const [year, month, day] = date
    .split('-')
    .map(Number);

  if (!year || !month || !day) {
    return date;
  }

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  return parsedDate.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );
}

/*
 * ---------------------------------------------------------
 * TODAY'S DATE
 * ---------------------------------------------------------
 */

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    today.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/*
 * ---------------------------------------------------------
 * PATIENT INITIALS
 * ---------------------------------------------------------
 */

function getPatientInitials(
  name?: string | null
) {
  if (!name) {
    return 'PT';
  }

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/*
 * ---------------------------------------------------------
 * SAFE TIME SORT VALUE
 * ---------------------------------------------------------
 */

function getTimeSortValue(
  time?: string | null
) {
  return time || '99:99:99';
}

/*
 * ---------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------
 */

export default function DoctorTodaySchedule() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    appointments,
    setAppointments,
  ] = useState<Appointment[]>([]);

  const [
    doctor,
    setDoctor,
  ] = useState<Doctor | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    expandedId,
    setExpandedId,
  ] = useState<string | null>(null);

  /*
   * ---------------------------------------------------------
   * TODAY
   * ---------------------------------------------------------
   */

  const today = useMemo(
    () => getTodayDate(),
    []
  );

  /*
   * ---------------------------------------------------------
   * LOAD DOCTOR + APPOINTMENTS
   * ---------------------------------------------------------
   *
   * We identify the logged-in doctor using email.
   *
   * AuthContext
   *     ↓
   * user.email
   *     ↓
   * Doctor.email
   *     ↓
   * Doctor.id
   *     ↓
   * Appointment.doctorId
   *
   * This is safer than filtering only by doctor name.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setDoctor(null);
      setAppointments([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadDoctorSchedule() {
      try {
        setLoading(true);

        /*
         * Load both resources in parallel.
         */
        const [
          doctors,
          allAppointments,
        ] = await Promise.all([
          doctorService.getDoctors(),
          appointmentService.getAppointments(),
        ]);

        /*
         * Logged-in user's email.
         */
        const loggedInEmail =
          user?.email
            ?.trim()
            .toLowerCase();

        if (!loggedInEmail) {
          toast.error(
            'Unable to identify the logged-in doctor.'
          );

          if (!cancelled) {
            setDoctor(null);
            setAppointments([]);
          }

          return;
        }

        /*
         * Find matching doctor.
         */
        const currentDoctor =
          doctors.find(
            (item) =>
              item.email
                ?.trim()
                .toLowerCase() ===
              loggedInEmail
          ) ?? null;

        /*
         * Doctor not found.
         */
        if (!currentDoctor) {
          console.error(
            'No doctor record found for logged-in email:',
            loggedInEmail
          );

          toast.error(
            'Doctor profile could not be found.'
          );

          if (!cancelled) {
            setDoctor(null);
            setAppointments([]);
          }

          return;
        }

        /*
         * Filter appointments using doctor ID.
         */
        const doctorAppointments =
          allAppointments.filter(
            (appointment) =>
              appointment.doctorId ===
              currentDoctor.id
          );

        if (!cancelled) {
          setDoctor(currentDoctor);
          setAppointments(
            doctorAppointments
          );
        }
      } catch (error) {
        console.error(
          'Failed to load doctor schedule:',
          error
        );

        if (!cancelled) {
          setDoctor(null);
          setAppointments([]);

          toast.error(
            'Failed to load today\'s appointments.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDoctorSchedule();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    user,
  ]);

  /*
   * ---------------------------------------------------------
   * TODAY'S APPOINTMENTS
   * ---------------------------------------------------------
   */

  const todayAppointments = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          appointment.appointmentDate ===
          today
      )
      .sort((a, b) => {
        /*
         * First sort by status.
         */
        const statusDifference =
          (statusOrder[a.status] ?? 99) -
          (statusOrder[b.status] ?? 99);

        if (statusDifference !== 0) {
          return statusDifference;
        }

        /*
         * Then sort by appointment time.
         */
        return getTimeSortValue(
          a.appointmentTime
        ).localeCompare(
          getTimeSortValue(
            b.appointmentTime
          )
        );
      });
  }, [
    appointments,
    today,
  ]);

  /*
   * ---------------------------------------------------------
   * COUNTERS
   * ---------------------------------------------------------
   */

  const completedCount = useMemo(
    () =>
      todayAppointments.filter(
        (appointment) =>
          appointment.status ===
          'COMPLETED'
      ).length,
    [todayAppointments]
  );

  const activeCount = useMemo(
    () =>
      todayAppointments.filter(
        (appointment) =>
          appointment.status ===
          'CHECKED_IN'
      ).length,
    [todayAppointments]
  );

  const upcomingCount = useMemo(
    () =>
      todayAppointments.filter(
        (appointment) =>
          appointment.status ===
          'BOOKED' ||
          appointment.status ===
          'CONFIRMED'
      ).length,
    [todayAppointments]
  );

  /*
   * ---------------------------------------------------------
   * START CONSULTATION
   * ---------------------------------------------------------
   *
   * We don't invent a new consultation API.
   *
   * Instead, we take the doctor to the existing
   * appointment schedule and provide the appointment ID.
   *
   * The appointment page can use this query parameter later
   * to open the selected appointment automatically.
   * ---------------------------------------------------------
   */

  function handleStartConsultation(
    appointment: Appointment
  ) {
    if (
      appointment.status ===
      'COMPLETED' ||
      appointment.status ===
      'CANCELLED'
    ) {
      toast.info(
        'This appointment is no longer available for consultation.'
      );

      return;
    }

    if (!appointment.id) {
      toast.error(
        'Unable to open this appointment.'
      );

      return;
    }

    router.push(
      `/doctor-dashboard/appointments?appointmentId=${encodeURIComponent(
        appointment.id
      )}`
    );
  }

  /*
   * ---------------------------------------------------------
   * PATIENT RECORD
   * ---------------------------------------------------------
   */

  function handlePatientRecord(
    appointment: Appointment
  ) {
    if (!appointment.patientId) {
      toast.error(
        'Patient record ID is not available.'
      );

      return;
    }

    router.push(
      `/doctor-dashboard/patients?patientId=${encodeURIComponent(
        appointment.patientId
      )}`
    );
  }

  /*
   * ---------------------------------------------------------
   * TOGGLE APPOINTMENT
   * ---------------------------------------------------------
   */

  function toggleAppointment(
    appointmentId: string
  ) {
    setExpandedId(
      (current) =>
        current === appointmentId
          ? null
          : appointmentId
    );
  }

  /*
   * ---------------------------------------------------------
   * LOADING STATE
   * ---------------------------------------------------------
   */

  if (
    loading ||
    authLoading
  ) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-600 text-foreground">
            Today&apos;s Schedule
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            Loading appointments...
          </p>
        </div>

        {/* Skeleton */}
        <div className="divide-y divide-border">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={`schedule-loading-${index}`}
                className="px-5 py-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-8 rounded bg-muted" />

                  <div className="flex-1">
                    <div className="h-4 w-40 rounded bg-muted" />

                    <div className="h-3 w-28 rounded bg-muted mt-2" />
                  </div>

                  <div className="w-20 h-6 rounded bg-muted" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * DOCTOR PROFILE NOT FOUND
   * ---------------------------------------------------------
   */

  if (!doctor) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">
        <div className="px-5 py-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <User
              size={22}
              className="text-primary"
            />
          </div>

          <h4 className="mt-4 text-sm font-600 text-foreground">
            Doctor profile not found
          </h4>

          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            We could not match your logged-in
            account with a doctor profile.
            Please contact the administrator
            if this continues.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="px-5 py-4 border-b border-border flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-600 text-foreground">
            Today&apos;s Schedule
          </h3>

          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <CalendarDays size={12} />

            {formatDate(today)} ·{' '}
            {todayAppointments.length}{' '}
            {todayAppointments.length ===
              1
              ? 'appointment'
              : 'appointments'}
          </p>
        </div>

        {/* Status summary */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {/* Completed */}
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-positive" />

            {completedCount} done
          </span>

          {/* Checked In */}
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning" />

            {activeCount} checked in
          </span>

          {/* Upcoming */}
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />

            {upcomingCount} upcoming
          </span>
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
          ===================================================== */}

      {todayAppointments.length ===
        0 ? (
        <div className="px-5 py-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <CalendarDays
              size={22}
              className="text-primary"
            />
          </div>

          <h4 className="mt-4 text-sm font-600 text-foreground">
            No appointments today
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            You don&apos;t have any
            appointments scheduled for
            today.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/doctor-dashboard/appointments'
              )
            }
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-600 text-primary hover:bg-secondary transition-colors"
          >
            View Appointment Schedule
            <ExternalLink size={12} />
          </button>
        </div>
      ) : (
        /* ===================================================
           APPOINTMENT LIST
           =================================================== */

        <div className="divide-y divide-border">
          {todayAppointments.map(
            (item) => {
              const isExpanded =
                expandedId === item.id;

              const isActive =
                item.status ===
                'CHECKED_IN';

              const isCompleted =
                item.status ===
                'COMPLETED';

              const isCancelled =
                item.status ===
                'CANCELLED';

              const patientName =
                item.patientName ||
                'Unknown Patient';

              return (
                <div
                  key={item.id}
                  className={`transition-colors ${isActive
                      ? 'bg-primary/3'
                      : 'hover:bg-muted/30'
                    }`}
                >
                  {/* =========================================
                      APPOINTMENT ROW
                      ========================================= */}

                  <button
                    type="button"
                    className="w-full px-5 py-3.5 flex items-center gap-4 text-left"
                    onClick={() =>
                      toggleAppointment(
                        item.id
                      )
                    }
                    aria-expanded={
                      isExpanded
                    }
                  >
                    {/* Time */}
                    <div className="w-20 flex-shrink-0">
                      <p
                        className={`text-xs font-700 tabular-nums ${isActive
                            ? 'text-primary'
                            : 'text-foreground'
                          }`}
                      >
                        {formatTime(
                          item.appointmentTime
                        )}
                      </p>

                      <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                        <Clock size={9} />

                        Appointment
                      </p>
                    </div>

                    {/* Patient */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary text-xs font-700 flex-shrink-0">
                        {getPatientInitials(
                          patientName
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-600 text-foreground truncate">
                          {patientName}
                        </p>

                        <p className="text-xs text-muted-foreground truncate">
                          {item.department ||
                            'General'}{' '}
                          ·{' '}
                          {item.reason ||
                            'Consultation'}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusBadge
                        status={
                          item.status
                        }
                        size="sm"
                      />

                      <ChevronRight
                        size={15}
                        className={`text-muted-foreground transition-transform duration-200 ${isExpanded
                            ? 'rotate-90'
                            : ''
                          }`}
                      />
                    </div>
                  </button>

                  {/* =========================================
                      EXPANDED DETAILS
                      ========================================= */}

                  {isExpanded && (
                    <div className="px-5 pb-4 fade-in">
                      <div className="ml-24 pl-2.5 border-l-2 border-primary/20">
                        {/* ---------------------------------
                            Appointment + Patient ID
                            --------------------------------- */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div className="bg-background rounded-lg px-3 py-2.5">
                            <p className="text-[10px] uppercase tracking-wider font-600 text-muted-foreground mb-1">
                              Appointment
                            </p>

                            <p className="text-sm font-600 text-foreground">
                              {item.appointmentNumber ||
                                '-'}
                            </p>
                          </div>

                          <div className="bg-background rounded-lg px-3 py-2.5">
                            <p className="text-[10px] uppercase tracking-wider font-600 text-muted-foreground mb-1">
                              Patient ID
                            </p>

                            <p className="text-sm font-600 text-primary break-all">
                              {item.patientId ||
                                '-'}
                            </p>
                          </div>
                        </div>

                        {/* ---------------------------------
                            Date + Time
                            --------------------------------- */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div className="bg-background rounded-lg px-3 py-2.5">
                            <p className="text-[10px] uppercase tracking-wider font-600 text-muted-foreground mb-1">
                              Date
                            </p>

                            <p className="text-sm font-600 text-foreground">
                              {formatDate(
                                item.appointmentDate
                              )}
                            </p>
                          </div>

                          <div className="bg-background rounded-lg px-3 py-2.5">
                            <p className="text-[10px] uppercase tracking-wider font-600 text-muted-foreground mb-1">
                              Time
                            </p>

                            <p className="text-sm font-600 text-foreground">
                              {formatTime(
                                item.appointmentTime
                              )}
                            </p>
                          </div>
                        </div>

                        {/* ---------------------------------
                            Department
                            --------------------------------- */}

                        <div className="bg-background rounded-lg px-3 py-2.5 mb-3">
                          <p className="text-[10px] uppercase tracking-wider font-600 text-muted-foreground mb-1">
                            Department
                          </p>

                          <p className="text-xs text-foreground leading-relaxed">
                            {item.department ||
                              'Not specified'}
                          </p>
                        </div>

                        {/* ---------------------------------
                            Reason
                            --------------------------------- */}

                        <div className="bg-background rounded-lg px-3 py-2.5 mb-3">
                          <p className="text-[10px] uppercase tracking-wider font-600 text-muted-foreground mb-1">
                            Reason
                          </p>

                          <p className="text-xs text-foreground leading-relaxed">
                            {item.reason ||
                              'No reason provided.'}
                          </p>
                        </div>

                        {/* ---------------------------------
                            Notes
                            --------------------------------- */}

                        {item.notes && (
                          <div className="bg-background rounded-lg px-3 py-2.5 mb-3">
                            <p className="text-[10px] uppercase tracking-wider font-600 text-muted-foreground mb-1">
                              Notes
                            </p>

                            <p className="text-xs text-foreground leading-relaxed">
                              {item.notes}
                            </p>
                          </div>
                        )}

                        {/* =================================
                            ACTIONS
                            ================================= */}

                        <div className="flex flex-wrap gap-2">
                          {/* ---------------------------------
                              Start Consultation
                              --------------------------------- */}

                          {!isCompleted &&
                            !isCancelled && (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  handleStartConsultation(
                                    item
                                  );
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-primary text-white text-xs font-600 hover:opacity-90 transition-all btn-press"
                              >
                                <Stethoscope
                                  size={13}
                                />

                                Start Consultation
                              </button>
                            )}

                          {/* ---------------------------------
                              Patient Record
                              --------------------------------- */}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              handlePatientRecord(
                                item
                              );
                            }}
                            disabled={
                              !item.patientId
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-500 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <User size={13} />

                            Patient Record
                          </button>

                          {/* ---------------------------------
                              View Appointment
                              --------------------------------- */}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              if (!item.id) {
                                toast.error(
                                  'Unable to open this appointment.'
                                );

                                return;
                              }

                              router.push(
                                `/doctor-dashboard/appointments?appointmentId=${encodeURIComponent(
                                  item.id
                                )}`
                              );
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-500 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <ExternalLink
                              size={13}
                            />

                            View Appointment
                          </button>
                        </div>

                        {/* ---------------------------------
                            Completed Information
                            --------------------------------- */}

                        {isCompleted && (
                          <div className="mt-3 rounded-lg bg-positive/5 border border-positive/10 px-3 py-2.5">
                            <p className="text-[11px] font-600 text-positive">
                              Consultation completed
                            </p>

                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              This appointment is
                              already marked as
                              completed.
                            </p>
                          </div>
                        )}

                        {/* ---------------------------------
                            Cancelled Information
                            --------------------------------- */}

                        {isCancelled && (
                          <div className="mt-3 rounded-lg bg-negative/5 border border-negative/10 px-3 py-2.5">
                            <p className="text-[11px] font-600 text-negative">
                              Appointment cancelled
                            </p>

                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              No consultation action
                              is available for this
                              appointment.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}

      {/* =====================================================
          FOOTER
          ===================================================== */}

      {todayAppointments.length >
        0 && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
            <p className="text-[10px] text-muted-foreground">
              Showing all appointments scheduled
              for today.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/doctor-dashboard/appointments'
                )
              }
              className="flex items-center gap-1 text-[10px] font-600 text-primary hover:text-accent transition-colors whitespace-nowrap"
            >
              View Complete Schedule
              <ChevronRight size={12} />
            </button>
          </div>
        )}
    </div>
  );
}