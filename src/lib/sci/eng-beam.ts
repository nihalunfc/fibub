// Straight beams under point loads, distributed loads and applied moments: reactions, shear force, bending
// moment, slope and deflection. Euler-Bernoulli finite elements (Hermite cubics, consistent loads) with a node
// at every support, load point and load end, so nodal deflections are exact; shear and moment come from statics
// with the solved reactions. Any consistent units (e.g. N, m, N·m², or kN, m, kN·m²).

/** pin: no vertical movement; fixed: no movement and no rotation. */
export type Support = { x: number; kind: 'pin' | 'fixed' };
/** Loads act downward when positive; moments are clockwise when positive. A distributed load goes from x to x2 with
 * intensity w at x and w2 at x2 (force per length, linear between). */
export type Load = { kind: 'point'; x: number; P: number } | { kind: 'moment'; x: number; C: number } | { kind: 'dist'; x: number; x2: number; w: number; w2: number };
export type Reaction = { x: number; kind: 'pin' | 'fixed'; R: number; M: number };
export type BeamResult = {
  reactions: Reaction[];
  /** Mesh node positions with deflection v (up positive) and slope θ (counter-clockwise positive, radians). */
  x: number[]; v: number[]; theta: number[];
  /** Diagram points: positions (a jump shows as two points at one x) with shear V (up on the left part
   * positive) and bending moment M (sagging positive). */
  dx: number[]; V: number[]; M: number[];
  vmax: { x: number; v: number }; Mmax: { x: number; M: number }; Mmin: { x: number; M: number }; Vabs: { x: number; V: number };
  /** Out-of-balance force and moment after solving: should be ~0. */
  check: number;
};

const GX = [-Math.sqrt(3 / 5), 0, Math.sqrt(3 / 5)].map((g) => (g + 1) / 2), GW = [5 / 18, 8 / 18, 5 / 18];
/** Intensity of a distributed load at s (0 outside it). */
const wAt = (l: Load & { kind: 'dist' }, s: number) => (s < l.x || s > l.x2 ? 0 : l.x2 === l.x ? l.w : l.w + ((l.w2 - l.w) * (s - l.x)) / (l.x2 - l.x));

