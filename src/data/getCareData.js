import { EXTERNAL_URLS, SUPPORT, COVERAGE_TYPE, COVERAGE_TYPE_LABELS } from '../constants/constants.js';

/**
 * Mock Get Care data fixture.
 * Used for development and testing of Get Care section features including
 * Find Care & Cost content, Telemedicine guidance, Behavioral Health resources,
 * and external link URLs for National Doctor & Hospital Finder.
 *
 * @typedef {Object} FindCareCategory
 * @property {string} categoryId - Unique category identifier
 * @property {string} title - Category display title
 * @property {string} description - Category description
 * @property {string} icon - Icon identifier for display
 * @property {string} coverageType - Associated coverage type
 * @property {string} coverageTypeLabel - Human-readable coverage type label
 * @property {string} externalUrl - External URL for provider search
 * @property {string} internalRoute - Internal route path
 * @property {string[]} searchHints - Example search terms for the category
 *
 * @typedef {Object} CostEstimate
 * @property {string} estimateId - Unique estimate identifier
 * @property {string} serviceType - Type of service
 * @property {string} description - Service description
 * @property {string} inNetworkRange - Estimated in-network cost range
 * @property {string} outOfNetworkRange - Estimated out-of-network cost range
 * @property {string} notes - Additional notes about the estimate
 *
 * @typedef {Object} TelemedicineProvider
 * @property {string} providerId - Unique provider identifier
 * @property {string} name - Provider name
 * @property {string} description - Provider description
 * @property {string} url - Provider URL
 * @property {string} phone - Provider phone number
 * @property {string[]} servicesOffered - List of services offered
 * @property {string} copay - Copay amount for telemedicine visit
 * @property {string} availability - Availability description
 * @property {string} icon - Icon identifier for display
 *
 * @typedef {Object} FAQ
 * @property {string} faqId - Unique FAQ identifier
 * @property {string} question - FAQ question
 * @property {string} answer - FAQ answer
 * @property {string} category - FAQ category (findCare, telemedicine, behavioralHealth, cost)
 *
 * @typedef {Object} BehavioralHealthResource
 * @property {string} resourceId - Unique resource identifier
 * @property {string} title - Resource title
 * @property {string} description - Resource description
 * @property {string} phone - Contact phone number
 * @property {string} url - Resource URL
 * @property {string} availability - Availability description
 * @property {string} type - Resource type (crisis, therapy, substance, general)
 * @property {string} icon - Icon identifier for display
 *
 * @typedef {Object} ExternalLink
 * @property {string} linkId - Unique link identifier
 * @property {string} title - Link display title
 * @property {string} description - Link description
 * @property {string} url - External URL
 * @property {string} icon - Icon identifier for display
 * @property {string} category - Link category (provider, pharmacy, facility, tool)
 */

// ===== Find Care Categories =====

