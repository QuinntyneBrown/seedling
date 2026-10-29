import { defineConfig, devices } from '@playwright/test';

/**
 * Responsive-audit configuration: five viewports (xsmall → xlarge).
 *
 * Separate from `playwright.config.ts` on purpose: the main config's three
 * projects name the committed visual baselines, so adding projects there
 * would break `test:visual`. This config drives `audit/*.audit.spec.ts`,
 * which take raw `page.screenshot()` captures into `audit-output/`
 * (gitignored) and run measurement-based overflow assertions; no snapshot
 * files at all.
 *
 * Same two-server switch as the main config: the Angular dev server on
 * :4200 by default, the mocks on :5173 with SL_BASELINE=1.
 */

const AUDIT_VIEWPORTS = {
  xsmall: { width: 320, height: 568 },
  small: { width: 390, height: 844 },
  medium: { width: 820, height: 1180 },
  large: { width: 1440, height: 900 },
  xlarge: { width: 1920, height: 1080 },
} as const;

const isBaselineCapture = process.env['SL_BASELINE'] === '1';

export default defineConfig({
  testDir: './audit',
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [['list']],
  forbidOnly: !!process.env['CI'],
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: isBaselineCapture ? 'http://localhost:5173' : 'http://localhost:4200',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  webServer: isBaselineCapture
    ? {
        command: 'npx http-server ../docs/mocks -p 5173 -c-1 --cors --silent',
        url: 'http://localhost:5173/index.html',
        reuseExistingServer: !process.env['CI'],
        timeout: 30_000,
        cwd: __dirname,
      }
    : {
        command: 'npm run start -- --port 4200',
        url: 'http://localhost:4200',
        reuseExistingServer: !process.env['CI'],
        timeout: 180_000,
        cwd: `${__dirname}/../frontend`,
      },
  projects: (Object.keys(AUDIT_VIEWPORTS) as Array<keyof typeof AUDIT_VIEWPORTS>).map((name) => ({
    name,
    use: { ...devices['Desktop Chrome'], viewport: AUDIT_VIEWPORTS[name] },
  })),
});

export { AUDIT_VIEWPORTS };
