// Random walks and diffusion: seeded lattice or Gaussian walks in 1, 2 or 3 dimensions, ensemble mean square
// displacement (MSD), fitting D from MSD = 2 d D t (+ offset), the anomalous exponent, and time-averaged MSD of
// pasted particle tracks. No DOM.

/** Seeded random numbers (mulberry32) and standard normal deviates (Box-Muller). */
export function rng(seed: number) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let spare: number | null = null;
  const n = () => { if (spare !== null) { const s = spare; spare = null; return s; } let x = 0; while (x === 0) x = u(); const r = Math.sqrt(-2 * Math.log(x)), th = 2 * Math.PI * u(); spare = r * Math.sin(th); return r * Math.cos(th); };
  return { u, n };
}

export type Sim = { dim: 1 | 2 | 3; walkers: number; steps: number; a: number; dt: number; kind: 'lattice' | 'gaussian'; seed: number; keep?: number };
/**
 * Runs the walk. Lattice: each step moves ±a along one randomly chosen axis. Gaussian: each coordinate moves by a
 * normal deviate of standard deviation a/√d, so the mean square step is a² either way and D = a² / (2 d dt).
 * Returns MSD at every step (ensemble mean), the first `keep` paths and every walker's final position.
 */
export function simulate(o: Sim) {
  const r = rng(o.seed), d = o.dim, keep = Math.min(o.keep ?? 10, o.walkers), sd = o.a / Math.sqrt(d);
  const msd = new Float64Array(o.steps + 1), paths: number[][][] = [], finals: number[][] = [];
  for (let w = 0; w < o.walkers; w++) {
    const p = [0, 0, 0], path: number[][] = [];
    if (w < keep) path.push(p.slice(0, d));
    for (let s = 1; s <= o.steps; s++) {
      if (o.kind === 'lattice') { const ax = Math.floor(r.u() * d), dir = r.u() < 0.5 ? -1 : 1; p[ax] += dir * o.a; }
      else for (let k = 0; k < d; k++) p[k] += sd * r.n();
      msd[s] += p[0] * p[0] + p[1] * p[1] + p[2] * p[2];
      if (w < keep) path.push(p.slice(0, d));
    }
    if (w < keep) paths.push(path);
    finals.push(p.slice(0, d));
  }
  for (let s = 0; s <= o.steps; s++) msd[s] /= o.walkers;
  return { t: Array.from({ length: o.steps + 1 }, (_, i) => i * o.dt), msd: Array.from(msd), paths, finals, Dtheory: (o.a * o.a) / (2 * d * o.dt) };
}

/** Least-squares fit of MSD = 2 d D t (+ c when `offset`). Returns D, its standard error, c and R². */
export function fitD(t: number[], msd: number[], dim: number, offset = false) {
  const n = t.length;
  if (n < (offset ? 3 : 2)) return null;
  let slope: number, c = 0, se: number;
  if (!offset) {
    let stt = 0, sty = 0; for (let i = 0; i < n; i++) { stt += t[i] * t[i]; sty += t[i] * msd[i]; }
    slope = sty / stt;
    let rss = 0; for (let i = 0; i < n; i++) rss += (msd[i] - slope * t[i]) ** 2;
    se = Math.sqrt(rss / (n - 1) / stt);
  } else {
    const mt = t.reduce((a, b) => a + b, 0) / n, my = msd.reduce((a, b) => a + b, 0) / n;
    let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (t[i] - mt) ** 2; sxy += (t[i] - mt) * (msd[i] - my); }
    slope = sxy / sxx; c = my - slope * mt;
    let rss = 0; for (let i = 0; i < n; i++) rss += (msd[i] - c - slope * t[i]) ** 2;
    se = Math.sqrt(rss / (n - 2) / sxx);
  }
  const my = msd.reduce((a, b) => a + b, 0) / n;
  let tss = 0, rss = 0; for (let i = 0; i < n; i++) { tss += (msd[i] - my) ** 2; rss += (msd[i] - c - slope * t[i]) ** 2; }
  return { D: slope / (2 * dim), Dse: se / (2 * dim), c, r2: tss > 0 ? 1 - rss / tss : 1 };
}

/** Anomalous exponent α from a straight-line fit of log MSD against log t (MSD ∝ t^α; 1 for normal diffusion). */
export function alphaFit(t: number[], msd: number[]) {
  const xs: number[] = [], ys: number[] = [];
  t.forEach((v, i) => { if (v > 0 && msd[i] > 0) { xs.push(Math.log(v)); ys.push(Math.log(msd[i])); } });
  const n = xs.length; if (n < 2) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  const alpha = sxy / sxx;
  let rss = 0; for (let i = 0; i < n; i++) rss += (ys[i] - my - alpha * (xs[i] - mx)) ** 2;
  return { alpha, se: n > 2 ? Math.sqrt(rss / (n - 2) / sxx) : NaN, K: Math.exp(my - alpha * mx) };
}

