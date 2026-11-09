// Single-season site occupancy (MacKenzie et al. 2002): occupancy ψ and detection p from repeated
// detection/non-detection surveys, fitted by maximum likelihood on the logit scale, with missing surveys allowed.
import { normInv } from './stats.ts';
import { nelderMead, hessian, inverse } from './ecoopt.ts';

export type History = (0 | 1 | null)[];
export type OccModel = 'dot' | 'time';
const expit = (x: number) => 1 / (1 + Math.exp(-x));
const logit = (p: number) => Math.log(p / (1 - p));

export type Est = { est: number; se: number; lo: number; hi: number };
export type OccFit = {
  model: OccModel; sites: number; surveys: number; detected: number; naive: number;
  psi: Est; p: Est[]; logLik: number; aic: number; k: number;
  /** Chance a site is detected at least once if occupied, with every survey done. */
  pStar: number;
  /** For each site never detected: chance it is occupied anyway. */
  condPsi: (number | null)[];
  /** Detected sites plus the expected occupied among the rest. */
  expectedOccupied: number;
  boundary: boolean; converged: boolean; conf: number;
};

function negLogLik(H: History[], K: number, model: OccModel) {
  return (th: number[]) => {
    const psi = expit(th[0]), ps = Array.from({ length: K }, (_, j) => expit(model === 'dot' ? th[1] : th[1 + j]));
    let ll = 0;
    for (const h of H) {
      let det = false, prodDet = 1, prodMiss = 1;
      for (let j = 0; j < K; j++) { const y = h[j]; if (y === null) continue; if (y === 1) { det = true; prodDet *= ps[j]; } else { prodDet *= 1 - ps[j]; prodMiss *= 1 - ps[j]; } }
      const L = det ? psi * prodDet : psi * prodMiss + (1 - psi);
      if (!(L > 0)) return Infinity;
      ll += Math.log(L);
    }
    return -ll;
  };
}

export function fitOccupancy(H: History[], model: OccModel = 'dot', conf = 0.95): OccFit {
  const sites = H.filter((h) => h.some((y) => y !== null));
  if (sites.length < 2) throw new Error('Give at least two sites with at least one survey each.');
  const K = Math.max(...sites.map((h) => h.length));
  if (K < 2) throw new Error('Each site needs at least two surveys to separate occupancy from detection.');
  const Hn = sites.map((h) => Array.from({ length: K }, (_, j) => (h[j] === undefined ? null : h[j])));
  const detected = Hn.filter((h) => h.includes(1)).length;
  if (!detected) throw new Error('The species was never detected, so occupancy cannot be estimated.');
  if (model === 'time') for (let j = 0; j < K; j++) if (!Hn.some((h) => h[j] !== null)) throw new Error(`Survey ${j + 1} has no data at any site.`);
  const f = negLogLik(Hn, K, model);
  // Start from the naive occupancy and the detection rate at detected sites.
  let y1 = 0, yn = 0; for (const h of Hn) if (h.includes(1)) for (const y of h) if (y !== null) { yn++; y1 += y; }
  const p0 = Math.min(0.95, Math.max(0.05, y1 / yn)), s0 = Math.min(0.95, Math.max(0.05, detected / Hn.length / (1 - (1 - p0) ** K)));
  const start = [logit(s0), ...(model === 'dot' ? [logit(p0)] : new Array(K).fill(logit(p0)))];
  const r = nelderMead(f, start, { step: 0.5, maxIter: 20000 });
  const th = r.x, k = th.length;
  const C = inverse(hessian(f, th, 1e-4));
  const z = normInv(1 - (1 - conf) / 2);
  const est = (i: number): Est => {
    const v = C && C[i][i] > 0 ? C[i][i] : NaN, e = expit(th[i]), s = Math.sqrt(v);
    return { est: e, se: s * e * (1 - e), lo: expit(th[i] - z * s), hi: expit(th[i] + z * s) };
  };
  const psi = est(0), p = model === 'dot' ? [est(1)] : Array.from({ length: K }, (_, j) => est(1 + j));
  const pj = (j: number) => (model === 'dot' ? p[0].est : p[j].est);
  let pq = 1; for (let j = 0; j < K; j++) pq *= 1 - pj(j);
  const condPsi = Hn.map((h) => {
    if (h.includes(1)) return null;
    let q = 1; h.forEach((y, j) => { if (y === 0) q *= 1 - pj(j); });
    return (psi.est * q) / (psi.est * q + 1 - psi.est);
  });
  return {
    model, sites: Hn.length, surveys: K, detected, naive: detected / Hn.length, psi, p, logLik: -r.f, aic: 2 * r.f + 2 * k, k,
    pStar: 1 - pq, condPsi, expectedOccupied: detected + condPsi.reduce<number>((a, c) => a + (c ?? 0), 0),
    boundary: th.some((t) => Math.abs(t) > 12) || !Number.isFinite(psi.se), converged: r.converged, conf,
  };
}
