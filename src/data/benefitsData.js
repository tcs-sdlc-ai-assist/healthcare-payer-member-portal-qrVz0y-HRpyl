import { COVERAGE_TYPE, COVERAGE_TYPE_LABELS } from '../constants/constants.js';

/**
 * Mock benefits data fixture.
 * Used for development and testing of benefits summary, coverage details, and deductible/OOP tracking.
 *
 * @typedef {Object} DeductibleInfo
 * @property {number} used - Amount used toward deductible
 * @property {number} max - Maximum deductible amount
 * @property {number} remaining - Remaining deductible amount
 *
 * @typedef {Object} DeductibleTier
 * @property {DeductibleInfo} individual - Individual deductible info
 * @property {DeductibleInfo} family - Family deductible info
 *
 * @typedef {Object} OOPInfo
 * @property {number} used - Amount used toward out-of-pocket max
 * @property {number} max - Maximum out-of-pocket amount
 * @property {number} remaining - Remaining out-of-pocket amount
 *
 * @typedef {Object} OOPTier
 * @property {OOPInfo} individual - Individual out-of-pocket info
 * @property {OOPInfo} family - Family out-of-pocket info
 *
 * @typedef {Object} CoverageCategory
 * @property {string} category - Category name
 * @property {string} description - Category description
 * @property {string} inNetworkCopay - In-network copay amount or description
 * @property {string} outOfNetworkCopay - Out-of-network copay amount or description
 * @property {string} coinsurance - Coinsurance percentage or description
 * @property {string} notes - Additional notes
 *
 * @typedef {Object} PharmacyTier
 * @property {string} tier - Tier name
 * @property {string} description - Tier description
 * @property {string} retailCopay - Retail (30-day) copay
 * @property {string} mailOrderCopay - Mail order (90-day) copay
 * @property {string} notes - Additional notes
 *
 * @typedef {Object} Benefit
 * @property {string} benefitId - Unique benefit identifier
 * @property {string} memberId - Associated member identifier
 * @property {string} coverageId - Associated coverage identifier
 * @property {string} coverageType - Coverage type (MEDICAL, DENTAL, VISION, PHARMACY, BEHAVIORAL_HEALTH)
 * @property {string} coverageTypeLabel - Human-readable coverage type label
 * @property {string} planName - Health plan display name
 * @property {string} planType - Type of plan (e.g., PPO, HMO, DPPO, Vision)
 * @property {string} planStatus - Plan status (active, terminated, pending)
 * @property {string} effectiveDate - Plan effective date (YYYY-MM-DD)
 * @property {string} terminationDate - Plan termination date (YYYY-MM-DD)
 * @property {string} groupNumber - Employer group number
 * @property {string} subscriberId - Subscriber ID
 * @property {DeductibleTier} deductible - Deductible information
 * @property {OOPTier} outOfPocket - Out-of-pocket maximum information
 * @property {CoverageCategory[]} coverageCategories - Extended coverage category details
 * @property {PharmacyTier[]} pharmacyTiers - Pharmacy tier details (if applicable)
 * @property {string} notes - Additional plan notes
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 */

