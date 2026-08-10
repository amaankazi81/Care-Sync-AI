'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  FileText,
  ExternalLink,
  CalendarDays,
  Pill,
  User,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import prescriptionService from '@/services/prescriptionService';
import { Prescription } from '@/types/Prescription';
import { useAuth } from '@/context/AuthContext';

function formatDate(date: string | null) {
  if (!date) {
    return '-';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getLoggedInDoctorName(user: any) {
  if (!user) {
    return '';
  }

  return `${user.firstName ?? ''} ${user.lastName ?? ''}`
    .trim()
    .toLowerCase();
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

export default function DoctorRecentPrescriptions() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    prescriptions,
    setPrescriptions,
  ] = useState<Prescription[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedPrescriptionId,
    setSelectedPrescriptionId,
  ] = useState<string | null>(null);

  /*
   * Load prescriptions from the existing backend API.
   */
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
  }, [user, authLoading]);

  async function loadPrescriptions() {
    try {
      setLoading(true);

      const data =
        await prescriptionService.getPrescriptions();

      setPrescriptions(data);
    } catch (error) {
      console.error(
        'Failed to load doctor prescriptions:',
        error
      );

      toast.error(
        'Failed to load recent prescriptions.'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Get prescriptions belonging to the
   * currently logged-in doctor.
   *
   * Backend currently exposes DoctorName
   * instead of DoctorId.
   */
  const doctorPrescriptions = useMemo(() => {
    if (!user) {
      return [];
    }

    const loggedInDoctorName =
      getLoggedInDoctorName(user);

    if (!loggedInDoctorName) {
      return [];
    }

    return prescriptions
      .filter((prescription) => {
        const prescriptionDoctorName =
          prescription.doctorName
            ?.trim()
            .toLowerCase() ?? '';

        if (!prescriptionDoctorName) {
          return false;
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
      })
      .sort((a, b) => {
        const dateA = a.followUpDate
          ? new Date(
              a.followUpDate
            ).getTime()
          : 0;

        const dateB = b.followUpDate
          ? new Date(
              b.followUpDate
            ).getTime()
          : 0;

        return dateB - dateA;
      });
  }, [prescriptions, user]);

  /*
   * Dashboard displays only the latest
   * 5 prescriptions.
   */
  const recentPrescriptions = useMemo(() => {
    return doctorPrescriptions.slice(0, 5);
  }, [doctorPrescriptions]);

  /*
   * Find currently expanded prescription.
   */
  const selectedPrescription = useMemo(() => {
    if (!selectedPrescriptionId) {
      return null;
    }

    return (
      doctorPrescriptions.find(
        (prescription) =>
          prescription.id ===
          selectedPrescriptionId
      ) ?? null
    );
  }, [
    doctorPrescriptions,
    selectedPrescriptionId,
  ]);

  /*
   * Open complete prescriptions page.
   *
   * Change this path only if your actual
   * prescription page uses another route.
   */
  function handleViewAll() {
    router.push(
      '/doctor-dashboard/prescriptions'
    );
  }

  /*
   * Open prescription management page.
   */
  function handleWritePrescription() {
    router.push(
      '/doctor-dashboard/prescriptions'
    );
  }

  /*
   * Loading state
   */
  if (authLoading || loading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText
                size={16}
                className="text-primary"
              />
            </div>

            <div>
              <h3 className="text-sm font-600 text-foreground">
                Recent Prescriptions
              </h3>

              <p className="text-xs text-muted-foreground">
                Latest prescriptions
              </p>
            </div>
          </div>

          {/* View all skeleton */}
          <div className="w-12 h-3 rounded bg-muted animate-pulse" />
        </div>

        {/* Loading rows */}
        <div className="divide-y divide-border">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={`prescription-loading-${index}`}
              className="px-5 py-3.5 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-muted flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="h-3 w-28 rounded bg-muted mb-2" />

                  <div className="h-3 w-40 rounded bg-muted mb-2" />

                  <div className="h-3 w-56 rounded bg-muted" />
                </div>

                <div className="w-4 h-4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer skeleton */}
        <div className="px-5 py-3 border-t border-border">
          <div className="h-8 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-xl border border-border shadow-card">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText
                size={16}
                className="text-primary"
              />
            </div>

            <div>
              <h3 className="text-sm font-600 text-foreground">
                Recent Prescriptions
              </h3>

              <p className="text-xs text-muted-foreground">
                Latest prescriptions
              </p>
            </div>
          </div>

          {/* =================================================
              VIEW ALL
          ================================================== */}
          <button
            type="button"
            onClick={handleViewAll}
            className="text-xs font-500 text-primary hover:text-accent transition-colors"
          >
            View all
          </button>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {recentPrescriptions.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <FileText
                size={22}
                className="text-primary"
              />
            </div>

            <h4 className="mt-4 text-sm font-600 text-foreground">
              No prescriptions found
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              No recent prescriptions are available
              for this doctor.
            </p>
          </div>
        ) : (
          /* =================================================
             PRESCRIPTION LIST
          ================================================== */
          <div className="divide-y divide-border">
            {recentPrescriptions.map(
              (prescription) => {
                const isSelected =
                  selectedPrescriptionId ===
                  prescription.id;

                return (
                  <div
                    key={prescription.id}
                    className={`px-5 py-3.5 transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-primary/5'
                        : 'hover:bg-muted/30'
                    }`}
                    onClick={() => {
                      setSelectedPrescriptionId(
                        isSelected
                          ? null
                          : prescription.id
                      );
                    }}
                  >
                    {/* =================================================
                        MAIN PRESCRIPTION ROW
                    ================================================== */}
                    <div className="flex items-start justify-between gap-3">
                      {/* Patient information */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Patient avatar */}
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary text-[10px] font-700 flex-shrink-0">
                          {getPatientInitials(
                            prescription.patientName
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Prescription + date */}
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-[10px] font-700 text-primary">
                              Prescription
                            </span>

                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(
                                prescription.followUpDate
                              )}
                            </span>
                          </div>

                          {/* Patient */}
                          <p className="text-xs font-600 text-foreground truncate">
                            {prescription.patientName ||
                              'Unknown Patient'}
                          </p>

                          {/* Diagnosis */}
                          <p className="text-xs text-muted-foreground truncate">
                            {prescription.diagnosis ||
                              'No diagnosis provided'}
                          </p>

                          {/* Medicines */}
                          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                            {prescription.medicines ||
                              'No medicines listed'}
                          </p>
                        </div>
                      </div>

                      {/* Expand icon */}
                      <ExternalLink
                        size={13}
                        className={`flex-shrink-0 mt-1 transition-colors ${
                          isSelected
                            ? 'text-primary'
                            : 'text-border group-hover:text-primary'
                        }`}
                      />
                    </div>

                    {/* =================================================
                        EXPANDED DETAILS
                    ================================================== */}
                    {isSelected && (
                      <div className="mt-3 ml-12 fade-in">
                        {/* Appointment + Doctor */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          {/* Appointment ID */}
                          <div className="bg-background rounded-lg px-3 py-2">
                            <p className="text-[9px] uppercase tracking-wider font-600 text-muted-foreground mb-1">
                              Appointment ID
                            </p>

                            <p className="text-[10px] font-600 text-primary break-all">
                              {prescription.appointmentId ||
                                '-'}
                            </p>
                          </div>

                          {/* Doctor */}
                          <div className="bg-background rounded-lg px-3 py-2">
                            <p className="text-[9px] uppercase tracking-wider font-600 text-muted-foreground mb-1">
                              Doctor
                            </p>

                            <p className="text-[10px] font-600 text-foreground truncate">
                              {prescription.doctorName ||
                                'Unknown Doctor'}
                            </p>
                          </div>
                        </div>

                        {/* Diagnosis */}
                        <div className="bg-background rounded-lg px-3 py-2 mb-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <FileText
                              size={11}
                              className="text-primary"
                            />

                            <p className="text-[9px] uppercase tracking-wider font-600 text-muted-foreground">
                              Diagnosis
                            </p>
                          </div>

                          <p className="text-[11px] text-foreground leading-relaxed">
                            {prescription.diagnosis ||
                              'No diagnosis provided.'}
                          </p>
                        </div>

                        {/* Medicines */}
                        <div className="bg-background rounded-lg px-3 py-2 mb-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Pill
                              size={11}
                              className="text-primary"
                            />

                            <p className="text-[9px] uppercase tracking-wider font-600 text-muted-foreground">
                              Medicines
                            </p>
                          </div>

                          <p className="text-[11px] text-foreground leading-relaxed whitespace-pre-line">
                            {prescription.medicines ||
                              'No medicines prescribed.'}
                          </p>
                        </div>

                        {/* Instructions */}
                        <div className="bg-background rounded-lg px-3 py-2 mb-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <User
                              size={11}
                              className="text-primary"
                            />

                            <p className="text-[9px] uppercase tracking-wider font-600 text-muted-foreground">
                              Instructions
                            </p>
                          </div>

                          <p className="text-[11px] text-foreground leading-relaxed whitespace-pre-line">
                            {prescription.instructions ||
                              'No instructions provided.'}
                          </p>
                        </div>

                        {/* Follow-up */}
                        <div className="bg-background rounded-lg px-3 py-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <CalendarDays
                              size={11}
                              className="text-primary"
                            />

                            <p className="text-[9px] uppercase tracking-wider font-600 text-muted-foreground">
                              Follow-up Date
                            </p>
                          </div>

                          <p className="text-[11px] font-600 text-foreground">
                            {formatDate(
                              prescription.followUpDate
                            )}
                          </p>
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
        ====================================================== */}
        <div className="px-5 py-3 border-t border-border">
          <button
            type="button"
            onClick={handleWritePrescription}
            className="w-full py-2 rounded-lg border border-primary/30 text-xs font-600 text-primary hover:bg-primary/5 transition-colors"
          >
            + Write Prescription
          </button>
        </div>
      </div>

      {/* Keep selected prescription state available */}
      {selectedPrescription && (
        <div className="hidden">
          {selectedPrescription.id}
        </div>
      )}
    </>
  );
}