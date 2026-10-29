import type { ThemeOverride } from '../types';

/**
 * Retunes applied under media queries, rendered after `:root` by the generator.
 * Breakpoints are in rem so they follow the reader's text size (WCAG 1.4.4) and
 * mirror `_breakpoints.scss`: 45rem (720px) tablet, 64rem (1024px) desktop.
 */
export const responsiveOverrides: readonly ThemeOverride[] = [
  {
    media: '(min-width: 45rem)',
    tokens: { layoutGutter: '24px', fontSizeHero800: '2.5rem' },
  },
  {
    media: '(min-width: 64rem)',
    tokens: { layoutGutter: '32px' },
  },
];
