# Dev Log

## Day 1 - 2026-05-07

**Hours worked:** 6

**What I did:**
- Set up monorepo with pnpm workspaces
- Scaffolded Cloudflare Worker with Hono for backend (`costpilot-api`)
- Scaffolded React + Vite + Tailwind v4 + shadcn/ui for frontend (`costpilot-web`)
- Deployed backend to Cloudflare Workers
- Deployed frontend to Vercel
- Created D1 database `costpilot-db` with binding `costpilot_db`
- Set up Gemini API key locally
- Created shared types package in `packages/shared`

**What I learned:**
- How to scaffold Cloudflare Workers using `npm create cloudflare@latest`
- How to connect D1 database and bind it to a Worker
- How shadcn/ui radix-nova style works with Tailwind v4
- How Vercel auto-deploys from main branch

**Blockers / what I'm stuck on:**
- Vercel deploy failed initially due to outdated pnpm-lock.yaml
- Fixed by running `pnpm install --no-frozen-lockfile` and committing the updated lockfile

**Plan for tomorrow:**
- Set up Vitest with `@cloudflare/vitest-pool-workers`
- Create D1 migration for `audits` and `leads` tables
- Build audit engine controller
- Create POST /audit route
- Start building the spend input form on frontend

---

## Day 2 - 2026-05-08

**Hours worked:** 7

**What I did:**
- Set up Vitest with `@cloudflare/vitest-pool-workers` — 2 passing tests
- Created D1 migration `0001_001_create_tables.sql`
- Applied migration to remote D1 database (tables: `audits`, `leads`)
- Switched from Drizzle ORM to raw SQL for simpler setup
- Updated all docs (CLAUDE.md, BACKEND_RULES.md, ORM_RULES.md, DB_SCHEMA.md, MAJOR_DECISIONS.md, SESSION_LOG.md)
- Set up migration folder structure under `apps/costpilot-api`
- Recreated shared types package (`packages/shared`) — ToolId, AuditInput, Recommendation, AuditResult
- Built audit engine controller (`controllers/audit-engine.ts`) — deterministic pricing logic for all 8 tools
- Wrote 8 tests for audit engine covering downgrade, credit optimization, already-optimal cases
- All 10 tests passing (2 route + 8 engine)
- Documented Vercel lockfile error in docs/MAJOR_ERRORS.md
- Created PRICING_DATA.md with current pricing sources for all 8 tools (verified 2026-05-08)
- Created CI workflow `.github/workflows/ci.yml` — runs tests on push to main
- Created SUMMARY.md (local reference, gitignored)
- Added SUMMARY.md to .gitignore

**What I learned:**
- Vitest with Cloudflare pool workers requires specific config (defineWorkersConfig, globals: true)
- D1 migrations workflow: create migration file → apply with `wrangler d1 migrations apply`
- Raw SQL with D1 is simpler than ORM for an MVP
- Vercel uses `--frozen-lockfile` by default — lockfile must match package.json exactly
- Audit engine logic stays pure and testable when separated from DB and API concerns

**Blockers / what I'm stuck on:**
- None currently

**Plan for tomorrow:**
- Build `controllers/db.ts` with raw SQL queries
- Create `routes/audit.ts` with Zod validation
- Build summary controller (Gemini + fallback)
- Create `routes/lead.ts` and `routes/report.ts`
- Wire all routes in `src/index.ts`
- Write integration tests for routes

---

## Day 3 - 2026-05-09

**Hours worked:** 5

**What I did:**
- Created POST /lead and GET /report/:publicId routes + controllers
- Set up Resend with custom domain metricflow.in (DNS verified)
- Added rate limit middleware (10 req/min) on POST routes
- Wired all routes in index.ts
- Fixed audit engine to use useCase for alternative tool recommendations
- Updated PROMPTS.md and API_CONTRACTS.md (were stale, said "pending/planned")
- Fixed CI to include lint step
- Added 2 more tests (useCase alternatives, all-tools updated)
- All 16 tests passing
- Deployed with all 4 secrets as Cloudflare secrets

**What I learned:**
- Resend DNS setup with Cloudflare is straightforward (just TXT + MX records)
- Rate limiting in Workers is per-instance — not distributed but good enough for MVP
- useCase field isn't just metadata — the assignment expects it to drive recommendation logic

**Blockers / what I'm stuck on:**
- None currently

**Plan for tomorrow:**
- Start frontend (homepage + audit form)
- Fill entrepreneurial docs (GTM, ECONOMICS, LANDING_COPY, METRICS)
- Talk to 3 users for USER_INTERVIEWS.md

---

## Day 4 - 2026-05-10

**Hours worked:** 8

**What I did:**
- Built complete audit form → results → lead capture → share pipeline
  - Dynamic tool selection (all 8 tools with plan dropdowns)
  - Form state persisted via Zustand + localStorage (survives page reload)
  - Real-time spend calculations per tool/plan/seats
- Created results page with animated savings hero, recommendation cards (by type: downgrade, credit-optimization, alternative-tool, plan-mismatch, already-optimal)
- Implemented AI summary display with fallback messaging
- Built public report page with OG meta tags (og:title, og:description, twitter:card) for social sharing
- Set up TanStack Query for caching API responses (5-min TTL on report fetches)
- Connected all landing CTAs to `/audit` form
- TypeScript clean, Vite build succeeds (614KB JS, 70KB CSS)

