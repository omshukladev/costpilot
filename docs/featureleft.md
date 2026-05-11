# Feature Left

This file tracks what is still left to make the submission fully assignment-complete.

## 1. Required docs still missing

- `REFLECTION.md`
- `GTM.md`
- `ECONOMICS.md`
- `USER_INTERVIEWS.md`
- `METRICS.md`

## 2. Required docs that need expansion

- `DEVLOG.md` needs 7 day entries
- `README.md` needs screenshots or a 30-second screen recording link

## 3. Git history requirement

- Need at least 5 distinct commit days in the last 7 days

## 4. Bonus features not built

- Embeddable widget version
- Benchmark mode
- Referral codes
- Launch thread / blog post draft

### Completed bonus feature

- PDF export of the full report

## 5. Final submission checks

- Confirm CI stays green
- Confirm deployed frontend/backend URLs are reachable
- Confirm all pricing numbers still match official vendor sources
- Rotate any exposed secrets if needed


---

Use the **current stack** and keep this mostly additive.

| Feature | Best stack | Backend changes | Frontend changes | Routes |
|---|---|---:|---:|---:|
| **PDF export** | `@react-pdf/renderer` **or** print route + `window.print()` | **0** if client-side export | add `ReportPdf.tsx` / `ReportPrintView.tsx` + export button | **0 new route** if print-based, or **1 frontend route** like `/report/:publicId/print` |
| **Embeddable widget** | React + existing report API + iframe/embed snippet | **0-1** if you want a cleaner widget payload endpoint | add compact widget component + embed code panel | **1 new route** like `/widget/:publicId` |
| **Benchmark mode** | existing audit engine + deterministic comparison rules | **1 new route** if server-calculated, otherwise **0** if client-calculated | add benchmark section on results/report | **0-1 route** |

### Recommended implementation
1. **PDF export**
   - Best in frontend.
   - Add a printable report view or a dedicated PDF component.
   - No backend package needed.
   - If you want actual PDF download, use `@react-pdf/renderer` in frontend.

2. **Embeddable widget**
   - Add a lightweight read-only route, e.g. `/widget/:publicId`.
   - Reuse the report API data.
   - Add an embed snippet copy block on `/report/:publicId`.

3. **Benchmark mode**
   - Add a comparison layer that says things like:
     - team size vs similar teams
     - spend per developer vs reference band
     - optimization score vs cohort
   - This can be computed from existing audit data.
   - If you want it reusable across pages, add a backend endpoint like `/benchmark`.

### Package count
- **Backend:** ideally **0 new packages**
- **Frontend:** **1 new package max** if doing real PDF export:
  - `@react-pdf/renderer`  
  Otherwise **0**
- If you choose print-based export, you may need **no new packages at all**

### Where to add files
- `apps/costpilot-web/src/features/report/`
  - `components/ReportPdf.tsx`
  - `components/ReportPrintView.tsx`
  - `components/EmbedWidget.tsx`
  - `components/BenchmarkSection.tsx`
- `apps/costpilot-web/src/features/report/pages/ReportPage.tsx`
  - add export / embed CTA
- `apps/costpilot-web/src/features/results/components/ResultsView.tsx`
  - add benchmark preview
- `apps/costpilot-web/src/app/router.tsx`
  - add `/widget/:publicId` or `/report/:publicId/print`
- `apps/costpilot-api/src/routes/`
  - only if you want `/benchmark` or a widget-specific payload route

### My recommendation
For this repo, do it like this:
- **PDF export:** frontend-only
- **Widget:** 1 frontend route
- **Benchmark mode:** frontend first, backend only if needed

That keeps the architecture clean and avoids unnecessary Worker complexity.
