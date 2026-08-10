'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import patientService from '@/services/patientService';

import {
  Patient,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '@/types/Patient';

interface Props {
  patient?: Patient;
}

export default function PatientForm({ patient }: Props) {
  const router = useRouter();

  const [firstName, setFirstName] = useState(
    patient?.firstName ?? ''
  );

  const [lastName, setLastName] = useState(
    patient?.lastName ?? ''
  );

  const [dateOfBirth, setDateOfBirth] = useState(
    patient?.dateOfBirth ?? ''
  );

  const [gender, setGender] = useState(
    patient?.gender ?? ''
  );

  const [bloodGroup, setBloodGroup] = useState(
    patient?.bloodGroup ?? ''
  );

  const [email, setEmail] = useState(
    patient?.email ?? ''
  );

  const [phone, setPhone] =useState(
    patient?.phone ?? ''
  );

  const [address, setAddress] = useState(
    patient?.address ?? ''
  );

  const [emergencyContactName, setEmergencyContactName] =
    useState(patient?.emergencyContactName ?? '');

  const [
    emergencyContactNumber,
    setEmergencyContactNumber,
  ] = useState(
    patient?.emergencyContactNumber ?? ''
  );

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      if (patient) {
        const payload: UpdatePatientRequest = {
          firstName,
          lastName,
          dateOfBirth,
          gender,
          bloodGroup,
          email,
          phone,
          address,
          emergencyContactName,
          emergencyContactNumber,
        };

        await patientService.updatePatient(
          patient.id,
          payload
        );

        alert('Patient updated successfully');
      } else {
        const payload: CreatePatientRequest = {
          firstName,
          lastName,
          dateOfBirth,
          gender,
          bloodGroup,
          email,
          phone,
          address,
          emergencyContactName,
          emergencyContactNumber,
        };

        await patientService.createPatient(
          payload
        );

        alert('Patient created successfully');
      }

      router.push('/admin-dashboard/patients');
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-white p-8 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-5">

        <div>
          <label className="mb-2 block text-sm font-medium">
            First Name
          </label>

          <input
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Last Name
          </label>

          <input
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Date of Birth
          </label>

          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) =>
              setDateOfBirth(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Gender
          </label>

          <select
            value={gender}
            onChange={(e) =>
              setGender(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Blood Group
          </label>

          <select
            value={bloodGroup}
            onChange={(e) =>
              setBloodGroup(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Emergency Contact Name
          </label>

          <input
            value={emergencyContactName}
            onChange={(e) =>
              setEmergencyContactName(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Emergency Contact Number
          </label>

          <input
            value={emergencyContactNumber}
            onChange={(e) =>
              setEmergencyContactNumber(
                e.target.value
              )
            }
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Address
          </label>

          <textarea
            rows={4}
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

      </div>

      <button className="rounded-lg bg-cyan-700 px-6 py-3 font-semibold text-white hover:bg-cyan-800">
        {patient
          ? 'Update Patient'
          : 'Register Patient'}
      </button>
    </form>
  );
}