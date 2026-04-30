import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  login as authLogin,
  logout as authLogout,
  getSession,
  getUserInfo,
  refreshSession,
  isAuthenticated as checkIsAuthenticated,
  hasRole,
  hasAnyRole,
  isAdmin,
  isMember,
  canAccessRoute,
  getSessionTimeRemaining,
} from '../services/authService.js';
import {
  startMonitoring,
  stopMonitoring,
  extendSession,
  checkSessionStatus,
  logoutAndStopMonitoring,
  getSessionStatusSummary,
} from '../services/sessionManager.js';
import {
  initialize as initializeGlassbox,
  reset as resetGlassbox,
} from '../services/glassboxService.js';

/**
 * @typedef {Object} AuthContextValue
 * @property {Object|null} user - The current authenticated user object or null
 * @property {boolean} isAuthenticated - Whether the user is currently authenticated
 * @property {boolean} isLoading - Whether authentication state is being loaded/checked
 * @property {string|null} error - Current authentication error message or null
 * @property {boolean} isSessionWarning - Whether the session timeout warning is active
 * @property {string} sessionTimeRemaining - Formatted time remaining in session (e.g., "2:30")
 * @property {Function} login - Authenticates a user with username and password
 * @property {Function} logout - Logs out the current user
 * @property {Function} extendUserSession - Extends the current session
 * @property {Function} clearError - Clears the current error message
 * @property {Function} checkRole - Checks if the current user has a specific role
 * @property {Function} checkAnyRole - Checks if the current user has any of the specified roles
 * @property {Function} checkIsAdmin - Checks if the current user is an admin
 * @property {Function} checkIsMember - Checks if the current user is a member
 * @property {Function} checkRouteAccess - Checks if the current user can access a route
 */

const AuthContext = createContext(null);

