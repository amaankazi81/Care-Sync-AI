'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

import {
  getAccessToken,
  getRole,
  isTokenExpired,
  logout,
} from '@/utils/auth';

interface AppLayoutProps {
  children: React.ReactNode;

  role:
    | 'admin'
    | 'doctor'
    | 'patient'
    | 'receptionist';

  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
}

const dashboardRoutes = {
  admin: '/admin-dashboard',
  doctor: '/doctor-dashboard',
  patient: '/patient-dashboard',
  receptionist: '/receptionist-dashboard',
};

export default function AppLayout({
  children,
  role,
  breadcrumbs,
}: AppLayoutProps) {
  const router = useRouter();

  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const verifySession = () => {
      const token = getAccessToken();

      const storedRole =
        getRole()?.toLowerCase();

      /*
       * No access token
       */
      if (!token) {
        logout();
        router.replace('/login');
        return;
      }

      /*
       * Expired access token
       */
      if (isTokenExpired()) {
        logout();
        router.replace('/login');
        return;
      }

      /*
       * Missing role
       */
      if (!storedRole) {
        logout();
        router.replace('/login');
        return;
      }

      /*
       * Invalid role
       */
      if (
        ![
          'admin',
          'doctor',
          'patient',
          'receptionist',
        ].includes(storedRole)
      ) {
        logout();
        router.replace('/login');
        return;
      }

      /*
       * Role mismatch.
       *
       * This protects dashboards from users entering
       * another role's dashboard manually.
       */
      if (storedRole !== role) {
        const redirect =
          dashboardRoutes[
            storedRole as keyof typeof dashboardRoutes
          ];

        if (redirect) {
          router.replace(redirect);
        } else {
          logout();
          router.replace('/login');
        }

        return;
      }

      if (mounted) {
        setAuthorized(true);
      }
    };

    verifySession();

    return () => {
      mounted = false;
    };
  }, [role, router]);

  /*
   * Keep the screen hidden while authentication
   * is being verified.
   */
  if (!authorized) {
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
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileOpen && (
        <div
          className="
            fixed inset-0
            bg-black/40
            z-30
            lg:hidden
          "
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <div
        className={`
          lg:block
          ${
            mobileOpen
              ? 'block'
              : 'hidden'
          }
        `}
      >
        <Sidebar
          role={role}
          collapsed={collapsed}
          onToggle={() =>
            setCollapsed(
              !collapsed
            )
          }
        />
      </div>

      {/* =================================================
          TOPBAR
      ================================================= */}

      <Topbar
        role={role}
        sidebarCollapsed={collapsed}
        onMobileMenuToggle={() =>
          setMobileOpen(
            !mobileOpen
          )
        }
        mobileMenuOpen={mobileOpen}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main
        className="
          pt-16
          min-h-screen
          content-transition
        "
        style={{
          marginLeft: collapsed
            ? '68px'
            : '260px',
        }}
      >
        <div
          className="
            px-6
            lg:px-8
            xl:px-10
            2xl:px-12
            py-6
            max-w-screen-2xl
            mx-auto
          "
        >
          {/* =================================================
              BREADCRUMBS
          ================================================= */}

          {breadcrumbs &&
            breadcrumbs.length > 0 && (
              <nav
                className="
                  flex
                  items-center
                  gap-1.5
                  mb-5
                  text-xs
                  text-muted-foreground
                "
              >
                {breadcrumbs.map(
                  (
                    crumb,
                    index
                  ) => (
                    <React.Fragment
                      key={`${crumb.label}-${index}`}
                    >
                      {index > 0 && (
                        <span className="text-border">
                          /
                        </span>
                      )}

                      {crumb.href ? (
                        <a
                          href={crumb.href}
                          className="
                            hover:text-primary
                            transition-colors
                          "
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span
                          className={
                            index ===
                            breadcrumbs.length -
                              1
                              ? 'text-foreground font-medium'
                              : ''
                          }
                        >
                          {crumb.label}
                        </span>
                      )}
                    </React.Fragment>
                  )
                )}
              </nav>
            )}

          {children}
        </div>
      </main>
    </div>
  );
}