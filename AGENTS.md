## Project overview

Seedling is a full-stack web application platform. The frontend is an Angular progressive web app
built in an Angular workspace with a design-system component library; the backend is a .NET 10
Clean Architecture solution; everything is hosted on Azure, including the AI agents, which run on
Claude in Microsoft Foundry. Playwright covers behaviour and visual parity with the static design
reference, and Storybook documents the design system.

This file is the single source of guidance for every coding agent and contributor. `CLAUDE.md`,
`GEMINI.md` and `.github/copilot-instructions.md` point here and add nothing of their own.

See `README.md` for setup and development commands.

## Repository layout - mandatory

The folder structure below is a contract. New code goes in the folder named for it; do not invent
parallel folders, move projects, or add a second workspace. Folders marked `(scaffold)` exist today
with a README or `.gitkeep`; fill them in place.

```text
seedling/
├── .agents/skills/                     # Agent skills for non-Claude agents (identical copy of .claude/skills/)
├── .claude/skills/                     # Claude Code skills: creating-videos, engineering-requirements,
│                                       #   estimating-designs, extracting-design-systems, implementing-incrementally,
│                                       #   writing-feature-prompts, writing-software-design-documents
├── .github/
│   ├── ISSUE_TEMPLATE/                 # bug_report.md, feature_request.md, config.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── copilot-instructions.md         # points at AGENTS.md
│   └── workflows/                      # ci.yml, deploy.yml, deploy-storybook.yml, perf-test.yml
├── AGENTS.md                           # this file; CLAUDE.md and GEMINI.md point here
├── README.md · CONTRIBUTING.md · CONTRIBUTORS.md · CODE_OF_CONDUCT.md · SECURITY.md · SUPPORT.md · CHANGELOG.md · LICENSE
├── backend/                            # .NET 10 solution (Clean Architecture)
│   ├── Seedling.sln
│   ├── Directory.Build.props           # net10.0, nullable, implicit usings, warnings as errors
│   ├── Directory.Packages.props        # central package management (every version lives here)
│   ├── global.json                     # SDK pin
│   ├── README.md
│   ├── deploy/webjobs/<job>/           # run.sh + settings.job + README.md per App Service triggered WebJob
│   ├── src/
│   │   ├── Seedling.Domain/            # Entities/, Enums/ - no dependencies
│   │   ├── Seedling.Application/       # Abstractions/, Behaviors/, Common/, Exceptions/, <Feature>/
│   │   │                               #   MediatR commands, queries, handlers, validators, DTO contracts, IAppDbContext
│   │   ├── Seedling.Infrastructure/    # Persistence/ (AppDbContext, Configurations/), Migrations/, Authentication/,
│   │   │                               #   <Integration>/ (one folder per external system), DependencyInjection.cs
│   │   ├── Seedling.Api/               # Program.cs, Controllers/, Middleware/, Authentication/, appsettings*.json
│   │   ├── Seedling.Cli/               # Program.cs, Hosting/, Database/, Migrate/, Seed/, Reset/ (packaged dotnet tool)
│   │   └── Seedling.Worker/            # Program.cs, Dockerfile - scheduled background work
│   └── tests/
│       ├── Seedling.Application.Tests/ # pure unit tests on EF Core InMemory
│       ├── Seedling.Infrastructure.Tests/ # persistence on in-memory SQLite, integration contracts
│       ├── Seedling.Api.Tests/         # WebApplicationFactory end-to-end on in-memory SQLite (sequential)
│       └── Seedling.Cli.Tests/
├── frontend/                           # ONE Angular workspace: one package.json, one angular.json, one tsconfig.json
│   ├── angular.json · package.json · tsconfig.json · eslint.config.js · .prettierrc · .lintstagedrc.mjs · .husky/
│   ├── scripts/                        # generate-tokens.mjs - the design-token pipeline
│   └── projects/
│       ├── components/                 # LIBRARY - the design system. Every sl-* UI component lives here and nowhere else
│       │   ├── .storybook/             # main.ts, preview.ts, manager.ts, theme.ts, manager-head.html, storybook.scss, public/
│       │   ├── stories/src/
│       │   │   ├── Concepts/           # Introduction.mdx, Developer/{QuickStart,StylingComponents,Accessibility,WritingStories}.mdx
│       │   │   ├── Theme/              # Overview, Colors, Typography, Spacing, BorderRadii, Shadows, Motion, Layout (.mdx)
│       │   │   ├── <Component>/        # index.stories.ts, <Component><Story>.stories.ts, <Component>Description.md, <Component>BestPractices.md
│       │   │   └── Patterns/<Pattern>/ # whole-screen compositions of real components
│       │   └── src/
│       │       ├── public-api.ts       # the library's only entry point
│       │       └── lib/
│       │           ├── <component>/    # <component>.ts + <component>.html + <component>.scss + <component>.spec.ts
│       │           ├── styles/         # index.scss, _tokens.scss (generated), _breakpoints.scss, _global.scss
│       │           ├── tokens/         # TypeScript theme: global/, alias/, utils/, themes/, types.ts, themeToCss.ts
│       │           └── shared/         # helpers shared by several components
│       ├── api/                        # LIBRARY - backend integration: contracts + injection tokens, services, models, guards
│       │   ├── SERVICE_API.md          # the library's public API, kept current
│       │   └── src/{public-api.ts, lib/{api,auth,models,services,testing}/}
│       ├── seedling/                   # APPLICATION - the progressive web app
│       │   ├── ngsw-config.json        # service worker configuration
│       │   ├── public/                 # manifest.webmanifest, icons/, favicon, staticwebapp.config.json
│       │   └── src/
│       │       ├── main.ts · index.html · styles.scss
│       │       ├── app/{app.ts, app.html, app.config.ts, app.routes.ts}
│       │       ├── app/pages/<page>/   # <page>.page.ts + .html + .scss + .spec.ts - one folder per routed screen
│       │       ├── app/dialogs/<dialog>/ # CDK dialogs, same file split
│       │       ├── app/shell/          # chrome shared by every screen
│       │       ├── app/shared/         # page helpers, validators
│       │       └── environments/       # environment.ts, environment.prod.ts
│       ├── admin/                      # APPLICATION - the administration app, same layout as seedling/
│       └── perf-test/                  # APPLICATION - component render-cost scenarios (src/scenarios/<Component>.ts)
├── e2e/                                # Playwright (Chromium only)
│   ├── playwright.config.ts · playwright.storybook.config.ts · playwright.audit.config.ts · package.json · tsconfig.json
│   ├── fixtures/                       # test fixture (seedling-test.ts), routes.ts, auth.ts, servers
│   ├── pages/                          # Page Object Model - one <screen>.page.ts per screen; admin/ for the admin app
│   ├── tests/                          # <feature>.spec.ts; visual/ (parity with docs/mocks), admin/, regression/
│   ├── storybook/                      # catalog.spec.ts - the design-system contract tests
│   ├── perf-test/                      # the Chromium profiling runner and its config/
│   └── audit/                          # responsive audit at five widths
├── eng/                                # engineering scripts and infrastructure
│   ├── Start-FreshStack.ps1 · Start-E2eApi.ps1 · Test-Backend.ps1 · Bootstrap-Azure.ps1
│   ├── infra/main.bicep · main.bicepparam # the whole Azure stack, idempotent
│   └── foundry/claude.bicep            # Microsoft Foundry account + Claude deployment for the agents
├── evals/                              # agent behaviour evaluations (one folder per suite)
├── docs/
│   ├── adr/                            # ADR-NNN-kebab-title.md
│   ├── specs/                          # L1.md (capabilities), L2.md (detailed requirements with Given/When/Then)
│   ├── detailed-designs/<subsystem>/<feature>/README.md
│   ├── estimates/                      # README.md + one file per subsystem
│   ├── prd/ · prompts/                 # product requirement docs, saved feature prompts
│   ├── mocks/                          # static HTML/CSS design reference: index.html, pages/, styles/, images/, emails/
│   ├── design-system/                  # extracted design-system reference (tokens, foundations, components, patterns)
│   ├── videos/                         # NN-kebab-topic/{script.md, slides.html, README.md}; assets/ shared
│   └── assets/                         # repository images (logo)
├── marketing/                          # static marketing site: index.html, assets/, staticwebapp.config.json
└── tools/                              # video-audio/, video-build/, video-record/, marketing-screenshots/
```