export const findCareCategories = [
  {
    categoryId: 'FC-CAT-001',
    title: 'Primary Care Physician',
    description: 'Find a primary care doctor in your network for routine checkups, preventive care, and general health concerns.',
    icon: 'user',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    externalUrl: EXTERNAL_URLS.doctorFinder,
    internalRoute: '/find-doctor',
    searchHints: ['family medicine', 'internal medicine', 'general practitioner', 'PCP'],
  },
  {
    categoryId: 'FC-CAT-002',
    title: 'Specialist',
    description: 'Search for in-network specialists including cardiologists, dermatologists, orthopedists, and more.',
    icon: 'stethoscope',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    externalUrl: EXTERNAL_URLS.doctorFinder,
    internalRoute: '/find-doctor',
    searchHints: ['cardiologist', 'dermatologist', 'orthopedist', 'neurologist', 'endocrinologist'],
  },
  {
    categoryId: 'FC-CAT-003',
    title: 'Hospital & Facility',
    description: 'Locate in-network hospitals, surgical centers, imaging facilities, and urgent care centers near you.',
    icon: 'building',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    externalUrl: EXTERNAL_URLS.doctorFinder,
    internalRoute: '/find-doctor',
    searchHints: ['hospital', 'urgent care', 'emergency room', 'surgical center', 'imaging center'],
  },
  {
    categoryId: 'FC-CAT-004',
    title: 'Dentist',
    description: 'Find an in-network dentist for cleanings, fillings, crowns, and other dental services.',
    icon: 'smile',
    coverageType: COVERAGE_TYPE.DENTAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.DENTAL],
    externalUrl: EXTERNAL_URLS.doctorFinder + '/dental',
    internalRoute: '/find-doctor',
    searchHints: ['general dentist', 'orthodontist', 'periodontist', 'oral surgeon', 'endodontist'],
  },
  {
    categoryId: 'FC-CAT-005',
    title: 'Eye Care Provider',
    description: 'Search for in-network optometrists and ophthalmologists for eye exams, glasses, and contacts.',
    icon: 'eye',
    coverageType: COVERAGE_TYPE.VISION,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.VISION],
    externalUrl: EXTERNAL_URLS.doctorFinder + '/vision',
    internalRoute: '/find-doctor',
    searchHints: ['optometrist', 'ophthalmologist', 'eye doctor', 'vision center'],
  },
  {
    categoryId: 'FC-CAT-006',
    title: 'Pharmacy',
    description: 'Find a participating pharmacy near you for prescription medications, including retail and specialty pharmacies.',
    icon: 'pill',
    coverageType: COVERAGE_TYPE.PHARMACY,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.PHARMACY],
    externalUrl: EXTERNAL_URLS.doctorFinder + '/pharmacy',
    internalRoute: '/find-doctor',
    searchHints: ['pharmacy', 'drugstore', 'mail order pharmacy', 'specialty pharmacy'],
  },
  {
    categoryId: 'FC-CAT-007',
    title: 'Behavioral Health Provider',
    description: 'Find therapists, psychiatrists, and counselors in your behavioral health network.',
    icon: 'heart',
    coverageType: COVERAGE_TYPE.BEHAVIORAL_HEALTH,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.BEHAVIORAL_HEALTH],
    externalUrl: EXTERNAL_URLS.doctorFinder + '/behavioral-health',
    internalRoute: '/find-doctor',
    searchHints: ['therapist', 'psychiatrist', 'psychologist', 'counselor', 'social worker'],
  },
  {
    categoryId: 'FC-CAT-008',
    title: 'Lab & Pathology',
    description: 'Locate in-network laboratories for blood work, diagnostic testing, and pathology services.',
    icon: 'flask',
    coverageType: COVERAGE_TYPE.MEDICAL,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[COVERAGE_TYPE.MEDICAL],
    externalUrl: EXTERNAL_URLS.doctorFinder,
    internalRoute: '/find-doctor',
    searchHints: ['lab', 'blood work', 'diagnostic testing', 'Quest Diagnostics', 'LabCorp'],
  },
];

// ===== Cost Estimates =====

export const costEstimates = [
  {
    estimateId: 'CE-001',
    serviceType: 'Primary Care Visit',
    description: 'Office visit with your primary care physician for a routine or sick visit.',
    inNetworkRange: '$25 copay',
    outOfNetworkRange: '$80 - $250 + 40% after deductible',
    notes: 'In-network copay applies per visit. Deductible waived for in-network PCP visits.',
  },
  {
    estimateId: 'CE-002',
    serviceType: 'Specialist Visit',
    description: 'Office visit with a specialist physician.',
    inNetworkRange: '$50 copay',
    outOfNetworkRange: '$150 - $400 + 40% after deductible',
    notes: 'Referral not required for PPO plan. Copay applies per visit.',
  },
  {
    estimateId: 'CE-003',
    serviceType: 'Urgent Care Visit',
    description: 'Visit to an urgent care facility for non-emergency conditions.',
    inNetworkRange: '$75 copay',
    outOfNetworkRange: '$75 + 40% after deductible',
    notes: 'In-network copay applies regardless of location.',
  },
  {
    estimateId: 'CE-004',
    serviceType: 'Emergency Room Visit',
    description: 'Emergency department visit for acute or life-threatening conditions.',
    inNetworkRange: '$250 copay + 20% after deductible',
    outOfNetworkRange: '$250 copay + 20% after deductible',
    notes: 'Copay waived if admitted to the hospital within 24 hours. ER copay applies at any facility.',
  },
  {
    estimateId: 'CE-005',
    serviceType: 'MRI (without contrast)',
    description: 'Magnetic resonance imaging scan without contrast dye.',
    inNetworkRange: '$150 copay + 20% after deductible',
    outOfNetworkRange: '$800 - $3,500 + 40% after deductible',
    notes: 'Pre-authorization required for advanced imaging. Costs vary by facility.',
  },
  {
    estimateId: 'CE-006',
    serviceType: 'CT Scan (with contrast)',
    description: 'Computed tomography scan with contrast dye.',
    inNetworkRange: '$150 copay + 20% after deductible',
    outOfNetworkRange: '$600 - $3,000 + 40% after deductible',
    notes: 'Pre-authorization required. Outpatient facility rates may differ from hospital rates.',
  },
  {
    estimateId: 'CE-007',
    serviceType: 'X-ray',
    description: 'Standard diagnostic X-ray imaging.',
    inNetworkRange: '$50 copay + 10% after deductible',
    outOfNetworkRange: '$100 - $500 + 40% after deductible',
    notes: 'No pre-authorization required for standard X-rays.',
  },
  {
    estimateId: 'CE-008',
    serviceType: 'Lab Work (Comprehensive Metabolic Panel)',
    description: 'Blood test measuring kidney function, liver function, blood sugar, and electrolytes.',
    inNetworkRange: '$10 copay',
    outOfNetworkRange: '$50 - $200 + 40% after deductible',
    notes: 'Preventive labs covered at 100% in-network. Diagnostic labs subject to copay.',
  },
  {
    estimateId: 'CE-009',
    serviceType: 'Physical Therapy Session',
    description: 'Outpatient physical therapy session (45-60 minutes).',
    inNetworkRange: '$50 copay per session',
    outOfNetworkRange: '$100 - $350 + 40% after deductible',
    notes: 'Pre-authorization may be required after initial evaluation. Up to 30 visits per plan year.',
  },
  {
    estimateId: 'CE-010',
    serviceType: 'Generic Prescription (30-day)',
    description: 'Tier 1 generic medication, 30-day retail supply.',
    inNetworkRange: '$10 copay',
    outOfNetworkRange: 'Higher cost; see plan details',
    notes: 'Generic medications are exempt from pharmacy deductible.',
  },
  {
    estimateId: 'CE-011',
    serviceType: 'Preferred Brand Prescription (30-day)',
    description: 'Tier 2 preferred brand-name medication, 30-day retail supply.',
    inNetworkRange: '$35 copay',
    outOfNetworkRange: 'Higher cost; see plan details',
    notes: 'Pharmacy deductible applies to Tier 2 and above.',
  },
  {
    estimateId: 'CE-012',
    serviceType: 'Preventive Care Visit',
    description: 'Annual wellness exam, immunizations, and routine screenings.',
    inNetworkRange: '$0 (covered at 100%)',
    outOfNetworkRange: '40% after deductible',
    notes: 'Covered at 100% for in-network providers with no cost sharing per ACA guidelines.',
  },
];

