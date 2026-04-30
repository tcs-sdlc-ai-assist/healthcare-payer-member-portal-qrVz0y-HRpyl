/**
 * Benefits business logic service for the Healthcare Member Portal.
 * Provides getBenefits (with filtering), getBenefitDetails, getBenefitsSummaryForMember,
 * and coverage category/deductible/OOP progress functions.
 * Consumes benefitsData fixture and integrates with auditLogger for benefits views.
 *
 * @module benefitsService
 */

import {
  benefitsData,
  getBenefitsByMemberId,
  getActiveBenefitsByMemberId,
  getBenefitById,
  getBenefitsByCoverageType,
  getBenefitByCoverageId,
  filterBenefits,
  getBenefitsSummary,
} from '../data/benefitsData.js';
import { logEvent, AUDIT_ACTIONS } from '../services/auditLogger.js';
import {
  COVERAGE_TYPE,
  COVERAGE_TYPE_LABELS,
} from '../constants/constants.js';
import {
  formatCurrency,
  formatDate,
  formatPercentage,
  formatProgressPercentage,
  formatPlanStatus,
  formatCoverageType,
} from '../utils/formatters.js';

/**
 * Enriches a benefit object with computed display properties.
 *
 * @param {Object} benefit - The raw benefit data object
 * @returns {Object} Enriched benefit object with additional display properties
 */
const enrichBenefit = (benefit) => {
  if (!benefit) {
    return null;
  }

  const deductible = benefit.deductible || {};
  const outOfPocket = benefit.outOfPocket || {};

  const individualDeductible = deductible.individual || { used: 0, max: 0, remaining: 0 };
  const familyDeductible = deductible.family || { used: 0, max: 0, remaining: 0 };
  const individualOOP = outOfPocket.individual || { used: 0, max: 0, remaining: 0 };
  const familyOOP = outOfPocket.family || { used: 0, max: 0, remaining: 0 };

  return {
    ...benefit,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[benefit.coverageType] || benefit.coverageType,
    formattedEffectiveDate: formatDate(benefit.effectiveDate),
    formattedTerminationDate: formatDate(benefit.terminationDate),
    formattedPlanStatus: formatPlanStatus(benefit.planStatus),
    isActive: benefit.planStatus === 'active',
    deductibleProgress: {
      individual: {
        ...individualDeductible,
        formattedUsed: formatCurrency(individualDeductible.used),
        formattedMax: formatCurrency(individualDeductible.max),
        formattedRemaining: formatCurrency(individualDeductible.remaining),
        percentage: individualDeductible.max > 0
          ? Math.min((individualDeductible.used / individualDeductible.max) * 100, 100)
          : 0,
        formattedPercentage: formatProgressPercentage(individualDeductible.used, individualDeductible.max),
      },
      family: {
        ...familyDeductible,
        formattedUsed: formatCurrency(familyDeductible.used),
        formattedMax: formatCurrency(familyDeductible.max),
        formattedRemaining: formatCurrency(familyDeductible.remaining),
        percentage: familyDeductible.max > 0
          ? Math.min((familyDeductible.used / familyDeductible.max) * 100, 100)
          : 0,
        formattedPercentage: formatProgressPercentage(familyDeductible.used, familyDeductible.max),
      },
    },
    outOfPocketProgress: {
      individual: {
        ...individualOOP,
        formattedUsed: formatCurrency(individualOOP.used),
        formattedMax: formatCurrency(individualOOP.max),
        formattedRemaining: formatCurrency(individualOOP.remaining),
        percentage: individualOOP.max > 0
          ? Math.min((individualOOP.used / individualOOP.max) * 100, 100)
          : 0,
        formattedPercentage: formatProgressPercentage(individualOOP.used, individualOOP.max),
      },
      family: {
        ...familyOOP,
        formattedUsed: formatCurrency(familyOOP.used),
        formattedMax: formatCurrency(familyOOP.max),
        formattedRemaining: formatCurrency(familyOOP.remaining),
        percentage: familyOOP.max > 0
          ? Math.min((familyOOP.used / familyOOP.max) * 100, 100)
          : 0,
        formattedPercentage: formatProgressPercentage(familyOOP.used, familyOOP.max),
      },
    },
    hasCoverageCategories: Array.isArray(benefit.coverageCategories) && benefit.coverageCategories.length > 0,
    hasPharmacyTiers: Array.isArray(benefit.pharmacyTiers) && benefit.pharmacyTiers.length > 0,
  };
};

