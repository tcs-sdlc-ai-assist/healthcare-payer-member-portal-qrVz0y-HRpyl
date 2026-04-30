import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext.jsx';
import { submitClaim } from '../../services/claimsService.js';
import { HB_CLASSES, CLAIM_TYPE, CLAIM_TYPE_LABELS } from '../../constants/constants.js';
import Alert from '../ui/Alert.jsx';
import Button from '../ui/Button.jsx';
import Dropdown from '../ui/Dropdown.jsx';

/**
 * Returns claim type options for the dropdown.
 * @returns {Object[]} Array of { value, label } objects
 */
const getClaimTypeOptions = () => {
  return Object.entries(CLAIM_TYPE).map(([key, value]) => ({
    value,
    label: CLAIM_TYPE_LABELS[value] || key,
  }));
};

/**
 * ClaimSubmissionForm component.
 * Claim submission form (MVP stub). Provides form fields for claim type,
 * provider, date of service, billed amount, diagnosis code, diagnosis
 * description, and notes using HB CSS form classes with floating labels
 * and validation. On submit, creates a stub record with confirmation
 * message. Uses Alert component for success/error feedback.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {Function} [props.onSuccess] - Callback invoked on successful submission with the result object
 * @param {Function} [props.onCancel] - Callback invoked when the cancel button is clicked
 * @returns {React.ReactElement} The claim submission form element
 */
