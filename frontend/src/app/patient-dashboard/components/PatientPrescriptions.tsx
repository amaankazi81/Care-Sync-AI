'use client';

import React, { useEffect, useState } from 'react';

import {
  FileText,
  Loader2,
  CalendarDays,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

import prescriptionService from '@/services/prescriptionService';

import type { Prescription } from '@/types/Prescription';

export default function PatientPrescriptions() {
  const { user } = useAuth();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPrescriptions() {
      try {
        setLoading(true);
        setError(null);

        /*
         * ------------------------------------------------------
         * Get prescriptions from the existing backend service
         * ------------------------------------------------------
         */

        const allPrescriptions =
          await prescriptionService.getPrescriptions();

        if (!mounted) {
          return;
        }

        /*
         * ------------------------------------------------------
         * Patient filtering
         * ------------------------------------------------------
         *
         * The current Prescription DTO contains patientName
         * rather than patientId.
         *
         * Therefore we match the logged-in patient's full name.
         */

        const currentPatientName =
          user
            ? `${user.firstName} ${user.lastName}`.trim()
            : '';

        let patientPrescriptions =
          allPrescriptions;

        if (currentPatientName) {
          patientPrescriptions =
            allPrescriptions.filter(
              (item) =>
                item.patientName
                  ?.trim()
                  .toLowerCase() ===
                currentPatientName
                  .trim()
                  .toLowerCase()
            );
        }

        /*
         * ------------------------------------------------------
         * Sort newest first
         * ------------------------------------------------------
         *
         * The backend does not currently expose an issueDate
         * field in the Prescription type.
         *
         * Therefore we do not create fake dates.
         */

        patientPrescriptions =
          [...patientPrescriptions].slice(0, 3);

        if (mounted) {
          setPrescriptions(
            patientPrescriptions
          );
        }
      } catch (err) {
        console.error(
          'Failed to load prescriptions:',
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load prescriptions.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPrescriptions();

    return () => {
      mounted = false;
    };
  }, [user]);

  /*
   * ==========================================================
   * HEADER
   * ==========================================================
   */

  return (
    <div className="bg-card rounded-xl border border-border shadow-card">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="px-5 py-4 border-b border-border flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText
            size={18}
            className="text-primary"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Recent Prescriptions
          </h3>

          <p className="text-xs text-muted-foreground">
            Your latest prescriptions
          </p>
        </div>

      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading prescriptions...

        </div>
      )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {!loading && error && (
        <div className="p-5">

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-semibold text-red-700">
              Unable to load prescriptions
            </p>

            <p className="text-xs text-red-600 mt-1">
              {error}
            </p>

          </div>

        </div>
      )}

      {/* ======================================================
          NO PRESCRIPTIONS
      ====================================================== */}

      {!loading &&
        !error &&
        prescriptions.length === 0 && (
          <div className="p-8 text-center">

            <FileText
              size={32}
              className="mx-auto text-muted-foreground"
            />

            <p className="mt-3 text-sm font-semibold text-foreground">
              No prescriptions found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Your prescriptions will appear here after your doctor
              issues them.
            </p>

          </div>
        )}

      {/* ======================================================
          PRESCRIPTION LIST
      ====================================================== */}

      {!loading &&
        !error &&
        prescriptions.length > 0 && (
          <div className="divide-y divide-border">

            {prescriptions.map(
              (item) => (
                <div
                  key={item.id}
                  className="px-5 py-4 hover:bg-muted/30 transition"
                >

                  <div className="flex items-start gap-3">

                    {/* Icon */}

                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">

                      <FileText
                        size={17}
                        className="text-primary"
                      />

                    </div>

                    {/* Content */}

                    <div className="flex-1 min-w-0">

                      <div className="flex items-center justify-between gap-3">

                        <h4 className="text-sm font-semibold text-foreground truncate">
                          {item.doctorName ||
                            'Doctor'}
                        </h4>

                        <span className="text-[10px] font-semibold text-primary whitespace-nowrap">
                          Prescription
                        </span>

                      </div>

                      {/* Diagnosis */}

                      {item.diagnosis && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Diagnosis:{' '}
                          <span className="text-foreground">
                            {item.diagnosis}
                          </span>
                        </p>
                      )}

                      {/* Medicines */}

                      {item.medicines && (
                        <p className="text-xs mt-2 text-foreground leading-5">
                          <span className="font-medium">
                            Medicines:
                          </span>{' '}
                          {item.medicines}
                        </p>
                      )}

                      {/* Instructions */}

                      {item.instructions && (
                        <p className="text-[11px] text-muted-foreground mt-2 leading-5">
                          <span className="font-medium">
                            Instructions:
                          </span>{' '}
                          {item.instructions}
                        </p>
                      )}

                      {/* Follow-up */}

                      {item.followUpDate && (
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">

                          <CalendarDays
                            size={13}
                          />

                          Follow-up:{' '}
                          {new Date(
                            item.followUpDate
                          ).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}

                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

    </div>
  );
}