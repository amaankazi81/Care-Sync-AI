'use client';

import { useEffect, useState } from 'react';

import patientService from '@/services/patientService';
import doctorService from '@/services/doctorService';
import departmentService from '@/services/departmentService';

import { Patient } from '@/types/Patient';
import { Doctor } from '@/types/Doctor';
import { Department } from '@/types/Department';

interface AppointmentFormProps {
  initialValues?: {
    patientId?: string;
    doctorId?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    reason?: string;
    notes?: string;
    status?: string;
  };

  isEdit?: boolean;

  onSubmit: (data: any) => void | Promise<void>;
}

export default function AppointmentForm({
  initialValues,
  isEdit = false,
  onSubmit,
}: AppointmentFormProps) {
  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [patientId, setPatientId] =
    useState(
      initialValues?.patientId ?? ''
    );

  const [doctorId, setDoctorId] =
    useState(
      initialValues?.doctorId ?? ''
    );

  const [appointmentDate, setAppointmentDate] =
    useState(
      initialValues?.appointmentDate ?? ''
    );

  const [appointmentTime, setAppointmentTime] =
    useState(
      initialValues?.appointmentTime ?? ''
    );

  const [reason, setReason] =
    useState(
      initialValues?.reason ?? ''
    );

  const [notes, setNotes] =
    useState(
      initialValues?.notes ?? ''
    );

  const [status, setStatus] =
    useState(
      initialValues?.status ?? 'BOOKED'
    );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [
        patientData,
        doctorData,
        departmentData,
      ] = await Promise.all([
        patientService.getPatients(),
        doctorService.getDoctors(),
        departmentService.getDepartments(),
      ]);

      setPatients(patientData);
      setDoctors(doctorData);
      setDepartments(departmentData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    /*
     * EDIT MODE
     *
     * Backend PATCH accepts ONLY:
     *
     * appointmentDate
     * appointmentTime
     * status
     * notes
     *
     * Therefore do not send:
     * patientId
     * doctorId
     * reason
     *
     * during edit.
     */

    if (isEdit) {
      if (
        !appointmentDate ||
        !appointmentTime
      ) {
        alert(
          'Please fill all required fields.'
        );

        return;
      }

      onSubmit({
        appointmentDate,

        appointmentTime:
          appointmentTime.length === 5
            ? `${appointmentTime}:00`
            : appointmentTime,

        status,

        notes,
      });

      return;
    }

    /*
     * CREATE MODE
     *
     * Keep the existing create behavior.
     */

    if (
      !patientId ||
      !doctorId ||
      !appointmentDate ||
      !appointmentTime ||
      !reason
    ) {
      alert(
        'Please fill all required fields.'
      );

      return;
    }

    onSubmit({
      patientId,

      doctorId,

      appointmentDate,

      appointmentTime:
        appointmentTime.length === 5
          ? `${appointmentTime}:00`
          : appointmentTime,

      reason,

      notes,

      status,
    });
  }

  const selectedDoctor =
    doctors.find(
      (doctor) =>
        doctor.id === doctorId
    );

  const selectedDepartment =
    departments.find(
      (department) =>
        department.id ===
        selectedDoctor?.departmentId
    );

  const selectedPatient =
    patients.find(
      (patient) =>
        patient.id === patientId
    );

  const patientDisplayName =
    selectedPatient
      ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
      : '';

  const doctorDisplayName =
    selectedDoctor
      ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`
      : '';

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
        space-y-6
      "
    >
      {loading ? (
        <div className="py-16 text-center text-slate-500">
          Loading appointment data...
        </div>
      ) : (
        <>
          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >

            {/* ===================================== */}
            {/* PATIENT */}
            {/* ===================================== */}

            <div>
              <label className="mb-2 block font-medium">
                Patient
              </label>

              {isEdit ? (
                /*
                 * EDIT MODE:
                 * Patient is READ ONLY.
                 */
                <input
                  type="text"
                  value={
                    patientDisplayName ||
                    'Unknown Patient'
                  }
                  readOnly
                  className="
                    w-full
                    rounded-lg
                    border
                    bg-slate-100
                    px-4
                    py-2
                    text-slate-700
                    cursor-not-allowed
                  "
                />
              ) : (
                /*
                 * CREATE MODE:
                 * Patient can be selected.
                 */
                <select
                  value={patientId}
                  onChange={(e) =>
                    setPatientId(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    px-4
                    py-2
                  "
                >
                  <option value="">
                    Select Patient
                  </option>

                  {patients.map(
                    (patient) => (
                      <option
                        key={patient.id}
                        value={patient.id}
                      >
                        {patient.firstName}{' '}
                        {patient.lastName}
                      </option>
                    )
                  )}
                </select>
              )}
            </div>

            {/* ===================================== */}
            {/* DOCTOR */}
            {/* ===================================== */}

            <div>
              <label className="mb-2 block font-medium">
                Doctor
              </label>

              {isEdit ? (
                /*
                 * EDIT MODE:
                 * Doctor is READ ONLY.
                 */
                <input
                  type="text"
                  value={
                    doctorDisplayName ||
                    'Unknown Doctor'
                  }
                  readOnly
                  className="
                    w-full
                    rounded-lg
                    border
                    bg-slate-100
                    px-4
                    py-2
                    text-slate-700
                    cursor-not-allowed
                  "
                />
              ) : (
                /*
                 * CREATE MODE:
                 * Doctor can be selected.
                 */
                <select
                  value={doctorId}
                  onChange={(e) =>
                    setDoctorId(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    px-4
                    py-2
                  "
                >
                  <option value="">
                    Select Doctor
                  </option>

                  {doctors.map(
                    (doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        Dr.{' '}
                        {doctor.firstName}{' '}
                        {doctor.lastName}
                      </option>
                    )
                  )}
                </select>
              )}
            </div>

            {/* ===================================== */}
            {/* DEPARTMENT */}
            {/* ===================================== */}

            <div>
              <label className="mb-2 block font-medium">
                Department
              </label>

              <input
                type="text"
                readOnly
                value={
                  selectedDepartment?.name ??
                  ''
                }
                className="
                  w-full
                  rounded-lg
                  border
                  bg-slate-100
                  px-4
                  py-2
                  cursor-not-allowed
                "
              />
            </div>

            {/* ===================================== */}
            {/* APPOINTMENT DATE */}
            {/* ===================================== */}

            <div>
              <label className="mb-2 block font-medium">
                Appointment Date
              </label>

              <input
                type="date"
                value={appointmentDate}
                onChange={(e) =>
                  setAppointmentDate(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  px-4
                  py-2
                "
              />
            </div>

            {/* ===================================== */}
            {/* APPOINTMENT TIME */}
            {/* ===================================== */}

            <div>
              <label className="mb-2 block font-medium">
                Appointment Time
              </label>

              <input
                type="time"
                value={appointmentTime}
                onChange={(e) =>
                  setAppointmentTime(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  px-4
                  py-2
                "
              />
            </div>

            {/* ===================================== */}
            {/* STATUS */}
            {/* ===================================== */}

            <div>
              <label className="mb-2 block font-medium">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  px-4
                  py-2
                "
              >
                <option value="BOOKED">
                  BOOKED
                </option>

                <option value="CONFIRMED">
                  CONFIRMED
                </option>

                <option value="CHECKED_IN">
                  CHECKED_IN
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>

                <option value="CANCELLED">
                  CANCELLED
                </option>
              </select>
            </div>
          </div>

          {/* ===================================== */}
          {/* REASON */}
          {/* ===================================== */}

          <div>
            <label className="mb-2 block font-medium">
              Reason
            </label>

            <textarea
              rows={4}
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              readOnly={isEdit}
              className="
                w-full
                rounded-lg
                border
                px-4
                py-2
              "
              placeholder="Reason for appointment"
            />

            {isEdit && (
              <p className="mt-1 text-xs text-slate-500">
                Reason cannot be changed while
                editing an appointment.
              </p>
            )}
          </div>

          {/* ===================================== */}
          {/* NOTES */}
          {/* ===================================== */}

          <div>
            <label className="mb-2 block font-medium">
              Notes
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-lg
                border
                px-4
                py-2
              "
              placeholder="Additional Notes (Optional)"
            />
          </div>

          {/* ===================================== */}
          {/* BUTTON */}
          {/* ===================================== */}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="
                rounded-lg
                bg-cyan-700
                px-6
                py-2.5
                font-semibold
                text-white
                transition
                hover:bg-cyan-800
              "
            >
              Save Appointment
            </button>
          </div>
        </>
      )}
    </form>
  );
}