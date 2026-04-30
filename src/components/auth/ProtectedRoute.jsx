import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../constants/constants.js';

/**
 * ProtectedRoute component that enforces authentication and optional role-based access control.
 * Wraps route content and redirects unauthenticated users to the login page.
 * Optionally checks if the authenticated user has one of the required roles.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} [props.requiredRoles] - Array of roles allowed to access this route (if empty, any authenticated user can access)
 * @param {string} [props.redirectTo] - Custom redirect path for unauthenticated users (defaults to login)
 * @param {string} [props.unauthorizedRedirectTo] - Custom redirect path for users lacking required roles (defaults to dashboard)
 * @returns {React.ReactElement} The protected content, a loading indicator, or a redirect
 */
const ProtectedRoute = ({ children, requiredRoles, redirectTo, unauthorizedRedirectTo }) => {
  const { isAuthenticated, isLoading, user, checkAnyRole, checkRouteAccess } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="hb-flex hb-items-center hb-justify-center hb-min-h-screen" role="status" aria-label="Loading">
        <div className="hb-flex hb-flex-col hb-items-center hb-gap-4">
          <div
            className="hb-w-full"
            style={{
              width: '2.5rem',
              height: '2.5rem',
              border: '3px solid #e5e7eb',
              borderTopColor: '#0069cc',
              borderRadius: '9999px',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span className="hb-text-sm text-neutral">Verifying your session...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginPath = redirectTo || ROUTES.LOGIN;

    return (
      <Navigate
        to={loginPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (requiredRoles && Array.isArray(requiredRoles) && requiredRoles.length > 0) {
    const hasAccess = checkRouteAccess(requiredRoles);

    if (!hasAccess) {
      const fallbackPath = unauthorizedRedirectTo || ROUTES.DASHBOARD;

      return (
        <Navigate
          to={fallbackPath}
          replace
        />
      );
    }
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
  unauthorizedRedirectTo: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  requiredRoles: [],
  redirectTo: undefined,
  unauthorizedRedirectTo: undefined,
};

export default ProtectedRoute;