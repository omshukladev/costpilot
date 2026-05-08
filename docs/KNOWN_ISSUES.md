# Known Issues

## Vitest D1 Test Setup

D1 migration integration with `@cloudflare/vitest-pool-workers` has a binding mismatch. The `applyD1Migrations()` function doesn't recognize the D1 binding name from `wrangler.jsonc`. Audit engine tests are currently pure logic (no DB), so this is not blocking. DB integration tests will need this resolved.

See `docs/MAJOR_ERRORS.md` for details.

## Vercel Lockfile Sync

If package.json dependencies are updated without regenerating `pnpm-lock.yaml`, Vercel deploys will fail. Lockfile must be kept in sync.

## Empty Root Docs

Several assignment-required root docs are still empty and need to be filled before submission:
- ARCHITECTURE.md
- README.md
- REFLECTION.md
- PROMPTS.md
- GTM.md, ECONOMICS.md, USER_INTERVIEWS.md, LANDING_COPY.md, METRICS.md
