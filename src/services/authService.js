/**
 * Authentication business logic service for the Healthcare Member Portal.
 * Provides login (validates against mock member profile), logout (clears session),
 * getSession (returns current session state), and getUserInfo functions.
 * Uses storage utility for session token management and integrates with
 * role-based access control for authorization checks.
 *
 * @module authService
 */

import { memberProfile, adminProfile, getMockProfileByRole } from '../data/memberProfile.js';
import { ROLES, SESSION_TIMEOUT, APP_CONFIG } from '../constants/constants.js';
import { getItem, setItem, removeItem } from '../utils/storage.js';
import { formatDate } from '../utils/formatters.js';

/**
 * Storage keys for authentication state.
 * @type {Object.<string, string>}
 */
const AUTH_STORAGE_KEYS = {
  SESSION: 'hcp_auth_session',
  LAST_ACTIVITY: 'hcp_auth_last_activity',
  TOKEN: 'hcp_auth_token',
};

/**
 * Mock credentials for development and testing.
 * @type {Object[]}
 */
const MOCK_CREDENTIALS = [
  {
    username: 'jane.doe',
    password: 'password123',
    profile: memberProfile,
  },
  {
    username: 'admin.user',
    password: 'admin123',
    profile: adminProfile,
  },
];

/**
 * Generates a mock session token.
 * @param {Object} user - The user profile object
 * @returns {string} A mock session token string
 */
const generateToken = (user) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  const userPart = (user.memberId || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  return `hcp_${userPart}_${timestamp}_${random}`;
};

/**
 * Validates a session token format.
 * @param {string|null|undefined} token - The token to validate
 * @returns {boolean} True if the token has a valid format
 */
const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  return token.startsWith('hcp_') && token.length > 10;
};

/**
 * Calculates the session expiration timestamp based on the configured timeout.
 * @returns {string} ISO 8601 timestamp for session expiration
 */
const calculateExpiresAt = () => {
  const expiresAt = new Date(Date.now() + SESSION_TIMEOUT.timeoutMs);
  return expiresAt.toISOString();
};

/**
 * Checks whether a session has expired based on its expiresAt timestamp.
 * @param {string|null|undefined} expiresAt - ISO 8601 expiration timestamp
 * @returns {boolean} True if the session has expired
 */
const isSessionExpired = (expiresAt) => {
  if (!expiresAt) {
    return true;
  }

  const expirationDate = new Date(expiresAt);

  if (isNaN(expirationDate.getTime())) {
    return true;
  }

  return Date.now() > expirationDate.getTime();
};

/**
 * Checks whether the session is within the warning window before expiration.
 * @param {string|null|undefined} expiresAt - ISO 8601 expiration timestamp
 * @returns {boolean} True if the session is within the warning window
 */
const isWithinWarningWindow = (expiresAt) => {
  if (!expiresAt) {
    return false;
  }

  const expirationDate = new Date(expiresAt);

  if (isNaN(expirationDate.getTime())) {
    return false;
  }

  const timeRemaining = expirationDate.getTime() - Date.now();
  return timeRemaining > 0 && timeRemaining <= SESSION_TIMEOUT.warningMs;
};

/**
 * Calculates the time remaining in the session in milliseconds.
 * @param {string|null|undefined} expiresAt - ISO 8601 expiration timestamp
 * @returns {number} Time remaining in milliseconds, or 0 if expired
 */
const getTimeRemaining = (expiresAt) => {
  if (!expiresAt) {
    return 0;
  }

  const expirationDate = new Date(expiresAt);

  if (isNaN(expirationDate.getTime())) {
    return 0;
  }

  const remaining = expirationDate.getTime() - Date.now();
  return remaining > 0 ? remaining : 0;
};

// ===== RBACService Functions =====

/**
 * Checks whether a user has a specific role.
 * @param {Object|null|undefined} user - The user profile object
 * @param {string} role - The role to check (use ROLES constants)
 * @returns {boolean} True if the user has the specified role
 */
export const hasRole = (user, role) => {
  if (!user || !role) {
    return false;
  }

  if (Array.isArray(user.roles)) {
    return user.roles.includes(role);
  }

  if (user.role) {
    return user.role === role;
  }

  return false;
};

/**
 * Checks whether a user has any of the specified roles.
 * @param {Object|null|undefined} user - The user profile object
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean} True if the user has at least one of the specified roles
 */
export const hasAnyRole = (user, roles) => {
  if (!user || !Array.isArray(roles) || roles.length === 0) {
    return false;
  }

  return roles.some((role) => hasRole(user, role));
};