// ===== Telemedicine Providers =====

export const telemedicineProviders = [
  {
    providerId: 'TM-001',
    name: 'HealthFirst Telehealth',
    description: 'Connect with board-certified doctors 24/7 via video or phone for non-emergency medical issues, prescriptions, and follow-up care.',
    url: 'https://telehealth.healthcarepayer.com',
    phone: '1-800-555-0160',
    servicesOffered: [
      'Cold & flu symptoms',
      'Allergies & sinus infections',
      'Skin conditions & rashes',
      'Urinary tract infections',
      'Prescription refills',
      'General health questions',
      'Follow-up visits',
    ],
    copay: '$25 per visit',
    availability: '24 hours a day, 7 days a week, 365 days a year',
    icon: 'video',
  },
  {
    providerId: 'TM-002',
    name: 'HealthFirst Virtual Behavioral Health',
    description: 'Access licensed therapists and psychiatrists from the comfort of your home for mental health counseling and medication management.',
    url: 'https://telehealth.healthcarepayer.com/behavioral-health',
    phone: '1-800-555-0175',
    servicesOffered: [
      'Individual therapy sessions',
      'Psychiatric evaluations',
      'Medication management',
      'Anxiety & depression counseling',
      'Stress management',
      'Grief counseling',
      'Couples counseling',
    ],
    copay: '$25 per visit',
    availability: 'Monday - Friday: 7:00 AM - 11:00 PM ET, Saturday - Sunday: 8:00 AM - 8:00 PM ET',
    icon: 'heart',
  },
  {
    providerId: 'TM-003',
    name: 'HealthFirst Virtual Urgent Care',
    description: 'Get urgent care-level treatment virtually for conditions that need prompt attention but are not life-threatening.',
    url: 'https://telehealth.healthcarepayer.com/urgent-care',
    phone: '1-800-555-0165',
    servicesOffered: [
      'Minor injuries & sprains',
      'Ear & eye infections',
      'Fever & flu symptoms',
      'Nausea & vomiting',
      'Back pain',
      'Headaches & migraines',
      'Minor burns',
    ],
    copay: '$50 per visit',
    availability: '24 hours a day, 7 days a week',
    icon: 'alert-circle',
  },
  {
    providerId: 'TM-004',
    name: 'HealthFirst Dermatology Online',
    description: 'Submit photos and descriptions of skin conditions for evaluation by board-certified dermatologists within 24-48 hours.',
    url: 'https://telehealth.healthcarepayer.com/dermatology',
    phone: '1-800-555-0170',
    servicesOffered: [
      'Acne evaluation',
      'Rash & skin irritation',
      'Mole assessment',
      'Eczema & psoriasis',
      'Skin infection evaluation',
      'Follow-up care',
    ],
    copay: '$50 per consultation',
    availability: 'Submissions accepted 24/7. Responses within 24-48 hours.',
    icon: 'camera',
  },
];

// ===== Telemedicine Guidance =====

