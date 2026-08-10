'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import Link from 'next/link';

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
  Pencil,
  Save,
  Stethoscope,
  User,
  X,
} from 'lucide-react';

import { toast } from 'sonner';

import AppLayout from '@/components/AppLayout';

import appointmentService from '@/services/appointmentService';
import prescriptionService from '@/services/prescriptionService';

import { Appointment } from '@/types/Appointment';
import { Prescription } from '@/types/Prescription';

import AppointmentStatusBadge from '@/components/appointments/AppointmentStatusBadge';


/*
 * =========================================================
 * DATE HELPERS
 * =========================================================
 */

/*
 * Converts different possible backend date formats
 * into YYYY-MM-DD.
 *
 * Examples:
 *
 * 2026-08-20
 *       ↓
 * 2026-08-20
 *
 * 2026-08-20T19:16:06.174Z
 *       ↓
 * 2026-08-20
 */
function getDateOnly(
  date: string | null | undefined
): string {
  if (!date) {
    return '';
  }

  /*
   * If backend already returns:
   *
   * YYYY-MM-DD
   *
   * return it directly.
   */
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  /*
   * If backend returns ISO datetime:
   *
   * 2026-08-20T19:16:06.174Z
   *
   * extract the date portion.
   */
  if (date.includes('T')) {
    return date.split('T')[0];
  }

  return date;
}


/*
 * Formats a date for display.
 */
