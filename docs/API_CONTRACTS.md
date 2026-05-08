# API Contracts

## Routes

### POST /audit

**Status**: ✅ Built

**Purpose**: Run an AI spend audit and return recommendations

**Input**:
```json
{
  "tools": [
    {
      "toolId": "cursor",
      "plan": "business",
      "monthlySpend": 80,
      "seats": 2
    }
  ],
  "teamSize": 5,
  "useCase": "coding"
}
```

**Validation**:
- `tools`: array (min 1), each with valid `toolId`, `plan`, `monthlySpend` ≥ 0, `seats` ≥ 1
- `teamSize`: number ≥ 1
- `useCase`: one of "coding", "writing", "data", "research", "mixed"

**Output**:
```json
{
  "id": "nanoid",
  "publicId": "12-char-nanoid",
  "input": { "...": "" },
  "recommendations": [
    {
      "type": "downgrade",
      "toolId": "cursor",
      "currentPlan": "business",
      "currentSpend": 80,
      "recommendedAction": "Switch to Pro plan at $20/user/month",
      "reasoning": "Business adds centralized billing...",
      "monthlySavings": 40,
      "yearlySavings": 480
    }
  ],
  "totalMonthlySavings": 40,
  "totalYearlySavings": 480,
  "summary": "",
  "createdAt": "2026-05-08T00:00:00.000Z"
}
```

**Errors**: 400 (validation), 500 (server error)

---

### POST /lead

**Status**: 📋 Planned

**Purpose**: Capture optional lead information after audit

**Input**:
- email (required)
- company name (optional)
- role (optional)
- team size (optional)
- auditId (required)

---

### GET /report/:publicId

**Status**: 📋 Planned

**Purpose**: Retrieve public audit report (no PII)

**Output**:
- sanitized audit data
- recommendations
- savings information

---

# API Rules

- Validate all input with Zod
- Return consistent response structures
- Never expose sensitive lead data in public routes
- Controllers handle logic, routes handle HTTP
