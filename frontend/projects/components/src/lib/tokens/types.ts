/**
 * The design-token model, after Fluent UI v9's `@fluentui/tokens`: a flat, typed
 * `Theme` whose keys ARE the CSS custom property names every component reads
 * (`--colorBrandBackground`, `--spacingHorizontalM`, …). Built in three layers:
 * `global/` (raw ramps), `alias/` (semantic colours computed from a brand ramp)
 * and `themes/` (one assembled theme plus the responsive retunes).
 *
 * Only erasable TypeScript here (interfaces, type aliases, `const`): the token
 * generator runs these files in Node with type stripping and no build.
 */

export type BrandStep =
  10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 110 | 120 | 130 | 140 | 150 | 160;
export type BrandVariants = Record<BrandStep, string>;

export interface ColorTokens {
  colorNeutralForeground1: string;
  colorNeutralForeground2: string;
  colorNeutralForeground3: string;
  colorNeutralForegroundDisabled: string;
  colorNeutralForegroundOnBrand: string;
  colorNeutralForegroundInverted: string;
  colorNeutralBackground1: string;
  colorNeutralBackground2: string;
  colorNeutralBackground3: string;
  colorNeutralBackgroundInverted: string;
  colorNeutralBackgroundDisabled: string;
  colorNeutralStroke1: string;
  colorNeutralStroke2: string;
  colorNeutralStrokeAccessible: string;
  colorBrandForeground1: string;
  colorBrandForeground2: string;
  colorBrandBackground: string;
  colorBrandBackgroundHover: string;
  colorBrandBackgroundPressed: string;
  colorBrandBackground2: string;
  colorBrandStroke1: string;
  colorBrandStroke2: string;
  colorStrokeFocus1: string;
  colorStrokeFocus2: string;
  colorStatusSuccessForeground1: string;
  colorStatusSuccessBackground1: string;
  colorStatusWarningForeground1: string;
  colorStatusWarningBackground1: string;
  colorStatusDangerForeground1: string;
  colorStatusDangerBackground1: string;
  colorBackgroundOverlay: string;
}

export interface FontFamilyTokens {
  fontFamilyBase: string;
  fontFamilyMonospace: string;
}

export interface FontSizeTokens {
  fontSizeBase200: string;
  fontSizeBase300: string;
  fontSizeBase400: string;
  fontSizeBase500: string;
  fontSizeBase600: string;
  fontSizeHero700: string;
  fontSizeHero800: string;
}

export interface FontWeightTokens {
  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
}

export interface LineHeightTokens {
  lineHeightNone: number;
  lineHeightTight: number;
  lineHeightSnug: number;
  lineHeightNormal: number;
}

export interface SpacingTokens {
  spacingHorizontalXXS: string;
  spacingHorizontalXS: string;
  spacingHorizontalS: string;
  spacingHorizontalM: string;
  spacingHorizontalL: string;
  spacingHorizontalXL: string;
  spacingHorizontalXXL: string;
  spacingVerticalXXS: string;
  spacingVerticalXS: string;
  spacingVerticalS: string;
  spacingVerticalM: string;
  spacingVerticalL: string;
  spacingVerticalXL: string;
  spacingVerticalXXL: string;
}

export interface BorderRadiusTokens {
  borderRadiusNone: string;
  borderRadiusSmall: string;
  borderRadiusMedium: string;
  borderRadiusLarge: string;
  borderRadiusXLarge: string;
  borderRadiusCircular: string;
}

export interface StrokeWidthTokens {
  strokeWidthThin: string;
  strokeWidthThick: string;
  strokeWidthThicker: string;
}

export interface ShadowTokens {
  shadow2: string;
  shadow4: string;
  shadow8: string;
  shadow16: string;
}

export interface DurationTokens {
  durationUltraFast: string;
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
}

export interface CurveTokens {
  curveAccelerateMid: string;
  curveDecelerateMid: string;
  curveEasyEase: string;
  curveLinear: string;
}

export interface LayoutTokens {
  layoutContentMaxWidth: string;
  layoutGutter: string;
  layoutControlHeight: string;
}

export interface ZIndexTokens {
  zIndexContent: number;
  zIndexSticky: number;
  zIndexOverlay: number;
  zIndexPopup: number;
  zIndexToast: number;
}

export type Theme = ColorTokens &
  FontFamilyTokens &
  FontSizeTokens &
  FontWeightTokens &
  LineHeightTokens &
  SpacingTokens &
  BorderRadiusTokens &
  StrokeWidthTokens &
  ShadowTokens &
  DurationTokens &
  CurveTokens &
  LayoutTokens &
  ZIndexTokens;

export type PartialTheme = Partial<Theme>;

/** A set of token values that applies under a media query (responsive retunes, reduced motion). */
export interface ThemeOverride {
  readonly media: string;
  readonly tokens: PartialTheme;
}
