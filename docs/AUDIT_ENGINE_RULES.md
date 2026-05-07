# Audit Engine Rules

## Purpose

The audit engine analyzes AI tooling spend and generates optimization recommendations.

This is the core business logic of CostPilot.

---

# Important Principle

Audit recommendations must remain:
- deterministic
- explainable
- financially believable

Avoid:
- vague recommendations
- arbitrary suggestions
- unsupported assumptions

---

# Audit Goals

The engine should determine:
- incorrect plan selection
- overspending
- cheaper alternatives
- unnecessary enterprise plans
- savings opportunities

---

# Recommendation Philosophy

Recommendations should:
- prioritize realism
- remain conservative
- avoid exaggerated savings

If user spending is already reasonable:
- acknowledge that honestly

Do not invent fake optimization opportunities.

---

# AI Usage Rule

AI must NOT:
- calculate savings
- determine recommendations
- replace audit logic

AI is only used for personalized summary generation.

---

# Pricing Rules

All pricing data:
- must come from official sources
- must remain documented
- must remain traceable

---

# Explainability Rule

Every recommendation should include:
- estimated savings
- short reasoning
- recommendation type

Example:
- downgrade
- consolidation
- alternative tool
- credit optimization

---

# Important Philosophy

A finance-literate person should agree with the recommendation logic.