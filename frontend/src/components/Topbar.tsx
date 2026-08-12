'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  Bell,
  ChevronDown,
  Menu,
  X,
  UserCircle,
  LogOut,
  Shield,
  HeartPulse,
} from 'lucide-react';

import {
  getStoredUser,
  logout,
} from '@/utils/auth';

interface TopbarProps {
  role:
  | 'admin'
  | 'doctor'
  | 'patient'
  | 'receptionist';

  sidebarCollapsed: boolean;

  onMobileMenuToggle: () => void;

  mobileMenuOpen: boolean;
}

interface TopbarUser {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
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

  /*
   * ----------------------------------------------------------
   * USER STATE
   * ----------------------------------------------------------
   *
   * We deliberately keep a local copy of the logged-in user.
   * This prevents the Topbar from displaying a stale user
   * after switching accounts.
   */

  const [user, setUser] =
    useState<TopbarUser | null>(null);

  const [notifOpen, setNotifOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [searchFocused, setSearchFocused] =
    useState(false);

  /* ==========================================================
     LOAD USER
  ========================================================== */

  const loadUser = () => {
    const storedUser =
      getStoredUser();

    if (!storedUser) {
      setUser(null);
      return;
    }

    setUser({
      username:
        storedUser.username,

      firstName:
        storedUser.firstName,

      lastName:
        storedUser.lastName,

      role:
        storedUser.role,
    });
  };

  /* ==========================================================
     INITIAL USER LOAD
  ========================================================== */

  useEffect(() => {
    loadUser();
  }, []);

  /* ==========================================================
     AUTH CHANGE LISTENER
  ========================================================== */

  useEffect(() => {
    const handleAuthChange =
      () => {
        /*
         * Immediately reload the current
         * logged-in user.
         */

        loadUser();

        /*
         * Close old account's open menus.
         */

        setProfileOpen(false);

        setNotifOpen(false);
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
  }, []);

  /* ==========================================================
     STORAGE CHANGE LISTENER
  ========================================================== */

  useEffect(() => {
    const handleStorageChange =
      () => {
        loadUser();
      };

    window.addEventListener(
      'storage',
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      );
    };
  }, []);

  /* ==========================================================
     PAGE SHOW
  ========================================================== */

  useEffect(() => {
    const handlePageShow =
      () => {
        loadUser();
      };

    window.addEventListener(
      'pageshow',
      handlePageShow
    );

    return () => {
      window.removeEventListener(
        'pageshow',
        handlePageShow
      );
    };
  }, []);

  /* ==========================================================
     NOTIFICATION COUNT
  ========================================================== */

  const unreadCount =
    notifications.filter(
      (item) =>
        item.unread
    ).length;

  /* ==========================================================
     DISPLAY NAME
  ========================================================== */

  const firstName =
    user?.firstName?.trim() ?? '';

  const lastName =
    user?.lastName?.trim() ?? '';

  const displayName =
    user?.role?.toUpperCase() ===
      'DOCTOR'
      ? `Dr. ${firstName} ${lastName}`.trim()
      : `${firstName} ${lastName}`.trim();

  /*
   * If first/last name is not available,
   * show username instead.
   */

  const safeDisplayName =
    displayName ||
    user?.username ||
    'User';

  /* ==========================================================
     DESIGNATION
  ========================================================== */

  const designation =
    (() => {
      switch (
      user?.role?.toUpperCase()
      ) {
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

  /* ==========================================================
     INITIALS
  ========================================================== */

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();

  const safeInitials =
    initials ||
    user?.username
      ?.charAt(0)
      .toUpperCase() ||
    'U';

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = () => {
    setProfileOpen(false);

    setNotifOpen(false);

    /*
     * logout() clears all authentication information
     * and dispatches auth-change.
     */

    logout();

    /*
     * Use a hard navigation to guarantee that the
     * previous dashboard cannot remain in the App Router
     * client cache.
     */

    window.location.href =
      '/login';
  };

  /* ==========================================================
     MY PROFILE
  ========================================================== */

  const handleProfileClick = () => {
    setProfileOpen(false);

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
          paddingLeft:
            `calc(${sidebarCollapsed
              ? '68px'
              : '260px'
            } + 1rem)`,
        }}
      >
        {/* ==================================================
            MOBILE MENU
        ================================================== */}

        <button
          type="button"
          onClick={
            onMobileMenuToggle
          }
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
    APPLICATION BRAND
    ================================================== */}

        <div className="flex items-center gap-3 min-w-fit">

          {/* Logo */}

          <div
            className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      bg-cyan-600
      text-white
      shadow-sm
    "
          >
            <HeartPulse size={22} strokeWidth={2.3} />
          </div>

          {/* Brand Name */}

          <div className="hidden sm:block">

            <p
              className="
        text-base
        font-bold
        leading-tight
        text-slate-800
      "
            >
              CareSync AI
            </p>

            <p
              className="
        text-[10px]
        font-medium
        leading-tight
        text-slate-700
      "
            >
              Hospital Management System
            </p>

          </div>

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
                setNotifOpen(
                  (previous) =>
                    !previous
                );

                setProfileOpen(
                  false
                );
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

              {unreadCount >
                0 && (
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
                  {notifications.map(
                    (item) => (
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
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ==================================================
              PROFILE
          ================================================== */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setProfileOpen(
                  (previous) =>
                    !previous
                );

                setNotifOpen(
                  false
                );
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
              aria-expanded={
                profileOpen
              }
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
                {safeInitials}
              </div>

              {/* Name */}

              <div className="hidden md:block text-left">

                <p className="text-sm font-semibold text-slate-800">
                  {safeDisplayName}
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
                  ${profileOpen
                    ? 'rotate-180'
                    : ''
                  }
                `}
              />
            </button>

            {/* ==================================================
                PROFILE DROPDOWN
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
                    {safeDisplayName}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {designation}
                  </p>

                  {user?.username && (
                    <p className="mt-1 text-xs text-slate-400">
                      @{user.username}
                    </p>
                  )}

                </div>

                <div className="py-2">

                  {/* My Profile */}

                  <button
                    type="button"
                    onClick={
                      handleProfileClick
                    }
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
                    <UserCircle
                      size={18}
                    />

                    <span>
                      My Profile
                    </span>
                  </button>

                  <hr className="my-2" />

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
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
                    <LogOut
                      size={18}
                    />

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
      ================================================== */}

      {(notifOpen ||
        profileOpen) && (
          <div
            className="
            fixed
            inset-0
            z-40
          "
            onClick={() => {
              setNotifOpen(false);

              setProfileOpen(false);
            }}
          />
        )}
    </>
  );
}