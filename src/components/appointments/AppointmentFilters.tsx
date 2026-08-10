'use client';

interface AppointmentFiltersProps {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;
}

export default function AppointmentFilters({
  search,
  setSearch,
  status,
  setStatus,
}: AppointmentFiltersProps) {
  return (
    <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Search */}

        <input
          type="text"
          placeholder="Search patient, doctor or appointment number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
        />

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="ALL">All Status</option>

          <option value="BOOKED">
            Booked
          </option>

          <option value="CONFIRMED">
            Confirmed
          </option>

          <option value="CHECKED_IN">
            Checked In
          </option>

          <option value="COMPLETED">
            Completed
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>
        </select>

      </div>
    </div>
  );
}