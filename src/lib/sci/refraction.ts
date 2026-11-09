// Seismic refraction: split first-arrival picks into layers, fit a straight line per layer, then layer depths by the
// intercept-time and crossover-distance methods (flat layers), the dipping-layer solution from forward and reverse
// shots, and forward travel-time curves for a flat-layered model. Distances in m, times in s, speeds in m/s.
// Plain maths; no DOM.

export type Line = { slope: number; ti: number; v: number; n: number; x0: number; x1: number; rms: number };

/** Least-squares line t = ti + x·slope; through the origin if `origin`. */
export function fitSeg(x: number[], t: number[], origin = false): Line {
  const n = x.length;
  let slope: number, ti: number;
  if (origin) { slope = x.reduce((s, v, i) => s + v * t[i], 0) / x.reduce((s, v) => s + v * v, 0); ti = 0; }
  else {
    const mx = x.reduce((s, v) => s + v, 0) / n, mt = t.reduce((s, v) => s + v, 0) / n;
    let sxx = 0, sxt = 0; x.forEach((v, i) => { sxx += (v - mx) ** 2; sxt += (v - mx) * (t[i] - mt); });
    slope = sxt / sxx; ti = mt - slope * mx;
  }
  const rms = Math.sqrt(x.reduce((s, v, i) => s + (t[i] - ti - slope * v) ** 2, 0) / n);
  return { slope, ti, v: 1 / slope, n, x0: Math.min(...x), x1: Math.max(...x), rms };
}

/**
 * Split picks (sorted by offset) into `layers` straight segments. With `breaks` (offsets between segments) use them;
 * otherwise try every split with at least 2 picks per segment and keep the one with the least squared error whose
 * speeds increase with depth. Returns the index where each segment starts.
 */
export function segment(x: number[], t: number[], layers: number, opts: { breaks?: number[]; origin?: boolean } = {}): { lines: Line[]; starts: number[] } {
  const n = x.length;
  if (n < 2 * layers) throw new Error(`Need at least ${2 * layers} picks for ${layers} layers`);
  const fitAll = (starts: number[]) => starts.map((s, k) => { const e = k + 1 < starts.length ? starts[k + 1] : n; return fitSeg(x.slice(s, e), t.slice(s, e), opts.origin && k === 0); });
  const sse = (L: Line[]) => L.reduce((s, l) => s + l.rms * l.rms * l.n, 0);
  const ok = (L: Line[]) => L.every((l) => l.slope > 0 && Number.isFinite(l.slope)) && L.every((l, k) => k === 0 || l.slope < L[k - 1].slope);
  if (opts.breaks && opts.breaks.length) {
    const b = opts.breaks.slice().sort((p, q) => p - q);
    if (b.length !== layers - 1) throw new Error(`Give ${layers - 1} break offset${layers > 2 ? 's' : ''} for ${layers} layers`);
    const starts = [0, ...b.map((v) => x.findIndex((xi) => xi > v))];
    if (starts.some((s, k) => s < 0 || (k && s - starts[k - 1] < 2)) || n - starts[starts.length - 1] < 2) throw new Error('Each layer needs at least 2 picks between the breaks');
    const L = fitAll(starts);
    if (!ok(L)) throw new Error('With these breaks the speeds do not increase with depth');
    return { lines: L, starts };
  }
  let best: { lines: Line[]; starts: number[] } | null = null, bestE = Infinity;
  const rec = (starts: number[]) => {
    if (starts.length === layers) {
      if (n - starts[starts.length - 1] < 2) return;
      const L = fitAll(starts); if (!ok(L)) return;
      const e = sse(L); if (e < bestE) { bestE = e; best = { lines: L, starts: starts.slice() }; }
      return;
    }
    const from = starts[starts.length - 1] + 2;
    for (let s = from; s <= n - 2 * (layers - starts.length); s++) rec([...starts, s]);
  };
  rec([0]);
  if (!best) throw new Error(`Could not split the picks into ${layers} layers with speeds increasing with depth`);
  return best;
}

/** Crossover offset between two lines. */
export const crossover = (a: Line, b: Line) => (b.ti - a.ti) / (a.slope - b.slope);

