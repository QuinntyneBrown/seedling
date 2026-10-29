# Visual specs

`<screen>.visual.spec.ts` compares the Angular implementation to `docs/mocks` region by region
with `toHaveScreenshot()`. Baselines are captured from the mocks with `npm run baseline`
(`SL_BASELINE=1`) and committed under `<spec>.spec.ts-snapshots/`; the verify run compares the app
against them. Mask dated and data-driven regions; fix failures in the components, never by
loosening the thresholds.
