// Tuning systems and cents: equal temperament with any number of steps, 5-limit just intonation, Pythagorean and
// meantone (any fraction of the syntonic comma) tunings, frequencies from a reference pitch, cents between ratios,
// and deviations from 12-tone equal temperament and from simple just intervals. Plain maths, no DOM.

export const cents = (ratio: number) => 1200 * Math.log2(ratio);
export const ratioOf = (c: number) => 2 ** (c / 1200);
/** The syntonic comma 81/80 and the Pythagorean comma 3^12/2^19, in cents. */
export const SYNTONIC = cents(81 / 80), PYTHAGOREAN = cents(531441 / 524288);

export const NOTE_NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];

export type System =
  | { kind: 'edo'; n: number }
  | { kind: 'just' }
  | { kind: 'pyth'; below?: number }
  | { kind: 'meantone'; frac: number; below?: number };
export type Degree = { step: number; ratio: number; cents: number; frac?: string; pc?: number };

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
/** 5-limit just intonation, 12 notes from the tonic (the major scale from 1/1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8 and the usual chromatic notes). */
export const JUST_12: [number, number][] = [[1, 1], [16, 15], [9, 8], [6, 5], [5, 4], [4, 3], [45, 32], [3, 2], [8, 5], [5, 3], [9, 5], [15, 8]];

/** One octave of degrees (not the octave itself), in rising order. `below` is how many fifths of the chain lie below the tonic (default 3: E♭ to G♯ from C). */
export function degrees(s: System): Degree[] {
  if (s.kind === 'edo') return Array.from({ length: s.n }, (_, k) => ({ step: k, ratio: 2 ** (k / s.n), cents: (1200 * k) / s.n, ...(s.n === 12 ? { pc: k } : {}) }));
  if (s.kind === 'just') return JUST_12.map(([p, q], k) => ({ step: k, ratio: p / q, cents: cents(p / q), frac: `${p}/${q}`, pc: k }));
  const below = s.below ?? 3;
  const fifth = s.kind === 'pyth' ? cents(3 / 2) : cents(3 / 2) - s.frac * SYNTONIC;
  const out: Degree[] = [];
  for (let j = -below; j < 12 - below; j++) {
    let c = j * fifth; c -= 1200 * Math.floor(c / 1200 + 1e-12);
    const d: Degree = { step: 0, ratio: ratioOf(c), cents: c, pc: (((7 * j) % 12) + 12) % 12 };
    if (s.kind === 'pyth') { // exact fraction 3^j / 2^m (or 2^m / 3^-j)
      let num = j >= 0 ? 3 ** j : 1, den = j >= 0 ? 1 : 3 ** -j;
      while (num / den >= 2) den *= 2; while (num / den < 1) num *= 2;
      const g = gcd(num, den); d.frac = `${num / g}/${den / g}`; d.ratio = num / den;
    }
    out.push(d);
  }
  out.sort((a, b) => a.cents - b.cents).forEach((d, k) => (d.step = k));
  return out;
}

/** The tonic's frequency in octave `oct` (scientific pitch: C4 is middle C) when note `refPc` in octave `refOct` is `refHz`. */
export function tonicHz(s: System, tonicPc: number, oct: number, refPc: number, refOct: number, refHz: number): number {
  const k = 12 * (refOct + 1) + refPc - (12 * (oct + 1) + tonicPc);
  if (s.kind === 'edo' && s.n !== 12) return refHz * 2 ** (-k / 12);
  const d = ((k % 12) + 12) % 12, octs = Math.floor(k / 12);
  const deg = degrees(s).find((x) => (x.pc ?? x.step) === d)!;
  return refHz / (deg.ratio * 2 ** octs);
}

/** Simple just intervals used to describe a degree. */
export const JUST_REF: { r: [number, number]; name: string }[] = [
  { r: [1, 1], name: 'unison' }, { r: [16, 15], name: 'minor second' }, { r: [9, 8], name: 'major second' }, { r: [8, 7], name: 'septimal whole tone' },
  { r: [7, 6], name: 'septimal minor third' }, { r: [6, 5], name: 'minor third' }, { r: [5, 4], name: 'major third' }, { r: [9, 7], name: 'septimal major third' },
  { r: [4, 3], name: 'perfect fourth' }, { r: [7, 5], name: 'septimal tritone' }, { r: [45, 32], name: 'augmented fourth' }, { r: [10, 7], name: 'septimal tritone' },
  { r: [3, 2], name: 'perfect fifth' }, { r: [14, 9], name: 'septimal minor sixth' }, { r: [8, 5], name: 'minor sixth' }, { r: [5, 3], name: 'major sixth' },
  { r: [7, 4], name: 'harmonic seventh' }, { r: [16, 9], name: 'minor seventh' }, { r: [9, 5], name: 'minor seventh' }, { r: [15, 8], name: 'major seventh' }, { r: [2, 1], name: 'octave' },
];
/** The nearest simple just interval to a size in cents, and the difference (cents − just). */
export function nearestJust(c: number): { ratio: string; name: string; just: number; dev: number } {
  let best = JUST_REF[0], bd = Infinity;
  for (const j of JUST_REF) { const d = Math.abs(c - cents(j.r[0] / j.r[1])); if (d < bd - 1e-9) { bd = d; best = j; } }
  const just = cents(best.r[0] / best.r[1]);
  return { ratio: `${best.r[0]}/${best.r[1]}`, name: best.name, just, dev: c - just };
}

/** A ratio or frequency typed as "5/4", "3:2", "1.25" or "440". NaN if not readable or not above zero. */
export function parseRatio(s: string): number {
  const t = s.trim().replace(',', '.').replace(/\s*(hz)$/i, '');
  const m = /^(\d+(?:\.\d+)?)\s*[/:]\s*(\d+(?:\.\d+)?)$/.exec(t);
  const v = m ? Number(m[1]) / Number(m[2]) : /^\d*\.?\d+(e[-+]?\d+)?$/i.test(t) ? Number(t) : NaN;
  return v > 0 && Number.isFinite(v) ? v : NaN;
}

export type Row = Degree & { name: string; hz: number; dev12: number; just: ReturnType<typeof nearestJust> };
/** The full table for a system: names, frequencies from the tonic frequency, deviation from 12-TET and from just. Includes the octave. */
export function table(s: System, tonicPc: number, f0: number): Row[] {
  const ds = [...degrees(s), { step: s.kind === 'edo' ? s.n : 12, ratio: 2, cents: 1200, frac: s.kind === 'edo' ? undefined : '2/1', pc: s.kind === 'edo' && s.n !== 12 ? undefined : 0 }];
  return ds.map((d) => {
    const near12 = Math.round(d.cents / 100);
    const name = d.pc != null ? NOTE_NAMES[(tonicPc + d.pc) % 12] : `step ${d.step}`;
    return { ...d, name: d.cents === 1200 ? `${NOTE_NAMES[tonicPc]} (octave)` : name, hz: f0 * d.ratio, dev12: d.cents - (d.pc != null && d.cents !== 1200 ? 100 * d.pc : 100 * near12), just: nearestJust(d.cents) };
  });
}
