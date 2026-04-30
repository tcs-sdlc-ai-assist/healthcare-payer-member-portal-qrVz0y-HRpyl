import { COVERAGE_TYPE, COVERAGE_TYPE_LABELS } from '../constants/constants.js';

/**
 * Mock prescriptions data fixture.
 * Used for development and testing of Prescriptions section features including
 * current prescriptions, pharmacy information, refill tracking, and formulary tier details.
 *
 * @typedef {Object} Pharmacy
 * @property {string} pharmacyId - Unique pharmacy identifier
 * @property {string} name - Pharmacy name
 * @property {string} type - Pharmacy type (retail, mail_order, specialty)
 * @property {string} address - Pharmacy street address
 * @property {string} city - Pharmacy city
 * @property {string} state - Pharmacy state abbreviation
 * @property {string} zipCode - Pharmacy ZIP code
 * @property {string} phone - Pharmacy phone number
 * @property {string} fax - Pharmacy fax number
 * @property {boolean} isPreferred - Whether the pharmacy is a preferred in-network pharmacy
 * @property {boolean} is24Hour - Whether the pharmacy is open 24 hours
 * @property {string} hours - Pharmacy operating hours description
 * @property {string} npi - Pharmacy NPI number
 *
 * @typedef {Object} Prescriber
 * @property {string} name - Prescriber full name with credentials
 * @property {string} specialty - Prescriber specialty
 * @property {string} phone - Prescriber phone number
 * @property {string} npi - Prescriber NPI number
 *
 * @typedef {Object} FormularyTier
 * @property {number} tierNumber - Tier number (1-4)
 * @property {string} tierName - Tier display name
 * @property {string} description - Tier description
 * @property {string} retailCopay30Day - Retail copay for 30-day supply
 * @property {string} retailCopay90Day - Retail copay for 90-day supply
 * @property {string} mailOrderCopay90Day - Mail order copay for 90-day supply
 * @property {boolean} deductibleApplies - Whether the pharmacy deductible applies
 * @property {string} notes - Additional notes about the tier
 *
 * @typedef {Object} Prescription
 * @property {string} prescriptionId - Unique prescription identifier
 * @property {string} memberId - Associated member identifier
 * @property {string} rxNumber - Pharmacy prescription number
 * @property {string} medicationName - Medication name (generic)
 * @property {string} brandName - Brand name of the medication
 * @property {string} strength - Medication strength
 * @property {string} dosageForm - Dosage form (tablet, capsule, liquid, etc.)
 * @property {string} directions - Dosing directions
 * @property {number} quantity - Quantity dispensed
 * @property {number} daysSupply - Days supply dispensed
 * @property {number} refillsRemaining - Number of refills remaining
 * @property {number} refillsTotal - Total number of refills authorized
 * @property {string} lastFilledDate - Date last filled (YYYY-MM-DD)
 * @property {string} nextRefillDate - Earliest date for next refill (YYYY-MM-DD)
 * @property {string} expirationDate - Prescription expiration date (YYYY-MM-DD)
 * @property {string} status - Prescription status (active, expired, discontinued, on_hold)
 * @property {number} tierNumber - Formulary tier number
 * @property {string} tierName - Formulary tier display name
 * @property {string} copayAmount - Member copay amount
 * @property {number} planPaidAmount - Amount paid by the plan
 * @property {number} memberPaidAmount - Amount paid by the member
 * @property {string} ndcCode - National Drug Code
 * @property {string} drugClass - Therapeutic drug class
 * @property {boolean} isGeneric - Whether the medication is a generic
 * @property {boolean} isMaintenance - Whether the medication is a maintenance medication
 * @property {boolean} isSpecialty - Whether the medication is a specialty medication
 * @property {boolean} requiresPriorAuth - Whether prior authorization is required
 * @property {boolean} mailOrderEligible - Whether the medication is eligible for mail order
 * @property {Prescriber} prescriber - Prescribing provider information
 * @property {string} pharmacyId - Pharmacy where the prescription was last filled
 * @property {string} coverageType - Associated coverage type
 * @property {string} coverageTypeLabel - Human-readable coverage type label
 * @property {string} notes - Additional notes
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 */

