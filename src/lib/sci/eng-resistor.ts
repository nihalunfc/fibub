// Resistor colour code (IEC 60062 band meanings), E-series preferred values (IEC 60063) and a voltage divider
// designer that picks standard pairs. No DOM.

export type Colour = { name: string; hex: string; digit?: number; mult?: number; tol?: number; tc?: number };
/** The band colours with their digit, multiplier, tolerance (%) and temperature coefficient (ppm/K). */
export const COLOURS: Colour[] = [
  { name: 'black', hex: '#000000', digit: 0, mult: 1, tc: 250 },
  { name: 'brown', hex: '#7b4a12', digit: 1, mult: 10, tol: 1, tc: 100 },
  { name: 'red', hex: '#d62728', digit: 2, mult: 100, tol: 2, tc: 50 },
  { name: 'orange', hex: '#ff7f0e', digit: 3, mult: 1e3, tol: 0.05, tc: 15 },
  { name: 'yellow', hex: '#ffd60a', digit: 4, mult: 1e4, tol: 0.02, tc: 25 },
  { name: 'green', hex: '#2ca02c', digit: 5, mult: 1e5, tol: 0.5, tc: 20 },
  { name: 'blue', hex: '#1f5fd6', digit: 6, mult: 1e6, tol: 0.25, tc: 10 },
  { name: 'violet', hex: '#8e44ad', digit: 7, mult: 1e7, tol: 0.1, tc: 5 },
  { name: 'grey', hex: '#8c8c8c', digit: 8, mult: 1e8, tol: 0.01, tc: 1 },
  { name: 'white', hex: '#ffffff', digit: 9, mult: 1e9 },
  { name: 'gold', hex: '#c9a227', mult: 0.1, tol: 5 },
  { name: 'silver', hex: '#c0c0c0', mult: 0.01, tol: 10 },
  { name: 'pink', hex: '#f4a6c1', mult: 0.001 },
  { name: 'none', hex: '', tol: 20 },
];
export const colour = (name: string) => COLOURS.find((c) => c.name === name);

export type Decoded = { ohms: number; tol: number; tc?: number; digits: number[] };

/** Read 3, 4, 5 or 6 bands (the first band is the one nearest an end). 3 bands means no tolerance band (±20 %). */
export function decode(bands: string[]): Decoded {
  const n = bands.length;
  if (n < 3 || n > 6) throw new Error('A resistor has 3 to 6 bands.');
  const nd = n <= 4 ? 2 : 3;
  const digits = bands.slice(0, nd).map((b) => { const c = colour(b); if (c?.digit === undefined) throw new Error(`${b} cannot be a digit band.`); return c.digit; });
  const m = colour(bands[nd]);
  if (m?.mult === undefined) throw new Error(`${bands[nd]} cannot be a multiplier band.`);
  let tol = 20, tc: number | undefined;
  if (n >= 4) { const t = colour(bands[nd + 1]); if (t?.tol === undefined) throw new Error(`${bands[nd + 1]} cannot be a tolerance band.`); tol = t.tol; }
  if (n === 6) { const t = colour(bands[5]); if (t?.tc === undefined) throw new Error(`${bands[5]} cannot be a temperature coefficient band.`); tc = t.tc; }
  const sig = digits.reduce((s, d) => s * 10 + d, 0);
  return { ohms: +(sig * m.mult).toPrecision(12), tol, tc, digits };
}

/** Bands for a value: `nd` significant digits (2 for 4-band, 3 for 5 and 6-band). `exact` is false when the value had to be rounded. */
export function encode(ohms: number, nd: 2 | 3): { digits: string[]; mult: string; value: number; exact: boolean } {
  if (!(ohms > 0)) throw new Error('Give a resistance above zero.');
  let e = Math.floor(Math.log10(ohms) + 1e-9) - (nd - 1);
  let sig = Math.round(ohms / 10 ** e);
  if (sig >= 10 ** nd) { sig = Math.round(sig / 10); e++; }
  if (e < -3) throw new Error(`The smallest value with ${nd} digit bands is ${10 ** (nd - 1) / 1000} Ω (pink multiplier).`);
  if (e > 9) throw new Error('That is above the largest colour-coded value (white multiplier).');
  const value = +(sig * 10 ** e).toPrecision(12);
  const digits = String(sig).padStart(nd, '0').split('').map((d) => COLOURS[+d].name);
  const mult = COLOURS.find((c) => c.mult !== undefined && Math.abs(Math.log10(c.mult) - e) < 1e-9)!.name;
  return { digits, mult, value, exact: Math.abs(value / ohms - 1) < 1e-9 };
}

const E24 = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];
/** The mantissas (1 to under 10) of an E series: E3, E6, E12 and E24 from the E24 list, E48, E96 and E192 from 10^(i/n) to 3 figures (E192 uses 9.20). */
export function series(n: number): number[] {
  if ([3, 6, 12, 24].includes(n)) return E24.filter((_, i) => i % (24 / n) === 0);
  if (![48, 96, 192].includes(n)) throw new Error('Series are E3, E6, E12, E24, E48, E96 and E192.');
  return Array.from({ length: n }, (_, i) => { const v = +(10 ** (i / n)).toPrecision(3); return n === 192 && Math.abs(v - 9.19) < 1e-9 ? 9.2 : v; });
}
/** Usual tolerance of each series (%). */
export const SERIES_TOL: Record<number, number> = { 3: 40, 6: 20, 12: 10, 24: 5, 48: 2, 96: 1, 192: 0.5 };

