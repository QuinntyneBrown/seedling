<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/brand/seedlings-mark-dark.svg">
    <img src="docs/assets/brand/seedlings-mark-light.svg" alt="Seedlings logo" width="128" height="128">
  </picture>
</p>

<h1 align="center">Seedling</h1>

<p align="center">
  <strong>A full-stack web application platform.</strong><br>
  An Angular progressive web app with its own design system, a .NET 10 API, AI agents on
  Microsoft Foundry, and an Azure stack that provisions itself on every push.
</p>

<p align="center">
  <a href="https://github.com/QuinntyneBrown/seedling/actions/workflows/ci.yml"><img src="https://github.com/QuinntyneBrown/seedling/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
  <a href="https://github.com/QuinntyneBrown/seedling/actions/workflows/deploy.yml"><img src="https://github.com/QuinntyneBrown/seedling/actions/workflows/deploy.yml/badge.svg?branch=main" alt="Deploy"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4.svg" alt=".NET 10">
  <img src="https://img.shields.io/badge/Angular-21-DD0031.svg" alt="Angular 21">
  <img src="https://img.shields.io/badge/PWA-ready-5A0FC8.svg" alt="PWA">
  <img src="https://img.shields.io/badge/Playwright-e2e-2EAD33.svg" alt="Playwright">
  <img src="https://img.shields.io/badge/Azure-hosted-0078D4.svg" alt="Azure">
</p>

<p align="center">
  <a href="#overview">Overview</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#development">Development</a> ·
  <a href="#testing">Testing</a> ·
  <a href="#deployment">Deployment</a> ·
  <a href="#documentation">Documentation</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

## Overview

Seedling is the starting point for a production web application: everything a product needs
before its first feature, already decided, wired and tested.

- **Frontend**: one Angular workspace holding the progressive web app, an administration app, a
  shared `api` integration library and the `components` design-system library documented in
  Storybook.
- **Backend**: a .NET 10 Clean Architecture solution with an ASP.NET Core API, a packaged CLI for
  migrations and seeding, and a Worker for scheduled jobs.
- **AI**: agents that run on Claude in Microsoft Foundry, reached with the API's managed identity
  and bounded by run caps and a monthly spend cap.
- **Azure**: an idempotent Bicep template provisions the whole stack on every push to `main`, and
  GitHub Actions deploys through OpenID Connect with no stored deployment tokens.
- **Quality**: acceptance test-driven development, Playwright behaviour and visual tests against a
  static design reference, design-system contract tests, and a component performance test on
  every pull request.

The repository's conventions are written down once, in [AGENTS.md](AGENTS.md), and apply to
people and coding agents alike.

## Features

- **Progressive web app** - installable, served over HTTPS from Azure Static Web Apps, with an
  Angular service worker, a web manifest and offline support for cached routes.
- **Design system** - every UI component lives in the `components` library, built from
  Fluent UI v9-style design tokens generated from a TypeScript theme, and documented in a
  Storybook docsite with concepts, theme pages, per-component examples and whole-screen patterns.
- **Accessible, responsive shell** - a phone-first layout that adapts from 320 px to 1920 px, with
  ARIA-driven state, WCAG 2.2 AA contrast and keyboard support checked in the browser.
- **Authentication** - sign-up, sign-in, sign-out, email verification and password reset on local
  JWTs with revocable refresh tokens; endpoints require authentication by default.
- **Administration app** - a second Angular application on its own host, sharing the libraries
  and the sign-in, for operating the platform.
- **AI agents on Azure** - a Microsoft Foundry account and Claude deployment provisioned by the
  same template as the rest of the stack, called through the Microsoft Agent Framework, traced to
  Application Insights, and evaluated by a behaviour suite under `evals/`.
- **Scheduled work** - a Worker Service that runs as a container or as an App Service triggered
  WebJob published beside the API.
- **Operations** - Serilog and Application Insights, explicit EF Core migrations run from the
  pipeline, idempotent seed data, and a one-command fresh-stack script for local verification.
- **Static design reference** - the HTML mocks under `docs/mocks/` are the source of truth for the
  UI and the visual regression baselines.

## Getting started

### Prerequisites