/** Flat-layer thicknesses from intercept times: ti_n = Σ_{j<n} 2 h_j cos θ_jn / V_j with sin θ_jn = V_j / V_n. */
export function interceptDepths(v: number[], ti: number[]): number[] {
  const h: number[] = [];
  for (let n = 1; n < v.length; n++) {
    let rest = ti[n];
    for (let j = 0; j < n - 1; j++) rest -= (2 * h[j] * Math.sqrt(1 - (v[j] / v[n]) ** 2)) / v[j];
    const c = Math.sqrt(1 - (v[n - 1] / v[n]) ** 2);
    h.push((rest * v[n - 1]) / (2 * c));
  }
  return h;
}

/**
 * Flat-layer thicknesses from crossover offsets and speeds only. The direct wave is taken through the origin, so
 * ti_2 = xc_1 (1/V1 − 1/V2) and ti_{k+1} = ti_k + xc_k (1/V_k − 1/V_{k+1}); then the intercept formula. For two layers
 * this is h1 = (xc/2)√((V2 − V1)/(V2 + V1)).
 */
export function crossoverDepths(v: number[], xc: number[]): number[] {
  const ti = [0];
  for (let k = 1; k < v.length; k++) ti.push(ti[k - 1] + xc[k - 1] * (1 / v[k - 1] - 1 / v[k]));
  return interceptDepths(v, ti);
}

/**
 * Dipping refractor from shots at both ends of a line (two-layer case): V1 and the apparent speeds and intercepts
 * of the refracted arrivals from the forward (at x = 0) and reverse (at x = L) shots. Returns the true refractor
 * speed, the dip (positive when the refractor deepens toward the reverse shot), the critical angle and the
 * perpendicular and vertical depths under each shot.
 */
export function dippingLayer(v1: number, fwd: { v: number; ti: number }, rev: { v: number; ti: number }) {
  if (!(fwd.v > v1 && rev.v > v1)) throw new Error('Both refracted speeds must be faster than the top layer');
  const a = Math.asin(v1 / fwd.v), b = Math.asin(v1 / rev.v);
  const thc = (a + b) / 2, dip = (a - b) / 2; // forward shooting down-dip (slower apparent speed) gives dip > 0
  const v2 = v1 / Math.sin(thc);
  const hf = (v1 * fwd.ti) / (2 * Math.cos(thc)), hr = (v1 * rev.ti) / (2 * Math.cos(thc));
  return { v2, dip: (dip * 180) / Math.PI, crit: (thc * 180) / Math.PI, hPerpF: hf, hPerpR: hr, hVertF: hf / Math.cos(dip), hVertR: hr / Math.cos(dip) };
}

/**
 * First-arrival travel times (s) for flat layers with speeds v (top down) and thicknesses h (one fewer), at offsets x.
 * Each head wave exists beyond its critical distance; layers slower than any layer above make no head wave.
 */
export function forwardTimes(v: number[], h: number[], x: number[]) {
  const heads = v.map((vn, n) => {
    if (n === 0) return { ti: 0, xcrit: 0, ok: true };
    if (!v.slice(0, n).every((vj) => vj < vn)) return { ti: NaN, xcrit: Infinity, ok: false };
    let ti = 0, xcrit = 0;
    for (let j = 0; j < n; j++) { const s = v[j] / vn, c = Math.sqrt(1 - s * s); ti += (2 * h[j] * c) / v[j]; xcrit += (2 * h[j] * s) / c; }
    return { ti, xcrit, ok: true };
  });
  const branch = heads.map((hd, n) => x.map((xi) => (hd.ok && xi >= hd.xcrit ? hd.ti + xi / v[n] : NaN)));
  const first = x.map((_, i) => Math.min(...branch.map((b) => (Number.isFinite(b[i]) ? b[i] : Infinity))));
  const layer = x.map((_, i) => branch.findIndex((b) => b[i] === first[i]));
  return { first, layer, branch, heads };
}

/** Parse two columns of offset (m) and time (ms) into sorted arrays in m and s. */
export function sortPicks(x: number[], tms: number[]) {
  const ix = x.map((_, i) => i).filter((i) => Number.isFinite(x[i]) && Number.isFinite(tms[i])).sort((a, b) => Math.abs(x[a]) - Math.abs(x[b]));
  return { x: ix.map((i) => Math.abs(x[i])), t: ix.map((i) => tms[i] / 1000) };
}
