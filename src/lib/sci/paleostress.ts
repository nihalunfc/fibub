// Paleostress inversion of fault-slip data by Michael's (1984) linear least-squares method: the deviatoric stress
// tensor whose shear traction on each fault points along its slip, assuming the same shear stress magnitude on every
// fault. Gives the principal axes, the stress ratio, the misfit angle per fault, bootstrap confidence and P and T
// axes. Vectors are (north, east, down), tension positive in the tensor, so σ1 (most compressive) is the axis of the
// most negative eigenvalue. Planes by strike and dip with the right-hand rule; rake by Aki and Richards (positive:
// reverse, negative: normal, 0 left-lateral, ±180 right-lateral).
import { vec, line, type Line, type Plane } from './stereonet.ts';

export type V3 = [number, number, number];
export type Sense = 'N' | 'R' | 'D' | 'S';
export type Fault = { plane: Plane; n: V3; s: V3; rake: number; offPlane?: number; row: number };
const RAD = Math.PI / 180;
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
const norm360 = (a: number) => ((a % 360) + 360) % 360;

/** Unit normal pointing up, into the hanging wall. */
export function normalUp(p: Plane): V3 {
  const d = (p.strike + 90) * RAD, s = Math.sin(p.dip * RAD);
  return [s * Math.cos(d), s * Math.sin(d), -Math.cos(p.dip * RAD)];
}
const strikeVec = (p: Plane): V3 => [Math.cos(p.strike * RAD), Math.sin(p.strike * RAD), 0];
const upDip = (p: Plane): V3 => { const d = vec({ trend: p.strike + 90, plunge: p.dip }); return [-d[0], -d[1], -d[2]]; };

/** Slip direction of the hanging wall from strike, dip and rake (Aki and Richards). */
export function slipFromRake(p: Plane, rake: number): V3 {
  const c = Math.cos(rake * RAD), s = Math.sin(rake * RAD), a = strikeVec(p), u = upDip(p);
  return [c * a[0] + s * u[0], c * a[1] + s * u[1], c * a[2] + s * u[2]];
}
/** Rake (Aki and Richards, −180 to 180) of a slip vector lying in a plane. */
export const rakeOf = (p: Plane, s: V3) => Math.atan2(dot(s, upDip(p)), dot(s, strikeVec(p))) / RAD;

/**
 * Slip of the hanging wall from a striation (trend, plunge) and the sense of movement. The striation is first
 * projected onto the plane; `offPlane` is how far it was from it. `weak` is set when the sense given hardly fixes
 * the direction (e.g. "normal" on a striation that is nearly horizontal).
 */
export function slipFromStriae(p: Plane, st: Line, sense: Sense) {
  const n = normalUp(p), l = vec(st) as V3, k = dot(l, n);
  const offPlane = Math.asin(Math.min(1, Math.abs(k))) / RAD;
  let s = unit([l[0] - k * n[0], l[1] - k * n[1], l[2] - k * n[2]]);
  const comp = sense === 'N' ? s[2] : sense === 'R' ? -s[2] : sense === 'D' ? -dot(s, strikeVec(p)) : dot(s, strikeVec(p));
  if (comp < 0) s = [-s[0], -s[1], -s[2]];
  const along = sense === 'N' || sense === 'R' ? Math.abs(s[2]) : Math.abs(dot(s, strikeVec(p)));
  return { s, offPlane, weak: along < Math.sin(10 * RAD) };
}

export type ParseResult = { faults: Fault[]; bad: { row: number; why: string }[]; warn: { row: number; why: string }[] };

/**
 * Read one fault per line: "strike dip rake" (format 'rake') or "strike dip trend plunge sense" with sense one of
 * N (normal), R (reverse or thrust), D (dextral), S (sinistral) (format 'striae'). With `dipDir`, the first number is
 * the dip direction. Commas, spaces, tabs or slashes separate; text after # is ignored.
 */
