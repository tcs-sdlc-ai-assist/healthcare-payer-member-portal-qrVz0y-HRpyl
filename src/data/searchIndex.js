import { ROUTES, DOCUMENT_CATEGORY_LABELS, CLAIM_TYPE_LABELS, COVERAGE_TYPE_LABELS } from '../constants/constants.js';

/**
 * Mock search index data fixture.
 * Used for development and testing of global search functionality.
 * Maps search terms to page routes and document references.
 * Contains NO PHI/PII — only portal page names, feature labels, and document titles.
 *
 * @typedef {Object} SearchIndexEntry
 * @property {string} id - Unique search entry identifier
 * @property {string} title - Display title for the search result
 * @property {string} description - Brief description of the search result
 * @property {string} route - Route path to navigate to
 * @property {string} category - Category of the search result (page, document, feature, faq)
 * @property {string[]} keywords - Array of keywords/terms that match this entry
 * @property {string|null} documentId - Related document ID if applicable
 * @property {string} icon - Icon identifier for display
 */

export const searchIndex = [
  // ===== Portal Pages =====
  {
    id: 'search-page-dashboard',
    title: 'Dashboard',
    description: 'View your health plan overview, recent claims, and notifications.',
    route: ROUTES.DASHBOARD,
    category: 'page',
    keywords: ['dashboard', 'home', 'overview', 'summary', 'main', 'start'],
    documentId: null,
    icon: 'home',
  },
  {
    id: 'search-page-coverage',
    title: 'My Coverage',
    description: 'View your health plan coverage details and benefits.',
    route: ROUTES.COVERAGE,
    category: 'page',
    keywords: ['coverage', 'benefits', 'plan', 'insurance', 'deductible', 'copay', 'coinsurance', 'out of pocket', 'oop', 'network'],
    documentId: null,
    icon: 'shield',
  },
  {
    id: 'search-page-id-cards',
    title: 'ID Cards',
    description: 'View, download, print, or request replacement insurance ID cards.',
    route: ROUTES.ID_CARDS,
    category: 'page',
    keywords: ['id cards', 'id card', 'insurance card', 'member card', 'print id card', 'request id card', 'digital id card'],
    documentId: null,
    icon: 'id-card',
  },
  {
    id: 'search-page-claims',
    title: 'Claims',
    description: 'View and track your medical, dental, vision, and pharmacy claims.',
    route: ROUTES.CLAIMS,
    category: 'page',
    keywords: ['claims', 'claim', 'eob', 'explanation of benefits', 'billing', 'charges', 'submitted', 'approved', 'denied', 'in review', 'appeal'],
    documentId: null,
    icon: 'file-text',
  },
  {
    id: 'search-page-find-doctor',
    title: 'Find a Doctor',
    description: 'Search for in-network doctors, specialists, and facilities.',
    route: ROUTES.FIND_DOCTOR,
    category: 'page',
    keywords: ['doctor', 'find doctor', 'provider', 'specialist', 'hospital', 'facility', 'network', 'in-network', 'physician', 'dentist', 'optometrist', 'therapist', 'pharmacy'],
    documentId: null,
    icon: 'search',
  },
  {
    id: 'search-page-documents',
    title: 'Documents',
    description: 'Access your EOBs, ID cards, plan documents, tax forms, and correspondence.',
    route: ROUTES.DOCUMENTS,
    category: 'page',
    keywords: ['documents', 'document center', 'eob', 'id card', 'plan documents', 'tax forms', '1095', 'correspondence', 'letters', 'download', 'prior authorization', 'appeals'],
    documentId: null,
    icon: 'folder',
  },
  {
    id: 'search-page-payments',
    title: 'Payments',
    description: 'Make payments, view payment history, and manage payment methods.',
    route: ROUTES.PAYMENTS,
    category: 'page',
    keywords: ['payments', 'pay', 'billing', 'premium', 'balance', 'payment history', 'payment method', 'credit card', 'bank account', 'autopay'],
    documentId: null,
    icon: 'credit-card',
  },
  {
    id: 'search-page-messages',
    title: 'Messages',
    description: 'View and send secure messages to member services.',
    route: ROUTES.MESSAGES,
    category: 'page',
    keywords: ['messages', 'message', 'inbox', 'secure message', 'contact', 'member services', 'support', 'communication'],
    documentId: null,
    icon: 'mail',
  },
  {
    id: 'search-page-settings',
    title: 'Settings',
    description: 'Manage your account settings, preferences, and notifications.',
    route: ROUTES.SETTINGS,
    category: 'page',
    keywords: ['settings', 'account', 'preferences', 'profile', 'password', 'notifications', 'email', 'phone', 'address', 'security'],
    documentId: null,
    icon: 'settings',
  },

  // ===== Coverage Types =====
  {
    id: 'search-coverage-medical',
    title: COVERAGE_TYPE_LABELS.MEDICAL,
    description: 'View your medical coverage details, deductibles, and copays.',
    route: ROUTES.COVERAGE,
    category: 'feature',
    keywords: ['medical', 'medical coverage', 'ppo', 'hmo', 'health plan', 'medical insurance', 'primary care', 'specialist', 'hospital'],
    documentId: null,
    icon: 'shield',
  },
  {
    id: 'search-coverage-dental',
    title: COVERAGE_TYPE_LABELS.DENTAL,
    description: 'View your dental coverage details, including preventive, basic, and major services.',
    route: ROUTES.COVERAGE,
    category: 'feature',
    keywords: ['dental', 'dental coverage', 'dentist', 'teeth', 'cleaning', 'filling', 'crown', 'orthodontia', 'braces'],
    documentId: null,
    icon: 'shield',
  },
  {
    id: 'search-coverage-vision',
    title: COVERAGE_TYPE_LABELS.VISION,
    description: 'View your vision coverage details, including eye exams, lenses, and frames.',
    route: ROUTES.COVERAGE,
    category: 'feature',
    keywords: ['vision', 'vision coverage', 'eye exam', 'glasses', 'contacts', 'lenses', 'frames', 'optometrist', 'lasik'],
    documentId: null,
    icon: 'shield',
  },
  {
    id: 'search-coverage-pharmacy',
    title: COVERAGE_TYPE_LABELS.PHARMACY,
    description: 'View your pharmacy benefits, formulary tiers, and prescription copays.',
    route: ROUTES.COVERAGE,
    category: 'feature',
    keywords: ['pharmacy', 'prescription', 'rx', 'medication', 'drug', 'formulary', 'generic', 'brand', 'specialty', 'mail order', 'copay'],
    documentId: null,
    icon: 'shield',
  },
  {
    id: 'search-coverage-behavioral',
    title: COVERAGE_TYPE_LABELS.BEHAVIORAL_HEALTH,
    description: 'View your behavioral health coverage for therapy, psychiatry, and substance abuse treatment.',
    route: ROUTES.COVERAGE,
    category: 'feature',
    keywords: ['behavioral health', 'mental health', 'therapy', 'counseling', 'psychiatry', 'substance abuse', 'crisis', 'telehealth', '988'],
    documentId: null,
    icon: 'shield',
  },

  // ===== Claim Types =====
  {
    id: 'search-claims-medical',
    title: CLAIM_TYPE_LABELS.MEDICAL + ' Claims',
    description: 'View your medical claims for doctor visits, hospital stays, and procedures.',
    route: ROUTES.CLAIMS,
    category: 'feature',
    keywords: ['medical claims', 'doctor visit', 'hospital', 'surgery', 'procedure'],
    documentId: null,
    icon: 'file-text',
  },
  {
    id: 'search-claims-dental',
    title: CLAIM_TYPE_LABELS.DENTAL + ' Claims',
    description: 'View your dental claims for cleanings, fillings, and other dental services.',
    route: ROUTES.CLAIMS,
    category: 'feature',
    keywords: ['dental claims', 'dental billing', 'cleaning claim', 'filling claim'],
    documentId: null,
    icon: 'file-text',
  },
  {
    id: 'search-claims-vision',
    title: CLAIM_TYPE_LABELS.VISION + ' Claims',
    description: 'View your vision claims for eye exams and eyewear.',
    route: ROUTES.CLAIMS,
    category: 'feature',
    keywords: ['vision claims', 'eye exam claim', 'glasses claim', 'contacts claim'],
    documentId: null,
    icon: 'file-text',
  },
  {
    id: 'search-claims-pharmacy',
    title: CLAIM_TYPE_LABELS.PHARMACY + ' Claims',
    description: 'View your pharmacy claims for prescription medications.',
    route: ROUTES.CLAIMS,
    category: 'feature',
    keywords: ['pharmacy claims', 'prescription claim', 'rx claim', 'medication claim', 'drug claim'],
    documentId: null,
    icon: 'file-text',
  },
  {
    id: 'search-claims-emergency',
    title: CLAIM_TYPE_LABELS.EMERGENCY + ' Claims',
    description: 'View your emergency room claims.',
    route: ROUTES.CLAIMS,
    category: 'feature',
    keywords: ['emergency claims', 'er claim', 'emergency room', 'urgent'],
    documentId: null,
    icon: 'file-text',
  },
  {
    id: 'search-claims-preventive',
    title: CLAIM_TYPE_LABELS.PREVENTIVE + ' Claims',
    description: 'View your preventive care claims for wellness visits and screenings.',
    route: ROUTES.CLAIMS,
    category: 'feature',
    keywords: ['preventive claims', 'wellness visit', 'annual exam', 'screening', 'immunization', 'vaccine'],
    documentId: null,
    icon: 'file-text',
  },

  // ===== Document Categories =====
  {
    id: 'search-doc-eob',
    title: DOCUMENT_CATEGORY_LABELS.EOB,
    description: 'View and download your Explanation of Benefits documents.',
    route: ROUTES.DOCUMENTS,
    category: 'document',
    keywords: ['eob', 'explanation of benefits', 'claim summary', 'benefits statement'],
    documentId: null,
    icon: 'folder',
  },
  {
    id: 'search-doc-id-card',
    title: DOCUMENT_CATEGORY_LABELS.ID_CARD,
    description: 'View, print, or request a new insurance ID card.',
    route: ROUTES.ID_CARDS,
    category: 'document',
    keywords: ['id card', 'insurance card', 'member card', 'print id card', 'request id card', 'digital id card'],
    documentId: null,
    icon: 'id-card',
  },
  {
    id: 'search-doc-plan-documents',
    title: DOCUMENT_CATEGORY_LABELS.PLAN_DOCUMENTS,
    description: 'Access your Summary of Benefits, Evidence of Coverage, formulary, and provider directory.',
    route: ROUTES.DOCUMENTS,
    category: 'document',
    keywords: ['plan documents', 'sbc', 'summary of benefits', 'evidence of coverage', 'eoc', 'formulary', 'drug list', 'provider directory'],
    documentId: null,
    icon: 'folder',
  },
  {
    id: 'search-doc-correspondence',
    title: DOCUMENT_CATEGORY_LABELS.CORRESPONDENCE,
    description: 'View letters and notices from your health plan.',
    route: ROUTES.DOCUMENTS,
    category: 'document',
    keywords: ['correspondence', 'letters', 'notices', 'welcome letter', 'denial notice', 'information request'],
    documentId: null,
    icon: 'folder',
  },
  {
    id: 'search-doc-tax-forms',
    title: DOCUMENT_CATEGORY_LABELS.TAX_FORMS,
    description: 'Access your 1095-B health coverage tax forms.',
    route: ROUTES.DOCUMENTS,
    category: 'document',
    keywords: ['tax forms', '1095', '1095-b', 'tax', 'irs', 'health coverage tax'],
    documentId: null,
    icon: 'folder',
  },
  {
    id: 'search-doc-prior-auth',
    title: DOCUMENT_CATEGORY_LABELS.PRIOR_AUTH,
    description: 'View prior authorization approval and denial letters.',
    route: ROUTES.DOCUMENTS,
    category: 'document',
    keywords: ['prior authorization', 'pre-authorization', 'pre-auth', 'prior auth', 'authorization approval', 'authorization denial'],
    documentId: null,
    icon: 'folder',
  },
  {
    id: 'search-doc-appeals',
    title: DOCUMENT_CATEGORY_LABELS.APPEALS,
    description: 'View appeal submissions, confirmations, and appeal rights information.',
    route: ROUTES.DOCUMENTS,
    category: 'document',
    keywords: ['appeals', 'appeal', 'appeal rights', 'appeal submission', 'grievance', 'dispute'],
    documentId: null,
    icon: 'folder',
  },

  // ===== Features =====
  {
    id: 'search-feature-deductible',
    title: 'Deductible Tracker',
    description: 'Track your individual and family deductible progress.',
    route: ROUTES.COVERAGE,
    category: 'feature',
    keywords: ['deductible', 'deductible tracker', 'deductible progress', 'deductible remaining', 'individual deductible', 'family deductible'],
    documentId: null,
    icon: 'shield',
  },
  {
    id: 'search-feature-oop',
    title: 'Out-of-Pocket Maximum',
    description: 'Track your out-of-pocket maximum spending for the plan year.',
    route: ROUTES.COVERAGE,
    category: 'feature',
    keywords: ['out of pocket', 'oop', 'out-of-pocket maximum', 'oop max', 'maximum spending', 'cost sharing'],
    documentId: null,
    icon: 'shield',
  },
  {
    id: 'search-feature-claim-appeal',
    title: 'File a Claim Appeal',
    description: 'Learn how to appeal a denied claim and access appeal forms.',
    route: ROUTES.CLAIMS,
    category: 'feature',
    keywords: ['appeal', 'file appeal', 'claim appeal', 'denied claim', 'dispute claim', 'appeal form', 'appeal instructions'],
    documentId: null,
    icon: 'file-text',
  },
  {
    id: 'search-feature-request-id-card',
    title: 'Request New ID Card',
    description: 'Request a replacement insurance ID card.',
    route: ROUTES.ID_CARDS,
    category: 'feature',
    keywords: ['request id card', 'replacement card', 'new id card', 'lost card', 'reorder card'],
    documentId: null,
    icon: 'id-card',
  },
  {
    id: 'search-feature-premium-payment',
    title: 'Pay Premium',
    description: 'Make your monthly premium payment online.',
    route: ROUTES.PAYMENTS,
    category: 'feature',
    keywords: ['pay premium', 'premium payment', 'monthly payment', 'premium due', 'pay bill'],
    documentId: null,
    icon: 'credit-card',
  },
  {
    id: 'search-feature-notifications',
    title: 'Notifications',
    description: 'View your alerts, claim updates, and important notices.',
    route: ROUTES.DASHBOARD,
    category: 'feature',
    keywords: ['notifications', 'alerts', 'notices', 'updates', 'claim updates', 'payment reminders'],
    documentId: null,
    icon: 'home',
  },

  // ===== FAQ / Help Topics =====
  {
    id: 'search-faq-how-to-read-eob',
    title: 'How to Read Your EOB',
    description: 'Learn how to understand your Explanation of Benefits document.',
    route: ROUTES.DOCUMENTS,
    category: 'faq',
    keywords: ['how to read eob', 'understand eob', 'explanation of benefits help', 'eob guide', 'what is eob'],
    documentId: null,
    icon: 'folder',
  },
  {
    id: 'search-faq-find-in-network',
    title: 'How to Find In-Network Providers',
    description: 'Learn how to search for doctors and facilities in your plan network.',
    route: ROUTES.FIND_DOCTOR,
    category: 'faq',
    keywords: ['in-network', 'find in-network', 'network provider', 'is my doctor in network', 'provider search'],
    documentId: null,
    icon: 'search',
  },
  {
    id: 'search-faq-prior-auth',
    title: 'What is Prior Authorization?',
    description: 'Learn about prior authorization requirements and how to request one.',
    route: ROUTES.DOCUMENTS,
    category: 'faq',
    keywords: ['what is prior authorization', 'prior auth required', 'pre-authorization', 'how to get prior auth', 'authorization process'],
    documentId: null,
    icon: 'folder',
  },
  {
    id: 'search-faq-claim-status',
    title: 'Understanding Claim Statuses',
    description: 'Learn what each claim status means and what actions you can take.',
    route: ROUTES.CLAIMS,
    category: 'faq',
    keywords: ['claim status', 'what does in review mean', 'claim denied', 'claim approved', 'claim pending', 'claim submitted', 'claim appealed'],
    documentId: null,
    icon: 'file-text',
  },
  {
    id: 'search-faq-contact-support',
    title: 'Contact Member Services',
    description: 'Get help by phone, email, or secure message.',
    route: ROUTES.MESSAGES,
    category: 'faq',
    keywords: ['contact', 'support', 'help', 'member services', 'phone number', 'customer service', 'call', 'email support', 'chat'],
    documentId: null,
    icon: 'mail',
  },
  {
    id: 'search-faq-update-info',
    title: 'Update Personal Information',
    description: 'Learn how to update your address, phone number, or email on file.',
    route: ROUTES.SETTINGS,
    category: 'faq',
    keywords: ['update address', 'change phone', 'change email', 'update information', 'personal information', 'edit profile'],
    documentId: null,
    icon: 'settings',
  },
];

