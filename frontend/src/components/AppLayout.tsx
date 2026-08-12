'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { usePathname, useRouter } from 'next/navigation';

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

/* =========================================================
   DASHBOARD ROUTES
========================================================= */

const dashboardRoutes = {
  admin: '/admin-dashboard',
  doctor: '/doctor-dashboard',
  patient: '/patient-dashboard',
  receptionist:
    '/receptionist-dashboard',
};

/* =========================================================
   APP LAYOUT
========================================================= */

export default function AppLayout({
  children,
  role,
  breadcrumbs,
}: AppLayoutProps) {
  const router = useRouter();

  const pathname =
    usePathname();

  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [authorized, setAuthorized] =
    useState(false);

  /* =========================================================
     SESSION VERIFICATION
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const verifySession = () => {
      const token =
        getAccessToken();

      const storedRole =
        getRole()?.toLowerCase();

      /*
       * ------------------------------------------------------
       * NO TOKEN
       * ------------------------------------------------------
       */

      if (!token) {
        if (mounted) {
          setAuthorized(false);
        }

        logout();

        router.replace('/login');

        return;
      }

      /*
       * ------------------------------------------------------
       * EXPIRED TOKEN
       * ------------------------------------------------------
       */

      if (isTokenExpired()) {
        if (mounted) {
          setAuthorized(false);
        }

        logout();

        router.replace('/login');

        return;
      }

      /*
       * ------------------------------------------------------
       * MISSING ROLE
       * ------------------------------------------------------
       */

      if (!storedRole) {
        if (mounted) {
          setAuthorized(false);
        }

        logout();

        router.replace('/login');

        return;
      }

      /*
       * ------------------------------------------------------
       * INVALID ROLE
       * ------------------------------------------------------
       */

      if (
        ![
          'admin',
          'doctor',
          'patient',
          'receptionist',
        ].includes(
          storedRole
        )
      ) {
        if (mounted) {
          setAuthorized(false);
        }

        logout();

        router.replace('/login');

        return;
      }

      /*
       * ------------------------------------------------------
       * ROLE MISMATCH
       * ------------------------------------------------------
       */

      if (
        storedRole !== role
      ) {
        const redirect =
          dashboardRoutes[
            storedRole as keyof typeof dashboardRoutes
          ];

        if (redirect) {
          router.replace(
            redirect
          );
        } else {
          logout();

          router.replace(
            '/login'
          );
        }

        return;
      }

      /*
       * ------------------------------------------------------
       * AUTHORIZED
       * ------------------------------------------------------
       */

      if (mounted) {
        setAuthorized(true);
      }
    };

    verifySession();

    return () => {
      mounted = false;
    };
  }, [
    role,
    router,
    pathname,
  ]);

  /* =========================================================
     AUTH CHANGE LISTENER
  ========================================================= */

  useEffect(() => {
    const handleAuthChange =
      () => {
        /*
         * When login/logout happens, immediately
         * verify the session again.
         */

        setAuthorized(false);

        verifyCurrentSession();
      };

    const verifyCurrentSession =
      () => {
        const token =
          getAccessToken();

        const storedRole =
          getRole()?.toLowerCase();

        if (
          !token ||
          isTokenExpired()
        ) {
          router.replace(
            '/login'
          );

          return;
        }

        if (
          !storedRole
        ) {
          router.replace(
            '/login'
          );

          return;
        }

        if (
          storedRole !== role
        ) {
          const redirect =
            dashboardRoutes[
              storedRole as keyof typeof dashboardRoutes
            ];

          if (redirect) {
            router.replace(
              redirect
            );
          } else {
            logout();

            router.replace(
              '/login'
            );
          }

          return;
        }

        setAuthorized(true);
      };

    window.addEventListener(
      'auth-change',
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        'auth-change',
        handleAuthChange
      );
    };
  }, [role, router]);

  /* =========================================================
     CLOSE MOBILE SIDEBAR AFTER NAVIGATION
  ========================================================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* =========================================================
     LOADING / AUTH CHECK
  ========================================================= */

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">

          <div
            className="
              h-10
              w-10
              mx-auto
              mb-4
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

  /* =========================================================
     MAIN LAYOUT
  ========================================================= */

  return (
    <div className="min-h-screen bg-background">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            z-30
            lg:hidden
          "
          onClick={() =>
            setMobileOpen(
              false
            )
          }
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

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
          collapsed={
            collapsed
          }
          onToggle={() =>
            setCollapsed(
              (previous) =>
                !previous
            )
          }
        />
      </div>

      {/* =====================================================
          TOPBAR
      ===================================================== */}

      <Topbar
        role={role}
        sidebarCollapsed={
          collapsed
        }
        onMobileMenuToggle={() =>
          setMobileOpen(
            (previous) =>
              !previous
          )
        }
        mobileMenuOpen={
          mobileOpen
        }
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className="
          pt-16
          min-h-screen
          content-transition
        "
        style={{
          marginLeft:
            collapsed
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
            breadcrumbs.length >
              0 && (
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

                      {index >
                        0 && (
                        <span className="text-border">
                          /
                        </span>
                      )}

                      {crumb.href ? (
                        <a
                          href={
                            crumb.href
                          }
                          className="
                            hover:text-primary
                            transition-colors
                          "
                        >
                          {
                            crumb.label
                          }
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
                          {
                            crumb.label
                          }
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