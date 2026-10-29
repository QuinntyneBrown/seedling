/*
 * Public API Surface of components
 *
 * The Seedling design system. Every reusable UI component lives in `lib/<name>/`
 * as `<name>.ts` + `<name>.html` + `<name>.scss` (+ `<name>.spec.ts`), keeps the
 * `sl-*` selector namespace, and is exported from here. The exported TypeScript
 * identifier drops the `Sl` prefix since the import path already says where it
 * came from. Every host element carries the mock's block class so one set of
 * e2e locators serves the mocks and the app.
 *
 * Add one `export * from` line per component below, grouped by kind (atoms,
 * forms, structure, shell), with its `Default` story and perf-test scenario
 * alongside. The Storybook contract test (e2e/storybook/catalog.spec.ts) reads
 * these exports and fails any component that has no story folder.
 */

// theme
export * from './lib/tokens/index';