export const telemedicineGuidance = {
  title: 'When to Use Telemedicine',
  description: 'Telemedicine offers a convenient way to see a doctor without leaving your home. Here are some guidelines to help you decide when telemedicine is right for you.',
  whenToUse: [
    'You have cold, flu, or allergy symptoms',
    'You need a prescription refill for a known condition',
    'You have a minor skin condition or rash',
    'You need a follow-up visit for a previously diagnosed condition',
    'You want to discuss mental health concerns with a therapist',
    'You have a urinary tract infection',
    'You need general health advice or guidance',
    'You are traveling and need medical advice',
  ],
  whenNotToUse: [
    'You are experiencing a medical emergency (call 911)',
    'You have chest pain, difficulty breathing, or signs of a stroke',
    'You need a physical examination or hands-on procedure',
    'You have a condition requiring lab work or imaging',
    'You need emergency dental or vision care',
    'You have a severe allergic reaction',
    'You are experiencing suicidal thoughts (call 988 immediately)',
  ],
  howToGetStarted: [
    {
      step: 1,
      title: 'Log In',
      description: 'Log in to the HealthFirst Telehealth portal or download the mobile app.',
    },
    {
      step: 2,
      title: 'Choose Your Visit Type',
      description: 'Select the type of visit you need: general medical, behavioral health, urgent care, or dermatology.',
    },
    {
      step: 3,
      title: 'Describe Your Symptoms',
      description: 'Provide details about your symptoms, medical history, and any medications you are currently taking.',
    },
    {
      step: 4,
      title: 'Connect with a Provider',
      description: 'You will be connected with a licensed provider via video or phone. Average wait time is under 15 minutes.',
    },
    {
      step: 5,
      title: 'Receive Your Care Plan',
      description: 'Your provider will discuss your diagnosis, treatment plan, and any prescriptions. A visit summary will be sent to your account.',
    },
  ],
};

// ===== Behavioral Health Resources =====

export const behavioralHealthResources = [
  {
    resourceId: 'BH-RES-001',
    title: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support for people in distress. Available 24/7 by phone, chat, or text. If you or someone you know is in crisis, call or text 988 immediately.',
    phone: '988',
    url: 'https://988lifeline.org',
    availability: '24 hours a day, 7 days a week',
    type: 'crisis',
    icon: 'phone',
  },
  {
    resourceId: 'BH-RES-002',
    title: 'Crisis Text Line',
    description: 'Text HOME to 741741 to connect with a trained crisis counselor. Free, confidential support available 24/7.',
    phone: 'Text HOME to 741741',
    url: 'https://www.crisistextline.org',
    availability: '24 hours a day, 7 days a week',
    type: 'crisis',
    icon: 'message-circle',
  },
  {
    resourceId: 'BH-RES-003',
    title: 'SAMHSA National Helpline',
    description: 'Free, confidential, 24/7 treatment referral and information service for substance abuse and mental health disorders.',
    phone: '1-800-662-4357',
    url: 'https://www.samhsa.gov/find-help/national-helpline',
    availability: '24 hours a day, 7 days a week, 365 days a year',
    type: 'substance',
    icon: 'phone',
  },
  {
    resourceId: 'BH-RES-004',
    title: 'HealthFirst Behavioral Health Line',
    description: 'Speak with a behavioral health specialist to find in-network therapists, psychiatrists, and treatment programs covered by your plan.',
    phone: '1-800-555-0175',
    url: 'https://telehealth.healthcarepayer.com/behavioral-health',
    availability: 'Monday - Friday: 8:00 AM - 8:00 PM ET, Saturday: 9:00 AM - 5:00 PM ET',
    type: 'general',
    icon: 'heart',
  },
  {
    resourceId: 'BH-RES-005',
    title: 'Employee Assistance Program (EAP)',
    description: 'Confidential short-term counseling and referral services for personal and work-related issues. Up to 6 free sessions per issue per year.',
    phone: '1-800-555-0180',
    url: 'https://eap.healthcarepayer.com',
    availability: '24 hours a day, 7 days a week',
    type: 'general',
    icon: 'users',
  },
  {
    resourceId: 'BH-RES-006',
    title: 'Find a Therapist',
    description: 'Search for in-network licensed therapists, psychologists, and counselors in your area who specialize in your needs.',
    phone: '1-800-555-0175',
    url: EXTERNAL_URLS.doctorFinder + '/behavioral-health',
    availability: 'Online directory available 24/7',
    type: 'therapy',
    icon: 'search',
  },
  {
    resourceId: 'BH-RES-007',
    title: 'Substance Abuse Treatment Locator',
    description: 'Find substance abuse treatment facilities and programs in your area, including detox, residential, and outpatient programs.',
    phone: '1-800-662-4357',
    url: 'https://findtreatment.gov',
    availability: 'Online directory available 24/7',
    type: 'substance',
    icon: 'map-pin',
  },
  {
    resourceId: 'BH-RES-008',
    title: 'Virtual Therapy Sessions',
    description: 'Connect with a licensed therapist from home via secure video. Same copay as in-person visits. No referral required.',
    phone: '1-800-555-0175',
    url: 'https://telehealth.healthcarepayer.com/behavioral-health',
    availability: 'Monday - Friday: 7:00 AM - 11:00 PM ET, Saturday - Sunday: 8:00 AM - 8:00 PM ET',
    type: 'therapy',
    icon: 'video',
  },
];

