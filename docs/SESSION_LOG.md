# Session Log

## Purpose

Tracks meaningful engineering progress, architectural changes, debugging insights, and implementation milestones.

Update this file after major development sessions.

---

# Log Format

## YYYY-MM-DD

### Completed

- ...

### Decisions

- ...

### Problems Encountered

- ...

### Next Steps

- ...

---

## 2026-05-07

### Completed

- Reviewed full assignment (Credex Round 1 — AI Spend Audit tool)
- Project structure: Created monorepo with `apps/costpilot-api` (Cloudflare Worker + Hono) and `apps/costpilot-web` (React + Vite + Tailwind + shadcn/ui)
- Backend deployed: `https://costpilot-api.omshuklalko3.workers.dev/`
- Frontend deployed: `https://costpilot-costpilot-web.vercel.app/`
- Installed frontend dependencies: react-router, zustand, tanstack-query, axios, react-hook-form, zod, framer-motion, lucide, radix-ui (shadcn/ui), tailwind v4, geist font
- Installed backend: Hono + wrangler
- Set up Gemini API key locally (`.env` in root)
- Shared types package (`packages/shared`) — defined all tool types, plan types, audit/recommendation interfaces

### Decisions

- **App name**: CostPilot (finalized)
- **Backend worker name**: `costpilot-api` (avoids conflict with existing apps on Cloudflare)
- **Gemini first, Anthropic later**: Gemini API key obtained immediately; Anthropic credits form submitted, will swap if approved
- **Email sending**: Use Resend free tier with their `resend.dev` sandbox domain (no custom domain needed)
- **No auth for MVP**: Assignment explicitly prefers frictionless onboarding
- **shadcn/ui radix-nova style**: Chose the radix-nova variant for modern, clean UI primitives

### Problems Encountered

- Initial attempt to scaffold backend manually was too much at once; reset and user scaffolded themselves via `npm create cloudflare@latest`
- Had to delete and re-scaffold when the Hono template flag didn't apply correctly through C3

### Next Steps

- Start building the audit engine — deterministic pricing logic for all 8 tools
- Build the spend input form UI
- Set up D1 database schema and migrations
- Create `/audit` API route
- Build the results page

---

## 2026-05-07 (later)

### Completed

- Created D1 database `costpilot-db` with binding name `costpilot_db` (remote, region APAC)
- Regenerated worker types to include D1 binding
- Set up Vitest with `@cloudflare/vitest-pool-workers` — 2 passing tests for Hono routes
- Switched from Drizzle ORM to raw SQL for database access
- Updated all docs to reflect raw SQL decision

### Decisions

- **Raw SQL over Drizzle ORM**: Simpler setup with D1, fewer dependencies, more transparent for MVP. Trade-off: lose type-safe query building.
- **D1 database name**: `costpilot-db` with binding `costpilot_db`
- **Backend-first approach**: Build backend (schema → services → routes → tests) before frontend
- **Data flow**: Frontend → POST /audit → audit engine (deterministic) → save to D1 → return result with AI summary

### Next Steps

- Create `schema.sql` with CREATE TABLE statements
- Create `db.ts` with raw SQL helper queries
- Build the audit engine service with tests
- Create POST /audit route with validation

---

## 2026-05-08

### Completed

- Recreated shared types package (`packages/shared`) with ToolId, AuditInput, Recommendation, AuditResult types
- Built audit engine controller (`controllers/audit-engine.ts`) — deterministic pricing logic for all 8 tools
- Wrote 8 tests for audit engine covering: downgrade detection, credit optimization, already-optimal, multi-tool totals, all 8 tools, timestamps
- All 10 tests passing (2 route + 8 engine)
- Documented Vercel lockfile error in docs/MAJOR_ERRORS.md
- Created PRICING_DATA.md with current pricing sources for all 8 tools (verified 2026-05-08)
- Created CI workflow `.github/workflows/ci.yml` — runs tests on push to main
- Created SUMMARY.md (local reference, gitignored)
- Added SUMMARY.md to .gitignore

### Decisions

- **Audit engine is pure logic**: No DB access, no API calls, fully deterministic — testable without Workers runtime
- **Price thresholds**: Credex credit optimization triggers at $200+/month API spend; plan downgrade logic uses team size as primary signal

### Problems Encountered

- None with the audit engine itself — pure logic tests passed first time

### Completed (docs catch-up)

