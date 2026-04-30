// ===== Application Configuration =====

export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'Healthcare Member Portal',
  sessionTimeoutMinutes: parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES, 10) || 15,
  sessionWarningMinutes: parseInt(import.meta.env.VITE_SESSION_WARNING_MINUTES, 10) || 2,
  glassboxEnabled: import.meta.env.VITE_GLASSBOX_ENABLED === 'true',
};

// ===== Support Links =====

export const SUPPORT = {
  email: import.meta.env.VITE_SUPPORT_EMAIL || 'support@healthcarepayer.com',
  phone: import.meta.env.VITE_SUPPORT_PHONE || '1-800-555-0199',
  chatUrl: import.meta.env.VITE_SUPPORT_CHAT_URL || 'https://chat.healthcarepayer.com',
};

// ===== External URLs =====

export const EXTERNAL_URLS = {
  doctorFinder: import.meta.env.VITE_EXTERNAL_DOCTOR_FINDER_URL || 'https://doctorfinder.healthcarepayer.com',
};

// ===== Session Timeout =====

export const SESSION_TIMEOUT = {
  timeoutMs: (parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES, 10) || 15) * 60 * 1000,
  warningMs: (parseInt(import.meta.env.VITE_SESSION_WARNING_MINUTES, 10) || 2) * 60 * 1000,
  checkIntervalMs: 30 * 1000,
};

// ===== User Roles =====

export const ROLES = {
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN',
};

// ===== Navigation Menu Items =====

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'home', roles: [ROLES.MEMBER, ROLES.ADMIN] },
  { label: 'My Coverage', path: '/coverage', icon: 'shield', roles: [ROLES.MEMBER, ROLES.ADMIN] },
  { label: 'Claims', path: '/claims', icon: 'file-text', roles: [ROLES.MEMBER, ROLES.ADMIN] },
  { label: 'Find a Doctor', path: '/find-doctor', icon: 'search', roles: [ROLES.MEMBER, ROLES.ADMIN] },
  { label: 'Documents', path: '/documents', icon: 'folder', roles: [ROLES.MEMBER, ROLES.ADMIN] },
  { label: 'Payments', path: '/payments', icon: 'credit-card', roles: [ROLES.MEMBER, ROLES.ADMIN] },
  { label: 'Messages', path: '/messages', icon: 'mail', roles: [ROLES.MEMBER, ROLES.ADMIN] },
  { label: 'Settings', path: '/settings', icon: 'settings', roles: [ROLES.MEMBER, ROLES.ADMIN] },
  { label: 'Admin', path: '/admin', icon: 'users', roles: [ROLES.ADMIN] },
];

// ===== Claim Statuses =====

export const CLAIM_STATUS = {
  SUBMITTED: 'SUBMITTED',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  PARTIALLY_APPROVED: 'PARTIALLY_APPROVED',
  PENDING_INFO: 'PENDING_INFO',
  APPEALED: 'APPEALED',
  CLOSED: 'CLOSED',
};

export const CLAIM_STATUS_LABELS = {
  [CLAIM_STATUS.SUBMITTED]: 'Submitted',
  [CLAIM_STATUS.IN_REVIEW]: 'In Review',
  [CLAIM_STATUS.APPROVED]: 'Approved',
  [CLAIM_STATUS.DENIED]: 'Denied',
  [CLAIM_STATUS.PARTIALLY_APPROVED]: 'Partially Approved',
  [CLAIM_STATUS.PENDING_INFO]: 'Pending Information',
  [CLAIM_STATUS.APPEALED]: 'Appealed',
  [CLAIM_STATUS.CLOSED]: 'Closed',
};

export const CLAIM_STATUS_BADGE = {
  [CLAIM_STATUS.SUBMITTED]: 'hb-badge-info',
  [CLAIM_STATUS.IN_REVIEW]: 'hb-badge-warning',
  [CLAIM_STATUS.APPROVED]: 'hb-badge-success',
  [CLAIM_STATUS.DENIED]: 'hb-badge-error',
  [CLAIM_STATUS.PARTIALLY_APPROVED]: 'hb-badge-warning',
  [CLAIM_STATUS.PENDING_INFO]: 'hb-badge-info',
  [CLAIM_STATUS.APPEALED]: 'hb-badge-brand',
  [CLAIM_STATUS.CLOSED]: 'hb-badge-neutral',
};

// ===== Claim Types =====

export const CLAIM_TYPE = {
  MEDICAL: 'MEDICAL',
  DENTAL: 'DENTAL',
  VISION: 'VISION',
  PHARMACY: 'PHARMACY',
  BEHAVIORAL_HEALTH: 'BEHAVIORAL_HEALTH',
  LAB: 'LAB',
  EMERGENCY: 'EMERGENCY',
  PREVENTIVE: 'PREVENTIVE',
};

