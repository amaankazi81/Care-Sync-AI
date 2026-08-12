'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  CalendarPlus,
  XCircle,
  CheckCircle2,
  Clock3,
  RefreshCw,
} from 'lucide-react';

import dotnetApi from '@/lib/dotnetApi';

interface BackendAppointment {
  appointmentId: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Activity {
  id: string;
  title: string;
  detail: string;
  time: string;
  type:
    | 'booked'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'pending';
}

function formatDate(
  value: string
) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );
}

function getActivityType(
  status: string
): Activity['type'] {
  switch (
    status?.toUpperCase()
  ) {
    case 'COMPLETED':
      return 'completed';

    case 'CANCELLED':
      return 'cancelled';

    case 'CONFIRMED':
      return 'confirmed';

    case 'BOOKED':
      return 'booked';

    default:
      return 'pending';
  }
}

function getActivityTitle(
  status: string
) {
  switch (
    status?.toUpperCase()
  ) {
    case 'COMPLETED':
      return 'Appointment Completed';

    case 'CANCELLED':
      return 'Appointment Cancelled';

    case 'CONFIRMED':
      return 'Appointment Confirmed';

    case 'BOOKED':
      return 'Appointment Booked';

    default:
      return 'Appointment Updated';
  }
}

export default function AdminActivityFeed() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const fetchActivities =
    async () => {
      try {
        setLoading(true);
        setError(false);

        const response =
          await dotnetApi.get<
            ApiResponse<
              BackendAppointment[]
            >
          >(
            '/dashboard/recent-appointments'
          );

        const appointments =
          response.data?.data ?? [];

        const derived =
          appointments.map(
            (appointment) => {
              const type =
                getActivityType(
                  appointment.status
                );

              return {
                id:
                  appointment.appointmentId,

                title:
                  getActivityTitle(
                    appointment.status
                  ),

                detail: `${appointment.patientName} with ${appointment.doctorName}`,

                time: `Appointment date: ${formatDate(
                  appointment.appointmentDate
                )}`,

                type,
              };
            }
          );

        setActivities(derived);
      } catch (err) {
        console.error(
          'Activity feed error:',
          err
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getConfig = (
    type: Activity['type']
  ) => {
    switch (type) {
      case 'completed':
        return {
          icon: CheckCircle2,
          bg: 'bg-[var(--positive-bg)]',
          color: 'text-positive',
        };

      case 'cancelled':
        return {
          icon: XCircle,
          bg: 'bg-[var(--negative-bg)]',
          color: 'text-negative',
        };

      case 'confirmed':
        return {
          icon: CheckCircle2,
          bg: 'bg-primary/10',
          color: 'text-primary',
        };

      case 'booked':
        return {
          icon: CalendarPlus,
          bg: 'bg-accent/10',
          color: 'text-accent',
        };

      default:
        return {
          icon: Clock3,
          bg: 'bg-[var(--warning-bg)]',
          color: 'text-warning',
        };
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-sm font-600 text-foreground">
            Recent Activity
          </h3>

          <p className="text-xs text-muted-foreground">
            Derived from latest hospital appointments
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-xs text-positive">
          <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
          Live
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center min-h-[250px]">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw
              size={15}
              className="animate-spin"
            />

            Loading activity...
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] px-5 text-center">
          <p className="text-sm font-500 text-negative">
            Unable to load recent activity.
          </p>

          <button
            type="button"
            onClick={
              fetchActivities
            }
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Activities */}
      {!loading &&
        !error && (
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {activities.length ===
            0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No recent activity
                  available.
                </p>
              </div>
            ) : (
              activities.map(
                (
                  activity,
                  index
                ) => {
                  const config =
                    getConfig(
                      activity.type
                    );

                  const Icon =
                    config.icon;

                  return (
                    <div
                      key={
                        activity.id
                      }
                      className="flex gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon
                            size={15}
                            className={
                              config.color
                            }
                          />
                        </div>

                        {index <
                          activities.length -
                            1 && (
                          <div className="w-px flex-1 bg-border mt-1 min-h-[12px]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pb-1">
                        <p className="text-xs font-600 text-foreground">
                          {
                            activity.title
                          }
                        </p>

                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {
                            activity.detail
                          }
                        </p>

                        <p className="text-[10px] text-muted-foreground mt-1">
                          {
                            activity.time
                          }
                        </p>
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        )}
    </div>
  );
}