- Updated `docs/API_CONTRACTS.md` with actual POST /audit implementation details
- Created `docs/KNOWN_ISSUES.md` (was missing, referenced by CLAUDE.md)
- Created `ARCHITECTURE.md` with Mermaid system diagram + data flow + scaling notes
- Created `README.md` with summary, quick start, deployment URLs, decisions

### Completed (summary + tests)

- Built `controllers/summary.ts` — Gemini 2.0 Flash with templated fallback
- Installed `@google/generative-ai` package
- Added `GEMINI_API_KEY` to wrangler.jsonc vars + .dev.vars for local dev
- Updated `controllers/audit.ts` to call `generateSummary` and include summary in response
- Wrote 5 tests for summary fallback covering: undefined key, empty key, savings vs no savings, tool count
- All 15 tests passing (2 route + 8 engine + 5 summary)
- Updated TESTS.md, PROMPTS.md with actual prompt implementation

### Completed (lead + report + email)

- Created `routes/lead.ts` and `controllers/lead.ts` — saves email to D1, sends confirmation via Resend
- Created `routes/report.ts` and `controllers/report.ts` — GET /report/:publicId returns no PII
- Wired all routes in `src/index.ts`
- Set up Resend with custom domain `metricflow.in` (DNS verified)
- Emails sending from `noreply@metricflow.in` — tested working

### Completed (rate limiting)

- Added `middleware/rate-limit.ts` — in-memory rate limiter (10 req/min per IP)
- Applied rate limiting to POST /audit and POST /lead
- Choice documented: rate limiting via IP tracking, resets per window. Simple, no external deps.

### Decisions

- **Custom domain for email**: Used `metricflow.in` domain for professional sending via Resend
- **Rate limiting over honeypot**: Rate limiter protects both endpoints without modifying frontend form

### Problems Encountered

- Resend DNS propagation took ~10 minutes after adding records to Cloudflare
- Test email delivered to Resend logs but took time to reach Gmail inbox

### Next Steps

- Start frontend (homepage + audit form)
- **Needs your input**: REFLECTION.md, USER_INTERVIEWS.md, GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md

### Completed (backend quality + assignment alignment)

- Hardened `alternative-tool` recommendation logic to avoid weak/manufactured savings:
  - minimum spend gate (`$40/mo`)
  - minimum absolute savings (`$25/mo`)
  - minimum savings percentage (`20%`)
  - suppress weaker alternatives when downgrade recommendations are stronger
- Switched alternative-tool savings to modeled spend math (`modeled plan price × seats`) instead of flat percentage assumptions
- Added/updated backend tests for:
  - low-spend alternative suppression
  - weaker-alternative suppression when downgrade is stronger
- Documented the problem + fix in `docs/MAJOR_ERRORS.md`
- Added API lint script in `apps/costpilot-api/package.json` (`lint: tsc --noEmit`) so CI lint step is valid
- Updated `PRICING_DATA.md` to global USD + official-source alignment (including Gemini Pro/Ultra from Google One global page)
- Removed non-official pricing references from pricing docs
- Aligned backend Gemini downgrade logic text/math with official pricing (`$19.99/user/month`)
- Re-ran API lint/tests after changes; backend checks pass

### Decisions

- Prioritize defensible financial recommendations over aggressive optimization suggestions
- Keep alternative recommendations conservative unless savings are clearly provable
- Keep assignment pricing documentation tied to official global/vendor sources

### Next Steps

- Frontend implementation and polish remain the primary pending work

### Completed (global pricing doc cleanup)

- Updated `PRICING_DATA.md` to use global USD pricing for Gemini Pro/Ultra from official Google One page (`one.google.com/intl/en/about/google-ai-plans`)
- Removed non-official third-party pricing references from Cursor, Anthropic API, and Windsurf sections
- Reworded non-public enterprise rows to "Custom pricing" where official fixed numbers are not published
- Refreshed verification dates in updated rows to `2026-05-09`
- Aligned backend Gemini downgrade logic text/math with official global USD pricing (`$19.99/user/month`)

### Completed (backend reassessment + CI lint fix)

- Re-ran backend-to-assignment review after latest updates
- Confirmed API backend alignment improved: useCase-driven alternatives now present, `/lead` and `/report` docs now marked built
- Identified CI blocker: workflow lint step targeted `costpilot-api` but package had no `lint` script
- Added API lint script in `apps/costpilot-api/package.json`: `lint: tsc --noEmit`
- Verified backend lint command now passes (`pnpm --filter costpilot-api lint`)
- Re-ran backend tests after lint fix; all 16 tests passing

### Decisions

