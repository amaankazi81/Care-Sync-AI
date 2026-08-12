'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  CalendarDays,
  FileText,
  FolderOpen,
  CreditCard,
} from 'lucide-react';

import MetricCard from '@/components/ui/MetricCard';
import { MetricCardSkeleton } from '@/components/ui/LoadingSkeleton';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import appointmentService from '@/services/appointmentService';
import prescriptionService from '@/services/prescriptionService';
import medicalRecordService from '@/services/medicalRecordService';
import billingService from '@/services/billingService';
import patientService from '@/services/patientService';

interface PatientKPIData {
  upcomingAppointments: number;
  activePrescriptions: number;
  medicalRecords: number;
  pendingBills: number;
}

/* ============================================================
   BILLING HELPERS

   IMPORTANT:
   Receptionist billing now follows:

   total = actual bill amount
   paid  = amount actually paid
   due   = max(total - paid, 0)

   These helpers make the patient dashboard follow the
   exact same calculation.
============================================================ */

type BillingLike = {
  patientId?: string | null;
  patientName?: string | null;

  totalAmount?: number | string | null;
  paidAmount?: number | string | null;
  dueAmount?: number | string | null;

  amount?: number | string | null;
  billAmount?: number | string | null;
  chargeAmount?: number | string | null;
  finalAmount?: number | string | null;
  total?: number | string | null;

  paid?: number | string | null;
  amountPaid?: number | string | null;
};

const toAmount = (
  value: unknown
): number => {
  const amount = Number(value);

  if (
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    return 0;
  }

  return amount;
};

/**
 * Get the actual bill total.
 *
 * Normal source:
 *   totalAmount
 *
 * Fallbacks are included for older receptionist
 * billing records / API responses.
 */
const getBillTotal = (
  bill: BillingLike
): number => {
  const totalAmount =
    toAmount(bill.totalAmount);

  if (totalAmount > 0) {
    return totalAmount;
  }

  const fallbackAmounts = [
    bill.amount,
    bill.billAmount,
    bill.chargeAmount,
    bill.finalAmount,
    bill.total,
  ];

  for (
    const value of fallbackAmounts
  ) {
    const amount = toAmount(value);

    if (amount > 0) {
      return amount;
    }
  }

  /*
   * Older corrupted records may have:
   *
   * totalAmount = 0
   * paidAmount  = 2104
   * dueAmount   = -2104
   *
   * In that situation the paid amount is the only
   * recoverable financial value, so use it as total.
   */
  const paidAmount =
    getBillPaidAmount(bill);

  if (paidAmount > 0) {
    return paidAmount;
  }

  return 0;
};

/**
 * Get amount actually paid.
 */
const getBillPaidAmount = (
  bill: BillingLike
): number => {
  const values = [
    bill.paidAmount,
    bill.paid,
    bill.amountPaid,
  ];

  for (
    const value of values
  ) {
    const amount = toAmount(value);

    if (amount > 0) {
      return amount;
    }
  }

  return 0;
};

/**
 * Calculate remaining amount.
 *
 * NEVER allow negative due.
 */
const getBillDueAmount = (
  bill: BillingLike
): number => {
  const total =
    getBillTotal(bill);

  const paid =
    getBillPaidAmount(bill);

  return Math.max(
    total - paid,
    0
  );
};