export const CLAIM_TYPE_LABELS = {
  [CLAIM_TYPE.MEDICAL]: 'Medical',
  [CLAIM_TYPE.DENTAL]: 'Dental',
  [CLAIM_TYPE.VISION]: 'Vision',
  [CLAIM_TYPE.PHARMACY]: 'Pharmacy',
  [CLAIM_TYPE.BEHAVIORAL_HEALTH]: 'Behavioral Health',
  [CLAIM_TYPE.LAB]: 'Lab / Pathology',
  [CLAIM_TYPE.EMERGENCY]: 'Emergency',
  [CLAIM_TYPE.PREVENTIVE]: 'Preventive Care',
};

// ===== Document Categories =====

export const DOCUMENT_CATEGORY = {
  EOB: 'EOB',
  ID_CARD: 'ID_CARD',
  PLAN_DOCUMENTS: 'PLAN_DOCUMENTS',
  CORRESPONDENCE: 'CORRESPONDENCE',
  TAX_FORMS: 'TAX_FORMS',
  PRIOR_AUTH: 'PRIOR_AUTH',
  APPEALS: 'APPEALS',
  OTHER: 'OTHER',
};

export const DOCUMENT_CATEGORY_LABELS = {
  [DOCUMENT_CATEGORY.EOB]: 'Explanation of Benefits',
  [DOCUMENT_CATEGORY.ID_CARD]: 'ID Card',
  [DOCUMENT_CATEGORY.PLAN_DOCUMENTS]: 'Plan Documents',
  [DOCUMENT_CATEGORY.CORRESPONDENCE]: 'Correspondence',
  [DOCUMENT_CATEGORY.TAX_FORMS]: 'Tax Forms',
  [DOCUMENT_CATEGORY.PRIOR_AUTH]: 'Prior Authorization',
  [DOCUMENT_CATEGORY.APPEALS]: 'Appeals',
  [DOCUMENT_CATEGORY.OTHER]: 'Other',
};

// ===== Notification Types =====

export const NOTIFICATION_TYPE = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CLAIM_UPDATE: 'CLAIM_UPDATE',
  PAYMENT_DUE: 'PAYMENT_DUE',
  DOCUMENT_READY: 'DOCUMENT_READY',
  MESSAGE: 'MESSAGE',
  SYSTEM: 'SYSTEM',
};

export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPE.INFO]: 'Information',
  [NOTIFICATION_TYPE.SUCCESS]: 'Success',
  [NOTIFICATION_TYPE.WARNING]: 'Warning',
  [NOTIFICATION_TYPE.ERROR]: 'Error',
  [NOTIFICATION_TYPE.CLAIM_UPDATE]: 'Claim Update',
  [NOTIFICATION_TYPE.PAYMENT_DUE]: 'Payment Due',
  [NOTIFICATION_TYPE.DOCUMENT_READY]: 'Document Ready',
  [NOTIFICATION_TYPE.MESSAGE]: 'New Message',
  [NOTIFICATION_TYPE.SYSTEM]: 'System Notice',
};

export const NOTIFICATION_ALERT_CLASS = {
  [NOTIFICATION_TYPE.INFO]: 'hb-alert-info',
  [NOTIFICATION_TYPE.SUCCESS]: 'hb-alert-success',
  [NOTIFICATION_TYPE.WARNING]: 'hb-alert-warning',
  [NOTIFICATION_TYPE.ERROR]: 'hb-alert-error',
  [NOTIFICATION_TYPE.CLAIM_UPDATE]: 'hb-alert-info',
  [NOTIFICATION_TYPE.PAYMENT_DUE]: 'hb-alert-warning',
  [NOTIFICATION_TYPE.DOCUMENT_READY]: 'hb-alert-info',
  [NOTIFICATION_TYPE.MESSAGE]: 'hb-alert-info',
  [NOTIFICATION_TYPE.SYSTEM]: 'hb-alert-warning',
};

// ===== Coverage Types =====

export const COVERAGE_TYPE = {
  MEDICAL: 'MEDICAL',
  DENTAL: 'DENTAL',
  VISION: 'VISION',
  PHARMACY: 'PHARMACY',
  BEHAVIORAL_HEALTH: 'BEHAVIORAL_HEALTH',
};

export const COVERAGE_TYPE_LABELS = {
  [COVERAGE_TYPE.MEDICAL]: 'Medical',
  [COVERAGE_TYPE.DENTAL]: 'Dental',
  [COVERAGE_TYPE.VISION]: 'Vision',
  [COVERAGE_TYPE.PHARMACY]: 'Pharmacy',
  [COVERAGE_TYPE.BEHAVIORAL_HEALTH]: 'Behavioral Health',
};

