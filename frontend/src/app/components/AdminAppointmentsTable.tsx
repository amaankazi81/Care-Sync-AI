'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import StatusBadge from '@/components/ui/StatusBadge';

import {
  Search,
  ChevronUp,
  ChevronDown,
  Eye,
  RefreshCw,
} from 'lucide-react';

import { toast } from 'sonner';

import dotnetApi from '@/lib/dotnetApi';

type AppointmentStatus =
  | 'BOOKED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

interface BackendAppointment {
  appointmentId: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  status: AppointmentStatus | string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Appointment {
  id: string;
  aptNo: string;
  patient: string;
  doctor: string;
  date: string;
  status: AppointmentStatus;
}

type SortKey =
  | 'aptNo'
  | 'patient'
  | 'doctor'
  | 'date'
  | 'status';

function getStatus(
  status: string
): AppointmentStatus {
  const normalized =
    status?.toUpperCase();

  if (
    normalized === 'BOOKED' ||
    normalized === 'CONFIRMED' ||
    normalized === 'IN_PROGRESS' ||
    normalized === 'COMPLETED' ||
    normalized === 'CANCELLED'
  ) {
    return normalized;
  }

  return 'BOOKED';
}

function formatDate(
  dateString: string
) {
  if (!dateString) {
    return '-';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
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

export default function AdminAppointmentsTable() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('ALL');

  const [sortKey, setSortKey] =
    useState<SortKey>('date');

  const [sortDir, setSortDir] =
    useState<'asc' | 'desc'>('desc');

  const [page, setPage] =
    useState(1);

  const perPage = 5;

  const fetchAppointments =
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

        const backendData =
          response.data?.data ?? [];

        const mapped =
          backendData.map(
            (item, index) => ({
              id:
                item.appointmentId ??
                `appointment-${index}`,

              aptNo:
                `APT-${item.appointmentId
                  ?.replaceAll('-', '')
                  .slice(0, 12)
                  .toUpperCase() ??
                  String(index + 1)}`,

              patient:
                item.patientName ??
                'Unknown Patient',

              doctor:
                item.doctorName ??
                'Unknown Doctor',

              date:
                item.appointmentDate ??
                '',

              status:
                getStatus(
                  item.status
                ),
            })
          );

        setAppointments(mapped);
      } catch (err) {
        console.error(
          'Recent appointments error:',
          err
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filtered =
    useMemo(() => {
      let rows = [
        ...appointments,
      ];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        rows =
          rows.filter(
            (appointment) =>
              appointment.patient
                .toLowerCase()
                .includes(query) ||
              appointment.doctor
                .toLowerCase()
                .includes(query) ||
              appointment.aptNo
                .toLowerCase()
                .includes(query)
          );
      }

      if (
        statusFilter !== 'ALL'
      ) {
        rows =
          rows.filter(
            (appointment) =>
              appointment.status ===
              statusFilter
          );
      }

      rows.sort(
        (a, b) => {
          let av =
            a[sortKey];

          let bv =
            b[sortKey];

          if (
            sortKey === 'date'
          ) {
            av =
              new Date(
                av
              ).getTime() as any;

            bv =
              new Date(
                bv
              ).getTime() as any;
          }

          const comparison =
            String(av).localeCompare(
              String(bv)
            );

          return sortDir === 'asc'
            ? comparison
            : -comparison;
        }
      );

      return rows;
    }, [
      appointments,
      search,
      statusFilter,
      sortKey,
      sortDir,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filtered.length /
          perPage
      )
    );

  const paginated =
    filtered.slice(
      (page - 1) *
        perPage,
      page * perPage
    );

  const handleSort = (
    key: SortKey
  ) => {
    if (
      sortKey === key
    ) {
      setSortDir(
        (current) =>
          current === 'asc'
            ? 'desc'
            : 'asc'
      );
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleRefresh =
    async () => {
      await fetchAppointments();

      toast.success(
        'Appointments refreshed'
      );
    };

  const SortIcon = ({
    column,
  }: {
    column: SortKey;
  }) => (
    <span className="inline-flex flex-col ml-1 align-middle">
      <ChevronUp
        size={9}
        className={
          sortKey === column &&
          sortDir === 'asc'
            ? 'text-primary'
            : 'text-border'
        }
      />

      <ChevronDown
        size={9}
        className={
          sortKey === column &&
          sortDir === 'desc'
            ? 'text-primary'
            : 'text-border'
        }
      />
    </span>
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-600 text-foreground">
            Recent Appointments
          </h3>

          <p className="text-xs text-muted-foreground">
            {filtered.length} of{' '}
            {appointments.length}{' '}
            appointments
          </p>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );

                setPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-40"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(
                event.target.value
              );

              setPage(1);
            }}
            className="px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="BOOKED">
              Booked
            </option>

            <option value="CONFIRMED">
              Confirmed
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

          <button
            type="button"
            title="Refresh appointments"
            onClick={
              handleRefresh
            }
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <RefreshCw
              size={14}
            />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="px-5 py-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw
              size={16}
              className="animate-spin"
            />

            Loading appointments...
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-500 text-negative">
            Unable to load recent
            appointments.
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            Please make sure the
            backend is running on
            port 5036.
          </p>

          <button
            type="button"
            onClick={
              fetchAppointments
            }
            className="mt-4 px-4 py-2 text-xs rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Table */}
      {!loading &&
        !error && (
          <>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th
                      onClick={() =>
                        handleSort(
                          'aptNo'
                        )
                      }
                      className="px-4 py-3 text-left text-xs font-600 uppercase tracking-wider text-muted-foreground cursor-pointer whitespace-nowrap"
                    >
                      Appointment
                      <SortIcon column="aptNo" />
                    </th>

                    <th
                      onClick={() =>
                        handleSort(
                          'patient'
                        )
                      }
                      className="px-4 py-3 text-left text-xs font-600 uppercase tracking-wider text-muted-foreground cursor-pointer whitespace-nowrap"
                    >
                      Patient
                      <SortIcon column="patient" />
                    </th>

                    <th
                      onClick={() =>
                        handleSort(
                          'doctor'
                        )
                      }
                      className="px-4 py-3 text-left text-xs font-600 uppercase tracking-wider text-muted-foreground cursor-pointer whitespace-nowrap"
                    >
                      Doctor
                      <SortIcon column="doctor" />
                    </th>

                    <th
                      onClick={() =>
                        handleSort(
                          'date'
                        )
                      }
                      className="px-4 py-3 text-left text-xs font-600 uppercase tracking-wider text-muted-foreground cursor-pointer whitespace-nowrap"
                    >
                      Date
                      <SortIcon column="date" />
                    </th>

                    <th
                      onClick={() =>
                        handleSort(
                          'status'
                        )
                      }
                      className="px-4 py-3 text-left text-xs font-600 uppercase tracking-wider text-muted-foreground cursor-pointer whitespace-nowrap"
                    >
                      Status
                      <SortIcon column="status" />
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-600 uppercase tracking-wider text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center"
                      >
                        <p className="text-sm font-500 text-muted-foreground">
                          No appointments
                          found
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          Try changing
                          your search
                          or status
                          filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map(
                      (appointment) => (
                        <tr
                          key={
                            appointment.id
                          }
                          className="border-b border-border last:border-0 row-hover transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-xs font-600 text-primary tabular-nums">
                              {
                                appointment.aptNo
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <p className="text-sm font-500 text-foreground whitespace-nowrap">
                              {
                                appointment.patient
                              }
                            </p>
                          </td>

                          <td className="px-4 py-3">
                            <p className="text-sm text-foreground whitespace-nowrap">
                              {
                                appointment.doctor
                              }
                            </p>
                          </td>

                          <td className="px-4 py-3">
                            <span className="text-sm text-foreground whitespace-nowrap">
                              {formatDate(
                                appointment.date
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <StatusBadge
                              status={
                                appointment.status
                              }
                              size="sm"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <button
                              type="button"
                              title="View appointment"
                              onClick={() =>
                                toast.info(
                                  `Appointment ${appointment.aptNo}`,
                                  {
                                    description: `${appointment.patient} with ${appointment.doctor}`,
                                  }
                                )
                              }
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Eye
                                size={14}
                              />
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filtered.length >
              0 && (
              <div className="px-5 py-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Showing{' '}
                  {Math.min(
                    (page - 1) *
                      perPage +
                      1,
                    filtered.length
                  )}
                  –
                  {Math.min(
                    page * perPage,
                    filtered.length
                  )}{' '}
                  of{' '}
                  {
                    filtered.length
                  }
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      setPage(
                        (current) =>
                          current - 1
                      )
                    }
                    className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({
                    length: totalPages,
                  }).map(
                    (_, index) => (
                      <button
                        type="button"
                        key={`page-${index + 1}`}
                        onClick={() =>
                          setPage(
                            index + 1
                          )
                        }
                        className={`w-7 h-7 text-xs rounded-lg border transition-colors ${
                          page ===
                          index + 1
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    disabled={
                      page ===
                        totalPages ||
                      totalPages ===
                        0
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          current + 1
                      )
                    }
                    className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
    </div>
  );
}