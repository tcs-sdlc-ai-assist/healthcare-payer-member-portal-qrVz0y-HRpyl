import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES, HB_CLASSES, APP_CONFIG } from '../constants/constants.js';

/**
 * LoginPage component.
 * Renders the authentication login form with username/password fields,
 * HealthCare Payer branding, floating labels, validation states,
 * and accessible error messaging. Calls AuthContext login on submit.
 *
 * @returns {React.ReactElement} The login page
 */
const LoginPage = () => {
  const { login, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const [touched, setTouched] = useState({ username: false, password: false });

  const usernameRef = useRef(null);
  const errorRef = useRef(null);

  const from = location.state?.from || ROUTES.DASHBOARD;

  /**
   * Redirect authenticated users to their intended destination.
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  /**
   * Clear auth context error on mount and unmount.
   */
  useEffect(() => {
    clearError();
    return () => {
      clearError();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Focus the error message when it appears for screen reader accessibility.
   */
  useEffect(() => {
    if ((formError || authError) && errorRef.current) {
      errorRef.current.focus();
    }
  }, [formError, authError]);

  /**
   * Focus the username field on mount.
   */
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  /**
   * Validates a single field and returns an error message or empty string.
   *
   * @param {string} field - The field name ('username' or 'password')
   * @param {string} value - The field value
   * @returns {string} Error message or empty string
   */
  const validateField = useCallback((field, value) => {
    if (field === 'username') {
      if (!value || value.trim().length === 0) {
        return 'Username is required.';
      }
      if (value.trim().length < 3) {
        return 'Username must be at least 3 characters.';
      }
      return '';
    }

    if (field === 'password') {
      if (!value || value.length === 0) {
        return 'Password is required.';
      }
      if (value.length < 8) {
        return 'Password must be at least 8 characters.';
      }
      return '';
    }

    return '';
  }, []);

  /**
   * Validates the entire form.
   *
   * @returns {boolean} True if the form is valid
   */
  const validateForm = useCallback(() => {
    const usernameError = validateField('username', username);
    const passwordError = validateField('password', password);

    setFieldErrors({
      username: usernameError,
      password: passwordError,
    });

    setTouched({
      username: true,
      password: true,
    });

    return !usernameError && !passwordError;
  }, [username, password, validateField]);

  /**
   * Handles field blur events for inline validation.
   *
   * @param {string} field - The field name
   */
  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const value = field === 'username' ? username : password;
    const error = validateField(field, value);

    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  }, [username, password, validateField]);

  /**
   * Handles username input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleUsernameChange = useCallback((e) => {
    const value = e.target.value;
    setUsername(value);
    setFormError(null);

    if (touched.username) {
      const error = validateField('username', value);
      setFieldErrors((prev) => ({ ...prev, username: error }));
    }
  }, [touched.username, validateField]);

  /**
   * Handles password input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value;
    setPassword(value);
    setFormError(null);

    if (touched.password) {
      const error = validateField('password', value);
      setFieldErrors((prev) => ({ ...prev, password: error }));
    }
  }, [touched.password, validateField]);

  /**
   * Handles form submission.
   *
   * @param {React.FormEvent} e - The form event
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    setFormError(null);
    clearError();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(username.trim(), password);

      if (!result.success) {
        setFormError(result.error || 'Invalid credentials. Please check your username and password.');
      }
    } catch (err) {
      console.error('[LoginPage] Login error:', err);
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [username, password, login, validateForm, clearError]);

  const displayError = formError || authError;

  const usernameInputClass = touched.username && fieldErrors.username
    ? HB_CLASSES.formInputError
    : touched.username && !fieldErrors.username && username.trim().length >= 3
      ? HB_CLASSES.formInputSuccess
      : HB_CLASSES.formInput;

  const passwordInputClass = touched.password && fieldErrors.password
    ? HB_CLASSES.formInputError
    : touched.password && !fieldErrors.password && password.length >= 8
      ? HB_CLASSES.formInputSuccess
      : HB_CLASSES.formInput;

  if (authLoading) {
    return (
      <div className="hb-flex hb-items-center hb-justify-center hb-min-h-screen" role="status" aria-label="Loading">
        <div className="hb-flex hb-flex-col hb-items-center hb-gap-4">
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              border: '3px solid #e5e7eb',
              borderTopColor: '#0069cc',
              borderRadius: '9999px',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span className="hb-text-sm text-neutral">Loading...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="hb-flex hb-items-center hb-justify-center hb-min-h-screen"
      style={{
        backgroundColor: '#f9fafb',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Branding */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              borderRadius: '9999px',
              backgroundColor: '#e6f0fa',
              marginBottom: '1rem',
            }}
            aria-hidden="true"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0069cc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0069cc',
              margin: '0 0 0.25rem 0',
              lineHeight: 1.2,
            }}
          >
            HealthFirst
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0,
            }}
          >
            {APP_CONFIG.title}
          </p>
        </div>

        {/* Login Card */}
        <div className={HB_CLASSES.card}>
          <div
            className={HB_CLASSES.cardHeader}
            style={{
              textAlign: 'center',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#111827',
              }}
            >
              Sign In
            </h2>
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.8125rem',
                color: '#6b7280',
              }}
            >
              Enter your credentials to access your account
            </p>
          </div>

          <div className={HB_CLASSES.cardBody}>
            {/* Error Alert */}
            {displayError && (
              <div
                className={HB_CLASSES.alertError}
                role="alert"
                aria-live="assertive"
                ref={errorRef}
                tabIndex={-1}
                style={{ marginBottom: '1.5rem' }}
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
                  style={{ flexShrink: 0, marginTop: '1px' }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{displayError}</span>
              </div>
            )}

            {/* Session expired message from redirect */}
            {location.state?.from && !displayError && (
              <div
                className={HB_CLASSES.alertInfo}
                role="status"
                style={{ marginBottom: '1.5rem' }}
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
                  style={{ flexShrink: 0, marginTop: '1px' }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Please sign in to continue.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Username Field */}
              <div className={HB_CLASSES.formGroup}>
                <div className="hb-form-floating">
                  <input
                    id="login-username"
                    type="text"
                    className={usernameInputClass}
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={() => handleBlur('username')}
                    placeholder=" "
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={isSubmitting}
                    aria-required="true"
                    aria-invalid={touched.username && !!fieldErrors.username}
                    aria-describedby={
                      touched.username && fieldErrors.username
                        ? 'login-username-error'
                        : 'login-username-help'
                    }
                    ref={usernameRef}
                  />
                  <label
                    htmlFor="login-username"
                    className="hb-form-floating-label"
                  >
                    Username
                  </label>
                </div>
                {touched.username && fieldErrors.username ? (
                  <span
                    id="login-username-error"
                    className={HB_CLASSES.formErrorText}
                    role="alert"
                  >
                    {fieldErrors.username}
                  </span>
                ) : (
                  <span
                    id="login-username-help"
                    className={HB_CLASSES.formHelp}
                  >
                    Enter your member portal username
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className={HB_CLASSES.formGroup}>
                <div className="hb-form-floating">
                  <input
                    id="login-password"
                    type="password"
                    className={passwordInputClass}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur('password')}
                    placeholder=" "
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    aria-required="true"
                    aria-invalid={touched.password && !!fieldErrors.password}
                    aria-describedby={
                      touched.password && fieldErrors.password
                        ? 'login-password-error'
                        : 'login-password-help'
                    }
                  />
                  <label
                    htmlFor="login-password"
                    className="hb-form-floating-label"
                  >
                    Password
                  </label>
                </div>
                {touched.password && fieldErrors.password ? (
                  <span
                    id="login-password-error"
                    className={HB_CLASSES.formErrorText}
                    role="alert"
                  >
                    {fieldErrors.password}
                  </span>
                ) : (
                  <span
                    id="login-password-help"
                    className={HB_CLASSES.formHelp}
                  >
                    Enter your password
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`${HB_CLASSES.btnPrimary} hb-btn-block`}
                disabled={isSubmitting}
                aria-label={isSubmitting ? 'Signing in, please wait' : 'Sign in to your account'}
                style={{ marginTop: '0.5rem' }}
              >
                {isSubmitting ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#ffffff',
                        borderRadius: '9999px',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block',
                      }}
                      aria-hidden="true"
                    />
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <div
            className={HB_CLASSES.cardFooter}
            style={{
              textAlign: 'center',
              padding: '1rem 1.5rem',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Need help? Contact Member Services at{' '}
              <a
                href="tel:1-800-555-0199"
                className={HB_CLASSES.link}
                style={{ fontWeight: 500 }}
              >
                1-800-555-0199
              </a>
            </p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            borderRadius: '0.375rem',
            border: '1px solid #bfdbfe',
          }}
        >
          <p
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#1e40af',
            }}
          >
            Demo Credentials
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              fontSize: '0.75rem',
              color: '#1e40af',
              lineHeight: 1.5,
            }}
          >
            <span>
              <strong>Member:</strong> jane.doe / password123
            </span>
            <span>
              <strong>Admin:</strong> admin.user / admin123
            </span>
          </div>
        </div>

        {/* Footer branding */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.6875rem',
            color: '#9ca3af',
          }}
        >
          © {new Date().getFullYear()} HealthFirst. All rights reserved.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;