export type Track = { id: string; t: number[]; r: number[][] };
/**
 * Reads tracks from rows of cells: "track, t, x, y[, z]" (or "t, x, y[, z]" for one track when `withId` is false).
 * Rows of one track must be together and in time order. A first row that is not numbers is skipped as a header.
 */
export function parseTracks(rows: string[][], dim: 1 | 2 | 3, withId: boolean): { tracks: Track[]; error?: string } {
  const need = dim + 1 + (withId ? 1 : 0), map = new Map<string, Track>(), order: Track[] = [];
  for (const [i, row] of rows.entries()) {
    const cells = row.map((c) => Number(c.replace('−', '-')));
    const off = withId ? 1 : 0;
    if (row.length < need || cells.slice(off, need).some((v) => !Number.isFinite(v))) {
      if (i === 0) continue;
      return { tracks: [], error: `Row ${i + 1}: expected ${withId ? 'a track name, ' : ''}a time and ${dim} coordinate${dim > 1 ? 's' : ''}.` };
    }
    const id = withId ? row[0] : '1';
    let tr = map.get(id);
    if (!tr) { tr = { id, t: [], r: [] }; map.set(id, tr); order.push(tr); }
    const t = cells[off];
    if (tr.t.length && t <= tr.t[tr.t.length - 1]) return { tracks: [], error: `Row ${i + 1}: times in track ${id} must increase.` };
    tr.t.push(t); tr.r.push(cells.slice(off + 1, off + 1 + dim));
  }
  if (!order.length) return { tracks: [], error: 'Paste at least one track.' };
  return { tracks: order };
}

/**
 * Time-and-ensemble averaged MSD of tracks sampled every dt (frames are matched by time, so missing frames are
 * allowed). lagMax in frames. Returns the lag times, MSD, the number of displacement pairs at each lag and dt.
 */
export function trackMSD(tracks: Track[], lagMax: number) {
  const diffs: number[] = [];
  for (const tr of tracks) for (let i = 1; i < tr.t.length; i++) diffs.push(tr.t[i] - tr.t[i - 1]);
  if (!diffs.length) return null;
  diffs.sort((a, b) => a - b);
  const dt = diffs[0], tol = dt * 1e-3;
  const sum = new Float64Array(lagMax + 1), cnt = new Float64Array(lagMax + 1);
  let irregular = false;
  for (const tr of tracks) {
    const f = tr.t.map((t) => (t - tr.t[0]) / dt);
    if (f.some((v) => Math.abs(v - Math.round(v)) * dt > tol)) irregular = true;
    const idx = new Map<number, number>(); f.forEach((v, i) => idx.set(Math.round(v), i));
    for (const [fi, i] of idx) for (let k = 1; k <= lagMax; k++) {
      const j = idx.get(fi + k); if (j === undefined) continue;
      let s = 0; for (let c = 0; c < tr.r[i].length; c++) s += (tr.r[j][c] - tr.r[i][c]) ** 2;
      sum[k] += s; cnt[k]++;
    }
  }
  const lag: number[] = [], msd: number[] = [], n: number[] = [];
  for (let k = 1; k <= lagMax; k++) if (cnt[k]) { lag.push(k * dt); msd.push(sum[k] / cnt[k]); n.push(cnt[k]); }
  return { dt, lag, msd, n, irregular };
}

/** A made-up set of 2D tracks (Brownian motion with diffusion coefficient D, frame time dt, localisation noise sigma). */
export function exampleTracks(nTracks = 10, frames = 100, D = 0.5, dt = 0.1, sigma = 0.03, seed = 11) {
  const r = rng(seed), sd = Math.sqrt(2 * D * dt), lines = ['track, t (s), x (µm), y (µm)'];
  for (let k = 0; k < nTracks; k++) {
    let x = 5 * r.u(), y = 5 * r.u();
    for (let f = 0; f < frames; f++) {
      if (f) { x += sd * r.n(); y += sd * r.n(); }
      lines.push(`T${k + 1}, ${(f * dt).toFixed(2)}, ${(x + sigma * r.n()).toFixed(4)}, ${(y + sigma * r.n()).toFixed(4)}`);
    }
  }
  return lines.join('\n');
}
