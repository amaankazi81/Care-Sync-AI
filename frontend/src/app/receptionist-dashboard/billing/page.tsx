'use client';

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';

import AppLayout from '@/components/AppLayout';

import useAppointments from '@/hooks/useAppointments';

import billingService from '@/services/billingService';

import type { Billing } from '@/types/Billing';

import {
  Receipt,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock3,
  XCircle,
  IndianRupee,
  Plus,
  X,
  CreditCard,
  Wallet,
  Banknote,
} from 'lucide-react';

import { toast } from 'sonner';

/*
 * ============================================================
 * BILLING PAGE
 * ============================================================
 *
 * Billing workflow:
 *
 * 1. Create Bill
 * 2. If partially paid:
 *      -> Record Payment
 * 3. If remaining amount is paid:
 *      -> Bill automatically becomes PAID
 * 4. Fully paid bills:
 *      -> No payment action
 *
 * IMPORTANT:
 *
 * The backend may sometimes return inconsistent financial
 * values such as:
 *
 * totalAmount = 0
 * paidAmount  = 2330
 * dueAmount   = 0
 *
 * In that situation the UI derives:
 *
 * displayedTotal = paidAmount + dueAmount
 *
 * so that a fully paid bill is not displayed as ₹0.
 * ============================================================
 */

/*
 * ============================================================
 * NORMALIZED BILL
 * ============================================================
 */

interface NormalizedBill {
  total: number;
  paid: number;
  due: number;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'CANCELLED';
}

/*
 * ============================================================
 * CURRENCY HELPER
 * ============================================================
 */

function toNumber(
  value: unknown
): number {
  const number =
    Number(value ?? 0);

  return Number.isFinite(number)
    ? number
    : 0;
}

/*
 * ============================================================
 * NORMALIZE BILL FINANCIAL DATA
 * ============================================================
 *
 * This protects the UI from inconsistent backend values.
 *
 * Examples:
 *
 * total = 0
 * paid  = 2330
 * due   = 0
 *
 * becomes:
 *
 * total = 2330
 * paid  = 2330
 * due   = 0
 *
 * Another example:
 *
 * total = 3000
 * paid  = 1000
 * due   = 2000
 *
 * remains:
 *
 * total = 3000
 * paid  = 1000
 * due   = 2000
 * ============================================================
 */

function normalizeBill(
  bill: Billing
): NormalizedBill {
  const rawTotal =
    Math.max(
      toNumber(
        bill.totalAmount
      ),
      0
    );

  const paid =
    Math.max(
      toNumber(
        bill.paidAmount
      ),
      0
    );

  const rawDue =
    Math.max(
      toNumber(
        bill.dueAmount
      ),
      0
    );

  /*
   * If backend total is missing/zero but paid or due exists,
   * reconstruct the total from paid + due.
   */

  let total =
    rawTotal;

  if (
    total <= 0 &&
    (paid > 0 ||
      rawDue > 0)
  ) {
    total =
      paid +
      rawDue;
  }

  /*
   * If backend total is smaller than paid + due,
   * use paid + due because those two values represent the
   * actual financial state.
   */

  if (
    paid + rawDue >
    total
  ) {
    total =
      paid + rawDue;
  }

  /*
   * Calculate the actual outstanding amount.
   *
   * This prevents negative dues.
   */

  const calculatedDue =
    Math.max(
      total - paid,
      0
    );

  /*
   * Prefer the calculated due amount because it is safer
   * than blindly trusting an inconsistent backend dueAmount.
   */

  const due =
    calculatedDue;

  /*
   * ========================================================
   * STATUS
   * ========================================================
   */

  const backendStatus =
    String(
      bill.paymentStatus ??
        ''
    )
      .trim()
      .toLowerCase();

  if (
    backendStatus ===
      'cancelled' ||
    backendStatus ===
      'canceled'
  ) {
    return {
      total,
      paid,
      due,
      status:
        'CANCELLED',
    };
  }

  /*
   * If there is an outstanding amount:
   *
   * paid > 0  -> PARTIAL
   * paid = 0  -> PENDING
   */

  if (due > 0) {
    return {
      total,
      paid,
      due,
      status:
        paid > 0
          ? 'PARTIAL'
          : 'PENDING',
    };
  }

  /*
   * No due amount means the bill is fully settled.
   */

  if (
    total > 0 &&
    paid >= total
  ) {
    return {
      total,
      paid,
      due: 0,
      status: 'PAID',
    };
  }

  /*
   * Fallback.
   */

  return {
    total,
    paid,
    due,
    status:
      paid > 0
        ? 'PAID'
        : 'PENDING',
  };
}

