import { TextStyle } from 'react-native';

// Generous, unhurried type for the daylight surfaces; the nighttime surface
// barely uses text at all.

export const type: Record<'display' | 'title' | 'body' | 'caption' | 'nightHint', TextStyle> = {
  display: { fontSize: 30, fontWeight: '700', lineHeight: 38 },
  title: { fontSize: 19, fontWeight: '600', lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  // Dim, minimal, understandable with almost no reading.
  nightHint: { fontSize: 15, fontWeight: '400', letterSpacing: 0.4 },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { md: 12, lg: 18, pill: 999 } as const;
