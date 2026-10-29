# Seedlings mocks

Static HTML mocks: the design reference and the **source of truth for the UI**. The Angular
components carry these pages' BEM classes verbatim, the e2e page objects locate by them, and the
visual baselines are captured from them.

They cover every screen in the Seedlings screen inventory (Entry, Account, Onboarding wizard,
Intake, Agent and approval, Dashboard and case, Settings, System states) and are styled with the
Seedlings brand guidelines v1.0 (`docs/assets/brand`): Fraunces headings, Figtree text, Forest,
Sprout and Mango on a Cream canvas, and the outlined logo files.

Open `index.html` in a browser and resize the window: **720px** swaps the phone bottom nav for a
top bar, **1024px** opens the roadmap panel beside wizard and intake steps and the wider layouts.

## What's here

```text
index.html            launcher: one tile per page, grouped and numbered as in the screen inventory
app.js                the only script: icon sprite, scrolled top bar, bottom-chrome tracking
styles/tokens.css     the mocks' design tokens: brand values under Fluent UI v9 role names
styles/app.css        everything else, in @layer order (reset → base → shell → layout → components → pages → utilities)
pages/_shell.html     the canonical skeleton every app page copies (not a screen)
pages/<page>.html     one file per screen; `<page>.<state>.html` for a static state
assets/               the logo, mark and app icon, copied from docs/assets/brand
images/               illustrated placeholders (not real photos; must not ship)
emails/               transactional email templates (table-based, inline styles only)
.check.mjs            static consistency check, no dependencies
.verify.mjs           Playwright: 5 widths, overflow walker, shell chrome, console errors
screenshots/          full-page captures, <slug>.<mobile|tablet|desktop>.png (390 / 820 / 1440)
```

## Screens

| Inventory | File(s) |
| --- | --- |
| S-01 Landing | `landing.html` |
| S-02, S-03, S-04, S-08 | Steps inside the wizard: `wizard.language.html`, `wizard.eligibility.html`, `wizard.result.html`, `wizard.children.html` |
| S-05 to S-07 Account | `sign-up.html`, `verify-code.html`, `sign-in.html` |
| W-01 to W-10 Onboarding wizard | `wizard.welcome`, `.language`, `.name`, `.children`, `.eligibility` (question 3 of 6), `.result`, `.contact`, `.consent`, `.roadmap`, `.done` |
| W-R Roadmap panel | On every wizard and intake page; a collapsed bar under 1024px. Shown alone in `system-states.html` |
| S-09 to S-18 Intake | `intake.consent`, `.parent-identity`, `.parent-address`, `.child-identity`, `.child-sin`, `.parent-sin`, `.existing-resp`, `.contact`, `.document-capture`, `.document-review` |
| S-19 to S-24 Agent and approval | `provider.html`, `form-review.html`, `plan.html`, `checkout.html`, `approve.html`, `submitted.html` |
| S-25 Dashboard | `dashboard.html` |
| S-26 Case detail | `case.html`, `case.attention.html` (needs-attention banner, paused timeline) |
| S-27 Report a life change | `life-change.html` |
| S-28 to S-30 Settings | `settings.html`, `billing.html`, `privacy.html` |
| C-01 Offline banner | `dashboard.offline.html`, and in `system-states.html` |
| C-02 Re-authenticate, C-03 Error | `system-states.html` |
| C-04 Empty dashboard | `dashboard.empty.html` |

Shells: Dashboard, case, life change, settings and system states use the **app** shell (top bar
from 720px, bottom nav below). Landing, account, wizard, intake and approval pages use the
**bare** shell with a flow header (logo plus "Finish later" or "Save and exit").

Sample family: Jordan Lee (parent), Maya (4) and Theo (1), Mississauga ON. The RESP provider
"Northfield Credit Union", the plan prices and the payment page are placeholders, not decisions.

## Rules

- No `<style>` tags or `style=""` attributes: page CSS lives in `app.css`.
- Every page carries `<body data-page="<slug>" data-shell="app|bare">` and copies the shell regions
  from `pages/_shell.html` (bare pages copy only the head region).
- Every control has an accessible name; state is ARIA (`aria-current`, `aria-pressed`,
  `aria-selected`, `aria-invalid`, `aria-current="step"` in the roadmap).
- Colours are read by role from `tokens.css`, never as hex in `app.css`. Sprout text only on Cream
  or White (4.6:1); amounts are Ink on Mango.
- A design change lands here first, then in the components, then in the visual baselines
  (`npm run baseline` from `e2e/`).
- Mocks are design artifacts: no tests are written for them.

## Running the checks

```sh
node docs/mocks/.check.mjs                # static consistency, under a second
node docs/mocks/.verify.mjs               # Chromium at 320 / 390 / 820 / 1440 / 1920
node docs/mocks/.verify.mjs --capture     # + full-page PNGs into screenshots/
```

`.verify.mjs` resolves Playwright from `e2e/node_modules` (run `npm ci` in `e2e/` once), or from
a global install via `NODE_PATH=$(npm root -g)`.

## Known drift

`styles/tokens.css` now carries the brand values. The product theme in
`frontend/projects/components/src/lib/tokens/` still holds the earlier green-on-white values and
must be brought in line by role before the components are built from these mocks.
