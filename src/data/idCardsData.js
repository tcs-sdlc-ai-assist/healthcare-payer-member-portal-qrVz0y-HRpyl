import { COVERAGE_TYPE } from '../constants/constants.js';

/**
 * Mock ID card data fixture.
 * Used for development and testing of ID card preview, print, download, and request features.
 *
 * @typedef {Object} IDCardCopays
 * @property {string} primaryCare - Primary care visit copay
 * @property {string} specialist - Specialist visit copay
 * @property {string} urgentCare - Urgent care visit copay
 * @property {string} emergencyRoom - Emergency room copay
 *
 * @typedef {Object} IDCardRxInfo
 * @property {string} rxBIN - Pharmacy BIN number
 * @property {string} rxPCN - Pharmacy PCN
 * @property {string} rxGroup - Pharmacy group number
 *
 * @typedef {Object} IDCardFront
 * @property {string} planName - Health plan display name
 * @property {string} planType - Type of plan (e.g., PPO, HMO)
 * @property {string} memberName - Full member name as printed on card
 * @property {string} memberId - Member ID as printed on card
 * @property {string} groupNumber - Employer group number
 * @property {string} subscriberId - Subscriber ID
 * @property {string} effectiveDate - Plan effective date (MM/DD/YYYY)
 * @property {string} pcpName - Primary care physician name
 * @property {string} pcpPhone - Primary care physician phone number
 * @property {string} networkName - Network name
 * @property {IDCardCopays} copays - Copay amounts
 *
 * @typedef {Object} IDCardBack
 * @property {IDCardRxInfo} rxInfo - Pharmacy/prescription information
 * @property {string} claimsAddress - Claims mailing address
 * @property {string} claimsPhone - Claims phone number
 * @property {string} memberServicesPhone - Member services phone number
 * @property {string} nurseLinePhone - 24/7 nurse line phone number
 * @property {string} mentalHealthPhone - Behavioral health phone number
 * @property {string} preAuthPhone - Pre-authorization phone number
 * @property {string} websiteUrl - Member portal website URL
 * @property {string} providerDirectoryUrl - Provider directory URL
 * @property {string} emergencyInstructions - Emergency instructions text
 *
 * @typedef {Object} IDCard
 * @property {string} cardId - Unique card identifier
 * @property {string} memberId - Associated member identifier
 * @property {string} coverageId - Associated coverage identifier
 * @property {string} coverageType - Coverage type (MEDICAL, DENTAL, VISION, PHARMACY, BEHAVIORAL_HEALTH)
 * @property {string} cardType - Card type (e.g., 'primary', 'dependent')
 * @property {string} issueDate - Date card was issued (YYYY-MM-DD)
 * @property {string} expirationDate - Date card expires (YYYY-MM-DD)
 * @property {string} frontImageUrl - URL to the front card image
 * @property {string} backImageUrl - URL to the back card image
 * @property {IDCardFront} front - Front card details
 * @property {IDCardBack} back - Back card details
 * @property {string} status - Card status (active, expired, requested)
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 */