- Keep CI lint step for backend as `pnpm --filter costpilot-api lint`; satisfy it by defining a local API lint script
- Defer `PRICING_DATA.md` source cleanup for now based on user instruction to skip it temporarily

### Next Steps

- Discuss recommendation-quality concern in detail (avoid perceived manufactured savings for low-spend cases)
- Revisit `PRICING_DATA.md` official-source cleanup when resumed

### Completed (alternative-tool quality hardening)

- Hardened alternative-tool logic in `audit-engine.ts` to avoid weak/"manufactured" savings outputs
- Added strict gates for alternatives: minimum spend, minimum absolute savings, minimum percentage savings
- Switched alternatives to modeled spend math (`modeled plan price × seats`) instead of flat percentage assumptions
- Suppressed weaker alternatives when existing downgrade recommendations are already stronger
- Added regression tests for low-spend suppression and weaker-alternative suppression
- Documented the issue and fix in `docs/MAJOR_ERRORS.md`

### Completed

- Made Resend sender configurable with `RESEND_FROM_EMAIL` and `RESEND_FROM_NAME`
- Updated lead email sending to log non-2xx Resend responses instead of ignoring them
- Added worker env vars for the sender address and display name
- Verified backend test suite still passes after the email change

### Decisions

- Treat the verified sender address as an environment-specific setting instead of hardcoding it in the worker

### Problems Encountered

- Resend can show an email as sent/delivered in its dashboard even when Gmail filters or rejects the message later

### Next Steps

- Set `RESEND_FROM_EMAIL` to the verified domain sender in dev and production
- Confirm SPF, DKIM, and DMARC are aligned for the verified domain
- Check Gmail spam/promotions if delivery still looks missing

---

## 2026-05-09

### Completed (assignment gap fixes)

- Updated `PROMPTS.md` — changed status from "pending" to "implemented"
- Updated `docs/API_CONTRACTS.md` — marked /lead and /report as ✅ built with full docs
- Added `alternative-tool` recommendation type to audit engine — now evaluates cheaper alternatives by useCase
- Updated CI workflow — added `pnpm lint` step alongside tests
- Fixed test for all-8-tools (now handles extra useCase recommendations)
- Added test for useCase-based alternative tool recommendations
- All 16 tests passing

### Decisions

- **useCase-driven alternatives**: Coding tools (Cursor, Copilot, Windsurf) suggest ChatGPT/Claude for non-coding use cases. General tools (ChatGPT, Claude) suggest Cursor/Copilot for coding use cases.
- **Resend config via env vars**: Made sender email/name configurable via RESEND_FROM_EMAIL and RESEND_FROM_NAME secrets

### Problems Encountered

- Overwriting same function with piecemeal edits caused syntax errors — had to rewrite full functions cleanly

### Next Steps

- Start frontend (homepage + audit form)
- **Needs your input**: REFLECTION.md, USER_INTERVIEWS.md, GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md

### Completed (frontend landing redesign)

- Reworked landing page for assignment alignment and stronger startup-grade polish
- Updated hero messaging and CTAs to emphasize value-first flow (no login before results)
- Added tool coverage section for all required AI tools in assignment scope
- Added audit starter section to preview expected inputs (plans, seats, spend, use-case, team size)
- Updated live demo section to show defensible recommendation style and realistic savings framing
- Improved “How it works” copy to reflect deterministic rules and privacy-safe report sharing
- Added FAQ section with assignment-relevant trust answers
- Fixed frontend TypeScript blocker by extending `FloatingElement` with `style` prop and removing unused ref
- Updated `LANDING_COPY.md` with headline, subheadline, CTA, social proof placeholder, and 5 FAQs

### Decisions

- Kept the aesthetic dark/cinematic while reducing fluff and increasing trust/clarity in copy
- Prioritized assignment-fit messaging over decorative-only sections

### Next Steps

- Build full `/audit` route with functional persisted form and API integration
- Connect landing CTA directly into complete audit flow

---

## 2026-05-09 (Premium Art Direction Pass)

### Completed

- **Premium SaaS Aesthetic Overhaul**: Shifted landing page from "AI-generated" look to a refined, art-directed experience inspired by Linear, Vercel, and Digital Heroes.
- **Background Beams with Collision**: Implemented a custom, high-performance animation component for the "Integrations" section with vertical beams that "explode" into emerald particles.
- **Hardware-Accelerated Motion**: Rewrote the `Spotlight` component using `requestAnimationFrame` and linear interpolation (`lerp`) for silky-smooth, lag-free cursor tracking.
- **Visual Rhythm & Asymmetry**: 
    - Broke repetitive layouts with intentional asymmetry and overlapping mockups.
    - Redesigned `LiveDemo` as an immersive product showcase with a realistic "Defensible Report" UI.
    - Redesigned `HowItWorks` with descriptive, data-driven Step Visuals replacing placeholder bars.
