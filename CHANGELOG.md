# Changelog

All notable changes to the Healthcare Member Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-01

### Added

#### Authentication & Session Management
- Secure login with username/password authentication against mock member profiles
- Role-based access control (RBAC) supporting MEMBER and ADMIN roles
- Configurable session timeout with automatic logout (default 15 minutes)
- Session timeout warning modal with countdown timer (default 2-minute warning window)
- Session extension via "Continue Session" action from warning modal
- Activity tracking with throttled DOM event listeners for session management
- Protected route component enforcing authentication and optional role-based access
- Demo credentials for member (jane.doe / password123) and admin (admin.user / admin123)

#### Dashboard
- Personalized dashboard banner with time-of-day greeting, member name, plan badge, and masked member ID
- Customizable widget container with show/hide toggles and reorder controls
- Recent Claims widget displaying 3–5 most recent claims with status badges and amounts
- Deductible & Out-of-Pocket widget with progress bars for individual and family tiers
- ID Card Summary widget showing active insurance cards with masked member information
- Find Care CTA widget with quick-access links to provider search, telehealth, and national directory
- Learning Center widget with featured health education articles and resources
- Widget customization panel with checkbox visibility toggles and arrow reorder buttons
- Widget preferences persisted to localStorage with schema versioning and migration support

#### Claims
- Claims list page with filterable, sortable, paginated table
- Claim type filter dropdown (Medical, Dental, Vision, Pharmacy, Behavioral Health, Lab, Emergency, Preventive)
- Claim status filter dropdown (Submitted, In Review, Approved, Denied, Partially Approved, Pending Info, Appealed, Closed)
- Service date range picker for claims filtering
- Sort by service date with ascending/descending toggle
- Claim detail page with financial summary (billed, allowed, plan paid, you owe)
- Line items table with procedure codes, descriptions, and per-line amounts
- Provider and diagnosis information display
- Processing dates (received, processed) display
- EOB PDF download with jsPDF generation including claim summary, line items, and disclaimer
- Claim submission form (MVP stub) with type, provider, date, amount, diagnosis, and notes fields
- Form validation with inline error messages and floating labels
- Stub confirmation response with generated claim number
- Related documents section on claim detail page

#### ID Cards
- ID Cards page with coverage type filter selector
- ID card preview component with front and back views
- Card flip animation between front and back
- Enlarge modal for full-size card viewing with front/back toggle
- Front card display: plan name, plan type, member name, member ID, group number, subscriber ID, effective date, PCP, network, copays
- Back card display: Rx info (BIN, PCN, Group), phone numbers, claims address, emergency instructions
- PDF download for individual ID cards via jsPDF with front and back layouts
- PDF download for all active ID cards in a single document
- Print ID card action with browser print dialog trigger
- Request new card modal with coverage confirmation and stub submission
- Request confirmation modal with generated request ID
- PHI/PII fields masked with Glassbox data attributes

#### Benefits & Coverage
- Benefits summary page with plan status, plan type, and active plan count
- Deductible progress bars for individual and family tiers per coverage type
- Out-of-pocket maximum progress bars for individual and family tiers per coverage type
- Individual/family tier toggle for deductible and OOP displays
- Coverage type filter selector (Medical, Dental, Vision, Pharmacy, Behavioral Health)
- Active plan cards with coverage icon, status badge, plan details, and progress bars
- Coverage categories accordion with expandable/collapsible sections
- Copay, coinsurance, and out-of-network cost details per category
- Pharmacy tier accordion with retail, mail order, and deductible information
- Expand all / collapse all controls for accordion sections
- Plan notes display with informational styling

#### Document Center
- Document list page with filterable, sortable, paginated table
- Category filter dropdown (EOB, ID Card, Plan Documents, Correspondence, Tax Forms, Prior Auth, Appeals, Other)
- Status filter dropdown (Available, Archived, Pending)
- Full-text search within document titles and descriptions
- Date range picker for document date filtering
- Sort by date with ascending/descending toggle
- Document download action with audit logging
- Category icons for visual document type identification
- File size and date display for each document
- 25 mock documents across all categories

#### Notifications
- Notification list page with filterable, sortable, paginated display
- Notification type filter (Info, Success, Warning, Error, Claim Update, Payment Due, Document Ready, Message, System)
- Read/unread status filter
- Date range picker for notification filtering
- Sort by date with ascending/descending toggle
- Unread indicator dot and bold text styling for unread notifications
- Mark individual notification as read on click
- Mark all notifications as read with bulk action button
- Notification type icons and color-coded badges
- Relative date display (e.g., "2 days ago")
- Action URL navigation on notification click
- Persisted read state via localStorage
- Notification count badge in header bar
- 20 mock notifications across all types

