'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  FileText,
  Eye,
  Pencil,
  XCircle,
} from 'lucide-react';

import { Appointment } from '@/types/Appointment';
import AppointmentStatusBadge from './AppointmentStatusBadge';

interface AppointmentCardProps {
  appointment: Appointment;

  onView?: (appointment: Appointment) => void;

  onEdit?: (appointment: Appointment) => void;

  onCancel?: (appointment: Appointment) => void;

  showActions?: boolean;
}

export default function AppointmentCard({
  appointment,
  onView,
  onEdit,
  onCancel,
  showActions = true,
}: AppointmentCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="font-semibold text-foreground">{appointment.patientName}</h3>

          <p className="text-xs text-muted-foreground">{appointment.appointmentNumber}</p>
        </div>

        <AppointmentStatusBadge status={appointment.status} />
      </div>

      {/* Body */}

      <div className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">Appointment Date</p>

              <p className="font-medium">{appointment.appointmentDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock size={18} className="text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">Appointment Time</p>

              <p className="font-medium">{appointment.appointmentTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Stethoscope size={18} className="text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">Doctor</p>

              <p className="font-medium">{appointment.doctorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">Department</p>

              <p className="font-medium">{appointment.department}</p>
            </div>
          </div>
        </div>

        {/* Reason */}

        <div className="rounded-lg bg-muted/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-primary" />

            <h4 className="font-medium">Reason for Visit</h4>
          </div>

          <p className="text-sm text-muted-foreground">{appointment.reason}</p>

          {appointment.notes && (
            <div className="mt-3">
              <p className="text-xs font-medium text-foreground">Notes</p>

              <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}

      {showActions && (
        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button
            onClick={() => onView?.(appointment)}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition"
          >
            <Eye size={16} />
            View
          </button>

          <button
            onClick={() => onEdit?.(appointment)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={() => onCancel?.(appointment)}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
          >
            <XCircle size={16} />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
