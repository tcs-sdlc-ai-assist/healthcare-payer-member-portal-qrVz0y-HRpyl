import { CLAIM_STATUS, CLAIM_TYPE } from '../constants/constants.js';

/**
 * Mock claims data fixture.
 * Used for development and testing of claims list, detail, and EOB features.
 *
 * @typedef {Object} ClaimLineItem
 * @property {string} lineItemId - Unique line item identifier
 * @property {string} procedureCode - CPT/HCPCS procedure code
 * @property {string} description - Procedure description
 * @property {number} billedAmount - Amount billed by provider
 * @property {number} allowedAmount - Amount allowed by plan
 * @property {number} paidAmount - Amount paid by plan
 * @property {number} memberResponsibility - Amount owed by member
 * @property {string} serviceDate - Date of service (YYYY-MM-DD)
 *
 * @typedef {Object} EOBReference
 * @property {string} documentId - Document identifier
 * @property {string} title - Document title
 * @property {string} category - Document category
 * @property {string} generatedDate - Date document was generated (YYYY-MM-DD)
 * @property {string} fileUrl - URL to the document file
 *
 * @typedef {Object} Claim
 * @property {string} claimId - Unique claim identifier
 * @property {string} claimNumber - Human-readable claim number
 * @property {string} memberId - Associated member identifier
 * @property {string} type - Claim type (MEDICAL, DENTAL, VISION, PHARMACY, etc.)
 * @property {string} status - Claim status (SUBMITTED, IN_REVIEW, APPROVED, DENIED, etc.)
 * @property {string} patient - Patient name
 * @property {string} provider - Provider name
 * @property {string} providerNPI - Provider NPI number
 * @property {number} billedAmount - Total billed amount
 * @property {number} allowedAmount - Total allowed amount
 * @property {number} paidAmount - Total amount paid by plan
 * @property {number} memberOwes - Total amount owed by member
 * @property {string} serviceDate - Primary date of service (YYYY-MM-DD)
 * @property {string} serviceDateEnd - End date of service if range (YYYY-MM-DD)
 * @property {string} receivedDate - Date claim was received (YYYY-MM-DD)
 * @property {string} processedDate - Date claim was processed (YYYY-MM-DD) or null
 * @property {string} diagnosisCode - Primary ICD-10 diagnosis code
 * @property {string} diagnosisDescription - Diagnosis description
 * @property {ClaimLineItem[]} lineItems - Claim line items
 * @property {EOBReference|null} eobDocument - EOB document reference or null
 * @property {string} notes - Additional notes
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 */

