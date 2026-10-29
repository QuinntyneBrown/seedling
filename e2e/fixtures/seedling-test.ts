/**
 * The Seedling test fixture.
 *
 * Wraps `@playwright/test`'s `test` with:
 *   - `goto(routeKey, opts?)`: navigates to the right URL for whichever target
 *     we're hitting (mocks vs Angular) and, in app mode, signs in first when
 *     the route is guarded (pass `{ anonymous: true }` to skip).
 *   - `pages`: namespaced page objects (e.g. `pages.home`); add one entry per
 *     screen as its page object lands under `pages/`.
 *   - `settle()`: wait for fonts and network idle so visual diffs are stable.
 *
 * Specs import `test` and `expect` from this file, not from
 * `@playwright/test` directly, so the routing wiring is consistent.
 */

import { test as base, expect, type TestInfo } from '@playwright/test';

import { guardFor, isBaseline, pathFor, type RouteKey } from './routes.js';

export interface GotoOptions {
  /** Skip the automatic sign-in even for a guarded route. */
  readonly anonymous?: boolean;
}

export type Pages = Record<string, never>;

interface SeedlingFixtures {
  goto: (key: RouteKey, opts?: GotoOptions) => Promise<void>;
  pages: Pages;
  settle: () => Promise<void>;
}

/** Bottom navigation below 720px; top bar at and above. */
export function isPhone(testInfo: TestInfo): boolean {
  return (testInfo.project.use.viewport?.width ?? 1440) < 720;
}

export const test = base.extend<SeedlingFixtures>({
  goto: async ({ page }, use) => {
    await use(async (key, opts = {}) => {
      const guard = guardFor(key);
      if (guard && !isBaseline() && !opts.anonymous) {
        // Sign in through the API and seed the session before navigating
        // (fixtures/auth.ts, once the Auth feature lands).
      }
      await page.goto(pathFor(key));
    });
  },
  pages: async ({ page }, use) => {
    void page;
    await use({});
  },
  settle: async ({ page }, use) => {
    await use(async () => {
      await page.evaluate(() => document.fonts.ready);
      await page.waitForLoadState('networkidle');
    });
  },
});

export { expect };
