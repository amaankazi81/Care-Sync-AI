'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  UserCircle,
  LogOut,
  Shield,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { logout } from '@/utils/auth';

interface TopbarProps {
  role: 'admin' | 'doctor' | 'patient' | 'receptionist';
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

const notifications = [
  {
    id: '1',
    message: 'No new notifications',
    time: '',
    unread: false,
  },
];

export default function Topbar({
  role,
  sidebarCollapsed,
  onMobileMenuToggle,
  mobileMenuOpen,
}: TopbarProps) {
  const router = useRouter();

  const { user } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  // --------------------------------------------------
  // DISPLAY NAME
  // --------------------------------------------------

  const displayName =
    user?.role === 'DOCTOR'
      ? `Dr. ${user.firstName} ${user.lastName}`
      : `${user?.firstName ?? ''} ${user?.lastName ?? ''}`;

  // --------------------------------------------------
  // DESIGNATION
  // --------------------------------------------------

  const designation = (() => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Hospital Administrator';

      case 'DOCTOR':
        return 'Doctor';

      case 'PATIENT':
        return 'Patient';

      case 'RECEPTIONIST':
        return 'Receptionist';

      default:
        return '';
    }
  })();

  // --------------------------------------------------
  // USER INITIALS
  // --------------------------------------------------

  const initials =
    `${user?.firstName?.charAt(0) ?? ''}` +
    `${user?.lastName?.charAt(0) ?? ''}`;

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    // Close dropdowns first
    setProfileOpen(false);
    setNotifOpen(false);

    // Clear authentication data
    logout();

    // Redirect to login page
    router.replace('/login');
  };

  // --------------------------------------------------
  // MY PROFILE
  // --------------------------------------------------

  const handleProfileClick = () => {
    // Close dropdown
    setProfileOpen(false);

    // Navigate to common profile page
    router.push('/profile');
  };

  return (
    <>
      {/* ==================================================
          TOPBAR
          ================================================== */}

      <header
        className="
          fixed
          top-0
          left-0
          right-0
          h-16
          bg-card
          border-b
          border-border
          z-50
          flex
          items-center
          px-4
          gap-4
        "
        style={{
          paddingLeft: `calc(${
            sidebarCollapsed ? '68px' : '260px'
          } + 1rem)`,
        }}
      >
        {/* ==================================================
            MOBILE MENU
            ================================================== */}

        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="
            lg:hidden
            flex
            items-center
            justify-center
            w-9
            h-9
            rounded-lg
            hover:bg-slate-100
            transition
          "
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>

        {/* ==================================================
            SEARCH
            ================================================== */}

        <div
          className={`
            relative
            flex-1
            max-w-md
            transition-all
            duration-200
            ${searchFocused ? 'max-w-lg' : ''}
          `}
        >
          <Search
            size={16}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search patients, doctors, appointments..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              py-2
              pl-9
              pr-4
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-600
            "
          />
        </div>

        {/* ==================================================
            RIGHT SIDE
            ================================================== */}

        <div className="ml-auto flex items-center gap-3">

          {/* ==================================================
              ROLE BADGE
              ================================================== */}

          <div
            className="
              hidden
              md:flex
              items-center
              gap-2
              rounded-full
              border
              bg-cyan-50
              px-3
              py-1
            "
          >
            <Shield
              size={13}
              className="text-cyan-700"
            />

            <span
              className="
                text-xs
                font-semibold
                capitalize
                text-cyan-700
              "
            >
              {role}
            </span>
          </div>

          {/* ==================================================
              NOTIFICATIONS
              ================================================== */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setNotifOpen((previous) => !previous);
                setProfileOpen(false);
              }}
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                hover:bg-slate-100
                transition
              "
              aria-label="Notifications"
            >
              <Bell size={18} />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    right-1
                    top-1
                    h-2
                    w-2
                    rounded-full
                    bg-red-500
                  "
                />
              )}
            </button>

            {/* Notification dropdown */}

            {notifOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-72
                  rounded-xl
                  border
                  bg-white
                  shadow-xl
                  z-[100]
                "
              >
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>
                </div>

                <div>
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="
                        border-b
                        last:border-b-0
                        px-4
                        py-4
                        hover:bg-slate-50
                      "
                    >
                      <p className="text-sm text-slate-700">
                        {item.message}
                      </p>

                      {item.time && (
                        <p className="mt-1 text-xs text-slate-400">
                          {item.time}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ==================================================
              PROFILE DROPDOWN
              ================================================== */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setProfileOpen((previous) => !previous);
                setNotifOpen(false);
              }}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                px-2
                py-1.5
                hover:bg-slate-100
                transition
              "
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              {/* Avatar */}

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-cyan-700
                  text-white
                  font-bold
                "
              >
                {initials}
              </div>

              {/* Name */}

              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-800">
                  {displayName}
                </p>

                <p className="text-xs text-slate-500">
                  {designation}
                </p>
              </div>

              {/* Arrow */}

              <ChevronDown
                size={16}
                className={`
                  transition-transform
                  ${profileOpen ? 'rotate-180' : ''}
                `}
              />
            </button>

            {/* ==================================================
                PROFILE DROPDOWN MENU
                ================================================== */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-60
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-xl
                  z-[100]
                  overflow-hidden
                "
              >
                {/* User information */}

                <div className="border-b px-4 py-4">
                  <p className="font-semibold text-slate-800">
                    {displayName}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {designation}
                  </p>
                </div>

                {/* Menu */}

                <div className="py-2">

                  {/* ==================================================
                      MY PROFILE
                      ================================================== */}

                  <button
                    type="button"
                    onClick={handleProfileClick}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-slate-700
                      hover:bg-slate-100
                      transition
                    "
                  >
                    <UserCircle size={18} />

                    <span>
                      My Profile
                    </span>
                  </button>

                  {/* Divider */}

                  <hr className="my-2" />

                  {/* ==================================================
                      LOGOUT
                      ================================================== */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-red-600
                      hover:bg-red-50
                      transition
                    "
                  >
                    <LogOut size={18} />

                    <span>
                      Logout
                    </span>
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ==================================================
          BACKDROP
          
          IMPORTANT:
          This backdrop is BEHIND the header/dropdowns.
          The previous z-index setup was causing the backdrop
          to sit on top of the dropdown and block clicks.
          ================================================== */}

      {(notifOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
    </>
  );
}