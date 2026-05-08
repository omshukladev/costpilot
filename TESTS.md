# Tests

## Running Tests

From root:
```bash
pnpm test
```

From API package:
```bash
cd apps/costpilot-api && pnpm test
```

---

## Test Files

### `apps/costpilot-api/src/__tests__/index.test.ts`

API route tests (2 tests):
- `GET /message returns Hello Hono!` — verifies basic Hono route works
- `GET /unknown returns 404` — verifies unknown routes return 404

### `apps/costpilot-api/src/__tests__/audit-engine.test.ts`

Audit engine tests (8 tests):
- `detects Cursor Business with 2 seats and recommends downgrade to Pro` — plan downgrade logic
- `detects ChatGPT Enterprise with 5 seats and recommends Team plan` — enterprise downgrade logic
- `detects Claude API >$200 spend and suggests Credex credits` — credit optimization for API spend
- `returns already-optimal for a single Copilot Individual user` — confirms no false positives
- `calculates total savings correctly for multiple tools` — multi-tool aggregation
- `handles all 8 tools without crashing` — all tools produce valid recommendations
- `returns zero savings for already-optimal setups` — no manufactured savings
- `generates ISO timestamp in createdAt` — date format verification

### `apps/costpilot-api/src/__tests__/summary.test.ts`

Summary fallback tests (5 tests):
- `returns fallback when apiKey is undefined` — graceful degradation
- `returns fallback when apiKey is empty` — handles empty string key
- `fallback mentions savings when there are savings` — includes dollar amounts + Credex mention
- `fallback says optimized when no savings` — no fabricated savings
- `fallback includes tool count` — dynamic content based on input
