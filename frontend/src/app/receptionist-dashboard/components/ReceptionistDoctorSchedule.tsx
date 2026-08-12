'use client';

import React, { useEffect, useMemo, useState } from 'react';

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Stethoscope,
  UserRound,
  XCircle,
} from 'lucide-react';

import { toast } from 'sonner';

import doctorService from '@/services/doctorService';

import appointmentService from '@/services/appointmentService';

import { Doctor } from '@/types/Doctor';

import { Appointment } from '@/types/Appointment';

interface DoctorScheduleItem extends Doctor {
  todayAppointments: Appointment[];
}

export default function ReceptionistDoctorSchedule() {
  const [doctors, setDoctors] = useState<DoctorScheduleItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const loadDoctorSchedule = async () => {
    try {
      setLoading(true);

      setError(null);

      const [doctorList, appointmentList] =
        await Promise.all([
          doctorService.getDoctors(),

          appointmentService.getAppointments(),
        ]);

      const schedule: DoctorScheduleItem[] =
        doctorList.map((doctor) => {
          const todayAppointments =
            appointmentList.filter(
              (appointment) =>
                appointment.doctorId === doctor.id &&
                appointment.appointmentDate === today &&
                appointment.status !== 'CANCELLED'
            );

          return {
            ...doctor,

            todayAppointments,
          };
        });

      setDoctors(schedule);
    } catch (err) {
      console.error(
        'Failed to load doctor schedule:',
        err
      );

      setError(
        'Unable to load doctor availability.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorSchedule();
  }, []);

  const formatTime = (time: string) => {
    if (!time) {
      return '-';
    }

    const parts = time.split(':');

    const hours = Number(parts[0]);

    const minutes = Number(parts[1] || 0);

    const date = new Date();

    date.setHours(hours);

    date.setMinutes(minutes);

    return date.toLocaleTimeString([], {
      hour: '2-digit',

      minute: '2-digit',
    });
  };

  const handleViewSchedule = (
    doctor: DoctorScheduleItem
  ) => {
    toast.info(
      `${doctor.firstName} ${doctor.lastName} has ${doctor.todayAppointments.length} appointment${
        doctor.todayAppointments.length === 1
          ? ''
          : 's'
      } today.`
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* HEADER */}

      <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays
              size={18}
              className="text-primary"
            />

            <h3 className="text-lg font-semibold text-foreground">
              Doctor Schedule
            </h3>
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            Today's doctor availability and appointments.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString([], {
            day: '2-digit',

            month: 'short',

            year: 'numeric',
          })}
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="p-8 text-center text-sm text-muted-foreground">
          Loading doctor schedule...
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="p-8 text-center">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadDoctorSchedule}
            className="mt-3 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        doctors.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No doctors found.
          </div>
        )}

      {/* DOCTORS */}

      {!loading &&
        !error &&
        doctors.length > 0 && (
          <div className="divide-y divide-border">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="p-6 hover:bg-muted/20 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  {/* DOCTOR */}

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <UserRound
                        size={21}
                        className="text-primary"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground">
                        Dr. {doctor.firstName}{' '}
                        {doctor.lastName}
                      </h4>

                      <p className="text-sm text-primary mt-1">
                        {doctor.specialization}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Stethoscope size={13} />

                          {doctor.qualification}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />

                          Room {doctor.roomNumber || '-'}
                        </span>

                        <span>
                          {doctor.experience} years experience
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div>
                    {doctor.isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <CheckCircle2 size={13} />

                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        <XCircle size={13} />

                        Unavailable
                      </span>
                    )}
                  </div>
                </div>

                {/* TODAY'S APPOINTMENTS */}

                <div className="mt-5 rounded-xl bg-background border border-border p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Today's Appointments
                      </p>

                      <p className="text-lg font-bold mt-1">
                        {doctor.todayAppointments.length}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleViewSchedule(doctor)
                      }
                      className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition"
                    >
                      View Schedule
                    </button>
                  </div>

                  {doctor.todayAppointments.length >
                  0 ? (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {doctor.todayAppointments.map(
                        (appointment) => (
                          <div
                            key={appointment.id}
                            className="rounded-lg border border-border bg-card p-3"
                          >
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              <Clock3
                                size={14}
                                className="text-primary"
                              />

                              {formatTime(
                                appointment.appointmentTime
                              )}
                            </div>

                            <p className="text-sm font-medium mt-2">
                              {appointment.patientName ||
                                'Unknown patient'}
                            </p>

                            <p className="text-xs text-muted-foreground mt-1">
                              {appointment.reason ||
                                'General consultation'}
                            </p>

                            <span className="inline-block mt-2 text-xs font-medium text-muted-foreground">
                              {appointment.status}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">
                      No appointments scheduled for this doctor today.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}