/**
 * Checks whether a user is an admin.
 * @param {Object|null|undefined} user - The user profile object
 * @returns {boolean} True if the user has the ADMIN role
 */
export const isAdmin = (user) => {
  return hasRole(user, ROLES.ADMIN);
};

/**
 * Checks whether a user is a member.
 * @param {Object|null|undefined} user - The user profile object
 * @returns {boolean} True if the user has the MEMBER role
 */
export const isMember = (user) => {
  return hasRole(user, ROLES.MEMBER);
};

// ===== AuthService Functions =====

/**
 * Authenticates a user with username and password.
 * Validates against mock member profiles for development/testing.
 * On success, creates a session and stores it in storage.
 *
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to authenticate
 * @returns {Object} Login result with success status, token, user, and error
 */
export const login = (username, password) => {
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return {
      success: false,
      error: 'Username is required.',
      token: null,
      user: null,
      expiresAt: null,
    };
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    return {
      success: false,
      error: 'Password is required.',
      token: null,
      user: null,
      expiresAt: null,
    };
  }

  const trimmedUsername = username.trim().toLowerCase();

  const matchedCredential = MOCK_CREDENTIALS.find(
    (cred) => cred.username.toLowerCase() === trimmedUsername && cred.password === password
  );

  if (!matchedCredential) {
    return {
      success: false,
      error: 'Invalid credentials. Please check your username and password.',
      token: null,
      user: null,
      expiresAt: null,
    };
  }

  const profile = matchedCredential.profile;
  const token = generateToken(profile);
  const expiresAt = calculateExpiresAt();
  const now = new Date().toISOString();

  const session = {
    token,
    user: {
      id: profile.id,
      memberId: profile.memberId,
      username: profile.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      roles: profile.roles,
      dateOfBirth: profile.dateOfBirth,
      plan: profile.plan,
      address: profile.address,
      avatarUrl: profile.avatarUrl,
    },
    expiresAt,
    createdAt: now,
    lastActivity: now,
  };

  setItem(AUTH_STORAGE_KEYS.SESSION, session);
  setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  setItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY, now);

  return {
    success: true,
    error: null,
    token,
    user: session.user,
    expiresAt,
    expiresIn: SESSION_TIMEOUT.timeoutMs,
  };
};

/**
 * Logs out the current user by clearing all session data from storage.
 *
 * @returns {Object} Logout result with success status and message
 */
export const logout = () => {
  try {
    removeItem(AUTH_STORAGE_KEYS.SESSION);
    removeItem(AUTH_STORAGE_KEYS.TOKEN);
    removeItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY);

    return {
      success: true,
      error: null,
      message: 'Logged out successfully.',
    };
  } catch (error) {
    console.error('[authService] Error during logout:', error);
    return {
      success: false,
      error: 'An error occurred during logout.',
      message: null,
    };
  }
};

/**
 * Retrieves the current session state.
 * Validates the session token and checks for expiration.
 * If the session is expired, it is automatically cleared.
 *
 * @returns {Object} Session state with isAuthenticated, user, token, expiresAt, and warning info
 */
export const getSession = () => {
  const session = getItem(AUTH_STORAGE_KEYS.SESSION, null);

  if (!session) {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      expiresAt: null,
      timeRemaining: 0,
      isExpired: true,
      isWarning: false,
      error: null,
    };
  }

  if (!isValidTokenFormat(session.token)) {
    logout();
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      expiresAt: null,
      timeRemaining: 0,
      isExpired: true,
      isWarning: false,
      error: 'Invalid session token.',
    };
  }

  if (isSessionExpired(session.expiresAt)) {
    logout();
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      expiresAt: null,
      timeRemaining: 0,
      isExpired: true,
      isWarning: false,
      error: 'Session expired. Please log in again.',
    };
  }

  const timeRemaining = getTimeRemaining(session.expiresAt);
  const isWarning = isWithinWarningWindow(session.expiresAt);

  return {
    isAuthenticated: true,
    user: session.user,
    token: session.token,
    expiresAt: session.expiresAt,
    timeRemaining,
    isExpired: false,
    isWarning,
    error: null,
  };
};

/**
 * Returns the current authenticated user's information.
 * Returns null if no valid session exists.
 *
 * @returns {Object|null} User information object or null if not authenticated
 */
export const getUserInfo = () => {
  const session = getSession();

  if (!session.isAuthenticated) {
    return null;
  }

  return session.user;
};

/**
 * Refreshes the session by extending the expiration time.
 * Should be called on user activity to prevent session timeout.
 *
 * @returns {Object} Result with success status and updated session info
 */
