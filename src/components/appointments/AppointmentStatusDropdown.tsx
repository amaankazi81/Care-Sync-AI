'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import appointmentService from '@/services/appointmentService';
import {
    Appointment,
    AppointmentStatus,
    UpdateAppointmentRequest,
} from '@/types/Appointment';

interface Props {
  appointment: Appointment;
  onUpdated?: () => void;
}


export default function AppointmentStatusDropdown({
  appointment,
  onUpdated,
}: Props) {


  const [status, setStatus] = useState(
    appointment.status
  );


  const [loading, setLoading] = useState(false);



  const statuses: AppointmentStatus[] = [
    'BOOKED',
    'CONFIRMED',
    'CHECKED_IN',
    'COMPLETED',
    'CANCELLED',
];


  async function handleStatusChange(
    value: AppointmentStatus
) {

    try {

      setLoading(true);


      const request: UpdateAppointmentRequest = {
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    appointmentDate: appointment.appointmentDate,
    appointmentTime: appointment.appointmentTime,
    reason: appointment.reason,
    notes: appointment.notes ?? '',
    status: value,
};


await appointmentService.updateAppointment(
    appointment.id,
    request
);      setStatus(value);


      toast.success(
        'Appointment status updated successfully.'
      );


      if (onUpdated) {
        onUpdated();
      }


    } catch (error) {

      console.error(error);


      toast.error(
        'Unable to update appointment status.'
      );


    } finally {

      setLoading(false);

    }

  }




  function getColor() {

    switch (status) {

      case 'BOOKED':
        return 'bg-blue-100 text-blue-700';


      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';


      case 'CHECKED_IN':
        return 'bg-yellow-100 text-yellow-700';


      case 'COMPLETED':
        return 'bg-purple-100 text-purple-700';


      case 'CANCELLED':
        return 'bg-red-100 text-red-700';


      default:
        return 'bg-gray-100 text-gray-700';

    }

  }



  return (

    <select

      value={status}

      disabled={loading}

     onChange={(e) =>
    handleStatusChange(
        e.target.value as AppointmentStatus
    )
}


      className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        cursor-pointer
        border
        ${getColor()}
      `}

    >

      {
        statuses.map((item) => (

          <option
            key={item}
            value={item}
          >
            {item.replace('_', ' ')}
          </option>

        ))
      }


    </select>

  );

}