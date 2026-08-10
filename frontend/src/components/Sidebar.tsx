'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { logout } from '@/utils/auth';
import AppLogo from '@/components/ui/AppLogo';

import {
  LayoutDashboard,
  Users,
  UserRound,
  UserPlus,
  CalendarDays,
  Building2,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  FileText,
  ClipboardList,
  HeartPulse,
  CreditCard,
  UserCircle,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  group?: string;
}

interface SidebarProps {
  role: 'admin' | 'doctor' | 'patient' | 'receptionist';
  collapsed: boolean;
  onToggle: () => void;
}

/* =========================================================
   ADMIN NAVIGATION
========================================================= */

const adminNav: NavItem[] = [
  {
    id: 'nav-admin-dashboard',
    label: 'Dashboard',
    href: '/admin-dashboard',
    icon: LayoutDashboard,
    group: 'main',
  },

  {
    id: 'nav-admin-doctors',
    label: 'Doctors',
    href: '/admin-dashboard/doctors',
    icon: Stethoscope,
    group: 'main',
  },

  {
    id: 'nav-admin-patients',
    label: 'Patients',
    href: '/admin-dashboard/patients',
    icon: Users,
    group: 'main',
  },

  {
    id: 'nav-admin-appointments',
    label: 'Appointments',
    href: '/admin-dashboard/appointments',
    icon: CalendarDays,
    group: 'main',
  },

  {
    id: 'nav-admin-departments',
    label: 'Departments',
    href: '/admin-dashboard/departments',
    icon: Building2,
    group: 'main',
  },

  {
    id: 'nav-admin-reports',
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
    group: 'analytics',
  },

  {
    id: 'nav-admin-profile',
    label: 'My Profile',
    href: '/profile',
    icon: UserCircle,
    group: 'system',
  },
];

/* =========================================================
   DOCTOR NAVIGATION
========================================================= */

const doctorNav: NavItem[] = [
  {
    id: 'nav-doctor-dashboard',
    label: 'Dashboard',
    href: '/doctor-dashboard',
    icon: LayoutDashboard,
    group: 'main',
  },

  {
    id: 'nav-doctor-appointments',
    label: 'My Appointments',
    href: '/doctor-dashboard/appointments',
    icon: CalendarDays,
    group: 'main',
  },

  {
    id: 'nav-doctor-patients',
    label: 'My Patients',
    href: '/doctor-dashboard/patients',
    icon: Users,
    group: 'main',
  },

  {
    id: 'nav-doctor-prescriptions',
    label: 'Prescriptions',
    href: '/doctor-dashboard/prescriptions',
    icon: FileText,
    group: 'main',
  },

  {
    id: 'nav-doctor-availability',
    label: 'Availability',
    href: '/doctor-dashboard/availability',
    icon: ClipboardList,
    group: 'main',
  },

  {
    id: 'nav-doctor-profile',
    label: 'My Profile',
    href: '/profile',
    icon: UserCircle,
    group: 'system',
  },
];

/* =========================================================
   PATIENT NAVIGATION
========================================================= */

const patientNav: NavItem[] = [
  {
    id: 'nav-patient-dashboard',
    label: 'Dashboard',
    href: '/patient-dashboard',
    icon: LayoutDashboard,
    group: 'main',
  },

  {
    id: 'nav-patient-book',
    label: 'Book Appointment',
    href: '/patient-dashboard/book-appointment',
    icon: CalendarDays,
    group: 'main',
  },

  {
    id: 'nav-patient-history',
    label: 'Appointment History',
    href: '/patient-dashboard/appointments',
    icon: ClipboardList,
    group: 'main',
  },

  {
    id: 'nav-patient-records',
    label: 'Medical Records',
    href: '/patient-dashboard/medical-records',
    icon: FileText,
    group: 'health',
  },

  {
    id: 'nav-patient-prescriptions',
    label: 'Prescriptions',
    href: '/patient-dashboard/prescriptions',
    icon: HeartPulse,
    group: 'health',
  },

  {
    id: 'nav-patient-billing',
    label: 'Billing',
    href: '/patient-dashboard/billing',
    icon: CreditCard,
    group: 'health',
  },

  {
    id: 'nav-patient-profile',
    label: 'My Profile',
    href: '/profile',
    icon: UserCircle,
    group: 'system',
  },
];

/* =========================================================
   RECEPTIONIST NAVIGATION
========================================================= */

const receptionistNav: NavItem[] = [
  {
    id: 'nav-reception-dashboard',
    label: 'Dashboard',
    href: '/receptionist-dashboard',
    icon: LayoutDashboard,
    group: 'main',
  },

  {
    id: 'nav-reception-patients',
    label: 'Patients',
    href: '/receptionist-dashboard/patients',
    icon: Users,
    group: 'main',
  },

  {
    id: 'nav-reception-appointments',
    label: 'Appointments',
    href: '/receptionist-dashboard/appointments',
    icon: CalendarDays,
    group: 'main',
  },

  {
    id: 'nav-reception-doctor-schedule',
    label: 'Doctor Schedule',
    href: '/receptionist-dashboard/doctor-schedule',
    icon: Stethoscope,
    group: 'main',
  },

  {
    id: 'nav-reception-billing',
    label: 'Billing',
    href: '/receptionist-dashboard/billing',
    icon: CreditCard,
    group: 'main',
  },

  {
    id: 'nav-reception-register-patient',
    label: 'Register Patient',
    href: '/receptionist-dashboard/register',
    icon: UserPlus,
    group: 'main',
  },

  {
    id: 'nav-reception-profile',
    label: 'My Profile',
    href: '/profile',
    icon: UserCircle,
    group: 'system',
  },
];

