'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import Link from 'next/link';

import AppLayout from '@/components/AppLayout';

import patientService from '@/services/patientService';
import appointmentService from '@/services/appointmentService';
import prescriptionService from '@/services/prescriptionService';
import doctorService from '@/services/doctorService';

import { Patient } from '@/types/Patient';
import { Appointment } from '@/types/Appointment';
import { Prescription } from '@/types/Prescription';

import { useAuth } from '@/context/AuthContext';

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  User,
} from 'lucide-react';

import { toast } from 'sonner';


/*
 * ---------------------------------------------------------
 * DATE FORMAT
 * ---------------------------------------------------------
 */

function formatDate(
  date: string | null | undefined
) {
  if (!date) {
    return '-';
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date;
  }

  return parsed.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );
}


/*
 * ---------------------------------------------------------
 * TIME FORMAT
 * ---------------------------------------------------------
 */

function formatTime(
  time: string | null | undefined
) {
  if (!time) {
    return '-';
  }

  const parts =
    time.split(':');

  if (parts.length < 2) {
    return time;
  }

  const hours =
    Number(parts[0]);

  const minutes =
    parts[1];

  if (
    Number.isNaN(hours)
  ) {
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
 * ---------------------------------------------------------
 * AGE
 * ---------------------------------------------------------
 */

function calculateAge(
  dateOfBirth: string
) {
  if (!dateOfBirth) {
    return '-';
  }

  const birthDate =
    new Date(dateOfBirth);

  if (
    Number.isNaN(
      birthDate.getTime()
    )
  ) {
    return '-';
  }

  const today =
    new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() <
        birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
}


/*
 * ---------------------------------------------------------
 * PAGE
 * ---------------------------------------------------------
 */

export default function DoctorPatientDetails() {

  const params =
    useParams();

  const router =
    useRouter();

  const { user } =
    useAuth();


  /*
   * Patient ID from URL
   */

  const patientId =
    typeof params.id === 'string'
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : '';


  /*
   * STATE
   */

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  /*
   * ---------------------------------------------------------
   * LOAD PATIENT DETAILS
   * ---------------------------------------------------------
   */

  useEffect(() => {

    if (!patientId) {
      setLoading(false);
      return;
    }


    async function loadPatientDetails() {

      try {

        setLoading(true);

        setError(null);


        /*
         * First load the patient.
         */

        const patientData =
          await patientService.getPatientById(
            patientId
          );


        if (!patientData) {
          throw new Error(
            'Patient not found.'
          );
        }


        setPatient(
          patientData
        );


        /*
         * Load patient's appointments
         * and all prescriptions.
         */

        const [
          patientAppointments,
          allPrescriptions,
        ] = await Promise.all([
          appointmentService.getAppointmentsByPatientId(
            patientId
          ),
          prescriptionService.getPrescriptions(),
        ]);


        /*
         * Identify the logged-in doctor.
         */

        let doctorAppointments =
          patientAppointments;


        if (user?.email) {

          try {

            const doctors =
              await doctorService.getDoctors();

            const loggedInEmail =
              user.email
                .trim()
                .toLowerCase();

            const currentDoctor =
              doctors.find(
                (doctor) =>
                  doctor.email
                    ?.trim()
                    .toLowerCase() ===
                  loggedInEmail
              );


            if (currentDoctor) {

              doctorAppointments =
                patientAppointments.filter(
                  (appointment) =>
                    appointment.doctorId ===
                    currentDoctor.id
                );

            }

          } catch (doctorError) {

            console.warn(
              'Unable to identify doctor for patient history:',
              doctorError
            );

          }

        }


        setAppointments(
          doctorAppointments
        );


        /*
         * Prescription does not currently expose
         * patientId in the shared frontend type.
         *
         * Therefore we connect prescriptions to
         * this patient's appointments through
         * appointmentId.
         */

        const patientAppointmentIds =
          new Set(
            doctorAppointments.map(
              (appointment) =>
                appointment.id
            )
          );


        const patientPrescriptions =
          allPrescriptions.filter(
            (prescription) =>
              patientAppointmentIds.has(
                prescription.appointmentId
              )
          );


        setPrescriptions(
          patientPrescriptions
        );

      } catch (err) {

        console.error(
          'Failed to load patient details:',
          err
        );


        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load patient details.';


        setError(message);

        toast.error(message);

      } finally {

        setLoading(false);

      }

    }


    loadPatientDetails();

  }, [
    patientId,
    user,
  ]);


  /*
   * ---------------------------------------------------------
   * LAST VISIT
   * ---------------------------------------------------------
   */

  const lastVisit =
    useMemo(() => {

      if (
        appointments.length === 0
      ) {
        return null;
      }


      const sorted =
        [...appointments].sort(
          (a, b) =>
            new Date(
              `${b.appointmentDate}T${b.appointmentTime}`
            ).getTime() -
            new Date(
              `${a.appointmentDate}T${a.appointmentTime}`
            ).getTime()
        );


      return sorted[0];

    }, [appointments]);


  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {

    return (

      <AppLayout
        role="doctor"
        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/doctor-dashboard',
          },
          {
            label: 'My Patients',
            href: '/doctor-dashboard/patients',
          },
          {
            label: 'Patient Details',
          },
        ]}
      >

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex flex-col items-center gap-3">

            <Loader2
              size={30}
              className="animate-spin text-primary"
            />

            <p className="text-sm text-muted-foreground">
              Loading patient details...
            </p>

          </div>

        </div>

      </AppLayout>

    );

  }


  /*
   * ---------------------------------------------------------
   * ERROR / NOT FOUND
   * ---------------------------------------------------------
   */

  if (
    error ||
    !patient
  ) {

    return (

      <AppLayout
        role="doctor"
        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/doctor-dashboard',
          },
          {
            label: 'My Patients',
            href: '/doctor-dashboard/patients',
          },
          {
            label: 'Patient Details',
          },
        ]}
      >

        <div className="space-y-6">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/doctor-dashboard/patients'
              )
            }
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >

            <ArrowLeft size={16} />

            Back to My Patients

          </button>


          <div className="rounded-xl border bg-card p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">

              <User
                size={25}
                className="text-primary"
              />

            </div>


            <h2 className="mt-4 text-xl font-semibold">
              Patient Not Found
            </h2>


            <p className="mt-2 text-sm text-muted-foreground">
              {error ||
                'The requested patient could not be found.'}
            </p>


            <Link
              href="/doctor-dashboard/patients"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
            >

              <ArrowLeft size={15} />

              Back to My Patients

            </Link>

          </div>

        </div>

      </AppLayout>

    );

  }


  /*
   * ---------------------------------------------------------
   * MAIN PAGE
   * ---------------------------------------------------------
   */

  return (

    <AppLayout
      role="doctor"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/doctor-dashboard',
        },
        {
          label: 'My Patients',
          href: '/doctor-dashboard/patients',
        },
        {
          label:
            `${patient.firstName} ${patient.lastName}`,
        },
      ]}
    >

      <div className="space-y-6">


        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            router.push(
              '/doctor-dashboard/patients'
            )
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >

          <ArrowLeft size={16} />

          Back to My Patients

        </button>


        {/* -------------------------------------------------- */}
        {/* PATIENT HEADER */}
        {/* -------------------------------------------------- */}

        <div className="rounded-xl border bg-card p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10">

                <User
                  size={36}
                  className="text-primary"
                />

              </div>


              <div>

                <h1 className="text-2xl font-bold sm:text-3xl">

                  {patient.firstName}{' '}
                  {patient.lastName}

                </h1>


                <p className="mt-1 font-mono text-xs text-muted-foreground">

                  Patient ID:{' '}
                  {patient.id}

                </p>


                <p className="mt-1 text-sm text-muted-foreground">

                  Patient record

                </p>

              </div>

            </div>


            <div className="rounded-lg bg-primary/5 px-4 py-3">

              <div className="flex items-center gap-2">

                <Stethoscope
                  size={17}
                  className="text-primary"
                />

                <span className="text-sm font-medium text-primary">
                  Doctor Patient
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* -------------------------------------------------- */}
        {/* PERSONAL + CONTACT */}
        {/* -------------------------------------------------- */}

        <div className="grid gap-6 md:grid-cols-2">


          {/* PERSONAL INFORMATION */}

          <div className="rounded-xl border bg-card p-6">

            <div className="mb-5 flex items-center gap-2">

              <User
                size={19}
                className="text-primary"
              />

              <h2 className="text-xl font-semibold">
                Personal Information
              </h2>

            </div>


            <div className="space-y-4">

              <div className="flex justify-between gap-4">

                <span className="text-muted-foreground">
                  Age
                </span>

                <strong>
                  {calculateAge(
                    patient.dateOfBirth
                  )}
                </strong>

              </div>


              <div className="flex justify-between gap-4">

                <span className="text-muted-foreground">
                  Date of Birth
                </span>

                <strong>
                  {formatDate(
                    patient.dateOfBirth
                  )}
                </strong>

              </div>


              <div className="flex justify-between gap-4">

                <span className="text-muted-foreground">
                  Gender
                </span>

                <strong>
                  {patient.gender ||
                    '-'}
                </strong>

              </div>


              <div className="flex justify-between gap-4">

                <span className="text-muted-foreground">
                  Blood Group
                </span>

                <strong>
                  {patient.bloodGroup ||
                    '-'}
                </strong>

              </div>

            </div>

          </div>


          {/* CONTACT DETAILS */}

          <div className="rounded-xl border bg-card p-6">

            <div className="mb-5 flex items-center gap-2">

              <Phone
                size={19}
                className="text-primary"
              />

              <h2 className="text-xl font-semibold">
                Contact Details
              </h2>

            </div>


            <div className="space-y-4">


              <div className="flex items-start gap-3">

                <Phone
                  size={17}
                  className="mt-0.5 text-muted-foreground"
                />

                <div>

                  <p className="text-xs text-muted-foreground">
                    Phone
                  </p>

                  <p className="text-sm font-medium">
                    {patient.phone ||
                      '-'}
                  </p>

                </div>

              </div>


              <div className="flex items-start gap-3">

                <Mail
                  size={17}
                  className="mt-0.5 text-muted-foreground"
                />

                <div>

                  <p className="text-xs text-muted-foreground">
                    Email
                  </p>

                  <p className="break-all text-sm font-medium">
                    {patient.email ||
                      '-'}
                  </p>

                </div>

              </div>


              <div className="flex items-start gap-3">

                <MapPin
                  size={17}
                  className="mt-0.5 text-muted-foreground"
                />

                <div>

                  <p className="text-xs text-muted-foreground">
                    Address
                  </p>

                  <p className="text-sm font-medium">
                    {patient.address ||
                      '-'}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* -------------------------------------------------- */}
        {/* EMERGENCY CONTACT + MEDICAL INFO */}
        {/* -------------------------------------------------- */}

        <div className="grid gap-6 md:grid-cols-2">


          {/* EMERGENCY CONTACT */}

          <div className="rounded-xl border bg-card p-6">

            <div className="mb-5 flex items-center gap-2">

              <Phone
                size={19}
                className="text-primary"
              />

              <h2 className="text-xl font-semibold">
                Emergency Contact
              </h2>

            </div>


            <div className="space-y-4">

              <div>

                <p className="text-xs text-muted-foreground">
                  Contact Name
                </p>

                <p className="mt-1 text-sm font-medium">
                  {patient.emergencyContactName ||
                    '-'}
                </p>

              </div>


              <div>

                <p className="text-xs text-muted-foreground">
                  Contact Number
                </p>

                <p className="mt-1 text-sm font-medium">
                  {patient.emergencyContactNumber ||
                    '-'}
                </p>

              </div>

            </div>

          </div>


          {/* MEDICAL INFORMATION */}

          <div className="rounded-xl border bg-card p-6">

            <div className="mb-5 flex items-center gap-2">

              <Heart
                size={19}
                className="text-primary"
              />

              <h2 className="text-xl font-semibold">
                Medical Information
              </h2>

            </div>


            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-muted-foreground">
                  Blood Group
                </span>

                <strong>
                  {patient.bloodGroup ||
                    '-'}
                </strong>

              </div>


              <div className="flex items-center justify-between">

                <span className="text-muted-foreground">
                  Last Visit
                </span>

                <strong>
                  {lastVisit
                    ? formatDate(
                        lastVisit.appointmentDate
                      )
                    : 'No visit found'}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* -------------------------------------------------- */}
        {/* APPOINTMENT HISTORY */}
        {/* -------------------------------------------------- */}

        <div className="rounded-xl border bg-card p-6">

          <div className="mb-5 flex items-center gap-2">

            <Calendar
              size={19}
              className="text-primary"
            />

            <h2 className="text-xl font-semibold">
              Appointment History
            </h2>

          </div>


          {appointments.length === 0 ? (

            <div className="rounded-lg border border-dashed p-8 text-center">

              <Calendar
                size={25}
                className="mx-auto text-muted-foreground"
              />

              <p className="mt-3 text-sm text-muted-foreground">
                No appointments found for this patient.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {appointments.map(
                (appointment) => (

                  <div
                    key={
                      appointment.id
                    }
                    className="rounded-lg border p-4 transition hover:bg-muted/20"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="font-semibold">

                          {formatDate(
                            appointment.appointmentDate
                          )}

                        </p>


                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">

                          <Clock
                            size={14}
                          />

                          {formatTime(
                            appointment.appointmentTime
                          )}

                        </div>


                        <p className="mt-2 text-sm">

                          {appointment.reason ||
                            'Appointment'}

                        </p>

                      </div>


                      <div className="flex items-center gap-2">

                        <CheckCircle2
                          size={16}
                          className="text-positive"
                        />

                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">

                          {appointment.status}

                        </span>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* -------------------------------------------------- */}
        {/* PRESCRIPTION HISTORY */}
        {/* -------------------------------------------------- */}

        <div className="rounded-xl border bg-card p-6">

          <div className="mb-5 flex items-center gap-2">

            <FileText
              size={19}
              className="text-primary"
            />

            <h2 className="text-xl font-semibold">
              Prescription History
            </h2>

          </div>


          {prescriptions.length === 0 ? (

            <div className="rounded-lg border border-dashed p-8 text-center">

              <FileText
                size={25}
                className="mx-auto text-muted-foreground"
              />

              <p className="mt-3 text-sm text-muted-foreground">
                No prescriptions available for this patient.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {prescriptions.map(
                (prescription) => (

                  <div
                    key={
                      prescription.id
                    }
                    className="rounded-lg border p-5"
                  >

                    <div className="grid gap-4 md:grid-cols-2">


                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Diagnosis
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {prescription.diagnosis ||
                            '-'}
                        </p>

                      </div>


                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Follow-up
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {formatDate(
                            prescription.followUpDate
                          )}
                        </p>

                      </div>


                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Medicines
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm">
                          {prescription.medicines ||
                            '-'}
                        </p>

                      </div>


                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Instructions
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm">
                          {prescription.instructions ||
                            '-'}
                        </p>

                      </div>

                    </div>


                    <div className="mt-4 border-t pt-4">

                      <Link
                        href={`/doctor-dashboard/prescriptions/${prescription.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >

                        <FileText
                          size={15}
                        />

                        View Prescription

                      </Link>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </AppLayout>

  );
}