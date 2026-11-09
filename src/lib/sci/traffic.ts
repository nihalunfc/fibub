// Macroscopic traffic flow: q = k·v with the Greenshields (linear), Greenberg (logarithmic) and Underwood
// (exponential) speed-density models, fitted by the usual textbook least-squares regressions (v on k, v on ln k and
// ln v on k), capacity, the two densities for a given flow, and level of service from density thresholds that the
// user supplies. Any consistent units (km/h with veh/km, or mi/h with veh/mi). No DOM.

export type TModel = 'greenshields' | 'greenberg' | 'underwood';
export type TFit = {
  model: TModel; name: string; formula: string;
  /** Free-flow speed (Infinity for Greenberg), jam density (Infinity for Underwood). */
  vf: number; kj: number;
  /** Optimum density, speed at capacity and capacity (maximum flow). */
  km: number; vm: number; qm: number;
  v: (k: number) => number; q: (k: number) => number;
  r2t: number; r2v: number; rmse: number; n: number;
};

function ols(x: number[], y: number[]) {
  const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0; for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (y[i] - my); syy += (y[i] - my) ** 2; }
  const b = sxy / sxx; return { a: my - b * mx, b, r2: syy > 0 ? (sxy * sxy) / (sxx * syy) : NaN };
}

export function makeModel(model: TModel, p1: number, p2: number): Omit<TFit, 'r2t' | 'r2v' | 'rmse' | 'n'> {
  if (model === 'greenshields') {
    const vf = p1, kj = p2, v = (k: number) => Math.max(0, vf * (1 - k / kj));
    return { model, name: 'Greenshields', formula: 'v = v_f·(1 − k/k_j)', vf, kj, km: kj / 2, vm: vf / 2, qm: vf * kj / 4, v, q: (k) => k * v(k) };
  }
  if (model === 'greenberg') {
    const vm = p1, kj = p2, v = (k: number) => (k <= 0 ? Infinity : Math.max(0, vm * Math.log(kj / k)));
    return { model, name: 'Greenberg', formula: 'v = v_m·ln(k_j/k)', vf: Infinity, kj, km: kj / Math.E, vm, qm: vm * kj / Math.E, v, q: (k) => (k <= 0 ? 0 : k * v(k)) };
  }
  const vf = p1, km = p2, v = (k: number) => vf * Math.exp(-k / km);
  return { model, name: 'Underwood', formula: 'v = v_f·e^(−k/k_m)', vf, kj: Infinity, km, vm: vf / Math.E, qm: vf * km / Math.E, v, q: (k) => k * v(k) };
}

/** Fit a model to speed-density pairs with its textbook linearisation. r2t = R² of that regression; r2v and rmse on speed itself. */
export function fitModel(model: TModel, k: number[], v: number[]): TFit {
  let m: Omit<TFit, 'r2t' | 'r2v' | 'rmse' | 'n'>, r2t: number;
  if (model === 'greenshields') {
    const r = ols(k, v); if (!(r.b < 0 && r.a > 0)) throw new Error('Speed does not fall with density, so Greenshields cannot be fitted.');
    m = makeModel(model, r.a, -r.a / r.b); r2t = r.r2;
  } else if (model === 'greenberg') {
    const idx = k.map((_, i) => i).filter((i) => k[i] > 0);
    const r = ols(idx.map((i) => Math.log(k[i])), idx.map((i) => v[i])); if (!(r.b < 0)) throw new Error('Speed does not fall with density, so Greenberg cannot be fitted.');
    m = makeModel(model, -r.b, Math.exp(r.a / -r.b)); r2t = r.r2;
  } else {
    const idx = k.map((_, i) => i).filter((i) => v[i] > 0);
    const r = ols(idx.map((i) => k[i]), idx.map((i) => Math.log(v[i]))); if (!(r.b < 0)) throw new Error('Speed does not fall with density, so Underwood cannot be fitted.');
    m = makeModel(model, Math.exp(r.a), -1 / r.b); r2t = r.r2;
  }
  const n = k.length, mv = v.reduce((s, x) => s + x, 0) / n;
  const sse = k.reduce((s, kk, i) => s + (v[i] - m.v(kk)) ** 2, 0), sst = v.reduce((s, x) => s + (x - mv) ** 2, 0);
  return { ...m, r2t, r2v: sst > 0 ? 1 - sse / sst : NaN, rmse: Math.sqrt(sse / n), n };
}

/** The two densities (uncongested, congested) that carry flow q; empty if q exceeds capacity. */
export function densitiesForFlow(m: Pick<TFit, 'q' | 'km' | 'qm' | 'kj' | 'model'>, q: number): number[] {
  if (q > m.qm * (1 + 1e-12) || q < 0) return [];
  if (m.model === 'greenshields') { const s = Math.sqrt(Math.max(0, 1 - q / m.qm)); return [m.kj / 2 * (1 - s), m.kj / 2 * (1 + s)]; }
  const bis = (lo: number, hi: number, rising: boolean) => {
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2, up = m.q(mid) < q; if (up === rising) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  let hi = Number.isFinite(m.kj) ? m.kj : m.km;
  if (!Number.isFinite(m.kj)) while (m.q(hi) > q && hi < m.km * 1e6) hi *= 2;
  return [q === 0 ? 0 : bis(0, m.km, true), bis(m.km, hi, false)];
}

/** Level of service letter from density and five ascending upper limits for A to E (above the last = F). */
export function los(k: number, limits: number[]) {
  const L = 'ABCDE';
  for (let i = 0; i < limits.length; i++) if (k <= limits[i]) return L[i];
  return 'F';
}