// ===== Pharmacies =====

export const pharmaciesData = [
  {
    pharmacyId: 'PHR-001',
    name: 'Walgreens Pharmacy #4521',
    type: 'retail',
    address: '200 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    phone: '(555) 678-1234',
    fax: '(555) 678-1235',
    isPreferred: true,
    is24Hour: false,
    hours: 'Monday - Friday: 8:00 AM - 9:00 PM, Saturday: 9:00 AM - 6:00 PM, Sunday: 10:00 AM - 5:00 PM',
    npi: '4567890123',
  },
  {
    pharmacyId: 'PHR-002',
    name: 'CVS Pharmacy #7832',
    type: 'retail',
    address: '450 Oak Boulevard',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    phone: '(555) 789-2345',
    fax: '(555) 789-2346',
    isPreferred: true,
    is24Hour: true,
    hours: '24 hours a day, 7 days a week',
    npi: '5566778899',
  },
  {
    pharmacyId: 'PHR-003',
    name: 'HealthFirst Mail Order Pharmacy',
    type: 'mail_order',
    address: 'P.O. Box 54321',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    phone: '1-800-555-0140',
    fax: '1-800-555-0141',
    isPreferred: true,
    is24Hour: false,
    hours: 'Monday - Friday: 7:00 AM - 10:00 PM ET, Saturday: 8:00 AM - 6:00 PM ET',
    npi: '6677889900',
  },
  {
    pharmacyId: 'PHR-004',
    name: 'HealthFirst Specialty Pharmacy',
    type: 'specialty',
    address: '100 Medical Center Drive, Suite 200',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62702',
    phone: '1-800-555-0145',
    fax: '1-800-555-0146',
    isPreferred: true,
    is24Hour: false,
    hours: 'Monday - Friday: 8:00 AM - 8:00 PM ET, Saturday: 9:00 AM - 1:00 PM ET',
    npi: '7788990011',
  },
  {
    pharmacyId: 'PHR-005',
    name: 'Rite Aid Pharmacy #3210',
    type: 'retail',
    address: '875 Elm Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62703',
    phone: '(555) 890-3456',
    fax: '(555) 890-3457',
    isPreferred: false,
    is24Hour: false,
    hours: 'Monday - Friday: 9:00 AM - 9:00 PM, Saturday: 9:00 AM - 6:00 PM, Sunday: 10:00 AM - 5:00 PM',
    npi: '8899001122',
  },
];

// ===== Formulary Tiers =====

export const formularyTiers = [
  {
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    description: 'Generic medications that are the lowest cost option. Most common medications are available as generics.',
    retailCopay30Day: '$10',
    retailCopay90Day: '$25',
    mailOrderCopay90Day: '$25',
    deductibleApplies: false,
    notes: 'Generic medications are exempt from the pharmacy deductible. Always ask your pharmacist if a generic is available.',
  },
  {
    tierNumber: 2,
    tierName: 'Tier 2 - Preferred Brand',
    description: 'Preferred brand-name medications on the HealthFirst formulary list. These are brand-name drugs with negotiated pricing.',
    retailCopay30Day: '$35',
    retailCopay90Day: '$90',
    mailOrderCopay90Day: '$90',
    deductibleApplies: true,
    notes: 'Pharmacy deductible applies before copay. Consider asking your provider about generic alternatives to reduce costs.',
  },
  {
    tierNumber: 3,
    tierName: 'Tier 3 - Non-Preferred Brand',
    description: 'Non-preferred brand-name medications. These are brand-name drugs not on the preferred formulary list.',
    retailCopay30Day: '$60',
    retailCopay90Day: '$150',
    mailOrderCopay90Day: '$150',
    deductibleApplies: true,
    notes: 'Higher cost brand-name drugs. Consider generic or preferred brand alternatives to save money.',
  },
  {
    tierNumber: 4,
    tierName: 'Tier 4 - Specialty',
    description: 'Specialty medications for complex or rare conditions. These medications often require special handling, administration, or monitoring.',
    retailCopay30Day: '25% up to $250',
    retailCopay90Day: '25% up to $250',
    mailOrderCopay90Day: '25% up to $250',
    deductibleApplies: true,
    notes: 'Pre-authorization required. Must be filled through designated specialty pharmacy. Patient assistance programs may be available.',
  },
];

