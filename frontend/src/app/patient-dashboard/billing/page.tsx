'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import AppLayout from '@/components/AppLayout';

import type { Billing } from '@/types/Billing';
import type { Appointment } from '@/types/Appointment';

import billingService from '@/services/billingService';
import appointmentService from '@/services/appointmentService';

import {
  Receipt,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react';

/* ============================================================
   BILLING HELPERS

   Receptionist billing rule:

   TOTAL = actual bill amount
   PAID  = actual payment
   DUE   = max(TOTAL - PAID, 0)

   The patient billing page uses exactly the same rule.
============================================================ */

type BillingLike =
  Billing & {
    patientId?: string | null;

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
  const amount =
    Number(value);

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
 * Normally this is totalAmount from the receptionist
 * billing record.
 *
 * Fallback fields are supported for older API records.
 */
const getBillTotal = (
  bill: BillingLike
): number => {
  const totalAmount =
    toAmount(
      bill.totalAmount
    );

  if (
    totalAmount > 0
  ) {
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
    const amount =
      toAmount(value);

    if (
      amount > 0
    ) {
      return amount;
    }
  }

  /*
   * Repair old billing records where:
   *
   * totalAmount = 0
   * paidAmount  = 2104
   * dueAmount   = -2104
   *
   * The paid amount is the only valid financial
   * amount available in that corrupted record.
   */
  const paidAmount =
    getBillPaidAmount(
      bill
    );

  if (
    paidAmount > 0
  ) {
    return paidAmount;
  }

  return 0;
};

/**
 * Get actual paid amount.
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
    const amount =
      toAmount(value);

    if (
      amount > 0
    ) {
      return amount;
    }
  }

  return 0;
};

/**
 * Calculate remaining amount.
 *
 * IMPORTANT:
 * Never use backend dueAmount directly.
 *
 * This prevents values such as:
 *
 * -₹2,104
 * -₹2,330
 *
 * from appearing in the UI.
 */
const getBillDueAmount = (
  bill: BillingLike
): number => {
  const total =
    getBillTotal(
      bill
    );

  const paid =
    getBillPaidAmount(
      bill
    );

  return Math.max(
    total - paid,
    0
  );
};

/**
 * Get normalized payment status.
 *
 * Status is calculated from the actual total
 * and paid amounts instead of trusting potentially
 * stale paymentStatus values.
 */
const getCalculatedStatus = (
  bill: BillingLike
): 'PAID' | 'PARTIAL' | 'PENDING' | 'CANCELLED' => {
  const backendStatus =
    String(
      bill.paymentStatus ?? ''
    )
      .trim()
      .toLowerCase();

  if (
    backendStatus ===
      'cancelled' ||
    backendStatus ===
      'canceled'
  ) {
    return 'CANCELLED';
  }

  const total =
    getBillTotal(
      bill
    );

  const paid =
    getBillPaidAmount(
      bill
    );

  const due =
    Math.max(
      total - paid,
      0
    );

  if (
    total <= 0
  ) {
    return 'PENDING';
  }

  if (
    due <= 0 &&
    paid >= total
  ) {
    return 'PAID';
  }

  if (
    paid > 0 &&
    paid < total
  ) {
    return 'PARTIAL';
  }

  return 'PENDING';
};

export default function BillingPage() {
  const [bills, setBills] =
    useState<Billing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  // =========================================================
  // LOAD BILLING
  // =========================================================

  const loadBilling =
    async () => {
      try {
        setLoading(true);
        setError(null);

        /*
         * -----------------------------------------------------
         * Get logged-in patient ID
         * -----------------------------------------------------
         */

        let patientId =
          localStorage.getItem(
            'patientId'
          );

        /*
         * -----------------------------------------------------
         * If patientId is not available, stop here.
         * -----------------------------------------------------
         */

        if (!patientId) {
          setBills([]);

          setError(
            'Patient information could not be found. Please login again.'
          );

          return;
        }

        /*
         * -----------------------------------------------------
         * Get patient's appointments
         * -----------------------------------------------------
         */

        const patientAppointments:
          Appointment[] =
          await appointmentService.getAppointmentsByPatientId(
            patientId
          );

        /*
         * -----------------------------------------------------
         * Get ALL billing records.
         *
         * These are the same billing records created/
         * updated by the receptionist billing page.
         * -----------------------------------------------------
         */

        const allBills =
          await billingService.getBillings();

        /*
         * -----------------------------------------------------
         * Get patient's appointment IDs
         * -----------------------------------------------------
         */

        const patientAppointmentIds =
          new Set(
            patientAppointments.map(
              (
                appointment
              ) =>
                appointment.id
            )
          );

        /*
         * -----------------------------------------------------
         * Filter bills.
         *
         * Primary:
         *   patientId
         *
         * Fallback:
         *   appointmentId
         *
         * This allows the page to work with both new and
         * older billing records.
         * -----------------------------------------------------
         */

        const patientBills =
          (
            allBills as BillingLike[]
          ).filter(
            (bill) => {
              /*
               * New billing records should contain
               * patientId.
               */
              if (
                bill.patientId
              ) {
                return (
                  bill.patientId
                    .toString()
                    .toLowerCase() ===
                  patientId
                    .toString()
                    .toLowerCase()
                );
              }

              /*
               * Older records can be associated through
               * appointmentId.
               */
              return patientAppointmentIds.has(
                bill.appointmentId
              );
            }
          );

        setBills(
          patientBills as Billing[]
        );
      } catch (err) {
        console.error(
          'Failed to load billing:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load billing information.'
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadBilling();
  }, []);

  // =========================================================
  // NORMALIZED BILL DATA
  //
  // Every calculation on this page uses this normalized
  // representation.
  // =========================================================

  const normalizedBills =
    useMemo(() => {
      return (
        bills as BillingLike[]
      ).map(
        (bill) => {
          const total =
            getBillTotal(
              bill
            );

          const rawPaid =
            getBillPaidAmount(
              bill
            );

          /*
           * Never allow paid to exceed total.
           */
          const paid =
            Math.min(
              rawPaid,
              total
            );

          const due =
            Math.max(
              total - paid,
              0
            );

          const status =
            getCalculatedStatus(
              bill
            );

          return {
            bill,
            total,
            paid,
            due,
            status,
          };
        }
      );
    }, [bills]);

  // =========================================================
  // TOTAL AMOUNT
  // =========================================================

  const totalAmount =
    useMemo(() => {
      return normalizedBills.reduce(
        (
          total,
          item
        ) =>
          total +
          item.total,
        0
      );
    }, [
      normalizedBills,
    ]);

  // =========================================================
  // PAID AMOUNT
  // =========================================================

  const paidAmount =
    useMemo(() => {
      return normalizedBills.reduce(
        (
          total,
          item
        ) =>
          total +
          item.paid,
        0
      );
    }, [
      normalizedBills,
    ]);

  // =========================================================
  // PENDING / DUE AMOUNT
  // =========================================================

  const pendingAmount =
    useMemo(() => {
      return normalizedBills.reduce(
        (
          total,
          item
        ) =>
          total +
          item.due,
        0
      );
    }, [
      normalizedBills,
    ]);

  // =========================================================
  // CANCELLED AMOUNT
  // =========================================================

  const cancelledAmount =
    useMemo(() => {
      return normalizedBills
        .filter(
          (item) =>
            item.status ===
            'CANCELLED'
        )
        .reduce(
          (
            total,
            item
          ) =>
            total +
            item.total,
          0
        );
    }, [
      normalizedBills,
    ]);

  // =========================================================
  // CURRENCY FORMAT
  // =========================================================

  const formatCurrency = (
    amount: number
  ) => {
    const safeAmount =
      Math.max(
        Number(amount) || 0,
        0
      );

    return `₹${safeAmount.toLocaleString(
      'en-IN'
    )}`;
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (
    value: string
  ) => {
    if (!value) {
      return '—';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (
    status:
      | 'PAID'
      | 'PARTIAL'
      | 'PENDING'
      | 'CANCELLED'
  ) => {
    switch (
      status
    ) {
      case 'PAID':
        return {
          className:
            'bg-green-100 text-green-700',
          icon:
            <CheckCircle2
              size={14}
            />,
          label:
            'PAID',
        };

      case 'PARTIAL':
        return {
          className:
            'bg-yellow-100 text-yellow-700',
          icon:
            <Clock3
              size={14}
            />,
          label:
            'PARTIAL',
        };

      case 'PENDING':
        return {
          className:
            'bg-yellow-100 text-yellow-700',
          icon:
            <Clock3
              size={14}
            />,
          label:
            'PENDING',
        };

      case 'CANCELLED':
        return {
          className:
            'bg-red-100 text-red-700',
          icon:
            <XCircle
              size={14}
            />,
          label:
            'CANCELLED',
        };

      default:
        return {
          className:
            'bg-gray-100 text-gray-700',
          icon:
            <Clock3
              size={14}
            />,
          label:
            'UNKNOWN',
        };
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <AppLayout
        role="patient"
        breadcrumbs={[
          {
            label:
              'Dashboard',
            href:
              '/patient-dashboard',
          },
          {
            label:
              'Billing',
          },
        ]}
      >
        <div className="flex items-center justify-center py-20">

          <div className="flex items-center gap-2 text-sm text-muted-foreground">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading billing information...

          </div>

        </div>
      </AppLayout>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <AppLayout
        role="patient"
        breadcrumbs={[
          {
            label:
              'Dashboard',
            href:
              '/patient-dashboard',
          },
          {
            label:
              'Billing',
          },
        ]}
      >
        <div className="space-y-6">

          <div>

            <h1 className="text-3xl font-bold">
              Billing
            </h1>

            <p className="text-muted-foreground mt-2">
              View your invoices and payment history.
            </p>

          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">

            <div className="flex items-start gap-3">

              <XCircle
                size={20}
                className="text-red-600 mt-0.5"
              />

              <div>

                <p className="font-semibold text-red-700">
                  Unable to load billing
                </p>

                <p className="text-sm text-red-600 mt-1">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    loadBilling
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition"
                >
                  <RefreshCw
                    size={15}
                  />

                  Try Again
                </button>

              </div>

            </div>

          </div>

        </div>
      </AppLayout>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <AppLayout
      role="patient"
      breadcrumbs={[
        {
          label:
            'Dashboard',
          href:
            '/patient-dashboard',
        },
        {
          label:
            'Billing',
        },
      ]}
    >

      <div className="space-y-6">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Billing
            </h1>

            <p className="text-muted-foreground mt-2">
              View your invoices and payment history.
            </p>

          </div>

          <button
            type="button"
            onClick={
              loadBilling
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted transition"
          >
            <RefreshCw
              size={16}
            />

            Refresh
          </button>

        </div>

        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* TOTAL */}

          <div className="rounded-xl border bg-card p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Total Bills
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {formatCurrency(
                    totalAmount
                  )}
                </h2>

              </div>

              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">

                <Receipt
                  size={19}
                  className="text-blue-600"
                />

              </div>

            </div>

            <p className="text-xs text-muted-foreground mt-3">
              {bills.length}{' '}
              {bills.length ===
              1
                ? 'bill'
                : 'bills'}
            </p>

          </div>

          {/* PAID */}

          <div className="rounded-xl border bg-card p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Paid
                </p>

                <h2 className="text-2xl font-bold text-green-600 mt-2">
                  {formatCurrency(
                    paidAmount
                  )}
                </h2>

              </div>

              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">

                <CheckCircle2
                  size={19}
                  className="text-green-600"
                />

              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="rounded-xl border bg-card p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Pending
                </p>

                <h2 className="text-2xl font-bold text-yellow-600 mt-2">
                  {formatCurrency(
                    pendingAmount
                  )}
                </h2>

              </div>

              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">

                <Clock3
                  size={19}
                  className="text-yellow-600"
                />

              </div>

            </div>

          </div>

          {/* CANCELLED */}

          <div className="rounded-xl border bg-card p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Cancelled
                </p>

                <h2 className="text-2xl font-bold text-red-600 mt-2">
                  {formatCurrency(
                    cancelledAmount
                  )}
                </h2>

              </div>

              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">

                <XCircle
                  size={19}
                  className="text-red-600"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            PAYMENT HISTORY
        =================================================== */}

        <div className="rounded-xl border bg-card overflow-hidden">

          <div className="px-5 py-4 border-b">

            <div className="flex items-center gap-2">

              <Receipt
                size={18}
                className="text-primary"
              />

              <h2 className="font-semibold">
                Payment History
              </h2>

            </div>

            <p className="text-sm text-muted-foreground mt-1">
              Your billing and payment records.
            </p>

          </div>

          {/* EMPTY */}

          {bills.length ===
          0 ? (
            <div className="p-12 text-center">

              <Receipt
                size={42}
                className="mx-auto text-muted-foreground"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No billing records found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                You currently do not have any billing records associated with your appointments.
              </p>

            </div>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-muted/40">

                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">

                    <th className="px-5 py-3">
                      Invoice
                    </th>

                    <th className="px-5 py-3">
                      Doctor
                    </th>

                    <th className="px-5 py-3">
                      Bill Date
                    </th>

                    <th className="px-5 py-3">
                      Total
                    </th>

                    <th className="px-5 py-3">
                      Paid
                    </th>

                    <th className="px-5 py-3">
                      Due
                    </th>

                    <th className="px-5 py-3">
                      Payment
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {normalizedBills.map(
                    (
                      item
                    ) => {

                      const bill =
                        item.bill;

                      const status =
                        getStatusStyle(
                          item.status
                        );

                      return (
                        <tr
                          key={
                            bill.id
                          }
                          className="border-t hover:bg-muted/20 transition"
                        >

                          {/* INVOICE */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <Receipt
                                size={16}
                                className="text-primary"
                              />

                              <span className="font-semibold text-primary">

                                {bill.invoiceNumber ||
                                  '—'}

                              </span>

                            </div>

                          </td>

                          {/* DOCTOR */}

                          <td className="px-5 py-4 text-sm">

                            {bill.doctorName ||
                              '—'}

                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4 text-sm whitespace-nowrap">

                            {formatDate(
                              bill.billDate
                            )}

                          </td>

                          {/* TOTAL */}

                          <td className="px-5 py-4">

                            <span className="font-semibold">

                              {formatCurrency(
                                item.total
                              )}

                            </span>

                          </td>

                          {/* PAID */}

                          <td className="px-5 py-4">

                            <span className="font-semibold text-green-600">

                              {formatCurrency(
                                item.paid
                              )}

                            </span>

                          </td>

                          {/* DUE */}

                          <td className="px-5 py-4">

                            <span
                              className={`font-semibold ${
                                item.due >
                                0
                                  ? 'text-yellow-600'
                                  : 'text-muted-foreground'
                              }`}
                            >

                              {formatCurrency(
                                item.due
                              )}

                            </span>

                          </td>

                          {/* PAYMENT METHOD */}

                          <td className="px-5 py-4 text-sm">

                            {bill.paymentMethod ||
                              '—'}

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                            >

                              {status.icon}

                              {status.label}

                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </AppLayout>
  );
}