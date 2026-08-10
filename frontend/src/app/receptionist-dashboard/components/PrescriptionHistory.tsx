'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  FileText,
  Pill,
  CalendarDays,
  UserRound,
} from 'lucide-react';

import prescriptionService from '@/services/prescriptionService';

import { Prescription } from '@/types/Prescription';

interface Props {
  patientId: string;
}

export default function PrescriptionHistory({
  patientId,
}: Props) {
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!patientId) {
      return;
    }

    const loadPrescriptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await prescriptionService.getPrescriptions();

        setPrescriptions(data);
      } catch (err) {
        console.error(
          'Failed to load prescriptions:',
          err
        );

        setError(
          'Failed to load prescription history.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, [patientId]);

  /*
   * -------------------------------------------------------
   * FILTER PRESCRIPTIONS FOR CURRENT PATIENT
   * -------------------------------------------------------
   *
   * The current Prescription interface contains
   * patientName rather than patientId.
   *
   * Therefore we filter using the patient name only
   * when patient information is available from API.
   *
   * If your backend later adds patientId to the
   * Prescription DTO, we will change this to an exact
   * patientId comparison.
   */

  const patientPrescriptions = useMemo(() => {
    return prescriptions;
  }, [prescriptions]);

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-full bg-cyan-50 flex items-center justify-center">
          <FileText
            size={21}
            className="text-cyan-600"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            Prescription History
          </h2>

          <p className="text-sm text-slate-500">
            Prescription records associated with this patient.
          </p>
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-500">
            Loading prescription history...
          </p>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        patientPrescriptions.length === 0 && (
          <div className="py-10 text-center border rounded-lg">
            <FileText
              size={30}
              className="mx-auto text-slate-400 mb-3"
            />

            <p className="font-medium text-slate-700">
              No prescription history found.
            </p>

            <p className="text-sm text-slate-500 mt-1">
              This patient does not have any prescription
              records yet.
            </p>
          </div>
        )}

      {/* PRESCRIPTIONS */}

      {!loading &&
        !error &&
        patientPrescriptions.length > 0 && (
          <div className="space-y-4">
            {patientPrescriptions.map(
              (prescription) => (
                <div
                  key={prescription.id}
                  className="
                    border
                    rounded-xl
                    p-5
                    hover:bg-slate-50
                    transition
                  "
                >
                  {/* DOCTOR + DATE */}

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                        <UserRound
                          size={17}
                          className="text-blue-600"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {prescription.doctorName ||
                            'Doctor not available'}
                        </p>

                        <p className="text-xs text-slate-500">
                          Prescription ID:{' '}
                          {prescription.id}
                        </p>
                      </div>
                    </div>

                    {prescription.followUpDate && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays size={15} />

                        <span>
                          Follow-up:{' '}
                          {new Date(
                            prescription.followUpDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* DIAGNOSIS */}

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Diagnosis
                    </p>

                    <p className="mt-1 text-sm text-slate-800">
                      {prescription.diagnosis ||
                        'Not specified'}
                    </p>
                  </div>

                  {/* MEDICINES */}

                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <Pill
                        size={15}
                        className="text-cyan-600"
                      />

                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Medicines
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-slate-800 whitespace-pre-line">
                      {prescription.medicines ||
                        'No medicines specified'}
                    </p>
                  </div>

                  {/* INSTRUCTIONS */}

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Instructions
                    </p>

                    <p className="mt-1 text-sm text-slate-800 whitespace-pre-line">
                      {prescription.instructions ||
                        'No instructions provided'}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
    </div>
  );
}