'use client';

import React, { useEffect, useMemo, useState } from 'react';

import MetricCard from '@/components/ui/MetricCard';
import { MetricCardSkeleton } from '@/components/ui/LoadingSkeleton';

import {
  CalendarCheck,
  Users,
  Clock,
  UserPlus,
} from 'lucide-react';

import patientService from '@/services/patientService';

import { Patient } from '@/types/Patient';

import { Appointment } from '@/types/Appointment';

interface ReceptionistKPIGridProps {
  appointments: Appointment[];
}

export default function ReceptionistKPIGrid({
  appointments,
}: ReceptionistKPIGridProps) {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [loadingPatients, setLoadingPatients] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPatients() {
      try {
        setLoadingPatients(true);

        const data = await patientService.getPatients();

        if (mounted) {
          setPatients(data);
        }
      } catch (error) {
        console.error(
          'Unable to load patients for receptionist KPIs:',
          error
        );

        if (mounted) {
          setPatients([]);
        }
      } finally {
        if (mounted) {
          setLoadingPatients(false);
        }
      }
    }

    loadPatients();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Get today's date in YYYY-MM-DD format.
   *
   * We compare only the date portion because appointment
   * dates coming from the backend may contain different
   * time formats.
   */
  const today = useMemo(() => {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }, []);

  /*
   * Today's appointments
   */
  const todaysAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (!appointment.appointmentDate) {
        return false;
      }

      return (
        String(appointment.appointmentDate).slice(0, 10) ===
        today
      );
    });
  }, [appointments, today]);

  /*
   * Pending appointments.
   *
   * BOOKED appointments are treated as pending
   * receptionist appointments.
   */
  const pendingAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        String(appointment.status).toUpperCase() ===
        'BOOKED'
    );
  }, [appointments]);

  /*
   * New registrations today.
   *
   * Some versions of the Patient interface may not expose
   * createdAt. Therefore we safely check it at runtime
   * instead of changing the shared Patient type.
   */
  const newRegistrations = useMemo(() => {
    return patients.filter((patient) => {
      const patientWithCreatedAt =
        patient as Patient & {
          createdAt?: string;
        };

      if (!patientWithCreatedAt.createdAt) {
        return false;
      }

      return (
        String(
          patientWithCreatedAt.createdAt
        ).slice(0, 10) === today
      );
    }).length;
  }, [patients, today]);

  const loading =
    loadingPatients;

  if (loading) {
    return (
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <MetricCardSkeleton
              key={`receptionist-kpi-${index}`}
            />
          )
        )}
      </div>
    );
  }

  const metrics = [
    {
      id: 'rkpi-today-appointments',

      title: "Today's Appointments",

      value: String(
        todaysAppointments.length
      ),

      subtitle: 'Scheduled today',

      icon: (
        <CalendarCheck
          size={20}
          className="text-primary"
        />
      ),

      iconBg: 'bg-primary/10',

      variant: 'primary' as const,
    },

    {
      id: 'rkpi-patients',

      title: 'Total Patients',

      value: patients.length.toLocaleString(),

      subtitle: 'Registered patients',

      icon: (
        <Users
          size={20}
          className="text-positive"
        />
      ),

      iconBg: 'bg-[var(--positive-bg)]',

      variant: 'positive' as const,
    },

    {
      id: 'rkpi-pending',

      title: 'Pending Queue',

      value: String(
        pendingAppointments.length
      ),

      subtitle: 'Booked appointments',

      icon: (
        <Clock
          size={20}
          className="text-warning"
        />
      ),

      iconBg: 'bg-[var(--warning-bg)]',

      variant: 'warning' as const,
    },

    {
      id: 'rkpi-new-registration',

      title: 'New Registrations',

      value: String(newRegistrations),

      subtitle: 'Registered today',

      icon: (
        <UserPlus
          size={20}
          className="text-accent"
        />
      ),

      iconBg: 'bg-accent/10',

      variant: 'default' as const,
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          subtitle={metric.subtitle}
          icon={metric.icon}
          iconBg={metric.iconBg}
          variant={metric.variant}
        />
      ))}
    </div>
  );
}