export const benefitsData = [
  {
    benefitId: 'BEN-MED-00042',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-MED-00042',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    planName: 'HealthFirst PPO 5000',
    planType: 'PPO',
    planStatus: 'active',
    effectiveDate: '2024-01-01',
    terminationDate: '2024-12-31',
    groupNumber: 'GRP-98765',
    subscriberId: 'SUB-2024-00042',
    deductible: {
      individual: {
        used: 1250.00,
        max: 5000.00,
        remaining: 3750.00,
      },
      family: {
        used: 2100.00,
        max: 10000.00,
        remaining: 7900.00,
      },
    },
    outOfPocket: {
      individual: {
        used: 2450.00,
        max: 8000.00,
        remaining: 5550.00,
      },
      family: {
        used: 3800.00,
        max: 16000.00,
        remaining: 12200.00,
      },
    },
    coverageCategories: [
      {
        category: 'Preventive Care',
        description: 'Annual wellness visits, immunizations, and routine screenings',
        inNetworkCopay: '$0',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '0% (covered in full)',
        notes: 'Covered at 100% for in-network providers with no cost sharing.',
      },
      {
        category: 'Primary Care Visit',
        description: 'Office visits with your primary care physician',
        inNetworkCopay: '$25',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Copay applies per visit. Deductible waived for in-network PCP visits.',
      },
      {
        category: 'Specialist Visit',
        description: 'Office visits with a specialist physician',
        inNetworkCopay: '$50',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Referral not required for PPO plan.',
      },
      {
        category: 'Urgent Care',
        description: 'Visits to an urgent care facility',
        inNetworkCopay: '$75',
        outOfNetworkCopay: '$75 + 40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'In-network copay applies regardless of location.',
      },
      {
        category: 'Emergency Room',
        description: 'Emergency department visits',
        inNetworkCopay: '$250',
        outOfNetworkCopay: '$250 (waived if admitted)',
        coinsurance: '20% after deductible',
        notes: 'Copay waived if admitted to the hospital within 24 hours.',
      },
      {
        category: 'Hospital (Inpatient)',
        description: 'Inpatient hospital stays including surgery',
        inNetworkCopay: '$500 per admission',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Pre-authorization required for non-emergency admissions.',
      },
      {
        category: 'Hospital (Outpatient)',
        description: 'Outpatient hospital services and same-day surgery',
        inNetworkCopay: '$200 per visit',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Pre-authorization may be required for certain procedures.',
      },
      {
        category: 'Lab / Pathology',
        description: 'Laboratory tests and pathology services',
        inNetworkCopay: '$10',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '10% after deductible',
        notes: 'Preventive labs covered at 100% in-network.',
      },
      {
        category: 'Imaging (X-ray, MRI, CT)',
        description: 'Diagnostic imaging services',
        inNetworkCopay: '$50 (X-ray) / $150 (MRI/CT)',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Pre-authorization required for advanced imaging (MRI, CT, PET).',
      },
      {
        category: 'Mental Health (Outpatient)',
        description: 'Outpatient mental health and counseling visits',
        inNetworkCopay: '$25',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'No referral required. Telehealth visits available at same copay.',
      },
      {
        category: 'Mental Health (Inpatient)',
        description: 'Inpatient mental health and substance abuse treatment',
        inNetworkCopay: '$500 per admission',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Pre-authorization required. Crisis services exempt from pre-auth.',
      },
    ],
    pharmacyTiers: [
      {
        tier: 'Tier 1 - Generic',
        description: 'Generic medications',
        retailCopay: '$10',
        mailOrderCopay: '$25',
        notes: 'Lowest cost option. Most common medications available as generics.',
      },
      {
        tier: 'Tier 2 - Preferred Brand',
        description: 'Preferred brand-name medications',
        retailCopay: '$35',
        mailOrderCopay: '$90',
        notes: 'Brand-name drugs on the preferred formulary list.',
      },
      {
        tier: 'Tier 3 - Non-Preferred Brand',
        description: 'Non-preferred brand-name medications',
        retailCopay: '$60',
        mailOrderCopay: '$150',
        notes: 'Higher cost brand-name drugs. Consider generic or preferred alternatives.',
      },
      {
        tier: 'Tier 4 - Specialty',
        description: 'Specialty medications',
        retailCopay: '25% up to $250',
        mailOrderCopay: '25% up to $250',
        notes: 'Pre-authorization required. Specialty pharmacy may be required.',
      },
    ],
    notes: 'PPO plan allows out-of-network care at higher cost sharing. No referrals required for specialists.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    benefitId: 'BEN-DEN-00042',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-DEN-00042',
    coverageType: COVERAGE_TYPE.DENTAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.DENTAL],
    planName: 'HealthFirst Dental Plus',
    planType: 'DPPO',
    planStatus: 'active',
    effectiveDate: '2024-01-01',
    terminationDate: '2024-12-31',
    groupNumber: 'GRP-98765',
    subscriberId: 'SUB-2024-00042',
    deductible: {
      individual: {
        used: 0.00,
        max: 50.00,
        remaining: 50.00,
      },
      family: {
        used: 0.00,
        max: 150.00,
        remaining: 150.00,
      },
    },
    outOfPocket: {
      individual: {
        used: 320.00,
        max: 1500.00,
        remaining: 1180.00,
      },
      family: {
        used: 320.00,
        max: 4500.00,
        remaining: 4180.00,
      },
    },
    coverageCategories: [
      {
        category: 'Preventive Care',
        description: 'Oral exams, cleanings, and routine X-rays',
        inNetworkCopay: '$0',
        outOfNetworkCopay: '20% after deductible',
        coinsurance: '0% (covered in full)',
        notes: 'Two cleanings and exams per calendar year covered at 100% in-network.',
      },
      {
        category: 'Basic Services',
        description: 'Fillings, simple extractions, and periodontics',
        inNetworkCopay: '20% after deductible',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Deductible applies. Composite fillings covered on all teeth.',
      },
      {
        category: 'Major Services',
        description: 'Crowns, bridges, dentures, and implants',
        inNetworkCopay: '50% after deductible',
        outOfNetworkCopay: '60% after deductible',
        coinsurance: '50% after deductible',
        notes: 'Pre-authorization recommended for services over $300. Implants subject to plan limitations.',
      },
      {
        category: 'Orthodontia',
        description: 'Braces and orthodontic treatment',
        inNetworkCopay: '50%',
        outOfNetworkCopay: '50%',
        coinsurance: '50%',
        notes: 'Lifetime maximum of $1,500 per member. Available for dependents under age 19.',
      },
      {
        category: 'Emergency Dental',
        description: 'Emergency dental treatment for pain relief',
        inNetworkCopay: '$25',
        outOfNetworkCopay: '$25 + 20% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Emergency palliative treatment covered at in-network rate regardless of provider.',
      },
    ],
    pharmacyTiers: [],
    notes: 'Annual maximum benefit of $2,000 per member for basic and major services combined. Preventive services do not count toward annual maximum.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    benefitId: 'BEN-VIS-00042',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-VIS-00042',
    coverageType: COVERAGE_TYPE.VISION,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.VISION],
    planName: 'HealthFirst Vision Care',
    planType: 'Vision',
    planStatus: 'active',
    effectiveDate: '2024-01-01',
    terminationDate: '2024-12-31',
    groupNumber: 'GRP-98765',
    subscriberId: 'SUB-2024-00042',
    deductible: {
      individual: {
        used: 0.00,
        max: 0.00,
        remaining: 0.00,
      },
      family: {
        used: 0.00,
        max: 0.00,
        remaining: 0.00,
      },
    },
    outOfPocket: {
      individual: {
        used: 85.00,
        max: 500.00,
        remaining: 415.00,
      },
      family: {
        used: 85.00,
        max: 1500.00,
        remaining: 1415.00,
      },
    },
    coverageCategories: [
      {
        category: 'Comprehensive Eye Exam',
        description: 'Annual comprehensive eye examination',
        inNetworkCopay: '$10',
        outOfNetworkCopay: 'Up to $45 allowance',
        coinsurance: '0% after copay',
        notes: 'One exam per calendar year. Includes dilation when professionally indicated.',
      },
      {
        category: 'Eyeglass Lenses',
        description: 'Standard single vision, bifocal, trifocal, or progressive lenses',
        inNetworkCopay: '$25',
        outOfNetworkCopay: 'Up to $100 allowance',
        coinsurance: '0% after copay (standard lenses)',
        notes: 'One pair per calendar year. Lens enhancements (anti-reflective, transitions) available at additional cost.',
      },
      {
        category: 'Frames',
        description: 'Eyeglass frames from in-network provider',
        inNetworkCopay: '$0 (up to $150 allowance)',
        outOfNetworkCopay: 'Up to $70 allowance',
        coinsurance: '20% over $150 allowance',
        notes: 'One frame per calendar year. Featured frame brands may offer higher allowance.',
      },
      {
        category: 'Contact Lenses',
        description: 'Contact lens fitting and lenses (in lieu of eyeglasses)',
        inNetworkCopay: '$0 (up to $150 allowance)',
        outOfNetworkCopay: 'Up to $105 allowance',
        coinsurance: '15% over allowance',
        notes: 'Contact lens fitting and evaluation covered. Allowance applies to lenses only.',
      },
      {
        category: 'Laser Vision Correction',
        description: 'LASIK and PRK procedures',
        inNetworkCopay: '15% discount off retail',
        outOfNetworkCopay: 'Not covered',
        coinsurance: 'N/A',
        notes: 'Discount available through participating laser vision providers only.',
      },
    ],
    pharmacyTiers: [],
    notes: 'Vision plan covers one exam and one set of lenses or contacts per calendar year. No deductible applies.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    benefitId: 'BEN-RX-00042',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-RX-00042',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    planName: 'HealthFirst Rx Benefits',
    planType: 'Pharmacy',
    planStatus: 'active',
    effectiveDate: '2024-01-01',
    terminationDate: '2024-12-31',
    groupNumber: 'GRP-98765',
    subscriberId: 'SUB-2024-00042',
    deductible: {
      individual: {
        used: 150.00,
        max: 200.00,
        remaining: 50.00,
      },
      family: {
        used: 150.00,
        max: 400.00,
        remaining: 250.00,
      },
    },
    outOfPocket: {
      individual: {
        used: 475.00,
        max: 4000.00,
        remaining: 3525.00,
      },
      family: {
        used: 475.00,
        max: 8000.00,
        remaining: 7525.00,
      },
    },
    coverageCategories: [
      {
        category: 'Preventive Medications',
        description: 'Preventive drugs including contraceptives and certain chronic disease medications',
        inNetworkCopay: '$0',
        outOfNetworkCopay: 'Not covered',
        coinsurance: '0% (covered in full)',
        notes: 'ACA-mandated preventive medications covered at no cost when prescribed by in-network provider.',
      },
      {
        category: 'Retail Pharmacy (30-day)',
        description: 'Prescriptions filled at a participating retail pharmacy',
        inNetworkCopay: 'See pharmacy tiers',
        outOfNetworkCopay: 'Higher cost; see plan details',
        coinsurance: 'Varies by tier',
        notes: 'Present your pharmacy ID card at any participating retail pharmacy.',
      },
      {
        category: 'Mail Order Pharmacy (90-day)',
        description: 'Prescriptions filled through mail order for maintenance medications',
        inNetworkCopay: 'See pharmacy tiers',
        outOfNetworkCopay: 'Not available',
        coinsurance: 'Varies by tier',
        notes: 'Mail order available for maintenance medications. Typically 2.5x the retail copay for a 90-day supply.',
      },
      {
        category: 'Specialty Pharmacy',
        description: 'Specialty medications for complex conditions',
        inNetworkCopay: '25% up to $250',
        outOfNetworkCopay: 'Not covered',
        coinsurance: '25% after deductible',
        notes: 'Must be filled through designated specialty pharmacy. Pre-authorization required.',
      },
    ],
    pharmacyTiers: [
      {
        tier: 'Tier 1 - Generic',
        description: 'Generic medications',
        retailCopay: '$10',
        mailOrderCopay: '$25',
        notes: 'Lowest cost option. Most common medications available as generics.',
      },
      {
        tier: 'Tier 2 - Preferred Brand',
        description: 'Preferred brand-name medications',
        retailCopay: '$35',
        mailOrderCopay: '$90',
        notes: 'Brand-name drugs on the preferred formulary list.',
      },
      {
        tier: 'Tier 3 - Non-Preferred Brand',
        description: 'Non-preferred brand-name medications',
        retailCopay: '$60',
        mailOrderCopay: '$150',
        notes: 'Higher cost brand-name drugs. Consider generic or preferred alternatives.',
      },
      {
        tier: 'Tier 4 - Specialty',
        description: 'Specialty medications',
        retailCopay: '25% up to $250',
        mailOrderCopay: '25% up to $250',
        notes: 'Pre-authorization required. Specialty pharmacy may be required.',
      },
    ],
    notes: 'Pharmacy deductible applies to Tier 2 and above. Generic medications (Tier 1) are exempt from deductible.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    benefitId: 'BEN-BH-00042',
    memberId: 'HCP-2024-00042',
    coverageId: 'COV-BH-00042',
    coverageType: COVERAGE_TYPE.BEHAVIORAL_HEALTH,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.BEHAVIORAL_HEALTH],
    planName: 'HealthFirst Behavioral Health',
    planType: 'BH',
    planStatus: 'active',
    effectiveDate: '2024-01-01',
    terminationDate: '2024-12-31',
    groupNumber: 'GRP-98765',
    subscriberId: 'SUB-2024-00042',
    deductible: {
      individual: {
        used: 0.00,
        max: 0.00,
        remaining: 0.00,
      },
      family: {
        used: 0.00,
        max: 0.00,
        remaining: 0.00,
      },
    },
    outOfPocket: {
      individual: {
        used: 180.00,
        max: 4000.00,
        remaining: 3820.00,
      },
      family: {
        used: 180.00,
        max: 8000.00,
        remaining: 7820.00,
      },
    },
    coverageCategories: [
      {
        category: 'Outpatient Therapy',
        description: 'Individual and group therapy sessions with a licensed therapist',
        inNetworkCopay: '$25',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'No referral required. Unlimited visits when medically necessary.',
      },
      {
        category: 'Psychiatric Services',
        description: 'Psychiatric evaluation and medication management',
        inNetworkCopay: '$25',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Includes initial psychiatric evaluation and follow-up medication management visits.',
      },
      {
        category: 'Telehealth Behavioral Health',
        description: 'Virtual therapy and psychiatric visits',
        inNetworkCopay: '$25',
        outOfNetworkCopay: 'Not covered',
        coinsurance: '0% after copay',
        notes: 'Same copay as in-person visits. Available through approved telehealth platforms.',
      },
      {
        category: 'Inpatient Mental Health',
        description: 'Inpatient psychiatric hospitalization',
        inNetworkCopay: '$500 per admission',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Pre-authorization required except for emergency admissions.',
      },
      {
        category: 'Substance Abuse (Outpatient)',
        description: 'Outpatient substance abuse treatment and counseling',
        inNetworkCopay: '$25',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Includes individual and group counseling, intensive outpatient programs.',
      },
      {
        category: 'Substance Abuse (Inpatient)',
        description: 'Inpatient detoxification and residential treatment',
        inNetworkCopay: '$500 per admission',
        outOfNetworkCopay: '40% after deductible',
        coinsurance: '20% after deductible',
        notes: 'Pre-authorization required. Covers medically necessary detox and rehabilitation.',
      },
      {
        category: 'Crisis Services',
        description: 'Emergency mental health and crisis intervention',
        inNetworkCopay: '$0',
        outOfNetworkCopay: '$0',
        coinsurance: '0% (covered in full)',
        notes: 'Call 988 (Suicide & Crisis Lifeline) for immediate help. No pre-authorization required.',
      },
    ],
    pharmacyTiers: [],
    notes: 'Behavioral health benefits are provided at parity with medical benefits. No separate deductible for behavioral health services. Combined with medical out-of-pocket maximum.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
];

