import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import { getIDCards, getIDCardDetails, getIDCardPdf, printIDCard, requestNewCard } from '../services/idCardService.js';
import { HB_CLASSES, COVERAGE_TYPE_LABELS } from '../constants/constants.js';
import CoverageSelector from '../components/shared/CoverageSelector.jsx';
import IDCardPreview from '../components/idcards/IDCardPreview.jsx';
import IDCardActions from '../components/idcards/IDCardActions.jsx';
import Badge from '../components/ui/Badge.jsx';
import Alert from '../components/ui/Alert.jsx';

/**
 * Returns a coverage type icon SVG element.
 * @param {string} coverageType - The coverage type identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getCoverageIcon = (coverageType) => {
  const iconProps = {
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    style: { flexShrink: 0 },
  };

  switch (coverageType) {
    case 'MEDICAL':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'DENTAL':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
    case 'VISION':
      return (
        <svg {...iconProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'PHARMACY':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case 'BEHAVIORAL_HEALTH':
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
  }
};

/**
 * IDCardsPage component.
 * ID Cards page composing CoverageSelector, IDCardPreview, and IDCardActions.
 * Manages selected coverage state and passes to child components.
 * Uses HB CSS page-content layout and grid classes.
 *
 * @returns {React.ReactElement} The ID Cards page element
 */
