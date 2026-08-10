'use client';

import {
  Download,
} from 'lucide-react';

import {
  toast,
} from 'sonner';

import type {
  Billing,
} from '@/types/Billing';

interface Props {
  bills: Billing[];
}

export default function BillingTable({
  bills,
}: Props) {
  const formatCurrency = (
    amount: number
  ) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString('en-IN')}`;
  };

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

  const getStatusClass = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case 'paid':
        return 'bg-green-100 text-green-700';

      case 'pending':
      case 'partially paid':
      case 'partial':
        return 'bg-yellow-100 text-yellow-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-muted">

            <tr>

              <th className="px-5 py-4 text-left">
                Invoice
              </th>

              <th className="px-5 py-4 text-left">
                Doctor
              </th>

              <th className="px-5 py-4 text-left">
                Bill Date
              </th>

              <th className="px-5 py-4 text-left">
                Total
              </th>

              <th className="px-5 py-4 text-left">
                Paid
              </th>

              <th className="px-5 py-4 text-left">
                Due
              </th>

              <th className="px-5 py-4 text-left">
                Payment
              </th>

              <th className="px-5 py-4 text-left">
                Status
              </th>

              <th className="px-5 py-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {bills.length === 0 ? (
              <tr>

                <td
                  colSpan={9}
                  className="py-10 text-center text-muted-foreground"
                >
                  No Bills Found
                </td>

              </tr>
            ) : (
              bills.map(
                (bill) => (
                  <tr
                    key={bill.id}
                    className="border-t hover:bg-muted/30"
                  >

                    <td className="px-5 py-4 font-semibold text-primary">
                      {bill.invoiceNumber ||
                        '—'}
                    </td>

                    <td className="px-5 py-4">
                      {bill.doctorName ||
                        '—'}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {formatDate(
                        bill.billDate
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {formatCurrency(
                        bill.totalAmount
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold text-green-600">
                      {formatCurrency(
                        bill.paidAmount
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold text-yellow-600">
                      {formatCurrency(
                        bill.dueAmount
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {bill.paymentMethod ||
                        '—'}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          bill.paymentStatus
                        )}`}
                      >
                        {bill.paymentStatus ||
                          'UNKNOWN'}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-center">

                        <button
                          type="button"
                          onClick={() =>
                            toast.success(
                              'Invoice download will be available soon.'
                            )
                          }
                          className="rounded-lg border p-2 hover:bg-cyan-50 transition"
                          title="Download invoice"
                        >
                          <Download
                            size={17}
                            className="text-cyan-700"
                          />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}