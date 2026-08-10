import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

const DASHBOARD_ROUTES = {
  ADMIN: '/admin-dashboard',
  DOCTOR: '/doctor-dashboard',
  PATIENT: '/patient-dashboard',
  RECEPTIONIST: '/receptionist-dashboard',
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('role')?.value;

  // -----------------------------
  // Public Routes
  // -----------------------------
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    // If user is already logged in, don't allow opening login/register pages
    if (token && role) {
      const redirect =
        DASHBOARD_ROUTES[role as keyof typeof DASHBOARD_ROUTES];

      if (redirect) {
        return NextResponse.redirect(new URL(redirect, request.url));
      }
    }

    return NextResponse.next();
  }

  // -----------------------------
  // Protected Routes
  // -----------------------------
  if (!token || !role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // -----------------------------
  // Admin
  // -----------------------------
  if (pathname.startsWith('/admin-dashboard')) {
    if (role !== 'ADMIN') {
      const redirect =
        DASHBOARD_ROUTES[role as keyof typeof DASHBOARD_ROUTES];

      return NextResponse.redirect(
        new URL(redirect || '/login', request.url)
      );
    }
  }

  // -----------------------------
  // Doctor
  // -----------------------------
  if (pathname.startsWith('/doctor-dashboard')) {
    if (role !== 'DOCTOR') {
      const redirect =
        DASHBOARD_ROUTES[role as keyof typeof DASHBOARD_ROUTES];

      return NextResponse.redirect(
        new URL(redirect || '/login', request.url)
      );
    }
  }

  // -----------------------------
  // Patient
  // -----------------------------
  if (pathname.startsWith('/patient-dashboard')) {
    if (role !== 'PATIENT') {
      const redirect =
        DASHBOARD_ROUTES[role as keyof typeof DASHBOARD_ROUTES];

      return NextResponse.redirect(
        new URL(redirect || '/login', request.url)
      );
    }
  }

  // -----------------------------
  // Receptionist
  // -----------------------------
  if (pathname.startsWith('/receptionist-dashboard')) {
    if (role !== 'RECEPTIONIST') {
      const redirect =
        DASHBOARD_ROUTES[role as keyof typeof DASHBOARD_ROUTES];

      return NextResponse.redirect(
        new URL(redirect || '/login', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',

    '/admin-dashboard/:path*',
    '/doctor-dashboard/:path*',
    '/patient-dashboard/:path*',
    '/receptionist-dashboard/:path*',
  ],
};