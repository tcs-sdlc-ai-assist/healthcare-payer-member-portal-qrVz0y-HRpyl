import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import DocumentList from '../components/documents/DocumentList.jsx';
import { ROUTES } from '../constants/constants.js';

/**
 * DocumentCenterPage component.
 * Document Center page rendering DocumentList component with page header.
 * Uses HB CSS page-content layout. Tags page view via Glassbox on mount.
 *
 * @returns {React.ReactElement} The document center page element
 */
const DocumentCenterPage = () => {
  const { user } = useAuth();
  const { tagPageViewed } = useGlassbox();

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'Document Center',
      route: ROUTES.DOCUMENTS,
    });
  }, [tagPageViewed]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Document List */}
      <DocumentList id="document-center-page-list" />
    </div>
  );
};

export default DocumentCenterPage;