// Altermagnet band explorer: minimal 2D tight-binding models whose bands split by spin in a d- or g-wave pattern while the
// net moment stays zero. Lattice constant 1, energies in units of the hopping. No DOM.
//
// Two-sublattice model (square lattice, sublattices A and B with opposite moments): each sublattice hops more easily
// along one axis (ta along x on A and along y on B, tb the other way), and A and B are linked by t1.
//   H_σ(k) = [[εA(k) + σJ, tAB(k)], [tAB(k), εB(k) − σJ]] − μ
//   εA = −2 ta cos kx − 2 tb cos ky,  εB = −2 tb cos kx − 2 ta cos ky,  tAB = −4 t1 cos(kx/2) cos(ky/2)
// Swapping the sublattices needs a 90° rotation, so the spin splitting follows cos kx − cos ky (d-wave).
//
// One-band effective model: E_σ(k) = −2t (cos kx + cos ky) + 4t′ cos kx cos ky − μ + σ J f(k), with f a d- or g-wave form.

export type Model =
  | { kind: 'two'; t1: number; ta: number; tb: number; J: number; mu: number }
  | { kind: 'one'; t: number; tp: number; J: number; mu: number; form: 'dx2y2' | 'dxy' | 'g' };

export const FORMS = {
  dx2y2: { name: 'd-wave, cos kx − cos ky', f: (x: number, y: number) => Math.cos(x) - Math.cos(y) },
  dxy: { name: 'd-wave, sin kx sin ky', f: (x: number, y: number) => Math.sin(x) * Math.sin(y) },
  g: { name: 'g-wave, sin kx sin ky (cos kx − cos ky)', f: (x: number, y: number) => Math.sin(x) * Math.sin(y) * (Math.cos(x) - Math.cos(y)) },
};

/** Band energies for spin σ = +1 (up) or −1 (down) at (kx, ky), lowest first. */
export function bands(m: Model, kx: number, ky: number, s: 1 | -1): number[] {
  if (m.kind === 'one') return [-2 * m.t * (Math.cos(kx) + Math.cos(ky)) + 4 * m.tp * Math.cos(kx) * Math.cos(ky) - m.mu + s * m.J * FORMS[m.form].f(kx, ky)];
  const ea = -2 * m.ta * Math.cos(kx) - 2 * m.tb * Math.cos(ky), eb = -2 * m.tb * Math.cos(kx) - 2 * m.ta * Math.cos(ky);
  const tab = -4 * m.t1 * Math.cos(kx / 2) * Math.cos(ky / 2), mid = (ea + eb) / 2 - m.mu, half = (ea - eb) / 2 + s * m.J;
  const r = Math.sqrt(half * half + tab * tab);
  return [mid - r, mid + r];
}

/** Weight of sublattice A in each eigenstate (for the two-sublattice model), lowest band first. */
export function weightA(m: Model & { kind: 'two' }, kx: number, ky: number, s: 1 | -1) {
  const ea = -2 * m.ta * Math.cos(kx) - 2 * m.tb * Math.cos(ky), eb = -2 * m.tb * Math.cos(kx) - 2 * m.ta * Math.cos(ky);
  const tab = -4 * m.t1 * Math.cos(kx / 2) * Math.cos(ky / 2), half = (ea - eb) / 2 + s * m.J, r = Math.hypot(half, tab);
  const w = r > 0 ? 0.5 * (1 - half / r) : 0.5; // lower band
  return [w, 1 - w];
}

export const nBands = (m: Model) => (m.kind === 'one' ? 1 : 2);

/** The usual path Y–Γ–X–M–Γ through the square Brillouin zone, with tick positions. */
export function kPath(n = 60) {
  const P: [string, number, number][] = [['Y', 0, Math.PI], ['Γ', 0, 0], ['X', Math.PI, 0], ['M', Math.PI, Math.PI], ['Γ', 0, 0]];
  const pts: { x: number; kx: number; ky: number }[] = [], ticks: { at: number; label: string }[] = [];
  let s = 0;
  for (let i = 0; i < P.length - 1; i++) {
    const [, x0, y0] = P[i], [, x1, y1] = P[i + 1], L = Math.hypot(x1 - x0, y1 - y0), steps = Math.max(2, Math.round((n * L) / Math.PI));
    ticks.push({ at: s, label: P[i][0] });
    for (let j = 0; j < steps; j++) { const u = j / steps; pts.push({ x: s + u * L, kx: x0 + u * (x1 - x0), ky: y0 + u * (y1 - y0) }); }
    s += L;
  }
  pts.push({ x: s, kx: 0, ky: 0 }); ticks.push({ at: s, label: 'Γ' });
  return { pts, ticks, length: s };
}

