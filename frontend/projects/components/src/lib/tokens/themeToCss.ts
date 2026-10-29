import type { PartialTheme, ThemeOverride } from './types';

/** `--key: value;` declarations for every token in the (partial) theme. */
export const themeToCssVariables = (theme: PartialTheme, indent = '  '): string =>
  Object.entries(theme)
    .map(([key, value]) => `${indent}--${key}: ${value};`)
    .join('\n');

/** The `:root` block plus one `@media` block per override; the text `_tokens.scss` holds. */
export const themeToCss = (theme: PartialTheme, overrides: readonly ThemeOverride[]): string => {
  const root = `:root {\n${themeToCssVariables(theme)}\n}\n`;
  const blocks = overrides.map(
    (override) =>
      `@media ${override.media} {\n  :root {\n${themeToCssVariables(override.tokens, '    ')}\n  }\n}\n`,
  );
  return [root, ...blocks].join('\n');
};