/** Every value of a series between lo and hi ohms (inclusive). */
export function seriesValues(n: number, lo: number, hi: number): number[] {
  const m = series(n), out: number[] = [];
  for (let d = Math.floor(Math.log10(lo)) - 1; d <= Math.ceil(Math.log10(hi)); d++) for (const x of m) { const v = +(x * 10 ** d).toPrecision(6); if (v >= lo * (1 - 1e-12) && v <= hi * (1 + 1e-12)) out.push(v); }
  return out;
}

/** Nearest series values below and above a value, and the nearest of them (by ratio, i.e. in log scale). */
export function nearest(ohms: number, n: number): { below: number; above: number; best: number; err: number } {
  const vals = seriesValues(n, ohms / 20, ohms * 20);
  const below = vals.filter((v) => v <= ohms * (1 + 1e-12)).pop()!, above = vals.find((v) => v >= ohms * (1 - 1e-12))!;
  const best = ohms / below <= above / ohms ? below : above;
  return { below, above, best, err: (best / ohms - 1) * 100 };
}

/** Whether a value is in a series (to 3 figures). */
export function inSeries(ohms: number, n: number): boolean {
  const e = Math.floor(Math.log10(ohms) + 1e-9), m = +(ohms / 10 ** e).toPrecision(3);
  return series(n).some((x) => Math.abs(x - m) < 1e-9);
}

export type Pair = { r1: number; r2: number; vout: number; err: number; i: number; p1: number; p2: number; lo: number; hi: number };

/**
 * Divider pairs: R1 from the input to the output, R2 from the output to ground, optional load RL across R2.
 * Searches every pair in the series with R1 + R2 between tmin and tmax, sorted by output error. lo/hi: the
 * output if both resistors are at the opposite ends of their tolerance.
 */
export function divider(vin: number, vout: number, n: number, tmin: number, tmax: number, load = Infinity, tolPct = SERIES_TOL[n], count = 8): Pair[] {
  if (!(vin > 0) || !(vout > 0) || !(vout < vin)) throw new Error('The output must be between 0 and the input voltage.');
  if (!(tmin > 0 && tmax >= tmin)) throw new Error('Give a total resistance range, smallest first.');
  const vals = seriesValues(n, tmin / 1e4, tmax);
  const par = (a: number, b: number) => (Number.isFinite(b) ? (a * b) / (a + b) : a);
  const out = (r1: number, r2: number) => { const r2l = par(r2, load); return (vin * r2l) / (r1 + r2l); };
  const res: Pair[] = [];
  const t = tolPct / 100;
  for (const r1 of vals) for (const r2 of vals) {
    const tot = r1 + r2;
    if (tot < tmin * (1 - 1e-12) || tot > tmax * (1 + 1e-12)) continue;
    const v = out(r1, r2), i = (vin - v) / r1;
    res.push({ r1, r2, vout: v, err: (v / vout - 1) * 100, i, p1: i * i * r1, p2: (v * v) / r2, lo: out(r1 * (1 + t), r2 * (1 - t)), hi: out(r1 * (1 - t), r2 * (1 + t)) });
  }
  // Pairs that only differ by a power of ten give the same output (without a load): keep the one whose total is
  // nearest the middle of the range (in log terms).
  const mid = Math.sqrt(tmin * tmax), far = (p: Pair) => Math.abs(Math.log(p.r1 + p.r2) - Math.log(mid));
  res.sort((a, b) => Math.abs(a.err) - Math.abs(b.err) || far(a) - far(b));
  const kept: Pair[] = [];
  for (const p of res) { if (!kept.some((k) => Math.abs(k.vout / p.vout - 1) < 1e-12)) kept.push(p); if (kept.length >= count) break; }
  return kept;
}

/** Ohms with a k or M prefix as resistors are marked: 4700 → "4.7 kΩ". */
export function ohmText(r: number): string {
  const [d, p] = r >= 1e9 ? [1e9, 'G'] : r >= 1e6 ? [1e6, 'M'] : r >= 1e3 ? [1e3, 'k'] : [1, ''];
  return `${+(r / d).toPrecision(6)} ${p}Ω`;
}

/** A typed resistance: 4700, 4.7k, 4k7, 4K7, 4R7, 1M5, 2.2 MΩ, 470 ohm. NaN if not understood. */
export function parseOhms(s: string): number {
  const t = s.trim().replace(/\s+/g, '').replace(/(ohms?|Ω)$/i, '').replace(',', '.');
  const code = /^(\d*)([RKMG])(\d*)$/i.exec(t);
  const mul: Record<string, number> = { r: 1, k: 1e3, m: 1e6, g: 1e9 };
  if (code && (code[1] || code[3])) return Number(`${code[1] || '0'}.${code[3] || '0'}`) * mul[code[2].toLowerCase()];
  const m = /^((?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)([kKmMgG]?)$/.exec(t);
  if (!m) return NaN;
  // In resistor values m means mega (there are no milliohm colour codes); "meg" is handled by the line above failing.
  return Number(m[1]) * (m[2] ? mul[m[2].toLowerCase()] : 1);
}
