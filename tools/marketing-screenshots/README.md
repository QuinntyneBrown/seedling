# Marketing screenshots

Captures the images on the marketing site from the real app, so the page never shows a mock-up:
phone screens at 390x844 (2x), a desktop screen at 1440x900 for the hero, and the 1200x630 Open
Graph social card. Put `capture.mjs` here, driven by Playwright from `e2e/node_modules`, reading
`SL_APP_URL`, `SL_API_URL`, `SL_DEMO_EMAIL` and `SL_DEMO_PASSWORD` (defaults: `http://localhost:4200`,
`http://localhost:5100` and the seeded demo account).