/**
 * Retrieves a filtered and sorted list of benefits for a member.
 *
 * @param {Object} params - Query parameters
 * @param {string} params.memberId - The member identifier (required)
 * @param {string} [params.coverageType] - Coverage type filter (MEDICAL, DENTAL, VISION, etc.)
 * @param {string} [params.planStatus] - Plan status filter ('active', 'terminated', 'pending')
 * @param {string} [params.planType] - Plan type filter (e.g., 'PPO', 'HMO', 'DPPO')
 * @param {string} [params.sortBy] - Sort field ('effectiveDate', 'coverageType', 'planName')
 * @param {string} [params.sortOrder] - Sort order ('asc' or 'desc')
 * @param {boolean} [params.activeOnly=false] - Whether to return only active benefits
 * @returns {Object} Object with benefits array, summary, and error
 */
export const getBenefits = (params = {}) => {
  if (!params.memberId) {
    return {
      benefits: [],
      summary: null,
      error: 'memberId is required.',
    };
  }

  if (params.activeOnly) {
    const activeBenefits = getActiveBenefitsByMemberId(params.memberId);

    const enrichedBenefits = activeBenefits.map((benefit) => enrichBenefit(benefit));

    const summary = getBenefitsSummary(params.memberId);

    return {
      benefits: enrichedBenefits,
      summary,
      error: null,
    };
  }

  const filters = {
    memberId: params.memberId,
  };

  if (params.coverageType) {
    filters.coverageType = params.coverageType;
  }

  if (params.planStatus) {
    filters.planStatus = params.planStatus;
  }

  if (params.planType) {
    filters.planType = params.planType;
  }

  if (params.sortBy) {
    filters.sortBy = params.sortBy;
  }

  if (params.sortOrder) {
    filters.sortOrder = params.sortOrder;
  }

  const filteredBenefits = filterBenefits(filters);

  const enrichedBenefits = filteredBenefits.map((benefit) => enrichBenefit(benefit));

  const summary = getBenefitsSummary(params.memberId);

  return {
    benefits: enrichedBenefits,
    summary,
    error: null,
  };
};

/**
 * Retrieves detailed information for a single benefit.
 * Optionally logs a benefits view audit event.
 *
 * @param {string} benefitId - The benefit identifier
 * @param {Object} [options] - Options
 * @param {string} [options.memberId] - Member ID for audit logging
 * @param {boolean} [options.logView=false] - Whether to log a benefits view audit event
 * @returns {Object|null} Enriched benefit details object or null if not found
 */
export const getBenefitDetails = (benefitId, options = {}) => {
  if (!benefitId) {
    return null;
  }

  const benefit = getBenefitById(benefitId);

  if (!benefit) {
    return null;
  }

  if (options.logView && options.memberId) {
    logEvent({
      memberId: options.memberId,
      action: AUDIT_ACTIONS.BENEFITS_VIEW,
      targetId: benefitId,
      metadata: {
        benefitId,
        coverageType: benefit.coverageType,
        planName: benefit.planName,
      },
    });
  }

  return enrichBenefit(benefit);
};

/**
 * Retrieves benefit details by coverage ID.
 *
 * @param {string} coverageId - The coverage identifier
 * @param {Object} [options] - Options (same as getBenefitDetails)
 * @returns {Object|null} Enriched benefit details object or null if not found
 */
export const getBenefitDetailsByCoverageId = (coverageId, options = {}) => {
  if (!coverageId) {
    return null;
  }

  const benefit = getBenefitByCoverageId(coverageId);

  if (!benefit) {
    return null;
  }

  return getBenefitDetails(benefit.benefitId, options);
};

/**
 * Retrieves benefits filtered by coverage type for a given member.
 *
 * @param {string} memberId - The member identifier
 * @param {string} coverageType - The coverage type to filter by
 * @returns {Object[]} Array of enriched benefit objects
 */
