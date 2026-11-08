// Copolymerisation (terminal model): Mayo–Lewis composition, azeotrope, composition drift with conversion (Skeist),
// and reactivity ratios from low-conversion data by Fineman–Ross, Kelen–Tüdős and non-linear least squares.

/** Instantaneous mole fraction of monomer 1 in the copolymer at feed fraction f1. */
export function F1(f1: number, r1: number, r2: number) {
  const f2 = 1 - f1, num = r1 * f1 * f1 + f1 * f2, den = r1 * f1 * f1 + 2 * f1 * f2 + r2 * f2 * f2;
  return den ? num / den : f1;
}
/** Feed fraction where copolymer and feed match (both ratios below 1 or both above), else null. */
export const azeotrope = (r1: number, r2: number) => { const d = 2 - r1 - r2; if (Math.abs(d) < 1e-12) return null; const f = (1 - r2) / d; return f > 0 && f < 1 && (r1 - 1) * (r2 - 1) > 0 ? f : null; };

export function behaviour(r1: number, r2: number) {
  const p = r1 * r2;
  if (r1 < 0.05 && r2 < 0.05) return 'strongly alternating';
  if (Math.abs(p - 1) < 0.15) return 'close to ideal (random): r₁r₂ ≈ 1';
  if (r1 > 1 && r2 > 1) return 'blocky: each radical prefers its own monomer';
  if (p < 0.3) return 'tends to alternate: r₁r₂ well below 1';
  return 'random with some alternating tendency';
}

const linfit = (x: number[], y: number[]) => {
  const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0; x.forEach((xi, i) => { sxy += (xi - mx) * (y[i] - my); sxx += (xi - mx) ** 2; });
  const s = sxy / sxx; return { slope: s, intercept: my - s * mx };
};
const GH = (f1: number[], Fc: number[]) => f1.map((f, i) => { const x = f / (1 - f), y = Fc[i] / (1 - Fc[i]); return { G: (x * (y - 1)) / y, H: (x * x) / y }; });

/** Fineman–Ross: G = r1·H − r2. */
export function finemanRoss(f1: number[], Fc: number[]) { const p = GH(f1, Fc), l = linfit(p.map((q) => q.H), p.map((q) => q.G)); return { r1: l.slope, r2: -l.intercept }; }
/** Kelen–Tüdős: η = (r1 + r2/α)ξ − r2/α with α = √(Hmin·Hmax). */
export function kelenTudos(f1: number[], Fc: number[]) {
  const p = GH(f1, Fc), Hs = p.map((q) => q.H), a = Math.sqrt(Math.min(...Hs) * Math.max(...Hs));
  const l = linfit(p.map((q) => q.H / (a + q.H)), p.map((q) => q.G / (a + q.H)));
  return { r1: l.slope + l.intercept, r2: -a * l.intercept, alpha: a, points: p.map((q) => ({ xi: q.H / (a + q.H), eta: q.G / (a + q.H) })) };
}
/** Non-linear least squares on F1 (Nelder–Mead in log r), starting from Kelen–Tüdős. */
export function fitNLLS(f1: number[], Fc: number[]) {
  const sse = (r1: number, r2: number) => f1.reduce((s, f, i) => s + (F1(f, r1, r2) - Fc[i]) ** 2, 0);
  const kt = kelenTudos(f1, Fc), st = [Math.log(Math.max(kt.r1, 1e-3)), Math.log(Math.max(kt.r2, 1e-3))];
  const g = (v: number[]) => sse(Math.exp(v[0]), Math.exp(v[1]));
  let s = [st, [st[0] + 0.5, st[1]], [st[0], st[1] + 0.5]].map((v) => ({ v, y: g(v) }));
  for (let it = 0; it < 2000; it++) {
    s.sort((a, b) => a.y - b.y);
    if (Math.abs(s[2].y - s[0].y) < 1e-18 && it > 50) break;
    const c = [(s[0].v[0] + s[1].v[0]) / 2, (s[0].v[1] + s[1].v[1]) / 2], w = s[2].v;
    const at = (k: number) => { const v = [c[0] + k * (w[0] - c[0]), c[1] + k * (w[1] - c[1])]; return { v, y: g(v) }; };
    const r = at(-1);
    if (r.y < s[0].y) { const e = at(-2); s[2] = e.y < r.y ? e : r; }
    else if (r.y < s[1].y) s[2] = r;
    else { const k = at(r.y < s[2].y ? -0.5 : 0.5); if (k.y < Math.min(r.y, s[2].y)) s[2] = k; else s = [s[0], ...s.slice(1).map((p) => { const v = [(p.v[0] + s[0].v[0]) / 2, (p.v[1] + s[0].v[1]) / 2]; return { v, y: g(v) }; })]; }
  }
  s.sort((a, b) => a.y - b.y);
  const r1 = Math.exp(s[0].v[0]), r2 = Math.exp(s[0].v[1]);
  return { r1, r2, rms: Math.sqrt(s[0].y / f1.length) };
}

/** Composition drift in a batch (Skeist): feed f1, instantaneous F1 and cumulative F̄1 against conversion X. */
export function drift(r1: number, r2: number, f10: number, Xmax = 0.95, steps = 4000) {
  const out = [{ X: 0, f1: f10, F1: F1(f10, r1, r2), Fbar: F1(f10, r1, r2) }];
  // ln(1 − X) = ∫ df1 / (F1 − f1): march in f1 with small steps (RK4 in f1 for ln(1 − X)).
  let f = f10, L = 0; const dir = Math.sign(f10 - F1(f10, r1, r2)) || 0; // f1 moves away from F1
  if (!dir) { for (let k = 1; k <= 20; k++) { const X = (Xmax * k) / 20; out.push({ X, f1: f10, F1: F1(f10, r1, r2), Fbar: F1(f10, r1, r2) }); } return out; }
  const dLdf = (x: number) => 1 / (F1(x, r1, r2) - x), h = (dir * 1) / steps;
  for (let i = 0; i < steps; i++) {
    const fn = f + h; if (fn <= 1e-6 || fn >= 1 - 1e-6) break;
    const k1 = dLdf(f), k2 = dLdf(f + h / 2), k4 = dLdf(fn);
    if (!Number.isFinite(k1) || !Number.isFinite(k4) || Math.sign(F1(fn, r1, r2) - fn) !== Math.sign(F1(f, r1, r2) - f)) break;
    L += (h / 6) * (k1 + 4 * k2 + k4); f = fn;
    const X = 1 - Math.exp(L); if (X > Xmax) break;
    out.push({ X, f1: f, F1: F1(f, r1, r2), Fbar: (f10 - f * (1 - X)) / X });
  }
  return out;
}

/** Literature reactivity ratios (Polymer Handbook, about 60 °C, bulk or solution; they vary with conditions). */
export const PAIRS = [
  { id: 'S-MMA', m1: 'Styrene', m2: 'Methyl methacrylate', r1: 0.52, r2: 0.46 },
  { id: 'S-AN', m1: 'Styrene', m2: 'Acrylonitrile', r1: 0.4, r2: 0.04 },
  { id: 'S-Bd', m1: 'Styrene', m2: 'Butadiene', r1: 0.58, r2: 1.35 },
  { id: 'S-MAh', m1: 'Styrene', m2: 'Maleic anhydride', r1: 0.02, r2: 0 },
  { id: 'VC-VAc', m1: 'Vinyl chloride', m2: 'Vinyl acetate', r1: 1.68, r2: 0.23 },
];