/*
 * ============================================================
 * MAIN PAGE
 * ============================================================
 */

export default function ReceptionistBillingPage() {
  const {
    appointments,
    loading:
      appointmentsLoading,
  } = useAppointments();

  /*
   * ==========================================================
   * BILLING STATE
   * ==========================================================
   */

  const [bills, setBills] =
    useState<Billing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [
    recordingPayment,
    setRecordingPayment,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  /*
   * ==========================================================
   * CREATE BILL MODAL
   * ==========================================================
   */

  const [
    showCreateForm,
    setShowCreateForm,
  ] = useState(false);

  /*
   * ==========================================================
   * PAYMENT MODAL
   * ==========================================================
   */

  const [
    showPaymentModal,
    setShowPaymentModal,
  ] = useState(false);

  const [
    selectedBill,
    setSelectedBill,
  ] = useState<Billing | null>(
    null
  );

  const [
    paymentAmount,
    setPaymentAmount,
  ] = useState('');

  const [
    recordPaymentMethod,
    setRecordPaymentMethod,
  ] = useState('UPI');

  /*
   * ==========================================================
   * CREATE BILL FORM
   * ==========================================================
   */

  const [
    appointmentId,
    setAppointmentId,
  ] = useState('');

  const [
    consultationFee,
    setConsultationFee,
  ] = useState('');

  const [
    medicineCharges,
    setMedicineCharges,
  ] = useState('');

  const [
    labCharges,
    setLabCharges,
  ] = useState('');

  const [
    otherCharges,
    setOtherCharges,
  ] = useState('');

  const [
    paidAmount,
    setPaidAmount,
  ] = useState('');

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState('UPI');

  /*
   * ==========================================================
   * LOAD BILLINGS
   * ==========================================================
   */

  const loadBillings =
    async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await billingService.getBillings();

        setBills(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          'Failed to load billings:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load billing records.'
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * ==========================================================
   * INITIAL LOAD
   * ==========================================================
   */

  useEffect(() => {
    loadBillings();
  }, []);

  /*
   * ==========================================================
   * NORMALIZED BILL DATA
   * ==========================================================
   */

  const normalizedBills =
    useMemo(() => {
      return bills.map(
        (bill) => ({
          bill,
          financial:
            normalizeBill(
              bill
            ),
        })
      );
    }, [bills]);

  /*
   * ==========================================================
   * TOTAL BILL AMOUNT
   * ==========================================================
   */

  const totalAmount =
    useMemo(() => {
      return normalizedBills.reduce(
        (sum, item) =>
          sum +
          item.financial
            .total,
        0
      );
    }, [
      normalizedBills,
    ]);

  /*
   * ==========================================================
   * TOTAL PAID
   * ==========================================================
   */

  const paidAmountTotal =
    useMemo(() => {
      return normalizedBills.reduce(
        (sum, item) =>
          sum +
          item.financial
            .paid,
        0
      );
    }, [
      normalizedBills,
    ]);

  /*
   * ==========================================================
   * TOTAL DUE
   * ==========================================================
   */

  const dueAmountTotal =
    useMemo(() => {
      return normalizedBills.reduce(
        (sum, item) =>
          sum +
          item.financial
            .due,
        0
      );
    }, [
      normalizedBills,
    ]);

  /*
   * ==========================================================
   * CANCELLED AMOUNT
   * ==========================================================
   */

  const cancelledAmount =
    useMemo(() => {
      return normalizedBills
        .filter(
          (item) =>
            item.financial
              .status ===
            'CANCELLED'
        )
        .reduce(
          (sum, item) =>
            sum +
            item.financial
              .total,
          0
        );
    }, [
      normalizedBills,
    ]);

  /*
   * ==========================================================
   * CREATE FORM TOTAL
   * ==========================================================
   */

  const formTotal =
    Number(
      consultationFee || 0
    ) +
    Number(
      medicineCharges || 0
    ) +
    Number(
      labCharges || 0
    ) +
    Number(
      otherCharges || 0
    );

  /*
   * ==========================================================
   * CREATE FORM PAID
   * ==========================================================
   */

  const formPaid =
    Number(
      paidAmount || 0
    );

  /*
   * ==========================================================
   * CREATE FORM DUE
   * ==========================================================
   */

  const formDue =
    Math.max(
      formTotal -
        formPaid,
      0
    );

  /*
   * ==========================================================
   * SELECTED BILL FINANCIAL DATA
   * ==========================================================
   */

  const selectedBillFinancial =
    selectedBill
      ? normalizeBill(
          selectedBill
        )
      : null;

  const selectedBillDue =
    selectedBillFinancial
      ?.due ?? 0;

  /*
   * ==========================================================
   * ENTERED PAYMENT
   * ==========================================================
   */

  const enteredPaymentAmount =
    Number(
      paymentAmount || 0
    );

  /*
   * ==========================================================
   * REMAINING AFTER PAYMENT
   * ==========================================================
   */

  const remainingAfterPayment =
    Math.max(
      selectedBillDue -
        enteredPaymentAmount,
      0
    );

  /*
   * ==========================================================
   * FORMAT CURRENCY
   * ==========================================================
   */

  const formatCurrency =
    (amount: number) => {
      return `₹${Number(
        amount || 0
      ).toLocaleString(
        'en-IN'
      )}`;
    };

  /*
   * ==========================================================
   * FORMAT DATE
   * ==========================================================
   */

  const formatDate =
    (value: string) => {
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

  /*
   * ==========================================================
   * RESET CREATE FORM
   * ==========================================================
   */

  const resetForm =
    () => {
      setAppointmentId('');
      setConsultationFee('');
      setMedicineCharges('');
      setLabCharges('');
      setOtherCharges('');
      setPaidAmount('');
      setPaymentMethod(
        'UPI'
      );
    };

  /*
   * ==========================================================
   * CREATE BILL
   * ==========================================================
   */

  const handleCreateBill =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      if (!appointmentId) {
        toast.error(
          'Please select an appointment.'
        );

        return;
      }

      if (formTotal <= 0) {
        toast.error(
          'Please enter at least one charge.'
        );

        return;
      }

      if (
        formPaid < 0 ||
        formPaid > formTotal
      ) {
        toast.error(
          'Paid amount cannot be greater than total amount.'
        );

        return;
      }

      try {
        setCreating(true);

        const created =
          await billingService.createBilling(
            {
              appointmentId,

              consultationFee:
                Number(
                  consultationFee ||
                    0
                ),

              medicineCharges:
                Number(
                  medicineCharges ||
                    0
                ),

              labCharges:
                Number(
                  labCharges ||
                    0
                ),

              otherCharges:
                Number(
                  otherCharges ||
                    0
                ),

              paidAmount:
                Number(
                  paidAmount || 0
                ),

              paymentMethod,
            }
          );

        /*
         * Add newly created bill.
         */

        setBills(
          (previous) => [
            created,
            ...previous,
          ]
        );

        toast.success(
          `Bill ${
            created.invoiceNumber ||
            ''
          } created successfully.`
        );

        resetForm();

        setShowCreateForm(
          false
        );

        /*
         * Reload once more so frontend exactly matches
         * backend state.
         */

        await loadBillings();
      } catch (err) {
        console.error(
          'Failed to create bill:',
          err
        );

        toast.error(
          err instanceof Error
            ? err.message
            : 'Failed to create bill.'
        );
      } finally {
        setCreating(false);
      }
    };

  /*
   * ==========================================================
   * OPEN PAYMENT MODAL
   * ==========================================================
   */

  const openPaymentModal =
    (
      bill: Billing
    ) => {
      const financial =
        normalizeBill(
          bill
        );

      /*
       * Cancelled bills cannot receive payment.
       */

      if (
        financial.status ===
        'CANCELLED'
      ) {
        toast.error(
          'Payment cannot be recorded for a cancelled bill.'
        );

        return;
      }

      /*
       * Fully paid bills do not need payment.
       */

      if (
        financial.due <= 0
      ) {
        toast.info(
          'This bill is already fully paid.'
        );

        return;
      }

      setSelectedBill(
        bill
      );

      /*
       * Automatically enter complete outstanding amount.
       */

      setPaymentAmount(
        financial.due.toString()
      );

      setRecordPaymentMethod(
        bill.paymentMethod ||
          'UPI'
      );

      setShowPaymentModal(
        true
      );
    };

  /*
   * ==========================================================
   * CLOSE PAYMENT MODAL
   * ==========================================================
   */

  const closePaymentModal =
    () => {
      if (
        recordingPayment
      ) {
        return;
      }

      setShowPaymentModal(
        false
      );

      setSelectedBill(
        null
      );

      setPaymentAmount('');

      setRecordPaymentMethod(
        'UPI'
      );
    };

  /*
   * ==========================================================
   * RECORD PAYMENT
   * ==========================================================
   */

  const handleRecordPayment =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      if (!selectedBill) {
        toast.error(
          'No bill selected.'
        );

        return;
      }

      const financial =
        normalizeBill(
          selectedBill
        );

      const amount =
        Number(
          paymentAmount || 0
        );

      const due =
        financial.due;

      if (amount <= 0) {
        toast.error(
          'Please enter a valid payment amount.'
        );

        return;
      }

      if (amount > due) {
        toast.error(
          'Payment amount cannot be greater than the outstanding due amount.'
        );

        return;
      }

      if (
        financial.status ===
        'CANCELLED'
      ) {
        toast.error(
          'Payment cannot be recorded for a cancelled bill.'
        );

        return;
      }

      try {
        setRecordingPayment(
          true
        );

        /*
         * Existing paid amount.
         */

        const currentPaid =
          financial.paid;

        /*
         * New paid amount.
         */

        const newPaidAmount =
          currentPaid +
          amount;

        /*
         * Update backend.
         */

        await billingService.updateBilling(
          selectedBill.id,
          {
            paidAmount:
              newPaidAmount,

            paymentMethod:
              recordPaymentMethod,
          }
        );

        /*
         * IMPORTANT:
         *
         * Reload the database state rather than trusting
         * the update response.
         */

        await loadBillings();

        toast.success(
          `Payment of ${formatCurrency(
            amount
          )} recorded successfully.`
        );

        closePaymentModal();
      } catch (err) {
        console.error(
          'Failed to record payment:',
          err
        );

        toast.error(
          err instanceof Error
            ? err.message
            : 'Failed to record payment.'
        );
      } finally {
        setRecordingPayment(
          false
        );
      }
    };

  /*
   * ==========================================================
   * PAY FULL DUE
   * ==========================================================
   */

  const markFullAmount =
    () => {
      if (
        !selectedBill
      ) {
        return;
      }

      const financial =
        normalizeBill(
          selectedBill
        );

      setPaymentAmount(
        financial.due.toString()
      );
    };

  /*
   * ==========================================================
   * STATUS UI
   * ==========================================================
   */

  const getStatus =
    (
      status:
        | 'PAID'
        | 'PARTIAL'
        | 'PENDING'
        | 'CANCELLED'
    ) => {
      switch (status) {
        case 'PAID':
          return {
            className:
              'bg-green-100 text-green-700',
            icon: (
              <CheckCircle2
                size={14}
              />
            ),
            label: 'PAID',
          };

        case 'PARTIAL':
          return {
            className:
              'bg-yellow-100 text-yellow-700',
            icon: (
              <Clock3
                size={14}
              />
            ),
            label: 'PARTIAL',
          };

        case 'PENDING':
          return {
            className:
              'bg-yellow-100 text-yellow-700',
            icon: (
              <Clock3
                size={14}
              />
            ),
            label: 'PENDING',
          };

        case 'CANCELLED':
          return {
            className:
              'bg-red-100 text-red-700',
            icon: (
              <XCircle
                size={14}
              />
            ),
            label: 'CANCELLED',
          };

        default:
          return {
            className:
              'bg-gray-100 text-gray-700',
            icon: (
              <Clock3
                size={14}
              />
            ),
            label: 'UNKNOWN',
          };
      }
    };

  /*
   * ==========================================================
   * PAYMENT METHOD ICON
   * ==========================================================
   */

  const getPaymentMethodIcon =
    (
      method: string
    ) => {
      switch (
        method?.toLowerCase()
      ) {
        case 'cash':
          return (
            <Banknote
              size={16}
            />
          );

        case 'card':
          return (
            <CreditCard
              size={16}
            />
          );

        default:
          return (
            <Wallet
              size={16}
            />
          );
      }
    };

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (
    loading ||
    appointmentsLoading
  ) {
    return (
      <AppLayout
        role="receptionist"
        breadcrumbs={[
          {
            label:
              'Dashboard',
            href:
              '/receptionist-dashboard',
          },
          {
            label: 'Billing',
          },
        ]}
      >
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading billing...
          </div>
        </div>
      </AppLayout>
    );
  }

  /*
   * ==========================================================
   * PAGE
   * ==========================================================
   */

  return (
    <AppLayout
      role="receptionist"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href:
            '/receptionist-dashboard',
        },
        {
          label: 'Billing',
        },
      ]}
    >
      <div className="space-y-6">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Billing
            </h1>

            <p className="mt-2 text-muted-foreground">
              Create and manage patient bills.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={
                loadBillings
              }
              disabled={
                loading
              }
              className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted transition disabled:opacity-60"
            >
              <RefreshCw
                size={16}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();

                setShowCreateForm(
                  true
                );
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 transition"
            >
              <Plus
                size={17}
              />

              Create Bill
            </button>

          </div>

        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">

            <div className="flex items-center justify-between gap-4">

              <p className="text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  loadBillings
                }
                className="text-sm font-semibold text-red-700 underline"
              >
                Retry
              </button>

            </div>

          </div>
        )}

        {/* ==================================================
            SUMMARY
        ================================================== */}

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <SummaryCard
            title="Total Bills"
            value={formatCurrency(
              totalAmount
            )}
            count={`${bills.length} ${
              bills.length === 1
                ? 'bill'
                : 'bills'
            }`}
            icon={
              <Receipt
                size={19}
              />
            }
            iconClass="bg-blue-100 text-blue-600"
          />

          <SummaryCard
            title="Paid"
            value={formatCurrency(
              paidAmountTotal
            )}
            icon={
              <CheckCircle2
                size={19}
              />
            }
            iconClass="bg-green-100 text-green-600"
          />

          <SummaryCard
            title="Pending"
            value={formatCurrency(
              dueAmountTotal
            )}
            icon={
              <Clock3
                size={19}
              />
            }
            iconClass="bg-yellow-100 text-yellow-600"
          />

          <SummaryCard
            title="Cancelled"
            value={formatCurrency(
              cancelledAmount
            )}
            icon={
              <XCircle
                size={19}
              />
            }
            iconClass="bg-red-100 text-red-600"
          />

        </div>

        {/* ==================================================
            CREATE BILL FORM
        ================================================== */}

        {showCreateForm && (
          <div className="rounded-xl border bg-card shadow-sm">

            <div className="flex items-center justify-between border-b p-5">

              <div>
                <h2 className="text-xl font-bold">
                  Create New Bill
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Generate a bill for a patient visit.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(
                    false
                  );

                  resetForm();
                }}
                className="rounded-lg p-2 hover:bg-muted"
              >
                <X
                  size={20}
                />
              </button>

            </div>

            <form
              onSubmit={
                handleCreateBill
              }
              className="p-5 space-y-6"
            >

              {/* APPOINTMENT */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Appointment
                </label>

                <select
                  value={
                    appointmentId
                  }
                  onChange={(event) =>
                    setAppointmentId(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">
                    Select appointment
                  </option>

                  {appointments
                    .filter(
                      (
                        appointment
                      ) =>
                        appointment.status !==
                        'CANCELLED'
                    )
                    .map(
                      (
                        appointment
                      ) => (
                        <option
                          key={
                            appointment.id
                          }
                          value={
                            appointment.id
                          }
                        >
                          {
                            appointment.appointmentNumber
                          }
                          {' — '}
                          {appointment.patientName ||
                            'Patient'}
                          {' — '}
                          {appointment.doctorName ||
                            'Doctor'}
                          {' — '}
                          {
                            appointment.appointmentDate
                          }
                        </option>
                      )
                    )}

                </select>

                <p className="mt-1 text-xs text-muted-foreground">
                  Select the appointment for which the patient is being billed.
                </p>
              </div>

              {/* CHARGES */}

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <MoneyInput
                  label="Consultation Fee"
                  value={
                    consultationFee
                  }
                  onChange={
                    setConsultationFee
                  }
                />

                <MoneyInput
                  label="Medicine Charges"
                  value={
                    medicineCharges
                  }
                  onChange={
                    setMedicineCharges
                  }
                />

                <MoneyInput
                  label="Lab Charges"
                  value={
                    labCharges
                  }
                  onChange={
                    setLabCharges
                  }
                />

                <MoneyInput
                  label="Other Charges"
                  value={
                    otherCharges
                  }
                  onChange={
                    setOtherCharges
                  }
                />

              </div>

              {/* PAYMENT */}

              <div className="grid sm:grid-cols-2 gap-4">

                <MoneyInput
                  label="Paid Amount"
                  value={
                    paidAmount
                  }
                  onChange={
                    setPaidAmount
                  }
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Payment Method
                  </label>

                  <select
                    value={
                      paymentMethod
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentMethod(
                        event.target
                          .value
                      )
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
                  >
                    <option value="UPI">
                      UPI
                    </option>

                    <option value="Cash">
                      Cash
                    </option>

                    <option value="Card">
                      Card
                    </option>

                    <option value="Net Banking">
                      Net Banking
                    </option>
                  </select>
                </div>

              </div>

              {/* TOTAL PREVIEW */}

              <div className="grid sm:grid-cols-3 gap-4">

                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Total Amount
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {formatCurrency(
                      formTotal
                    )}
                  </p>
                </div>

                <div className="rounded-lg border bg-green-50 p-4">
                  <p className="text-sm text-green-700">
                    Paid Amount
                  </p>

                  <p className="mt-1 text-xl font-bold text-green-700">
                    {formatCurrency(
                      formPaid
                    )}
                  </p>
                </div>

                <div className="rounded-lg border bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-700">
                    Due Amount
                  </p>

                  <p className="mt-1 text-xl font-bold text-yellow-700">
                    {formatCurrency(
                      formDue
                    )}
                  </p>
                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(
                      false
                    );

                    resetForm();
                  }}
                  className="rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    creating
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {creating
                    ? 'Creating...'
                    : 'Create Bill'}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ==================================================
            BILLING RECORDS
        ================================================== */}

        <div className="rounded-xl border bg-card overflow-hidden">

          <div className="border-b p-5">

            <div className="flex items-center gap-2">

              <Receipt
                size={18}
                className="text-primary"
              />

              <h2 className="font-semibold">
                Billing Records
              </h2>

            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              All bills created by the reception desk.
            </p>

          </div>

          {bills.length === 0 ? (
            <div className="p-12 text-center">

              <Receipt
                size={42}
                className="mx-auto text-muted-foreground"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No billing records
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Create a bill after a patient visit.
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
                      Patient
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

                    <th className="px-5 py-3 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {normalizedBills.map(
                    ({
                      bill,
                      financial,
                    }) => {
                      const status =
                        getStatus(
                          financial.status
                        );

                      const isCancelled =
                        financial.status ===
                        'CANCELLED';

                      const isPaid =
                        financial.status ===
                        'PAID';

                      const hasDue =
                        financial.due >
                        0;

                      return (
                        <tr
                          key={
                            bill.id
                          }
                          className="border-t hover:bg-muted/20"
                        >

                          {/* INVOICE */}

                          <td className="px-5 py-4 font-semibold text-primary whitespace-nowrap">
                            {bill.invoiceNumber ||
                              '—'}
                          </td>

                          {/* PATIENT */}

                          <td className="px-5 py-4 whitespace-nowrap">
                            {bill.patientName ||
                              '—'}
                          </td>

                          {/* DOCTOR */}

                          <td className="px-5 py-4 whitespace-nowrap">
                            {bill.doctorName ||
                              '—'}
                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4 whitespace-nowrap text-sm">
                            {formatDate(
                              bill.billDate
                            )}
                          </td>

                          {/* TOTAL */}

                          <td className="px-5 py-4 font-semibold whitespace-nowrap">
                            {formatCurrency(
                              financial.total
                            )}
                          </td>

                          {/* PAID */}

                          <td className="px-5 py-4 font-semibold text-green-600 whitespace-nowrap">
                            {formatCurrency(
                              financial.paid
                            )}
                          </td>

                          {/* DUE */}

                          <td className="px-5 py-4 font-semibold whitespace-nowrap">
                            <span
                              className={
                                financial.due >
                                0
                                  ? 'text-yellow-600'
                                  : 'text-slate-600'
                              }
                            >
                              {formatCurrency(
                                financial.due
                              )}
                            </span>
                          </td>

                          {/* PAYMENT METHOD */}

                          <td className="px-5 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-2">

                              {getPaymentMethodIcon(
                                bill.paymentMethod ||
                                  ''
                              )}

                              {bill.paymentMethod ||
                                '—'}

                            </div>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4 whitespace-nowrap">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                            >
                              {
                                status.icon
                              }

                              {
                                status.label
                              }
                            </span>

                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-4 text-right whitespace-nowrap">

                            {hasDue &&
                            !isCancelled ? (
                              <button
                                type="button"
                                onClick={() =>
                                  openPaymentModal(
                                    bill
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-700 transition"
                              >
                                <IndianRupee
                                  size={14}
                                />

                                Record Payment
                              </button>
                            ) : isPaid ? (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            ) : isCancelled ? (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}

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

      {/* ====================================================
          RECORD PAYMENT MODAL
      ==================================================== */}

      {showPaymentModal &&
        selectedBill &&
        selectedBillFinancial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-lg rounded-2xl border bg-card shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <IndianRupee
                      size={20}
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Record Payment
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      {selectedBill.invoiceNumber}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    closePaymentModal
                  }
                  disabled={
                    recordingPayment
                  }
                  className="rounded-lg p-2 hover:bg-muted disabled:opacity-50"
                >
                  <X
                    size={20}
                  />
                </button>

              </div>

              {/* BODY */}

              <form
                onSubmit={
                  handleRecordPayment
                }
                className="space-y-5 p-5"
              >

                {/* BILL INFORMATION */}

                <div className="rounded-xl border bg-muted/30 p-4">

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Patient
                      </p>

                      <p className="mt-1 font-semibold">
                        {selectedBill.patientName ||
                          '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Doctor
                      </p>

                      <p className="mt-1 font-semibold">
                        {selectedBill.doctorName ||
                          '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Bill
                      </p>

                      <p className="mt-1 font-semibold">
                        {formatCurrency(
                          selectedBillFinancial.total
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Already Paid
                      </p>

                      <p className="mt-1 font-semibold text-green-600">
                        {formatCurrency(
                          selectedBillFinancial.paid
                        )}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">

                    <div className="flex items-center justify-between">

                      <span className="text-sm font-medium text-yellow-800">
                        Outstanding Due
                      </span>

                      <span className="text-lg font-bold text-yellow-800">
                        {formatCurrency(
                          selectedBillFinancial.due
                        )}
                      </span>

                    </div>

                  </div>

                </div>

                {/* PAYMENT AMOUNT */}

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Payment Amount
                  </label>

                  <div className="relative">

                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                      type="number"
                      min="0.01"
                      max={
                        selectedBillFinancial.due
                      }
                      step="0.01"
                      value={
                        paymentAmount
                      }
                      onChange={(
                        event
                      ) =>
                        setPaymentAmount(
                          event.target
                            .value
                        )
                      }
                      placeholder="Enter payment amount"
                      className="w-full rounded-lg border bg-background py-3 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />

                  </div>

                  <div className="mt-2 flex items-center justify-between">

                    <p className="text-xs text-muted-foreground">
                      Maximum payment:
                      {' '}
                      {formatCurrency(
                        selectedBillFinancial.due
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={
                        markFullAmount
                      }
                      disabled={
                        recordingPayment
                      }
                      className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 disabled:opacity-50"
                    >
                      Pay Full Due
                    </button>

                  </div>

                </div>

                {/* PAYMENT METHOD */}

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Payment Method
                  </label>

                  <select
                    value={
                      recordPaymentMethod
                    }
                    onChange={(
                      event
                    ) =>
                      setRecordPaymentMethod(
                        event.target
                          .value
                      )
                    }
                    disabled={
                      recordingPayment
                    }
                    className="w-full rounded-lg border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60"
                  >
                    <option value="UPI">
                      UPI
                    </option>

                    <option value="Cash">
                      Cash
                    </option>

                    <option value="Card">
                      Card
                    </option>

                    <option value="Net Banking">
                      Net Banking
                    </option>
                  </select>

                </div>

                {/* PAYMENT PREVIEW */}

                <div className="grid grid-cols-2 gap-4">

                  <div className="rounded-lg border bg-green-50 p-4">

                    <p className="text-xs text-green-700">
                      Total Paid After Payment
                    </p>

                    <p className="mt-1 text-lg font-bold text-green-700">
                      {formatCurrency(
                        selectedBillFinancial.paid +
                          enteredPaymentAmount
                      )}
                    </p>

                  </div>

                  <div
                    className={`rounded-lg border p-4 ${
                      remainingAfterPayment <=
                      0
                        ? 'bg-green-50'
                        : 'bg-yellow-50'
                    }`}
                  >

                    <p
                      className={`text-xs ${
                        remainingAfterPayment <=
                        0
                          ? 'text-green-700'
                          : 'text-yellow-700'
                      }`}
                    >
                      Remaining Due
                    </p>

                    <p
                      className={`mt-1 text-lg font-bold ${
                        remainingAfterPayment <=
                        0
                          ? 'text-green-700'
                          : 'text-yellow-700'
                      }`}
                    >
                      {formatCurrency(
                        remainingAfterPayment
                      )}
                    </p>

                  </div>

                </div>

                {/* FULL PAYMENT MESSAGE */}

                {enteredPaymentAmount >
                  0 &&
                  enteredPaymentAmount >=
                    selectedBillFinancial.due && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">

                      <div className="flex items-center gap-2 text-sm font-semibold text-green-700">

                        <CheckCircle2
                          size={17}
                        />

                        This payment will fully settle the bill.

                      </div>

                    </div>
                  )}

                {/* ACTIONS */}

                <div className="flex justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={
                      closePaymentModal
                    }
                    disabled={
                      recordingPayment
                    }
                    className="rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      recordingPayment ||
                      enteredPaymentAmount <=
                        0 ||
                      enteredPaymentAmount >
                        selectedBillFinancial.due
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {recordingPayment ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        Recording...
                      </>
                    ) : (
                      <>
                        <CheckCircle2
                          size={16}
                        />

                        Record Payment
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

    </AppLayout>
  );
}

/*
 * ============================================================
 * SUMMARY CARD
 * ============================================================
 */

interface SummaryCardProps {
  title: string;
  value: string;
  count?: string;
  icon: ReactNode;
  iconClass: string;
}

function SummaryCard({
  title,
  value,
  count,
  icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>

      </div>

      {count && (
        <p className="mt-3 text-xs text-muted-foreground">
          {count}
        </p>
      )}

    </div>
  );
}

/*
 * ============================================================
 * MONEY INPUT
 * ============================================================
 */

interface MoneyInputProps {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}

function MoneyInput({
  label,
  value,
  onChange,
}: MoneyInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <div className="relative">

        <IndianRupee
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder="0"
          className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
        />

      </div>
    </div>
  );
}