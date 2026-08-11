import { jwtDecode } from 'jwt-decode';

/* ============================================================
   STORAGE KEYS
============================================================ */

export const TOKEN_KEY = 'accessToken';

export const REFRESH_TOKEN_KEY =
  'refreshToken';

export const ROLE_KEY = 'role';

export const USERNAME_KEY = 'username';

export const FIRST_NAME_KEY = 'firstName';

export const LAST_NAME_KEY = 'lastName';

export const PATIENT_ID_KEY = 'patientId';

/* ============================================================
   JWT PAYLOAD
============================================================ */

export interface JwtPayload {
  sub?: string;

  email?: string;

  name?: string;

  unique_name?: string;

  preferred_username?: string;

  username?: string;

  userName?: string;

  userId?: string;

  role?: string;

  exp?: number;

  iat?: number;

  [key: string]: unknown;
}

/* ============================================================
   USER INFORMATION
============================================================ */

export interface StoredUserInfo {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  patientId?: string | null;
}

/* ============================================================
   SAVE AUTHENTICATION TOKENS
============================================================ */

export const saveTokens = (
  accessToken: string,
  refreshToken: string | null,
  role: string
) => {
  if (
    typeof window === 'undefined'
  ) {
    return;
  }

  localStorage.setItem(
    TOKEN_KEY,
    accessToken
  );

  localStorage.setItem(
    ROLE_KEY,
    role
  );

  if (refreshToken) {
    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      refreshToken
    );
  } else {
    localStorage.removeItem(
      REFRESH_TOKEN_KEY
    );
  }

  /*
   * Keep cookies synchronized.
   */

  document.cookie =
    `accessToken=${accessToken}; path=/`;

  document.cookie =
    `role=${role}; path=/`;
};

/* ============================================================
   SAVE USER INFORMATION
============================================================ */

export const saveUserInfo = (
  user: StoredUserInfo
) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    USERNAME_KEY,
    user.username
  );

  localStorage.setItem(
    FIRST_NAME_KEY,
    user.firstName
  );

  localStorage.setItem(
    LAST_NAME_KEY,
    user.lastName
  );

  localStorage.setItem(
    ROLE_KEY,
    user.role
  );

  // --------------------------------------------------
  // PATIENT ID
  // --------------------------------------------------

  if (user.patientId) {
    localStorage.setItem(
      PATIENT_ID_KEY,
      user.patientId
    );
  } else {
    // VERY IMPORTANT:
    // Do not keep the previous patient's ID.
    localStorage.removeItem(
      PATIENT_ID_KEY
    );
  }
};

/* ============================================================
   GET STORED USER INFORMATION
============================================================ */

export const getStoredUser = ():
  | StoredUserInfo
  | null => {
  if (
    typeof window === 'undefined'
  ) {
    return null;
  }

  const username =
    localStorage.getItem(
      USERNAME_KEY
    );

  const firstName =
    localStorage.getItem(
      FIRST_NAME_KEY
    );

  const lastName =
    localStorage.getItem(
      LAST_NAME_KEY
    );

  const role =
    localStorage.getItem(
      ROLE_KEY
    );

  /*
   * If there is no authentication information,
   * there is no logged-in user.
   */

  if (
    !username &&
    !firstName &&
    !lastName &&
    !role
  ) {
    return null;
  }

  return {
    username: username ?? '',
    firstName: firstName ?? '',
    lastName: lastName ?? '',
    role: role ?? '',
  };
};

/* ============================================================
   GET ACCESS TOKEN
============================================================ */

export const getAccessToken =
  (): string | null => {
    if (
      typeof window === 'undefined'
    ) {
      return null;
    }

    return localStorage.getItem(
      TOKEN_KEY
    );
  };

/* ============================================================
   GET LOGGED-IN ROLE
============================================================ */

export const getRole =
  (): string | null => {
    if (
      typeof window === 'undefined'
    ) {
      return null;
    }

    return localStorage.getItem(
      ROLE_KEY
    );
  };

/* ============================================================
   DECODE JWT TOKEN
============================================================ */

export const decodeToken =
  (): JwtPayload | null => {
    const token =
      getAccessToken();

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<JwtPayload>(
        token
      );
    } catch (error) {
      console.error(
        'Invalid JWT Token',
        error
      );

      return null;
    }
  };

/* ============================================================
   CHECK JWT EXPIRATION
============================================================ */

export const isTokenExpired =
  (): boolean => {
    const decoded =
      decodeToken();

    if (
      !decoded ||
      !decoded.exp
    ) {
      return true;
    }

    const currentTime =
      Date.now() / 1000;

    return (
      decoded.exp <
      currentTime
    );
  };

/* ============================================================
   CHECK AUTHENTICATION
============================================================ */

export const isAuthenticated =
  (): boolean => {
    const token =
      getAccessToken();

    if (!token) {
      return false;
    }

    return !isTokenExpired();
  };

/* ============================================================
   LOGOUT
============================================================ */

export const logout = () => {
  if (
    typeof window === 'undefined'
  ) {
    return;
  }

  /*
   * ----------------------------------------------------------
   * Remove authentication tokens
   * ----------------------------------------------------------
   */

  localStorage.removeItem(
    TOKEN_KEY
  );

  localStorage.removeItem(
    ROLE_KEY
  );

  localStorage.removeItem(
    REFRESH_TOKEN_KEY
  );

  /*
   * ----------------------------------------------------------
   * Remove logged-in user information
   * ----------------------------------------------------------
   */

  localStorage.removeItem(
    USERNAME_KEY
  );

  localStorage.removeItem(
    FIRST_NAME_KEY
  );

  localStorage.removeItem(
    LAST_NAME_KEY
  );

  localStorage.removeItem(
  PATIENT_ID_KEY
);

  /*
   * ----------------------------------------------------------
   * Clear cookies
   * ----------------------------------------------------------
   */

  document.cookie =
    'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  document.cookie =
    'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  /*
   * ----------------------------------------------------------
   * IMPORTANT:
   *
   * Notify Topbar, AppLayout and other authentication-aware
   * components immediately.
   * ----------------------------------------------------------
   */

  window.dispatchEvent(
    new Event('auth-change')
  );
};