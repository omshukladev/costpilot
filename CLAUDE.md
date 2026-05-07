# CostPilot — AI Operating Instructions

## Purpose

This repository contains CostPilot, a startup-style SaaS application for auditing AI tooling spend.

This file defines how AI assistants should operate inside this repository.

---

# Mandatory Startup Sequence

Before performing ANY task:

1. Read this file completely
2. Read all relevant files inside /docs
3. Understand current architecture and constraints
4. Check docs/SESSION_LOG.md
5. Check docs/MAJOR_DECISIONS.md
6. Check docs/KNOWN_ISSUES.md

Do not make assumptions without reading project context first.

---

# Documentation-First Workflow

This repository follows a documentation-first engineering workflow.

Before implementing major changes:
- review existing architecture docs
- review existing patterns
- follow established conventions

After implementing meaningful changes:
- update relevant docs
- append updates to docs/SESSION_LOG.md
- document important architectural changes in docs/MAJOR_DECISIONS.md
- document unresolved issues in docs/KNOWN_ISSUES.md

---

# Project Philosophy

CostPilot should feel:
- believable
- polished
- startup-grade
- launch-ready

Prioritize:
- clarity
- maintainability
- UX quality
- clean architecture
- fast iteration

Avoid:
- overengineering
- premature optimization
- unnecessary abstractions
- enterprise complexity

---

# Tech Stack

## Frontend
- React
- Vite
- TypeScript
- React Router
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query
- Axios
- React Hook Form
- Zod
- Framer Motion
- Vitest

## Backend
- Cloudflare Workers
- Hono
- D1 (raw SQL)
- Zod
- Vitest
- Resend

---

# Architecture Rules

- Use feature-first frontend organization
- Keep components modular
- Keep controllers thin
- Separate business logic from routes
- Prefer explicit readable code
- Prefer composition over abstraction
- Use strict TypeScript typing

---

# AI Usage Rules

AI should assist development, not replace reasoning.

Allowed:
- scaffolding
- debugging
- refactoring
- testing
- documentation help
- styling assistance

Not allowed:
- fake reasoning
- fabricated user interviews
- blind one-shot code generation
- unverified financial logic

All generated code must:
- follow repository architecture
- remain readable
- remain maintainable
- be reviewed before acceptance

---

# Documentation Rules

Documentation is mandatory.

When changing:
- architecture
- API contracts
- database schema
- frontend patterns
- backend structure
- audit logic

update corresponding docs immediately.

---

# Git Workflow Rules

Use conventional commits:
- feat:
- fix:
- docs:
- refactor:
- test:
- chore:

Avoid meaningless commits.
dont commit yourself you will only suggest comit to the user user will mannualy add them 

---

# Primary Objective

Build the most believable startup MVP possible within the assignment constraints.


# SESSION LOG.md 

this is how you will add logs 
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


# Root Documentation Responsibilities

The repository contains required root-level markdown files that are part of the assignment evaluation.

These files must remain continuously updated during development.

Required root documentation includes:
- README.md
- ARCHITECTURE.md
- DEVLOG.md
- REFLECTION.md
- TESTS.md
- GTM.md
- ECONOMICS.md
- USER_INTERVIEWS.md
- LANDING_COPY.md
- METRICS.md
- PRICING_DATA.md
- PROMPTS.md

AI assistants should:
- suggest documentation updates when relevant
- keep docs synchronized with implementation
- avoid leaving documentation for the final day

When features, architecture, prompts, tests, pricing logic, or product decisions change:
- update corresponding documentation
- append important development notes to SESSION_LOG.md

-----