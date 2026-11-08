// Sky brightness: sky quality meter readings, luminance, naked-eye limiting magnitude and the Bortle scale.

/** Natural night sky with no artificial light, as used for the World Atlas of artificial sky brightness (Falchi et al. 2016). */
export const NATURAL_MCD = 0.174;

/** mag/arcsec² to luminance in mcd/m²: L = 108,000 × 10^(−0.4 m) cd/m². */
export const sqmToMcd = (m: number) => 1.08e8 * 10 ** (-0.4 * m);
export const mcdToSqm = (mcd: number) => -2.5 * Math.log10(mcd / 1.08e8);

// Naked-eye limiting magnitude at the zenith for a typical observer, from the relation used with sky quality meters
// (after Schaefer 1990): NELM = 7.93 − 5 log10(10^(4.316 − SQM/5) + 1).
export const sqmToNelm = (m: number) => 7.93 - 5 * Math.log10(10 ** (4.316 - m / 5) + 1);
export function nelmToSqm(nelm: number) {
  if (!(nelm < 7.93)) throw new Error('A limiting magnitude must be below 7.9 with this formula');
  return 5 * (4.316 - Math.log10(10 ** ((7.93 - nelm) / 5) - 1));
}

export type BortleClass = { n: number; label?: string; name: string; sqm: number; nelm: string; sky: string };
// Lower SQM limit of each class, as on lightpollutionmap.info and many SQM tables. Bortle (2001) defined the classes by
// what you see, not by meter readings, so any reading-to-class link is approximate.
export const BORTLE: BortleClass[] = [
  { n: 1, name: 'Excellent dark site', sqm: 21.99, nelm: '7.6 to 8.0', sky: 'Zodiacal light, gegenschein and airglow visible; the Milky Way casts shadows; M33 is easy with the naked eye.' },
  { n: 2, name: 'Typical truly dark site', sqm: 21.89, nelm: '7.1 to 7.5', sky: 'The summer Milky Way is highly structured; airglow faint near the horizon; clouds look like black holes in the stars.' },
  { n: 3, name: 'Rural sky', sqm: 21.69, nelm: '6.6 to 7.0', sky: 'Some light domes on the horizon; the Milky Way still looks complex; clouds are lit near the horizon.' },
  { n: 4, name: 'Rural to suburban transition', sqm: 20.49, nelm: '6.1 to 6.5', sky: 'Light domes over towns in several directions; the Milky Way is plain but lacks detail away from the zenith.' },
  { n: 5, name: 'Suburban sky', sqm: 19.5, nelm: '5.6 to 6.0', sky: 'The Milky Way is weak or invisible near the horizon and washed out overhead; clouds are brighter than the sky.' },
  { n: 6, name: 'Bright suburban sky', sqm: 18.94, nelm: '5.1 to 5.5', sky: 'The Milky Way is only visible near the zenith, if at all; the sky glows greyish white up to 35° above the horizon.' },
  { n: 7, name: 'Suburban to urban transition', sqm: 18.38, nelm: '4.6 to 5.0', sky: 'The whole sky has a grey-white glow; the Milky Way is invisible; M31 and M44 are barely glimpsed.' },
  { n: 8, label: '8 to 9', name: 'City or inner-city sky', sqm: -Infinity, nelm: '4.5 or less', sky: 'The sky glows white, grey or orange and you can read by it; only bright constellations are recognisable, and the Moon, planets and a few bright clusters stand out. Meter readings cannot split class 8 from class 9.' },
];
export const bortleOf = (m: number) => BORTLE.find((b) => m >= b.sqm)!;
/** A representative reading for a class (the middle of its band), for when you only know the class. */
export function sqmForBortle(n: number) {
  const i = Math.min(8, Math.max(1, Math.round(n))) - 1;
  if (i === 0) return 22.0;
  if (i === 7) return 17.8;
  return (BORTLE[i].sqm + BORTLE[i - 1].sqm) / 2;
}

/** Everything about one sky, from its zenith brightness in mag/arcsec². */
export function skyglow(m: number, refSqm = 22) {
  const mcd = sqmToMcd(m);
  return {
    sqm: m, mcd, nelm: sqmToNelm(m), bortle: bortleOf(m),
    // Natural sky units: how many times brighter than a pristine sky.
    nsu: mcd / NATURAL_MCD,
    // Artificial light as a share of the natural brightness (Falchi's ratio); 0 for a natural sky.
    artificial: Math.max(0, mcd / NATURAL_MCD - 1),
    // A sky-limited image needs this many times the exposure to match the signal-to-noise under the reference sky.
    exposureFactor: 10 ** (0.4 * (refSqm - m)),
  };
}
