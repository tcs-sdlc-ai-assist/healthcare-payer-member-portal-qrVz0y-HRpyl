/**
 * Privacy masking utility for Glassbox integration.
 * Provides functions to mask PHI/PII data including member IDs, names,
 * claim numbers, group numbers, financial amounts, and card/document previews.
 * Implements MaskingContext pattern for consistent privacy protection across the portal.
 *
 * @module maskingUtils
 */

import { APP_CONFIG } from '../constants/constants.js';

/**
 * Default masking character used to replace sensitive data.
 * @type {string}
 */
const MASK_CHAR = '•';

/**
 * Default number of characters to leave visible at the end of a masked string.
 * @type {number}
 */
const DEFAULT_VISIBLE_TAIL = 4;

/**
 * Masking rule definitions for different PHI/PII data types.
 * Each rule specifies the data type, masking strategy, and configuration.
 *
 * @typedef {Object} MaskingRule
 * @property {string} type - The data type identifier
 * @property {string} strategy - The masking strategy ('partial', 'full', 'format_preserving', 'redact')
 * @property {number} [visibleTail] - Number of trailing characters to leave visible (for 'partial' strategy)
 * @property {number} [visibleHead] - Number of leading characters to leave visible (for 'partial' strategy)
 * @property {string} [replacement] - Replacement string (for 'redact' strategy)
 * @property {string} description - Human-readable description of the masking rule
 */

/**
 * Returns the complete set of masking rules for all PHI/PII data types.
 * These rules define how each type of sensitive data should be masked
 * when captured by Glassbox analytics or written to audit logs.
 *
 * @returns {Object.<string, MaskingRule>} Object mapping data type keys to masking rule definitions
 */
export const getMaskingRules = () => {
  return {
    memberId: {
      type: 'memberId',
      strategy: 'partial',
      visibleTail: 4,
      visibleHead: 0,
      description: 'Masks member ID, showing only the last 4 characters.',
    },
    memberName: {
      type: 'memberName',
      strategy: 'partial',
      visibleHead: 1,
      visibleTail: 0,
      description: 'Masks member name, showing only the first initial of each name part.',
    },
    claimNumber: {
      type: 'claimNumber',
      strategy: 'partial',
      visibleTail: 4,
      visibleHead: 3,
      description: 'Masks claim number, showing prefix and last 4 characters.',
    },
    claimId: {
      type: 'claimId',
      strategy: 'partial',
      visibleTail: 4,
      visibleHead: 4,
      description: 'Masks claim ID, showing prefix and last 4 characters.',
    },
    groupNumber: {
      type: 'groupNumber',
      strategy: 'partial',
      visibleTail: 3,
      visibleHead: 4,
      description: 'Masks group number, showing prefix and last 3 characters.',
    },
    subscriberId: {
      type: 'subscriberId',
      strategy: 'partial',
      visibleTail: 4,
      visibleHead: 0,
      description: 'Masks subscriber ID, showing only the last 4 characters.',
    },
    dateOfBirth: {
      type: 'dateOfBirth',
      strategy: 'format_preserving',
      description: 'Masks date of birth, preserving format but replacing digits.',
    },
    email: {
      type: 'email',
      strategy: 'partial',
      visibleHead: 2,
      visibleTail: 0,
      description: 'Masks email address, showing only the first 2 characters and domain.',
    },
    phone: {
      type: 'phone',
      strategy: 'partial',
      visibleTail: 4,
      visibleHead: 0,
      description: 'Masks phone number, showing only the last 4 digits.',
    },
    financialAmount: {
      type: 'financialAmount',
      strategy: 'redact',
      replacement: '$•••.••',
      description: 'Fully redacts financial amounts.',
    },
    address: {
      type: 'address',
      strategy: 'redact',
      replacement: '[Address Redacted]',
      description: 'Fully redacts street address.',
    },
    providerNPI: {
      type: 'providerNPI',
      strategy: 'partial',
      visibleTail: 4,
      visibleHead: 0,
      description: 'Masks provider NPI, showing only the last 4 digits.',
    },
    rxNumber: {
      type: 'rxNumber',
      strategy: 'partial',
      visibleTail: 3,
      visibleHead: 2,
      description: 'Masks prescription number, showing prefix and last 3 characters.',
    },
    ndcCode: {
      type: 'ndcCode',
      strategy: 'partial',
      visibleTail: 3,
      visibleHead: 0,
      description: 'Masks NDC code, showing only the last 3 characters.',
    },
    diagnosisCode: {
      type: 'diagnosisCode',
      strategy: 'full',
      description: 'Fully masks diagnosis codes.',
    },
    documentId: {
      type: 'documentId',
      strategy: 'partial',
      visibleTail: 4,
      visibleHead: 4,
      description: 'Masks document ID, showing prefix and last 4 characters.',
    },
    cardId: {
      type: 'cardId',
      strategy: 'partial',
      visibleTail: 4,
      visibleHead: 4,
      description: 'Masks card ID, showing prefix and last 4 characters.',
    },
  };
};