- .NET SDK `10.0.101` or a compatible feature-band SDK, as pinned by `backend/global.json`
- SQL Server LocalDB or SQL Server Express to run the app locally (the tests need no database server)
- Node.js 22 and npm 10; the frontend workspace declares `npm@10.9.4`
- PowerShell 7 for the engineering scripts

### Quick start

The fastest way to run the whole application from a clean database is the fresh-stack script:

```powershell
pwsh ./eng/Start-FreshStack.ps1
```

The script:

1. packs and installs the local `Seedling.Cli` .NET tool;
2. resets and seeds the database through that freshly installed tool;
3. publishes the backend API;
4. builds the Angular frontend;
5. starts both processes and prints the frontend URL.

By default the API runs on `http://localhost:5100` (the Angular environment compiles that URL in)
and the frontend on `http://localhost:4200`.

### Manual setup

Install dependencies:

```powershell
cd frontend
npm ci

cd ../e2e
npm ci

cd ../backend
dotnet restore ./Seedling.sln
```

Prepare the database:

```powershell
cd backend
$env:SEEDLING_CONNECTION = "Server=(localdb)\MSSQLLocalDB;Database=Seedling;Trusted_Connection=True;TrustServerCertificate=True"

dotnet run --project ./src/Seedling.Cli -- migrate
dotnet run --project ./src/Seedling.Cli -- seed
```

Run the API:

```powershell
cd backend
dotnet run --project ./src/Seedling.Api --urls http://localhost:5100
```

Swagger is available at `http://localhost:5100/swagger` in Development.

Run the Angular app:

```powershell
cd frontend
npm start            # the progressive web app on :4200
npm run start:admin  # the administration app on :4300
```

Run the design system:

```powershell
cd frontend
npm run storybook    # http://localhost:6006
```

Run the design reference (static mocks):

```powershell
cd e2e
npx http-server ../docs/mocks -p 5173 -c-1
```

## Architecture

| Area | Path | Notes |
| --- | --- | --- |
| Backend API | `backend/src/Seedling.Api` | ASP.NET Core controllers, middleware, auth wiring, Swagger |
| Application layer | `backend/src/Seedling.Application` | MediatR handlers, validators, domain services, DTO contracts |
| Domain layer | `backend/src/Seedling.Domain` | Entities and enums with no infrastructure dependency |
| Infrastructure | `backend/src/Seedling.Infrastructure` | EF Core, SQL Server persistence, migrations, external clients, auth services |
| CLI | `backend/src/Seedling.Cli` | `seedling migrate`, `seed` and `reset` as a packaged dotnet tool |
| Worker | `backend/src/Seedling.Worker` | Scheduled background work as a container or App Service WebJob |
| Angular app | `frontend/projects/seedling` | The routed progressive web app |
| Admin app | `frontend/projects/admin` | The administration application on its own host (`npm run start:admin`) |
| API library | `frontend/projects/api` | Client-side contracts, services, models, guards and interceptors |
| Component library | `frontend/projects/components` | The design system: every `sl-*` component, the token theme and the global styles |
| Design system docs | `frontend/projects/components/stories` | Storybook docsite: concepts, theme, components, patterns (`npm run storybook`) |
| Perf test | `frontend/projects/perf-test` | Component render-cost scenarios profiled from `e2e/perf-test` |
| E2E suite | `e2e` | Playwright behaviour, visual, Storybook contract and responsive audit tests |
| Design reference | `docs/mocks` | Static HTML/CSS design: the source of truth for the UI and the visual baselines |
| Infrastructure | `eng/infra` | Bicep for the whole Azure stack; `eng/foundry` for the Claude deployment |
| Agent evaluations | `evals` | Behaviour suites for the agents, run against the real Foundry deployment |

The backend follows a strict dependency direction: Domain ← Application ← Infrastructure ← Api,
Cli and Worker. The frontend applications depend on the `api` and `components` libraries through
path aliases; pages depend on service contracts and injection tokens, and the composition root
binds the implementations.

## Development

Common commands from the repository root:

```powershell
# Backend
dotnet build ./backend/Seedling.sln
dotnet test ./backend/Seedling.sln

# Frontend
cd frontend
npm run build -- seedling --configuration development
npm run build -- admin --configuration development
npm run build -- components
npm run build -- api
npm test
npm run lint          # angular-eslint (npm run lint:fix to autofix)
npm run format        # Prettier (npm run format:check in CI)
npm run tokens        # regenerate _tokens.scss + tokens.ts from the TypeScript theme (npm run tokens:check in CI)

# E2E
cd ../e2e
npm test
```

Development conventions (the full list is in [AGENTS.md](AGENTS.md)):

- Every Angular component is split into its own `.ts`, `.html` and `.scss` files. No inline
  templates or styles.
- Every design-system component lives in `frontend/projects/components` and has a story folder.
- Component selectors use `sl-*`; design tokens are read by role, never as hex values.
- Keep backend business rules in application handlers and domain services, not controllers.
- Keep EF migrations explicit; the API does not apply migrations on startup.
- Keep seed data idempotent and suitable for repeatable local resets.
- `npm ci` in `frontend/` installs a husky pre-commit hook that runs `eslint --fix` and
  `prettier --write` on staged frontend files; CI runs `npm run format:check` and `npm run lint`.
- Every feature starts with a requirement, a detailed design and a mock, and is implemented in
  thin slices with acceptance tests written first.

## Testing

| Suite | Command | Purpose |
| --- | --- | --- |
| Backend build | `dotnet build ./backend/Seedling.sln` | Compile API, application, infrastructure, CLI, worker and tests |
| Backend tests | `dotnet test ./backend/Seedling.sln` | Unit, integration, API and CLI tests; no database server needed |
| Backend tests, as CI | `pwsh ./eng/Test-Backend.ps1` | Builds once, runs the test assemblies side by side |
| SQL Server tests (opt-in) | `$env:SEEDLING_TEST_SQLSERVER = "localdb"`, then `dotnet test ./backend/Seedling.sln --filter Category=SqlServer` | Migration upgrade tests against a real server; skipped otherwise |
| API for Playwright | `pwsh ./eng/Start-E2eApi.ps1` | The API on :5100 over a fresh, seeded SQLite file |
| Angular builds | `npm run build -- seedling` and `npm run build -- admin` from `frontend/` | Production builds of both applications |
| Angular libraries | `npm run build -- components` and `npm run build -- api` | Build the shared libraries |
| Frontend unit tests | `npm test` from `frontend/` | Angular/Vitest tests |
| Storybook | `npm run storybook` / `npm run build-storybook` from `frontend/` | Design-system docsite on :6006 / static build to `frontend/dist/storybook` |
| Storybook contract tests | Build Storybook, then `npm run test:storybook` from `e2e/` | Every public component has a default example and docs, every example renders in Chromium |
| Frontend lint | `npm run lint` from `frontend/` | angular-eslint over TypeScript and templates |
| Frontend format | `npm run format:check` from `frontend/` | Prettier formatting check |
| Design tokens | `npm run tokens:check` from `frontend/` | Generated token files match the TypeScript theme |
| Playwright behaviour | `npm run test:behavior` from `e2e/` | End-to-end behaviour tests |
| Playwright visual | `npm run test:visual` from `e2e/` | Visual comparisons against the mock baselines |
| Baseline update | `npm run baseline` from `e2e/` | Refresh visual snapshots from the mocks |
| Responsive audit | `npm run audit` from `e2e/` | Overflow and layout checks at five widths |
| Perf test | `npx ng build perf-test` from `frontend/`, then `npm run perf-test` from `e2e/` | Component render cost under the CPU profiler, compared against the base branch on pull requests |

### Tests without a database server

The backend tests run on in-memory SQLite: each API test fixture and each Infrastructure
persistence fixture owns a private database, so `dotnet test` works on a clean machine and CI runs
on Linux with no LocalDB. Tests of SQL Server-only behaviour are skipped unless
`SEEDLING_TEST_SQLSERVER` is set.

Playwright needs the API on :5100 with the seeded accounts:

```powershell
pwsh ./eng/Start-E2eApi.ps1        # -Build to build the backend first
cd e2e
npm test
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`:

1. **Test gates** - the backend suite and the frontend lint, unit tests and production builds.
2. **Provision** - `eng/infra/main.bicep` converges the resource group: a Linux App Service plan
   and the API Web App, Azure SQL, Static Web Apps for the app, the admin app and the design
   system, the Microsoft Foundry account with the Claude deployment, Log Analytics + Application
   Insights, and a monthly budget. Missing resources are created; existing ones are left alone.
3. **API + WebJobs** - publishes the API and the CLI (as triggered WebJobs under
   `App_Data/jobs/triggered/`) into one zip and deploys it.
4. **Migrations** - `seedling migrate` from the runner, through a SQL firewall rule that exists
   only for the length of the job.
5. **Static Web Apps** - the app and the admin app, with deployment tokens read from Azure at run
   time rather than stored in GitHub.
6. **Smoke test** - the API answers and both SPAs serve a deep route.

The design system deploys from `deploy-storybook.yml` on changes to the components library.

### First-time setup

```powershell
az login
pwsh ./eng/Bootstrap-Azure.ps1 -OrganizationName "<legal name>" -BudgetAlertEmail you@example.com
```

The script creates the OpenID Connect app registration GitHub Actions signs in with, resolves the
application secrets, stores them as GitHub secrets and variables, shows a what-if, and runs the
first deployment.

GitHub Actions needs these **secrets**: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`,
`AZURE_SUBSCRIPTION_ID`, `SQL_ADMIN_LOGIN`, `SQL_ADMIN_PASSWORD`, `SEEDLING_JWT_SIGNING_KEY`; and
these **variables**: `AZURE_RESOURCE_SUFFIX`, `FOUNDRY_ORGANIZATION_NAME`, `FOUNDRY_COUNTRY_CODE`,
`APP_CUSTOM_DOMAIN`, `ADMIN_CUSTOM_DOMAIN`, `BUDGET_ALERT_EMAIL`, `AGENTS_ENABLED` and
`AGENTS_GRANT_ROLE`.

### Configuration

Every API setting is written by the template: the connection string, the signing key,
`Cors:AllowedOrigins`, the Application Insights connection string and the Foundry settings.
Change them in `eng/infra/main.bicep`, not in the portal. Tiers live in
`eng/infra/main.bicepparam`.

## Documentation

| Topic | Location |
| --- | --- |
| Agent and contributor guidance | [AGENTS.md](AGENTS.md) |
| Backend guide | [backend/README.md](backend/README.md) |
| Frontend guide | [frontend/README.md](frontend/README.md) |
| Requirements | [Level 1](docs/specs/L1.md) and [Level 2](docs/specs/L2.md) specifications in [docs/specs](docs/specs/) |
| Detailed designs | [docs/detailed-designs](docs/detailed-designs/) |
| Architecture decisions | [docs/adr](docs/adr/) |
| Design reference | [docs/mocks](docs/mocks/) |
| Extracted design system | [docs/design-system](docs/design-system/) |
| Estimates and roadmap | [docs/estimates](docs/estimates/) |
| Scheduled jobs | [backend/deploy/webjobs](backend/deploy/webjobs/) |
| Agent evaluations | [evals](evals/) |
| Perf test | [frontend/projects/perf-test](frontend/projects/perf-test/README.md) |
| Videos | [docs/videos](docs/videos/) |
| Changelog | [CHANGELOG.md](CHANGELOG.md) |

## Contributing

Contributions are welcome when they keep the platform useful, testable and aligned with the
architecture in [AGENTS.md](AGENTS.md). See [CONTRIBUTING.md](CONTRIBUTING.md) for the development
workflow, coding guidelines, test expectations and pull request checklist, and
[CONTRIBUTORS.md](CONTRIBUTORS.md) for the people who have contributed.

## Security

Do not report suspected security vulnerabilities in public issues. See [SECURITY.md](SECURITY.md)
for supported versions, private reporting guidance and the security-sensitive areas that require
extra review.

## Support

Use GitHub Issues for reproducible bugs, feature requests and documentation problems. See
[SUPPORT.md](SUPPORT.md) for the information to include in a good report.

## Code of Conduct

Participation in this project is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

Seedling is licensed under the [MIT License](LICENSE).