/**
 * Returns all benefits for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of benefit objects for the member
 */
export const getBenefitsByMemberId = (memberId) => {
  return benefitsData.filter((benefit) => benefit.memberId === memberId);
};

/**
 * Returns all active benefits for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of active benefit objects for the member
 */
export const getActiveBenefitsByMemberId = (memberId) => {
  return benefitsData.filter((benefit) => benefit.memberId === memberId && benefit.planStatus === 'active');
};

/**
 * Returns a single benefit by its benefit ID.
 * @param {string} benefitId - The benefit identifier
 * @returns {Object|undefined} The benefit object or undefined if not found
 */
export const getBenefitById = (benefitId) => {
  return benefitsData.find((benefit) => benefit.benefitId === benefitId);
};

/**
 * Returns benefits filtered by coverage type for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} coverageType - The coverage type to filter by (MEDICAL, DENTAL, VISION, PHARMACY, BEHAVIORAL_HEALTH)
 * @returns {Object[]} Array of benefit objects matching the coverage type
 */
export const getBenefitsByCoverageType = (memberId, coverageType) => {
  return benefitsData.filter(
    (benefit) => benefit.memberId === memberId && benefit.coverageType === coverageType
  );
};

/**
 * Returns benefits filtered by coverage ID.
 * @param {string} coverageId - The coverage identifier
 * @returns {Object|undefined} The benefit object matching the coverage ID or undefined
 */
