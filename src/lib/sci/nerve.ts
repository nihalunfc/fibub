// Nerve impulse (school biology): how fast an impulse travels along unmyelinated and myelinated axons, where it
// is along the axon at a moment, the ion currents of a spike, and reaction-time sums. Plain maths, no DOM.
// The spike itself comes from the Hodgkin-Huxley model in hhsim.ts. Speeds use round teaching rules of thumb.

import { DEFAULTS, type Run } from './hhsim.ts';

/** Conduction speed (m/s) for an axon of diameter d (µm). Unmyelinated: about √d (1 µm -> 1 m/s);
 *  myelinated: about 6 × d (Hursh's rule of thumb, 10 µm -> 60 m/s). */
export const speed = (d: number, myelin: boolean) => (myelin ? 6 * d : Math.sqrt(d));
/** Time (ms) for an impulse to cover a length (m) at a speed (m/s). */
export const travelMs = (lengthM: number, v: number) => (1000 * lengthM) / v;

/** Distance (m) reached t ms after the start: smooth for unmyelinated, node-to-node jumps for myelinated. */
export function position(t: number, v: number, myelin: boolean, nodeGapM = 0.001): number {
  const x = (v * Math.max(0, t)) / 1000;
  return myelin ? Math.floor(x / nodeGapM + 1e-9) * nodeGapM : x;
}

/** Sodium and potassium currents (µA/cm², inward negative) and conductances (mS/cm²) along a Hodgkin-Huxley run. */
export function ionCurrents(r: Run, p = DEFAULTS) {
  const iNa = r.V.map((V, i) => p.gNa * r.m[i] ** 3 * r.h[i] * (V - p.ENa));
  const iK = r.V.map((V, i) => p.gK * r.n[i] ** 4 * (V - p.EK));
  const gNa = r.m.map((m, i) => p.gNa * m ** 3 * r.h[i]), gK = r.n.map((n) => p.gK * n ** 4);
  return { iNa, iK, gNa, gK };
}

/** Mean and median of reaction times (ms). */
export function stats(ms: number[]) {
  if (!ms.length) return { n: 0, mean: NaN, median: NaN, best: NaN };
  const s = [...ms].sort((a, b) => a - b), n = s.length;
  return { n, mean: s.reduce((a, b) => a + b, 0) / n, median: n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2, best: s[0] };
}