// ===== Prescriptions =====

export const prescriptionsData = [
  {
    prescriptionId: 'RX-2024-00001',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845123',
    medicationName: 'Metformin HCl',
    brandName: 'Glucophage',
    strength: '500 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth twice daily with meals.',
    quantity: 180,
    daysSupply: 90,
    refillsRemaining: 3,
    refillsTotal: 5,
    lastFilledDate: '2024-04-10',
    nextRefillDate: '2024-07-01',
    expirationDate: '2025-04-10',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 28.00,
    memberPaidAmount: 10.00,
    ndcCode: '00002-4462-30',
    drugClass: 'Antidiabetic - Biguanide',
    isGeneric: true,
    isMaintenance: true,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'Maintenance medication for type 2 diabetes management. Take with food to reduce GI side effects.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-04-10T14:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00002',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845124',
    medicationName: 'Lisinopril',
    brandName: 'Prinivil',
    strength: '10 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth once daily.',
    quantity: 90,
    daysSupply: 90,
    refillsRemaining: 4,
    refillsTotal: 5,
    lastFilledDate: '2024-04-10',
    nextRefillDate: '2024-07-01',
    expirationDate: '2025-04-10',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 38.00,
    memberPaidAmount: 10.00,
    ndcCode: '00078-0587-05',
    drugClass: 'ACE Inhibitor',
    isGeneric: true,
    isMaintenance: true,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'Maintenance medication for blood pressure management. Monitor potassium levels periodically.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-04-10T14:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00003',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845125',
    medicationName: 'Atorvastatin Calcium',
    brandName: 'Lipitor',
    strength: '20 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth once daily at bedtime.',
    quantity: 30,
    daysSupply: 30,
    refillsRemaining: 5,
    refillsTotal: 11,
    lastFilledDate: '2024-05-15',
    nextRefillDate: '2024-06-08',
    expirationDate: '2025-05-15',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 29.00,
    memberPaidAmount: 10.00,
    ndcCode: '00071-0155-23',
    drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    isGeneric: true,
    isMaintenance: true,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'Maintenance medication for cholesterol management. Take at bedtime for optimal effectiveness. Avoid grapefruit juice.',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-05-15T11:30:00Z',
  },
  {
    prescriptionId: 'RX-2024-00004',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845126',
    medicationName: 'Fluticasone Propionate Nasal Spray',
    brandName: 'Flonase',
    strength: '50 mcg/spray',
    dosageForm: 'Nasal Spray',
    directions: 'Use 2 sprays in each nostril once daily.',
    quantity: 1,
    daysSupply: 30,
    refillsRemaining: 2,
    refillsTotal: 5,
    lastFilledDate: '2024-05-01',
    nextRefillDate: '2024-05-25',
    expirationDate: '2025-01-01',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 18.50,
    memberPaidAmount: 10.00,
    ndcCode: '00085-1334-02',
    drugClass: 'Intranasal Corticosteroid',
    isGeneric: true,
    isMaintenance: false,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-002',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'For seasonal allergic rhinitis. Prime the pump before first use. Avoid spraying into eyes.',
    createdAt: '2024-03-15T08:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00005',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845127',
    medicationName: 'Cetirizine HCl',
    brandName: 'Zyrtec',
    strength: '10 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth once daily.',
    quantity: 90,
    daysSupply: 90,
    refillsRemaining: 1,
    refillsTotal: 3,
    lastFilledDate: '2024-03-20',
    nextRefillDate: '2024-06-12',
    expirationDate: '2024-12-20',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 15.00,
    memberPaidAmount: 10.00,
    ndcCode: '00173-0682-15',
    drugClass: 'Antihistamine',
    isGeneric: true,
    isMaintenance: false,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-002',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'For allergic rhinitis. May cause drowsiness in some patients.',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-03-20T09:45:00Z',
  },
  {
    prescriptionId: 'RX-2024-00006',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845128',
    medicationName: 'Omeprazole',
    brandName: 'Prilosec',
    strength: '20 mg',
    dosageForm: 'Delayed-Release Capsule',
    directions: 'Take 1 capsule by mouth once daily, 30 minutes before breakfast.',
    quantity: 30,
    daysSupply: 30,
    refillsRemaining: 0,
    refillsTotal: 3,
    lastFilledDate: '2024-02-10',
    nextRefillDate: '2024-03-06',
    expirationDate: '2024-08-10',
    status: 'expired',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 12.00,
    memberPaidAmount: 10.00,
    ndcCode: '00186-5020-31',
    drugClass: 'Proton Pump Inhibitor',
    isGeneric: true,
    isMaintenance: false,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'For gastroesophageal reflux disease (GERD). No refills remaining — contact your provider for renewal.',
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2024-02-10T13:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00007',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845129',
    medicationName: 'Sertraline HCl',
    brandName: 'Zoloft',
    strength: '50 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth once daily in the morning.',
    quantity: 30,
    daysSupply: 30,
    refillsRemaining: 8,
    refillsTotal: 11,
    lastFilledDate: '2024-05-20',
    nextRefillDate: '2024-06-13',
    expirationDate: '2025-05-20',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 22.00,
    memberPaidAmount: 10.00,
    ndcCode: '00049-4960-30',
    drugClass: 'Selective Serotonin Reuptake Inhibitor (SSRI)',
    isGeneric: true,
    isMaintenance: true,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Sarah Kim, PhD',
      specialty: 'Psychiatry',
      phone: '(555) 567-8901',
      npi: '7890123456',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'For generalized anxiety disorder. Do not discontinue abruptly — taper under medical supervision.',
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2024-05-20T10:30:00Z',
  },
  {
    prescriptionId: 'RX-2024-00008',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845130',
    medicationName: 'Amoxicillin',
    brandName: 'Amoxil',
    strength: '500 mg',
    dosageForm: 'Capsule',
    directions: 'Take 1 capsule by mouth three times daily for 10 days.',
    quantity: 30,
    daysSupply: 10,
    refillsRemaining: 0,
    refillsTotal: 0,
    lastFilledDate: '2024-03-01',
    nextRefillDate: null,
    expirationDate: '2024-09-01',
    status: 'discontinued',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 8.00,
    memberPaidAmount: 10.00,
    ndcCode: '00029-6008-31',
    drugClass: 'Aminopenicillin Antibiotic',
    isGeneric: true,
    isMaintenance: false,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: false,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'Acute course antibiotic for upper respiratory infection. Completed 10-day course.',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-11T10:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00009',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845131',
    medicationName: 'Montelukast Sodium',
    brandName: 'Singulair',
    strength: '10 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth once daily in the evening.',
    quantity: 30,
    daysSupply: 30,
    refillsRemaining: 6,
    refillsTotal: 11,
    lastFilledDate: '2024-05-25',
    nextRefillDate: '2024-06-18',
    expirationDate: '2025-05-25',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 25.00,
    memberPaidAmount: 10.00,
    ndcCode: '00006-0275-31',
    drugClass: 'Leukotriene Receptor Antagonist',
    isGeneric: true,
    isMaintenance: true,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'For allergic rhinitis and asthma prevention. Take in the evening for best results.',
    createdAt: '2024-05-01T08:00:00Z',
    updatedAt: '2024-05-25T09:15:00Z',
  },
  {
    prescriptionId: 'RX-2024-00010',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845132',
    medicationName: 'Vitamin D3 (Cholecalciferol)',
    brandName: 'N/A',
    strength: '2000 IU',
    dosageForm: 'Softgel Capsule',
    directions: 'Take 1 capsule by mouth once daily with food.',
    quantity: 90,
    daysSupply: 90,
    refillsRemaining: 3,
    refillsTotal: 3,
    lastFilledDate: '2024-04-01',
    nextRefillDate: '2024-06-24',
    expirationDate: '2025-04-01',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 5.00,
    memberPaidAmount: 10.00,
    ndcCode: '00536-1251-01',
    drugClass: 'Vitamin / Supplement',
    isGeneric: true,
    isMaintenance: true,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-003',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'Prescribed for vitamin D deficiency. Take with a meal containing fat for better absorption.',
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-04-01T10:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00011',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845133',
    medicationName: 'Ibuprofen',
    brandName: 'Advil',
    strength: '800 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth three times daily as needed for pain. Take with food.',
    quantity: 30,
    daysSupply: 10,
    refillsRemaining: 0,
    refillsTotal: 1,
    lastFilledDate: '2024-06-01',
    nextRefillDate: null,
    expirationDate: '2024-12-01',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 4.00,
    memberPaidAmount: 10.00,
    ndcCode: '00573-0150-30',
    drugClass: 'Nonsteroidal Anti-Inflammatory Drug (NSAID)',
    isGeneric: true,
    isMaintenance: false,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: false,
    prescriber: {
      name: 'Dr. Angela Martinez, MD',
      specialty: 'Orthopedics',
      phone: '(555) 345-6789',
      npi: '6789012345',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'For shoulder pain. Take with food to reduce stomach irritation. Do not exceed 2400 mg per day.',
    createdAt: '2024-06-01T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00012',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845134',
    medicationName: 'Amlodipine Besylate',
    brandName: 'Norvasc',
    strength: '5 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth once daily.',
    quantity: 90,
    daysSupply: 90,
    refillsRemaining: 2,
    refillsTotal: 5,
    lastFilledDate: '2024-04-10',
    nextRefillDate: '2024-07-01',
    expirationDate: '2025-04-10',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 20.00,
    memberPaidAmount: 10.00,
    ndcCode: '00069-1530-30',
    drugClass: 'Calcium Channel Blocker',
    isGeneric: true,
    isMaintenance: true,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-003',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'Maintenance medication for blood pressure management. May cause ankle swelling — report to your provider if persistent.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-04-10T14:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00013',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845135',
    medicationName: 'Eliquis (Apixaban)',
    brandName: 'Eliquis',
    strength: '5 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth twice daily.',
    quantity: 60,
    daysSupply: 30,
    refillsRemaining: 5,
    refillsTotal: 11,
    lastFilledDate: '2024-05-10',
    nextRefillDate: '2024-06-03',
    expirationDate: '2025-05-10',
    status: 'active',
    tierNumber: 2,
    tierName: 'Tier 2 - Preferred Brand',
    copayAmount: '$35',
    planPaidAmount: 465.00,
    memberPaidAmount: 35.00,
    ndcCode: '00003-0894-21',
    drugClass: 'Direct Oral Anticoagulant (DOAC)',
    isGeneric: false,
    isMaintenance: true,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'Blood thinner for atrial fibrillation. Do not skip doses. Inform all healthcare providers that you are taking this medication.',
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2024-05-10T11:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00014',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845136',
    medicationName: 'Cyclobenzaprine HCl',
    brandName: 'Flexeril',
    strength: '10 mg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth three times daily as needed for muscle spasm. Do not exceed 3 tablets per day.',
    quantity: 21,
    daysSupply: 7,
    refillsRemaining: 0,
    refillsTotal: 0,
    lastFilledDate: '2024-05-15',
    nextRefillDate: null,
    expirationDate: '2024-11-15',
    status: 'discontinued',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 6.00,
    memberPaidAmount: 10.00,
    ndcCode: '00228-2057-11',
    drugClass: 'Skeletal Muscle Relaxant',
    isGeneric: true,
    isMaintenance: false,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: false,
    prescriber: {
      name: 'Dr. Angela Martinez, MD',
      specialty: 'Orthopedics',
      phone: '(555) 345-6789',
      npi: '6789012345',
    },
    pharmacyId: 'PHR-001',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'Short-term use for low back pain muscle spasm. May cause drowsiness — do not drive or operate machinery.',
    createdAt: '2024-05-15T11:00:00Z',
    updatedAt: '2024-05-22T08:00:00Z',
  },
  {
    prescriptionId: 'RX-2024-00015',
    memberId: 'HCP-2024-00042',
    rxNumber: 'RX7845137',
    medicationName: 'Levothyroxine Sodium',
    brandName: 'Synthroid',
    strength: '75 mcg',
    dosageForm: 'Tablet',
    directions: 'Take 1 tablet by mouth once daily on an empty stomach, 30-60 minutes before breakfast.',
    quantity: 90,
    daysSupply: 90,
    refillsRemaining: 3,
    refillsTotal: 5,
    lastFilledDate: '2024-04-15',
    nextRefillDate: '2024-07-08',
    expirationDate: '2025-04-15',
    status: 'active',
    tierNumber: 1,
    tierName: 'Tier 1 - Generic',
    copayAmount: '$10',
    planPaidAmount: 18.00,
    memberPaidAmount: 10.00,
    ndcCode: '00074-6624-13',
    drugClass: 'Thyroid Hormone',
    isGeneric: true,
    isMaintenance: true,
    isSpecialty: false,
    requiresPriorAuth: false,
    mailOrderEligible: true,
    prescriber: {
      name: 'Dr. Robert Smith, MD',
      specialty: 'Internal Medicine',
      phone: '(555) 234-5678',
      npi: '1234567890',
    },
    pharmacyId: 'PHR-003',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    notes: 'Maintenance medication for hypothyroidism. Take on empty stomach. Separate from calcium and iron supplements by 4 hours.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-04-15T09:30:00Z',
  },
];

// ===== Helper Functions =====

/**
 * Returns all prescriptions for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of prescription objects for the member
 */
export const getPrescriptionsByMemberId = (memberId) => {
  return prescriptionsData.filter((rx) => rx.memberId === memberId);
};

/**
 * Returns all active prescriptions for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of active prescription objects for the member
 */
export const getActivePrescriptionsByMemberId = (memberId) => {
  return prescriptionsData.filter((rx) => rx.memberId === memberId && rx.status === 'active');
};

/**
 * Returns a single prescription by its prescription ID.
 * @param {string} prescriptionId - The prescription identifier
 * @returns {Object|undefined} The prescription object or undefined if not found
 */
export const getPrescriptionById = (prescriptionId) => {
  return prescriptionsData.find((rx) => rx.prescriptionId === prescriptionId);
};

/**
 * Returns a single prescription by its pharmacy prescription number.
 * @param {string} rxNumber - The pharmacy prescription number
 * @returns {Object|undefined} The prescription object or undefined if not found
 */
export const getPrescriptionByRxNumber = (rxNumber) => {
  return prescriptionsData.find((rx) => rx.rxNumber === rxNumber);
};

/**
 * Returns prescriptions filtered by status for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} status - The prescription status to filter by ('active', 'expired', 'discontinued', 'on_hold')
 * @returns {Object[]} Array of prescription objects matching the status
 */
export const getPrescriptionsByStatus = (memberId, status) => {
  return prescriptionsData.filter(
    (rx) => rx.memberId === memberId && rx.status === status
  );
};

/**
 * Returns maintenance prescriptions for a given member.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of maintenance prescription objects for the member
 */
export const getMaintenancePrescriptions = (memberId) => {
  return prescriptionsData.filter(
    (rx) => rx.memberId === memberId && rx.isMaintenance && rx.status === 'active'
  );
};

/**
 * Returns prescriptions eligible for mail order for a given member.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of mail-order-eligible prescription objects for the member
 */
export const getMailOrderEligiblePrescriptions = (memberId) => {
  return prescriptionsData.filter(
    (rx) => rx.memberId === memberId && rx.mailOrderEligible && rx.status === 'active'
  );
};

/**
 * Returns prescriptions that need a refill soon (within the next 14 days) for a given member.
 * @param {string} memberId - The member identifier
 * @param {number} [withinDays=14] - Number of days to look ahead for upcoming refills
 * @returns {Object[]} Array of prescription objects due for refill soon
 */
export const getPrescriptionsDueForRefill = (memberId, withinDays = 14) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + withinDays);

  const todayStr = today.toISOString().split('T')[0];
  const futureDateStr = futureDate.toISOString().split('T')[0];

  return prescriptionsData.filter(
    (rx) =>
      rx.memberId === memberId &&
      rx.status === 'active' &&
      rx.refillsRemaining > 0 &&
      rx.nextRefillDate !== null &&
      rx.nextRefillDate >= todayStr &&
      rx.nextRefillDate <= futureDateStr
  );
};

