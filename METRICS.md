# Metrics Framework

## North Star Metric

**Audits Completed with >$250/month Savings Identified**

Why this metric?

1. **Measures real business value** — Not vanity metrics like "sign-ups" or "page views." Measures actual users who found actionable savings.

2. **Aligns with Credex incentive** — High-savings audits are high-intent consultations. An audit with $250+/month savings is 10x more likely to convert to a Credex consultation than a low-savings audit.

3. **Filters for quality** — Many users run audits but see zero savings (already optimal). This metric counts only the ones where CostPilot provided real value.

4. **One number, simple to track** — Easy to instrument, easy to understand in standup/board meetings.

5. **Proxy for NPS/satisfaction** — Users who find savings tell others. Users who find nothing don't. So this metric inherently captures organic growth potential.

---

## Three Input Metrics That Drive the North Star

### Input Metric 1: Audit Completion Rate
**Definition:** (Audits completed) / (Audits started)

**Current:** Unknown (need instrumentation)

**Target:** 40-50% (industry benchmark for multi-step forms is 30-50%)

**Why it matters:** If only 10% of people who open the form finish, we're failing at UX or confusing people. If 50%+ complete, form flow is solid.

**How to improve:**
- Reduce form complexity (drag-and-drop tools instead of dropdowns?)
- Auto-calculate spend based on plan + seats (already doing this ✅)
- Add progress bar to show "you're 2 of 4 steps done"
- Add error messaging on invalid numbers (min/max guardrails)

---

### Input Metric 2: High-Savings Audit Rate
**Definition:** (Audits with >$250/month savings) / (Total audits completed)

**Current:** Unknown (need instrumentation)

**Target:** 30-40% (based on GTM/ECONOMICS assumptions)

**Why it matters:** If only 5% of audits find savings, either:
- People are already optimized (good, but limits market)
- Our audit engine is too conservative (missing opportunities)
- Our targeting is wrong (attracting already-optimal users)

**How to improve:**
- Target teams with 3+ tools (more overlap = more savings)
- Target enterprises/agencies (larger teams = higher spend)
- Improve alternative-tool recommendations (already tuned ✅)
- Better messaging: "Find savings in your AI tool stack" (not "see what you're paying")

---

### Input Metric 3: Lead Capture Rate (of High-Savings Audits)
**Definition:** (Emails captured) / (High-savings audits completed)

**Current:** Unknown (need instrumentation)

