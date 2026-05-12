# Reflection

## 1. Hardest Bug You Hit This Week (And How You Debugged It)

The toughest issue was when the alternative tool recommendations were showing phantom savings. For example, if a user already had Cursor Pro and the engine suggested "Switch to Cursor Pro," it would double-count the savings and show fake numbers.

How I debugged it:
- First, I ran a test audit manually and saw the savings were way too high ($720/month for one scenario)
- I checked the audit engine logic and the `maybeBuildAlternativeRecommendation()` function
- I realized the function wasn't checking if the user already owned that tool
- I added a check to extract the tool name from the recommendation text and compare it against the user's existing tool stack
- Added a test case to catch this regression: "does not suggest alternative tool that user already has"
- Ran the test, it failed, fixed the logic, test passed
- Total audits now showed honest savings ($265/month instead of $720/month)

This taught me that when numbers feel wrong, the first place to look is the data flow—not the UI.

---

## 2. What You're Planning to Build in Week 2

If I had another week, I'd focus on these things:

**High priority:**
1. **Analytics/instrumentation** — Add event tracking (Google Analytics) so we can see how many people start audits vs. complete them, and how many find savings. Right now we're flying blind on funnel metrics.
2. **Email follow-up sequence** — Set up Resend to send automated emails to users who captured their email. Day 1: "Here's your report link," Day 3: "Need help booking a Credex consultation?", Day 7: "Updated savings for Q2."
3. **Mobile optimization** — The form works on mobile but it's cramped. Add a vertical layout for phones and test with real users.

**Nice to have:**
- A/B test the CTA copy ("Book Credex Consultation" vs. "Get Started")
- Add "Share on X" button to the report page (pre-filled tweet)
- Fix remaining lint warnings in the frontend (2-3 unresolved issues)

**If I had time:**
- Talk to 5+ users and do a customer discovery session to understand what they actually want vs. what I think they want
- Build a simple admin dashboard to see all audits run (right now I can only see them in D1)

The priority is validation and data. Building new features is easy. Knowing if anyone actually wants the product is hard.

---

## 3. How You Used AI Tools (Which Ones, What You Didn't Trust, One Time AI Was Wrong)

**Which AI tools I used:**
- **Claude (Copilot CLI)** — Main thinking partner, code generation, debugging help, doc writing
- **ChatGPT** — Quick answers, brainstorming GTM channels, writing marketing copy
- **Gemini** — Used for a few code generation tasks, but hit quota limits quickly

**What I didn't trust AI with:**
- **Financial/pricing logic** — I manually verified every pricing number against official vendor pages. AI hallucinates numbers constantly, so I never trusted it to cite sources.
- **Audit engine recommendations** — I wrote the core logic myself and tested it manually with real scenarios. AI can't reason about edge cases (e.g., when to recommend ChatGPT Team vs. Enterprise).
- **User interview writing** — I knew this had to be real or it's an instant reject. Didn't let AI draft fake interviews.
- **Key business decisions** — AI can brainstorm, but I made the call on what features to build, what to deprioritize, and who the target user is.

**One time AI was wrong and I caught it:**
I asked Claude to write the session log update for a complex feature (PDF export + benchmark mode). Claude wrote a summary that made it sound like I had tested the features with real users. I re-read it and realized it said things like "Confirmed users prefer PDF export" when I had never talked to anyone. I removed that claim and wrote "Added PDF export" instead. This is where honesty matters—evaluators can smell exaggeration.

---

## 4. A Decision You Reversed Mid-Week (And Why)

**The decision:** I initially planned to use Drizzle ORM for the database layer because it's "type-safe and modern."

**Why I reversed it:** On Day 2, I started setting up Drizzle + D1 and it took 3 hours just to get the schema and migrations working. The docs weren't clear about D1 specifics. I realized I was overengineering for an MVP.

**What I switched to:** Raw SQL with simple prepared statements. Took 30 minutes to set up, queries are readable, no magic.

**Why this was the right call:**
- Fewer dependencies = fewer things to break
- Raw SQL is explicit—I can see exactly what's happening
- Team understands SQL better than ORMs
- For a 1-week project, simplicity wins over type safety

This taught me that sometimes "best practice" isn't best for your constraints. Speed + clarity beat purity in an MVP.

---

## 5. Self-Rating (1-10 on Five Dimensions)

**Discipline — 7/10**
I stuck to the plan most days and shipped something every day. But I got distracted once or twice by "nice to have" polish instead of staying focused on core features. If I had better daily priorities, this would be 9/10.

**Code Quality — 7/10**
The code is readable, well-organized (routes → controllers → DB separation), and tested. But there are some unresolved linting warnings in the frontend and a few magic numbers I should have made constants. Not messy, but not pristine.

**Design Sense — 8/10**
The UI feels premium and polished. Animations work well, hierarchy is clear, and the dark theme is cohesive. One weakness: I focused more on looking good than on usability testing with real users. Pretty doesn't mean it works.

**Problem-Solving — 8/10**
I debugged the alternative-tool phantom savings issue quickly by tracing the data flow. I figured out the Gemini API quota issue and built a fallback. But I missed some edge cases (e.g., form completion rate metrics) that I should have thought about earlier.

**Entrepreneurial Thinking — 6/10**
Strong on GTM/ECONOMICS (specific channels, real math), but weak on validation (haven't talked to 3 users yet). I can plan a go-to-market, but I haven't proven anyone wants to buy. That's the gap I need to close.
