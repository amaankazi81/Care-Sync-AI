import { AppointmentStatus } from '@/types/Appointment';

interface Props {
  status?: AppointmentStatus | string;
}

export default function AppointmentStatusBadge({
  status,
}: Props) {

  const currentStatus =
    status ?? 'UNKNOWN';


  function getStatusStyle() {

    switch (currentStatus) {

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



  function formatStatus(value:string) {

    return value
      .replace('_', ' ')
      .toUpperCase();

  }



  return (

    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${getStatusStyle()}
      `}
    >

      {formatStatus(currentStatus)}

    </span>

  );

}