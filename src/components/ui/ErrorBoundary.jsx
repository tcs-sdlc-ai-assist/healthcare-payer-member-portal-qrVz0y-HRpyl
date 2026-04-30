import React from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * ErrorBoundary component that catches rendering errors in child components.
 * Displays a user-friendly error message with HB CSS alert styling.
 * Provides retry/refresh action. Prevents sensitive error details from being exposed.
 *
 * @extends React.Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @param {React.ReactNode} [props.fallback] - Custom fallback UI to render on error (overrides default)
 * @param {Function} [props.onError] - Callback invoked when an error is caught, receives (error, errorInfo)
 * @param {string} [props.title='Something went wrong'] - Title text for the default error display
 * @param {string} [props.message] - Custom message text for the default error display
 * @param {boolean} [props.showRetry=true] - Whether to show the retry/refresh button
 * @param {string} [props.className] - Additional CSS class names to append to the error container
 * @param {string} [props.id] - HTML id attribute for the error container
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
    this.handleRetry = this.handleRetry.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  /**
   * Derives error state from a caught error.
   * @param {Error} error - The caught error
   * @returns {Object} Updated state with error information
   */
  static getDerivedStateFromError(error) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    const errorId = `ERR-${timestamp}-${random}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  /**
   * Logs error information when an error is caught.
   * Does not expose sensitive error details to the user.
   * @param {Error} error - The caught error
   * @param {Object} errorInfo - React error info with componentStack
   */
  componentDidCatch(error, errorInfo) {
    console.error(
      '[ErrorBoundary] Caught rendering error:',
      {
        errorId: this.state.errorId,
        message: error?.message || 'Unknown error',
        componentStack: errorInfo?.componentStack || '',
      }
    );

    if (this.props.onError && typeof this.props.onError === 'function') {
      try {
        this.props.onError(error, errorInfo);
      } catch (callbackError) {
        console.error('[ErrorBoundary] Error in onError callback:', callbackError);
      }
    }
  }

  /**
   * Handles the retry action by resetting the error state.
   * Allows the child components to attempt re-rendering.
   */
  handleRetry() {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  }

  /**
   * Handles the refresh action by reloading the page.
   */
  handleRefresh() {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const {
        title,
        message,
        showRetry,
        className,
        id,
      } = this.props;

      const displayTitle = title || 'Something went wrong';
      const displayMessage = message || 'An unexpected error occurred while loading this section. Please try again or refresh the page. If the problem persists, contact Member Services for assistance.';

      const containerClassName = [
        className || '',
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      return (
        <div
          id={id}
          className={containerClassName || undefined}
          role="alert"
          aria-live="assertive"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            minHeight: '12rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '32rem',
            }}
          >
            <div
              className={HB_CLASSES.alertError}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              {/* Error icon */}
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '9999px',
                  backgroundColor: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #fecaca',
                }}
                aria-hidden="true"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>

              {/* Error title */}
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#991b1b',
                  lineHeight: 1.3,
                }}
              >
                {displayTitle}
              </h2>

              {/* Error message */}
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#991b1b',
                  lineHeight: 1.5,
                  maxWidth: '28rem',
                }}
              >
                {displayMessage}
              </p>

              {/* Error reference ID */}
              {this.state.errorId && (
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.6875rem',
                    color: '#b91c1c',
                    fontFamily: 'monospace',
                    opacity: 0.7,
                  }}
                >
                  Reference: {this.state.errorId}
                </p>
              )}

              {/* Action buttons */}
              {showRetry && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginTop: '0.5rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    type="button"
                    className={HB_CLASSES.btnPrimary}
                    onClick={this.handleRetry}
                    aria-label="Try again to reload this section"
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
                      style={{ flexShrink: 0 }}
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    Try Again
                  </button>
                  <button
                    type="button"
                    className={HB_CLASSES.btnSecondary}
                    onClick={this.handleRefresh}
                    aria-label="Refresh the page"
                  >
                    Refresh Page
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  onError: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  showRetry: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};

ErrorBoundary.defaultProps = {
  fallback: undefined,
  onError: undefined,
  title: 'Something went wrong',
  message: undefined,
  showRetry: true,
  className: '',
  id: undefined,
};

export default ErrorBoundary;