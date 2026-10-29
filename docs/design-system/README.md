# Seedling design system reference

The design system extracted from `docs/mocks` by the `extracting-design-systems` skill: tokens
(colour with light and dark themes, typography, spacing, layout, radius, elevation, motion),
foundation pages, one HTML page per component with anatomy, variants, states, responsive
behaviour, accessibility and code, plus patterns, a DTCG `tokens.json` and verified contrast.

This is a static **reference**, not a second component library. The Angular `components` library
and its Storybook remain the product's live documentation. Token names follow the Fluent UI v9
model, and component classes are the mocks' BEM classes.

```text
design-system/
├── index.html
├── tokens/          tokens.css, tokens.json (DTCG)
├── foundations/     color, typography, spacing, layout, elevation, shape, motion, iconography
├── components/      one page per component
├── patterns/        page templates and flows
└── assets/          ds.css, ds.js, icons
```
