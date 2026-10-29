/** Named palettes the alias layer draws neutral and status colours from. */
export const grey = {
  2: '#050505',
  14: '#242424',
  26: '#424242',
  38: '#616161',
  46: '#757575',
  62: '#9e9e9e',
  74: '#bdbdbd',
  82: '#d1d1d1',
  90: '#e6e6e6',
  94: '#f0f0f0',
  96: '#f5f5f5',
  98: '#fafafa',
  100: '#ffffff',
} as const;

export const white = '#ffffff';
export const black = '#000000';

export const statusColors = {
  successForeground: '#0e700e',
  successBackground: '#f1faf1',
  warningForeground: '#8a3707',
  warningBackground: '#fff4ce',
  dangerForeground: '#b10e1c',
  dangerBackground: '#fdf3f4',
} as const;
