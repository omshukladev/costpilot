# Major Decisions

## Purpose

Tracks important architectural and product decisions made during development.

Document:
- why the decision was made
- alternatives considered
- tradeoffs accepted

---

# Decision Log

## Monorepo Architecture

Decision:
- Use PNPM workspace monorepo

Reason:
- Shared types
- Shared business logic
- Better AI context consistency
- Cleaner organization

Tradeoff:
- Slightly more setup complexity

---

## No Authentication For MVP

Decision:
- No login/signup system

Reason:
- Assignment explicitly prioritizes frictionless onboarding
- Faster iteration
- Reduced implementation complexity

Tradeoff:
- No user account persistence


---

## Drizzle ORM Adoption

Decision:
- Use Drizzle ORM with Cloudflare D1

Reason:
- Better type safety
- Cleaner schema management
- Better migration workflow
- Strong AI tooling compatibility
- Easier long-term maintainability

Tradeoff:
- Slightly more setup complexity compared to raw SQL