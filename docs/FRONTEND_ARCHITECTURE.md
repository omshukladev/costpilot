# Frontend Architecture

This document defines the official frontend architecture for CostPilot.

All contributors and AI assistants must follow this structure.

If external preferences conflict with this document,
follow this document.

---

# Core Architecture Philosophy

The frontend architecture should prioritize:

- scalability
- maintainability
- predictability
- feature isolation
- reusable UI primitives
- clean separation of concerns

Avoid:
- monolithic component structures
- deeply coupled modules
- random utility dumping
- cross-feature dependency chaos
- overly abstract enterprise patterns

---

# Primary Architecture Style

Use:

- feature-first architecture
- modular organization
- localized business logic
- shared reusable primitives

The frontend should scale by features,
not by file type alone.

---

# Official Source Structure

```txt
src/
│
├── app/
│   ├── providers/
│   │   └── index.tsx               # QueryClient + Lenis smooth scroll
│   ├── router/
│   │   └── index.tsx               # BrowserRouter: /, /audit, /report/:publicId
│   ├── layouts/
│   │   └── RootLayout.tsx          # Navbar + Outlet + Footer (landing only)
│   ├── styles/
│   └── config/
│
├── features/
│   ├── audit/                      # Audit form + engine integration
│   │   ├── api/
│   │   │   └── audit.api.ts        # POST /audit
│   │   ├── components/
│   │   │   ├── AuditForm.tsx       # Multi-tool form, team size, use case
│   │   │   └── ToolRow.tsx         # Single tool row (selector, plan, spend, seats)
│   │   ├── hooks/
│   │   │   └── useAudit.ts         # TanStack Query mutation
│   │   ├── pages/
│   │   │   └── AuditPage.tsx       # Form → results on same page
│   │   ├── store/
│   │   │   └── audit.store.ts      # Zustand with localStorage persistence
│   │   ├── types/
│   │   │   └── audit.types.ts      # Form types, plan/tool option maps
│   │   ├── validation/
│   │   │   └── audit.schema.ts     # Zod v4 validation
│   │   └── index.ts                # Barrel: AuditPage, useAuditStore
│   │
│   ├── results/                    # Results display + lead capture
│   │   ├── api/
│   │   │   └── lead.api.ts         # POST /lead
│   │   └── components/
│   │       ├── ResultsView.tsx     # Savings hero, recommendations, summary, share
│   │       └── LeadCapture.tsx     # Email/company/role form (shown after results)
│   │
│   ├── report/                     # Public shareable report
│   │   ├── api/
│   │   │   └── report.api.ts       # GET /report/:publicId
│   │   ├── hooks/
│   │   │   └── useReport.ts        # TanStack Query fetch
│   │   ├── pages/
│   │   │   └── ReportPage.tsx      # Public report with OG meta tags
│   │   └── index.ts                # Barrel: ReportPage
│   │
│   └── landing/                    # Marketing landing page
│       ├── components/
│       │   ├── Hero.tsx
│       │   ├── ToolCoverage.tsx
│       │   ├── AuditStarter.tsx
│       │   ├── LiveDemo.tsx
│       │   ├── HowItWorks.tsx
│       │   ├── FAQSection.tsx
│       │   └── CTASection.tsx
│       └── pages/
│           └── LandingPage.tsx
│
├── shared/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Floating capsule nav
│   │   │   └── Footer.tsx
│   │   └── animations/
│   │       ├── CursorSpotlight.tsx
│   │       ├── FadeIn.tsx
│   │       ├── AnimatedCounter.tsx
│   │       ├── HoverGlowCard.tsx
│   │       ├── Spotlight.tsx
│   │       ├── ShootingStars.tsx
│   │       ├── FloatingElement.tsx
│   │       ├── AmbientGradient.tsx
│   │       ├── StaggerContainer.tsx
│   │       ├── BackgroundBeamsWithCollision.tsx
│   │       ├── FloatingOrb.tsx
│   │       ├── AnimatedBorder.tsx
│   │       └── ParallaxLayer.tsx
│   │
│   ├── hooks/
│   ├── utils/
│   │   └── formatCurrency.ts       # USD currency formatting
│   ├── lib/
│   │   └── utils.ts                # cn() — clsx + tailwind-merge
│   ├── services/
│   │   └── api.ts                  # Axios instance (base URL, timeout)
│   ├── constants/
│   └── types/
│
├── assets/
├── index.css                        # Tailwind v4 + Geist font + noise overlay + shadcn theme
├── main.tsx                         # Root render: Providers → CursorSpotlight → noise → Router
└── vite-env.d.ts
```