export function solveBeam(L: number, EI: number, supports: Support[], loads: Load[], segments = 240): BeamResult {
  if (!(L > 0) || !(EI > 0)) throw new Error('Give a positive length and stiffness.');
  for (const s of supports) if (!(s.x >= 0 && s.x <= L)) throw new Error('Supports must be on the beam.');
  for (const l of loads) {
    if (!(l.x >= 0 && l.x <= L)) throw new Error('Loads must be on the beam.');
    if (l.kind === 'dist' && !(l.x2 > l.x && l.x2 <= L)) throw new Error('A distributed load needs an end after its start, on the beam.');
  }
  // Nodes: a uniform grid plus every key point.
  const keys = [0, L, ...supports.map((s) => s.x), ...loads.flatMap((l) => (l.kind === 'dist' ? [l.x, l.x2] : [l.x]))];
  const raw = [...keys]; for (let i = 1; i < segments; i++) raw.push((L * i) / segments);
  raw.sort((a, b) => a - b);
  const tol = L * 1e-9, xs: number[] = [];
  for (const v of raw) if (!xs.length || v - xs[xs.length - 1] > tol) xs.push(v);
  const nn = xs.length, n = 2 * nn;
  const node = (x: number) => { let lo = 0, hi = nn - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (xs[m] <= x + tol) lo = m; else hi = m; } return Math.abs(xs[hi] - x) <= tol ? hi : lo; };
  // Banded stiffness (half bandwidth 3) kept as a dense row store limited to the band.
  const B = 4, K = new Float64Array(n * B), F = new Float64Array(n);
  const kAdd = (i: number, j: number, v: number) => { if (j >= i) K[i * B + (j - i)] += v; };
  const ke = (l: number) => { const a = EI / l ** 3; return [[12, 6 * l, -12, 6 * l], [6 * l, 4 * l * l, -6 * l, 2 * l * l], [-12, -6 * l, 12, -6 * l], [6 * l, 2 * l * l, -6 * l, 4 * l * l]].map((r) => r.map((v) => v * a)); };
  const dists = loads.filter((l): l is Load & { kind: 'dist' } => l.kind === 'dist');
  const feq: number[][] = [];
  for (let e = 0; e < nn - 1; e++) {
    const l = xs[e + 1] - xs[e], k = ke(l), d = [2 * e, 2 * e + 1, 2 * e + 2, 2 * e + 3];
    for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) kAdd(d[a], d[b], k[a][b]);
    const f = [0, 0, 0, 0];
    if (dists.length) for (let g = 0; g < 3; g++) {
      const t = GX[g], s = xs[e] + t * l;
      let q = 0; for (const dl of dists) if (s > dl.x && s < dl.x2) q -= wAt(dl, s);
      if (!q) continue;
      const N = [1 - 3 * t * t + 2 * t ** 3, l * (t - 2 * t * t + t ** 3), 3 * t * t - 2 * t ** 3, l * (-t * t + t ** 3)];
      for (let a = 0; a < 4; a++) f[a] += GW[g] * l * q * N[a];
    }
    feq.push(f);
    for (let a = 0; a < 4; a++) F[d[a]] += f[a];
  }
  for (const l of loads) {
    if (l.kind === 'point') F[2 * node(l.x)] -= l.P;
    if (l.kind === 'moment') F[2 * node(l.x) + 1] -= l.C;
  }
  const fixed = new Set<number>();
  for (const s of supports) { const i = node(s.x); fixed.add(2 * i); if (s.kind === 'fixed') fixed.add(2 * i + 1); }
  const Kf = K.slice(), Ff = F.slice();
  let big = 0; for (let i = 0; i < n; i++) big = Math.max(big, Math.abs(K[i * B]));
  for (const i of fixed) { for (let j = Math.max(0, i - 3); j <= i; j++) Kf[j * B + (i - j)] = 0; for (let c = 0; c < B; c++) Kf[i * B + c] = 0; Kf[i * B] = big; Ff[i] = 0; }
  // Symmetric banded Gaussian elimination (no pivoting; the matrix is positive definite once supported).
  for (let k = 0; k < n; k++) {
    const p = Kf[k * B];
    if (!(Math.abs(p) > big * 1e-12)) throw new Error('The beam is not held in place: add supports so it cannot move or spin freely.');
    for (let i = k + 1; i < Math.min(n, k + B); i++) {
      const f = Kf[k * B + (i - k)] / p; if (!f) continue;
      for (let j = i; j < Math.min(n, k + B); j++) Kf[i * B + (j - i)] -= f * Kf[k * B + (j - k)];
      Ff[i] -= f * Ff[k];
    }
  }
  const u = new Float64Array(n);
  for (let k = n - 1; k >= 0; k--) { let s = Ff[k]; for (let j = k + 1; j < Math.min(n, k + B); j++) s -= Kf[k * B + (j - k)] * u[j]; u[k] = s / Kf[k * B]; }
  // Reactions: K u − F at the held DOFs.
  const Ku = new Float64Array(n);
  for (let i = 0; i < n; i++) for (let c = 0; c < B && i + c < n; c++) { const kij = K[i * B + c]; if (!kij) continue; Ku[i] += kij * u[i + c]; if (c) Ku[i + c] += kij * u[i]; }
  const reactions: Reaction[] = supports.map((s) => { const i = node(s.x); return { x: xs[i], kind: s.kind, R: Ku[2 * i] - F[2 * i], M: s.kind === 'fixed' ? -(Ku[2 * i + 1] - F[2 * i + 1]) : 0 }; });
  // Merge supports at one node (e.g. two pins entered at the same place) so statics counts each reaction once.
  const seen = new Set<number>(); const rx = reactions.filter((r) => { const k = node(r.x); if (seen.has(k)) return false; seen.add(k); return true; });
  // Shear and moment by statics on the part left of a cut (forces strictly left, or up to and including x).
  const VMat = (x: number, incl: boolean) => {
    let V = 0, M = 0;
    const left = (p: number) => (incl ? p <= x + tol : p < x - tol);
    for (const r of rx) if (left(r.x)) { V += r.R; M += r.R * (x - r.x) + r.M; }
    for (const l of loads) {
      if (l.kind === 'point' && left(l.x)) { V -= l.P; M -= l.P * (x - l.x); }
      if (l.kind === 'moment' && left(l.x)) M += l.C;
      if (l.kind === 'dist' && x > l.x) {
        const e = Math.min(x, l.x2), m = (l.x + e) / 2, w0 = wAt(l, l.x), wm = wAt(l, m), we = wAt(l, e), h = e - l.x;
        V -= (h / 6) * (w0 + 4 * wm + we);
        M -= (h / 6) * (w0 * (x - l.x) + 4 * wm * (x - m) + we * (x - e));
      }
    }
    return [V, M];
  };
  const jumps = new Set<number>([...rx.map((r) => node(r.x)), ...loads.filter((l) => l.kind !== 'dist').map((l) => node(l.x))]);
  const dx: number[] = [], V: number[] = [], M: number[] = [];
  // Round-off (about 1e-9 of the loads) is snapped to zero so an unloaded end reads 0, not −7 × 10⁻⁸.
  const fs = Math.max(1e-30, ...rx.map((r) => Math.abs(r.R)), ...loads.map((l) => Math.abs(l.kind === 'point' ? l.P : l.kind === 'moment' ? l.C / L : Math.max(Math.abs(l.w), Math.abs(l.w2)) * L)));
  const snap = (v: number, s: number) => (Math.abs(v) < 1e-7 * s ? 0 : v);
  const push = (x: number, incl: boolean) => { const [a, b] = VMat(x, incl); dx.push(x); V.push(snap(a, fs)); M.push(snap(b, fs * L)); };
  for (let i = 0; i < nn; i++) { if (jumps.has(i) && i > 0) push(xs[i], false); push(xs[i], true); }
  // Zero-shear points between samples, where moment peaks under distributed loads.
  const extra: number[] = [];
  for (let i = 1; i < dx.length; i++) if (dx[i] > dx[i - 1] && V[i - 1] * V[i] < 0) extra.push(dx[i - 1] + ((dx[i] - dx[i - 1]) * V[i - 1]) / (V[i - 1] - V[i]));
  let Mmax = { x: 0, M: -Infinity }, Mmin = { x: 0, M: Infinity }, Vabs = { x: 0, V: 0 };
  const cand = [...dx.map((x, i) => [x, M[i]]), ...extra.map((x) => [x, snap(VMat(x, true)[1], fs * L)])];
  for (const [x, m] of cand) { if (m > Mmax.M) Mmax = { x, M: m }; if (m < Mmin.M) Mmin = { x, M: m }; }
  for (let i = 0; i < dx.length; i++) if (Math.abs(V[i]) > Math.abs(Vabs.V)) Vabs = { x: dx[i], V: V[i] };
  const v: number[] = [], theta: number[] = [];
  for (let i = 0; i < nn; i++) { v.push(u[2 * i]); theta.push(u[2 * i + 1]); }
  let vmax = { x: 0, v: 0 }; for (let i = 0; i < nn; i++) if (Math.abs(v[i]) > Math.abs(vmax.v)) vmax = { x: xs[i], v: v[i] };
  // Balance check: shear and moment just right of the beam's end should be zero.
  const [Ve, Me] = VMat(L, true);
  return { reactions: rx, x: xs, v, theta, dx, V, M, vmax, Mmax, Mmin, Vabs, check: Math.max(Math.abs(Ve), Math.abs(Me) / L) / fs };
}