/** Energies on an n × n grid of the zone (−π..π), per spin and band: grid[s][b][j * n + i]. */
export function grid(m: Model, n: number) {
  const nb = nBands(m), out = [0, 1].map(() => Array.from({ length: nb }, () => new Float64Array(n * n)));
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const kx = -Math.PI + (2 * Math.PI * (i + 0.5)) / n, ky = -Math.PI + (2 * Math.PI * (j + 0.5)) / n;
    const up = bands(m, kx, ky, 1), dn = bands(m, kx, ky, -1);
    for (let b = 0; b < nb; b++) { out[0][b][j * n + i] = up[b]; out[1][b][j * n + i] = dn[b]; }
  }
  return out;
}

/** Spin-resolved density of states (states per energy per cell per spin) by histogram, and the states below each energy. */
export function dos(g: Float64Array[][], n: number, bins = 120) {
  let lo = Infinity, hi = -Infinity;
  for (const s of g) for (const b of s) for (const e of b) { if (e < lo) lo = e; if (e > hi) hi = e; }
  const w = (hi - lo) / bins || 1, up = new Float64Array(bins), dn = new Float64Array(bins);
  g[0].forEach((b) => b.forEach((e) => { up[Math.min(bins - 1, Math.floor((e - lo) / w))] += 1; }));
  g[1].forEach((b) => b.forEach((e) => { dn[Math.min(bins - 1, Math.floor((e - lo) / w))] += 1; }));
  const norm = 1 / (n * n * w);
  for (let i = 0; i < bins; i++) { up[i] *= norm; dn[i] *= norm; }
  return { lo, hi, w, up, dn, e: Array.from({ length: bins }, (_, i) => lo + (i + 0.5) * w) };
}

/** Electrons per cell per spin below energy 0 (the chemical potential is already subtracted). */
export function filling(g: Float64Array[][], n: number) {
  return g.map((s) => s.reduce((t, b) => t + b.reduce((u, e) => u + (e < 0 ? 1 : 0), 0), 0) / (n * n));
}

/** Largest spin splitting E↑ − E↓ of each band on the grid, with where it happens. */
export function maxSplit(m: Model, n = 120) {
  const nb = nBands(m), best = Array.from({ length: nb }, () => ({ d: 0, kx: 0, ky: 0 }));
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
    const kx = -Math.PI + (2 * Math.PI * i) / n, ky = -Math.PI + (2 * Math.PI * j) / n, u = bands(m, kx, ky, 1), d = bands(m, kx, ky, -1);
    for (let b = 0; b < nb; b++) { const v = u[b] - d[b]; if (Math.abs(v) > Math.abs(best[b].d)) best[b] = { d: v, kx, ky }; }
  }
  return best;
}

/** Marching squares: line segments where the field crosses level 0 on an n × n cell-centred grid over −π..π. */
export function contour(f: Float64Array, n: number, level = 0) {
  const seg: [number, number, number, number][] = [], h = (2 * Math.PI) / n, X = (i: number) => -Math.PI + (i + 0.5) * h;
  const v = (i: number, j: number) => f[((j + n) % n) * n + ((i + n) % n)] - level;
  for (let j = -1; j < n; j++) for (let i = -1; i < n; i++) {
    const a = v(i, j), b = v(i + 1, j), c = v(i + 1, j + 1), d = v(i, j + 1);
    const pts: [number, number][] = [];
    const edge = (p: number, q: number, x0: number, y0: number, x1: number, y1: number) => { if ((p < 0) !== (q < 0)) { const t = p / (p - q); pts.push([x0 + t * (x1 - x0), y0 + t * (y1 - y0)]); } };
    edge(a, b, X(i), X(j), X(i + 1), X(j)); edge(b, c, X(i + 1), X(j), X(i + 1), X(j + 1)); edge(d, c, X(i), X(j + 1), X(i + 1), X(j + 1)); edge(a, d, X(i), X(j), X(i), X(j + 1));
    if (pts.length === 2) seg.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
    else if (pts.length === 4) { seg.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]); seg.push([pts[2][0], pts[2][1], pts[3][0], pts[3][1]]); }
  }
  return seg;
}
