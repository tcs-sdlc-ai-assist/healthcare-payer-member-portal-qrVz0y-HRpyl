import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import { getIDCardPdf, printIDCard, requestNewCard } from '../../services/idCardService.js';
import { HB_CLASSES } from '../../constants/constants.js';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';
import Alert from '../ui/Alert.jsx';

/**
 * IDCardActions component.
 * Provides Print (opens print-friendly view), Download (generates PDF via idCardService),
 * and Request New Card (stub with confirmation) actions for an ID card.
 * Print and download trigger audit logging and Glassbox tagging.
 * Uses HB CSS button classes.
 *
 * @param {Object} props
 * @param {Object} props.card - The ID card data object (enriched from idCardService)
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.size='md'] - Button size ('sm', 'md', 'lg')
 * @param {string} [props.layout='horizontal'] - Layout orientation ('horizontal' or 'vertical')
 * @param {boolean} [props.showDownload=true] - Whether to show the download button
 * @param {boolean} [props.showPrint=true] - Whether to show the print button
 * @param {boolean} [props.showRequestNew=true] - Whether to show the request new card button
 * @param {Function} [props.onDownloadComplete] - Callback invoked after a successful download
 * @param {Function} [props.onPrintComplete] - Callback invoked after a successful print action
 * @param {Function} [props.onRequestComplete] - Callback invoked after a successful request submission
 * @returns {React.ReactElement} The ID card actions element
 */
