# User Interviews

## Interview 1: Prabodh Tiwari

**Role:** Engineering Manager at Liminal (blockchain security & custody — serves like CoinSwitch)
**When:** DM on slack, ~12 minute call

Prabodh uses ChatGPT, Claude, and GitHub Copilot regularly. He also decides what tools his team adopts.

> "Not exactly, probably more than my use case."

When I asked if he knew how much he was spending, he laughed and admitted he doesn't track it. He pays the monthly bill and moves on. He guessed around $200-300/month but wasn't sure. This surprised me — an engineering manager at a startup, watching every dollar, and AI spend is just invisible.

> "Yes, but only if the savings are meaningful and switching is easy."

He said he'd act on savings but there's a threshold. $20/month? Not worth the email chain. $200/month? That's real money. The friction of switching tools (notifications, onboarding, permissions) is the real blocker, not the price itself.

> "Clear privacy guarantees — I don't want some random tool reading my company's billing data."

His biggest concern wasn't accuracy, it was trust. He asked if CostPilot could see or store his actual usage data. When I told him the audit is input-only (you type the numbers, nothing connects to your accounts), he relaxed.

**Most surprising:** He had never once looked at his AI tool line items together. Each bill came separately (Cursor emails him, Copilot is on GitHub billing, Claude is separate), so the total was invisible. He said "I'd need a spreadsheet to even add them up" — and he's not wrong.

**What it changed:** I added the "No login required" badge more prominently on the landing page. Prabodh's trust concern was real — if you ask for email first, you've already lost credibility. The value needs to come first, then the ask.

---

## Interview 2: Saurabh Singh

**Role:** College student, preparing for government exams + learning Python
**When:** In-person conversation, ~15 minutes

Saurabh uses ChatGPT Go (the free tier equivalent) and sometimes Gemini. He got access through his college email, which gives him a year of the paid tier for free.

> "It's free because I have a college ID. Otherwise I wouldn't pay for it."

He knew exactly how much ChatGPT Go costs ($20 USD equivalent) but only because the app shows the price as "free for you." When I asked what he'd do when the college period expires, he said he'd probably stop using it or find another free alternative. A paying customer who only stays because it's free — that's a common pattern I hadn't considered.

> "I tried DeepSeek because it was open source and had higher rate limits, and the API pricing is very cheap."

He mentioned switching between ChatGPT, DeepSeek, and Gemini without me prompting. He evaluates tools based on what's free and what gives the most usage — price is his #1 factor, even above output quality. For students, every dollar matters.

> "The website is too green, why did you use this theme?"

This was unprompted feedback. He found the emerald color scheme overwhelming. He said it felt "too flashy" for something that's supposed to be a serious financial tool looking like monster energy drink.

> "I just audit anonymously, no private info needed. Other websites sell your data or get breached."

When I asked about trust, he said the anonymous nature of CostPilot was the selling point. No login, no email — he doesn't have to worry about data leaks. Coming from someone who uses free tools, privacy wasn't just nice-to-have — it was the reason he agreed to try it.

**Most surprising:** He didn't understand the audit form at first. He asked "what is a seat?" and didn't know the difference between "plan" and "monthly spend." He's a power user of AI tools but the pricing terminology was completely foreign. Makes sense — he's never paid for one.

**What it changed:** The green theme feedback stuck with me. I had chosen it to feel fresh and modern, but if it gives off "flashy" vibes that's not the right first impression for a financial tool. I will toned down the saturation and added more neutral colors to balance it out.

---

## Interview 3: Suraj Das

**Role:** Senior Platform Engineer at Liminal (same company as Prabodh)
**When:** Conversation over DM, ~10 minutes

Suraj works on the platform team and uses AI tools for infrastructure code, debugging, and occasional scripting. Unlike Prabodh who manages the budget, Suraj is hands-on with the tools every day.

> "I think this is great for a first version, but honestly, no one wants to type all their spend manually."

He liked the audit concept but pushed hard on the manual input problem. He said people will get their numbers wrong, forget tools, or just not finish the form. Fair point — I've seen users abandon the audit form halfway through during testing.

> "What if you could connect their API keys? But here's the thing — no one will believe you when you say you encrypt it."

He immediately spotted the trust paradox. Even with encryption, people won't hand over API keys to an unknown tool. His suggestion was interesting — store them locally in the browser like a crypto wallet does with private keys. The data stays on the user's machine, the tool just reads usage. Nothing leaves the browser.

> "Actually aside from the audit, you could make this a long-term monitoring dashboard. Like a Mint for AI spend — track it monthly, not just once."

This was his bigger idea. Current CostPilot is a one-time checkup. He saw it as a dashboard you'd keep open — something that tells you when your spend changes. "People don't know they're overpaying next month just because they checked today."

**Most surprising:** The contrast with Prabodh was striking. Same company, same tools. Prabodh wanted privacy and anonymity — "don't connect to anything." Suraj wanted automation and live data — "connect to everything, just keep it local." Two valid but opposite views from people who work together. There's no single answer.

**What it changed:** I realized the current model isn't wrong for an MVP — it's just one valid approach. But Suraj's insight about trends and monitoring stuck with me. The audit tells you where you are today. It doesn't tell you if you're getting worse next month. If I build this further, the next major feature should be automated usage tracking from API billing endpoints, stored client-side.

---
