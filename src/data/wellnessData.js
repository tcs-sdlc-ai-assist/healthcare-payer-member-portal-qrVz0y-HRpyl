import { COVERAGE_TYPE, COVERAGE_TYPE_LABELS } from '../constants/constants.js';

/**
 * Mock wellness data fixture.
 * Used for development and testing of Wellness section features including
 * wellness programs, health assessments, and preventive care reminders.
 *
 * @typedef {Object} WellnessProgram
 * @property {string} programId - Unique program identifier
 * @property {string} title - Program display title
 * @property {string} description - Program description
 * @property {string} category - Program category (fitness, nutrition, mental_health, chronic_care, preventive, lifestyle)
 * @property {string} icon - Icon identifier for display
 * @property {string} status - Program status (available, enrolled, completed)
 * @property {string} duration - Program duration description
 * @property {string} format - Program format (online, in_person, hybrid, self_paced)
 * @property {string} provider - Program provider name
 * @property {string} eligibility - Eligibility description
 * @property {string[]} benefits - List of program benefits
 * @property {string} enrollmentUrl - URL to enroll in the program
 * @property {string} cost - Cost to the member
 * @property {number|null} incentiveAmount - Incentive amount in dollars or null
 * @property {string|null} incentiveDescription - Description of incentive or null
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 *
 * @typedef {Object} HealthAssessment
 * @property {string} assessmentId - Unique assessment identifier
 * @property {string} memberId - Associated member identifier
 * @property {string} title - Assessment display title
 * @property {string} description - Assessment description
 * @property {string} type - Assessment type (hra, biometric, lifestyle, mental_health, chronic_care)
 * @property {string} status - Assessment status (available, in_progress, completed, expired)
 * @property {string|null} completedDate - Date assessment was completed (YYYY-MM-DD) or null
 * @property {string|null} expirationDate - Date assessment expires (YYYY-MM-DD) or null
 * @property {number} estimatedMinutes - Estimated time to complete in minutes
 * @property {string} assessmentUrl - URL to take the assessment
 * @property {number|null} incentiveAmount - Incentive amount in dollars or null
 * @property {string|null} incentiveDescription - Description of incentive or null
 * @property {Object|null} results - Assessment results or null if not completed
 * @property {string|null} results.riskLevel - Risk level (low, moderate, high)
 * @property {string|null} results.summary - Results summary text
 * @property {string[]|null} results.recommendations - Array of recommendation strings
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 *
 * @typedef {Object} PreventiveCareReminder
 * @property {string} reminderId - Unique reminder identifier
 * @property {string} memberId - Associated member identifier
 * @property {string} title - Reminder display title
 * @property {string} description - Reminder description
 * @property {string} category - Reminder category (screening, immunization, exam, lab)
 * @property {string} coverageType - Associated coverage type
 * @property {string} coverageTypeLabel - Human-readable coverage type label
 * @property {string} status - Reminder status (due, upcoming, overdue, completed)
 * @property {string|null} dueDate - Date the service is due (YYYY-MM-DD) or null
 * @property {string|null} lastCompletedDate - Date the service was last completed (YYYY-MM-DD) or null
 * @property {string} frequency - Recommended frequency description
 * @property {string} ageGroup - Applicable age group description
 * @property {string} cost - Expected cost to the member
 * @property {string} notes - Additional notes
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 *
 * @typedef {Object} WellnessGoal
 * @property {string} goalId - Unique goal identifier
 * @property {string} memberId - Associated member identifier
 * @property {string} title - Goal display title
 * @property {string} description - Goal description
 * @property {string} category - Goal category (fitness, nutrition, mental_health, sleep, weight, general)
 * @property {string} status - Goal status (active, completed, paused)
 * @property {number} targetValue - Target value for the goal
 * @property {number} currentValue - Current progress value
 * @property {string} unit - Unit of measurement
 * @property {string} startDate - Goal start date (YYYY-MM-DD)
 * @property {string} targetDate - Goal target date (YYYY-MM-DD)
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 *
 * @typedef {Object} WellnessIncentive
 * @property {string} incentiveId - Unique incentive identifier
 * @property {string} memberId - Associated member identifier
 * @property {string} title - Incentive display title
 * @property {string} description - Incentive description
 * @property {string} type - Incentive type (assessment, program, activity, preventive)
 * @property {number} amount - Incentive amount in dollars
 * @property {string} status - Incentive status (available, earned, redeemed, expired)
 * @property {string|null} earnedDate - Date incentive was earned (YYYY-MM-DD) or null
 * @property {string|null} expirationDate - Date incentive expires (YYYY-MM-DD) or null
 * @property {string|null} relatedId - Related program, assessment, or activity ID
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Record last update timestamp (ISO 8601)
 */

// ===== Wellness Programs =====

