# Major Errors

## Purpose

Tracks significant errors encountered during development and their resolutions.

---

## Vercel Deployment Failed — `ERR_PNPM_OUTDATED_LOCKFILE`

### Error

Vercel deployments failed with:
```
ERR_PNPM_OUTDATED_LOCKFILE: Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
  Failure reason: specifiers in the lockfile don't match specifiers in package.json:
  * 2 dependencies were added: @cloudflare/vitest-pool-workers@^0.12.4, vitest@~3.2.0
```

### Root Cause

Added `@cloudflare/vitest-pool-workers` and `vitest` to `apps/costpilot-api/package.json`, but `pnpm-lock.yaml` was not regenerated. Vercel uses `--frozen-lockfile` by default (CI mode), which rejects installs when the lockfile doesn't match package.json.

### Fix

Ran `pnpm install --no-frozen-lockfile` to force-regenerate `pnpm-lock.yaml` to match the updated `package.json`. Committed and pushed the updated lockfile to `main`.



---

## Vitest D1 Migration Setup — `applyD1Migrations` Binding Mismatch

### Error

Failed to set up D1 migrations in Vitest test environment:
```
TypeError: Failed to execute 'applyD1Migrations': parameter 1 is not of type 'D1Database'.
```

### Root Cause

The `@cloudflare/vitest-pool-workers` test environment creates a D1 instance but the binding name (`costpilot_db`) didn't match what `applyD1Migrations()` expected. The function strictly requires a `D1Database` type. Our `wrangler.jsonc` uses `costpilot_db` as the binding, but the vitest pool exposes it differently.

### Fix

Reverted the test migration setup for now. Audit engine tests are pure logic (no DB needed), so they don't require D1. DB query tests will be added later with proper D1 test infrastructure.

### Lesson

Keep tests that don't need the database completely separate from DB integration tests. The audit engine is pure logic — test it without any Workers runtime setup.

---

## CI: Vitest Remote D1 Connection Fails

### Error

GitHub Actions CI failed with:
```
Error: Failed to start the remote proxy session...
You must be logged in to use wrangler dev in remote mode.
```

### Root Cause

The D1 binding in `wrangler.jsonc` had `"remote": true`, which tells the vitest pool to connect to the remote Cloudflare D1 database. In CI, there's no Cloudflare authentication, so the connection fails.

### Fix

Added `remoteBindings: false` to `vitest.config.ts` under `poolOptions.workers`. This tells the vitest pool to use local storage instead of trying to connect to remote resources.

---

## Audit Engine: Alternative-Tool Suggestions Looked "Manufactured"

### Error

Alternative-tool recommendations were being generated too aggressively (fixed percentage savings and broad suggestions), which could produce weak or non-defensible savings claims for low-spend or already-optimized setups.

### Root Cause

- Alternative recommendations used percent-based savings instead of modeled plan-price comparisons.
- No strict guardrails for minimum spend, minimum absolute savings, or minimum savings percentage.
- Alternative suggestions could be added even when an existing downgrade recommendation was already stronger.

### Fix

Implemented stricter, finance-defensible gating for `alternative-tool` recommendations in `audit-engine.ts`:

- Added hard thresholds:
  - minimum current spend: `$40/month`
  - minimum alternative savings: `$25/month`
  - minimum relative savings: `20%`
- Switched to modeled alternative spend (`modeled plan price × seats`) instead of flat percentage assumptions.
- Suppressed weaker alternatives when an existing recommendation already saves more (requires alternative to beat existing savings by a margin).
- Added tests to ensure:
  - low-spend setups do not get alternative recommendations
  - weaker alternatives are suppressed when downgrade is stronger

### Lesson

For financial recommendation systems, "possible savings" is not enough. Suggestions should only appear when assumptions are explicit and savings clear enough to be defensible to a finance-literate reviewer.

---

## Alternative-Tool Suggestions Ignored User's Existing Stack

### Error

The audit engine suggested "Consider Cursor Pro" for Claude/ChatGPT users who already had Cursor in their stack. This inflated total savings because it assumed replacing Claude with Cursor would save money, but the user was already paying for Cursor.

Example: User with Claude API ($500/mo) + Cursor Business ($80/mo) + ChatGPT Enterprise ($300/mo) was told to "Replace Claude with Cursor Pro" saving $480/mo — but they already use Cursor. The total was falsely inflated to $720/mo.

### Root Cause

`maybeBuildAlternativeRecommendation()` didn't check whether the user already had the suggested tool. It generated alternative-tool recommendations based only on useCase + spend, ignoring the existing tool stack.

### Fix

Added `allTools` parameter to `maybeBuildAlternativeRecommendation()`. The function now extracts the suggested tool name from the action text (e.g., "Cursor Pro" from "Consider Cursor Pro at $20/..."), maps it to toolIds via `altToolMapping`, and skips the suggestion if the user already has any of those tools.

5 callers updated to pass `input.tools`. Added regression test. Total savings for the multi-tool test case dropped from $720/mo to $265/mo (correct).