/**
 * Masks a string using the partial strategy, revealing only specified
 * leading and/or trailing characters.
 *
 * @param {string} value - The string to mask
 * @param {number} [visibleHead=0] - Number of leading characters to leave visible
 * @param {number} [visibleTail=4] - Number of trailing characters to leave visible
 * @returns {string} The masked string
 */
export const maskPartial = (value, visibleHead = 0, visibleTail = DEFAULT_VISIBLE_TAIL) => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return '';
  }

  const totalVisible = visibleHead + visibleTail;

  if (trimmed.length <= totalVisible) {
    return MASK_CHAR.repeat(trimmed.length);
  }

  const head = visibleHead > 0 ? trimmed.slice(0, visibleHead) : '';
  const tail = visibleTail > 0 ? trimmed.slice(-visibleTail) : '';
  const maskedLength = trimmed.length - totalVisible;

  return head + MASK_CHAR.repeat(maskedLength) + tail;
};

/**
 * Fully masks a string, replacing all characters with the mask character.
 *
 * @param {string} value - The string to mask
 * @returns {string} The fully masked string
 */
export const maskFull = (value) => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return '';
  }

  return MASK_CHAR.repeat(trimmed.length);
};

/**
 * Masks a string by replacing it entirely with a specified replacement string.
 *
 * @param {string} value - The string to redact
 * @param {string} [replacement='[Redacted]'] - The replacement string
 * @returns {string} The replacement string, or empty string if value is empty
 */
export const maskRedact = (value, replacement = '[Redacted]') => {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return '';
  }

  return replacement;
};

/**
 * Masks a member ID, showing only the last 4 characters.
 * Example: "HCP-2024-00042" → "••••••••••0042"
 *
 * @param {string|null|undefined} memberId - The member ID to mask
 * @returns {string} The masked member ID
 */
export const maskMemberId = (memberId) => {
  if (!memberId || typeof memberId !== 'string') {
    return '';
  }

  return maskPartial(memberId, 0, 4);
};

/**
 * Masks a member name, showing only the first initial of each name part.
 * Example: "Jane Doe" → "J••• D••"
 *
 * @param {string|null|undefined} name - The full name to mask
 * @returns {string} The masked name
 */
export const maskMemberName = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return '';
  }

  const parts = trimmed.split(/\s+/);

  return parts
    .map((part) => {
      if (part.length <= 1) {
        return part;
      }
      return part.charAt(0) + MASK_CHAR.repeat(part.length - 1);
    })
    .join(' ');
};

/**
 * Masks a claim number, showing the prefix and last 4 characters.
 * Example: "CLM123456" → "CLM••••3456"
 *
 * @param {string|null|undefined} claimNumber - The claim number to mask
 * @returns {string} The masked claim number
 */