export type SectionShape = { kind: 'rect'; b: number; h: number } | { kind: 'circle'; d: number; di?: number } | { kind: 'I'; h: number; bf: number; tf: number; tw: number } | { kind: 'custom'; I: number; c: number; A: number };
/** Second moment of area I about the bending axis, distance c to the outer fibre, area A, section modulus Z = I/c,
 * and the factor k for the largest shear stress, τ = k V / A (web average for an I-section). */
export function sectionProps(s: SectionShape): { I: number; c: number; A: number; Z: number; k: number } {
  let I: number, c: number, A: number, k: number;
  if (s.kind === 'rect') { if (!(s.b > 0 && s.h > 0)) throw new Error('Give the width and depth.'); I = (s.b * s.h ** 3) / 12; c = s.h / 2; A = s.b * s.h; k = 1.5; }
  else if (s.kind === 'circle') {
    const di = s.di ?? 0; if (!(s.d > 0 && di >= 0 && di < s.d)) throw new Error('Give the diameter (and an inner diameter smaller than it for a tube).');
    I = (Math.PI * (s.d ** 4 - di ** 4)) / 64; c = s.d / 2; A = (Math.PI * (s.d ** 2 - di ** 2)) / 4;
    // Solid round 4/3; thin tube 2; in between (the exact neutral-axis value for a hollow circle).
    const r2 = s.d / 2, r1 = di / 2; k = (4 / 3) * (r2 * r2 + r2 * r1 + r1 * r1) / (r2 * r2 + r1 * r1);
  } else if (s.kind === 'I') {
    if (!(s.h > 0 && s.bf > 0 && s.tf > 0 && s.tw > 0 && 2 * s.tf < s.h && s.tw <= s.bf)) throw new Error('Check the I-section: flanges thinner than half the depth, web no wider than the flange.');
    const hw = s.h - 2 * s.tf; I = (s.bf * s.h ** 3 - (s.bf - s.tw) * hw ** 3) / 12; c = s.h / 2; A = 2 * s.bf * s.tf + hw * s.tw; k = A / (s.h * s.tw);
  } else { if (!(s.I > 0 && s.c > 0 && s.A > 0)) throw new Error('Give I, c and the area.'); I = s.I; c = s.c; A = s.A; k = 1.5; }
  return { I, c, A, Z: I / c, k };
}
