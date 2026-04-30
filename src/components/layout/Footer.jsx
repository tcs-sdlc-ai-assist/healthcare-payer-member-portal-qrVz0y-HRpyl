import React from 'react';
import PropTypes from 'prop-types';
import { SUPPORT } from '../../constants/constants.js';

/**
 * Footer component.
 * Global footer displayed at the bottom of the application with copyright notice,
 * privacy policy link, terms of use link, accessibility statement, and support
 * contact information. Uses HB CSS classes for layout and typography.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement} The footer element
 */
const Footer = ({ className, id }) => {
  const currentYear = new Date().getFullYear();

  const footerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <footer
      id={id || 'app-footer'}
      className={footerClassName || undefined}
      role="contentinfo"
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <div
        className="fluid-wrapper"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem 1rem',
        }}
      >
        {/* Top row: Links */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <a
            href="/privacy"
            style={{
              fontSize: '0.8125rem',
              color: '#0069cc',
              textDecoration: 'none',
              transition: 'color 0.15s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0054a3';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0069cc';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Privacy Policy
          </a>

          <span
            style={{
              color: '#d1d5db',
              fontSize: '0.8125rem',
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            |
          </span>

          <a
            href="/terms"
            style={{
              fontSize: '0.8125rem',
              color: '#0069cc',
              textDecoration: 'none',
              transition: 'color 0.15s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0054a3';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0069cc';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Terms of Use
          </a>

          <span
            style={{
              color: '#d1d5db',
              fontSize: '0.8125rem',
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            |
          </span>

          <a
            href="/accessibility"
            style={{
              fontSize: '0.8125rem',
              color: '#0069cc',
              textDecoration: 'none',
              transition: 'color 0.15s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0054a3';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0069cc';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Accessibility
          </a>
        </div>

        {/* Middle row: Support contact */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            Member Services:
          </span>
          <a
            href={`tel:${SUPPORT.phone}`}
            aria-label={`Call Member Services at ${SUPPORT.phone}`}
            style={{
              fontSize: '0.75rem',
              color: '#0069cc',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.15s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0054a3';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0069cc';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {SUPPORT.phone}
          </a>

          <span
            style={{
              color: '#d1d5db',
              fontSize: '0.75rem',
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            |
          </span>

          <a
            href={`mailto:${SUPPORT.email}`}
            aria-label={`Email support at ${SUPPORT.email}`}
            style={{
              fontSize: '0.75rem',
              color: '#0069cc',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.15s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0054a3';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0069cc';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {SUPPORT.email}
          </a>
        </div>

        {/* Bottom row: Copyright and accessibility statement */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.6875rem',
              color: '#9ca3af',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            © {currentYear} HealthFirst. All rights reserved.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.6875rem',
              color: '#9ca3af',
              textAlign: 'center',
              lineHeight: 1.5,
              maxWidth: '40rem',
            }}
          >
            HealthFirst is committed to ensuring digital accessibility for people with disabilities.
            We are continually improving the user experience for everyone and applying the relevant
            accessibility standards.
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

Footer.defaultProps = {
  className: '',
  id: undefined,
};

export default Footer;