/**
 * Returns prescriptions filtered by formulary tier for a given member.
 * @param {string} memberId - The member identifier
 * @param {number} tierNumber - The formulary tier number (1-4)
 * @returns {Object[]} Array of prescription objects matching the tier
 */
export const getPrescriptionsByTier = (memberId, tierNumber) => {
  return prescriptionsData.filter(
    (rx) => rx.memberId === memberId && rx.tierNumber === tierNumber
  );
};

/**
 * Returns prescriptions filtered by prescriber NPI for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} prescriberNpi - The prescriber NPI number
 * @returns {Object[]} Array of prescription objects from the specified prescriber
 */
export const getPrescriptionsByPrescriber = (memberId, prescriberNpi) => {
  return prescriptionsData.filter(
    (rx) => rx.memberId === memberId && rx.prescriber.npi === prescriberNpi
  );
};

/**
 * Returns prescriptions filled at a specific pharmacy for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} pharmacyId - The pharmacy identifier
 * @returns {Object[]} Array of prescription objects filled at the specified pharmacy
 */
export const getPrescriptionsByPharmacy = (memberId, pharmacyId) => {
  return prescriptionsData.filter(
    (rx) => rx.memberId === memberId && rx.pharmacyId === pharmacyId
  );
};

/**
 * Filters prescriptions by multiple criteria.
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.memberId] - Member ID to filter by
 * @param {string} [filters.status] - Prescription status to filter by ('active', 'expired', 'discontinued', 'on_hold')
 * @param {number} [filters.tierNumber] - Formulary tier number to filter by (1-4)
 * @param {boolean} [filters.isMaintenance] - Filter by maintenance medication flag
 * @param {boolean} [filters.isGeneric] - Filter by generic medication flag
 * @param {boolean} [filters.isSpecialty] - Filter by specialty medication flag
 * @param {boolean} [filters.mailOrderEligible] - Filter by mail order eligibility
 * @param {string} [filters.pharmacyId] - Pharmacy ID to filter by
 * @param {string} [filters.search] - Search term for medication name, brand name, or drug class (case-insensitive partial match)
 * @param {string} [filters.sortBy] - Sort field ('lastFilledDate', 'medicationName', 'nextRefillDate', 'tierNumber')
 * @param {string} [filters.sortOrder] - Sort order ('asc' or 'desc')
 * @returns {Object[]} Filtered and sorted array of prescription objects
 */
