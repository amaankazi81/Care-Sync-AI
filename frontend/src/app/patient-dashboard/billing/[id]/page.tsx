'use client';

import { useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

import { billingMock } from '@/mock/billingMock';

export default function BillingDetailsPage() {
  const params = useParams();

  const bill = billingMock.find((item) => item.id === String(params.id));

  if (!bill) {
    return (
      <AppLayout role="patient">
        <div className="text-center py-20">Bill Not Found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      role="patient"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/patient-dashboard',
        },
        {
          label: 'Billing',
          href: '/patient-dashboard/billing',
        },
        {
          label: 'Bill Details',
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bill Details</h1>

          <p className="text-muted-foreground mt-2">View complete billing information.</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-5">Billing Information</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <Info title="Invoice No." value={bill.invoiceNo} />

            <Info title="Hospital" value={bill.hospital} />

            <Info title="Doctor" value={bill.doctorName} />

            <Info title="Bill Date" value={bill.billDate} />

            <Info title="Amount" value={`₹ ${bill.amount}`} />

            <Info title="Status" value={bill.status} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

interface InfoProps {
  title: string;
  value: string | number;
}

function Info({ title, value }: InfoProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
