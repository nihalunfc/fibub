// Analog filter design: Butterworth and Chebyshev type I poles, second-order sections (f0, Q), unity-gain
// Sallen-Key component values, first-order RC/RL sections and doubly terminated LC ladders (g-values). No DOM.

export type Kind = 'butter' | 'cheby';
export type Resp = 'lp' | 'hp';
export type Pole = { re: number; im: number };

/** Poles of the normalised low-pass prototype (passband edge at 1 rad/s), left half plane, upper half first. */
export function protoPoles(n: number, kind: Kind, rippleDb = 1): Pole[] {
  if (!(n >= 1 && n <= 12 && Number.isInteger(n))) throw new Error('Choose an order from 1 to 12.');
  const out: Pole[] = [];
  if (kind === 'butter') {
    for (let k = 1; k <= n; k++) { const th = (Math.PI * (2 * k + n - 1)) / (2 * n); out.push({ re: Math.cos(th), im: Math.sin(th) }); }
  } else {
    if (!(rippleDb > 0 && rippleDb <= 6)) throw new Error('Choose a passband ripple between 0.01 and 6 dB.');
    const eps = Math.sqrt(10 ** (rippleDb / 10) - 1), mu = Math.asinh(1 / eps) / n;
    for (let k = 1; k <= n; k++) { const th = (Math.PI * (2 * k - 1)) / (2 * n); out.push({ re: -Math.sinh(mu) * Math.sin(th), im: Math.cosh(mu) * Math.cos(th) }); }
  }
  return out.map((p) => ({ re: p.re, im: Math.abs(p.im) < 1e-12 ? 0 : p.im }));
}

export type Stage = { order: 1 | 2; w0: number; q: number };
/** Sections of the prototype: one per complex pair (w0 = |p|, Q = |p| / (2 |Re p|)) and one first-order for a real pole, lowest Q first. */
export function stages(n: number, kind: Kind, rippleDb = 1): Stage[] {
  const ps = protoPoles(n, kind, rippleDb), out: Stage[] = [];
  for (const p of ps) {
    if (p.im > 0) { const w = Math.hypot(p.re, p.im); out.push({ order: 2, w0: w, q: w / (2 * -p.re) }); }
    else if (p.im === 0) out.push({ order: 1, w0: -p.re, q: 0.5 });
  }
  return out.sort((a, b) => a.order - b.order || a.q - b.q);
}

/** Complex response of the cascade at angular frequency w, for corner wc (rad/s). Unity gain at DC (lp) or high frequency (hp). */
export function response(st: Stage[], resp: Resp, wc: number, w: number): { re: number; im: number } {
  let re = 1, im = 0;
  for (const s of st) {
    // Low-pass at the normalised frequency x = w/wc; high-pass replaces x by wc/w (s → 1/s), which conjugates.
    const x = resp === 'lp' ? w / wc : wc / w;
    let nr: number, ni: number;
    if (s.order === 1) { const d = s.w0; const dr = d, di = x; const m = dr * dr + di * di; nr = (d * dr) / m; ni = (-d * di) / m; }
    else { const w2 = s.w0 * s.w0, dr = w2 - x * x, di = (x * s.w0) / s.q, m = dr * dr + di * di; nr = (w2 * dr) / m; ni = (-w2 * di) / m; }
    if (resp === 'hp') ni = -ni;
    const r2 = re * nr - im * ni; im = re * ni + im * nr; re = r2;
  }
  return { re, im };
}

/** Lowest order that gives at least `attenDb` at frequency ratio `ratio` (stopband ÷ corner for low-pass, corner ÷ stopband for high-pass). */
export function minOrder(kind: Kind, rippleDb: number, attenDb: number, ratio: number): number {
  if (!(ratio > 1)) return NaN;
  const a = Math.sqrt(10 ** (attenDb / 10) - 1);
  // Butterworth corner is the −3 dB point (ε = 1).
  if (kind === 'butter') return Math.max(1, Math.ceil(Math.log(a) / Math.log(ratio) - 1e-9));
  const eps = Math.sqrt(10 ** (rippleDb / 10) - 1);
  return Math.max(1, Math.ceil(Math.acosh(a / eps) / Math.acosh(ratio) - 1e-9));
}

export type SkParts = { stage: number; order: 1 | 2; f0: number; q: number; r1: number; r2: number; c1: number; c2: number };
/**
 * Unity-gain Sallen-Key values for each stage. Low-pass: equal resistors R1 = R2, C2 (to ground) = C, C1 (feedback)
 * = 4Q²C. High-pass: equal capacitors C1 = C2 = C, R1 (feedback) = 1/(2 Q w0 C), R2 (to ground) = 2Q/(w0 C).
 * First-order stages: R = 1/(w0 C). wc in rad/s.
 */
