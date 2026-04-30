import { DOCUMENT_CATEGORY, DOCUMENT_CATEGORY_LABELS } from '../constants/constants.js';

/**
 * Mock documents data fixture.
 * Used for development and testing of document center features including listing, filtering, and download.
 *
 * @typedef {Object} Document
 * @property {string} documentId - Unique document identifier
 * @property {string} memberId - Associated member identifier
 * @property {string} title - Document title
 * @property {string} category - Document category (EOB, ID_CARD, PLAN_DOCUMENTS, CORRESPONDENCE, TAX_FORMS, PRIOR_AUTH, APPEALS, OTHER)
 * @property {string} categoryLabel - Human-readable category label
 * @property {string} description - Brief description of the document
 * @property {string} dateCreated - Date document was created (YYYY-MM-DD)
 * @property {string} dateModified - Date document was last modified (YYYY-MM-DD)
 * @property {string} fileUrl - URL to the document file
 * @property {string} fileName - File name for download
 * @property {string} fileType - MIME type of the document
 * @property {number} fileSize - File size in bytes
 * @property {string} fileSizeDisplay - Human-readable file size
 * @property {string} status - Document status (available, archived, pending)
 * @property {string|null} relatedClaimId - Related claim ID if applicable
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 */

export const documentsData = [
  {
    documentId: 'DOC-EOB-00001',
    memberId: 'HCP-2024-00042',
    title: 'EOB - Claim CLM123456',
    category: DOCUMENT_CATEGORY.EOB,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.EOB],
    description: 'Explanation of Benefits for office visit and diagnostic services on 03/01/2024.',
    dateCreated: '2024-03-13',
    dateModified: '2024-03-13',
    fileUrl: '/documents/eob/EOB_CLM123456.pdf',
    fileName: 'EOB_CLM123456.pdf',
    fileType: 'application/pdf',
    fileSize: 245760,
    fileSizeDisplay: '240 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00001',
    createdAt: '2024-03-13T10:00:00Z',
    updatedAt: '2024-03-13T10:00:00Z',
  },
  {
    documentId: 'DOC-EOB-00002',
    memberId: 'HCP-2024-00042',
    title: 'EOB - Claim CLM123457',
    category: DOCUMENT_CATEGORY.EOB,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.EOB],
    description: 'Explanation of Benefits for dental services on 02/15/2024.',
    dateCreated: '2024-03-01',
    dateModified: '2024-03-01',
    fileUrl: '/documents/eob/EOB_CLM123457.pdf',
    fileName: 'EOB_CLM123457.pdf',
    fileType: 'application/pdf',
    fileSize: 198450,
    fileSizeDisplay: '194 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00002',
    createdAt: '2024-03-01T11:45:00Z',
    updatedAt: '2024-03-01T11:45:00Z',
  },
  {
    documentId: 'DOC-EOB-00003',
    memberId: 'HCP-2024-00042',
    title: 'EOB - Claim CLM123458',
    category: DOCUMENT_CATEGORY.EOB,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.EOB],
    description: 'Explanation of Benefits for vision exam and eyewear on 01/20/2024.',
    dateCreated: '2024-02-02',
    dateModified: '2024-02-02',
    fileUrl: '/documents/eob/EOB_CLM123458.pdf',
    fileName: 'EOB_CLM123458.pdf',
    fileType: 'application/pdf',
    fileSize: 175300,
    fileSizeDisplay: '171 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00003',
    createdAt: '2024-02-02T16:00:00Z',
    updatedAt: '2024-02-02T16:00:00Z',
  },
  {
    documentId: 'DOC-EOB-00004',
    memberId: 'HCP-2024-00042',
    title: 'EOB - Claim CLM123459',
    category: DOCUMENT_CATEGORY.EOB,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.EOB],
    description: 'Explanation of Benefits for pharmacy prescriptions on 04/10/2024.',
    dateCreated: '2024-04-13',
    dateModified: '2024-04-13',
    fileUrl: '/documents/eob/EOB_CLM123459.pdf',
    fileName: 'EOB_CLM123459.pdf',
    fileType: 'application/pdf',
    fileSize: 156200,
    fileSizeDisplay: '153 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00004',
    createdAt: '2024-04-13T09:20:00Z',
    updatedAt: '2024-04-13T09:20:00Z',
  },
  {
    documentId: 'DOC-EOB-00006',
    memberId: 'HCP-2024-00042',
    title: 'EOB - Claim CLM123461',
    category: DOCUMENT_CATEGORY.EOB,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.EOB],
    description: 'Explanation of Benefits for denied claim on 04/22/2024. Prior authorization not obtained.',
    dateCreated: '2024-05-06',
    dateModified: '2024-05-06',
    fileUrl: '/documents/eob/EOB_CLM123461.pdf',
    fileName: 'EOB_CLM123461.pdf',
    fileType: 'application/pdf',
    fileSize: 210500,
    fileSizeDisplay: '206 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00006',
    createdAt: '2024-05-06T10:15:00Z',
    updatedAt: '2024-05-06T10:15:00Z',
  },
  {
    documentId: 'DOC-EOB-00009',
    memberId: 'HCP-2024-00042',
    title: 'EOB - Claim CLM123464',
    category: DOCUMENT_CATEGORY.EOB,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.EOB],
    description: 'Explanation of Benefits for emergency room visit on 01/08/2024. Partially approved.',
    dateCreated: '2024-01-29',
    dateModified: '2024-01-29',
    fileUrl: '/documents/eob/EOB_CLM123464.pdf',
    fileName: 'EOB_CLM123464.pdf',
    fileType: 'application/pdf',
    fileSize: 312400,
    fileSizeDisplay: '305 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00009',
    createdAt: '2024-01-29T14:00:00Z',
    updatedAt: '2024-01-29T14:00:00Z',
  },
  {
    documentId: 'DOC-EOB-00010',
    memberId: 'HCP-2024-00042',
    title: 'EOB - Claim CLM123465',
    category: DOCUMENT_CATEGORY.EOB,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.EOB],
    description: 'Explanation of Benefits for preventive care visit on 02/01/2024.',
    dateCreated: '2024-02-11',
    dateModified: '2024-02-11',
    fileUrl: '/documents/eob/EOB_CLM123465.pdf',
    fileName: 'EOB_CLM123465.pdf',
    fileType: 'application/pdf',
    fileSize: 142800,
    fileSizeDisplay: '139 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00010',
    createdAt: '2024-02-11T11:00:00Z',
    updatedAt: '2024-02-11T11:00:00Z',
  },
  {
    documentId: 'DOC-IDC-00001',
    memberId: 'HCP-2024-00042',
    title: 'Medical ID Card - 2024',
    category: DOCUMENT_CATEGORY.ID_CARD,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.ID_CARD],
    description: 'HealthFirst PPO 5000 medical insurance ID card for plan year 2024.',
    dateCreated: '2024-01-01',
    dateModified: '2024-01-01',
    fileUrl: '/documents/idcards/Medical_ID_Card_2024.pdf',
    fileName: 'Medical_ID_Card_2024.pdf',
    fileType: 'application/pdf',
    fileSize: 524288,
    fileSizeDisplay: '512 KB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    documentId: 'DOC-IDC-00002',
    memberId: 'HCP-2024-00042',
    title: 'Dental ID Card - 2024',
    category: DOCUMENT_CATEGORY.ID_CARD,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.ID_CARD],
    description: 'HealthFirst Dental Plus insurance ID card for plan year 2024.',
    dateCreated: '2024-01-01',
    dateModified: '2024-01-01',
    fileUrl: '/documents/idcards/Dental_ID_Card_2024.pdf',
    fileName: 'Dental_ID_Card_2024.pdf',
    fileType: 'application/pdf',
    fileSize: 498700,
    fileSizeDisplay: '487 KB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    documentId: 'DOC-IDC-00003',
    memberId: 'HCP-2024-00042',
    title: 'Vision ID Card - 2024',
    category: DOCUMENT_CATEGORY.ID_CARD,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.ID_CARD],
    description: 'HealthFirst Vision Care insurance ID card for plan year 2024.',
    dateCreated: '2024-01-01',
    dateModified: '2024-01-01',
    fileUrl: '/documents/idcards/Vision_ID_Card_2024.pdf',
    fileName: 'Vision_ID_Card_2024.pdf',
    fileType: 'application/pdf',
    fileSize: 487200,
    fileSizeDisplay: '476 KB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    documentId: 'DOC-PLAN-00001',
    memberId: 'HCP-2024-00042',
    title: 'Summary of Benefits and Coverage (SBC) - PPO 5000',
    category: DOCUMENT_CATEGORY.PLAN_DOCUMENTS,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.PLAN_DOCUMENTS],
    description: 'Summary of Benefits and Coverage for HealthFirst PPO 5000 plan year 2024.',
    dateCreated: '2024-01-01',
    dateModified: '2024-01-01',
    fileUrl: '/documents/plan/SBC_PPO_5000_2024.pdf',
    fileName: 'SBC_PPO_5000_2024.pdf',
    fileType: 'application/pdf',
    fileSize: 1048576,
    fileSizeDisplay: '1.0 MB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    documentId: 'DOC-PLAN-00002',
    memberId: 'HCP-2024-00042',
    title: 'Evidence of Coverage (EOC) - PPO 5000',
    category: DOCUMENT_CATEGORY.PLAN_DOCUMENTS,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.PLAN_DOCUMENTS],
    description: 'Full Evidence of Coverage document for HealthFirst PPO 5000 plan year 2024.',
    dateCreated: '2024-01-01',
    dateModified: '2024-01-01',
    fileUrl: '/documents/plan/EOC_PPO_5000_2024.pdf',
    fileName: 'EOC_PPO_5000_2024.pdf',
    fileType: 'application/pdf',
    fileSize: 3145728,
    fileSizeDisplay: '3.0 MB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    documentId: 'DOC-PLAN-00003',
    memberId: 'HCP-2024-00042',
    title: 'Formulary Drug List - 2024',
    category: DOCUMENT_CATEGORY.PLAN_DOCUMENTS,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.PLAN_DOCUMENTS],
    description: 'Comprehensive formulary drug list for HealthFirst Rx Benefits plan year 2024.',
    dateCreated: '2024-01-01',
    dateModified: '2024-04-01',
    fileUrl: '/documents/plan/Formulary_Drug_List_2024.pdf',
    fileName: 'Formulary_Drug_List_2024.pdf',
    fileType: 'application/pdf',
    fileSize: 2097152,
    fileSizeDisplay: '2.0 MB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-04-01T08:00:00Z',
  },
  {
    documentId: 'DOC-PLAN-00004',
    memberId: 'HCP-2024-00042',
    title: 'Provider Directory - PPO Network 2024',
    category: DOCUMENT_CATEGORY.PLAN_DOCUMENTS,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.PLAN_DOCUMENTS],
    description: 'In-network provider directory for HealthFirst National PPO Network.',
    dateCreated: '2024-01-01',
    dateModified: '2024-06-01',
    fileUrl: '/documents/plan/Provider_Directory_PPO_2024.pdf',
    fileName: 'Provider_Directory_PPO_2024.pdf',
    fileType: 'application/pdf',
    fileSize: 4194304,
    fileSizeDisplay: '4.0 MB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    documentId: 'DOC-CORR-00001',
    memberId: 'HCP-2024-00042',
    title: 'Welcome Letter - Plan Year 2024',
    category: DOCUMENT_CATEGORY.CORRESPONDENCE,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.CORRESPONDENCE],
    description: 'Welcome letter with plan enrollment confirmation and important contact information.',
    dateCreated: '2024-01-05',
    dateModified: '2024-01-05',
    fileUrl: '/documents/correspondence/Welcome_Letter_2024.pdf',
    fileName: 'Welcome_Letter_2024.pdf',
    fileType: 'application/pdf',
    fileSize: 184320,
    fileSizeDisplay: '180 KB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-05T09:00:00Z',
  },
  {
    documentId: 'DOC-CORR-00002',
    memberId: 'HCP-2024-00042',
    title: 'Claim Denial Notice - CLM123461',
    category: DOCUMENT_CATEGORY.CORRESPONDENCE,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.CORRESPONDENCE],
    description: 'Notice of claim denial for services on 04/22/2024. Includes appeal instructions.',
    dateCreated: '2024-05-07',
    dateModified: '2024-05-07',
    fileUrl: '/documents/correspondence/Denial_Notice_CLM123461.pdf',
    fileName: 'Denial_Notice_CLM123461.pdf',
    fileType: 'application/pdf',
    fileSize: 225280,
    fileSizeDisplay: '220 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00006',
    createdAt: '2024-05-07T10:30:00Z',
    updatedAt: '2024-05-07T10:30:00Z',
  },
  {
    documentId: 'DOC-CORR-00003',
    memberId: 'HCP-2024-00042',
    title: 'Pending Information Request - CLM123467',
    category: DOCUMENT_CATEGORY.CORRESPONDENCE,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.CORRESPONDENCE],
    description: 'Request for additional information from provider for claim on 05/20/2024.',
    dateCreated: '2024-05-30',
    dateModified: '2024-05-30',
    fileUrl: '/documents/correspondence/Info_Request_CLM123467.pdf',
    fileName: 'Info_Request_CLM123467.pdf',
    fileType: 'application/pdf',
    fileSize: 163840,
    fileSizeDisplay: '160 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00012',
    createdAt: '2024-05-30T09:00:00Z',
    updatedAt: '2024-05-30T09:00:00Z',
  },
  {
    documentId: 'DOC-CORR-00004',
    memberId: 'HCP-2024-00042',
    title: 'Annual Benefits Update Notice',
    category: DOCUMENT_CATEGORY.CORRESPONDENCE,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.CORRESPONDENCE],
    description: 'Annual notice of changes to your health plan benefits for the upcoming plan year.',
    dateCreated: '2024-04-15',
    dateModified: '2024-04-15',
    fileUrl: '/documents/correspondence/Annual_Benefits_Update_2024.pdf',
    fileName: 'Annual_Benefits_Update_2024.pdf',
    fileType: 'application/pdf',
    fileSize: 276480,
    fileSizeDisplay: '270 KB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-04-15T08:00:00Z',
    updatedAt: '2024-04-15T08:00:00Z',
  },
  {
    documentId: 'DOC-TAX-00001',
    memberId: 'HCP-2024-00042',
    title: '1095-B Health Coverage Tax Form - 2023',
    category: DOCUMENT_CATEGORY.TAX_FORMS,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.TAX_FORMS],
    description: 'IRS Form 1095-B documenting your health insurance coverage for tax year 2023.',
    dateCreated: '2024-01-31',
    dateModified: '2024-01-31',
    fileUrl: '/documents/tax/1095B_2023.pdf',
    fileName: '1095B_2023.pdf',
    fileType: 'application/pdf',
    fileSize: 132096,
    fileSizeDisplay: '129 KB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-31T07:00:00Z',
    updatedAt: '2024-01-31T07:00:00Z',
  },
  {
    documentId: 'DOC-TAX-00002',
    memberId: 'HCP-2024-00042',
    title: '1095-B Health Coverage Tax Form - 2022',
    category: DOCUMENT_CATEGORY.TAX_FORMS,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.TAX_FORMS],
    description: 'IRS Form 1095-B documenting your health insurance coverage for tax year 2022.',
    dateCreated: '2023-01-31',
    dateModified: '2023-01-31',
    fileUrl: '/documents/tax/1095B_2022.pdf',
    fileName: '1095B_2022.pdf',
    fileType: 'application/pdf',
    fileSize: 128000,
    fileSizeDisplay: '125 KB',
    status: 'archived',
    relatedClaimId: null,
    createdAt: '2023-01-31T07:00:00Z',
    updatedAt: '2023-01-31T07:00:00Z',
  },
  {
    documentId: 'DOC-PA-00001',
    memberId: 'HCP-2024-00042',
    title: 'Prior Authorization Approval - MRI Lumbar Spine',
    category: DOCUMENT_CATEGORY.PRIOR_AUTH,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.PRIOR_AUTH],
    description: 'Prior authorization approval letter for MRI lumbar spine without contrast.',
    dateCreated: '2024-05-10',
    dateModified: '2024-05-10',
    fileUrl: '/documents/priorauth/PA_Approval_MRI_Lumbar.pdf',
    fileName: 'PA_Approval_MRI_Lumbar.pdf',
    fileType: 'application/pdf',
    fileSize: 153600,
    fileSizeDisplay: '150 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00005',
    createdAt: '2024-05-10T14:00:00Z',
    updatedAt: '2024-05-10T14:00:00Z',
  },
  {
    documentId: 'DOC-PA-00002',
    memberId: 'HCP-2024-00042',
    title: 'Prior Authorization Denial - Dental Implant',
    category: DOCUMENT_CATEGORY.PRIOR_AUTH,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.PRIOR_AUTH],
    description: 'Prior authorization denial letter for dental implant procedure. Includes appeal rights.',
    dateCreated: '2024-03-08',
    dateModified: '2024-03-08',
    fileUrl: '/documents/priorauth/PA_Denial_Dental_Implant.pdf',
    fileName: 'PA_Denial_Dental_Implant.pdf',
    fileType: 'application/pdf',
    fileSize: 174080,
    fileSizeDisplay: '170 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00013',
    createdAt: '2024-03-08T11:00:00Z',
    updatedAt: '2024-03-08T11:00:00Z',
  },
  {
    documentId: 'DOC-APP-00001',
    memberId: 'HCP-2024-00042',
    title: 'Appeal Submission Confirmation - CLM123468',
    category: DOCUMENT_CATEGORY.APPEALS,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.APPEALS],
    description: 'Confirmation of appeal submission for denied dental implant claim CLM123468.',
    dateCreated: '2024-04-02',
    dateModified: '2024-04-02',
    fileUrl: '/documents/appeals/Appeal_Confirmation_CLM123468.pdf',
    fileName: 'Appeal_Confirmation_CLM123468.pdf',
    fileType: 'application/pdf',
    fileSize: 143360,
    fileSizeDisplay: '140 KB',
    status: 'available',
    relatedClaimId: 'CLM-2024-00013',
    createdAt: '2024-04-02T16:00:00Z',
    updatedAt: '2024-04-02T16:00:00Z',
  },
  {
    documentId: 'DOC-APP-00002',
    memberId: 'HCP-2024-00042',
    title: 'Appeal Rights and Instructions',
    category: DOCUMENT_CATEGORY.APPEALS,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.APPEALS],
    description: 'General information about your right to appeal a claim denial and step-by-step instructions.',
    dateCreated: '2024-01-01',
    dateModified: '2024-01-01',
    fileUrl: '/documents/appeals/Appeal_Rights_Instructions.pdf',
    fileName: 'Appeal_Rights_Instructions.pdf',
    fileType: 'application/pdf',
    fileSize: 204800,
    fileSizeDisplay: '200 KB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    documentId: 'DOC-OTHER-00001',
    memberId: 'HCP-2024-00042',
    title: 'HIPAA Privacy Notice',
    category: DOCUMENT_CATEGORY.OTHER,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.OTHER],
    description: 'Notice of Privacy Practices describing how your health information may be used and disclosed.',
    dateCreated: '2024-01-01',
    dateModified: '2024-01-01',
    fileUrl: '/documents/other/HIPAA_Privacy_Notice.pdf',
    fileName: 'HIPAA_Privacy_Notice.pdf',
    fileType: 'application/pdf',
    fileSize: 358400,
    fileSizeDisplay: '350 KB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    documentId: 'DOC-OTHER-00002',
    memberId: 'HCP-2024-00042',
    title: 'Member Rights and Responsibilities',
    category: DOCUMENT_CATEGORY.OTHER,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[DOCUMENT_CATEGORY.OTHER],
    description: 'Document outlining your rights and responsibilities as a health plan member.',
    dateCreated: '2024-01-01',
    dateModified: '2024-01-01',
    fileUrl: '/documents/other/Member_Rights_Responsibilities.pdf',
    fileName: 'Member_Rights_Responsibilities.pdf',
    fileType: 'application/pdf',
    fileSize: 266240,
    fileSizeDisplay: '260 KB',
    status: 'available',
    relatedClaimId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * Returns all documents for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of document objects for the member
 */
