import Metrics from '../helpers/Metrics';

const family = {
  regular: Metrics.fontRegular,
  medium: Metrics.fontMedium,
  semiBold: Metrics.fontSemiBold,
  bold: Metrics.fontBold,
};

export const typography = {
  largeTitle: { fontFamily: family.bold, fontSize: Metrics.ratio(28), lineHeight: Metrics.ratio(34) },
  title1: { fontFamily: family.semiBold, fontSize: Metrics.ratio(22), lineHeight: Metrics.ratio(28) },
  title2: { fontFamily: family.semiBold, fontSize: Metrics.ratio(18), lineHeight: Metrics.ratio(24) },
  headline: { fontFamily: family.semiBold, fontSize: Metrics.ratio(16), lineHeight: Metrics.ratio(22) },
  body: { fontFamily: family.regular, fontSize: Metrics.ratio(15), lineHeight: Metrics.ratio(20) },
  bodyMedium: { fontFamily: family.medium, fontSize: Metrics.ratio(15), lineHeight: Metrics.ratio(20) },
  subhead: { fontFamily: family.regular, fontSize: Metrics.ratio(14), lineHeight: Metrics.ratio(18) },
  footnote: { fontFamily: family.regular, fontSize: Metrics.ratio(12), lineHeight: Metrics.ratio(16) },
  footnoteMedium: { fontFamily: family.medium, fontSize: Metrics.ratio(12), lineHeight: Metrics.ratio(16) },
  caption: { fontFamily: family.regular, fontSize: Metrics.ratio(11), lineHeight: Metrics.ratio(14) },
} as const;

export type TypographyVariant = keyof typeof typography;

export { family as fontFamily };
