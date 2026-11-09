// Colour-magnitude and Hertzsprung-Russell diagrams from a star list: absolute magnitudes from parallax or
// distance (with extinction and reddening), and an approximate effective temperature, bolometric correction,
// luminosity and radius from a black body seen at the effective wavelengths of the two colour bands and the
// magnitude band. The colour-temperature relation is a black body tied to one or two anchor points the user can
// edit (by default the Sun, and a colour-zero star near 9600 K); no calibration tables are used.
import { num, parseTable } from './num.ts';

const H = 6.62607015e-34, C = 2.99792458e8, KB = 1.380649e-23;
export const T_SUN = 5772; // K, IAU 2015 nominal solar effective temperature

/** Black-body spectral radiance B_λ (arbitrary scale is fine: only ratios are used), λ in nm. */
const planck = (lamNm: number, T: number) => { const l = lamNm * 1e-9; return 1 / l ** 5 / Math.expm1((H * C) / (l * KB * T)); };

/** Colour of a black body between bands at λ1 (blue) and λ2 (red), with no zero point: −2.5 log10(B(λ1)/B(λ2)). */
export const bbColour = (T: number, l1: number, l2: number) => -2.5 * Math.log10(planck(l1, T) / planck(l2, T));

export type System = {
  id: string; name: string; colour: string; mag: string;
  l1: number; l2: number; lm: number; // effective wavelengths, nm (rounded)
  sunColour: number; sunMag: number; // the Sun's colour and absolute magnitude in this system (rounded)
  zeroT: number | null; // temperature of a star with colour 0 (second anchor), or null for one anchor
  R: number; // A_mag / E(colour), rounded, editable
};
export const SYSTEMS: System[] = [
  { id: 'bv', name: 'Johnson B − V with V', colour: 'B − V', mag: 'V', l1: 445, l2: 551, lm: 551, sunColour: 0.65, sunMag: 4.83, zeroT: 9600, R: 3.1 },
  { id: 'gaia', name: 'Gaia BP − RP with G', colour: 'BP − RP', mag: 'G', l1: 510, l2: 780, lm: 640, sunColour: 0.82, sunMag: 4.67, zeroT: 9600, R: 2.0 },
  { id: 'gr', name: 'g − r with r', colour: 'g − r', mag: 'r', l1: 475, l2: 620, lm: 620, sunColour: 0.44, sunMag: 4.65, zeroT: 9600, R: 2.5 },
];

export type Scale = { l1: number; l2: number; lm: number; sunColour: number; sunMag: number; zeroT: number | null };

/** The anchored colour-temperature relation: colour(T) = s · bbColour(T) + z, through the Sun (and, with two
 *  anchors, through colour 0 at zeroT, which sets the stretch s; with one anchor s = 1, a pure black body). */
export function relation(sc: Scale) {
  const cs = bbColour(T_SUN, sc.l1, sc.l2);
  let s = 1;
  if (sc.zeroT != null) { const c0 = bbColour(sc.zeroT, sc.l1, sc.l2); s = sc.sunColour / (cs - c0); }
  const z = sc.sunColour - s * cs;
  const colour = (T: number) => s * bbColour(T, sc.l1, sc.l2) + z;
  return { s, z, colour };
}

export const T_MIN = 2000, T_MAX = 60000;
/** Effective temperature (K) for a colour, by bisection in log T on the anchored relation. NaN outside 2000–60000 K. */
export function teff(colour: number, sc: Scale) {
  const { colour: f, s } = relation(sc);
  if (!(s > 0) || !Number.isFinite(colour)) return NaN;
  let lo = Math.log(T_MIN), hi = Math.log(T_MAX);
  // colour falls as T rises.
  if (colour > f(T_MIN) || colour < f(T_MAX)) return NaN;
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (f(Math.exp(m)) > colour) lo = m; else hi = m; }
  return Math.exp((lo + hi) / 2);
}

/** Bolometric correction relative to the Sun's, BC(T) − BC(T☉), for a black body seen at λm:
 *  2.5 log10[(B_λm(T)/T⁴) / (B_λm(T☉)/T☉⁴)]. Negative for stars hotter or cooler than the band favours. */
export const dBC = (T: number, lm: number) => 2.5 * Math.log10((planck(lm, T) / T ** 4) / (planck(lm, T_SUN) / T_SUN ** 4));

/** log10 L/L☉ from the absolute magnitude in the band and Teff: −0.4 [(M − M☉) + BC(T) − BC(T☉)]. */
export const logL = (M: number, T: number, sc: Scale) => -0.4 * (M - sc.sunMag + dBC(T, sc.lm));
/** Radius in solar radii from L and T (Stefan-Boltzmann). */
export const radius = (lL: number, T: number) => Math.sqrt(10 ** lL) * (T_SUN / T) ** 2;

export const modulus = (dPc: number) => 5 * Math.log10(dPc) - 5;