export const idCardsData = [
  {
    cardId: 'IDC-2024-00001',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-MED-00042',
    coverageType: COVERAGE_TYPE.MEDICAL,
    cardType: 'primary',
    issueDate: '2024-01-01',
    expirationDate: '2024-12-31',
    frontImageUrl: '/images/idcards/medical_front.png',
    backImageUrl: '/images/idcards/medical_back.png',
    front: {
      planName: 'HealthFirst PPO 5000',
      planType: 'PPO',
      memberName: 'Jane Doe',
      memberId: 'HCP-2024-00042',
      groupNumber: 'GRP-98765',
      subscriberId: 'SUB-2024-00042',
      effectiveDate: '01/01/2024',
      pcpName: 'Dr. Robert Smith, MD',
      pcpPhone: '(555) 234-5678',
      networkName: 'HealthFirst National PPO Network',
      copays: {
        primaryCare: '$25',
        specialist: '$50',
        urgentCare: '$75',
        emergencyRoom: '$250',
      },
    },
    back: {
      rxInfo: {
        rxBIN: '610014',
        rxPCN: 'HFPPO',
        rxGroup: 'RX98765',
      },
      claimsAddress: 'HealthFirst Claims, P.O. Box 12345, Springfield, IL 62704',
      claimsPhone: '1-800-555-0101',
      memberServicesPhone: '1-800-555-0199',
      nurseLinePhone: '1-800-555-0150',
      mentalHealthPhone: '1-800-555-0175',
      preAuthPhone: '1-800-555-0130',
      websiteUrl: 'https://member.healthcarepayer.com',
      providerDirectoryUrl: 'https://doctorfinder.healthcarepayer.com',
      emergencyInstructions: 'In case of emergency, call 911 or go to the nearest emergency room. Present this card upon arrival. Pre-authorization is not required for emergency services.',
    },
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    cardId: 'IDC-2024-00002',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-DEN-00042',
    coverageType: COVERAGE_TYPE.DENTAL,
    cardType: 'primary',
    issueDate: '2024-01-01',
    expirationDate: '2024-12-31',
    frontImageUrl: '/images/idcards/dental_front.png',
    backImageUrl: '/images/idcards/dental_back.png',
    front: {
      planName: 'HealthFirst Dental Plus',
      planType: 'DPPO',
      memberName: 'Jane Doe',
      memberId: 'HCP-2024-00042',
      groupNumber: 'GRP-98765',
      subscriberId: 'SUB-2024-00042',
      effectiveDate: '01/01/2024',
      pcpName: 'Dr. Lisa Chen, DDS',
      pcpPhone: '(555) 345-6789',
      networkName: 'HealthFirst Dental Network',
      copays: {
        primaryCare: '$0',
        specialist: '$25',
        urgentCare: '$50',
        emergencyRoom: '$150',
      },
    },
    back: {
      rxInfo: {
        rxBIN: '',
        rxPCN: '',
        rxGroup: '',
      },
      claimsAddress: 'HealthFirst Dental Claims, P.O. Box 12346, Springfield, IL 62704',
      claimsPhone: '1-800-555-0102',
      memberServicesPhone: '1-800-555-0199',
      nurseLinePhone: '1-800-555-0150',
      mentalHealthPhone: '',
      preAuthPhone: '1-800-555-0131',
      websiteUrl: 'https://member.healthcarepayer.com',
      providerDirectoryUrl: 'https://doctorfinder.healthcarepayer.com/dental',
      emergencyInstructions: 'For dental emergencies, contact your dentist or visit the nearest emergency dental clinic. Present this card for identification.',
    },
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    cardId: 'IDC-2024-00003',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-VIS-00042',
    coverageType: COVERAGE_TYPE.VISION,
    cardType: 'primary',
    issueDate: '2024-01-01',
    expirationDate: '2024-12-31',
    frontImageUrl: '/images/idcards/vision_front.png',
    backImageUrl: '/images/idcards/vision_back.png',
    front: {
      planName: 'HealthFirst Vision Care',
      planType: 'Vision',
      memberName: 'Jane Doe',
      memberId: 'HCP-2024-00042',
      groupNumber: 'GRP-98765',
      subscriberId: 'SUB-2024-00042',
      effectiveDate: '01/01/2024',
      pcpName: 'Dr. Michael Torres, OD',
      pcpPhone: '(555) 456-7890',
      networkName: 'HealthFirst Vision Network',
      copays: {
        primaryCare: '$10',
        specialist: '$10',
        urgentCare: 'N/A',
        emergencyRoom: 'N/A',
      },
    },
    back: {
      rxInfo: {
        rxBIN: '',
        rxPCN: '',
        rxGroup: '',
      },
      claimsAddress: 'HealthFirst Vision Claims, P.O. Box 12347, Springfield, IL 62704',
      claimsPhone: '1-800-555-0103',
      memberServicesPhone: '1-800-555-0199',
      nurseLinePhone: '',
      mentalHealthPhone: '',
      preAuthPhone: '',
      websiteUrl: 'https://member.healthcarepayer.com',
      providerDirectoryUrl: 'https://doctorfinder.healthcarepayer.com/vision',
      emergencyInstructions: 'For eye emergencies, contact your eye care provider or visit the nearest emergency room. Present this card for identification.',
    },
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    cardId: 'IDC-2024-00004',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-RX-00042',
    coverageType: COVERAGE_TYPE.PHARMACY,
    cardType: 'primary',
    issueDate: '2024-01-01',
    expirationDate: '2024-12-31',
    frontImageUrl: '/images/idcards/pharmacy_front.png',
    backImageUrl: '/images/idcards/pharmacy_back.png',
    front: {
      planName: 'HealthFirst Rx Benefits',
      planType: 'Pharmacy',
      memberName: 'Jane Doe',
      memberId: 'HCP-2024-00042',
      groupNumber: 'GRP-98765',
      subscriberId: 'SUB-2024-00042',
      effectiveDate: '01/01/2024',
      pcpName: '',
      pcpPhone: '',
      networkName: 'HealthFirst Pharmacy Network',
      copays: {
        primaryCare: 'N/A',
        specialist: 'N/A',
        urgentCare: 'N/A',
        emergencyRoom: 'N/A',
      },
    },
    back: {
      rxInfo: {
        rxBIN: '610014',
        rxPCN: 'HFPPO',
        rxGroup: 'RX98765',
      },
      claimsAddress: 'HealthFirst Pharmacy Claims, P.O. Box 12348, Springfield, IL 62704',
      claimsPhone: '1-800-555-0104',
      memberServicesPhone: '1-800-555-0199',
      nurseLinePhone: '',
      mentalHealthPhone: '',
      preAuthPhone: '1-800-555-0132',
      websiteUrl: 'https://member.healthcarepayer.com',
      providerDirectoryUrl: 'https://doctorfinder.healthcarepayer.com/pharmacy',
      emergencyInstructions: 'Present this card at any participating pharmacy. For mail-order prescriptions, call member services or visit the member portal.',
    },
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    cardId: 'IDC-2024-00005',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-BH-00042',
    coverageType: COVERAGE_TYPE.BEHAVIORAL_HEALTH,
    cardType: 'primary',
    issueDate: '2024-01-01',
    expirationDate: '2024-12-31',
    frontImageUrl: '/images/idcards/behavioral_front.png',
    backImageUrl: '/images/idcards/behavioral_back.png',
    front: {
      planName: 'HealthFirst Behavioral Health',
      planType: 'BH',
      memberName: 'Jane Doe',
      memberId: 'HCP-2024-00042',
      groupNumber: 'GRP-98765',
      subscriberId: 'SUB-2024-00042',
      effectiveDate: '01/01/2024',
      pcpName: 'Dr. Sarah Kim, PhD',
      pcpPhone: '(555) 567-8901',
      networkName: 'HealthFirst Behavioral Health Network',
      copays: {
        primaryCare: '$25',
        specialist: '$25',
        urgentCare: '$75',
        emergencyRoom: '$250',
      },
    },
    back: {
      rxInfo: {
        rxBIN: '610014',
        rxPCN: 'HFPPO',
        rxGroup: 'RX98765',
      },
      claimsAddress: 'HealthFirst BH Claims, P.O. Box 12349, Springfield, IL 62704',
      claimsPhone: '1-800-555-0105',
      memberServicesPhone: '1-800-555-0199',
      nurseLinePhone: '1-800-555-0150',
      mentalHealthPhone: '1-800-555-0175',
      preAuthPhone: '1-800-555-0133',
      websiteUrl: 'https://member.healthcarepayer.com',
      providerDirectoryUrl: 'https://doctorfinder.healthcarepayer.com/behavioral-health',
      emergencyInstructions: 'If you or someone you know is in crisis, call 988 (Suicide & Crisis Lifeline) or go to the nearest emergency room. Pre-authorization is not required for emergency behavioral health services.',
    },
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    cardId: 'IDC-2023-00001',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-MED-00042-2023',
    coverageType: COVERAGE_TYPE.MEDICAL,
    cardType: 'primary',
    issueDate: '2023-01-01',
    expirationDate: '2023-12-31',
    frontImageUrl: '/images/idcards/medical_front_2023.png',
    backImageUrl: '/images/idcards/medical_back_2023.png',
    front: {
      planName: 'HealthFirst PPO 3000',
      planType: 'PPO',
      memberName: 'Jane Doe',
      memberId: 'HCP-2024-00042',
      groupNumber: 'GRP-98765',
      subscriberId: 'SUB-2023-00042',
      effectiveDate: '01/01/2023',
      pcpName: 'Dr. Robert Smith, MD',
      pcpPhone: '(555) 234-5678',
      networkName: 'HealthFirst National PPO Network',
      copays: {
        primaryCare: '$20',
        specialist: '$40',
        urgentCare: '$60',
        emergencyRoom: '$200',
      },
    },
    back: {
      rxInfo: {
        rxBIN: '610014',
        rxPCN: 'HFPPO',
        rxGroup: 'RX98765',
      },
      claimsAddress: 'HealthFirst Claims, P.O. Box 12345, Springfield, IL 62704',
      claimsPhone: '1-800-555-0101',
      memberServicesPhone: '1-800-555-0199',
      nurseLinePhone: '1-800-555-0150',
      mentalHealthPhone: '1-800-555-0175',
      preAuthPhone: '1-800-555-0130',
      websiteUrl: 'https://member.healthcarepayer.com',
      providerDirectoryUrl: 'https://doctorfinder.healthcarepayer.com',
      emergencyInstructions: 'In case of emergency, call 911 or go to the nearest emergency room. Present this card upon arrival. Pre-authorization is not required for emergency services.',
    },
    status: 'expired',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-12-31T23:59:59Z',
  },
];

