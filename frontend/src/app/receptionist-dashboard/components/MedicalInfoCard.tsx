import {
  HeartPulse,
  PhoneCall,
  UserRound,
} from 'lucide-react';

import { Patient } from '@/types/Patient';

interface Props {
  patient: Patient;
}

export default function MedicalInfoCard({
  patient,
}: Props) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
          <HeartPulse
            size={21}
            className="text-red-500"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            Medical & Emergency Information
          </h2>

          <p className="text-sm text-slate-500">
            Important information available for the patient
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-slate-500">
            Blood Group
          </p>

          <p className="font-semibold mt-1">
            {patient.bloodGroup || 'Not Available'}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Gender
          </p>

          <p className="font-semibold mt-1">
            {patient.gender || '-'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <UserRound
              size={15}
              className="text-slate-400"
            />

            <p className="text-sm text-slate-500">
              Emergency Contact Name
            </p>
          </div>

          <p className="font-semibold mt-1">
            {patient.emergencyContactName || '-'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <PhoneCall
              size={15}
              className="text-slate-400"
            />

            <p className="text-sm text-slate-500">
              Emergency Contact Number
            </p>
          </div>

          <p className="font-semibold mt-1">
            {patient.emergencyContactNumber || '-'}
          </p>
        </div>
      </div>
    </div>
  );
}