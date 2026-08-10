'use client';

import { Department } from '@/types/Department';

interface DoctorFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  department: string;
  onDepartmentChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  departments: Department[];
}

export default function DoctorFilters({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  departments,
}: DoctorFiltersProps) {
  return (
    <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by doctor name or specialization..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
        />

        {/* Department */}
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
        >
          <option value="">All Departments</option>

          {departments.map((dept) => (
            <option
              key={dept.id}
              value={dept.id}
            >
              {dept.name}
            </option>
          ))}
        </select>

        {/* Availability */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
        >
          <option value="">All Availability</option>

          <option value="AVAILABLE">
            Available
          </option>

          <option value="UNAVAILABLE">
            Unavailable
          </option>
        </select>
      </div>
    </div>
  );
}