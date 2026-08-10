'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Pill,
  Save,
  Stethoscope,
} from 'lucide-react';
import { toast } from 'sonner';

import AppLayout from '@/components/AppLayout';
import prescriptionService from '@/services/prescriptionService';
import { Prescription } from '@/types/Prescription';

export default function EditPrescriptionPage() {
  const params = useParams();
  const router = useRouter();

  const prescriptionId =
    params.id as string;

  const [prescription, setPrescription] =
    useState<Prescription | null>(null);

  const [diagnosis, setDiagnosis] =
    useState('');

  const [medicines, setMedicines] =
    useState('');

  const [instructions, setInstructions] =
    useState('');

  const [followUpDate, setFollowUpDate] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * LOAD PRESCRIPTION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    async function loadPrescription() {
      try {
        setLoading(true);

        const data =
          await prescriptionService.getPrescriptionById(
            prescriptionId
          );

        setPrescription(data);

        setDiagnosis(
          data.diagnosis ?? ''
        );

        setMedicines(
          data.medicines ?? ''
        );

        setInstructions(
          data.instructions ?? ''
        );

        /*
         * Backend returns followUpDate as a date/time.
         *
         * HTML date input requires:
         *
         * YYYY-MM-DD
         */

        if (data.followUpDate) {
          setFollowUpDate(
            data.followUpDate.substring(0, 10)
          );
        } else {
          setFollowUpDate('');
        }
      } catch (error) {
        console.error(
          'Failed to load prescription:',
          error
        );

        toast.error(
          'Failed to load prescription.'
        );

        setPrescription(null);
      } finally {
        setLoading(false);
      }
    }

    if (prescriptionId) {
      loadPrescription();
    }
  }, [prescriptionId]);

  /*
   * ---------------------------------------------------------
   * SAVE CHANGES
   * ---------------------------------------------------------
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!prescriptionId) {
      toast.error(
        'Prescription ID is missing.'
      );

      return;
    }

    if (!diagnosis.trim()) {
      toast.error(
        'Diagnosis is required.'
      );

      return;
    }

    if (!medicines.trim()) {
      toast.error(
        'Medicines are required.'
      );

      return;
    }

    if (!instructions.trim()) {
      toast.error(
        'Instructions are required.'
      );

      return;
    }

    try {
      setSaving(true);

      /*
       * Backend expects:
       *
       * {
       *   diagnosis,
       *   medicines,
       *   instructions,
       *   followUpDate
       * }
       */

      await prescriptionService.updatePrescription(
        prescriptionId,
        {
          diagnosis: diagnosis.trim(),
          medicines: medicines.trim(),
          instructions: instructions.trim(),
          followUpDate: followUpDate
            ? `${followUpDate}T00:00:00.000Z`
            : null,
        }
      );

      toast.success(
        'Prescription updated successfully.'
      );

      /*
       * Return to prescription details.
       */

      router.push(
        `/doctor-dashboard/prescriptions/${prescriptionId}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        'Failed to update prescription:',
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update prescription.'
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <AppLayout role="doctor">
        <div className="space-y-6">
          <div>
            <div className="h-8 w-64 rounded bg-muted animate-pulse" />

            <div className="h-4 w-96 rounded bg-muted animate-pulse mt-2" />
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="space-y-5">
              <div className="h-5 w-32 rounded bg-muted animate-pulse" />

              <div className="h-12 rounded bg-muted animate-pulse" />

              <div className="h-5 w-32 rounded bg-muted animate-pulse" />

              <div className="h-32 rounded bg-muted animate-pulse" />

              <div className="h-5 w-32 rounded bg-muted animate-pulse" />

              <div className="h-32 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * ---------------------------------------------------------
   * NOT FOUND
   * ---------------------------------------------------------
   */

  if (!prescription) {
    return (
      <AppLayout role="doctor">
        <div className="rounded-xl border bg-card p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <FileText
              size={22}
              className="text-primary"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            Prescription not found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The requested prescription could
            not be found.
          </p>

          <Link
            href="/doctor-dashboard/prescriptions"
            className="inline-flex items-center gap-2 mt-5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            <ArrowLeft size={15} />

            Back to Prescriptions
          </Link>
        </div>
      </AppLayout>
    );
  }

  /*
   * ---------------------------------------------------------
   * FORM
   * ---------------------------------------------------------
   */

  return (
    <AppLayout role="doctor">
      <div className="space-y-6 max-w-5xl mx-auto">

        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/doctor-dashboard/prescriptions/${prescription.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={15} />

                Back to Prescription
              </Link>
            </div>

            <h1 className="text-3xl font-bold">
              Edit Prescription
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Update the prescription details
              for the patient.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3">
            <Stethoscope
              size={18}
              className="text-primary"
            />

            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Doctor
              </p>

              <p className="text-sm font-semibold">
                {prescription.doctorName ||
                  'Doctor'}
              </p>
            </div>
          </div>
        </div>

        {/* Patient information */}

        <div className="rounded-xl border bg-card p-6">

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText
                size={19}
                className="text-primary"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold">
                Patient Information
              </h2>

              <p className="text-xs text-muted-foreground">
                Prescription being updated
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Patient
              </p>

              <p className="text-sm font-semibold">
                {prescription.patientName ||
                  'Unknown Patient'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Prescription ID
              </p>

              <p className="text-xs font-medium break-all text-primary">
                {prescription.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Appointment ID
              </p>

              <p className="text-xs font-medium break-all">
                {prescription.appointmentId ||
                  '-'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Doctor
              </p>

              <p className="text-sm font-semibold">
                {prescription.doctorName ||
                  '-'}
              </p>
            </div>

          </div>
        </div>

        {/* Edit form */}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-card p-6"
        >

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Pill
                size={19}
                className="text-primary"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold">
                Prescription Details
              </h2>

              <p className="text-xs text-muted-foreground">
                Modify the treatment information below.
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {/* Diagnosis */}

            <div>
              <label
                htmlFor="diagnosis"
                className="block text-sm font-medium mb-2"
              >
                Diagnosis
              </label>

              <textarea
                id="diagnosis"
                value={diagnosis}
                onChange={(event) =>
                  setDiagnosis(
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Enter diagnosis..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                disabled={saving}
              />

              <p className="text-xs text-muted-foreground mt-1.5">
                Enter the patient's clinical diagnosis.
              </p>
            </div>

            {/* Medicines */}

            <div>
              <label
                htmlFor="medicines"
                className="block text-sm font-medium mb-2"
              >
                Medicines
              </label>

              <textarea
                id="medicines"
                value={medicines}
                onChange={(event) =>
                  setMedicines(
                    event.target.value
                  )
                }
                rows={5}
                placeholder="Enter medicines and dosage instructions..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                disabled={saving}
              />

              <p className="text-xs text-muted-foreground mt-1.5">
                Include medicine names, dosage and frequency as required.
              </p>
            </div>

            {/* Instructions */}

            <div>
              <label
                htmlFor="instructions"
                className="block text-sm font-medium mb-2"
              >
                Instructions
              </label>

              <textarea
                id="instructions"
                value={instructions}
                onChange={(event) =>
                  setInstructions(
                    event.target.value
                  )
                }
                rows={5}
                placeholder="Enter instructions for the patient..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                disabled={saving}
              />

              <p className="text-xs text-muted-foreground mt-1.5">
                Add any instructions the patient should follow.
              </p>
            </div>

            {/* Follow-up */}

            <div>
              <label
                htmlFor="followUpDate"
                className="block text-sm font-medium mb-2"
              >
                Follow-up Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />

                <input
                  id="followUpDate"
                  type="date"
                  value={followUpDate}
                  onChange={(event) =>
                    setFollowUpDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  disabled={saving}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-1.5">
                Leave empty if no follow-up is required.
              </p>
            </div>

          </div>

          {/* Actions */}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8 pt-5 border-t border-border">

            <Link
              href={`/doctor-dashboard/prescriptions/${prescription.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={16} />

              {saving
                ? 'Saving Changes...'
                : 'Save Changes'}
            </button>

          </div>
        </form>
      </div>
    </AppLayout>
  );
}