function formatDate(
  date: string | null | undefined
) {
  if (!date) {
    return '-';
  }

  const dateOnly = getDateOnly(date);

  const parts = dateOnly
    .split('-')
    .map(Number);

  if (parts.length !== 3) {
    return date;
  }

  const [
    year,
    month,
    day,
  ] = parts;

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day)
  ) {
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
 * =========================================================
 * TIME FORMAT
 * =========================================================
 */

function formatTime(
  time: string | null | undefined
) {
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

  const period =
    hours >= 12
      ? 'PM'
      : 'AM';

  const displayHour =
    hours % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
}


/*
 * =========================================================
 * PAGE
 * =========================================================
 */

export default function DoctorPrescriptionDetailsPage() {
  const params = useParams();

  const router = useRouter();


  /*
   * -------------------------------------------------------
   * PRESCRIPTION ID
   * -------------------------------------------------------
   */

  const prescriptionId =
    typeof params.id === 'string'
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : '';


  /*
   * -------------------------------------------------------
   * STATE
   * -------------------------------------------------------
   */

  const [
    prescription,
    setPrescription,
  ] = useState<Prescription | null>(null);

  const [
    appointment,
    setAppointment,
  ] = useState<Appointment | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    editing,
    setEditing,
  ] = useState(false);


  /*
   * -------------------------------------------------------
   * EDIT FORM STATE
   * -------------------------------------------------------
   */

  const [
    diagnosis,
    setDiagnosis,
  ] = useState('');

  const [
    medicines,
    setMedicines,
  ] = useState('');

  const [
    instructions,
    setInstructions,
  ] = useState('');

  const [
    followUpDate,
    setFollowUpDate,
  ] = useState('');


  /*
   * ========================================================
   * LOAD PRESCRIPTION
   * ========================================================
   */

  useEffect(() => {
    if (!prescriptionId) {
      setLoading(false);
      return;
    }

    loadPrescription();
  }, [prescriptionId]);


  async function loadPrescription() {
    try {
      setLoading(true);

      /*
       * Get prescription from backend.
       */
      const data =
        await prescriptionService.getPrescriptionById(
          prescriptionId
        );


      /*
       * Backend did not return prescription.
       */
      if (!data) {
        setPrescription(null);
        return;
      }


      /*
       * Save prescription.
       */
      setPrescription(data);


      /*
       * Populate edit form.
       */
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
       * IMPORTANT:
       *
       * Backend may return:
       *
       * 2026-08-20T19:16:06.174Z
       *
       * but HTML date input requires:
       *
       * 2026-08-20
       */
      setFollowUpDate(
        getDateOnly(
          data.followUpDate
        )
      );


      /*
       * ----------------------------------------------------
       * LOAD RELATED APPOINTMENT
       * ----------------------------------------------------
       *
       * Appointment is supplementary information.
       *
       * If appointment loading fails,
       * prescription page should still work.
       */

      if (data.appointmentId) {
        try {
          const appointmentData =
            await appointmentService.getAppointmentById(
              data.appointmentId
            );

          if (appointmentData) {
            setAppointment(
              appointmentData
            );
          }
        } catch (appointmentError) {
          console.warn(
            'Could not load related appointment:',
            appointmentError
          );

          /*
           * Do not show an error toast here.
           *
           * The prescription itself is still valid.
           */
        }
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


  /*
   * ========================================================
   * START EDITING
   * ========================================================
   */

  function handleStartEditing() {
    if (!prescription) {
      return;
    }

    /*
     * Always populate the form
     * from the latest saved values.
     */

    setDiagnosis(
      prescription.diagnosis ?? ''
    );

    setMedicines(
      prescription.medicines ?? ''
    );

    setInstructions(
      prescription.instructions ?? ''
    );

    setFollowUpDate(
      getDateOnly(
        prescription.followUpDate
      )
    );

    setEditing(true);
  }


  /*
   * ========================================================
   * CANCEL EDITING
   * ========================================================
   */

  function handleCancelEditing() {
    if (!prescription) {
      return;
    }

    /*
     * Restore original saved values.
     */

    setDiagnosis(
      prescription.diagnosis ?? ''
    );

    setMedicines(
      prescription.medicines ?? ''
    );

    setInstructions(
      prescription.instructions ?? ''
    );

    setFollowUpDate(
      getDateOnly(
        prescription.followUpDate
      )
    );

    setEditing(false);
  }


  /*
   * ========================================================
   * SAVE PRESCRIPTION
   * ========================================================
   */

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    /*
     * Prescription must exist.
     */
    if (!prescription) {
      toast.error(
        'Prescription information is unavailable.'
      );

      return;
    }


    /*
     * Validate diagnosis.
     */
    if (!diagnosis.trim()) {
      toast.error(
        'Diagnosis is required.'
      );

      return;
    }


    /*
     * Validate medicines.
     */
    if (!medicines.trim()) {
      toast.error(
        'Medicines are required.'
      );

      return;
    }


    /*
     * Validate instructions.
     */
    if (!instructions.trim()) {
      toast.error(
        'Instructions are required.'
      );

      return;
    }


    try {
      setSaving(true);


      /*
       * ----------------------------------------------------
       * BACKEND PUT REQUEST
       * ----------------------------------------------------
       *
       * PUT:
       *
       * /api/prescriptions/{id}
       *
       * Request body:
       *
       * {
       *   diagnosis,
       *   medicines,
       *   instructions,
       *   followUpDate
       * }
       */

      const updated =
  await prescriptionService.updatePrescription(
    prescription.id,
    {
      diagnosis: diagnosis.trim(),
      medicines: medicines.trim(),
      instructions: instructions.trim(),
      followUpDate:
        followUpDate || null,
    }
  );

/*
 * The backend may return the updated
 * prescription or may return 204 No Content.
 *
 * If it returns the prescription, use it.
 *
 * If it returns no data, preserve the existing
 * prescription and update the edited fields locally.
 */

if (updated) {
  setPrescription(updated);

  setDiagnosis(
    updated.diagnosis ?? ''
  );

  setMedicines(
    updated.medicines ?? ''
  );

  setInstructions(
    updated.instructions ?? ''
  );

  setFollowUpDate(
    updated.followUpDate ?? ''
  );
} else {
  /*
   * Backend successfully updated the database
   * but did not return the updated object.
   *
   * Keep the existing patient/doctor/appointment
   * information and update only the edited fields.
   */

  setPrescription((current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,

      diagnosis:
        diagnosis.trim(),

      medicines:
        medicines.trim(),

      instructions:
        instructions.trim(),

      followUpDate:
        followUpDate || null,
    };
  });
}

setEditing(false);

toast.success(
  'Prescription updated successfully.'
);


      /*
       * Exit edit mode.
       */
      setEditing(false);


      /*
       * Success message.
       */
      toast.success(
        'Prescription updated successfully.'
      );
    } catch (error) {
      console.error(
        'Failed to update prescription:',
        error
      );


      /*
       * Show useful backend/frontend error.
       */

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
   * ========================================================
   * LOADING STATE
   * ========================================================
   */

  if (loading) {
    return (
      <AppLayout role="doctor">

        <div className="flex items-center justify-center min-h-[400px]">

          <div className="flex flex-col items-center gap-3">

            <Loader2
              size={28}
              className="animate-spin text-primary"
            />

            <p className="text-sm text-muted-foreground">
              Loading prescription...
            </p>

          </div>

        </div>

      </AppLayout>
    );
  }


  /*
   * ========================================================
   * NOT FOUND
   * ========================================================
   */

  if (!prescription) {
    return (
      <AppLayout role="doctor">

        <div className="space-y-6">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/doctor-dashboard/prescriptions'
              )
            }
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} />

            Back to Prescriptions
          </button>


          <div className="rounded-xl border border-border bg-card shadow-card">

            <div className="px-6 py-16 text-center">

              <div className="mx-auto w-14 h-14 rounded-full bg-secondary flex items-center justify-center">

                <FileText
                  size={25}
                  className="text-primary"
                />

              </div>


              <h2 className="mt-4 text-lg font-semibold text-foreground">
                Prescription not found
              </h2>


              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                The requested prescription could not
                be found or may no longer exist.
              </p>


              <Link
                href="/doctor-dashboard/prescriptions"
                className="inline-flex items-center gap-2 mt-6 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft size={15} />

                Back to Prescriptions
              </Link>

            </div>

          </div>

        </div>

      </AppLayout>
    );
  }


  /*
   * ========================================================
   * MAIN PAGE
   * ========================================================
   */

  return (
    <AppLayout role="doctor">

      <div className="space-y-6">


        {/* =================================================
            HEADER
            ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/doctor-dashboard/prescriptions'
                )
              }
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft size={15} />

              Back to Prescriptions
            </button>


            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Prescription Details
            </h1>


            <p className="mt-1 text-sm text-muted-foreground">
              View and manage the patient&apos;s prescription.
            </p>

          </div>


          {/* =================================================
              EDIT / SAVE / CANCEL BUTTONS
              ================================================= */}

          {!editing ? (

            <button
              type="button"
              onClick={handleStartEditing}
              className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all btn-press"
            >
              <Pencil size={15} />

              Edit Prescription
            </button>

          ) : (

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                <X size={15} />

                Cancel
              </button>


              <button
                type="submit"
                form="prescription-edit-form"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all btn-press disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />

                    Save Changes
                  </>
                )}

              </button>

            </div>
          )}

        </div>


        {/* =================================================
            PATIENT SUMMARY
            ================================================= */}

        <div className="rounded-xl border border-border bg-card shadow-card">

          <div className="px-5 py-5 sm:px-6">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">


              {/* Patient */}

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">

                  <User
                    size={20}
                    className="text-primary"
                  />

                </div>


                <div>

                  <p className="text-base font-semibold text-foreground">
                    {prescription.patientName ||
                      'Unknown Patient'}
                  </p>


                  <p className="text-xs text-muted-foreground mt-0.5">
                    Patient prescription record
                  </p>

                </div>

              </div>


              {/* Doctor */}

              <div className="flex items-center gap-2">

                <Stethoscope
                  size={17}
                  className="text-primary"
                />

                <div>

                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Prescribed by
                  </p>


                  <p className="text-sm font-semibold text-foreground">
                    {prescription.doctorName ||
                      'Doctor'}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                APPOINTMENT SUMMARY
                ================================================= */}

            <div className="mt-5 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


              {/* Appointment */}

              <div className="flex items-start gap-2.5">

                <CalendarDays
                  size={16}
                  className="text-primary mt-0.5"
                />

                <div>

                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Appointment
                  </p>


                  <p className="text-xs font-medium text-foreground mt-1">

                    {appointment
                      ? `${formatDate(
                          appointment.appointmentDate
                        )} · ${formatTime(
                          appointment.appointmentTime
                        )}`
                      : 'Related appointment'}

                  </p>

                </div>

              </div>


              {/* Appointment Status */}

              <div className="flex items-start gap-2.5">

                <CheckCircle2
                  size={16}
                  className="text-positive mt-0.5"
                />

                <div>

                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Appointment Status
                  </p>


                  {appointment ? (

                    <div className="mt-1">

                      <AppointmentStatusBadge
                        status={
                          appointment.status
                        }
                      />

                    </div>

                  ) : (

                    <p className="text-xs font-medium text-foreground mt-1">
                      Prescription issued
                    </p>

                  )}

                </div>

              </div>


              {/* Follow-up */}

              <div className="flex items-start gap-2.5">

                <CalendarDays
                  size={16}
                  className="text-warning mt-0.5"
                />

                <div>

                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Follow-up
                  </p>


                  <p className="text-xs font-medium text-foreground mt-1">

                    {formatDate(
                      prescription.followUpDate
                    )}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            EDIT MODE
            ================================================= */}

        {editing ? (

          <form
            id="prescription-edit-form"
            onSubmit={handleSave}
            className="space-y-5"
          >


            {/* =================================================
                DIAGNOSIS
                ================================================= */}

            <div className="rounded-xl border border-border bg-card shadow-card">

              <div className="px-5 py-4 border-b border-border">

                <div className="flex items-center gap-2">

                  <FileText
                    size={17}
                    className="text-primary"
                  />

                  <div>

                    <h2 className="text-sm font-semibold text-foreground">
                      Diagnosis
                    </h2>

                    <p className="text-[11px] text-muted-foreground">
                      Clinical diagnosis
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5">

                <textarea
                  value={diagnosis}
                  onChange={(event) =>
                    setDiagnosis(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Enter diagnosis..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />

              </div>

            </div>


            {/* =================================================
                MEDICINES
                ================================================= */}

            <div className="rounded-xl border border-border bg-card shadow-card">

              <div className="px-5 py-4 border-b border-border">

                <div className="flex items-center gap-2">

                  <FileText
                    size={17}
                    className="text-positive"
                  />

                  <div>

                    <h2 className="text-sm font-semibold text-foreground">
                      Medicines
                    </h2>

                    <p className="text-[11px] text-muted-foreground">
                      Prescribed medicines
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5">

                <textarea
                  value={medicines}
                  onChange={(event) =>
                    setMedicines(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Enter medicines..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />

              </div>

            </div>


            {/* =================================================
                INSTRUCTIONS
                ================================================= */}

            <div className="rounded-xl border border-border bg-card shadow-card">

              <div className="px-5 py-4 border-b border-border">

                <div className="flex items-center gap-2">

                  <FileText
                    size={17}
                    className="text-accent"
                  />

                  <div>

                    <h2 className="text-sm font-semibold text-foreground">
                      Instructions
                    </h2>

                    <p className="text-[11px] text-muted-foreground">
                      Instructions provided to the patient
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5">

                <textarea
                  value={instructions}
                  onChange={(event) =>
                    setInstructions(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Enter instructions..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />

              </div>

            </div>


            {/* =================================================
                FOLLOW-UP DATE
                ================================================= */}

            <div className="rounded-xl border border-border bg-card shadow-card">

              <div className="px-5 py-4 border-b border-border">

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={17}
                    className="text-warning"
                  />

                  <div>

                    <h2 className="text-sm font-semibold text-foreground">
                      Follow-up Date
                    </h2>

                    <p className="text-[11px] text-muted-foreground">
                      Optional follow-up appointment date
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5">

                <input
                  type="date"
                  value={followUpDate}
                  onChange={(event) =>
                    setFollowUpDate(
                      event.target.value
                    )
                  }
                  className="w-full sm:w-72 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />

              </div>

            </div>

          </form>

        ) : (

          /* =================================================
             READ-ONLY MODE
             ================================================= */

          <div className="space-y-5">


            {/* =================================================
                DIAGNOSIS + MEDICINES
                ================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">


              {/* Diagnosis */}

              <div className="rounded-xl border border-border bg-card shadow-card">

                <div className="px-5 py-4 border-b border-border">

                  <div className="flex items-center gap-2">

                    <FileText
                      size={17}
                      className="text-primary"
                    />

                    <div>

                      <h2 className="text-sm font-semibold text-foreground">
                        Diagnosis
                      </h2>

                      <p className="text-[11px] text-muted-foreground">
                        Clinical diagnosis
                      </p>

                    </div>

                  </div>

                </div>


                <div className="p-5">

                  <div className="rounded-lg border border-border bg-background px-4 py-3">

                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">

                      {prescription.diagnosis ||
                        'No diagnosis provided.'}

                    </p>

                  </div>

                </div>

              </div>


              {/* Medicines */}

              <div className="rounded-xl border border-border bg-card shadow-card">

                <div className="px-5 py-4 border-b border-border">

                  <div className="flex items-center gap-2">

                    <FileText
                      size={17}
                      className="text-positive"
                    />

                    <div>

                      <h2 className="text-sm font-semibold text-foreground">
                        Medicines
                      </h2>

                      <p className="text-[11px] text-muted-foreground">
                        Prescribed medicines
                      </p>

                    </div>

                  </div>

                </div>


                <div className="p-5">

                  <div className="rounded-lg border border-border bg-background px-4 py-3">

                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">

                      {prescription.medicines ||
                        'No medicines provided.'}

                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                INSTRUCTIONS
                ================================================= */}

            <div className="rounded-xl border border-border bg-card shadow-card">

              <div className="px-5 py-4 border-b border-border">

                <div className="flex items-center gap-2">

                  <FileText
                    size={17}
                    className="text-accent"
                  />

                  <div>

                    <h2 className="text-sm font-semibold text-foreground">
                      Instructions
                    </h2>

                    <p className="text-[11px] text-muted-foreground">
                      Instructions provided to the patient
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5">

                <div className="rounded-lg border border-border bg-background px-4 py-3">

                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">

                    {prescription.instructions ||
                      'No instructions provided.'}

                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                FOLLOW-UP
                ================================================= */}

            <div className="rounded-xl border border-border bg-card shadow-card">

              <div className="px-5 py-4 border-b border-border">

                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={17}
                    className="text-warning"
                  />

                  <div>

                    <h2 className="text-sm font-semibold text-foreground">
                      Follow-up
                    </h2>

                    <p className="text-[11px] text-muted-foreground">
                      Next recommended follow-up
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5">

                <p className="text-sm font-semibold text-foreground">

                  {formatDate(
                    prescription.followUpDate
                  )}

                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </AppLayout>
  );
}