/**
 * Custom hook to consume the AuthContext.
 * Must be used within an AuthProvider.
 *
 * @returns {AuthContextValue} The authentication context value
 * @throws {Error} If used outside of an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
};

/**
 * Authentication context provider component.
 * Wraps the application to provide authentication state, login/logout functions,
 * session management, and role-based access control.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {React.ReactElement} The provider component
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSessionWarning, setIsSessionWarning] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState('0:00');

  const sessionCheckIntervalRef = useRef(null);

  /**
   * Updates session time remaining display.
   */
  const updateSessionTime = useCallback(() => {
    if (!checkIsAuthenticated()) {
      setSessionTimeRemaining('0:00');
      return;
    }

    const timeInfo = getSessionTimeRemaining();
    setSessionTimeRemaining(timeInfo.formatted);
    setIsSessionWarning(timeInfo.isWarning);
  }, []);

  /**
   * Handles session warning callback from sessionManager.
   * @param {Object} timeInfo - Time remaining information
   */
  const handleSessionWarning = useCallback((timeInfo) => {
    setIsSessionWarning(true);
    setSessionTimeRemaining(timeInfo.timeRemainingFormatted);
  }, []);

  /**
   * Handles session expired callback from sessionManager.
   */
  const handleSessionExpired = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setIsSessionWarning(false);
    setSessionTimeRemaining('0:00');
    setError('Your session has expired. Please log in again.');

    resetGlassbox();

    if (sessionCheckIntervalRef.current) {
      clearInterval(sessionCheckIntervalRef.current);
      sessionCheckIntervalRef.current = null;
    }
  }, []);

  /**
   * Starts session monitoring and periodic time updates.
   */
  const startSessionTracking = useCallback(() => {
    startMonitoring({
      onWarning: handleSessionWarning,
      onExpired: handleSessionExpired,
      onActivity: null,
    });

    if (sessionCheckIntervalRef.current) {
      clearInterval(sessionCheckIntervalRef.current);
    }

    sessionCheckIntervalRef.current = setInterval(() => {
      updateSessionTime();
    }, 10000);

    updateSessionTime();
  }, [handleSessionWarning, handleSessionExpired, updateSessionTime]);

  /**
   * Stops session monitoring and clears periodic time updates.
   */
  const stopSessionTracking = useCallback(() => {
    stopMonitoring();

    if (sessionCheckIntervalRef.current) {
      clearInterval(sessionCheckIntervalRef.current);
      sessionCheckIntervalRef.current = null;
    }
  }, []);

  /**
   * Initializes authentication state from existing session on mount.
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const session = getSession();

        if (session.isAuthenticated && session.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          setError(null);

          initializeGlassbox({
            userId: session.user.memberId,
            userRole: session.user.role,
          });

          startSessionTracking();
        } else {
          setUser(null);
          setIsAuthenticated(false);

          if (session.error && session.error.includes('expired')) {
            setError(session.error);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Error initializing auth state:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      stopSessionTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Authenticates a user with username and password.
   *
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Object} Login result with success status
   */
  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = authLogin(username, password);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        setError(null);

        initializeGlassbox({
          userId: result.user.memberId,
          userRole: result.user.role,
        });

        startSessionTracking();

        return {
          success: true,
          error: null,
          user: result.user,
        };
      }

      setError(result.error);
      return {
        success: false,
        error: result.error,
        user: null,
      };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      console.error('[AuthContext] Login error:', err);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        user: null,
      };
    } finally {
      setIsLoading(false);
    }
  }, [startSessionTracking]);

  /**
   * Logs out the current user and cleans up session state.
   *
   * @returns {Object} Logout result with success status
   */
  const logout = useCallback(() => {
    try {
      stopSessionTracking();

      const result = logoutAndStopMonitoring();

      setUser(null);
      setIsAuthenticated(false);
      setIsSessionWarning(false);
      setSessionTimeRemaining('0:00');
      setError(null);

      resetGlassbox();

      return {
        success: true,
        error: null,
        message: result.message || 'Logged out successfully.',
      };
    } catch (err) {
      console.error('[AuthContext] Logout error:', err);

      setUser(null);
      setIsAuthenticated(false);
      setIsSessionWarning(false);
      setSessionTimeRemaining('0:00');

      resetGlassbox();

      return {
        success: false,
        error: 'An error occurred during logout.',
        message: null,
      };
    }
  }, [stopSessionTracking]);

  /**
   * Extends the current session by refreshing the expiration time.
   *
   * @returns {Object} Result with success status
   */
  const extendUserSession = useCallback(() => {
    try {
      const result = extendSession();

      if (result.success) {
        setIsSessionWarning(false);
        updateSessionTime();

        return {
          success: true,
          error: null,
          expiresAt: result.expiresAt,
        };
      }

      if (result.error && result.error.includes('expired')) {
        handleSessionExpired();
      }

      return {
        success: false,
        error: result.error,
        expiresAt: null,
      };
    } catch (err) {
      console.error('[AuthContext] Extend session error:', err);
      return {
        success: false,
        error: 'Unable to extend session.',
        expiresAt: null,
      };
    }
  }, [updateSessionTime, handleSessionExpired]);

  /**
   * Clears the current error message.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Checks if the current user has a specific role.
   *
   * @param {string} role - The role to check
   * @returns {boolean} True if the user has the role
   */
  const checkRole = useCallback((role) => {
    return hasRole(user, role);
  }, [user]);

  /**
   * Checks if the current user has any of the specified roles.
   *
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean} True if the user has at least one of the roles
   */
  const checkAnyRole = useCallback((roles) => {
    return hasAnyRole(user, roles);
  }, [user]);

  /**
   * Checks if the current user is an admin.
   *
   * @returns {boolean} True if the user is an admin
   */
  const checkIsAdmin = useCallback(() => {
    return isAdmin(user);
  }, [user]);

  /**
   * Checks if the current user is a member.
   *
   * @returns {boolean} True if the user is a member
   */
  const checkIsMember = useCallback(() => {
    return isMember(user);
  }, [user]);

  /**
   * Checks if the current user can access a route based on allowed roles.
   *
   * @param {string[]} allowedRoles - Array of roles allowed to access the route
   * @returns {boolean} True if the user can access the route
   */
  const checkRouteAccess = useCallback((allowedRoles) => {
    return canAccessRoute(user, allowedRoles);
  }, [user]);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    isSessionWarning,
    sessionTimeRemaining,
    login,
    logout,
    extendUserSession,
    clearError,
    checkRole,
    checkAnyRole,
    checkIsAdmin,
    checkIsMember,
    checkRouteAccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
export default AuthProvider;