export const claimsData = [
  {
    claimId: 'CLM-2024-00001',
    claimNumber: 'CLM123456',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.MEDICAL,
    status: CLAIM_STATUS.APPROVED,
    patient: 'Jane Doe',
    provider: 'Dr. Robert Smith, MD',
    providerNPI: '1234567890',
    billedAmount: 1200.00,
    allowedAmount: 980.00,
    paidAmount: 780.00,
    memberOwes: 200.00,
    serviceDate: '2024-03-01',
    serviceDateEnd: '2024-03-01',
    receivedDate: '2024-03-05',
    processedDate: '2024-03-12',
    diagnosisCode: 'J06.9',
    diagnosisDescription: 'Acute upper respiratory infection, unspecified',
    lineItems: [
      {
        lineItemId: 'LI-001-01',
        procedureCode: '99213',
        description: 'Office visit, established patient, level 3',
        billedAmount: 250.00,
        allowedAmount: 200.00,
        paidAmount: 160.00,
        memberResponsibility: 40.00,
        serviceDate: '2024-03-01',
      },
      {
        lineItemId: 'LI-001-02',
        procedureCode: '87880',
        description: 'Strep test (rapid)',
        billedAmount: 75.00,
        allowedAmount: 60.00,
        paidAmount: 48.00,
        memberResponsibility: 12.00,
        serviceDate: '2024-03-01',
      },
      {
        lineItemId: 'LI-001-03',
        procedureCode: '71046',
        description: 'Chest X-ray, 2 views',
        billedAmount: 875.00,
        allowedAmount: 720.00,
        paidAmount: 572.00,
        memberResponsibility: 148.00,
        serviceDate: '2024-03-01',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00001',
      title: 'EOB - Claim CLM123456',
      category: 'EOB',
      generatedDate: '2024-03-13',
      fileUrl: '/documents/eob/EOB_CLM123456.pdf',
    },
    notes: '',
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-12T14:30:00Z',
  },
  {
    claimId: 'CLM-2024-00002',
    claimNumber: 'CLM123457',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.DENTAL,
    status: CLAIM_STATUS.APPROVED,
    patient: 'Jane Doe',
    provider: 'Dr. Lisa Chen, DDS',
    providerNPI: '2345678901',
    billedAmount: 450.00,
    allowedAmount: 400.00,
    paidAmount: 320.00,
    memberOwes: 80.00,
    serviceDate: '2024-02-15',
    serviceDateEnd: '2024-02-15',
    receivedDate: '2024-02-20',
    processedDate: '2024-02-28',
    diagnosisCode: 'K02.9',
    diagnosisDescription: 'Dental caries, unspecified',
    lineItems: [
      {
        lineItemId: 'LI-002-01',
        procedureCode: 'D0120',
        description: 'Periodic oral evaluation',
        billedAmount: 65.00,
        allowedAmount: 55.00,
        paidAmount: 44.00,
        memberResponsibility: 11.00,
        serviceDate: '2024-02-15',
      },
      {
        lineItemId: 'LI-002-02',
        procedureCode: 'D0274',
        description: 'Bitewings - four radiographic images',
        billedAmount: 85.00,
        allowedAmount: 75.00,
        paidAmount: 60.00,
        memberResponsibility: 15.00,
        serviceDate: '2024-02-15',
      },
      {
        lineItemId: 'LI-002-03',
        procedureCode: 'D1110',
        description: 'Prophylaxis - adult cleaning',
        billedAmount: 130.00,
        allowedAmount: 120.00,
        paidAmount: 96.00,
        memberResponsibility: 24.00,
        serviceDate: '2024-02-15',
      },
      {
        lineItemId: 'LI-002-04',
        procedureCode: 'D2391',
        description: 'Resin-based composite, one surface, posterior',
        billedAmount: 170.00,
        allowedAmount: 150.00,
        paidAmount: 120.00,
        memberResponsibility: 30.00,
        serviceDate: '2024-02-15',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00002',
      title: 'EOB - Claim CLM123457',
      category: 'EOB',
      generatedDate: '2024-03-01',
      fileUrl: '/documents/eob/EOB_CLM123457.pdf',
    },
    notes: '',
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-02-28T11:45:00Z',
  },
  {
    claimId: 'CLM-2024-00003',
    claimNumber: 'CLM123458',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.VISION,
    status: CLAIM_STATUS.APPROVED,
    patient: 'Jane Doe',
    provider: 'Dr. Michael Torres, OD',
    providerNPI: '3456789012',
    billedAmount: 385.00,
    allowedAmount: 340.00,
    paidAmount: 255.00,
    memberOwes: 85.00,
    serviceDate: '2024-01-20',
    serviceDateEnd: '2024-01-20',
    receivedDate: '2024-01-25',
    processedDate: '2024-02-01',
    diagnosisCode: 'H52.1',
    diagnosisDescription: 'Myopia',
    lineItems: [
      {
        lineItemId: 'LI-003-01',
        procedureCode: '92004',
        description: 'Comprehensive eye exam, new patient',
        billedAmount: 185.00,
        allowedAmount: 160.00,
        paidAmount: 128.00,
        memberResponsibility: 32.00,
        serviceDate: '2024-01-20',
      },
      {
        lineItemId: 'LI-003-02',
        procedureCode: '92015',
        description: 'Refraction determination',
        billedAmount: 50.00,
        allowedAmount: 45.00,
        paidAmount: 30.00,
        memberResponsibility: 15.00,
        serviceDate: '2024-01-20',
      },
      {
        lineItemId: 'LI-003-03',
        procedureCode: 'V2020',
        description: 'Frames, purchases',
        billedAmount: 150.00,
        allowedAmount: 135.00,
        paidAmount: 97.00,
        memberResponsibility: 38.00,
        serviceDate: '2024-01-20',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00003',
      title: 'EOB - Claim CLM123458',
      category: 'EOB',
      generatedDate: '2024-02-02',
      fileUrl: '/documents/eob/EOB_CLM123458.pdf',
    },
    notes: '',
    createdAt: '2024-01-25T08:30:00Z',
    updatedAt: '2024-02-01T16:00:00Z',
  },
  {
    claimId: 'CLM-2024-00004',
    claimNumber: 'CLM123459',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.PHARMACY,
    status: CLAIM_STATUS.APPROVED,
    patient: 'Jane Doe',
    provider: 'Walgreens Pharmacy #4521',
    providerNPI: '4567890123',
    billedAmount: 145.00,
    allowedAmount: 125.00,
    paidAmount: 100.00,
    memberOwes: 25.00,
    serviceDate: '2024-04-10',
    serviceDateEnd: '2024-04-10',
    receivedDate: '2024-04-10',
    processedDate: '2024-04-12',
    diagnosisCode: 'E11.9',
    diagnosisDescription: 'Type 2 diabetes mellitus without complications',
    lineItems: [
      {
        lineItemId: 'LI-004-01',
        procedureCode: 'NDC-00002-4462',
        description: 'Metformin HCl 500mg tablets, 90-day supply',
        billedAmount: 45.00,
        allowedAmount: 38.00,
        paidAmount: 28.00,
        memberResponsibility: 10.00,
        serviceDate: '2024-04-10',
      },
      {
        lineItemId: 'LI-004-02',
        procedureCode: 'NDC-00078-0587',
        description: 'Lisinopril 10mg tablets, 90-day supply',
        billedAmount: 55.00,
        allowedAmount: 48.00,
        paidAmount: 38.00,
        memberResponsibility: 10.00,
        serviceDate: '2024-04-10',
      },
      {
        lineItemId: 'LI-004-03',
        procedureCode: 'NDC-00071-0155',
        description: 'Atorvastatin 20mg tablets, 30-day supply',
        billedAmount: 45.00,
        allowedAmount: 39.00,
        paidAmount: 34.00,
        memberResponsibility: 5.00,
        serviceDate: '2024-04-10',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00004',
      title: 'EOB - Claim CLM123459',
      category: 'EOB',
      generatedDate: '2024-04-13',
      fileUrl: '/documents/eob/EOB_CLM123459.pdf',
    },
    notes: '',
    createdAt: '2024-04-10T14:00:00Z',
    updatedAt: '2024-04-12T09:20:00Z',
  },
  {
    claimId: 'CLM-2024-00005',
    claimNumber: 'CLM123460',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.MEDICAL,
    status: CLAIM_STATUS.IN_REVIEW,
    patient: 'Jane Doe',
    provider: 'Springfield General Hospital',
    providerNPI: '5678901234',
    billedAmount: 4850.00,
    allowedAmount: 0.00,
    paidAmount: 0.00,
    memberOwes: 0.00,
    serviceDate: '2024-05-15',
    serviceDateEnd: '2024-05-15',
    receivedDate: '2024-05-20',
    processedDate: null,
    diagnosisCode: 'M54.5',
    diagnosisDescription: 'Low back pain',
    lineItems: [
      {
        lineItemId: 'LI-005-01',
        procedureCode: '99283',
        description: 'Emergency department visit, moderate severity',
        billedAmount: 1500.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-05-15',
      },
      {
        lineItemId: 'LI-005-02',
        procedureCode: '72148',
        description: 'MRI lumbar spine without contrast',
        billedAmount: 2800.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-05-15',
      },
      {
        lineItemId: 'LI-005-03',
        procedureCode: '96372',
        description: 'Therapeutic injection, subcutaneous or intramuscular',
        billedAmount: 550.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-05-15',
      },
    ],
    eobDocument: null,
    notes: 'Claim is currently under review. Additional documentation may be requested.',
    createdAt: '2024-05-20T11:00:00Z',
    updatedAt: '2024-05-22T08:00:00Z',
  },
  {
    claimId: 'CLM-2024-00006',
    claimNumber: 'CLM123461',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.MEDICAL,
    status: CLAIM_STATUS.DENIED,
    patient: 'Jane Doe',
    provider: 'Dr. Angela Martinez, MD',
    providerNPI: '6789012345',
    billedAmount: 3200.00,
    allowedAmount: 0.00,
    paidAmount: 0.00,
    memberOwes: 3200.00,
    serviceDate: '2024-04-22',
    serviceDateEnd: '2024-04-22',
    receivedDate: '2024-04-28',
    processedDate: '2024-05-05',
    diagnosisCode: 'M79.3',
    diagnosisDescription: 'Panniculitis, unspecified',
    lineItems: [
      {
        lineItemId: 'LI-006-01',
        procedureCode: '99214',
        description: 'Office visit, established patient, level 4',
        billedAmount: 350.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 350.00,
        serviceDate: '2024-04-22',
      },
      {
        lineItemId: 'LI-006-02',
        procedureCode: '76942',
        description: 'Ultrasonic guidance for needle placement',
        billedAmount: 850.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 850.00,
        serviceDate: '2024-04-22',
      },
      {
        lineItemId: 'LI-006-03',
        procedureCode: '20610',
        description: 'Arthrocentesis, aspiration and/or injection, major joint',
        billedAmount: 2000.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 2000.00,
        serviceDate: '2024-04-22',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00006',
      title: 'EOB - Claim CLM123461',
      category: 'EOB',
      generatedDate: '2024-05-06',
      fileUrl: '/documents/eob/EOB_CLM123461.pdf',
    },
    notes: 'Denied: Prior authorization was not obtained. You may file an appeal within 180 days.',
    createdAt: '2024-04-28T13:00:00Z',
    updatedAt: '2024-05-05T10:15:00Z',
  },
  {
    claimId: 'CLM-2024-00007',
    claimNumber: 'CLM123462',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.BEHAVIORAL_HEALTH,
    status: CLAIM_STATUS.APPROVED,
    patient: 'Jane Doe',
    provider: 'Dr. Sarah Kim, PhD',
    providerNPI: '7890123456',
    billedAmount: 200.00,
    allowedAmount: 180.00,
    paidAmount: 144.00,
    memberOwes: 36.00,
    serviceDate: '2024-05-01',
    serviceDateEnd: '2024-05-01',
    receivedDate: '2024-05-05',
    processedDate: '2024-05-10',
    diagnosisCode: 'F41.1',
    diagnosisDescription: 'Generalized anxiety disorder',
    lineItems: [
      {
        lineItemId: 'LI-007-01',
        procedureCode: '90834',
        description: 'Psychotherapy, 45 minutes',
        billedAmount: 200.00,
        allowedAmount: 180.00,
        paidAmount: 144.00,
        memberResponsibility: 36.00,
        serviceDate: '2024-05-01',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00007',
      title: 'EOB - Claim CLM123462',
      category: 'EOB',
      generatedDate: '2024-05-11',
      fileUrl: '/documents/eob/EOB_CLM123462.pdf',
    },
    notes: '',
    createdAt: '2024-05-05T09:00:00Z',
    updatedAt: '2024-05-10T15:30:00Z',
  },
  {
    claimId: 'CLM-2024-00008',
    claimNumber: 'CLM123463',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.LAB,
    status: CLAIM_STATUS.APPROVED,
    patient: 'Jane Doe',
    provider: 'Quest Diagnostics',
    providerNPI: '8901234567',
    billedAmount: 520.00,
    allowedAmount: 410.00,
    paidAmount: 370.00,
    memberOwes: 40.00,
    serviceDate: '2024-03-15',
    serviceDateEnd: '2024-03-15',
    receivedDate: '2024-03-18',
    processedDate: '2024-03-25',
    diagnosisCode: 'Z00.00',
    diagnosisDescription: 'Encounter for general adult medical examination without abnormal findings',
    lineItems: [
      {
        lineItemId: 'LI-008-01',
        procedureCode: '80053',
        description: 'Comprehensive metabolic panel',
        billedAmount: 120.00,
        allowedAmount: 95.00,
        paidAmount: 85.00,
        memberResponsibility: 10.00,
        serviceDate: '2024-03-15',
      },
      {
        lineItemId: 'LI-008-02',
        procedureCode: '85025',
        description: 'Complete blood count (CBC) with differential',
        billedAmount: 80.00,
        allowedAmount: 65.00,
        paidAmount: 58.00,
        memberResponsibility: 7.00,
        serviceDate: '2024-03-15',
      },
      {
        lineItemId: 'LI-008-03',
        procedureCode: '83036',
        description: 'Hemoglobin A1c',
        billedAmount: 95.00,
        allowedAmount: 78.00,
        paidAmount: 70.00,
        memberResponsibility: 8.00,
        serviceDate: '2024-03-15',
      },
      {
        lineItemId: 'LI-008-04',
        procedureCode: '80061',
        description: 'Lipid panel',
        billedAmount: 110.00,
        allowedAmount: 88.00,
        paidAmount: 80.00,
        memberResponsibility: 8.00,
        serviceDate: '2024-03-15',
      },
      {
        lineItemId: 'LI-008-05',
        procedureCode: '84443',
        description: 'Thyroid stimulating hormone (TSH)',
        billedAmount: 115.00,
        allowedAmount: 84.00,
        paidAmount: 77.00,
        memberResponsibility: 7.00,
        serviceDate: '2024-03-15',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00008',
      title: 'EOB - Claim CLM123463',
      category: 'EOB',
      generatedDate: '2024-03-26',
      fileUrl: '/documents/eob/EOB_CLM123463.pdf',
    },
    notes: '',
    createdAt: '2024-03-18T07:45:00Z',
    updatedAt: '2024-03-25T12:00:00Z',
  },
  {
    claimId: 'CLM-2024-00009',
    claimNumber: 'CLM123464',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.EMERGENCY,
    status: CLAIM_STATUS.PARTIALLY_APPROVED,
    patient: 'Jane Doe',
    provider: 'Springfield Memorial ER',
    providerNPI: '9012345678',
    billedAmount: 8750.00,
    allowedAmount: 6200.00,
    paidAmount: 5580.00,
    memberOwes: 620.00,
    serviceDate: '2024-01-08',
    serviceDateEnd: '2024-01-08',
    receivedDate: '2024-01-15',
    processedDate: '2024-01-28',
    diagnosisCode: 'R10.9',
    diagnosisDescription: 'Unspecified abdominal pain',
    lineItems: [
      {
        lineItemId: 'LI-009-01',
        procedureCode: '99284',
        description: 'Emergency department visit, high severity',
        billedAmount: 2500.00,
        allowedAmount: 1800.00,
        paidAmount: 1620.00,
        memberResponsibility: 180.00,
        serviceDate: '2024-01-08',
      },
      {
        lineItemId: 'LI-009-02',
        procedureCode: '74177',
        description: 'CT abdomen and pelvis with contrast',
        billedAmount: 3500.00,
        allowedAmount: 2400.00,
        paidAmount: 2160.00,
        memberResponsibility: 240.00,
        serviceDate: '2024-01-08',
      },
      {
        lineItemId: 'LI-009-03',
        procedureCode: '36415',
        description: 'Collection of venous blood by venipuncture',
        billedAmount: 50.00,
        allowedAmount: 40.00,
        paidAmount: 36.00,
        memberResponsibility: 4.00,
        serviceDate: '2024-01-08',
      },
      {
        lineItemId: 'LI-009-04',
        procedureCode: '96374',
        description: 'IV push, single or initial substance/drug',
        billedAmount: 700.00,
        allowedAmount: 560.00,
        paidAmount: 504.00,
        memberResponsibility: 56.00,
        serviceDate: '2024-01-08',
      },
      {
        lineItemId: 'LI-009-05',
        procedureCode: '80053',
        description: 'Comprehensive metabolic panel',
        billedAmount: 2000.00,
        allowedAmount: 1400.00,
        paidAmount: 1260.00,
        memberResponsibility: 140.00,
        serviceDate: '2024-01-08',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00009',
      title: 'EOB - Claim CLM123464',
      category: 'EOB',
      generatedDate: '2024-01-29',
      fileUrl: '/documents/eob/EOB_CLM123464.pdf',
    },
    notes: 'Partially approved: Out-of-network facility surcharge not covered.',
    createdAt: '2024-01-15T16:30:00Z',
    updatedAt: '2024-01-28T14:00:00Z',
  },
  {
    claimId: 'CLM-2024-00010',
    claimNumber: 'CLM123465',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.PREVENTIVE,
    status: CLAIM_STATUS.APPROVED,
    patient: 'Jane Doe',
    provider: 'Dr. Robert Smith, MD',
    providerNPI: '1234567890',
    billedAmount: 350.00,
    allowedAmount: 350.00,
    paidAmount: 350.00,
    memberOwes: 0.00,
    serviceDate: '2024-02-01',
    serviceDateEnd: '2024-02-01',
    receivedDate: '2024-02-05',
    processedDate: '2024-02-10',
    diagnosisCode: 'Z00.00',
    diagnosisDescription: 'Encounter for general adult medical examination without abnormal findings',
    lineItems: [
      {
        lineItemId: 'LI-010-01',
        procedureCode: '99395',
        description: 'Preventive visit, established patient, 18-39 years',
        billedAmount: 275.00,
        allowedAmount: 275.00,
        paidAmount: 275.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-02-01',
      },
      {
        lineItemId: 'LI-010-02',
        procedureCode: '90471',
        description: 'Immunization administration',
        billedAmount: 25.00,
        allowedAmount: 25.00,
        paidAmount: 25.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-02-01',
      },
      {
        lineItemId: 'LI-010-03',
        procedureCode: '90686',
        description: 'Influenza vaccine, quadrivalent',
        billedAmount: 50.00,
        allowedAmount: 50.00,
        paidAmount: 50.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-02-01',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00010',
      title: 'EOB - Claim CLM123465',
      category: 'EOB',
      generatedDate: '2024-02-11',
      fileUrl: '/documents/eob/EOB_CLM123465.pdf',
    },
    notes: 'Preventive care — covered at 100% with no member cost share.',
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
  {
    claimId: 'CLM-2024-00011',
    claimNumber: 'CLM123466',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.MEDICAL,
    status: CLAIM_STATUS.SUBMITTED,
    patient: 'Jane Doe',
    provider: 'Springfield Orthopedic Associates',
    providerNPI: '0123456789',
    billedAmount: 1650.00,
    allowedAmount: 0.00,
    paidAmount: 0.00,
    memberOwes: 0.00,
    serviceDate: '2024-06-01',
    serviceDateEnd: '2024-06-01',
    receivedDate: '2024-06-03',
    processedDate: null,
    diagnosisCode: 'M25.511',
    diagnosisDescription: 'Pain in right shoulder',
    lineItems: [
      {
        lineItemId: 'LI-011-01',
        procedureCode: '99203',
        description: 'Office visit, new patient, level 3',
        billedAmount: 300.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-06-01',
      },
      {
        lineItemId: 'LI-011-02',
        procedureCode: '73221',
        description: 'MRI shoulder without contrast',
        billedAmount: 1350.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-06-01',
      },
    ],
    eobDocument: null,
    notes: 'Claim has been submitted and is awaiting processing.',
    createdAt: '2024-06-03T08:00:00Z',
    updatedAt: '2024-06-03T08:00:00Z',
  },
  {
    claimId: 'CLM-2024-00012',
    claimNumber: 'CLM123467',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.MEDICAL,
    status: CLAIM_STATUS.PENDING_INFO,
    patient: 'Jane Doe',
    provider: 'Dr. James Wilson, MD',
    providerNPI: '1122334455',
    billedAmount: 2100.00,
    allowedAmount: 0.00,
    paidAmount: 0.00,
    memberOwes: 0.00,
    serviceDate: '2024-05-20',
    serviceDateEnd: '2024-05-20',
    receivedDate: '2024-05-25',
    processedDate: null,
    diagnosisCode: 'L70.0',
    diagnosisDescription: 'Acne vulgaris',
    lineItems: [
      {
        lineItemId: 'LI-012-01',
        procedureCode: '99214',
        description: 'Office visit, established patient, level 4',
        billedAmount: 350.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-05-20',
      },
      {
        lineItemId: 'LI-012-02',
        procedureCode: '11102',
        description: 'Tangential biopsy of skin, single lesion',
        billedAmount: 750.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-05-20',
      },
      {
        lineItemId: 'LI-012-03',
        procedureCode: '88305',
        description: 'Surgical pathology, gross and microscopic examination',
        billedAmount: 1000.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 0.00,
        serviceDate: '2024-05-20',
      },
    ],
    eobDocument: null,
    notes: 'Additional information requested from provider. Please allow 10-15 business days for processing.',
    createdAt: '2024-05-25T14:00:00Z',
    updatedAt: '2024-05-30T09:00:00Z',
  },
  {
    claimId: 'CLM-2024-00013',
    claimNumber: 'CLM123468',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.DENTAL,
    status: CLAIM_STATUS.APPEALED,
    patient: 'Jane Doe',
    provider: 'Dr. Lisa Chen, DDS',
    providerNPI: '2345678901',
    billedAmount: 2800.00,
    allowedAmount: 0.00,
    paidAmount: 0.00,
    memberOwes: 2800.00,
    serviceDate: '2024-03-10',
    serviceDateEnd: '2024-03-10',
    receivedDate: '2024-03-15',
    processedDate: '2024-03-22',
    diagnosisCode: 'K08.1',
    diagnosisDescription: 'Complete loss of teeth due to trauma',
    lineItems: [
      {
        lineItemId: 'LI-013-01',
        procedureCode: 'D6010',
        description: 'Surgical placement of implant body, endosteal',
        billedAmount: 2200.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 2200.00,
        serviceDate: '2024-03-10',
      },
      {
        lineItemId: 'LI-013-02',
        procedureCode: 'D6056',
        description: 'Prefabricated abutment',
        billedAmount: 600.00,
        allowedAmount: 0.00,
        paidAmount: 0.00,
        memberResponsibility: 600.00,
        serviceDate: '2024-03-10',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00013',
      title: 'EOB - Claim CLM123468',
      category: 'EOB',
      generatedDate: '2024-03-23',
      fileUrl: '/documents/eob/EOB_CLM123468.pdf',
    },
    notes: 'Claim was denied as dental implants are not covered under current plan. Appeal filed on 2024-04-01.',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-04-01T16:00:00Z',
  },
  {
    claimId: 'CLM-2024-00014',
    claimNumber: 'CLM123469',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.PHARMACY,
    status: CLAIM_STATUS.CLOSED,
    patient: 'Jane Doe',
    provider: 'CVS Pharmacy #7832',
    providerNPI: '5566778899',
    billedAmount: 320.00,
    allowedAmount: 280.00,
    paidAmount: 240.00,
    memberOwes: 40.00,
    serviceDate: '2023-12-15',
    serviceDateEnd: '2023-12-15',
    receivedDate: '2023-12-15',
    processedDate: '2023-12-18',
    diagnosisCode: 'J30.1',
    diagnosisDescription: 'Allergic rhinitis due to pollen',
    lineItems: [
      {
        lineItemId: 'LI-014-01',
        procedureCode: 'NDC-00085-1334',
        description: 'Fluticasone propionate nasal spray, 120 metered sprays',
        billedAmount: 180.00,
        allowedAmount: 155.00,
        paidAmount: 130.00,
        memberResponsibility: 25.00,
        serviceDate: '2023-12-15',
      },
      {
        lineItemId: 'LI-014-02',
        procedureCode: 'NDC-00173-0682',
        description: 'Cetirizine HCl 10mg tablets, 90-day supply',
        billedAmount: 140.00,
        allowedAmount: 125.00,
        paidAmount: 110.00,
        memberResponsibility: 15.00,
        serviceDate: '2023-12-15',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00014',
      title: 'EOB - Claim CLM123469',
      category: 'EOB',
      generatedDate: '2023-12-19',
      fileUrl: '/documents/eob/EOB_CLM123469.pdf',
    },
    notes: 'Claim processed and closed.',
    createdAt: '2023-12-15T11:00:00Z',
    updatedAt: '2023-12-18T15:00:00Z',
  },
  {
    claimId: 'CLM-2024-00015',
    claimNumber: 'CLM123470',
    memberId: 'HCP-2024-00042',
    type: CLAIM_TYPE.MEDICAL,
    status: CLAIM_STATUS.APPROVED,
    patient: 'Jane Doe',
    provider: 'Springfield Women\'s Health Center',
    providerNPI: '6677889900',
    billedAmount: 475.00,
    allowedAmount: 420.00,
    paidAmount: 336.00,
    memberOwes: 84.00,
    serviceDate: '2024-04-05',
    serviceDateEnd: '2024-04-05',
    receivedDate: '2024-04-08',
    processedDate: '2024-04-15',
    diagnosisCode: 'Z01.419',
    diagnosisDescription: 'Encounter for gynecological examination without abnormal findings',
    lineItems: [
      {
        lineItemId: 'LI-015-01',
        procedureCode: '99213',
        description: 'Office visit, established patient, level 3',
        billedAmount: 250.00,
        allowedAmount: 220.00,
        paidAmount: 176.00,
        memberResponsibility: 44.00,
        serviceDate: '2024-04-05',
      },
      {
        lineItemId: 'LI-015-02',
        procedureCode: '76830',
        description: 'Ultrasound, transvaginal',
        billedAmount: 225.00,
        allowedAmount: 200.00,
        paidAmount: 160.00,
        memberResponsibility: 40.00,
        serviceDate: '2024-04-05',
      },
    ],
    eobDocument: {
      documentId: 'DOC-EOB-00015',
      title: 'EOB - Claim CLM123470',
      category: 'EOB',
      generatedDate: '2024-04-16',
      fileUrl: '/documents/eob/EOB_CLM123470.pdf',
    },
    notes: '',
    createdAt: '2024-04-08T09:30:00Z',
    updatedAt: '2024-04-15T13:00:00Z',
  },
];

/**
 * Returns all claims for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of claim objects for the member
 */
export const getClaimsByMemberId = (memberId) => {
  return claimsData.filter((claim) => claim.memberId === memberId);
};

/**
 * Returns a single claim by its claim ID.
 * @param {string} claimId - The claim identifier
 * @returns {Object|undefined} The claim object or undefined if not found
 */
export const getClaimById = (claimId) => {
  return claimsData.find((claim) => claim.claimId === claimId);
};

/**
 * Returns a single claim by its human-readable claim number.
 * @param {string} claimNumber - The claim number
 * @returns {Object|undefined} The claim object or undefined if not found
 */
export const getClaimByNumber = (claimNumber) => {
  return claimsData.find((claim) => claim.claimNumber === claimNumber);
};

/**
 * Filters claims by type, status, date range, and patient name.
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.memberId] - Member ID to filter by
 * @param {string} [filters.type] - Claim type to filter by
 * @param {string} [filters.status] - Claim status to filter by
 * @param {string} [filters.dateFrom] - Start date (YYYY-MM-DD) for service date range
 * @param {string} [filters.dateTo] - End date (YYYY-MM-DD) for service date range
 * @param {string} [filters.patient] - Patient name (case-insensitive partial match)
 * @param {string} [filters.sortBy] - Sort field ('serviceDate', 'billedAmount', 'status')
 * @param {string} [filters.sortOrder] - Sort order ('asc' or 'desc')
 * @returns {Object[]} Filtered and sorted array of claim objects
 */
export const filterClaims = (filters = {}) => {
  let results = [...claimsData];

  if (filters.memberId) {
    results = results.filter((claim) => claim.memberId === filters.memberId);
  }

  if (filters.type) {
    results = results.filter((claim) => claim.type === filters.type);
  }

  if (filters.status) {
    results = results.filter((claim) => claim.status === filters.status);
  }

  if (filters.dateFrom) {
    results = results.filter((claim) => claim.serviceDate >= filters.dateFrom);
  }

  if (filters.dateTo) {
    results = results.filter((claim) => claim.serviceDate <= filters.dateTo);
  }

  if (filters.patient) {
    const patientLower = filters.patient.toLowerCase();
    results = results.filter((claim) => claim.patient.toLowerCase().includes(patientLower));
  }

  const sortBy = filters.sortBy || 'serviceDate';
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
 * Returns summary statistics for a member's claims.
 * @param {string} memberId - The member identifier
 * @returns {Object} Summary object with totalClaims, totalBilled, totalPaid, totalOwed, and statusCounts
 */
export const getClaimsSummary = (memberId) => {
  const memberClaims = getClaimsByMemberId(memberId);

  const statusCounts = {};
  Object.values(CLAIM_STATUS).forEach((status) => {
    statusCounts[status] = 0;
  });

  let totalBilled = 0;
  let totalPaid = 0;
  let totalOwed = 0;

  memberClaims.forEach((claim) => {
    totalBilled += claim.billedAmount;
    totalPaid += claim.paidAmount;
    totalOwed += claim.memberOwes;
    if (statusCounts[claim.status] !== undefined) {
      statusCounts[claim.status] += 1;
    }
  });

  return {
    totalClaims: memberClaims.length,
    totalBilled: Math.round(totalBilled * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalOwed: Math.round(totalOwed * 100) / 100,
    statusCounts,
  };
};