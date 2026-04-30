# Healthcare Member Portal

A comprehensive healthcare payer member portal built with React.js, Vite, and Tailwind CSS. The portal enables health plan members to view benefits, track claims, manage ID cards, access documents, find providers, and manage their health plan — all in one secure, accessible, and responsive web application.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Available Scripts](#available-scripts)
8. [Build & Deployment](#build--deployment)
9. [HB CSS Framework](#hb-css-framework)
10. [Accessibility](#accessibility)
11. [Demo Credentials](#demo-credentials)
12. [License](#license)

---

## Overview

The Healthcare Member Portal is a single-page application (SPA) that provides health plan members with self-service access to their benefits, claims, ID cards, documents, prescriptions, wellness programs, and care resources. The portal includes role-based access control (RBAC) supporting MEMBER and ADMIN roles, session timeout management, Glassbox analytics integration with PHI/PII masking, and comprehensive audit logging.

---

## Features

### Authentication & Session Management
- Secure login with username/password authentication against mock member profiles
- Role-based access control (RBAC) supporting MEMBER and ADMIN roles
- Configurable session timeout with automatic logout (default 15 minutes)
- Session timeout warning modal with countdown timer (default 2-minute warning window)
- Session extension via "Continue Session" action from warning modal
- Activity tracking with throttled DOM event listeners

### Dashboard
- Personalized banner with time-of-day greeting, member name, plan badge, and masked member ID
- Customizable widget container with show/hide toggles and reorder controls
- Recent Claims, Deductible & Out-of-Pocket, ID Card Summary, Find Care CTA, and Learning Center widgets
- Widget preferences persisted to localStorage with schema versioning and migration support

### Claims
- Claims list with filterable, sortable, paginated table
- Claim type, status, and service date range filters
- Claim detail page with financial summary, line items table, provider and diagnosis information
- EOB PDF download with jsPDF generation
- Claim submission form (MVP stub) with validation

### ID Cards
- ID card preview with front and back views and flip animation
- Enlarge modal for full-size card viewing
- PDF download, print, and request new card actions
- PHI/PII fields masked with Glassbox data attributes

### Benefits & Coverage
- Benefits summary with deductible and out-of-pocket progress bars
- Coverage categories accordion with copay, coinsurance, and out-of-network details
- Pharmacy tier accordion with retail, mail order, and deductible information
- Individual/family tier toggle

### Document Center
- Filterable, sortable, paginated document list
- Category, status, search, and date range filters
- Document download with audit logging

### Notifications
- Notification list with type, read/unread status, and date range filters
- Mark individual and mark all as read
- Persisted read state via localStorage

### Get Care
- Find Care & Cost tab with provider category search and cost estimator
- Telehealth tab with provider cards and guidance
- Behavioral Health tab with crisis resources and FAQ accordion
- External links via LeavingSiteModal

### Prescriptions
- Prescription list with status filter and medication search
- Pharmacy directory and formulary tiers
- Refills due soon alerts

### Wellness
- Wellness programs with category filtering
- Health assessments with results display
- Preventive care reminders
- Wellness goals with progress tracking
- Wellness incentives

### Global Search
- Debounced search across portal pages, features, documents, and FAQs
- Grouped results with keyword highlighting
- Keyboard navigation support

### Glassbox Analytics & PHI/PII Masking
- 17 PHI/PII data types masked for session recording protection
- Action tagging for key user interactions
- DOM masking attributes for Glassbox session recording

### Audit Logging
- localStorage-persisted audit trail for document downloads, ID card actions, EOB downloads, external link clicks, and claim views
- PHI/PII masking applied to audit log metadata before persistence

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI component library |
| [Vite 6](https://vitejs.dev/) | Build tool and dev server |
| [React Router 6](https://reactrouter.com/) | Client-side routing with `createBrowserRouter` |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework |
| [HB CSS Framework](#hb-css-framework) | Custom component CSS library (cards, buttons, alerts, modals, forms, badges, avatars) |
| [jsPDF](https://github.com/parallax/jsPDF) | PDF generation for ID cards and EOB documents |
| [html2canvas](https://html2canvas.hertzen.com/) | HTML-to-canvas rendering (available for future use) |
| [PropTypes](https://github.com/facebook/prop-types) | Runtime prop type validation |
| [PostCSS](https://postcss.org/) + [Autoprefixer](https://github.com/postcss/autoprefixer) | CSS processing and vendor prefixing |

---

## Folder Structure

```
healthcare-payer-member-portal/
├── index.html                    # HTML entry point with Glassbox placeholder
├── package.json                  # Dependencies and scripts
├── vite.config.js                # Vite configuration (React plugin, port 3000, vendor chunks)
├── tailwind.config.js            # Tailwind CSS configuration (custom colors, spacing, shadows)
├── postcss.config.js             # PostCSS configuration (Tailwind + Autoprefixer)
├── vercel.json                   # Vercel SPA rewrite rules
├── .env.example                  # Environment variable template
├── CHANGELOG.md                  # Release changelog
├── DEPLOYMENT.md                 # Deployment guide
├── README.md                     # This file
│
└── src/
    ├── main.jsx                  # React DOM entry point
    ├── App.jsx                   # Root component with AuthProvider and RouterProvider
    ├── router.jsx                # Route definitions with ProtectedRoute and DashboardLayout
    ├── index.css                 # Global styles, Tailwind directives, HB CSS Framework
    │
    ├── components/               # Reusable UI and feature components
    │   ├── auth/                 # Authentication components
    │   │   ├── ProtectedRoute.jsx
    │   │   └── SessionTimeoutWarning.jsx
    │   ├── benefits/             # Benefits & coverage components
    │   │   ├── BenefitsSummary.jsx
    │   │   └── CoverageCategories.jsx
    │   ├── claims/               # Claims components
    │   │   ├── ClaimDetails.jsx
    │   │   ├── ClaimsList.jsx
    │   │   └── ClaimSubmissionForm.jsx
    │   ├── dashboard/            # Dashboard widgets
    │   │   ├── DashboardBanner.jsx
    │   │   ├── DeductibleOOPWidget.jsx
    │   │   ├── FindCareCTAWidget.jsx
    │   │   ├── IDCardSummaryWidget.jsx
    │   │   ├── LearningCenterWidget.jsx
    │   │   ├── RecentClaimsWidget.jsx
    │   │   ├── WidgetContainer.jsx
    │   │   └── WidgetCustomizationPanel.jsx
    │   ├── documents/            # Document center components
    │   │   └── DocumentList.jsx
    │   ├── getcare/              # Get Care section components
    │   │   ├── BehavioralHealthSection.jsx
    │   │   ├── FindCareSection.jsx
    │   │   └── TelemedicineSection.jsx
    │   ├── idcards/              # ID card components
    │   │   ├── IDCardActions.jsx
    │   │   └── IDCardPreview.jsx
    │   ├── layout/               # Layout components
    │   │   ├── DashboardLayout.jsx
    │   │   ├── Footer.jsx
    │   │   ├── HeaderBar.jsx
    │   │   └── SidebarNav.jsx
    │   ├── notifications/        # Notification components
    │   │   ├── NotificationList.jsx
    │   │   └── SupportLinks.jsx
    │   ├── shared/               # Shared components
    │   │   └── CoverageSelector.jsx
    │   └── ui/                   # Reusable UI component library
    │       ├── Alert.jsx
    │       ├── Avatar.jsx
    │       ├── Badge.jsx
    │       ├── Button.jsx
    │       ├── Checkbox.jsx
    │       ├── DateRangePicker.jsx
    │       ├── Dropdown.jsx
    │       ├── ErrorBoundary.jsx
    │       ├── LeavingSiteModal.jsx
    │       ├── Modal.jsx
    │       ├── Pagination.jsx
    │       ├── ProgressBar.jsx
    │       ├── RadioGroup.jsx
    │       └── SearchBar.jsx
    │
    ├── constants/                # Application constants and configuration
    │   └── constants.js          # Routes, roles, claim/document/notification types, HB CSS class mappings
    │
    ├── context/                  # React context providers
    │   ├── AuthContext.jsx        # Authentication state, login/logout, session management
    │   ├── GlassboxContext.jsx    # Glassbox analytics tracking and PHI/PII masking
    │   ├── NotificationContext.jsx # Notification state, filtering, mark-as-read
    │   └── WidgetCustomizationContext.jsx # Dashboard widget preferences and persistence
    │
    ├── data/                     # Mock data fixtures
    │   ├── benefitsData.js       # 5 benefits (Medical, Dental, Vision, Pharmacy, Behavioral Health)
    │   ├── claimsData.js         # 15 claims across all types and statuses
    │   ├── documentsData.js      # 25 documents across all categories
    │   ├── getCareData.js        # Find care categories, cost estimates, telehealth, behavioral health, FAQs
    │   ├── idCardsData.js        # 6 ID cards (5 active, 1 expired)
    │   ├── memberProfile.js      # Member and admin mock profiles
    │   ├── notificationsData.js  # 20 notifications across all types
    │   ├── prescriptionsData.js  # 15 prescriptions, 5 pharmacies, formulary tiers
    │   ├── searchIndex.js        # 40+ searchable entries for global search
    │   └── wellnessData.js       # Programs, assessments, preventive care, goals, incentives
    │
    ├── pages/                    # Page-level components (one per route)
    │   ├── AdminPanelPage.jsx
    │   ├── BenefitsPage.jsx
    │   ├── ClaimDetailsPage.jsx
    │   ├── ClaimSubmissionPage.jsx
    │   ├── ClaimsPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── DocumentCenterPage.jsx
    │   ├── GetCarePage.jsx
    │   ├── IDCardsPage.jsx
    │   ├── LoginPage.jsx
    │   ├── NotFoundPage.jsx
    │   ├── NotificationsPage.jsx
    │   ├── PrescriptionsPage.jsx
    │   ├── SettingsPage.jsx
    │   └── WellnessPage.jsx
    │
    ├── services/                 # Business logic and data services
    │   ├── auditLogger.js        # Audit logging with localStorage persistence and PHI/PII masking
    │   ├── authService.js        # Authentication, session management, RBAC
    │   ├── benefitsService.js    # Benefits data enrichment, deductible/OOP progress
    │   ├── claimsService.js      # Claims filtering, pagination, EOB PDF generation
    │   ├── documentService.js    # Document filtering, download logging
    │   ├── glassboxService.js    # Glassbox analytics initialization, action tagging, masking
    │   ├── idCardService.js      # ID card filtering, PDF generation, print/request logging
    │   ├── notificationService.js # Notification filtering, mark-as-read persistence
    │   └── sessionManager.js     # Session timeout enforcement, activity tracking
    │
    └── utils/                    # Utility functions
        ├── formatters.js         # Currency, date, percentage, phone, file size formatting
        ├── maskingUtils.js       # PHI/PII masking for 17 data types
        ├── pdfGenerator.js       # jsPDF-based PDF generation for ID cards and EOBs
        ├── searchUtils.js        # Search filtering, highlighting, grouping
        └── storage.js            # localStorage abstraction with in-memory fallback
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.x or later
- **npm**: v9.x or later

Verify your environment:

```bash
node --version    # v18.x+
npm --version     # v9.x+
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd healthcare-payer-member-portal
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and configure for local development:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

The application will open at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

All environment variables are prefixed with `VITE_` and embedded at build time via `import.meta.env.VITE_*`.

| Variable | Description | Default |
|---|---|---|
| `VITE_APP_TITLE` | Application title displayed in the browser and portal header | `Healthcare Member Portal` |
| `VITE_SESSION_TIMEOUT_MINUTES` | Session inactivity timeout in minutes | `15` |
| `VITE_SESSION_WARNING_MINUTES` | Minutes before timeout to show the session warning modal | `2` |
| `VITE_GLASSBOX_ENABLED` | Enable Glassbox analytics session recording (`true` or `false`) | `false` |
| `VITE_SUPPORT_EMAIL` | Member Services support email address | `support@healthcarepayer.com` |
| `VITE_SUPPORT_PHONE` | Member Services support phone number | `1-800-555-0199` |
| `VITE_SUPPORT_CHAT_URL` | External URL for live chat support | `https://chat.healthcarepayer.com` |
| `VITE_EXTERNAL_DOCTOR_FINDER_URL` | External URL for the National Doctor & Hospital Finder | `https://doctorfinder.healthcarepayer.com` |

> **Note**: Do not commit `.env` files containing production values. The `.gitignore` file excludes `.env`, `.env.local`, and all environment-specific variants.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server on port 3000 with hot module replacement |
| `npm run build` | Build the production bundle to the `dist/` directory |
| `npm run preview` | Preview the production build locally on port 4173 |

---

## Build & Deployment

### Production Build

```bash
npm ci
npm run build
```

The build output is written to the `dist/` directory. Vite performs the following during the build:

- Transpiles JSX via `@vitejs/plugin-react`
- Processes Tailwind CSS via PostCSS with Autoprefixer
- Splits vendor chunks (`react`, `react-dom`, `react-router-dom`) for optimal caching
- Embeds `VITE_*` environment variables into the client bundle
- Generates hashed filenames for cache busting

### Verify the Build Locally

```bash
npm run build
npm run preview
```

Open [http://localhost:4173](http://localhost:4173) to verify the production build.

### Vercel Deployment

The project includes a `vercel.json` configuration for SPA routing. All client-side routes are rewritten to `index.html` so that React Router handles navigation.

1. Import the repository into [Vercel](https://vercel.com/new)
2. Vercel auto-detects the Vite framework
3. Configure environment variables in the Vercel Dashboard under **Settings → Environment Variables**
4. Deploy

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## HB CSS Framework

The portal uses a custom CSS component library called **HB CSS Framework**, defined in `src/index.css` within the `@layer components` directive. The framework provides 200+ utility classes and component styles that are referenced throughout the application via the `HB_CLASSES` constant map in `src/constants/constants.js`.

### Component Classes

| Component | Classes | Description |
|---|---|---|
| **Card** | `hb-card`, `hb-card-header`, `hb-card-body`, `hb-card-footer` | Card container with header, body, and footer sections |
| **Button** | `hb-btn`, `hb-btn-primary`, `hb-btn-secondary`, `hb-btn-tertiary`, `hb-btn-danger` | Button variants with hover, active, focus, and disabled states |
| **Alert** | `hb-alert`, `hb-alert-info`, `hb-alert-success`, `hb-alert-warning`, `hb-alert-error` | Alert banners with icon, message, and dismiss button |
| **Modal** | `hb-modal-overlay`, `hb-modal`, `hb-modal-sm`, `hb-modal-lg`, `hb-modal-xl` | Modal dialog with overlay, header, body, and footer |
| **Form** | `hb-form-group`, `hb-form-label`, `hb-form-input`, `hb-form-select`, `hb-form-textarea` | Form inputs with floating labels, validation states, and help text |
| **Badge** | `hb-badge`, `hb-badge-brand`, `hb-badge-success`, `hb-badge-warning`, `hb-badge-error`, `hb-badge-info`, `hb-badge-neutral` | Status indicator badges |
| **Avatar** | `hb-avatar`, `hb-avatar-xs`, `hb-avatar-sm`, `hb-avatar-md`, `hb-avatar-lg`, `hb-avatar-xl` | Avatar with size variants and initials support |

### Layout Classes

| Class | Description |
|---|---|
| `fluid-wrapper` | Centered container with responsive padding (max-width: 1200px) |
| `page-layout` | Flex layout for sidebar + content area |
| `page-sidebar` | Sidebar navigation (16.5rem on desktop, full-width on mobile) |
| `page-content` | Main content area |
| `page-section` | Section with responsive vertical padding |
| `hb-row` | Flex row with negative margins for grid columns |

### Grid System

The framework includes a 12-column grid system with responsive breakpoints:

- `hb-col-1` through `hb-col-12` — base columns
- `mobile:hb-col-*` — 320px+ breakpoint
- `tablet:hb-col-*` — 640px+ breakpoint
- `desktop:hb-col-*` — 1024px+ breakpoint
- `widescreen:hb-col-*` — 1200px+ breakpoint

### Display Utilities

Responsive display utilities for showing/hiding elements:

- `hb-block`, `hb-hidden`, `hb-flex`, `hb-inline-flex`
- `tablet:hb-block`, `tablet:hb-hidden`
- `desktop:hb-block`, `desktop:hb-hidden`, `desktop:hb-flex`

### Using HB CSS Classes in Components

Components reference HB CSS classes via the `HB_CLASSES` constant map:

```jsx
import { HB_CLASSES } from '../../constants/constants.js';

const MyComponent = () => (
  <div className={HB_CLASSES.card}>
    <div className={HB_CLASSES.cardHeader}>
      <h2>Title</h2>
    </div>
    <div className={HB_CLASSES.cardBody}>
      <p>Content</p>
    </div>
    <div className={HB_CLASSES.cardFooter}>
      <button className={HB_CLASSES.btnPrimary}>Action</button>
    </div>
  </div>
);
```

---

## Accessibility

The portal is built to meet **WCAG 2.1 AA** accessibility standards:

- **Semantic HTML** with proper heading hierarchy (`h1` through `h6`)
- **ARIA roles, labels, and live regions** throughout all components
- **Focus management** for modals, dropdowns, and sidebar navigation
- **Focus trap** implementation in modal and session timeout warning dialogs
- **Keyboard navigation** support for all interactive elements (Tab, Enter, Space, Escape, Arrow keys)
- **Skip navigation** and focus restoration on modal close
- **Screen reader announcements** for dynamic content updates via `aria-live` regions
- **Accessible form validation** with `aria-invalid`, `aria-describedby`, and `role="alert"`
- **Color contrast ratios** meeting WCAG 2.1 AA requirements
- **Visible focus indicators** on all interactive elements (`:focus-visible` with 2px solid outline)
- **Responsive design** with mobile-first approach and touch-friendly interactive elements

---

## Demo Credentials

The portal includes two demo accounts for development and testing:

| Role | Username | Password |
|---|---|---|
| **Member** | `jane.doe` | `password123` |
| **Admin** | `admin.user` | `admin123` |

The Admin account has access to all Member features plus the Admin Panel page.

---

## License

This project is private and proprietary.