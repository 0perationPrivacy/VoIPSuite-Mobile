// Brand accent (#FBB03B) is taken from the Operation Privacy logo (assets/logo-b.svg) —
// the app's actual brand color, not the Bootstrap-default green/blue the old screens used.

export type ColorScheme = {
  background: string;
  backgroundSecondary: string;
  surface: string;
  border: string;
  separator: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textOnAccent: string;

  accent: string;
  accentPressed: string;
  accentSoft: string;
  linkText: string;

  destructive: string;
  success: string;
  warning: string;

  bubbleSentBackground: string;
  bubbleSentText: string;
  bubbleReceivedBackground: string;
  bubbleReceivedText: string;

  overlay: string;
  shadow: string;
};

const brandAccent = '#FBB03B';

export const light: ColorScheme = {
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F7',
  surface: '#FFFFFF',
  border: '#E5E5EA',
  separator: '#EDEDF0',

  textPrimary: '#0B0B0C',
  textSecondary: '#6B6B70',
  textTertiary: '#A0A0A5',
  textOnAccent: '#1A1400',

  accent: brandAccent,
  accentPressed: '#E09A2C',
  accentSoft: 'rgba(251,176,59,0.16)',
  linkText: '#C9860A',

  destructive: '#E5484D',
  success: '#2FA36B',
  warning: '#E0A100',

  bubbleSentBackground: brandAccent,
  bubbleSentText: '#1A1400',
  bubbleReceivedBackground: '#F0F0F2',
  bubbleReceivedText: '#0B0B0C',

  overlay: 'rgba(0,0,0,0.4)',
  shadow: '#000000',
};

export const dark: ColorScheme = {
  background: '#0B0B0D',
  backgroundSecondary: '#151517',
  surface: '#1C1C1E',
  border: '#2C2C2E',
  separator: '#242426',

  textPrimary: '#F5F5F7',
  textSecondary: '#9B9BA1',
  textTertiary: '#6B6B70',
  textOnAccent: '#1A1400',

  accent: brandAccent,
  accentPressed: '#FFC257',
  accentSoft: 'rgba(251,176,59,0.22)',
  linkText: brandAccent,

  destructive: '#FF6961',
  success: '#32D74B',
  warning: '#FFC940',

  bubbleSentBackground: brandAccent,
  bubbleSentText: '#1A1400',
  bubbleReceivedBackground: '#2C2C2E',
  bubbleReceivedText: '#F5F5F7',

  overlay: 'rgba(0,0,0,0.6)',
  shadow: '#000000',
};