export function sallenKey(st: Stage[], resp: Resp, wc: number, C: number): SkParts[] {
  return st.map((s, i) => {
    // Pole frequency in rad/s: low-pass scales up by wc; high-pass maps w0 → wc / w0.
    const w = resp === 'lp' ? s.w0 * wc : wc / s.w0, f0 = w / (2 * Math.PI);
    if (s.order === 1) { const R = 1 / (w * C); return { stage: i + 1, order: 1, f0, q: 0.5, r1: R, r2: NaN, c1: C, c2: NaN }; }
    if (resp === 'lp') { const R = 1 / (w * C * 2 * s.q); return { stage: i + 1, order: 2, f0, q: s.q, r1: R, r2: R, c1: 4 * s.q * s.q * C, c2: C }; }
    return { stage: i + 1, order: 2, f0, q: s.q, r1: 1 / (2 * s.q * w * C), r2: (2 * s.q) / (w * C), c1: C, c2: C };
  });
}

/** Response of one built Sallen-Key stage from its actual parts (for checking rounded values). */
export function skStageResponse(p: SkParts, resp: Resp, w: number): { re: number; im: number } {
  if (p.order === 1) { const t = w * p.r1 * p.c1; const m = 1 + t * t; return resp === 'lp' ? { re: 1 / m, im: -t / m } : { re: (t * t) / m, im: t / m }; }
  // LP: 1 / (s²R1R2C1C2 + s C2 (R1 + R2) + 1). HP: s²R1R2C1C2 / (s²R1R2C1C2 + s R1 (C1 + C2) + 1).
  const a = p.r1 * p.r2 * p.c1 * p.c2, b = resp === 'lp' ? p.c2 * (p.r1 + p.r2) : p.r1 * (p.c1 + p.c2);
  const dr = 1 - a * w * w, di = b * w, m = dr * dr + di * di;
  const nr = resp === 'lp' ? 1 : -a * w * w;
  return { re: (nr * dr) / m, im: (-nr * di) / m };
}

/** Low-pass prototype element values g1..gn and the load ratio g(n+1) (Butterworth, or Chebyshev with ripple). */
export function gValues(n: number, kind: Kind, rippleDb = 1): { g: number[]; gLoad: number } {
  const g: number[] = [];
  if (kind === 'butter') { for (let k = 1; k <= n; k++) g.push(2 * Math.sin(((2 * k - 1) * Math.PI) / (2 * n))); return { g, gLoad: 1 }; }
  const beta = Math.log(1 / Math.tanh((rippleDb * Math.LN10) / 40)), gam = Math.sinh(beta / (2 * n));
  const a = (k: number) => Math.sin(((2 * k - 1) * Math.PI) / (2 * n)), b = (k: number) => gam * gam + Math.sin((k * Math.PI) / n) ** 2;
  g.push((2 * a(1)) / gam);
  for (let k = 2; k <= n; k++) g.push((4 * a(k - 1) * a(k)) / (b(k - 1) * g[k - 2]));
  return { g, gLoad: n % 2 ? 1 : 1 / Math.tanh(beta / 4) ** 2 };
}

export type LadderPart = { name: string; kind: 'L' | 'C'; where: 'series' | 'shunt'; value: number };
/**
 * Doubly terminated LC ladder between source resistance R and load R × gLoad (or R ÷ gLoad when the ladder starts
 * with a shunt capacitor and the order is even). Low-pass: series L = gR/wc, shunt C = g/(R wc). High-pass swaps
 * each to its dual: series C = 1/(g R wc), shunt L = R/(g wc).
 */
export function ladder(n: number, kind: Kind, rippleDb: number, resp: Resp, wc: number, R: number, first: 'shunt' | 'series'): { parts: LadderPart[]; rLoad: number } {
  const { g, gLoad } = gValues(n, kind, rippleDb);
  const parts: LadderPart[] = [];
  let nl = 0, nc = 0;
  g.forEach((gk, i) => {
    const shunt = (i % 2 === 0) === (first === 'shunt');
    if (resp === 'lp') {
      if (shunt) parts.push({ name: `C${++nc}`, kind: 'C', where: 'shunt', value: gk / (R * wc) });
      else parts.push({ name: `L${++nl}`, kind: 'L', where: 'series', value: (gk * R) / wc });
    } else {
      if (shunt) parts.push({ name: `L${++nl}`, kind: 'L', where: 'shunt', value: R / (gk * wc) });
      else parts.push({ name: `C${++nc}`, kind: 'C', where: 'series', value: 1 / (gk * R * wc) });
    }
  });
  // g(n+1) is a resistance ratio when the last element is a shunt capacitor, a conductance ratio after a series inductor.
  const lastShunt = parts[parts.length - 1].where === 'shunt';
  return { parts, rLoad: lastShunt ? R * gLoad : R / gLoad };
}

/** A SPICE-style netlist of the ladder with its source and load resistors, input node "in", output "out". */
export function ladderNetlist(parts: LadderPart[], R: number, rLoad: number): string {
  const lines = ['V1 src 0 AC 1', `RS src n0 ${R}`];
  let node = 0;
  for (const p of parts) {
    if (p.where === 'shunt') lines.push(`${p.name} n${node} 0 ${p.value}`);
    else { lines.push(`${p.name} n${node} n${node + 1} ${p.value}`); node++; }
  }
  lines.push(`RL n${node} 0 ${rLoad}`);
  return lines.join('\n').replace(new RegExp(`\\bn${node}\\b`, 'g'), 'out').replace(/\bn0\b/g, 'in');
}