#### Get Care Section
- Find Care & Cost tab with provider category search and browse
- National Doctor & Hospital Finder external link with LeavingSiteModal
- Care category cards (PCP, Specialist, Hospital, Dentist, Eye Care, Pharmacy, Behavioral Health, Lab)
- Cost estimator with in-network and out-of-network price ranges for 12 common services
- Telehealth tab with provider cards, copay info, and service listings
- When to use / when not to use telehealth guidance
- How to get started steps for telehealth visits
- Behavioral Health tab with crisis resources prominently displayed
- 988 Suicide & Crisis Lifeline and Crisis Text Line integration
- SAMHSA National Helpline resource
- Behavioral health resource cards with type filtering (Crisis, Therapy, Substance Abuse, General)
- FAQ accordion sections for Find Care, Cost, Telehealth, and Behavioral Health categories
- 24/7 Nurse Line banner with phone number
- External links section with provider directories and tools

#### Prescriptions
- Prescriptions page with overview, prescriptions list, pharmacies, and formulary tiers sections
- Overview dashboard with active prescriptions, maintenance meds, refills due, mail order eligible, and cost summary
- Prescription list with status filter (All, Active, Expired, Discontinued) and medication search
- Detailed prescription cards with medication name, strength, dosage form, directions, quantity, days supply, refills, copay, prescriber, and pharmacy
- Formulary tier badges (Tier 1 Generic, Tier 2 Preferred Brand, Tier 3 Non-Preferred Brand, Tier 4 Specialty)
- Pharmacy directory with retail, mail order, and specialty pharmacy listings
- Formulary tiers section with copay details for retail 30-day, retail 90-day, and mail order 90-day
- Refills due soon alerts for prescriptions eligible within 14 days
- 15 mock prescriptions and 5 mock pharmacies

#### Wellness
- Wellness page with overview, programs, assessments, preventive care, goals, and incentives sections
- Overview dashboard with program count, incentives earned/available, and preventive care completion
- Active wellness goals with progress bars and target tracking
- 8 wellness programs across fitness, nutrition, mental health, chronic care, and lifestyle categories
- Program category filter tabs
- Program cards with description, benefits, duration, format, cost, and incentive information
- 5 health assessments with completion status and results display
- Risk level badges and personalized recommendations for completed assessments
- 11 preventive care reminders with status tracking (Due, Upcoming, Overdue, Completed)
- Preventive care details with frequency, age group, cost, and notes
- 6 wellness goals with progress tracking and target dates
- 10 wellness incentives with earned/available status and dollar amounts
- External enrollment links via LeavingSiteModal

#### Navigation & Layout
- Global header bar with HealthFirst branding, search, support actions, notification bell, and user menu
- User profile dropdown with Dashboard, Settings, Admin Panel (admin only), and Logout options
- Left sidebar navigation with icon-labeled menu items and active route highlighting
- Responsive sidebar with mobile hamburger toggle and overlay
- Footer with privacy policy, terms of use, accessibility links, and support contact
- Dashboard layout wrapper composing header, sidebar, content area, and session timeout warning
- Smooth scroll to top on route navigation
- Sidebar auto-close on route change and mobile overlay click

#### Global Search
- Search bar in header with debounced input (300ms)
- Search across portal pages, features, documents, and FAQ entries
- Grouped results by category (Pages, Features, Documents, Help & FAQs)
- Keyword highlighting in search results
- Keyboard navigation (arrow keys, Enter, Escape) for search dropdown
- Popular search suggestions when input is empty
- Result count and keyboard shortcut hints
- 40+ searchable entries in the static search index

#### UI Component Library
- Alert component with info, success, warning, and error variants
- Avatar component with xs through xl sizes, initials, and status badges
- Badge component with brand, success, warning, error, info, and neutral variants
- Button component with primary, secondary, tertiary, and danger variants
- Checkbox component with indeterminate state support
- DateRangePicker component with horizontal/vertical orientation
- Dropdown component with native select and custom ARIA listbox modes
- ErrorBoundary component with retry and refresh actions
- LeavingSiteModal component for external link warnings
- Modal component with sm, md, lg, xl sizes and focus trap
- Pagination component with page numbers, prev/next, and page size selector
- ProgressBar component with currency formatting and percentage display
- RadioGroup component with vertical/horizontal orientation
- SearchBar component with autocomplete dropdown
- CoverageSelector shared component for benefits and ID cards filtering

