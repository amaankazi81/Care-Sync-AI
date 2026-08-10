import {
  Mail,
  Phone,
  MapPin,
  UserRound,
} from 'lucide-react';

import { Patient } from '@/types/Patient';

interface Props {
  patient?: Patient;

  /*
   * These are optional compatibility props.
   *
   * Some existing pages may pass patientId and patientName
   * separately. Keeping them optional prevents breaking those
   * pages while the complete Patient object is still preferred.
   */

  patientId?: string;

  patientName?: string;
}

export default function PatientProfileCard({
  patient,
  patientId,
  patientName,
}: Props) {
  /*
   * Prefer the complete Patient object.
   *
   * Fallback values are used only when the page provides
   * patientId / patientName separately.
   */

  const resolvedPatientId =
    patient?.id ?? patientId ?? '-';

  const resolvedPatientName =
    patientName ??
    (patient
      ? `${patient.firstName ?? ''} ${
          patient.lastName ?? ''
        }`.trim()
      : '');

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-full bg-cyan-50 flex items-center justify-center">
          <UserRound
            size={21}
            className="text-cyan-600"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            Patient Profile
          </h2>

          <p className="text-sm text-slate-500">
            Basic patient information
          </p>
        </div>
      </div>

      {/* PATIENT NAME */}

      {resolvedPatientName && (
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            Patient Name
          </p>

          <p className="text-lg font-semibold mt-1">
            {resolvedPatientName}
          </p>
        </div>
      )}

      {/* DETAILS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FIRST NAME */}

        <div>
          <p className="text-sm text-slate-500">
            First Name
          </p>

          <p className="font-semibold mt-1">
            {patient?.firstName || '-'}
          </p>
        </div>

        {/* LAST NAME */}

        <div>
          <p className="text-sm text-slate-500">
            Last Name
          </p>

          <p className="font-semibold mt-1">
            {patient?.lastName || '-'}
          </p>
        </div>

        {/* PATIENT ID */}

        <div>
          <p className="text-sm text-slate-500">
            Patient ID
          </p>

          <p className="font-semibold mt-1 break-all">
            {resolvedPatientId}
          </p>
        </div>

        {/* DATE OF BIRTH */}

        <div>
          <p className="text-sm text-slate-500">
            Date of Birth
          </p>

          <p className="font-semibold mt-1">
            {patient?.dateOfBirth
              ? new Date(
                  patient.dateOfBirth
                ).toLocaleDateString()
              : '-'}
          </p>
        </div>

        {/* GENDER */}

        <div>
          <p className="text-sm text-slate-500">
            Gender
          </p>

          <p className="font-semibold mt-1">
            {patient?.gender || '-'}
          </p>
        </div>

        {/* BLOOD GROUP */}

        <div>
          <p className="text-sm text-slate-500">
            Blood Group
          </p>

          <p className="font-semibold mt-1">
            {patient?.bloodGroup || '-'}
          </p>
        </div>

        {/* EMAIL */}

        <div>
          <div className="flex items-center gap-2">
            <Mail
              size={15}
              className="text-slate-400"
            />

            <p className="text-sm text-slate-500">
              Email
            </p>
          </div>

          <p className="font-semibold mt-1 break-all">
            {patient?.email || '-'}
          </p>
        </div>

        {/* PHONE */}

        <div>
          <div className="flex items-center gap-2">
            <Phone
              size={15}
              className="text-slate-400"
            />

            <p className="text-sm text-slate-500">
              Phone
            </p>
          </div>

          <p className="font-semibold mt-1">
            {patient?.phone || '-'}
          </p>
        </div>

        {/* ADDRESS */}

        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <MapPin
              size={15}
              className="text-slate-400"
            />

            <p className="text-sm text-slate-500">
              Address
            </p>
          </div>

          <p className="font-semibold mt-1">
            {patient?.address || '-'}
          </p>
        </div>

        {/* EMERGENCY CONTACT */}

        <div>
          <p className="text-sm text-slate-500">
            Emergency Contact
          </p>

          <p className="font-semibold mt-1">
            {patient?.emergencyContactName ||
              '-'}
          </p>
        </div>

        {/* EMERGENCY PHONE */}

        <div>
          <p className="text-sm text-slate-500">
            Emergency Contact Number
          </p>

          <p className="font-semibold mt-1">
            {patient?.emergencyContactNumber ||
              '-'}
          </p>
        </div>
      </div>
    </div>
  );
}