export const refreshSession = () => {
  const session = getItem(AUTH_STORAGE_KEYS.SESSION, null);

  if (!session) {
    return {
      success: false,
      error: 'No active session.',
      expiresAt: null,
    };
  }

  if (!isValidTokenFormat(session.token)) {
    logout();
    return {
      success: false,
      error: 'Invalid session token.',
      expiresAt: null,
    };
  }

  if (isSessionExpired(session.expiresAt)) {
    logout();
    return {
      success: false,
      error: 'Session expired. Please log in again.',
      expiresAt: null,
    };
  }

  const now = new Date().toISOString();
  const newExpiresAt = calculateExpiresAt();

  const updatedSession = {
    ...session,
    expiresAt: newExpiresAt,
    lastActivity: now,
  };

  setItem(AUTH_STORAGE_KEYS.SESSION, updatedSession);
  setItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY, now);

  return {
    success: true,
    error: null,
    expiresAt: newExpiresAt,
    timeRemaining: getTimeRemaining(newExpiresAt),
  };
};

/**
 * Tracks user activity by updating the last activity timestamp.
 * Does not extend the session expiration unless refreshSession is called.
 *
 * @returns {boolean} True if activity was tracked successfully
 */
export const trackActivity = () => {
  const session = getItem(AUTH_STORAGE_KEYS.SESSION, null);

  if (!session || isSessionExpired(session.expiresAt)) {
    return false;
  }

  const now = new Date().toISOString();
  setItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY, now);

  return true;
};

/**
 * Checks whether the current session timeout enforcement should trigger.
 * Returns true if the session is expired and should be terminated.
 *
 * @returns {boolean} True if the session should be terminated due to timeout
 */
export const enforceTimeout = () => {
  const session = getItem(AUTH_STORAGE_KEYS.SESSION, null);

  if (!session) {
    return true;
  }

  if (isSessionExpired(session.expiresAt)) {
    logout();
    return true;
  }

  return false;
};

/**
 * Checks whether the current user is authenticated.
 *
 * @returns {boolean} True if the user has a valid, non-expired session
 */
export const isAuthenticated = () => {
  const session = getSession();
  return session.isAuthenticated;
};

/**
 * Returns the session timeout configuration values.
 *
 * @returns {Object} Session timeout configuration
 */
export const getSessionConfig = () => {
  return {
    timeoutMs: SESSION_TIMEOUT.timeoutMs,
    warningMs: SESSION_TIMEOUT.warningMs,
    checkIntervalMs: SESSION_TIMEOUT.checkIntervalMs,
    timeoutMinutes: APP_CONFIG.sessionTimeoutMinutes,
    warningMinutes: APP_CONFIG.sessionWarningMinutes,
  };
};

/**
 * Returns the current session's time remaining in a human-readable format.
 *
 * @returns {Object} Object with timeRemaining in ms, minutes, seconds, and formatted string
 */
export const getSessionTimeRemaining = () => {
  const session = getSession();

  if (!session.isAuthenticated) {
    return {
      timeRemainingMs: 0,
      minutes: 0,
      seconds: 0,
      formatted: '0:00',
      isWarning: false,
      isExpired: true,
    };
  }

  const timeRemainingMs = session.timeRemaining;
  const totalSeconds = Math.floor(timeRemainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formatted = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return {
    timeRemainingMs,
    minutes,
    seconds,
    formatted,
    isWarning: session.isWarning,
    isExpired: false,
  };
};

/**
 * Validates whether a user has access to a specific route based on their roles.
 *
 * @param {Object|null|undefined} user - The user profile object
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 * @returns {boolean} True if the user has at least one of the allowed roles
 */
export const canAccessRoute = (user, allowedRoles) => {
  if (!user) {
    return false;
  }

  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return true;
  }

  return hasAnyRole(user, allowedRoles);
};

/**
 * Returns the mock credentials for development/testing purposes.
 * Only returns usernames, never passwords.
 *
 * @returns {Object[]} Array of available mock user objects with username and role
 */
export const getAvailableMockUsers = () => {
  return MOCK_CREDENTIALS.map((cred) => ({
    username: cred.username,
    role: cred.profile.role,
    displayName: cred.profile.displayName,
  }));
};

/**
 * Returns the storage keys used by the auth service.
 * Useful for testing and debugging.
 *
 * @returns {Object.<string, string>} Map of storage key names to their values
 */
export const getAuthStorageKeys = () => {
  return { ...AUTH_STORAGE_KEYS };
};