#### Glassbox Analytics Integration
- Glassbox service initialization on authenticated routes
- PHI/PII masking rules for 17 data types (member ID, name, claim number, group number, subscriber ID, DOB, email, phone, financial amounts, address, provider NPI, Rx number, NDC code, diagnosis code, document ID, card ID)
- Glassbox data-masking DOM attributes for session recording protection
- Action tagging for claim opened, EOB downloaded, ID card downloaded/printed/requested, document downloaded/viewed, external link clicked, benefits viewed, page viewed, and search performed
- Masking utility functions for partial, full, format-preserving, and redact strategies
- Object-level masking with field-to-dataType mapping for claims, profiles, ID cards, and prescriptions
- GlassboxContext provider with convenience tracking methods

#### Audit Logging
- Audit logger service with localStorage persistence
- Audit events for document download, ID card download/print/request, EOB download, external link click, claim view, notification read, and mark-all-read
- PHI/PII masking applied to audit log metadata before persistence
- Configurable maximum log entry retention (500 entries) with automatic pruning
- Audit log summary with action counts and most recent event

#### Accessibility (WCAG 2.1 AA)
- Semantic HTML with proper heading hierarchy
- ARIA roles, labels, and live regions throughout all components
- Focus management for modals, dropdowns, and sidebar navigation
- Focus trap implementation in modal and session timeout warning
- Keyboard navigation support for all interactive elements
- Skip navigation and focus restoration on modal close
- Screen reader announcements for dynamic content updates
- Accessible form validation with aria-invalid, aria-describedby, and role="alert"
- Color contrast ratios meeting WCAG 2.1 AA requirements
- Visible focus indicators on all interactive elements

#### Responsive Design
- Mobile-first responsive layout with breakpoints at 320px, 640px, 1024px, and 1200px
- Collapsible sidebar navigation on mobile with floating hamburger button
- Responsive grid layouts for cards, tables, and form fields
- Hidden/visible utility classes for breakpoint-specific content
- Touch-friendly interactive elements with appropriate sizing
- Scrollable tables with horizontal overflow on small screens

#### HB CSS Framework
- Custom CSS component library with 200+ utility classes
- Card component with header, body, and footer sections
- Button styles with primary, secondary, tertiary, and danger variants
- Alert styles with info, success, warning, and error variants
- Modal overlay and dialog styles with size variants
- Form input, select, textarea, checkbox, and radio styles
- Floating label form pattern
- Validation state styles (error, success)
- Badge styles with 6 color variants
- Avatar styles with 5 size variants
- Grid system with 12-column layout and responsive breakpoints
- Spacing, typography, color, shadow, border, and position utilities
- Scrollbar styling utilities
- Animation keyframes for fade-in, slide-up, and spin

#### Data & Services
- Mock member profile data for member and admin users
- 15 mock claims across Medical, Dental, Vision, Pharmacy, Behavioral Health, Lab, Emergency, and Preventive types
- 5 mock benefits covering Medical, Dental, Vision, Pharmacy, and Behavioral Health
- 6 mock ID cards (5 active, 1 expired) across all coverage types
- 25 mock documents across EOB, ID Card, Plan Documents, Correspondence, Tax Forms, Prior Auth, Appeals, and Other categories
- 20 mock notifications across all notification types
- 15 mock prescriptions with pharmacy and formulary tier data
- 8 mock wellness programs, 5 health assessments, 11 preventive care reminders, 6 wellness goals, and 10 wellness incentives
- Get Care data with 8 find care categories, 12 cost estimates, 4 telehealth providers, 8 behavioral health resources, and 20 FAQs
- Claims service with filtering, pagination, sorting, enrichment, and EOB PDF generation
- Benefits service with deductible/OOP progress calculation and coverage category retrieval
- ID Card service with PDF generation, print logging, and new card request stub
- Document service with filtering, pagination, download logging, and search
- Notification service with filtering, pagination, mark-as-read persistence, and summary
- Auth service with login, logout, session management, and RBAC
- Session manager with activity tracking, timeout enforcement, and warning callbacks
- Storage utility with localStorage abstraction and in-memory fallback
- Formatter utilities for currency, dates, percentages, phone numbers, file sizes, and relative dates
- PDF generator utility using jsPDF for ID cards and EOB documents
- Search utilities with relevance scoring, highlighting, and category grouping
- Masking utilities for PHI/PII protection across 17 data types

#### Configuration
- Environment variable support via Vite (VITE_APP_TITLE, VITE_SESSION_TIMEOUT_MINUTES, VITE_SESSION_WARNING_MINUTES, VITE_GLASSBOX_ENABLED, VITE_SUPPORT_EMAIL, VITE_SUPPORT_PHONE, VITE_SUPPORT_CHAT_URL, VITE_EXTERNAL_DOCTOR_FINDER_URL)
- Tailwind CSS configuration with custom color palette, spacing, shadows, and breakpoints
- PostCSS configuration with Tailwind and Autoprefixer plugins
- Vite configuration with React plugin, dev server on port 3000, and vendor chunk splitting
- Vercel deployment configuration with SPA rewrites