const IDCardsPage = () => {
  const { user } = useAuth();
  const { tagPageViewed, tagIDCardDownloaded, tagIDCardPrinted, tagIDCardRequested } = useGlassbox();

  const [cards, setCards] = useState([]);
  const [selectedCoverageType, setSelectedCoverageType] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches ID cards for the current member.
   */
  const fetchIDCards = useCallback(() => {
    if (!user || !user.memberId) {
      setCards([]);
      setSelectedCard(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        memberId: user.memberId,
        activeOnly: true,
      };

      if (selectedCoverageType) {
        params.coverageType = selectedCoverageType;
      }

      const result = getIDCards(params);

      if (result.error) {
        setError(result.error);
        setCards([]);
        setSelectedCard(null);
      } else {
        const fetchedCards = result.cards || [];
        setCards(fetchedCards);

        if (fetchedCards.length > 0) {
          if (selectedCard) {
            const stillExists = fetchedCards.find((c) => c.cardId === selectedCard.cardId);
            if (stillExists) {
              setSelectedCard(stillExists);
            } else {
              setSelectedCard(fetchedCards[0]);
            }
          } else {
            setSelectedCard(fetchedCards[0]);
          }
        } else {
          setSelectedCard(null);
        }
      }
    } catch (err) {
      console.error('[IDCardsPage] Error fetching ID cards:', err);
      setError('Unable to load ID cards. Please try again.');
      setCards([]);
      setSelectedCard(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedCoverageType]);

  /**
   * Fetch ID cards on mount and when dependencies change.
   */
  useEffect(() => {
    fetchIDCards();
  }, [fetchIDCards]);

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'ID Cards',
      route: '/coverage',
    });
  }, [tagPageViewed]);

  /**
   * Handles coverage type filter change.
   * @param {string} value - The new coverage type value
   */
  const handleCoverageTypeChange = useCallback((value) => {
    setSelectedCoverageType(value);
    setSelectedCard(null);
  }, []);

  /**
   * Handles selecting a specific card from the card list.
   * @param {Object} card - The card to select
   */
  const handleCardSelect = useCallback((card) => {
    if (!card || !card.cardId) {
      return;
    }
    setSelectedCard(card);
  }, []);

  /**
   * Handles ID card download action.
   * @param {Object} card - The card to download
   */
  const handleDownload = useCallback((card) => {
    if (!card || !card.cardId) {
      return;
    }

    try {
      const result = getIDCardPdf(card.cardId, {
        memberId: user?.memberId,
        download: true,
        filename: `ID_Card_${card.coverageTypeLabel || card.front?.planType || 'Card'}_${card.front?.memberId || 'member'}.pdf`,
      });

      if (result.success) {
        tagIDCardDownloaded({
          cardId: card.cardId,
          coverageType: card.coverageType,
          planName: card.front?.planName || null,
        });
      }
    } catch (err) {
      console.error('[IDCardsPage] Error downloading ID card:', err);
    }
  }, [user, tagIDCardDownloaded]);

  /**
   * Handles ID card print action.
   * @param {Object} card - The card to print
   */
  const handlePrint = useCallback((card) => {
    if (!card || !card.cardId) {
      return;
    }

    try {
      const result = printIDCard(card.cardId, {
        memberId: user?.memberId,
      });

      if (result.success) {
        tagIDCardPrinted({
          cardId: card.cardId,
          coverageType: card.coverageType,
          planName: card.front?.planName || null,
        });

        setTimeout(() => {
          try {
            window.print();
          } catch (printErr) {
            console.error('[IDCardsPage] Error opening print dialog:', printErr);
          }
        }, 100);
      }
    } catch (err) {
      console.error('[IDCardsPage] Error printing ID card:', err);
    }
  }, [user, tagIDCardPrinted]);

  /**
   * Handles request new card action (delegated to IDCardActions).
   * @param {Object} card - The card to request replacement for
   */
  const handleRequestNew = useCallback((card) => {
    // IDCardActions handles the modal and request flow internally
    // This callback is provided for the IDCardPreview action buttons
  }, []);

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
        aria-label="Loading ID cards"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className={HB_CLASSES.card}
            style={{ overflow: 'hidden' }}
          >
            <div className={HB_CLASSES.cardBody} style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '50%',
                    height: '1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.25rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '6rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                <div
                  style={{
                    width: '70%',
                    height: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.25rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
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
      <Alert
        variant="error"
        title="Error Loading ID Cards"
        dismissible={false}
      >
        <span>{error}</span>
        <button
          type="button"
          onClick={fetchIDCards}
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
          aria-label="Retry loading ID cards"
        >
          Retry
        </button>
      </Alert>
    );
  };

  /**
   * Renders the empty state when no ID cards are found.
   * @returns {React.ReactElement} Empty state message
   */
  const renderEmpty = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '3rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '9999px',
            backgroundColor: '#f3f4f6',
            color: '#9ca3af',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <svg
            width="24"
            height="24"
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
        </div>
        <div>
          <p
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              lineHeight: 1.3,
            }}
          >
            No ID cards found
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
              maxWidth: '24rem',
            }}
          >
            {selectedCoverageType
              ? 'No ID cards match the selected coverage type. Try selecting a different coverage type.'
              : 'You don\'t have any active ID cards on file.'}
          </p>
        </div>
        {selectedCoverageType && (
          <button
            type="button"
            className={HB_CLASSES.btnSecondary}
            onClick={() => setSelectedCoverageType('')}
            aria-label="Clear coverage type filter"
            style={{
              padding: '0.375rem 1rem',
              fontSize: '0.875rem',
            }}
          >
            Show All Cards
          </button>
        )}
      </div>
    );
  };

  /**
   * Renders the card selector tabs when multiple cards are available.
   * @returns {React.ReactElement|null} Card selector tabs or null
   */
  const renderCardSelector = () => {
    if (cards.length <= 1) {
      return null;
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
        role="tablist"
        aria-label="Select an ID card"
      >
        {cards.map((card) => {
          const isSelected = selectedCard && selectedCard.cardId === card.cardId;

          return (
            <button
              key={card.cardId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleCardSelect(card)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 0.875rem',
                fontSize: '0.8125rem',
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? '#0069cc' : '#6b7280',
                backgroundColor: isSelected ? '#e6f0fa' : 'transparent',
                border: isSelected ? '2px solid #0069cc' : '2px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: isSelected ? '#0069cc' : '#9ca3af',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {getCoverageIcon(card.coverageType)}
              </span>
              {card.coverageTypeLabel || card.front?.planName || 'ID Card'}
            </button>
          );
        })}
      </div>
    );
  };

  /**
   * Renders the main content with card preview and actions.
   * @returns {React.ReactElement} Main content
   */
  const renderContent = () => {
    if (cards.length === 0) {
      return renderEmpty();
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Card Selector Tabs */}
        {renderCardSelector()}

        {/* Selected Card Preview and Actions */}
        {selectedCard && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.5rem',
            }}
          >
            {/* Card Preview */}
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
                    {getCoverageIcon(selectedCard.coverageType)}
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
                      {selectedCard.coverageTypeLabel || selectedCard.front?.planName || 'ID Card'}
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        lineHeight: 1.4,
                      }}
                    >
                      {selectedCard.front?.planName || ''} {selectedCard.front?.planType ? `(${selectedCard.front.planType})` : ''}
                    </p>
                  </div>
                </div>

                {selectedCard.isActive !== undefined && (
                  <Badge
                    variant={selectedCard.isActive ? 'success' : 'neutral'}
                    size="sm"
                    dot
                  >
                    {selectedCard.statusLabel || (selectedCard.isActive ? 'Active' : 'Inactive')}
                  </Badge>
                )}
              </div>

              <div className={HB_CLASSES.cardBody} style={{ padding: '1.5rem' }}>
                <IDCardPreview
                  card={selectedCard}
                  id={`idcard-preview-${selectedCard.cardId}`}
                  onDownload={handleDownload}
                  onPrint={handlePrint}
                  onRequestNew={handleRequestNew}
                  showActions={false}
                />
              </div>

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
                <IDCardActions
                  card={selectedCard}
                  id={`idcard-actions-${selectedCard.cardId}`}
                  size="sm"
                  layout="horizontal"
                  showDownload={true}
                  showPrint={true}
                  showRequestNew={true}
                  onDownloadComplete={(card) => {
                    tagIDCardDownloaded({
                      cardId: card.cardId,
                      coverageType: card.coverageType,
                      planName: card.front?.planName || null,
                    });
                  }}
                  onPrintComplete={(card) => {
                    tagIDCardPrinted({
                      cardId: card.cardId,
                      coverageType: card.coverageType,
                      planName: card.front?.planName || null,
                    });
                  }}
                  onRequestComplete={(result) => {
                    tagIDCardRequested({
                      coverageType: result.coverageType || null,
                      reason: 'replacement',
                    });
                  }}
                />

                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: '#9ca3af',
                    lineHeight: 1.4,
                  }}
                >
                  Card ID: {selectedCard.cardId}
                </span>
              </div>
            </div>

            {/* All Cards Summary */}
            {cards.length > 1 && (
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
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
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
                        All Active Cards
                      </h2>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          lineHeight: 1.4,
                        }}
                      >
                        Select a card above to view details
                      </p>
                    </div>
                  </div>

                  <Badge variant="brand" size="sm">
                    {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                  </Badge>
                </div>

                <div className={HB_CLASSES.cardBody} style={{ padding: '0.75rem 1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {cards.map((card) => {
                      const isSelected = selectedCard && selectedCard.cardId === card.cardId;

                      return (
                        <button
                          key={card.cardId}
                          type="button"
                          onClick={() => handleCardSelect(card)}
                          aria-label={`View ${card.coverageTypeLabel || 'ID'} card details`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: isSelected ? '#e6f0fa' : '#f9fafb',
                            border: isSelected ? '1px solid #0069cc' : '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease-in-out',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = '#e6f0fa';
                              e.currentTarget.style.borderColor = '#0069cc';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }
                          }}
                          onFocus={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = '#e6f0fa';
                              e.currentTarget.style.borderColor = '#0069cc';
                            }
                          }}
                          onBlur={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }
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
                              backgroundColor: isSelected ? '#0069cc' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#0069cc',
                              flexShrink: 0,
                              border: isSelected ? 'none' : '1px solid #e5e7eb',
                            }}
                            aria-hidden="true"
                          >
                            {getCoverageIcon(card.coverageType)}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                marginBottom: '0.125rem',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '0.875rem',
                                  fontWeight: isSelected ? 600 : 500,
                                  color: isSelected ? '#0069cc' : '#111827',
                                  lineHeight: 1.3,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {card.coverageTypeLabel || card.front?.planName || 'ID Card'}
                              </span>
                              {card.isActive && (
                                <Badge variant="success" size="sm" dot>
                                  Active
                                </Badge>
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                lineHeight: 1.4,
                              }}
                            >
                              {card.front?.planName || ''} {card.front?.planType ? `• ${card.front.planType}` : ''}
                            </span>
                          </div>

                          {isSelected && (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#0069cc"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              style={{ flexShrink: 0 }}
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}

                          {!isSelected && (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#9ca3af"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              style={{ flexShrink: 0 }}
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
            ID Cards
          </h1>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            View, download, print, or request replacement insurance ID cards for all your active coverages.
          </p>
        </div>

        {/* Summary badges */}
        {!isLoading && !error && cards.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <Badge variant="brand" size="sm">
              {cards.length} active {cards.length === 1 ? 'card' : 'cards'}
            </Badge>
          </div>
        )}
      </div>

      {/* Coverage Type Filter */}
      <div
        style={{
          maxWidth: '20rem',
        }}
      >
        <CoverageSelector
          value={selectedCoverageType}
          onChange={handleCoverageTypeChange}
          label="Filter by Coverage"
          placeholder="All Coverages"
          showAllOption={true}
          source="idcards"
          size="sm"
          native={true}
          block={true}
          id="idcards-coverage-filter"
          ariaLabel="Filter ID cards by coverage type"
        />
      </div>

      {/* Main Content */}
      {isLoading && renderLoading()}
      {!isLoading && error && renderError()}
      {!isLoading && !error && renderContent()}
    </div>
  );
};

export default IDCardsPage;