// Fixed-time signal timing by Webster's method (Webster 1958, Road Research Technical Paper 39): flow ratios
// y = q/s, the critical (largest) ratio in each phase, Y = Σy, lost time L, optimum cycle C0 = (1.5L + 5)/(1 − Y),
// effective greens in proportion to the critical ratios, and Webster's delay formula for each approach.
// Queues: vehicles arriving in the effective red, q·r, and the back of the queue when it has just cleared,
// q·r / (1 − y), for uniform arrivals. For study and planning. No DOM.

export type Approach = { name: string; phase: number; q: number; s: number };
export type Phase = { phase: number; y: number; crit: string; lost: number; inter: number; g: number; G: number };
export type ApproachResult = Approach & { y: number; g: number; lambda: number; cap: number; x: number; d: number; qRed: number; qMax: number };

/** Webster's average delay per vehicle (s): uniform, random and the empirical correction term. q in veh/h. */
export function websterDelay(C: number, g: number, q: number, s: number) {
  const lam = g / C, qs = q / 3600, x = q / (s * lam);
  if (!(x < 1)) return { x, d: Infinity };
  const d = (C * (1 - lam) ** 2) / (2 * (1 - lam * x)) + (x * x) / (2 * qs * (1 - x)) - 0.65 * Math.cbrt(C / (qs * qs)) * x ** (2 + 5 * lam);
  return { x, d };
}

export type TimingOpts = { round?: number; cMin?: number; cMax?: number; cycle?: number };

/**
 * Time the signal. `lost` and `inter` map each phase number to its lost time and its intergreen (yellow plus all-red),
 * both in seconds. With `cycle` given, that cycle is used instead of Webster's optimum.
 */
export function webster(apps: Approach[], lost: Record<number, number>, inter: Record<number, number>, o: TimingOpts = {}) {
  if (!apps.length) throw new Error('Give at least one approach.');
  const phases = [...new Set(apps.map((a) => a.phase))].sort((a, b) => a - b);
  if (phases.length < 2) throw new Error('A signal needs at least 2 phases.');
  const P: Phase[] = phases.map((p) => {
    const inP = apps.filter((a) => a.phase === p);
    const best = inP.reduce((b, a) => (a.q / a.s > b.q / b.s ? a : b));
    return { phase: p, y: best.q / best.s, crit: best.name, lost: lost[p] ?? 4, inter: inter[p] ?? 4, g: 0, G: 0 };
  });
  const Y = P.reduce((s, p) => s + p.y, 0), L = P.reduce((s, p) => s + p.lost, 0);
  const cMinX = Y < 1 ? L / (1 - Y) : Infinity;
  const C0 = Y < 1 ? (1.5 * L + 5) / (1 - Y) : Infinity;
  let C = o.cycle ?? C0, note = '';
  if (o.cycle === undefined && Number.isFinite(C)) {
    if (o.round && o.round > 0) C = Math.ceil(C / o.round - 1e-9) * o.round;
    if (o.cMin !== undefined && C < o.cMin) { C = o.cMin; note = 'raised to your shortest cycle'; }
    if (o.cMax !== undefined && C > o.cMax) { C = o.cMax; note = 'cut to your longest cycle'; }
  }
  const gt = C - L;
  for (const p of P) { p.g = Y > 0 ? (p.y / Y) * gt : gt / P.length; p.G = p.g + p.lost - p.inter; }
  const A: ApproachResult[] = apps.map((a) => {
    const p = P.find((x) => x.phase === a.phase)!, w = websterDelay(C, p.g, a.q, a.s);
    const y = a.q / a.s, qRed = (a.q / 3600) * (C - p.g);
    return { ...a, y, g: p.g, lambda: p.g / C, cap: a.s * p.g / C, x: w.x, d: w.d, qRed, qMax: y < 1 ? qRed / (1 - y) : Infinity };
  });
  const Q = A.reduce((s, a) => s + a.q, 0), dAvg = A.reduce((s, a) => s + a.q * a.d, 0) / Q;
  return { P, A, Y, L, C0, C, cMinX, note, X: Y * C / gt, dAvg, totalDelay: Q * dAvg / 3600 };
}

/** Average intersection delay at a range of cycle lengths, greens split as above (for the delay-cycle curve). */
export function delayCurve(apps: Approach[], lost: Record<number, number>, inter: Record<number, number>, C: number[]) {
  return C.map((c) => { try { const r = webster(apps, lost, inter, { cycle: c }); return r.A.every((a) => a.x < 1) ? r.dAvg : NaN; } catch { return NaN; } });
}
