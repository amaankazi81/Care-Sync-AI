'use client';

import React from 'react';

import {
  CalendarPlus,
  ArrowRight,
} from 'lucide-react';

import Link from 'next/link';

export default function PatientBookingCTA() {
  return (
    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl shadow-card overflow-hidden">
      <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="flex items-start gap-4">

          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
            <CalendarPlus
              size={28}
              className="text-white"
            />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              Need a Doctor?
            </h2>

            <p className="text-cyan-100 mt-2 max-w-lg leading-relaxed">
              Book appointments with specialists
              across multiple departments. View
              doctor availability, choose your
              preferred slot, and receive instant
              confirmation.
            </p>

            {/* Specializations */}

            <div className="flex flex-wrap gap-2 mt-4">

              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                Cardiology
              </span>

              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                Neurology
              </span>

              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                Orthopedics
              </span>

              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                General Medicine
              </span>

            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT ACTION
        ===================================================== */}

        <div className="flex flex-col items-start lg:items-end gap-3">

          <Link
            href="/patient-dashboard/book-appointment"
            className="
              flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-white
              text-cyan-700
              font-semibold
              shadow-lg
              hover:bg-slate-100
              transition-all
            "
          >
            Book Appointment

            <ArrowRight size={18} />
          </Link>

          <p className="text-xs text-cyan-100">
            Average booking time: less than 2 minutes
          </p>

        </div>
      </div>
    </div>
  );
}