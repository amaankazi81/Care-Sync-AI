'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  getAccessToken,
  getRole,
  isTokenExpired,
  logout,
} from '@/utils/auth';

const dashboardRoutes = {
  admin: '/admin-dashboard',
  doctor: '/doctor-dashboard',
  patient: '/patient-dashboard',
  receptionist: '/receptionist-dashboard',
} as const;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = () => {
      const token = getAccessToken();
      const role =
        getRole()?.toLowerCase();

      /*
       * No login session.
       */
      if (
        !token ||
        isTokenExpired()
      ) {
        logout();
        router.replace('/login');
        return;
      }

      /*
       * No valid role.
       */
      if (
        !role ||
        !Object.prototype.hasOwnProperty.call(
          dashboardRoutes,
          role
        )
      ) {
        logout();
        router.replace('/login');
        return;
      }

      /*
       * Always redirect root to the correct
       * role-specific dashboard.
       */
      const dashboard =
        dashboardRoutes[
          role as keyof typeof dashboardRoutes
        ];

      router.replace(
        dashboard
      );
    };

    redirectUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div
          className="
            h-10 w-10
            mx-auto mb-4
            animate-spin
            rounded-full
            border-4
            border-cyan-600
            border-t-transparent
          "
        />

        <p className="text-muted-foreground font-medium">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}