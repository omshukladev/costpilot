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
  "recommendations": [{ "type": "downgrade", "monthlySavings": 40, ... }],
  "totalMonthlySavings": 40,
  "totalYearlySavings": 480,
  "summary": "AI-generated or fallback text...",
  "summarySource": "deepseek",
  "createdAt": "2026-05-08T00:00:00.000Z"
}
```

**Errors**: 400 (validation), 500 (server error)

---

### POST /lead

**Status**: ✅ Built

**Purpose**: Capture lead information and send confirmation email

**Input**:
```json
{
  "email": "user@example.com",
  "companyName": "Acme Corp",
  "role": "CTO",
  "teamSize": 5,
  "auditId": "abc123..."
}
```

**Validation**:
- `email`: valid email format
- `companyName`, `role`, `teamSize`: optional
- `auditId`: required string

**Behavior**:
- Saves lead to D1 (`leads` table)
- Sends confirmation email via Resend from `noreply@metricflow.in`
- If RESEND_API_KEY not set, email is skipped (lead still saved)

**Errors**: 500 (server error)

---

### GET /report/:publicId

**Status**: ✅ Built

**Purpose**: Retrieve public audit report (no PII)

**Output**:
```json
{
  "publicId": "abc123...",
  "tools": [{ "toolId": "cursor", "plan": "pro", "monthlySpend": 20, "seats": 1 }],
  "recommendations": [...],
  "totalMonthlySavings": 0,
  "totalYearlySavings": 0,
  "summary": "...",
  "summarySource": "fallback",
  "createdAt": "2026-05-08T00:00:00.000Z"
}
```

**Notes**:
- No email, company name, or any PII returned
- 404 if publicId not found

---

# API Rules

- Validate all input with Zod
- Return consistent response structures
- Never expose sensitive lead data in public routes
- Controllers handle logic, routes handle HTTP
- Rate limited: 10 req/min per IP on POST /audit and POST /lead
