'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  FileText,
  Search,
  User,
  CalendarDays,
  Stethoscope,
} from 'lucide-react';
import { toast } from 'sonner';

import AppLayout from '@/components/AppLayout';
import prescriptionService from '@/services/prescriptionService';

import { Prescription } from '@/types/Prescription';
import { useAuth } from '@/context/AuthContext';

function formatDate(date: string | null | undefined) {
  if (!date) {
    return '-';
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPatientInitials(name: string) {
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

export default function DoctorPrescriptionsPage() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [prescriptions, setPrescriptions] = useState<
    Prescription[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  async function loadPrescriptions() {
    try {
      setLoading(true);

      const data =
        await prescriptionService.getPrescriptions();

      setPrescriptions(data);
    } catch (error) {
      console.error(
        'Failed to load prescriptions:',
        error
      );

      setPrescriptions([]);

      toast.error(
        'Failed to load prescriptions.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setPrescriptions([]);
      setLoading(false);
      return;
    }

    loadPrescriptions();
  }, [authLoading, user]);

  /*
   * Filter prescriptions using the
   * search box.
   */
  const filteredPrescriptions = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return prescriptions;
    }

    return prescriptions.filter(
      (prescription) => {
        return (
          prescription.patientName
            ?.toLowerCase()
            .includes(search) ||
          prescription.doctorName
            ?.toLowerCase()
            .includes(search) ||
          prescription.diagnosis
            ?.toLowerCase()
            .includes(search) ||
          prescription.medicines
            ?.toLowerCase()
            .includes(search) ||
          prescription.appointmentId
            ?.toLowerCase()
            .includes(search)
        );
      }
    );
  }, [prescriptions, searchTerm]);

  /*
   * Since this is the doctor prescription page,
   * show prescriptions belonging to the logged-in
   * doctor when doctorName is available.
   *
   * If doctorName is missing from the backend response,
   * we keep the prescription rather than hiding valid data.
   */
  const doctorPrescriptions = useMemo(() => {
    if (!user) {
      return [];
    }

    const loggedInDoctorName =
      `${user.firstName ?? ''} ${
        user.lastName ?? ''
      }`
        .trim()
        .toLowerCase();

    if (!loggedInDoctorName) {
      return filteredPrescriptions;
    }

    return filteredPrescriptions.filter(
      (prescription) => {
        const prescriptionDoctorName =
          prescription.doctorName
            ?.trim()
            .toLowerCase() ?? '';

        /*
         * If backend does not provide doctorName,
         * don't accidentally hide the prescription.
         */
        if (!prescriptionDoctorName) {
          return true;
        }

        return (
          prescriptionDoctorName ===
            loggedInDoctorName ||
          prescriptionDoctorName.includes(
            loggedInDoctorName
          ) ||
          loggedInDoctorName.includes(
            prescriptionDoctorName
          )
        );
      }
    );
  }, [filteredPrescriptions, user]);

  /*
   * Loading state
   */
  if (authLoading || loading) {
    return (
      <AppLayout
        role="doctor"
        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/doctor-dashboard',
          },
          {
            label: 'Prescriptions',
          },
        ]}
      >
        <div className="space-y-6">
          <div>
            <div className="h-8 w-52 rounded bg-muted animate-pulse" />

            <div className="h-4 w-80 rounded bg-muted animate-pulse mt-2" />
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card">
            <div className="p-5 border-b border-border">
              <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
            </div>

            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={`prescription-loading-${index}`}
                    className="px-5 py-4 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted" />

                      <div className="flex-1">
                        <div className="h-4 w-40 rounded bg-muted" />

                        <div className="h-3 w-56 rounded bg-muted mt-2" />
                      </div>

                      <div className="h-8 w-20 rounded bg-muted" />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      role="doctor"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/doctor-dashboard',
        },
        {
          label: 'Prescriptions',
        },
      ]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    '/doctor-dashboard'
                  )
                }
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={16} />
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Prescriptions
                </h1>

                <p className="text-sm text-muted-foreground mt-1">
                  View prescriptions issued by you.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary">
            <FileText
              size={16}
              className="text-primary"
            />

            <span className="text-sm font-600 text-primary">
              {doctorPrescriptions.length}{' '}
              {doctorPrescriptions.length === 1
                ? 'Prescription'
                : 'Prescriptions'}
            </span>
          </div>
        </div>

        {/* Search + Summary */}
        <div className="bg-card rounded-xl border border-border shadow-card">
          <div className="p-4 sm:p-5 border-b border-border">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-xl">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search patient, diagnosis, medicine..."
                  className="w-full h-10 rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Showing{' '}
                <span className="font-600 text-foreground">
                  {doctorPrescriptions.length}
                </span>{' '}
                of{' '}
                <span className="font-600 text-foreground">
                  {prescriptions.length}
                </span>
              </p>
            </div>
          </div>

          {/* Empty State */}
          {doctorPrescriptions.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <FileText
                  size={24}
                  className="text-primary"
                />
              </div>

              <h3 className="mt-4 text-base font-600 text-foreground">
                {searchTerm
                  ? 'No prescriptions found'
                  : 'No prescriptions yet'}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                {searchTerm
                  ? 'Try changing your search criteria.'
                  : 'Prescriptions created for your patients will appear here.'}
              </p>

              {searchTerm && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm('')
                  }
                  className="mt-4 px-4 py-2 rounded-lg bg-secondary text-primary text-sm font-600 hover:bg-primary/10 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider font-600 text-muted-foreground">
                        Patient
                      </th>

                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider font-600 text-muted-foreground">
                        Diagnosis
                      </th>

                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider font-600 text-muted-foreground">
                        Medicines
                      </th>

                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider font-600 text-muted-foreground">
                        Follow-up
                      </th>

                      <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider font-600 text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {doctorPrescriptions.map(
                      (prescription) => (
                        <tr
                          key={prescription.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          {/* Patient */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary text-xs font-700 flex-shrink-0">
                                {getPatientInitials(
                                  prescription.patientName
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-600 text-foreground truncate max-w-[180px]">
                                  {prescription.patientName ||
                                    'Unknown Patient'}
                                </p>

                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  Appointment:{' '}
                                  {prescription.appointmentId ||
                                    '-'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Diagnosis */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Stethoscope
                                size={14}
                                className="text-primary flex-shrink-0"
                              />

                              <p className="text-sm text-foreground max-w-[180px] truncate">
                                {prescription.diagnosis ||
                                  'Not specified'}
                              </p>
                            </div>
                          </td>

                          {/* Medicines */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-foreground max-w-[220px] truncate">
                              {prescription.medicines ||
                                'No medicines specified'}
                            </p>
                          </td>

                          {/* Follow-up */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <CalendarDays
                                size={14}
                                className="text-muted-foreground"
                              />

                              <span className="text-sm text-foreground">
                                {formatDate(
                                  prescription.followUpDate
                                )}
                              </span>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/doctor-dashboard/prescriptions/${prescription.id}`
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-600 text-primary hover:bg-secondary transition-colors"
                            >
                              <Eye size={13} />

                              View
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-border">
                {doctorPrescriptions.map(
                  (prescription) => (
                    <div
                      key={prescription.id}
                      className="p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary text-xs font-700 flex-shrink-0">
                          {getPatientInitials(
                            prescription.patientName
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-600 text-foreground">
                                {prescription.patientName ||
                                  'Unknown Patient'}
                              </p>

                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                Appointment:{' '}
                                {prescription.appointmentId ||
                                  '-'}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/doctor-dashboard/prescriptions/${prescription.id}`
                                )
                              }
                              className="flex-shrink-0 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-primary hover:bg-secondary transition-colors"
                              aria-label="View prescription"
                            >
                              <Eye size={14} />
                            </button>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider font-600 text-muted-foreground">
                                Diagnosis
                              </p>

                              <p className="text-xs text-foreground mt-0.5">
                                {prescription.diagnosis ||
                                  'Not specified'}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] uppercase tracking-wider font-600 text-muted-foreground">
                                Medicines
                              </p>

                              <p className="text-xs text-foreground mt-0.5 line-clamp-2">
                                {prescription.medicines ||
                                  'No medicines specified'}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <CalendarDays
                                size={13}
                                className="text-muted-foreground"
                              />

                              <p className="text-xs text-muted-foreground">
                                Follow-up:{' '}
                                <span className="text-foreground font-500">
                                  {formatDate(
                                    prescription.followUpDate
                                  )}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}