export const wellnessPrograms = [
  {
    programId: 'WP-001',
    title: 'Healthy Steps Walking Challenge',
    description: 'Join our 12-week walking challenge and build a daily walking habit. Track your steps, earn rewards, and compete with other members in a supportive community.',
    category: 'fitness',
    icon: 'activity',
    status: 'available',
    duration: '12 weeks',
    format: 'self_paced',
    provider: 'HealthFirst Wellness',
    eligibility: 'All HealthFirst members age 18 and older.',
    benefits: [
      'Improve cardiovascular health',
      'Boost energy and mood',
      'Build a sustainable exercise habit',
      'Connect with a supportive community',
      'Earn wellness incentive rewards',
    ],
    enrollmentUrl: 'https://wellness.healthcarepayer.com/walking-challenge',
    cost: '$0 (included with your plan)',
    incentiveAmount: 50,
    incentiveDescription: 'Earn $50 wellness reward for completing the 12-week challenge.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    programId: 'WP-002',
    title: 'Nutrition & Healthy Eating Program',
    description: 'Work with a registered dietitian to develop a personalized nutrition plan. Includes meal planning guidance, grocery shopping tips, and weekly check-ins.',
    category: 'nutrition',
    icon: 'heart',
    status: 'available',
    duration: '8 weeks',
    format: 'online',
    provider: 'HealthFirst Wellness',
    eligibility: 'All HealthFirst members age 18 and older.',
    benefits: [
      'Personalized meal planning',
      'One-on-one dietitian consultations',
      'Healthy recipe library access',
      'Grocery shopping guides',
      'Weight management support',
    ],
    enrollmentUrl: 'https://wellness.healthcarepayer.com/nutrition-program',
    cost: '$0 (included with your plan)',
    incentiveAmount: 25,
    incentiveDescription: 'Earn $25 wellness reward for completing the 8-week program.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    programId: 'WP-003',
    title: 'Stress Management & Mindfulness',
    description: 'Learn evidence-based techniques for managing stress, including mindfulness meditation, breathing exercises, and cognitive behavioral strategies.',
    category: 'mental_health',
    icon: 'sun',
    status: 'available',
    duration: '6 weeks',
    format: 'online',
    provider: 'HealthFirst Behavioral Health',
    eligibility: 'All HealthFirst members age 18 and older.',
    benefits: [
      'Guided mindfulness meditation sessions',
      'Stress reduction techniques',
      'Cognitive behavioral strategies',
      'Sleep improvement tips',
      'Access to on-demand relaxation content',
    ],
    enrollmentUrl: 'https://wellness.healthcarepayer.com/stress-management',
    cost: '$0 (included with your plan)',
    incentiveAmount: 25,
    incentiveDescription: 'Earn $25 wellness reward for completing the 6-week program.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    programId: 'WP-004',
    title: 'Diabetes Prevention Program',
    description: 'A CDC-recognized lifestyle change program designed to help you reduce your risk of developing type 2 diabetes through healthy eating, physical activity, and behavior changes.',
    category: 'chronic_care',
    icon: 'shield',
    status: 'available',
    duration: '12 months',
    format: 'hybrid',
    provider: 'HealthFirst Wellness',
    eligibility: 'Members identified as pre-diabetic or at high risk for type 2 diabetes based on health assessment results.',
    benefits: [
      'CDC-recognized curriculum',
      'Trained lifestyle coach',
      'Weekly group sessions (in-person or virtual)',
      'Personalized action plans',
      'Blood sugar monitoring support',
      'Long-term maintenance support',
    ],
    enrollmentUrl: 'https://wellness.healthcarepayer.com/diabetes-prevention',
    cost: '$0 (included with your plan)',
    incentiveAmount: 150,
    incentiveDescription: 'Earn up to $150 in wellness rewards for completing program milestones.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    programId: 'WP-005',
    title: 'Tobacco Cessation Program',
    description: 'Comprehensive support to help you quit tobacco, including counseling, nicotine replacement therapy, and ongoing support from a dedicated quit coach.',
    category: 'lifestyle',
    icon: 'x-circle',
    status: 'available',
    duration: '12 weeks',
    format: 'online',
    provider: 'HealthFirst Wellness',
    eligibility: 'All HealthFirst members who currently use tobacco products.',
    benefits: [
      'One-on-one quit coaching',
      'Nicotine replacement therapy (NRT) coverage',
      'Behavioral counseling sessions',
      'Relapse prevention strategies',
      'Access to 24/7 quit support line',
    ],
    enrollmentUrl: 'https://wellness.healthcarepayer.com/tobacco-cessation',
    cost: '$0 (included with your plan)',
    incentiveAmount: 100,
    incentiveDescription: 'Earn $100 wellness reward for completing the program and remaining tobacco-free for 6 months.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    programId: 'WP-006',
    title: 'Weight Management Program',
    description: 'A structured weight management program combining nutrition counseling, fitness guidance, and behavioral support to help you achieve and maintain a healthy weight.',
    category: 'nutrition',
    icon: 'trending-down',
    status: 'available',
    duration: '16 weeks',
    format: 'hybrid',
    provider: 'HealthFirst Wellness',
    eligibility: 'Members with a BMI of 25 or higher, or as recommended by their physician.',
    benefits: [
      'Personalized weight loss plan',
      'Weekly weigh-ins and progress tracking',
      'Nutrition and fitness coaching',
      'Behavioral change support',
      'Meal replacement options available',
      'Ongoing maintenance support',
    ],
    enrollmentUrl: 'https://wellness.healthcarepayer.com/weight-management',
    cost: '$0 (included with your plan)',
    incentiveAmount: 75,
    incentiveDescription: 'Earn $75 wellness reward for completing the 16-week program.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    programId: 'WP-007',
    title: 'Back & Joint Health Program',
    description: 'A physical therapy-guided program to help manage and prevent back and joint pain through targeted exercises, ergonomic guidance, and lifestyle modifications.',
    category: 'fitness',
    icon: 'activity',
    status: 'available',
    duration: '8 weeks',
    format: 'online',
    provider: 'HealthFirst Wellness',
    eligibility: 'All HealthFirst members experiencing back or joint discomfort.',
    benefits: [
      'Guided exercise videos',
      'Ergonomic workspace assessment',
      'Posture improvement techniques',
      'Pain management strategies',
      'Physical therapist consultations',
    ],
    enrollmentUrl: 'https://wellness.healthcarepayer.com/back-joint-health',
    cost: '$0 (included with your plan)',
    incentiveAmount: 25,
    incentiveDescription: 'Earn $25 wellness reward for completing the 8-week program.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    programId: 'WP-008',
    title: 'Sleep Wellness Program',
    description: 'Improve your sleep quality with evidence-based strategies including sleep hygiene education, cognitive behavioral therapy for insomnia (CBT-I), and relaxation techniques.',
    category: 'lifestyle',
    icon: 'moon',
    status: 'available',
    duration: '6 weeks',
    format: 'self_paced',
    provider: 'HealthFirst Behavioral Health',
    eligibility: 'All HealthFirst members age 18 and older.',
    benefits: [
      'Sleep hygiene education',
      'CBT-I techniques',
      'Guided relaxation exercises',
      'Sleep tracking tools',
      'Personalized sleep improvement plan',
    ],
    enrollmentUrl: 'https://wellness.healthcarepayer.com/sleep-wellness',
    cost: '$0 (included with your plan)',
    incentiveAmount: 25,
    incentiveDescription: 'Earn $25 wellness reward for completing the 6-week program.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
];

// ===== Health Assessments =====

export const healthAssessments = [
  {
    assessmentId: 'HA-001',
    memberId: 'HCP-2024-00042',
    title: 'Annual Health Risk Assessment (HRA)',
    description: 'Complete your annual health risk assessment to identify potential health risks and receive personalized recommendations for improving your health.',
    type: 'hra',
    status: 'completed',
    completedDate: '2024-02-15',
    expirationDate: '2025-02-15',
    estimatedMinutes: 20,
    assessmentUrl: 'https://wellness.healthcarepayer.com/hra',
    incentiveAmount: 50,
    incentiveDescription: 'Earn $50 wellness reward for completing your annual HRA.',
    results: {
      riskLevel: 'moderate',
      summary: 'Your overall health risk is moderate. Key areas for improvement include physical activity, stress management, and preventive screenings. You are doing well with nutrition and tobacco avoidance.',
      recommendations: [
        'Increase physical activity to at least 150 minutes of moderate exercise per week.',
        'Schedule your annual preventive care visit with your PCP.',
        'Consider enrolling in the Stress Management & Mindfulness program.',
        'Complete your recommended preventive screenings (see Preventive Care Reminders).',
        'Continue maintaining a healthy diet and tobacco-free lifestyle.',
      ],
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  {
    assessmentId: 'HA-002',
    memberId: 'HCP-2024-00042',
    title: 'Biometric Screening',
    description: 'Complete a biometric screening to measure key health indicators including blood pressure, cholesterol, blood sugar, and BMI.',
    type: 'biometric',
    status: 'available',
    completedDate: null,
    expirationDate: '2024-12-31',
    estimatedMinutes: 15,
    assessmentUrl: 'https://wellness.healthcarepayer.com/biometric-screening',
    incentiveAmount: 50,
    incentiveDescription: 'Earn $50 wellness reward for completing your biometric screening.',
    results: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    assessmentId: 'HA-003',
    memberId: 'HCP-2024-00042',
    title: 'Lifestyle & Habits Assessment',
    description: 'Evaluate your daily habits including diet, exercise, sleep, and stress levels to receive personalized wellness recommendations.',
    type: 'lifestyle',
    status: 'available',
    completedDate: null,
    expirationDate: '2024-12-31',
    estimatedMinutes: 10,
    assessmentUrl: 'https://wellness.healthcarepayer.com/lifestyle-assessment',
    incentiveAmount: 15,
    incentiveDescription: 'Earn $15 wellness reward for completing the lifestyle assessment.',
    results: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    assessmentId: 'HA-004',
    memberId: 'HCP-2024-00042',
    title: 'Mental Health & Well-Being Check',
    description: 'A confidential assessment to evaluate your mental health and emotional well-being. Receive personalized resources and support recommendations.',
    type: 'mental_health',
    status: 'available',
    completedDate: null,
    expirationDate: '2024-12-31',
    estimatedMinutes: 10,
    assessmentUrl: 'https://wellness.healthcarepayer.com/mental-health-check',
    incentiveAmount: 15,
    incentiveDescription: 'Earn $15 wellness reward for completing the mental health check.',
    results: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    assessmentId: 'HA-005',
    memberId: 'HCP-2024-00042',
    title: 'Diabetes Risk Assessment',
    description: 'Assess your risk for developing type 2 diabetes based on your health history, lifestyle, and family history.',
    type: 'chronic_care',
    status: 'completed',
    completedDate: '2024-03-01',
    expirationDate: '2025-03-01',
    estimatedMinutes: 8,
    assessmentUrl: 'https://wellness.healthcarepayer.com/diabetes-risk',
    incentiveAmount: 10,
    incentiveDescription: 'Earn $10 wellness reward for completing the diabetes risk assessment.',
    results: {
      riskLevel: 'low',
      summary: 'Your risk for developing type 2 diabetes is low based on your current health indicators and lifestyle factors. Continue maintaining healthy habits to keep your risk low.',
      recommendations: [
        'Maintain a balanced diet rich in whole grains, fruits, and vegetables.',
        'Continue regular physical activity of at least 150 minutes per week.',
        'Monitor your blood sugar levels at your annual preventive visit.',
        'Maintain a healthy weight.',
      ],
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-01T14:00:00Z',
  },
];

// ===== Preventive Care Reminders =====

export const preventiveCareReminders = [
  {
    reminderId: 'PCR-001',
    memberId: 'HCP-2024-00042',
    title: 'Annual Wellness Visit',
    description: 'Schedule your annual preventive care visit with your primary care physician for a comprehensive health check-up.',
    category: 'exam',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    status: 'completed',
    dueDate: '2024-02-28',
    lastCompletedDate: '2024-02-01',
    frequency: 'Once per calendar year',
    ageGroup: 'Adults age 18 and older',
    cost: '$0 (covered at 100% in-network)',
    notes: 'Covered at 100% for in-network providers with no cost sharing per ACA guidelines.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
  {
    reminderId: 'PCR-002',
    memberId: 'HCP-2024-00042',
    title: 'Flu Vaccination',
    description: 'Get your annual influenza (flu) vaccine to protect yourself and others during flu season.',
    category: 'immunization',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    status: 'completed',
    dueDate: '2024-10-31',
    lastCompletedDate: '2024-02-01',
    frequency: 'Once per flu season (annually)',
    ageGroup: 'All ages 6 months and older',
    cost: '$0 (covered at 100% in-network)',
    notes: 'Available at your PCP office, participating pharmacies, and community flu clinics.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
  {
    reminderId: 'PCR-003',
    memberId: 'HCP-2024-00042',
    title: 'Dental Cleaning & Exam',
    description: 'Schedule your routine dental cleaning and oral examination with your dentist.',
    category: 'exam',
    coverageType: COVERAGE_TYPE.DENTAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.DENTAL],
    status: 'due',
    dueDate: '2024-08-15',
    lastCompletedDate: '2024-02-15',
    frequency: 'Twice per calendar year (every 6 months)',
    ageGroup: 'All ages',
    cost: '$0 (covered at 100% in-network)',
    notes: 'Two cleanings and exams per calendar year covered at 100% in-network.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z',
  },
  {
    reminderId: 'PCR-004',
    memberId: 'HCP-2024-00042',
    title: 'Comprehensive Eye Exam',
    description: 'Schedule your annual comprehensive eye examination with your eye care provider.',
    category: 'exam',
    coverageType: COVERAGE_TYPE.VISION,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.VISION],
    status: 'completed',
    dueDate: '2024-12-31',
    lastCompletedDate: '2024-01-20',
    frequency: 'Once per calendar year',
    ageGroup: 'All ages',
    cost: '$10 copay (in-network)',
    notes: 'One exam per calendar year. Includes dilation when professionally indicated.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
  },
  {
    reminderId: 'PCR-005',
    memberId: 'HCP-2024-00042',
    title: 'Blood Pressure Screening',
    description: 'Have your blood pressure checked regularly to monitor for hypertension.',
    category: 'screening',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    status: 'completed',
    dueDate: '2024-12-31',
    lastCompletedDate: '2024-02-01',
    frequency: 'At least once per year; more frequently if elevated',
    ageGroup: 'Adults age 18 and older',
    cost: '$0 (covered at 100% in-network)',
    notes: 'Typically performed during your annual wellness visit. More frequent monitoring recommended if blood pressure is elevated.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
  {
    reminderId: 'PCR-006',
    memberId: 'HCP-2024-00042',
    title: 'Cholesterol Screening (Lipid Panel)',
    description: 'Get your cholesterol levels checked with a lipid panel blood test.',
    category: 'lab',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    status: 'completed',
    dueDate: '2024-12-31',
    lastCompletedDate: '2024-03-15',
    frequency: 'Every 4-6 years for average risk; annually if elevated',
    ageGroup: 'Adults age 20 and older',
    cost: '$0 (covered at 100% in-network as preventive)',
    notes: 'Fasting lipid panel recommended. Covered as preventive care when ordered by your PCP.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T12:00:00Z',
  },
  {
    reminderId: 'PCR-007',
    memberId: 'HCP-2024-00042',
    title: 'Diabetes Screening (A1C / Fasting Glucose)',
    description: 'Screen for diabetes or pre-diabetes with a hemoglobin A1C or fasting blood glucose test.',
    category: 'lab',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    status: 'completed',
    dueDate: '2024-12-31',
    lastCompletedDate: '2024-03-15',
    frequency: 'Every 3 years for average risk; annually if pre-diabetic or at high risk',
    ageGroup: 'Adults age 35-70 who are overweight or obese; earlier if risk factors present',
    cost: '$0 (covered at 100% in-network as preventive)',
    notes: 'Covered as preventive care. More frequent testing recommended for those with pre-diabetes or risk factors.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T12:00:00Z',
  },
  {
    reminderId: 'PCR-008',
    memberId: 'HCP-2024-00042',
    title: 'Cervical Cancer Screening (Pap Smear)',
    description: 'Schedule your cervical cancer screening with your gynecologist or primary care provider.',
    category: 'screening',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    status: 'upcoming',
    dueDate: '2025-04-05',
    lastCompletedDate: '2022-04-05',
    frequency: 'Every 3 years (ages 21-65) or every 5 years with HPV co-testing (ages 30-65)',
    ageGroup: 'Women ages 21-65',
    cost: '$0 (covered at 100% in-network as preventive)',
    notes: 'Pap smear with or without HPV co-testing. Covered as preventive care per USPSTF guidelines.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    reminderId: 'PCR-009',
    memberId: 'HCP-2024-00042',
    title: 'Mammogram (Breast Cancer Screening)',
    description: 'Schedule your mammogram for breast cancer screening.',
    category: 'screening',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    status: 'upcoming',
    dueDate: '2025-01-01',
    lastCompletedDate: null,
    frequency: 'Every 1-2 years starting at age 40 (or earlier based on risk factors)',
    ageGroup: 'Women ages 40 and older',
    cost: '$0 (covered at 100% in-network as preventive)',
    notes: 'Screening mammogram covered as preventive care. Discuss timing with your provider based on personal and family history.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    reminderId: 'PCR-010',
    memberId: 'HCP-2024-00042',
    title: 'Tdap / Td Booster',
    description: 'Stay up to date on your tetanus, diphtheria, and pertussis (Tdap/Td) booster vaccination.',
    category: 'immunization',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    status: 'upcoming',
    dueDate: '2026-06-15',
    lastCompletedDate: '2016-06-15',
    frequency: 'Tdap once, then Td booster every 10 years',
    ageGroup: 'Adults age 19 and older',
    cost: '$0 (covered at 100% in-network)',
    notes: 'One dose of Tdap if not previously received, then Td booster every 10 years. Available at your PCP office or participating pharmacy.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    reminderId: 'PCR-011',
    memberId: 'HCP-2024-00042',
    title: 'Depression Screening',
    description: 'Complete a depression screening questionnaire during your annual wellness visit or with your behavioral health provider.',
    category: 'screening',
    coverageType: COVERAGE_TYPE.BEHAVIORAL_HEALTH,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.BEHAVIORAL_HEALTH],
    status: 'completed',
    dueDate: '2024-12-31',
    lastCompletedDate: '2024-02-01',
    frequency: 'Annually',
    ageGroup: 'Adults age 18 and older',
    cost: '$0 (covered at 100% as preventive)',
    notes: 'PHQ-9 screening typically administered during annual wellness visit. Follow-up care available through behavioral health providers.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
];

// ===== Wellness Goals =====

export const wellnessGoals = [
  {
    goalId: 'WG-001',
    memberId: 'HCP-2024-00042',
    title: 'Daily Steps Goal',
    description: 'Walk at least 8,000 steps per day to improve cardiovascular health and overall fitness.',
    category: 'fitness',
    status: 'active',
    targetValue: 8000,
    currentValue: 6500,
    unit: 'steps/day',
    startDate: '2024-03-01',
    targetDate: '2024-12-31',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    goalId: 'WG-002',
    memberId: 'HCP-2024-00042',
    title: 'Weekly Exercise Minutes',
    description: 'Achieve at least 150 minutes of moderate-intensity exercise per week.',
    category: 'fitness',
    status: 'active',
    targetValue: 150,
    currentValue: 110,
    unit: 'minutes/week',
    startDate: '2024-03-01',
    targetDate: '2024-12-31',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    goalId: 'WG-003',
    memberId: 'HCP-2024-00042',
    title: 'Daily Water Intake',
    description: 'Drink at least 8 glasses (64 oz) of water per day.',
    category: 'nutrition',
    status: 'active',
    targetValue: 8,
    currentValue: 6,
    unit: 'glasses/day',
    startDate: '2024-04-01',
    targetDate: '2024-12-31',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    goalId: 'WG-004',
    memberId: 'HCP-2024-00042',
    title: 'Sleep Duration',
    description: 'Get at least 7 hours of sleep per night for optimal health and recovery.',
    category: 'sleep',
    status: 'active',
    targetValue: 7,
    currentValue: 6.5,
    unit: 'hours/night',
    startDate: '2024-03-01',
    targetDate: '2024-12-31',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    goalId: 'WG-005',
    memberId: 'HCP-2024-00042',
    title: 'Mindfulness Minutes',
    description: 'Practice mindfulness or meditation for at least 10 minutes per day.',
    category: 'mental_health',
    status: 'active',
    targetValue: 10,
    currentValue: 5,
    unit: 'minutes/day',
    startDate: '2024-05-01',
    targetDate: '2024-12-31',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    goalId: 'WG-006',
    memberId: 'HCP-2024-00042',
    title: 'Complete All Preventive Screenings',
    description: 'Complete all recommended preventive care screenings for the plan year.',
    category: 'general',
    status: 'active',
    targetValue: 11,
    currentValue: 7,
    unit: 'screenings',
    startDate: '2024-01-01',
    targetDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
];

// ===== Wellness Incentives =====

export const wellnessIncentives = [
  {
    incentiveId: 'WI-001',
    memberId: 'HCP-2024-00042',
    title: 'Annual HRA Completion',
    description: 'Reward for completing your Annual Health Risk Assessment.',
    type: 'assessment',
    amount: 50,
    status: 'earned',
    earnedDate: '2024-02-15',
    expirationDate: '2024-12-31',
    relatedId: 'HA-001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  {
    incentiveId: 'WI-002',
    memberId: 'HCP-2024-00042',
    title: 'Diabetes Risk Assessment Completion',
    description: 'Reward for completing the Diabetes Risk Assessment.',
    type: 'assessment',
    amount: 10,
    status: 'earned',
    earnedDate: '2024-03-01',
    expirationDate: '2024-12-31',
    relatedId: 'HA-005',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-01T14:00:00Z',
  },
  {
    incentiveId: 'WI-003',
    memberId: 'HCP-2024-00042',
    title: 'Biometric Screening Completion',
    description: 'Reward for completing your annual biometric screening.',
    type: 'assessment',
    amount: 50,
    status: 'available',
    earnedDate: null,
    expirationDate: '2024-12-31',
    relatedId: 'HA-002',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    incentiveId: 'WI-004',
    memberId: 'HCP-2024-00042',
    title: 'Walking Challenge Completion',
    description: 'Reward for completing the Healthy Steps Walking Challenge.',
    type: 'program',
    amount: 50,
    status: 'available',
    earnedDate: null,
    expirationDate: '2024-12-31',
    relatedId: 'WP-001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    incentiveId: 'WI-005',
    memberId: 'HCP-2024-00042',
    title: 'Preventive Care Visit',
    description: 'Reward for completing your annual preventive care visit.',
    type: 'preventive',
    amount: 25,
    status: 'earned',
    earnedDate: '2024-02-01',
    expirationDate: '2024-12-31',
    relatedId: 'PCR-001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
  {
    incentiveId: 'WI-006',
    memberId: 'HCP-2024-00042',
    title: 'Dental Cleaning Completion',
    description: 'Reward for completing a preventive dental cleaning.',
    type: 'preventive',
    amount: 15,
    status: 'earned',
    earnedDate: '2024-02-15',
    expirationDate: '2024-12-31',
    relatedId: 'PCR-003',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z',
  },
  {
    incentiveId: 'WI-007',
    memberId: 'HCP-2024-00042',
    title: 'Lifestyle Assessment Completion',
    description: 'Reward for completing the Lifestyle & Habits Assessment.',
    type: 'assessment',
    amount: 15,
    status: 'available',
    earnedDate: null,
    expirationDate: '2024-12-31',
    relatedId: 'HA-003',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    incentiveId: 'WI-008',
    memberId: 'HCP-2024-00042',
    title: 'Mental Health Check Completion',
    description: 'Reward for completing the Mental Health & Well-Being Check.',
    type: 'assessment',
    amount: 15,
    status: 'available',
    earnedDate: null,
    expirationDate: '2024-12-31',
    relatedId: 'HA-004',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    incentiveId: 'WI-009',
    memberId: 'HCP-2024-00042',
    title: 'Nutrition Program Completion',
    description: 'Reward for completing the Nutrition & Healthy Eating Program.',
    type: 'program',
    amount: 25,
    status: 'available',
    earnedDate: null,
    expirationDate: '2024-12-31',
    relatedId: 'WP-002',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    incentiveId: 'WI-010',
    memberId: 'HCP-2024-00042',
    title: 'Stress Management Program Completion',
    description: 'Reward for completing the Stress Management & Mindfulness program.',
    type: 'program',
    amount: 25,
    status: 'available',
    earnedDate: null,
    expirationDate: '2024-12-31',
    relatedId: 'WP-003',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ===== Helper Functions =====

/**
 * Returns all wellness programs.
 * @returns {Object[]} Array of wellness program objects
 */
export const getWellnessPrograms = () => {
  return [...wellnessPrograms];
};

/**
 * Returns wellness programs filtered by category.
 * @param {string} category - The program category to filter by ('fitness', 'nutrition', 'mental_health', 'chronic_care', 'preventive', 'lifestyle')
 * @returns {Object[]} Array of wellness program objects matching the category
 */
export const getWellnessProgramsByCategory = (category) => {
  return wellnessPrograms.filter((program) => program.category === category);
};

/**
 * Returns a single wellness program by its program ID.
 * @param {string} programId - The program identifier
 * @returns {Object|undefined} The wellness program object or undefined if not found
 */
export const getWellnessProgramById = (programId) => {
  return wellnessPrograms.find((program) => program.programId === programId);
};

/**
 * Returns wellness programs filtered by status.
 * @param {string} status - The program status to filter by ('available', 'enrolled', 'completed')
 * @returns {Object[]} Array of wellness program objects matching the status
 */
export const getWellnessProgramsByStatus = (status) => {
  return wellnessPrograms.filter((program) => program.status === status);
};

/**
 * Returns all health assessments for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of health assessment objects for the member
 */
export const getHealthAssessmentsByMemberId = (memberId) => {
  return healthAssessments.filter((assessment) => assessment.memberId === memberId);
};

/**
 * Returns a single health assessment by its assessment ID.
 * @param {string} assessmentId - The assessment identifier
 * @returns {Object|undefined} The health assessment object or undefined if not found
 */
export const getHealthAssessmentById = (assessmentId) => {
  return healthAssessments.find((assessment) => assessment.assessmentId === assessmentId);
};

/**
 * Returns health assessments filtered by status for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} status - The assessment status to filter by ('available', 'in_progress', 'completed', 'expired')
 * @returns {Object[]} Array of health assessment objects matching the status
 */
export const getHealthAssessmentsByStatus = (memberId, status) => {
  return healthAssessments.filter(
    (assessment) => assessment.memberId === memberId && assessment.status === status
  );
};

/**
 * Returns health assessments filtered by type for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} type - The assessment type to filter by ('hra', 'biometric', 'lifestyle', 'mental_health', 'chronic_care')
 * @returns {Object[]} Array of health assessment objects matching the type
 */
export const getHealthAssessmentsByType = (memberId, type) => {
  return healthAssessments.filter(
    (assessment) => assessment.memberId === memberId && assessment.type === type
  );
};

/**
 * Returns all preventive care reminders for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of preventive care reminder objects for the member
 */
export const getPreventiveCareRemindersByMemberId = (memberId) => {
  return preventiveCareReminders.filter((reminder) => reminder.memberId === memberId);
};

/**
 * Returns a single preventive care reminder by its reminder ID.
 * @param {string} reminderId - The reminder identifier
 * @returns {Object|undefined} The preventive care reminder object or undefined if not found
 */
export const getPreventiveCareReminderById = (reminderId) => {
  return preventiveCareReminders.find((reminder) => reminder.reminderId === reminderId);
};

/**
 * Returns preventive care reminders filtered by status for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} status - The reminder status to filter by ('due', 'upcoming', 'overdue', 'completed')
 * @returns {Object[]} Array of preventive care reminder objects matching the status
 */
export const getPreventiveCareRemindersByStatus = (memberId, status) => {
  return preventiveCareReminders.filter(
    (reminder) => reminder.memberId === memberId && reminder.status === status
  );
};

/**
 * Returns preventive care reminders filtered by coverage type for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} coverageType - The coverage type to filter by (MEDICAL, DENTAL, VISION, PHARMACY, BEHAVIORAL_HEALTH)
 * @returns {Object[]} Array of preventive care reminder objects matching the coverage type
 */
export const getPreventiveCareRemindersByCoverageType = (memberId, coverageType) => {
  return preventiveCareReminders.filter(
    (reminder) => reminder.memberId === memberId && reminder.coverageType === coverageType
  );
};

/**
 * Returns preventive care reminders filtered by category for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} category - The reminder category to filter by ('screening', 'immunization', 'exam', 'lab')
 * @returns {Object[]} Array of preventive care reminder objects matching the category
 */
export const getPreventiveCareRemindersByCategory = (memberId, category) => {
  return preventiveCareReminders.filter(
    (reminder) => reminder.memberId === memberId && reminder.category === category
  );
};

/**
 * Returns all wellness goals for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of wellness goal objects for the member
 */
export const getWellnessGoalsByMemberId = (memberId) => {
  return wellnessGoals.filter((goal) => goal.memberId === memberId);
};

/**
 * Returns a single wellness goal by its goal ID.
 * @param {string} goalId - The goal identifier
 * @returns {Object|undefined} The wellness goal object or undefined if not found
 */
export const getWellnessGoalById = (goalId) => {
  return wellnessGoals.find((goal) => goal.goalId === goalId);
};

/**
 * Returns wellness goals filtered by status for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} status - The goal status to filter by ('active', 'completed', 'paused')
 * @returns {Object[]} Array of wellness goal objects matching the status
 */
export const getWellnessGoalsByStatus = (memberId, status) => {
  return wellnessGoals.filter(
    (goal) => goal.memberId === memberId && goal.status === status
  );
};

/**
 * Returns wellness goals filtered by category for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} category - The goal category to filter by ('fitness', 'nutrition', 'mental_health', 'sleep', 'weight', 'general')
 * @returns {Object[]} Array of wellness goal objects matching the category
 */
export const getWellnessGoalsByCategory = (memberId, category) => {
  return wellnessGoals.filter(
    (goal) => goal.memberId === memberId && goal.category === category
  );
};

/**
 * Returns all wellness incentives for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of wellness incentive objects for the member
 */
export const getWellnessIncentivesByMemberId = (memberId) => {
  return wellnessIncentives.filter((incentive) => incentive.memberId === memberId);
};

/**
 * Returns a single wellness incentive by its incentive ID.
 * @param {string} incentiveId - The incentive identifier
 * @returns {Object|undefined} The wellness incentive object or undefined if not found
 */
export const getWellnessIncentiveById = (incentiveId) => {
  return wellnessIncentives.find((incentive) => incentive.incentiveId === incentiveId);
};

/**
 * Returns wellness incentives filtered by status for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} status - The incentive status to filter by ('available', 'earned', 'redeemed', 'expired')
 * @returns {Object[]} Array of wellness incentive objects matching the status
 */
export const getWellnessIncentivesByStatus = (memberId, status) => {
  return wellnessIncentives.filter(
    (incentive) => incentive.memberId === memberId && incentive.status === status
  );
};

/**
 * Returns wellness incentives filtered by type for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} type - The incentive type to filter by ('assessment', 'program', 'activity', 'preventive')
 * @returns {Object[]} Array of wellness incentive objects matching the type
 */
export const getWellnessIncentivesByType = (memberId, type) => {
  return wellnessIncentives.filter(
    (incentive) => incentive.memberId === memberId && incentive.type === type
  );
};

/**
 * Returns a comprehensive wellness summary for a given member.
 * @param {string} memberId - The member identifier
 * @returns {Object} Summary object with counts, totals, and key wellness metrics
 */
export const getWellnessSummary = (memberId) => {
  const memberAssessments = getHealthAssessmentsByMemberId(memberId);
  const memberReminders = getPreventiveCareRemindersByMemberId(memberId);
  const memberGoals = getWellnessGoalsByMemberId(memberId);
  const memberIncentives = getWellnessIncentivesByMemberId(memberId);

  const assessmentStatusCounts = {
    available: 0,
    in_progress: 0,
    completed: 0,
    expired: 0,
  };

  memberAssessments.forEach((assessment) => {
    if (assessmentStatusCounts[assessment.status] !== undefined) {
      assessmentStatusCounts[assessment.status] += 1;
    }
  });

  const reminderStatusCounts = {
    due: 0,
    upcoming: 0,
    overdue: 0,
    completed: 0,
  };

  memberReminders.forEach((reminder) => {
    if (reminderStatusCounts[reminder.status] !== undefined) {
      reminderStatusCounts[reminder.status] += 1;
    }
  });

  const goalStatusCounts = {
    active: 0,
    completed: 0,
    paused: 0,
  };

  memberGoals.forEach((goal) => {
    if (goalStatusCounts[goal.status] !== undefined) {
      goalStatusCounts[goal.status] += 1;
    }
  });

  let totalIncentivesEarned = 0;
  let totalIncentivesAvailable = 0;
  let incentivesEarnedCount = 0;
  let incentivesAvailableCount = 0;

  memberIncentives.forEach((incentive) => {
    if (incentive.status === 'earned' || incentive.status === 'redeemed') {
      totalIncentivesEarned += incentive.amount;
      incentivesEarnedCount += 1;
    }
    if (incentive.status === 'available') {
      totalIncentivesAvailable += incentive.amount;
      incentivesAvailableCount += 1;
    }
  });

  return {
    totalPrograms: wellnessPrograms.length,
    totalAssessments: memberAssessments.length,
    assessmentStatusCounts,
    totalReminders: memberReminders.length,
    reminderStatusCounts,
    totalGoals: memberGoals.length,
    goalStatusCounts,
    totalIncentives: memberIncentives.length,
    totalIncentivesEarned: Math.round(totalIncentivesEarned * 100) / 100,
    totalIncentivesAvailable: Math.round(totalIncentivesAvailable * 100) / 100,
    incentivesEarnedCount,
    incentivesAvailableCount,
    programCategories: {
      fitness: wellnessPrograms.filter((p) => p.category === 'fitness').length,
      nutrition: wellnessPrograms.filter((p) => p.category === 'nutrition').length,
      mental_health: wellnessPrograms.filter((p) => p.category === 'mental_health').length,
      chronic_care: wellnessPrograms.filter((p) => p.category === 'chronic_care').length,
      lifestyle: wellnessPrograms.filter((p) => p.category === 'lifestyle').length,
    },
    reminderCategories: {
      screening: memberReminders.filter((r) => r.category === 'screening').length,
      immunization: memberReminders.filter((r) => r.category === 'immunization').length,
      exam: memberReminders.filter((r) => r.category === 'exam').length,
      lab: memberReminders.filter((r) => r.category === 'lab').length,
    },
  };
};