/**
 * Searches the search index for entries matching the given query.
 * Performs case-insensitive partial matching against title, description, and keywords.
 * @param {string} query - The search query string
 * @param {Object} [options] - Search options
 * @param {string} [options.category] - Filter results by category ('page', 'document', 'feature', 'faq')
 * @param {number} [options.limit] - Maximum number of results to return
 * @returns {Object[]} Array of matching search index entries, sorted by relevance
 */
export const searchPortal = (query, options = {}) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const queryLower = query.trim().toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter((term) => term.length > 0);

  let results = searchIndex.map((entry) => {
    let score = 0;

    const titleLower = entry.title.toLowerCase();
    const descriptionLower = entry.description.toLowerCase();

    // Exact title match gets highest score
    if (titleLower === queryLower) {
      score += 100;
    }

    // Title starts with query
    if (titleLower.startsWith(queryLower)) {
      score += 50;
    }

    // Title contains query
    if (titleLower.includes(queryLower)) {
      score += 30;
    }

    // Description contains query
    if (descriptionLower.includes(queryLower)) {
      score += 10;
    }

    // Keyword matching
    for (const keyword of entry.keywords) {
      const keywordLower = keyword.toLowerCase();
      if (keywordLower === queryLower) {
        score += 40;
      } else if (keywordLower.includes(queryLower)) {
        score += 20;
      } else if (queryLower.includes(keywordLower)) {
        score += 15;
      }
    }

    // Individual term matching for multi-word queries
    if (queryTerms.length > 1) {
      for (const term of queryTerms) {
        if (titleLower.includes(term)) {
          score += 5;
        }
        if (descriptionLower.includes(term)) {
          score += 3;
        }
        for (const keyword of entry.keywords) {
          if (keyword.toLowerCase().includes(term)) {
            score += 4;
          }
        }
      }
    }

    return { ...entry, score };
  });

  // Filter out entries with no match
  results = results.filter((entry) => entry.score > 0);

  // Filter by category if specified
  if (options.category) {
    results = results.filter((entry) => entry.category === options.category);
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Apply limit if specified
  if (options.limit && options.limit > 0) {
    results = results.slice(0, options.limit);
  }

  return results;
};