/* =========================================================
   ROLE → NAVIGATION
========================================================= */

const navByRole: Record<
  'admin' | 'doctor' | 'patient' | 'receptionist',
  NavItem[]
> = {
  admin: adminNav,
  doctor: doctorNav,
  patient: patientNav,
  receptionist: receptionistNav,
};

/* =========================================================
   GROUP LABELS
========================================================= */

const groupLabels: Record<string, string> = {
  main: 'Main Menu',
  analytics: 'Analytics',
  health: 'My Health',
  system: 'System',
};

/* =========================================================
   SIDEBAR
========================================================= */

export default function Sidebar({
  role,
  collapsed,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const navItems = navByRole[role] || adminNav;

  const groups = navItems.reduce<Record<string, NavItem[]>>(
    (acc, item) => {
      const group = item.group || 'main';

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push(item);

      return acc;
    },
    {}
  );

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full
        bg-card border-r border-border
        z-40 flex flex-col
        sidebar-transition shadow-sidebar
        ${collapsed ? 'w-[68px]' : 'w-[260px]'}
      `}
    >
      {/* =================================================
          LOGO
      ================================================= */}

      <div
        className={`
          flex items-center h-16
          border-b border-border
          px-4 flex-shrink-0
          ${collapsed ? 'justify-center' : 'justify-between'}
        `}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <AppLogo size={32} />

            <span className="font-bold text-base text-foreground truncate">
              CareSync
            </span>
          </div>
        )}

        {collapsed && <AppLogo size={32} />}

        <button
          type="button"
          onClick={onToggle}
          className={`
            flex items-center justify-center
            w-7 h-7 rounded-full
            border border-border
            bg-background
            hover:bg-muted
            transition-colors
            ${collapsed ? 'mx-auto' : ''}
          `}
          aria-label={
            collapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
      </div>

      {/* =================================================
          ROLE BADGE
      ================================================= */}

      {!collapsed && (
        <div className="px-4 py-3 border-b border-border">
          <span
            className="
              inline-flex items-center gap-2
              px-3 py-1 rounded-full
              text-xs font-semibold
              bg-cyan-50 text-cyan-700
            "
          >
            <UserRound size={12} />

            {role.charAt(0).toUpperCase() + role.slice(1)}
            {' '}Portal
          </span>
        </div>
      )}

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="flex-1 overflow-y-auto py-3">
        {Object.entries(groups).map(
          ([groupKey, items]) => (
            <div
              key={groupKey}
              className="mb-3"
            >
              {!collapsed && (
                <p
                  className="
                    px-4 py-2
                    text-[10px]
                    uppercase
                    tracking-widest
                    text-muted-foreground
                  "
                >
                  {groupLabels[groupKey] ||
                    groupKey}
                </p>
              )}

              {items.map((item) => {
                const Icon = item.icon;

                const active = isActive(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`
                      group relative
                      flex items-center gap-3
                      mx-2 px-3 py-2.5
                      rounded-lg
                      text-sm font-medium
                      transition-all

                      ${
                        active
                          ? 'bg-cyan-100 text-cyan-700'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }

                      ${
                        collapsed
                          ? 'justify-center px-0 mx-auto w-11'
                          : ''
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      className="flex-shrink-0"
                    />

                    {!collapsed && (
                      <span className="flex-1">
                        {item.label}
                      </span>
                    )}

                    {!collapsed &&
                      item.badge !== undefined && (
                        <span
                          className="
                            w-5 h-5
                            flex items-center justify-center
                            rounded-full
                            bg-cyan-700
                            text-white
                            text-[10px]
                          "
                        >
                          {item.badge}
                        </span>
                      )}
                  </Link>
                );
              })}
            </div>
          )
        )}
      </nav>

      {/* =================================================
          LOGOUT
      ================================================= */}

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          className={`
            group relative
            flex items-center gap-3
            w-full px-3 py-2.5
            rounded-lg
            text-sm font-medium
            text-muted-foreground
            hover:bg-red-100
            hover:text-red-600
            transition-all

            ${
              collapsed
                ? 'justify-center px-0'
                : ''
            }
          `}
          title={
            collapsed ? 'Logout' : undefined
          }
        >
          <LogOut
            size={18}
            className="flex-shrink-0"
          />

          {!collapsed && (
            <span>Logout</span>
          )}

          {collapsed && (
            <span
              className="
                absolute
                left-full
                ml-3
                px-2.5
                py-1.5
                bg-foreground
                text-background
                text-xs
                rounded-md
                whitespace-nowrap
                opacity-0
                group-hover:opacity-100
                transition-opacity
                z-50
              "
            >
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}