export const filterPrescriptions = (filters = {}) => {
  let results = [...prescriptionsData];

  if (filters.memberId) {
    results = results.filter((rx) => rx.memberId === filters.memberId);
  }

  if (filters.status) {
    results = results.filter((rx) => rx.status === filters.status);
  }

  if (filters.tierNumber !== undefined && filters.tierNumber !== null) {
    results = results.filter((rx) => rx.tierNumber === filters.tierNumber);
  }

  if (typeof filters.isMaintenance === 'boolean') {
    results = results.filter((rx) => rx.isMaintenance === filters.isMaintenance);
  }

  if (typeof filters.isGeneric === 'boolean') {
    results = results.filter((rx) => rx.isGeneric === filters.isGeneric);
  }

  if (typeof filters.isSpecialty === 'boolean') {
    results = results.filter((rx) => rx.isSpecialty === filters.isSpecialty);
  }

  if (typeof filters.mailOrderEligible === 'boolean') {
    results = results.filter((rx) => rx.mailOrderEligible === filters.mailOrderEligible);
  }

  if (filters.pharmacyId) {
    results = results.filter((rx) => rx.pharmacyId === filters.pharmacyId);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      (rx) =>
        rx.medicationName.toLowerCase().includes(searchLower) ||
        rx.brandName.toLowerCase().includes(searchLower) ||
        rx.drugClass.toLowerCase().includes(searchLower)
    );
  }

  const sortBy = filters.sortBy || 'lastFilledDate';
  const sortOrder = filters.sortOrder || 'desc';

  results.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (valA === null || valA === undefined) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (valB === null || valB === undefined) {
      return sortOrder === 'asc' ? 1 : -1;
    }

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
 * Returns all pharmacies.
 * @returns {Object[]} Array of pharmacy objects
 */
