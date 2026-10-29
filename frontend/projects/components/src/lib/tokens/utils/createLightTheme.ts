import { generateColorTokens } from '../alias/lightColor';
import {
  borderRadius,
  curves,
  durations,
  fontFamilies,
  fontSizes,
  fontWeights,
  layout,
  lineHeights,
  spacings,
  strokeWidths,
  zIndexes,
} from '../global/index';
import type { BrandVariants, Theme } from '../types';
import { createShadowTokens } from './shadows';

/** Assembles one flat theme from a brand ramp: every global ramp plus the alias colours. */
export const createLightTheme = (brand: BrandVariants): Theme => ({
  ...generateColorTokens(brand),
  ...fontFamilies,
  ...fontSizes,
  ...fontWeights,
  ...lineHeights,
  ...spacings,
  ...borderRadius,
  ...strokeWidths,
  ...createShadowTokens(),
  ...durations,
  ...curves,
  ...layout,
  ...zIndexes,
});