const ClaimSubmissionForm = ({ className, id, onSuccess, onCancel }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    type: '',
    provider: '',
    serviceDate: '',
    billedAmount: '',
    diagnosisCode: '',
    diagnosisDescription: '',
    notes: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    type: '',
    provider: '',
    serviceDate: '',
    billedAmount: '',
  });

  const [touched, setTouched] = useState({
    type: false,
    provider: false,
    serviceDate: false,
    billedAmount: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const typeRef = useRef(null);
  const errorRef = useRef(null);
  const successRef = useRef(null);

  const claimTypeOptions = getClaimTypeOptions();

  /**
   * Focus the error alert when it appears for screen reader accessibility.
   */
  useEffect(() => {
    if (submitError && errorRef.current) {
      errorRef.current.focus();
    }
  }, [submitError]);

  /**
   * Focus the success alert when it appears for screen reader accessibility.
   */
  useEffect(() => {
    if (submitSuccess && successRef.current) {
      successRef.current.focus();
    }
  }, [submitSuccess]);

  /**
   * Validates a single field and returns an error message or empty string.
   *
   * @param {string} field - The field name
   * @param {string} value - The field value
   * @returns {string} Error message or empty string
   */
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'type':
        if (!value || value.trim().length === 0) {
          return 'Claim type is required.';
        }
        return '';

      case 'provider':
        if (!value || value.trim().length === 0) {
          return 'Provider name is required.';
        }
        if (value.trim().length < 2) {
          return 'Provider name must be at least 2 characters.';
        }
        return '';

      case 'serviceDate':
        if (!value || value.trim().length === 0) {
          return 'Service date is required.';
        }
        {
          const dateObj = new Date(value);
          if (isNaN(dateObj.getTime())) {
            return 'Please enter a valid date.';
          }
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          if (dateObj > today) {
            return 'Service date cannot be in the future.';
          }
        }
        return '';

      case 'billedAmount':
        if (!value || value.trim().length === 0) {
          return 'Billed amount is required.';
        }
        {
          const numericValue = parseFloat(value);
          if (isNaN(numericValue)) {
            return 'Please enter a valid amount.';
          }
          if (numericValue < 0) {
            return 'Billed amount must be a positive number.';
          }
          if (numericValue > 999999.99) {
            return 'Billed amount exceeds maximum allowed value.';
          }
        }
        return '';

      default:
        return '';
    }
  }, []);

  /**
   * Validates the entire form.
   *
   * @returns {boolean} True if the form is valid
   */
  const validateForm = useCallback(() => {
    const errors = {
      type: validateField('type', formData.type),
      provider: validateField('provider', formData.provider),
      serviceDate: validateField('serviceDate', formData.serviceDate),
      billedAmount: validateField('billedAmount', formData.billedAmount),
    };

    setFieldErrors(errors);

    setTouched({
      type: true,
      provider: true,
      serviceDate: true,
      billedAmount: true,
    });

    return !errors.type && !errors.provider && !errors.serviceDate && !errors.billedAmount;
  }, [formData, validateField]);

  /**
   * Handles field blur events for inline validation.
   *
   * @param {string} field - The field name
   */
  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const value = formData[field];
    const error = validateField(field, value);

    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  }, [formData, validateField]);

  /**
   * Handles text input change.
   *
   * @param {string} field - The field name
   * @param {string} value - The new value
   */
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);

    if (touched[field]) {
      const error = validateField(field, value);
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [touched, validateField]);

  /**
   * Handles claim type dropdown change.
   *
   * @param {string} value - The new claim type value
   */
  const handleTypeChange = useCallback((value) => {
    handleInputChange('type', value);
  }, [handleInputChange]);

  /**
   * Handles form submission.
   *
   * @param {React.FormEvent} e - The form event
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    setSubmitError(null);
    setSubmitSuccess(null);

    if (!validateForm()) {
      return;
    }

    if (!user || !user.memberId) {
      setSubmitError('You must be logged in to submit a claim.');
      return;
    }

    setIsSubmitting(true);

    try {
      const billedAmountNum = parseFloat(formData.billedAmount);

      const result = submitClaim({
        memberId: user.memberId,
        type: formData.type,
        provider: formData.provider.trim(),
        serviceDate: formData.serviceDate,
        billedAmount: billedAmountNum,
        diagnosisCode: formData.diagnosisCode.trim() || undefined,
        diagnosisDescription: formData.diagnosisDescription.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Unable to submit claim. Please try again.');
      } else {
        setSubmitSuccess({
          message: result.message || 'Your claim has been submitted successfully.',
          claimNumber: result.claimNumber,
          claimId: result.claimId,
          status: result.statusLabel || 'Submitted',
        });

        setFormData({
          type: '',
          provider: '',
          serviceDate: '',
          billedAmount: '',
          diagnosisCode: '',
          diagnosisDescription: '',
          notes: '',
        });

        setTouched({
          type: false,
          provider: false,
          serviceDate: false,
          billedAmount: false,
        });

        setFieldErrors({
          type: '',
          provider: '',
          serviceDate: '',
          billedAmount: '',
        });

        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(result);
        }
      }
    } catch (err) {
      console.error('[ClaimSubmissionForm] Submit error:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, user, validateForm, onSuccess]);

  /**
   * Handles cancel button click.
   */
  const handleCancel = useCallback(() => {
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  }, [onCancel]);

  /**
   * Handles resetting the form after a successful submission.
   */
  const handleSubmitAnother = useCallback(() => {
    setSubmitSuccess(null);
    setSubmitError(null);
  }, []);

  /**
   * Returns the input class based on validation state.
   *
   * @param {string} field - The field name
   * @returns {string} The HB CSS class string
   */
  const getInputClass = (field) => {
    if (touched[field] && fieldErrors[field]) {
      return HB_CLASSES.formInputError;
    }
    if (touched[field] && !fieldErrors[field] && formData[field] && formData[field].trim().length > 0) {
      return HB_CLASSES.formInputSuccess;
    }
    return HB_CLASSES.formInput;
  };

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Renders the success state after a successful submission.
   * @returns {React.ReactElement} Success state
   */
  const renderSuccess = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div ref={successRef} tabIndex={-1}>
          <Alert
            variant="success"
            title="Claim Submitted Successfully"
            dismissible={false}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                {submitSuccess.message}
              </p>
              {submitSuccess.claimNumber && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.25rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Claim Number:
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#065f46',
                      fontFamily: 'monospace',
                    }}
                  >
                    {submitSuccess.claimNumber}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Status:
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#065f46',
                  }}
                >
                  {submitSuccess.status}
                </span>
              </div>
            </div>
          </Alert>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="primary"
            onClick={handleSubmitAnother}
            ariaLabel="Submit another claim"
          >
            Submit Another Claim
          </Button>
          {onCancel && (
            <Button
              variant="secondary"
              onClick={handleCancel}
              ariaLabel="Go back"
            >
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  };

  /**
   * Renders the claim submission form.
   * @returns {React.ReactElement} The form
   */
  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} noValidate>
        {/* Error Alert */}
        {submitError && (
          <div ref={errorRef} tabIndex={-1} style={{ marginBottom: '1.5rem' }}>
            <Alert
              variant="error"
              title="Submission Error"
              dismissible={true}
              onDismiss={() => setSubmitError(null)}
            >
              {submitError}
            </Alert>
          </div>
        )}

        {/* Info Banner */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert
            variant="info"
            dismissible={false}
            role="status"
          >
            This is a demo claim submission form. Submitted claims will receive a stub confirmation for demonstration purposes.
          </Alert>
        </div>

        {/* Claim Type */}
        <Dropdown
          id="claim-type"
          label="Claim Type"
          options={claimTypeOptions}
          value={formData.type}
          onChange={handleTypeChange}
          placeholder="Select a claim type"
          required={true}
          error={touched.type && !!fieldErrors.type}
          errorMessage={touched.type ? fieldErrors.type : undefined}
          native={true}
          block={true}
          size="md"
          name="type"
          ariaLabel="Claim type"
        />

        {/* Provider */}
        <div className={HB_CLASSES.formGroup}>
          <div className="hb-form-floating">
            <input
              id="claim-provider"
              type="text"
              className={getInputClass('provider')}
              value={formData.provider}
              onChange={(e) => handleInputChange('provider', e.target.value)}
              onBlur={() => handleBlur('provider')}
              placeholder=" "
              autoComplete="off"
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={touched.provider && !!fieldErrors.provider}
              aria-describedby={
                touched.provider && fieldErrors.provider
                  ? 'claim-provider-error'
                  : 'claim-provider-help'
              }
            />
            <label
              htmlFor="claim-provider"
              className="hb-form-floating-label"
            >
              Provider Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
          </div>
          {touched.provider && fieldErrors.provider ? (
            <span
              id="claim-provider-error"
              className={HB_CLASSES.formErrorText}
              role="alert"
            >
              {fieldErrors.provider}
            </span>
          ) : (
            <span
              id="claim-provider-help"
              className={HB_CLASSES.formHelp}
            >
              Enter the name of the healthcare provider
            </span>
          )}
        </div>

        {/* Service Date */}
        <div className={HB_CLASSES.formGroup}>
          <label
            htmlFor="claim-service-date"
            className={HB_CLASSES.formLabelRequired}
          >
            Date of Service
          </label>
          <input
            id="claim-service-date"
            type="date"
            className={getInputClass('serviceDate')}
            value={formData.serviceDate}
            onChange={(e) => handleInputChange('serviceDate', e.target.value)}
            onBlur={() => handleBlur('serviceDate')}
            disabled={isSubmitting}
            max={new Date().toISOString().split('T')[0]}
            aria-required="true"
            aria-invalid={touched.serviceDate && !!fieldErrors.serviceDate}
            aria-describedby={
              touched.serviceDate && fieldErrors.serviceDate
                ? 'claim-service-date-error'
                : 'claim-service-date-help'
            }
          />
          {touched.serviceDate && fieldErrors.serviceDate ? (
            <span
              id="claim-service-date-error"
              className={HB_CLASSES.formErrorText}
              role="alert"
            >
              {fieldErrors.serviceDate}
            </span>
          ) : (
            <span
              id="claim-service-date-help"
              className={HB_CLASSES.formHelp}
            >
              The date the service was provided
            </span>
          )}
        </div>

        {/* Billed Amount */}
        <div className={HB_CLASSES.formGroup}>
          <div className="hb-form-floating">
            <input
              id="claim-billed-amount"
              type="number"
              className={getInputClass('billedAmount')}
              value={formData.billedAmount}
              onChange={(e) => handleInputChange('billedAmount', e.target.value)}
              onBlur={() => handleBlur('billedAmount')}
              placeholder=" "
              min="0"
              step="0.01"
              autoComplete="off"
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={touched.billedAmount && !!fieldErrors.billedAmount}
              aria-describedby={
                touched.billedAmount && fieldErrors.billedAmount
                  ? 'claim-billed-amount-error'
                  : 'claim-billed-amount-help'
              }
            />
            <label
              htmlFor="claim-billed-amount"
              className="hb-form-floating-label"
            >
              Billed Amount ($) <span style={{ color: '#ef4444' }}>*</span>
            </label>
          </div>
          {touched.billedAmount && fieldErrors.billedAmount ? (
            <span
              id="claim-billed-amount-error"
              className={HB_CLASSES.formErrorText}
              role="alert"
            >
              {fieldErrors.billedAmount}
            </span>
          ) : (
            <span
              id="claim-billed-amount-help"
              className={HB_CLASSES.formHelp}
            >
              Total amount billed by the provider
            </span>
          )}
        </div>

        {/* Diagnosis Code (optional) */}
        <div className={HB_CLASSES.formGroup}>
          <div className="hb-form-floating">
            <input
              id="claim-diagnosis-code"
              type="text"
              className={HB_CLASSES.formInput}
              value={formData.diagnosisCode}
              onChange={(e) => handleInputChange('diagnosisCode', e.target.value)}
              placeholder=" "
              autoComplete="off"
              disabled={isSubmitting}
              aria-describedby="claim-diagnosis-code-help"
            />
            <label
              htmlFor="claim-diagnosis-code"
              className="hb-form-floating-label"
            >
              Diagnosis Code (ICD-10)
            </label>
          </div>
          <span
            id="claim-diagnosis-code-help"
            className={HB_CLASSES.formHelp}
          >
            Optional — e.g., J06.9
          </span>
        </div>

        {/* Diagnosis Description (optional) */}
        <div className={HB_CLASSES.formGroup}>
          <div className="hb-form-floating">
            <input
              id="claim-diagnosis-description"
              type="text"
              className={HB_CLASSES.formInput}
              value={formData.diagnosisDescription}
              onChange={(e) => handleInputChange('diagnosisDescription', e.target.value)}
              placeholder=" "
              autoComplete="off"
              disabled={isSubmitting}
              aria-describedby="claim-diagnosis-description-help"
            />
            <label
              htmlFor="claim-diagnosis-description"
              className="hb-form-floating-label"
            >
              Diagnosis Description
            </label>
          </div>
          <span
            id="claim-diagnosis-description-help"
            className={HB_CLASSES.formHelp}
          >
            Optional — brief description of the diagnosis
          </span>
        </div>

        {/* Notes (optional) */}
        <div className={HB_CLASSES.formGroup}>
          <label
            htmlFor="claim-notes"
            className={HB_CLASSES.formLabel}
          >
            Additional Notes
          </label>
          <textarea
            id="claim-notes"
            className={HB_CLASSES.formTextarea}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any additional information about this claim..."
            disabled={isSubmitting}
            rows={3}
            aria-describedby="claim-notes-help"
            style={{ resize: 'vertical', minHeight: '5rem' }}
          />
          <span
            id="claim-notes-help"
            className={HB_CLASSES.formHelp}
          >
            Optional — provide any additional details
          </span>
        </div>

        {/* Form Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          {onCancel && (
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              ariaLabel="Cancel claim submission"
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            ariaLabel={isSubmitting ? 'Submitting claim, please wait' : 'Submit claim'}
            iconLeft={
              !isSubmitting ? (
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              ) : undefined
            }
          >
            {isSubmitting ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div
      id={id || 'claim-submission-form'}
      className={containerClassName || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Page Header */}
      {!submitSuccess && (
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
            }}
          >
            Submit a Claim
          </h1>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            Fill out the form below to submit a new claim for processing.
          </p>
        </div>
      )}

      {/* Form Card */}
      <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
        <div
          className={HB_CLASSES.cardHeader}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '0.5rem',
              backgroundColor: '#e6f0fa',
              color: '#0069cc',
              flexShrink: 0,
            }}
            aria-hidden="true"
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.3,
              }}
            >
              {submitSuccess ? 'Submission Confirmation' : 'Claim Details'}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: 1.4,
              }}
            >
              {submitSuccess
                ? 'Your claim has been submitted'
                : 'Required fields are marked with an asterisk (*)'}
            </p>
          </div>
        </div>

        <div className={HB_CLASSES.cardBody} style={{ padding: '1.5rem' }}>
          {submitSuccess ? renderSuccess() : renderForm()}
        </div>

        {!submitSuccess && (
          <div
            className={HB_CLASSES.cardFooter}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.75rem 1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}
            >
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
                style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              This is a demo form. Claims are not processed.
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}
            >
              All fields with * are required
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

ClaimSubmissionForm.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

ClaimSubmissionForm.defaultProps = {
  className: '',
  id: undefined,
  onSuccess: undefined,
  onCancel: undefined,
};

export default ClaimSubmissionForm;