## Angular conventions - mandatory

### Every component is split across files. No single-file components.

A component, page or dialog is a folder holding **separate** files:

| File                     | Holds                                                  |
| ------------------------ | ------------------------------------------------------ |
| `<name>.ts`              | the `@Component` class, with `templateUrl` and `styleUrl` |
| `<name>.html`            | the template                                           |
| `<name>.scss`            | the encapsulated styles, when the component has any    |
| `<name>.spec.ts`         | the unit tests                                         |

Inline `template:` and inline `styles:` in a `@Component` decorator are forbidden in every project
of the workspace, including the admin app, pages, dialogs and the shell. A component with no styles
simply omits the `.scss` file; it never inlines a template to compensate. The one exception is the
`perf-test` scenarios, which are throwaway render harnesses, not product components.

### The frontend is one Angular workspace, and the design system is its `components` project

- `frontend/` is a single Angular CLI workspace. Every application and library is a project under
  `frontend/projects/` registered in `frontend/angular.json`. Never create a second `package.json`
  with its own Angular install, and never scaffold an app outside the workspace.
- `frontend/projects/components` is the **design system**. Every reusable UI component from the
  design system (buttons, inputs, cards, navigation, dialogs, layout primitives, icons) is
  implemented in this library and exported from its `public-api.ts`. Applications import them
  through the `components` path alias and never re-implement a design-system component locally.
