'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';

import profileService, {
  UserProfile,
} from '@/services/profileService';

import AppLayout from '@/components/AppLayout';
import ProfileCard from '@/components/profile/ProfileCard';
import EditProfileForm from '@/components/profile/EditProfileForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';

import { getRole } from '@/utils/auth';

type LayoutRole =
  | 'admin'
  | 'doctor'
  | 'patient'
  | 'receptionist';

/* =========================================================
   CONVERT STORED ROLE TO LAYOUT ROLE
========================================================= */

function getLayoutRole(
  role?: string | null
): LayoutRole {
  switch (role?.toUpperCase()) {
    case 'DOCTOR':
      return 'doctor';

    case 'PATIENT':
      return 'patient';

    case 'RECEPTIONIST':
      return 'receptionist';

    case 'ADMIN':
      return 'admin';

    default:
      return 'admin';
  }
}

export default function ProfilePage() {
  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  /*
   * IMPORTANT:
   *
   * Get the role from localStorage immediately.
   *
   * Do NOT wait for /users/me to determine
   * the AppLayout role.
   */

  const storedRole = getRole();

  const layoutRole =
    getLayoutRole(storedRole);

  /* =======================================================
     LOAD PROFILE
  ======================================================== */

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response =
        await profileService.getCurrentUserProfile();

      setUser(response);
    } catch (error) {
      console.error(
        'Failed to load profile:',
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout
      role={layoutRole}
      breadcrumbs={[
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'My Profile',
        },
      ]}
    >
      {/* ===================================================
          LOADING
      ==================================================== */}

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">

            <LoaderCircle
              className="animate-spin text-cyan-600"
              size={32}
            />

            <p className="font-medium">
              Loading your profile...
            </p>

          </div>
        </div>
      ) : !user ? (

        /* =================================================
           ERROR
        ================================================== */

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">

          <div className="flex items-center gap-3">

            <AlertCircle size={22} />

            <div>

              <h2 className="font-semibold">
                Unable to load profile
              </h2>

              <p className="mt-1 text-sm">
                Please refresh the page and try again.
              </p>

            </div>

          </div>

        </div>

      ) : (

        /* =================================================
           PROFILE CONTENT
        ================================================== */

        <div className="mx-auto max-w-6xl space-y-6">

          {/* HEADER */}

          <div>

            <p className="text-sm font-medium text-cyan-700">
              Account Center
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              My Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your personal details and account security.
            </p>

          </div>

          {/* PROFILE CARD */}

          <ProfileCard user={user} />

          {/* EDIT + PASSWORD */}

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">

            <EditProfileForm
              user={user}
              onUpdate={setUser}
            />

            <ChangePasswordForm />

          </div>

        </div>
      )}
    </AppLayout>
  );
}