import type { ThemeOverride } from '../types';

/** Under `prefers-reduced-motion: reduce` every duration is zero, so transitions resolve at once. */
export const reducedMotionOverride: ThemeOverride = {
  media: '(prefers-reduced-motion: reduce)',
  tokens: {
    durationUltraFast: '0ms',
    durationFast: '0ms',
    durationNormal: '0ms',
    durationSlow: '0ms',
  },
};