- Component selectors use `sl-*`; TypeScript class, file and folder names omit the `Sl` prefix
  (`sl-button` is `Button` in `lib/button/button.ts`). Application-only components use `app-*`.
- Components are standalone, `ChangeDetectionStrategy.OnPush`, signal-based (`input()`,
  `output()`, `computed()`), and the applications run zoneless.
- Every component has a story folder `frontend/projects/components/stories/src/<Name>/`:
  `index.stories.ts` (meta + re-exports; the only file Storybook globs), one
  `<Name><Story>.stories.ts` per example (`Default` first), and `<Name>Description.md` +
  `<Name>BestPractices.md`. Run `npm run build-storybook` from `frontend/` after changing a
  component's API; CI builds it on every pull request.
- New components also get a perf-test scenario in `frontend/projects/perf-test/src/scenarios/`.
- The `api` library owns backend integration. Every service has an interface and an injection
  token; pages depend on the token, never on the concrete class, and the application composition
  root (`app.config.ts`) binds the two.
- **Design tokens follow the Fluent UI v9 token model.** The TypeScript theme in
  `frontend/projects/components/src/lib/tokens/` is the source; `styles/_tokens.scss` and
  `tokens/tokens.ts` are generated by `npm run tokens` (CI runs `tokens:check`). Read tokens by
  role (`var(--colorBrandForeground1)` for text, `--colorBrandBackground` for fills,
  `--colorBrandStroke1` for borders), never hex values; component-scoped knobs keep the `--sl-`
  prefix.
- Components preserve the mocks' BEM class names and accessible state semantics
  (`aria-current`, `aria-pressed`, `aria-invalid`, roles and names); the e2e locators depend on
  that parity.
- Keep component styles encapsulated; global styles are limited to the shared foundations in
  `components/src/lib/styles/`.
- **Declare each `ng-content` slot once.** A component that renders `<a>` or `<button>` by
  condition puts its slots in one `<ng-template>` and renders it with `ngTemplateOutlet` in both
  branches; slots repeated per `@if` branch project into one branch only.
- **No inline forms in pages.** Button-triggered editing opens a CDK Dialog
  (`projects/<app>/src/app/dialogs/`) or navigates to a screen. Use Angular CDK Dialog/Overlay for
  every modal and menu; never hand-roll one.
- The `seedling` app is a progressive web app: `@angular/service-worker` with
  `ngsw-config.json`, a `manifest.webmanifest` and icons under `public/`, served over HTTPS by its
  Static Web App. Keep the shell installable and the app usable offline for cached routes.
- Prettier (`frontend/.prettierrc`) owns formatting and angular-eslint (`frontend/eslint.config.js`)
  owns lint; CI fails on either. Run `npm run lint` and `npm run format:check` in `frontend/`. The
  husky pre-commit hook fixes staged frontend files.

## Backend architecture

Layer dependency direction (strict):

- `Seedling.Domain` - entities and enums, zero dependencies
- `Seedling.Application` - MediatR handlers, validators, domain services, DTO contracts, `IAppDbContext`
- `Seedling.Infrastructure` - `AppDbContext`, EF Core migrations, SQL Server, external clients, auth services, seeder
- `Seedling.Api` - controllers, `Program.cs`, DI composition, Swagger, middleware
- `Seedling.Cli` - database migration, seeding and reset commands (a packaged dotnet tool named `seedling`)
- `Seedling.Worker` - scheduled background work, as a container or an App Service WebJob

Non-obvious rules:

- Business rules live in handlers and domain services, not controllers.
- The API does **not** apply EF migrations on startup. Run `seedling migrate` explicitly.
- Seed data is idempotent and safe to re-run.
- Mutating endpoints that create a resource are idempotent where a retry is plausible: re-posting
  returns the existing resource rather than throwing or duplicating.
