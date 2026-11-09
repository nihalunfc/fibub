// Hodgkin-Huxley (1952) squid giant axon model, space-clamped, in the modern convention (V in mV, rest near
// −65 mV, depolarisation positive). Rate constants are the 1952 ones shifted to that convention; the
// temperature factor φ = 3^((T − 6.3)/10). Integrated with fixed-step fourth-order Runge-Kutta.

export type Params = { gNa: number; gK: number; gL: number; ENa: number; EK: number; EL: number; Cm: number; tempC: number };
export const DEFAULTS: Params = { gNa: 120, gK: 36, gL: 0.3, ENa: 50, EK: -77, EL: -54.387, Cm: 1, tempC: 6.3 };

/** x / (1 − e^(−x/k)) written to stay finite at x = 0 (limit k). */
const vtrap = (x: number, k: number) => (Math.abs(x / k) < 1e-6 ? k * (1 + x / k / 2) : x / (1 - Math.exp(-x / k)));
export function rates(V: number) {
  return {
    am: 0.1 * vtrap(V + 40, 10), bm: 4 * Math.exp(-(V + 65) / 18),
    ah: 0.07 * Math.exp(-(V + 65) / 20), bh: 1 / (1 + Math.exp(-(V + 35) / 10)),
    an: 0.01 * vtrap(V + 55, 10), bn: 0.125 * Math.exp(-(V + 65) / 80),
  };
}
export const phi = (tempC: number) => 3 ** ((tempC - 6.3) / 10);

/** Steady-state gates at a voltage. */
export function steady(V: number) { const r = rates(V); return { m: r.am / (r.am + r.bm), h: r.ah / (r.ah + r.bh), n: r.an / (r.an + r.bn) }; }

export type State = [number, number, number, number]; // V, m, h, n
export function deriv(s: State, I: number, p: Params, f: number): State {
  const [V, m, h, n] = s, r = rates(V);
  const iNa = p.gNa * m ** 3 * h * (V - p.ENa), iK = p.gK * n ** 4 * (V - p.EK), iL = p.gL * (V - p.EL);
  return [(I - iNa - iK - iL) / p.Cm, f * (r.am * (1 - m) - r.bm * m), f * (r.ah * (1 - h) - r.bh * h), f * (r.an * (1 - n) - r.bn * n)];
}

export type Stim =
  | { kind: 'step'; amp: number; start: number; dur: number }
  | { kind: 'train'; amp: number; start: number; width: number; freq: number; count: number };
/** Injected current (µA/cm²) at time t (ms). Intervals are [on, off). */
export function current(st: Stim, t: number): number {
  if (st.kind === 'step') return t >= st.start && t < st.start + st.dur ? st.amp : 0;
  if (t < st.start) return 0;
  const period = 1000 / st.freq, k = Math.floor((t - st.start) / period);
  return k < st.count && t - st.start - k * period < st.width ? st.amp : 0;
}

export type Run = { t: number[]; V: number[]; m: number[]; h: number[]; n: number[]; I: number[]; spikes: number[]; peak: number };
/**
 * Simulate from rest (steady state at V0) to tEnd ms with step dt; keep every `keep`-th point.
 * Spikes are upward crossings of `thr` mV, timed by linear interpolation.
 */
export function simulate(st: Stim, tEnd: number, p: Params = DEFAULTS, dt = 0.01, keep = 1, V0 = -65, thr = 0): Run {
  const g = steady(V0), f = phi(p.tempC);
  let s: State = [V0, g.m, g.h, g.n];
  const out: Run = { t: [], V: [], m: [], h: [], n: [], I: [], spikes: [], peak: V0 };
  const steps = Math.round(tEnd / dt);
  const push = (t: number) => { out.t.push(t); out.V.push(s[0]); out.m.push(s[1]); out.h.push(s[2]); out.n.push(s[3]); out.I.push(current(st, t)); };
  push(0);
  for (let k = 0; k < steps; k++) {
    const t = k * dt, I = current(st, t + dt / 2); // current held over the step (steps align with on/off times)
    const k1 = deriv(s, I, p, f);
    const k2 = deriv(s.map((v, i) => v + (dt / 2) * k1[i]) as State, I, p, f);
    const k3 = deriv(s.map((v, i) => v + (dt / 2) * k2[i]) as State, I, p, f);
    const k4 = deriv(s.map((v, i) => v + dt * k3[i]) as State, I, p, f);
    const Vold = s[0];
    s = s.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])) as State;
    if (Vold < thr && s[0] >= thr) out.spikes.push(t + (dt * (thr - Vold)) / (s[0] - Vold));
    if (s[0] > out.peak) out.peak = s[0];
    if ((k + 1) % keep === 0) push((k + 1) * dt);
  }
  return out;
}

/** Smallest amplitude (µA/cm²) of a single pulse of `width` ms that fires a spike, by bisection (NaN above maxAmp). */
export function threshold(width: number, p: Params = DEFAULTS, maxAmp = 500, dt = 0.01): number {
  const fires = (a: number) => simulate({ kind: 'step', amp: a, start: 1, dur: width }, width + 25, p, dt, 1e9).spikes.length > 0;
  if (!fires(maxAmp)) return NaN;
  let lo = 0, hi = maxAmp;
  for (let k = 0; k < 30; k++) { const mid = (lo + hi) / 2; if (fires(mid)) hi = mid; else lo = mid; }
  return hi;
}

/** Firing rate (Hz) during a long step: spikes between `settle` ms and the end of a `dur` ms step. */
export function rate(amp: number, p: Params = DEFAULTS, dur = 500, settle = 100, dt = 0.01): number {
  const r = simulate({ kind: 'step', amp, start: 0, dur }, dur, p, dt, 1e9);
  return (r.spikes.filter((s) => s >= settle).length / (dur - settle)) * 1000;
}