---

# Folder Responsibilities

## app/

Contains global application setup.

Examples:
- router setup
- providers
- themes
- layouts
- query client
- app configuration

Do NOT place feature business logic here.

---

## features/

Contains isolated business features.

Each feature owns:
- components
- hooks
- API calls
- state
- business logic
- validation
- feature-specific utilities

Each feature should remain self-contained.

---

## shared/

Contains reusable application-wide code.

Only place code here if:
- multiple features use it
- it is generic
- it contains no feature-specific business logic

---

# Feature Structure

Each feature should follow this structure when needed.

```txt
feature-name/
│
├── api/
├── components/
├── hooks/
├── pages/
├── store/
├── types/
├── utils/
├── validation/
└── index.ts
```

Not every feature requires every folder.

Avoid creating empty structure purely for appearance.

---

# Feature Isolation Rules

Features must remain isolated.

Rules:
- features must not directly depend on other features
- shared logic belongs in shared/
- app-wide configuration belongs in app/
- avoid circular dependencies

Bad:

```txt
features/audit importing features/reports internal logic
```

Good:

```txt
features/audit importing shared utilities
```

---

# Component Architecture

## Shared UI Components

Location:

```txt
shared/components/ui
```

Purpose:
- reusable primitives
- generic UI
- design system building blocks

Examples:
- Button
- Card
- Dialog
- Input
- Modal
- Badge
- Tabs

Rules:
- no business logic
- no API logic
- no feature-specific assumptions

---

## Shared Layout Components

Location:

```txt
shared/components/layout
```

Examples:
- Navbar
- Footer
- PageContainer
- Sidebar
- SectionWrapper

---

## Shared Animation Components

Location:

```txt
shared/components/animations
```

Examples:
- FadeIn
- Reveal
- StaggerContainer
- FloatingOrb

Rules:
- animation-only responsibility
- no business logic
- subtle motion only

---

# Feature Components

Feature-specific components stay inside their feature.

Example:

```txt
features/audit/components/AuditForm.tsx
```

Do NOT move components into shared/
unless reused across multiple features.

---

# Routing Rules

All routes should be defined inside:

```txt
app/router
```

Avoid scattered route definitions.

Prefer:
- centralized router setup
- route-based lazy loading
- predictable route organization

---

# State Management Rules

## Zustand

Use Zustand for:
- client-side UI state
- lightweight feature state
- temporary interactions

Avoid:
- excessive global stores
- giant centralized stores

Stores should remain feature-local whenever possible.

Example:

```txt
features/audit/store/audit.store.ts
```

---

## TanStack Query

Use TanStack Query for:
- API requests
- caching
- retries
- loading states
- server synchronization

Do NOT duplicate server state inside Zustand.

---

# API Layer Rules

Feature APIs belong inside feature folders.

Example:

```txt
features/audit/api/audit.api.ts
```

Shared HTTP setup belongs in:

```txt
shared/lib
```

Example:
- axios instance
- interceptors
- request utilities

---

# Form Architecture

Use:
- React Hook Form
- Zod validation

Validation should exist:
- client-side
- server-side

Validation schemas belong near the feature using them.

Example:

```txt
features/audit/validation/audit.schema.ts
```

---

# Type Rules

Feature-specific types remain inside the feature.

Example:

```txt
features/audit/types/audit.types.ts
```

Global reusable types belong in:

```txt
shared/types
```

Avoid giant global type files.

---

# Utility Rules

## shared/utils

Only generic reusable utilities.

Examples:
- formatCurrency
- debounce
- date formatting
- percentage helpers

Avoid:
- audit-specific logic
- recommendation logic
- pricing engine logic

---

# Styling Rules

Use:
- Tailwind CSS
- shadcn/ui

Avoid:
- large CSS files
- inconsistent spacing
- inline styling overload
- random hardcoded values

Prefer:
- reusable utility patterns
- spacing consistency
- design token alignment

---

# Naming Conventions

## Components

```txt
PascalCase.tsx
```

