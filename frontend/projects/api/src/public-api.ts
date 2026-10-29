/*
 * Public API Surface of api
 *
 * Two kinds of exports live here:
 *
 *   1. CONTRACTS — interfaces + injection tokens (one pair per service).
 *      Pages depend ONLY on these. They define WHAT a service does without
 *      committing to HOW.
 *
 *   2. IMPLEMENTATIONS — concrete classes that satisfy the contracts. The
 *      host application wires `{ provide: TOKEN, useExisting: ConcreteClass }`
 *      in its composition root (`app.config.ts`); consumers never import the
 *      classes directly.
 *
 * View models live in `lib/models/` (one type per file, grouped behind
 * per-screen barrels). DTO files (`*.dto.ts`) are service-internal and not
 * exported. Guards and interceptors live in `lib/auth/`; pure helpers in
 * `lib/api/`; test doubles in `lib/testing/`. Keep SERVICE_API.md current.
 */

// api
export * from './lib/api/api-base-url';