export default function PatientKPIGrid() {
  const { user } = useAuth();

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [kpis, setKpis] =
    useState<PatientKPIData>({
      upcomingAppointments: 0,
      activePrescriptions: 0,
      medicalRecords: 0,
      pendingBills: 0,
    });

  useEffect(() => {
    let mounted = true;

    async function loadKPIs() {
      try {
        setLoading(true);

        /*
         * ======================================================
         * 1. FIND CURRENT PATIENT
         * ======================================================
         */

        let currentPatientId:
          | string
          | null = null;

        /*
         * First try localStorage because the login flow
         * stores the patient ID when available.
         */
        if (
          typeof window !==
          'undefined'
        ) {
          currentPatientId =
            localStorage.getItem(
              'patientId'
            );
        }

        /*
         * If patientId is not available in localStorage,
         * find the patient from the API using email.
         */
        if (
          !currentPatientId &&
          user?.email
        ) {
          try {
            const patients =
              await patientService.getPatients();

            const currentPatient =
              patients.find(
                (patient) =>
                  patient.email
                    ?.toLowerCase() ===
                  user.email
                    ?.toLowerCase()
              );

            if (
              currentPatient
            ) {
              currentPatientId =
                currentPatient.id;

              /*
               * Store it so subsequent pages can use
               * the same patient identity.
               */
              if (
                typeof window !==
                'undefined'
              ) {
                localStorage.setItem(
                  'patientId',
                  currentPatient.id
                );
              }
            }
          } catch (error) {
            console.error(
              'Failed to find current patient:',
              error
            );
          }
        }

        /*
         * ======================================================
         * 2. LOAD ALL AVAILABLE DATA
         * ======================================================
         */

        const [
          appointmentsResult,
          prescriptionsResult,
          medicalRecordsResult,
          billingsResult,
        ] = await Promise.allSettled([
          currentPatientId
            ? appointmentService.getAppointmentsByPatientId(
                currentPatientId
              )
            : Promise.resolve([]),

          prescriptionService.getPrescriptions(),

          medicalRecordService.getMedicalRecords(),

          billingService.getBillings(),
        ]);

        if (!mounted) {
          return;
        }

        /*
         * ======================================================
         * CURRENT PATIENT NAME
         * ======================================================
         */

        const currentPatientName =
          user
            ? `${user.firstName ?? ''} ${
                user.lastName ?? ''
              }`
                .trim()
                .toLowerCase()
            : '';

        /*
         * ======================================================
         * UPCOMING APPOINTMENTS
         * ======================================================
         */

        let upcomingAppointments = 0;

        if (
          appointmentsResult.status ===
          'fulfilled'
        ) {
          const appointments =
            appointmentsResult.value;

          const now = new Date();

          upcomingAppointments =
            appointments.filter(
              (appointment) => {
                if (
                  appointment.status ===
                    'CANCELLED' ||
                  appointment.status ===
                    'COMPLETED'
                ) {
                  return false;
                }

                const appointmentDateTime =
                  new Date(
                    `${appointment.appointmentDate}T${appointment.appointmentTime}`
                  );

                return (
                  !Number.isNaN(
                    appointmentDateTime.getTime()
                  ) &&
                  appointmentDateTime >=
                    now
                );
              }
            ).length;
        }

        /*
         * ======================================================
         * PRESCRIPTIONS
         * ======================================================
         */

        let activePrescriptions = 0;

        if (
          prescriptionsResult.status ===
          'fulfilled'
        ) {
          const prescriptions =
            prescriptionsResult.value;

          const patientPrescriptions =
            currentPatientName
              ? prescriptions.filter(
                  (prescription) =>
                    prescription.patientName
                      ?.trim()
                      .toLowerCase() ===
                    currentPatientName
                )
              : prescriptions;

          activePrescriptions =
            patientPrescriptions.length;
        }

        /*
         * ======================================================
         * MEDICAL RECORDS
         * ======================================================
         */

        let medicalRecords = 0;

        if (
          medicalRecordsResult.status ===
          'fulfilled'
        ) {
          const records =
            medicalRecordsResult.value;

          const patientRecords =
            currentPatientName
              ? records.filter(
                  (record) =>
                    record.patientName
                      ?.trim()
                      .toLowerCase() ===
                    currentPatientName
                )
              : records;

          medicalRecords =
            patientRecords.length;
        }

        /*
         * ======================================================
         * PENDING BILLS
         * ======================================================
         */

        let pendingBills = 0;

        if (
          billingsResult.status ===
          'fulfilled'
        ) {
          const billings =
            billingsResult.value as BillingLike[];

          /*
           * Filter billing records belonging to the
           * currently logged-in patient.
           *
           * Priority:
           *
           * 1. patientId
           * 2. patientName
           *
           * This prevents another patient's bill from
           * appearing on John's dashboard.
           */
          const patientBills =
            billings.filter(
              (bill) => {
                const billPatientId =
                  bill.patientId
                    ?.toString()
                    .toLowerCase();

                if (
                  currentPatientId &&
                  billPatientId
                ) {
                  return (
                    billPatientId ===
                    currentPatientId
                      .toLowerCase()
                  );
                }

                if (
                  currentPatientName &&
                  bill.patientName
                ) {
                  return (
                    bill.patientName
                      .trim()
                      .toLowerCase() ===
                    currentPatientName
                  );
                }

                return false;
              }
            );

          /*
           * IMPORTANT:
           *
           * Do NOT use bill.dueAmount directly.
           *
           * Receptionist billing follows:
           *
           * due = max(total - paid, 0)
           */
          pendingBills =
            patientBills.reduce(
              (
                total,
                bill
              ) => {
                return (
                  total +
                  getBillDueAmount(
                    bill
                  )
                );
              },
              0
            );
        }

        /*
         * ======================================================
         * UPDATE KPI STATE
         * ======================================================
         */

        setKpis({
          upcomingAppointments,
          activePrescriptions,
          medicalRecords,
          pendingBills,
        });
      } catch (error) {
        console.error(
          'Failed to load patient dashboard KPIs:',
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadKPIs();

    return () => {
      mounted = false;
    };
  }, [
    user?.email,
    user?.firstName,
    user?.lastName,
  ]);

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <MetricCardSkeleton
            key={index}
          />
        ))}
      </div>
    );
  }

  /*
   * ==========================================================
   * FORMAT PENDING BILL
   * ==========================================================
   */

  const formattedPendingBills =
    `₹${Math.max(
      kpis.pendingBills,
      0
    ).toLocaleString('en-IN')}`;

  /*
   * ==========================================================
   * KPI DATA
   * ==========================================================
   */

  const metrics = [
    {
      id: 'pkpi-1',

      title:
        'Upcoming Appointments',

      value:
        kpis.upcomingAppointments.toString(),

      subtitle:
        kpis.upcomingAppointments === 0
          ? 'No upcoming visits'
          : 'Scheduled consultations',

      trend: {
        value: 0,
        label: 'Current schedule',
      },

      icon: (
        <CalendarDays
          size={20}
          className="text-primary"
        />
      ),

      iconBg:
        'bg-primary/10',

      variant:
        'primary' as const,

      route:
        '/patient-dashboard/appointments',
    },

    {
      id: 'pkpi-2',

      title:
        'Prescriptions',

      value:
        kpis.activePrescriptions.toString(),

      subtitle:
        kpis.activePrescriptions === 0
          ? 'No prescriptions found'
          : 'Prescriptions available',

      trend: {
        value: 0,
        label: 'Current records',
      },

      icon: (
        <FileText
          size={20}
          className="text-positive"
        />
      ),

      iconBg:
        'bg-[var(--positive-bg)]',

      variant:
        'positive' as const,

      route:
        '/patient-dashboard/prescriptions',
    },

    {
      id: 'pkpi-3',

      title:
        'Medical Records',

      value:
        kpis.medicalRecords.toString(),

      subtitle:
        kpis.medicalRecords === 0
          ? 'No records found'
          : 'Available medical records',

      trend: {
        value: 0,
        label: 'Current records',
      },

      icon: (
        <FolderOpen
          size={20}
          className="text-warning"
        />
      ),

      iconBg:
        'bg-[var(--warning-bg)]',

      variant:
        'warning' as const,

      route:
        '/patient-dashboard/medical-records',
    },

    {
      id: 'pkpi-4',

      title:
        'Pending Bills',

      value:
        formattedPendingBills,

      subtitle:
        kpis.pendingBills === 0
          ? 'No pending amount'
          : 'Amount currently due',

      trend: {
        value: 0,
        label: 'Current balance',
      },

      icon: (
        <CreditCard
          size={20}
          className="text-accent"
        />
      ),

      iconBg:
        'bg-accent/10',

      variant:
        'default' as const,

      route:
        '/patient-dashboard/billing',
    },
  ];

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

      {metrics.map(
        (metric) => (
          <div
            key={metric.id}
            role="button"
            tabIndex={0}
            onClick={() =>
              router.push(
                metric.route
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' ||
                event.key === ' '
              ) {
                event.preventDefault();

                router.push(
                  metric.route
                );
              }
            }}
            className="
              cursor-pointer
              rounded-xl
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
              focus:outline-none
              focus:ring-2
              focus:ring-primary/30
            "
          >
            <MetricCard
              title={
                metric.title
              }
              value={
                metric.value
              }
              subtitle={
                metric.subtitle
              }
              trend={
                metric.trend
              }
              icon={
                metric.icon
              }
              iconBg={
                metric.iconBg
              }
              variant={
                metric.variant
              }
            />
          </div>
        )
      )}

    </div>
  );
}