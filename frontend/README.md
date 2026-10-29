# Frontend

The Angular workspace for every Seedling user interface: one `package.json`, one `angular.json`,
five projects under `projects/`.

| Project      | Type        | What it is                                                                                |
| ------------ | ----------- | ----------------------------------------------------------------------------------------- |
| `components` | library     | The design system: every `sl-*` component, the token theme, the global styles, Storybook. |
| `api`        | library     | Backend integration: service contracts and tokens, implementations, models, guards.       |
| `seedling`   | application | The progressive web app (`npm start`, :4200).                                             |
| `admin`      | application | The administration app on its own host (`npm run start:admin`, :4300).                    |
| `perf-test`  | application | Component render-cost scenarios profiled by `e2e/perf-test`.                              |

Every component is split into `<name>.ts`, `<name>.html` and `<name>.scss`; no inline templates or
styles (the lint rule in `eslint.config.js` enforces it). See the root `AGENTS.md` for the rest of
the conventions.

## Commands

```sh
npm ci                     # installs the husky pre-commit hook too
npm start                  # ng serve seedling
npm run start:admin        # ng serve admin --port 4300
npm run build -- seedling  # production build to dist/seedling/browser
npm run build -- admin
npm run build -- components
npm run build -- api
npm test                   # Vitest, every project
npm run lint               # angular-eslint
npm run format:check       # Prettier
npm run tokens             # regenerate _tokens.scss + tokens.ts from the theme
npm run tokens:check       # fail when the generated files are stale (CI)
npm run storybook          # http://localhost:6006
npm run build-storybook    # dist/storybook
```

## Generating code

Use the Angular CLI so the new files land in the right project with separate template and style
files:

```sh
npx ng generate component lib/button --project components --prefix sl --style scss
npx ng generate component pages/home --project seedling --style scss
```

Then move on to the story folder, the perf-test scenario and the export from `public-api.ts`.