// ===== FAQs =====

export const getCaresFAQs = [
  // Find Care FAQs
  {
    faqId: 'FAQ-FC-001',
    question: 'How do I find an in-network doctor?',
    answer: 'Use the Find a Doctor tool on our website or mobile app. You can search by provider name, specialty, location, or facility type. All results will show whether the provider is in your plan\'s network. You can also call Member Services at ' + SUPPORT.phone + ' for assistance.',
    category: 'findCare',
  },
  {
    faqId: 'FAQ-FC-002',
    question: 'Do I need a referral to see a specialist?',
    answer: 'No. With your HealthFirst PPO plan, you do not need a referral to see a specialist. You can make an appointment directly with any in-network specialist. However, seeing an in-network provider will result in lower out-of-pocket costs.',
    category: 'findCare',
  },
  {
    faqId: 'FAQ-FC-003',
    question: 'What is the difference between in-network and out-of-network?',
    answer: 'In-network providers have contracted with HealthFirst to provide services at negotiated rates, resulting in lower costs for you. Out-of-network providers have not contracted with us, so you may pay significantly more. Your plan covers both, but your copays, deductibles, and coinsurance will be higher for out-of-network care.',
    category: 'findCare',
  },
  {
    faqId: 'FAQ-FC-004',
    question: 'How do I change my primary care physician (PCP)?',
    answer: 'You can change your PCP at any time by logging into the member portal and navigating to Settings > My Coverage > Change PCP. You can also call Member Services at ' + SUPPORT.phone + '. Your new PCP selection will take effect immediately.',
    category: 'findCare',
  },
  {
    faqId: 'FAQ-FC-005',
    question: 'What should I do if I need care while traveling?',
    answer: 'If you need emergency care while traveling, go to the nearest emergency room. Emergency services are covered at the in-network rate regardless of the provider. For non-emergency care, you can use the HealthFirst Telehealth service 24/7 or search for in-network providers in the area you are visiting using the Find a Doctor tool.',
    category: 'findCare',
  },

  // Cost FAQs
  {
    faqId: 'FAQ-COST-001',
    question: 'How can I estimate my costs before receiving care?',
    answer: 'Use the Cost Estimator tool in the Get Care section to see estimated costs for common services. Costs depend on your plan type, whether the provider is in-network, your deductible status, and the specific services provided. For a personalized estimate, call Member Services at ' + SUPPORT.phone + '.',
    category: 'cost',
  },
  {
    faqId: 'FAQ-COST-002',
    question: 'What is the difference between a copay, coinsurance, and deductible?',
    answer: 'A copay is a fixed amount you pay for a service (e.g., $25 for a doctor visit). Coinsurance is a percentage of the allowed amount you pay after meeting your deductible (e.g., 20%). A deductible is the amount you pay out-of-pocket before your plan starts paying. Once you meet your deductible, you pay only copays and coinsurance until you reach your out-of-pocket maximum.',
    category: 'cost',
  },
  {
    faqId: 'FAQ-COST-003',
    question: 'What counts toward my deductible and out-of-pocket maximum?',
    answer: 'Copays, coinsurance, and amounts you pay toward your deductible all count toward your out-of-pocket maximum. Premiums, out-of-network charges above the allowed amount, and services not covered by your plan do not count toward your deductible or out-of-pocket maximum.',
    category: 'cost',
  },
  {
    faqId: 'FAQ-COST-004',
    question: 'Why does the same service cost different amounts at different facilities?',
    answer: 'Costs can vary based on the facility type (hospital vs. outpatient center), geographic location, and the negotiated rate between the provider and HealthFirst. Outpatient facilities and freestanding centers often have lower costs than hospital-based facilities for the same service.',
    category: 'cost',
  },

  // Telemedicine FAQs
  {
    faqId: 'FAQ-TM-001',
    question: 'What is telemedicine and how does it work?',
    answer: 'Telemedicine allows you to see a doctor via video or phone from anywhere. Simply log in to the HealthFirst Telehealth portal, choose your visit type, describe your symptoms, and connect with a licensed provider. You can receive diagnoses, treatment plans, and prescriptions without visiting a doctor\'s office.',
    category: 'telemedicine',
  },
  {
    faqId: 'FAQ-TM-002',
    question: 'How much does a telemedicine visit cost?',
    answer: 'A general telemedicine visit costs $25 (same as your in-network PCP copay). Virtual urgent care visits are $50. Virtual behavioral health visits are $25. Dermatology consultations are $50. These copays apply to your plan\'s cost-sharing structure.',
    category: 'telemedicine',
  },
  {
    faqId: 'FAQ-TM-003',
    question: 'Can I get a prescription through telemedicine?',
    answer: 'Yes. Telemedicine providers can prescribe most medications, including antibiotics, allergy medications, and refills for existing prescriptions. However, controlled substances (such as opioids and certain anxiety medications) cannot be prescribed through telemedicine in most states.',
    category: 'telemedicine',
  },
  {
    faqId: 'FAQ-TM-004',
    question: 'Is telemedicine available for children?',
    answer: 'Yes. HealthFirst Telehealth is available for members of all ages, including children. A parent or guardian must be present during the visit for members under 18. Pediatric-trained providers are available for children\'s visits.',
    category: 'telemedicine',
  },
  {
    faqId: 'FAQ-TM-005',
    question: 'What technology do I need for a telemedicine visit?',
    answer: 'You need a smartphone, tablet, or computer with a camera and microphone, plus a stable internet connection. The HealthFirst Telehealth platform works in most modern web browsers. You can also download the HealthFirst mobile app for iOS or Android.',
    category: 'telemedicine',
  },

  // Behavioral Health FAQs
  {
    faqId: 'FAQ-BH-001',
    question: 'How do I find a therapist or psychiatrist?',
    answer: 'You can search for in-network behavioral health providers using the Find a Doctor tool and selecting "Behavioral Health" as the specialty. You can also call the HealthFirst Behavioral Health Line at 1-800-555-0175 for help finding a provider who meets your needs. No referral is required.',
    category: 'behavioralHealth',
  },
  {
    faqId: 'FAQ-BH-002',
    question: 'How much does therapy cost with my plan?',
    answer: 'In-network outpatient therapy visits have a $25 copay. Psychiatric visits for medication management also have a $25 copay. Virtual behavioral health visits have the same $25 copay. Out-of-network visits are covered at 40% after your deductible.',
    category: 'behavioralHealth',
  },
  {
    faqId: 'FAQ-BH-003',
    question: 'Is there a limit on the number of therapy sessions?',
    answer: 'No. Your HealthFirst plan covers unlimited outpatient therapy sessions when medically necessary. There is no annual or lifetime limit on behavioral health visits. Your provider will work with you to determine the appropriate frequency and duration of treatment.',
    category: 'behavioralHealth',
  },
  {
    faqId: 'FAQ-BH-004',
    question: 'Are behavioral health services confidential?',
    answer: 'Yes. All behavioral health services are confidential and protected by federal and state privacy laws, including HIPAA. Your behavioral health records are kept separate and are not shared with your employer. Only authorized individuals involved in your care have access to your records.',
    category: 'behavioralHealth',
  },
  {
    faqId: 'FAQ-BH-005',
    question: 'What should I do if I am in a mental health crisis?',
    answer: 'If you or someone you know is in immediate danger, call 911. For a mental health crisis, call or text 988 (Suicide & Crisis Lifeline) for free, confidential support 24/7. You can also text HOME to 741741 to reach the Crisis Text Line. Emergency behavioral health services do not require pre-authorization.',
    category: 'behavioralHealth',
  },
  {
    faqId: 'FAQ-BH-006',
    question: 'Does my plan cover substance abuse treatment?',
    answer: 'Yes. Your plan covers substance abuse treatment at parity with medical benefits. This includes outpatient counseling ($25 copay), intensive outpatient programs, inpatient detoxification ($500 per admission), and residential treatment. Pre-authorization is required for inpatient services. Call the SAMHSA National Helpline at 1-800-662-4357 for free referrals.',
    category: 'behavioralHealth',
  },
];

