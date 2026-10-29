import type {
  FontFamilyTokens,
  FontSizeTokens,
  FontWeightTokens,
  LineHeightTokens,
} from '../types';

export const fontFamilies: FontFamilyTokens = {
  fontFamilyBase:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

export const fontSizes: FontSizeTokens = {
  fontSizeBase200: '0.75rem',
  fontSizeBase300: '0.875rem',
  fontSizeBase400: '1rem',
  fontSizeBase500: '1.125rem',
  fontSizeBase600: '1.25rem',
  fontSizeHero700: '1.75rem',
  fontSizeHero800: '2.25rem',
};

export const fontWeights: FontWeightTokens = {
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
};

export const lineHeights: LineHeightTokens = {
  lineHeightNone: 1,
  lineHeightTight: 1.2,
  lineHeightSnug: 1.35,
  lineHeightNormal: 1.5,
};