export const getBenefitsByCoverage = (memberId, coverageType) => {
  if (!memberId || !coverageType) {
    return [];
  }

  const benefits = getBenefitsByCoverageType(memberId, coverageType);

  return benefits.map((benefit) => enrichBenefit(benefit));
};

/**
 * Returns a summary of benefits for a given member.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object|null} Benefits summary object or null if memberId is not provided
 */
export const getBenefitsSummaryForMember = (memberId) => {
  if (!memberId) {
    return null;
  }

  const summary = getBenefitsSummary(memberId);

  return {
    ...summary,
    formattedTotalDeductibleUsed: formatCurrency(summary.totalDeductibleUsed),
    formattedTotalDeductibleMax: formatCurrency(summary.totalDeductibleMax),
    formattedTotalOOPUsed: formatCurrency(summary.totalOOPUsed),
    formattedTotalOOPMax: formatCurrency(summary.totalOOPMax),
    deductiblePercentage: summary.totalDeductibleMax > 0
      ? Math.min((summary.totalDeductibleUsed / summary.totalDeductibleMax) * 100, 100)
      : 0,
    formattedDeductiblePercentage: formatProgressPercentage(summary.totalDeductibleUsed, summary.totalDeductibleMax),
    oopPercentage: summary.totalOOPMax > 0
      ? Math.min((summary.totalOOPUsed / summary.totalOOPMax) * 100, 100)
      : 0,
    formattedOOPPercentage: formatProgressPercentage(summary.totalOOPUsed, summary.totalOOPMax),
  };
};

/**
 * Returns deductible progress for all active benefits for a given member.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of deductible progress objects per coverage type
 */
export const getDeductibleProgress = (memberId) => {
  if (!memberId) {
    return [];
  }

  const activeBenefits = getActiveBenefitsByMemberId(memberId);

  return activeBenefits.map((benefit) => {
    const individualDeductible = benefit.deductible?.individual || { used: 0, max: 0, remaining: 0 };
    const familyDeductible = benefit.deductible?.family || { used: 0, max: 0, remaining: 0 };

    return {
      benefitId: benefit.benefitId,
      coverageType: benefit.coverageType,
      coverageTypeLabel: COVERAGE_TYPE_LABELS[benefit.coverageType] || benefit.coverageType,
      planName: benefit.planName,
      individual: {
        used: individualDeductible.used,
        max: individualDeductible.max,
        remaining: individualDeductible.remaining,
        formattedUsed: formatCurrency(individualDeductible.used),
        formattedMax: formatCurrency(individualDeductible.max),
        formattedRemaining: formatCurrency(individualDeductible.remaining),
        percentage: individualDeductible.max > 0
          ? Math.min((individualDeductible.used / individualDeductible.max) * 100, 100)
          : 0,
        formattedPercentage: formatProgressPercentage(individualDeductible.used, individualDeductible.max),
      },
      family: {
        used: familyDeductible.used,
        max: familyDeductible.max,
        remaining: familyDeductible.remaining,
        formattedUsed: formatCurrency(familyDeductible.used),
        formattedMax: formatCurrency(familyDeductible.max),
        formattedRemaining: formatCurrency(familyDeductible.remaining),
        percentage: familyDeductible.max > 0
          ? Math.min((familyDeductible.used / familyDeductible.max) * 100, 100)
          : 0,
        formattedPercentage: formatProgressPercentage(familyDeductible.used, familyDeductible.max),
      },
    };
  });
};

/**
 * Returns out-of-pocket progress for all active benefits for a given member.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of out-of-pocket progress objects per coverage type
 */