const IDCardActions = ({
  card,
  className,
  id,
  size,
  layout,
  showDownload,
  showPrint,
  showRequestNew,
  onDownloadComplete,
  onPrintComplete,
  onRequestComplete,
}) => {
  const { user } = useAuth();
  const { tagIDCardDownloaded, tagIDCardPrinted, tagIDCardRequested } = useGlassbox();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState(null);
  const [printSuccess, setPrintSuccess] = useState(false);

  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [requestResult, setRequestResult] = useState(null);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  /**
   * Handles the download action.
   * Generates a PDF via idCardService, logs the audit event, and tags Glassbox.
   */
  const handleDownload = useCallback(() => {
    if (!card || !card.cardId) {
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      const result = getIDCardPdf(card.cardId, {
        memberId: user?.memberId,
        download: true,
        filename: `ID_Card_${card.coverageTypeLabel || card.front?.planType || 'Card'}_${card.front?.memberId || 'member'}.pdf`,
      });

      if (!result.success) {
        setDownloadError(result.error || 'Unable to download ID card. Please try again.');
      } else {
        setDownloadSuccess(true);

        tagIDCardDownloaded({
          cardId: card.cardId,
          coverageType: card.coverageType,
          planName: card.front?.planName || null,
        });

        if (onDownloadComplete && typeof onDownloadComplete === 'function') {
          onDownloadComplete(card);
        }

        setTimeout(() => {
          setDownloadSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('[IDCardActions] Error downloading ID card:', err);
      setDownloadError('An unexpected error occurred while downloading the ID card.');
    } finally {
      setIsDownloading(false);
    }
  }, [card, user, tagIDCardDownloaded, onDownloadComplete]);

  /**
   * Handles the print action.
   * Logs the audit event, tags Glassbox, and opens the browser print dialog.
   */
  const handlePrint = useCallback(() => {
    if (!card || !card.cardId) {
      return;
    }

    setIsPrinting(true);
    setPrintError(null);
    setPrintSuccess(false);

    try {
      const result = printIDCard(card.cardId, {
        memberId: user?.memberId,
      });

      if (!result.success) {
        setPrintError(result.error || 'Unable to print ID card. Please try again.');
        setIsPrinting(false);
        return;
      }

      tagIDCardPrinted({
        cardId: card.cardId,
        coverageType: card.coverageType,
        planName: card.front?.planName || null,
      });

      setPrintSuccess(true);

      if (onPrintComplete && typeof onPrintComplete === 'function') {
        onPrintComplete(card);
      }

      setTimeout(() => {
        try {
          window.print();
        } catch (printErr) {
          console.error('[IDCardActions] Error opening print dialog:', printErr);
        }
        setPrintSuccess(false);
      }, 100);
    } catch (err) {
      console.error('[IDCardActions] Error printing ID card:', err);
      setPrintError('An unexpected error occurred while printing the ID card.');
    } finally {
      setIsPrinting(false);
    }
  }, [card, user, tagIDCardPrinted, onPrintComplete]);

  /**
   * Opens the request new card confirmation modal.
   */
  const handleOpenRequestModal = useCallback(() => {
    setRequestError(null);
    setRequestResult(null);
    setIsRequestModalOpen(true);
  }, []);

  /**
   * Closes the request new card modal.
   */
  const handleCloseRequestModal = useCallback(() => {
    setIsRequestModalOpen(false);
  }, []);

  /**
   * Closes the confirmation modal.
   */
  const handleCloseConfirmationModal = useCallback(() => {
    setIsConfirmationModalOpen(false);
    setRequestResult(null);
  }, []);

  /**
   * Handles the request new card submission.
   * Calls idCardService.requestNewCard (stub), logs the audit event, and tags Glassbox.
   */
  const handleSubmitRequest = useCallback(() => {
    if (!card || !card.coverageId) {
      setRequestError('Unable to determine coverage for this card.');
      return;
    }

    setIsRequesting(true);
    setRequestError(null);
    setRequestResult(null);

    try {
      const result = requestNewCard({
        memberId: user?.memberId,
        coverageId: card.coverageId,
        reason: 'replacement',
      });

      if (!result.success) {
        setRequestError(result.error || 'Unable to submit request. Please try again.');
      } else {
        setRequestResult(result);

        tagIDCardRequested({
          coverageType: card.coverageType,
          reason: 'replacement',
        });

        setIsRequestModalOpen(false);
        setIsConfirmationModalOpen(true);

        if (onRequestComplete && typeof onRequestComplete === 'function') {
          onRequestComplete(result);
        }
      }
    } catch (err) {
      console.error('[IDCardActions] Error requesting new ID card:', err);
      setRequestError('An unexpected error occurred. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  }, [card, user, tagIDCardRequested, onRequestComplete]);

  if (!card) {
    return null;
  }

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const isHorizontal = layout === 'horizontal';

  const containerStyle = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    alignItems: isHorizontal ? 'center' : 'stretch',
    gap: '0.5rem',
    flexWrap: isHorizontal ? 'wrap' : 'nowrap',
  };

  /**
   * Renders the request new card modal body.
   * @returns {React.ReactElement} The modal body content
   */
  const renderRequestModalBody = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {requestError && (
          <Alert
            variant="error"
            dismissible={true}
            onDismiss={() => setRequestError(null)}
          >
            {requestError}
          </Alert>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '9999px',
              backgroundColor: '#e6f0fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0069cc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>

          <p
            style={{
              textAlign: 'center',
              color: '#374151',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            Would you like to request a replacement{' '}
            <strong>{card.coverageTypeLabel || card.front?.planName || 'ID'}</strong> card?
            Your new card will be mailed to your address on file within 7-10 business days.
          </p>

          {card.front?.planName && (
            <div
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Plan
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#111827',
                  }}
                >
                  {card.front.planName}
                </span>
              </div>
            </div>
          )}

          <p
            style={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.75rem',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            In the meantime, you can continue to use your digital ID card from this portal.
          </p>
        </div>
      </div>
    );
  };

  /**
   * Renders the request new card modal footer.
   * @returns {React.ReactElement} The modal footer content
   */
  const renderRequestModalFooter = () => {
    return (
      <>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCloseRequestModal}
          disabled={isRequesting}
          ariaLabel="Cancel request"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmitRequest}
          loading={isRequesting}
          disabled={isRequesting}
          ariaLabel={isRequesting ? 'Submitting request, please wait' : 'Submit request for new ID card'}
        >
          {isRequesting ? 'Submitting...' : 'Request New Card'}
        </Button>
      </>
    );
  };

  /**
   * Renders the confirmation modal body.
   * @returns {React.ReactElement} The modal body content
   */
  const renderConfirmationModalBody = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '9999px',
            backgroundColor: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <p
          style={{
            textAlign: 'center',
            color: '#374151',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            margin: 0,
          }}
        >
          {requestResult?.message || 'Your request for a new ID card has been received.'}
        </p>

        {requestResult?.requestId && (
          <div
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Request ID:
                </span>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#065f46',
                    fontFamily: 'monospace',
                  }}
                >
                  {requestResult.requestId}
                </span>
              </div>
              {requestResult.coverageTypeLabel && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Coverage:
                  </span>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: '#111827',
                    }}
                  >
                    {requestResult.coverageTypeLabel}
                  </span>
                </div>
              )}
              {requestResult.planName && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Plan:
                  </span>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: '#111827',
                    }}
                  >
                    {requestResult.planName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <p
          style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.75rem',
            lineHeight: '1.5',
            margin: 0,
          }}
        >
          You can expect to receive your new card within 7-10 business days.
        </p>
      </div>
    );
  };

  /**
   * Renders the confirmation modal footer.
   * @returns {React.ReactElement} The modal footer content
   */
  const renderConfirmationModalFooter = () => {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={handleCloseConfirmationModal}
        ariaLabel="Close confirmation"
      >
        Done
      </Button>
    );
  };

  return (
    <>
      <div
        id={id || undefined}
        className={containerClassName || undefined}
        style={containerStyle}
      >
        {/* Download Button */}
        {showDownload && (
          <Button
            variant="secondary"
            size={size}
            onClick={handleDownload}
            loading={isDownloading}
            disabled={isDownloading}
            ariaLabel="Download ID card as PDF"
            iconLeft={
              !isDownloading ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              ) : undefined
            }
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        )}

        {/* Print Button */}
        {showPrint && (
          <Button
            variant="secondary"
            size={size}
            onClick={handlePrint}
            loading={isPrinting}
            disabled={isPrinting}
            ariaLabel="Print ID card"
            iconLeft={
              !isPrinting ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              ) : undefined
            }
          >
            {isPrinting ? 'Printing...' : 'Print'}
          </Button>
        )}

        {/* Request New Card Button */}
        {showRequestNew && (
          <Button
            variant="tertiary"
            size={size}
            onClick={handleOpenRequestModal}
            ariaLabel="Request a new ID card"
            iconLeft={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            }
          >
            Request New
          </Button>
        )}
      </div>

      {/* Status Alerts */}
      {downloadError && (
        <div style={{ marginTop: '0.5rem' }}>
          <Alert
            variant="error"
            dismissible={true}
            onDismiss={() => setDownloadError(null)}
          >
            {downloadError}
          </Alert>
        </div>
      )}

      {downloadSuccess && (
        <div style={{ marginTop: '0.5rem' }}>
          <Alert
            variant="success"
            dismissible={true}
            onDismiss={() => setDownloadSuccess(false)}
          >
            ID card PDF downloaded successfully.
          </Alert>
        </div>
      )}

      {printError && (
        <div style={{ marginTop: '0.5rem' }}>
          <Alert
            variant="error"
            dismissible={true}
            onDismiss={() => setPrintError(null)}
          >
            {printError}
          </Alert>
        </div>
      )}

      {printSuccess && (
        <div style={{ marginTop: '0.5rem' }}>
          <Alert
            variant="success"
            dismissible={true}
            onDismiss={() => setPrintSuccess(false)}
          >
            Print request sent. The print dialog should open shortly.
          </Alert>
        </div>
      )}

      {/* Request New Card Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        title="Request New ID Card"
        size="sm"
        body={renderRequestModalBody()}
        footer={renderRequestModalFooter()}
        showCloseButton={true}
        closeOnOverlayClick={!isRequesting}
        closeOnEscape={!isRequesting}
        id={id ? `${id}-request-modal` : 'idcard-actions-request-modal'}
        centered={true}
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        title="Request Submitted"
        size="sm"
        body={renderConfirmationModalBody()}
        footer={renderConfirmationModalFooter()}
        showCloseButton={true}
        closeOnOverlayClick={true}
        closeOnEscape={true}
        id={id ? `${id}-confirmation-modal` : 'idcard-actions-confirmation-modal'}
        centered={true}
      />
    </>
  );
};

IDCardActions.propTypes = {
  card: PropTypes.shape({
    cardId: PropTypes.string,
    memberId: PropTypes.string,
    coverageId: PropTypes.string,
    coverageType: PropTypes.string,
    coverageTypeLabel: PropTypes.string,
    cardType: PropTypes.string,
    issueDate: PropTypes.string,
    expirationDate: PropTypes.string,
    isActive: PropTypes.bool,
    isExpired: PropTypes.bool,
    statusLabel: PropTypes.string,
    front: PropTypes.shape({
      planName: PropTypes.string,
      planType: PropTypes.string,
      memberName: PropTypes.string,
      memberId: PropTypes.string,
      groupNumber: PropTypes.string,
      subscriberId: PropTypes.string,
      effectiveDate: PropTypes.string,
      pcpName: PropTypes.string,
      pcpPhone: PropTypes.string,
      networkName: PropTypes.string,
      copays: PropTypes.shape({
        primaryCare: PropTypes.string,
        specialist: PropTypes.string,
        urgentCare: PropTypes.string,
        emergencyRoom: PropTypes.string,
      }),
    }),
    back: PropTypes.shape({
      rxInfo: PropTypes.shape({
        rxBIN: PropTypes.string,
        rxPCN: PropTypes.string,
        rxGroup: PropTypes.string,
      }),
      claimsAddress: PropTypes.string,
      claimsPhone: PropTypes.string,
      memberServicesPhone: PropTypes.string,
      nurseLinePhone: PropTypes.string,
      mentalHealthPhone: PropTypes.string,
      preAuthPhone: PropTypes.string,
      websiteUrl: PropTypes.string,
      providerDirectoryUrl: PropTypes.string,
      emergencyInstructions: PropTypes.string,
    }),
  }),
  className: PropTypes.string,
  id: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  showDownload: PropTypes.bool,
  showPrint: PropTypes.bool,
  showRequestNew: PropTypes.bool,
  onDownloadComplete: PropTypes.func,
  onPrintComplete: PropTypes.func,
  onRequestComplete: PropTypes.func,
};

IDCardActions.defaultProps = {
  card: undefined,
  className: '',
  id: undefined,
  size: 'md',
  layout: 'horizontal',
  showDownload: true,
  showPrint: true,
  showRequestNew: true,
  onDownloadComplete: undefined,
  onPrintComplete: undefined,
  onRequestComplete: undefined,
};

export default IDCardActions;