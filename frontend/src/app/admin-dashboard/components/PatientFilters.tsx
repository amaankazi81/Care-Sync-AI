'use client';

interface PatientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  gender: string;
  onGenderChange: (value: string) => void;

  bloodGroup: string;
  onBloodGroupChange: (value: string) => void;
}

export default function PatientFilters({
  search,
  onSearchChange,

  gender,
  onGenderChange,

  bloodGroup,
  onBloodGroupChange,
}: PatientFiltersProps) {
  return (
    <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}

        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
        />

        {/* Gender */}

        <select
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2"
        >
          <option value="">All Gender</option>

          <option value="Male">Male</option>

          <option value="Female">Female</option>

          <option value="Other">Other</option>
        </select>

        {/* Blood Group */}

        <select
          value={bloodGroup}
          onChange={(e) => onBloodGroupChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2"
        >
          <option value="">All Blood Groups</option>

          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
    </div>
  );
}
