# Contributing to Seedling

Thank you for your interest in improving Seedling. This project is a full-stack web application
platform with an Angular progressive web app, a .NET backend, Playwright test suites and a static
design reference. The conventions below are the short version; [AGENTS.md](AGENTS.md) is the
complete, binding one for people and coding agents alike.

## Before you start

- Check existing issues and pull requests to avoid duplicate work.
- Open an issue first for user-visible behaviour changes, larger refactors, or changes that
  affect API contracts.
- Keep pull requests focused on one fix, feature or documentation update.
- Include screenshots or Playwright evidence for visible UI changes.

## Development setup

From the repository root, the fastest way to verify the full stack is:

```powershell
pwsh ./eng/Start-FreshStack.ps1
```

Manual setup:

```powershell
cd frontend
npm ci

cd ../e2e
npm ci

cd ../backend
dotnet restore ./Seedling.sln
```

## Project layout

| Path        | Purpose                                                                          |
| ----------- | -------------------------------------------------------------------------------- |
| `backend/`  | .NET solution: Clean Architecture layers, EF Core, API, CLI, Worker, tests       |
| `frontend/` | Angular workspace: `seedling` and `admin` apps, `api` and `components` libraries |
| `e2e/`      | Playwright behaviour, visual, Storybook contract and responsive audit tests      |
| `docs/`     | Requirements, designs, ADRs, the static design reference (`mocks/`)              |
| `eng/`      | Engineering scripts and the Azure infrastructure (Bicep)                         |
| `evals/`    | Agent behaviour evaluations                                                      |
| `tools/`    | Video and screenshot tooling                                                     |

## Coding guidelines

- **Every Angular component is split across files**: `<name>.ts`, `<name>.html`, `<name>.scss`
  (and `<name>.spec.ts`). No inline templates or styles; the lint rule rejects them.
- **Every design-system component lives in `frontend/projects/components`** and is exported from
  its `public-api.ts`, with a story folder and a perf-test scenario. Applications never
  re-implement one locally.
- Component selectors use `sl-*`; design tokens are read by role (`var(--colorBrandBackground)`),
  never as hex values. Run `npm run tokens` after changing the theme.
- Follow existing patterns in the layer you are changing.
- Keep backend business rules in application handlers and domain services, not controllers.
- Keep EF migrations explicit. The API must not apply migrations on startup.
- Keep seed data idempotent and safe to re-run.
- Keep Angular component hosts and inner elements on the mocks' BEM class names; the e2e page
  objects locate by them.
- Keep visual changes consistent with `docs/mocks/` unless the pull request is intentionally
  updating the design. Then change the mock first and re-capture baselines (`npm run baseline`
  in `e2e/`).
- Frontend code is formatted with Prettier and linted with angular-eslint. The husky pre-commit
  hook (installed by `npm ci` in `frontend/`) fixes staged files automatically; run `npm run lint`
  and `npm run format:check` before opening a pull request.
- Avoid unrelated formatting churn and broad refactors in feature or bug-fix pull requests.

## Workflow for a feature

1. Requirement in `docs/specs/L2.md` with Given/When/Then acceptance criteria.
2. Detailed design in `docs/detailed-designs/<subsystem>/<feature>/README.md`.
3. Mock in `docs/mocks/pages/`.
4. Thin slices, each with its acceptance test written and failing first, following the
   `implementing-incrementally` skill. An ADR for any decision that changes the architecture.

## Tests

Run the checks that match your change. For cross-stack changes, run all of them.

```powershell
# Backend build and tests
dotnet build ./backend/Seedling.sln
dotnet test ./backend/Seedling.sln

# Frontend build, lint, format, tokens and tests
cd frontend
npm run build -- seedling --configuration development
npm run build -- admin --configuration development
npm run build -- components
npm run build -- api
npm run lint
npm run format:check
npm run tokens:check
npm test

# Playwright behaviour and visual tests (start the API first: pwsh ./eng/Start-E2eApi.ps1)
cd ../e2e
npm run test:behavior
npm run test:visual
```

Update visual baselines only when the design change is intentional:

```powershell
cd e2e
npm run baseline
```

## Pull request checklist

- The change has a clear issue, rationale or user-facing reason.
- New or changed behaviour has test coverage appropriate to the risk, written before the code.
- Relevant documentation is updated (requirements, design, ADR, README, `SERVICE_API.md`).
- UI changes include screenshots or Playwright evidence.
- Database changes include explicit EF migrations and seed updates if needed.
- The pull request description lists the commands you ran.

## Reporting bugs

When filing a bug, include:

- the route or command where the problem appears;
- expected behaviour;
- actual behaviour;
- reproduction steps;
- logs, screenshots or terminal output;
- operating system, browser and relevant tool versions.

## License

By contributing to this repository, you agree that your contributions are licensed under the
repository's MIT License.
