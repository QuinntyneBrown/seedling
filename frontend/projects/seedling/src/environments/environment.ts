/**
 * Runtime environment for the Angular app.
 *
 * `apiBaseUrl` points at the Seedling API. Override per environment via
 * `fileReplacements` in `angular.json`. In development the default is the
 * locally running API process; the production build swaps this file with
 * `environment.prod.ts` carrying the production origin.
 */
export const environment = {
  apiBaseUrl: 'http://localhost:5100',
  /** Dev-only `?state=` overrides for static screen states; compile-time false in production. */
  galleryRoutes: true,
};
