# components

The Seedling design system as an Angular library: every `sl-*` component, the
design-token theme and the global styles, documented in Storybook.

| Path                | What it is                                                                            |
| ------------------- | ------------------------------------------------------------------------------------- |
| `src/public-api.ts` | The library's only entry point. Export every component from here.                     |
| `src/lib/<name>/`   | One component: `<name>.ts`, `<name>.html`, `<name>.scss`, `<name>.spec.ts`.           |
| `src/lib/tokens/`   | The TypeScript theme (global ramps, alias colours, themes). `tokens.ts` is generated. |
| `src/lib/styles/`   | `index.scss` entry; `_tokens.scss` (generated), `_breakpoints.scss`, `_global.scss`.  |
| `src/lib/shared/`   | Helpers shared by several components.                                                 |
| `.storybook/`       | Storybook configuration, manager theme and branding.                                  |
| `stories/src/`      | Concepts and Theme MDX, one folder per component, Patterns.                           |

## Commands (from `frontend/`)

```sh
npm run build -- components   # ng-packagr build to dist/components
npm test -- --project components
npm run tokens                # regenerate _tokens.scss + tokens.ts from the theme
npm run storybook             # http://localhost:6006
npm run build-storybook       # static build to dist/storybook
```

## Adding a component

1. `src/lib/<name>/<name>.ts` with `templateUrl: './<name>.html'` and `styleUrl: './<name>.scss'`.
   Standalone, `OnPush`, signal inputs and outputs, selector `sl-<name>`. Never an inline template.
2. Export it from `src/public-api.ts`.
3. `stories/src/<Name>/` with `index.stories.ts`, `<Name>Default.stories.ts`, `<Name>Description.md`
   and `<Name>BestPractices.md`.
4. A scenario in `projects/perf-test/src/scenarios/<Name>.ts`.
5. Read colours, spacing, radii and motion from the tokens by role; never a hex value.
