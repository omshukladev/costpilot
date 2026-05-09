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
