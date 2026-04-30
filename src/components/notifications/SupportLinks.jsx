import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES, SUPPORT } from '../../constants/constants.js';
import LeavingSiteModal from '../ui/LeavingSiteModal.jsx';

/**
 * SupportLinks component.
 * Support entry points component displaying Email, Chat, and Call support links
 * configured via constants. Each link has appropriate icon and accessible label.
 * Chat opens external URL via LeavingSiteModal, Email opens mailto, Call opens tel link.
 * Uses HB CSS button and link classes.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.layout='horizontal'] - Layout orientation ('horizontal' or 'vertical')
 * @param {string} [props.size='md'] - Button/link size ('sm', 'md', 'lg')
 * @param {boolean} [props.showLabels=true] - Whether to show text labels alongside icons
 * @param {boolean} [props.showDescriptions=false] - Whether to show description text below each link
 * @returns {React.ReactElement} The support links element
 */
const SupportLinks = ({ className, id, layout, size, showLabels, showDescriptions }) => {
  const [isLeavingSiteOpen, setIsLeavingSiteOpen] = useState(false);
  const [leavingSiteUrl, setLeavingSiteUrl] = useState('');
  const [leavingSiteTitle, setLeavingSiteTitle] = useState('');
  const [leavingSiteCategory, setLeavingSiteCategory] = useState('');

  /**
   * Handles opening the chat external link via the leaving site modal.
   */
  const handleChatClick = useCallback(() => {
    setLeavingSiteUrl(SUPPORT.chatUrl);
    setLeavingSiteTitle('Member Services Chat');
    setLeavingSiteCategory('support');
    setIsLeavingSiteOpen(true);
  }, []);

  /**
   * Closes the leaving site modal.
   */
  const handleCloseLeavingSite = useCallback(() => {
    setIsLeavingSiteOpen(false);
    setLeavingSiteUrl('');
    setLeavingSiteTitle('');
    setLeavingSiteCategory('');
  }, []);

  /**
   * Returns size-specific inline styles for the support link buttons.
   * @param {string} s - The size string
   * @returns {Object} Inline style object
   */
  const getSizeStyle = (s) => {
    switch (s) {
      case 'sm':
        return {
          padding: '0.375rem 0.75rem',
          fontSize: '0.8125rem',
          iconSize: '16',
        };
      case 'lg':
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          iconSize: '22',
        };
      case 'md':
      default:
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          iconSize: '18',
        };
    }
  };

  const sizeConfig = getSizeStyle(size);
  const isHorizontal = layout === 'horizontal';

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const containerStyle = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    alignItems: isHorizontal ? 'center' : 'stretch',
    gap: isHorizontal ? '0.75rem' : '0.5rem',
    flexWrap: isHorizontal ? 'wrap' : 'nowrap',
  };

  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: sizeConfig.padding,
    fontSize: sizeConfig.fontSize,
    fontWeight: 500,
    color: '#0069cc',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    lineHeight: 1.5,
    whiteSpace: 'nowrap',
  };

  const linkHoverHandlers = {
    onMouseEnter: (e) => {
      e.currentTarget.style.backgroundColor = '#e6f0fa';
      e.currentTarget.style.borderColor = '#0069cc';
      e.currentTarget.style.color = '#0054a3';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.backgroundColor = '#ffffff';
      e.currentTarget.style.borderColor = '#d1d5db';
      e.currentTarget.style.color = '#0069cc';
    },
    onFocus: (e) => {
      e.currentTarget.style.backgroundColor = '#e6f0fa';
      e.currentTarget.style.borderColor = '#0069cc';
      e.currentTarget.style.color = '#0054a3';
    },
    onBlur: (e) => {
      e.currentTarget.style.backgroundColor = '#ffffff';
      e.currentTarget.style.borderColor = '#d1d5db';
      e.currentTarget.style.color = '#0069cc';
    },
  };

  /**
   * Support link configuration items.
   * @type {Object[]}
   */
  const supportLinks = [
    {
      id: 'support-email',
      label: 'Email Support',
      description: `Send an email to ${SUPPORT.email}`,
      href: `mailto:${SUPPORT.email}`,
      ariaLabel: `Email support at ${SUPPORT.email}`,
      isExternal: false,
      isButton: false,
      icon: (
        <svg
          width={sizeConfig.iconSize}
          height={sizeConfig.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      id: 'support-chat',
      label: 'Live Chat',
      description: 'Chat with a member services representative',
      href: null,
      ariaLabel: 'Open live chat support',
      isExternal: true,
      isButton: true,
      icon: (
        <svg
          width={sizeConfig.iconSize}
          height={sizeConfig.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: 'support-call',
      label: `Call ${SUPPORT.phone}`,
      description: `Call Member Services at ${SUPPORT.phone}`,
      href: `tel:${SUPPORT.phone}`,
      ariaLabel: `Call support at ${SUPPORT.phone}`,
      isExternal: false,
      isButton: false,
      icon: (
        <svg
          width={sizeConfig.iconSize}
          height={sizeConfig.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div
        id={id || 'support-links'}
        className={containerClassName || undefined}
        style={containerStyle}
        role="group"
        aria-label="Support contact options"
      >
        {supportLinks.map((link) => {
          if (link.isButton) {
            return (
              <div
                key={link.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <button
                  type="button"
                  onClick={handleChatClick}
                  aria-label={link.ariaLabel}
                  style={linkStyle}
                  {...linkHoverHandlers}
                >
                  {link.icon}
                  {showLabels && (
                    <span>{link.label}</span>
                  )}
                  {link.isExternal && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: 0, opacity: 0.6 }}
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  )}
                </button>
                {showDescriptions && link.description && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: 1.4,
                      paddingLeft: '0.25rem',
                    }}
                  >
                    {link.description}
                  </span>
                )}
              </div>
            );
          }

          return (
            <div
              key={link.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <a
                href={link.href}
                aria-label={link.ariaLabel}
                style={linkStyle}
                {...linkHoverHandlers}
              >
                {link.icon}
                {showLabels && (
                  <span>{link.label}</span>
                )}
              </a>
              {showDescriptions && link.description && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                    paddingLeft: '0.25rem',
                  }}
                >
                  {link.description}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Leaving Site Modal for Chat */}
      <LeavingSiteModal
        isOpen={isLeavingSiteOpen}
        onClose={handleCloseLeavingSite}
        url={leavingSiteUrl}
        title={leavingSiteTitle}
        category={leavingSiteCategory}
        id={id ? `${id}-leaving-site-modal` : 'support-links-leaving-site-modal'}
      />
    </>
  );
};

SupportLinks.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showLabels: PropTypes.bool,
  showDescriptions: PropTypes.bool,
};

SupportLinks.defaultProps = {
  className: '',
  id: undefined,
  layout: 'horizontal',
  size: 'md',
  showLabels: true,
  showDescriptions: false,
};

export default SupportLinks;