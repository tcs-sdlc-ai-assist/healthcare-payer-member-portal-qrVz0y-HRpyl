import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import { getClaimDetails, getEOBPdf } from '../../services/claimsService.js';
import { getDocumentsForClaim } from '../../services/documentService.js';
import { HB_CLASSES, ROUTES } from '../../constants/constants.js';
import Badge from '../ui/Badge.jsx';
import Alert from '../ui/Alert.jsx';
import Button from '../ui/Button.jsx';

/**
 * Returns the Badge variant string for a given claim status badge class.
 * @param {string} statusBadgeClass - The HB CSS badge class string
 * @returns {string} The Badge component variant
 */
const getBadgeVariant = (statusBadgeClass) => {
  if (!statusBadgeClass || typeof statusBadgeClass !== 'string') {
    return 'neutral';
  }

  if (statusBadgeClass.includes('hb-badge-success')) {
    return 'success';
  }
  if (statusBadgeClass.includes('hb-badge-warning')) {
    return 'warning';
  }
  if (statusBadgeClass.includes('hb-badge-error')) {
    return 'error';
  }
  if (statusBadgeClass.includes('hb-badge-info')) {
    return 'info';
  }
  if (statusBadgeClass.includes('hb-badge-brand')) {
    return 'brand';
  }

  return 'neutral';
};

/**
 * ClaimDetails component.
 * Displays full claim information including financial summary (billed, plan paid,
 * you owe), line items table with procedure codes and amounts, provider information,
 * and EOB download button. EOB download triggers audit logging and Glassbox tagging.
 * Uses HB CSS card, table, and button classes. Accessible with proper headings and ARIA.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.claimId] - Claim ID override (if not using route params)
 * @returns {React.ReactElement} The claim details element
 */
