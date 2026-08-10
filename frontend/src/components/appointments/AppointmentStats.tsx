'use client';

import { CalendarDays, CalendarClock, CheckCircle2, XCircle } from 'lucide-react';

import { Appointment } from '@/types/Appointment';

interface AppointmentStatsProps {
  appointments: Appointment[];
}

export default function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const today = new Date().toISOString().split('T')[0];

  const totalAppointments = appointments.length;

  const todayAppointments = appointments.filter(
    (appointment) => appointment.appointmentDate === today
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === 'CONFIRMED'
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === 'CANCELLED'
  ).length;

  const stats = [
    {
      title: 'Total Appointments',
      value: totalAppointments,
      icon: CalendarDays,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: "Today's Appointments",
      value: todayAppointments,
      icon: CalendarClock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      title: 'Confirmed',
      value: confirmedAppointments,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Cancelled',
      value: cancelledAppointments,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>

                <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
              </div>

              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
