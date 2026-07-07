// Two palettes per docs/DESIGN.md. The night palette is reserved for
// nighttime-capture surfaces (true-dark, low-light, dim red/amber accents);
// day is the calm paper world for planting and harvesting.

export const night = {
  bg: '#05060A', // near-black; never white, never bright
  bgRest: '#0A0B10',
  accentFill: '#5A1F1F', // dim red fill
  pulse: '#B0553A', // faint amber recording indicator
  ember: '#8A6A3B', // secondary warm accent
  text: '#8B8FA0', // dim, sparing text on near-black — the floor is 4.5:1; dimmer than this and half-asleep eyes lose the exit
};

export const day = {
  bg: '#F4F1EA', // warm-neutral paper
  card: '#FFFFFF',
  border: '#E3DECE',
  ink: '#1D1B16',
  inkSoft: '#6B675C',
  indigo: '#2B2A4A', // restrained primary accent
  gold: '#8A6A3B', // muted secondary accent
  danger: '#8A4433',
};

// A normal (not nighttime-capture) dark theme for daylight surfaces when the
// system prefers dark. The ultra-dark palette stays reserved for capture.
export const dayDark = {
  bg: '#17161C',
  card: '#211F27',
  border: '#333040',
  ink: '#E7E4DC',
  inkSoft: '#9B97A6',
  indigo: '#8D8BC0',
  gold: '#B39868',
  danger: '#C07862',
};

export type DayPalette = typeof day;
