import type { ShadowTokens } from '../types';

export const createShadowTokens = (
  ambient = 'rgba(0, 0, 0, 0.12)',
  key = 'rgba(0, 0, 0, 0.14)',
): ShadowTokens => ({
  shadow2: `0 0 2px ${ambient}, 0 1px 2px ${key}`,
  shadow4: `0 0 2px ${ambient}, 0 2px 4px ${key}`,
  shadow8: `0 0 2px ${ambient}, 0 4px 8px ${key}`,
  shadow16: `0 0 2px ${ambient}, 0 8px 16px ${key}`,
});
