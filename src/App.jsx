import React from 'react';
import { RouterProvider } from 'react-router-dom';
import AuthProvider from './context/AuthContext.jsx';
import router from './router.jsx';

/**
 * Root application component.
 * Wraps the router with AuthProvider for authentication state management.
 * Additional providers (GlassboxContext, NotificationContext, WidgetCustomizationContext)
 * are applied within DashboardLayout for authenticated routes only.
 *
 * @returns {React.ReactElement} The root application element
 */
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;