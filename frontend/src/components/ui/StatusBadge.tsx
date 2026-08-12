import React from 'react';

type StatusType =
  | 'BOOKED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'PENDING'
  | 'AVAILABLE'
  | 'UNAVAILABLE';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  BOOKED: {
    label: 'Booked',
    className: 'badge-booked',
  },

  CONFIRMED: {
    label: 'Confirmed',
    className: 'badge-confirmed',
  },

  CHECKED_IN: {
    label: 'Checked In',
    className: 'badge-in-progress',
  },

  IN_PROGRESS: {
    label: 'In Progress',
    className: 'badge-in-progress',
  },

  COMPLETED: {
    label: 'Completed',
    className: 'badge-completed',
  },

  CANCELLED: {
    label: 'Cancelled',
    className: 'badge-cancelled',
  },

  PENDING: {
    label: 'Pending',
    className: 'badge-pending',
  },

  AVAILABLE: {
    label: 'Available',
    className: 'badge-confirmed',
  },

  UNAVAILABLE: {
    label: 'Unavailable',
    className: 'badge-cancelled',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.PENDING;

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-semibold
        ${config.className}
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}
      `}
    >
      {config.label}
    </span>
  );
}
