import { ROLES } from '../constants/constants.js';

/**
 * Mock member profile data fixture.
 * Used for development and testing of authentication, session, and RBAC features.
 *
 * @typedef {Object} MemberProfile
 * @property {number} id - Unique member identifier
 * @property {string} memberId - Health plan member ID
 * @property {string} username - Login username
 * @property {string} firstName - Member first name
 * @property {string} lastName - Member last name
 * @property {string} displayName - Full display name
 * @property {string} email - Member email address
 * @property {string} phone - Member phone number
 * @property {string} role - User role (MEMBER or ADMIN)
 * @property {string[]} roles - Array of assigned roles
 * @property {string} dateOfBirth - Date of birth (YYYY-MM-DD)
 * @property {Object} plan - Health plan information
 * @property {string} plan.planId - Plan identifier
 * @property {string} plan.planName - Plan display name
 * @property {string} plan.groupNumber - Employer group number
 * @property {string} plan.subscriberId - Subscriber ID
 * @property {string} plan.effectiveDate - Plan effective date (YYYY-MM-DD)
 * @property {string} plan.terminationDate - Plan termination date (YYYY-MM-DD)
 * @property {string} plan.planType - Type of plan (e.g., PPO, HMO)
 * @property {Object} address - Member mailing address
 * @property {string} address.street - Street address
 * @property {string} address.city - City
 * @property {string} address.state - State abbreviation
 * @property {string} address.zipCode - ZIP code
 * @property {string|null} avatarUrl - URL to member avatar image or null for placeholder
 * @property {string} createdAt - Account creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 */

export const memberProfile = {
  id: 42,
  memberId: 'HCP-2024-00042',
  username: 'jane.doe',
  firstName: 'Jane',
  lastName: 'Doe',
  displayName: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '(555) 123-4567',
  role: ROLES.MEMBER,
  roles: [ROLES.MEMBER],
  dateOfBirth: '1985-03-15',
  plan: {
    planId: 'PLN-PPO-5000',
    planName: 'HealthFirst PPO 5000',
    groupNumber: 'GRP-98765',
    subscriberId: 'SUB-2024-00042',
    effectiveDate: '2024-01-01',
    terminationDate: '2024-12-31',
    planType: 'PPO',
  },
  address: {
    street: '123 Maple Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
  },
  avatarUrl: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-06-01T12:00:00Z',
};

export const adminProfile = {
  id: 1,
  memberId: 'HCP-2024-00001',
  username: 'admin.user',
  firstName: 'Alex',
  lastName: 'Admin',
  displayName: 'Alex Admin',
  email: 'admin@healthcarepayer.com',
  phone: '(555) 987-6543',
  role: ROLES.ADMIN,
  roles: [ROLES.ADMIN, ROLES.MEMBER],
  dateOfBirth: '1980-07-22',
  plan: {
    planId: 'PLN-HMO-3000',
    planName: 'HealthFirst HMO 3000',
    groupNumber: 'GRP-00001',
    subscriberId: 'SUB-2024-00001',
    effectiveDate: '2024-01-01',
    terminationDate: '2024-12-31',
    planType: 'HMO',
  },
  address: {
    street: '456 Oak Avenue',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
  },
  avatarUrl: null,
  createdAt: '2023-06-15T00:00:00Z',
  updatedAt: '2024-06-01T12:00:00Z',
};

/**
 * Returns the initials for a member profile to use as an avatar placeholder.
 * @param {Object} profile - A member profile object
 * @returns {string} Two-character initials string
 */
export const getAvatarInitials = (profile) => {
  if (!profile) {
    return '';
  }
  const first = profile.firstName ? profile.firstName.charAt(0).toUpperCase() : '';
  const last = profile.lastName ? profile.lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

/**
 * Retrieves a mock profile by role for development/testing.
 * @param {string} role - One of ROLES.MEMBER or ROLES.ADMIN
 * @returns {Object} The matching mock member profile
 */
export const getMockProfileByRole = (role) => {
  if (role === ROLES.ADMIN) {
    return adminProfile;
  }
  return memberProfile;
};