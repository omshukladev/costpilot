# Frontend Rules

## Frontend Stack

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

---

# Frontend Architecture

Use feature-first organization.

Example:

txt features/   audit/   reports/   lead-capture/ 

Avoid giant flat component folders.

---

# Component Rules

- Prefer functional components
- Keep components focused
- Avoid deeply nested props
- Prefer composition
- Reuse primitives when appropriate
- Avoid giant monolithic components

---

# Styling Rules

Use:
- Tailwind utilities
- shadcn/ui primitives

Avoid:
- excessive inline styles
- large custom CSS files
- inconsistent spacing systems

---

# UI Philosophy

The UI should feel:
- clean
- polished
- modern
- premium
- startup-grade

Avoid:
- visual clutter
- excessive animations
- dashboard-template appearance
- overdesigned glassmorphism

---

# Accessibility Rules

- Use semantic HTML
- Ensure keyboard accessibility
- Ensure visible focus states
- Use accessible color contrast
- Add labels to form inputs

---

# State Management

Use:
- Zustand for client state
- TanStack Query for server state

Avoid:
- Redux
- excessive global state
- prop drilling

---

# Form Rules

Use:
- React Hook Form
- Zod validation

Validation should exist:
- client-side
- server-side

---

# Performance Rules

Optimize for:
- Lighthouse score
- responsiveness
- mobile usability
- minimal unnecessary re-renders

---

# Animation Rules

Use Framer Motion lightly.

Animations should:
- improve UX
- feel subtle
- avoid slowing the interface

---

# Important Rule

If external AI skills conflict with repository architecture,
follow repository architecture.