**What I learned:**
- Zustand partial persistence (form only, not results) keeps state clean and predictable
- OG tags via JS work for Googlebot/modern crawlers but fail on no-JS crawlers (would need SSR for full crawl support)
- Single-page audit flow (form → results on same route) is better UX than separate result storage
- TanStack Query's stale-while-revalidate pattern is essential for report reliability

**Blockers / what I'm stuck on:**
- None currently

**Plan for tomorrow:**
- Add PDF export for reports
- Add embeddable widget version
- Add benchmark mode for peer comparison
- Premium motion polish on results/report

---

## Day 5 - 2026-05-11

**Hours worked:** 7

**What I did:**
- Implemented client-side PDF export using `@react-pdf/renderer` (two-page executive PDF with metrics, primary rec, spend allocation, briefing)
- Built embeddable widget at `/widget/:publicId` route with lightweight premium layout
- Added widget embed-code copy section on report page with iframe snippet
- Implemented benchmark mode (frontend-only, deterministic peer comparison based on team size, spend, tool count, overlap, efficiency)
- Added "Book Credex Consultation" card for high-savings audits (>$500/month)
- Fixed low-savings CTA copy: "Notify me on pricing changes" → "Notify me when new optimizations apply"
- Upgraded results/report page motion: staggered reveals, card hovers, animated counters (count-up for savings/scores)
- Removed unnecessary embed-code button/text from report to reduce visual clutter
- Fixed alternative-tool logic to skip tools user already owns (removed phantom savings duplication)
- Fixed seat-count thresholds: changed hardcoded limits to per-seat cost comparisons (ChatGPT Enterprise, Claude Team, Windsurf Enterprise now work for larger teams)
- All 19 tests passing

**What I learned:**
- Framer Motion needs layout="position" on exit animations to prevent jitter
- PDF renderer adds ~200KB but lazy-loads on demand so main bundle stays lean
- Benchmark mode must use rule-based comparison (not real cohort data) to stay believable
- Alternative tool recommendations need explicit duplicate-checking or they create phantom savings

**Blockers / what I'm stuck on:**
- None currently

**Plan for tomorrow:**
- Write REFLECTION.md (5 questions about process, decisions, AI usage, self-rating)
- Draft GTM.md, ECONOMICS.md, METRICS.md (business/strategy docs)
- Begin user interview recruitment (critical path blocker)

---

## Day 6 - 2026-05-12

**Hours worked:** 6

**What I did:**
- Ran full assignment.md vs. codebase audit (comprehensive gap analysis)
- Verified all 19 backend tests pass; CI runs lint + tests successfully
- Reviewed all PRICING_DATA.md sources (all vendor links verified 2026-05-09)
- Added DEVLOG entries for days 4-5 with details from SESSION_LOG
- Confirmed deployment: backend live at `costpilot-api.omshuklalko3.workers.dev/`, frontend at `costpilot-costpilot-web.vercel.app/`
- Identified critical gaps: 5 docs still empty (REFLECTION.md, GTM.md, ECONOMICS.md, USER_INTERVIEWS.md, METRICS.md)
- Identified blocker: 3 real user interviews (cannot be faked; evaluators can detect fabrication)
- Commit history: 5 distinct days ✅ (2026-05-07, 05-08, 05-09, 05-10, 05-11)

**What I learned:**
- Assignment rubric weights entrepreneurial thinking 25 points (same as engineering + code combined)
- User interviews are instant-reject if fake (assignment is explicit: "Fabricated interviews are obvious")
- Pricing data accuracy matters — evaluators spot-check vendor links against official pages

**Blockers / what I'm stuck on:**
- 3 real user interviews required (cannot automate, must contact real people this week)

**Plan for tomorrow:**
- Write REFLECTION.md (personal answers to 5 questions — your input required)
- Draft GTM.md, ECONOMICS.md, METRICS.md (can be refined after you review)

---

## Day 7 - 2026-05-13

**Hours worked:** 4

**What I did:**
- Completed 3 real user interviews for USER_INTERVIEWS.md:
  - Prabodh Tiwari (Engineering Manager, Liminal) — privacy concerns, never tracked AI spend across tools
  - Saurabh Singh (college student) — price-sensitive, uses free tiers, found green theme "too flashy"
  - Suraj Das (Senior Platform Engineer, Liminal) — wanted automated API-key-based usage tracking via local browser storage
- Key insight: two people at the same company had completely opposite needs (privacy vs automation)
- Final assignment audit — all 11 root .md files confirmed complete and accurate
- Final docs review — README, ARCHITECTURE, TESTS, PRICING_DATA, PROMPTS all verified
- DEVLOG completed across all 7 days
- Git verified: commits on 7 distinct days
- Confirmed backend tests passing (19/19)
- Confirmed CI workflow green

**What I learned:**
- Talking to users is hard but indispensable — two people at the same company wanted opposite things
- Saurabh's green theme complaint was unprompted and specific — the best feedback comes when you're not asking for it
- Students and professionals have completely different relationships with AI pricing — free tiers hide the real cost problem

**Blockers / what I'm stuck on:**
- None — everything is complete and ready for submission

**Plan for tomorrow:**
- Submit via Google Form
- Include GitHub repo URL, deployed URLs, and all required files
- Aggressive user interview recruitment (15+ cold outreach → 3-5 expected replies)
