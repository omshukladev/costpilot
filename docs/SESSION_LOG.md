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
