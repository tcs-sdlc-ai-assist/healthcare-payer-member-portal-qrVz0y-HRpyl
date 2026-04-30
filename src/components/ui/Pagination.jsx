import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES, PAGINATION } from '../../constants/constants.js';

/**
 * Reusable Pagination component implementing HB CSS classes.
 * Displays page numbers, previous/next buttons, and an optional items-per-page selector.
 * Fully accessible with ARIA navigation role, labels, and keyboard support.
 *
 * @param {Object} props
 * @param {number} props.page - Current page number (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items across all pages
 * @param {number} [props.pageSize=10] - Number of items per page
 * @param {Function} props.onPageChange - Callback invoked when the page changes, receives the new page number
 * @param {Function} [props.onPageSizeChange] - Callback invoked when the page size changes, receives the new page size
 * @param {number[]} [props.pageSizeOptions] - Array of page size options for the selector
 * @param {boolean} [props.showPageSizeSelector=true] - Whether to show the items-per-page selector
 * @param {boolean} [props.showItemCount=true] - Whether to show the item count summary
 * @param {number} [props.maxVisiblePages=5] - Maximum number of page buttons to display
 * @param {string} [props.className] - Additional CSS class names to append
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.ariaLabel='Pagination'] - Accessible label for the navigation
 * @returns {React.ReactElement|null} The pagination element or null if totalPages <= 1 and no selector
 */
