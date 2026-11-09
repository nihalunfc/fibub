// Op-amp circuit calculator: ideal gains of the classic circuits, and their frequency response with a single-pole
// op-amp model A(s) = A0 / (1 + s/ωa), ωa = 2π GBW / A0, from the feedback factor β. No DOM.

export type Config = 'inv' | 'noninv' | 'diff' | 'sum' | 'int' | 'dif';
export type Params = {
  config: Config;
  /** Resistances in ohms. inv: r1 in, rf feedback. noninv: r1 to ground, rf feedback. diff: r1, rf (= R2), r3, r4. sum: rs (inputs), rf. int: r1, c, rf (optional, parallel with C). dif: r1 (optional series with C), c, rf. */
  r1: number; rf: number; r3?: number; r4?: number; rs?: number[]; c?: number;
};
type C = { re: number; im: number };
const cx = (re: number, im = 0): C => ({ re, im });
const add = (a: C, b: C): C => cx(a.re + b.re, a.im + b.im);
const mul = (a: C, b: C): C => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const div = (a: C, b: C): C => { const m = b.re * b.re + b.im * b.im; return cx((a.re * b.re + a.im * b.im) / m, (a.im * b.re - a.re * b.im) / m); };
const par = (a: C, b: C): C => div(mul(a, b), add(a, b));
const inv = (a: C) => div(cx(1), a);

/** Input and feedback impedances at angular frequency w (input impedance Zi from the source to the − input, Zf from output to − input). */
function zz(p: Params, w: number): { zi: C; zf: C } {
  const s = cx(0, w);
  const zc = (C: number) => inv(mul(s, cx(C)));
  if (p.config === 'int') {
    const zf = Number.isFinite(p.rf) && p.rf > 0 ? par(zc(p.c!), cx(p.rf)) : zc(p.c!);
    return { zi: cx(p.r1), zf };
  }
  if (p.config === 'dif') return { zi: add(cx(p.r1 > 0 ? p.r1 : 0), zc(p.c!)), zf: cx(p.rf) };
  return { zi: cx(p.r1), zf: cx(p.rf) };
}

/** Feedback factor β = Zg / (Zg + Zf), Zg being everything from the − input to ground or sources. */
function beta(p: Params, w: number): C {
  if (p.config === 'sum') { const zg = p.rs!.map((r) => cx(r)).reduce(par); return div(zg, add(zg, cx(p.rf))); }
  const { zi, zf } = zz(p, w);
  return div(zi, add(zi, zf));
}

/** Ideal (infinite-gain) transfer from each input to the output at angular frequency w. */
export function idealGains(p: Params, w = 0): C[] {
  const { zi, zf } = zz(p, w || 1e-30);
  const m = (x: C, k: number) => cx(x.re * k, x.im * k);
  switch (p.config) {
    case 'inv': case 'int': case 'dif': return [m(div(zf, zi), -1)];
    case 'noninv': return [add(cx(1), div(zf, zi))];
    case 'diff': { const k = p.r4! / (p.r3! + p.r4!); return [cx(-p.rf / p.r1), cx(k * (1 + p.rf / p.r1))]; }
    case 'sum': return p.rs!.map((r) => cx(-p.rf / r));
  }
}

/** Real op-amp response: each ideal gain times Aβ / (1 + Aβ), with the single-pole A(jw). */
export function realGains(p: Params, w: number, gbw: number, a0 = 1e5): C[] {
  const wa = (2 * Math.PI * gbw) / a0, A = div(cx(a0), cx(1, w / wa)), Ab = mul(A, beta(p, w)), f = div(Ab, add(cx(1), Ab));
  return idealGains(p, w).map((g) => mul(g, f));
}

/** Noise gain 1/β at DC (or at w for the frequency-dependent circuits). */
export function noiseGain(p: Params, w = 0): number {
  const b = beta(p, w || 1e-30);
  return 1 / Math.hypot(b.re, b.im);
}

/** Closed-loop −3 dB bandwidth estimate GBW / noise gain (single-pole op-amp, resistive feedback). */
export const bandwidth = (gbw: number, ng: number) => gbw / ng;

/** Full-power bandwidth: the highest frequency at which a sine of peak vpk is not slew-limited. sr in V/s. */
export const fullPower = (sr: number, vpk: number) => sr / (2 * Math.PI * vpk);

/** Common-mode rejection of a difference amplifier from its resistor values (dB); Infinity when the ratios match. */
export function diffCmrr(r1: number, r2: number, r3: number, r4: number): number {
  const ad = 0.5 * (r2 / r1 + (r4 / (r3 + r4)) * (1 + r2 / r1)), acm = (r4 / (r3 + r4)) * (1 + r2 / r1) - r2 / r1;
  return Math.abs(acm) < 1e-15 * ad ? Infinity : 20 * Math.log10(Math.abs(ad / acm));
}

/** Worst-case CMRR of a difference amplifier built from resistors of tolerance tol (fraction): 20 log((1 + G) / (4 tol)). */
export const diffCmrrWorst = (g: number, tol: number) => 20 * Math.log10((1 + g) / (4 * tol));

/** Clip a value to the output swing [lo, hi]. */
export const clip = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** −3 dB frequency of |H| relative to its low-frequency value, by bisection in log f between f1 and f2 (NaN if none). */
export function f3db(h: (f: number) => number, f1: number, f2: number): number {
  const ref = h(f1), target = ref / Math.SQRT2;
  if (!(h(f2) < target)) return NaN;
  let a = Math.log(f1), b = Math.log(f2);
  for (let i = 0; i < 100; i++) { const m = (a + b) / 2; if (h(Math.exp(m)) > target) a = m; else b = m; }
  return Math.exp((a + b) / 2);
}
