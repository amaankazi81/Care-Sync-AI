'use client';

import React from 'react';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminQuickActions() {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        onClick={() =>
          toast?.success('Report export started', {
            description: 'Your report will be ready in a moment.',
          })
        }
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-500 text-muted-foreground hover:text-foreground hover:bg-muted transition-all btn-press"
      >
        <Download size={15} />
        <span className="hidden sm:inline">Export</span>
      </button>
      <button
        onClick={() => toast?.info('Dashboard refreshed')}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-500 text-muted-foreground hover:text-foreground hover:bg-muted transition-all btn-press"
      >
        <RefreshCw size={15} />
        <span className="hidden sm:inline">Refresh</span>
      </button>
      <button
        onClick={() => toast?.success('New appointment form opened')}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-600 hover:opacity-90 transition-all btn-press shadow-card"
      >
        <Plus size={15} />
        <span>New Appointment</span>
      </button>
    </div>
  );
}