const Pagination = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  showPageSizeSelector,
  showItemCount,
  maxVisiblePages,
  className,
  id,
  ariaLabel,
}) => {
  const currentPage = typeof page === 'number' && page >= 1 ? page : 1;
  const safeTotalPages = typeof totalPages === 'number' && totalPages >= 0 ? totalPages : 0;
  const safeTotalItems = typeof totalItems === 'number' && totalItems >= 0 ? totalItems : 0;
  const safePageSize = typeof pageSize === 'number' && pageSize >= 1 ? pageSize : PAGINATION.defaultPageSize;

  const effectivePageSizeOptions = useMemo(() => {
    if (Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0) {
      return pageSizeOptions;
    }
    return PAGINATION.pageSizeOptions;
  }, [pageSizeOptions]);

  /**
   * Calculates the range of visible page numbers.
   * @returns {number[]} Array of page numbers to display
   */
  const visiblePages = useMemo(() => {
    if (safeTotalPages <= 0) {
      return [];
    }

    if (safeTotalPages <= maxVisiblePages) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = maxVisiblePages;
    }

    if (end > safeTotalPages) {
      end = safeTotalPages;
      start = safeTotalPages - maxVisiblePages + 1;
    }

    if (start < 1) {
      start = 1;
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, safeTotalPages, maxVisiblePages]);

  const showStartEllipsis = useMemo(() => {
    return visiblePages.length > 0 && visiblePages[0] > 2;
  }, [visiblePages]);

  const showEndEllipsis = useMemo(() => {
    return visiblePages.length > 0 && visiblePages[visiblePages.length - 1] < safeTotalPages - 1;
  }, [visiblePages, safeTotalPages]);

  const showFirstPage = useMemo(() => {
    return visiblePages.length > 0 && visiblePages[0] > 1;
  }, [visiblePages]);

  const showLastPage = useMemo(() => {
    return visiblePages.length > 0 && visiblePages[visiblePages.length - 1] < safeTotalPages;
  }, [visiblePages, safeTotalPages]);

  /**
   * Calculates the item range for the current page.
   */
  const itemRange = useMemo(() => {
    if (safeTotalItems === 0) {
      return { start: 0, end: 0 };
    }

    const start = (currentPage - 1) * safePageSize + 1;
    const end = Math.min(currentPage * safePageSize, safeTotalItems);

    return { start, end };
  }, [currentPage, safePageSize, safeTotalItems]);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= safeTotalPages;

  /**
   * Handles page change.
   * @param {number} newPage - The new page number
   */
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > safeTotalPages || newPage === currentPage) {
      return;
    }

    if (onPageChange && typeof onPageChange === 'function') {
      onPageChange(newPage);
    }
  }, [currentPage, safeTotalPages, onPageChange]);

  /**
   * Handles previous page click.
   */
  const handlePrevious = useCallback(() => {
    handlePageChange(currentPage - 1);
  }, [currentPage, handlePageChange]);

  /**
   * Handles next page click.
   */
  const handleNext = useCallback(() => {
    handlePageChange(currentPage + 1);
  }, [currentPage, handlePageChange]);

  /**
   * Handles page size change from the selector.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event
   */
  const handlePageSizeChange = useCallback((e) => {
    const newSize = parseInt(e.target.value, 10);

    if (isNaN(newSize) || newSize < 1) {
      return;
    }

    if (onPageSizeChange && typeof onPageSizeChange === 'function') {
      onPageSizeChange(newSize);
    }
  }, [onPageSizeChange]);

  /**
   * Handles keyboard events on page buttons.
   * @param {React.KeyboardEvent} e - The keyboard event
   * @param {number} targetPage - The page number to navigate to
   */
  const handleKeyDown = useCallback((e, targetPage) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePageChange(targetPage);
    }
  }, [handlePageChange]);

  if (safeTotalPages <= 1 && !showPageSizeSelector) {
    if (showItemCount && safeTotalItems > 0) {
      return (
        <div
          id={id}
          className={className || ''}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          <span>
            Showing {itemRange.start}–{itemRange.end} of {safeTotalItems} items
          </span>
        </div>
      );
    }
    return null;
  }

  const containerClassName = [className || '']
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Renders a page number button.
   * @param {number} pageNum - The page number
   * @returns {React.ReactElement} The page button element
   */
  const renderPageButton = (pageNum) => {
    const isCurrent = pageNum === currentPage;

    return (
      <button
        key={pageNum}
        type="button"
        onClick={() => handlePageChange(pageNum)}
        onKeyDown={(e) => handleKeyDown(e, pageNum)}
        disabled={isCurrent}
        aria-label={isCurrent ? `Page ${pageNum}, current page` : `Go to page ${pageNum}`}
        aria-current={isCurrent ? 'page' : undefined}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2.25rem',
          height: '2.25rem',
          padding: '0 0.5rem',
          fontSize: '0.875rem',
          fontWeight: isCurrent ? 600 : 400,
          lineHeight: 1,
          color: isCurrent ? '#ffffff' : '#374151',
          backgroundColor: isCurrent ? '#0069cc' : 'transparent',
          border: isCurrent ? '1px solid #0069cc' : '1px solid #d1d5db',
          borderRadius: '0.375rem',
          cursor: isCurrent ? 'default' : 'pointer',
          transition: 'all 0.15s ease-in-out',
          userSelect: 'none',
        }}
      >
        {pageNum}
      </button>
    );
  };

  /**
   * Renders an ellipsis indicator.
   * @param {string} key - Unique key for the element
   * @returns {React.ReactElement} The ellipsis element
   */
  const renderEllipsis = (key) => {
    return (
      <span
        key={key}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2.25rem',
          height: '2.25rem',
          fontSize: '0.875rem',
          color: '#9ca3af',
          userSelect: 'none',
        }}
      >
        …
      </span>
    );
  };

  return (
    <div
      id={id}
      className={containerClassName || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Item count */}
        {showItemCount && safeTotalItems > 0 && (
          <span
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            Showing {itemRange.start}–{itemRange.end} of {safeTotalItems} items
          </span>
        )}

        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <label
              htmlFor={id ? `${id}-page-size` : 'pagination-page-size'}
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                whiteSpace: 'nowrap',
              }}
            >
              Items per page:
            </label>
            <select
              id={id ? `${id}-page-size` : 'pagination-page-size'}
              className={HB_CLASSES.formSelect}
              value={String(safePageSize)}
              onChange={handlePageSizeChange}
              aria-label="Items per page"
              style={{
                width: 'auto',
                minWidth: '4.5rem',
                padding: '0.375rem 2rem 0.375rem 0.5rem',
                fontSize: '0.875rem',
              }}
            >
              {effectivePageSizeOptions.map((option) => (
                <option key={option} value={String(option)}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page navigation */}
      {safeTotalPages > 1 && (
        <nav
          role="navigation"
          aria-label={ariaLabel}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Previous button */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstPage}
            aria-label="Go to previous page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              height: '2.25rem',
              padding: '0 0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isFirstPage ? '#9ca3af' : '#374151',
              backgroundColor: 'transparent',
              border: '1px solid',
              borderColor: isFirstPage ? '#e5e7eb' : '#d1d5db',
              borderRadius: '0.375rem',
              cursor: isFirstPage ? 'not-allowed' : 'pointer',
              opacity: isFirstPage ? 0.5 : 1,
              transition: 'all 0.15s ease-in-out',
              userSelect: 'none',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="tablet:hb-inline-flex" style={{ display: 'none' }}>Previous</span>
          </button>

          {/* First page */}
          {showFirstPage && renderPageButton(1)}

          {/* Start ellipsis */}
          {showStartEllipsis && renderEllipsis('start-ellipsis')}

          {/* Visible page numbers */}
          {visiblePages.map((pageNum) => {
            if ((showFirstPage && pageNum === 1) || (showLastPage && pageNum === safeTotalPages)) {
              return null;
            }
            return renderPageButton(pageNum);
          })}

          {/* End ellipsis */}
          {showEndEllipsis && renderEllipsis('end-ellipsis')}

          {/* Last page */}
          {showLastPage && renderPageButton(safeTotalPages)}

          {/* Next button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastPage}
            aria-label="Go to next page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              height: '2.25rem',
              padding: '0 0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isLastPage ? '#9ca3af' : '#374151',
              backgroundColor: 'transparent',
              border: '1px solid',
              borderColor: isLastPage ? '#e5e7eb' : '#d1d5db',
              borderRadius: '0.375rem',
              cursor: isLastPage ? 'not-allowed' : 'pointer',
              opacity: isLastPage ? 0.5 : 1,
              transition: 'all 0.15s ease-in-out',
              userSelect: 'none',
            }}
          >
            <span className="tablet:hb-inline-flex" style={{ display: 'none' }}>Next</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  showPageSizeSelector: PropTypes.bool,
  showItemCount: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
};

Pagination.defaultProps = {
  pageSize: PAGINATION.defaultPageSize,
  onPageSizeChange: undefined,
  pageSizeOptions: undefined,
  showPageSizeSelector: true,
  showItemCount: true,
  maxVisiblePages: 5,
  className: '',
  id: undefined,
  ariaLabel: 'Pagination',
};

export default Pagination;