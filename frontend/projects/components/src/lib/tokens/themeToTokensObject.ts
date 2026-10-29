import type { Theme } from './types';

/** `{ colorBrandBackground: 'var(--colorBrandBackground)', … }` — the typed `tokens` object. */
export const themeToTokensObject = (theme: Theme): Record<keyof Theme, string> =>
  Object.fromEntries(Object.keys(theme).map((key) => [key, `var(--${key})`])) as Record<
    keyof Theme,
    string
  >;
