# Testing Rules

## Testing Philosophy

Focus testing on:
- audit calculations
- recommendation logic
- API validation
- critical flows

Avoid excessive low-value tests.

---

# Testing Stack

- Vitest
- React Testing Library

---

# Required Coverage Areas

Priority areas:
- audit engine
- pricing calculations
- recommendation generation
- edge cases
- API validation

---


Database-related tests should validate:
- schema correctness
- query behavior
- migration stability

# Important Rule

Tests should validate:
- business correctness
- deterministic behavior
- edge case handling

Not implementation details.