**Target:** 30-50% (assignment says email is optional; most won't give email, but high-value ones will)

**Why it matters:** High-savings audits that don't capture email are lost leads for Credex. This metric tells us how many of our best leads we're actually capturing.

**How to improve:**
- Add urgency: "Book a Credex consultation to lock in these savings" (already doing ✅)
- Make email optional for report, required for consultation CTA
- Show "X founders already booked consultations from savings like yours"
- Add friction: require email for PDF download (or offer as bonus)
- Timing: ask for email after 10 seconds on results page (when emotion is highest)

---

## What You'd Instrument First (Priority Order)

### Week 1 (Critical Path)
1. **Audit start event** — log when user arrives at `/audit` form
2. **Tool added event** — log each time user adds a tool (shows engagement)
3. **Audit submitted event** — log when form is POST'd
4. **Audit result event** — log with `{ savingsAmount, recommendationCount, primaryRecommendationType }`
5. **Email captured event** — log when user submits email

**Why:** These 5 events give you the full funnel: arrival → engagement → completion → value → capture

### Week 2 (Nice to Have)
6. **Form abandonment event** — log when user leaves `/audit` without completing
7. **Plan selected event** — track which plans are most commonly chosen (shows user preferences)
8. **Share report event** — log when user copies public report URL
9. **Consultation booked event** — log when email leads to Credex consultation (requires Credex integration)

### Week 3+ (Optimization)
10. **Session duration** — time spent on audit form (if too long, UX is confusing)
11. **Device/browser** — which devices complete audits? (mobile UX issue?)
12. **Traffic source** — where are users coming from? (IH? Reddit? Direct?)

---

## How to Instrument (Recommended Stack)

**Option 1 (Simple): Google Analytics 4**
- Free, already know it, easy to set up event tracking
- Works: track events + funnels, segment by source/device
- Limitation: no custom cohorts easily, data is shared with Google

**Option 2 (Better): Segment (free tier)**
- Routes events to multiple destinations (GA4, Mixpanel, Amplitude, etc.)
- Future-proof: if you switch analytics platforms, code doesn't change
- $120+/month paid tier, but free tier is generous for MVP

**Option 3 (Enterprise): Amplitude or Mixpanel**
- Better retention/cohort analysis
- Overkill for MVP, but great if you scale

**Recommendation:** Use **Google Analytics 4 for now** (you already have it). Add event tracking:

```typescript
// On audit form submit
gtag('event', 'audit_submitted', {
  savings_amount: result.totalMonthlySavings,
  recommendation_count: result.recommendations.length,
  tool_count: auditInput.tools.length,
});

// On email captured
gtag('event', 'lead_captured', {
  savings_amount: result.totalMonthlySavings,
  high_savings: result.totalMonthlySavings > 250,
});
```

---

## What Number Triggers a Pivot Decision

### Pivot #1: Form Completion Rate Drops Below 20%
**Signal:** Audit completion rate <20% (vs. 40-50% target)

**Interpretation:** Form UX is broken or confusing

**Action:** 
- Session recording (Hotjar/LogRocket) to watch users fail
- A/B test form layout (split-screen vs. stacked)
- Simplify to 3 questions: "Team size?", "Which tools?", "Monthly spend?"
- Remove non-essential fields

---

### Pivot #2: High-Savings Audit Rate Drops Below 15%
**Signal:** Only 15% of audits find >$250/month savings (vs. 30-40% target)

**Interpretation:** Either targeting is wrong, or audit engine is too conservative

**Action:**
- Target different persona: large teams (20+) instead of 5-10 person startups
- OR: Target high-tool-count users (3+ tools) instead of generic startups
- OR: Loosen "savings" definition (count $100+/month instead of $250+)
- OR: Improve alternative-tool recommendations (more aggressive cross-tool suggestions)

---

### Pivot #3: Lead Capture Rate <10% (of High-Savings Audits)
**Signal:** Users find $500+/month savings but don't give email

**Interpretation:** Call-to-action is weak or untrusted

**Action:**
- Test different CTA copy: "Book a Credex consultation" vs. "Get started" vs. "Save 40% with credits"
- Add social proof: "500+ founders have already booked"
- Add friction: require email to download PDF report
- Test timing: ask for email immediately vs. after 30 seconds vs. via exit popup

---

### Pivot #4: Credex Consultation Conversion <5% (of Emails Captured)
**Signal:** We capture emails but consultations don't book

**Interpretation:** Either email follow-up is weak, or product isn't compelling

**Action:**
- Add automated follow-up sequence (Resend): day 1, day 3, day 7
- Template: "We found $X/month in savings for [Tool]. Here's how to book your savings consultation."
- Add urgency: "Slots fill up Thursdays — book your consultation this week"
- OR: Credex sales team needs to call users directly (not email)

---

### Pivot #5: Public Report Share Rate <5%
**Signal:** Users don't share audits via public links

**Interpretation:** Either report isn't shareable/impressive, or sharing is friction

**Action:**
- Add "Share on X" / "Share on LinkedIn" buttons with pre-filled text
- Add share button to hero (not just footer)
- Test different report framing: "Audit Results" vs. "We Found $5k/Year in Savings"
- Add visual: screenshot/OG image that shows savings prominently

---

## Current Instrumentation Gaps

**What we DON'T know yet:**
- How many audits start vs. complete? (need event)
- What % of audits find savings? (need event)
- How many of those high-savings audits capture email? (need event)
- What's the time-to-completion for the form? (need duration tracking)
- Which tools get selected most often? (need event)
- Where are users coming from? (need UTM tracking)

**By end of week:** Add 5 core events to GA4, then run 10 test audits through the form. You'll have Week 1 baseline data.
