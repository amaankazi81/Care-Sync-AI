'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import doctorService from '@/services/doctorService';
import departmentService from '@/services/departmentService';

import {
  Doctor,
  UpdateDoctorRequest,
  CreateDoctorRequest,
} from '@/types/Doctor';

import { Department } from '@/types/Department';

interface Props {
  doctor?: Doctor;
}

export default function DoctorForm({ doctor }: Props) {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([]);

  const [firstName, setFirstName] = useState(doctor?.firstName ?? '');
  const [lastName, setLastName] = useState(doctor?.lastName ?? '');
  const [email, setEmail] = useState(doctor?.email ?? '');
  const [phone, setPhone] = useState(doctor?.phone ?? '');
  const [gender, setGender] = useState(doctor?.gender ?? '');
  const [specialization, setSpecialization] = useState(
    doctor?.specialization ?? ''
  );
  const [qualification, setQualification] = useState(
    doctor?.qualification ?? ''
  );
  const [experience, setExperience] = useState(
    doctor?.experience ?? 0
  );
  const [roomNumber, setRoomNumber] = useState(
    doctor?.roomNumber ?? ''
  );
  const [isAvailable, setIsAvailable] = useState(
    doctor?.isAvailable ?? true
  );
  const [departmentId, setDepartmentId] = useState(
    doctor?.departmentId ?? ''
  );

  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await departmentService.getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error('Failed to load departments', error);
      }
    }

    loadDepartments();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (doctor) {
        const payload: UpdateDoctorRequest = {
          firstName,
          lastName,
          email,
          phone,
          gender,
          specialization,
          qualification,
          experience,
          roomNumber,
          isAvailable,
          departmentId,
        };

        await doctorService.updateDoctor(doctor.id, payload);

        alert('Doctor updated successfully');
      } else {
        const payload: CreateDoctorRequest = {
          firstName,
          lastName,
          email,
          phone,
          gender,
          specialization,
          qualification,
          experience,
          roomNumber,
          isAvailable,
          departmentId,
        };

        await doctorService.createDoctor(payload);

        alert('Doctor created successfully');
      }

      router.push('/admin-dashboard/doctors');
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border bg-white p-8 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-5">

        <div>
          <label className="mb-2 block text-sm font-medium">
            First Name
          </label>

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Last Name
          </label>

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Gender
          </label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Specialization
          </label>

          <input
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Qualification
          </label>

          <input
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Experience
          </label>

          <input
            type="number"
            value={experience}
            onChange={(e) => setExperience(Number(e.target.value))}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Room Number
          </label>

          <input
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Department
          </label>

          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">Select Department</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />

          <label>Available</label>
        </div>

      </div>

      <button className="rounded-lg bg-cyan-700 px-6 py-3 font-semibold text-white hover:bg-cyan-800">
        {doctor ? 'Update Doctor' : 'Add Doctor'}
      </button>
    </form>
  );
}