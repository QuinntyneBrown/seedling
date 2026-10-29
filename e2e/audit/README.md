# Responsive audit

`*.audit.spec.ts` files run under `playwright.audit.config.ts` at five widths (320, 390, 820, 1440,
1920) and assert there is no horizontal overflow and every landmark is present, writing raw
screenshots to `audit-output/` (gitignored). `npm run audit` for the app, `npm run audit:mocks`
for the mocks.
