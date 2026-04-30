import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { HB_CLASSES } from '../../constants/constants.js';
import {
  performSearch,
  getSuggestions,
  groupResultsByCategory,
  getCategoryLabel,
  sanitizeQuery,
  isValidQuery,
  highlightMatches,
  getPopularSearchTerms,
} from '../../utils/searchUtils.js';

/**
 * Debounce delay in milliseconds for search input.
 * @type {number}
 */
const DEBOUNCE_DELAY = 300;

/**
 * Maximum number of results to display in the dropdown.
 * @type {number}
 */
const MAX_DROPDOWN_RESULTS = 8;

/**
 * Maximum number of suggestions to display.
 * @type {number}
 */
const MAX_SUGGESTIONS = 5;

/**
 * Icon map for search result categories and types.
 * Returns an SVG element for the given icon identifier.
 *
 * @param {string} icon - The icon identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getIconForResult = (icon) => {
  const iconProps = {
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    style: { flexShrink: 0 },
  };

  switch (icon) {
    case 'home':
      return (
        <svg {...iconProps}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'file-text':
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'search':
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'folder':
      return (
        <svg {...iconProps}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'credit-card':
      return (
        <svg {...iconProps}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...iconProps}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
  }
};

/**
 * Global search bar component for the header.
 * Implements search input with HB CSS form classes, debounced input handling,
 * dropdown results display showing portal pages and documents (no PHI/PII),
 * and keyboard navigation for results. Uses searchUtils for filtering.
 *
 * @param {Object} props
 * @param {string} [props.placeholder='Search the portal...'] - Placeholder text for the search input
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id='global-search'] - HTML id attribute for the search input
 * @param {boolean} [props.autoFocus=false] - Whether to auto-focus the search input on mount
 * @param {Function} [props.onResultSelect] - Callback invoked when a search result is selected
 * @param {Function} [props.onClose] - Callback invoked when the search dropdown is closed
 * @param {string} [props.size='md'] - Input size ('sm', 'md', 'lg')
 * @returns {React.ReactElement} The search bar element
 */
