import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Reusable Modal dialog component implementing HB CSS modal classes.
 * Supports overlay, dialog positioning, header/body/footer sections,
 * sizes (sm, md, lg, xl), z-index stacking, scrollable and centered variants.
 * Fully accessible with ARIA roles, focus trap, and keyboard dismiss (Escape key).
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is currently open/visible
 * @param {Function} props.onClose - Callback invoked when the modal should close (Escape key, overlay click, close button)
 * @param {React.ReactNode} [props.children] - Modal body content (used if no header/body/footer props are provided)
 * @param {React.ReactNode} [props.header] - Content to render in the modal header section
 * @param {React.ReactNode} [props.body] - Content to render in the modal body section
 * @param {React.ReactNode} [props.footer] - Content to render in the modal footer section
 * @param {string} [props.title] - Title text rendered in the modal header (alternative to header prop)
 * @param {string} [props.size='md'] - Modal size variant ('sm', 'md', 'lg', 'xl')
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button in the header
 * @param {boolean} [props.closeOnOverlayClick=true] - Whether clicking the overlay closes the modal
 * @param {boolean} [props.closeOnEscape=true] - Whether pressing Escape closes the modal
 * @param {string} [props.ariaLabelledBy] - ID of the element that labels the modal
 * @param {string} [props.ariaDescribedBy] - ID of the element that describes the modal
 * @param {string} [props.className] - Additional CSS class names for the modal dialog
 * @param {string} [props.overlayClassName] - Additional CSS class names for the overlay
 * @param {string} [props.id] - HTML id attribute for the modal dialog
 * @param {string} [props.role='dialog'] - ARIA role for the modal ('dialog' or 'alertdialog')
 * @param {boolean} [props.scrollable=false] - Whether the modal body should be independently scrollable
 * @param {boolean} [props.centered=true] - Whether the modal should be vertically centered
 * @returns {React.ReactElement|null} The modal element or null if not open
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  header,
  body,
  footer,
  title,
  size,
  showCloseButton,
  closeOnOverlayClick,
  closeOnEscape,
  ariaLabelledBy,
  ariaDescribedBy,
  className,
  overlayClassName,
  id,
  role,
  scrollable,
  centered,
}) => {
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  /**
   * Returns the HB CSS size class for the given size.
   * @param {string} s - The size string
   * @returns {string} The HB CSS size class string or empty string for default
   */
  const getSizeClass = (s) => {
    switch (s) {
      case 'sm':
        return HB_CLASSES.modalSm;
      case 'lg':
        return HB_CLASSES.modalLg;
      case 'xl':
        return HB_CLASSES.modalXl;
      case 'md':
      default:
        return '';
    }
  };

  /**
   * Handles overlay click events.
   * Closes the modal if closeOnOverlayClick is true and the click target is the overlay itself.
   * @param {React.MouseEvent} e - The click event
   */
  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    }
  }, [closeOnOverlayClick, onClose]);

  /**
   * Handles close button click.
   */
  const handleCloseClick = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  /**
   * Stores the previously focused element and focuses the modal when it opens.
   * Restores focus when the modal closes.
   */
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement;

      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    } else {
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }
  }, [isOpen]);

  /**
   * Prevents body scroll when modal is open.
   */
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  /**
   * Handles keyboard events for Escape key dismiss and focus trapping.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && closeOnEscape) {
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClass = getSizeClass(size);

  const overlayClasses = [
    HB_CLASSES.modalOverlay,
    overlayClassName || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const modalClasses = [
    HB_CLASSES.modal,
    sizeClass,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const generatedTitleId = id ? `${id}-title` : 'modal-title';
  const effectiveLabelledBy = ariaLabelledBy || (title ? generatedTitleId : undefined);

  const hasHeader = header !== undefined || title !== undefined || showCloseButton;
  const hasBody = body !== undefined;
  const hasFooter = footer !== undefined;
  const hasStructuredContent = hasHeader || hasBody || hasFooter;

  const overlayStyle = centered
    ? undefined
    : {
        alignItems: 'flex-start',
        paddingTop: '3rem',
      };

  const modalBodyStyle = scrollable
    ? {
        overflowY: 'auto',
        maxHeight: '60vh',
      }
    : undefined;

  return (
    <div
      className={overlayClasses}
      onClick={handleOverlayClick}
      role="presentation"
      style={overlayStyle}
    >
      <div
        className={modalClasses}
        ref={modalRef}
        id={id}
        role={role}
        aria-modal="true"
        aria-labelledby={effectiveLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
      >
        {hasStructuredContent ? (
          <>
            {hasHeader && (
              <div className={HB_CLASSES.modalHeader}>
                {title && (
                  <h2
                    id={effectiveLabelledBy}
                    style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}
                  >
                    {title}
                  </h2>
                )}
                {header && !title && header}
                {showCloseButton && (
                  <button
                    type="button"
                    className={HB_CLASSES.modalClose}
                    onClick={handleCloseClick}
                    aria-label="Close modal"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            {hasBody && (
              <div className={HB_CLASSES.modalBody} style={modalBodyStyle}>
                {body}
              </div>
            )}
            {!hasBody && children && (
              <div className={HB_CLASSES.modalBody} style={modalBodyStyle}>
                {children}
              </div>
            )}
            {hasFooter && (
              <div className={HB_CLASSES.modalFooter}>
                {footer}
              </div>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  header: PropTypes.node,
  body: PropTypes.node,
  footer: PropTypes.node,
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  ariaLabelledBy: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  id: PropTypes.string,
  role: PropTypes.oneOf(['dialog', 'alertdialog']),
  scrollable: PropTypes.bool,
  centered: PropTypes.bool,
};

Modal.defaultProps = {
  children: null,
  header: undefined,
  body: undefined,
  footer: undefined,
  title: undefined,
  size: 'md',
  showCloseButton: true,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  ariaLabelledBy: undefined,
  ariaDescribedBy: undefined,
  className: '',
  overlayClassName: '',
  id: undefined,
  role: 'dialog',
  scrollable: false,
  centered: true,
};

export default Modal;