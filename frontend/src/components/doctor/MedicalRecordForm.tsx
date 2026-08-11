'use client';

import {
  useState,
  type FormEvent,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  FileText,
  Stethoscope,
  ClipboardList,
  MessageSquare,
} from 'lucide-react';

import medicalRecordService from '@/services/medicalRecordService';

interface MedicalRecordFormProps {
  appointmentId: string;

  patientId: string;

  doctorId: string;

  visitDate: string;
}

export default function MedicalRecordForm({
  appointmentId,
  patientId,
  doctorId,
  visitDate,
}: MedicalRecordFormProps) {
  const router = useRouter();

  const [
    diagnosis,
    setDiagnosis,
  ] = useState('');

  const [
    symptoms,
    setSymptoms,
  ] = useState('');

  const [
    treatment,
    setTreatment,
  ] = useState('');

  const [
    doctorNotes,
    setDoctorNotes,
  ] = useState('');

  const [
    saving,
    setSaving,
  ] = useState(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    /*
     * ---------------------------------------------------------
     * VALIDATION
     * ---------------------------------------------------------
     */

    if (!appointmentId) {
      alert(
        'Appointment ID is missing.'
      );

      return;
    }

    if (!patientId) {
      alert(
        'Patient ID is missing.'
      );

      return;
    }

    if (!doctorId) {
      alert(
        'Doctor ID is missing.'
      );

      return;
    }

    if (!diagnosis.trim()) {
      alert(
        'Please enter the diagnosis.'
      );

      return;
    }

    if (!symptoms.trim()) {
      alert(
        'Please enter the symptoms.'
      );

      return;
    }

    if (!treatment.trim()) {
      alert(
        'Please enter the treatment.'
      );

      return;
    }

    try {
      setSaving(true);

      /*
       * -------------------------------------------------------
       * VISIT DATE
       * -------------------------------------------------------
       *
       * The appointment date is used as the medical
       * record visit date.
       *
       * If the appointment date is not available,
       * today's date is used as fallback.
       */

      let formattedVisitDate =
        visitDate;

      if (visitDate) {
        const parsedDate =
          new Date(
            visitDate
          );

        if (
          !Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          formattedVisitDate =
            parsedDate.toISOString();
        }
      }

      if (!formattedVisitDate) {
        formattedVisitDate =
          new Date().toISOString();
      }

      /*
       * -------------------------------------------------------
       * CREATE MEDICAL RECORD
       * -------------------------------------------------------
       *
       * IMPORTANT:
       *
       * patientId and doctorId are used here only
       * to validate that the appointment context exists.
       *
       * The backend CreateMedicalRecordRequest currently
       * expects:
       *
       * appointmentId
       * visitDate
       * diagnosis
       * symptoms
       * treatment
       * doctorNotes
       *
       * Therefore patientId and doctorId are NOT sent
       * in the POST body.
       */

      await medicalRecordService.createMedicalRecord(
        {
          appointmentId,

          visitDate:
            formattedVisitDate,

          diagnosis:
            diagnosis.trim(),

          symptoms:
            symptoms.trim(),

          treatment:
            treatment.trim(),

          doctorNotes:
            doctorNotes.trim(),
        }
      );

      alert(
        'Medical record created successfully.'
      );

      /*
       * Return to appointment details.
       */

      router.push(
        `/doctor-dashboard/appointments/${appointmentId}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        'Failed to create medical record:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create medical record.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =====================================================
          DIAGNOSIS
          ===================================================== */}

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Stethoscope
              size={20}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Diagnosis
            </h2>

            <p className="text-sm text-muted-foreground">
              Record the patient's diagnosis.
            </p>
          </div>
        </div>

        <textarea
          value={diagnosis}
          onChange={(e) =>
            setDiagnosis(
              e.target.value
            )
          }
          rows={4}
          required
          disabled={saving}
          className="w-full rounded-lg border bg-background p-3 outline-none transition focus:ring-2 focus:ring-primary/30"
          placeholder="Enter the patient's diagnosis..."
        />
      </div>

      {/* =====================================================
          SYMPTOMS
          ===================================================== */}

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileText
              size={20}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Symptoms
            </h2>

            <p className="text-sm text-muted-foreground">
              Record the symptoms reported or observed.
            </p>
          </div>
        </div>

        <textarea
          value={symptoms}
          onChange={(e) =>
            setSymptoms(
              e.target.value
            )
          }
          rows={5}
          required
          disabled={saving}
          className="w-full rounded-lg border bg-background p-3 outline-none transition focus:ring-2 focus:ring-primary/30"
          placeholder={`Example:

Fever
Headache
Body pain
Mild throat irritation`}
        />
      </div>

      {/* =====================================================
          TREATMENT
          ===================================================== */}

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ClipboardList
              size={20}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Treatment
            </h2>

            <p className="text-sm text-muted-foreground">
              Record the treatment provided during the visit.
            </p>
          </div>
        </div>

        <textarea
          value={treatment}
          onChange={(e) =>
            setTreatment(
              e.target.value
            )
          }
          rows={5}
          required
          disabled={saving}
          className="w-full rounded-lg border bg-background p-3 outline-none transition focus:ring-2 focus:ring-primary/30"
          placeholder={`Example:

Prescribed medication
Rest and hydration
Follow-up after 5 days`}
        />
      </div>

      {/* =====================================================
          DOCTOR NOTES
          ===================================================== */}

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquare
              size={20}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Doctor's Notes
            </h2>

            <p className="text-sm text-muted-foreground">
              Add additional consultation notes.
            </p>
          </div>
        </div>

        <textarea
          value={doctorNotes}
          onChange={(e) =>
            setDoctorNotes(
              e.target.value
            )
          }
          rows={5}
          disabled={saving}
          className="w-full rounded-lg border bg-background p-3 outline-none transition focus:ring-2 focus:ring-primary/30"
          placeholder="Add additional observations, recommendations, or notes..."
        />
      </div>

      {/* =====================================================
          ACTIONS
          ===================================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={() =>
            router.push(
              `/doctor-dashboard/appointments/${appointmentId}`
            )
          }
          className="rounded-lg border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? 'Saving Medical Record...'
            : 'Save Medical Record'}
        </button>
      </div>
    </form>
  );
}