export const getPharmacies = () => {
  return [...pharmaciesData];
};

/**
 * Returns a single pharmacy by its pharmacy ID.
 * @param {string} pharmacyId - The pharmacy identifier
 * @returns {Object|undefined} The pharmacy object or undefined if not found
 */
export const getPharmacyById = (pharmacyId) => {
  return pharmaciesData.find((pharmacy) => pharmacy.pharmacyId === pharmacyId);
};

/**
 * Returns pharmacies filtered by type.
 * @param {string} type - The pharmacy type to filter by ('retail', 'mail_order', 'specialty')
 * @returns {Object[]} Array of pharmacy objects matching the type
 */
export const getPharmaciesByType = (type) => {
  return pharmaciesData.filter((pharmacy) => pharmacy.type === type);
};

/**
 * Returns preferred pharmacies.
 * @returns {Object[]} Array of preferred pharmacy objects
 */
export const getPreferredPharmacies = () => {
  return pharmaciesData.filter((pharmacy) => pharmacy.isPreferred);
};

/**
 * Returns all formulary tiers.
 * @returns {Object[]} Array of formulary tier objects
 */
export const getFormularyTiers = () => {
  return [...formularyTiers];
};

/**
 * Returns a single formulary tier by its tier number.
 * @param {number} tierNumber - The tier number (1-4)
 * @returns {Object|undefined} The formulary tier object or undefined if not found
 */
