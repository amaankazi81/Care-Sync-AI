'use client';

import React from 'react';
import {
  CalendarPlus,
  UserPlus,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface Activity {
  id: string;
  type:
    | 'appointment_booked'
    | 'patient_registered'
    | 'appointment_cancelled'
    | 'appointment_completed'
    | 'alert'
    | 'report';
  title: string;
  detail: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 'act-001',
    type: 'appointment_booked',
    title: 'Appointment Booked',
    detail: 'Sarah Chen booked with Dr. Marcus Webb — Cardiology',
    time: '2 min ago',
  },
  {
    id: 'act-002',
    type: 'appointment_completed',
    title: 'Consultation Completed',
    detail: 'Dr. Aisha Okonkwo completed APT-0892 with Raj Patel',
    time: '14 min ago',
  },
  {
    id: 'act-003',
    type: 'alert',
    title: 'Doctor Unavailability',
    detail: 'Dr. Lisa Brennan marked unavailable Jul 28–30',
    time: '31 min ago',
  },
  {
    id: 'act-004',
    type: 'patient_registered',
    title: 'New Patient Registered',
    detail: 'Thomas Adeyemi registered via patient portal',
    time: '47 min ago',
  },
  {
    id: 'act-005',
    type: 'appointment_cancelled',
    title: 'Appointment Cancelled',
    detail: 'APT-0897 cancelled — Mei Lin Wang, Pediatrics',
    time: '1 hr ago',
  },
  {
    id: 'act-006',
    type: 'report',
    title: 'Monthly Report Ready',
    detail: 'June 2026 operational report generated',
    time: '2 hr ago',
  },
  {
    id: 'act-007',
    type: 'appointment_booked',
    title: 'Appointment Booked',
    detail: 'Carlos Rivera booked with Dr. Aisha Okonkwo — Orthopedics',
    time: '2 hr ago',
  },
  {
    id: 'act-008',
    type: 'appointment_completed',
    title: 'Consultation Completed',
    detail: 'Dr. Priya Mehta completed morning rounds — 6 patients',
    time: '3 hr ago',
  },
];

const iconConfig: Record<Activity['type'], { icon: React.ElementType; bg: string; color: string }> =
  {
    appointment_booked: { icon: CalendarPlus, bg: 'bg-primary/10', color: 'text-primary' },
    patient_registered: { icon: UserPlus, bg: 'bg-accent/10', color: 'text-accent' },
    appointment_cancelled: { icon: XCircle, bg: 'bg-[var(--negative-bg)]', color: 'text-negative' },
    appointment_completed: {
      icon: CheckCircle2,
      bg: 'bg-[var(--positive-bg)]',
      color: 'text-positive',
    },
    alert: { icon: AlertTriangle, bg: 'bg-[var(--warning-bg)]', color: 'text-warning' },
    report: { icon: FileText, bg: 'bg-muted', color: 'text-muted-foreground' },
  };

export default function AdminActivityFeed() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-sm font-600 text-foreground">Recent Activity</h3>
          <p className="text-xs text-muted-foreground">Live hospital events</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-positive">
          <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
          Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activities.map((act, index) => {
          const cfg = iconConfig[act.type];
          const Icon = cfg.icon;
          return (
            <div
              key={act.id}
              className="flex gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={15} className={cfg.color} />
                </div>
                {index < activities.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1 min-h-[12px]" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <p className="text-xs font-600 text-foreground">{act.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{act.detail}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{act.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-border flex-shrink-0">
        <button className="w-full text-center text-xs font-500 text-primary hover:text-accent transition-colors">
          View full activity log →
        </button>
      </div>
    </div>
  );
}
