'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CalendarDays,
  Clock,
  Loader2,
  UserRound,
  Building2,
  FileText,
  User,
} from 'lucide-react';

import { toast } from 'sonner';

import doctorService from '@/services/doctorService';
import departmentService from '@/services/departmentService';
import appointmentService from '@/services/appointmentService';
import patientService from '@/services/patientService';

import { useAuth } from '@/context/AuthContext';

import type { Doctor } from '@/types/Doctor';
import type { Department } from '@/types/Department';
import type { Patient } from '@/types/Patient';

/*
 * ============================================================
 * PATIENT BOOKING FORM
 * ============================================================
 *
 * Patient appointment booking.
 *
 * IMPORTANT:
 *
 * The patient is automatically identified from AuthContext.
 *
 * Flow:
 *
 * Logged-in User
 *      ↓
 * Current User Profile
 *      ↓
 * Match Patient using email
 *      ↓
 * Patient ID obtained automatically
 *      ↓
 * Department
 *      ↓
 * Doctor
 *      ↓
 * Appointment Date
 *      ↓
 * Appointment Time
 *      ↓
 * Reason
 *      ↓
 * Create Appointment
 *
 * There are NO hard-coded booking slots.
 *
 * The patient simply selects a preferred time using
 * the normal HTML time input.
 * ============================================================
 */

