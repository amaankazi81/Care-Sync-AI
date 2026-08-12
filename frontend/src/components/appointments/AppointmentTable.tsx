'use client';

import Link from 'next/link';
import {
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import appointmentService from '@/services/appointmentService';
import { Appointment } from '@/types/Appointment';
import AppointmentStatusDropdown from '@/components/appointments/AppointmentStatusDropdown';

interface Props {
  appointments: Appointment[];

  /*
   * Optional props used by receptionist dashboard.
   *
   * They are optional so existing pages which only provide
   * appointments continue to work exactly as before.
   */

  loading?: boolean;

  onView?: (id: string) => void;

  onEdit?: (id: string) => void;

  onCancel?: (
    id: string
  ) => void | Promise<void>;
}

export default function AppointmentTable({
  appointments,
  loading = false,
  onView,
  onEdit,
  onCancel,
}: Props) {
  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        <Loader2
          size={28}
          className="mx-auto animate-spin text-blue-600"
        />

        <p className="mt-3 text-sm text-slate-500">
          Loading appointments...
        </p>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * DELETE
   * ---------------------------------------------------------
   *
   * This is kept for existing pages which do not provide
   * onCancel.
   */

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this appointment?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await appointmentService.deleteAppointment(id);

      toast.success(
        'Appointment deleted successfully.'
      );

      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error(
        'Unable to delete appointment.'
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * EMPTY STATE
   * ---------------------------------------------------------
   */

  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        <h3 className="text-lg font-semibold">
          No appointments found
        </h3>

        <p className="mt-2 text-slate-500">
          Book your first appointment.
        </p>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * TABLE
   * ---------------------------------------------------------
   */

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-5 py-4">
                Appointment
              </th>

              <th className="px-5 py-4">
                Patient
              </th>

              <th className="px-5 py-4">
                Doctor
              </th>

              <th className="px-5 py-4">
                Date & Time
              </th>

              <th className="px-5 py-4">
                Status
              </th>

              <th className="px-5 py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {appointments.map(
              (appointment) => (
                <tr
                  key={appointment.id}
                  className="border-t"
                >
                  {/* APPOINTMENT */}

                  <td className="px-5 py-4">
                    <p className="font-semibold">
                      {appointment.appointmentNumber}
                    </p>

                    <p className="text-sm text-slate-500">
                      {appointment.department ??
                        'Department Not Assigned'}
                    </p>
                  </td>

                  {/* PATIENT */}

                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {appointment.patientName ??
                        'Unknown Patient'}
                    </p>

                    <p className="text-sm text-slate-500">
                      {appointment.patientId}
                    </p>
                  </td>

                  {/* DOCTOR */}

                  <td className="px-5 py-4">
                    {appointment.doctorName ??
                      'Unknown Doctor'}
                  </td>

                  {/* DATE & TIME */}

                  <td className="px-5 py-4">
                    <p>
                      {appointment.appointmentDate}
                    </p>

                    <p className="text-sm text-slate-500">
                      {appointment.appointmentTime}
                    </p>
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">
                    <AppointmentStatusDropdown
                      appointment={appointment}
                      onUpdated={() =>
                        window.location.reload()
                      }
                    />
                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">
                    <div className="flex gap-4">
                      {/* VIEW */}

                      {onView ? (
                        <button
                          type="button"
                          onClick={() =>
                            onView(
                              appointment.id
                            )
                          }
                          title="View appointment"
                        >
                          <Eye
                            size={18}
                            className="text-cyan-700"
                          />
                        </button>
                      ) : (
                        <Link
                          href={`/admin-dashboard/appointments/${appointment.id}`}
                          title="View appointment"
                        >
                          <Eye
                            size={18}
                            className="text-cyan-700"
                          />
                        </Link>
                      )}

                      {/* EDIT */}

                      {onEdit ? (
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              appointment.id
                            )
                          }
                          title="Edit appointment"
                        >
                          <Pencil
                            size={18}
                            className="text-amber-600"
                          />
                        </button>
                      ) : (
                        <Link
                          href={`/admin-dashboard/appointments/${appointment.id}/edit`}
                          title="Edit appointment"
                        >
                          <Pencil
                            size={18}
                            className="text-amber-600"
                          />
                        </Link>
                      )}

                      {/* CANCEL / DELETE */}

                      {onCancel ? (
                        <button
                          type="button"
                          onClick={() =>
                            onCancel(
                              appointment.id
                            )
                          }
                          title="Cancel appointment"
                        >
                          <Trash2
                            size={18}
                            className="text-red-600"
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              appointment.id
                            )
                          }
                          title="Delete appointment"
                        >
                          <Trash2
                            size={18}
                            className="text-red-600"
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}