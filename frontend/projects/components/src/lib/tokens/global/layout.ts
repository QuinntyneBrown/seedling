import type { LayoutTokens, ZIndexTokens } from '../types';

export const layout: LayoutTokens = {
  layoutContentMaxWidth: '1120px',
  layoutGutter: '16px',
  layoutControlHeight: '44px',
};

export const zIndexes: ZIndexTokens = {
  zIndexContent: 1,
  zIndexSticky: 10,
  zIndexOverlay: 100,
  zIndexPopup: 110,
  zIndexToast: 120,
};
