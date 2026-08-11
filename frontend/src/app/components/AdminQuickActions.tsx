'use client';

import React from 'react';

import {
  Plus,
  Download,
  RefreshCw,
} from 'lucide-react';

import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

export default function AdminQuickActions() {
  const router =
    useRouter();

  const handleRefresh =
    () => {
      window.dispatchEvent(
        new CustomEvent(
          'admin-dashboard-refresh'
        )
      );

      toast.success(
        'Dashboard refreshed.'
      );
    };

  const handleNewAppointment =
    () => {
      router.push(
        '/admin-dashboard/appointments'
      );
    };

  const handleExport =
    () => {
      /*
       * The dashboard is populated from
       * real API data now.
       *
       * Until a dedicated reporting endpoint
       * exists, do not pretend to generate
       * a server-side report.
       */
      toast.info(
        'Use the Reports module to generate the full hospital report.'
      );

      router.push(
        '/admin-dashboard/reports'
      );
    };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        type="button"
        onClick={
          handleExport
        }
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-500 text-muted-foreground hover:text-foreground hover:bg-muted transition-all btn-press"
      >
        <Download
          size={15}
        />

        <span className="hidden sm:inline">
          Export
        </span>
      </button>

      <button
        type="button"
        onClick={
          handleRefresh
        }
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-500 text-muted-foreground hover:text-foreground hover:bg-muted transition-all btn-press"
      >
        <RefreshCw
          size={15}
        />

        <span className="hidden sm:inline">
          Refresh
        </span>
      </button>

      <button
        type="button"
        onClick={
          handleNewAppointment
        }
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-600 hover:opacity-90 transition-all btn-press shadow-card"
      >
        <Plus
          size={15}
        />

        <span>
          New Appointment
        </span>
      </button>
    </div>
  );
}