// ===== Widget Default Configuration =====

export const WIDGET_DEFAULTS = {
  claimsToShow: 5,
  notificationsToShow: 5,
  recentDocumentsToShow: 3,
  upcomingAppointmentsToShow: 3,
  refreshIntervalMs: 5 * 60 * 1000,
};

// ===== HB CSS Class Name Mappings =====

export const HB_CLASSES = {
  // Layout
  wrapper: 'fluid-wrapper',
  row: 'hb-row',
  section: 'page-section',
  sidebar: 'page-sidebar',
  content: 'page-content',
  layout: 'page-layout',

  // Card
  card: 'hb-card',
  cardHeader: 'hb-card-header',
  cardBody: 'hb-card-body',
  cardFooter: 'hb-card-footer',

  // Buttons
  btn: 'hb-btn',
  btnPrimary: 'hb-btn hb-btn-primary',
  btnSecondary: 'hb-btn hb-btn-secondary',
  btnTertiary: 'hb-btn hb-btn-tertiary',
  btnDanger: 'hb-btn hb-btn-danger',
  btnSm: 'hb-btn-sm',
  btnLg: 'hb-btn-lg',
  btnBlock: 'hb-btn-block',

  // Alerts
  alert: 'hb-alert',
  alertInfo: 'hb-alert hb-alert-info',
  alertSuccess: 'hb-alert hb-alert-success',
  alertWarning: 'hb-alert hb-alert-warning',
  alertError: 'hb-alert hb-alert-error',
  alertDismiss: 'hb-alert-dismiss',

  // Modal
  modalOverlay: 'hb-modal-overlay',
  modal: 'hb-modal',
  modalSm: 'hb-modal-sm',
  modalLg: 'hb-modal-lg',
  modalXl: 'hb-modal-xl',
  modalHeader: 'hb-modal-header',
  modalBody: 'hb-modal-body',
  modalFooter: 'hb-modal-footer',
  modalClose: 'hb-modal-close',

  // Forms
  formGroup: 'hb-form-group',
  formLabel: 'hb-form-label',
  formLabelRequired: 'hb-form-label hb-form-label-required',
  formInput: 'hb-form-input',
  formSelect: 'hb-form-select',
  formTextarea: 'hb-form-textarea',
  formInputError: 'hb-form-input hb-form-input-error',
  formInputSuccess: 'hb-form-input hb-form-input-success',
  formHelp: 'hb-form-help',
  formErrorText: 'hb-form-error-text',
  formSuccessText: 'hb-form-success-text',
  formCheck: 'hb-form-check',
  formCheckInput: 'hb-form-check-input',
  formCheckLabel: 'hb-form-check-label',

  // Badge
  badge: 'hb-badge',
  badgeBrand: 'hb-badge hb-badge-brand',
  badgeSuccess: 'hb-badge hb-badge-success',
  badgeWarning: 'hb-badge hb-badge-warning',
  badgeError: 'hb-badge hb-badge-error',
  badgeInfo: 'hb-badge hb-badge-info',
  badgeNeutral: 'hb-badge hb-badge-neutral',

  // Avatar
  avatar: 'hb-avatar',
  avatarXs: 'hb-avatar hb-avatar-xs',
  avatarSm: 'hb-avatar hb-avatar-sm',
  avatarMd: 'hb-avatar hb-avatar-md',
  avatarLg: 'hb-avatar hb-avatar-lg',
  avatarXl: 'hb-avatar hb-avatar-xl',

  // Utilities
  srOnly: 'hb-sr-only',
  divider: 'hb-divider',
  link: 'hb-link',
  linkMuted: 'hb-link hb-link-muted',
  linkWhite: 'hb-link hb-link-white',
  focusRing: 'hb-focus-ring',
  transition: 'hb-transition',
};

// ===== Pagination Defaults =====

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
};

// ===== Date Formats =====

export const DATE_FORMAT = {
  display: 'MM/DD/YYYY',
  api: 'YYYY-MM-DD',
  displayWithTime: 'MM/DD/YYYY hh:mm A',
  monthYear: 'MMMM YYYY',
  shortMonth: 'MMM DD, YYYY',
};

// ===== HTTP Status Codes =====

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ===== Route Paths =====

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  COVERAGE: '/coverage',
  CLAIMS: '/claims',
  CLAIM_DETAIL: '/claims/:id',
  FIND_DOCTOR: '/find-doctor',
  DOCUMENTS: '/documents',
  PAYMENTS: '/payments',
  MESSAGES: '/messages',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  NOT_FOUND: '*',
};