// ===== External Links =====

export const externalLinks = [
  {
    linkId: 'EXT-001',
    title: 'National Doctor & Hospital Finder',
    description: 'Search our comprehensive national directory of in-network doctors, specialists, hospitals, and facilities.',
    url: EXTERNAL_URLS.doctorFinder,
    icon: 'search',
    category: 'provider',
  },
  {
    linkId: 'EXT-002',
    title: 'Dental Provider Directory',
    description: 'Find in-network dentists, orthodontists, and dental specialists in your area.',
    url: EXTERNAL_URLS.doctorFinder + '/dental',
    icon: 'smile',
    category: 'provider',
  },
  {
    linkId: 'EXT-003',
    title: 'Vision Provider Directory',
    description: 'Search for in-network optometrists, ophthalmologists, and vision centers.',
    url: EXTERNAL_URLS.doctorFinder + '/vision',
    icon: 'eye',
    category: 'provider',
  },
  {
    linkId: 'EXT-004',
    title: 'Pharmacy Locator',
    description: 'Find participating retail pharmacies, mail-order pharmacies, and specialty pharmacies near you.',
    url: EXTERNAL_URLS.doctorFinder + '/pharmacy',
    icon: 'pill',
    category: 'pharmacy',
  },
  {
    linkId: 'EXT-005',
    title: 'Behavioral Health Provider Directory',
    description: 'Find in-network therapists, psychiatrists, psychologists, and substance abuse treatment providers.',
    url: EXTERNAL_URLS.doctorFinder + '/behavioral-health',
    icon: 'heart',
    category: 'provider',
  },
  {
    linkId: 'EXT-006',
    title: 'Urgent Care Finder',
    description: 'Locate in-network urgent care centers near your current location.',
    url: EXTERNAL_URLS.doctorFinder + '/urgent-care',
    icon: 'alert-circle',
    category: 'facility',
  },
  {
    linkId: 'EXT-007',
    title: 'HealthFirst Telehealth Portal',
    description: 'Access virtual visits with doctors, therapists, and specialists from your home.',
    url: 'https://telehealth.healthcarepayer.com',
    icon: 'video',
    category: 'tool',
  },
  {
    linkId: 'EXT-008',
    title: 'Member Services Chat',
    description: 'Chat live with a member services representative for help with your plan, claims, or benefits.',
    url: SUPPORT.chatUrl,
    icon: 'message-circle',
    category: 'tool',
  },
  {
    linkId: 'EXT-009',
    title: 'Prescription Drug Formulary',
    description: 'View the complete list of covered medications and their tier classifications.',
    url: EXTERNAL_URLS.doctorFinder + '/formulary',
    icon: 'list',
    category: 'pharmacy',
  },
  {
    linkId: 'EXT-010',
    title: 'SAMHSA Treatment Locator',
    description: 'Find substance abuse and mental health treatment facilities nationwide.',
    url: 'https://findtreatment.gov',
    icon: 'map-pin',
    category: 'facility',
  },
];

