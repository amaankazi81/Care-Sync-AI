'use client';

import React from 'react';
import Link from 'next/link';

import {
  UserPlus,
  CalendarPlus,
  Stethoscope,
  ClipboardList,
  Search,
} from 'lucide-react';

const actions = [
  {
    id: 'register-patient',
    title: 'Register Patient',
    description: 'Create new patient profile',
    icon: <UserPlus size={20} />,
    href: '/receptionist-dashboard/register',
  },

  {
    id: 'book-appointment',
    title: 'Book Appointment',
    description: 'Schedule patient visit',
    icon: <CalendarPlus size={20} />,
    href: '/receptionist-dashboard/appointments/new',
  },

  {
    id: 'doctor-schedule',
    title: 'Doctor Schedule',
    description: 'Manage doctor availability',
    icon: <Stethoscope size={20} />,
    href: '/receptionist-dashboard/doctor-schedule',
  },

  {
    id: 'view-appointments',
    title: 'Appointments',
    description: "Check today's bookings",
    icon: <ClipboardList size={20} />,
    href: '/receptionist-dashboard/appointments',
  },

  {
    id: 'search-patient',
    title: 'Search Patient',
    description: 'Find patient records quickly',
    icon: <Search size={20} />,
    href: '/receptionist-dashboard/patients',
  },
];

export default function ReceptionistQuickActions() {
  return (
    <div className="w-full rounded-xl border border-border bg-card shadow-card">
      {/* Header */}

      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">
          Quick Actions
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Frequently used receptionist operations
        </p>
      </div>

      {/* Actions */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          p-5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
        "
      >
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="
              group
              flex
              min-h-[82px]
              items-center
              gap-3
              rounded-xl
              border
              border-border
              bg-background
              p-4
              text-left
              transition
              hover:bg-muted/40
              hover:shadow-sm
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-primary/10
                text-primary
                transition
                group-hover:bg-primary
                group-hover:text-white
              "
            >
              {action.icon}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {action.title}
              </p>

              <p className="mt-1 text-xs leading-4 text-muted-foreground">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}