const ClaimDetails = ({ className, id, claimId: claimIdProp }) => {
  const { user } = useAuth();
  const { tagClaimOpened, tagEOBDownloaded } = useGlassbox();
  const navigate = useNavigate();
  const params = useParams();

  const claimId = claimIdProp || params.id;

  const [claim, setClaim] = useState(null);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloadingEOB, setIsDownloadingEOB] = useState(false);
  const [eobError, setEobError] = useState(null);

  /**
   * Fetches claim details and related documents.
   */
  const fetchClaimDetails = useCallback(() => {
    if (!claimId) {
      setError('No claim ID provided.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const claimData = getClaimDetails(claimId, {
        memberId: user?.memberId,
        logView: true,
      });

      if (!claimData) {
        setError('Claim not found. Please check the claim ID and try again.');
        setClaim(null);
        setIsLoading(false);
        return;
      }

      setClaim(claimData);

      tagClaimOpened({
        claimId: claimData.claimId,
        claimNumber: claimData.claimNumber,
        claimType: claimData.type,
        status: claimData.status,
      });

      try {
        const docs = getDocumentsForClaim(claimId);
        setRelatedDocuments(docs || []);
      } catch (docErr) {
        console.error('[ClaimDetails] Error fetching related documents:', docErr);
        setRelatedDocuments([]);
      }
    } catch (err) {
      console.error('[ClaimDetails] Error fetching claim details:', err);
      setError('Unable to load claim details. Please try again.');
      setClaim(null);
    } finally {
      setIsLoading(false);
    }
  }, [claimId, user, tagClaimOpened]);

  /**
   * Fetch claim details on mount and when dependencies change.
   */
  useEffect(() => {
    fetchClaimDetails();
  }, [fetchClaimDetails]);

  /**
   * Handles EOB PDF download.
   */
  const handleDownloadEOB = useCallback(() => {
    if (!claim || !claim.hasEOB) {
      return;
    }

    setIsDownloadingEOB(true);
    setEobError(null);

    try {
      const memberInfo = {
        memberName: user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        memberId: user?.memberId || '',
        groupNumber: user?.plan?.groupNumber || '',
        planName: user?.plan?.planName || '',
      };

      const result = getEOBPdf(claim.claimId, {
        memberId: user?.memberId,
        memberInfo,
        download: true,
        filename: `EOB_${claim.claimNumber || claim.claimId}.pdf`,
      });

      if (!result.success) {
        setEobError(result.error || 'Unable to download EOB. Please try again.');
      } else {
        tagEOBDownloaded({
          claimId: claim.claimId,
          claimNumber: claim.claimNumber,
          documentId: claim.eobDocument?.documentId || null,
        });
      }
    } catch (err) {
      console.error('[ClaimDetails] Error downloading EOB:', err);
      setEobError('An unexpected error occurred while downloading the EOB.');
    } finally {
      setIsDownloadingEOB(false);
    }
  }, [claim, user, tagEOBDownloaded]);

  /**
   * Handles navigation back to the claims list.
   */
  const handleBackToClaims = useCallback(() => {
    navigate(ROUTES.CLAIMS);
  }, [navigate]);

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Renders the loading skeleton state.
   * @returns {React.ReactElement} Loading skeleton
   */
  const renderLoading = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
        role="status"
        aria-label="Loading claim details"
      >
        <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
          <div className={HB_CLASSES.cardBody} style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: index % 2 === 0 ? '60%' : '80%',
                    height: '1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.25rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  };

  /**
   * Renders the error state.
   * @returns {React.ReactElement} Error message
   */
  const renderError = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <Alert
          variant="error"
          title="Error Loading Claim"
          dismissible={false}
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchClaimDetails}
            style={{
              display: 'inline',
              marginLeft: '0.5rem',
              padding: 0,
              background: 'none',
              border: 'none',
              color: '#991b1b',
              fontWeight: 500,
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
            aria-label="Retry loading claim details"
          >
            Retry
          </button>
        </Alert>
        <button
          type="button"
          className={HB_CLASSES.btnSecondary}
          onClick={handleBackToClaims}
          aria-label="Go back to claims list"
          style={{ alignSelf: 'flex-start' }}
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
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Claims
        </button>
      </div>
    );
  };

  /**
   * Renders the financial summary section.
   * @returns {React.ReactElement} Financial summary
   */
  const renderFinancialSummary = () => {
    const summaryItems = [
      {
        label: 'Billed Amount',
        value: claim.formattedBilledAmount || '$0.00',
        color: '#374151',
      },
      {
        label: 'Allowed Amount',
        value: claim.formattedAllowedAmount || '$0.00',
        color: '#374151',
      },
      {
        label: 'Plan Paid',
        value: claim.formattedPaidAmount || '$0.00',
        color: '#10b981',
      },
      {
        label: 'You Owe',
        value: claim.formattedMemberOwes || '$0.00',
        color: claim.memberOwes > 0 ? '#0069cc' : '#10b981',
        isBold: true,
      },
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
        }}
      >
        {summaryItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1.4,
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: item.isBold ? 700 : 600,
                color: item.color,
                lineHeight: 1.2,
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Renders the provider and diagnosis information section.
   * @returns {React.ReactElement} Provider info
   */
  const renderProviderInfo = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Provider
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#111827',
                lineHeight: 1.4,
              }}
            >
              {claim.provider || '—'}
            </span>
            {claim.providerNPI && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  lineHeight: 1.4,
                  fontFamily: 'monospace',
                }}
              >
                NPI: {claim.providerNPI}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Patient
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#111827',
                lineHeight: 1.4,
              }}
            >
              {claim.patient || '—'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Service Date
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#111827',
                lineHeight: 1.4,
              }}
            >
              {claim.formattedServiceDate || '—'}
              {claim.formattedServiceDateEnd && claim.formattedServiceDateEnd !== claim.formattedServiceDate && (
                <span style={{ color: '#6b7280' }}> – {claim.formattedServiceDateEnd}</span>
              )}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Claim Type
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#111827',
                lineHeight: 1.4,
              }}
            >
              {claim.typeLabel || '—'}
            </span>
          </div>
        </div>

        {(claim.diagnosisCode || claim.diagnosisDescription) && (
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
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
              Diagnosis
            </span>
            <div
              style={{
                marginTop: '0.25rem',
                fontSize: '0.875rem',
                color: '#374151',
                lineHeight: 1.5,
              }}
            >
              {claim.diagnosisCode && (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: '#111827',
                    marginRight: '0.5rem',
                  }}
                >
                  {claim.diagnosisCode}
                </span>
              )}
              {claim.diagnosisDescription && (
                <span>{claim.diagnosisDescription}</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders the processing dates section.
   * @returns {React.ReactElement} Processing dates
   */
  const renderProcessingDates = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Received
          </span>
          <span
            style={{
              fontSize: '0.8125rem',
              color: '#374151',
              lineHeight: 1.4,
            }}
          >
            {claim.formattedReceivedDate || '—'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Processed
          </span>
          <span
            style={{
              fontSize: '0.8125rem',
              color: '#374151',
              lineHeight: 1.4,
            }}
          >
            {claim.formattedProcessedDate || 'Pending'}
          </span>
        </div>
      </div>
    );
  };

  /**
   * Renders the line items table.
   * @returns {React.ReactElement} Line items table
   */
  const renderLineItems = () => {
    if (!claim.lineItems || claim.lineItems.length === 0) {
      return (
        <div
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
        >
          No service details available for this claim.
        </div>
      );
    }

    return (
      <div
        style={{
          overflowX: 'auto',
        }}
        className="hb-scrollbar-thin"
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
          role="table"
          aria-label="Claim service details"
        >
          <thead>
            <tr
              style={{
                borderBottom: '2px solid #e5e7eb',
              }}
            >
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                Procedure
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                Description
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  display: 'none',
                }}
                scope="col"
                className="tablet:hb-block"
              >
                Date
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                Billed
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  display: 'none',
                }}
                scope="col"
                className="tablet:hb-block"
              >
                Allowed
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  display: 'none',
                }}
                scope="col"
                className="tablet:hb-block"
              >
                Plan Paid
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                You Owe
              </th>
            </tr>
          </thead>
          <tbody>
            {claim.lineItems.map((item, index) => {
              const isLast = index === claim.lineItems.length - 1;

              return (
                <tr
                  key={item.lineItemId}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                  }}
                >
                  <td
                    style={{
                      padding: '0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: '#0069cc',
                        fontFamily: 'monospace',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.procedureCode || '—'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.description || '—'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      whiteSpace: 'nowrap',
                      display: 'none',
                    }}
                    className="tablet:hb-block"
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#6b7280',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.formattedServiceDate || '—'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.formattedBilledAmount || '$0.00'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      display: 'none',
                    }}
                    className="tablet:hb-block"
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.formattedAllowedAmount || '$0.00'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      display: 'none',
                    }}
                    className="tablet:hb-block"
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#10b981',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.formattedPaidAmount || '$0.00'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: item.memberResponsibility > 0 ? '#111827' : '#10b981',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.formattedMemberResponsibility || '$0.00'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr
              style={{
                borderTop: '2px solid #e5e7eb',
                backgroundColor: '#f9fafb',
              }}
            >
              <td
                colSpan={2}
                style={{
                  padding: '0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                Totals
              </td>
              <td
                style={{
                  padding: '0.75rem',
                  display: 'none',
                }}
                className="tablet:hb-block"
              />
              <td
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                {claim.formattedBilledAmount || '$0.00'}
              </td>
              <td
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#111827',
                  display: 'none',
                }}
                className="tablet:hb-block"
              >
                {claim.formattedAllowedAmount || '$0.00'}
              </td>
              <td
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#10b981',
                  display: 'none',
                }}
                className="tablet:hb-block"
              >
                {claim.formattedPaidAmount || '$0.00'}
              </td>
              <td
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: claim.memberOwes > 0 ? '#0069cc' : '#10b981',
                }}
              >
                {claim.formattedMemberOwes || '$0.00'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  /**
   * Renders the notes section.
   * @returns {React.ReactElement|null} Notes section or null
   */
  const renderNotes = () => {
    if (!claim.notes) {
      return null;
    }

    return (
      <div
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#fffbeb',
          borderRadius: '0.375rem',
          border: '1px solid #fde68a',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: '2px' }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#92400e',
                marginBottom: '0.125rem',
              }}
            >
              Notes
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                color: '#92400e',
                lineHeight: 1.5,
              }}
            >
              {claim.notes}
            </span>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders the claim details content.
   * @returns {React.ReactElement} Claim details content
   */
  const renderClaimDetails = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <button
              type="button"
              className={HB_CLASSES.btnTertiary}
              onClick={handleBackToClaims}
              aria-label="Go back to claims list"
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.8125rem',
                marginBottom: '0.5rem',
              }}
            >
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
                style={{ flexShrink: 0 }}
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Claims
            </button>
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
              Claim {claim.claimNumber || claim.claimId}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginTop: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <Badge
                variant={getBadgeVariant(claim.statusBadgeClass)}
                size="md"
                dot
              >
                {claim.statusLabel || 'Unknown'}
              </Badge>
              <Badge variant="neutral" size="sm">
                {claim.typeLabel || 'Unknown'}
              </Badge>
              {claim.isPending && (
                <Badge variant="info" size="sm">
                  Processing
                </Badge>
              )}
              {claim.canAppeal && (
                <Badge variant="warning" size="sm">
                  Appealable
                </Badge>
              )}
            </div>
          </div>

          {/* EOB Download Button */}
          {claim.hasEOB && (
            <div style={{ flexShrink: 0 }}>
              <Button
                variant="primary"
                size="md"
                onClick={handleDownloadEOB}
                loading={isDownloadingEOB}
                disabled={isDownloadingEOB}
                ariaLabel="Download Explanation of Benefits PDF"
                iconLeft={
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                }
              >
                {isDownloadingEOB ? 'Downloading...' : 'Download EOB'}
              </Button>
            </div>
          )}
        </div>

        {/* EOB Error */}
        {eobError && (
          <Alert
            variant="error"
            dismissible={true}
            onDismiss={() => setEobError(null)}
          >
            {eobError}
          </Alert>
        )}

        {/* Notes */}
        {renderNotes()}

        {/* Financial Summary Card */}
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
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
                Financial Summary
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                Breakdown of charges and payments
              </p>
            </div>
          </div>
          <div className={HB_CLASSES.cardBody} style={{ padding: '1rem 1.5rem' }}>
            {renderFinancialSummary()}
          </div>
        </div>

        {/* Provider & Claim Info Card */}
        <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
          <div
            className={HB_CLASSES.cardHeader}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
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
                  Provider & Claim Information
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  Service provider, diagnosis, and processing dates
                </p>
              </div>
            </div>

            {renderProcessingDates()}
          </div>
          <div className={HB_CLASSES.cardBody} style={{ padding: '1rem 1.5rem' }}>
            {renderProviderInfo()}
          </div>
        </div>

        {/* Line Items Card */}
        <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
          <div
            className={HB_CLASSES.cardHeader}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div
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
                  Service Details
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  Individual procedures and charges
                </p>
              </div>
            </div>

            {claim.lineItems && claim.lineItems.length > 0 && (
              <Badge variant="brand" size="sm">
                {claim.lineItems.length} {claim.lineItems.length === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
          <div
            className={HB_CLASSES.cardBody}
            style={{ padding: '0' }}
          >
            {renderLineItems()}
          </div>

          {/* Card Footer with EOB download */}
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {claim.hasEOB && (
                <button
                  type="button"
                  className={HB_CLASSES.btnTertiary}
                  onClick={handleDownloadEOB}
                  disabled={isDownloadingEOB}
                  aria-label="Download Explanation of Benefits PDF"
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.8125rem',
                  }}
                >
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
                    style={{ flexShrink: 0 }}
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {isDownloadingEOB ? 'Downloading...' : 'Download EOB'}
                </button>
              )}
              {!claim.hasEOB && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    lineHeight: 1.4,
                  }}
                >
                  EOB not yet available
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: '0.6875rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}
            >
              Claim ID: {claim.claimId}
            </span>
          </div>
        </div>

        {/* Related Documents */}
        {relatedDocuments.length > 0 && (
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
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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
                  Related Documents
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  Documents associated with this claim
                </p>
              </div>
            </div>
            <div className={HB_CLASSES.cardBody} style={{ padding: '0.75rem 1rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {relatedDocuments.map((doc) => (
                  <div
                    key={doc.documentId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '0.625rem 0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.375rem',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#111827',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {doc.title || 'Document'}
                      </span>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          lineHeight: 1.4,
                          marginTop: '0.125rem',
                        }}
                      >
                        {doc.categoryLabel || ''} • {doc.formattedDateCreated || ''} • {doc.formattedFileSize || ''}
                      </span>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {doc.statusLabel || 'Available'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id={id || 'claim-details'}
      className={containerClassName || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {isLoading && renderLoading()}
      {!isLoading && error && renderError()}
      {!isLoading && !error && claim && renderClaimDetails()}
    </div>
  );
};

ClaimDetails.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  claimId: PropTypes.string,
};

ClaimDetails.defaultProps = {
  className: '',
  id: undefined,
  claimId: undefined,
};

export default ClaimDetails;