- **Human Art Direction**: 
    - Reduced ambient glow usage by ~40% for a more restrained, professional atmosphere.
    - Added magnetic interactions to the Navbar logo and primary CTA buttons.
    - Standardized typography tracking, line-heights, and font-weight rhythms.
    - Stabilized background to pure black (`#000000`) for maximum clarity and contrast.
- **Technical Fixes**: Resolved critical import error by moving misplaced shadcn components and utilities from `@/` folder to `src/` to align with Vite/TypeScript alias configurations.
- **Navigation Connectivity**: Added "Sample report" link and fixed all `id` anchors for seamless on-page navigation.

### Decisions

- **Restraint over Excess**: Chose subtle mesh gradients over heavy radial glows to communicate "Technical Sophistication" rather than "Gamer/Crypto" aesthetics.
- **Pure Black vs. Tinted**: Reverted "muddy" green-black background to pure black to ensure razor-sharp typography and high-end feel.
- **Interactive Depth**: Used layered glass effects (`backdrop-blur-xl`) and inner shadows on cards to create a physical, premium feel.

### Problems Encountered

- **Alias Conflict**: Physical `@` folder in root conflicted with Vite's `@/*` path alias, causing build-time import resolution failures. Resolved by moving files to `src/` and deleting the physical `@` directory.
- **Over-glow**: Initial designs had too much ambient lighting, making the UI feel "janky" and hard to read. Fixed via systematic reduction of radial gradients.

### Next Steps

- Transition to full functional `/audit` flow.
- Implement the multi-step multi-tool input form with persistence.
- Connect landing CTAs to the live audit engine.

---

## 2026-05-10

### Completed

- **Audit Feature (full flow)**: Built the complete audit form → results → lead capture → share pipeline
  - `features/audit/types/audit.types.ts` — Form types, plan/tool/useCase option maps for all 8 tools
  - `features/audit/validation/audit.schema.ts` — Zod v4 schema matching backend validation
  - `features/audit/store/audit.store.ts` — Zustand store with localStorage persistence (form state survives reload)
  - `features/audit/api/audit.api.ts` — POST /audit call via shared axios instance
  - `features/audit/hooks/useAudit.ts` — TanStack Query mutation with loading/error handling
  - `features/audit/components/ToolRow.tsx` — Individual tool row (selector, plan dropdown, spend, seats, remove)
  - `features/audit/components/AuditForm.tsx` — Full form with dynamic tool rows, team size, use case, submit button with emerald styling
  - `features/audit/pages/AuditPage.tsx` — Single page: shows form, replaces with results after API response
- **Results Feature**: Built results display and lead capture
  - `features/results/components/ResultsView.tsx` — Savings hero with AnimatedCounter, recommendation cards with type badges (downgrade, credit-optimization, alternative-tool, plan-mismatch, already-optimal), AI summary section, share button (copies /report/:publicId URL)
  - `features/results/components/LeadCapture.tsx` — Email + optional company/role form, success confirmation state, appears AFTER results are visible
  - `features/results/api/lead.api.ts` — POST /lead call
- **Report Feature**: Built public report page
  - `features/report/api/report.api.ts` — GET /report/:publicId call
  - `features/report/hooks/useReport.ts` — TanStack Query fetch with 5-min cache
  - `features/report/pages/ReportPage.tsx` — Full public report with OG meta tags (og:title, og:description, twitter:card), same premium dark aesthetic, tools analyzed grid, CTA back to audit
- **Shared Infrastructure**:
  - `shared/services/api.ts` — Axios instance pointing to deployed API (`costpilot-api.omshuklalko3.workers.dev`)
  - `shared/utils/formatCurrency.ts` — USD currency formatter
- **Router**: Added `/audit` and `/report/:publicId` routes (standalone, no navbar — full-screen immersive)
- **Landing page**: Updated all CTA links (Hero, CTASection, Navbar) to point to `/audit` instead of anchor scrolls
- **Build**: TypeScript compiles clean, Vite build passes (614KB JS, 70KB CSS)
- Added `@costpilot/shared` as workspace dependency in web package.json

### Decisions