export const getDocumentsByMemberId = (memberId) => {
  return documentsData.filter((doc) => doc.memberId === memberId);
};

/**
 * Returns all available (non-archived) documents for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of available document objects for the member
 */
export const getAvailableDocumentsByMemberId = (memberId) => {
  return documentsData.filter((doc) => doc.memberId === memberId && doc.status === 'available');
};

/**
 * Returns a single document by its document ID.
 * @param {string} documentId - The document identifier
 * @returns {Object|undefined} The document object or undefined if not found
 */
export const getDocumentById = (documentId) => {
  return documentsData.find((doc) => doc.documentId === documentId);
};

/**
 * Returns documents filtered by category for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} category - The document category to filter by (EOB, ID_CARD, PLAN_DOCUMENTS, CORRESPONDENCE, TAX_FORMS, PRIOR_AUTH, APPEALS, OTHER)
 * @returns {Object[]} Array of document objects matching the category
 */
export const getDocumentsByCategory = (memberId, category) => {
  return documentsData.filter(
    (doc) => doc.memberId === memberId && doc.category === category
  );
};

/**
 * Returns documents related to a specific claim.
 * @param {string} claimId - The claim identifier
 * @returns {Object[]} Array of document objects related to the claim
 */
export const getDocumentsByClaimId = (claimId) => {
  return documentsData.filter((doc) => doc.relatedClaimId === claimId);
};