export function parseFaults(text: string, format: 'rake' | 'striae', dipDir = false, maxOff = 20): ParseResult {
  const faults: Fault[] = [], bad: ParseResult['bad'] = [], warn: ParseResult['warn'] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const row = i + 1, l = raw.replace(/#.*/, '').trim();
    if (!l) return;
    const tok = l.split(/[\s,;/\t]+/).filter(Boolean);
    const nums = tok.slice(0, format === 'rake' ? 3 : 4).map(Number);
    if (nums.length < (format === 'rake' ? 3 : 4) || !nums.every(Number.isFinite)) return bad.push({ row, why: format === 'rake' ? 'needs strike, dip and rake' : 'needs strike, dip, trend, plunge and a sense letter' });
    const plane: Plane = { strike: norm360(dipDir ? nums[0] - 90 : nums[0]), dip: nums[1] };
    if (!(plane.dip > 0 && plane.dip <= 90)) return bad.push({ row, why: 'dip must be above 0 and up to 90' });
    const n = normalUp(plane);
    if (format === 'rake') {
      if (!(nums[2] >= -180 && nums[2] <= 180)) return bad.push({ row, why: 'rake must be from −180 to 180' });
      faults.push({ plane, n, s: slipFromRake(plane, nums[2]), rake: nums[2], row });
    } else {
      const sense = (tok[4] ?? '').toUpperCase()[0] as Sense;
      if (!'NRDS'.includes(sense) || !sense) return bad.push({ row, why: 'sense must be N, R, D or S' });
      if (!(nums[3] >= 0 && nums[3] <= 90)) return bad.push({ row, why: 'plunge must be 0 to 90' });
      const r = slipFromStriae(plane, { trend: nums[2], plunge: nums[3] }, sense);
      if (r.offPlane > maxOff) return bad.push({ row, why: `the striation is ${r.offPlane.toFixed(0)}° off the fault plane` });
      if (r.offPlane > 5) warn.push({ row, why: `striation ${r.offPlane.toFixed(0)}° off the plane, projected onto it` });
      if (r.weak) warn.push({ row, why: `sense ${sense} hardly fits a striation of this direction; check it` });
      faults.push({ plane, n, s: r.s, rake: rakeOf(plane, r.s), offPlane: r.offPlane, row });
    }
  });
  return { faults, bad, warn };
}

/** Shear traction τ = σn − (n·σn)n for a symmetric tensor given as [s11, s12, s13, s22, s23, s33]. */
export function shear(t: number[], n: V3): V3 {
  const [a, b, c, d, e, f] = t;
  const tr: V3 = [a * n[0] + b * n[1] + c * n[2], b * n[0] + d * n[1] + e * n[2], c * n[0] + e * n[1] + f * n[2]];
  const k = dot(tr, n);
  return [tr[0] - k * n[0], tr[1] - k * n[1], tr[2] - k * n[2]];
}

// The five deviatoric basis tensors (trace zero): s11 − s33, s12, s13, s22 − s33, s23.
const BASIS = [[1, 0, 0, 0, 0, -1], [0, 1, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, -1], [0, 0, 0, 0, 1, 0]];

/** Solve the normal equations (5 × 5) by Gaussian elimination with partial pivoting; null if singular. */
function solve(M: number[][], v: number[]): number[] | null {
  const n = v.length, A = M.map((r, i) => [...r, v[i]]);
  const scale = Math.max(...M.map((r) => Math.max(...r.map(Math.abs)))) || 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if (Math.abs(A[p][c]) < 1e-10 * scale) return null;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k]; }
  }
  return A.map((r, i) => r[n] / r[i]);
}

/** Michael (1984): least-squares deviatoric tensor [s11, s12, s13, s22, s23, s33]; null if the faults do not fix it. */
export function michael(faults: { n: V3; s: V3 }[]): number[] | null {
  if (faults.length < 2) return null;
  const AtA = Array.from({ length: 5 }, () => new Array(5).fill(0)), Atb = new Array(5).fill(0);
  for (const f of faults) {
    const cols = BASIS.map((b) => shear(b, f.n));
    for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) { Atb[j] += cols[j][i] * f.s[i]; for (let k = 0; k < 5; k++) AtA[j][k] += cols[j][i] * cols[k][i]; }
  }
  const x = solve(AtA, Atb);
  if (!x) return null;
  return [x[0], x[1], x[2], x[3], x[4], -x[0] - x[3]];
}