/**
 * Returns all ID cards for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of ID card objects for the member
 */
export const getIDCardsByMemberId = (memberId) => {
  return idCardsData.filter((card) => card.memberId === memberId);
};

/**
 * Returns all active ID cards for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of active ID card objects for the member
 */
export const getActiveIDCardsByMemberId = (memberId) => {
  return idCardsData.filter((card) => card.memberId === memberId && card.status === 'active');
};

/**
 * Returns a single ID card by its card ID.
 * @param {string} cardId - The card identifier
 * @returns {Object|undefined} The ID card object or undefined if not found
 */
export const getIDCardById = (cardId) => {
  return idCardsData.find((card) => card.cardId === cardId);
};

/**
 * Returns ID cards filtered by coverage type for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} coverageType - The coverage type to filter by (MEDICAL, DENTAL, VISION, PHARMACY, BEHAVIORAL_HEALTH)
 * @returns {Object[]} Array of ID card objects matching the coverage type
 */
export const getIDCardsByCoverageType = (memberId, coverageType) => {
  return idCardsData.filter(
    (card) => card.memberId === memberId && card.coverageType === coverageType
  );
};

/**
 * Returns ID cards filtered by coverage ID.
 * @param {string} coverageId - The coverage identifier
 * @returns {Object[]} Array of ID card objects matching the coverage ID
 */