export default function BookingForm() {
  /*
   * ==========================================================
   * AUTHENTICATED USER
   * ==========================================================
   */

  const {
    user,
    loading: authLoading,
  } = useAuth();

  /*
   * ==========================================================
   * PATIENT
   * ==========================================================
   */

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [patientLoading, setPatientLoading] =
    useState(true);

  /*
   * ==========================================================
   * DEPARTMENTS
   * ==========================================================
   */

  const [departments, setDepartments] =
    useState<Department[]>([]);

  /*
   * ==========================================================
   * DOCTORS
   * ==========================================================
   */

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  /*
   * ==========================================================
   * FORM STATE
   * ==========================================================
   */

  const [departmentId, setDepartmentId] =
    useState('');

  const [doctorId, setDoctorId] =
    useState('');

  const [appointmentDate, setAppointmentDate] =
    useState('');

  const [appointmentTime, setAppointmentTime] =
    useState('');

  const [reason, setReason] =
    useState('');

  const [notes, setNotes] =
    useState('');

  /*
   * ==========================================================
   * LOADING STATE
   * ==========================================================
   */

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  const [loadingDoctors, setLoadingDoctors] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  /*
   * ==========================================================
   * LOAD LOGGED-IN PATIENT
   * ==========================================================
   *
   * We do NOT use localStorage for patientId.
   *
   * AuthContext already knows the logged-in user.
   *
   * We load the patient list and identify the patient
   * using the authenticated user's email.
   *
   * This avoids asking the patient to login again.
   * ==========================================================
   */

    useEffect(() => {
  let mounted = true;

  async function loadLoggedInPatient() {

    // Wait until authentication is finished
    if (authLoading) {
      return;
    }

    // No logged-in user
    if (!user) {

      if (mounted) {
        setPatient(null);
        setPatientLoading(false);
      }

      return;
    }

    try {

      setPatientLoading(true);

      console.log(
        '===================================='
      );

      console.log(
        'BookingForm - Current User:',
        user
      );

      console.log(
        'BookingForm - Patient ID:',
        user.patientId
      );

      console.log(
        '===================================='
      );

      // ----------------------------------------------------
      // PATIENT ID MUST COME FROM SPRING BOOT USER PROFILE
      // ----------------------------------------------------

      if (!user.patientId) {

        console.error(
          'Patient ID is NULL in current user profile:',
          user
        );

        if (mounted) {

          setPatient(null);

          toast.error(
            'Patient profile not found. Please contact the receptionist or administrator.'
          );

          setPatientLoading(false);
        }

        return;
      }

      // ----------------------------------------------------
      // GET PATIENT FROM ASP.NET BUSINESS API
      // ----------------------------------------------------

      console.log(
        'Loading patient from .NET using patientId:',
        user.patientId
      );

      const patientData =
        await patientService.getPatientById(
          user.patientId
        );

      if (!mounted) {
        return;
      }

      // ----------------------------------------------------
      // PATIENT NOT FOUND
      // ----------------------------------------------------

      if (!patientData) {

        console.error(
          'No patient found in .NET Business API for patientId:',
          user.patientId
        );

        setPatient(null);

        toast.error(
          'Patient profile not found in the healthcare system.'
        );

        return;
      }

      // ----------------------------------------------------
      // SUCCESS
      // ----------------------------------------------------

      console.log(
        'Patient loaded successfully:',
        patientData
      );

      setPatient(patientData);

    } catch (error: any) {

      console.error(
        'Failed to load logged-in patient:',
        error
      );

      if (mounted) {

        setPatient(null);

        const message =
          error?.response?.data?.message ||
          error?.response?.data?.title ||
          'Failed to load your patient profile.';

        toast.error(message);
      }

    } finally {

      if (mounted) {
        setPatientLoading(false);
      }
    }
  }

  loadLoggedInPatient();

  return () => {
    mounted = false;
  };

}, [user, authLoading]);

  /*
   * ==========================================================
   * LOAD DEPARTMENTS
   * ==========================================================
   */

  useEffect(() => {
    let mounted = true;

    async function loadDepartments() {
      try {
        setLoadingDepartments(true);

        const data =
          await departmentService.getDepartments();

        if (!mounted) {
          return;
        }

        setDepartments(
          data || []
        );
      } catch (error) {
        console.error(
          'Failed to load departments:',
          error
        );

        if (mounted) {
          toast.error(
            'Failed to load departments.'
          );
        }
      } finally {
        if (mounted) {
          setLoadingDepartments(false);
        }
      }
    }

    loadDepartments();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ==========================================================
   * LOAD DOCTORS WHEN DEPARTMENT CHANGES
   * ==========================================================
   */

  useEffect(() => {
    let mounted = true;

    async function loadDoctors() {
      if (!departmentId) {
        setDoctors([]);
        return;
      }

      try {
        setLoadingDoctors(true);

        const data =
          await doctorService.getDoctorsByDepartment(
            departmentId
          );

        if (!mounted) {
          return;
        }

        setDoctors(
          data || []
        );
      } catch (error) {
        console.error(
          'Failed to load doctors:',
          error
        );

        if (mounted) {
          setDoctors([]);

          toast.error(
            'Failed to load doctors.'
          );
        }
      } finally {
        if (mounted) {
          setLoadingDoctors(false);
        }
      }
    }

    loadDoctors();

    return () => {
      mounted = false;
    };
  }, [departmentId]);

  /*
   * ==========================================================
   * SELECTED DOCTOR
   * ==========================================================
   */

  const selectedDoctor =
    useMemo(() => {
      return doctors.find(
        (doctor) =>
          doctor.id === doctorId
      );
    }, [
      doctors,
      doctorId,
    ]);

  /*
   * ==========================================================
   * SELECTED DEPARTMENT
   * ==========================================================
   */

  const selectedDepartment =
    useMemo(() => {
      return departments.find(
        (department) =>
          department.id ===
          departmentId
      );
    }, [
      departments,
      departmentId,
    ]);

  /*
   * ==========================================================
   * DOCTOR NAME
   * ==========================================================
   */

  function getDoctorName(
    doctor: Doctor
  ) {
    const name =
      `${doctor.firstName || ''} ${
        doctor.lastName || ''
      }`.trim();

    return (
      name || 'Doctor'
    );
  }

  /*
   * ==========================================================
   * PATIENT NAME
   * ==========================================================
   */

  function getPatientName(
    currentPatient: Patient
  ) {
    const name =
      `${currentPatient.firstName || ''} ${
        currentPatient.lastName || ''
      }`.trim();

    return (
      name || 'Patient'
    );
  }

  /*
   * ==========================================================
   * MINIMUM DATE
   * ==========================================================
   */

  const minimumDate =
    new Date()
      .toISOString()
      .split('T')[0];

  /*
   * ==========================================================
   * HANDLE DEPARTMENT CHANGE
   * ==========================================================
   */

  function handleDepartmentChange(
    value: string
  ) {
    setDepartmentId(value);

    /*
     * Doctor must be re-selected when
     * department changes.
     */

    setDoctorId('');

    setDoctors([]);
  }

  /*
   * ==========================================================
   * HANDLE SUBMIT
   * ==========================================================
   */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    /*
     * --------------------------------------------------------
     * PATIENT VALIDATION
     * --------------------------------------------------------
     */

    if (!patient) {
      toast.error(
        'Unable to identify your patient profile.'
      );

      return;
    }

    /*
     * --------------------------------------------------------
     * DEPARTMENT VALIDATION
     * --------------------------------------------------------
     */

    if (!departmentId) {
      toast.error(
        'Please select a department.'
      );

      return;
    }

    /*
     * --------------------------------------------------------
     * DOCTOR VALIDATION
     * --------------------------------------------------------
     */

    if (!doctorId) {
      toast.error(
        'Please select a doctor.'
      );

      return;
    }

    /*
     * --------------------------------------------------------
     * DATE VALIDATION
     * --------------------------------------------------------
     */

    if (!appointmentDate) {
      toast.error(
        'Please select an appointment date.'
      );

      return;
    }

    /*
     * --------------------------------------------------------
     * TIME VALIDATION
     * --------------------------------------------------------
     */

    if (!appointmentTime) {
      toast.error(
        'Please select an appointment time.'
      );

      return;
    }

    /*
     * --------------------------------------------------------
     * REASON VALIDATION
     * --------------------------------------------------------
     */

    if (!reason.trim()) {
      toast.error(
        'Please enter the reason for your visit.'
      );

      return;
    }

    /*
     * --------------------------------------------------------
     * DOCTOR VALIDATION
     * --------------------------------------------------------
     */

    if (!selectedDoctor) {
      toast.error(
        'Selected doctor could not be found.'
      );

      return;
    }

    /*
     * --------------------------------------------------------
     * CREATE APPOINTMENT
     * --------------------------------------------------------
     *
     * IMPORTANT:
     *
     * patient.id comes from the actual Patient record.
     *
     * We no longer try to read patientId from localStorage.
     * --------------------------------------------------------
     */

    try {
      setSubmitting(true);

      await appointmentService.createAppointment(
        {
          patientId:
            patient.id,

          doctorId,

          appointmentDate,

          appointmentTime:
            appointmentTime.length === 5
              ? `${appointmentTime}:00`
              : appointmentTime,

          reason:
            reason.trim(),

          /*
           * Notes are optional.
           *
           * If your current CreateAppointmentRequest
           * does not accept notes, remove this property.
           */
          ...(notes.trim()
            ? {
                notes:
                  notes.trim(),
              }
            : {}),
        }
      );

      /*
       * ------------------------------------------------------
       * SUCCESS
       * ------------------------------------------------------
       */

      toast.success(
        'Appointment booked successfully.'
      );

      /*
       * ------------------------------------------------------
       * RESET FORM
       * ------------------------------------------------------
       */

      setDepartmentId('');

      setDoctorId('');

      setDoctors([]);

      setAppointmentDate('');

      setAppointmentTime('');

      setReason('');

      setNotes('');
    } catch (error) {
      console.error(
        'Failed to create appointment:',
        error
      );

      toast.error(
        'Failed to book appointment. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * ==========================================================
   * LOADING SCREEN
   * ==========================================================
   */

  if (
    authLoading ||
    patientLoading
  ) {
    return (
      <div
        className="
          rounded-xl
          border
          bg-card
          p-8
          flex
          flex-col
          items-center
          justify-center
          gap-3
          text-center
        "
      >
        <Loader2
          size={28}
          className="
            animate-spin
            text-cyan-700
          "
        />

        <p className="font-medium">
          Loading your patient profile...
        </p>

        <p className="text-sm text-muted-foreground">
          Please wait while we prepare your appointment form.
        </p>
      </div>
    );
  }

  /*
   * ==========================================================
   * PATIENT NOT FOUND
   * ==========================================================
   */

  if (!patient) {
    return (
      <div
        className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-6
        "
      >
        <div className="flex items-start gap-3">
          <UserRound
            size={22}
            className="
              mt-0.5
              shrink-0
              text-red-600
            "
          />

          <div>
            <h3
              className="
                font-semibold
                text-red-800
              "
            >
              Patient profile not found
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-red-700
              "
            >
              We could not match your logged-in
              account with a patient record.
            </p>

            <p
              className="
                mt-2
                text-xs
                text-red-600
              "
            >
              Please contact the receptionist
              or administrator to verify your
              patient profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-xl
        border
        bg-card
        p-6
        space-y-6
      "
    >

      {/* =====================================================
          LOGGED-IN PATIENT
      ===================================================== */}

      <div
        className="
          rounded-xl
          border
          border-cyan-200
          bg-cyan-50
          p-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-cyan-700
              text-white
            "
          >
            <User
              size={20}
            />
          </div>

          <div>
            <p
              className="
                text-xs
                text-cyan-700
              "
            >
              Booking appointment for
            </p>

            <p
              className="
                font-semibold
                text-cyan-900
              "
            >
              {getPatientName(
                patient
              )}
            </p>

            <p
              className="
                text-xs
                text-cyan-700
              "
            >
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          DEPARTMENT
      ===================================================== */}

      <div>
        <label
          htmlFor="department"
          className="
            block
            text-sm
            font-semibold
            mb-2
          "
        >
          Department
        </label>

        <div className="relative">
          <Building2
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
              pointer-events-none
            "
          />

          <select
            id="department"
            value={departmentId}
            onChange={(event) =>
              handleDepartmentChange(
                event.target.value
              )
            }
            disabled={
              loadingDepartments ||
              submitting
            }
            className="
              w-full
              rounded-lg
              border
              bg-background
              pl-10
              pr-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-cyan-600
              disabled:opacity-60
            "
          >
            <option value="">
              {loadingDepartments
                ? 'Loading Departments...'
                : 'Select Department'}
            </option>

            {departments.map(
              (department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* =====================================================
          DOCTOR
      ===================================================== */}

      <div>
        <label
          htmlFor="doctor"
          className="
            block
            text-sm
            font-semibold
            mb-2
          "
        >
          Doctor
        </label>

        <div className="relative">
          <UserRound
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
              pointer-events-none
            "
          />

          <select
            id="doctor"
            value={doctorId}
            onChange={(event) =>
              setDoctorId(
                event.target.value
              )
            }
            disabled={
              !departmentId ||
              loadingDoctors ||
              submitting
            }
            className="
              w-full
              rounded-lg
              border
              bg-background
              pl-10
              pr-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-cyan-600
              disabled:opacity-60
            "
          >
            <option value="">
              {!departmentId
                ? 'Select Department First'
                : loadingDoctors
                ? 'Loading Doctors...'
                : doctors.length === 0
                ? 'No Doctors Found'
                : 'Select Doctor'}
            </option>

            {doctors.map(
              (doctor) => (
                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  {getDoctorName(
                    doctor
                  )}
                </option>
              )
            )}
          </select>
        </div>

        {selectedDoctor && (
          <div
            className="
              mt-2
              text-xs
              text-muted-foreground
            "
          >
            {selectedDoctor.specialization && (
              <span>
                {selectedDoctor.specialization}
              </span>
            )}

            {selectedDoctor.roomNumber && (
              <span>
                {' • '}
                {selectedDoctor.roomNumber}
              </span>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          DATE
      ===================================================== */}

      <div>
        <label
          htmlFor="appointmentDate"
          className="
            block
            text-sm
            font-semibold
            mb-2
          "
        >
          Appointment Date
        </label>

        <div className="relative">
          <CalendarDays
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
              pointer-events-none
            "
          />

          <input
            id="appointmentDate"
            type="date"
            value={appointmentDate}
            min={minimumDate}
            onChange={(event) =>
              setAppointmentDate(
                event.target.value
              )
            }
            disabled={submitting}
            className="
              w-full
              rounded-lg
              border
              bg-background
              pl-10
              pr-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-cyan-600
              disabled:opacity-60
            "
          />
        </div>
      </div>

      {/* =====================================================
          TIME
      ===================================================== */}

      <div>
        <label
          htmlFor="appointmentTime"
          className="
            block
            text-sm
            font-semibold
            mb-2
          "
        >
          Appointment Time
        </label>

        <div className="relative">
          <Clock
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
              pointer-events-none
            "
          />

          <input
            id="appointmentTime"
            type="time"
            value={appointmentTime}
            onChange={(event) =>
              setAppointmentTime(
                event.target.value
              )
            }
            disabled={submitting}
            className="
              w-full
              rounded-lg
              border
              bg-background
              pl-10
              pr-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-cyan-600
              disabled:opacity-60
            "
          />
        </div>

        <p
          className="
            mt-2
            text-xs
            text-muted-foreground
          "
        >
          Select your preferred appointment time.
          The receptionist or doctor can adjust the
          appointment later if required.
        </p>
      </div>

      {/* =====================================================
          REASON
      ===================================================== */}

      <div>
        <label
          htmlFor="reason"
          className="
            block
            text-sm
            font-semibold
            mb-2
          "
        >
          Reason For Visit
        </label>

        <div className="relative">
          <FileText
            size={18}
            className="
              absolute
              left-3
              top-3
              text-muted-foreground
              pointer-events-none
            "
          />

          <textarea
            id="reason"
            rows={5}
            value={reason}
            onChange={(event) =>
              setReason(
                event.target.value
              )
            }
            disabled={submitting}
            placeholder="
              Describe your health issue or reason for consultation...
            "
            className="
              w-full
              rounded-lg
              border
              bg-background
              pl-10
              pr-4
              py-3
              resize-none
              outline-none
              focus:ring-2
              focus:ring-cyan-600
              disabled:opacity-60
            "
          />
        </div>
      </div>

      {/* =====================================================
          NOTES
      ===================================================== */}

      <div>
        <label
          htmlFor="notes"
          className="
            block
            text-sm
            font-semibold
            mb-2
          "
        >
          Notes
          <span
            className="
              ml-2
              text-xs
              font-normal
              text-muted-foreground
            "
          >
            Optional
          </span>
        </label>

        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(event) =>
            setNotes(
              event.target.value
            )
          }
          disabled={submitting}
          placeholder="
            Add any additional information for the clinic...
          "
          className="
            w-full
            rounded-lg
            border
            bg-background
            px-4
            py-3
            resize-none
            outline-none
            focus:ring-2
            focus:ring-cyan-600
            disabled:opacity-60
          "
        />
      </div>

      {/* =====================================================
          APPOINTMENT SUMMARY
      ===================================================== */}

      {(
        departmentId ||
        doctorId ||
        appointmentDate ||
        appointmentTime
      ) && (
        <div
          className="
            rounded-xl
            bg-cyan-50
            border
            border-cyan-200
            p-5
          "
        >
          <h3
            className="
              font-semibold
              text-cyan-800
              mb-4
            "
          >
            Appointment Summary
          </h3>

          <div
            className="
              space-y-3
              text-sm
            "
          >

            {/* PATIENT */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <User
                size={17}
                className="
                  text-cyan-700
                  shrink-0
                "
              />

              <div>
                <p
                  className="
                    text-xs
                    text-cyan-700
                  "
                >
                  Patient
                </p>

                <p
                  className="
                    font-medium
                    text-cyan-900
                  "
                >
                  {getPatientName(
                    patient
                  )}
                </p>
              </div>
            </div>

            {/* DEPARTMENT */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Building2
                size={17}
                className="
                  text-cyan-700
                  shrink-0
                "
              />

              <div>
                <p
                  className="
                    text-xs
                    text-cyan-700
                  "
                >
                  Department
                </p>

                <p
                  className="
                    font-medium
                    text-cyan-900
                  "
                >
                  {selectedDepartment?.name ||
                    'Not selected'}
                </p>
              </div>
            </div>

            {/* DOCTOR */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <UserRound
                size={17}
                className="
                  text-cyan-700
                  shrink-0
                "
              />

              <div>
                <p
                  className="
                    text-xs
                    text-cyan-700
                  "
                >
                  Doctor
                </p>

                <p
                  className="
                    font-medium
                    text-cyan-900
                  "
                >
                  {selectedDoctor
                    ? getDoctorName(
                        selectedDoctor
                      )
                    : 'Not selected'}
                </p>
              </div>
            </div>

            {/* DATE */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <CalendarDays
                size={17}
                className="
                  text-cyan-700
                  shrink-0
                "
              />

              <div>
                <p
                  className="
                    text-xs
                    text-cyan-700
                  "
                >
                  Date
                </p>

                <p
                  className="
                    font-medium
                    text-cyan-900
                  "
                >
                  {appointmentDate ||
                    'Not selected'}
                </p>
              </div>
            </div>

            {/* TIME */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Clock
                size={17}
                className="
                  text-cyan-700
                  shrink-0
                "
              />

              <div>
                <p
                  className="
                    text-xs
                    text-cyan-700
                  "
                >
                  Time
                </p>

                <p
                  className="
                    font-medium
                    text-cyan-900
                  "
                >
                  {appointmentTime ||
                    'Not selected'}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          CONFIRM BUTTON
      ===================================================== */}

      <button
        type="submit"
        disabled={
          submitting ||
          patientLoading ||
          !patient
        }
        className="
          w-full
          rounded-lg
          bg-cyan-700
          py-3
          font-semibold
          text-white
          hover:bg-cyan-800
          transition
          disabled:opacity-60
          disabled:cursor-not-allowed
          flex
          items-center
          justify-center
          gap-2
        "
      >
        {submitting ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />

            Booking Appointment...
          </>
        ) : (
          'Confirm Appointment'
        )}
      </button>

      {/* =====================================================
          FOOTNOTE
      ===================================================== */}

      <p
        className="
          text-center
          text-xs
          text-muted-foreground
        "
      >
        Please verify the doctor, date and time
        before confirming your appointment.
      </p>
    </form>
  );
}