'use client';

import { Doctor } from '@/types/Doctor';

interface Props {
  doctor: Doctor;
}

export default function DoctorProfileCard({ doctor }: Props) {
  const initials = `${doctor.firstName.charAt(0)}${doctor.lastName.charAt(0)}`;

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-700 text-3xl font-bold text-white">
          {initials}
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            {doctor.firstName} {doctor.lastName}
          </h1>

          <p className="mt-1 text-slate-500">
            {doctor.specialization}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Info title="Doctor ID" value={doctor.id} />

        <Info title="Email" value={doctor.email} />

        <Info title="Phone" value={doctor.phone} />

        <Info title="Gender" value={doctor.gender} />

        <Info title="Qualification" value={doctor.qualification} />

        <Info title="Experience" value={`${doctor.experience} Years`} />

        <Info title="Room Number" value={doctor.roomNumber} />

        <Info
          title="Availability"
          value={doctor.isAvailable ? 'Available' : 'Unavailable'}
        />

        <Info title="Department ID" value={doctor.departmentId} />
      </div>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}