export const getFormularyTierByNumber = (tierNumber) => {
  return formularyTiers.find((tier) => tier.tierNumber === tierNumber);
};

/**
 * Returns a comprehensive prescriptions summary for a given member.
 * @param {string} memberId - The member identifier
 * @returns {Object} Summary object with counts, totals, and key prescription metrics
 */
export const getPrescriptionsSummary = (memberId) => {
  const memberPrescriptions = getPrescriptionsByMemberId(memberId);

  const statusCounts = {
    active: 0,
    expired: 0,
    discontinued: 0,
    on_hold: 0,
  };

  const tierCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  let totalMemberPaid = 0;
  let totalPlanPaid = 0;
  let maintenanceCount = 0;
  let genericCount = 0;
  let brandCount = 0;
  let specialtyCount = 0;
  let mailOrderEligibleCount = 0;
  let refillsDueCount = 0;

  const today = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(today.getDate() + 14);
  const todayStr = today.toISOString().split('T')[0];
  const twoWeeksStr = twoWeeksFromNow.toISOString().split('T')[0];

  memberPrescriptions.forEach((rx) => {
    if (statusCounts[rx.status] !== undefined) {
      statusCounts[rx.status] += 1;
    }

    if (tierCounts[rx.tierNumber] !== undefined) {
      tierCounts[rx.tierNumber] += 1;
    }

    totalMemberPaid += rx.memberPaidAmount;
    totalPlanPaid += rx.planPaidAmount;

    if (rx.isMaintenance && rx.status === 'active') {
      maintenanceCount += 1;
    }

    if (rx.isGeneric) {
      genericCount += 1;
    } else {
      brandCount += 1;
    }

    if (rx.isSpecialty) {
      specialtyCount += 1;
    }

    if (rx.mailOrderEligible && rx.status === 'active') {
      mailOrderEligibleCount += 1;
    }

    if (
      rx.status === 'active' &&
      rx.refillsRemaining > 0 &&
      rx.nextRefillDate !== null &&
      rx.nextRefillDate >= todayStr &&
      rx.nextRefillDate <= twoWeeksStr
    ) {
      refillsDueCount += 1;
    }
  });

  return {
    totalPrescriptions: memberPrescriptions.length,
    statusCounts,
    tierCounts,
    totalMemberPaid: Math.round(totalMemberPaid * 100) / 100,
    totalPlanPaid: Math.round(totalPlanPaid * 100) / 100,
    maintenanceCount,
    genericCount,
    brandCount,
    specialtyCount,
    mailOrderEligibleCount,
    refillsDueCount,
    totalPharmacies: pharmaciesData.length,
    preferredPharmacies: pharmaciesData.filter((p) => p.isPreferred).length,
  };
};