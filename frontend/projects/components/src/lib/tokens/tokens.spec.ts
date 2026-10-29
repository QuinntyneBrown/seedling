import { describe, expect, it } from 'vitest';

import {
  brandSeedling,
  createLightTheme,
  seedlingLightTheme,
  themeToCss,
  themeToTokensObject,
} from './index';

describe('design tokens', () => {
  it('builds the light theme from the brand ramp by role', () => {
    expect(seedlingLightTheme.colorBrandBackground).toBe(brandSeedling[80]);
    expect(seedlingLightTheme.colorBrandForeground1).toBe(brandSeedling[80]);
    expect(seedlingLightTheme.colorBrandStroke1).toBe(brandSeedling[80]);
  });

  it('re-brands by passing another ramp, not by forking the stylesheet', () => {
    const theme = createLightTheme({ ...brandSeedling, 80: '#123456' });
    expect(theme.colorBrandBackground).toBe('#123456');
    expect(theme.spacingHorizontalM).toBe(seedlingLightTheme.spacingHorizontalM);
  });

  it('renders every token as a custom property on :root', () => {
    const css = themeToCss(seedlingLightTheme, []);
    expect(css).toContain('--colorNeutralForeground1:');
    expect(css.startsWith(':root {')).toBe(true);
  });

  it('maps every key to a var() reference', () => {
    expect(themeToTokensObject(seedlingLightTheme).colorBrandBackground).toBe(
      'var(--colorBrandBackground)',
    );
  });
});
