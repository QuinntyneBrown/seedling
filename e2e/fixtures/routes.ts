/**
 * Single source of truth for which URL serves each screen (and each static
 * screen *state*).
 *
 * - The Angular app uses its route table (`app.routes.ts`). Static states
 *   that the mocks render as separate files or `#state-*` specimens are
 *   reached through the dev-only `?state=` override (gated on
 *   `environment.galleryRoutes`, compile-time false in production).
 * - The mocks (`docs/mocks/pages/`) use `/pages/<name>.html`, with a
 *   `#state-<id>` fragment for stacked states.
 * - `guard` records which session a route needs in the Angular app, so the
 *   `goto` fixture can sign in automatically. Mock pages have no auth.
 *
 * Tests reference routes by key; the fixture rewrites to the right URL
 * depending on whether we're capturing baselines (SL_BASELINE=1) or
 * verifying the Angular implementation.
 */

export type RouteGuard = 'auth' | 'admin';

/** `body[data-page]` value every screen stamps (route data in the app). Extend as screens land. */
export type PageSlug = 'home' | 'sign-in' | 'admin';

export interface RouteEntry {
  readonly app: string;
  readonly mock?: string;
  readonly guard?: RouteGuard;
  readonly page: PageSlug;
}

export const ROUTES = {
  home: { app: '/', mock: '/index.html', page: 'home' },
} as const satisfies Record<string, RouteEntry>;

export type RouteKey = keyof typeof ROUTES;

export const isBaseline = (): boolean => process.env['SL_BASELINE'] === '1';

export function pathFor(key: RouteKey): string {
  const entry: RouteEntry = ROUTES[key];
  if (!isBaseline()) return entry.app;
  if (!entry.mock) throw new Error(`Route "${key}" has no mock; it cannot be captured as a baseline.`);
  return entry.mock;
}

export const guardFor = (key: RouteKey): RouteGuard | undefined => (ROUTES[key] as RouteEntry).guard;
