'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

import AppLayout from '@/components/AppLayout';
import DoctorProfileCard from '../../components/DoctorProfileCard';

import doctorService from '@/services/doctorService';
import { Doctor } from '@/types/Doctor';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function DoctorDetailsPage({ params }: Props) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctor() {
      try {
        const { id } = await params;

        const response = await doctorService.getDoctorById(id);

        setDoctor(response);
      } catch (error) {
        console.error('Failed to load doctor', error);
      } finally {
        setLoading(false);
      }
    }

    loadDoctor();
  }, [params]);

  if (loading) {
    return (
      <AppLayout role="admin">
        <div className="p-8 text-center">
          Loading doctor...
        </div>
      </AppLayout>
    );
  }

  if (!doctor) {
    notFound();
  }

  return (
    <AppLayout
      role="admin"
      breadcrumbs={[
        {
          label: 'Dashboard',
          href: '/',
        },
        {
          label: 'Doctors',
          href: '/admin-dashboard/doctors',
        },
        {
          label: `${doctor.firstName} ${doctor.lastName}`,
        },
      ]}
    >
      <DoctorProfileCard doctor={doctor} />
    </AppLayout>
  );
}