// ===== Nurse Line Info =====

export const nurseLineInfo = {
  title: '24/7 Nurse Line',
  description: 'Speak with a registered nurse anytime, day or night, for health advice, symptom assessment, and guidance on whether you need to seek immediate care.',
  phone: '1-800-555-0150',
  availability: '24 hours a day, 7 days a week, 365 days a year',
  cost: 'Free for all HealthFirst members',
  servicesOffered: [
    'Symptom assessment and triage',
    'Health information and education',
    'Guidance on when to seek emergency care',
    'Post-discharge follow-up support',
    'Medication questions and interactions',
    'Chronic condition management support',
  ],
};

// ===== Helper Functions =====

/**
 * Returns all find care categories.
 * @returns {Object[]} Array of find care category objects
 */
export const getFindCareCategories = () => {
  return [...findCareCategories];
};

/**
 * Returns find care categories filtered by coverage type.
 * @param {string} coverageType - The coverage type to filter by (MEDICAL, DENTAL, VISION, PHARMACY, BEHAVIORAL_HEALTH)
 * @returns {Object[]} Array of find care category objects matching the coverage type
 */
export const getFindCareCategoriesByCoverageType = (coverageType) => {
  return findCareCategories.filter((category) => category.coverageType === coverageType);
};

/**
 * Returns a single find care category by its category ID.
 * @param {string} categoryId - The category identifier
 * @returns {Object|undefined} The find care category object or undefined if not found
 */
export const getFindCareCategoryById = (categoryId) => {
  return findCareCategories.find((category) => category.categoryId === categoryId);
};

/**
 * Returns all cost estimates.
 * @returns {Object[]} Array of cost estimate objects
 */
export const getCostEstimates = () => {
  return [...costEstimates];
};

/**
 * Returns a single cost estimate by its estimate ID.
 * @param {string} estimateId - The estimate identifier
 * @returns {Object|undefined} The cost estimate object or undefined if not found
 */
export const getCostEstimateById = (estimateId) => {
  return costEstimates.find((estimate) => estimate.estimateId === estimateId);
};

/**
 * Returns all telemedicine providers.
 * @returns {Object[]} Array of telemedicine provider objects
 */
export const getTelemedicineProviders = () => {
  return [...telemedicineProviders];
};

/**
 * Returns a single telemedicine provider by its provider ID.
 * @param {string} providerId - The provider identifier
 * @returns {Object|undefined} The telemedicine provider object or undefined if not found
 */
export const getTelemedicineProviderById = (providerId) => {
  return telemedicineProviders.find((provider) => provider.providerId === providerId);
};

/**
 * Returns the telemedicine guidance content.
 * @returns {Object} The telemedicine guidance object
 */
export const getTelemedicineGuidance = () => {
  return { ...telemedicineGuidance };
};

/**
 * Returns all behavioral health resources.
 * @returns {Object[]} Array of behavioral health resource objects
 */
