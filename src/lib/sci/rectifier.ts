// Rectifiers (school level, Class 12 semiconductors): half-wave, centre-tap full-wave and bridge rectifiers with
// diode drops, an optional smoothing capacitor across the load, and the ripple. Ideal diodes with a fixed forward
// drop; the capacitor charges instantly and discharges through the load. Pure functions, no DOM.

export type Mode = 'half' | 'full' | 'bridge';
export type Setup = { mode: Mode; vp: number; f?: number; vd?: number; C?: number; RL: number };

/** Rectified (unsmoothed) output at time t (s). */
export function rectified(s: Setup, t: number): number {
  const f = s.f ?? 50, vd = s.vd ?? 0.7, x = s.vp * Math.sin(2 * Math.PI * f * t);
  if (s.mode === 'half') return Math.max(0, x - vd);
  return Math.max(0, Math.abs(x) - (s.mode === 'bridge' ? 2 * vd : vd));
}

/** Peak output: Vp minus one drop (half, centre-tap) or two drops (bridge). */
export const peak = (s: Setup) => Math.max(0, s.vp - (s.mode === 'bridge' ? 2 : 1) * (s.vd ?? 0.7));
/** Ripple frequency: f for half-wave, 2f for full-wave. */
export const rippleFreq = (s: Setup) => (s.mode === 'half' ? 1 : 2) * (s.f ?? 50);

/** Simulate `cycles` input cycles with `n` steps per cycle; returns times, input, output. */
export function simulate(s: Setup, cycles = 5, n = 2000) {
  if (!(s.vp > 0) || !(s.RL > 0)) throw new Error('The peak voltage and the load must be above zero.');
  const f = s.f ?? 50, dt = 1 / (f * n), C = s.C ?? 0, tau = s.RL * C;
  const t: number[] = [], vin: number[] = [], vout: number[] = [];
  let vc = 0;
  for (let k = 0; k <= cycles * n; k++) {
    const tt = k * dt, vr = rectified(s, tt);
    vc = C > 0 ? Math.max(vr, vc * Math.exp(-dt / tau)) : vr;
    t.push(tt); vin.push(s.vp * Math.sin(2 * Math.PI * f * tt)); vout.push(vc);
  }
  return { t, vin, vout };
}

/** Steady-state numbers from the last full input cycle: DC (average), max, min, ripple p-p, ripple factor. */
export function measure(s: Setup, cycles = 6, n = 4000) {
  const { vout } = simulate(s, cycles, n), last = vout.slice((cycles - 1) * n, cycles * n);
  const mean = last.reduce((a, b) => a + b, 0) / last.length;
  const rmsAc = Math.sqrt(last.reduce((a, b) => a + (b - mean) ** 2, 0) / last.length);
  const max = Math.max(...last), min = Math.min(...last);
  return { dc: mean, max, min, ripple: max - min, factor: mean > 0 ? rmsAc / mean : NaN };
}

/** Textbook estimates: no capacitor Vdc = Vm/π or 2Vm/π; with C, Vr ≈ Vm/(f_r R C) and Vdc ≈ Vm − Vr/2. */
export function estimate(s: Setup) {
  const vm = peak(s), C = s.C ?? 0;
  if (!(C > 0)) return { dc: (s.mode === 'half' ? 1 : 2) * vm / Math.PI, ripple: vm };
  const vr = vm / (rippleFreq(s) * s.RL * C);
  return { dc: vm - vr / 2, ripple: vr };
}