export const maskClaimNumber = (claimNumber) => {
  if (!claimNumber || typeof claimNumber !== 'string') {
    return '';
  }

  return maskPartial(claimNumber, 3, 4);
};

/**
 * Masks a claim ID, showing the prefix and last 4 characters.
 * Example: "CLM-2024-00001" → "CLM-••••••0001"
 *
 * @param {string|null|undefined} claimId - The claim ID to mask
 * @returns {string} The masked claim ID
 */
export const maskClaimId = (claimId) => {
  if (!claimId || typeof claimId !== 'string') {
    return '';
  }

  return maskPartial(claimId, 4, 4);
};

/**
 * Masks a group number, showing the prefix and last 3 characters.
 * Example: "GRP-98765" → "GRP-••765"
 *
 * @param {string|null|undefined} groupNumber - The group number to mask
 * @returns {string} The masked group number
 */
export const maskGroupNumber = (groupNumber) => {
  if (!groupNumber || typeof groupNumber !== 'string') {
    return '';
  }

  return maskPartial(groupNumber, 4, 3);
};

/**
 * Masks a subscriber ID, showing only the last 4 characters.
 * Example: "SUB-2024-00042" → "••••••••••0042"
 *
 * @param {string|null|undefined} subscriberId - The subscriber ID to mask
 * @returns {string} The masked subscriber ID
 */
export const maskSubscriberId = (subscriberId) => {
  if (!subscriberId || typeof subscriberId !== 'string') {
    return '';
  }

  return maskPartial(subscriberId, 0, 4);
};

/**
 * Masks a date of birth, preserving the format but replacing month and day digits.
 * Example: "1985-03-15" → "••••-••-••"
 * Example: "03/15/1985" → "••/••/••••"
 *
 * @param {string|null|undefined} dateOfBirth - The date of birth to mask
 * @returns {string} The masked date of birth with format preserved
 */
export const maskDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth || typeof dateOfBirth !== 'string') {
    return '';
  }

  const trimmed = dateOfBirth.trim();

  if (trimmed.length === 0) {
    return '';
  }

  return trimmed.replace(/[0-9]/g, MASK_CHAR);
};

/**
 * Masks an email address, showing only the first 2 characters and the domain.
 * Example: "jane.doe@example.com" → "ja••••••@example.com"
 *
 * @param {string|null|undefined} email - The email address to mask
 * @returns {string} The masked email address
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return '';
  }

  const atIndex = trimmed.indexOf('@');

  if (atIndex < 0) {
    return maskPartial(trimmed, 2, 0);
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex);

  if (localPart.length <= 2) {
    return localPart + domainPart;
  }

  const visibleLocal = localPart.slice(0, 2);
  const maskedLocal = MASK_CHAR.repeat(localPart.length - 2);

  return visibleLocal + maskedLocal + domainPart;
};

/**
 * Masks a phone number, showing only the last 4 digits.
 * Example: "(555) 123-4567" → "(•••) •••-4567"
 * Example: "1-800-555-0199" → "•-•••-•••-0199"
 *
 * @param {string|null|undefined} phone - The phone number to mask
 * @returns {string} The masked phone number with format preserved
 */
export const maskPhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  const trimmed = phone.trim();

  if (trimmed.length === 0) {
    return '';
  }

  const digits = trimmed.replace(/\D/g, '');

  if (digits.length < 4) {
    return MASK_CHAR.repeat(trimmed.length);
  }

  const lastFour = digits.slice(-4);
  let digitIndex = digits.length - 1;
  let lastFourIndex = 3;
  const chars = trimmed.split('');

  for (let i = chars.length - 1; i >= 0; i--) {
    if (/\d/.test(chars[i])) {
      if (digits[digitIndex] === lastFour[lastFourIndex] && lastFourIndex >= 0 && digitIndex >= digits.length - 4) {
        lastFourIndex--;
      } else {
        chars[i] = MASK_CHAR;
      }
      digitIndex--;
    }
  }

  return chars.join('');
};

