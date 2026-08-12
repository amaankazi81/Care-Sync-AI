'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!token) {
      router.replace('/login');
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.replace('/login');
    }
  }, [router, allowedRoles]);

  return <>{children}</>;
}
