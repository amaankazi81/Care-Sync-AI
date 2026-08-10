'use client';

import { Eye, Calendar, Clock } from 'lucide-react';

import { Appointment } from '@/types/Appointment';

import AppointmentStatusBadge from '@/components/appointments/AppointmentStatusBadge';

interface Props {
  appointments: Appointment[];

  onView?: (id: string) => void;
}

export default function DoctorAppointmentTable({
  appointments,

  onView,
}: Props) {
  return (
    <div
      className="
rounded-xl
border
bg-card
overflow-hidden
"
    >
      <table
        className="
w-full
"
      >
        <thead
          className="
bg-muted
"
        >
          <tr>
            <th className="px-5 py-4 text-left">Patient</th>

            <th className="px-5 py-4 text-left">Date</th>

            <th className="px-5 py-4 text-left">Time</th>

            <th className="px-5 py-4 text-left">Department</th>

            <th className="px-5 py-4 text-left">Status</th>

            <th className="px-5 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr
              key={appointment.id}

              className="
border-t
hover:bg-muted/40
"
            >
              <td
                className="
px-5
py-4
font-medium
"
              >
                {appointment.patientName}
              </td>

              <td className="px-5 py-4">
                <div
                  className="
flex
items-center
gap-2
"
                >
                  <Calendar size={16} />

                  {appointment.appointmentDate}
                </div>
              </td>

              <td className="px-5 py-4">
                <div
                  className="
flex
items-center
gap-2
"
                >
                  <Clock size={16} />

                  {appointment.appointmentTime}
                </div>
              </td>

              <td className="px-5 py-4">{appointment.department}</td>

              <td className="px-5 py-4">
                <AppointmentStatusBadge status={appointment.status} />
              </td>

              <td
                className="
px-5
py-4
text-center
"
              >
                <button
                  onClick={() => onView?.(appointment.id)}

                  className="
rounded-lg
border
p-2
hover:bg-blue-50
"
                >
                  <Eye
                    size={18}

                    className="text-blue-600"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
