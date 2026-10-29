# Seedling mocks

Static HTML mocks: the design reference and the **source of truth for the UI**. The Angular
components carry these pages' BEM classes verbatim, the e2e page objects locate by them, and the
visual baselines are captured from them.

Open `index.html` in a browser and resize the window: **720px** swaps the phone bottom nav for a
top bar, **1024px** opens the wider layouts.

## What's here

```text
index.html            launcher: one tile per page
app.js                the only script: icon sprite, scrolled top bar, bottom-chrome tracking
styles/tokens.css     the mocks' design tokens (mirrors the theme in frontend/projects/components/src/lib/tokens)
styles/app.css        everything else, in @layer order (reset → base → shell → layout → components → pages → utilities)
pages/_shell.html     the canonical skeleton every page copies (not a screen)
pages/<page>.html     one file per screen; `<page>.<state>.html` for a static state
images/               illustrated placeholders
emails/               transactional email templates (table-based, inline styles only)
assets/               shared assets
```

## Rules

- No `<style>` tags or `style=""` attributes: page CSS lives in `app.css`.
- Every page carries `<body data-page="<slug>" data-shell="app|bare">` and copies the shell regions
  from `pages/_shell.html`.
- Every control has an accessible name; state is ARIA (`aria-current`, `aria-pressed`, `aria-invalid`).
- A design change lands here first, then in the components, then in the visual baselines
  (`npm run baseline` from `e2e/`).
- Mocks are design artifacts: no tests are written for them.