export const getBehavioralHealthResources = () => {
  return [...behavioralHealthResources];
};

/**
 * Returns behavioral health resources filtered by type.
 * @param {string} type - The resource type to filter by ('crisis', 'therapy', 'substance', 'general')
 * @returns {Object[]} Array of behavioral health resource objects matching the type
 */
export const getBehavioralHealthResourcesByType = (type) => {
  return behavioralHealthResources.filter((resource) => resource.type === type);
};

/**
 * Returns a single behavioral health resource by its resource ID.
 * @param {string} resourceId - The resource identifier
 * @returns {Object|undefined} The behavioral health resource object or undefined if not found
 */
export const getBehavioralHealthResourceById = (resourceId) => {
  return behavioralHealthResources.find((resource) => resource.resourceId === resourceId);
};

/**
 * Returns all FAQs.
 * @returns {Object[]} Array of FAQ objects
 */
export const getAllFAQs = () => {
  return [...getCaresFAQs];
};

/**
 * Returns FAQs filtered by category.
 * @param {string} category - The FAQ category to filter by ('findCare', 'telemedicine', 'behavioralHealth', 'cost')
 * @returns {Object[]} Array of FAQ objects matching the category
 */
export const getFAQsByCategory = (category) => {
  return getCaresFAQs.filter((faq) => faq.category === category);
};

/**
 * Returns a single FAQ by its FAQ ID.
 * @param {string} faqId - The FAQ identifier
 * @returns {Object|undefined} The FAQ object or undefined if not found
 */
export const getFAQById = (faqId) => {
  return getCaresFAQs.find((faq) => faq.faqId === faqId);
};

/**
 * Searches FAQs by query string (case-insensitive partial match against question and answer).
 * @param {string} query - The search query string
 * @returns {Object[]} Array of matching FAQ objects
 */
export const searchFAQs = (query) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const queryLower = query.trim().toLowerCase();

  return getCaresFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(queryLower) ||
      faq.answer.toLowerCase().includes(queryLower)
  );
};

/**
 * Returns all external links.
 * @returns {Object[]} Array of external link objects
 */
export const getExternalLinks = () => {
  return [...externalLinks];
};

/**
 * Returns external links filtered by category.
 * @param {string} category - The link category to filter by ('provider', 'pharmacy', 'facility', 'tool')
 * @returns {Object[]} Array of external link objects matching the category
 */
export const getExternalLinksByCategory = (category) => {
  return externalLinks.filter((link) => link.category === category);
};

/**
 * Returns a single external link by its link ID.
 * @param {string} linkId - The link identifier
 * @returns {Object|undefined} The external link object or undefined if not found
 */
export const getExternalLinkById = (linkId) => {
  return externalLinks.find((link) => link.linkId === linkId);
};

/**
 * Returns the nurse line information.
 * @returns {Object} The nurse line info object
 */
export const getNurseLineInfo = () => {
  return { ...nurseLineInfo };
};

/**
 * Returns a summary of all Get Care data for dashboard or overview display.
 * @returns {Object} Summary object with counts and key information
 */
export const getCareSummary = () => {
  return {
    totalFindCareCategories: findCareCategories.length,
    totalCostEstimates: costEstimates.length,
    totalTelemedicineProviders: telemedicineProviders.length,
    totalBehavioralHealthResources: behavioralHealthResources.length,
    totalFAQs: getCaresFAQs.length,
    totalExternalLinks: externalLinks.length,
    faqCategories: {
      findCare: getCaresFAQs.filter((faq) => faq.category === 'findCare').length,
      cost: getCaresFAQs.filter((faq) => faq.category === 'cost').length,
      telemedicine: getCaresFAQs.filter((faq) => faq.category === 'telemedicine').length,
      behavioralHealth: getCaresFAQs.filter((faq) => faq.category === 'behavioralHealth').length,
    },
    behavioralHealthResourceTypes: {
      crisis: behavioralHealthResources.filter((r) => r.type === 'crisis').length,
      therapy: behavioralHealthResources.filter((r) => r.type === 'therapy').length,
      substance: behavioralHealthResources.filter((r) => r.type === 'substance').length,
      general: behavioralHealthResources.filter((r) => r.type === 'general').length,
    },
    externalLinkCategories: {
      provider: externalLinks.filter((l) => l.category === 'provider').length,
      pharmacy: externalLinks.filter((l) => l.category === 'pharmacy').length,
      facility: externalLinks.filter((l) => l.category === 'facility').length,
      tool: externalLinks.filter((l) => l.category === 'tool').length,
    },
    nurseLinePhone: nurseLineInfo.phone,
    doctorFinderUrl: EXTERNAL_URLS.doctorFinder,
    supportPhone: SUPPORT.phone,
    supportChatUrl: SUPPORT.chatUrl,
  };
};