const SearchBar = ({
  placeholder,
  className,
  id,
  autoFocus,
  onResultSelect,
  onClose,
  size,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const resultRefs = useRef([]);

  const navigate = useNavigate();

  /**
   * Debounce the query input.
   */
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  /**
   * Cleanup debounce timer on unmount.
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Compute search results from the debounced query.
   */
  const searchResults = useMemo(() => {
    if (!isValidQuery(debouncedQuery)) {
      return [];
    }

    const result = performSearch(debouncedQuery, { limit: MAX_DROPDOWN_RESULTS });
    return result.results || [];
  }, [debouncedQuery]);

  /**
   * Compute grouped results for display.
   */
  const groupedResults = useMemo(() => {
    if (searchResults.length === 0) {
      return {};
    }

    return groupResultsByCategory(searchResults);
  }, [searchResults]);

  /**
   * Compute flat list of results for keyboard navigation.
   */
  const flatResults = useMemo(() => {
    return searchResults;
  }, [searchResults]);

  /**
   * Compute suggestions when query is empty but input is focused.
   */
  const suggestions = useMemo(() => {
    if (query.trim().length > 0) {
      return [];
    }

    return getPopularSearchTerms().slice(0, MAX_SUGGESTIONS);
  }, [query]);

  /**
   * Determine whether to show the dropdown.
   */
  const showDropdown = useMemo(() => {
    if (!isFocused) {
      return false;
    }

    if (query.trim().length === 0 && suggestions.length > 0) {
      return true;
    }

    if (isValidQuery(debouncedQuery)) {
      return true;
    }

    return false;
  }, [isFocused, query, debouncedQuery, suggestions]);

  /**
   * Auto-focus the input on mount if autoFocus is true.
   */
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  /**
   * Reset active index when results change.
   */
  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  /**
   * Scroll active result into view.
   */
  useEffect(() => {
    if (activeIndex >= 0 && resultRefs.current[activeIndex] && listRef.current) {
      const optionEl = resultRefs.current[activeIndex];
      const listEl = listRef.current;

      const optionTop = optionEl.offsetTop;
      const optionBottom = optionTop + optionEl.offsetHeight;
      const listScrollTop = listEl.scrollTop;
      const listBottom = listScrollTop + listEl.clientHeight;

      if (optionTop < listScrollTop) {
        listEl.scrollTop = optionTop;
      } else if (optionBottom > listBottom) {
        listEl.scrollTop = optionBottom - listEl.clientHeight;
      }
    }
  }, [activeIndex]);

  /**
   * Handle click outside to close dropdown.
   */
  useEffect(() => {
    if (!showDropdown) {
      return;
    }

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  /**
   * Closes the dropdown and resets state.
   */
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setIsFocused(false);
    setActiveIndex(-1);

    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  /**
   * Handles selecting a search result.
   *
   * @param {Object} result - The selected search result
   */
  const handleResultSelect = useCallback((result) => {
    if (!result) {
      return;
    }

    setQuery('');
    setDebouncedQuery('');
    closeDropdown();

    if (inputRef.current) {
      inputRef.current.blur();
    }

    if (onResultSelect && typeof onResultSelect === 'function') {
      onResultSelect(result);
    }

    if (result.route) {
      navigate(result.route);
    }
  }, [navigate, onResultSelect, closeDropdown]);

  /**
   * Handles selecting a suggestion term.
   *
   * @param {string} term - The suggestion term
   */
  const handleSuggestionSelect = useCallback((term) => {
    setQuery(term);
    setDebouncedQuery(term);
    setActiveIndex(-1);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * Handles input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setActiveIndex(-1);
  }, []);

  /**
   * Handles input focus.
   */
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    setIsOpen(true);
  }, []);

  /**
   * Handles input blur.
   */
  const handleInputBlur = useCallback(() => {
    // Delay to allow click events on results to fire
    setTimeout(() => {
      if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
        setIsFocused(false);
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }, 200);
  }, []);

  /**
   * Clears the search input.
   */
  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setActiveIndex(-1);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * Handles keyboard navigation.
   *
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyDown = useCallback((e) => {
    const isShowingSuggestions = query.trim().length === 0 && suggestions.length > 0;
    const totalItems = isShowingSuggestions ? suggestions.length : flatResults.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (totalItems > 0) {
          setActiveIndex((prev) => {
            const next = prev + 1;
            return next >= totalItems ? 0 : next;
          });
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (totalItems > 0) {
          setActiveIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? totalItems - 1 : next;
          });
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          if (isShowingSuggestions) {
            if (suggestions[activeIndex]) {
              handleSuggestionSelect(suggestions[activeIndex]);
            }
          } else {
            if (flatResults[activeIndex]) {
              handleResultSelect(flatResults[activeIndex]);
            }
          }
        } else if (query.trim().length > 0) {
          // If no active index but query exists, perform search (keep dropdown open)
          setDebouncedQuery(query);
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (showDropdown) {
          closeDropdown();
          if (inputRef.current) {
            inputRef.current.blur();
          }
        }
        break;

      case 'Tab':
        closeDropdown();
        break;

      default:
        break;
    }
  }, [query, suggestions, flatResults, activeIndex, showDropdown, handleResultSelect, handleSuggestionSelect, closeDropdown]);

  /**
   * Returns size-specific inline styles for the input.
   *
   * @param {string} s - The size string
   * @returns {Object} Inline style object
   */
  const getSizeStyle = (s) => {
    switch (s) {
      case 'sm':
        return {
          padding: '0.375rem 2.25rem 0.375rem 2.25rem',
          fontSize: '0.875rem',
        };
      case 'lg':
        return {
          padding: '0.75rem 2.5rem 0.75rem 2.5rem',
          fontSize: '1.125rem',
        };
      case 'md':
      default:
        return {
          padding: '0.5rem 2.25rem 0.5rem 2.25rem',
          fontSize: '0.9375rem',
        };
    }
  };

  const sizeStyle = getSizeStyle(size);

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const listboxId = `${id}-listbox`;
  const activeDescendantId = activeIndex >= 0 ? `${id}-result-${activeIndex}` : undefined;

  /**
   * Renders the search results grouped by category.
   */
  const renderResults = () => {
    if (flatResults.length === 0) {
      return (
        <div
          style={{
            padding: '1rem',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '0.875rem',
          }}
        >
          No results found for &ldquo;{sanitizeQuery(debouncedQuery)}&rdquo;
        </div>
      );
    }

    const categoryOrder = ['page', 'feature', 'document', 'faq'];
    const categories = Object.keys(groupedResults).sort((a, b) => {
      const aIdx = categoryOrder.indexOf(a);
      const bIdx = categoryOrder.indexOf(b);
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });

    let globalIndex = 0;

    return categories.map((category) => {
      const items = groupedResults[category];
      if (!items || items.length === 0) {
        return null;
      }

      const categoryLabel = getCategoryLabel(category);

      return (
        <div key={category}>
          <div
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            {categoryLabel}
          </div>
          {items.map((result) => {
            const currentIndex = globalIndex;
            globalIndex += 1;
            const isActive = currentIndex === activeIndex;
            const parts = highlightMatches(result.title, debouncedQuery);

            return (
              <div
                key={result.id}
                id={`${id}-result-${currentIndex}`}
                ref={(el) => {
                  resultRefs.current[currentIndex] = el;
                }}
                role="option"
                aria-selected={isActive}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleResultSelect(result);
                }}
                onMouseEnter={() => setActiveIndex(currentIndex)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#e6f0fa' : 'transparent',
                  transition: 'background-color 0.1s ease-in-out',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: '0.25rem',
                    backgroundColor: isActive ? '#cce1f5' : '#f3f4f6',
                    color: isActive ? '#0069cc' : '#6b7280',
                    flexShrink: 0,
                    marginTop: '0.0625rem',
                  }}
                  aria-hidden="true"
                >
                  {getIconForResult(result.icon)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#1f2937',
                      lineHeight: 1.3,
                    }}
                  >
                    {parts.map((part, partIndex) => (
                      part.highlighted ? (
                        <mark
                          key={partIndex}
                          style={{
                            backgroundColor: '#fde68a',
                            color: '#1f2937',
                            padding: '0 0.0625rem',
                            borderRadius: '0.125rem',
                          }}
                        >
                          {part.text}
                        </mark>
                      ) : (
                        <span key={partIndex}>{part.text}</span>
                      )
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: 1.4,
                      marginTop: '0.125rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {result.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    });
  };

  /**
   * Renders popular search suggestions when input is empty.
   */
  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null;
    }

    return (
      <div>
        <div
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          Popular Searches
        </div>
        {suggestions.map((term, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={term}
              id={`${id}-result-${index}`}
              ref={(el) => {
                resultRefs.current[index] = el;
              }}
              role="option"
              aria-selected={isActive}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSuggestionSelect(term);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                backgroundColor: isActive ? '#e6f0fa' : 'transparent',
                transition: 'background-color 0.1s ease-in-out',
                borderBottom: '1px solid #f3f4f6',
                fontSize: '0.875rem',
                color: isActive ? '#0069cc' : '#374151',
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
                style={{ flexShrink: 0, opacity: 0.5 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>{term}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const isShowingSuggestions = query.trim().length === 0 && suggestions.length > 0;
  const hasSearchQuery = isValidQuery(debouncedQuery);

  return (
    <div
      ref={containerRef}
      className={containerClassName || undefined}
      style={{ position: 'relative', width: '100%' }}
      role="search"
      aria-label="Search the portal"
    >
      {/* Search input wrapper */}
      <div style={{ position: 'relative' }}>
        {/* Search icon */}
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
          style={{
            position: 'absolute',
            left: '0.625rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          ref={inputRef}
          id={id}
          type="search"
          className={HB_CLASSES.formInput}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-controls={showDropdown ? listboxId : undefined}
          aria-activedescendant={showDropdown ? activeDescendantId : undefined}
          aria-label="Search the portal"
          style={{
            ...sizeStyle,
            width: '100%',
            paddingRight: query.length > 0 ? '2.25rem' : sizeStyle.padding.split(' ')[2] || '2.25rem',
          }}
        />

        {/* Clear button */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.5rem',
              height: '1.5rem',
              padding: 0,
              background: 'none',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              color: '#9ca3af',
              transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af';
              e.currentTarget.style.backgroundColor = 'transparent';
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
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          tabIndex={-1}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            marginTop: '0.25rem',
            maxHeight: '20rem',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
          }}
          className="hb-scrollbar-thin"
        >
          {isShowingSuggestions && !hasSearchQuery && renderSuggestions()}
          {hasSearchQuery && renderResults()}

          {/* Keyboard hint */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.375rem 0.75rem',
              fontSize: '0.6875rem',
              color: '#9ca3af',
              backgroundColor: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
            }}
            aria-hidden="true"
          >
            <span>
              <kbd style={{ padding: '0.0625rem 0.25rem', backgroundColor: '#e5e7eb', borderRadius: '0.125rem', fontSize: '0.625rem', fontFamily: 'monospace' }}>↑↓</kbd>
              {' '}navigate
              {' '}
              <kbd style={{ padding: '0.0625rem 0.25rem', backgroundColor: '#e5e7eb', borderRadius: '0.125rem', fontSize: '0.625rem', fontFamily: 'monospace' }}>↵</kbd>
              {' '}select
              {' '}
              <kbd style={{ padding: '0.0625rem 0.25rem', backgroundColor: '#e5e7eb', borderRadius: '0.125rem', fontSize: '0.625rem', fontFamily: 'monospace' }}>esc</kbd>
              {' '}close
            </span>
            {hasSearchQuery && (
              <span>{flatResults.length} result{flatResults.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  autoFocus: PropTypes.bool,
  onResultSelect: PropTypes.func,
  onClose: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

SearchBar.defaultProps = {
  placeholder: 'Search the portal...',
  className: '',
  id: 'global-search',
  autoFocus: false,
  onResultSelect: undefined,
  onClose: undefined,
  size: 'md',
};

export default SearchBar;