- Authentication uses local JWTs with refresh tokens; write an ADR before changing the auth flow.
- Endpoints require authentication by default. Preserve intentional anonymous access and the
  Swagger middleware ordering when changing API auth.
- Keep request logging outside the exception-handling middleware so handled response statuses are
  logged correctly.
- Tenant-owned data stays scoped to the current user's tenant; cross-tenant resources are never
  exposed.
- Every package version lives in `Directory.Packages.props`; `.csproj` files carry no versions.

### Tests

Tests never need a database server: API and Infrastructure tests run on a per-fixture in-memory
SQLite database, Application and CLI tests on EF Core InMemory. Tests of SQL Server-only behaviour
use `[SqlServerFact]` with `[Trait("Category", "SqlServer")]` and are skipped unless
`SEEDLING_TEST_SQLSERVER` is set. API tests run sequentially (`xunit.runner.json`). Follow the
existing test-project patterns when adding coverage.

Playwright runs against the API started by `eng/Start-E2eApi.ps1` (SQLite, seeded; no LocalDB).

## E2E architecture (Playwright)

- Page Object Model: one page object per screen under `e2e/pages/`, owning the selectors and the
  interactions. Tests state intent; page objects know the DOM. Never put a selector in a test.
- Specs import `test` and `expect` from `e2e/fixtures/seedling-test.ts`, never from
  `@playwright/test` directly, so routing and sign-in are consistent.
- Visual specs under `e2e/tests/visual/` compare the Angular implementation to `docs/mocks`
  region by region. Write an ADR before changing visual regression coverage or snapshot policy.
  Update baselines only for intentional design changes.
- Chromium only. Do not configure or run Firefox, WebKit or any other browser.

## Azure and deployment

- `eng/infra/main.bicep` owns the whole stack and converges on every push to `main`: a Linux App
  Service plan and the API Web App, Azure SQL, Static Web Apps for the app, the admin app and the
  design system, the Microsoft Foundry account with the Claude deployment the agents use, Log
  Analytics + Application Insights, and a monthly budget. Change settings in the template, never in
  the portal.
- GitHub Actions signs in with OpenID Connect; Static Web App deployment tokens are read from Azure
  at run time. The only long-lived secrets are the ones the application itself needs.
- Agents reach Foundry with the Web App's managed identity; no key is copied by hand.
- Scheduled work ships as triggered WebJobs under `backend/deploy/webjobs/<job>/`, published beside
  the API from the same CLI build.

## Documentation

- `docs/adr/` holds the architecture decisions; read the relevant ADRs before changing the areas
  they cover and write a new one for any decision that changes the architecture.
- `docs/specs/L1.md` and `L2.md` are the requirements. `docs/detailed-designs/` holds one design
  per feature. `docs/mocks/` is the static design reference and the source of truth for the UI.
- The skills under `.claude/skills/` describe how requirements, designs, estimates, design
  systems, feature prompts and videos are produced. Use them.

## Incremental implementation and ATDD - mandatory

Mocks and the design system are design artifacts. ATDD does not apply to their development. Do not
write tests for mocks or the design system.

Every new feature or change to production behaviour MUST have a requirement, a detailed design and
a mock before implementation begins. This includes behavioural changes to existing features. This
requirement applies to production-code changes only; documentation-only, design-system-only,
mock-only and test-only changes are out of scope unless they are part of implementing a production
behaviour change.

Every production behaviour implementation MUST invoke and follow the `implementing-incrementally`
skill (`.claude/skills/implementing-incrementally` and `.agents/skills/implementing-incrementally`)
before any code is written, combined with acceptance test-driven development (ATDD). Plan small,
reviewable slices, then complete one slice at a time: write Given-When-Then acceptance criteria,
write the acceptance test, and run it to prove it fails for the expected reason BEFORE writing
production code. Implement only what satisfies that slice, refactor with tests green, and run the
relevant regression checks. Do not move to the next slice until those checks pass. No bulk
implementation, no tests added afterwards, and no weakening tests to manufacture a pass. Keep the
requirement, detailed design, mock, criteria, tests and implementation aligned until the entire
feature or behaviour change is complete.

Back end: integration tests against the API. Front end: Playwright, using the Page Object Model.

### Never write architecture tests

Never add a test that asserts the shape of the codebase rather than its behaviour: no structure,
layout or naming tests; no banned-API scans; no traceability tests that parse the specifications.
Those constraints belong to the compiler, the formatter and review. A test suite exists to prove
behaviour.