- **Single-page audit flow**: Form and results share `/audit` route (form toggles to results after API response) rather than separate `/audit` and `/results/:id` routes. Avoids data-passing complexity since there's no GET /audit/:id endpoint. Cleaner UX.
- **No Navbar on feature pages**: Audit and report pages are full-screen immersive (no RootLayout wrapper). Landing page keeps the navbar. Users use browser back button or the "New audit" reset button.
- **Lead capture after results**: Follows assignment's "Email is captured _after_ value is shown, never before" rule. LeadCapture component initially hidden behind a subtle CTA button, expands inline on click.
- **Zustand partial persistence**: Only form fields (tools, teamSize, useCase) persist to localStorage. Results and submission state are ephemeral (reset on "New audit").
- **OG tags via JS**: Public report page sets meta tags dynamically via useEffect (document.title + og/twitter meta). Not ideal for crawlers that don't execute JS, but functional for Googlebot and modern crawlers. Would need SSR/edge functions for full OG support.

### Problems Encountered

- **Zod v4 API mismatch**: Zod v4 removed `required_error` parameter from `z.number()`. Switched to plain `z.number().min()` calls. Project uses Zod v4.4.3.
- **Shared types not resolved**: `@costpilot/shared` was not listed as a web dependency. Added `"@costpilot/shared": "workspace:*"` to web package.json.
- **AnyPlan type narrowing in selects**: Form `<select>` returns `string` but plan type is `AnyPlan` (union of string literals). Cast with `as any` in the onChange handler since the options are generated from PLANS_BY_TOOL map and always valid.

### Next Steps

- Fill 5 empty root docs: REFLECTION.md, GTM.md, ECONOMICS.md, USER_INTERVIEWS.md, METRICS.md
- Complete DEVLOG.md Day 4-7 entries
- Add screenshots/recording to README.md
- Bonus: PDF export, Lighthouse score optimization

### Completed (product UX premium redesign pass)

- Redesigned `/audit` into an asymmetric split layout with a dominant left narrative rail and a floating right-side command-center form panel.
- Upgraded `AuditForm` and `ToolRow` surfaces to a layered dark-glass terminal style with stronger input focus states, larger control sizing, and improved spacing cadence.
- Rebuilt results experience (`ResultsView`) around emotional payoff and hierarchy:
  - dramatic savings reveal hero
  - optimization score + confidence + risk modules
  - primary recommendation spotlight
  - secondary opportunities grid
  - informational insights section
  - spend allocation bars and before/after spend comparison
  - structured AI briefing block
- Reworked public report page (`/report/:publicId`) into an executive-style intelligence report with stronger typographic hierarchy and presentation-grade sectioning.
- Preserved existing architecture, routes, API contracts, and Zustand persistence flow while upgrading product UX quality.

### Decisions

- Kept motion restrained and hierarchy-driven (reveal, focus, depth) instead of decorative animation to maintain trust and executive tone.
- Used one dominant focal point per screen and separated high-impact vs informational content to avoid equal-weight dashboard feel.

### Problems Encountered

- Existing repo lint blockers remain outside this redesign scope:
  - `src/components/ui/button.tsx` fast-refresh export rule
  - `src/shared/components/animations/BackgroundBeamsWithCollision.tsx` `Math.random()` purity rule

### Next Steps

- Tighten bundle size (results/report page code-splitting) after design freeze.
- Resolve existing lint blockers in shared UI/animation utilities for fully green frontend lint.

### Completed (results intelligence density pass)

- Upgraded `ResultsView` with stronger executive hierarchy:
  - Primary recommendation now includes larger impact metric and reasoning bullets
  - Added overlap exposure diagnostics for multi-assistant tool stacks
  - Added transformation flow blocks (current spend → overlap exposure → optimized spend)
  - Added confidence + risk modules and stronger recommendation emphasis
- Upgraded public `ReportPage` for investor/executive readability:
  - Added generated timestamp metadata and stronger KPI hierarchy
  - Added highlighted primary action card and sorted recommendations by impact
  - Converted summary into concise AI analyst briefing bullets

### Problems Encountered

- Frontend lint still blocked by pre-existing unrelated issues in:
  - `src/components/ui/button.tsx` (react-refresh export rule)
  - `src/shared/components/animations/BackgroundBeamsWithCollision.tsx` (`Math.random()` purity rule)

### Completed (audit input UX + result stability fix)

- Improved numeric field editing ergonomics in audit form by auto-selecting value on focus for:
  - team size
  - monthly spend
  - seats
- This removes the “have to type 090” friction when replacing default/previous values.
- Persisted the latest audit `result` in Zustand persistence so the preferred results view remains stable across refresh/re-hydration instead of unexpectedly reverting presentation context.