// ---- Reading a star list ----
export type Columns = { name?: number; colour?: number; blue?: number; red?: number; mag?: number; plx?: number; plxErr?: number; dist?: number; A?: number; E?: number };
const norm = (h: string) => h.toLowerCase().replace(/[\s"'()]/g, '').replace(/−/g, '-');
/** Find the columns of a star list from its header row. */
export function findColumns(head: string[]): Columns {
  const c: Columns = {}, hs = head.map(norm);
  const pick = (k: keyof Columns, test: (h: string) => boolean) => { if (c[k] != null) return; const i = hs.findIndex((h, j) => test(h) && !Object.values(c).includes(j)); if (i >= 0) c[k] = i; };
  pick('name', (h) => /^(name|id|star|source_?id|designation|object)$/.test(h));
  pick('plxErr', (h) => /^(parallax_?err(or)?|e_?plx|plx_?err(or)?|sigma_?plx|e_?parallax|eplx|parallax_?sd)$/.test(h));
  pick('plx', (h) => /^(parallax|plx|varpi|parallax_?mas|plx_?mas)$/.test(h));
  pick('dist', (h) => /^(dist|distance|d|d_?pc|dist_?pc|distance_?pc|r_?pc|rpc)$/.test(h));
  pick('E', (h) => /^(e[_-]?\(?b-?v\)?|ebv|e_?bv|e[_-]?bp-?rp|ebprp|reddening|e_?colou?r|e)$/.test(h));
  pick('A', (h) => /^(a_?v|a_?g|a_?r|av|ag|ext|extinction|a_?mag|a)$/.test(h));
  pick('colour', (h) => /^(b-v|bv|b_?v|bp-rp|bp_?rp|bprp|g-r|g_?r|colou?r|ci|v-i|g-i|j-k)$/.test(h));
  pick('blue', (h) => /^(phot_?bp_?mean_?mag|bp|bpmag|b|bmag|g_?sdss|gmag_?sdss)$/.test(h));
  pick('red', (h) => /^(phot_?rp_?mean_?mag|rp|rpmag)$/.test(h));
  pick('mag', (h) => /^(v|vmag|g|gmag|phot_?g_?mean_?mag|mag|m|r|rmag|appmag|apparent)$/.test(h));
  // B and V given separately: colour = B − V.
  if (c.colour == null && c.blue == null) { const b = hs.indexOf('b'); if (b >= 0) c.blue = b; }
  if (c.colour == null && c.blue != null && c.red == null && c.mag != null) c.red = c.mag;
  if (c.colour == null && (c.blue == null || c.red == null)) { delete c.blue; delete c.red; }
  return c;
}

export type Star = { name: string; colour: number; mag: number; plx: number; plxErr: number; dist: number; A: number; E: number; line: number };
export type Parsed = { stars: Star[]; cols: Columns; headers: string[]; skipped: { line: number; why: string }[]; header: boolean };

/** Read a pasted table. Without a header the columns are taken as colour, magnitude, parallax (mas). */
export function parseStars(text: string): Parsed {
  const rows = parseTable(text);
  const out: Parsed = { stars: [], cols: {}, headers: [], skipped: [], header: false };
  if (!rows.length) return out;
  const nonNum = (x: string) => x !== '' && Number.isNaN(num(x));
  const header = rows[0].slice(1).some(nonNum) || (rows[0].length === 1 && nonNum(rows[0][0]));
  let cols: Columns;
  if (header) { cols = findColumns(rows[0]); out.headers = rows[0]; }
  else {
    // Columns of numbers; a first column that is not a number is a name.
    const nameCol = Number.isNaN(num(rows[0][0])) ? 0 : -1, o = nameCol + 1;
    cols = { ...(nameCol === 0 ? { name: 0 } : {}), colour: o, mag: o + 1, plx: o + 2 };
    out.headers = rows[0].map((_, i) => `Column ${i + 1}`);
  }
  out.cols = cols; out.header = header;
  const body = header ? rows.slice(1) : rows;
  body.forEach((r, k) => {
    const line = k + (header ? 2 : 1);
    const g = (i?: number) => (i == null ? NaN : num(r[i]));
    const colour = cols.colour != null ? g(cols.colour) : g(cols.blue) - g(cols.red);
    const s: Star = { name: cols.name != null ? (r[cols.name] ?? '').trim() : '', colour, mag: g(cols.mag), plx: g(cols.plx), plxErr: g(cols.plxErr), dist: g(cols.dist), A: g(cols.A), E: g(cols.E), line };
    if (!s.name) s.name = `Star ${line - (header ? 1 : 0)}`;
    if (!Number.isFinite(s.colour) || !Number.isFinite(s.mag)) { out.skipped.push({ line, why: 'no colour or magnitude' }); return; }
    out.stars.push(s);
  });
  return out;
}

export type Options = {
  distance: 'each' | 'one'; // per-star parallax or distance, or one distance for every star
  onePc: number; // with 'one'
  plxOffset: number; // mas added to every parallax (a zero-point correction)
  E: number; R: number; // reddening for stars without their own E, and A = R × E
  maxRelErr: number; // parallax error ratio above which a star is flagged (0.2 = 20 %)
  sc: Scale;
};

export type Result = Star & {
  d: number; mu: number; Ause: number; Euse: number; c0: number; M: number; sigM: number; flagged: boolean;
  T: number; lL: number; Rs: number; why: string;
};

/** Absolute magnitudes, dereddened colours and the black-body Teff, L and R of each star. */
export function analyse(stars: Star[], o: Options): { rows: Result[]; skipped: { line: number; name: string; why: string }[] } {
  const rows: Result[] = [], skipped: { line: number; name: string; why: string }[] = [];
  for (const s of stars) {
    let d = NaN, sigM = NaN, flagged = false;
    if (o.distance === 'one') d = o.onePc;
    else if (Number.isFinite(s.plx)) {
      const p = s.plx + o.plxOffset;
      if (!(p > 0)) { skipped.push({ line: s.line, name: s.name, why: `parallax ${s.plx} mas is not positive${o.plxOffset ? ' after the offset' : ''}` }); continue; }
      d = 1000 / p;
      if (Number.isFinite(s.plxErr) && s.plxErr >= 0) { sigM = (5 / Math.LN10) * (s.plxErr / p); flagged = s.plxErr / p > o.maxRelErr; }
    } else if (Number.isFinite(s.dist)) {
      if (!(s.dist > 0)) { skipped.push({ line: s.line, name: s.name, why: 'distance is not positive' }); continue; }
      d = s.dist;
    } else { skipped.push({ line: s.line, name: s.name, why: 'no parallax or distance' }); continue; }
    const Euse = Number.isFinite(s.E) ? s.E : o.E;
    const Ause = Number.isFinite(s.A) ? s.A : o.R * Euse;
    const mu = modulus(d), M = s.mag - mu - Ause, c0 = s.colour - Euse;
    const T = teff(c0, o.sc), lL = Number.isFinite(T) ? logL(M, T, o.sc) : NaN;
    rows.push({ ...s, d, mu, Ause, Euse, c0, M, sigM, flagged, T, lL, Rs: Number.isFinite(lL) ? radius(lL, T) : NaN, why: Number.isFinite(T) ? '' : 'colour outside the 2000–60000 K range' });
  }
  return { rows, skipped };
}

// ---- A made-up cluster for the example ----
/** A seeded random number generator (Park-Miller) and a standard normal from it. */
function rng(seed: number) { let s = seed; const u = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; return { u, n: () => Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u()) }; }

/** A synthetic open cluster in the B − V / V system: a made-up main sequence (rough power laws L ∝ M^3.8,
 *  R ∝ M^0.8, not fitted to any catalogue), unresolved binaries, a few giants and white dwarfs, at 250 pc
 *  with E(B − V) = 0.05, Gaia-like parallax errors and photometric scatter. Returned as a table of text. */
export function syntheticCluster(n = 160, seed = 11): string {
  const r = rng(seed), sc: Scale = { ...SYSTEMS[0], zeroT: SYSTEMS[0].zeroT };
  const rel = relation(sc), dPc = 250, E = 0.05, Rv = 3.1, plx = 1000 / dPc;
  const lines = ['name,B-V,V,parallax,parallax_error'];
  const add = (name: string, T: number, lL: number, extra = 0) => {
    // Inverse of the analysis: absolute V from L and T, then apparent V and observed colour.
    const M = sc.sunMag - 2.5 * lL - dBC(T, sc.lm) - extra;
    const V = M + modulus(dPc) + Rv * E + 0.01 * r.n(), BV = rel.colour(T) + E + 0.01 * r.n();
    const pe = 0.02 + 0.004 * Math.max(0, V - 10) ** 1.5, p = plx + pe * r.n();
    lines.push([name, BV.toFixed(3), V.toFixed(3), p.toFixed(4), pe.toFixed(4)].join(','));
  };
  for (let i = 0; i < n; i++) {
    const m = 0.45 * (3.2 / 0.45) ** (r.u() ** 1.8); // more low-mass stars than high-mass ones
    const lL = 3.8 * Math.log10(m), Rr = m ** 0.8, T = T_SUN * (10 ** lL) ** 0.25 / Math.sqrt(Rr);
    add(`MS-${i + 1}`, T, lL, r.u() < 0.25 ? 0.75 * r.u() : 0); // a quarter are unresolved binaries, up to 0.75 mag brighter
  }
  for (let i = 0; i < 8; i++) add(`Giant-${i + 1}`, 4700 + 300 * r.n(), 1.7 + 0.15 * r.n());
  for (let i = 0; i < 4; i++) add(`WD-${i + 1}`, 9000 + 2500 * r.u(), -2.6 + 0.2 * r.n());
  return lines.join('\n') + '\n';
}