/**
 * Returns all search index entries for a given category.
 * @param {string} category - The category to filter by ('page', 'document', 'feature', 'faq')
 * @returns {Object[]} Array of search index entries matching the category
 */
export const getSearchEntriesByCategory = (category) => {
  return searchIndex.filter((entry) => entry.category === category);
};

/**
 * Returns all unique categories in the search index.
 * @returns {string[]} Array of unique category strings
 */
export const getSearchCategories = () => {
  const categories = new Set(searchIndex.map((entry) => entry.category));
  return Array.from(categories);
};

/**
 * Returns search suggestions based on a partial query.
 * Returns matching entry titles for autocomplete functionality.
 * @param {string} partial - The partial search query
 * @param {number} [limit=5] - Maximum number of suggestions to return
 * @returns {Object[]} Array of suggestion objects with id, title, route, and category
 */
export const getSearchSuggestions = (partial, limit = 5) => {
  if (!partial || typeof partial !== 'string' || partial.trim().length === 0) {
    return [];
  }

  const partialLower = partial.trim().toLowerCase();

  const suggestions = searchIndex
    .filter((entry) => {
      const titleLower = entry.title.toLowerCase();
      if (titleLower.includes(partialLower)) {
        return true;
      }
      for (const keyword of entry.keywords) {
        if (keyword.toLowerCase().includes(partialLower)) {
          return true;
        }
      }
      return false;
    })
    .map((entry) => {
      let priority = 0;
      const titleLower = entry.title.toLowerCase();
      if (titleLower.startsWith(partialLower)) {
        priority += 20;
      }
      if (titleLower.includes(partialLower)) {
        priority += 10;
      }
      if (entry.category === 'page') {
        priority += 5;
      }
      return {
        id: entry.id,
        title: entry.title,
        route: entry.route,
        category: entry.category,
        icon: entry.icon,
        priority,
      };
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);

  return suggestions;
};