/** Eigenvalues (ascending) and unit eigenvectors of a symmetric 3 × 3 tensor, by Jacobi rotations. */
export function eig3(t: number[]): { val: number[]; vec: V3[] } {
  const a = [[t[0], t[1], t[2]], [t[1], t[3], t[4]], [t[2], t[4], t[5]]];
  const v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let sweep = 0; sweep < 60; sweep++) {
    const off = Math.abs(a[0][1]) + Math.abs(a[0][2]) + Math.abs(a[1][2]);
    if (off < 1e-15 * (Math.abs(a[0][0]) + Math.abs(a[1][1]) + Math.abs(a[2][2]) + 1e-300)) break;
    for (const [p, q] of [[0, 1], [0, 2], [1, 2]]) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const tt = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(tt * tt + 1), s = tt * c;
      for (let k = 0; k < 3; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
      for (let k = 0; k < 3; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < 3; k++) { const vkp = v[k][p], vkq = v[k][q]; v[k][p] = c * vkp - s * vkq; v[k][q] = s * vkp + c * vkq; }
    }
  }
  const idx = [0, 1, 2].sort((i, j) => a[i][i] - a[j][j]);
  return { val: idx.map((i) => a[i][i]), vec: idx.map((i) => unit([v[0][i], v[1][i], v[2][i]])) };
}

export type Stress = {
  tensor: number[];
  /** σ1, σ2, σ3 as lines (lower hemisphere), most compressive first. */
  axes: [Line, Line, Line];
  vecs: [V3, V3, V3];
  /** Φ = (σ2 − σ3) / (σ1 − σ3), 0 to 1. R = 1 − Φ = (σ1 − σ2) / (σ1 − σ3). */
  phi: number;
};

export function stressOf(tensor: number[]): Stress {
  const e = eig3(tensor);
  const [l1, l2, l3] = e.val; // most negative (most compressive) first
  const phi = l3 - l1 > 0 ? (l3 - l2) / (l3 - l1) : NaN;
  return { tensor, axes: e.vec.map((x) => line(x)) as [Line, Line, Line], vecs: e.vec as [V3, V3, V3], phi };
}

/** The angle between each fault's observed slip and the shear traction of the tensor (0 to 180°). */
export function misfits(tensor: number[], faults: { n: V3; s: V3 }[]): number[] {
  return faults.map((f) => { const t = shear(tensor, f.n), l = Math.hypot(...t); return l > 0 ? Math.acos(Math.max(-1, Math.min(1, dot(t, f.s) / l))) / RAD : 90; });
}

/** P (shortening) and T (extension) axes of a fault: (n − s)/√2 and (n + s)/√2. */
export function ptAxes(f: { n: V3; s: V3 }) {
  return { P: line(unit([f.n[0] - f.s[0], f.n[1] - f.s[1], f.n[2] - f.s[2]])), T: line(unit([f.n[0] + f.s[0], f.n[1] + f.s[1], f.n[2] + f.s[2]])) };
}

/** A small seeded random number generator (mulberry32), so a bootstrap gives the same answer every time. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const angle = (a: V3, b: V3) => Math.acos(Math.min(1, Math.abs(dot(a, b)))) / RAD;
const quantile = (xs: number[], p: number) => { const s = xs.slice().sort((a, b) => a - b), h = (s.length - 1) * p, lo = Math.floor(h); return s[lo] + (s[Math.min(s.length - 1, lo + 1)] - s[lo]) * (h - lo); };

/**
 * Bootstrap: invert `n` resamples of the faults (drawn with replacement). Returns every resample's axes and Φ, and
 * the angles from the best-fit axes within which 95 % of the resampled axes fall, and the 95 % range of Φ.
 */
export function bootstrap(faults: { n: V3; s: V3 }[], best: Stress, n = 1000, seed = 1, level = 0.95) {
  const r = rng(seed), axes: [Line, Line, Line][] = [], phis: number[] = [], ang: number[][] = [[], [], []];
  let failed = 0;
  for (let k = 0; k < n; k++) {
    const smp = Array.from({ length: faults.length }, () => faults[Math.floor(r() * faults.length)]);
    const t = michael(smp);
    if (!t) { failed++; continue; }
    const s = stressOf(t);
    axes.push(s.axes); phis.push(s.phi);
    for (let i = 0; i < 3; i++) ang[i].push(angle(s.vecs[i], best.vecs[i]));
  }
  if (!phis.length) return null;
  const a = (1 - level) / 2;
  return { axes, phis, failed, cone: ang.map((x) => quantile(x, level)) as [number, number, number], phiLo: quantile(phis, a), phiHi: quantile(phis, 1 - a) };
}

/** A plain-words stress regime from which principal axis is closest to vertical. */
export function regime(s: Stress): string {
  const pl = s.axes.map((a) => a.plunge), k = pl.indexOf(Math.max(...pl));
  if (pl[k] < 45) return 'no axis near vertical (oblique)';
  return ['normal faulting (σ1 near vertical)', 'strike-slip faulting (σ2 near vertical)', 'reverse or thrust faulting (σ3 near vertical)'][k];
}