/**
 * Masks a financial amount, replacing it with a redacted placeholder.
 * Example: "$1,234.56" → "$•••.••"
 * Example: 1234.56 → "$•••.••"
 *
 * @param {number|string|null|undefined} amount - The financial amount to mask
 * @returns {string} The masked financial amount
 */
export const maskFinancialAmount = (amount) => {
  if (amount === null || amount === undefined) {
    return '';
  }

  const strAmount = String(amount).trim();

  if (strAmount.length === 0) {
    return '';
  }

  return '$' + MASK_CHAR.repeat(3) + '.' + MASK_CHAR.repeat(2);
};

/**
 * Masks a street address, replacing it with a redacted placeholder.
 * Example: "123 Maple Street" → "[Address Redacted]"
 *
 * @param {string|null|undefined} address - The street address to mask
 * @returns {string} The masked address
 */
export const maskAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return '';
  }

  const trimmed = address.trim();

  if (trimmed.length === 0) {
    return '';
  }

  return '[Address Redacted]';
};

/**
 * Masks a full address object, redacting the street but preserving city, state, and zip.
 * Example: { street: "123 Maple St", city: "Springfield", state: "IL", zipCode: "62704" }
 *   → { street: "[Address Redacted]", city: "Springfield", state: "IL", zipCode: "62704" }
 *
 * @param {Object|null|undefined} addressObj - The address object to mask
 * @param {string} [addressObj.street] - Street address
 * @param {string} [addressObj.city] - City
 * @param {string} [addressObj.state] - State abbreviation
 * @param {string} [addressObj.zipCode] - ZIP code
 * @returns {Object} The masked address object
 */
export const maskAddressObject = (addressObj) => {
  if (!addressObj || typeof addressObj !== 'object') {
    return {};
  }

  return {
    ...addressObj,
    street: addressObj.street ? '[Address Redacted]' : '',
  };
};

/**
 * Masks a provider NPI number, showing only the last 4 digits.
 * Example: "1234567890" → "••••••7890"
 *
 * @param {string|null|undefined} npi - The NPI number to mask
 * @returns {string} The masked NPI number
 */
export const maskProviderNPI = (npi) => {
  if (!npi || typeof npi !== 'string') {
    return '';
  }

  return maskPartial(npi, 0, 4);
};

/**
 * Masks a prescription number, showing prefix and last 3 characters.
 * Example: "RX7845123" → "RX•••••123"
 *
 * @param {string|null|undefined} rxNumber - The prescription number to mask
 * @returns {string} The masked prescription number
 */
export const maskRxNumber = (rxNumber) => {
  if (!rxNumber || typeof rxNumber !== 'string') {
    return '';
  }

  return maskPartial(rxNumber, 2, 3);
};

/**
 * Masks an NDC code, showing only the last 3 characters.
 * Example: "00002-4462-30" → "••••••••••-30"
 *
 * @param {string|null|undefined} ndcCode - The NDC code to mask
 * @returns {string} The masked NDC code
 */
export const maskNdcCode = (ndcCode) => {
  if (!ndcCode || typeof ndcCode !== 'string') {
    return '';
  }

  return maskPartial(ndcCode, 0, 3);
};

/**
 * Masks a diagnosis code, fully replacing all characters.
 * Example: "J06.9" → "•••••"
 *
 * @param {string|null|undefined} diagnosisCode - The diagnosis code to mask
 * @returns {string} The fully masked diagnosis code
 */
export const maskDiagnosisCode = (diagnosisCode) => {
  if (!diagnosisCode || typeof diagnosisCode !== 'string') {
    return '';
  }

  return maskFull(diagnosisCode);
};

