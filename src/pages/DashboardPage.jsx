import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import DashboardBanner from '../components/dashboard/DashboardBanner.jsx';
import WidgetContainer from '../components/dashboard/WidgetContainer.jsx';
import { HB_CLASSES } from '../constants/constants.js';

/**
 * DashboardPage component.
 * Main dashboard page composing DashboardBanner and WidgetContainer with all
 * dashboard widgets (FindCareCTAWidget, RecentClaimsWidget, IDCardSummaryWidget,
 * DeductibleOOPWidget, LearningCenterWidget). Reads widget order and visibility
 * from WidgetCustomizationContext via WidgetContainer. Renders personalized
 * greeting via DashboardBanner. Uses HB CSS grid for widget layout.
 *
 * @returns {React.ReactElement} The dashboard page element
 */
const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Dashboard Banner with personalized greeting */}
      <DashboardBanner id="dashboard-banner" />

      {/* Widget Container with customizable dashboard widgets */}
      <WidgetContainer id="dashboard-widgets" />
    </div>
  );
};

export default DashboardPage;