export const getBenefitByCoverageId = (coverageId) => {
  return benefitsData.find((benefit) => benefit.coverageId === coverageId);
};

/**
 * Filters benefits by multiple criteria.
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.memberId] - Member ID to filter by
 * @param {string} [filters.coverageType] - Coverage type to filter by
 * @param {string} [filters.planStatus] - Plan status to filter by ('active', 'terminated', 'pending')
 * @param {string} [filters.planType] - Plan type to filter by (e.g., 'PPO', 'HMO', 'DPPO')
 * @param {string} [filters.sortBy] - Sort field ('effectiveDate', 'coverageType', 'planName')
 * @param {string} [filters.sortOrder] - Sort order ('asc' or 'desc')
 * @returns {Object[]} Filtered and sorted array of benefit objects
 */
export const filterBenefits = (filters = {}) => {
  let results = [...benefitsData];

  if (filters.memberId) {
    results = results.filter((benefit) => benefit.memberId === filters.memberId);
  }

  if (filters.coverageType) {
    results = results.filter((benefit) => benefit.coverageType === filters.coverageType);
  }

  if (filters.planStatus) {
    results = results.filter((benefit) => benefit.planStatus === filters.planStatus);
  }

  if (filters.planType) {
    results = results.filter((benefit) => benefit.planType === filters.planType);
  }

  const sortBy = filters.sortBy || 'effectiveDate';
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
 * Returns a summary of benefits for a given member.
 * @param {string} memberId - The member identifier
 * @returns {Object} Summary object with totalBenefits, activeBenefits, coverageTypeCounts, and deductible/OOP totals
 */
export const getBenefitsSummary = (memberId) => {
  const memberBenefits = getBenefitsByMemberId(memberId);

  const coverageTypeCounts = {};
  Object.values(COVERAGE_TYPE).forEach((type) => {
    coverageTypeCounts[type] = 0;
  });

  let activeBenefits = 0;
  let totalDeductibleUsed = 0;
  let totalDeductibleMax = 0;
  let totalOOPUsed = 0;
  let totalOOPMax = 0;

  memberBenefits.forEach((benefit) => {
    if (benefit.planStatus === 'active') {
      activeBenefits += 1;
    }

    if (coverageTypeCounts[benefit.coverageType] !== undefined) {
      coverageTypeCounts[benefit.coverageType] += 1;
    }

    totalDeductibleUsed += benefit.deductible.individual.used;
    totalDeductibleMax += benefit.deductible.individual.max;
    totalOOPUsed += benefit.outOfPocket.individual.used;
    totalOOPMax += benefit.outOfPocket.individual.max;
  });

  return {
    totalBenefits: memberBenefits.length,
    activeBenefits,
    coverageTypeCounts,
    totalDeductibleUsed: Math.round(totalDeductibleUsed * 100) / 100,
    totalDeductibleMax: Math.round(totalDeductibleMax * 100) / 100,
    totalOOPUsed: Math.round(totalOOPUsed * 100) / 100,
    totalOOPMax: Math.round(totalOOPMax * 100) / 100,
  };
};