Examples:
- AuditForm.tsx
- PricingCard.tsx

---

## Hooks

```txt
useSomething.ts
```

Examples:
- useAudit.ts
- useRecommendations.ts

---

## Stores

```txt
something.store.ts
```

Examples:
- audit.store.ts
- ui.store.ts

---

## API Files

```txt
something.api.ts
```

Examples:
- audit.api.ts
- reports.api.ts

---

## Types

```txt
something.types.ts
```

Examples:
- audit.types.ts
- reports.types.ts

---

## Validation

```txt
something.schema.ts
```

Examples:
- audit.schema.ts
- report.schema.ts

---

# Import Rules

Avoid deep relative imports.

Bad:

```ts
../../../../components/Button
```

Use aliases instead.

Preferred aliases:

```txt
@/app/*
@/features/*
@/shared/*
```

---

# Barrel Export Rules

Use barrel exports carefully.

Allowed:
- feature public APIs
- shared reusable exports

Avoid:
- massive wildcard export chains
- unclear dependency paths

Each feature may expose a controlled public API using:

```txt
index.ts
```

---

# Performance Rules

Optimize for:
- Lighthouse performance
- mobile responsiveness
- minimal unnecessary re-renders
- route-level code splitting

Prefer:
- lazy loading
- memoization when necessary
- efficient rendering

Avoid premature optimization.

---

# Mobile Responsiveness

All pages must support:
- mobile
- tablet
- desktop

Mobile usability is mandatory.

---

# Accessibility Rules

Ensure:
- semantic HTML
- keyboard navigation
- visible focus states
- accessible labels
- sufficient contrast

Accessibility is not optional.

---

# Animation Rules

Use Framer Motion lightly.

Animations should:
- improve UX
- improve clarity
- feel premium
- remain subtle

Avoid:
- excessive motion
- distracting transitions
- animation-heavy interfaces

---

# Testing Organization

Tests should stay near related logic when practical.

Examples:

```txt
AuditForm.test.tsx
audit.utils.test.ts
```

Focus testing on:
- business correctness
- deterministic behavior
- edge cases
- validation
- audit calculations

Avoid testing implementation details.

---

# Important Architectural Principles

## Keep Logic Close

Business logic should remain near the feature using it.

Avoid giant global utility layers.

---

## Avoid Premature Abstraction

Do not create abstraction layers unless:
- duplication becomes real
- multiple features need it
- complexity is justified

---

## Prioritize Readability

Readable architecture is more important than clever architecture.

Prefer:
- obvious structure
- explicit naming
- simple patterns

---

# AI Assistant Rules

AI assistants must:
- follow existing architecture
- preserve feature boundaries
- avoid unnecessary abstractions
- avoid introducing new architectural patterns without justification

When uncertain:
- prefer simpler implementation
- prefer consistency with repository patterns

---

# Routing Architecture

## Route Layout Decision

Two layout modes are used:

| Route | Layout | Rationale |
|-------|--------|-----------|
| `/` | RootLayout (Navbar + Footer) | Marketing page — needs navigation |
| `/audit` | Standalone (no wrapper) | Full-screen immersive product experience |
| `/report/:publicId` | Standalone (no wrapper) | Clean shareable page, no nav clutter |

Audit and report pages still receive the global `CursorSpotlight` and noise overlay from `main.tsx` at the root level.

## Route Tree

```
/
├── /              → LandingPage (RootLayout)
/audit             → AuditPage (standalone)
/report/:publicId  → ReportPage (standalone)
```

---

# Current Feature Dependency Graph

```
features/landing/
  └── imports from shared/components/animations/*

features/audit/
  ├── imports from shared/services/api
  ├── imports from shared/utils/formatCurrency
  └── imports from shared/components/animations/AnimatedCounter, FadeIn

features/results/
  ├── reads from features/audit/store/audit.store (result state)
  ├── imports from shared/services/api
  └── imports from shared/components/animations/AnimatedCounter

features/report/
  ├── imports from shared/services/api
  └── imports from shared/utils/formatCurrency
```

No feature directly imports internal logic from another feature. The `results` feature reads from `audit/store` via Zustand (which is the intended shared state boundary).

---

# Final Rule

A clean architecture is more valuable than a clever architecture.

Prioritize:
- maintainability
- clarity
- consistency
- scalability
- predictable organization