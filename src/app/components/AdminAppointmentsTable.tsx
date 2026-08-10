'use client';

import React, { useState, useMemo } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, ChevronUp, ChevronDown, Eye, Edit2, Trash2, Filter } from 'lucide-react';
import { toast } from 'sonner';

type AppointmentStatus = 'BOOKED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface Appointment {
  id: string;
  aptNo: string;
  patient: string;
  patientAge: number;
  doctor: string;
  department: string;
  date: string;
  time: string;
  type: string;
  status: AppointmentStatus;
}

const appointments: Appointment[] = [
  {
    id: 'apt-001',
    aptNo: 'APT-0891',
    patient: 'Sarah Chen',
    patientAge: 34,
    doctor: 'Dr. Marcus Webb',
    department: 'Cardiology',
    date: 'Jul 26, 2026',
    time: '09:00 AM',
    type: 'Consultation',
    status: 'COMPLETED',
  },
  {
    id: 'apt-002',
    aptNo: 'APT-0892',
    patient: 'Raj Patel',
    patientAge: 52,
    doctor: 'Dr. Aisha Okonkwo',
    department: 'Orthopedics',
    date: 'Jul 26, 2026',
    time: '09:30 AM',
    type: 'Follow-up',
    status: 'COMPLETED',
  },
  {
    id: 'apt-003',
    aptNo: 'APT-0893',
    patient: 'Emily Nguyen',
    patientAge: 28,
    doctor: 'Dr. Samuel Torres',
    department: 'Neurology',
    date: 'Jul 26, 2026',
    time: '10:00 AM',
    type: 'Consultation',
    status: 'IN_PROGRESS',
  },
  {
    id: 'apt-004',
    aptNo: 'APT-0894',
    patient: 'David Kowalski',
    patientAge: 45,
    doctor: 'Dr. Priya Mehta',
    department: 'General Medicine',
    date: 'Jul 26, 2026',
    time: '10:30 AM',
    type: 'Routine Checkup',
    status: 'CONFIRMED',
  },
  {
    id: 'apt-005',
    aptNo: 'APT-0895',
    patient: 'Fatima Al-Hassan',
    patientAge: 61,
    doctor: 'Dr. Marcus Webb',
    department: 'Cardiology',
    date: 'Jul 26, 2026',
    time: '11:00 AM',
    type: 'Post-Op Review',
    status: 'BOOKED',
  },
  {
    id: 'apt-006',
    aptNo: 'APT-0896',
    patient: 'James Oduya',
    patientAge: 39,
    doctor: 'Dr. Lisa Brennan',
    department: 'Pediatrics',
    date: 'Jul 26, 2026',
    time: '11:30 AM',
    type: 'Vaccination',
    status: 'BOOKED',
  },
  {
    id: 'apt-007',
    aptNo: 'APT-0897',
    patient: 'Mei Lin Wang',
    patientAge: 7,
    doctor: 'Dr. Lisa Brennan',
    department: 'Pediatrics',
    date: 'Jul 26, 2026',
    time: '12:00 PM',
    type: 'Checkup',
    status: 'CANCELLED',
  },
  {
    id: 'apt-008',
    aptNo: 'APT-0898',
    patient: 'Carlos Rivera',
    patientAge: 58,
    doctor: 'Dr. Aisha Okonkwo',
    department: 'Orthopedics',
    date: 'Jul 26, 2026',
    time: '02:00 PM',
    type: 'Surgery Prep',
    status: 'CONFIRMED',
  },
  {
    id: 'apt-009',
    aptNo: 'APT-0899',
    patient: 'Nadia Petrov',
    patientAge: 42,
    doctor: 'Dr. Samuel Torres',
    department: 'Neurology',
    date: 'Jul 26, 2026',
    time: '02:30 PM',
    type: 'MRI Review',
    status: 'BOOKED',
  },
  {
    id: 'apt-010',
    aptNo: 'APT-0900',
    patient: 'Thomas Adeyemi',
    patientAge: 67,
    doctor: 'Dr. Priya Mehta',
    department: 'Oncology',
    date: 'Jul 26, 2026',
    time: '03:00 PM',
    type: 'Chemotherapy',
    status: 'CONFIRMED',
  },
];

type SortKey = keyof Appointment;

export default function AdminAppointmentsTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('aptNo');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const perPage = 8;

  const filtered = useMemo(() => {
    let rows = [...appointments];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.patient.toLowerCase().includes(q) ||
          r.doctor.toLowerCase().includes(q) ||
          r.aptNo.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    rows.sort((a, b) => {
      const av = a[sortKey] as string;
      const bv = b[sortKey] as string;
      return sortDir === 'asc' ? av.localeCompare(String(bv)) : String(bv).localeCompare(av);
    });
    return rows;
  }, [search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(null);
    toast.success('Appointment cancelled', { description: `Appointment ${id} has been removed.` });
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp
        size={10}
        className={sortKey === col && sortDir === 'asc' ? 'text-primary' : 'text-border'}
      />
      <ChevronDown
        size={10}
        className={sortKey === col && sortDir === 'desc' ? 'text-primary' : 'text-border'}
      />
    </span>
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-600 text-foreground">Today&apos;s Appointments</h3>
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {appointments.length} total
          </p>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-40"
            />
          </div>
          <div className="relative">
            <Filter
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="BOOKED">Booked</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {[
                { key: 'aptNo' as SortKey, label: 'Apt #' },
                { key: 'patient' as SortKey, label: 'Patient' },
                { key: 'doctor' as SortKey, label: 'Doctor' },
                { key: 'department' as SortKey, label: 'Department' },
                { key: 'time' as SortKey, label: 'Time' },
                { key: 'type' as SortKey, label: 'Type' },
                { key: 'status' as SortKey, label: 'Status' },
              ].map((col) => (
                <th
                  key={`th-${col.key}`}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-600 uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap"
                >
                  {col.label}
                  <SortIcon col={col.key} />
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-600 uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <p className="text-sm font-500 text-muted-foreground">No appointments found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your search or filter
                  </p>
                </td>
              </tr>
            ) : (
              paginated.map((apt) => (
                <tr
                  key={apt.id}
                  className="border-b border-border last:border-0 row-hover transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-600 text-primary tabular-nums">{apt.aptNo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-500 text-foreground whitespace-nowrap">
                        {apt.patient}
                      </p>
                      <p className="text-xs text-muted-foreground">Age {apt.patientAge}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground whitespace-nowrap">{apt.doctor}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-primary text-xs font-500 whitespace-nowrap">
                      {apt.department}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground tabular-nums whitespace-nowrap">
                      {apt.time}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {apt.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={apt.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        title="View appointment details"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => toast.info(`Viewing ${apt.aptNo}`)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        title="Edit appointment"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                        onClick={() => toast.info(`Editing ${apt.aptNo}`)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        title="Cancel appointment — this cannot be undone"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-negative hover:bg-negative-bg transition-colors"
                        onClick={() => setDeleteId(apt.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–
          {Math.min(page * perPage, filtered.length)} of {filtered.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={`page-${i + 1}`}
              onClick={() => setPage(i + 1)}
              className={`w-7 h-7 text-xs rounded-lg border transition-colors ${
                page === i + 1
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border shadow-card-lg p-6 w-full max-w-sm fade-in">
            <h4 className="text-base font-600 text-foreground mb-2">Cancel Appointment?</h4>
            <p className="text-sm text-muted-foreground mb-5">
              This will cancel the appointment and notify the patient. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-500 text-muted-foreground hover:bg-muted transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 rounded-lg bg-negative text-white text-sm font-600 hover:opacity-90 transition-all btn-press"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
