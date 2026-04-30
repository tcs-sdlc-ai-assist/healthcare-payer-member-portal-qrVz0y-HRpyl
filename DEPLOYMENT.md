# Deployment Guide

## Healthcare Member Portal — Vercel Deployment

This document covers deployment steps, environment variable configuration, build commands, SPA routing, CI/CD integration, preview deployments, and the production deployment checklist for the Healthcare Member Portal.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Build Commands](#build-commands)
4. [SPA Routing Configuration](#spa-routing-configuration)
5. [Vercel Deployment](#vercel-deployment)
6. [CI/CD Pipeline — GitHub Integration](#cicd-pipeline--github-integration)
7. [Preview Deployments for QA](#preview-deployments-for-qa)
8. [Production Deployment Checklist](#production-deployment-checklist)
9. [Glassbox Configuration](#glassbox-configuration)
10. [PHI/PII Masking Verification](#phipii-masking-verification)
11. [Rollback Procedure](#rollback-procedure)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: v18.x or later
- **npm**: v9.x or later
- **Vercel CLI** (optional, for local deployment testing): `npm i -g vercel`
- **Git**: Repository hosted on GitHub
- **Vercel Account**: Connected to the GitHub repository

Verify your local environment:

```bash
node --version    # v18.x+
npm --version     # v9.x+
```

---

## Environment Variables

All environment variables used by the portal are prefixed with `VITE_` and accessed at build time via `import.meta.env.VITE_*`. They are **not** available at runtime on the server — they are embedded into the client bundle during the Vite build step.

### Required Variables

| Variable | Description | Default | Required |
|---|---|---|---|
| `VITE_APP_TITLE` | Application title displayed in the browser and portal header | `Healthcare Member Portal` | No |
| `VITE_SESSION_TIMEOUT_MINUTES` | Session inactivity timeout in minutes | `15` | No |
| `VITE_SESSION_WARNING_MINUTES` | Minutes before timeout to show the session warning modal | `2` | No |
| `VITE_GLASSBOX_ENABLED` | Enable Glassbox analytics session recording (`true` or `false`) | `false` | No |
| `VITE_SUPPORT_EMAIL` | Member Services support email address | `support@healthcarepayer.com` | No |
| `VITE_SUPPORT_PHONE` | Member Services support phone number | `1-800-555-0199` | No |
| `VITE_SUPPORT_CHAT_URL` | External URL for live chat support | `https://chat.healthcarepayer.com` | No |
| `VITE_EXTERNAL_DOCTOR_FINDER_URL` | External URL for the National Doctor & Hospital Finder | `https://doctorfinder.healthcarepayer.com` | No |

### Setting Environment Variables in Vercel

1. Navigate to your project in the [Vercel Dashboard](https://vercel.com/dashboard).
2. Go to **Settings** → **Environment Variables**.
3. Add each variable with the appropriate value for the target environment:
   - **Production**: Variables applied to production deployments.
   - **Preview**: Variables applied to preview/branch deployments.
   - **Development**: Variables applied when using `vercel dev` locally.
4. Click **Save** after adding each variable.

> **Important**: Do not commit `.env` files containing production values to the repository. The `.gitignore` file already excludes `.env`, `.env.local`, `.env.development.local`, `.env.test.local`, and `.env.production.local`.

### Local Development

Copy the example environment file and customize values for local development:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local development values. This file is gitignored and will not be committed.

---

## Build Commands

The following npm scripts are defined in `package.json`:

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server on port 3000 with hot module replacement |
| `npm run build` | Build the production bundle to the `dist/` directory |
| `npm run preview` | Preview the production build locally |

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

### Verifying the Build Locally

```bash
npm run build
npm run preview
```

Open `http://localhost:4173` to verify the production build before deploying.

---

## SPA Routing Configuration

The portal is a single-page application (SPA) using React Router with `createBrowserRouter`. All client-side routes must be rewritten to `index.html` so that React Router can handle navigation.

### vercel.json

The `vercel.json` file at the project root configures SPA rewrites for Vercel:

```json
{
  "rewrites": [
    {
      "source": "/((?!assets/).*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrite rule ensures:

- All requests that do **not** match the `/assets/` directory are served `index.html`.
- Static assets (JS, CSS, images) in `/assets/` are served directly by Vercel's CDN.
- Deep links (e.g., `/claims/CLM-2024-00001`, `/coverage`, `/find-doctor`) resolve correctly on page refresh or direct navigation.

> **Note**: The `vercel.json` file is already included in the repository. No additional configuration is needed for SPA routing.

---

## Vercel Deployment

### Initial Setup

1. **Import the repository** into Vercel:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select the GitHub repository for the Healthcare Member Portal.
   - Vercel auto-detects the Vite framework.

2. **Configure build settings** (Vercel typically auto-detects these):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
   - **Node.js Version**: 18.x

3. **Add environment variables** as described in the [Environment Variables](#environment-variables) section.

4. **Deploy**: Click **Deploy**. Vercel will install dependencies, run the build, and deploy the output.

### Subsequent Deployments

After the initial setup, every push to the connected branch triggers an automatic deployment:

- **Production branch** (e.g., `main`): Triggers a production deployment.
- **All other branches**: Trigger preview deployments with unique URLs.

### Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## CI/CD Pipeline — GitHub Integration

### Automatic Deployments

When the GitHub repository is connected to Vercel:

1. **Push to `main`** → Triggers a **production deployment**.
2. **Push to any other branch** → Triggers a **preview deployment**.
3. **Pull request opened/updated** → Triggers a **preview deployment** with a comment on the PR containing the preview URL.

### Recommended Branch Strategy

| Branch | Purpose | Deployment Target |
|---|---|---|
| `main` | Production-ready code | Production |
| `develop` | Integration branch for QA | Preview |
| `feature/*` | Feature development branches | Preview |
| `hotfix/*` | Urgent production fixes | Preview → Production (after merge to `main`) |

### GitHub Actions (Optional)

If additional CI steps are needed before deployment (e.g., linting, testing), create a `.github/workflows/ci.yml` file:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_APP_TITLE: Healthcare Member Portal
          VITE_SESSION_TIMEOUT_MINUTES: '15'
          VITE_SESSION_WARNING_MINUTES: '2'
          VITE_GLASSBOX_ENABLED: 'false'
          VITE_SUPPORT_EMAIL: support@healthcarepayer.com
          VITE_SUPPORT_PHONE: 1-800-555-0199
          VITE_SUPPORT_CHAT_URL: https://chat.healthcarepayer.com
          VITE_EXTERNAL_DOCTOR_FINDER_URL: https://doctorfinder.healthcarepayer.com
```

> **Note**: Vercel handles deployment automatically via its GitHub integration. GitHub Actions is only needed if you require additional CI steps (lint, test, security scans) before the Vercel build.

---

## Preview Deployments for QA

Vercel automatically creates preview deployments for every branch push and pull request. These are useful for QA testing before merging to production.

### How Preview Deployments Work

1. A developer pushes a branch or opens a pull request.
2. Vercel builds and deploys the branch to a unique preview URL (e.g., `https://healthcare-member-portal-abc123.vercel.app`).
3. The preview URL is posted as a comment on the GitHub pull request.
4. QA team reviews the preview deployment.
5. After approval, the PR is merged to `main`, triggering a production deployment.

### Preview Environment Variables

Preview deployments use the **Preview** environment variables configured in Vercel. To use different values for preview vs. production:

1. In Vercel Dashboard → **Settings** → **Environment Variables**.
2. When adding a variable, select only the **Preview** checkbox.
3. Set preview-specific values (e.g., `VITE_GLASSBOX_ENABLED=false` for preview, `VITE_GLASSBOX_ENABLED=true` for production).

### QA Testing Checklist for Preview Deployments

- [ ] Verify all pages load without console errors
- [ ] Test login with demo credentials (`jane.doe` / `password123` and `admin.user` / `admin123`)
- [ ] Verify session timeout warning appears after configured inactivity period
- [ ] Test claims list filtering, sorting, and pagination
- [ ] Test claim detail page and EOB PDF download
- [ ] Verify ID card preview, flip animation, enlarge modal, download, and print
- [ ] Test benefits summary and coverage categories accordion
- [ ] Verify document center filtering, sorting, and download
- [ ] Test notification list, mark as read, and mark all as read
- [ ] Verify Get Care section tabs (Find Care, Telehealth, Behavioral Health)
- [ ] Test Leaving Site Modal for external links
- [ ] Verify responsive layout on mobile (320px), tablet (640px), and desktop (1024px+)
- [ ] Test keyboard navigation and screen reader accessibility
- [ ] Verify sidebar navigation opens/closes on mobile
- [ ] Test global search functionality
- [ ] Verify widget customization (show/hide, reorder, reset)

---

## Production Deployment Checklist

Complete the following checklist before deploying to production:

### Pre-Deployment

- [ ] All pull requests for the release are merged to `main`
- [ ] Preview deployment has been QA-tested and approved
- [ ] Environment variables are configured correctly for production in Vercel Dashboard
- [ ] `VITE_GLASSBOX_ENABLED` is set to the desired value (`true` to enable analytics, `false` to disable)
- [ ] `VITE_SESSION_TIMEOUT_MINUTES` is set to the approved timeout value (default: `15`)
- [ ] `VITE_SESSION_WARNING_MINUTES` is set to the approved warning window (default: `2`)
- [ ] Support contact information (`VITE_SUPPORT_EMAIL`, `VITE_SUPPORT_PHONE`, `VITE_SUPPORT_CHAT_URL`) is correct
- [ ] External Doctor Finder URL (`VITE_EXTERNAL_DOCTOR_FINDER_URL`) is correct
- [ ] No `.env` files with production secrets are committed to the repository
- [ ] Build passes locally with `npm run build` (zero errors, zero warnings)

### Deployment

- [ ] Push to `main` branch (or merge the release PR)
- [ ] Verify Vercel deployment completes successfully (check Vercel Dashboard → Deployments)
- [ ] Verify the production URL loads correctly
- [ ] Verify SPA routing works (navigate to `/claims`, `/coverage`, `/find-doctor` directly via URL)

### Post-Deployment Verification

- [ ] Login with demo credentials and verify dashboard loads
- [ ] Verify session timeout and warning modal function correctly
- [ ] Test at least one claim detail page and EOB download
- [ ] Test at least one ID card download and print action
- [ ] Verify Glassbox analytics is recording (if enabled) — check Glassbox dashboard for new sessions
- [ ] Verify PHI/PII masking is active in Glassbox session recordings (see [PHI/PII Masking Verification](#phipii-masking-verification))
- [ ] Verify audit log entries are being created for document downloads, ID card actions, and external link clicks
- [ ] Test the Leaving Site Modal for at least one external link
- [ ] Verify the 404 Not Found page displays for invalid routes
- [ ] Check browser console for any unexpected errors
- [ ] Verify responsive layout on at least one mobile device or emulator

---

## Glassbox Configuration

Glassbox analytics integration is controlled by the `VITE_GLASSBOX_ENABLED` environment variable.

### Enabling Glassbox

1. Set `VITE_GLASSBOX_ENABLED=true` in the Vercel production environment variables.
2. Deploy the application. The Glassbox initialization script in `index.html` will activate.
3. The `glassboxService.js` module initializes on authenticated routes and applies PHI/PII masking rules.

### Disabling Glassbox

1. Set `VITE_GLASSBOX_ENABLED=false` in the Vercel environment variables.
2. Deploy the application. Glassbox will not initialize, and no session recording will occur.
3. All `tagAction` calls in the codebase gracefully no-op when Glassbox is disabled.

### Glassbox Script Placeholder

The `index.html` file contains a placeholder for the Glassbox analytics snippet:

```html
<script>
  (function () {
    var glassboxEnabled = '%VITE_GLASSBOX_ENABLED%';
    if (glassboxEnabled === 'true') {
      // Glassbox analytics script placeholder
      // Replace with actual Glassbox snippet when available
      console.info('Glassbox analytics enabled');
    }
  })();
</script>
```

When the actual Glassbox snippet is provided by the analytics team, replace the placeholder comment with the production Glassbox initialization code.

### Tracked Actions

The following user actions are tagged for Glassbox analytics when enabled:

| Action | Constant | Description |
|---|---|---|
| Claim Opened | `CLAIM_OPENED` | User views a claim detail page |
| EOB Downloaded | `CLAIM_EOB_DOWNLOADED` | User downloads an Explanation of Benefits PDF |
| ID Card Downloaded | `IDCARD_DOWNLOADED` | User downloads an ID card PDF |
| ID Card Printed | `IDCARD_PRINTED` | User triggers the print dialog for an ID card |
| ID Card Requested | `IDCARD_REQUESTED` | User submits a request for a replacement ID card |
| Document Downloaded | `DOCUMENT_DOWNLOADED` | User downloads a document from the Document Center |
| Document Viewed | `DOCUMENT_VIEWED` | User views a document detail |
| External Link Clicked | `EXTERNAL_LINK_CLICKED` | User navigates to an external website via the Leaving Site Modal |
| Benefits Viewed | `BENEFITS_VIEWED` | User views benefits/coverage information |
| Page Viewed | `PAGE_VIEWED` | User navigates to a new page |
| Search Performed | `SEARCH_PERFORMED` | User performs a global search |

---

## PHI/PII Masking Verification

The portal implements comprehensive PHI/PII masking for Glassbox session recording and audit logging. Before each production deployment, verify that masking is functioning correctly.

### Masked Data Types

The following 17 data types are masked throughout the portal:

| Data Type | Masking Strategy | Example |
|---|---|---|
| `memberId` | Partial (last 4 visible) | `HCP-2024-00042` → `••••••••••0042` |
| `memberName` | Partial (first initial) | `Jane Doe` → `J••• D••` |
| `claimNumber` | Partial (prefix + last 4) | `CLM123456` → `CLM••••3456` |
| `groupNumber` | Partial (prefix + last 3) | `GRP-98765` → `GRP-••765` |
| `subscriberId` | Partial (last 4 visible) | `SUB-2024-00042` → `••••••••••0042` |
| `dateOfBirth` | Format-preserving | `1985-03-15` → `••••-••-••` |
| `email` | Partial (first 2 + domain) | `jane.doe@example.com` → `ja••••••@example.com` |
| `phone` | Partial (last 4 digits) | `(555) 123-4567` → `(•••) •••-4567` |
| `financialAmount` | Redact | `$1,234.56` → `$•••.••` |
| `address` | Redact | `123 Maple Street` → `[Address Redacted]` |
| `providerNPI` | Partial (last 4 visible) | `1234567890` → `••••••7890` |
| `rxNumber` | Partial (prefix + last 3) | `RX7845123` → `RX•••••123` |
| `ndcCode` | Partial (last 3 visible) | `00002-4462-30` → `••••••••••-30` |
| `diagnosisCode` | Full mask | `J06.9` → `•••••` |
| `documentId` | Partial (prefix + last 4) | `DOC-EOB-00001` → `DOC-•••••0001` |
| `cardId` | Partial (prefix + last 4) | `IDC-2024-00001` → `IDC-••••••0001` |
| `claimId` | Partial (prefix + last 4) | `CLM-2024-00001` → `CLM-••••••0001` |

### Verification Steps

1. **Enable Glassbox** in a preview deployment (`VITE_GLASSBOX_ENABLED=true`).
2. **Log in** and navigate through the portal, visiting:
   - Dashboard (member ID, plan name displayed)
   - Claims list and claim detail page (claim numbers, financial amounts, diagnosis codes)
   - ID Cards page (member ID, group number, subscriber ID, copay amounts)
   - Benefits page (deductible and OOP amounts)
   - Prescriptions page (Rx numbers, NDC codes, copay amounts)
3. **Review Glassbox session recording** and verify:
   - Member IDs show only the last 4 characters
   - Member names show only first initials
   - Financial amounts are fully redacted
   - Diagnosis codes are fully masked
   - Email addresses show only the first 2 characters before the `@`
   - Phone numbers show only the last 4 digits
   - Street addresses are replaced with `[Address Redacted]`
4. **Check DOM elements** for `data-glassbox-mask` and `data-glassbox-mask-type` attributes on sensitive fields (ID card preview, member ID displays, etc.).
5. **Review audit log entries** (stored in localStorage under `hcp_audit_log`) and verify that sensitive metadata fields are masked before persistence.

### DOM Masking Attributes

Components that display PHI/PII apply Glassbox masking attributes via the `getMaskingAttributes` function from `GlassboxContext`:

```jsx
const memberIdMaskingAttrs = getMaskingAttributes('memberId');
// Returns: { 'data-glassbox-mask': 'true', 'data-glassbox-mask-type': 'memberId' }

<span {...memberIdMaskingAttrs}>{card.front.memberId}</span>
```

These attributes instruct Glassbox to mask the element content during session recording, providing an additional layer of protection beyond the application-level masking.

---

## Rollback Procedure

If a production deployment introduces issues:

### Instant Rollback via Vercel Dashboard

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) → select the project.
2. Navigate to **Deployments**.
3. Find the last known good deployment.
4. Click the three-dot menu (⋯) → **Promote to Production**.
5. The previous deployment is instantly promoted to production with zero downtime.

### Rollback via Git

1. Identify the last known good commit on `main`.
2. Revert the problematic commit(s):
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. Vercel automatically deploys the reverted code.

---

## Troubleshooting

### Build Fails on Vercel

- **Check Node.js version**: Ensure Vercel is using Node.js 18.x. Set this in Vercel Dashboard → Settings → General → Node.js Version.
- **Check environment variables**: Ensure all `VITE_*` variables are set in the Vercel environment. Missing variables fall back to defaults defined in `src/constants/constants.js`.
- **Check dependency installation**: Ensure `npm ci` succeeds. If `package-lock.json` is out of sync, run `npm install` locally and commit the updated lockfile.

### SPA Routes Return 404

- Verify `vercel.json` is present at the project root with the correct rewrite rules.
- Verify the `vercel.json` file is committed to the repository and included in the deployment.

### Glassbox Not Recording

- Verify `VITE_GLASSBOX_ENABLED` is set to `true` in the production environment variables.
- Verify the Glassbox script placeholder in `index.html` has been replaced with the actual Glassbox snippet.
- Check the browser console for Glassbox initialization messages.
- Verify the `glassboxService.js` module initializes successfully by checking `getServiceState()`.

### Session Timeout Not Working

- Verify `VITE_SESSION_TIMEOUT_MINUTES` and `VITE_SESSION_WARNING_MINUTES` are set to valid numeric values.
- The session timeout is enforced client-side via `sessionManager.js`. Verify the session check interval is running by checking the browser console for session-related logs.

### Environment Variables Not Applied

- `VITE_*` variables are embedded at **build time**, not runtime. After changing environment variables in Vercel, you must **redeploy** for the changes to take effect.
- Trigger a redeployment from the Vercel Dashboard or push a new commit.