export const getIDCardsByCoverageId = (coverageId) => {
  return idCardsData.filter((card) => card.coverageId === coverageId);
};

/**
 * Filters ID cards by multiple criteria.
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.memberId] - Member ID to filter by
 * @param {string} [filters.coverageType] - Coverage type to filter by
 * @param {string} [filters.status] - Card status to filter by ('active', 'expired', 'requested')
 * @param {string} [filters.cardType] - Card type to filter by ('primary', 'dependent')
 * @param {string} [filters.sortBy] - Sort field ('issueDate', 'expirationDate', 'coverageType')
 * @param {string} [filters.sortOrder] - Sort order ('asc' or 'desc')
 * @returns {Object[]} Filtered and sorted array of ID card objects
 */
export const filterIDCards = (filters = {}) => {
  let results = [...idCardsData];

  if (filters.memberId) {
    results = results.filter((card) => card.memberId === filters.memberId);
  }

  if (filters.coverageType) {
    results = results.filter((card) => card.coverageType === filters.coverageType);
  }

  if (filters.status) {
    results = results.filter((card) => card.status === filters.status);
  }

  if (filters.cardType) {
    results = results.filter((card) => card.cardType === filters.cardType);
  }

  const sortBy = filters.sortBy || 'issueDate';
  const sortOrder = filters.sortOrder || 'desc';

  results.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (valA > valB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return results;
};

/**
 * Returns a summary of ID cards for a given member.
 * @param {string} memberId - The member identifier
 * @returns {Object} Summary object with totalCards, activeCards, expiredCards, and coverageTypeCounts
 */
export const getIDCardsSummary = (memberId) => {
  const memberCards = getIDCardsByMemberId(memberId);

  const coverageTypeCounts = {};
  Object.values(COVERAGE_TYPE).forEach((type) => {
    coverageTypeCounts[type] = 0;
  });

  let activeCards = 0;
  let expiredCards = 0;
  let requestedCards = 0;

  memberCards.forEach((card) => {
    if (card.status === 'active') {
      activeCards += 1;
    } else if (card.status === 'expired') {
      expiredCards += 1;
    } else if (card.status === 'requested') {
      requestedCards += 1;
    }

    if (coverageTypeCounts[card.coverageType] !== undefined) {
      coverageTypeCounts[card.coverageType] += 1;
    }
  });

  return {
    totalCards: memberCards.length,
    activeCards,
    expiredCards,
    requestedCards,
    coverageTypeCounts,
  };
};