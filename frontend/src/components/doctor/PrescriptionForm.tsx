'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import prescriptionService from '@/services/prescriptionService';

interface PrescriptionFormProps {
  appointmentId: string;
  patientId: string;
  doctorId: string;
}

export default function PrescriptionForm({
  appointmentId,
  patientId,
  doctorId,
}: PrescriptionFormProps) {
  const router = useRouter();

  const [diagnosis, setDiagnosis] =
    useState('');

  const [medicines, setMedicines] =
    useState('');

  const [instructions, setInstructions] =
    useState('');

  const [followUpDate, setFollowUpDate] =
    useState('');

  const [saving, setSaving] =
    useState(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    /*
     * Basic validation
     */

    if (!diagnosis.trim()) {
      alert('Please enter the diagnosis.');
      return;
    }

    if (!medicines.trim()) {
      alert('Please enter the medicines.');
      return;
    }

    if (!instructions.trim()) {
      alert('Please enter the instructions.');
      return;
    }

    try {
      setSaving(true);

      /*
       * IMPORTANT
       *
       * Do NOT send:
       *
       * id
       * createdAt
       *
       * The backend generates these values.
       *
       * The request must contain only the fields
       * expected by CreatePrescriptionRequest.
       */

      await prescriptionService.createPrescription({
        appointmentId,

        patientId,

        doctorId,

        diagnosis:
          diagnosis.trim(),

        medicines:
          medicines.trim(),

        instructions:
          instructions.trim(),

        followUpDate:
          followUpDate || null,
      });

      /*
       * Prescription was successfully created.
       */

      router.push(
        '/doctor-dashboard/prescriptions'
      );
    } catch (error) {
      console.error(
        'Failed to create prescription:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create prescription.'
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
      {/* -------------------------------------- */}
      {/* DIAGNOSIS */}
      {/* -------------------------------------- */}

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold mb-5">
          Diagnosis
        </h2>

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
          className="w-full rounded-lg border p-3"
          placeholder="Enter diagnosis..."
        />
      </div>

      {/* -------------------------------------- */}
      {/* MEDICINES */}
      {/* -------------------------------------- */}

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold mb-5">
          Medicines
        </h2>

        <textarea
          value={medicines}
          onChange={(e) =>
            setMedicines(
              e.target.value
            )
          }
          rows={6}
          required
          disabled={saving}
          className="w-full rounded-lg border p-3"
          placeholder={`Example:

Tab Paracetamol 500mg
1-0-1 for 5 days

Cap Amoxicillin
1-1-1 after food`}
        />
      </div>

      {/* -------------------------------------- */}
      {/* INSTRUCTIONS */}
      {/* -------------------------------------- */}

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold mb-5">
          Instructions
        </h2>

        <textarea
          value={instructions}
          onChange={(e) =>
            setInstructions(
              e.target.value
            )
          }
          rows={4}
          disabled={saving}
          className="w-full rounded-lg border p-3"
          placeholder="Additional instructions..."
        />
      </div>

      {/* -------------------------------------- */}
      {/* FOLLOW-UP DATE */}
      {/* -------------------------------------- */}

      <div className="rounded-xl border bg-card p-6">
        <label className="block mb-2 font-medium">
          Follow Up Date
        </label>

        <input
          type="date"
          value={followUpDate}
          onChange={(e) =>
            setFollowUpDate(
              e.target.value
            )
          }
          disabled={saving}
          className="rounded-lg border p-2"
        />
      </div>

      {/* -------------------------------------- */}
      {/* SAVE BUTTON */}
      {/* -------------------------------------- */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-3 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? 'Saving...'
            : 'Save Prescription'}
        </button>
      </div>
    </form>
  );
}