export const getOutOfPocketProgress = (memberId) => {
  if (!memberId) {
    return [];
  }

  const activeBenefits = getActiveBenefitsByMemberId(memberId);

  return activeBenefits.map((benefit) => {
    const individualOOP = benefit.outOfPocket?.individual || { used: 0, max: 0, remaining: 0 };
    const familyOOP = benefit.outOfPocket?.family || { used: 0, max: 0, remaining: 0 };

    return {
      benefitId: benefit.benefitId,
      coverageType: benefit.coverageType,
      coverageTypeLabel: COVERAGE_TYPE_LABELS[benefit.coverageType] || benefit.coverageType,
      planName: benefit.planName,
      individual: {
        used: individualOOP.used,
        max: individualOOP.max,
        remaining: individualOOP.remaining,
        formattedUsed: formatCurrency(individualOOP.used),
        formattedMax: formatCurrency(individualOOP.max),
        formattedRemaining: formatCurrency(individualOOP.remaining),
        percentage: individualOOP.max > 0
          ? Math.min((individualOOP.used / individualOOP.max) * 100, 100)
          : 0,
        formattedPercentage: formatProgressPercentage(individualOOP.used, individualOOP.max),
      },
      family: {
        used: familyOOP.used,
        max: familyOOP.max,
        remaining: familyOOP.remaining,
        formattedUsed: formatCurrency(familyOOP.used),
        formattedMax: formatCurrency(familyOOP.max),
        formattedRemaining: formatCurrency(familyOOP.remaining),
        percentage: familyOOP.max > 0
          ? Math.min((familyOOP.used / familyOOP.max) * 100, 100)
          : 0,
        formattedPercentage: formatProgressPercentage(familyOOP.used, familyOOP.max),
      },
    };
  });
};

/**
 * Returns coverage categories for a specific benefit.
 *
 * @param {string} benefitId - The benefit identifier
 * @returns {Object[]} Array of coverage category objects
 */
export const getCoverageCategories = (benefitId) => {
  if (!benefitId) {
    return [];
  }

  const benefit = getBenefitById(benefitId);

  if (!benefit || !Array.isArray(benefit.coverageCategories)) {
    return [];
  }

  return benefit.coverageCategories;
};

/**
 * Returns pharmacy tiers for a specific benefit.
 *
 * @param {string} benefitId - The benefit identifier
 * @returns {Object[]} Array of pharmacy tier objects
 */
export const getPharmacyTiers = (benefitId) => {
  if (!benefitId) {
    return [];
  }

  const benefit = getBenefitById(benefitId);

  if (!benefit || !Array.isArray(benefit.pharmacyTiers)) {
    return [];
  }

  return benefit.pharmacyTiers;
};

/**
 * Returns all available coverage type options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for coverage types
 */
export const getCoverageTypeOptions = () => {
  return Object.entries(COVERAGE_TYPE).map(([key, value]) => ({
    value,
    label: COVERAGE_TYPE_LABELS[value] || key,
  }));
};

/**
 * Returns all available plan status options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for plan statuses
 */
export const getPlanStatusOptions = () => {
  return [
    { value: 'active', label: 'Active' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'pending', label: 'Pending' },
  ];
};

/**
 * Returns all available plan type options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for plan types
 */
export const getPlanTypeOptions = () => {
  return [
    { value: 'PPO', label: 'PPO' },
    { value: 'HMO', label: 'HMO' },
    { value: 'DPPO', label: 'DPPO' },
    { value: 'Vision', label: 'Vision' },
    { value: 'Pharmacy', label: 'Pharmacy' },
    { value: 'BH', label: 'Behavioral Health' },
  ];
};

/**
 * Returns a combined deductible and out-of-pocket overview for a member's dashboard.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object|null} Combined overview object or null if memberId is not provided
 */
export const getBenefitsOverview = (memberId) => {
  if (!memberId) {
    return null;
  }

  const summary = getBenefitsSummaryForMember(memberId);
  const deductibles = getDeductibleProgress(memberId);
  const outOfPocket = getOutOfPocketProgress(memberId);
  const activeBenefits = getActiveBenefitsByMemberId(memberId);

  const activePlans = activeBenefits.map((benefit) => ({
    benefitId: benefit.benefitId,
    coverageType: benefit.coverageType,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[benefit.coverageType] || benefit.coverageType,
    planName: benefit.planName,
    planType: benefit.planType,
    formattedEffectiveDate: formatDate(benefit.effectiveDate),
    formattedTerminationDate: formatDate(benefit.terminationDate),
  }));

  return {
    summary,
    deductibles,
    outOfPocket,
    activePlans,
    totalActivePlans: activePlans.length,
  };
};