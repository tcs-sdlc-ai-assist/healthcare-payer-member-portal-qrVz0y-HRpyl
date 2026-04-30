import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES, ROLES } from './constants/constants.js';

import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BenefitsPage from './pages/BenefitsPage.jsx';
import ClaimsPage from './pages/ClaimsPage.jsx';
import ClaimDetailsPage from './pages/ClaimDetailsPage.jsx';
import ClaimSubmissionPage from './pages/ClaimSubmissionPage.jsx';
import GetCarePage from './pages/GetCarePage.jsx';
import IDCardsPage from './pages/IDCardsPage.jsx';
import DocumentCenterPage from './pages/DocumentCenterPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import WellnessPage from './pages/WellnessPage.jsx';
import PrescriptionsPage from './pages/PrescriptionsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AdminPanelPage from './pages/AdminPanelPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import DashboardLayout from './components/layout/DashboardLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

/**
 * Application router configuration.
 * Defines all public, protected, and admin-only routes.
 * Protected routes are wrapped in ProtectedRoute for authentication enforcement.
 * Authenticated routes use DashboardLayout for consistent page structure.
 *
 * @type {import('react-router-dom').Router}
 */
const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Navigate to={ROUTES.DASHBOARD} replace />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.COVERAGE,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <BenefitsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CLAIMS,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ClaimsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/claims/submit',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ClaimSubmissionPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CLAIM_DETAIL,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ClaimDetailsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.FIND_DOCTOR,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <GetCarePage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DOCUMENTS,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DocumentCenterPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <NotificationsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/wellness',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <WellnessPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/prescriptions',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <PrescriptionsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/id-cards',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <IDCardsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PAYMENTS,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
              }}
            >
              Payments
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Payments functionality will be available in a future release.
            </p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MESSAGES,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
              }}
            >
              Messages
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Secure messaging will be available in a future release.
            </p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <SettingsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN,
    element: (
      <ProtectedRoute
        requiredRoles={[ROLES.ADMIN]}
        unauthorizedRedirectTo={ROUTES.DASHBOARD}
      >
        <DashboardLayout>
          <AdminPanelPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);

export default router;