/**
 * Filters documents by multiple criteria.
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.memberId] - Member ID to filter by
 * @param {string} [filters.category] - Document category to filter by
 * @param {string} [filters.status] - Document status to filter by ('available', 'archived', 'pending')
 * @param {string} [filters.dateFrom] - Start date (YYYY-MM-DD) for date created range
 * @param {string} [filters.dateTo] - End date (YYYY-MM-DD) for date created range
 * @param {string} [filters.search] - Search term for title or description (case-insensitive partial match)
 * @param {string} [filters.sortBy] - Sort field ('dateCreated', 'title', 'category', 'fileSize')
 * @param {string} [filters.sortOrder] - Sort order ('asc' or 'desc')
 * @param {number} [filters.page] - Page number (1-based)
 * @param {number} [filters.pageSize] - Number of items per page
 * @returns {Object} Object with documents array, pagination info, and total count
 */
export const filterDocuments = (filters = {}) => {
  let results = [...documentsData];

  if (filters.memberId) {
    results = results.filter((doc) => doc.memberId === filters.memberId);
  }

  if (filters.category) {
    results = results.filter((doc) => doc.category === filters.category);
  }

  if (filters.status) {
    results = results.filter((doc) => doc.status === filters.status);
  }

  if (filters.dateFrom) {
    results = results.filter((doc) => doc.dateCreated >= filters.dateFrom);
  }

  if (filters.dateTo) {
    results = results.filter((doc) => doc.dateCreated <= filters.dateTo);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchLower) ||
        doc.description.toLowerCase().includes(searchLower)
    );
  }

  const sortBy = filters.sortBy || 'dateCreated';
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

  const totalItems = results.length;
  const pageSize = filters.pageSize || 10;
  const page = filters.page || 1;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedResults = results.slice(startIndex, startIndex + pageSize);

  return {
    documents: paginatedResults,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalItems,
    },
  };
};

