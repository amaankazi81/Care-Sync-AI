'use client';

import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

import { toast } from 'sonner';

interface Prescription {
  id: string;
  prescriptionNo: string;
  doctor: string;
  department: string;
  medicine: string;
  issueDate: string;
  status: 'Active' | 'Completed';
}

const prescriptions: Prescription[] = [
  {
    id: '1',
    prescriptionNo: 'RX-20541',
    doctor: 'Dr. Amit Patel',
    department: 'Cardiology',
    medicine: 'Aspirin 75mg, Atorvastatin 20mg',
    issueDate: '25 Jul 2026',
    status: 'Active',
  },
  {
    id: '2',
    prescriptionNo: 'RX-20487',
    doctor: 'Dr. Meera Shah',
    department: 'General Medicine',
    medicine: 'Vitamin D3, Calcium Tablets',
    issueDate: '18 Jul 2026',
    status: 'Completed',
  },
  {
    id: '3',
    prescriptionNo: 'RX-20365',
    doctor: 'Dr. Rajesh Kumar',
    department: 'Orthopedics',
    medicine: 'Pain Relief Tablets',
    issueDate: '05 Jul 2026',
    status: 'Completed',
  },
];

export default function PatientPrescriptions() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      {/* Header */}

      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText size={18} className="text-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Prescriptions</h3>

            <p className="text-xs text-muted-foreground">Last issued prescriptions</p>
          </div>
        </div>

        <button
          onClick={() =>
            toast.info('Complete prescription history will be available after backend integration.')
          }
          className="text-xs font-semibold text-primary hover:text-cyan-700 transition"
        >
          View All
        </button>
      </div>

      {/* List */}

      <div className="divide-y divide-border">
        {prescriptions.map((item) => (
          <div key={item.id} className="px-5 py-4 hover:bg-muted/30 transition">
            <div className="flex justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-primary">{item.prescriptionNo}</span>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      item.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-foreground">{item.doctor}</h4>

                <p className="text-xs text-muted-foreground">{item.department}</p>

                <p className="text-xs mt-2 text-foreground leading-5">{item.medicine}</p>

                <p className="text-[11px] text-muted-foreground mt-2">Issued on {item.issueDate}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toast.success(`Opening ${item.prescriptionNo}`)}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => toast.success(`Downloading ${item.prescriptionNo}`)}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}

      <div className="px-5 py-3 border-t border-border">
        <button
          onClick={() => toast.info('Prescription module will be connected with backend.')}
          className="w-full py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/5 transition"
        >
          View Complete Prescription History
        </button>
      </div>
    </div>
  );
}