/**
 * Masks a document ID, showing prefix and last 4 characters.
 * Example: "DOC-EOB-00001" → "DOC-•••••0001"
 *
 * @param {string|null|undefined} documentId - The document ID to mask
 * @returns {string} The masked document ID
 */
export const maskDocumentId = (documentId) => {
  if (!documentId || typeof documentId !== 'string') {
    return '';
  }

  return maskPartial(documentId, 4, 4);
};

/**
 * Masks a card ID, showing prefix and last 4 characters.
 * Example: "IDC-2024-00001" → "IDC-••••••0001"
 *
 * @param {string|null|undefined} cardId - The card ID to mask
 * @returns {string} The masked card ID
 */
export const maskCardId = (cardId) => {
  if (!cardId || typeof cardId !== 'string') {
    return '';
  }

  return maskPartial(cardId, 4, 4);
};

/**
 * Applies masking to a value based on the specified data type.
 * Uses the masking rules from getMaskingRules() to determine the appropriate
 * masking strategy for the given data type.
 *
 * @param {string} dataType - The data type key (e.g., 'memberId', 'memberName', 'email')
 * @param {*} value - The value to mask
 * @returns {string} The masked value
 */
export const applyMasking = (dataType, value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const rules = getMaskingRules();
  const rule = rules[dataType];

  if (!rule) {
    return maskFull(String(value));
  }

  switch (dataType) {
    case 'memberId':
      return maskMemberId(String(value));
    case 'memberName':
      return maskMemberName(String(value));
    case 'claimNumber':
      return maskClaimNumber(String(value));
    case 'claimId':
      return maskClaimId(String(value));
    case 'groupNumber':
      return maskGroupNumber(String(value));
    case 'subscriberId':
      return maskSubscriberId(String(value));
    case 'dateOfBirth':
      return maskDateOfBirth(String(value));
    case 'email':
      return maskEmail(String(value));
    case 'phone':
      return maskPhone(String(value));
    case 'financialAmount':
      return maskFinancialAmount(value);
    case 'address':
      return maskAddress(String(value));
    case 'providerNPI':
      return maskProviderNPI(String(value));
    case 'rxNumber':
      return maskRxNumber(String(value));
    case 'ndcCode':
      return maskNdcCode(String(value));
    case 'diagnosisCode':
      return maskDiagnosisCode(String(value));
    case 'documentId':
      return maskDocumentId(String(value));
    case 'cardId':
      return maskCardId(String(value));
    default:
      return maskFull(String(value));
  }
};

/**
 * Applies masking to multiple fields in an object based on a field-to-dataType mapping.
 * Returns a new object with masked values; does not mutate the original.
 *
 * @param {Object} data - The data object containing fields to mask
 * @param {Object.<string, string>} fieldMapping - Object mapping field names to data type keys
 *   Example: { memberId: 'memberId', patient: 'memberName', billedAmount: 'financialAmount' }
 * @returns {Object} A new object with masked values for the specified fields
 */
export const applyMaskingToObject = (data, fieldMapping) => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  if (!fieldMapping || typeof fieldMapping !== 'object') {
    return { ...data };
  }

  const masked = { ...data };

  Object.keys(fieldMapping).forEach((fieldName) => {
    if (Object.prototype.hasOwnProperty.call(masked, fieldName)) {
      const dataType = fieldMapping[fieldName];
      masked[fieldName] = applyMasking(dataType, masked[fieldName]);
    }
  });

  return masked;
};

/**
 * Returns the Glassbox data-masking attribute value for a given data type.
 * This attribute can be applied to DOM elements to instruct Glassbox
 * to mask the element's content during session recording.
 *
 * @param {string} dataType - The data type key (e.g., 'memberId', 'memberName')
 * @returns {Object} An object containing the data attribute for Glassbox masking
 *   Example: { 'data-glassbox-mask': 'true', 'data-glassbox-mask-type': 'memberId' }
 */
