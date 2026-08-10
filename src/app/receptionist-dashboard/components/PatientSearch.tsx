'use client';

import { Search, X } from 'lucide-react';

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function PatientSearch({
  search,
  setSearch,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search patient by name, ID, phone or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            bg-white
            py-3
            pl-10
            pr-10
            text-sm
            outline-none
            transition
            focus:border-cyan-600
            focus:ring-2
            focus:ring-cyan-100
          "
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}