/**
 * Returns a summary of documents for a given member.
 * @param {string} memberId - The member identifier
 * @returns {Object} Summary object with totalDocuments, availableDocuments, archivedDocuments, and categoryCounts
 */
export const getDocumentsSummary = (memberId) => {
  const memberDocuments = getDocumentsByMemberId(memberId);

  const categoryCounts = {};
  Object.values(DOCUMENT_CATEGORY).forEach((category) => {
    categoryCounts[category] = 0;
  });

  let availableDocuments = 0;
  let archivedDocuments = 0;
  let pendingDocuments = 0;

  memberDocuments.forEach((doc) => {
    if (doc.status === 'available') {
      availableDocuments += 1;
    } else if (doc.status === 'archived') {
      archivedDocuments += 1;
    } else if (doc.status === 'pending') {
      pendingDocuments += 1;
    }

    if (categoryCounts[doc.category] !== undefined) {
      categoryCounts[doc.category] += 1;
    }
  });

  return {
    totalDocuments: memberDocuments.length,
    availableDocuments,
    archivedDocuments,
    pendingDocuments,
    categoryCounts,
  };
};

/**
 * Returns the most recent documents for a given member.
 * @param {string} memberId - The member identifier
 * @param {number} [count=3] - Number of recent documents to return
 * @returns {Object[]} Array of the most recent document objects
 */
export const getRecentDocuments = (memberId, count = 3) => {
  return getDocumentsByMemberId(memberId)
    .filter((doc) => doc.status === 'available')
    .sort((a, b) => {
      if (a.dateCreated < b.dateCreated) return 1;
      if (a.dateCreated > b.dateCreated) return -1;
      return 0;
    })
    .slice(0, count);
};