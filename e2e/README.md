# e2e

The Playwright suites, Chromium only.

| Path                            | What it is                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `playwright.config.ts`          | Behaviour and visual specs: mobile / tablet / desktop projects plus `admin`     |
| `playwright.storybook.config.ts`| The design-system contract tests against `frontend/dist/storybook`              |
| `playwright.audit.config.ts`    | The responsive audit at five widths                                             |
| `fixtures/`                     | `seedling-test.ts` (the `test` every spec imports), `routes.ts`, servers        |
| `pages/`                        | Page Object Model: one `<screen>.page.ts` per screen, `admin/` for the admin app |
| `tests/`                        | `<feature>.spec.ts`; `visual/`, `admin/`, `regression/`                          |
| `storybook/catalog.spec.ts`     | Every public component has a `Default` story and docs; every example renders    |
| `perf-test/`                    | The Chromium profiling runner for `frontend/projects/perf-test`                 |
| `audit/`                        | `*.audit.spec.ts` overflow and landmark checks                                  |

```sh
npm ci
npx playwright install chromium          # once
pwsh ../eng/Start-E2eApi.ps1             # the API on :5100, seeded SQLite
npm test                                 # behaviour + visual
npm run test:behavior
npm run test:visual
npm run baseline                         # re-capture visual baselines from docs/mocks
npm run test:storybook                   # after `npm run build-storybook` in frontend/
npm run audit
npm run perf-test                        # after `npx ng build perf-test` in frontend/
```

Rules: tests state intent and page objects know the DOM (never a selector in a test); every
spec imports `test` and `expect` from `fixtures/seedling-test.ts`; every acceptance test carries a
`// Traces to: L2-NNN` comment.