export const getGlassboxMaskingAttributes = (dataType) => {
  if (!dataType || typeof dataType !== 'string') {
    return {};
  }

  if (!APP_CONFIG.glassboxEnabled) {
    return {};
  }

  return {
    'data-glassbox-mask': 'true',
    'data-glassbox-mask-type': dataType,
  };
};

/**
 * Returns a standard field mapping for claim objects, mapping claim fields
 * to their corresponding masking data types.
 *
 * @returns {Object.<string, string>} Field-to-dataType mapping for claim objects
 */
export const getClaimMaskingFieldMap = () => {
  return {
    claimId: 'claimId',
    claimNumber: 'claimNumber',
    memberId: 'memberId',
    patient: 'memberName',
    providerNPI: 'providerNPI',
    billedAmount: 'financialAmount',
    allowedAmount: 'financialAmount',
    paidAmount: 'financialAmount',
    memberOwes: 'financialAmount',
    diagnosisCode: 'diagnosisCode',
  };
};

/**
 * Returns a standard field mapping for member profile objects, mapping profile fields
 * to their corresponding masking data types.
 *
 * @returns {Object.<string, string>} Field-to-dataType mapping for member profile objects
 */
export const getMemberProfileMaskingFieldMap = () => {
  return {
    memberId: 'memberId',
    email: 'email',
    phone: 'phone',
    dateOfBirth: 'dateOfBirth',
  };
};

/**
 * Returns a standard field mapping for ID card front objects, mapping card fields
 * to their corresponding masking data types.
 *
 * @returns {Object.<string, string>} Field-to-dataType mapping for ID card front objects
 */
export const getIDCardMaskingFieldMap = () => {
  return {
    memberId: 'memberId',
    groupNumber: 'groupNumber',
    subscriberId: 'subscriberId',
  };
};

/**
 * Returns a standard field mapping for prescription objects, mapping prescription fields
 * to their corresponding masking data types.
 *
 * @returns {Object.<string, string>} Field-to-dataType mapping for prescription objects
 */
export const getPrescriptionMaskingFieldMap = () => {
  return {
    memberId: 'memberId',
    rxNumber: 'rxNumber',
    ndcCode: 'ndcCode',
    planPaidAmount: 'financialAmount',
    memberPaidAmount: 'financialAmount',
  };
};

/**
 * Masks sensitive fields in a claim object for audit logging or Glassbox capture.
 * Returns a new object with masked values; does not mutate the original.
 *
 * @param {Object} claim - The claim data object
 * @returns {Object} A new claim object with sensitive fields masked
 */
export const maskClaimForAudit = (claim) => {
  if (!claim || typeof claim !== 'object') {
    return {};
  }

  return applyMaskingToObject(claim, getClaimMaskingFieldMap());
};

/**
 * Masks sensitive fields in a member profile object for audit logging or Glassbox capture.
 * Returns a new object with masked values; does not mutate the original.
 *
 * @param {Object} profile - The member profile data object
 * @returns {Object} A new profile object with sensitive fields masked
 */
export const maskMemberProfileForAudit = (profile) => {
  if (!profile || typeof profile !== 'object') {
    return {};
  }

  const masked = applyMaskingToObject(profile, getMemberProfileMaskingFieldMap());

  if (masked.firstName) {
    masked.firstName = maskMemberName(masked.firstName);
  }

  if (masked.lastName) {
    masked.lastName = maskMemberName(masked.lastName);
  }

  if (masked.displayName) {
    masked.displayName = maskMemberName(masked.displayName);
  }

  if (masked.address && typeof masked.address === 'object') {
    masked.address = maskAddressObject(masked.address);
  }

  return masked;
};

/**
 * Checks whether Glassbox masking is currently enabled based on application configuration.
 *
 * @returns {boolean} True if Glassbox masking is enabled
 */
export const isGlassboxMaskingEnabled = () => {
  return APP_CONFIG.glassboxEnabled === true;
};